# Document Baseline mappings and coverage

This directory contains the canonical, machine-readable [Electronic Documents Baseline 1.0 inventory](baseline.yaml). It accounts for every numbered procedure and retained not-applicable category, connecting official source links, authored checklists, applicable requirements, procedure dispositions and review/evaluation status. Separate format references address Word, Excel, PowerPoint and PDF.

**Using the resources?** Follow the user guidance below to find document skills, readable references and coverage information. **Maintaining the resources?** Follow the maintainer guidance to update canonical mappings and regenerate dependent references. Return to the [collection README](../../README.md) for the complete user and maintainer paths.

## For users: apply or inspect document guidance

| Your task | Start here |
| --- | --- |
| Create or remediate a document | [Accessible document creation](../../skills/accessible-document-creation/SKILL.md), including its bundled format references |
| Test a document | [Document accessibility testing](../../skills/document-accessibility-testing/SKILL.md), including its bundled format references |
| Trace procedures to requirements and dispositions | The readable [Document Baseline reference](../../references/document-baseline.md); inspect [baseline.yaml](baseline.yaml) when structured mappings are needed |
| Assess a testing process | The [general Framework evaluation resources](../../../evaluations/README.md), [AI/SI workflow](../../workflows/validate-against-framework.md) and [coverage inventory](../../../evaluations/coverage.md), subject to the document-case gaps below |

The mapping is a traceability and task-guidance resource. Read the official procedures for complete applicability, test steps, definitions, exceptions and outcomes. A mapped procedure contributes targeted evidence; its presence does not establish full criterion coverage or completed testing. Use [packaging guidance](../../packaging.md) for copying resources and loading them in your environment.

## For maintainers: update document mappings

| Change | Canonical source |
| --- | --- |
| Document procedures, checklists, dispositions and procedure-level status | [baseline.yaml](baseline.yaml) |
| Shared criterion guidance and criterion-to-procedure relationships | [../wcag-a-aa.yaml](../wcag-a-aa.yaml) |
| Document-format interpretation and shared scope/attribution guidance | The corresponding authored files in [../../references/](../../references/) |
| Pinned source provenance | [../sources.json](../sources.json), coordinated with the source revisions in affected catalogs |

Review changes against official procedure identifiers, links, applicability, exceptions and outcomes. Keep relationships consistent across the procedure inventory and shared criterion catalog. Record review evidence before promoting entries to reviewed status, and keep case availability distinct from observed evaluations.

After editing canonical sources, use `scripts/refresh-resources.py` from the collection to regenerate the readable document procedure reference, coverage inventory and required skill-local reference copies. Do not edit generated copies independently. Follow the [collection maintenance procedure](../../README.md#change-and-validate-the-collection) for commands, dependencies, source checks and review requirements.

Adding native document cases requires an explicit reviewed ingestion schema; the current case-inventory updater refreshes web cases. Define provenance, dependencies, reviewed expectations and evidence handling before publishing document case coverage. Preserve earlier suite versions and results when the evidence scope changes.

## Coverage and interpretation

Section 508 non-web exceptions for 2.4.1, 2.4.5, 3.2.3 and 3.2.4 remain explicit. Parsing is no-test-required; some retained categories and CAPTCHA are not applicable, and the AA audio-description test addresses the less strict Level A alternative without a separate outcome. These dispositions do not represent independently executed passes.

WCAG 2.1/2.2 additions have no Baseline procedure mapping and use supplemental guidance with WCAG2ICT interpretation. Consult [scope and authority](../../references/scope.md) for applicability, exceptions and substitutions.

## Evaluation status

No document Framework cases are supplied by the pinned repository snapshot. Instruction coverage is authored draft; qualified human review, procedure execution and representative document case creation remain separate work. Missing cases do not make requirements inapplicable or provide validation evidence.

See the collection's [validation status](../../evaluations/validation-status.md), general framework [validation status](../../../evaluations/validation-status.md) and [publication and coverage policy](../../../evaluations/publication-and-coverage.md) for completed checks, remaining work and the evidence required for review and validation claims.
