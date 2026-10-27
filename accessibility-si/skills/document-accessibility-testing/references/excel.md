# Excel authoring and testing

Use this reference with the full criterion and Document Baseline references. Evaluate the workbook as a document, including hidden/filtered states that are part of its intended operation; distinguish authoring UI from workbook functionality.

## Create or remediate

- Use meaningful workbook/worksheet titles and a clear entry point describing purpose and navigation. Preserve formulas, data types, validations and calculations during remediation.
- Put related data into coherent regions, preferably native tables where appropriate; provide meaningful table/column headers and a logical navigation path.
- Avoid merged cells within data regions when they disrupt associations, sorting or navigation. A merged title outside a data table may be usable; assess the actual structure. Spreadsheet cells do not split in the same sense as HTML or Word table cells.
- Leave genuinely absent data blank where that accurately represents the data; use a meaningful missing-value explanation where users need to distinguish not applicable, not collected or zero. Do not replace blanks indiscriminately or change numeric data into text.
- Give charts meaningful names and equivalent alternatives or accessible source data with enough explanation to communicate the point.
- Provide more than color for conditional formatting, errors and categories. Check contrast in cells, charts and author-provided controls.
- Use meaningful links and labeled interactive form elements; test keyboard operation, selection, validation and error messages with synthetic data.
- Assess wide/complex tables under the applicable two-dimensional-layout exception for supplemental reflow. Do not use it to exempt unrelated narrative or every part of the workbook.

## Evaluate

Run the native checker, inspect table/header relationships and follow a human keyboard route through representative regions. Read headers and data with the intended screen reader; check whether users can determine the current location and relationships. Inspect text, charts, notes and meaningful content missed by the primary reading path. Test intended protection, filters, frozen regions and input states; preserve the user's ability to operate them.

Check workbook and sheet language exposure in the actual version. If the format/tool lacks a needed programmatic mechanism, record the limitation and delivery implications rather than inventing HTML attributes. Reopen the delivered workbook and any export and test each independently. Preserve accessibility without changing the analytic results.

Source: [Section508.gov accessible spreadsheets](https://www.section508.gov/create/spreadsheets/). Use the current format-specific guide for detailed UI steps.
