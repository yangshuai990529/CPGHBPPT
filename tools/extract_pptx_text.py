#!/usr/bin/env python3
"""Read-only PPTX slide text. No macro execution, no source rewriting."""
import json, re, sys, zipfile, xml.etree.ElementTree as ET
from pathlib import Path
p=Path(sys.argv[1]); max_bytes=35_000_000
if p.stat().st_size>max_bytes: raise SystemExit('PPTX too large for local review')
with zipfile.ZipFile(p) as z:
 if sum(i.file_size for i in z.infolist())>120_000_000: raise SystemExit('PPTX expansion limit exceeded')
 names=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda s:int(re.search(r'slide(\d+)',s).group(1)))
 if len(names)>100: raise SystemExit('Too many slides for local review')
 slides=[]
 for n in names:
  root=ET.fromstring(z.read(n));texts=[e.text or '' for e in root.iter() if e.tag.endswith('}t')]
  slides.append({'slide':len(slides)+1,'texts':[t[:600] for t in texts if t.strip()]})
 print(json.dumps({'file':str(p.resolve()),'slide_count':len(slides),'slides':slides},ensure_ascii=False))
