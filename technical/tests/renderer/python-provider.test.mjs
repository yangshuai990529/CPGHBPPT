import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dependencies} from '../../app/runtime/dependencies.mjs';
import {resolveTemplate} from '../../app/runtime/template.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const run=(cmd,args)=>new Promise((resolve,reject)=>{const child=spawn(cmd,args,{cwd:root,stdio:['ignore','pipe','pipe']});let out='';child.stdout.on('data',x=>out+=x);child.stderr.on('data',x=>out+=x);child.on('close',code=>code===0?resolve(out):reject(new Error(out)));child.on('error',reject);});

test('python-pptx provider preserves master and emits editable native shapes',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'cpghbppt-renderer-'));
 const deck=path.join(dir,'deck.json'),slides=path.join(dir,'slides.json'),assets=path.join(dir,'assets.json'),pptx=path.join(dir,'test.pptx'),models=path.join(dir,'models.json');
 await fs.writeFile(deck,JSON.stringify({deck_id:'renderer-smoke'}));
 await fs.writeFile(assets,JSON.stringify({assets:[]}));
 await fs.writeFile(slides,JSON.stringify([
  {slide_id:'s01',slide_type:'cover',title:'Renderer 测试',content:{structured_data:{subtitle:'可编辑对象验证'}},layout:{layout_id:'tcl-cover-01'},sources:[]},
  {slide_id:'s02',slide_type:'content',title:'原生文本对象',key_message:'文字保持可编辑',content:{analysis:['这段文字必须作为文本框写入。'],structured_data:{}},layout:{layout_id:'L01_TITLE_TEXT'},sources:['fixture'],render_options:{source_labels:['fixture']}},
  {slide_id:'s03',slide_type:'ending',title:'谢谢',content:{structured_data:{}},layout:{layout_id:'tcl-ending-01'},sources:[]}
 ]));
 const python=(await dependencies(root)).RUNTIME_PYTHON;
 const template=await resolveTemplate(root,'tcl-product');
 await run(python,['engine/renderer/providers/python_pptx_renderer.py',template.master,deck,slides,assets,pptx,models]);
 const check=JSON.parse(await run(python,['tools/inspect_pptx_native.py',pptx,'3','0']));
 assert.equal(check.status,'pass');assert.equal(check.slide_count,3);assert.ok(check.editable_shapes>0);
 const rendered=JSON.parse(await fs.readFile(models,'utf8'));assert.equal(rendered[1].elements.some(x=>x.text?.includes('这段文字必须作为文本框写入')),true);
});
