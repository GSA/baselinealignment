---
layout: page
title: ICT Testing Baseline Alignment Framework
---

## About the Framework

The ICT Baseline Alignment Framework helps accessibility testers, test process owners, testing tool developers, and federal agencies evaluate whether their testing methods produce results consistent with the [ICT Testing Baseline for Web](https://ictbaseline.access-board.gov/){: .usa-link .usa-link--external}.

Each Framework test case pairs a web content sample with an expected Baseline result and instruction-level details. By applying their own procedures, tools, or combination of testing methods to the same sample, users can compare results, identify gaps, and improve consistency across accessibility testing processes.

Test cases and alignment guidance are still being developed. The available cases provide evidence for evaluating a test process; they do not constitute a complete accessibility test process, certify a tool or process, or establish that an artifact conforms to Section 508 or WCAG.

## Use the test cases

1. Browse the [Test Cases](testcases.html) and select a case relevant to the Baseline procedure you want to evaluate.
2. Read the case description, applicable procedure, and test instructions.
3. Open the linked sample and evaluate it using your normal test process.
4. Compare your finding with the expected result and instruction-level details. Results are `PASS`, `FAIL`, or `DNA` (does not apply).
5. Investigate differences and report unclear instructions or unexpected results through a [GitHub issue](https://github.com/GSA/baselinealignment/issues){: .usa-link .usa-link--external}. Include the test case ID, test process, and testing environment.

Samples intentionally include accessibility failures and situations in which a specific test does not apply. A passing result applies only to the checks described in that case; it does not mean the entire sample page passes every accessibility requirement.

The test case index also provides JSON and CSV downloads for spreadsheet, tool, and other analysis workflows.

## Evaluate a test process

A test process may combine manual procedures, automated scanners, browser and developer tools, assistive technologies, scripts, organizational decision rules, and AI/SI-enabled tools. The Framework provides a common method for evaluating whether that process classifies selected samples consistently with expected Baseline results.

The method asks process owners to define and pin the process, select cases and document coverage, keep expected results independent from the test execution, preserve results before comparison, investigate discrepancies, and report evidence and gaps. Matching the available cases is useful evidence, but it is not by itself a certification or a complete claim of Baseline alignment.

See [Evaluating a Test Process](evaluating-test-processes.html) for the general guidance and reporting framework.

## Accessibility SI resources

The repository also includes portable instructions, task-specific skills, references, mappings, workflows, and evaluation resources for creating, remediating, and testing accessible web content and non-web documents. These resources can support human, automated, hybrid, and AI/SI-enabled work.

The Accessibility SI collection includes tailored guidance for using AI/SI as part of a testing process and for evaluating that process with Framework cases. It is a full-scope authored draft with documented validation gaps; publication does not establish completed human review, proven Baseline alignment, or certification.

See [Accessibility SI Resources](accessibility-si.html) to choose resources and understand how they relate to the Framework.

## Contribute

We welcome new samples, reviews of expected results, clearer test instructions, improvements to the evaluation framework and Accessibility SI resources, website updates, and feedback from test process and tool owners.

See [Contributing to the ICT Baseline Alignment Framework](contributing.html) or contact [ictbaseline@gsa.gov](mailto:ictbaseline@gsa.gov) for more information.
