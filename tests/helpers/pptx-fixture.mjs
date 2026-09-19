import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const script = String.raw`
import sys, zipfile
out, marker = sys.argv[1], sys.argv[2]
content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
</Types>'''
presentation = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>'''
slide = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>{text}</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>'''
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', content_types)
    z.writestr('ppt/presentation.xml', presentation)
    for i in range(1, 4):
        z.writestr(f'ppt/slides/slide{i}.xml', slide.format(text=f'{marker} slide {i}'))
`;

export async function createPptxFixture(file, marker='fixture') {
  await fs.mkdir(path.dirname(file), {recursive: true});
  await new Promise((resolve, reject) => {
    const child = spawn('python3', ['-c', script, file, marker]);
    let error = '';
    child.stderr.on('data', chunk => error += chunk);
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(error || `fixture creation failed: ${code}`)));
  });
  return file;
}
