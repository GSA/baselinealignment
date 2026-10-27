# PDF authoring, remediation and testing

Use this reference with the full criterion and Document Baseline references. Identify whether the delivered PDF is a non-web document or part of web content, and record its actual reader/assistive-technology environment.

## Create or remediate

- Repair an editable source first where feasible, then export with structure. When source repair is unavailable, remediate the actual PDF and retain an original.
- Establish searchable, accurate text; apply OCR to image-only pages where needed, then verify recognition. OCR alone does not create accessible structure or correct reading order.
- Set title and primary language; mark language changes through supported structure. Organize headings, paragraphs, lists and tables in meaningful tags with valid content associations.
- Reconcile tag order, content order and annotation/form tab order. They are distinct. Mark decoration as artifacts without hiding meaningful content.
- Give graphics equivalent alternatives and complex figures meaningful extended descriptions or accessible data. Give table cells reliable header relationships, including complex headers.
- Label form fields, expose names/roles/states/values, provide visible instructions and usable validation, and preserve keyboard behavior. Check link annotations and destinations.
- Address contrast, non-color cues, image-of-text issues, media and text enlargement in the actual file. Check supplemental reflow and other criteria with a reader-specific method and documented applicability.
- Verify security settings do not prevent the intended accessibility-supported reading. Apply redactions using genuine removal mechanisms before remediation; never reintroduce sensitive content in tags, alternative text, OCR layers, attachments or metadata.

## Evaluate

Use a PDF checker and structural inspection, then compare the visual pages with assistive technology reading and keyboard interaction. Inspect meaningful order, headings, lists, tables, figures, links and forms across the complete document. A tags panel, a clean checker result or PDF/UA validation alone does not establish Section 508 or WCAG conformance. Read-aloud alone is not a substitute for relevant assistive technology testing.

Test the actual delivery reader and export, including reflow/zoom and media where applicable. Confirm logical structure stays aligned after content changes or redactions. If a required behavior cannot be verified in this environment, record a gap and arrange a qualified test; do not mark it passing.

Source: [Section508.gov accessible PDFs](https://www.section508.gov/create/pdfs/). Use the current guide and the chosen tool's official documentation for implementation details.
