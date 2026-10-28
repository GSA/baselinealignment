# Accessibility SI resources

Version 0.2.0: full-scope authored draft for web and non-web documents. This collection provides portable instructions, four skills, criterion and Baseline references, mappings, workflows and manually runnable evaluation resources. SI means Super Intelligence in this collection.

## Scope

- Address all **55 active WCAG 2.2 A/AA criteria**: 37 inherited from WCAG 2.0 after omitting active Parsing testing, 12 added in WCAG 2.1, and 6 added in WCAG 2.2.
- Account for every procedure in **Web Baseline 3.1** and **Electronic Documents Baseline 1.0**, including no-test-required, not-applicable and subsumed/redirected entries.
- Support **Word, Excel, PowerPoint and PDF** with native-format authoring/testing references and independent export checks.
- Keep incorporated WCAG 2.0/Section 508 results separate from supplemental WCAG 2.1/2.2 results. The Baselines do not map the newer criteria. Apply E205.4's four non-web exceptions and E205.4.1 substitutions.
- Omit active **4.1.1 Parsing** testing as specified by both Baselines' 24.A disposition. Preserve traceability and evaluate actual defects under affected criteria.
- Include content scoping, conformance requirements, alternate versions and Baseline media-player controls. This is not an audit of all software, hardware, authoring tools, support services or Section 508 provisions outside this content scope.

Read [scope and authority](references/scope.md). Sources are pinned in [source provenance](mappings/sources.json). Authored coverage is not completed human review, completed testing, proven Baseline alignment or certification. See [validation status](evaluations/validation-status.md).

## Use the resources

Use these resources as task guidance for people, tools or a combination of both. No particular agent, editor, operating system or installation mechanism is required to read and apply them. Choose the resources that fit the task; the scripts are optional utilities for structured records and collection maintenance.

| Resource | Purpose |
| --- | --- |
| `instructions/` | General guidance to apply across accessibility tasks. |
| `skills/` | Four task-specific guides, each with self-contained references. |
| `references/` | Shared scope, criterion, Baseline and document-format guidance. |
| `workflows/` | Steps for creation, testing, remediation and testing-process evaluation. |
| `mappings/` | Structured criterion/procedure catalogs and source provenance. |
| `evaluations/` | Coverage inventories, record schemas and evaluator expectations. |
| `scripts/` | Optional record-generation, packaging and maintenance utilities. |

1. Read or supply [starter instructions](instructions/accessibility-starter.md) and [development instructions](instructions/accessibility-development.md) as task context. If a tool supports loading instructions, use its documented mechanism; otherwise, apply the guidance directly.
2. Select [accessible web development](skills/accessible-web-development/SKILL.md), [web accessibility testing](skills/web-accessibility-testing/SKILL.md), [accessible document creation](skills/accessible-document-creation/SKILL.md) or [document accessibility testing](skills/document-accessibility-testing/SKILL.md). Each skill bundles its required references locally.
3. Use [the full criterion reference](references/wcag-a-aa.md), [Web procedures](references/web-baseline.md), [Document procedures](references/document-baseline.md) and the linked format references. Read official sources for complete applicability, steps, definitions, exceptions and outcomes.
4. Follow [guided testing](workflows/guided-manual-testing.md), [generate/test/remediate](workflows/generate-test-remediate.md) and [Framework validation](workflows/validate-against-framework.md). Arrange human testing using [Section508.gov guidance](https://www.section508.gov/test/).
5. For structured evaluation records or testing-process assessment, inspect [coverage inventory](evaluations/coverage.md), [published case inventory](evaluations/test-manifest.yaml) and [publication/coverage policy](evaluations/publication-and-coverage.md). Use the [result template](evaluations/result-template.json) or generate a domain/format-specific template with the optional script below, then record actual evidence. Keep evaluator expectations separate from inputs used for independent testing.

## Optional scripts

The examples below run from the parent directory containing `accessibility-si`. Use an available Python 3 interpreter in place of `python` and choose output paths suitable for the environment. Template generation and skill packaging refuse to overwrite existing outputs; packaging also requires an output directory outside the source repository.

Template generation, reference generation and packaging use the Python standard library. Structural validation and case-inventory refresh require the packages listed in [validation dependencies](scripts/requirements-validation.txt), installed using the environment's dependency-management process. Validation and case-inventory refresh also require the source repository's case records and samples at the paths recorded in the manifest; a copied skill folder or collection directory alone is insufficient.

```sh
python accessibility-si/scripts/create-evaluation.py --domain web --output ../web-results.json
python accessibility-si/scripts/create-evaluation.py --domain documents --format pdf --output ../pdf-results.json
python accessibility-si/scripts/package-skills.py --output ../skill-distributions
```

To check collection structure and a completed record, use a source checkout with the validation dependencies available:

```sh
python accessibility-si/scripts/validate.py
python accessibility-si/scripts/validate.py --result ../pdf-results.json
```

These checks verify structure, source hashes, references and record consistency; they do not execute accessibility tests or establish conformance.

Generate one result file per environment and stage. Replace template identifiers and artifact/environment placeholders with actual information; explain fields that do not apply to the testing process. For human-only testing with no agent or model, set `environment.agent` and `environment.model` to `"not-applicable"`, or add `--human-only` when generating a template. Other environment fields still require actual details or explained non-applicability. Record performed human checks with `tester_type: "human"`; template checks remain not-tested until observations are recorded. Every selected target starts not-tested; no-test-required or excepted entries are recorded as scope dispositions, not executed passes. Framework case comparisons use a separate outcome from the content finding. Record observations from the testing methods actually used.

## Adapting and maintaining a copy

The criterion/procedure mappings and shared document-format, scope and attribution references are the canonical authored sources. Generated references and their skill-local copies must be updated through those sources. See [packaging](packaging.md) for standalone distribution and local customization.

When changing the collection, run `python accessibility-si/scripts/refresh-resources.py` to regenerate references, or add `--check` to detect drift. Machine-readable catalogs use JSON-compatible YAML so reference and template generation can use the Python standard library. Source hash checks assume the pinned repository bytes; preserve source line endings during checkout.

When maintaining a source checkout with new or corrected committed Framework cases, run `python accessibility-si/scripts/refresh-case-inventory.py --source-revision FULL_COMMIT_SHA` with the full commit ID for that snapshot, then regenerate references and validate. The updater refreshes web-case availability and pending-review expectations; adding native document cases requires an explicit reviewed ingestion schema. Retain earlier suite/result versions and update the suite version when its evidence scope changes.

If integrating the collection into a published site or another repository, use that environment's configuration to control which resources are published or loaded. Excluding files from a site build does not make public source files private or keep evaluator expectations out of a tester's inputs.

Preserve applicable repository licensing and attribution when copying or adapting resources. External standards and product documentation retain their own terms; source links do not transfer ownership or imply endorsement.
