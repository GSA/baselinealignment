---
layout: page
title: Contributing to the ICT Baseline Alignment Framework
---

## How you can help

We welcome contributions from accessibility testers, developers, test process and tool owners, writers, researchers, and other interested members of the public. Federal employees and people providing direct support to federal agencies may also participate in working group activities with appropriate approval.

Submit feedback and questions through [GitHub issues](https://github.com/GSA/baselinealignment/issues){: .usa-link .usa-link--external} and proposed changes through [pull requests](https://github.com/GSA/baselinealignment/pulls){: .usa-link .usa-link--external}. You may also contact [ictbaseline@gsa.gov](mailto:ictbaseline@gsa.gov) with contribution questions or recommendations.

When reporting a problem, include the affected page, resource, or test case ID; the source or collection revision when known; your testing process and environment; the observed behavior; and supporting evidence. This information helps maintainers reproduce and evaluate the issue.

### Choose an issue type

The repository provides targeted issue forms so contributors can supply the information needed for review:

| Issue type | Use it for |
| --- | --- |
| Test case proposal or change | New cases or samples, additional scenarios, and corrections to existing case records or sample files. |
| Unexpected result or case discrepancy | Differences between a preserved test-process result and a Framework expectation. |
| Evaluation framework improvement | General evaluation guidance, manifests, coverage, schemas, templates, controlled expectations, policies, or validation tooling. |
| Accessibility SI resource issue | Instructions, skills, workflows, mappings, references, packaging, scripts, or the AI/SI evaluation profile. |
| Website or documentation issue | Content, links, navigation, accessibility, usability, rendering, or plain-language concerns. |
| General question or proposal | Questions and proposals that do not fit a more specific form. |

Select the most specific form available. Do not include credentials, private data, sensitive prompts, or other information that should not be public. For a discrepancy, preserve the original candidate result before consulting expected outcomes and keep the accessibility finding separate from the Framework comparison.

### Develop and evaluate test cases

Framework cases help test process and tool owners determine whether their methods produce results consistent with the ICT Testing Baseline. Contributions may include:

* Web content samples that demonstrate passing, failing, or not-applicable scenarios for a specific procedure.
* Test case metadata, expected results, rationale, and instruction-level details.
* Reviews of existing cases, sample dependencies, and Baseline procedure references.
* Reports of ambiguous instructions or differences between a test process and a case's expected result.
* Additional scenarios that improve procedure, outcome, and edge-case coverage.

Use the existing cases and the repository's test case template as authoring references. A proposed case should identify the relevant Baseline procedure and should not imply that one case evaluates every requirement on a page.

### Improve test process evaluation guidance

The [test process evaluation framework](evaluating-test-processes.html) and [general evaluation package](https://github.com/GSA/baselinealignment/tree/main/evaluations){: .usa-link .usa-link--external} apply to manual, automated, hybrid, and AI/SI-enabled processes. Contributions can improve case selection, independent execution, comparison methods, discrepancy analysis, process and component modeling, structured reporting, and guidance for interpreting coverage.

Evaluation guidance must preserve the distinction between an accessibility finding and the comparison outcome. For example, correctly identifying an expected content failure is a matched classification. It must also avoid treating a score from the available cases as certification or complete Baseline alignment.

When proposing a change, describe the kinds of processes affected, the evidence the change would collect, and how it addresses incomplete coverage or other limitations.

The repository-level `evaluations/` directory is canonical for the case manifest, coverage inventory, process-neutral schema and template, controlled expectations, publication policy, and general validation status. Keep expected outcomes under evaluator control and version schema or expectation changes so historical results remain interpretable.

### Improve Accessibility SI resources

The [`accessibility-si` collection](accessibility-si.html) contains instructions, task-specific skills, shared references, workflows, structured mappings, evaluation resources, and maintenance scripts. Contributions may address:

* Web or document creation, remediation, and testing guidance.
* WCAG and Baseline mappings, scope, exceptions, and dispositions.
* Word, Excel, PowerPoint, PDF, or web-format references.
* AI/SI-specific process integration and evaluation guidance.
* The AI/SI evaluation profile and compatibility with the general result model.
* Packaging, validation, source attribution, and publication status.

Identify the canonical source before editing the collection. Update shared mappings or references and regenerate their derived copies instead of changing generated or skill-local copies independently. From the repository root, the primary maintenance checks are:

```sh
python accessibility-si/scripts/refresh-resources.py
python accessibility-si/scripts/refresh-resources.py --check
python accessibility-si/scripts/validate.py
```

When committed Framework cases are added or corrected, maintainers should also refresh the case inventory with the full source revision as described in the [collection maintenance guidance](https://github.com/GSA/baselinealignment/blob/main/accessibility-si/README.md#change-and-validate-the-collection){: .usa-link .usa-link--external}.

Technical checks do not replace qualified human review or executed accessibility testing. Proposed changes should state the checks performed, evidence collected, and review that remains.

### Support outreach, governance, and the website

We also welcome help with:

* Writing and editing in plain language.
* Website design, accessibility, usability, and long-term maintenance.
* Articles, announcements, presentations, and other outreach materials.
* Project governance, change control, issue triage, and resolution of technical disagreements.
* Explaining the Framework to Section 508 program managers, procurement personnel, testers, developers, and vendors.

## How we work

Working groups meet as needed to make technical decisions and resolve issues. Broader project communication and collaboration take place primarily in the [GitHub repository](https://github.com/GSA/baselinealignment){: .usa-link .usa-link--external} and secondarily through email.

If you are new to GitHub, see [GitHub's documentation for contributing to projects](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project){: .usa-link .usa-link--external} and [creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue){: .usa-link .usa-link--external}.
