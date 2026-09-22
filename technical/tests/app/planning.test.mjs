import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decideSlideVisual} from '../../engine/planner/visual-decision.mjs';
import {requestedSlideCount} from '../../engine/planner/page-count.mjs';
import {createContentDeck} from '../../app/output/content-deck.mjs';
import {makeEvidenceDeck} from '../../engine/reasoning/evidence-deck.mjs';
import {readInputs} from '../../app/runtime/input.mjs';
import {eligibleWebAsset} from '../../engine/research/visual/slide-matcher/index.mjs';
import {planDeckVisuals,semanticSimilarity} from '../../engine/visual-planner/index.mjs';
import {processVisualAssets} from '../../engine/assets/processor.mjs';
import {planDeckLayouts} from '../../engine/layout/layout-engine.mjs';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');

test('chart, table, screenshot and text are selected by evidence shape',()=>{
  const chart=decideSlideVisual({table:{headers:['月份','销量(台)'],rows:[['一月','10'],['二月','12'],['三月','14']]}});
  assert.equal(chart.type,'bar-chart');
  assert.deepEqual(chart.data.series[0].values,[10,12,14]);
  const mixed=decideSlideVisual({table:{headers:['品牌','销量(台)','份额(%)'],rows:[['A','10','20%'],['B','12','21%'],['C','14','22%']]}});
  assert.equal(mixed.type,'feature-table');
  const differentBases=decideSlideVisual({table:{headers:['品牌','已核验','计划项'],rows:[['A','5','5'],['B','4','4'],['C','4','4']]},preferExactValues:true});
  assert.equal(differentBases.type,'feature-table');
  assert.equal(decideSlideVisual({screenshot:{status:'approved_internal'},visualEvidenceNeeded:true,imagesEnabled:true}).type,'image');
  assert.equal(decideSlideVisual({screenshot:{status:'approved_internal'},visualEvidenceNeeded:false}).type,'text');
  assert.equal(decideSlideVisual({screenshot:{status:'approved_internal'},visualEvidenceNeeded:true,imagesEnabled:false}).type,'text');
});


test('visual planner creates a focal evidence composition and removes duplicate research text',()=>{
  assert.ok(semanticSimilarity('Samsung Vision AI auto-adjusts color and contrast based on preferences','Samsung Vision AI auto-adjusts color and contrast based on user preferences')>.85);
  const asset={asset_id:'A1',entity:'Samsung',width:1200,height:700,source:{element:'verified-feature'}};
  const slides=[
    {slide_id:'s01',slide_type:'cover',title:'AI Picture',key_message:'AI Picture',layout:{layout_id:'tcl-cover-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
    {slide_id:'s02',slide_type:'content',title:'Samsung 官方页面证据',title_mode:'topic',key_message:'Samsung 的公开能力已覆盖内容增强、场景优化与用户偏好',layout:{layout_id:'L07_IMAGE_TEXT'},assets:[{asset_id:'A1',entity:'Samsung',status:'approved'}],evidence:[{evidence_id:'E1',claim:'Samsung Vision AI auto-adjusts color and contrast based on preferences'},{evidence_id:'E2',claim:'Samsung Vision AI auto-adjusts color and contrast based on user preferences'}],content:{analysis:['Samsung Vision AI auto-adjusts the color and contrast of each scene based on your preferences.','8K AI Upscaling Pro improves lower-resolution content.'],implication:'基于证据，应同时观察内容增强、场景优化与用户偏好。',structured_data:{evidence_items:[{label:'VISION AI',claim:'根据用户偏好自动调整不同场景的色彩与对比度'}]}},visualization:{type:'image'}},
    {slide_id:'s03',slide_type:'ending',title:'THANKS',key_message:'结束',layout:{layout_id:'tcl-ending-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
  ];
  const result=planDeckVisuals(slides,{assets:[asset]});
  const page=result.slides[1];
  assert.equal(result.gate.status,'ready');
  assert.equal(page.title,page.key_message);
  assert.equal(page.title_mode,'conclusion');
  assert.equal(page.layout.layout_id,'L23_EVIDENCE_INSIGHT');
  assert.equal(page.visual_plan.visual_center.type,'Product Screenshot');
  assert.equal(page.visual_plan.content_to_remove.length,1);
  assert.equal(page.visual_plan.screenshot_readability[0].readable,true);
  assert.ok(page.content.analysis.every(text=>text.length<=92));
});

test('visual planner blocks an unreadable screenshot before renderer',()=>{
  const asset={asset_id:'A-small',entity:'Samsung',width:300,height:80,source:{element:'verified-feature'}};
  const slides=[
    {slide_id:'s01',slide_type:'cover',title:'X',key_message:'X',layout:{layout_id:'tcl-cover-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
    {slide_id:'s02',slide_type:'content',title:'结论',title_mode:'conclusion',key_message:'关键证据需要可读',layout:{layout_id:'L07_IMAGE_TEXT'},assets:[{asset_id:'A-small',entity:'Samsung',status:'approved'}],evidence:[{evidence_id:'E1',claim:'Evidence'}],content:{analysis:['Evidence'],structured_data:{}},visualization:{type:'image'}},
    {slide_id:'s03',slide_type:'ending',title:'END',key_message:'END',layout:{layout_id:'tcl-ending-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
  ];
  const result=planDeckVisuals(slides,{assets:[asset]});
  assert.equal(result.gate.status,'blocked');
  assert.ok(result.gate.blockers.some(item=>item.code==='SCREENSHOT_READABILITY_FAILED'));
  assert.equal(result.slides[1].visual_plan.screenshot_readability[0].action,'replace');
});


test('asset processor crops an unreadable wide screenshot before layout planning',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ppt-asset-processor-'));
  try{
    const file=path.join(dir,'wide.png');await sharp({create:{width:1600,height:500,channels:3,background:'#e8e8e8'}}).png().toFile(file);const bytes=await fs.readFile(file);const {createHash}=await import('node:crypto');const hash=createHash('sha256').update(bytes).digest('hex');
    const asset={asset_id:'A-wide',entity:'Samsung',width:1600,height:500,local_path:file,content_hash:hash,status:'approved_internal',semantic_review:'source_and_slot_verified',quality:{resolution:'adequate'},source:{element:'verified-feature',page_url:'https://example.com'}};
    const slides=[
      {slide_id:'s01',slide_type:'cover',title:'X',key_message:'X',layout:{layout_id:'tcl-cover-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
      {slide_id:'s02',slide_type:'content',title:'结论',title_mode:'conclusion',key_message:'宽截图必须先裁切',layout:{layout_id:'L07_IMAGE_TEXT'},assets:[{asset_id:'A-wide',entity:'Samsung',status:'approved'}],evidence:[{evidence_id:'E1',claim:'A'},{evidence_id:'E2',claim:'B'}],content:{analysis:['发现一','发现二'],structured_data:{evidence_items:[{label:'A',claim:'发现一'},{label:'B',claim:'发现二'}]}},visualization:{type:'image'}},
      {slide_id:'s03',slide_type:'ending',title:'END',key_message:'END',layout:{layout_id:'tcl-ending-01'},assets:[],evidence:[],content:{analysis:[],structured_data:{}},visualization:{type:'none'}},
    ];
    const first=planDeckVisuals(slides,{assets:[asset]});assert.equal(first.gate.status,'blocked');assert.equal(first.slides[1].visual_plan.screenshot_readability[0].action,'crop');
    const processed=await processVisualAssets(first.slides,{assets:[asset]},{outputDir:dir});assert.equal(processed.actions[0].status,'completed');assert.notEqual(processed.slides[1].assets[0].asset_id,'A-wide');
    const final=planDeckVisuals(processed.slides,{assets:processed.manifest.assets});assert.equal(final.gate.status,'ready');
    const layouts=planDeckLayouts(final.slides);assert.equal(layouts.gate.status,'ready');assert.equal(layouts.slides[1].layout_plan.regions.screenshot.w,490);
  }finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('requested slide count includes cover and end; no filler pages',async()=>{
  assert.equal(requestedSlideCount({presentation:{brief:'生成 4 页 PPT'}}),4);
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ppt-dynamic-local-'));
  const input={name:'notes.md',type:'md',hash:'fixture',pages:[{page:1,text:'Example respondent A: Picture mode names are hard to understand. Example respondent B: I want to compare image changes before applying. Example respondent C: Settings change when switching input sources.',has_visual:false}]};
  const config={project:{name:'用户反馈'},presentation:{type:'user-insight',brief:'生成 4 页 PPT'},visual:{enabled:true}};
  try{
    const {specs}=await createContentDeck(root,config,[input],dir);
    assert.equal(specs.length,4);
    assert.equal(specs[2].visualization.type,'feature-table');
    assert.equal(specs.flatMap(s=>s.assets).length,0);
    await assert.rejects(createContentDeck(root,{...config,presentation:{...config.presentation,slide_count:8}},[input],dir),/无法凭空填满/);
  }finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('text-only PDF is not treated as an image requirement',async()=>{
  const input=await readInputs([path.join(root,'../examples/03-user-insight/input/NPS.pdf')]);
  assert.equal(input[0].pages[0].has_visual,false);
});

test('viewport fallback and extreme aspect screenshots cannot auto-enter PPT',()=>{
  const base={status:'approved_internal',semantic_review:'source_and_slot_verified',quality:{resolution:'adequate'},width:800,height:600,source:{element:'verified-feature'}};
  assert.equal(eligibleWebAsset(base),true);
  assert.equal(eligibleWebAsset({...base,source:{element:'viewport_fallback'}}),false);
  assert.equal(eligibleWebAsset({...base,width:2600,height:300}),false);
});

test('web readout plans brand visuals per relevant page and honors requested count',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'ppt-dynamic-web-'));
  const sources=['A','B'].map((brand,i)=>({source_id:`src-${i}`,publisher:brand,title:brand,locator:{uri:`https://example.com/${brand}`,accessed_at:'2026-09-22T00:00:00Z'}}));
  const evidence=['A','B'].map((brand,i)=>({evidence_id:`E${i}`,claim_id:`C${i}`,source_id:`src-${i}`,entity:brand,capability:'Feature',quote_or_fact:`${brand} official page describes Feature`}));
  const dataset={research_plan:{brief:{brands:['A','B'],topic:'Fixture research'}},sources,evidence,claims:[],competitor_matrix:{rows:[{capability:'Feature',cells:{A:{value:'✓'},B:{value:'✓'}}}]},coverage:{overall:{found:2,required:2},rows:[{brand:'A',found:1,required:1,gaps:[]},{brand:'B',found:1,required:1,gaps:[]}]}};
  const asset={asset_id:'asset-a',entity:'A',asset_type:'product_image',status:'approved_internal',semantic_review:'source_and_slot_verified',width:800,height:600,quality:{resolution:'adequate'},visual_role:'CONTEXT_VISUAL',local_path:'/tmp/fixture.png',source:{page_url:'https://example.com/A',element:'verified-feature'}};
  try{
    const full=await makeEvidenceDeck(dataset,root,dir,{visualManifest:{assets:[asset]},config:{presentation:{slide_count:6}}});
    assert.equal(full.slides.length,6);
    assert.equal(full.slides[3].visualization.type,'image');
    assert.equal(full.slides[4].visualization.type,'text');
    assert.equal(full.visualMatch.used.length,1);
    const short=await makeEvidenceDeck(dataset,root,dir,{visualManifest:{assets:[asset]},config:{presentation:{slide_count:4}}});
    assert.equal(short.slides.length,4);
    assert.equal(short.slides.some(slide=>slide.visualization.type==='feature-table'),true);
    assert.equal(short.slides.some(slide=>slide.visualization.type==='image'),false);
  }finally{await fs.rm(dir,{recursive:true,force:true});}
});
