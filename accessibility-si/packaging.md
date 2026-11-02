# Packaging and integrating the resources

Use this guide to select and integrate accessibility resources into your environment, or to prepare and maintain a distribution for others. Start with the [collection README](README.md) for task selection, scope and the user and maintainer paths.

## Choose how to use the resources

| Option | What it provides | What you need to preserve or obtain |
| --- | --- | --- |
| Read and apply guidance directly | Task instructions, references and workflows for people or tools | Follow linked resources and authoritative sources; no skill installation is required. |
| Individual skill folder | One `SKILL.md` with `name` and `description` metadata and all required procedural references in its local `references/` directory | Copy the folder intact and preserve applicable licensing and attribution. Separate instructions, workflows and evaluation utilities are not included automatically. |
| Complete collection | Shared instructions, all four skills, references, workflows, mappings, scripts and evaluation resources | Preserve relative paths. Framework case-based validation and inventory refresh also require repository case records and samples outside `accessibility-si`. |

No particular model, CLI, editor or scanner is required by the core guidance. Use the receiving environment's documented loading mechanism; folder placement alone does not guarantee that instructions or skills are loaded.

## For users: integrate into your environment

1. **Select and identify the resources.** Choose the task guidance using the [collection README](README.md#choose-guidance-for-your-task). Record the collection version and source revision, or the version and source information supplied with a distribution.
2. **Preserve dependencies.** Keep an individual skill folder intact, including its local references and supplied license. For the complete collection, retain its relative directory layout. If you receive a packaged distribution, retain its file inventory so you can identify the resources used.
3. **Load or supply the guidance.** Use your tool's supported mechanism, or apply the content directly. Supply the [starter instructions](instructions/accessibility-starter.md) separately where appropriate; add the [development instructions](instructions/accessibility-development.md) for creation or remediation. Loading a skill does not automatically load these instructions.
4. **Check availability in the actual environment.** Confirm that the intended skill/instructions and linked references are accessible. Document how they are loaded and which browser, native application, automated checks and human checks are available. Verify compatibility claims in that environment.
5. **Use the relevant workflow and record results.** Distinguish automated ruleset coverage from manual checks and record observed evidence and capability limits. See the [AI/SI-enabled process evaluation guidance](README.md#evaluate-an-aisi-enabled-test-process-with-the-baseline-alignment-framework) if assessing your testing process against Framework cases.

Keep environment-specific configuration and installation paths in a separate integration layer. When running independent assessments, control evaluator expectations separately from candidate inputs; copying the complete collection into a candidate workspace may expose answers. See the [Framework evaluation workflow](workflows/validate-against-framework.md).

### Starting points for common AI/SI tools

Combine the resources according to the task rather than loading the entire collection into every interaction:

| Resource | How to incorporate it |
| --- | --- |
| [Starter instructions](instructions/accessibility-starter.md) | Apply across accessibility tasks through project instructions or explicit task context. |
| [Development instructions](instructions/accessibility-development.md) | Add when creating or remediating content. Testing-only tasks generally start with the starter instructions and the relevant testing skill. |
| Selected [skills](skills/) | Install intact skill folders through the tool's supported discovery mechanism, or supply their contents and required references as task context. |
| Selected [workflow](workflows/) | Name the workflow in the task request and make its file available. These Markdown files do not automatically become executable workflows when copied into a project. |

The following tools are examples of integration mechanisms. Their inclusion does not establish tested compatibility with this collection.

**\*Disclaimer:** Reference in this site to any specific commercial product, process, or service, or the use of any trade, firm or corporation name is for the information and convenience of the public, and does not constitute endorsement, recommendation, or favoring by GSA. GSA does not guarantee that outside websites or products comply with Section 508 (accessibility requirements) of the Rehabilitation Act.

| Tool | Where to start with instructions | Where to start with skills |
| --- | --- | --- |
| Claude Code | Use project `CLAUDE.md` guidance. Its documented `@path` imports can incorporate the starter instructions and, where appropriate, development instructions. See [project instructions and imports](https://code.claude.com/docs/en/memory). | Place intact selected skill folders under `.claude/skills/`. See [skills documentation](https://code.claude.com/docs/en/skills). |
| GitHub Copilot | Start with `.github/copilot-instructions.md`; consider path-specific instructions when development guidance should apply only to selected files. See [custom instructions](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions). | Use `.github/skills/` where supported. Check your specific IDE or agent surface in the [customization locations and support reference](https://docs.github.com/en/copilot/reference/customization-cheat-sheet). |
| OpenAI Codex | Use project `AGENTS.md` guidance to direct the agent to read and apply the relevant instruction files before accessibility work. See [project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md). | Place intact selected skill folders under `.agents/skills/`. See [building and loading skills](https://learn.chatgpt.com/docs/build-skills). |

These are documented starting points; availability depends on the tool, version, surface and organization settings. Keep existing project guidance when adding accessibility instructions. A file reference should explicitly direct the agent to read and apply the file; a link alone does not guarantee loading. Import syntax such as `@path` is tool-specific. Preserve each skill's bundled references and adjust paths to the receiving project.

Confirm that the intended resources are available before relying on the integration. An agent's statement that it can read the files helps check setup; verify actual behavior and results through task execution and review.

### Example: remediate a web form

Assume the complete collection is available at `accessibility-si/` in your project. Supply this request as task context, adjusting the artifact and paths:

> Read and apply `accessibility-si/instructions/accessibility-starter.md` and `accessibility-si/instructions/accessibility-development.md`. Use the accessible-web-development and web-accessibility-testing skills, and follow `accessibility-si/workflows/generate-test-remediate.md` to remediate the registration form. Identify the guidance available and any missing files before starting. Record performed checks, observed evidence, unresolved issues and checks requiring human review.

If skills are installed separately, invoke them through the tool's supported mechanism. If they are not installed, explicitly supply or direct the agent to read the relevant `SKILL.md` files and bundled references. Keep separate instructions and workflow files accessible. For repeated work, incorporate the same resource-selection guidance into project instructions.

### Other example tasks

- **Test an existing PDF:** apply the starter instructions, use document-accessibility-testing and follow guided manual testing. Specify the PDF, available native application and assistive technologies; record checks that require capabilities or human review unavailable in the environment.
- **Evaluate an AI/SI-enabled testing process:** apply the starter instructions, use the relevant testing skill and follow the Framework evaluation workflow. Define the environment and cases; keep evaluator expectations outside candidate inputs and compare results only after freezing candidate output. See the [process evaluation guidance](README.md#evaluate-an-aisi-enabled-test-process-with-the-baseline-alignment-framework).
- **Work in a chat interface without repository access:** provide selected instructions, skill contents, required references and the workflow through supported attachments or task context. Include the artifact or an accessible means of inspecting it, identify source versions and confirm which files the tool can read. Task context does not itself install a reusable skill or provide native application, browser or assistive-technology capabilities.

## For maintainers: build a distribution

Use a source checkout containing the collection and repository `LICENSE.md`. From the repository root, the parent of `accessibility-si`, run the following with an available Python 3 interpreter:

```sh
python accessibility-si/scripts/package-skills.py --output ../skill-distributions
```

Choose a new output directory outside the source repository. The script uses the Python standard library, copies all four standalone skill folders, includes the source repository's `LICENSE.md` at each skill root, and writes `inventory.json` with file hashes outside the folders. It refuses overwrites and creates folders rather than archives. Recipients load the resulting resources using their environment's supported mechanism.

The script packages individual skills; it does not package the complete collection or Framework case corpus. For a complete-collection distribution, preserve the relative layout and document whether the associated repository cases and samples are supplied or must be obtained separately. Explain any limits on running scripts from the delivered layout.

Content hashes identify the distributed files. Successful packaging does not demonstrate human review, accessibility results, Baseline alignment or compatibility with a recipient's environment.

## For maintainers: customize and update

### Maintain canonical sources

Maintain a single canonical source for each substantive reference. Criterion/procedure mappings and shared document-format, scope and attribution references are canonical. `scripts/refresh-resources.py` renders shared criterion/procedure references and copies required references into each skill. Update canonical sources and regenerate rather than editing generated copies independently; use `--check` to detect drift.

Required skill references must stay inside the skill folder; avoid runtime symlinks or dependencies on sibling mappings. Authoritative external links may remain external. Changes to instructions, skills or workflows should remain consistent with the scope, evidence requirements and related references.

Follow the [collection maintenance procedure](README.md#change-and-validate-the-collection) for regeneration, case-inventory updates, validation dependencies and review. Share generally useful improvements with the source project through the repository's [contribution process](../contributing.md).

### Update an adopted or customized distribution

1. Record the existing source revision, local substantive changes and environment configuration before updating.
2. Review upstream changes and reconcile local changes in their canonical sources. Preserve environment configuration separately.
3. Regenerate affected references and run the relevant structural checks and evaluations. Retain prior suite versions and results when the evidence scope changes.
4. Build into a new output location and document the resulting version, changes and remaining gaps.
5. Recheck loading, references and relevant behavior in the receiving environment before updating compatibility claims.

## Review and release information

The current collection version is 0.2.0. For a published distribution, identify its version, source revision, local changes and review date/status. Preserve applicable licensing and attribution, check local references, and include content hashes so recipients can identify the files used. External standards and product documentation retain their own terms; links do not transfer ownership or imply endorsement.

Before describing guidance as reviewed or validated, complete the corresponding human review and evaluations and document their scope and gaps under the [publication and coverage policy](evaluations/publication-and-coverage.md). Include known limitations and available evidence with release information. See [validation status](evaluations/validation-status.md) for the collection's recorded checks and remaining work; those records do not establish compatibility or accessibility results in a recipient's environment.
