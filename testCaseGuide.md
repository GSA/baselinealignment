# Guide for Developing Test Case and Test Files
Test cases and their related test files will be used to demonstrate expected outcomes for Baseline test instructions.  Each of these test instructions is mapped to a 508 requirement ([Appendix A of the Baseline for Web](https://federalist-78ccea55-7a06-447c-aabf-bd620b207b74.app.cloud.gov/preview/atbcb/icttestingbaseline/nextupdateafter301/AppendixA/)) in the ICT Testing Baseline for Web. 

A note on developer tools: some contributors use VSCode and others use notepad++, depending on what they have access to. This work can all be done in the GitHub website, but some tasks would be much easier with a code editor.  

Thank you for contributing your time and skills to this!

## Baseline Alignment Resources
1. [Baseline for Web Alignment](https://section508coordinators.github.io/baselinealignment/testcases.html) – Test Cases page
2. [Test Cases](https://section508coordinators.github.io/baselinealignment/testcases.html) - Placeholder index with links to current test case documents
3. [Test Case map to Baseline Tests.xlsx](https://documents.max.gov/community-pages/_layouts/15/WopiFrame2.aspx?sourcedoc=%7b8C6CC728-95D2-4E54-826D-3CA97A7BCCA0%7d&action=edit) – list of all test cases for development on Max.gov
4. [Section508coordinators/baselinealignment](https://github.com/Section508Coordinators/baselinealignment) – Baseline Alignment GitHub repository
5. [ICT Baseline for Web](https://ictbaseline.access-board.gov/) – for reference. To request a change to the ICT Baseline for Web, please open a GitHub issue at <https://github.com/atbcb/ICTTestingBaseline/issues>.
6. [Contributing Test Case video play list](https://www.youtube.com/playlist?list=PLaqerowLitKmBu1MkZcJhu-VHmTBaDJho) - Youtube

## Download Notepad++
You may wish to use Notepad++, which can be easier to use than Notepad:
- Search online for Notepad++
- Download the latest release (as of this writing, npp.8.1.3 portable) if it is not blocked by your agency
- Unzip (extract) the folder
- Go to the .exe and run all
- Open the app

## Claim Your Test Case
1. Go to the [Test Case map to Baseline Tests.xlsx](https://documents.max.gov/community-pages/_layouts/15/WopiFrame2.aspx?sourcedoc=%7b8C6CC728-95D2-4E54-826D-3CA97A7BCCA0%7d&action=edit) on Max.gov to see a listing of all test cases that are needed.
   - This spreadsheet is used for tracking of all test case development. 
   - All details for the test cases are included here, including a description of the test case and test file and filenames.
2. Enter your name (in the blank Assigned column) next to the test case you want to work on.
3. Change the status to “To Do” or “In Progress”, as appropriate.

## Develop the Test Case and Associated Files
Go to the [Section508coordinators/baselinealignment GitHub repo](https://github.com/Section508Coordinators/baselinealignment) and create a new branch for your work. If you've never used GitHub, you may want to start with [Introduction to GitHub](https://lab.github.com/githubtraining/introduction-to-github).

### How to Create a Branch in GitHub
1. In the [baseline alignment repo](https://github.com/Section508Coordinators/baselinealignment), find the button labeled "master." It should be the first item after the main navigation, in the upper left corner of the main content.
2. Open the "master" dropdown.
3. In the "find or create a branch" textbox, give your branch a name.
4. GitHub will create the branch for you.

### How to Download the Repository
While you can work with GitHub online, you may find it easier to work locally.
1. Find the "code" dropdown in the [baseline alignment repo](https://github.com/Section508Coordinators/baselinealignment).
2. Choose "download ZIP," the last option under the "code" dropdown.
3. Once the download is done, create a folder and move the downloaded ZIP file to your folder.
4. Extract all.
5. Open the test case template in Notepad++ and get to work!

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
   Alternatively, you can open a published test case file from the "testcases" folder, such as TC06.1-1-fail-1.
2. Create a copy of the file.
3. Rename the duplicated file with the filename identified in the spreadsheet in the Test Case ID column. The file should be saved in the “testcases” folder. Test cases follow this naming convention:
    - TC[Baseline Test ID]-[test instruction #]-[pass/fail/dna]-[sequence #].md
    - Please note that the test case starts with “TC” and is markdown file format.
4. Update the content in the front matter (enclosed by “---"). Do not modify the lines that start with “#” or the identifier terms that precede a colon.)
    - Please do not edit the special characters, spaces, and blank lines, as these were inserted to format and build the page correctly.
    - Below is a sample test case markdown file with the *text that should be edited preceded by "edit:"*. The editable text follows the identifier term and colon (and sometimes, special character) in each section.

        \# The layout must be 'testcase'; DO NOT Change `layout: testcase`
    
        `layout: testcase`

        \# Brief, descriptive title for the test case
    
        `title: `edit: `Image - no accessible name or description`

        \# The Test Case ID should follow the pattern: 
        
        \# TC\[Baseline Test Procedure #\]-\[Test Instruction #\]-
        
        \# \[Expected Result (pass/fail/dna)\]-\[example #\], e.g., TC05.1-1-fail-1
    
        `tcid: `edit: `TC06.1-1-fail-1`
    
        \# Description of the Test Case, the included code sample, test considerations,
        \# and rationale for the expected result according to the applicable ICT
        \# Baseline test
    
        `descr: |` (Developer note: please do not edit the syntax here, or your file may not render as expected. Start your description entry on the next line.)
    
       edit: `Detect existence of attributes that would contribute to the accessible name and accessible description computation and calculate the text alternative for the image.`

        edit: `The code sample data input does not include any attributes that would contribute to accessible name or accessible description output. A successful test should identify a failure against Baseline 6. Images.`
    
        \#Reference and link to the applicable ICT Baseline test
    
        `app-baseline: |` (Developer note: please do not edit the syntax here, or your file may not render as expected. Start your Baseline link entry on the next line.)

        edit: `[6.1 Test Procedure for Meaningful Images](https://section508coordinators.github.io/ICTTestingBaseline/06Images.html#61-test-procedure-for-meaningful-images)`
    
        `**Baseline Test ID.**: `edit: `6.1-MeaningfulImage`
    
        `**Test Instruction.** `edit: `1`
    
        \# Expected result that the ICT Baseline would predict
    
        \# [Pass | Fail | DNA]
    
        `result: `edit: `FAIL`
     
        \# Brief description of the rationale for the expected result
     
        `result-descr: `edit: `The image in the code sample does not provide any attributes that would contribute to an accessible name or description text alternative output.`
         
        \# URL for the code sample
    
        \# In the sample code file, add id="tc_code" to the 

        \# element that contains the relevant code snippet.

        \#

        \# Then upload the code sample to the 'testfiles' folder 

        \# and provide the link (and only the url) below.

        sample: edit: `/testfiles/TF06/06.1-1-fail-1.html`

        \# Table of test instructions, including the following table headers: 

        \# Test Instruction #; Instruction Detail; Expected Test Case Result
    
        \#
    
        \# Include the table in the content section below
        
    - Enter the table information (defined in markdown format) to describe the Test File’s result for each corresponding Baseline Test instruction. **COPY & PASTE the test instruction identifier and the Instruction Detail from the [ICT Baseline for Web](https://ictbaseline.access-board.gov/).**

        - Include all test instructions up to and including the instruction that determine the test result (pass/fail/dna). For example, if the third instruction determines the result, include the first, second, and third instructions in the table.
        - Do not edit the table column headers:
        
             `| Test Instruction | Instruction Detail | Expected Test Case Result |`

             `|------------------|--------------------|---------------------------|`
           
        - Edit the table data. Create additional rows as needed:
        
            | \*\*\[Baseline Test Instruction ID\]\*\* | \[Copy and paste from [Baseline](https://ictbaseline.access-board.gov/) instruction\] | \[describe the test file's result for this Baseline test instruction\] |

5. Commit your changes (i.e., save or upload your files to your branch).

## Update the Test Case Index File
**This is necessary because the Test Cases page is the main navigation to all test case/files on the Alignment website.**

1. Open the “testcases.md” file in the root folder in the GitHub repo.
2. Modify the list to add a link to your new test case. 
3. Commit your changes (i.e., save or upload your files to your GitHub branch).

## Open Pull Request
1. Open a pull request in [Pull requests · Section508Coordinators/baselinealignment](https://github.com/Section508Coordinators/baselinealignment/pulls)
2. Each pull request should include the 
    1. test case (markdown), ex: TC06.1-1-fail-1.md
    2. test file (HTML), ex: 06.1-1-fail-1.html
    3. Test case index update: testcases.md
3.	When you are ready for your pull request to be reviewed, assign Andrew (drewnielson) or Kathy (kengdoj) as reviewers. 
