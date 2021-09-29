---
# The layout must be 'testcase'; DO NOT Change
layout: testcase

# Brief, descriptive title for the test case
title: Focus Visible - DNA: no components that receive keyboard focus 


# The Test Case ID should follow the pattern: 
# TC[Baseline Test Procedure #]-[Test Instruction #]-
# [Expected Result (pass/fail/dna)]-[example #], e.g., TC05.1-1-fail-1
tcid: TC2.1-ic-dna-1


# Description of the Test Case, the included code sample, test considerations,
# and rationale for the expected result according to the applicable ICT
# Baseline test
descr: | 
    The code sample presents a page with no components that receive keyboard focus. A successful test should identify a DNA against Baseline Test 2.1 Focus Visible.

# Reference and link to the applicable ICT Baseline test
app-baseline: | 
    [2.1 Test Procedure for Focus Visible](https://github.com/Section508Coordinators/ICTTestingBaseline/blob/section508coordinators301/02FocusVisible.md#21-test-procedure-for-focus-visible)

    **Baseline Test ID:** 2.1 Test Procedure for Focus Visible
    
    **Test Instruction:** Identify Content

# Expected result that the ICT Baseline would predict
# [Pass | Fail | DNA]
result: DNA

# Brief description of the rationale for the expected result
result-descr: No visual focus since there are no components that receive keyboard focus.

# URL for the code sample
# In the sample code file, add id="tc_code" to the 
# element that contains the relevant code snippet.
#
# Then upload the code sample to the 'testfiles' folder 
# and provide the link (and only the url) below.
sample: /testfiles/TF1/TC2.1-ic-dna-1.html

# Table of test instructions, including the following table headers: 
# Test Instruction #; Instruction Detail; Expected Test Case Result
#
# Include the table in the content section below
---
| Test Instruction | Instruction Detail | Expected Test Case Result |
|------------------|--------------------|---------------------------|
| **IC-1** | Keyboard accessible interface components (e.g., links, form fields, drop down menus, show/hide content, tree views, pop ups/light boxes, frames, iframes).| Not Applicable; page has several components but none that receive keyboard focus. |
