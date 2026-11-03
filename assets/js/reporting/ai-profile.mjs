// UI labels and empty values for the formal schema's AI/SI component profile.
// Empty values are intentionally invalid until the tester describes the setup.
export const aiProfileSections = [
  ['model', 'Model', [
    ['provider','Model provider'], ['name','Model name or identifier'], ['version','Model version or dated identifier']]],
  ['instructions', 'Instructions', [
    ['system','System instructions'], ['project','Project instructions'], ['skills','Skills and their versions'], ['task','Task instructions']]],
  ['context', 'Supplied context', [
    ['supplied_files','Supplied files or controlled references','list'], ['retrieval_sources','Retrieval sources','list'],
    ['boundaries','Context boundaries and what was withheld']]],
  ['access', 'Tools and access', [
    ['tools','Tools and versions available to this component','list'], ['permissions','Permissions and restrictions'],
    ['network','Network access and restrictions'], ['applications','Application access','list']]],
  ['execution', 'Execution and human responsibility', [
    ['environment','Component execution environment'], ['human_responsibilities','Human involvement, review and acceptance responsibilities'],
    ['referral_conditions','Conditions requiring human review','list']]],
  ['variability', 'Variability and repeatability', [
    ['settings','Sampling settings and other variability controls'], ['sampling_plan','Single-run or repeated-run sampling plan'],
    ['retry_policy','Retry policy'], ['rerun_policy','Rerun policy'], ['output_selection_policy','Output-selection policy']]],
  ['output_retention', 'Original output retention', [
    ['policy','Retention location and policy'], ['unavailable_reason','Reason original outputs are unavailable (if applicable)','optional-text']]],
  ['isolation', 'Expected-result isolation', [
    ['method','Isolation method and known limitations'], ['known_exposure_paths','Known expectation-exposure paths','list'],
    ['transformations','Input transformations and behavior-preservation checks','list']]]
];
export const aiFieldId = (group, key) => `ai-${group}-${key}`;
export function emptyAIProfile() {
  const profile = {profile_type:'ai-si',profile_version:'1.0.0',agent:null};
  for (const [group,, fields] of aiProfileSections) {
    profile[group] = Object.fromEntries(fields.map(([key,,type]) => [key,type === 'list' ? [] : type === 'optional-text' ? null : '']));
  }
  profile.output_retention.original_outputs = [];
  profile.capability_limits = [];
  return profile;
}
// Configuration reuse must not imply that old agent outputs belong to a new run.
export function reusableProcess(process) {
  const copy = structuredClone(process);
  for (const component of copy.components) {
    if (component.profile?.profile_type === 'ai-si' && Array.isArray(component.profile.output_retention?.original_outputs)) {
      component.profile.output_retention.original_outputs = [];
      component.profile.output_retention.unavailable_reason = null;
    }
  }
  return copy;
}
