---
name: Create Test Case and test file Template
about: Complete the information needed to request development of Test Cases
title: Create Test Case and test file for [Baseline Test ID]
labels: test case/test file
assignees: ''

---

1. Identify the Baseline Test ID in the Issue.
- Example: "Create Test Case and test file for 5.1-ChangeContent"

2. Create Test Case using template
- Filename convention is *TC[Baseline Test ID]-[test instruction #]-[pass/fail]-[sequence # of this test].html*
  - Ex: TC05.1-1-fail-1.html
  - If the Test Case is DNA, follow this filename convention: *TC[Baseline Test ID]-IC-DNA-[sequence # of this test].html*
- Folder: testcases/

3. Create test file using template
- Filename convention is *[Baseline Test ID]-[test instruction #]-[pass/fail/dna]-[sequence # of this test].html*
  - Ex: 05.1-1-fail-1.html
  - If the test file is DNA, follow this filename convention: *[Baseline Test ID]-IC-DNA-[sequence # of this test].html*
- Folder: testfiles/TF[#]/
