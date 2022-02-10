---
# The layout must be 'testcase'; DO NOT Change
layout: testcase

# Brief, descriptive title for the test case
title: insufficient contrast in non-functional, non-meaningful, decorative image of text

# The Test Case ID should follow the pattern: 
# TC[Baseline Test Procedure #]-[Test Instruction #]-
# [Expected Result (pass/fail/dna)]-[example #], e.g., TC05.1-1-fail-1
tcid: TC8.1-ic-dna-3

# Description of the Test Case, the included code sample, test considerations,
# and rationale for the expected result according to the applicable ICT

# Baseline test
descr: Detect the foreground and background text and size contrast ratio. Determine whether contrast ratio is sufficient. The text in the code sample is sufficient contrast between the foreground and background.


# Reference and link to the applicable ICT Baseline test
app-basline:|[8.1 Test Procedure for Contrast Minimum]https://section508coordinators.github.io/ICTTestingBaseline/08Contrast.html#81-test-procedure-for-contrast-minimum

  **Baseline Test ID:** 8.1-Contrast
    
  **Test Instruction:** 1


# Expected result that the ICT Baseline would predict
# [Pass | Fail | DNA]
result: DNA

# Brief description of the rationale for the expected result
result-descr: The foreground and background text and size contrast ratio in the code sample provide sufficient contrast in non-functional, non-meaningful, decorative image of text.
 
# In the sample code file, add id="tc_code" to the 
# element that contains the relevant code snippet.
#
# Then upload the code sample to the 'testfiles' folder 
# and provide the link (and only the url) below.
sample: /testfiles/TF08/08.1-ic-dna-3.html 

# Table of test instructions, including the following table headers: 
# Test Instruction #; Instruction Detail; Expected Test Case Result
#
# Include the table in the content section below
---
| Test Instruction | Instruction Detail | Expected Test Case Result |
|------------------|--------------------|---------------------------|
|IC| All visible text AND images of text (except those noted in Limitations, Assumptions, or Exceptions above)|
| 8.1-1| Determine the contrast ratio of foreground and background in the image of text. | The contrast ratio for the text is DNA. | 
| If the above check fail, then Baseline Test 8.1 contrast contrast fail. | DNA - Test 8.1-Color contrast does not apply because the image is a logo. Logos and brand names are exempt for color contrast 8.1 test. |
