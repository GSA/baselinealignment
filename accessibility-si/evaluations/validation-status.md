# Collection validation status

Date: 2026-10-27. Collection: 0.2.0, full-scope authored draft.

## Implemented instruction coverage

- Four portable skills: web development, web testing, document creation and document testing.
- All 55 active WCAG A/AA criteria, partitioned into 37 inherited WCAG 2.0 criteria, 12 supplemental WCAG 2.1 criteria and 6 supplemental WCAG 2.2 criteria.
- Every procedure identifier in Web Baseline 3.1 (62 records) and Documents Baseline 1.0 (57 records), plus retained not-applicable categories and the moved Web 18.A slot. These counts include dispositions, not just active executed tests.
- Word, Excel, PowerPoint and PDF format references; non-web exceptions/substitutions, conformance requirements, scoped content and media-player controls.
- Parsing omitted from active checklists with traceability to each Baseline's 24.A no-test-required disposition.
- 147 existing web Framework cases mapped to procedures with source metadata, record/sample hashes and separate evaluator expectations. No published document cases or newer-criterion validation coverage is invented.

## Completed technical checks

- Four skill metadata validators; local reference/dependency checks; deterministic generated-reference drift checks.
- Criterion counts, version partitions, source procedure IDs, all 24 categories per domain, mappings, dispositions and source case hashes.
- Current case inventory matches the repository snapshot; all case prefixes map to known procedures.
- Result schemas and scoped templates for HTML, DOCX, XLSX, PPTX and PDF; complete web records contain 85 selected targets and document records 80, including supplemental, conformance and scoping checks. Separate dispositions are not counted as executed passes.
- Negative checks reject invented Baseline mappings for newer criteria, unobserved passes, missing full-scope targets, active Parsing results, unreviewed comparisons and contradictory comparison outcomes. A synthetic validator test confirms that a correctly classified content failure can match an expected failure. Synthetic inputs are not accessibility evidence.
- Standalone four-skill packaging, source notices, licensing and content-hash inventories. Core file I/O explicitly uses UTF-8.

## Task-local trials

An independent web task used the bundled skills to remediate a small form and record source/static evidence. An independent document task created a small Word document with headings, a data table, language/title metadata and a hyperlink. The document trial produced a one-page render, structural assertions and an automated structural audit; it did not claim native Word, keyboard or screen reader validation.

Both trials separated older Baseline checks from supplemental criteria and left unavailable rendered/native/assistive-technology work pending. They did not execute the 147-case corpus or establish complete conformance. The document trial exposed conflicting generic execution wording under retained/no-test-required entries; the generated references now give disposition-specific instructions. The document creation skill now requests only delivery exports actually requested by the user.

## Remaining validation

- Qualified human review of all authored guidance, mappings, exceptions and format interpretations.
- Complete official-procedure execution with representative browser/reader and assistive-technology environments; native application and keyboard tests.
- Execution and discrepancy review against the published Framework cases, plus future document and supplemental scenarios.
- Case dependency verification and behavior-preserving neutralization for independent evaluation. Listing/hashing case records and samples is not a substitute for this work.
- Any agent/environment-specific compatibility claims. None is included in this generic collection.

This is a reviewable full-scope instruction set with explicit validation gaps, not a validated test-process alignment claim, artifact conformance report or certification. Publish reviewed modules and available evidence incrementally under the coverage policy.
