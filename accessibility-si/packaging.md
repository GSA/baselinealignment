# Skill packaging recommendation

## Keep the source portable

Use the common Agent Skills shape: a folder named for the skill, a `SKILL.md` with `name` and `description`, and local `references/`, plus scripts/assets only when needed. Keep agent-specific metadata and installation paths out of this repository collection; provide customized setup examples with the Section508.gov article introducing these resources. Do not require a particular model, CLI, editor, or scanner in the core skill.

Make each skill installable independently: all required procedural references must be inside its folder. Required references must not point to `../../mappings` or other sibling resources. Authoritative external links may remain external. These skills meet that local dependency rule; the root workflows and structured evaluation resources are optional orchestration supplied by the caller.

## Publish two distribution forms

1. **Individual skill folders:** copy a folder intact into a tool's supported discovery location or attach it using that tool's supported mechanism. These are self-contained procedural resources. Installing a skill does not automatically load the separate persistent instructions.
2. **Complete example collection:** preserve instructions, mappings, workflows, neutral fixtures, setup scripts, and evaluation resources together. Keep evaluator answers in a separately controlled evaluation location when running independent assessments.

Maintain a single canonical source for each substantive reference. The criterion/procedure mappings and format references are canonical; `scripts/refresh-resources.py` deterministically renders shared references and vendors matching copies into each skill. Use `--check` to detect drift. Do not solve duplication with runtime symlinks or dependencies outside the installed skill folder. A small repeated scope statement is acceptable; a second independently maintained standards mapping is not.

## Version and verify

Version the collection as 0.2.0, keep skill folders stable, and record source revision and review date. Generate an inventory with content hashes, preserve licensing/attribution, check all local references, and reject missing dependencies. Make platform adapter compatibility claims only after actual runs.

For this collection, `python accessibility-si/scripts/package-skills.py --output ../skill-distributions` copies all four standalone skill folders, includes the repository license at each skill root, and writes `inventory.json` with file hashes outside the folders. It refuses overwrites. It creates no vendor configuration, archive, or installation in your personal environment.

For the later Section508.gov implementation, maintain a thin repository-specific instruction layer and tool configuration in that environment. Describe the customized setup with the introductory article. Pin the portable core revision it uses; identify automated ruleset coverage and manual checks separately. Changes useful to all consumers should flow back to the portable core. Avoid a divergent second copy of each skill.

Before release: complete human review and run the available manual evaluations, documenting scope and gaps. Validate any separately published agent customization in its actual environment. The current draft is a reviewable starting point, not a validated distribution across multiple agents.
