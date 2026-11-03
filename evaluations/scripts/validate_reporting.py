#!/usr/bin/env python3
"""Validate reporting structure and relationships, never accessibility or alignment.

Use the dependencies in accessibility-si/scripts/requirements-validation.txt.
Freeze verification requires an explicit local candidate file; URLs are never fetched.
"""
import argparse
import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = ROOT / 'evaluations/results-schema.json'


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def require(condition, message):
    if not condition:
        raise ValueError(message)


def indexed(rows, label):
    result = {row['id']: row for row in rows}
    require(len(result) == len(rows), 'Duplicate ' + label + ' ID')
    return result


def validate_profile(process, targets=None):
    components = indexed(process['components'], 'component')
    rules = indexed(process['rules'], 'rule')
    indexed(process['mappings'], 'mapping')
    for rule in rules.values():
        require(rule['component_id'] in components, 'Unknown rule component')
    for component in components.values():
        if targets is not None:
            require(set(component['procedures_addressed']) <= targets, 'Unknown component procedure')
    for mapping in process['mappings']:
        require(set(mapping['rule_ids']) <= rules.keys(), 'Unknown mapped rule')
        if targets is not None:
            require(mapping['target_id'] in targets, 'Unknown mapping target')
        review = mapping['review']
        require(review['status'] != 'completed' or bool(review['reviewers']), 'Mapping review needs a reviewer')
    return components, rules


def validate(data, candidate_path=None):
    schema = load(SCHEMA)
    Draft202012Validator.check_schema(schema)
    registry = Registry().with_resource(schema['$id'], Resource.from_contents(schema))
    is_ai_profile = data.get('profile_type') == 'ai-si'
    is_profile = 'purpose' not in data
    selected_schema = load(ROOT / ('evaluations/ai-si-profile-schema.json' if is_ai_profile else 'evaluations/process-profile-schema.json')) if is_profile else schema
    Draft202012Validator(selected_schema, registry=registry, format_checker=FormatChecker()).validate(data)
    if is_ai_profile:
        return
    catalogs = {domain: load(ROOT / ('accessibility-si/mappings/' + domain + '/baseline.yaml'))
                for domain in ('web', 'documents')}
    procedures = {p['key']: p for catalog in catalogs.values() for p in catalog['procedures']}
    criteria = load(ROOT / 'accessibility-si/mappings/wcag-a-aa.yaml')['criteria']
    all_targets = set(procedures)
    for target_domain in catalogs:
        all_targets |= {target_domain + ':supplemental:' + c['id'] for c in criteria if c['introduced_in'] != '2.0'}
        all_targets |= {target_domain + ':conformance:CR' + str(n) for n in range(1, 6)}
        all_targets |= {target_domain + ':scope:' + key for key in ('content-scope', 'support-documentation')}
    all_targets.add('documents:scope:nonweb-substitutions')
    if is_profile:
        validate_profile(data['process'], all_targets)
        return
    domain = data['scope']['domain']
    catalog = catalogs[domain]
    active = {p['key'] for p in catalog['procedures'] if p['disposition'] == 'active'}
    supplemental = {domain + ':supplemental:' + c['id'] for c in criteria if c['introduced_in'] != '2.0'}
    other = {domain + ':conformance:CR' + str(n) for n in range(1, 6)}
    other |= {domain + ':scope:' + key for key in ('content-scope', 'support-documentation')}
    if domain == 'documents':
        other.add('documents:scope:nonweb-substitutions')
    targets = active | supplemental | other
    components, rules = validate_profile(data['process'], all_targets)
    baselines = {b['domain']: b for b in data['baselines']}
    require(len(baselines) == len(data['baselines']) == 1 and domain in baselines,
            'This release supports one Baseline domain per run')
    baseline = baselines[domain]
    require(baseline['version'] == catalog['version'] and baseline['source_revision'] == catalog['source_revision'],
            'Baseline pin does not match the available catalog; historical catalogs require explicit support')
    scope = data['scope']
    require(set(scope['target_ids']) <= targets, 'Unknown or inactive scope target')
    require(set(scope['uncovered_procedures']) <= set(scope['target_ids']), 'Gap is outside selected targets')
    disposition_ids = set()
    for disposition in scope['dispositions']:
        key = disposition['target_id']
        require(key in procedures and key.startswith(domain + ':'), 'Unknown disposition target')
        require(key not in disposition_ids, 'Duplicate disposition')
        disposition_ids.add(key)
        require(key not in scope['target_ids'], 'Disposition also selected as an active target')
        if disposition['disposition'] in ('no-test-required', 'not-separately-tested-at-AA'):
            require(procedures[key]['disposition'] == disposition['disposition'], 'Incorrect retained source disposition')
    parsing = domain + ':24.A-Parsing'
    require(any(d['target_id'] == parsing and d['disposition'] == 'no-test-required'
                for d in scope['dispositions']), 'Retain the Parsing no-test-required disposition')
    artifacts = indexed(data['artifacts'], 'artifact')
    evidence = indexed(data['evidence'], 'evidence')
    results = indexed(data['results'], 'result')
    indexed(data['case_comparisons'], 'comparison')
    manifest_path = ROOT / 'evaluations/test-manifest.yaml'
    manifest = load(manifest_path)
    cases = {case['id']: case for case in manifest['cases']}
    selected = set(scope['selected_case_ids'])
    require(selected <= cases.keys(), 'Unknown selected case')
    if data['purpose'] == 'process-evaluation':
        require(set(scope['target_ids']) <= active, 'Framework evaluation targets must be active Web Baseline procedures')
    for cid in selected:
        require(set(cases[cid]['procedure_keys']) & set(scope['target_ids']), 'Selected case has no selected target')
    for artifact in artifacts.values():
        require(artifact['domain'] == domain, 'Artifact domain differs from run')
        require(set(artifact['case_ids']) <= selected, 'Artifact refers to an unselected case')
        for cid in artifact['case_ids']:
            require(artifact['sha256'] == cases[cid]['sample_sha256'], 'Case sample hash differs from manifest')
    for row in results.values():
        require(row['artifact_id'] in artifacts, 'Unknown result artifact')
        require(row['target_id'] in scope['target_ids'], 'Result target is outside scope')
        require(set(row['component_ids']) <= components.keys(), 'Unknown result component')
        require(set(row['rule_ids']) <= rules.keys(), 'Unknown result rule')
        require(set(row['evidence_ids']) <= evidence.keys(), 'Unknown result evidence')
        for rid in row['rule_ids']:
            require(rules[rid]['component_id'] in row['component_ids'], 'Rule owner is absent from result components')
            require(any(rid in m['rule_ids'] and m['target_id'] == row['target_id'] for m in data['process']['mappings']),
                    'Result rule lacks a mapping to this target')
        if data['purpose'] == 'process-evaluation':
            cid = row['case_id']
            require(cid in selected, 'Process evaluation result needs a selected Web case')
            require(cid in artifacts[row['artifact_id']]['case_ids'], 'Result case differs from artifact cases')
            require(row['target_id'] in cases[cid]['procedure_keys'], 'Case does not cover result target')
        require(row['status'] not in ('pass', 'fail', 'not-applicable') or row['completeness'] == 'complete',
                'Decisive outcome requires complete execution of the recorded check')
        require(row['status'] != 'not-tested' or (row['completeness'] == 'not-started' and not row['observation_ids']),
                'Not-tested result cannot claim execution or contributing observations')
        if row['kind'] == 'component-observation':
            require(bool(row['component_ids']) and not row['observation_ids'], 'Observation needs components and cannot aggregate observations')
        else:
            for oid in row['observation_ids']:
                require(oid in results and results[oid]['kind'] == 'component-observation', 'Unknown contributing observation')
                observation = results[oid]
                require(all(observation[k] == row[k] for k in ('artifact_id', 'target_id', 'case_id')),
                        'Contributing observation belongs to another artifact, target, or case')
                require(set(observation['component_ids']) <= set(row['component_ids']) and
                        set(observation['rule_ids']) <= set(row['rule_ids']), 'Determination omits contributing components or rules')
        if row['review']['status'] == 'completed':
            require(bool(row['review']['reviewers']), 'Completed result review needs a reviewer')
        require(set(row['review']['evidence_ids']) <= evidence.keys(), 'Unknown review evidence')
        if data['lifecycle'] == 'final' and row['status'] in ('pass', 'fail', 'not-applicable'):
            require(bool(row['component_ids']) and bool(row['evidence_ids']), 'Final observed outcome needs attribution and evidence')
    determinations = [(r['artifact_id'], r['target_id'], r['case_id']) for r in results.values()
                      if r['kind'] == 'process-determination']
    require(len(set(determinations)) == len(determinations), 'Duplicate final determination; use a new run for retesting')
    human = data['human_review']
    require(set(human['evidence_ids']) <= evidence.keys(), 'Unknown run review evidence')
    require(human['status'] != 'completed' or (bool(human['reviewers']) and not human['pending_work']),
            'Completed run review needs reviewers and no pending work')
    if data['lifecycle'] == 'final':
        for component in components.values():
            used = any(component['id'] in r['component_ids'] and r['status'] != 'not-tested' for r in results.values())
            if component['type'] == 'ai-si-tool' and used:
                retention = component['profile']['output_retention']
                require(bool(retention['original_outputs']) or bool(retention['unavailable_reason']),
                        'AI/SI component ' + component['id'] + ': final observed results need original-output references or an explicit unavailability reason')
        require(bool(data['process']['rules']) and bool(data['process']['mappings']), 'Finalize a defined process with rule mappings')
        if scope['evaluation_type'] == 'full-process':
            require(active <= set(scope['target_ids']) | disposition_ids,
                    'Full-process scope must account for every active Baseline procedure')
        if data['purpose'] == 'artifact-report':
            for aid in artifacts:
                for target in scope['target_ids']:
                    require((aid, target, None) in determinations, 'Final report must retain an explicit result or gap for every artifact/target')
        else:
            require(bool(selected), 'Final process evaluation needs selected cases')
            represented = {target for cid in selected for target in cases[cid]['procedure_keys']}
            require(set(scope['target_ids']) <= represented | set(scope['uncovered_procedures']),
                    'Selected procedure lacks case evidence or an explicit coverage gap')
            for cid in selected:
                for target in set(cases[cid]['procedure_keys']) & set(scope['target_ids']):
                    require(any(key[1:] == (target, cid) for key in determinations), 'Final evaluation omits a selected case/target')
    if data['purpose'] == 'process-evaluation':
        suite = data['suite']
        expectations_path = ROOT / 'evaluations/evaluator/expected-outcomes.yaml'
        require(suite['id'] == manifest['suite_id'] and suite['version'] == manifest['suite_version'] and
                suite['framework_revision'] == manifest['source_revision'], 'Suite identity differs from manifest')
        require(suite['manifest_sha256'] == hashlib.sha256(manifest_path.read_bytes()).hexdigest(), 'Manifest hash differs')
        require(suite['expectations_sha256'] == hashlib.sha256(expectations_path.read_bytes()).hexdigest(), 'Expectation pin differs')
        answers = {a['case_id']: a for a in load(expectations_path)['outcomes']}
        compared = set()
        for comparison in data['case_comparisons']:
            rid = comparison['result_id']
            require(rid in results and results[rid]['kind'] == 'process-determination', 'Comparison needs a process determination')
            require(rid not in compared, 'Duplicate comparison of one result')
            compared.add(rid)
            row = results[rid]
            require(comparison['expected_status'] == answers[row['case_id']]['expected_status'], 'Expected outcome differs')
            require(comparison['expectation_version'] == suite['expectations_sha256'], 'Comparison expectation pin differs')
            if comparison['comparison'] != 'not-compared':
                require(row['status'] in ('pass','fail','not-applicable'), 'Unperformed/incomplete results must remain not-compared')
                require(comparison['comparison'] == ('matched' if row['status'] == comparison['expected_status'] else 'mismatched'),
                        'Comparison contradicts candidate result')
        if data['candidate_freeze'] is not None:
            require(candidate_path is not None, 'Supply --candidate to verify the frozen candidate; no automatic file or URL access')
            raw = Path(candidate_path).read_bytes()
            require(hashlib.sha256(raw).hexdigest() == data['candidate_freeze']['sha256'], 'Frozen candidate hash differs')
            candidate = json.loads(raw)
            require(candidate['case_comparisons'] == [] and candidate['candidate_freeze'] is None, 'Candidate includes evaluator data')
            validate(candidate)
            projected = dict(data, case_comparisons=[], candidate_freeze=None)
            require(candidate == projected, 'Candidate fields changed after freeze')
        else:
            require(not data['case_comparisons'], 'Comparisons require a verified freeze')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('record', type=Path)
    parser.add_argument('--candidate', type=Path)
    args = parser.parse_args()
    validate(load(args.record), args.candidate)
    print('PASS: reporting structure and relationships; no accessibility execution or conformance is implied.')


if __name__ == '__main__':
    main()
