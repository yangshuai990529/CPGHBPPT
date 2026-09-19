#!/usr/bin/env python3
"""Replace one slide package part and verify all other slide XML stays byte-stable."""
import hashlib, json, posixpath, sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.etree import ElementTree as ET

base, rebuilt, page_text, output = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4])
page=int(page_text); slide=f'ppt/slides/slide{page}.xml'; rel=f'ppt/slides/_rels/slide{page}.xml.rels'
NS='{http://schemas.openxmlformats.org/package/2006/relationships}'

def sha(data): return hashlib.sha256(data).hexdigest()
def resolve(owner,target): return posixpath.normpath(posixpath.join(posixpath.dirname(owner),target))
def rel_owner(rel_name):
 d,b=posixpath.split(rel_name); return posixpath.join(posixpath.dirname(d),b[:-5])
def targets(parts,rel_name):
 if rel_name not in parts:return []
 owner=rel_owner(rel_name); root=ET.fromstring(parts[rel_name]); out=[]
 for node in root.findall(NS+'Relationship'):
  if node.get('TargetMode')!='External':out.append(resolve(owner,node.get('Target')))
 return out
def rel_for(part):
 d,b=posixpath.split(part);return posixpath.join(d,'_rels',b+'.rels')

with ZipFile(base) as z:
 infos={x.filename:x for x in z.infolist()}; old={x.filename:z.read(x.filename) for x in z.infolist()}
with ZipFile(rebuilt) as z:
 new_infos={x.filename:x for x in z.infolist()}; new={x.filename:z.read(x.filename) for x in z.infolist()}
if slide not in old or slide not in new:raise SystemExit(f'missing target slide {page}')

owned={slide,rel}; queue=targets(new,rel)
while queue:
 part=queue.pop(0)
 if part.startswith('ppt/slideLayouts/') or part.startswith('ppt/slideMasters/') or part in owned:continue
 owned.add(part); r=rel_for(part)
 if r in new:owned.add(r);queue.extend(targets(new,r))

other_refs=set()
for name in old:
 if name.startswith('ppt/slides/_rels/slide') and name!=rel:other_refs.update(targets(old,name))
changed=[]
for name in sorted(owned):
 if name not in new:raise SystemExit(f'rebuilt package missing dependency {name}')
 if old.get(name)!=new[name]:
  if name in other_refs and name!=slide:raise SystemExit(f'target dependency is shared by another slide and changed: {name}; use full build')
  changed.append(name)

output.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(output,'w',ZIP_DEFLATED) as z:
 for name,data in old.items():z.writestr(infos[name],new[name] if name in changed else data)
 for name in changed:
  if name not in old:z.writestr(new_infos[name],new[name])
with ZipFile(output) as z:
 bad=z.testzip()
 if bad:raise SystemExit(f'bad zip entry {bad}')
with ZipFile(output) as z:out_parts={n:z.read(n) for n in z.namelist()}
unchanged=[]
for i in range(1,1000):
 name=f'ppt/slides/slide{i}.xml'
 if name not in old:break
 if i!=page and sha(old[name])==sha(out_parts[name]):unchanged.append(i)
print(json.dumps({'status':'pass','page':page,'changed_parts':changed,'unchanged_slide_xml':unchanged,'other_slide_count':len(unchanged),'replacement_scope':'target slide and unshared dependencies'},ensure_ascii=False))
