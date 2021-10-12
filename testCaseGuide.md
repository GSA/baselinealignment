# Guide for Developing Test Case and Test Files
Test cases and their related test files will be used to demonstrate expected outcomes for Baseline test instructions.  Each of these test instructions is mapped to a 508 requirement ([draft Appendix A of the Baseline for Web](https://federalist-78ccea55-7a06-447c-aabf-bd620b207b74.app.cloud.gov/preview/atbcb/icttestingbaseline/nextupdateafter301/AppendixA/)) in the ICT Testing Baseline for Web. 

A note on developer tools: some contributors use VSCode and others use notepad++, depending on what they have access to. This work can all be done in the GitHub website, but some tasks would be much easier with a code editor.  

Thank you for contributing your time and skills to this!

## Baseline Alignment Resources
1. [Baseline for Web Alignment site](https://section508coordinators.github.io/baselinealignment/testcases.html) – Test Cases page
2. [Test Case map to Baseline Tests.xlsx](https://documents.max.gov/community-pages/_layouts/15/WopiFrame2.aspx?sourcedoc=%7b8C6CC728-95D2-4E54-826D-3CA97A7BCCA0%7d&action=edit) – list of all test cases for development on Max.gov
3. [Section508coordinators/baselinealignment](https://github.com/Section508Coordinators/baselinealignment) – Baseline Alignment GitHub repository
4. [ICT Baseline for Web](https://ictbaseline.access-board.gov/) – for reference. To request a change to the ICT Baseline for Web, please open a GitHub issue at <https://github.com/atbcb/ICTTestingBaseline/issues>.
5. [Contributing Test Case video play list](https://www.youtube.com/playlist?list=PLaqerowLitKmBu1MkZcJhu-VHmTBaDJho) - Youtube

## Claim Your Test Case
1. Go to the [Test Case map to Baseline Tests.xlsx](https://documents.max.gov/community-pages/_layouts/15/WopiFrame2.aspx?sourcedoc=%7b8C6CC728-95D2-4E54-826D-3CA97A7BCCA0%7d&action=edit) to see a listing of all test cases that are needed.
   - This spreadsheet is used for tracking of all test case development. 
   - All details for the test cases are included here, including a description of the test case and test file and filenames.
2. Enter your name (in the blank Assigned column) next to the test case you want to work on.
3. Change the status to “To Do” or “In Progress”, as appropriate.

## Develop the Test Case and Associated Files
Go to the [Section508coordinators/baselinealignment GitHub repo](https://github.com/Section508Coordinators/baselinealignment) and create a new branch for your work. If you've never used GitHub, you may want to start with [Introduction to GitHub](https://lab.github.com/githubtraining/introduction-to-github).

### Create the Test File
The Test File contains the code and includes HTML and any other supporting files needed.
1. Open an existing test file [in the GitHub repo](https://github.com/Section508Coordinators/baselinealignment), such as baselinealignment/testfiles/TF06/06.1-1-fail-1.html. Or create the new test file from scratch.
2. Save with a new filename, in the appropriate “testfiles” sub-folder (/TF##).  (Create a new /TF## folder if necessary.)
   - Obtain the filename from the spreadsheet. See the Test Case ID column and remove “TC”.
   - Test files follow this naming convention: [Baseline Test ID]-[test instruction #]-[pass/fail/dna]-[sequence # of this test].html
3. Edit/create the code in the HTML test file.
4. Ensure that the relevant code that you want displayed in the test case is enclosed in `<div id="tc_code">`. (A script will display this code snippet in the test case’s Test Detail section.)
    If you find that the relevant code cannot be enclosed in a `<div>`, please open an issue in the Baselinealignment github repo: (<https://github.com/Section508Coordinators/baselinealignment/issues>).
5.	Commit your changes (i.e., save or upload your files to your branch).

### Create the Test File
The Test Case file contains the description the Baseline’s evaluation of the test file.
1. Open the "_testcase_template.md" file in the "Templates" folder in the [GitHub repo](https://github.com/Section508Coordinators/baselinealignment).
   Alternatively, you can copen a published test case file from the "testcases" folder, such as TC06.1-1-fail-1.
2. Create a copy of the file.
3. Rename the duplicated file with the filename identified in the spreadsheet in the Test Case ID column. The file should be saved in the “testcases” folder. Test cases follow this naming convention:
    - TC[Baseline Test ID]-[test instruction #]-[pass/fail/dna]-[sequence #].md
    - Please note that the test case starts with “TC” and is markdown file format.
4. Update the content in the front matter (enclosed by “---"). Do not modify the lines that start with “#” or the identifier terms that precede a colon.)
    - Please do not edit the special characters, spaces, and blank lines, as these were inserted to format and build the page correctly.
    - Below is a sample test case markdown file with the text that should be edited in italics and highlighted. The editable text follows the identifier term and colon (and sometimes, special character) in each section.
