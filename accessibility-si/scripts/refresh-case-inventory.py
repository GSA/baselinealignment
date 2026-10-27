#!/usr/bin/env python3
"""Rebuild source-case availability and evaluator expectations; never execute tests.

Requires PyYAML. Run after source cases are committed, using --source-revision SHA.
Keep prior evaluation runs; a refreshed inventory is a new evidence scope.
"""
import argparse,hashlib,json,re
from pathlib import Path
import yaml
from evaluation_common import A,load
ROOT=A.parent

def build(revision):
 manifest=load('evaluations/test-manifest.yaml');web=load('mappings/web/baseline.yaml');docs=load('mappings/documents/baseline.yaml')
 byshort={p['short_id']:p for p in web['procedures']}
 for p in web['procedures']:p['published_case_ids']=[];p['case_coverage']='no-published-cases-in-this-snapshot'
 cases=[];answers=[];issues=[];seen=set()
 for path in sorted((ROOT/'testcases').glob('*.md')):
  text=path.read_text(encoding='utf-8');require=re.match(r'^---\s*\n(.*?)\n---',text,re.S)
  if not require:raise ValueError('Missing source metadata: '+str(path))
  d=yaml.safe_load(require.group(1));cid=str(d['tcid'])
  if cid in seen:raise ValueError('Duplicate source case ID: '+cid)
  seen.add(cid);m=re.match(r'TC0*(\d+)\.([A-Z])',cid)
  proc=byshort.get(f'{int(m.group(1))}.{m.group(2)}') if m else None
  sample=ROOT/str(d['sample']).lstrip('/')
  if not sample.is_file():raise ValueError('Missing sample: '+str(sample))
  if not proc:issues.append({'case_id':cid,'issue':'No exact procedure prefix match; human mapping required.'})
  if proc:
   proc['published_case_ids'].append(cid);proc['case_coverage']='published-cases-available'
   if str(d['baseline-version'])!=web['version']:issues.append({'case_id':cid,'issue':'Declared Baseline version differs from current inventory; human review required.'})
  cases.append({'id':cid,'domain':'web','record':str(path.relative_to(ROOT)),'record_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'sample':str(sample.relative_to(ROOT)),'sample_sha256':hashlib.sha256(sample.read_bytes()).hexdigest(),'case_version':str(d.get('tc-version','unspecified')),'declared_baseline_version':str(d['baseline-version']),'procedure_keys':[proc['key']] if proc else [],'availability':'published-source','review_status':'pending-human-review','result_status':'not-tested','dependency_policy':'preserve and record all local CSS, JavaScript, images, frames and relevant network dependencies before execution'})
  answers.append({'case_id':cid,'expected_status':{'PASS':'pass','FAIL':'fail','DNA':'not-applicable'}[str(d['result']).upper()],'source_result':d['result'],'source_rationale':d.get('result-descr',''),'authority':'existing-framework-case; review against pinned Baseline source before scoring'})
 manifest.update(source_revision=revision,cases=cases,mapping_issues=issues)
 # Document ingestion deliberately requires a reviewed format/source schema rather than inferring it from web metadata.
 if manifest['document_cases']:raise ValueError('Document case ingestion needs an explicit reviewed schema before this updater can be used.')
 sources=load('mappings/sources.json');sources['framework_revision']=revision
 return {'evaluations/test-manifest.yaml':manifest,'evaluations/evaluator/expected-outcomes.yaml':{'schema_version':'0.2.0','warning':'Evaluator only. Freeze candidate results before using expected outcomes. Source case titles and filenames also leak outcomes.','outcomes':answers},'mappings/web/baseline.yaml':web,'mappings/sources.json':sources}
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source-revision');parser.add_argument('--check',action='store_true');args=parser.parse_args()
 if not args.check and not args.source_revision:parser.error('Provide --source-revision for an updated committed Framework snapshot.')
 revision=args.source_revision or load('evaluations/test-manifest.yaml')['source_revision']
 if not re.fullmatch('[0-9a-f]{40}',revision):parser.error('Use a full source commit SHA.')
 stale=[]
 for name,value in build(revision).items():
  if args.check:
   if load(name)!=value:stale.append(name)
  else:(A/name).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n', encoding='utf-8')
 if stale:parser.exit(1,'Case inventory differs: '+', '.join(stale)+'\n')
 print('PASS: case inventory is current.' if args.check else 'Refreshed availability and pending-review expectations; rerender resources and rerun structural validation. No evaluations were executed.')
