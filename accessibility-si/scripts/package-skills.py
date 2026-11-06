#!/usr/bin/env python3
"""Copy standalone skills or the complete collection with SHA-256 inventory."""
import argparse
import hashlib
import json
import shutil
import subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
COLLECTION = ROOT / 'accessibility-si'
NAMES = ['accessible-web-development', 'web-accessibility-testing', 'accessible-document-creation', 'document-accessibility-testing']
COMPLETE_PATHS = [
    'accessibility-si',
    'evaluations',
    'testcases',
    'testfiles',
    'LICENSE.md',
    'README.md',
    'contributing.md',
    'evaluating-test-processes.md',
    'reporting-guide.md',
    'reporting-tool',
]

def ignored(_directory, names):
    return {name for name in names if name in {'.DS_Store', '__pycache__'} or name.endswith('.pyc')}

def write_inventory(output, distribution):
    inventory = {
        'collection_version': '0.2.0',
        'source_revision': subprocess.run(
            ['git', '-C', str(ROOT), 'rev-parse', 'HEAD'],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip(),
        'distribution': distribution,
        'files': [
            {'path': str(p.relative_to(output)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in sorted(output.rglob('*')) if p.is_file() and p.name != 'inventory.json'
        ],
    }
    (output / 'inventory.json').write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')

def package(output):
    output = output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('Write generated distributions outside the repository.')
    if output.exists():
        raise FileExistsError(f'Refusing to overwrite {output}')
    for name in NAMES:
        for required in ['SKILL.md', 'references']:
            if not (COLLECTION / 'skills' / name / required).exists():
                raise FileNotFoundError(name + '/' + required)
    output.mkdir(parents=True)
    for name in NAMES:
        shutil.copytree(COLLECTION / 'skills' / name, output / name)
        shutil.copy2(ROOT / 'LICENSE.md', output / name / 'LICENSE.md')
    write_inventory(output, 'standalone-skills')
    print(f'Packaged {len(NAMES)} standalone skill folders in {output}. No agent was installed.')

def package_complete(output):
    output = output.resolve()
    if output == ROOT or ROOT in output.parents:
        raise ValueError('Write generated distributions outside the repository.')
    if output.exists():
        raise FileExistsError(f'Refusing to overwrite {output}')
    output.mkdir(parents=True)
    for relative in COMPLETE_PATHS:
        source = ROOT / relative
        if not source.exists():
            raise FileNotFoundError(relative)
        destination = output / relative
        if source.is_dir():
            shutil.copytree(source, destination, ignore=ignored)
        else:
            shutil.copy2(source, destination)
    write_inventory(output, 'complete-collection-with-framework-corpus')
    print(f'Packaged the complete collection and Framework corpus in {output}. No agent was installed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--complete', action='store_true', help='Include the complete collection and Framework evaluation corpus.')
    args = parser.parse_args()
    try:
        (package_complete if args.complete else package)(args.output)
    except (ValueError, FileExistsError, FileNotFoundError) as error:
        parser.exit(1, f'{error}\n')
