---
# The layout must be 'testcase'; DO NOT Change
layout: testcase

# Brief, descriptive title for the test case
title: insufficient contrast in logotype, logo, or brand name image of text 

# The Test Case ID should follow the pattern: 
# TC[Baseline Test Procedure #]-[Test Instruction #]-
# [Expected Result (pass/fail/dna)]-[example #], e.g., TC05.1-1-fail-1
tcid: TC8.1-ic-dna-1

# Description of the Test Case, the included code sample, test considerations,
# and rationale for the expected result according to the applicable ICT

# Baseline test
descr: Detect the visual presentation of text, images of text or logos. The following types of text and images of text are pure decoration purposes and not meaningful, having no functionality.


# Reference and link to the applicable ICT Baseline test
app-baseline:|[8.1 Test Procedure for Contrast Minimum](https://section508coordinators.github.io/ICTTestingBaseline/08Contrast.html#81-test-procedure-for-contrast-minimum)

  **Baseline Test ID:** 8.1-Contrast
    
  **Test Instruction:** IC


# Expected result that the ICT Baseline would predict
# [Pass | Fail | DNA]
result: DNA

# Brief description of the rationale for the expected result
result-descr: Detect the visual presentation of text, images of text or logos. The following types of text and images of text are pure decoration purposes and not meaningful, having no functionality.

# URL for the code sample
# In the sample code file, add id="tc_code" to the 
# element that contains the relevant code snippet.
#
# Then upload the code sample to the 'testfiles' folder 
# and provide the link (and only the url) below.
sample: /testfiles/TF08/08.1-ic-dna-1.html 

# Table of test instructions, including the following table headers: 
# Test Instruction #; Instruction Detail; Expected Test Case Result
#
# Include the table in the content section below
---
| Test Instruction | Instruction Detail | Expected Test Case Result |
|------------------|--------------------|---------------------------|
|IC| All visible text AND images of text (except those noted in Limitations, Assumptions, or Exceptions above)| Presence of a decorative image. |
| Results || Does Not Apply |
