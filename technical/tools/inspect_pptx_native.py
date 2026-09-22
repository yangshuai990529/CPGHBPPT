#!/usr/bin/env python3
"""PPTX structural checks independent of the proprietary renderer."""
import json,sys,zipfile,re,xml.etree.ElementTree as ET
from pathlib import Path
file=Path(sys.argv[1]);expected=int(sys.argv[2]);want_images=int(sys.argv[3])
with zipfile.ZipFile(file) as z:
 assert z.testzip() is None,'ZIP CRC failed'
 names=z.namelist();slides=sorted((n for n in names if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda x:int(re.search(r'slide(\d+)',x).group(1)))
 pics=shapes=frames=tables=charts=0
 for n in slides:
  root=ET.fromstring(z.read(n))
  pics+=sum(x.tag.endswith('}pic') for x in root.iter());shapes+=sum(x.tag.endswith('}sp') for x in root.iter());frames+=sum(x.tag.endswith('}graphicFrame') for x in root.iter());tables+=sum(x.tag.endswith('}tbl') for x in root.iter());charts+=sum(x.tag.endswith('}chart') for x in root.iter())
 if len(slides)!=expected:raise SystemExit(f'slide count {len(slides)}/{expected}')
 if pics<want_images:raise SystemExit(f'native image count {pics}/{want_images}')
 if not shapes:raise SystemExit('no editable shapes/text')
 print(json.dumps({'status':'pass','slide_count':len(slides),'native_images':pics,'editable_shapes':shapes,'graphic_frames':frames,'native_tables':tables,'native_charts':charts,'media_files':sum(n.startswith('ppt/media/') for n in names)}))
