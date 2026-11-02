---
# REQUIRED. The layout must be "testcase" so the page is included in the
# rendered test case index and uses the test case layout.
layout: testcase

# REQUIRED. Use a concise title that identifies the content or behavior and
# the scenario being demonstrated. Do not rely on the title to communicate the
# expected result to an independent test-process candidate.
title:

# REQUIRED. Preferred ID format:
# TC[2-digit Baseline category].[procedure letter]-[instruction]-[result]-[example]
#
# Examples:
# TC06.A-1-fail-1       one failing example for instruction 6.A-1
# TC10.G-2.c-pass-1     one passing example for subinstruction 10.G-2.c
# TC06.A-all-pass-1     one example that passes all applicable instructions
# TC01.B-ic-dna-1       Identify Content finds that the procedure does not apply
#
# Use lowercase pass, fail, or dna in the ID. Use "ic" for an Identify Content
# DNA case and "all" when the case exercises all applicable instructions.
# Keep the ID unique and stable after publication.
tcid:

# REQUIRED. Increment when a published case changes in a way that affects its
# scenario, evidence, expected result, or interpretation. Quote the value so
# YAML treats it as a string.
tc-version: "1"

# REQUIRED. Version of the ICT Testing Baseline used by the case. Quote the
# value so YAML treats it as a string.
baseline-version: "3.1"

# REQUIRED. Standard and reference represented in the test case index.
# Most current web cases reference a WCAG success criterion.
standard: WCAG
standard-ref:
standard-ref-url:

# REQUIRED. Describe what the test process must detect or evaluate, the sample
# condition, and the result a successful process should identify. Use a block
# scalar for multiple paragraphs. Do not claim that the case evaluates every
# accessibility requirement on the sample page.
descr: |
  Describe the test objective and relevant content or behavior.

  Describe the sample condition and the expected Baseline classification.

# REQUIRED. Use exactly PASS, FAIL, or DNA.
result:

# REQUIRED. Briefly explain why the sample receives the expected result. This
# rationale is evaluator information and may contain Markdown or inline HTML.
result-descr:

# REQUIRED. Site-relative path to the primary sample file. Do not include the
# /baselinealignment base URL. Store the sample under the matching TF## folder.
# Example: /testfiles/TF06/06.A-1-fail-1.html
#
# In the sample, add id="tc_code" to the element that contains the content most
# relevant to the case. Preserve and document required CSS, JavaScript, images,
# frames, media, and other dependencies.
sample:
---

<!--
Use the table below for PASS and FAIL cases. Include:

1. The applicable Identify Content row or rows, using IDs such as **IC-1**.
2. Each procedure instruction needed to explain the expected result, using the
   current Baseline identifiers, such as **6.A-1** or **10.G-2.c**.
3. A **Result** row summarizing which checks pass, fail, or do not apply.

For a DNA case established during Identify Content, include the applicable IC
row and explain why the procedure does not apply. A separate Result row is not
required when the current cases and procedure establish DNA entirely in that
row.

Replace the example rows; do not leave placeholder content in a submitted case.
-->

| Test Instruction | Instruction Detail | Expected Test Case Result |
|------------------|--------------------|---------------------------|
| **IC-1** | Copy or accurately summarize the applicable Identify Content instruction. | Describe the content identified, or explain why the procedure does not apply. |
| **##.A-1** | Copy or accurately summarize the applicable test instruction and include relevant requirement references. | State Pass, Fail, or Not applicable and provide specific evidence from the sample. |
| **Result** | State the procedure's result rule. | Identify the checks that determine the expected case result. |
