import {clone, lines, uid, review, serialize, schemaErrors, profileErrors, validateRecord, equal,
  sha256, verifyCandidate, freezeCandidate, compare, synchronizeScope, gap, safeName, csvFiles, htmlReport} from './model.mjs';
import {openWorkspaceStore} from './storage.mjs';
import {aiProfileSections, aiFieldId, emptyAIProfile, reusableProcess} from './ai-profile.mjs';

const $ = id => document.getElementById(id);
const root = $('reporting-app');
const base = new URL(root.dataset.base, location.href);
const resource = path => new URL(path, base).href;
let schema, profileSchema, catalog, cases, templates;
let current = null, candidate = null, candidateText = null, expectations = null, store = null;
let componentId = null, ruleId = null, artifactId = null, resultId = null, resultKind = null;
let aiEditingProfile = null;
let saveTimer, saving = Promise.resolve(), revision = 0, persistedRevision = 0, downloadedRevision = 0, storageEnabled = true;
const dirty = new Set();
const csvURLs = [];
const el = (tag, text, attrs = {}) => {
  const node = document.createElement(tag);
  if (text !== null && text !== undefined) node.textContent = text;
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
};
function action(id, event, callback) {
  $(id).addEventListener(event, e => {
    if (event === 'submit') e.preventDefault();
    Promise.resolve().then(() => callback(e)).catch(error => showErrors([error.message]));
  });
}
function announce(text) { $('reporting-status').textContent = text; }
function clearErrors() {
  $('reporting-errors').hidden = true;
  root.querySelectorAll('[aria-invalid]').forEach(node => { node.removeAttribute('aria-invalid'); node.removeAttribute('aria-errormessage'); });
  root.querySelectorAll('.reporting-inline-error').forEach(node => node.remove());
}
function showErrors(errors) {
  clearErrors();
  const box = $('reporting-errors');
  box.replaceChildren(el('h2', 'Check these items'), el('p', 'Your workspace has been retained. Correct the items below and try again.'));
  const list = el('ul');
  for (const text of errors) {
    const li = el('li');
    const match = text.match(/record\.(run|process|environment)\.([a-z_]+)/);
    const id = match ? `${match[1] === 'environment' ? 'env' : match[1]}-${match[2]}` : null;
    const aiPath = text.startsWith('record.') ? text.match(/\.profile\.([^:]+):/)?.[1] : null;
    let target = aiPath && [...root.querySelectorAll('[data-ai-profile-path]')].find(input => input.dataset.aiProfilePath === aiPath);
    target ||= id && $(id);
    if (target) {
      target.setAttribute('aria-invalid', 'true');
      const errorId = `${target.id}-error`;
      target.setAttribute('aria-errormessage', errorId);
      if (!$(errorId)) target.after(el('p', text, {id: errorId, class: 'usa-error-message reporting-inline-error'}));
    } else target = $(/rule|component|mapping|process/i.test(text) ? 'process-section' : /result|evidence|comparison/i.test(text) ? 'results-section' : /scope|target|case|artifact|procedure/i.test(text) ? 'scope-section' : 'run-section');
    const link = el('a', text, {href: `#${target.id}`});
    link.addEventListener('click', () => {
      for (let node = target.parentElement; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
      if (target.matches('input,select,textarea')) target.focus();
    });
    li.append(link); list.append(li);
  }
  box.append(list); box.hidden = false; box.focus();
}
function pending() {
  if (dirty.size) throw new Error(`Save or clear pending edits first: ${[...dirty].join(', ')}.`);
}
function onlyPending(name) {
  if ([...dirty].some(item => item !== name)) throw new Error('Save or clear the other pending form edits first.');
}
function editable() {
  if (!current || current.lifecycle === 'final' || current.candidate_freeze) throw new Error('Start a new run to change this locked record.');
}
function confirmReplace() {
  return !current || window.confirm('Replace this workspace? Download JSON first if you need to keep it. Browser autosave keeps only one workspace.');
}
function field(container, id, label, {type = 'text', value = '', options = [], required = false, hint = '', multiple = false} = {}) {
  const wrap = el('div', null, {class: 'reporting-field'});
  if (type === 'radio') {
    const set = el('fieldset', null, {class: 'usa-fieldset'}); set.append(el('legend', label, {class: 'usa-legend'}));
    options.forEach(([v, name], index) => {
      const row = el('div', null, {class: 'usa-radio'});
      const input = el('input', null, {id: `${id}-${index}`, name: id, type: 'radio', value: v, class: 'usa-radio__input'});
      input.checked = v === value;
      row.append(input, el('label', name, {for: input.id, class: 'usa-radio__label'})); set.append(row);
    }); wrap.append(set); container.append(wrap); return set;
  }
  wrap.append(el('label', label, {class: 'usa-label', for: id}));
  const input = el(type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input', null, {id,
    class: type === 'textarea' ? 'usa-textarea' : type === 'select' ? 'usa-select' : 'usa-input'});
  if (type === 'textarea') input.rows = 3;
  else if (type !== 'select') input.type = type;
  if (type === 'select') {
    for (const [v, name] of options) input.append(el('option', name, {value: v}));
    if (multiple) { input.multiple = true; input.size = Math.min(8, Math.max(3, options.length)); }
  }
  if (multiple) for (const option of input.options) option.selected = value.includes(option.value);
  else input.value = value ?? '';
  input.required = required;
  if (hint) {
    const help = el('p', hint, {id: `${id}-hint`, class: 'usa-hint'});
    input.setAttribute('aria-describedby', help.id); wrap.append(help);
  }
  wrap.append(input); container.append(wrap); return input;
}
const values = id => [...$(id).selectedOptions].map(o => o.value);
const value = id => $(id).value.trim();
const pairs = array => array.map(value => [value, value]);
const statuses = pairs(['pass','fail','not-applicable','not-tested','incomplete']);
const reviewStatuses = pairs(['pending','in-progress','completed','not-applicable']);
function table(containerId, caption, columns, rows) {
  const container = $(containerId); container.replaceChildren();
  if (!rows.length) { container.append(el('p', 'None recorded.')); return; }
  const scroll = el('div', null, {class: 'reporting-table-scroll', tabindex: '0', role: 'region', 'aria-label': caption});
  const t = el('table', null, {class: 'usa-table'}); t.append(el('caption', caption));
  const head = el('thead'); const hr = el('tr'); columns.forEach(c => hr.append(el('th', c, {scope: 'col'}))); head.append(hr); t.append(head);
  const body = el('tbody');
  for (const cells of rows) {
    const row = el('tr');
    cells.forEach((item, index) => {
      const cell = el(index === 0 ? 'th' : 'td', null, index === 0 ? {scope: 'row'} : {});
      if (item instanceof Node) cell.append(item); else cell.textContent = item;
      row.append(cell);
    }); body.append(row);
  }
  t.append(body); scroll.append(t); container.append(scroll);
}
function buttons(...definitions) {
  const group = el('div', null, {class: 'reporting-actions'});
  for (const [name, callback, locked = false, accessibleName = name] of definitions) {
    const button = el('button', name, {type: 'button', class: 'usa-button usa-button--unstyled'});
    if (accessibleName !== name) button.setAttribute('aria-label', accessibleName);
    button.disabled = locked;
    button.addEventListener('click', () => Promise.resolve().then(callback).catch(error => showErrors([error.message])));
    group.append(button);
  }
  return group;
}
function download(text, filename, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = el('a', filename, {href: url, download: filename}); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function readFile(input) {
  const file = input.files[0];
  if (!file) throw new Error('Choose a file first.');
  if (file.size > 10 * 1024 * 1024) throw new Error('This file exceeds the 10 MB import limit.');
  return file.text();
}
async function getJSON(path) {
  const response = await fetch(resource(path));
  if (!response.ok) throw new Error(`Could not load ${path}. Serve the Jekyll build through HTTP and try again.`);
  return response.json();
}
function recordErrors(record = current) {
  return validateRecord(record, schema, catalog, cases, {candidate, expectations});
}
function valid(record = current) {
  const errors = recordErrors(record);
  if (errors.length) { showErrors(errors); return false; }
  clearErrors(); return true;
}
function saveSoon() {
  clearTimeout(saveTimer);
  $('save-status').textContent = store && storageEnabled ? 'Changes waiting for browser autosave…' : 'Browser autosave unavailable. Download JSON to keep your work.';
  const snapshotRevision = ++revision;
  saveTimer = setTimeout(() => {
    if (!store || !storageEnabled || !current) return;
    const snapshot = {record: clone(current), candidate_text: candidateText};
    saving = saving.catch(() => {}).then(() => store.write(snapshot)).then(() => {
      persistedRevision = Math.max(persistedRevision, snapshotRevision);
      if (revision === snapshotRevision) $('save-status').textContent = `Saved in this browser at ${new Date().toLocaleTimeString()}. Download JSON for a backup.`;
      $('resume').disabled = false; $('clear-saved').disabled = false;
    }).catch(() => { $('save-status').textContent = 'Browser autosave failed. Download JSON to keep your work.'; });
  }, 350);
}
function changed() {
  csvURLs.splice(0).forEach(url => URL.revokeObjectURL(url)); $('csv-downloads').replaceChildren();
  saveSoon(); renderSummary();
}
function renderSummary() {
  const label = current.purpose === 'process-evaluation' ? 'Web test process evaluation' : `${current.scope.domain} artifact report`;
  const rows = current.results.filter(r => r.kind === 'process-determination');
  $('record-summary').textContent = `${label} · ${current.lifecycle} · ${current.record_kind} · ${rows.length} determinations; ${rows.filter(r => r.status === 'not-tested').length} not tested. Human review: ${current.human_review.status}.`;
}
function localDate(iso) {
  if (!iso) return '';
  const d = new Date(iso); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
}
function metadata() {
  $('run-fields').replaceChildren();
  field($('run-fields'), 'run-id', 'Run ID', {value: current.run.id, required: true});
  field($('run-fields'), 'run-stage', 'Run stage', {type: 'select', value: current.run.stage, options: pairs(['initial','rerun','remediated'])});
  field($('run-fields'), 'run-status', 'Run status', {type: 'select', value: current.run.status, options: pairs(['planned','in-progress','completed','stopped'])});
  const performed = field($('run-fields'), 'run-performed_at', 'Testing date and time', {type: 'datetime-local', value: localDate(current.run.performed_at), hint: 'Enter your local time. The saved record uses UTC. Leave empty if testing has not occurred.'}); performed.step = '1';
  $('environment-fields').replaceChildren();
  const listFields = new Set(['assistive_technologies','input_methods','tools','additional_conditions']);
  for (const key of Object.keys(schema.properties.environment.anyOf[0].properties)) {
    const text = current.environment?.[key];
    field($('environment-fields'), `env-${key}`, key.replaceAll('_', ' '), {type: listFields.has(key) ? 'textarea' : 'text', value: Array.isArray(text) ? text.join('\n') : text ?? '', hint: listFields.has(key) ? 'One entry per line. Leave empty when none apply.' : ''});
  }
  $('process-fields').replaceChildren();
  for (const [key, name] of [['name','Process name'],['version','Process version'],['owner','Process owner'],['description','Description'],['decision_rules','Decision rules'],['reporting_conventions','Reporting conventions']]) {
    field($('process-fields'), `process-${key}`, name, {type: ['description','decision_rules','reporting_conventions'].includes(key) ? 'textarea' : 'text', value: Array.isArray(current.process[key]) ? current.process[key].join('\n') : current.process[key], hint: Array.isArray(current.process[key]) ? 'One entry per line.' : ''});
  }
  $('review-fields').replaceChildren();
  field($('review-fields'), 'review-status', 'Human review status', {type: 'select', value: current.human_review.status, options: reviewStatuses});
  field($('review-fields'), 'review-reviewers', 'Reviewers', {type: 'textarea', value: current.human_review.reviewers.join('\n'), hint: 'One reviewer per line.'});
  field($('review-fields'), 'review-pending', 'Pending human review work', {type: 'textarea', value: current.human_review.pending_work.join('\n')});
  field($('review-fields'), 'review-limitations', 'Run limitations', {type: 'textarea', value: current.limitations.join('\n'), hint: 'One limitation per line.'});
}
function readMetadata() {
  if (!current || current.lifecycle === 'final' || current.candidate_freeze) return;
  const before = serialize(current);
  current.run.id = value('run-id') || 'draft-run';
  current.run.stage = value('run-stage'); current.run.status = value('run-status');
  current.run.performed_at = value('run-performed_at') ? new Date(value('run-performed_at')).toISOString() : null;
  const defaults = {name: 'Untitled process', version: 'unversioned-draft', owner: 'unassigned', description: 'Draft process definition; configure before execution.'};
  for (const key of ['name','version','owner','description']) current.process[key] = value(`process-${key}`) || defaults[key];
  for (const key of ['decision_rules','reporting_conventions']) current.process[key] = lines($(`process-${key}`).value);
  const env = {};
  let supplied = false;
  for (const key of Object.keys(schema.properties.environment.anyOf[0].properties)) {
    const input = $(`env-${key}`); if (input.value.trim()) supplied = true;
    env[key] = input.tagName === 'TEXTAREA' ? lines(input.value) : input.value.trim() || 'not-recorded';
  }
  current.environment = supplied ? env : null;
  current.human_review.status = value('review-status'); current.human_review.reviewers = lines($('review-reviewers').value);
  current.human_review.pending_work = lines($('review-pending').value); current.limitations = lines($('review-limitations').value);
  if (before !== serialize(current)) changed();
}
function componentEditor(component = null) {
  componentId = component?.id ?? null;
  const c = $('component-fields'); c.replaceChildren();
  for (const [key, name] of [['name','Component name'],['version','Component version'],['configuration','Configuration'],['limitations','Limitations']]) {
    field(c, `component-${key}`, name, {type: ['configuration','limitations'].includes(key) ? 'textarea' : 'text', value: Array.isArray(component?.[key]) ? component[key].join('\n') : component?.[key] ?? '', required: key !== 'limitations'});
  }
  field(c, 'component-type', 'Component type', {type: 'select', options: pairs(schema.$defs.component.properties.type.enum), value: component?.type || 'manual-procedure'});
  aiProfileEditor(component);
  dirty.delete('component');
}
function aiProfileEditor(component) {
  $('component-ai-profile')?.remove();
  const stored = component?.profile;
  const typed = stored && schemaErrors(stored, schema.$defs['ai-si-profile'], schema).length === 0;
  const profile = typed ? stored : emptyAIProfile();
  aiEditingProfile = clone(profile);
  const box = el('fieldset', null, {id:'component-ai-profile',class:'usa-fieldset'});
  box.append(el('legend','AI/SI component profile',{class:'usa-legend'}));
  box.append(el('p','Describe the configuration actually used. Text fields are required unless labeled optional. If an instruction layer or setting is not used or unavailable, state that explicitly with its basis. Use controlled references or redacted descriptions instead of secrets.'));
  if (stored && !typed) box.append(el('p','The existing custom profile is retained for other component types. Saving as AI/SI replaces it with the structured fields below.',{class:'usa-hint'}));
  const direct = el('input',null,{id:'ai-direct-model',type:'checkbox',class:'usa-checkbox__input'});
  direct.checked = !!typed && profile.agent === null;
  const directWrap = el('div',null,{class:'usa-checkbox'});
  directWrap.append(direct,el('label','No orchestration agent — direct model use',{for:direct.id,class:'usa-checkbox__label'}));
  box.append(directWrap);
  const agent = el('fieldset',null,{id:'ai-agent-fields',class:'usa-fieldset'});
  agent.append(el('legend','Agent identity',{class:'usa-legend'}));
  const agentGrid = el('div',null,{class:'reporting-grid'});
  for (const [key,label] of [['provider','Agent provider or maintainer'],['name','Agent name'],['version','Agent version or dated identifier']]) {
    const input = field(agentGrid,aiFieldId('agent',key),label,{value:profile.agent?.[key] || '',required:true});
    input.dataset.aiProfilePath = `agent.${key}`;
  }
  agent.append(agentGrid); box.append(agent);
  for (const [group,label,fields] of aiProfileSections) {
    const details = el('details',null,{class:'reporting-details'}); details.open = group === 'model';
    details.append(el('summary',label));
    const grid = el('div',null,{class:'reporting-grid'});
    for (const [key,name,type] of fields) {
      const list = type === 'list', optional = list || type === 'optional-text';
      const input = field(grid,aiFieldId(group,key),`${name}${optional ? ' (optional)' : ''}`,{
        type:group === 'model' ? 'text' : 'textarea',value:list ? profile[group][key].join('\n') : profile[group][key],
        required:!optional,hint:list ? 'One entry per line; leave empty when none apply.' : group === 'instructions' ? 'Record the instructions or a controlled reference and version. Explain when this layer is not used.' : ''});
      input.dataset.aiProfilePath = `${group}.${key}`;
    }
    details.append(grid);
    if (group === 'output_retention') {
      details.append(el('p','Retain original agent/model outputs separately from reviewer conclusions. Final observed AI/SI results require an original-output reference or an explicit reason why outputs are unavailable. Hashes are optional. No files are fetched or uploaded.'));
      const outputs = el('div',null,{id:'ai-outputs'}); details.append(outputs);
      for (const output of profile.output_retention.original_outputs) addAIOutput(outputs,output);
      const add = el('button','Add original-output reference',{id:'ai-add-output',type:'button',class:'usa-button usa-button--outline'});
      add.addEventListener('click', () => { const input=addAIOutput(outputs); dirty.add('component'); input.focus(); });
      details.append(add);
    }
    box.append(details);
  }
  const limits = field(box,'ai-capability-limits','Known capability limits',{type:'textarea',value:profile.capability_limits.join('\n'),required:true,hint:'One entry per line. Describe actual limits or explicitly explain why none have been identified for this scope.'});
  limits.dataset.aiProfilePath = 'capability_limits';
  $('component-fields').after(box);
  const toggleAgent = () => { agent.hidden = direct.checked; agent.disabled = direct.checked; };
  const toggle = () => {
    const active = value('component-type') === 'ai-si-tool';
    const wasHidden = box.hidden;
    box.hidden = !active; box.disabled = !active; toggleAgent();
    if (active && wasHidden) announce('AI/SI profile fields are available below the component type. Required text fields must be completed before saving.');
  };
  direct.addEventListener('input',toggleAgent);
  $('component-type').addEventListener('input',toggle);
  toggle();
}
function addAIOutput(container, output = {path_or_url:'',sha256:null}) {
  const row = el('fieldset',null,{class:'usa-fieldset reporting-details','data-ai-output':''});
  row.append(el('legend','Original-output reference',{class:'usa-legend'}));
  const id = uid('ai-output');
  const path = field(row,`${id}-path`,'Original output file or URL reference',{value:output.path_or_url,required:true});
  path.dataset.aiOutputPath = '';
  const hash = field(row,`${id}-sha`,'Output SHA-256 (optional)',{value:output.sha256 || '',hint:'64 lowercase hexadecimal characters. Leave empty when a hash is unavailable.'});
  hash.dataset.aiOutputSha = ''; hash.pattern = '[0-9a-f]{64}';
  const remove = el('button','Remove this output reference',{type:'button',class:'usa-button usa-button--unstyled'});
  remove.addEventListener('click',()=>{row.remove();updateAIOutputPaths(container);dirty.add('component');});
  row.append(remove); container.append(row); updateAIOutputPaths(container); return path;
}
function updateAIOutputPaths(container) {
  container.querySelectorAll('[data-ai-output]').forEach((row,index)=>{
    row.querySelector('[data-ai-output-path]').dataset.aiProfilePath = `output_retention.original_outputs[${index}].path_or_url`;
    row.querySelector('[data-ai-output-sha]').dataset.aiProfilePath = `output_retention.original_outputs[${index}].sha256`;
  });
}
function readAIProfile() {
  const profile = emptyAIProfile();
  profile.agent = $('ai-direct-model').checked ? null : Object.fromEntries(['provider','name','version'].map(key=>[key,$(aiFieldId('agent',key)).value]));
  for (const [group,,fields] of aiProfileSections) for (const [key,,type] of fields) {
    const raw = $(aiFieldId(group,key)).value, original = aiEditingProfile[group][key];
    const rendered = Array.isArray(original) ? original.join('\n') : original ?? '';
    profile[group][key] = raw === rendered ? clone(original) : type === 'list' ? lines(raw) : type === 'optional-text' && !raw.trim() ? null : raw;
  }
  profile.output_retention.original_outputs = [...$('ai-outputs').querySelectorAll('[data-ai-output]')].map(row=>({
    path_or_url:row.querySelector('[data-ai-output-path]').value,sha256:row.querySelector('[data-ai-output-sha]').value.trim() || null}));
  const limits = $('ai-capability-limits').value;
  profile.capability_limits = limits === aiEditingProfile.capability_limits.join('\n') ? clone(aiEditingProfile.capability_limits) : lines(limits); return profile;
}
function ruleEditor(rule = null) {
  ruleId = rule?.id ?? null;
  const c = $('rule-fields'); c.replaceChildren();
  field(c, 'rule-component', 'Component', {type: 'select', options: current.process.components.map(c => [c.id, `${c.name} (${c.id})`]), value: rule?.component_id || current.process.components[0].id});
  for (const [key,name] of [['name','Rule or procedure name'],['external_id','Original rule or procedure ID'],['version','Rule version'],['source','Source URL or reference (optional)']]) field(c, `rule-${key}`, name, {value: rule?.[key] ?? '', required: key !== 'source'});
  const mapped = current.process.mappings.filter(m => m.rule_ids.includes(ruleId));
  field(c, 'rule-targets', 'Targets addressed', {type: 'select', multiple: true, value: mapped.map(m => m.target_id), options: catalog.domains[current.scope.domain].targets.map(t => [t.id, `${t.name} — ${t.track}`]), hint: 'Select one or more. With a keyboard, use your platform’s multi-select keys (for example Shift or Control/Command with arrow/selection keys).'});
  field(c, 'rule-coverage', 'Coverage claim', {type: 'select', value: mapped[0]?.coverage || 'contributes', options: [['contributes','Contributes selected checks'],['claimed-complete','Claims complete procedure coverage — requires review']]});
  field(c, 'rule-rationale', 'Mapping rationale', {type: 'textarea', value: mapped[0]?.rationale || '', required: true});
  field(c, 'rule-limitations', 'Mapping limitations', {type: 'textarea', value: mapped[0]?.limitations.join('\n') || ''});
  dirty.delete('rule');
}
function artifactEditor(artifact = null) {
  artifactId = artifact?.id ?? null;
  const c = $('artifact-fields'); c.replaceChildren();
  field(c, 'artifact-path', 'Delivered URL or file reference', {value: artifact?.path_or_url ?? '', required: true});
  field(c, 'artifact-format', 'Format', {type: 'select', options: pairs(current.scope.domain === 'web' ? ['html','other'] : ['pdf','docx','xlsx','pptx','other']), value: artifact?.format || (current.scope.domain === 'web' ? 'html' : 'pdf')});
  field(c, 'artifact-sha', 'SHA-256 (optional)', {value: artifact?.sha256 || '', hint: '64 lowercase hexadecimal characters. Record dependencies through imported JSON if required.'});
  dirty.delete('artifact');
}
function renderProcess() {
  const locked = current.lifecycle === 'final' || !!current.candidate_freeze;
  table('components-list','Process components',['Component','Type / version','Configuration','Actions'],current.process.components.map(c => [c.name, `${c.type} / ${c.version}`, c.configuration,
    buttons([`Edit ${c.name}`, () => { pending(); editable(); componentEditor(c); $('component-details').open = true; $('component-name').focus(); }, locked],
      [`Remove ${c.name}`, () => {
        pending(); editable();
        if (current.process.components.length === 1 || current.process.rules.some(r => r.component_id === c.id) || current.results.some(r => r.component_ids.includes(c.id))) throw new Error('Keep at least one component. Remove its rule/result references before removing it.');
        current.process.components = current.process.components.filter(item => item.id !== c.id); render(); changed();
      }, locked]) ]));
  table('rules-list','Process rules and mappings',['Rule / external ID','Component','Targets / coverage','Actions'],current.process.rules.map(r => [ `${r.name} / ${r.external_id}`, current.process.components.find(c => c.id === r.component_id)?.name || r.component_id,
    current.process.mappings.filter(m => m.rule_ids.includes(r.id)).map(m => `${m.target_id} (${m.coverage})`).join('; '),
    buttons([`Edit ${r.external_id}`, () => { pending(); editable(); ruleEditor(r); $('rule-details').open = true; $('rule-name').focus(); }, locked],
      [`Remove ${r.external_id}`, () => {
        pending(); editable();
        if (current.results.some(row => row.rule_ids.includes(r.id))) throw new Error('This rule is used by recorded results. Keep it or change those references first.');
        current.process.rules = current.process.rules.filter(item => item.id !== r.id);
        current.process.mappings = current.process.mappings.map(m => ({...m, rule_ids: m.rule_ids.filter(id => id !== r.id)})).filter(m => m.rule_ids.length);
        render(); changed();
      }, locked]) ]));
}
function checkbox(container, name, id, label, checked) {
  const wrap = el('div', null, {class: 'usa-checkbox'});
  const input = el('input', null, {class: 'usa-checkbox__input', type: 'checkbox', name, id: uid('check'), value: id}); input.checked = checked;
  wrap.append(input, el('label', label, {for: input.id, class: 'usa-checkbox__label'})); container.append(wrap);
}
function checked(name) { return [...root.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value); }
function renderScope() {
  $('scope-type').value = current.scope.evaluation_type; $('scope-rationale').value = current.scope.selection_rationale || '';
  const process = current.purpose === 'process-evaluation';
  $('cases-panel').hidden = !process; $('artifact-details').hidden = process;
  $('scope-boundary').textContent = process ? 'Web cases only. Procedures without available cases remain coverage gaps. Parsing is retained as no test required.' : 'Choose the procedures and supplemental checks to record for each artifact. Parsing is retained as no test required.';
  const targets = catalog.domains[current.scope.domain].targets.filter(t => !process || t.track === 'section508-baseline');
  $('targets-list').replaceChildren();
  for (const track of [...new Set(targets.map(t => t.track))]) {
    const group = el('div', null, {class: 'reporting-target-group'}); group.append(el('h4', track.replaceAll('-', ' ')));
    for (const t of targets.filter(t => t.track === track)) checkbox(group, 'target', t.id, t.name, current.scope.target_ids.includes(t.id));
    $('targets-list').append(group);
  }
  $('cases-list').replaceChildren();
  if (process) for (const c of cases) checkbox($('cases-list'), 'case', c.case_id, `${c.case_id} — ${c.procedure_keys.join(', ')}`, current.scope.selected_case_ids.includes(c.case_id));
  $('coverage-summary').textContent = `${current.scope.target_ids.length} selected targets. ${current.scope.selected_case_ids.length} selected Web cases. ${current.scope.uncovered_procedures.length} selected targets recorded as uncovered. A missing case is not a pass or an applicability exception.`;
  filterCases(); renderArtifacts(); dirty.delete('scope');
}
function filterCases() {
  const query = $('case-search').value.toLowerCase(); let shown = 0;
  $('cases-list').querySelectorAll('.usa-checkbox').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); if (!row.hidden) shown++; });
  $('case-filter-status').textContent = `${shown} Web cases shown. Filtering keeps existing selections.`;
}
function renderArtifacts() {
  const locked = current.lifecycle === 'final' || !!current.candidate_freeze || current.purpose === 'process-evaluation';
  table('artifacts-list','Artifacts and Framework samples',['Artifact','Domain / format','Cases','Actions'],current.artifacts.map(a => [a.path_or_url, `${a.domain} / ${a.format}`, a.case_ids.join(', ') || 'User content',
    buttons([`Edit ${a.path_or_url}`, () => { pending(); editable(); artifactEditor(a); $('artifact-details').open = true; $('artifact-path').focus(); }, locked],
      [`Remove ${a.path_or_url}`, () => {
        pending(); editable();
        if (current.results.some(r => r.artifact_id === a.id && (r.status !== 'not-tested' || r.evidence_ids.length))) throw new Error('This artifact has recorded work. Keep it or start a separate run.');
        current.results = current.results.filter(r => r.artifact_id !== a.id); current.artifacts = current.artifacts.filter(row => row.id !== a.id);
        render(); changed();
      }, locked]) ]));
}
function renderResults() {
  const query = $('result-search').value.toLowerCase();
  const rows = current.results.filter(r => `${r.artifact_id} ${current.artifacts.find(a => a.id === r.artifact_id)?.path_or_url} ${r.target_id} ${r.case_id || ''} ${r.status} ${r.kind}`.toLowerCase().includes(query));
  $('result-count').textContent = `${rows.length} of ${current.results.length} result rows shown. Component observations and process determinations are listed separately.`;
  const locked = current.lifecycle === 'final' || !!current.candidate_freeze;
  table('results-list','Recorded observations and process determinations',['Artifact / case','Target','Kind','Outcome / review','Actions'], rows.map(r => [
    `${current.artifacts.find(a => a.id === r.artifact_id)?.path_or_url || r.artifact_id}${r.case_id ? ` / ${r.case_id}` : ''}`, r.target_id, r.kind, `${r.status} / ${r.review.status}`,
    buttons([locked ? 'View' : 'Edit', () => editResult(r), false, `${locked ? 'View' : 'Edit'} ${r.kind} for ${r.target_id} on ${r.case_id || current.artifacts.find(a => a.id === r.artifact_id)?.path_or_url || r.artifact_id}`]) ]));
  $('results-list').querySelectorAll('tbody tr').forEach((row, index) => { row.querySelector('button').dataset.resultId = rows[index].id; });
}
function focusResult(id) {
  const button = [...$('results-list').querySelectorAll('button')].find(b => b.dataset.resultId === id);
  (button || $('add-observation')).focus();
}
function editResult(row = null) {
  if (dirty.size && !window.confirm('Discard the unsaved form edits before opening this result?')) return;
  if (dirty.size) { dirty.clear(); componentEditor(); ruleEditor(); artifactEditor(); renderScope(); }
  if (!current.artifacts.length || !current.scope.target_ids.length) throw new Error('Select scope and add artifacts before recording observations.');
  resultId = row?.id ?? null; resultKind = row?.kind || 'component-observation';
  const c = $('result-fields'); c.replaceChildren();
  field(c, 'result-artifact', 'Artifact or Framework sample', {type: 'select', options: current.artifacts.map(a => [a.id, `${a.path_or_url}${a.case_ids.length ? ` / ${a.case_ids.join(', ')}` : ''}`]), value: row?.artifact_id || current.artifacts[0].id});
  field(c, 'result-target', 'Target', {type: 'select', options: current.scope.target_ids.map(id => [id,id]), value: row?.target_id || current.scope.target_ids[0]});
  if (row) { $('result-artifact').disabled = true; $('result-target').disabled = true; }
  field(c, 'result-status', 'Observed outcome', {type: 'radio', value: row?.status || 'not-tested', options: statuses});
  field(c, 'result-components', 'Contributing components', {type: 'select', multiple: true, value: row?.component_ids || [], options: current.process.components.map(c => [c.id,c.name]), hint: 'Use multi-select keys to retain all contributors.'});
  field(c, 'result-rules', 'Rules or procedures used', {type: 'select', multiple: true, value: row?.rule_ids || [], options: current.process.rules.map(r => [r.id, `${r.external_id} — ${r.name}`]), hint: 'Select rules mapped to this target. Their component owners are attributed automatically.'});
  if (resultKind === 'process-determination') {
    const observations = current.results.filter(r => r.kind === 'component-observation' && r.artifact_id === row.artifact_id && r.target_id === row.target_id && r.case_id === row.case_id);
    field(c, 'result-observations', 'Component observations supporting this determination', {type: 'select', multiple: true, value: row.observation_ids, options: observations.map(r => [r.id, `${r.status} — ${r.rationale} (${r.id})`]), hint: 'Preserve disagreements and explain the final decision. Contributors are added to this determination.'});
  }
  field(c, 'result-rationale', 'Observation and rationale', {type: 'textarea', value: row?.rationale || 'No observation has been recorded.', required: true});
  const location = row?.locations[0];
  field(c, 'result-location-kind', 'Location type', {type: 'select', value: location?.kind || 'whole-artifact', options: pairs(schema.$defs.location.properties.kind.enum)});
  field(c, 'result-location', 'Affected location (optional)', {value: location?.value || '', hint: 'For example a selector, document page, worksheet/cell, slide, or scope description. Additional imported locations are preserved.'});
  field(c, 'result-state', 'Page or document state (optional)', {value: location?.state || ''});
  field(c, 'result-evidence', 'Existing evidence', {type: 'select', multiple: true, value: row?.evidence_ids || [], options: current.evidence.map(e => [e.id, `${e.description} (${e.id})`])});
  field(c, 'result-evidence-description', 'Add evidence description (optional)', {type: 'textarea', hint: 'Describe the action and observation. Referenced screenshots or files are not uploaded.'});
  field(c, 'result-evidence-path', 'New evidence file or URL reference (optional)');
  field(c, 'result-limitations', 'Result limitations', {type: 'textarea', value: row?.limitations.join('\n') || ''});
  field(c, 'result-review', 'Result human review status', {type: 'select', value: row?.review.status || 'pending', options: reviewStatuses});
  field(c, 'result-reviewers', 'Result reviewers', {type: 'textarea', value: row?.review.reviewers.join('\n') || '', hint: 'One reviewer per line. Completed review requires a reviewer.'});
  $('result-editor-title').textContent = `${current.lifecycle === 'final' || current.candidate_freeze ? 'View' : 'Edit'} ${resultKind.replaceAll('-', ' ')}${row ? ` ${row.id}` : ''}`;
  $('result-editor').hidden = false; $('result-dirty').textContent = 'Result changes take effect when you choose Save result.';
  lock(); $('result-editor-title').focus(); dirty.delete('result');
}
function lock() {
  const locked = current.lifecycle === 'final' || !!current.candidate_freeze;
  root.querySelectorAll('[data-editable]').forEach(f => { f.disabled = locked; });
  $('locked-notice').hidden = !locked;
  for (const id of ['manual-rules','add-observation','finalize']) $(id).disabled = locked;
  // Keep enhanced file inputs enabled. USWDS initializes their disabled styling
  // once; visibility communicates workflow eligibility without stale widget state.
  $('profile-import-fields').hidden = locked;
  $('evaluator-panel').hidden = current.purpose !== 'process-evaluation';
  $('freeze').disabled = !!current.candidate_freeze;
  $('compare').disabled = !current.candidate_freeze || !candidate;
  $('candidate-verification-fields').hidden = !current.candidate_freeze || !!candidate;
  $('verification-prerequisite').hidden = !!current.candidate_freeze;
  $('download-candidate').hidden = !candidateText;
  $('freeze-status').textContent = current.candidate_freeze ? `Frozen SHA-256: ${current.candidate_freeze.sha256}. ${candidate ? 'Candidate verified in this session.' : 'Choose the original candidate file to verify it.'}` : 'No candidate frozen. Finalize before freezing.';
}
function renderComparisons() {
  table('comparisons-list','Evaluator comparisons',['Result','Expected','Comparison','Evaluator'],current.case_comparisons.map(c => [c.result_id,c.expected_status,c.comparison,c.evaluator]));
}
function render() {
  $('workspace').hidden = false; metadata(); componentEditor(); ruleEditor(); artifactEditor(); renderProcess(); renderScope();
  renderResults(); renderComparisons(); $('result-editor').hidden = true; resultId = null; resultKind = null; dirty.clear();
  renderSummary(); lock();
}
async function loadRecord(record, text = null) {
  const errors = schemaErrors(record, schema);
  if (errors.length) throw new Error(`Cannot reopen this record: ${errors.slice(0, 5).join('; ')}`);
  const verified = text && record.candidate_freeze ? await verifyCandidate(record, text) : null;
  current = clone(record); candidate = verified; candidateText = verified ? text : null; expectations = null;
  clearErrors(); render(); changed();
  $('record-summary').focus();
  announce('Record opened. Check scope, environment, and review status before using its results.');
}

action('start-form','change', () => { $('domain-choice').hidden = $('purpose-process').checked; });
action('start-form','submit', async () => {
  pending(); if (!confirmReplace()) return;
  const process = $('purpose-process').checked; const domain = process ? 'web' : value('start-domain');
  const record = clone(templates[process ? 'process' : 'artifact']);
  record.record_kind = $('start-illustrative').checked ? 'illustrative' : 'actual';
  record.run.id = uid('run'); record.process.id = uid('process');
  record.scope.domain = domain; record.baselines = [clone(catalog.domains[domain].baseline)];
  record.scope.dispositions = clone(catalog.domains[domain].dispositions);
  if (process) record.suite = clone(catalog.suite);
  await loadRecord(record); $('run-id').focus();
});
action('import-record','change', async () => {
  if (!$('import-record').files.length) return;
  try { pending(); const text = await readFile($('import-record')); if (!confirmReplace()) return; await loadRecord(JSON.parse(text)); }
  finally { $('import-record').value = ''; }
});
action('resume','click', async () => {
  pending(); if (!confirmReplace()) return;
  const snapshot = await store.read(); if (!snapshot) throw new Error('No browser autosave is available.');
  await loadRecord(snapshot.record, snapshot.candidate_text);
});
action('clear-saved','click', async () => {
  if (!window.confirm('Delete the browser autosave? Download JSON first if you need to keep it. The open workspace will remain in memory until you leave.')) return;
  clearTimeout(saveTimer); storageEnabled = false; revision++; await saving.catch(() => {}); await store.remove();
  $('resume').disabled = true; $('clear-saved').disabled = true;
  $('save-status').textContent = 'Browser autosave deleted and paused for this session. Download JSON to retain further work.';
});
for (const id of ['metadata-form','process-form','review-form']) {
  action(id,'input', readMetadata);
  action(id,'submit', () => { readMetadata(); announce('Run information updated.'); });
}
for (const name of ['component','rule','artifact','result','scope']) action(`${name}-form`,'input', event => {
  if (name === 'scope' && event.target.id === 'case-search') return;
  dirty.add(name);
  if (name === 'result') $('result-dirty').textContent = 'Unsaved result edits. Choose Save result or Cancel result edits.';
});
action('component-new','click', () => { componentEditor(); announce('Component editor cleared.'); });
$('component-form').addEventListener('invalid',event=>{
  for (let node=event.target.parentElement;node;node=node.parentElement) if (node.tagName==='DETAILS') node.open=true;
},true);
action('rule-new','click', () => { ruleEditor(); announce('Rule editor cleared.'); });
action('artifact-new','click', () => { artifactEditor(); announce('Artifact editor cleared.'); });
action('component-form','submit', () => {
  editable(); onlyPending('component'); const copy = clone(current); const existing = copy.process.components.find(c => c.id === componentId);
  const component = {...existing, id: componentId || uid('component'), name: value('component-name'), version: value('component-version'), type: value('component-type'), configuration: value('component-configuration'), limitations: lines($('component-limitations').value), procedures_addressed: existing?.procedures_addressed || [], profile: value('component-type') === 'ai-si-tool' ? readAIProfile() : existing?.profile || null};
  if (existing) Object.assign(existing,component); else copy.process.components.push(component);
  if (!valid(copy)) return; current = copy; dirty.delete('component'); componentEditor(); renderProcess(); ruleEditor(); changed(); announce('Component saved.');
});
action('rule-form','submit', () => {
  editable(); onlyPending('rule'); const targets = values('rule-targets'); if (!targets.length) throw new Error('Select at least one target for this rule.');
  const copy = clone(current); const id = ruleId || uid('rule');
  const rule = {id, component_id: value('rule-component'), external_id: value('rule-external_id'), name: value('rule-name'), version: value('rule-version'), source: value('rule-source') || null};
  const index = copy.process.rules.findIndex(r => r.id === id); if (index >= 0) copy.process.rules[index] = rule; else copy.process.rules.push(rule);
  copy.process.mappings = copy.process.mappings.map(m => ({...m, rule_ids: m.rule_ids.filter(rid => rid !== id)})).filter(m => m.rule_ids.length);
  for (const target of targets) copy.process.mappings.push({id: uid('mapping'), rule_ids: [id], target_id: target, coverage: value('rule-coverage'), rationale: value('rule-rationale'), limitations: lines($('rule-limitations').value), review: review()});
  const owner = copy.process.components.find(c => c.id === rule.component_id);
  owner.procedures_addressed = [...new Set([...owner.procedures_addressed, ...targets])];
  if (!valid(copy)) return; current = copy; ruleEditor(); renderProcess(); changed(); announce('Rule and mappings saved.');
});
action('manual-rules','click', () => {
  pending(); editable(); if (!current.scope.target_ids.length) throw new Error('Apply a target selection first.');
  const copy = clone(current);
  let manual = copy.process.components.find(c => c.type === 'manual-procedure');
  if (!manual) {
    manual = {id: uid('manual'), name: 'Manual review', type: 'manual-procedure', version: '1', configuration: 'Direct manual testing against the selected procedures.', procedures_addressed: [], limitations: [], profile: null}; copy.process.components.push(manual);
  }
  if (manual.version === 'unversioned-draft') manual.version = copy.process.version;
  if (manual.configuration === 'Not configured.') manual.configuration = 'Direct manual testing against the selected procedures; record actions and evidence for each result.';
  for (const target of copy.scope.target_ids) {
    if (copy.process.rules.some(r => r.component_id === manual.id && copy.process.mappings.some(m => m.rule_ids.includes(r.id) && m.target_id === target))) continue;
    const id = uid('manual-rule'); copy.process.rules.push({id, component_id: manual.id, external_id: target, name: `Manual procedure ${target}`, version: copy.process.version, source: catalog.domains[copy.scope.domain].targets.find(t => t.id === target)?.url || null});
    copy.process.mappings.push({id: uid('mapping'), rule_ids: [id], target_id: target, coverage: 'contributes', rationale: 'Manual procedure selected by the tester; actual execution and coverage require recorded evidence.', limitations: [], review: review()});
  }
  manual.procedures_addressed = [...new Set([...manual.procedures_addressed, ...copy.scope.target_ids])];
  current = copy; renderProcess(); ruleEditor(); changed(); announce('Manual rule definitions added. No tests have been marked as executed.');
});
action('export-profile','click', () => {
  pending(); const profile = {schema_version: '1.0.0', process: reusableProcess(current.process)};
  const errors = [...schemaErrors(profile, profileSchema, schema), ...profileErrors(profile.process,catalog)];
  if (errors.length) return showErrors(errors);
  download(serialize(profile), `${safeName(current.process.name)}-profile.json`);
});
action('import-profile','change', async () => {
  if (!$('import-profile').files.length) return;
  try {
    editable(); pending(); if (current.results.some(r => r.status !== 'not-tested' || r.component_ids.length || r.rule_ids.length || r.evidence_ids.length)) throw new Error('Import a process profile before recording observations, or start a new run.');
    const profile = JSON.parse(await readFile($('import-profile')));
    const errors = schemaErrors(profile,profileSchema,schema); if (errors.length) return showErrors(errors);
    errors.push(...profileErrors(profile.process,catalog)); if (errors.length) return showErrors(errors);
    if (!window.confirm('Replace this run’s process definition with the imported profile? Per-run AI/SI output references will be cleared; configuration and retention policies will be kept.')) return;
    current.process = reusableProcess(profile.process); render(); changed(); announce('Process profile copied into this run. Per-run AI/SI output references cleared.');
  } finally { $('import-profile').value = ''; }
});
action('select-baseline','click', () => {
  editable(); const ids = new Set(catalog.domains[current.scope.domain].targets.filter(t => t.track === 'section508-baseline').map(t => t.id));
  root.querySelectorAll('input[name="target"]').forEach(input => { if (ids.has(input.value)) input.checked = true; }); dirty.add('scope');
});
action('clear-targets','click', () => { editable(); root.querySelectorAll('input[name="target"]').forEach(input => { input.checked = false; }); dirty.add('scope'); });
action('select-cases','click', () => {
  editable(); const targets = checked('target');
  root.querySelectorAll('input[name="case"]').forEach(input => { input.checked = cases.find(c => c.case_id === input.value).procedure_keys.some(id => targets.includes(id)); }); dirty.add('scope');
});
action('case-search','input', filterCases);
action('cancel-scope','click', () => { editable(); renderScope(); announce('Scope selection reset to the saved record.'); });
action('scope-form','submit', () => {
  editable(); if ([...dirty].some(name => name !== 'scope')) throw new Error('Save or clear other pending form edits before applying scope.');
  const copy = synchronizeScope(current,checked('target'),current.purpose === 'process-evaluation' ? checked('case') : [],cases);
  copy.scope.evaluation_type = value('scope-type'); copy.scope.selection_rationale = value('scope-rationale') || null;
  if (!valid(copy)) return; current = copy; renderScope(); renderResults(); changed(); announce('Scope applied. Unperformed checks remain not tested.');
});
action('artifact-form','submit', () => {
  editable(); onlyPending('artifact'); const copy = clone(current); const existing = copy.artifacts.find(a => a.id === artifactId);
  const artifact = {...existing, id: artifactId || uid('artifact'), domain: copy.scope.domain, format: value('artifact-format'), path_or_url: value('artifact-path'), sha256: value('artifact-sha') || null, case_ids: [], dependencies: existing?.dependencies || []};
  if (existing) Object.assign(existing,artifact); else copy.artifacts.push(artifact);
  const synced = synchronizeScope(copy,copy.scope.target_ids,[],cases);
  if (!valid(synced)) return; current = synced; artifactEditor(); renderArtifacts(); renderResults(); changed(); announce('Artifact saved.');
});
action('result-search','input', renderResults);
action('add-observation','click', () => { editable(); editResult(); });
action('cancel-result','click', () => { dirty.delete('result'); $('result-editor').hidden = true; focusResult(resultId); announce('Result editor closed; unsaved edits discarded.'); });
action('result-form','submit', () => {
  editable(); onlyPending('result'); const copy = clone(current); const original = copy.results.find(r => r.id === resultId);
  const artifact = copy.artifacts.find(a => a.id === value('result-artifact'));
  const row = original || gap(artifact,value('result-target'),copy.purpose === 'process-evaluation' ? artifact.case_ids[0] : null);
  row.kind = resultKind;
  row.status = root.querySelector('input[name="result-status"]:checked').value;
  row.completeness = row.status === 'not-tested' ? 'not-started' : row.status === 'incomplete' ? 'partial' : 'complete';
  row.rule_ids = values('result-rules'); row.component_ids = values('result-components');
  for (const id of row.rule_ids) row.component_ids.push(copy.process.rules.find(r => r.id === id).component_id);
  row.observation_ids = resultKind === 'process-determination' ? values('result-observations') : [];
  for (const id of row.observation_ids) {
    const observation = copy.results.find(r => r.id === id); row.component_ids.push(...observation.component_ids); row.rule_ids.push(...observation.rule_ids);
  }
  row.rule_ids = [...new Set(row.rule_ids)]; row.component_ids = [...new Set(row.component_ids)];
  row.rationale = value('result-rationale'); row.limitations = lines($('result-limitations').value);
  const location = value('result-location');
  if (location) row.locations = [{kind: value('result-location-kind'), value: location, state: value('result-state') || null},...row.locations.slice(1)];
  else row.locations = row.locations.slice(1);
  row.evidence_ids = values('result-evidence');
  const description = value('result-evidence-description'), path = value('result-evidence-path');
  if (path && !description) throw new Error('Describe the new evidence before adding a file or URL reference.');
  if (description) { const evidence = {id: uid('evidence'),description,path_or_url: path || null,sha256: null}; copy.evidence.push(evidence); row.evidence_ids.push(evidence.id); }
  row.review = {...row.review,status: value('result-review'),reviewers: lines($('result-reviewers').value)};
  if (!original) copy.results.push(row);
  if (!valid(copy)) return; current = copy; dirty.delete('result'); $('result-editor').hidden = true; renderResults(); focusResult(row.id); changed(); announce('Result saved.');
});
action('validate-record','click', () => { pending(); readMetadata(); if (valid()) announce('Record structure and relationships checked. This does not execute accessibility tests or establish conformance.'); });
action('finalize','click', () => {
  pending(); readMetadata(); editable();
  const copy = clone(current); copy.lifecycle = 'final';
  if (!copy.environment || Object.values(copy.environment).some(v => v === 'not-recorded')) throw new Error('Record the actual environment, with explained non-applicability where needed, before finalizing.');
  if (['unassigned'].includes(copy.process.owner) || copy.process.name === 'Untitled process' || copy.process.version === 'unversioned-draft' || copy.process.description.startsWith('Draft process definition;')) throw new Error('Enter the actual process name, version, owner, and description before finalizing.');
  if (copy.process.components.some(c => c.version === 'unversioned-draft' || c.configuration === 'Not configured.') || copy.process.rules.some(r => r.version === 'unversioned-draft')) throw new Error('Replace draft component/rule versions and component configuration before finalizing.');
  if (copy.limitations.includes('Draft only; no tests have been executed.')) throw new Error('Review and replace or remove the template limitation before finalizing. Retain any actual gaps and limitations.');
  if (!valid(copy)) return; current = copy; render(); changed(); $('record-summary').focus(); announce('Record finalized. Unperformed checks and pending human review remain visible.');
});
action('rerun','click', async () => {
  pending(); if (!confirmReplace()) return;
  const record = clone(current); record.lifecycle = 'draft'; record.run = {id: uid('run'),stage: 'rerun',performed_at: null,status: 'planned',prior_run_id: current.run.id};
  record.process = reusableProcess(record.process);
  record.results = record.results.filter(r => r.kind === 'process-determination').map(r => gap(record.artifacts.find(a => a.id === r.artifact_id),r.target_id,r.case_id));
  record.evidence = []; record.case_comparisons = []; record.candidate_freeze = null; record.human_review = review();
  record.limitations = ['New run; previous observations and comparisons have not been carried forward.'];
  await loadRecord(record); $('run-id').focus();
});
action('freeze','click', async () => {
  pending(); if (current.lifecycle !== 'final') throw new Error('Finalize the candidate record before freezing it. Explicit untested gaps may remain.');
  if (!valid()) return;
  const frozen = await freezeCandidate(current); current = frozen.record; candidate = frozen.candidate; candidateText = frozen.text;
  download(candidateText,current.candidate_freeze.path_or_url); lock(); changed(); $('freeze-status').focus(); announce('Candidate frozen and downloaded. Keep this exact file for future verification.');
});
action('download-candidate','click', () => download(candidateText,current.candidate_freeze.path_or_url));
action('verify-candidate','change', async () => {
  if (!$('verify-candidate').files.length) return;
  try {
    if (!current?.candidate_freeze) throw new Error('Reopen the evaluator JSON record containing the frozen candidate hash before selecting the candidate file.');
    const text = await readFile($('verify-candidate'));
    candidate = await verifyCandidate(current,text); candidateText = text;
    lock(); changed(); $('freeze-status').focus();
    announce('Frozen candidate hash and contents verified. Evaluator expectations have not been loaded.');
  }
  finally { $('verify-candidate').value = ''; }
});
action('compare','click', async () => {
  pending(); if (!candidate || !current.candidate_freeze) throw new Error('Freeze or verify the candidate before loading evaluator expectations.');
  if (!value('evaluator-name')) throw new Error('Enter the evaluator name.');
  const response = await fetch(resource('evaluations/evaluator/expected-outcomes.yaml'));
  if (!response.ok) throw new Error('Evaluator expectations could not be loaded.');
  const text = await response.text();
  if (await sha256(text) !== current.suite.expectations_sha256) throw new Error('Expectation file hash differs from this run’s pin.');
  expectations = JSON.parse(text);
  const compared = compare(current,expectations,value('evaluator-name'));
  if (!valid(compared)) return; current = compared; renderComparisons(); changed(); announce('Evaluator comparison recorded. Source expectation review is still separate.');
});
for (const [button, kind] of [['export-json','json'],['export-csv','csv'],['export-html','html']]) action(button,'click', () => {
  pending(); readMetadata(); if (!valid()) return;
  const name = safeName(current.run.id);
  if (kind === 'json') { download(serialize(current),`${name}.json`); downloadedRevision = revision; }
  if (kind === 'html') download(htmlReport(current),`${name}.html`,'text/html');
  if (kind === 'csv') {
    csvURLs.splice(0).forEach(url => URL.revokeObjectURL(url)); $('csv-downloads').replaceChildren();
    for (const file of csvFiles(current)) {
      const url = URL.createObjectURL(new Blob([file.text],{type: 'text/csv;charset=utf-8'})); csvURLs.push(url);
      const li = el('li');
      const link = el('a',`Download ${file.name}`,{href: url,download: `${name}-${file.name}`});
      link.addEventListener('click', event => { if (dirty.size) { event.preventDefault(); showErrors(['Save or clear pending form edits before downloading CSV.']); } });
      li.append(link); $('csv-downloads').append(li);
    }
    announce('CSV files prepared. Use the download links below the export buttons.');
  }
});
window.addEventListener('beforeunload', event => {
  if (dirty.size || (current && revision > persistedRevision && revision > downloadedRevision)) { event.preventDefault(); event.returnValue = ''; }
});

try {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.randomUUID) throw new Error('Open this tool using HTTPS or a localhost server so browser integrity checks are available.');
  const loaded = await Promise.all([getJSON('evaluations/results-schema.json'),getJSON('evaluations/process-profile-schema.json'),getJSON('assets/reporting/catalog.json'),getJSON('assets/baselineTestCases-candidate.json'),getJSON('evaluations/result-template.json'),getJSON('evaluations/templates/artifact-report.json')]);
  [schema,profileSchema,catalog] = loaded; cases = loaded[3].cases; templates = {process: loaded[4],artifact: loaded[5]};
  if (!catalog?.domains?.web || !cases?.length) throw new Error('Reporting build data is missing. Restart Jekyll after adding the generator plugin.');
  try { store = await openWorkspaceStore(base.pathname); if (await store.read()) { $('resume').disabled = false; $('clear-saved').disabled = false; } }
  catch { announce('Browser autosave is unavailable. Download JSON regularly.'); }
  $('start-fields').disabled = false; $('record-import-fields').hidden = false;
  announce(store ? 'Ready. Create, reopen, or restore a record.' : 'Ready. Browser autosave unavailable; use JSON downloads to keep your work.');
} catch (error) { showErrors([error.message]); announce('Reporting resources could not be loaded. Your saved downloads have not been changed.'); }
