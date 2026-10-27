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

1. Supply [starter instructions](instructions/accessibility-starter.md) and [development instructions](instructions/accessibility-development.md) using the environment's supported mechanism.
2. Select [accessible web development](skills/accessible-web-development/SKILL.md), [web accessibility testing](skills/web-accessibility-testing/SKILL.md), [accessible document creation](skills/accessible-document-creation/SKILL.md) or [document accessibility testing](skills/document-accessibility-testing/SKILL.md). Each skill bundles its required references locally.
3. Use [the full criterion reference](references/wcag-a-aa.md), [Web procedures](references/web-baseline.md), [Document procedures](references/document-baseline.md) and the linked format references. Read official sources for complete applicability, steps, definitions, exceptions and outcomes.
4. Follow [guided testing](workflows/guided-manual-testing.md), [generate/test/remediate](workflows/generate-test-remediate.md) and [Framework validation](workflows/validate-against-framework.md). Arrange human testing using [Section508.gov guidance](https://www.section508.gov/test/).
5. Inspect [coverage inventory](evaluations/coverage.md), [published case inventory](evaluations/test-manifest.yaml) and [publication/coverage policy](evaluations/publication-and-coverage.md). Generate a scoped result template with the script below and record actual evidence.

The existing [generic web focus example](examples/web-focus/README.md) remains a small reproducible exercise. It is not a stand-in for complete validation. Agent/environment-specific setup examples belong with the Section508.gov article introducing the resources, outside this generic collection.

## Evaluation commands

Preparation and packaging scripts use the Python standard library. Optional full validation also requires the packages in `scripts/requirements-validation.txt`.

```sh
python accessibility-si/scripts/create-evaluation.py --domain web --output ../web-results.json
python accessibility-si/scripts/create-evaluation.py --domain documents --format pdf --output ../pdf-results.json
python accessibility-si/scripts/validate.py
python accessibility-si/scripts/validate.py --result ../pdf-results.json
python accessibility-si/scripts/validate-pilot.py
python accessibility-si/scripts/package-skills.py --output ../skill-distributions
```

Generate one result file per environment and stage. Every selected target starts not-tested; no-test-required or excepted entries are recorded as scope dispositions, not executed passes. Framework case comparisons use a separate outcome from the content finding. No automatic SI runner or agent-specific SDK is required.

## Maintenance and integration

The canonical authored criterion and procedure content lives in the mappings. Machine-readable catalogs use JSON-compatible YAML so core scripts can use the Python standard library. Source hash checks assume the pinned repository bytes; preserve source line endings during checkout. Generate shared references and their skill-local copies with `python accessibility-si/scripts/refresh-resources.py`; use `--check` to detect drift. See [packaging](packaging.md) for standalone distribution. Treat generated copies as generated, not independent standards guidance. After committing new/corrected source cases, run `scripts/refresh-case-inventory.py --source-revision FULL_COMMIT_SHA` from within the collection, then rerender and validate. The updater refreshes web-case availability and pending-review expectations; adding native document cases requires an explicit reviewed ingestion schema. Retain earlier suite/result versions and bump the suite version when its evidence scope changes.

Add `accessibility-si` to the existing Jekyll `exclude:` list when integrating. This collection does not change `_config.yml`, existing Baseline data, test cases or test samples. Jekyll exclusion does not hide files in the public repository.

Preserve the existing repository license. External standards/product documentation retain their terms; source links do not transfer ownership or imply endorsement.
