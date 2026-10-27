#!/usr/bin/env python3
"""Validate pilot structure and result semantics, not accessibility. Requires PyYAML and jsonschema."""
import argparse
import hashlib
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
COLLECTION = ROOT / 'accessibility-si'

def validate(result_path=None):
    import yaml
    from jsonschema import Draft202012Validator, FormatChecker
    manifest = yaml.safe_load((COLLECTION / 'evaluations/web-focus-manifest.yaml').read_text(encoding='utf-8'))
    mapping = yaml.safe_load((COLLECTION / 'mappings/web/focus.yaml').read_text(encoding='utf-8'))
    baseline = yaml.safe_load((ROOT / '_data/baselines.yaml').read_text(encoding='utf-8'))
    ids = {p['id'] for category in baseline for p in category['test-procedures']}
    assert mapping['checks'][0]['baseline_procedure_id'] in ids
    assert mapping['checks'][1]['baseline_procedure_id'] is None
    assert mapping['checks'][1]['baseline_coverage'] == 'not-covered'
    assert manifest['source_revision'] == mapping['sources']['repository_revision']
    for case in manifest['cases']:
        for item in case['files']:
            path = ROOT / item['path']
            assert hashlib.sha256(path.read_bytes()).hexdigest() == item['sha256'], item['path']
        if case['upstream_case']:
            assert (ROOT / case['upstream_case']).is_file()
    for path in COLLECTION.rglob('*.md'):
        for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)', path.read_text(encoding='utf-8')):
            if '://' in link or link.startswith('#'):
                continue
            target = (path.parent / link.split('#')[0]).resolve()
            assert target.exists(), f'Broken local link {path}: {link}'
            if '/skills/' in str(path):
                skill_root = next(p for p in path.parents if p.parent == COLLECTION / 'skills')
                assert target == skill_root or skill_root in target.parents, f'External skill dependency: {link}'
    for path in (COLLECTION / 'skills').glob('*/SKILL.md'):
        text = path.read_text(encoding='utf-8')
        assert text.startswith('---\n')
        frontmatter = yaml.safe_load(text.split('---', 2)[1])
        assert set(frontmatter) == {'name', 'description'}
        assert frontmatter['name'] == path.parent.name
        assert 'TODO' not in text
    schema = json.loads((COLLECTION / 'evaluations/web-focus-results-schema.json').read_text(encoding='utf-8'))
    Draft202012Validator.check_schema(schema)
    result_path = result_path or COLLECTION / 'evaluations/web-focus-result-template.json'
    data = json.loads(result_path.read_text(encoding='utf-8'))
    Draft202012Validator(schema, format_checker=FormatChecker()).validate(data)
    known = {(c['id'], check) for c in manifest['cases'] for check in c['checks']}
    observed = set()
    for row in data['results']:
        pair = (row['case_id'], row['check_id'])
        assert pair in known or (row['stage'] == 'generated' and row['case_id'] == 'generated'), pair
        key = (*pair, row['stage'])
        assert key not in observed, f'Duplicate result {key}'
        observed.add(key)
        if row['status'] in ['pass', 'fail', 'not-applicable']:
            assert data['performed_at'] is not None, 'Performed outcomes need an actual timestamp'
            assert all(v != 'not-recorded' for v in data['environment'].values()), 'Record the environment'
    initial = {(case, check) for case, check, stage in observed if stage == 'initial'}
    assert initial == known, 'Include every initial case/check, even when not-tested'
    if data['human_review']['status'] == 'completed':
        assert data['performed_at'] is not None
    print('PASS: structure, local links, source hashes, mapping IDs, schema, and result consistency.')
    print('No accessibility evaluation or human review is implied.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--result', type=Path)
    args = parser.parse_args()
    validate(args.result)
