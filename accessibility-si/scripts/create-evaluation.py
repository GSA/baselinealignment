#!/usr/bin/env python3
"""Create a complete selected-domain manual evaluation template, never a test result."""
import argparse,json
from pathlib import Path
from evaluation_common import template
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--domain',choices=['web','documents'],required=True)
 parser.add_argument('--format',choices=['html','docx','xlsx','pptx','pdf'])
 parser.add_argument('--output',type=Path,required=True)
 parser.add_argument('--human-only',action='store_true',help='Mark environment.agent and environment.model as not-applicable for testing without an agent or model; all checks remain not-tested.')
 args=parser.parse_args()
 fmt=args.format or ('html' if args.domain=='web' else None)
 if fmt is None:parser.error('For documents, select --format docx, xlsx, pptx or pdf.')
 if args.domain=='documents' and fmt=='html':parser.error('HTML is web content in this template; choose a non-web format.')
 if args.output.exists():parser.error('Refusing to overwrite an existing result file.')
 data=template(args.domain,fmt,human_only=args.human_only);args.output.parent.mkdir(parents=True,exist_ok=True)
 args.output.write_text(json.dumps(data,indent=2)+'\n', encoding='utf-8')
 print(f"Created {len(data['results'])} not-tested targets and {len(data['scope']['dispositions'])} separate scope dispositions; no tests executed.")
