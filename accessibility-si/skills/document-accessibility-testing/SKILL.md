---
name: document-accessibility-testing
description: Test Word, Excel, PowerPoint and PDF against ICT Document Baseline 1.0 procedures, applicable incorporated WCAG 2.0 A/AA and separately labeled WCAG 2.1/2.2 supplemental checks. Use for native/export review, human-guided evaluation and remediation retests.
---

# Document accessibility testing

1. Read scope, criterion entries, Document Baseline and the relevant format reference. Identify non-web scope and the intended reader/mode, OS, assistive technology and dependency versions.
2. Inventory meaningful content, native structures, controls, media, tables and embedded objects. Apply the four E205.4 exceptions and retained not-applicable Baseline categories explicitly; keep 24.A as no-test-required.
3. Use the official procedure's applicability, instructions and outcome rules for every active Document Baseline check. Inspect programmatic structure and compare visual meaning with assistive technology output; test content interactions in delivery mode, not merely the editor's UI.
4. Test supplemental criteria with WCAG2ICT and format/reader-specific methods. Report not-tested or needs-human-review for unsupported or unavailable capabilities; never create a Baseline mapping for a newer success criterion.
5. Evaluate originals and exports independently, preserving formulas, sensitive/redacted content, state and source revisions. Keep checker results distinct from manual observations. Retest working copies after remediation and record regression gaps.
6. Report evidence and reviewed applicability per check, complete-process coverage, unavailable alignment cases and human-review status. Do not invent document Framework cases or claim published-case validation where none exists.

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
