---
layout: page
title: Accessibility SI Resources
---

## About the collection

The Accessibility SI collection provides portable instructions, task-specific skills, references, workflows, mappings, and evaluation resources for creating, remediating, and testing accessible web content and non-web documents. In this collection, **SI means Super Intelligence**.

The resources can be read and applied directly, supplied as task context, or loaded through a tool's supported instruction or skill mechanism. No particular agent, editor, operating system, or installation method is required.

Version 0.2.0 is a full-scope authored draft. Authored coverage does not establish completed human review, executed testing, proven Baseline alignment, artifact conformance, or certification. Consult the collection's [validation status](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/evaluations/validation-status.md){: .usa-link .usa-link--external} and the general framework's [validation status](https://github.com/GSA/baselinealignment/blob/main/evaluations/validation-status.md){: .usa-link .usa-link--external} for completed checks and remaining work.

## Relationship to the Baseline Alignment Framework

The Baseline Alignment Framework provides test cases with samples and expected results for specific Baseline procedures. The Accessibility SI collection provides guidance and process components that can be used to perform accessibility work and evaluate an AI/SI-enabled test process against selected Framework cases.

The general [Evaluating a Test Process](evaluating-test-processes.html) method and [repository-level evaluation package](https://github.com/GSA/baselinealignment/tree/main/evaluations){: .usa-link .usa-link--external} apply to any combination of manual procedures, tools, assistive technologies, scripts, organizational subprocesses, and AI/SI capabilities. The collection adds an [AI/SI profile](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/evaluations/ai-si-profile.md){: .usa-link .usa-link--external} covering models and instructions, tool capabilities and permissions, expected-result isolation, variability, original-output retention, and human review.

## Choose resources for a task

| Task | Start with | Supporting workflow |
| --- | --- | --- |
| Create or remediate web content | [Accessible web development](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/skills/accessible-web-development){: .usa-link .usa-link--external} | [Generate, test and remediate](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/workflows/generate-test-remediate.md){: .usa-link .usa-link--external} |
| Test web content | [Web accessibility testing](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/skills/web-accessibility-testing){: .usa-link .usa-link--external} | [Guided manual testing](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/workflows/guided-manual-testing.md){: .usa-link .usa-link--external} |
| Create or remediate Word, Excel, PowerPoint, or PDF documents | [Accessible document creation](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/skills/accessible-document-creation){: .usa-link .usa-link--external} | [Generate, test and remediate](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/workflows/generate-test-remediate.md){: .usa-link .usa-link--external} |
| Test non-web documents | [Document accessibility testing](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/skills/document-accessibility-testing){: .usa-link .usa-link--external} | [Guided manual testing](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/workflows/guided-manual-testing.md){: .usa-link .usa-link--external} |

For any task:

1. Apply the [starter instructions](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/instructions/accessibility-starter.md){: .usa-link .usa-link--external}.
2. Add the [development instructions](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/instructions/accessibility-development.md){: .usa-link .usa-link--external} when creating or remediating content.
3. Select the relevant skill and make its complete folder and bundled references available.
4. Follow the appropriate workflow and official sources.
5. Record the environment, checks performed, observed evidence, unresolved issues, capability limits, and pending human review.

Loading a skill does not automatically load the separate starter or development instructions. Confirm which resources are actually available in the working environment.

## Evaluate an AI/SI-enabled test process

First use the general [test process evaluation framework](evaluating-test-processes.html) to define the process, select cases, preserve independent execution, compare frozen results, investigate discrepancies, and report coverage.

For an AI/SI-enabled process, also record:

* Collection, Framework, and Baseline versions.
* Agent and model names and versions.
* System, project, skill, and task instructions supplied to the candidate.
* Tools, permissions, browser or native application, assistive technologies, and human involvement.
* Context boundaries and the method used to keep expected results and evaluator rationale out of candidate inputs.
* Variability controls, rerun policy, and retention of the original output.
* Checks that the system cannot execute and those requiring qualified human review.

Use the collection's [AI/SI-tailored evaluation workflow](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/workflows/validate-against-framework.md){: .usa-link .usa-link--external} and [AI/SI profile](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/evaluations/ai-si-profile.md){: .usa-link .usa-link--external} with the general [case manifest](https://github.com/GSA/baselinealignment/blob/main/evaluations/test-manifest.yaml){: .usa-link .usa-link--external}, [coverage inventory](https://github.com/GSA/baselinealignment/blob/main/evaluations/coverage.md){: .usa-link .usa-link--external}, and [structured result template](https://github.com/GSA/baselinealignment/blob/main/evaluations/result-template.json){: .usa-link .usa-link--external}.

An individual skill or copied collection does not contain the full Framework case corpus. Use a source checkout containing the referenced case records and samples. Keep evaluator expectations separately controlled; access to a public repository or published site can expose answers even when files are excluded from a site build.

## Use and integrate the resources

You may read the guidance directly, copy an intact individual skill, or use the complete collection. Preserve each selected skill's local references and preserve the complete relative directory structure when using the full collection.

See [Packaging and integrating the resources](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/packaging.md){: .usa-link .usa-link--external} for distribution options, tool-specific starting points, example task requests, maintenance responsibilities, and release guidance.

## Resource directory

| Resource | Purpose |
| --- | --- |
| [Instructions](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/instructions){: .usa-link .usa-link--external} | Shared expectations applied across accessibility tasks. |
| [Skills](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/skills){: .usa-link .usa-link--external} | Four self-contained task guides with local references. |
| [References](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/references){: .usa-link .usa-link--external} | Scope, criteria, procedures, source notices, and format guidance. |
| [Workflows](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/workflows){: .usa-link .usa-link--external} | Creation, testing, remediation, manual testing, and process-evaluation steps. |
| [Mappings](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/mappings){: .usa-link .usa-link--external} | Structured WCAG, Web Baseline, and document Baseline relationships and provenance. |
| [General evaluations](https://github.com/GSA/baselinealignment/tree/main/evaluations){: .usa-link .usa-link--external} | Canonical case inventory, coverage, process-neutral schema and template, controlled expectations, and publication policy. |
| [AI/SI evaluation profile](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/evaluations){: .usa-link .usa-link--external} | AI/SI-specific controls and retained version 0.2 compatibility schema and template. |
| [Scripts](https://github.com/GSA/baselinealignment/tree/main/accessibility-si/scripts){: .usa-link .usa-link--external} | Optional generation, validation, inventory, and packaging utilities. |

## Scope and limitations

The collection addresses all 55 active WCAG 2.2 Level A and AA criteria and accounts for procedures in Web Baseline 3.1 and Electronic Documents Baseline 1.0. It supports Word, Excel, PowerPoint, PDF, and web content within its documented scope.

The newer WCAG 2.1 and 2.2 criteria are supplemental to the criteria incorporated into Section 508; the Baselines do not map those newer criteria. The collection keeps those results separate and documents non-web exceptions, substitutions, dispositions, and coverage gaps.

Read the complete [scope and authority](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/references/scope.md){: .usa-link .usa-link--external} before making coverage or conformance claims.

## Contribute

See [Contributing](contributing.html) to report unclear guidance, mapping issues, unexpected results, or proposed improvements. Include the collection revision, affected resource or case ID, environment, observed behavior, and supporting evidence.
