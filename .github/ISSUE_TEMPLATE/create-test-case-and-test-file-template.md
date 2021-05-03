---
name: Request Test Case and/or Test File
about: Complete the information needed to request development of Test Cases and/or Test Files
title: Create Test Case and test file for [Baseline Test ID]
labels: test case/test file
assignees: ''

---

Follow the steps below, replace to describe your request for a specific Test Case and/or Test File:

1. Identify the Baseline Test ID and Baseline Test Instruction in the Issue Title.
- Example: "Create Test Case and Test File for 5.1-ChangeContent, Instruction [x]"

2. Describe the Test Case requirements and/or Test Case file parameters (if already known):
- Filename convention is *TC[Baseline Test ID]-[test instruction #]-[pass/fail]-[sequence # of this test].html*
  - Ex: TC05.1-1-fail-1.html
  - If the Test Case is DNA, follow this filename convention: *TC[Baseline Test ID]-ic-dna-[sequence # of this test].html*
- Folder: testcases/

3. Describe the Test File in order to meet the Test Case requirements and identify Test File parameters (if already known):
- Filename convention is *[Baseline Test ID]-[test instruction #]-[pass/fail]-[sequence # of this test].html*
  - Ex: 05.1-1-fail-1.html
  - If the test file is DNA, follow this filename convention: *[Baseline Test ID]-ic-dna-[sequence # of this test].html*
- Folder: testfiles/TF[#]/
