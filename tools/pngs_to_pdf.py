#!/usr/bin/env python3
"""Preview-only PDF from checked slide screenshots; PPTX remains native/editable."""
import sys
from reportlab.pdfgen import canvas
from PIL import Image
from pathlib import Path
output=Path(sys.argv[1]);slides=[Path(x) for x in sys.argv[2:]]
if not slides:raise SystemExit('no preview slides')
output.parent.mkdir(parents=True,exist_ok=True)
width,height=960,540
pdf=canvas.Canvas(str(output),pagesize=(width,height),pageCompression=1)
for p in slides:
 with Image.open(p) as im:
  if im.width<800 or im.height<450:raise SystemExit(f'preview slide too small: {p}')
  pdf.drawImage(str(p),0,0,width,height,preserveAspectRatio=False)
 pdf.showPage()
pdf.save()
print(f'{output} pages={len(slides)}')
