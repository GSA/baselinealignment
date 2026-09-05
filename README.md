# ICT Baseline Alignment Framework

This repository contains the content and source code for the ICT Baseline Alignment Framework. The Framework helps accessibility testers, test process owners, testing tool developers, and federal agencies evaluate whether their testing methods produce results consistent with the [ICT Testing Baseline for Web](https://ictbaseline.access-board.gov/).

Each test case pairs a web content sample with an expected Baseline result and an explanation. By applying their own procedures or tools to the same samples, users can compare results, identify gaps, and improve consistency across accessibility testing methods.

Test cases and alignment guidance are still being developed. The available cases support evaluation of testing methods; they do not constitute a complete accessibility test process or certification of a tool.

## What This Repository Contains

- Test case descriptions with expected results, rationale, and instruction-level details.
- Standalone HTML samples demonstrating passing, failing, and not-applicable scenarios.
- Structured references to Baseline test procedures and WCAG success criteria.
- A searchable test case index and downloadable JSON and CSV indexes.
- A Jekyll website with shared layouts, navigation, styles, and contribution guidance.

## Using the Test Cases

1. Browse the [test case source files](testcases/) or open the **Test Cases** index on the rendered website.
2. Select a case and read its description, applicable Baseline procedure, expected result, and test instructions.
3. Open the linked **Single-Page URL** and evaluate that sample using your own relevant test procedure or tool rule.
4. Compare your findings with the case's expected result and instruction-level details. Results are `PASS`, `FAIL`, or `DNA` (does not apply).
5. Investigate differences and report unclear instructions or unexpected results through a [GitHub issue](https://github.com/GSA/baselinealignment/issues), including the test case ID and your testing environment.

Evaluate the linked sample page for the specified procedure. Samples intentionally include accessibility failures and cases where a particular test does not apply. A passing result applies to the checks described in that case, rather than every accessibility requirement for the page.

The rendered test case index also provides JSON and CSV downloads for use in spreadsheets or other analysis tools.

## Technology Overview

The site uses Jekyll to generate static pages from Markdown, YAML front matter, and Liquid templates. The shared website imports U.S. Web Design System (USWDS) styles, scripts, and header/footer blocks from Section508.gov, with local CSS for site-specific adjustments. Legacy Bootstrap references remain in shared templates and some standalone test samples. JavaScript supports the test case index and page behavior.

Test cases are ordinary Jekyll pages in `testcases/`. The index discovers pages with `layout: testcase`, while the test case layout uses each case's ID to look up its Baseline procedure in `_data/baselines.yaml`.

## Repository Structure

| Path | Purpose |
| --- | --- |
| `index.md` | Framework purpose and introductory alignment guidance. |
| `testcases.md` | Website test case index and download links. |
| `testcases/` | Markdown test case descriptions and expected results. |
| `testfiles/TF##/` | HTML samples grouped by Baseline number, with supporting files where needed. |
| `testfiles/assets/` | Shared sample resources, including images, audio, video, and media player files. |
| `Templates/_testcase-template.md` | Starting template and authoring notes for test cases. |
| `_data/baselines.yaml` | Baseline categories, procedures, links, and standard references. |
| `_data/standards.yaml` | WCAG success criteria, levels, and version metadata. Some Section 508 software standards referenced in the ICT Baseline. |
| `_layouts/` | Templates for general pages and test cases. |
| `_includes/` | Shared navigation, header, footer, scripts, and other page components. |
| `assets/` and `fonts/` | Website styles, scripts, images, fonts, and index export templates. |
| `_config.yml` | Site metadata, navigation, base URL, plugins, and build exclusions. |
| `Gemfile`, `Gemfile.lock`, `.ruby-version` | Ruby version and Jekyll dependencies. |
| `package.json` | Convenience commands for serving, building, and cleaning the site. |
| `contributing.md` | Ways to contribute and working group practices. |

## Content Basics

Test case Markdown files begin with YAML front matter. For example:

```yaml
---
layout: testcase
title: Image - no accessible name or description
tcid: TC06.A-1-fail-1
standard: WCAG
standard-ref: 1.1.1
standard-ref-url: https://www.w3.org/WAI/WCAG22/quickref/#non-text-content
descr: A meaningful image has no accessible name or description.
result: FAIL
result-descr: The image does not provide a text alternative.
sample: /testfiles/TF06/06.A-1-fail-1.html
---
```

The Markdown body contains a table with **Test Instruction**, **Instruction Detail**, and **Expected Test Case Result** columns. Use the [existing case](testcases/TC06.A-1-fail-1.md) and [test case template](Templates/_testcase-template.md) as authoring references.

- `layout` must be `testcase` for inclusion in the index.
- `tcid` identifies the Baseline number, procedure, instruction, expected result, and example number. In `TC06.A-1-fail-1`, these are Baseline 06, procedure A, instruction 1, fail, and example 1. Existing cases also use `all` for all instructions and `ic` for Identify Content.
- `standard`, `standard-ref`, and `standard-ref-url` supply the index's standards reference.
- `descr`, `result`, and `result-descr` explain the scenario and expected outcome.
- `sample` is the sample's site-relative path, without the `/baselinealignment` base URL prefix.

When adding a case, create its sample under the corresponding `testfiles/TF##/` directory and mark the relevant sample container with `id="tc_code"`, as described in the template. Ensure the case ID matches a procedure in `_data/baselines.yaml`: the current layout derives the procedure reference from `tcid`, rather than the template's older `app-baseline` field.

The files `assets/baselineTestCases.json` and `assets/baselineTestCases.csv` are Liquid templates populated from test case pages during the build. Update case metadata to change exported records.

## Local Development

Use Ruby 3.4.9 as specified in `.ruby-version`, with Bundler installed. The Gemfile permits Ruby versions from 3.4.9 up to, but excluding, 3.5.

Install the Ruby dependencies from the repository root:

```sh
bundle install
```

Start the local site:

```sh
bundle exec jekyll serve
```

Open [http://localhost:4000/baselinealignment/](http://localhost:4000/baselinealignment/). The path prefix comes from `baseurl` in `_config.yml`.

Build without serving, or remove generated output:

```sh
bundle exec jekyll build
bundle exec jekyll clean
```

If Node.js and npm are available, `npm start`, `npm run build`, and `npm run clean` wrap these same Jekyll commands.

Before submitting content changes, build the site and review the affected case, sample page, Baseline link, index entry, and exports. Confirm that the sample produces the documented result for the specified procedure. There is no automated test suite configured; `npm test` is a placeholder that exits with an error.

## Contributing

We welcome new samples, reviews of expected results, clearer instructions, website improvements, and feedback from test process and tool owners. See [contributing.md](contributing.md) for participation details and working group practices.

Submit feedback through [issues](https://github.com/GSA/baselinealignment/issues) and proposed changes through [pull requests](https://github.com/GSA/baselinealignment/pulls). For questions about getting involved, contact [ictbaseline@gsa.gov](mailto:ictbaseline@gsa.gov).

## Public Domain

See [LICENSE.md](LICENSE.md) for the project's public domain dedication and CC0 1.0 Universal terms. Bundled third-party resources may carry their own licenses, such as the [Able Player license](testfiles/assets/ableplayer/LICENSE).
