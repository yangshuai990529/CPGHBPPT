import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dependencies} from '../../app/runtime/dependencies.mjs';
import {resolveTemplate} from '../../app/runtime/template.mjs';
import sharp from 'sharp';
import {createHash} from 'node:crypto';

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
 assert.equal(check.slide_master_count,1);assert.equal(check.slide_layout_count,6);
 assert.deepEqual(check.slide_layouts,['2_空白','5_标题幻灯片','8_标题幻灯片']);
 assert.ok(check.theme_font_refs>=6,'generated text should reference Master theme fonts');
 const rendered=JSON.parse(await fs.readFile(models,'utf8'));assert.equal(rendered[1].elements.some(x=>x.text?.includes('这段文字必须作为文本框写入')),true);
 assert.deepEqual(rendered.map(page=>page.masterLayout),['2_空白','5_标题幻灯片','8_标题幻灯片']);
 assert.ok(rendered[1].elements.every(x=>!x.text||x.fontSource?.startsWith('master-')));
});


test('python-pptx provider renders Evidence + Insight with a dominant readable screenshot',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'cpghbppt-evidence-layout-'));
 const deck=path.join(dir,'deck.json'),slides=path.join(dir,'slides.json'),assets=path.join(dir,'assets.json'),pptx=path.join(dir,'evidence.pptx'),models=path.join(dir,'models.json'),image=path.join(dir,'evidence.png');
 const bytes=await sharp({create:{width:1000,height:600,channels:3,background:'#202020'}}).png().toBuffer();await fs.writeFile(image,bytes);const hash=createHash('sha256').update(bytes).digest('hex'),assetId='A'+hash.slice(0,12);
 await fs.writeFile(deck,JSON.stringify({deck_id:'evidence-layout'}));
 await fs.writeFile(assets,JSON.stringify({assets:[{asset_id:assetId,entity:'Samsung',status:'approved_internal',local_path:image,content_hash:hash}]}));
 const layoutPlan={layout_id:'L23_EVIDENCE_INSIGHT',safe_area:{x:120,y:124,w:900,h:500},regions:{screenshot_panel:{x:120,y:137,w:510,h:350},screenshot:{x:130,y:147,w:490,h:330},findings:{x:658,y:145,w:350,h:300},product_insight:{x:120,y:510,w:900,h:100}},status:'ready'};
 await fs.writeFile(slides,JSON.stringify([
  {slide_id:'s01',slide_type:'cover',title:'Evidence Layout',content:{structured_data:{subtitle:'Visual Planner'}},layout:{layout_id:'tcl-cover-01'},sources:[]},
  {slide_id:'s02',slide_type:'content',title:'Samsung 已将 AI 画质扩展到场景与用户偏好',key_message:'Samsung 已将 AI 画质扩展到场景与用户偏好',content:{conclusion:'Samsung 已将 AI 画质扩展到场景与用户偏好',analysis:['发现一','发现二'],implication:'基于证据，应同时观察内容增强、场景优化和用户偏好。',structured_data:{evidence_items:[{label:'VISION AI',claim:'根据用户偏好调整色彩与对比度'},{label:'AI UPSCALING PRO',claim:'提升低分辨率内容画质'}],product_insight:'AI 画质竞争不只比较单点算法。'}},layout:{layout_id:'L23_EVIDENCE_INSIGHT'},layout_plan:layoutPlan,assets:[{asset_id:assetId,status:'approved',entity:'Samsung',fit:'contain'}],sources:['src-samsung'],render_options:{source_labels:['Samsung Official Website']}},
  {slide_id:'s03',slide_type:'ending',title:'THANKS',content:{structured_data:{}},layout:{layout_id:'tcl-ending-01'},sources:[]}
 ]));
 const python=(await dependencies(root)).RUNTIME_PYTHON,template=await resolveTemplate(root,'tcl-product');await run(python,['engine/renderer/providers/python_pptx_renderer.py',template.master,deck,slides,assets,pptx,models]);
 const rendered=JSON.parse(await fs.readFile(models,'utf8')),page=rendered[1];assert.ok(page.elements.some(x=>x.type==='Image'&&x.frame.w>=490));assert.ok(page.elements.some(x=>x.text==='产品启示'));assert.ok(page.elements.filter(x=>x.type==='Panel').length>=2);
});
