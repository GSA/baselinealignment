#!/usr/bin/env python3
"""Copy self-contained skill distributions with licensing and SHA-256 inventory."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
COLLECTION = ROOT / 'accessibility-si'
NAMES = ['accessible-web-development', 'web-accessibility-testing', 'accessible-document-creation', 'document-accessibility-testing']

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
    inventory = {'collection_version': '0.2.0', 'files': [
        {'path': str(p.relative_to(output)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
        for p in sorted(output.rglob('*')) if p.is_file()]}
    (output / 'inventory.json').write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')
    print(f'Packaged {len(NAMES)} standalone skill folders in {output}. No agent was installed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    try:
        package(args.output)
    except (ValueError, FileExistsError, FileNotFoundError) as error:
        parser.exit(1, f'{error}\n')
