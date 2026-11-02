---
layout: page
title: Evaluating a Test Process
---

## Purpose

Use the ICT Baseline Alignment Framework to evaluate whether an accessibility test process produces results consistent with the ICT Testing Baseline for selected procedures and samples.

A test process is the complete set of methods used to reach and report an accessibility finding. It may include manual procedures, automated scanners, browser and developer tools, assistive technologies, format-specific inspection tools, scripts, organizational workflows, decision rules, human judgment, and AI/SI-enabled tools.

The evaluation produces evidence about the process as defined and executed in a particular environment. It does not certify the process or its tools, establish that a tested artifact conforms, or demonstrate complete Baseline alignment from a sample score.

## What the evaluation compares

Each Framework case identifies a sample, a Baseline procedure, and an expected result. The candidate test process evaluates the sample without receiving the expected result. After the candidate result is preserved, an evaluator compares it with the Framework expectation.

Keep these two outcomes separate:

* **Accessibility finding:** the process reports `PASS`, `FAIL`, `DNA` (does not apply), or that it could not complete the test.
* **Framework comparison:** the preserved finding is `MATCHED`, `MISMATCHED`, or `NOT COMPARED` against the expected case result.

For example, when a sample contains an expected failure, a candidate process that reports `FAIL` has produced a matched classification. The content did not pass, but the process classified it consistently with the Framework case.

## Evaluation framework

### 1. Define and pin the process

Document the process before evaluating it. Record enough information for another evaluator to understand and, where practical, reproduce it:

* Process name, owner, purpose, version, and date.
* Procedures, checklists, rulesets, decision rules, and reporting conventions.
* Manual, automated, and assisted components and the order in which they are used.
* Tool names, versions, configurations, and relevant browser or native application versions.
* Assistive technologies, input methods, platforms, and operating systems.
* Tester roles, qualifications, and points at which human judgment or review is required.
* Known capability limits, exclusions, and conditions that cause referral or an incomplete result.

Changes to a material component create a different process configuration. Record the change and evaluate the revised configuration separately rather than combining unlike results.

### 2. Select cases and document coverage

Select cases based on the purpose and claimed scope of the process. Record the procedures, scenarios, expected-outcome types, and content patterns represented by the selection.

An evaluation of a full test process should address every applicable Baseline test procedure using the complete combination of tools, manual methods, assistive technologies, decision rules, and subprocesses included in that process. Available Framework cases may not yet provide evidence for every procedure or scenario, so distinguish coverage built into the process from coverage demonstrated by the selected cases and identify gaps in both.

It may also be useful to evaluate an individual tool, component, or subprocess independently—for example, an automated scanner before its results enter a manual review workflow. For a component evaluation, clearly state that the evaluation is intentionally narrower than the full test process. Document the component's role, the boundaries of the evaluation, the rationale for selecting particular procedures and cases, and the other process components needed to address requirements outside that scope.

Use both passing and failing cases, and not-applicable cases where they are meaningful. Include varied scenarios for a procedure when available. A case count alone does not describe coverage: several cases may exercise the same narrow behavior while other procedures or edge cases remain untested.

Keep uncovered procedures and scenarios visible. The absence of an available case does not make a Baseline requirement inapplicable and should not be recorded as a process pass.

### 3. Prepare independent execution inputs

The people and tools executing the candidate process should receive the sample and the information normally needed to identify the applicable test, but not the expected result or evaluator rationale.

Evaluators can use the downloadable [JSON test case index]({{ site.baseurl }}/assets/baselineTestCases.json) or [CSV test case index]({{ site.baseurl }}/assets/baselineTestCases.csv) to select cases and configure tools to open specific sample URLs. These index files also contain expected results and may contain outcome-bearing names or metadata. Keep the complete index under evaluator control; provide the candidate process only the case identifiers, sample locations, applicable procedure information, or other fields necessary for independent execution.

Keep expected outcomes, explanatory case text, and outcome-bearing file names, page titles, comments, or identifiers outside the candidate environment when they could reveal the answer. If a neutral copy of a sample is needed, document the transformation and verify that behavior, structure, relationships, and dependencies remain equivalent.

Build and serve samples through the environment they require. A copied source file may not behave like a rendered page when it depends on Jekyll, Liquid, scripts, styles, media, or related resources.

### 4. Execute the normal test process

Run the process as it is ordinarily intended to operate. Do not add undisclosed steps solely to improve its evaluation result.

For each selected case, record:

* The finding and applicable procedure.
* Observations and evidence supporting the finding.
* The component or tester that performed each material check.
* Checks that were unavailable, incomplete, or referred for additional review.
* Deviations from the defined process and environmental problems.

Capability limits should be reported honestly. An incomplete test may be an appropriate process response, but it is not a completed correct classification.

### 5. Freeze results before comparison

Preserve the candidate results before an evaluator reveals or consults the expected results. Retain the original record when correcting data, resolving discrepancies, or rerunning a case.

This separation reduces confirmation bias and prevents the expected answers from becoming part of the process being evaluated.

### 6. Compare results

An evaluator compares each preserved finding with the corresponding Framework expectation and records:

* `MATCHED` when the candidate and expected classifications agree.
* `MISMATCHED` when they disagree.
* `NOT COMPARED` when an expectation has not been sufficiently reviewed, the candidate result is incomplete, the sample could not be prepared faithfully, or another documented condition prevents a sound comparison.

Do not convert unavailable checks, unexecuted tests, or no-test-required dispositions into passes. Preserve the difference between what the process observed and what the evaluator concluded about the comparison.

### 7. Investigate discrepancies

Investigate a mismatch before assigning its cause. Possible causes include:

* An incomplete or incorrect candidate procedure.
* A tool, configuration, environment, or interoperability difference.
* An ambiguous Baseline instruction or inconsistent decision rule.
* A flawed case, expected result, mapping, or rationale.
* A sample dependency or behavior-changing preparation step.
* A reporting or data-entry error.

Use the applicable Baseline procedure and authoritative standards to resolve the issue. Correct the appropriate part of the process or Framework resource, document the resolution, and retain the initial result alongside any rerun.

### 8. Report evidence, coverage, and gaps

An evaluation report should identify:

* The exact process configuration and environment evaluated.
* Framework, Baseline, case, and evaluation-data versions.
* Selected and completed cases.
* Procedure, scenario, and expected-outcome coverage.
* Matched, mismatched, and not-compared results.
* Unavailable capabilities and incomplete checks.
* Human review performed and still required.
* Resolved and unresolved discrepancies.
* Procedures and scenarios for which no evidence was collected.

Report counts and percentages only with their scope and denominator. Do not describe one aggregate score as “Baseline alignment.” A process claiming comprehensive alignment still needs to incorporate every applicable Baseline procedure; available Framework cases provide only part of the evidence for that claim.

## Evaluation resources

The repository's [general evaluation package](https://github.com/GSA/baselinealignment/tree/main/evaluations){: .usa-link .usa-link--external} supports this method:

| Resource | How to use it |
| --- | --- |
| [Case manifest](https://github.com/GSA/baselinealignment/blob/main/evaluations/test-manifest.yaml){: .usa-link .usa-link--external} | Pin case records, primary samples, hashes, procedure mappings, versions and review status. |
| [Coverage inventory](https://github.com/GSA/baselinealignment/blob/main/evaluations/coverage.md){: .usa-link .usa-link--external} | Identify which procedures have published cases; do not treat availability as execution or complete scenario coverage. |
| [General result template](https://github.com/GSA/baselinealignment/blob/main/evaluations/result-template.json){: .usa-link .usa-link--external} | Start a structured record for a complete process, component or subprocess evaluation. |
| [Result schema](https://github.com/GSA/baselinealignment/blob/main/evaluations/results-schema.json){: .usa-link .usa-link--external} | Record the process, components, environment, scope, findings, comparisons, review and limitations consistently. |
| [Publication and coverage policy](https://github.com/GSA/baselinealignment/blob/main/evaluations/publication-and-coverage.md){: .usa-link .usa-link--external} | Apply safeguards for evidence, review, coverage and public claims. |
| [Validation status](https://github.com/GSA/baselinealignment/blob/main/evaluations/validation-status.md){: .usa-link .usa-link--external} | Distinguish completed structural work from pending review and execution. |

Expected outcomes are maintained separately under evaluator control. Freeze candidate results before consulting them. The general result schema represents each tool, method or organizational step as a process component and supports manual, automated, hybrid, document and AI/SI-enabled evaluations without making any one approach the default.

Always distinguish process coverage, available case coverage and cases actually executed in an evaluation. The general package versions these as related but independent evidence.

## Adapt the framework to the process

The core method stays the same across process types, but the implementation details differ:

* **Manual processes:** record tester qualifications, instructions, judgment points, inter-rater review, and assistive technology or keyboard methods.
* **Automated tools:** record rulesets, configurations, target acquisition, result normalization, and checks the tool cannot perform.
* **Hybrid processes:** identify which component owns each check, how results are combined, and how conflicts or referrals are resolved.
* **AI/SI-enabled processes:** record model and agent versions, instructions and supplied context, tool access, human involvement, variability controls, and protection of evaluator expectations.
* **Document processes:** record the native application, document format, export path, inspection tools, and separate checks of source and delivered formats.

See [Accessibility SI Resources](accessibility-si.html) for AI/SI-tailored instructions, skills, workflows, and structured evaluation resources.

## Interpret results responsibly

Framework evaluations are most useful as diagnostic evidence. They can reveal missing procedures, inconsistent decisions, tool limitations, unclear instructions, and opportunities to improve cases or expected results.

Avoid claims that exceed the evidence:

* A matched case does not establish that every requirement was checked.
* A selected case set does not represent uncovered procedures or scenarios.
* A process result does not establish that a separate artifact conforms.
* File identity, source hashes, or structural validation do not show that accessibility tests were executed.
* Publication of a case or expectation does not by itself establish completed review.

As the Framework adds and reviews cases, retain earlier scoped results and identify the versions used so that evaluations remain understandable over time.

## Provide feedback

Report unclear guidance, unexpected results, or proposed improvements through [GitHub issues](https://github.com/GSA/baselinealignment/issues){: .usa-link .usa-link--external}. Include the case ID, process configuration, environment, observed evidence, and the result you expected. See [Contributing](contributing.html) for additional guidance.
