#!/usr/bin/env python3
"""PPTX structural checks independent of the proprietary renderer."""
import json,sys,zipfile,re,posixpath,xml.etree.ElementTree as ET
from pathlib import Path
file=Path(sys.argv[1]);expected=int(sys.argv[2]);want_images=int(sys.argv[3])
with zipfile.ZipFile(file) as z:
 assert z.testzip() is None,'ZIP CRC failed'
 names=z.namelist();slides=sorted((n for n in names if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda x:int(re.search(r'slide(\d+)',x).group(1)))
 pics=shapes=frames=tables=charts=theme_font_refs=0;slide_layouts=[]
 for n in slides:
  root=ET.fromstring(z.read(n))
  pics+=sum(x.tag.endswith('}pic') for x in root.iter());shapes+=sum(x.tag.endswith('}sp') for x in root.iter());frames+=sum(x.tag.endswith('}graphicFrame') for x in root.iter());tables+=sum(x.tag.endswith('}tbl') for x in root.iter());charts+=sum(x.tag.endswith('}chart') for x in root.iter())
  theme_font_refs+=sum((x.attrib.get('typeface') or '').startswith('+m') for x in root.iter())
  rel_name=n.replace('ppt/slides/','ppt/slides/_rels/')+'.rels';rel_root=ET.fromstring(z.read(rel_name));layout_target=next((x.attrib['Target'] for x in rel_root if x.attrib.get('Type','').endswith('/slideLayout')),None)
  if layout_target:
   layout_name=posixpath.normpath(posixpath.join(posixpath.dirname(n),layout_target));layout_root=ET.fromstring(z.read(layout_name));cSld=next(x for x in layout_root.iter() if x.tag.endswith('}cSld'));slide_layouts.append(cSld.attrib.get('name',''))
  else:slide_layouts.append('')
 if len(slides)!=expected:raise SystemExit(f'slide count {len(slides)}/{expected}')
 if pics<want_images:raise SystemExit(f'native image count {pics}/{want_images}')
 if not shapes:raise SystemExit('no editable shapes/text')
 print(json.dumps({'status':'pass','slide_count':len(slides),'slide_master_count':sum(bool(re.fullmatch(r'ppt/slideMasters/slideMaster\d+\.xml',n)) for n in names),'slide_layout_count':sum(bool(re.fullmatch(r'ppt/slideLayouts/slideLayout\d+\.xml',n)) for n in names),'slide_layouts':slide_layouts,'theme_font_refs':theme_font_refs,'native_images':pics,'editable_shapes':shapes,'graphic_frames':frames,'native_tables':tables,'native_charts':charts,'media_files':sum(n.startswith('ppt/media/') for n in names)}))
