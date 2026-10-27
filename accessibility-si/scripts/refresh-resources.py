#!/usr/bin/env python3
"""Render canonical mappings into references and vendor required skill-local copies."""
import argparse
import json
from pathlib import Path
A=Path(__file__).resolve().parents[1]
SKILL_REFERENCES={
 'accessible-web-development':['scope.md','source-notices.md','wcag-a-aa.md','web-baseline.md'],
 'web-accessibility-testing':['scope.md','source-notices.md','wcag-a-aa.md','web-baseline.md'],
 'accessible-document-creation':['scope.md','source-notices.md','wcag-a-aa.md','document-baseline.md','word.md','excel.md','powerpoint.md','pdf.md'],
 'document-accessibility-testing':['scope.md','source-notices.md','wcag-a-aa.md','document-baseline.md','word.md','excel.md','powerpoint.md','pdf.md']}
def read(name):return json.loads((A/name).read_text(encoding='utf-8'))
def render():
 criteria=read('mappings/wcag-a-aa.yaml')['criteria']
 lines=['# WCAG A/AA development and testing reference','','Generated from the canonical criterion catalog. Read normative sources for complete definitions, conditions and exceptions. These authored actions are implementation/test aids, not a replacement standard. Instruction coverage is draft; case coverage and observed outcomes are separate.','', '## Contents','']
 for c in criteria:lines.append('- ['+c['id']+' '+c['name']+'](#sc-'+c['id'].replace('.','-')+')')
 lines+=['','## Criterion entries','']
 for c in criteria:
  # Explicit anchors keep the generated table of contents consistent across renderers.
  lines+=['<a id="sc-'+c['id'].replace('.','-')+'"></a>','', '### '+c['id']+' '+c['name']+' ('+c['level']+')','',
   '**Authority:** introduced in WCAG '+c['introduced_in']+'; '+('incorporated WCAG 2.0 content requirement, subject to Section 508 scope and exceptions.' if c['introduced_in']=='2.0' else 'supplemental; neither cited Baseline maps this newer success criterion.'), '',
   '**Develop:** '+c['development'],'','**Test:** '+c['testing'],'','**Documents:** '+c['document_notes'],'',
   '**Baseline contributions:** web: '+(', '.join(c['web_baseline_procedures']) or 'not covered')+'; documents: '+(', '.join(c['documents_baseline_procedures']) or 'not covered / non-web exception where stated')+'. A listed procedure contributes targeted evidence, not automatic full-criterion coverage.','',
   ('[Incorporated WCAG 2.0 criterion]('+c['incorporated_wcag20_url']+') · ' if c['incorporated_wcag20_url'] else '')+'[WCAG 2.2 development criterion]('+c['normative_url']+') · [Informative explanation]('+c['understanding_url']+')','']
 lines+=['## Omitted active test','','4.1.1 Parsing is not an active check. Preserve both Baselines\' 24.A no-test-required disposition and assess real defects under affected criteria. See the bundled scope reference.','']
 generated={'references/wcag-a-aa.md':'\n'.join(lines).strip()+'\n'}
 coverage=['# Coverage inventory','','Instruction coverage is authored draft; all human reviews and observed evaluations remain pending unless evidence is separately recorded. Case counts describe source availability only, not scenario completeness or executed validation.','', '| Domain | Procedure | Disposition | Published cases | Instruction / evaluation |','| --- | --- | --- | --- | --- |']
 for domain,filename,title in [('web','web-baseline.md','Web Baseline 3.1'),('documents','document-baseline.md','Electronic Documents Baseline 1.0')]:
  b=read('mappings/'+domain+'/baseline.yaml')
  lines=['# '+title+' reference','','Generated from the canonical procedure inventory. For each applicable entry, read the official Identify Content, complete Test Instructions, Results, definitions and exceptions. The local checklist is a task aid. Use the bundled scope/criterion references and the format reference for actual delivery.','', '## Contents','']
  for p in b['procedures']:lines.append('- ['+p['id']+'](#'+p['id'].lower().replace('.','-')+')')
  lines+=['','## Retained categories and moved slots','']
  for c in b['categories']:
   if c['disposition']=='not-applicable':lines+=['- Category '+str(c['number'])+': '+c['name']+'. [Source]('+c['url']+'). Retain the disposition; do not invent active procedures.']
   if c.get('retained_slot'):lines+=['- Web 18.A moved to 6.B; use the current source and do not invent an active 18.A procedure.']
  if domain=='web':lines+=['- No document exceptions apply merely because web content is delivered as a file. Establish the actual content context.']
  lines+=['','## Procedure entries','']
  for p in b['procedures']:
   refs=', '.join(p['wcag_sc']+p['section508']+p['conformance_requirements']) or 'see official scope'
   lines+=['<a id="'+p['id'].lower().replace('.','-')+'"></a>','','### '+p['id'],'',
    '**Disposition:** '+p['disposition']+'. **Requirements addressed:** '+refs+'.','',
    '**Local checklist:** '+p['local_checklist'],'',
    ('**Execution:** do not execute a Parsing test. Retain the official no-test-required disposition without claiming an observed pass.' if p['disposition']=='no-test-required' else '**Execution:** retain the source non-applicability disposition for the established non-web context; do not invent an active test.' if p['disposition']=='not-applicable' else '**Execution:** follow the official relationship to the AA audio-description check; do not invent a separately executed Level A test or infer success without evidence for the relied-upon AA check.' if p['disposition']=='not-separately-tested-at-AA' else '**Execution:** follow the official procedure, inspect actual programmatic/native structure and rendered behavior, capture specific evidence and obtain human judgment where needed. In documents use native format mechanisms; do not substitute HTML-specific inspection mechanically.'),'',
    ('**Status accounting:** retain the explicit '+p['disposition']+' source disposition; no independent executed test or passing case classification is implied. Source/mapping review status: '+p['review_status']+'.' if p['disposition']!='active' else '**Validation evidence:** '+str(len(p['published_case_ids']))+' published source cases mapped in this snapshot; '+p['review_status']+'; observed evaluation '+p['evaluation_status']+'. Missing cases do not establish non-applicability.'),'',
    '[Official procedure]('+p['url']+')','']
   coverage.append('| '+domain+' | '+p['id']+' | '+p['disposition']+' | '+str(len(p['published_case_ids']))+' | '+p['instruction_coverage']+' / '+('not tested' if p['disposition']=='active' else 'source disposition; no independent execution')+' |')
  generated['references/'+filename]='\n'.join(lines).strip()+'\n'
 coverage+=['','All 18 newer A/AA criteria have authored supplemental guidance and no Web/Document Baseline mappings. Document exceptions, retained categories and Parsing dispositions are traceable without counting them as executed passes.','', 'No document Framework cases are supplied by the pinned source snapshot. The '+str(len(read('evaluations/test-manifest.yaml')['cases']))+' web case records are inventoried, not certified or automatically executed.','']
 generated['evaluations/coverage.md']='\n'.join(coverage).strip()+'\n'
 for skill,refs in SKILL_REFERENCES.items():
  for ref in refs:generated['skills/'+skill+'/references/'+ref]=generated.get('references/'+ref,(A/'references'/ref).read_text(encoding='utf-8') if (A/'references'/ref).exists() else '')
 return generated
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
 stale=[]
 for name,text in render().items():
  p=A/name
  if args.check:
   if not p.exists() or p.read_text(encoding='utf-8')!=text:stale.append(name)
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text, encoding='utf-8')
 if stale:parser.exit(1,'Generated references differ: '+', '.join(stale)+'\n')
 print('PASS: generated references are current.' if args.check else 'Rendered shared references and four self-contained skill folders.')
