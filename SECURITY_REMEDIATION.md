# RubyGems security remediation — 2026-08-12

## Findings addressed

| Package | Advisory | Severity | Dependency path | Before | After | Patched range |
| --- | --- | --- | --- | --- | --- | --- |
| `addressable` | GHSA-h27x-rffw-24p4 / CVE-2026-35611 | High | `jekyll` → `addressable` | 2.8.0 | 2.9.0 | 2.9.0 or later |
| `concurrent-ruby` | GHSA-h8w8-99g7-qmvj / CVE-2026-54904 | High | `jekyll` → `i18n` → `concurrent-ruby` | 1.1.8 | 1.3.8 | 1.3.7 or later |
| `concurrent-ruby` | GHSA-6wx8-w4f5-wwcr / CVE-2026-54906 | Low | `jekyll` → `i18n` → `concurrent-ruby` | 1.1.8 | 1.3.8 | 1.3.7 or later |
| `concurrent-ruby` | GHSA-wv3x-4vxv-whpp / CVE-2026-54905 | Low | `jekyll` → `i18n` → `concurrent-ruby` | 1.1.8 | 1.3.8 | 1.3.7 or later |
| `rexml` | GHSA-c2f4-jgmc-q2r5 / CVE-2025-58767 | Low | `jekyll` → `kramdown` → `rexml` | 3.4.1 | 3.4.4 | 3.4.2 or later |

The fixed ranges were verified against the GitHub Advisory Database. The final
lockfile was also checked against ruby-advisory-db and reported no known
vulnerabilities.

## Changes and compatibility

- `Gemfile.lock` updates only the three vulnerable gem versions. Addressable
  2.9.0 widens its declared `public_suffix` upper bound, but the resolved
  `public_suffix` version remains 4.0.6.
- `Gemfile` is unchanged. Jekyll remains at 4.2.0 under the existing
  `~> 4.2.0` constraint; no Ruby, Node, deployment, content, template, style,
  script, or accessibility behavior was changed.
- Bundler 2.6.9 was retained. Resolution added the current `arm64-darwin-24`
  platform and restored `wdm` 0.1.1 to the lockfile because `wdm` was already
  a direct Windows-only Gemfile dependency but was missing from the prior lock.
- The updated gems support the repository's compatible Ruby 3.1 validation
  environment. The repository does not document a Ruby version. Jekyll
  4.2.0/Liquid 4.0.3 does not build on Ruby 3.2 because Liquid calls the removed
  `String#tainted?` method; this pre-existing limitation was not expanded into
  a Jekyll or Ruby modernization.

Files changed: `Gemfile.lock` and `SECURITY_REMEDIATION.md`.

## Validation

- `bundle update addressable concurrent-ruby rexml --conservative` with
  Bundler 2.6.9: passed; no unrelated gem versions changed.
- `BUNDLE_FROZEN=true bundle check`: passed under Ruby 3.1.3 and Ruby 3.2.2.
- `JEKYLL_ENV=production bundle exec jekyll build --trace`: passed under the
  already-installed Ruby 3.1.3 and produced 315 HTML pages.
- `bundle-audit check --update`: passed against ruby-advisory-db commit
  `41fc67a072c79846169fd8991630580b97cb5b4a`; no vulnerabilities found.
- Focused smoke checks: all generated JavaScript passed `node --check`; the
  home, contributing, and test-case index pages retained their language,
  title, main-content, script, and stylesheet structure; required CSS, JS, and
  feed assets were present and non-empty.
- Local-reference scan: found seven pre-existing content defects (one
  `textcases/` typo and six raw test-file CSS references). None are in files
  changed by this remediation.
- `npm test`: expected exit 1 with `Error: no test specified`; the repository
  intentionally defines no Node test suite.
- `git diff --check`: passed.

No accessibility automation is configured. A generic accessibility pass is
not meaningful for this repository because many pages intentionally contain
failures used to validate Section 508 test procedures. The dependency-only
change leaves all rendered source, templates, scripts, styles, and test-case
content untouched.

## Remaining steps and limitations

- CI and GitHub Pages deployment were not run locally, and no external state
  was changed.
- After merge, allow Dependabot to re-evaluate `Gemfile.lock` and confirm that
  all five alerts close. Re-run the repository's GitHub Pages/deployment checks
  in its normal environment.
