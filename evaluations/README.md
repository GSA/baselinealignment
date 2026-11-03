# Test process evaluation resources

This directory contains the process-neutral evaluation framework for the ICT Baseline Alignment Framework. Use it to evaluate a complete test process or a clearly scoped tool, component or subprocess composed of manual procedures, automated tools, assistive technologies, scripts, organizational decision rules, human review, AI/SI-enabled tools or any combination of these.

Start with the site's [Evaluating a Test Process](../evaluating-test-processes.md) guidance. These files provide the versioned corpus, coverage information, structured records and evaluator controls that support that method.

**Framework test-process evaluation is Web-only.** Document procedures may be used to record results for users' own documents, but no document Framework case-evaluation workflow is available. The [reporting data model and implementation plan](../reporting-tool/README.md) defines the 1.0.0 format for Jekyll, vanilla JavaScript, and USWDS, with representative synthetic records and the deferred sample-naming work.

## Resource directory

| Resource | Purpose |
| --- | --- |
| [test-manifest.yaml](test-manifest.yaml) | Pins Framework cases, records, primary samples, hashes, procedure mappings and review/execution status. |
| [coverage.md](coverage.md) | Shows published case availability by procedure; it does not represent execution or complete scenario coverage. |
| [result-template.json](result-template.json) | Process-neutral starting record for an evaluation run. |
| [results-schema.json](results-schema.json) | JSON Schema for the general result format. |
| [process-profile-schema.json](process-profile-schema.json) | Reusable component/rule/mapping profile shared with run snapshots. |
| [ai-si-profile-schema.json](ai-si-profile-schema.json) | Formal AI/SI component profile required for `ai-si-tool`, shared by result and reusable process records. |
| [templates/artifact-report.json](templates/artifact-report.json) | Draft results for users' own artifacts, without Framework comparisons. |
| [examples/](examples/) | Synthetic profile, candidate, process-evaluation, and artifact-report records. |
| [publication-and-coverage.md](publication-and-coverage.md) | Defines evidence and publication safeguards. |
| [validation-status.md](validation-status.md) | Separates completed structural work from pending review and execution. |
| [evaluator/expected-outcomes.yaml](evaluator/expected-outcomes.yaml) | Controlled comparison data; freeze candidate results before use. |

## Three kinds of coverage

Always distinguish:

1. **Process coverage:** the applicable Baseline procedures the documented process claims to address.
2. **Case coverage:** the procedures and scenarios represented by available Framework cases.
3. **Evaluation coverage:** the cases actually executed with a pinned process configuration and environment.

A full test process should cover every applicable Baseline procedure through its complete combination of components. A component evaluation may be narrower, but its boundaries, selection rationale and reliance on other components must be explicit.

## General result model

The general schema records:

- A pinned suite and evaluation run.
- The evaluated process and its component tools, methods and roles.
- The environment and scope.
- Observed findings and evidence.
- Framework comparisons kept separate from accessibility findings.
- Human review, limitations and uncovered areas.

Component types include manual procedures, automated tools, browser tools, assistive technologies, scripts, AI/SI tools, human review and organizational subprocesses. Process-specific profiles may require additional fields without changing the core comparison model.

## Process-specific profiles

The Accessibility SI collection supplies an [AI/SI evaluation profile](../accessibility-si/evaluations/ai-si-profile.md) and retains its 0.2 structured result format for compatibility. The profile adds model and agent versions, supplied instructions and context, tool access, permissions, variability controls, evaluator-expectation isolation and original-output retention.

The reporting tool supports manual, automated, and hybrid profiles. Document artifact reporting does not use the Web case manifest or Framework comparisons. See the [published user guide](../reporting-guide.md) and [maintainer README](../reporting-tool/README.md).

The [AI/SI examples](examples/ai-si-process-profile.json) include a reusable configuration, a [standalone component profile](examples/ai-si-component-profile.json), [frozen candidate](examples/ai-si-process-candidate.json), and [evaluator record](examples/ai-si-process-evaluation.json). All are synthetic; no accessibility execution is asserted.

## Evaluator control

Candidate testers and tools should not receive expected outcomes before their results are frozen. The public case index and repository can expose outcome-bearing names, metadata and rationale, so evaluators must prepare appropriately controlled inputs and document any transformations.

The manifest hashes the case record and primary sample file. It does not hash every CSS, JavaScript, image, media, frame or network dependency. Preserve and record dependencies needed for faithful execution.

## Interpretation

Use `matched`, `mismatched` and `not-compared` for Framework comparisons. Keep those values separate from the candidate's `pass`, `fail`, `not-applicable`, `not-tested` or `incomplete` finding.

Do not describe an aggregate case score as certification, artifact conformance or complete Baseline alignment. Report the process configuration, case and procedure scope, evidence, gaps, discrepancies and review status.
