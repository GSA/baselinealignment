# Accessibility SI resources

This collection provides portable accessibility instructions, four task-specific skills, references and workflows for creating, remediating and testing web content and non-web documents. It also includes mappings and evaluation resources for assessing testing processes and maintaining the collection. SI means Super Intelligence in this collection.

Version 0.2.0 is a full-scope authored draft. Authored coverage does not establish completed human review, executed testing, proven Baseline alignment or certification. See [validation status](evaluations/validation-status.md) for completed checks and remaining work.

## Choose your path

- **Apply the resources in your environment:** start with [For users](#for-users-apply-the-resources) to choose guidance, load or apply it, and record results.
- **Evaluate an AI/SI-enabled test process:** begin with the Framework's [general test process evaluation guidance](../evaluating-test-processes.md), then use the [AI/SI-tailored subsection](#evaluate-an-aisi-enabled-test-process-with-the-baseline-alignment-framework) to assess how your process classifies published samples.
- **Maintain or distribute the resources for others:** start with [For maintainers](#for-maintainers-develop-and-publish-the-resources) for source ownership, regeneration, review and release responsibilities.

You may use the resources and maintain a customized distribution. Environment setup is described in [packaging and integration guidance](packaging.md); substantive changes follow the maintenance path.

## For users: apply the resources

Use the guidance directly, supply it as task context, or load it through your tool's supported mechanism. No particular agent, editor, operating system or installation mechanism is required. Scripts are optional unless you choose an activity that depends on them.

### Choose guidance for your task

| Task | Start here | Supporting workflow |
| --- | --- | --- |
| Create or remediate web content | [Accessible web development](skills/accessible-web-development/SKILL.md) | [Generate, test and remediate](workflows/generate-test-remediate.md) |
| Test web content | [Web accessibility testing](skills/web-accessibility-testing/SKILL.md) | [Guided manual testing](workflows/guided-manual-testing.md) |
| Create or remediate Word, Excel, PowerPoint or PDF documents | [Accessible document creation](skills/accessible-document-creation/SKILL.md) | [Generate, test and remediate](workflows/generate-test-remediate.md) |
| Test non-web documents | [Document accessibility testing](skills/document-accessibility-testing/SKILL.md) | [Guided manual testing](workflows/guided-manual-testing.md) |

1. Choose an intact individual skill, the complete collection, or direct reading using [the distribution options](packaging.md#choose-how-to-use-the-resources).
2. Apply the [starter instructions](instructions/accessibility-starter.md) across tasks. Add the [development instructions](instructions/accessibility-development.md) when creating or remediating content. Loading a skill does not automatically load these separate instructions; verify that your environment makes the intended guidance available.
3. Identify the artifact, delivery format, applicable requirements and available testing capabilities. Each skill bundles required references locally. The shared [criterion reference](references/wcag-a-aa.md), [Web procedures](references/web-baseline.md), [Document procedures](references/document-baseline.md) and format references provide additional navigation. Read official sources for complete applicability, steps, definitions, exceptions and outcomes.
4. Follow the workflow for your task and arrange human testing using [Section508.gov guidance](https://www.section508.gov/test/). Verify delivered exports independently of their sources.
5. Deliver the artifact or findings with the environment, performed checks, observed evidence, unresolved issues and pending human review. Use structured records below when appropriate to your reporting needs.

For tool-specific integration starting points, official documentation links and example task requests, see [starting points for common AI/SI tools](packaging.md#starting-points-for-common-aisi-tools). That guidance explains how to combine instructions, selected skills and workflows in your environment.

### Evaluate an AI/SI-enabled test process with the Baseline Alignment Framework

The Framework's [general test process evaluation guidance](../evaluating-test-processes.md) applies to manual, automated, hybrid and AI/SI-enabled processes. Use this tailored path when AI/SI, agents or model-driven tools are components of the process. It adds controls for supplied instructions and context, model and agent versions, tool access, variability, evaluator-expectation isolation and human review.

The evaluation asks whether the defined process produces results consistent with reviewed Framework expectations for selected procedures and samples. It does not certify the tested artifact, process, model or tool, or establish full alignment from a sample score.

1. **Define and pin the process.** Record the collection and Framework revisions, Baseline version, agent/model versions, system/project/skill/task instructions, supplied context, tool configuration and permissions, browser or native application, assistive technologies and human involvement. Describe what the process can execute, what requires human review, how variability is handled and what changes require a separate process configuration.
2. **Select cases and document coverage.** Use a source checkout containing the case records and samples referenced by the [published case inventory](evaluations/test-manifest.yaml). Consult the [coverage inventory](evaluations/coverage.md) and verify sample dependencies. An individual skill or copied collection alone does not contain the full evaluation corpus. The pinned snapshot supplies web cases; document and supplemental-criterion gaps remain explicit.
3. **Prepare independent candidate inputs.** Keep evaluator expectations, rationale and outcome-bearing case names, titles and comments outside the candidate's inputs. Verify behavior-preserving neutral copies and their dependencies before use. Build Jekyll/Liquid-dependent samples appropriately. Site exclusions alone do not isolate public answers from an agent with repository access.
4. **Run the normal process and preserve its output.** Supply the chosen skills and instructions, collect actual observations, and record unavailable checks honestly. Freeze the candidate's output before comparing it with evaluator expectations.
5. **Compare and investigate.** An evaluator uses reviewed expectations to record matched, mismatched or not-compared separately from content findings. Correctly identifying an expected content failure is a matched classification. Investigate discrepancies in the case, mapping, guidance, tool, environment or sample preparation, and retain initial results when rerunning.
6. **Report the evidence and gaps.** State the cases, procedures, scenarios and environments evaluated, human-review status, unresolved discrepancies and uncovered areas. Missing cases do not make requirements inapplicable. Available cases provide only part of the evidence for a process claiming alignment.

Follow the detailed [Framework evaluation workflow](workflows/validate-against-framework.md) and [publication and coverage policy](evaluations/publication-and-coverage.md). Case inventory and source hashes establish availability and identity; they do not establish that cases were executed or expectations reviewed.

### Optional structured result records

Use the [result template](evaluations/result-template.json), or generate a domain/format-specific template. Run examples from the repository root, the parent of `accessibility-si`, using an available Python 3 interpreter in place of `python`. Template generation uses the standard library and refuses existing output paths; choose paths appropriate to your environment.

```sh
python accessibility-si/scripts/create-evaluation.py --domain web --output ../web-results.json
python accessibility-si/scripts/create-evaluation.py --domain documents --format pdf --output ../pdf-results.json
```

Generate one result file per environment and stage. Replace template identifiers and artifact/environment placeholders with actual details or explained non-applicability. For human-only testing, set `environment.agent` and `environment.model` to `"not-applicable"`, or add `--human-only` when generating a template. Record performed human checks with `tester_type: "human"`.

Every selected target starts not-tested until observations are recorded. No-test-required or excepted entries are scope dispositions, not executed passes. Framework comparisons have a separate outcome from the content finding. Record only observations from methods actually used.

To check a completed record, use a source checkout with [validation dependencies](scripts/requirements-validation.txt) installed through your environment's dependency-management process:

```sh
python accessibility-si/scripts/validate.py --result ../pdf-results.json
```

Validation requires the repository case records and samples at the manifest paths. It checks structure, source hashes, references and record consistency; it does not execute accessibility tests or establish conformance.

## For maintainers: develop and publish the resources

Maintainers keep the shared guidance, mappings, evaluation framework and distributions usable and traceable for others. Local installation paths and tool configuration belong in an integration layer; substantive changes belong in the canonical sources.

### Source ownership and responsibilities

| Resource | Maintainer responsibility |
| --- | --- |
| Instructions and workflows | Keep task guidance, applicability and evidence expectations consistent. |
| Criterion and procedure mappings | Maintain canonical catalogs, source provenance, requirement relationships and dispositions. Catalogs use JSON-compatible YAML. |
| Shared references | Maintain canonical document-format, scope and attribution guidance; generate criterion/procedure references from mappings. |
| Skill-local references | Regenerate required copies from canonical sources; keep each skill self-contained. |
| Evaluation framework | Maintain schemas, case inventories, reviewed expectations, coverage gaps and retained results. |
| Distributions | Identify versions, source revisions, changes, licensing, hashes and review status. |

### Change and validate the collection

Run commands below from the repository root with an available Python 3 interpreter. Reference generation uses the standard library. Structural validation and case-inventory refresh require [validation dependencies](scripts/requirements-validation.txt) and the repository case records and samples. Preserve source line endings: source hash checks assume the pinned repository bytes.

1. Identify the canonical source for the proposed change. Update mappings or shared references rather than editing generated references or skill-local copies independently. See [document mapping guidance](mappings/documents/README.md) for document-specific responsibilities.
2. If new or corrected committed Framework cases are included, refresh their inventory with the full commit ID for that snapshot:

   ```sh
   python accessibility-si/scripts/refresh-case-inventory.py --source-revision FULL_COMMIT_SHA
   ```

   The updater refreshes web-case availability and pending-review expectations. Adding native document cases requires an explicit reviewed ingestion schema. Retain earlier suite/result versions and update the suite version when its evidence scope changes.

3. Regenerate references and check structure:

   ```sh
   python accessibility-si/scripts/refresh-resources.py
   python accessibility-si/scripts/refresh-resources.py --check
   python accessibility-si/scripts/validate.py
   ```

4. Review affected guidance, mappings and format interpretations against authoritative sources. Run relevant evaluations, record evidence and gaps, and complete qualified human review before promoting guidance to reviewed status. Structural checks alone do not establish accessibility or alignment.
5. Update version and release information as appropriate, then follow [packaging guidance](packaging.md#for-maintainers-build-a-distribution) to prepare a distribution. Preserve applicable licensing and attribution; external standards and product documentation retain their own terms.

When integrating resources into a site or another repository, configure publication and loading explicitly. Excluding files from a site build does not make public source files private or isolate evaluator expectations from tester inputs.

## Scope and authority

- Address all **55 active WCAG 2.2 A/AA criteria**: 37 inherited from WCAG 2.0 after omitting active Parsing testing, 12 added in WCAG 2.1, and 6 added in WCAG 2.2.
- Account for every procedure in **Web Baseline 3.1** and **Electronic Documents Baseline 1.0**, including no-test-required, not-applicable and subsumed/redirected entries.
- Support **Word, Excel, PowerPoint and PDF** with native-format authoring/testing references and independent export checks.
- Keep incorporated WCAG 2.0/Section 508 results separate from supplemental WCAG 2.1/2.2 results. The Baselines do not map the newer criteria. Apply E205.4's four non-web exceptions and E205.4.1 substitutions.
- Omit active **4.1.1 Parsing** testing as specified by both Baselines' 24.A disposition. Preserve traceability and evaluate actual defects under affected criteria.
- Include content scoping, conformance requirements, alternate versions and Baseline media-player controls. This is not an audit of all software, hardware, authoring tools, support services or Section 508 provisions outside this content scope.

Read [scope and authority](references/scope.md). Sources are pinned in [source provenance](mappings/sources.json). Authored coverage is not completed human review, completed testing, proven Baseline alignment or certification. See [validation status](evaluations/validation-status.md).

## Resource directory

| Resource | Purpose and audience |
| --- | --- |
| [instructions/](instructions/) | Users apply general task guidance; maintainers keep shared expectations consistent. |
| [skills/](skills/) | Users select four task guides with local references; maintainers update guidance and regenerate bundled references. |
| [references/](references/) | Users consult scope, criteria, procedures and format guidance; maintainers distinguish canonical sources from generated outputs. |
| [workflows/](workflows/) | Users follow creation, testing, remediation and process-evaluation steps; maintainers review these procedures. |
| [mappings/](mappings/) | Integrators trace structured requirements; maintainers update canonical catalogs and provenance. |
| [evaluations/](evaluations/) | Process evaluators use inventories, schemas and separately controlled expectations; maintainers curate the evidence framework. |
| [scripts/](scripts/) | Users optionally generate/check records; maintainers regenerate, validate and package resources. |

## Feedback and contributions

See the repository's [contribution guidance](../contributing.md). Report unclear guidance, mapping issues or unexpected results with the collection revision, affected resource or case ID, environment, observed behavior and supporting evidence. For proposed changes, identify the canonical sources affected and the checks and review performed.
