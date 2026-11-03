import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {clone, schemaErrors, validateRecord, profileErrors, serialize, sha256, freezeCandidate, verifyCandidate,
  compare, synchronizeScope, csv, csvFiles, htmlReport} from '../../assets/js/reporting/model.mjs';
import {aiProfileSections, emptyAIProfile, reusableProcess} from '../../assets/js/reporting/ai-profile.mjs';

const root = resolve(import.meta.dirname, '../..');
const load = path => JSON.parse(readFileSync(resolve(root,path),'utf8'));
const schema = load('evaluations/results-schema.json');
const profileSchema = load('evaluations/process-profile-schema.json');
const manifest = load('evaluations/test-manifest.yaml');
const expectations = load('evaluations/evaluator/expected-outcomes.yaml');
const criteria = load('accessibility-si/mappings/wcag-a-aa.yaml').criteria;
const catalog = {domains: {}, suite: load('evaluations/result-template.json').suite};
for (const domain of ['web','documents']) {
  const source = load(`accessibility-si/mappings/${domain}/baseline.yaml`);
  catalog.domains[domain] = {baseline: {domain,version: source.version,source_revision: source.source_revision},
    procedures: source.procedures.map(p => ({id:p.key,disposition:p.disposition})),
    targets: [...source.procedures.filter(p => p.disposition === 'active').map(p => ({id:p.key,track:'section508-baseline'})),
      ...criteria.filter(c => c.introduced_in !== '2.0').map(c => ({id:`${domain}:supplemental:${c.id}`,track:c.track})),
      ...[1,2,3,4,5].map(n => ({id:`${domain}:conformance:CR${n}`,track:'section508-conformance'})),
      ...['content-scope','support-documentation',...(domain === 'documents' ? ['nonweb-substitutions'] : [])].map(id => ({id:`${domain}:scope:${id}`,track:'section508-scope'}))]};
}
const cases = manifest.cases.map(c => ({case_id:c.id,sample_url:`/${c.sample}`,sample_sha256:c.sample_sha256,procedure_keys:c.procedure_keys}));
const example = name => load(`evaluations/examples/${name}.json`);
const check = (record, options = {}) => validateRecord(record,schema,catalog,cases,options);

test('accepted 1.0 templates, profiles and illustrative records validate', () => {
  for (const path of ['evaluations/result-template.json','evaluations/templates/artifact-report.json']) assert.deepEqual(check(load(path)),[]);
  const profile = example('hybrid-process-profile');
  assert.deepEqual(schemaErrors(profile,profileSchema,schema),[]);
  assert.deepEqual(profileErrors(profile.process,catalog),[]);
  assert.deepEqual(check(example('artifact-report')),[]);
  assert.deepEqual(check(example('process-candidate')),[]);
  assert.deepEqual(check(example('process-evaluation'),{candidate:example('process-candidate'),expectations}),[]);
});
test('schema rejects unknown fields, invalid dates, duplicate arrays and old draft shape', () => {
  const record = example('artifact-report'); record.run.performed_at = '2026-02-30T10:00:00Z';
  assert.ok(check(record).some(e => e.includes('performed_at')));
  record.run.performed_at = null; record.surprise = true; assert.ok(check(record).some(e => e.includes('unexpected field')));
  delete record.surprise; record.scope.target_ids.push(record.scope.target_ids[0]); assert.ok(check(record).some(e => e.includes('duplicate')));
  assert.ok(check({schema_version:'1.0.0',artifact:{},results:[]}).length);
});
test('Web-only evaluation and separate document artifact reporting', () => {
  const evaluation = example('process-candidate'); evaluation.scope.domain = 'documents'; assert.ok(check(evaluation).length);
  const report = load('evaluations/templates/artifact-report.json'); report.scope.domain = 'documents';
  report.baselines = [catalog.domains.documents.baseline];
  report.scope.dispositions[0].target_id = 'documents:24.A-Parsing'; assert.deepEqual(check(report),[]);
  report.case_comparisons = example('process-evaluation').case_comparisons; assert.ok(check(report).length);
});
test('rules, ownership, evidence and observation joins are checked', () => {
  for (const mutate of [
    r => r.process.components.push(clone(r.process.components[0])),
    r => { r.results[0].rule_ids = ['unknown']; },
    r => { r.results[0].component_ids = ['manual']; },
    r => { r.results[0].target_id = 'web:supplemental:1.4.10'; },
    r => { r.results[0].evidence_ids = ['unknown']; },
    r => { r.results[2].artifact_id = 'page-2'; },
    r => { r.results[3].completeness = 'complete'; },
    r => { r.results[0].review.reviewers = []; },
    r => { r.scope.target_ids.push('web:24.A-Parsing'); }
  ]) { const record=example('artifact-report'); mutate(record); assert.ok(check(record).length); }
});
test('finalization accounts for gaps without inventing executed outcomes', () => {
  const report=example('artifact-report'); report.lifecycle='final'; report.run.status='completed';
  assert.ok(check(report).some(e => e.includes('Retain a determination')));
  const gap=clone(report.results.at(-1)); gap.id='second-reflow-gap'; gap.artifact_id='page-2'; report.results.push(gap);
  assert.deepEqual(check(report),[]); assert.equal(report.results.at(-1).status,'not-tested');
  const process=example('process-candidate'); process.scope.evaluation_type='full-process'; assert.ok(check(process).some(e=>e.includes('every active')));
});
test('case/sample pins and comparison classifications cannot be changed', () => {
  for (const mutate of [
    r=>{r.suite.id='wrong';}, r=>{r.artifacts[0].sha256='0'.repeat(64);},
    r=>{r.case_comparisons[0].comparison='mismatched';}, r=>{r.case_comparisons[2].comparison='matched';},
    r=>{r.case_comparisons[0].expected_status='pass';},r=>{r.case_comparisons[0].expectation_version='wrong';}
  ]) { const record=example('process-evaluation'); mutate(record); assert.ok(check(record,{candidate:example('process-candidate'),expectations}).length); }
});
test('freeze retains exact candidate bytes and prevents changed candidate fields', async () => {
  const input=example('process-candidate'); const original=serialize(input);
  const frozen=await freezeCandidate(input);
  assert.equal(frozen.text,original); assert.equal(serialize(input),original);
  assert.equal(frozen.record.candidate_freeze.sha256,await sha256(original));
  assert.deepEqual(await verifyCandidate(frozen.record,original),input);
  const changed=clone(frozen.record); changed.results[0].rationale='tampered';
  await assert.rejects(verifyCandidate(changed,original),/changed after freeze/);
  await assert.rejects(verifyCandidate(frozen.record,original+' '),/hash differs/);
  await assert.rejects(freezeCandidate(frozen.record),/un-compared/);
});
test('explicit evaluator comparison retains untested cases as not-compared', async () => {
  const frozen=await freezeCandidate(example('process-candidate'));
  assert.throws(()=>compare(frozen.record,expectations,''),/identify/);
  const result=compare(frozen.record,expectations,'Example evaluator');
  assert.deepEqual(result.case_comparisons.map(c=>c.comparison),['matched','mismatched','not-compared']);
  assert.deepEqual(check(result,{candidate:frozen.candidate,expectations}),[]);
  assert.ok(check(result).some(e=>e.includes('Verify the original')));
  assert.ok(check(result,{candidate:frozen.candidate}).some(e=>e.includes('Load and verify')));
});
test('scope builds explicit not-tested rows and refuses to discard observations', () => {
  let record=load('evaluations/result-template.json');
  const selected=cases.slice(0,2); const targets=[...new Set(selected.flatMap(c=>c.procedure_keys))];
  record=synchronizeScope(record,targets,selected.map(c=>c.case_id),cases);
  assert.ok(record.results.length); assert.ok(record.results.every(r=>r.status==='not-tested'));
  assert.deepEqual(check(record),[]);
  record.results[0].status='fail';
  assert.throws(()=>synchronizeScope(record,[],[],cases),/remove recorded work/);
});
test('artifact scope matrix retains multiple artifacts and existing richer evidence', () => {
  const record=example('artifact-report'); const updated=synchronizeScope(record,record.scope.target_ids,[],cases);
  assert.equal(updated.artifacts.length,2); assert.equal(updated.results.length,6);
  assert.deepEqual(updated.evidence,record.evidence); assert.equal(record.results.length,5);
  assert.deepEqual(check(updated),[]);
});
test('CSV quotes multiline values and neutralizes formula-like strings', () => {
  assert.equal(csv([{text:'a,"b"\nc'},{text:' \t=HYPERLINK("x")'}]),'"text"\r\n"a,""b""\nc"\r\n"\' \t=HYPERLINK(""x"")"\r\n');
  const report=example('artifact-report'); const files=csvFiles(report);
  assert.equal(files.length,Object.keys(report).length);
  assert.ok(files.some(f=>f.name==='results.csv' && f.text.includes('component-observation')));
  assert.equal(files.find(f=>f.name==='limitations.csv').text,csv(report.limitations.map(value=>({value}))));
});
test('standalone HTML escapes imported values and retains full record without network dependencies', () => {
  const report=example('artifact-report'); report.process.name='<script>alert("x")</script>'; report.results[0].rationale='</td><img src=x onerror=alert(1)>';
  const html=htmlReport(report);
  assert.ok(!html.includes('<script')); assert.ok(!html.includes('<img')); assert.ok(!html.includes('<link'));
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(html.includes('scanner-observation'));
  assert.ok(html.includes('Process determinations only: pass: 0; fail: 1;'));
  assert.ok(html.includes('DRAFT')); assert.ok(html.includes('ILLUSTRATIVE'));
});
test('JavaScript and independent Python validator accept the representative records', t => {
  const python=resolve(root,'.venv/bin/python');
  for (const name of ['artifact-report','process-candidate','process-evaluation','ai-si-component-profile','ai-si-process-profile','ai-si-process-candidate','ai-si-process-evaluation']) {
    const args=['evaluations/scripts/validate_reporting.py',`evaluations/examples/${name}.json`];
    if(name.endsWith('process-evaluation')) args.push('--candidate',`evaluations/examples/${name.replace('-evaluation','-candidate')}.json`);
    const result=spawnSync(python,args,{cwd:root,encoding:'utf8'});
    if(result.error?.code==='ENOENT') { t.skip('Install Python validation dependencies to run independent parity checks.'); return; }
    assert.equal(result.status,0,result.stdout+result.stderr);
  }
});

test('formal AI/SI profiles validate independently and inside process/evaluation records', () => {
  const standalone=example('ai-si-component-profile');
  assert.deepEqual(schemaErrors(standalone,load('evaluations/ai-si-profile-schema.json'),schema),[]);
  const profile=example('ai-si-process-profile');
  assert.deepEqual(schemaErrors(profile,profileSchema,schema),[]);
  assert.deepEqual(check(example('ai-si-process-candidate')),[]);
  assert.deepEqual(check(example('ai-si-process-evaluation'),{candidate:example('ai-si-process-candidate'),expectations}),[]);
  for (const [group,,fields] of aiProfileSections) for (const [key] of fields) {
    assert.ok(Object.hasOwn(standalone[group],key),`${group}.${key} form field has no schema/example counterpart`);
  }
  assert.ok(schemaErrors(emptyAIProfile(),schema.$defs['ai-si-profile'],schema).length);
});
test('AI type requires typed metadata; other component profiles remain unrestricted', () => {
  for(const profile of [undefined,null,{}, {model:'legacy value'}]) {
    const record=example('ai-si-process-candidate');
    if(profile===undefined) delete record.process.components[0].profile; else record.process.components[0].profile=profile;
    assert.ok(check(record).length);
  }
  const report=example('artifact-report');report.process.components[0].profile={vendor:'custom',nested:{preserved:true}};
  assert.deepEqual(check(report),[]);
});
test('AI identity, instructions, configuration and output hashes are validated', () => {
  for(const mutate of [p=>{delete p.model.version;},p=>{p.instructions.system='  ';},p=>{delete p.access.permissions;},
    p=>{delete p.variability.sampling_plan;},p=>{p.output_retention.original_outputs[0].sha256='bad';},p=>{p.profile_version='other';}]) {
    const record=example('ai-si-process-candidate');mutate(record.process.components[0].profile);assert.ok(check(record).length);
  }
  const record=example('ai-si-process-candidate');record.process.components[0].profile.agent=null;assert.deepEqual(check(record),[]);
});
test('final observed AI results need original output provenance or an explicit missing-output reason', () => {
  const record=example('ai-si-process-candidate');const retention=record.process.components[0].profile.output_retention;
  retention.original_outputs=[];assert.ok(check(record).some(e=>e.includes('original-output references')));
  record.lifecycle='draft';assert.deepEqual(check(record),[]);
  record.lifecycle='final';retention.unavailable_reason='Original output unavailable; recorded as an evidence gap.';assert.deepEqual(check(record),[]);
  retention.unavailable_reason='   ';assert.ok(check(record).length);
});
test('configuration reuse removes per-run AI outputs and their missing-output explanation', () => {
  const record=example('ai-si-process-candidate');record.process.components[0].profile.output_retention.unavailable_reason='Other original outputs missing.';
  const copy=reusableProcess(record.process);
  assert.deepEqual(copy.components[0].profile.output_retention.original_outputs,[]);
  assert.equal(copy.components[0].profile.output_retention.unavailable_reason,null);
  assert.ok(record.process.components[0].profile.output_retention.original_outputs.length);
  assert.equal(copy.components[0].profile.output_retention.policy,record.process.components[0].profile.output_retention.policy);
  assert.deepEqual(copy.components[1],record.process.components[1]);
});
test('AI metadata survives exports and freeze verification; post-freeze instruction edits fail', async () => {
  const record=example('ai-si-process-candidate');const original=clone(record.process.components[0].profile);
  const frozen=await freezeCandidate(record);assert.deepEqual((await verifyCandidate(frozen.record,frozen.text)).process.components[0].profile,original);
  frozen.record.process.components[0].profile.instructions.task='Changed task';
  await assert.rejects(verifyCandidate(frozen.record,frozen.text),/changed after freeze/);
  const html=htmlReport(record);assert.ok(html.includes('AI/SI component profiles'));assert.ok(html.includes('Illustrative model'));assert.ok(html.includes('synthetic/agent-run-output.txt'));
  const ai=csvFiles(record).find(f=>f.name==='ai_si_profiles.csv');assert.ok(ai.text.includes('Fictional model provider'));assert.ok(ai.text.includes('output_selection_policy'));
  record.process.components[0].profile.agent=null;
  assert.ok(htmlReport(record).includes('No orchestration agent — direct model use'));
  assert.ok(csvFiles(record).find(f=>f.name==='ai_si_profiles.csv').text.includes('direct-model'));
  record.process.components[0].profile.agent=original.agent;
  assert.deepEqual(JSON.parse(serialize(record)).process.components[0].profile,original);
});
