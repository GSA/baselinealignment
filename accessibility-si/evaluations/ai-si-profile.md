# AI/SI-enabled test process profile

Use this profile with the [general test process evaluation framework](../../evaluations/README.md) when a process component uses an agent, model or other AI/SI-enabled capability.

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
