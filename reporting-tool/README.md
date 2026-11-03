# Reporting tool maintainer guide

This file and the entire `reporting-tool/` directory are excluded from Jekyll output. User instructions belong in [the published reporting guide](../reporting-guide.md); implementation notes and unfinished work belong here.

## Implementation and data contract

The reporting workspace uses the existing Jekyll layouts and USWDS styling, with vanilla JavaScript modules and no runtime package installation. The accepted reporting and process-profile formats use **1.0.0**. The prior unpublished schema/template snapshots have been replaced; there is no separate legacy 1.0 format or 2.0 migration path. The Accessibility SI 0.2 format remains separate.

- [Result schema](../evaluations/results-schema.json), [process profile schema](../evaluations/process-profile-schema.json), [Web evaluation template](../evaluations/result-template.json), and [artifact-report template](../evaluations/templates/artifact-report.json).
- [AI/SI component profile schema](../evaluations/ai-si-profile-schema.json): required conditionally for `ai-si-tool`; the reusable process schema inherits the same definition. Both reporting and AI/SI profile versions remain 1.0.0.
- [Representative synthetic records](../evaluations/examples/): no actual accessibility execution is asserted.
- [Workspace](../reporting-tool.html), [browser application](../assets/js/reporting/app.mjs), [shared model/validation/exports](../assets/js/reporting/model.mjs), and [IndexedDB storage](../assets/js/reporting/storage.mjs).
- [Jekyll catalog generator](../_plugins/reporting_catalog.rb) reads canonical mappings and the manifest, emits candidate metadata and a runtime catalog, and pins manifest/expectation hashes. It does not emit expected outcomes into candidate data.
- [Python relationship validator](../evaluations/scripts/validate_reporting.py) provides independent schema and semantic checks.

Process profiles contain components, versioned external rules, and many-to-many mappings. Runs snapshot the profile. Results reference artifacts, targets, evidence, components/rules, and contributing observations by stable IDs. Component observations and adjudicated process determinations remain separate; comparisons reference determination IDs. Review and coverage claims are separate from observed outcomes.

AI/SI components use formal identity, instructions, context/access, execution/human responsibility, variability/repeatability, retention, isolation, and capability-limit fields. The component editor conditionally shows/enables these fields and opens expandable sections containing invalid controls before browser validation focuses them. Typed inputs round-trip through full report import/export and editing; non-AI custom profiles retain their existing behavior. Required profile descriptions reject whitespace-only values. The original-output list is empty for a configuration-only profile; final results attributed to an executed or incomplete AI/SI component require output references or a nonblank explicit unavailability reason. JavaScript and Python enforce the same rule. This does not verify the referenced output or certify independent execution.

Original-output references and missing-output explanations are per-run evidence metadata. `reusableProcess()` clears them on reusable-profile export/import and new-run creation, without mutating the prior record. Report exports retain them. CSV adds `ai_si_profiles.csv`; HTML adds a dedicated AI/SI section as well as retaining the complete record. The older Accessibility SI 0.2 format is unchanged and has no automatic conversion. Previously unstructured AI/SI profiles require explicit completion in the formal structure; they are rejected rather than silently reinterpreted.

Framework process evaluation is **Web-only**. Artifact reporting supports one Web or Documents domain per run and permits supplemental targets. The existing suite inventory identifier remains `framework-web-documents`; it does not imply document cases exist. Parsing remains no-test-required. Final records account for each selected artifact/target or case/target; full-process records account for every active procedure. A final record may retain gaps and pending review.

Draft data is held in memory and autosaved after committed changes to IndexedDB. Incomplete component/rule/artifact/result/scope forms require explicit Save/Apply; they are not autosaved and block exports until saved or cleared. Save status changes only after the storage transaction commits. Browser autosave is not a backup and is scoped by deployment path. Files are never uploaded; evaluator expectations are fetched only after an explicit post-freeze comparison action. Existing site-wide scripts/styles still load from Section508.gov and other shared dependencies.

Freeze downloads exact candidate bytes before adding evaluator fields. Evaluator records retain a hash and reference. Reopening one requires the original candidate; comparing loads and verifies the pinned expectation file. Candidate equality excludes only `candidate_freeze` and `case_comparisons`, so later changes require another run. This is integrity checking, not access control or proof of independent testing. HTML escapes imported values; CSV quotes fields and neutralizes formula-like text. JSON is the lossless interchange format.

## Local development and verification

Use the repository's Ruby/Bundler setup. JavaScript logic tests need Node 20.11 or newer and no npm install. Python validation uses the existing pinned requirements:

```sh
bundle exec jekyll serve
npm test
python3 -m venv .venv
.venv/bin/python -m pip install -r accessibility-si/scripts/requirements-validation.txt
bundle exec jekyll build --destination /private/tmp/baseline-reporting-check
REPORTING_TEST_SITE=/private/tmp/baseline-reporting-check .venv/bin/python -m unittest discover -s evaluations/tests -v
.venv/bin/python accessibility-si/scripts/validate.py
```

Restart an existing Jekyll server after generator/configuration changes. Isolate test builds from a running server's watcher. Set `REPORTING_TEST_BASEURL` when checking a different deployment prefix. The shared schema checker implements the JSON Schema constraints used by these schemas; add support and regression cases when introducing new constraint keywords. Do not treat schema validation as an accessibility test.

The optional [Chrome smoke test](tests/browser-check.mjs) needs Node 22 or newer (native WebSocket), an installed Chrome, and a local server. In separate terminals, serve an isolated build and launch an isolated Chrome profile, then run the script:

```sh
bundle exec jekyll serve --port 8765 --destination /tmp/baseline-reporting-check --no-watch
# Set REPORTING_CHROME_BIN to your installed Chrome executable.
"$REPORTING_CHROME_BIN" --headless=new --remote-debugging-port=9228 --user-data-dir=/tmp/baseline-reporting-chrome-check --no-first-run --no-default-browser-check about:blank
REPORTING_BROWSER_OUTPUT=/tmp/baseline-reporting-browser-check node reporting-tool/tests/browser-check.mjs http://127.0.0.1:8765/baselinealignment/
```

Use the isolated test profile only: this test accepts its own replacement dialogs, clears that profile's storage for the test origin, creates synthetic records, and downloads test artifacts. Stop the temporary server and isolated Chrome after checking. It does not operate on the normal browser profile. The Python parity checks require the virtual environment above.

The browser core has no expected-outcome fetch. The UI uses schema validation before imports, relationship/finalization checks before exports, explicit freeze verification, and original expectation-file hash verification before comparing. Python remains the independent check for exported records. Imported richer dependencies, profile data, locations, review evidence, and other fields are preserved when not explicitly edited.

## Publication policy

Only user pages and runtime/download resources are published. `_config.yml` excludes README files, this maintainer directory (including tests), the portable `accessibility-si/` source collection, evaluation source-only Markdown, development scripts, and test utilities. The public Accessibility SI landing page links to repository resources. Source exclusions do not make public repository content confidential. Tests check generated output, including links and exclusions.

## Remaining work and notes

- After the colleague's large test-file upload, refresh the manifest and expectation pins, reconcile new mappings, then settle neutral fixture IDs/filenames. Preserve stable case references and evaluator-only alias mappings; verify transformed samples and all dependencies preserve tested behavior. Renaming is deliberately deferred.
- Add selected scanner-output adapters only with documented rule mappings. The current tool records/imports reporting-format JSON; it does not run scanners or accept arbitrary vendor reports.
- Consider evidence packaging/upload integrations, a richer dependency editor, history/catalog loading, multiple saved browser projects, and collaboration only when needed. There is no account service or central database.
- Pin and bundle the existing shared USWDS/site dependencies if fully offline operation of the editing site becomes a requirement. Exported HTML already embeds its styles and has no network dependency.
- Human acceptance still requires keyboard, visual/content-equivalence, zoom/reflow, and applicable screen-reader review of the complete workflow and delivered exports. Record actual evidence; do not infer whole-site conformance from automated checks.
- Keep document Framework process evaluation unavailable until a reviewed document sample corpus and workflow exist.

## Verification record

Completed 2026-11-03:

- Jekyll builds under `/baselinealignment` and `/preview/gsa/baselinealignment/review` succeeded.
- All 13 JavaScript logic tests passed, including schema/relationship checks, exact-byte freeze verification, CSV quoting/formula protection, HTML escaping, gap accounting, and independent Python validation of representative records.
- All 24 Python regressions passed against the rendered preview build, including matching candidate JSON/CSV inventories and publication exclusions. No README or raw Markdown files were emitted; public tool, guide, Accessibility SI landing page, and runtime assets remained available.
- The existing Accessibility SI/framework structural validator passed: 55 criteria, 62 Web procedures, 57 document procedures, and 147 case/source references. This was not test-case execution.
- The isolated headless Chrome smoke test passed creation/editing, scope preparation/filtering, manual rule definitions, finalization, candidate freeze before any expectation request, explicit comparison, JSON/CSV/HTML downloads, Python validation of the browser-generated evaluator record and original candidate, reopening/verification, and committed IndexedDB restoration.
- Browser checks also passed the document-report boundary, a native Tab/focus smoke check and form labels, 320 CSS-pixel page reflow, offline standalone HTML viewing, unavailable-storage fallback with JSON download, error-summary focus, rejection of invalid imports without replacing the workspace, and escaping of imported markup. Desktop/narrow workspace screenshots and the exported report were visually inspected.
- Human screen-reader testing, comprehensive human keyboard/content-equivalence review, and acceptance across the intended browser/assistive-technology combinations remain pending. Automated structure/behavior checks and selected visual inspection are not a whole-site accessibility determination.

### AI/SI extension verification — 2026-11-03

- All 19 JavaScript logic tests and 30 Python regressions passed. These include the standalone profile, reusable process and run schemas; required/whitespace-only AI fields; direct model use; non-AI custom-profile compatibility; output references or explicitly explained gaps for final observed AI results; and post-freeze instruction tampering.
- Default and Cloud.gov-style preview-path Jekyll builds passed, including publication checks for the new runtime module and standalone schema. The existing collection/framework structural validator also passed.
- The isolated Chrome regression passed conditional display/enablement, required-field focus and expansion of invalid groups, direct-model agent omission, values surviving component-type switches, invalid output-hash focus, literal instruction whitespace surviving edits, full AI-profile JSON round-tripping, dedicated HTML/CSV sections, and output-reference clearing on reusable-profile export/import and new runs. The browser-generated AI evaluator record and original candidate passed independent Python validation.
- Browser checks verified that no expectations were fetched before the explicit post-freeze comparison action. Existing create/edit, save/restore, export, import rejection, markup escaping, offline HTML, and unavailable-storage checks passed as part of the same regression.
- Expanded AI forms and frozen-record hash text fit at 320 CSS pixels after scoped fieldset/grid/button sizing and hash-wrapping corrections. The narrow AI editor was visually inspected. These checks do not replace the pending human assistive-technology and complete-process acceptance review above.

### File-picker eligibility and keyboard verification — 2026-11-03

- The candidate verification input was displayed while disabled before a freeze existed. It now appears only for an opened evaluator record whose original candidate still needs verification; prerequisite instructions link to the report import control. Successful verification hides the picker and moves focus to the verification status.
- File inputs remain enabled within conditionally visible containers. This avoids USWDS enhancement retaining disabled styling after the native input is enabled. Initial report import waits for resource readiness; profile import is hidden for locked records. Cancelling a picker or receiving an empty change event does not raise an application error.
- The browser regression now uses actual Tab navigation and Enter/Space activation with native file-chooser interception, rather than only assigning files programmatically. Report import, profile import, candidate verification, cancellation, eligibility, and focus return passed alongside the existing complete workflow regression. The active candidate picker's visible focus indicator was captured and visually inspected. The Jekyll build and whitespace checks passed. Human assistive-technology acceptance remains pending.
