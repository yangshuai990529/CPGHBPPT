import fs from 'node:fs/promises';
import path from 'node:path';
import {decideSlideVisual,inspectStructuredTable} from '../../engine/planner/visual-decision.mjs';
import {requestedSlideCount,selectContentSlides} from '../../engine/planner/page-count.mjs';

const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const slideId=index=>`s${String(index).padStart(2,'0')}`;
const sourceId=index=>`src-user-${index+1}`;
const sourceLabel=item=>`${item.source} · 第 ${item.page} 页`;

function statements(inputs){
  const out=[];
  for(const [index,input] of inputs.entries()){
    if(input.type==='csv')continue;
    for(const page of input.pages??[]){
      const parts=String(page.text??'').replace(/\[第\s*\d+\s*页\]/g,'').split(/(?<=[。！？.!?])\s+|\n+/).map(clean);
      for(const text of parts){if(text.length<15)continue;out.push({text:text.slice(0,300),source:input.name,source_id:sourceId(index),page:page.page});}
    }
  }
  return out;
}

function labeledObservations(items){
  const rows=[];
  for(const item of items){
    const m=item.text.match(/^(?:Example\s+)?respondent\s+([A-Z0-9]+)\s*:\s*(.+)$/i);
    if(m)rows.push({label:`受访者 ${m[1]}`,text:m[2],item});
  }
  return rows;
}

function spec({slide_type='content',purpose,title,key_message,layout='L02_HERO_INSIGHT',visualization='text',reason='直接呈现有来源的文字证据。',data=null,structured_data={},analysis=[],implication='',items=[],assets=[],visual_requirement=null,notes=[]}){
  const uniqueSources=[...new Set(items.map(x=>x.source_id))];
  const labels=[...new Set(items.map(sourceLabel))];
  const urls=[...new Set(items.map(x=>`${x.source}#page=${x.page}`))];
  return {slide_id:'s00',slide_type,purpose,title,title_mode:'topic',key_message,
    content:{conclusion:key_message,analysis,implication,structured_data,speaker_note:null},
    evidence:items.map((x,i)=>({evidence_id:`ev-pending-${i+1}`,claim:x.text,evidence_type:'quote',status:'supported',source_ids:[x.source_id],note:`用户材料 ${x.source} 第 ${x.page} 页`})),
    visualization:{type:visualization,reason,data},
    layout:{layout_id:layout,preferred:layout,fallback:[],reason,confidence:1,content_density:'medium',safe_area_token:'content_safe_area',reserved_regions:['top-right-logo']},
    assets,sources:uniqueSources,notes,render_options:{source_labels:labels,source_urls:urls,show_source:true,editable:true,image_fit:'contain'},status:'ready_for_renderer',
    ...(visual_requirement?{visual_requirement}:{}),
  };
}

function summaryCandidate(inputs,items,rows){
  const synthetic=items.some(x=>/synthetic test data|synthetic nps test fixture/i.test(x.text));
  const noReal=items.find(x=>/No real sample size|没有.*样本量|未提供.*样本量/i.test(x.text));
  const headline=synthetic?'这份材料是合成测试样例，不能代表真实用户结论':noReal?'材料未提供真实样本量，不能判断问题普遍性':`已从 ${inputs.length} 份材料提取可追溯内容`;
  const details=[];
  if(rows.length)details.push(`材料列出 ${rows.length} 条具名样例反馈。`);
  if(noReal)details.push(noReal.text);
  if(!details.length)details.push(...items.slice(0,2).map(x=>x.text));
  const selected=[...new Set([...(noReal?[noReal]:[]),...items.slice(0,Math.min(2,items.length))])];
  return spec({slide_type:'executive_summary',purpose:'说明材料能支持的判断及边界',title:'材料范围与结论边界',key_message:headline,layout:'L02_HERO_INSIGHT',reason:'证据范围说明用文字比装饰图清楚。',structured_data:{body:details.join('\n\n')},analysis:details,items:selected,notes:['该页只陈述材料范围，不推断总体人群。']});
}

function observationCandidate(rows){
  const items=rows.map(row=>row.item);
  return spec({slide_type:'comparison',purpose:'逐条保留样例反馈的原文与对象',title:'材料中的受访者反馈',key_message:`材料直接记录了 ${rows.length} 条受访者样例反馈`,layout:'L10_COMPARISON_TABLE',visualization:'feature-table',reason:'多条受访者反馈需要保持对象与原文的一一对应。',structured_data:{table:{headers:['对象','原文反馈'],rows:rows.map(row=>[row.label,row.text])}},items,notes:['原文为样例反馈，不代表发生频率。']});
}

function textCandidate(chunk,index){
  const body=chunk.map(x=>x.text).join('\n\n');
  return spec({purpose:'呈现材料中的可追溯原文',title:`材料证据 ${index}`,key_message:chunk[0].text.slice(0,75),structured_data:{body},analysis:chunk.map(x=>x.text),items:chunk});
}

function dataCandidates(input,index){
  const inspected=inspectStructuredTable(input.structured);
  if(!inspected)return [];
  const decision=decideSlideVisual({table:input.structured});
  const ref={text:`${input.name}：${inspected.headers.join('、')}；共 ${inspected.rows.length} 行。`,source:input.name,source_id:sourceId(index),page:1};
  if(decision.type==='bar-chart')return [spec({slide_type:'metrics',purpose:'比较原始 CSV 中同口径的数值',title:'原始数据对比',key_message:`${inspected.rows.length} 个类别可按同一指标比较`,layout:decision.layout,visualization:decision.type,reason:decision.reason,data:decision.data,structured_data:{big_number:{value:String(inspected.rows.length),label:'原始类别数'},unit:decision.data.unit},items:[ref],notes:['图表取自用户提供的 CSV；原始行列保留在源文件。']})];
  const chunks=[];for(let i=0;i<inspected.rows.length;i+=7){const part=inspected.rows.slice(i,i+7);chunks.push(spec({slide_type:'comparison',purpose:'保留原始数据的精确行列',title:`原始数据表${inspected.rows.length>7?`（${Math.floor(i/7)+1}）`:''}`,key_message:`本页保留 ${part.length} 行原始记录的精确值`,layout:decision.layout,visualization:decision.type,reason:decision.reason,structured_data:{table:{headers:inspected.headers,rows:part}},items:[ref],notes:['混合单位或非数值列不能合并成单一图表。']}));}
  return chunks;
}

function imageCandidate(asset,inputs){
  const index=inputs.findIndex(x=>x.name===asset.brand),input=inputs[index];
  const page=input?.pages?.find(x=>x.page===asset.source.page);
  if(!page||!/(图|截图|界面|示意|照片|image|screen|figure|diagram|visual)/i.test(page.text))return null;
  const decision=decideSlideVisual({screenshot:asset,visualEvidenceNeeded:true,imagesEnabled:true});
  if(decision.type!=='image')return null;
  const item={text:page.text.slice(0,180),source:input.name,source_id:sourceId(index),page:page.page};
  const ref={asset_id:asset.asset_id,asset_type:'image',status:'approved',slot:`pending:${asset.entity}`,entity:asset.entity,role:'evidence_visual',fit:'contain',priority:'high',required:true,uri:asset.local_path,usage:'local_source_page'};
  return spec({purpose:'展示与材料论点直接相关的来源画面',title:'来源画面证据',key_message:'图像内容以原始材料页面为准',layout:decision.layout,visualization:'image',reason:decision.reason,structured_data:{body:page.text.slice(0,250)},items:[item],assets:[ref],visual_requirement:{priority:'high',types:['local_page_screenshot'],entities:[asset.entity],usage:'local_source_page'},notes:[`来源：${input.name} 第 ${page.page} 页。`]});
}

export async function createContentDeck(root,config,inputs,folder,{visualManifest=null}={}){
  if(!inputs.length)throw new Error('没有可读取的输入材料，不能凭空生成本地数据 PPT。');
  const items=statements(inputs),rows=labeledObservations(items),data=inputs.flatMap(dataCandidates);
  if(!items.length&&!data.length)throw new Error('输入材料没有可用的文本或结构化数据。');
  const candidates=[];
  if(items.length)candidates.push(summaryCandidate(inputs,items,rows));
  candidates.push(...data);
  if(rows.length>=2)for(let i=0;i<rows.length;i+=7)candidates.push(observationCandidate(rows.slice(i,i+7)));
  else for(let i=0;i<items.length;i+=3)candidates.push(textCandidate(items.slice(i,i+3),Math.floor(i/3)+1));
  if(config.visual?.enabled!==false)for(const asset of visualManifest?.assets??[]){const candidate=imageCandidate(asset,inputs);if(candidate)candidates.push(candidate);}
  const content=selectContentSlides(candidates,requestedSlideCount(config));
  const title=config.project.name,cover=spec({slide_type:'cover',purpose:'标识主题',title,key_message:title,layout:'tcl-cover-01',visualization:'none',reason:'沿用企业模板封面',structured_data:{subtitle:`${config.presentation.type} · ${inputs.length} 份本地材料`}}),end=spec({slide_type:'ending',purpose:'结束演示',title:'THANKS',key_message:'文稿结束',layout:'tcl-ending-01',visualization:'none',reason:'沿用企业模板封底'});
  const specs=[cover,...content,end];
  specs.forEach((slide,i)=>{slide.slide_id=slideId(i+1);slide.evidence.forEach((e,j)=>e.evidence_id=`ev-${slide.slide_id}-${j+1}`);for(const asset of slide.assets)asset.slot=`${slide.slide_id}:${asset.entity}:local`;});
  const deck={deck_id:'deck-'+(config.project.id??'local-content').toLowerCase().replace(/[^a-z0-9-]/g,'-'),deck_title:title,objective:config.presentation.purpose??config.presentation.brief??'呈现用户材料中的可追溯信息',audience:[config.presentation.audience??'产品团队'],core_message:content[0]?.key_message??title,storyline:[{section_id:'sec-evidence',role:'evidence',question:'材料能够直接支持哪些判断？',answer:'按来源、数据形态和证据边界展示'}],slides:specs.map((slide,i)=>({slide_id:slide.slide_id,sequence:i+1,section_id:'sec-evidence',purpose:slide.purpose,question:slide.title,key_message:slide.key_message,evidence_needed:slide.evidence.map(e=>e.evidence_id),analysis_method:'source-bounded synthesis',visualization_candidate:slide.visualization.type,dependencies:i?[specs[i-1].slide_id]:[]})),open_questions:[],renderer_entry_gate:{status:'ready',blockers:[]}};
  await fs.mkdir(folder,{recursive:true});
  await Promise.all([
    fs.writeFile(path.join(folder,'deck-plan.json'),JSON.stringify(deck,null,2)),
    fs.writeFile(path.join(folder,'slide-specs.json'),JSON.stringify(specs,null,2)),
    fs.writeFile(path.join(folder,'storyline.md'),`# ${title}\n\n${specs.map((slide,i)=>`${i+1}. ${slide.title}：${slide.key_message}`).join('\n')}\n`),
    fs.writeFile(path.join(folder,'sources.md'),`# 用户提供的材料\n\n${inputs.map(x=>`- ${x.name} - SHA256 ${x.hash}; 用户提供，未作外部事实核验`).join('\n')}\n`),
    fs.writeFile(path.join(folder,'visual-decisions.json'),JSON.stringify(specs.map(slide=>({slide_id:slide.slide_id,visualization:slide.visualization.type,layout_id:slide.layout.layout_id,reason:slide.visualization.reason,asset_ids:slide.assets.map(x=>x.asset_id)})),null,2)),
  ]);
  if(visualManifest){
    for(const asset of visualManifest.assets){asset.related_slides=specs.filter(slide=>slide.assets.some(ref=>ref.asset_id===asset.asset_id)).map(slide=>slide.slide_id);asset.used=asset.related_slides.length>0;}
    for(const slot of visualManifest.coverage.slots){const asset=visualManifest.assets.find(x=>x.entity===slot.entity&&x.used);if(asset){slot.slide_id=asset.related_slides[0];slot.used=true;slot.status='USED';}}
    visualManifest.coverage.summary.used=visualManifest.assets.filter(x=>x.used).length;
    await fs.writeFile(path.join(folder,'assets/asset-manifest.json'),JSON.stringify(visualManifest,null,2));
  }
  return {deck,specs};
}
