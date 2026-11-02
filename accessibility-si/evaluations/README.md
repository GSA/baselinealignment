# Accessibility SI evaluation profile

The canonical, process-neutral case inventory, coverage policy, result schema and evaluator expectations are maintained in the repository's [general evaluation framework](../../evaluations/README.md).

This directory contains the AI/SI-specific profile and retains the collection's version 0.2 result schema and template for compatibility with existing collection scripts and records.

| Resource | Purpose |
| --- | --- |
| [ai-si-profile.md](ai-si-profile.md) | Additional information and controls required for an AI/SI-enabled process. |
| [result-template.json](result-template.json) | Compatibility template for Accessibility SI collection version 0.2.0. |
| [results-schema.json](results-schema.json) | Compatibility schema for the version 0.2.0 template. |
| [validation-status.md](validation-status.md) | Validation status of the Accessibility SI collection and its task guidance. |

New general evaluations should start from the repository-level [result template](../../evaluations/result-template.json). Represent each AI/SI component with `type: "ai-si-tool"` and record the profile information described here. Existing 0.2 records may continue to use the compatibility schema; do not silently rewrite historical results.
