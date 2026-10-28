# Packaging and adapting the resources

## Choose a distribution

Use an individual skill for a focused task or the complete collection for shared instructions, workflows, mappings and structured evaluation records. The resources can also be read and applied directly without installing a skill.

1. **Individual skill folders:** copy a folder intact into a tool's documented discovery location or supply its contents as task context. Each folder contains a `SKILL.md` with `name` and `description` metadata and all required procedural references in `references/`. Loading a skill does not automatically load the separate starter and development instructions.
2. **Complete collection:** preserve the relative layout of instructions, skills, references, mappings, workflows, scripts and evaluation resources. The Framework manifest refers to case records and samples outside `accessibility-si`; retain the source checkout for case-based validation and inventory refresh. Keep evaluator expectations separately controlled when running independent assessments.

No particular model, CLI, editor or scanner is required by the core guidance. Use the receiving environment's documented loading mechanism; folder placement alone does not guarantee that instructions or skills are loaded.

## Package standalone skills

From the parent directory containing `accessibility-si`, run the following with an available Python 3 interpreter:

```sh
python accessibility-si/scripts/package-skills.py --output ../skill-distributions
```

Choose a new output directory outside the source repository. The script uses the Python standard library, copies all four standalone skill folders, includes the source repository's `LICENSE.md` at each skill root, and writes `inventory.json` with file hashes outside the folders. It requires the source repository layout and license file, refuses overwrites and creates folders rather than archives. Load the resulting resources using the receiving environment's supported mechanism.

## Adapt and maintain a copy

Keep environment-specific configuration and installation paths in a separate integration layer. Record the collection revision used, document how the resources are loaded, and identify automated ruleset coverage and manual checks separately. Verify compatibility claims in the actual environment before publishing them. Share generally useful improvements with the source project where appropriate.

Maintain a single canonical source for each substantive reference. The criterion/procedure mappings and shared format, scope and attribution references are canonical; `scripts/refresh-resources.py` renders shared criterion/procedure references and copies required references into each skill. Use `--check` to detect drift. Update canonical sources and regenerate rather than editing generated copies independently. Required skill references must stay inside the skill folder; avoid runtime symlinks or dependencies on sibling mappings. Authoritative external links may remain external.

The current collection version is 0.2.0. When publishing an adapted distribution, identify its version, source revision, changes and review date. Preserve applicable licensing and attribution, check local references, and include content hashes so recipients can identify the files used. Retain earlier suite versions and evaluation results when the evidence scope changes.

Before describing guidance as reviewed or validated, complete the corresponding human review and evaluations and document their scope and gaps under the [publication and coverage policy](evaluations/publication-and-coverage.md). See [validation status](evaluations/validation-status.md) for the collection's recorded checks and remaining work; those records do not establish compatibility or accessibility results in a recipient's environment.
