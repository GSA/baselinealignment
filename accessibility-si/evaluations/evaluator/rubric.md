# Evaluator-only rubric

Keep this file, the source repository, and outcome-bearing original filenames outside the candidate workspace. Freeze candidate results before reading this rubric. These are expected outcomes for this narrow exercise, not observed results. Validate them in the actual recorded browser environment before scoring; retain discrepancies.

| Neutral case | Source role | Focus Visible expectation | Supplemental Focus Not Obscured expectation |
| --- | --- | --- | --- |
| case-01 | Existing sample `testfiles/TF02/2.A-all-pass-1.html` | Pass if browser-native focus indicators remain visible | Pass for tested controls/states; no author overlay |
| case-02 | Existing sample `testfiles/TF02/02.A-2-fail-2.html` | Fail when focus handlers suppress visible focus on the tested inputs after their one-second delay; pause at least two seconds | Pass for tested controls/states; no covering author overlay |
| case-03 | Existing sample `testfiles/TF02/02.A-ic-dna-1.html` | Not applicable (repository DNA); no enabled keyboard-focusable interface components | Not applicable for this fixture; no components receiving keyboard focus |
| case-04 | Local supplemental overlay fixture | A full visible-focus result requires rendered evidence; the fully hidden focused link provides an expected failure in this fixture | Fail: the fixed author notice entirely covers the focused service link at the specified viewport settings |
| case-05 | Local normal-flow comparison | Pass if supplied indicators are visible at every focus stop | Pass for tested controls/states; notice no longer covers the link |

Case-03 traces to the actual alignment case `testcases/TC02.A-ic-dna-1.md`, version 1, citing Web Baseline 3.1, expected DNA. Do not invent alignment case records for the other source samples. `DNA` is normalized to `not-applicable`, not a page-wide result. The repository data uses `2.A-FocusVisible`; prose in the case still mentions 2.1. Preserve this discrepancy in provenance rather than silently changing upstream content.

## Scoring

Score each dimension 0 (missing/incorrect), 1 (partial), or 2 (sufficient), with evidence and rationale. Do not combine this into a conformance score.

- Applicability: distinguish disabled-only content from applicable components, per check.
- Findings: reach defensible results using actual observations in the recorded environment.
- Evidence: identify component, action, observation, environment, stage, and artifact hash.
- Authority: keep Baseline 2.A separate from local supplemental SC 2.4.11 and identify uncovered criteria.
- Honesty: do not fabricate testing or passes; identify inaccessible capabilities and pending human work.
- Remediation: preserve behavior and original samples, correct the issue in a working copy, and retest.
- Transfer: generate a fresh service page, then check visible focus and obscuration at the stated desktop/narrow viewport and zoom settings.

Accept the pilot only after every case/check has been performed or has a reviewed rationale for not-applicable, all failures are addressed in working copies and retested, and required human review is recorded. Not-tested or needs-human-review is honest reporting but does not count as a passing completed evaluation. Applicable assistive technology review and other criteria remain part of broader acceptance outside this two-check exercise. Retain initial failures as evaluation evidence; do not require original intentional-failure fixtures to become passing artifacts.
