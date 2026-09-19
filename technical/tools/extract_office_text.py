#!/usr/bin/env python3
"""Read-only, bounded DOCX/XLSX text extraction; formulas are not evaluated."""
import json, sys, zipfile, xml.etree.ElementTree as ET
from pathlib import Path
p=Path(sys.argv[1]); kind=p.suffix.lower()
if p.stat().st_size>35_000_000: raise SystemExit('Document too large')
with zipfile.ZipFile(p) as z:
 if sum(i.file_size for i in z.infolist())>120_000_000: raise SystemExit('Office expansion limit exceeded')
 if kind=='.docx':
  root=ET.fromstring(z.read('word/document.xml'))
  ns='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
  blocks=[''.join(t.text or '' for t in par.iter(ns+'t')) for par in root.iter(ns+'p')]
 elif kind=='.xlsx':
  ns='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
  shared=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   strings=ET.fromstring(z.read('xl/sharedStrings.xml'))
   shared=[''.join(t.text or '' for t in si.iter(ns+'t')) for si in strings.iter(ns+'si')]
  blocks=[]
  sheets=sorted(x for x in z.namelist() if x.startswith('xl/worksheets/sheet') and x.endswith('.xml'))[:20]
  for sheet in sheets:
   root=ET.fromstring(z.read(sheet))
   for cell in root.iter(ns+'c'):
    v=cell.find(ns+'v');inline=cell.find(ns+'is')
    if inline is not None: value=''.join(t.text or '' for t in inline.iter(ns+'t'))
    elif v is not None: value=shared[int(v.text)] if cell.attrib.get('t')=='s' and v.text is not None and int(v.text)<len(shared) else (v.text or '')
    else: continue
    if value: blocks.append(f"{sheet}:{cell.attrib.get('r','')} {value}")
    if len(blocks)>20000: raise SystemExit('Too many cells for ingestion preview')
 else: raise SystemExit('Only DOCX/XLSX supported')
 print(json.dumps({'format':kind[1:],'blocks':[x[:700] for x in blocks if x.strip()][:20000]},ensure_ascii=False))
