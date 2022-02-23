---
# The layout must be 'testcase'; DO NOT Change
layout: testcase

# Brief, descriptive title for the test case
title: Insufficient contrast ratio for small text (below 14 point) in an image of text

# The Test Case ID should follow the pattern: 
# TC[Baseline Test Procedure #]-[Test Instruction #]-
# [Expected Result (pass/fail/dna)]-[example #], e.g., TC05.1-1-fail-1
tcid: TC8.1-2-fail-4

# Description of the Test Case, the included code sample, test considerations,
# and rationale for the expected result according to the applicable ICT
# Baseline test
descr: Detect the foreground and background text and size contrast ratio. Determine whether contrast ratio is sufficient. The text in the code sample is sufficient contrast between the foreground and background.

# Reference and link to the applicable ICT Baseline test
app-baseline:|[8.1 Test Procedure for Contrast Minimum](https://section508coordinators.github.io/ICTTestingBaseline/08Contrast.html#81-test-procedure-for-contrast-minimum)

  **Baseline Test ID:** 8.1-Contrast
    
  **Test Instruction:** 1

# Expected result that the ICT Baseline would predict
# [Pass | Fail | DNA]
result: Fail

# Brief description of the rationale for the expected result
result-descr: The foreground and background text and size contrast ratio in the code sample provide sufficient contrast in an image of text.

# URL for the code sample
# In the sample code file, add id="tc_code" to the 
# element that contains the relevant code snippet.
#
# Then upload the code sample to the 'testfiles' folder 
# and provide the link (and only the url) below.
sample: /testfiles/TF08/08.1-2-fail-4.html 

# Table of test instructions, including the following table headers: 
# Test Instruction #; Instruction Detail; Expected Test Case Result
#
# Include the table in the content section below
---
| Test Instruction | Instruction Detail | Expected Test Case Result |
|------------------|--------------------|---------------------------|
|IC| All visible text AND images of text (except those noted in Limitations, Assumptions, or Exceptions above)|
| 8.1-1| Determine the contrast ratio of foreground and background in the image of text. | The contrast ratio for the text is 2.6:1 | 
| 8.1-2| Check that the contrast ratio is at least 4.5:1. (SC 3.1.4) | The contrast ratio is less than 4.5:1 (it is 2.6:1) |
| Results | Both of the above checks fail, then Baseline Test 8.1-Contrast Minimum.  | Fail |
