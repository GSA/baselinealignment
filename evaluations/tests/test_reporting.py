"""Data integrity regressions, including checks on actual Jekyll exports."""
import copy
import csv
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

from jsonschema import Draft202012Validator, ValidationError

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('reporting', ROOT / 'evaluations/scripts/validate_reporting.py')
reporting = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reporting)


class ReportingTests(unittest.TestCase):
    def record(self, name='artifact-report'):
        return reporting.load(ROOT / ('evaluations/examples/' + name + '.json'))

    def rejects(self, mutate, name='artifact-report'):
        data = self.record(name)
        mutate(data)
        with self.assertRaises((ValueError, ValidationError)):
            # Both JSON Schema failures and relationship failures must reject the record.
            reporting.validate(data, ROOT / 'evaluations/examples/process-candidate.json' if name == 'process-evaluation' else None)

    def test_templates_and_examples(self):
        for path in [ROOT/'evaluations/result-template.json', ROOT/'evaluations/templates/artifact-report.json',
                     *sorted((ROOT/'evaluations/examples').glob('*.json'))]:
            reporting.validate(reporting.load(path), path.with_name(path.name.replace('-evaluation','-candidate'))
                               if path.name.endswith('process-evaluation.json') else None)

    def test_ai_profile_is_required_for_ai_components(self):
        for profile in [None, {}, {'model':'unstructured legacy metadata'}]:
            data = self.record('ai-si-process-candidate')
            data['process']['components'][0]['profile'] = profile
            with self.assertRaises(ValidationError):
                reporting.validate(data)
        data = self.record('ai-si-process-candidate')
        del data['process']['components'][0]['profile']
        with self.assertRaises(ValidationError):
            reporting.validate(data)

    def test_ai_profile_required_fields_and_hashes(self):
        for mutate in [lambda p:p['instructions'].pop('system'),
                       lambda p:p['model'].update(version='   '),
                       lambda p:p.update(profile_version='unknown'),
                       lambda p:p['access'].pop('permissions'),
                       lambda p:p['output_retention']['original_outputs'][0].update(sha256='invalid'),
                       lambda p:p['variability'].pop('output_selection_policy')]:
            data = self.record('ai-si-process-candidate')
            mutate(data['process']['components'][0]['profile'])
            with self.assertRaises(ValidationError):
                reporting.validate(data)

    def test_direct_model_use_can_explicitly_omit_agent(self):
        data = self.record('ai-si-process-candidate')
        data['process']['components'][0]['profile']['agent'] = None
        reporting.validate(data)

    def test_final_ai_results_need_output_references_or_explained_gap(self):
        data = self.record('ai-si-process-candidate')
        retention = data['process']['components'][0]['profile']['output_retention']
        retention['original_outputs'] = []
        with self.assertRaisesRegex(ValueError,'original-output references'):
            reporting.validate(data)
        data['lifecycle'] = 'draft'
        reporting.validate(data)
        data['lifecycle'] = 'final'
        retention['unavailable_reason'] = 'Synthetic example: original output was not retained; this remains a review gap.'
        reporting.validate(data)

    def test_non_ai_custom_profile_behavior_is_retained(self):
        data = self.record()
        data['process']['components'][0]['profile'] = {'vendor-specific':{'metadata':'preserve'}}
        reporting.validate(data)

    def test_ai_profile_changes_after_freeze_are_rejected(self):
        data = self.record('ai-si-process-evaluation')
        data['process']['components'][0]['profile']['instructions']['task'] = 'Changed after freezing'
        with self.assertRaisesRegex(ValueError,'changed after freeze'):
            reporting.validate(data,ROOT/'evaluations/examples/ai-si-process-candidate.json')

    def test_process_evaluation_is_web_only(self):
        self.rejects(lambda d: d['scope'].update(domain='documents'), 'process-evaluation')

    def test_own_document_report_does_not_need_framework_samples(self):
        data = reporting.load(ROOT/'evaluations/templates/artifact-report.json')
        catalog = reporting.load(ROOT/'accessibility-si/mappings/documents/baseline.yaml')
        data['scope']['domain'] = 'documents'
        data['scope']['dispositions'][0]['target_id'] = 'documents:24.A-Parsing'
        data['baselines'] = [dict(domain='documents', version=catalog['version'], source_revision=catalog['source_revision'])]
        reporting.validate(data)

    def test_selected_procedure_needs_cases_or_an_explicit_gap(self):
        self.rejects(lambda d: d['scope']['target_ids'].append('web:2.B-FocusOrder'), 'process-evaluation')

    def test_full_process_scope_accounts_for_all_baseline_procedures(self):
        self.rejects(lambda d: d['scope'].update(evaluation_type='full-process'), 'process-evaluation')

    def test_artifact_report_rejects_evaluator_data(self):
        comparison = self.record('process-evaluation')['case_comparisons'][0]
        self.rejects(lambda d: d['case_comparisons'].append(comparison))

    def test_duplicate_ids(self):
        self.rejects(lambda d: d['process']['components'].append(copy.deepcopy(d['process']['components'][0])))

    def test_unknown_rule(self):
        self.rejects(lambda d: d['results'][0].update(rule_ids=['unknown']))

    def test_rule_must_map_to_result_target(self):
        self.rejects(lambda d: d['results'][0].update(target_id='web:supplemental:1.4.10'))

    def test_rule_owner_must_be_attributed(self):
        self.rejects(lambda d: d['results'][0].update(component_ids=['manual']))

    def test_observation_cannot_contribute_to_another_artifact(self):
        self.rejects(lambda d: d['results'][2].update(artifact_id='page-2'))

    def test_not_tested_is_not_a_complete_execution(self):
        self.rejects(lambda d: d['results'][3].update(completeness='complete'))

    def test_parsing_cannot_be_an_active_test(self):
        self.rejects(lambda d: d['scope']['target_ids'].append('web:24.A-Parsing'))

    def test_final_report_must_include_explicit_gaps(self):
        def mutate(data):
            data.update(lifecycle='final')
            data['run']['status'] = 'completed'
        self.rejects(mutate)

    def test_final_report_can_disclose_unperformed_tests_and_pending_review(self):
        data = self.record()
        data['lifecycle'] = 'final'
        data['run']['status'] = 'completed'
        gap = copy.deepcopy(data['results'][-1])
        gap.update(id='page-2-reflow-gap', artifact_id='page-2')
        data['results'].append(gap)
        reporting.validate(data)

    def test_case_procedure_and_sample_associations(self):
        self.rejects(lambda d: d['artifacts'][0].update(sha256='0'*64), 'process-evaluation')
        self.rejects(lambda d: d['results'][0].update(case_id=d['scope']['selected_case_ids'][1]), 'process-evaluation')

    def test_suite_identity(self):
        self.rejects(lambda d: d['suite'].update(id='framework-web'), 'process-evaluation')

    def test_comparison_cannot_claim_unperformed_match(self):
        self.rejects(lambda d: d['case_comparisons'][2].update(comparison='matched'), 'process-evaluation')

    def test_comparison_cannot_contradict_result(self):
        self.rejects(lambda d: d['case_comparisons'][0].update(comparison='mismatched'), 'process-evaluation')

    def test_comparison_requires_explicit_candidate_file(self):
        with self.assertRaisesRegex(ValueError, 'Supply --candidate'):
            reporting.validate(self.record('process-evaluation'))

    def test_frozen_candidate_rejects_tampering(self):
        self.rejects(lambda d: d['results'][0].update(rationale='Changed after freeze'), 'process-evaluation')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)/'candidate.json'
            path.write_text(json.dumps(self.record('process-candidate')))
            with self.assertRaisesRegex(ValueError, 'hash differs'):
                reporting.validate(self.record('process-evaluation'), path)

    def test_draft_and_final_have_different_requirements(self):
        data = reporting.load(ROOT/'evaluations/result-template.json')
        reporting.validate(data)
        data['lifecycle'] = 'final'
        with self.assertRaises(ValidationError):
            reporting.validate(data)


class CandidateExportTests(unittest.TestCase):
    def test_internal_sources_are_not_published(self):
        site = Path(os.environ.get('REPORTING_TEST_SITE', str(ROOT/'_site')))
        self.assertFalse(list(site.rglob('README.md')))
        self.assertFalse(list(site.rglob('*.md')))
        for path in ['reporting-tool/README.md','reporting-tool/tests','accessibility-si',
                     'evaluations/tests','evaluations/scripts','evaluations/reporting-model.html',
                     'evaluations/validation-status.md','evaluations/schemas/results-1.0.0.json']:
            self.assertFalse((site/path).exists(), path)
        for path in ['reporting-tool.html','reporting-guide.html','accessibility-si.html','assets/js/reporting/app.mjs',
                     'assets/reporting/catalog.json','evaluations/results-schema.json',
                     'evaluations/ai-si-profile-schema.json','assets/js/reporting/ai-profile.mjs']:
            self.assertTrue((site/path).is_file(), path)

    def test_rendered_exports(self):
        site = Path(os.environ.get('REPORTING_TEST_SITE', str(ROOT/'_site')))/'assets'
        self.assertTrue((site/'baselineTestCases-candidate.json').exists(), 'Run bundle exec jekyll build first')
        catalog = reporting.load(site/'baselineTestCases-candidate.json')
        manifest = reporting.load(ROOT/'evaluations/test-manifest.yaml')
        cases = {c['id']: c for c in manifest['cases'] if c['domain'] == 'web'}
        self.assertEqual(catalog['evaluation_domain'], 'web')
        self.assertEqual(catalog['suite_id'], manifest['suite_id'])
        self.assertEqual(catalog['framework_revision'], manifest['source_revision'])
        self.assertIn('outcome-bearing', catalog['isolation_status'])
        self.assertEqual({c['case_id'] for c in catalog['cases']}, set(cases))
        self.assertEqual(len(catalog['cases']), len(cases))
        with (site/'baselineTestCases-candidate.csv').open(newline='') as stream:
            reader = csv.DictReader(stream)
            rows = list(reader)
            self.assertEqual(set(reader.fieldnames), {'suite_id','suite_version','framework_revision','case_id','domain',
                                                     'sample_url','sample_sha256','case_version','procedure_keys'})
        self.assertEqual(len(rows), len(cases))
        byid = {r['case_id']: r for r in rows}
        self.assertEqual(set(byid), set(cases))
        # All generated URLs must use the configured deployment prefix, including preview prefixes.
        expected_prefix = os.environ.get('REPORTING_TEST_BASEURL', '/baselinealignment')
        for row in catalog['cases']:
            self.assertEqual(set(row), {'case_id','domain','sample_url','sample_sha256','case_version','procedure_keys'})
            original = cases[row['case_id']]
            self.assertEqual(row['sample_sha256'], original['sample_sha256'])
            self.assertEqual(row['procedure_keys'], original['procedure_keys'])
            self.assertEqual(row['case_version'], original['case_version'])
            self.assertEqual(row['sample_url'], expected_prefix+'/'+original['sample'])
            self.assertNotIn('//', row['sample_url'])
            for key in ('domain','sample_url','sample_sha256','case_version'):
                self.assertEqual(row[key], byid[row['case_id']][key])
            self.assertEqual(row['procedure_keys'], byid[row['case_id']]['procedure_keys'].split(';'))
            self.assertEqual(byid[row['case_id']]['suite_version'], catalog['suite_version'])


if __name__ == '__main__':
    unittest.main()
