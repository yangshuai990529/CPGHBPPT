#!/usr/bin/env python3
"""Optional visual regression: normalized pixel delta against a local PNG baseline."""
import sys
from PIL import Image, ImageChops, ImageStat
if len(sys.argv)!=3:
    raise SystemExit('usage: compare_preview.py BASELINE CURRENT')
a=Image.open(sys.argv[1]).convert('RGB')
b=Image.open(sys.argv[2]).convert('RGB')
if a.size!=b.size:
    raise SystemExit(f'visual regression: slide dimensions {a.size} vs {b.size}')
stat=ImageStat.Stat(ImageChops.difference(a,b))
mean=sum(stat.mean)/3
if mean>3:
    raise SystemExit(f'visual regression: average pixel difference {mean:.2f} > 3')
print(f'visual regression PASS: avg diff {mean:.2f}')
