#!/usr/bin/env python3
"""Validate authored coverage, provenance, local references and result consistency; never accessibility."""
import argparse,collections,hashlib,json,re,subprocess,sys
from pathlib import Path
from evaluation_common import A,load,targets_for
ROOT=A.parent

def require(condition,message):
 if not condition:raise ValueError(message)

def validate(result_path=None):
 import yaml
 from jsonschema import Draft202012Validator,FormatChecker
 criteria=load('mappings/wcag-a-aa.yaml')['criteria'];criteria_by={c['id']:c for c in criteria}
 require(len(criteria)==len(criteria_by)==55,'Expected 55 unique active A/AA criteria')
 require('4.1.1' not in criteria_by,'Parsing must not be an active criterion')
 require(collections.Counter(c['introduced_in'] for c in criteria)=={'2.0':37,'2.1':12,'2.2':6},'Unexpected criterion version coverage')
 sources=load('mappings/sources.json')
 for domain in ['web','documents']:
  baseline=load('mappings/'+domain+'/baseline.yaml');procs=baseline['procedures'];ids={p['id'] for p in procs}
  require(len(ids)==len(procs),'Duplicate procedure IDs')
  require(ids==set(sources['procedure_ids'][domain]),'Procedure inventory differs from pinned source identifiers')
  require({c['number'] for c in baseline['categories']}==set(range(1,25)),'Missing Baseline category')
  require(baseline['source_revision']==sources['baseline_revision'],'Baseline source revision mismatch')
  require(next(p for p in procs if p['id']=='24.A-Parsing')['disposition']=='no-test-required','Incorrect Parsing disposition')
  for p in procs:
   require(p['local_checklist'] and p['review_status'] in ['pending-human-review','reviewed'],'Missing authored instructions or unknown review status')
   if p['review_status']=='reviewed':
    review=p.get('review_record',{})
    require(review.get('reviewer') and review.get('reviewed_on') and review.get('evidence'),'Reviewed status requires reviewer, date and evidence')
   require(all(sc in criteria_by or sc=='4.1.1' for sc in p['wcag_sc']),'Unknown criterion mapping')
   require(not any(sc in criteria_by and criteria_by[sc]['introduced_in']!='2.0' for sc in p['wcag_sc']),'Baseline must not map newer criteria')
  for c in criteria:
   for pid in c[domain+'_baseline_procedures']:require(pid in ids,'Unknown Baseline procedure reference')
   if c['introduced_in']!='2.0':require(not c[domain+'_baseline_procedures'],'Supplemental criterion has Baseline mapping')
  if domain=='documents':
   for sc in ['2.4.1','2.4.5','3.2.3','3.2.4']:require(not criteria_by[sc]['documents_baseline_procedures'],'Non-web exception mapped as an active test')
   require(next(p for p in procs if p['id']=='6.C-Captcha')['disposition']=='not-applicable','Document CAPTCHA retained disposition missing')
 manifest=load('evaluations/test-manifest.yaml');answers=load('evaluations/evaluator/expected-outcomes.yaml')['outcomes']
 require(not manifest['mapping_issues'],'Framework mapping issues require human resolution')
 require(not manifest['document_cases'],'Do not infer published document cases')
 require(manifest['source_revision']==sources['framework_revision'],'Framework source mismatch')
 answers={a['case_id']:a for a in answers}
 procmap={p['key']:p for p in load('mappings/web/baseline.yaml')['procedures']}
 caseids=set()
 for case in manifest['cases']:
  require(case['id'] not in caseids,'Duplicate Framework case');caseids.add(case['id'])
  for kind in ['record','sample']:
   p=ROOT/case[kind];require(p.is_file(),'Missing '+str(p))
   require(hashlib.sha256(p.read_bytes()).hexdigest()==case[kind+'_sha256'],'Source hash mismatch '+str(p))
  original=yaml.safe_load((ROOT/case['record']).read_text(encoding='utf-8').split('---',2)[1])
  expected={'PASS':'pass','FAIL':'fail','DNA':'not-applicable'}[str(original['result']).upper()]
  require(answers[case['id']]['expected_status']==expected,'Expected outcome changed without source update')
  for key in case['procedure_keys']:require(key in procmap and case['id'] in procmap[key]['published_case_ids'],'Case-to-procedure mapping mismatch')
 require(caseids==set(answers),'Expected outcome inventory differs from case inventory')
 require(caseids=={str(yaml.safe_load(p.read_text(encoding='utf-8').split('---',2)[1])['tcid']) for p in (ROOT/'testcases').glob('*.md')},'New or missing cases: refresh inventory')
 for path in A.rglob('*.md'):
  for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)',path.read_text(encoding='utf-8')):
   if '://' in link or link.startswith('#'):continue
   target=(path.parent/link.split('#')[0]).resolve();require(target.exists(),f'Broken local link {path}: {link}')
   if '/skills/' in str(path):
    skill=next(p for p in path.parents if p.parent==A/'skills')
    require(target==skill or skill in target.parents,'External skill dependency '+link)
 for path in (A/'skills').glob('*/SKILL.md'):
  text=path.read_text(encoding='utf-8');front=yaml.safe_load(text.split('---',2)[1])
  require(set(front)=={'name','description'} and front['name']==path.parent.name,'Invalid skill metadata')
  require('TODO' not in text and len(text.splitlines())<500,'Unfinished or excessive skill entry point')
 subprocess.run([sys.executable,str(A/'scripts/refresh-resources.py'),'--check'],check=True)
 schema=load('evaluations/results-schema.json');Draft202012Validator.check_schema(schema)
 data=json.loads((result_path or A/'evaluations/result-template.json').read_text(encoding='utf-8'));Draft202012Validator(schema,format_checker=FormatChecker()).validate(data)
 domain=data['scope']['domain'];targets,dispositions=targets_for(domain);registry={t['target_id']:t for t in targets}
 require(data['scope']['baseline_source_revision']==sources['baseline_revision'],'Result catalog revision differs')
 require(data['scope']['baseline_version']==('3.1' if domain=='web' else '1.0'),'Wrong Baseline version for domain')
 require(not(domain=='documents' and data['scope']['format']=='html'),'Non-web template cannot use HTML format')
 require(data['scope']['dispositions']==dispositions,'Result scope dispositions differ from inventory')
 observed=set();targetids=set();observed_rows={}
 for row in data['results']:
  require(row['target_id'] in registry,'Unknown or inactive result target '+row['target_id'])
  target=registry[row['target_id']]
  for k,v in target.items():require(row[k]==v,'Result target metadata differs: '+row['target_id']+' '+k)
  key=(row['target_id'],row['case_id']);require(key not in observed,'Duplicate result target/case');observed.add(key);targetids.add(row['target_id']);observed_rows[key]=row
  if row['case_id'] is not None:
   case=next((c for c in manifest['cases'] if c['id']==row['case_id']),None)
   require(case is not None and domain==case['domain'] and row['target_id'] in case['procedure_keys'],'Case does not exercise this result target/domain')
  if row['status'] in ['pass','fail','not-applicable']:
   require(data['performed_at'] is not None and data['artifact']['sha256'] is not None,'Observed outcomes need timestamp and artifact hash')
   require(all(v!='not-recorded' for v in data['environment'].values()),'Record actual environment or explained non-applicability')
 if data['scope']['selection']=='full-scope':require(targetids==set(registry),'Full-scope record omits required targets')
 for comparison in data['case_comparisons']:
  case=next((c for c in manifest['cases'] if c['id']==comparison['case_id']),None)
  require(case is not None and comparison['target_id'] in case['procedure_keys'],'Comparison target not covered by case')
  require(comparison['expected_status']==answers[case['id']]['expected_status'],'Comparison does not match versioned expected outcome')
  if comparison['comparison']!='not-compared':
   require(data['performed_at'] is not None,'Comparison needs timestamp')
   observation=observed_rows.get((comparison['target_id'],comparison['case_id']))
   require(observation is not None and observation['status']==comparison['observed_status'],'Comparison must reference a matching observed case result')
   expected='matched' if comparison['observed_status']==comparison['expected_status'] else 'mismatched'
   require(comparison['comparison']==expected,'Comparison classification contradicts its observations')
 if data['human_review']['status']=='completed':require(data['performed_at'] is not None,'Completed human review needs timestamp')
 print(f'PASS: 55 criteria; {len(procmap)} Web and {len(load("mappings/documents/baseline.yaml")["procedures"])} Document procedures; {len(caseids)} Framework cases; links, generated copies, source hashes, schema and scoped results.')
 print('Structural validation only; no accessibility or alignment evaluation is implied.')
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--result',type=Path);args=parser.parse_args();validate(args.result)
