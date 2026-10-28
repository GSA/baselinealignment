"""Shared standard-library inventory logic for portable manual evaluation records."""
import json
from pathlib import Path
A=Path(__file__).resolve().parents[1]
VERSION='0.2.0'
def load(path):return json.loads((A/path).read_text(encoding='utf-8'))
def targets_for(domain):
 b=load('mappings/'+domain+'/baseline.yaml');targets=[];dispositions=[]
 for p in b['procedures']:
  if p['disposition']!='active':
   dispositions.append({'target_id':p['key'],'disposition':p['disposition'],'basis':p['url']});continue
  targets.append({'target_id':p['key'],'target_kind':'baseline-procedure','testing_track':'section508-baseline','baseline_procedure_id':p['id'],'local_procedure_id':None,'requirement_refs':p['wcag_sc']+p['section508']+p['conformance_requirements'],'source_url':p['url']})
 for c in load('mappings/wcag-a-aa.yaml')['criteria']:
  if c['introduced_in']=='2.0':continue
  targets.append({'target_id':domain+':supplemental:'+c['id'],'target_kind':'supplemental-sc','testing_track':c['track'],'baseline_procedure_id':None,'local_procedure_id':'SUP-'+domain.upper()+'-WCAG'+c['introduced_in'].replace('.','')+'-'+c['id'],'requirement_refs':[c['id']],'source_url':c['normative_url']})
 for n in range(1,6):
  targets.append({'target_id':domain+':conformance:CR'+str(n),'target_kind':'conformance','testing_track':'section508-conformance','baseline_procedure_id':None,'local_procedure_id':'CONF-'+str(n),'requirement_refs':['CR'+str(n)],'source_url':'https://www.w3.org/TR/WCAG20/#conformance-reqs'})
 for key,refs in [('content-scope',['E205.2','E205.3','E205.4']),('support-documentation',['602.3'])]+([('nonweb-substitutions',['E205.4.1'])] if domain=='documents' else []):
  targets.append({'target_id':domain+':scope:'+key,'target_kind':'scope','testing_track':'section508-scope','baseline_procedure_id':None,'local_procedure_id':'SCOPE-'+key,'requirement_refs':refs,'source_url':'https://www.access-board.gov/ict/'})
 for cat in b['categories']:
  if cat['disposition']=='not-applicable':dispositions.append({'target_id':domain+':category:'+str(cat['number']),'disposition':'not-applicable-category','basis':cat['url']})
 return targets,dispositions

def template(domain,artifact_format,human_only=False):
 targets,dispositions=targets_for(domain)
 return {'schema_version':VERSION,'suite_id':'framework-web-documents','run_id':'replace-before-execution','performed_at':None,'scope':{'domain':domain,'format':artifact_format,'selection':'full-scope','stage':'initial','collection_version':VERSION,'baseline_version':'3.1' if domain=='web' else '1.0','baseline_source_revision':load('mappings/sources.json')['baseline_revision'],'dispositions':dispositions},'artifact':{'path':'replace-with-delivered-artifact','sha256':None,'dependencies':[]},'environment':{k:('not-applicable' if human_only and k in ['agent','model'] else 'not-recorded') for k in ['agent','model','os','browser_or_reader','assistive_technology','viewport_or_view','zoom','keyboard_settings']},'results':[dict(t,case_id=None,status='not-tested',tester_type='none',evidence=[],rationale='No observation has been made; complete this check or retain an explicit gap.') for t in targets],'case_comparisons':[],'human_review':{'status':'pending','reviewer':None,'evidence':[]},'limitations':['Template only; no accessibility evaluation or conformance determination has occurred.','Case availability and instruction coverage are independent of observed outcomes.']}
