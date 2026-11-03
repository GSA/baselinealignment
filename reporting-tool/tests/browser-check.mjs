// Optional local Chrome smoke test; no npm dependencies. See the maintainer README.
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile, access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {aiProfileSections, aiFieldId} from '../../assets/js/reporting/ai-profile.mjs';

const site = process.argv[2] || 'http://127.0.0.1:8765/baselinealignment/';
const debug = process.env.REPORTING_CHROME_DEBUG || 'http://127.0.0.1:9228';
const output = resolve(process.env.REPORTING_BROWSER_OUTPUT || '/private/tmp/baseline-reporting-browser-check',String(Date.now()));
const root = resolve(import.meta.dirname,'../..');
await mkdir(output,{recursive:true});
const version = await fetch(`${debug}/json/version`).then(r=>r.json());
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let sequence=0,session;
const pending=new Map(),requests=[],exceptions=[],fileChoosers=[];
function send(method,params={},sessionId=session) {
  const id=++sequence;
  return new Promise((resolve,reject)=>{
    pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
ws.onmessage=({data})=>{
  const message=JSON.parse(data);
  if(message.id){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(new Error(JSON.stringify(message.error))):task.resolve(message.result);}
  if(message.method==='Network.requestWillBeSent') requests.push(message.params.request.url);
  if(message.method==='Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if(message.method==='Page.fileChooserOpened') fileChoosers.push(message.params);
  if(message.method==='Page.javascriptDialogOpening') send('Page.handleJavaScriptDialog',{accept:true},message.sessionId).catch(()=>{});
};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function evaluate(expression) {
  const reply=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(reply.exceptionDetails) throw new Error(reply.exceptionDetails.exception?.description || reply.exceptionDetails.text);
  return reply.result.value;
}
async function wait(expression,description,timeout=15000) {
  const deadline=Date.now()+timeout;
  while(Date.now()<deadline){if(await evaluate(expression))return;await pause(100);}
  throw new Error(`Timed out: ${description}. UI: ${await evaluate("document.getElementById('reporting-errors')?.textContent")}`);
}
const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const input=(id,value)=>evaluate(`{const node=document.getElementById(${JSON.stringify(id)});node.value=${JSON.stringify(value)};node.dispatchEvent(new Event('input',{bubbles:true}));}`);
const submit=id=>evaluate(`document.getElementById(${JSON.stringify(id)}).requestSubmit()`);
async function selectFile(selector,path) {
  const {root}=await send('DOM.getDocument');
  const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector});
  await send('DOM.setFileInputFiles',{nodeId,files:[path]});
}
async function keyboardFilePicker(id,previousId,path,key='Enter') {
  await send('Page.setInterceptFileChooserDialog',{enabled:true});
  try {
    await evaluate(`document.getElementById(${JSON.stringify(previousId)}).focus()`);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    assert.equal(await evaluate('document.activeElement.id'),id,`${id} is unreachable with Tab`);
    if (id==='verify-candidate') {
      await evaluate("document.getElementById('verify-candidate').scrollIntoView({block:'center',behavior:'instant'})");
      const focused=await send('Page.captureScreenshot',{format:'png'});
      await writeFile(resolve(output,'candidate-picker-keyboard-focus.png'),Buffer.from(focused.data,'base64'));
    }
    const before=fileChoosers.length;
    const code=key==='Enter'?'Enter':'Space',virtual=key==='Enter'?13:32;
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtual,text:key==='Enter'?'\r':' '});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtual});
    for(let n=0;n<100 && fileChoosers.length===before;n++)await pause(50);
    assert.equal(fileChoosers.length,before+1,`${key} did not open the ${id} file browser`);
    const opened=fileChoosers.at(-1);
    const {node}=await send('DOM.describeNode',{backendNodeId:opened.backendNodeId});
    assert.equal(node.attributes[node.attributes.indexOf('id')+1],id);
    await send('DOM.setFileInputFiles',{backendNodeId:opened.backendNodeId,files:path?[path]:[]});
  } finally { await send('Page.setInterceptFileChooserDialog',{enabled:false}); }
}
async function fileExists(path) {try{await access(path);return true;}catch{return false;}}
async function fileWait(path) {for(let n=0;n<100;n++){if(await fileExists(path))return;await pause(100);}throw new Error(`Download missing: ${path}`);}
let targetId;
try {
  ({targetId}=await send('Target.createTarget',{url:'about:blank'},null));
  ({sessionId:session}=await send('Target.attachToTarget',{targetId,flatten:true},null));
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('DOM.enable');
  await send('Storage.clearDataForOrigin',{origin:new URL(site).origin,storageTypes:'all'});
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:output},null);
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:new URL('reporting-tool.html',site).href});
  await wait("document.getElementById('start-fields')?.disabled===false",'application ready');
  assert.equal(requests.some(url=>url.includes('expected-outcomes')),false,'candidate startup fetched expectations');
  await click('#start-illustrative');await submit('start-form');
  await wait("!document.getElementById('workspace').hidden",'record created');
  const runId=await evaluate("document.getElementById('run-id').value");
  assert.equal(await evaluate("document.getElementById('candidate-verification-fields').hidden"),true);
  assert.equal(await evaluate("document.getElementById('verification-prerequisite').hidden"),false);
  await click('input[name="target"][value="web:6.A-MeaningfulImage"]');
  await evaluate("[...document.querySelectorAll('input[name=case]')].find(n=>n.value.startsWith('TC06.A-')).click()");
  await input('scope-type','subprocess');await input('scope-rationale','Synthetic browser behavior check; no accessibility evaluation occurred.');
  await submit('scope-form');
  await wait("document.querySelectorAll('#results-list tbody tr').length===1",'prepared not-tested result');
  assert.ok(await evaluate("document.getElementById('results-list').textContent.includes('not-tested')"));
  await input('case-search','TC06');
  for(const [id,value] of Object.entries({'process-name':'Synthetic browser QA','process-version':'qa-1','process-owner':'Synthetic tester',
    'process-description':'Illustrative form behavior test; no sample accessibility testing occurred.','run-status':'completed','run-performed_at':'2026-11-03T10:00:00',
    'env-operating_system':'Synthetic environment','env-browser_or_native_application':'Chrome headless QA','env-viewport_or_view':'1280 x 900','env-zoom':'100%',
    'review-limitations':'Illustrative smoke-test data only. No accessibility test was executed.'})) await input(id,value);
  await click('#manual-rules');await wait("document.querySelectorAll('#rules-list tbody tr').length===1",'manual rule added');
  await click('#results-list tbody button');
  await wait("!document.getElementById('result-editor').hidden",'result editor opened');
  assert.equal(await evaluate('document.activeElement.id'),'result-editor-title');
  await click('input[name="result-status"][value="fail"]');
  await evaluate("{const n=document.getElementById('result-rules');n.options[0].selected=true;n.dispatchEvent(new Event('input',{bubbles:true}));}");
  await input('result-rationale','Synthetic failure chosen to exercise reporting behavior, not an executed accessibility finding.');
  await input('result-evidence-description','Synthetic evidence narrative for application QA.');
  await submit('result-form');
  await wait("document.getElementById('result-editor').hidden",'result saved');
  await click('#finalize');await wait("document.getElementById('record-summary').textContent.includes('· final ·')",'finalization');
  assert.equal(await evaluate("document.querySelector('#metadata-form fieldset').disabled"),true);
  assert.equal(requests.some(url=>url.includes('expected-outcomes')),false,'candidate workflow fetched expectations');
  await click('#freeze');await wait("document.getElementById('freeze-status').textContent.includes('verified in this session')",'candidate freeze');
  const candidatePath=resolve(output,`${runId}-candidate.json`);await fileWait(candidatePath);
  await input('evaluator-name','Synthetic evaluator');await click('#compare');
  await wait("document.querySelectorAll('#comparisons-list tbody tr').length===1",'explicit comparison');
  assert.equal(requests.filter(url=>url.includes('expected-outcomes')).length,1);
  await click('#export-json');await click('#export-html');await click('#export-csv');
  await wait("document.querySelectorAll('#csv-downloads a').length>10",'CSV links prepared');
  await click('#csv-downloads a[download$="results.csv"]');
  const recordPath=resolve(output,`${runId}.json`);const reportPath=resolve(output,`${runId}.html`);
  await fileWait(recordPath);await fileWait(reportPath);await fileWait(resolve(output,`${runId}-results.csv`));
  const record=JSON.parse(await readFile(recordPath,'utf8'));
  assert.equal(record.record_kind,'illustrative');assert.equal(record.schema_version,'1.0.0');assert.equal(record.results[0].status,'fail');
  const check=spawnSync(resolve(root,'.venv/bin/python'),['evaluations/scripts/validate_reporting.py',recordPath,'--candidate',candidatePath],{cwd:root,encoding:'utf8'});
  assert.equal(check.status,0,check.stdout+check.stderr);
  await wait("document.getElementById('save-status').textContent.startsWith('Saved in this browser')",'autosave before reopening');
  await keyboardFilePicker('import-record','clear-saved',recordPath);
  await wait("document.getElementById('freeze-status').textContent.includes('Choose the original candidate')",'reopened evaluator requires candidate');
  assert.equal(await evaluate("document.getElementById('compare').disabled"),true);
  assert.equal(await evaluate("document.getElementById('candidate-verification-fields').hidden"),false);
  assert.equal(await evaluate("document.getElementById('verify-candidate').disabled"),false);
  await keyboardFilePicker('verify-candidate','freeze-status',null,' ');
  assert.equal(await evaluate("document.getElementById('reporting-errors').hidden"),true,'cancelling the candidate picker caused an error');
  await keyboardFilePicker('verify-candidate','freeze-status',candidatePath);
  await wait("document.getElementById('freeze-status').textContent.includes('verified in this session')",'candidate restored');
  assert.equal(await evaluate("document.getElementById('candidate-verification-fields').hidden"),true);
  assert.equal(await evaluate('document.activeElement.id'),'freeze-status');
  assert.equal(requests.filter(url=>url.includes('expected-outcomes')).length,1,'verification loaded expectations');
  await click('#compare');await wait("document.getElementById('reporting-status').textContent.includes('Evaluator comparison recorded')",'comparison after import');
  await wait("document.getElementById('save-status').textContent.startsWith('Saved in this browser')",'transaction committed');
  await evaluate('window.__beforeQAReload=true');
  await send('Page.reload');await wait("!window.__beforeQAReload && document.getElementById('resume')?.disabled===false",'autosave available after reload');
  await click('#resume');await wait("document.getElementById('freeze-status').textContent.includes('verified in this session')",'autosave restored and freeze verified');
  await click('#purpose-artifact');await input('start-domain','documents');await submit('start-form');
  await wait("document.getElementById('record-summary').textContent.includes('documents artifact report')",'document artifact report');
  assert.equal(await evaluate("document.getElementById('cases-panel').hidden"),true);
  assert.equal(await evaluate("document.getElementById('evaluator-panel').hidden"),true);
  await click('input[name="target"][value="documents:6.A-MeaningfulImage"]');
  await input('scope-type','subprocess');await input('scope-rationale','Synthetic document scope.');await submit('scope-form');
  await wait("document.getElementById('coverage-summary').textContent.startsWith('1 selected')",'document scope');
  await input('artifact-path','synthetic-document.pdf');await submit('artifact-form');
  await wait("document.querySelectorAll('#results-list tbody tr').length===1",'document gap prepared');
  await click('#manual-rules');await wait("document.querySelectorAll('#rules-list tbody tr').length===1",'document manual rule');
  // Exercise the conditional AI editor using a configuration without per-run outputs.
  await evaluate("document.getElementById('component-details').open=true");
  await input('component-name','Synthetic AI QA component');await input('component-version','qa-1');
  await input('component-configuration','Synthetic direct model configuration; no accessibility execution.');
  await input('component-type','ai-si-tool');
  await wait("!document.getElementById('component-ai-profile').hidden",'conditional AI fields');
  assert.equal(await evaluate("document.getElementById('component-ai-profile').disabled"),false);
  await submit('component-form');
  await wait("document.activeElement.id.startsWith('ai-agent-')",'required AI identity is focused');
  assert.equal(await evaluate("document.querySelectorAll('#components-list tbody tr').length"),1,'incomplete AI component was saved');
  await input('ai-model-provider','Provider draft that must survive toggling');
  await input('component-type','manual-procedure');
  assert.equal(await evaluate("document.getElementById('component-ai-profile').hidden && document.getElementById('component-ai-profile').disabled"),true);
  assert.equal(await evaluate("document.getElementById('component-form').checkValidity()"),true,'hidden AI inputs block a non-AI component');
  await input('component-type','ai-si-tool');
  assert.equal(await evaluate("document.getElementById('ai-model-provider').value"),'Provider draft that must survive toggling');
  await click('#ai-direct-model');
  assert.equal(await evaluate("document.getElementById('ai-agent-fields').hidden && document.getElementById('ai-agent-fields').disabled"),true);
  const aiProfile=JSON.parse(await readFile(resolve(root,'evaluations/examples/ai-si-component-profile.json'),'utf8'));
  aiProfile.agent=null;
  aiProfile.instructions.system='  Preserve these synthetic instruction spaces and line breaks.\n';
  aiProfile.context.supplied_files=['Synthetic reference','Synthetic context description'];
  for(const [group,,fields] of aiProfileSections) for(const [key,,type] of fields) {
    const v=aiProfile[group][key];await input(aiFieldId(group,key),type==='list'?v.join('\n'):v??'');
  }
  await input('ai-capability-limits',aiProfile.capability_limits.join('\n'));
  await send('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:false});
  await pause(200);
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'expanded AI editor overflows at 320px');
  await evaluate("document.getElementById('component-ai-profile').scrollIntoView()");
  let aiShot=await send('Page.captureScreenshot',{format:'png'});await writeFile(resolve(output,'ai-editor-narrow.png'),Buffer.from(aiShot.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
  await submit('component-form');await wait("document.querySelectorAll('#components-list tbody tr').length===2",'typed AI component saved');
  await evaluate("Array.from(document.querySelectorAll('#components-list button')).find(b=>b.textContent==='Edit Synthetic AI QA component').click()");
  await wait("document.getElementById('component-name').value==='Synthetic AI QA component'",'AI editor reopened');
  assert.equal(await evaluate("document.getElementById('ai-instructions-system').value"),aiProfile.instructions.system);
  // Changing an unrelated field must preserve literal instructions and list entries.
  await input('component-version','qa-2');
  await evaluate("document.getElementById('ai-output_retention-policy').closest('details').open=true");
  await click('#ai-add-output');
  const syntheticOutput='Synthetic agent output for UI regression only; no AI execution.';
  const syntheticPath=resolve(output,'synthetic-agent-output.txt');await writeFile(syntheticPath,syntheticOutput);
  const syntheticHash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(syntheticOutput))).toString('hex');
  await evaluate(`{const n=document.querySelector('[data-ai-output-path]');n.value=${JSON.stringify(syntheticPath)};n.dispatchEvent(new Event('input',{bubbles:true}));}`);
  await evaluate("{const n=document.querySelector('[data-ai-output-sha]');n.value='bad-hash';n.dispatchEvent(new Event('input',{bubbles:true}));}");
  await submit('component-form');await wait("document.activeElement.matches('[data-ai-output-sha]')",'invalid output hash is focused');
  await evaluate(`{const n=document.querySelector('[data-ai-output-sha]');n.value=${JSON.stringify(syntheticHash)};n.dispatchEvent(new Event('input',{bubbles:true}));}`);
  await submit('component-form');await wait("document.getElementById('component-name').value===''",'AI component edit saved');
  const aiDraftId=await evaluate("document.getElementById('run-id').value");
  await click('#export-json');const aiDraftPath=resolve(output,`${aiDraftId}.json`);await fileWait(aiDraftPath);
  const aiDraft=JSON.parse(await readFile(aiDraftPath,'utf8'));
  const savedAI=aiDraft.process.components.find(c=>c.type==='ai-si-tool');
  aiProfile.output_retention.original_outputs=[{path_or_url:syntheticPath,sha256:syntheticHash}];
  assert.deepEqual(savedAI.profile,aiProfile,'AI metadata changed while editing an unrelated component field');
  await click('#export-html');await fileWait(resolve(output,`${aiDraftId}.html`));
  assert.ok((await readFile(resolve(output,`${aiDraftId}.html`),'utf8')).includes('AI/SI component profiles'));
  await click('#export-csv');await wait("Array.from(document.querySelectorAll('#csv-downloads a')).some(a=>a.download.endsWith('ai_si_profiles.csv'))",'AI CSV table');
  await click('#export-profile');const reusablePath=resolve(output,'Untitled-process-profile.json');await fileWait(reusablePath);
  const reusable=JSON.parse(await readFile(reusablePath,'utf8'));
  assert.deepEqual(reusable.process.components.find(c=>c.type==='ai-si-tool').profile.output_retention.original_outputs,[]);
  const fullProfilePath=resolve(output,'profile-with-prior-outputs.json');await writeFile(fullProfilePath,JSON.stringify({schema_version:'1.0.0',process:aiDraft.process}));
  await click('#rerun');await wait(`document.getElementById('run-id').value!==${JSON.stringify(aiDraftId)}`,'new run for AI process');
  await evaluate("Array.from(document.querySelectorAll('#components-list button')).find(b=>b.textContent==='Edit Synthetic AI QA component').click()");
  await wait("!document.getElementById('component-ai-profile').hidden",'AI configuration copied to rerun');
  assert.equal(await evaluate("document.querySelectorAll('#ai-outputs [data-ai-output]').length"),0,'new run inherited previous output evidence');
  await click('#component-new');await keyboardFilePicker('import-profile','export-profile',fullProfilePath);
  await wait("document.getElementById('reporting-status').textContent.includes('Per-run AI/SI output references cleared')",'profile import clears per-run outputs');
  await evaluate("Array.from(document.querySelectorAll('#components-list button')).find(b=>b.textContent==='Edit Synthetic AI QA component').click()");
  await wait("!document.getElementById('component-ai-profile').hidden",'imported AI configuration editor');
  assert.equal(await evaluate("document.querySelectorAll('#ai-outputs [data-ai-output]').length"),0,'profile import reused prior output evidence');
  assert.equal(await evaluate("document.getElementById('ai-output_retention-policy').value"),aiProfile.output_retention.policy);
  await click('#component-new');
  // Import a complete AI report, freeze its exact profile, compare, and verify in Python.
  const aiCandidatePath=resolve(root,'evaluations/examples/ai-si-process-candidate.json');
  const beforeAIRequests=requests.filter(url=>url.includes('expected-outcomes')).length;
  await selectFile('#import-record',aiCandidatePath);
  await wait("document.getElementById('run-id').value==='illustrative-ai-process-run'",'complete AI report imported');
  await click('#freeze');await wait("document.getElementById('freeze-status').textContent.includes('verified in this session')",'AI profile frozen');
  assert.equal(requests.filter(url=>url.includes('expected-outcomes')).length,beforeAIRequests);
  await input('evaluator-name','Synthetic AI evaluator');await click('#compare');
  await wait("document.querySelectorAll('#comparisons-list tbody tr').length===3",'AI evaluation comparison');
  await click('#export-json');
  const aiEvaluatedPath=resolve(output,'illustrative-ai-process-run.json');await fileWait(aiEvaluatedPath);
  const aiFrozenPath=resolve(output,'illustrative-ai-process-run-candidate.json');await fileWait(aiFrozenPath);
  const aiCheck=spawnSync(resolve(root,'.venv/bin/python'),['evaluations/scripts/validate_reporting.py',aiEvaluatedPath,'--candidate',aiFrozenPath],{cwd:root,encoding:'utf8'});
  assert.equal(aiCheck.status,0,aiCheck.stdout+aiCheck.stderr);
  // Native keyboard focus smoke check, then viewport/reflow and rendered screenshots.
  await evaluate("document.getElementById('result-search').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert.notEqual(await evaluate('document.activeElement.id'),'result-search');
  const unlabeled=await evaluate(`Array.from(document.querySelectorAll('#reporting-app input:not([type=hidden]),#reporting-app select,#reporting-app textarea')).filter(n=>!n.labels?.length && !n.getAttribute('aria-label')).map(n=>n.id)`);
  assert.deepEqual(unlabeled,[]);
  await evaluate("document.getElementById('scope-section').scrollIntoView()");
  let shot=await send('Page.captureScreenshot',{format:'png'});await writeFile(resolve(output,'workspace-desktop.png'),Buffer.from(shot.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:false});
  await pause(300);
  const dimensions=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(dimensions.scroll<=dimensions.width+1,`Page overflow at 320px: ${JSON.stringify(dimensions)}`);
  shot=await send('Page.captureScreenshot',{format:'png'});await writeFile(resolve(output,'workspace-narrow.png'),Buffer.from(shot.data,'base64'));
  await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await send('Page.navigate',{url:`file://${reportPath}`});
  await wait("location.protocol==='file:' && document.querySelector('main h1')?.textContent==='Web test process evaluation'",'standalone HTML offline');
  assert.equal(await evaluate("document.querySelectorAll('script,link').length"),0);
  assert.ok(await evaluate("document.body.textContent.includes('ILLUSTRATIVE') && document.body.textContent.includes('Synthetic evidence narrative')"));
  shot=await send('Page.captureScreenshot',{format:'png'});await writeFile(resolve(output,'standalone-report.png'),Buffer.from(shot.data,'base64'));
  await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'indexedDB',{value:undefined});"});
  await send('Page.navigate',{url:new URL('reporting-tool.html',site).href});
  await wait("location.protocol==='http:' && document.getElementById('start-fields')?.disabled===false",'storage-unavailable startup');
  assert.ok(await evaluate("document.getElementById('reporting-status').textContent.toLowerCase().includes('autosave unavailable')"));
  await click('#start-illustrative');await submit('start-form');
  await wait("!document.getElementById('workspace').hidden",'memory-only workspace');
  const memoryId=await evaluate("document.getElementById('run-id').value");
  await click('#finalize');await wait("!document.getElementById('reporting-errors').hidden",'actionable finalization errors');
  assert.equal(await evaluate('document.activeElement.id'),'reporting-errors');
  assert.ok(await evaluate("document.getElementById('record-summary').textContent.includes('· draft ·')"));
  const invalidPath=resolve(output,'invalid-record.json');await writeFile(invalidPath,'{"schema_version":"unsupported"}');
  await selectFile('#import-record',invalidPath);
  await wait("document.getElementById('reporting-errors').textContent.includes('Cannot reopen')",'invalid import rejected');
  assert.equal(await evaluate("document.getElementById('run-id').value"),memoryId,'invalid import replaced current record');
  const hostile=JSON.parse(await readFile(resolve(root,'evaluations/examples/artifact-report.json'),'utf8'));
  hostile.run.id=`blocked-storage-${Date.now()}`;
  hostile.process.name='<img src=x onerror="window.__reportingXSS=true">';
  hostile.results[0].rationale='<svg onload="window.__reportingXSS=true">';
  const hostilePath=resolve(output,'escaped-import.json');await writeFile(hostilePath,JSON.stringify(hostile));
  await selectFile('#import-record',hostilePath);
  await wait(`document.getElementById('run-id').value===${JSON.stringify(hostile.run.id)}`,'imported text retained');
  assert.equal(await evaluate('window.__reportingXSS===true'),false);
  assert.equal(await evaluate("document.querySelectorAll('#reporting-app img[src=x]').length"),0);
  await click('#export-json');await fileWait(resolve(output,`${hostile.run.id}.json`));
  const moduleErrors=exceptions.filter(e=>JSON.stringify(e).includes('/assets/js/reporting/'));
  assert.deepEqual(moduleErrors,[]);
  console.log(JSON.stringify({status:'PASS',recordPath,candidatePath,reportPath,checks:['native file-picker Tab/Enter/Space activation','candidate-picker eligibility and focus return','create and edit','scope preparation and filtering','manual rules','finalization','freeze before expectation fetch','explicit comparisons','JSON/CSV/HTML downloads','independent Python validation of browser output','reopen and exact-byte verification','IndexedDB restore','document artifact boundary','conditional AI fields and required validation','direct model use and type-toggle preservation','AI output hash validation','AI literal-instruction and profile round-trip','AI report HTML/CSV sections','per-run AI output reset on reuse','AI evaluation freeze/comparison/Python validation','keyboard focus and labels','320px reflow','standalone HTML offline','blocked storage fallback','error focus and recovery','invalid import preserves workspace','imported text cannot inject markup'],screenshots:output},null,2));
} catch(error) {
  console.error(JSON.stringify({url:await evaluate('location.href'),body:await evaluate('document.body?.innerText?.slice(0,1000)'),
    overflow:await evaluate("Array.from(document.querySelectorAll('#reporting-app *')).filter(n=>n.getClientRects().length && n.scrollWidth>n.clientWidth+2 && getComputedStyle(n).overflowX==='visible').map(n=>({tag:n.tagName,id:n.id,class:n.className,client:n.clientWidth,scroll:n.scrollWidth})).slice(0,20)"),requests:requests.slice(-12)},null,2));
  throw error;
} finally {
  if(targetId) await send('Target.closeTarget',{targetId},null).catch(()=>{});
  ws.close();
}
