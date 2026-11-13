---
name: accessible-document-creation
description: Create or remediate accessible Word, Excel, PowerPoint and PDF content toward WCAG 2.2 A/AA, interpreted for non-web documents, with Section 508 exceptions and Document Baseline 1.0 scope preserved. Use for native documents, templates and exported deliverables.
---

# Accessible document creation

1. Establish document scope and identify applicable accessibility requirements. Consult the bundled scope reference, then retrieve the relevant WCAG criterion entries, Document Baseline procedures and document-format guidance as needed. Maintain an inventory of applicable requirements so selective retrieval does not result in incomplete coverage. Establish native and exported delivery formats, reader/OS and user tasks.
2. Apply E205.4's four non-web exceptions and E205.4.1 substitutions. Use WCAG2ICT for informative interpretation of supplemental criteria. Do not transfer HTML-specific techniques or software UI obligations mechanically into document content.
3. Build native structure, descriptive titles/language, meaningful sequence, alternatives, reliable data relationships and usable interaction/media. Preserve workbook formulas, slide behavior and true redactions. Assess blank/merged cells by meaning and navigability rather than blanket rules. Draft text alternatives according to the purpose and context of each image or graphic, distinguishing informative content from decoration. Do not invent missing meaning or values. Treat generated text alternatives as drafts requiring human review, and identify uncertain alternatives for review by someone familiar with the content.
4. Cover relevant newer WCAG criteria in the actual format/reader; record unsupported mechanisms and applicability gaps. Omit active Parsing testing with traceability to 24.A.
5. Run available structural/checker tools, then verify the actual file with human keyboard/visual and applicable assistive technology testing. Inspect each exported artifact independently; accessible source content does not guarantee accessible export. When authorized to modify the document, compare relevant accessibility results before and after the change. Identify and correct newly introduced accessibility failures, even if the overall number of reported defects decreases.
6. Return the changed native file and any requested delivery export, mapping of changes to requirements, observations actually obtained and remaining human acceptance work. Never equate checker success, PDF tagging or PDF/UA validation alone with conformance.

## Preserve testing integrity

Do not resolve accessibility findings by disabling or weakening applicable tests, suppressing valid findings, or excluding problematic content from evaluation. Correct the underlying accessibility issue or report it as unresolved. Changes to testing procedures or configurations must be authorized, documented, and reviewed to confirm that they do not conceal accessibility failures.

When a human reviewer's finding differs from the agent's assessment, document the disagreement and supporting evidence. Do not independently dismiss or override the human finding; refer it for appropriate review.

## Bundled references

- [Scope](references/scope.md)
- [Source attribution](references/source-notices.md)
- [Wcag A Aa](references/wcag-a-aa.md)
- [Document Baseline](references/document-baseline.md)
- [Word](references/word.md)
- [Excel](references/excel.md)
- [Powerpoint](references/powerpoint.md)
- [Pdf](references/pdf.md)

Read relevant entries before acting. Keep this folder intact: all required procedural references are local. The caller may supply mappings and result schemas, but this skill has no required parent-repository dependency. Reference coverage does not establish completed validation.
