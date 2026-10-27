#!/usr/bin/env python3
"""Prepare neutral manual-evaluation inputs; never run or grade an agent."""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
COLLECTION = ROOT / 'accessibility-si'
CASES = [
    ('case-01', 'testfiles/TF02/2.A-all-pass-1.html', []),
    ('case-02', 'testfiles/TF02/02.A-2-fail-2.html', ['TF02.css', 'TF02.js']),
    ('case-03', 'testfiles/TF02/02.A-ic-dna-1.html', []),
    ('case-04', 'accessibility-si/examples/web-focus/fixtures/overlay.html', []),
    ('case-05', 'accessibility-si/examples/web-focus/fixtures/flow.html', []),
]

def prepare(output):
    output = output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('Use an output path outside the repository to keep candidate inputs separate.')
    if output.exists():
        raise FileExistsError(f'Refusing to overwrite {output}')
    for _, source, deps in CASES:
        for path in [ROOT / source] + [(ROOT / source).with_name(dep) for dep in deps]:
            if not path.is_file():
                raise FileNotFoundError(path)
    output.mkdir(parents=True)
    for cid, source, deps in CASES:
        path = ROOT / source
        content = re.sub(r'<title>.*?</title>', f'<title>Focus exercise {cid}</title>', path.read_text(encoding='utf-8'),
                         flags=re.DOTALL | re.IGNORECASE)
        if cid == 'case-03':
            content = content.replace(
                'This page has no keyboard-focusable components and should be DNA for Focus Visible.',
                'Review the service information below.')
        target = output / 'input' / cid / 'index.html'
        target.parent.mkdir(parents=True)
        target.write_text(content, encoding='utf-8')
        for dep in deps:
            dependency = path.with_name(dep).read_text(encoding='utf-8')
            if dep.endswith('.js'):
                # Retain the focus handlers and submit behavior used by this fixture.
                dependency = '\n\n'.join(re.search(r'function ' + name + r'\([^)]*\).*?^}', dependency,
                                                   re.DOTALL | re.MULTILINE).group(0)
                                          for name in ['hideFocus', 'unhideFocus', 'submitForm']) + '\n'
            elif dep.endswith('.css'):
                # Remove unrelated sample rules and outcome-bearing selectors/comments.
                rules = re.findall(r'([^{}]+)\{([^{}]*)\}', dependency)
                dependency = '\n'.join(selector.strip() + ' {' + body + '}'
                                       for selector, body in rules
                                       if selector.strip() == '.page-contents'
                                       or selector.strip().startswith(('.page-contents ', '.button', '.hideBorderline', 'form div')))
            (target.parent / dep).write_text(dependency, encoding='utf-8')
    for name in ['accessible-web-development', 'web-accessibility-testing']:
        shutil.copytree(COLLECTION / 'skills' / name, output / 'skills' / name)
    shutil.copytree(COLLECTION / 'instructions', output / 'instructions')
    shutil.copy2(COLLECTION / 'examples/web-focus/task.md', output / 'task.md')
    for name in ['guided-manual-testing.md', 'generate-test-remediate.md']:
        shutil.copy2(COLLECTION / 'workflows' / name, output / name)
    for name in ['result-template.json', 'results-schema.json']:
        shutil.copy2(COLLECTION / 'evaluations' / ('web-focus-' + name), output / name)
    shutil.copy2(ROOT / 'LICENSE.md', output / 'LICENSE.md')
    (output / 'work').mkdir()
    inventory = [{'path': str(p.relative_to(output)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
                 for p in sorted((output / 'input').rglob('*')) if p.is_file()]
    (output / 'input-inventory.json').write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared {len(CASES)} neutral cases in {output}; no accessibility tests were run.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    try:
        prepare(args.output)
    except (ValueError, FileExistsError, FileNotFoundError) as error:
        parser.exit(1, f'{error}\n')
