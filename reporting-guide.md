---
layout: page
title: Using the Baseline Reporting Tool
---

The [Baseline Reporting Tool]({{ '/reporting-tool.html' | relative_url }}) records testing evidence in your browser and produces JSON, CSV, and standalone HTML reports. It does not run accessibility scanners, inspect your content, or determine conformance automatically.

## Choose a purpose

- **Evaluate a test process — Web Baseline only:** select Framework samples, record how your process classifies them, and compare frozen results with versioned expectations. There is no document Framework process-evaluation workflow.
- **Record results for my own content:** record findings for websites or non-web documents. Use a separate record for each domain. These reports do not need Framework cases or expectations.

You can create a record, reopen a reporting JSON download, or restore the latest browser autosave. The format is version 1.0.0. Creating or importing another record replaces the open workspace after confirmation; download JSON first to keep earlier work.

For demonstrations, select **Create an illustrative record**. Its exports are labeled illustrative and must not be treated as executed testing evidence.

## Describe the run and process

Give the run a recognizable ID and record its stage, status, actual testing date/time, environment, and conditions. Time entered in the form uses your local timezone and is saved in UTC. Leave the testing date empty when testing has not occurred.

Describe the process name, version, owner, decision rules, and reporting conventions. Add its components: manual procedures, scanners, browser tools, assistive technology, scripts, subprocesses, or other methods. Record each component's version and configuration.

Add the rules or procedures used by each component. Preserve their original identifiers in the **Original rule or procedure ID** field. Map each rule to one or more Baseline or other targets, with a rationale, limitations, and coverage claim. A mapping is a claim about contribution, not proof that the rule covers the complete procedure.

After applying scope, **Add manual rules for selected targets** creates rule definitions for a manual component. Review the definitions, versions, and configuration before using them. Replace draft versions before finalizing. This action does not execute tests or mark any results as passing.

Download a process profile to reuse the same configuration in another run. Import a profile before recording observations. Each run keeps its own copy; changing a saved profile does not change earlier reports. Imported profiles and reports may contain richer dependency or review details than the basic forms expose. Those details are retained except when an operation explicitly resets per-run data, as described below.

### AI/SI components

Choose **ai-si-tool** in the component editor to open the structured **AI/SI component profile** fields. Complete the required fields before saving the component. You can include AI/SI components alongside manual procedures and other tools, then attribute observations and process determinations to their rules in the usual way.

Record:

- Agent and model providers, names, and version or dated identifiers. Select **No orchestration agent — direct model use** when a model is used directly.
- System, project, skill, and task instructions, or versioned controlled references. Explain when a layer is not used; keep secrets out of the record and exports.
- Supplied files, retrieval sources, context boundaries, available tools, permissions, network restrictions, and application access.
- The component's execution environment, human review/acceptance responsibilities, referral conditions, and known capability limits.
- Variability settings, the single-run or repeated-run sampling plan, retry/rerun policies, and output-selection policy. State when a setting is unavailable instead of inventing its value.
- Original-output retention policy, output file/URL references and optional SHA-256 hashes, and the isolation method, exposure paths, and any input transformations.

The form groups these fields in expandable sections. Text fields are required unless labeled optional. Optional lists use one entry per line. Keep original agent/model outputs separate from reviewer conclusions. Before finalizing an AI/SI component's observed results, add at least one original-output reference or explicitly explain why original outputs are unavailable. An unavailable-output explanation records an evidence gap; it does not turn an incomplete or unperformed test into a pass.

Full report JSON retains the AI/SI profile and per-run output references. HTML includes a dedicated **AI/SI component profiles** section, and CSV includes `ai_si_profiles.csv`. Reusable process-profile downloads omit original-output references and per-run missing-output explanations; importing a process profile or starting a new run clears those fields. Configuration and retention policies are preserved. Reopening a complete report preserves its original-output references.

The shared reporting format remains **1.0.0**, with AI/SI profile version **1.0.0**. See the [AI/SI component profile schema]({{ '/evaluations/ai-si-profile-schema.json' | relative_url }}) and [synthetic AI/SI evaluation example]({{ '/evaluations/examples/ai-si-process-evaluation.json' | relative_url }}). Earlier unstructured `ai-si-tool` profiles must be completed in the formal structure before import. The separate Accessibility SI 0.2.0 format is not imported directly. Framework process evaluation remains Web-only, and public outcome-bearing sample names still prevent a claim of blinded execution.

## Select scope and artifacts

Choose **full process**, **component**, or **subprocess**, and explain the selection. Full-process final records must account for every active Baseline procedure; use a narrower selection when that describes the work accurately.

Select the applicable targets. For process evaluation, select Web Framework cases for those procedures. Filtering the case list keeps selected cases checked. Use **Apply scope and prepare result rows** to save the selection. Prepared rows start as **not tested**. A selected procedure with no case remains an explicit coverage gap.

For your own content, add delivered URLs or file references and formats. SHA-256 hashes are optional for these artifacts. Select each meaningful page, document, or state as an artifact appropriate to your scope. The tool prepares a separate determination for each selected artifact and target.

Changing scope cannot silently remove recorded observations or evidence. If a change would remove work, retain that selection or start a new run. Parsing is retained as **no test required** and is not counted as an executed pass. Supplemental WCAG 2.1/2.2 checks are identified separately from Baseline procedures.

## Record observations and determinations

Use **Add component observation** to preserve a tool's or manual tester's finding. Then edit the prepared **process determination** and select contributing observations. Components and rules from those observations are attributed automatically. Preserve conflicting observations and explain the process's final decision in the rationale.

Choose the outcome that reflects actual work:

| Outcome | Use |
| --- | --- |
| Pass | The recorded check was completed and its tested conditions were satisfied. |
| Fail | The recorded check was completed and an applicable failure was found. |
| Not applicable | Content and applicability were inspected and the check did not apply; record the basis. |
| Not tested | No observation has been made. |
| Incomplete | Testing began but could not be completed; record the limitation. |

Describe actions, observations, affected locations/states, evidence, and limitations. Add an evidence narrative and an optional file or URL reference, or reuse existing evidence. Files are not uploaded or embedded automatically. Share referenced evidence separately when needed.

Record human review separately from outcomes. A result requiring review is not automatically a pass. Choose **Save result** to commit result edits; autosave only stores committed results. Other component, rule, artifact, and scope forms also have explicit Save or Apply actions. Unsaved form edits are identified when you try to leave or export.

## Review and finalize

Record reviewers, pending human work, and run limitations. Use **Check record** to check structure and references. Use **Finalize record** when the record is ready to issue. Finalization requires a testing date, completed or stopped run status, an actual environment/process description, and explicit determinations or gaps throughout the selected scope. Observed final outcomes need attribution and evidence.

A finalized record may still disclose unperformed tests, incomplete outcomes, and pending human review. Finalization is not human acceptance, certification, or a conformance determination. Final records are locked; **Start a new run from this process** preserves setup and scope, links the prior run ID, and resets observations, evidence, comparisons, and review. Download the earlier record before replacing it.

## Compare Web process results

Candidate mode does not load expected outcomes. After recording and finalizing the candidate's results:

1. Choose **Freeze and download candidate** and retain that exact JSON file. The evaluator record stores its SHA-256 hash and is locked against candidate edits.
2. Enter the evaluator's name and choose **Load expectations and compare**. Only this explicit action loads the evaluator expectation file; its hash must match the run's pin.
3. Review matched, mismatched, and not-compared classifications. Incomplete and unperformed checks remain not compared. A content failure that matches the expected failure is a matched process classification, not passing content.
4. Download the evaluator record and retain the original candidate alongside it. When reopening an evaluator record, choose its original candidate file to verify the exact-byte hash and contents before comparing or issuing it again.

The original-candidate file picker appears after you reopen an evaluator record that has a frozen hash and needs verification. Before that step, instructions explain how to reach it. Once shown, reach the picker with Tab and press Enter or Space to open the file browser. After successful verification, the picker closes and focus moves to the verification status. A candidate frozen in the current session is already verified, so no additional file selection is needed.

Public case IDs, sample filenames, and sample content may reveal outcomes. Candidate indexes omit explicit expected-result fields and explanatory metadata, but do not provide blinded inputs or enforce independent execution. Use an appropriately controlled candidate environment. A freeze detects later changes; it cannot prove that a tester never saw public expectations. Source expectations may still require qualified human review.

## Save, reopen, and export

Browser autosave keeps one committed workspace per deployment path. Check its visible save status. Storage may be blocked, cleared, or evicted; **download JSON regularly**. **Delete browser autosave** deletes that stored workspace and pauses autosaving for the session; it leaves the open record in memory. Reload to enable autosave again.

- **JSON:** complete editable record. Keep the frozen candidate too when comparisons exist.
- **CSV:** choose **Prepare CSV downloads**, then download the related tables from the links. Each record collection has its own file; nested values are JSON within quoted cells. Formula-like text is prefixed with an apostrophe for spreadsheet safety, so use JSON for lossless exchange.
- **HTML:** standalone report with embedded styling, process determinations, review/coverage gaps, Framework comparisons, and the complete record including component observations and evidence references. It does not need the site or JavaScript to read.

Draft exports are clearly labeled. Referenced attachments are not bundled with exports. Selected test results and aggregate case counts do not establish complete Baseline alignment or whole-artifact conformance. Begin with [Section508.gov testing guidance](https://www.section508.gov/test/) and arrange human keyboard, visual/content-equivalence, and applicable assistive-technology review before acceptance.
