# Complete web example: keyboard focus

This example exercises instructions, the two web skills, references, selected mappings, manual workflows, existing samples, and evaluation records. It is a runnable pilot, not a completed human accessibility evaluation.

## Reproduce the setup

Use Python 3.10+ and a browser with full keyboard navigation enabled. No node dependencies, SI SDK, automated scanner, or Jekyll build are needed. From the repository root:

```sh
python accessibility-si/scripts/prepare-web-focus.py --output ../focus-run
python -m http.server 8000 --bind 127.0.0.1 --directory ../focus-run/input
```

Keep the server running. Open `http://127.0.0.1:8000/case-01/`, then cases 02 through 05 in the same way. Do not open an index page during a case's applicability check. Stop the server with Ctrl+C. Use a fresh output path for every independent run; setup refuses to overwrite a directory.

Setup copies upstream samples at the recorded content hashes, replaces their descriptive titles with neutral titles, and neutralizes the DNA sample's outcome-bearing explanatory sentence. It preserves tested component behavior. These declared changes make them derived evaluation inputs, not byte-identical originals. For case-02, setup copies only the CSS rules relevant to its component layout and styling and the focus/submit handlers it invokes, removing unrelated sample behaviors and outcome-bearing labels. The one existing alignment case associated with case-03 is linked in the evaluator rubric; cases 01 and 02 use existing test samples without inventing matching case records. Two local fixtures provide supplemental obscuration behavior.

For the pilot, start at a 1280 by 800 CSS-pixel viewport, 100% zoom, then repeat at 375 by 812 and 200% zoom where supported. Record actual dimensions, browser/version, OS, zoom, and keyboard settings. Pause at least two seconds at each stop and observe changes over time as well as initial focus. Use one results file per browser/viewport/zoom combination because environment metadata applies to the entire run. These are reproducibility settings, not exhaustive WCAG coverage. Browser defaults may change results; record discrepancies rather than forcing the rubric outcome.

## Run the candidate task

Supply only `focus-run/` to the candidate agent, together with browser access or human observations. It contains local skills, instructions, the task, the result template/schema, and neutral HTML inputs. It does not contain the manifest, original source paths, or evaluator rubric. Start a fresh agent session and restrict its workspace to this directory. Workspace separation is a procedural control, not a security boundary against an agent with broader filesystem access.

Read `task.md`, follow the guided workflow, and save results to `work/`. Use `not-tested` until an actual check occurs. An agent without a browser can inspect code and guide a human, but cannot claim an observed visual pass or fail. Record initial and remediation results separately with stage, artifact hash, and evidence. Use [the evaluator rubric](../../evaluations/evaluator/rubric.md) only after results are frozen.

## Supply the resources to an agent

Use an agent that can read the neutral workspace files. Explicitly supply `instructions/accessibility-starter.md`, `instructions/accessibility-development.md`, `guided-manual-testing.md`, and `task.md`, together with both SKILL.md files and their bundled references. If the environment supports skill discovery, use its supported mechanism and confirm the intended skills were loaded. Record the agent/version, model, relevant settings, and available capabilities. No particular agent or installation path is required; customized setup examples will accompany the Section508.gov article introducing the resources.

## Optional structural validation

The setup/server/package scripts use only the Python standard library. The optional validator additionally requires PyYAML and jsonschema. Install `PyYAML==6.0.3` and `jsonschema==4.26.0` in a separate Python environment, then run `python accessibility-si/scripts/validate-pilot.py` from the source repository. For an actual result, add `--result /absolute/path/to/results.json`. Manual evaluations can also be recorded and reviewed without running the validator.

## Results and acceptance

`result-template.json` is deliberately incomplete as an evaluation: all checks are not-tested. Replace metadata placeholders, add actual evidence, and keep human review pending until performed. Schema validity alone is not evidence of accessibility or of accurate testing.

A human evaluator scores applicability decisions, findings, evidence, separation of testing tracks, honest handling of unavailable capabilities, remediation behavior, and transfer to new content. Human keyboard/visual review and applicable assistive technology testing remain acceptance steps. Source inspection or a successful structural check cannot satisfy them.
