# AI/SI-enabled test process profile

Use this profile with the [general test process evaluation framework](../../evaluations/README.md) when a process component uses an agent, model or other AI/SI-enabled capability.

The shared reporting format 1.0.0 now formally defines the [AI/SI component profile 1.0.0](../../evaluations/ai-si-profile-schema.json), referenced by the general result and reusable process-profile schemas. A component with `type: ai-si-tool` requires this non-null structured profile. The reporting tool collects and validates its fields. See the [user guide](../../reporting-guide.md#aisi-components) and [synthetic hybrid AI/SI evaluation](../../evaluations/examples/ai-si-process-evaluation.json). The separate Accessibility SI 0.2 result format remains a distinct format; it is not automatically converted by the reporting tool.

## Required component information

For each AI/SI component, record in its general result `profile` object:

- Agent, model, provider and version or dated identifier.
- System, project, skill and task instructions.
- Supplied files, context and retrieval sources.
- Tools, permissions, network access and application access.
- Browser, native application, assistive technology and human involvement.
- Sampling, temperature or other available variability controls.
- Retry, rerun and output-selection policy.
- Original-output retention location and hashes where appropriate.
- Capability limits and checks referred for qualified human review.

The formal groups are `agent` (an identity object, or null for explicitly declared direct model use), `model`, `instructions`, `context`, `access`, `execution`, `variability`, `output_retention`, `isolation`, and `capability_limits`, with `profile_type: ai-si` and `profile_version: 1.0.0`. Required descriptions must contain non-whitespace text. Optional lists may be empty when no entries apply; capability limits require at least one explicit entry. Explain absent/unavailable instruction layers and controls rather than filling in presumed values.

Final records attributing observed or incomplete results to an AI/SI component require original-output references or an explicit `output_retention.unavailable_reason`. References/hashes are recorded assertions; the tool does not fetch or inspect the referenced files. A missing-output explanation is a gap, not validation evidence. Reusable-profile export/import and new-run creation clear original-output references and this per-run explanation while retaining configuration and retention policy. Full report imports/exports preserve them.

Do not include secrets, credentials or sensitive prompt content in a published result. Record a controlled reference or redacted description sufficient to identify the configuration.

## Independent execution

Keep expected outcomes, evaluator rationale and outcome-bearing metadata outside candidate inputs. Repository or website access may expose answers even when expectations are omitted from the immediate prompt. Record the isolation method, known exposure paths and any neutral-copy transformations.

Freeze original candidate output before comparison. Retain it when a case is rerun, instructions change or a discrepancy is corrected. Treat a material change to model, instructions, tool access, permissions or human involvement as a different process configuration.

## Variability and repeatability

Document whether a result represents one run or multiple runs. If multiple runs are performed, retain each result and state the sampling plan established before execution. Do not select only the most favorable output or overwrite an initial mismatch.

Variability is evidence about the process. Report inconsistent classifications, unavailable capabilities and human referrals rather than converting them into passes.

## Human responsibility

Identify which findings were produced by AI/SI, automated tools and people. Record who reviews evidence, resolves conflicts, performs checks requiring perception or assistive technology, and accepts the final report. An AI/SI component's inability to perform a check is not evidence that the requirement passes or does not apply.

Follow the collection's [AI/SI-tailored workflow](../workflows/validate-against-framework.md) and [packaging and integration guidance](../packaging.md) in addition to the general framework.
