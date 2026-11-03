// Shared browser/Node logic. No network, DOM, or storage side effects.
export const clone = value => structuredClone(value);
export const lines = text => text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
export const uid = prefix => `${prefix}-${crypto.randomUUID()}`;
const canonical = value => JSON.stringify(value, (_key, item) => item && !Array.isArray(item) && typeof item === 'object'
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
export const equal = (a, b) => canonical(a) === canonical(b);
export const review = () => ({status: 'pending', reviewers: [], evidence_ids: [], pending_work: []});
export const serialize = record => `${JSON.stringify(record, null, 2)}\n`;
export async function sha256(text) {
  const bytes = typeof text === 'string' ? new TextEncoder().encode(text) : text;
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
}

// Implements the constraints used by the repository's two schemas. Unknown schema
// references fail closed. Schema/relationship parity is exercised against Python.
export function schemaErrors(value, schema, root = schema, path = 'record') {
  const errors = [];
  const error = message => errors.push(`${path}: ${message}`);
  if (schema.$ref) {
    const fragment = schema.$ref.replace(/^results-schema\.json/, '');
    if (!fragment.startsWith('#/')) return [`${path}: unsupported schema reference`];
    const target = fragment.slice(2).split('/').reduce((node, key) => node?.[key], root);
    return target ? schemaErrors(value, target, root, path) : [`${path}: unresolved schema reference`];
  }
  if ('const' in schema && !equal(value, schema.const)) error(`must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some(item => equal(item, value))) error(`choose ${schema.enum.join(', ')}`);
  if (schema.type) {
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (![schema.type].flat().includes(type)) return [...errors, `${path}: must be ${[schema.type].flat().join(' or ')}`];
  }
  if (schema.anyOf) {
    const branches = schema.anyOf.map(s => schemaErrors(value, s, root, path));
    if (branches.every(messages => messages.length)) {
      const valueType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
      const matching = schema.anyOf.map((s,index)=>[s,index]).filter(([s])=>[s.type].flat().includes(valueType));
      if (matching.length === 1) errors.push(...branches[matching[0][1]]);
      else error('does not match an allowed value/structure');
    }
  }
  for (const entry of schema.allOf || []) errors.push(...schemaErrors(value, entry, root, path));
  if (schema.if) {
    const branch = schemaErrors(value, schema.if, root, path).length ? schema.else : schema.then;
    if (branch) errors.push(...schemaErrors(value, branch, root, path));
  }
  if (typeof value === 'string') {
    if (schema.minLength && [...value].length < schema.minLength) error('must not be empty');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) error('has an invalid format');
    if (schema.format === 'date-time') {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i);
      if (!match || !Number.isFinite(Date.parse(value)) || +match[2] < 1 || +match[2] > 12 ||
          +match[3] < 1 || +match[3] > new Date(Date.UTC(+match[1], +match[2], 0)).getUTCDate() ||
          +match[4] > 23 || +match[5] > 59 || +match[6] > 59) error('use a valid ISO date/time with timezone');
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) error(`needs at least ${schema.minItems} item(s)`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) error(`allows at most ${schema.maxItems} item(s)`);
    if (schema.uniqueItems && new Set(value.map(canonical)).size !== value.length) error('contains duplicate values');
    if (schema.items) value.forEach((item, i) => errors.push(...schemaErrors(item, schema.items, root, `${path}[${i}]`)));
  } else if (value !== null && typeof value === 'object') {
    for (const key of schema.required || []) if (!(key in value)) error(`missing ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...schemaErrors(item, schema.properties[key], root, `${path}.${key}`));
      else if (schema.additionalProperties === false) error(`unexpected field ${key}`);
    }
  }
  return [...new Set(errors)];
}

export function profileErrors(process, catalog) {
  const errors = [];
  const check = (ok, message) => { if (!ok) errors.push(message); };
  const index = (rows, name) => {
    check(new Set(rows.map(r => r.id)).size === rows.length, `Duplicate ${name} ID.`);
    return new Map(rows.map(r => [r.id, r]));
  };
  const components = index(process.components, 'component');
  const rules = index(process.rules, 'rule');
  index(process.mappings, 'mapping');
  const targets = new Set(Object.values(catalog.domains).flatMap(d => [...d.targets.map(t => t.id), ...d.procedures.map(t => t.id)]));
  for (const rule of rules.values()) check(components.has(rule.component_id), `Rule ${rule.id}: unknown component.`);
  for (const component of components.values()) check(component.procedures_addressed.every(id => targets.has(id)), `Component ${component.id}: unknown target.`);
  for (const mapping of process.mappings) {
    check(mapping.rule_ids.every(id => rules.has(id)), `Mapping ${mapping.id}: unknown rule.`);
    check(targets.has(mapping.target_id), `Mapping ${mapping.id}: unknown target.`);
    check(mapping.review.status !== 'completed' || mapping.review.reviewers.length, `Mapping ${mapping.id}: completed review needs a reviewer.`);
  }
  return errors;
}

export function validateRecord(record, schema, catalog, cases, {candidate = null, expectations = null} = {}) {
  const structural = schemaErrors(record, schema);
  if (structural.length) return structural;
  const errors = profileErrors(record.process, catalog);
  const check = (ok, message) => { if (!ok) errors.push(message); };
  const index = (rows, name) => {
    check(new Set(rows.map(row => row.id)).size === rows.length, `Duplicate ${name} ID.`);
    return new Map(rows.map(row => [row.id, row]));
  };
  const domain = catalog.domains[record.scope.domain];
  const targets = new Set(domain.targets.map(t => t.id));
  const active = domain.targets.filter(t => t.track === 'section508-baseline').map(t => t.id);
  const procedures = new Map(domain.procedures.map(p => [p.id, p]));
  const selected = new Set(record.scope.selected_case_ids);
  const scope = new Set(record.scope.target_ids);
  check(record.baselines.length === 1 && equal(record.baselines[0], domain.baseline), 'Baseline version/source differs from this build.');
  check([...scope].every(id => targets.has(id)), 'Scope contains an unknown or inactive target.');
  check(record.scope.uncovered_procedures.every(id => scope.has(id)), 'Uncovered targets must be in scope.');
  const dispositionIds = record.scope.dispositions.map(d => d.target_id);
  check(new Set(dispositionIds).size === dispositionIds.length, 'Duplicate disposition.');
  for (const d of record.scope.dispositions) {
    check(procedures.has(d.target_id) && !scope.has(d.target_id), 'Disposition must reference an unselected procedure in this domain.');
    if (['no-test-required','not-separately-tested-at-AA'].includes(d.disposition)) check(procedures.get(d.target_id)?.disposition === d.disposition, 'Invalid retained source disposition.');
  }
  check(record.scope.dispositions.some(d => d.target_id === `${record.scope.domain}:24.A-Parsing` && d.disposition === 'no-test-required'), 'Retain the Parsing no-test-required disposition.');
  const caseMap = new Map(cases.map(c => [c.case_id, c]));
  for (const id of selected) check(caseMap.has(id) && caseMap.get(id).procedure_keys.some(t => scope.has(t)), `Case ${id}: unknown case or no selected target.`);
  if (record.purpose === 'process-evaluation') {
    check(equal(record.suite, catalog.suite), 'Suite identity or manifest/expectation pin differs from this build.');
    check([...scope].every(id => active.includes(id)), 'Process evaluation supports active Web Baseline procedures only.');
  }
  const components = new Map(record.process.components.map(c => [c.id, c]));
  const rules = new Map(record.process.rules.map(r => [r.id, r]));
  const artifacts = index(record.artifacts, 'artifact');
  const evidence = index(record.evidence, 'evidence');
  const results = index(record.results, 'result');
  index(record.case_comparisons, 'comparison');
  for (const a of artifacts.values()) {
    check(a.domain === record.scope.domain, `Artifact ${a.id}: wrong domain.`);
    for (const id of a.case_ids) check(selected.has(id) && a.sha256 === caseMap.get(id)?.sample_sha256, `Artifact ${a.id}: case/hash differs from manifest.`);
  }
  const determinations = new Set();
  const key = row => canonical([row.artifact_id, row.target_id, row.case_id]);
  for (const row of results.values()) {
    const prefix = `Result ${row.id}: `;
    check(artifacts.has(row.artifact_id), prefix + 'unknown artifact.');
    check(scope.has(row.target_id), prefix + 'target is outside scope.');
    check(row.component_ids.every(id => components.has(id)), prefix + 'unknown component.');
    check(row.rule_ids.every(id => rules.has(id)), prefix + 'unknown rule.');
    check(row.evidence_ids.every(id => evidence.has(id)), prefix + 'unknown evidence.');
    for (const id of row.rule_ids) {
      check(row.component_ids.includes(rules.get(id)?.component_id), prefix + 'rule owner must be attributed.');
      check(record.process.mappings.some(m => m.rule_ids.includes(id) && m.target_id === row.target_id), prefix + 'rule is not mapped to target.');
    }
    if (record.purpose === 'process-evaluation') {
      check(selected.has(row.case_id) && artifacts.get(row.artifact_id)?.case_ids.includes(row.case_id) &&
        caseMap.get(row.case_id)?.procedure_keys.includes(row.target_id), prefix + 'case, artifact and target do not agree.');
    }
    if (['pass','fail','not-applicable'].includes(row.status)) check(row.completeness === 'complete', prefix + 'decisive outcome needs complete execution of the recorded check.');
    if (row.status === 'not-tested') check(row.completeness === 'not-started' && !row.observation_ids.length, prefix + 'not-tested cannot claim execution.');
    if (row.kind === 'component-observation') check(row.component_ids.length && !row.observation_ids.length, prefix + 'observation needs components and cannot aggregate observations.');
    else {
      check(!determinations.has(key(row)), prefix + 'duplicate determination; use another run for retesting.');
      determinations.add(key(row));
      for (const id of row.observation_ids) {
        const observed = results.get(id);
        check(observed?.kind === 'component-observation' && key(observed) === key(row), prefix + 'contributing observation belongs to another artifact, target or case.');
        if (observed) check(observed.component_ids.every(id => row.component_ids.includes(id)) && observed.rule_ids.every(id => row.rule_ids.includes(id)), prefix + 'missing contributing component/rule attribution.');
      }
    }
    check(row.review.status !== 'completed' || row.review.reviewers.length, prefix + 'completed review needs a reviewer.');
    check(row.review.evidence_ids.every(id => evidence.has(id)), prefix + 'unknown review evidence.');
    if (record.lifecycle === 'final' && ['pass','fail','not-applicable'].includes(row.status)) check(row.component_ids.length && row.evidence_ids.length, prefix + 'final observed outcome needs attribution and evidence.');
  }
  check(record.human_review.evidence_ids.every(id => evidence.has(id)), 'Unknown run-review evidence.');
  check(record.human_review.status !== 'completed' || (record.human_review.reviewers.length && !record.human_review.pending_work.length), 'Completed run review needs reviewers and no pending work.');
  if (record.lifecycle === 'final') {
    for (const component of components.values()) {
      if (component.type === 'ai-si-tool' && record.results.some(r => r.component_ids.includes(component.id) && r.status !== 'not-tested')) {
        check(component.profile.output_retention.original_outputs.length || component.profile.output_retention.unavailable_reason,
          `AI/SI component ${component.id}: final observed results need original-output references or an explicit unavailability reason.`);
      }
    }
    check(record.process.rules.length && record.process.mappings.length, 'Define process rules and target mappings before finalizing.');
    if (record.scope.evaluation_type === 'full-process') check(active.every(id => scope.has(id) || dispositionIds.includes(id)), 'Full-process scope must account for every active Baseline procedure.');
    if (record.purpose === 'artifact-report') {
      for (const a of artifacts.values()) for (const target of scope) check(determinations.has(canonical([a.id, target, null])), `Retain a determination or explicit gap for ${a.id} / ${target}.`);
    } else {
      check(selected.size, 'Final process evaluation needs selected cases.');
      const represented = new Set([...selected].flatMap(id => caseMap.get(id)?.procedure_keys || []));
      check([...scope].every(id => represented.has(id) || record.scope.uncovered_procedures.includes(id)), 'Selected procedure lacks case evidence or an explicit coverage gap.');
      for (const cid of selected) for (const target of caseMap.get(cid)?.procedure_keys || []) if (scope.has(target)) {
        check([...results.values()].some(r => r.kind === 'process-determination' && r.case_id === cid && r.target_id === target), `Missing determination or explicit gap for ${cid} / ${target}.`);
      }
    }
  }
  if (record.candidate_freeze) {
    check(candidate !== null, 'Verify the original frozen candidate file before issuing this evaluator record.');
    if (candidate) check(equal(candidate, candidateProjection(record)), 'Candidate fields changed after freeze.');
  }
  const compared = new Set();
  for (const c of record.case_comparisons) {
    const row = results.get(c.result_id);
    check(row?.kind === 'process-determination', `Comparison ${c.id}: select a process determination.`);
    check(!compared.has(c.result_id), 'Duplicate comparison.'); compared.add(c.result_id);
    check(c.expectation_version === record.suite?.expectations_sha256, 'Comparison expectation version differs.');
    if (expectations && row) check(c.expected_status === expectations.outcomes.find(e => e.case_id === row.case_id)?.expected_status, 'Comparison expected outcome differs from pinned expectations.');
    else check(false, 'Load and verify evaluator expectations before issuing comparisons.');
    if (c.comparison !== 'not-compared') check(row && ['pass','fail','not-applicable'].includes(row.status) && c.comparison === (row.status === c.expected_status ? 'matched' : 'mismatched'), 'Comparison contradicts candidate result or claims an unperformed match.');
  }
  return [...new Set(errors)];
}

export function candidateProjection(record) {
  return {...clone(record), case_comparisons: [], candidate_freeze: null};
}
export async function verifyCandidate(record, text) {
  if (!record.candidate_freeze) throw new Error('This record has no candidate freeze.');
  if (await sha256(text) !== record.candidate_freeze.sha256) throw new Error('Frozen candidate hash differs. Select the exact original download.');
  const candidate = JSON.parse(text);
  if (!equal(candidate, candidateProjection(record))) throw new Error('Candidate fields changed after freeze.');
  return candidate;
}
export async function freezeCandidate(record) {
  if (record.purpose !== 'process-evaluation' || record.candidate_freeze || record.case_comparisons.length) throw new Error('Freeze an un-compared process evaluation.');
  const text = serialize(record);
  const frozen = clone(record);
  frozen.candidate_freeze = {path_or_url: `${safeName(record.run.id)}-candidate.json`, sha256: await sha256(text),
    frozen_at: new Date().toISOString(), isolation: 'public-inputs-outcome-bearing',
    transformations: ['Public IDs and sample names retained; outcome-bearing naming has not been neutralized.']};
  return {record: frozen, candidate: clone(record), text};
}
export function compare(record, expectations, evaluator) {
  if (!record.candidate_freeze || !evaluator.trim()) throw new Error('Freeze the candidate and identify the evaluator first.');
  const answers = new Map(expectations.outcomes.map(e => [e.case_id, e]));
  const copy = clone(record);
  copy.case_comparisons = copy.results.filter(r => r.kind === 'process-determination').map(row => {
    const answer = answers.get(row.case_id);
    if (!answer) throw new Error(`No expectation for ${row.case_id}.`);
    return {id: uid('comparison'), result_id: row.id, expected_status: answer.expected_status,
      comparison: ['pass','fail','not-applicable'].includes(row.status) ? row.status === answer.expected_status ? 'matched' : 'mismatched' : 'not-compared',
      expectation_version: copy.suite.expectations_sha256, evaluator: evaluator.trim(),
      rationale: 'Compared against the pinned source expectation; expectation review remains separate from this comparison.'};
  });
  return copy;
}
export function gap(artifact, target, caseId = null) {
  return {id: uid('result'), kind: 'process-determination', artifact_id: artifact.id, target_id: target,
    case_id: caseId, status: 'not-tested', completeness: 'not-started', component_ids: [], rule_ids: [],
    observation_ids: [], locations: [], evidence_ids: [], rationale: 'No observation has been recorded.', limitations: [], review: review()};
}
export function synchronizeScope(record, targetIds, caseIds, cases) {
  const copy = clone(record);
  const allowed = row => targetIds.includes(row.target_id) && (copy.purpose === 'artifact-report' || caseIds.includes(row.case_id));
  if (copy.results.some(row => !allowed(row) && (row.status !== 'not-tested' || row.evidence_ids.length || row.observation_ids.length))) {
    throw new Error('This scope change would remove recorded work. Keep those targets/cases or start a new run.');
  }
  copy.scope.target_ids = [...new Set(targetIds)]; copy.scope.selected_case_ids = [...new Set(caseIds)];
  copy.results = copy.results.filter(allowed);
  if (copy.purpose === 'process-evaluation') {
    copy.artifacts = copy.artifacts.filter(a => a.case_ids.some(id => caseIds.includes(id)));
    for (const cid of caseIds) {
      const c = cases.find(c => c.case_id === cid);
      if (!c || !c.procedure_keys.some(id => targetIds.includes(id))) throw new Error(`Case ${cid} needs its procedure selected.`);
      let artifact = copy.artifacts.find(a => a.case_ids.includes(cid));
      if (!artifact) {
        artifact = {id: uid('sample'), domain: 'web', format: 'html', path_or_url: c.sample_url,
          sha256: c.sample_sha256, case_ids: [cid], dependencies: []};
        copy.artifacts.push(artifact);
      }
      for (const target of c.procedure_keys.filter(id => targetIds.includes(id))) {
        if (!copy.results.some(r => r.kind === 'process-determination' && r.case_id === cid && r.target_id === target)) copy.results.push(gap(artifact, target, cid));
      }
    }
    const represented = new Set(cases.filter(c => caseIds.includes(c.case_id)).flatMap(c => c.procedure_keys));
    copy.scope.uncovered_procedures = targetIds.filter(id => !represented.has(id));
  } else {
    for (const artifact of copy.artifacts) for (const target of targetIds) {
      if (!copy.results.some(r => r.kind === 'process-determination' && r.artifact_id === artifact.id && r.target_id === target)) copy.results.push(gap(artifact, target));
    }
    copy.scope.uncovered_procedures = copy.scope.uncovered_procedures.filter(id => targetIds.includes(id));
  }
  return copy;
}
export function safeName(value) { return value.replace(/[^a-z0-9_-]/gi, '-').slice(0, 80) || 'baseline-report'; }
const cell = value => {
  let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function csv(rows, columns = [...new Set(rows.flatMap(row => Object.keys(row)))]) {
  return [columns.map(cell).join(','), ...rows.map(row => columns.map(key => cell(row[key])).join(','))].join('\r\n') + '\r\n';
}
export function csvFiles(record) {
  const files = [];
  for (const [key, value] of Object.entries(record)) {
    const rows = Array.isArray(value) ? value.map(item => item !== null && typeof item === 'object' && !Array.isArray(item) ? item : {value: item}) : [{[key]: value}];
    const columns = rows.length ? undefined : ['id'];
    files.push({name: `${key}.csv`, text: csv(rows, columns)});
  }
  const aiProfiles = record.process.components.filter(c => c.type === 'ai-si-tool').map(c => ({component_id:c.id,component_name:c.name,agent_mode:c.profile.agent === null ? 'direct-model' : 'orchestrated',...c.profile}));
  if (aiProfiles.length) files.push({name:'ai_si_profiles.csv',text:csv(aiProfiles)});
  return files;
}
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label = value => value.replaceAll('_', ' ');
function detail(value) {
  if (value === null) return '<span>Not recorded</span>';
  if (Array.isArray(value)) return value.length ? `<ul>${value.map(v => `<li>${detail(v)}</li>`).join('')}</ul>` : '<span>None recorded</span>';
  if (typeof value === 'object') return `<dl>${Object.entries(value).map(([k,v]) => `<dt>${escapeHTML(label(k))}</dt><dd>${detail(v)}</dd>`).join('')}</dl>`;
  return `<span>${escapeHTML(value)}</span>`;
}
export function htmlReport(record) {
  const title = record.purpose === 'process-evaluation' ? 'Web test process evaluation' : 'Accessibility test results';
  const rows = record.results.filter(r => r.kind === 'process-determination');
  const counts = ['pass','fail','not-applicable','not-tested','incomplete'].map(status => `${status}: ${rows.filter(r => r.status === status).length}`).join('; ');
  const aiProfiles = record.process.components.filter(c => c.type === 'ai-si-tool');
  const aiSection = aiProfiles.length ? `<h2>AI/SI component profiles</h2><p>Configuration, supplied context, access, repeatability, original-output references, isolation, and human responsibility recorded for each AI/SI component. These descriptions do not prove independent execution or completed human review.</p>${aiProfiles.map(c => `<h3>${escapeHTML(c.name)}</h3>${detail({...c.profile,agent:c.profile.agent ?? 'No orchestration agent — direct model use'})}`).join('')}` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)} — ${escapeHTML(record.run.id)}</title><style>body{font:1rem/1.6 system-ui,sans-serif;color:#1b1b1b;max-width:76rem;margin:auto;padding:1.5rem}h1,h2,h3{line-height:1.3}table{border-collapse:collapse;width:100%;min-width:42rem}caption{text-align:left;font-weight:bold;padding:.5rem 0}th,td{border:1px solid #767676;padding:.6rem;text-align:left;vertical-align:top;overflow-wrap:anywhere}th{background:#eee}.table-scroll{overflow:auto}dt{font-weight:bold}dd{margin:0 0 .6rem 1rem;white-space:pre-wrap;overflow-wrap:anywhere}li{overflow-wrap:anywhere}.notice{border-left:.4rem solid #005ea2;padding:1rem;background:#eef5fa}a:focus,summary:focus{outline:3px solid #005ea2}summary{cursor:pointer}@media(max-width:40rem){body{padding:.75rem}}@media print{body{max-width:none;padding:0}details{display:block}details>*{display:block}}</style></head><body><main><h1>${escapeHTML(title)}</h1><p class="notice"><strong>${escapeHTML(record.lifecycle.toUpperCase())} · ${escapeHTML(record.record_kind.toUpperCase())}</strong>. Selected checks and Framework comparisons do not establish whole-artifact conformance, certification, or complete Baseline alignment.</p><h2>Run and scope</h2><p>Run: ${escapeHTML(record.run.id)}. Process: ${escapeHTML(record.process.name)} (${escapeHTML(record.process.version)}). Domain: ${escapeHTML(record.scope.domain)}. Human review: ${escapeHTML(record.human_review.status)}.</p><p>${escapeHTML(record.scope.selection_rationale || 'Selection rationale not recorded.')}</p><h2>Results</h2><p>Process determinations only: ${escapeHTML(counts)}. Component observations are retained in the complete record below and are not added to these counts.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Results table"><table><caption>Process determinations for selected artifacts and targets</caption><thead><tr><th scope="col">Artifact / case</th><th scope="col">Target</th><th scope="col">Outcome</th><th scope="col">Review</th><th scope="col">Rationale</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${escapeHTML(record.artifacts.find(a => a.id === r.artifact_id)?.path_or_url || r.artifact_id)}${r.case_id ? `<br>${escapeHTML(r.case_id)}` : ''}</th><td>${escapeHTML(r.target_id)}</td><td>${escapeHTML(r.status)} (${escapeHTML(r.completeness)})</td><td>${escapeHTML(r.review.status)}</td><td>${escapeHTML(r.rationale)}</td></tr>`).join('')}</tbody></table></div><h2>Coverage and review gaps</h2>${detail({uncovered_procedures: record.scope.uncovered_procedures, dispositions: record.scope.dispositions, human_review: record.human_review, limitations: record.limitations})}<h2>Framework comparisons</h2>${detail(record.case_comparisons)}${aiSection}<h2>Complete record</h2><p>Includes component observations, process mappings, artifacts, locations, evidence references, environment, and version pins. Referenced attachments are not embedded.</p>${detail(record)}</main></body></html>`;
}
