# General evaluation framework validation status

Date: 2026-11-03. Reporting schema: 1.0.0. Case suite: 0.2.0.

## Completed structural work

- A process-neutral model for complete-process, component and subprocess evaluations.
- Component records for manual procedures, automated and browser tools, assistive technologies, scripts, AI/SI tools, human review and organizational subprocesses.
- Separate records for process coverage, selected cases, uncovered procedures, findings and Framework comparisons.
- A manifest containing 147 existing Web Framework cases with record and primary-sample SHA-256 hashes and procedure mappings.
- Separately controlled evaluator expectations and explicit `matched`, `mismatched` and `not-compared` comparison outcomes.
- A JSON Schema and matching empty result template for the general model.
- A shared 1.0.0 reporting contract with Web-only process evaluation, separate artifact reporting, reusable process profiles, structured rule mappings, evidence/artifact/result IDs, and synthetic representative records.
- Reporting relationship validation, candidate-freeze integrity checks, and regression tests; these verify data, not accessibility or independent execution.
- A formal conditional AI/SI component profile and corresponding editor fields, output-provenance checks, synthetic AI/SI examples, and dedicated AI/SI export sections. See the excluded reporting maintainer README for verification details.
- Jekyll-generated candidate JSON/CSV indexes omitting explicit expectations and explanatory metadata. Public IDs and sample names still reveal outcomes.
- A Jekyll/vanilla JavaScript/USWDS reporting workspace, committed-record autosave, profile reuse, candidate freezing/comparison, and JSON/CSV/standalone HTML exports. Actual verification and remaining reporting work are recorded only in the excluded [reporting maintainer README](../reporting-tool/README.md).

All 147 case-record hashes and 147 primary-sample hashes have been independently checked against both the working tree and the pinned Framework source revision. There are 136 unique primary samples because some cases intentionally share a sample. Dependency files are not comprehensively hashed by the manifest.

## Remaining validation and implementation

- Qualified human review of Framework expectations, mappings and case rationale.
- Execution and discrepancy review across representative complete test processes and scoped components.
- Document Framework cases and coverage for scenarios not represented by the current Web corpus.
- Broader environment, assistive-technology, browser, native-application and tester coverage.
- Review and versioning of process-specific profiles, including the AI/SI profile.

The framework is a reviewable evaluation structure with a source inventory. It is not a validated test-process alignment claim, certification or artifact conformance report.
