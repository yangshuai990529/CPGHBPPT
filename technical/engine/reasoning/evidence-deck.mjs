// Public-source readout only. No internal strategy is inferred from competitor pages.
import fs from 'node:fs/promises';
import path from 'node:path';
import {citationsForSlide} from '../research/citation/index.mjs';
import {matchSlideAssets,eligibleWebAsset} from '../research/visual/slide-matcher/index.mjs';
import {requestedSlideCount,selectContentSlides} from '../planner/page-count.mjs';
import {decideSlideVisual} from '../planner/visual-decision.mjs';
import {compressResearchText} from '../visual-planner/index.mjs';

const id=index=>`s${String(index).padStart(2,'0')}`;
const uniq=values=>[...new Set(values.filter(Boolean))];
function distinctEvidence(items){const result=[];for(const item of items){const text=item.quote_or_fact.toLowerCase().replace(/\s+/g,' ').trim();if(!result.some(previous=>{const prior=previous.quote_or_fact.toLowerCase().replace(/\s+/g,' ').trim();return prior===text||prior.includes(text)||text.includes(prior);})){result.push(item);}}return result;}

function makeSpec({slide_type='content',purpose,title,key_message,title_mode='conclusion',layout='L02_HERO_INSIGHT',visualization='text',reason='来源事实以文字呈现。',data=null,structured_data={},analysis=[],implication='仅代表本次已核验公开页面；不得外推市场普及度或本方产品策略。',evidence=[],sources=[],notes=[],visual_requirement=null}){
  const ids=uniq(evidence.map(x=>x.source_id));const links=uniq(ids.map(sourceId=>sources.find(s=>s.source_id===sourceId)?.locator?.uri));
  return {slide_id:'s00',slide_type,purpose,title,title_mode,key_message,
    content:{conclusion:key_message,analysis,implication,structured_data,speaker_note:null},
    evidence:evidence.map(e=>({evidence_id:e.evidence_id,claim:e.quote_or_fact,evidence_type:'fact',status:'supported',source_ids:[e.source_id],note:`原文：${e.quote_or_fact}`})),
    visualization:{type:visualization,reason,data},layout:{layout_id:layout,preferred:layout,fallback:[],reason,confidence:1,content_density:'medium',safe_area_token:'content_safe_area',reserved_regions:['top-right-logo']},
    assets:[],sources:ids,notes,render_options:{source_labels:ids.map(sourceId=>{const source=sources.find(s=>s.source_id===sourceId);return `${source?.publisher??sourceId} (${source?.locator?.accessed_at?.slice(0,10)??'unknown'})`;}),source_urls:links,show_source:true,editable:true,image_fit:'contain'},status:'ready_for_renderer',
    ...(visual_requirement?{visual_requirement}:{}),
  };
}

function capabilityLabel(value=''){
  const text=String(value).toLowerCase();
  if(/preference|personal/.test(text))return '用户偏好';
  if(/upscal|resolution|content enhancement/.test(text))return '内容增强';
  if(/scene|content recognition|auto picture|optimization/.test(text))return '场景识别与优化';
  if(/color|contrast/.test(text))return '色彩与对比度优化';
  if(/ai picture|ai processing|processor|engine/.test(text))return 'AI 画质处理';
  return String(value||'官网声明').replace(/\s*\/\s*/g,'与');
}
function joinChinese(values){return values.length<=1?(values[0]??'相关能力'):values.length===2?values.join('与'):`${values.slice(0,-1).join('、')}与${values.at(-1)}`;}

function brandSlide(brand,items,sources,visualManifest){
  const chosen=visualManifest?.assets?.find(a=>a.entity===brand&&eligibleWebAsset(a)&&['feature_screenshot','feature_image','product_image'].includes(a.asset_type));
  const selected=distinctEvidence(items).slice(0,3);
  const labels=uniq(selected.map(item=>capabilityLabel(item.capability))).slice(0,3);
  const findings=selected.map((item,index)=>({label:labels[index]??capabilityLabel(item.capability),claim:compressResearchText(item.quote_or_fact,76),original:item.quote_or_fact,evidence_id:item.evidence_id}));
  const capabilitySummary=joinChinese(labels);
  const conclusion=`${brand} 的公开能力已覆盖${capabilitySummary}`;
  const productInsight=`基于本页证据，评估 AI 画质时应同时观察${capabilitySummary}，不能只比较单一算法名称。`;
  const visual=!!chosen;
  return makeSpec({purpose:`呈现 ${brand} 官方页面的直接证据并提炼产品含义`,title:conclusion,key_message:conclusion,layout:visual?'L07_IMAGE_TEXT':'L02_HERO_INSIGHT',visualization:visual?'image':'text',reason:visual?'局部官网截图作为证据中心，右侧只保留经过压缩的核心发现。':'没有经核验的相关画面，用提炼后的证据结论替代装饰截图。',structured_data:{evidence_items:findings,body:findings.map(item=>`${item.label}\n${item.claim}`).join('\n\n'),product_insight:productInsight},analysis:findings.map(item=>`${item.label}：${item.claim}`),implication:productInsight,evidence:selected,sources,notes:visual?['原始外文保留在 Evidence 元数据和备注中，不作为正文主体。']:[`${brand} 未找到与本页证据匹配的可用网页截图。`],visual_requirement:visual?{priority:'high',types:['feature_screenshot','feature_image','product_image'],entities:[brand],usage:'verified_product_context'}:null});
}
function selectedContent(candidates,brandPages,config){
  const count=requestedSlideCount(config);
  if(count==null)return [...candidates.slice(0,2),...brandPages,...candidates.slice(2)];
  const slots=count-2,core=candidates.slice(0,2),tail=candidates.slice(2);
  if(slots<core.length)return selectContentSlides(core,count);
  if(slots>=core.length+brandPages.length)return selectContentSlides([...core,...brandPages,...tail],count);
  // A short deck compares all entities together; it never gives an image page to only the first brand.
  return selectContentSlides([...core,...tail],count);
}

export async function makeEvidenceDeck(dataset,root,out,{domainContext=null,visualManifest=null,localInputs=[],config={}}={}){
  const brief=dataset.research_plan?.brief??{},brands=brief.brands??uniq(dataset.evidence.map(e=>e.entity)),topic=brief.topic??brief.objective??'产品研究';
  const allSources=[...dataset.sources],all=dataset.evidence;
  const supportedBrands=brands.filter(brand=>all.some(e=>e.entity===brand));
  const matrix=dataset.competitor_matrix?.rows??[];
  const sharedCapability=matrix.find(row=>supportedBrands.length>=2&&supportedBrands.every(brand=>row.cells?.[brand]?.value==='✓'))?.capability;
  const sharedEvidence=sharedCapability?all.filter(e=>e.capability===sharedCapability):all.slice(0,Math.min(3,all.length));
  const statement=sharedCapability?`本次已核验页面中，${supportedBrands.length} 个对象均提及 ${sharedCapability}`:`本次页面证据不足以形成跨对象共同结论`;
  const insight={insight_id:'ins-public-evidence',level:'INSIGHT',statement,upstream_ids:sharedEvidence.map(e=>e.claim_id),source_ids:uniq(sharedEvidence.map(e=>e.source_id)),supporting_evidence:sharedEvidence.map(e=>e.evidence_id),reasoning_summary:'仅限本次已核验公开页面；不推断产品效果或本方策略。',confidence:sharedCapability?'medium':'low',status:sharedCapability?'supported':'needs_evidence'};

  const summary=makeSpec({slide_type:'executive_summary',purpose:'说明研究范围与能得到的有限判断',title:'本次证据只支持公开声明对照，不支持体验优劣判断',key_message:statement,structured_data:{body:`研究对象：${supportedBrands.join('、')}。本次核验 ${dataset.sources.length} 个来源，获得 ${all.length} 条可回溯证据。\n\n页面声明只说明厂商公开表述，不能证明实际体验优劣。所有结论均按页面 URL 与核验时间回溯。`},analysis:['所有页面结论均按 URL 与抓取时间回溯。'],evidence:sharedEvidence,sources:allSources});
  const capRows=matrix.slice(0,7),comparison=makeSpec({slide_type:'comparison',purpose:'按相同维度比较各对象的公开声明',title:'官网声明只能比较“是否提及”，不能直接比较能力强弱',key_message:'问号表示本次未找到相应证据，不代表产品不支持',layout:'L10_COMPARISON_TABLE',visualization:'feature-table',reason:'多对象、多能力维度需要保留精确的行列对应；截图不能替代表格。',structured_data:{table:{headers:['能力',...supportedBrands],rows:capRows.map(row=>[row.capability,...supportedBrands.map(brand=>row.cells?.[brand]?.value??'?')])}},evidence:all,sources:allSources,notes:['✓ 只表示本次已核验页面直接支持该声明；? 表示本次未找到。']});
  const brandPages=supportedBrands.map(brand=>brandSlide(brand,all.filter(e=>e.entity===brand),allSources,visualManifest));
  const other=[];
  const coverage=dataset.coverage?.rows??[];
  if(coverage.length>=3&&coverage.length<=10&&coverage.every(row=>Number.isFinite(row.found)&&Number.isFinite(row.required))){
    const sameDenominator=new Set(coverage.map(row=>row.required)).size===1,hasVariation=new Set(coverage.map(row=>row.found)).size>1;
    const table={headers:['对象','已核验','计划项'],rows:coverage.map(row=>[row.brand,String(row.found),String(row.required)])};
    const decision=decideSlideVisual({table,preferExactValues:!sameDenominator||!hasVariation});
    other.push(makeSpec({slide_type:'metrics',purpose:'说明此次研究的证据覆盖程度',title:'证据覆盖是研究进度，不能代替产品能力评分',key_message:'证据覆盖是研究进度，不能代替产品能力评分',layout:decision.layout,visualization:decision.type,reason:!sameDenominator?'各对象计划核验项的分母不同；保留精确分子/分母，避免柱形高度误导。':decision.reason,data:decision.type==='bar-chart'?decision.data:null,structured_data:decision.type==='feature-table'?{table:decision.data}:{big_number:{value:`${dataset.coverage.overall.found}/${dataset.coverage.overall.required}`,label:'证据覆盖'}},evidence:all,sources:allSources,notes:['覆盖度量是研究过程指标，不是竞品能力或市场数据。']}));
  }
  const gaps=coverage.flatMap(row=>(row.gaps??[]).slice(0,2).map(gap=>`${row.brand}：${typeof gap==='string'?gap:JSON.stringify(gap)}`));
  if(gaps.length)other.push(makeSpec({purpose:'明确尚需核验的问题',title:'未命中的字段必须保持未知，不能写成产品不支持',key_message:'未命中的字段继续保持未知',structured_data:{body:gaps.slice(0,6).join('\n\n')},analysis:gaps.slice(0,6),evidence:[],sources:allSources,notes:['缺口是研究结果，不得写为产品能力不存在。']}));
  if(localInputs.length){for(const [index,input] of localInputs.entries()){
    const source={source_id:`src-local-${index+1}`,title:input.name,source_type:'user_provided',locator:{uri:input.name,accessed_at:new Date().toISOString()},status:'provided',publisher:'用户提供',origin:'user_provided'};allSources.push(source);
    const excerpt=String(input.text??'').replace(/\[第\s*\d+\s*页\]/g,' ').replace(/\s+/g,' ').trim().slice(0,420);
    other.push(makeSpec({purpose:'将本地事实与外部网页声明分开',title:`本地材料：${input.name}`,key_message:'本地材料作为内部上下文，公开网页只用于外部核验',structured_data:{body:excerpt},analysis:[excerpt],evidence:[{evidence_id:`ev-local-${index+1}`,source_id:source.source_id,quote_or_fact:excerpt,claim_id:`local-${index+1}`}],sources:allSources,notes:['混合模式：本地材料未上传到外部网站。']}));
  }}

  const content=selectedContent([summary,comparison,...other],brandPages,config);
  const cover=makeSpec({slide_type:'cover',purpose:'标识公开研究主题',title:`${topic} 公开证据概览`,key_message:topic,title_mode:'topic',layout:'tcl-cover-01',visualization:'none',reason:'使用企业封面',structured_data:{subtitle:'仅限本次已核验公开页面'},sources:allSources});
  const end=makeSpec({slide_type:'ending',purpose:'结束演示',title:'THANKS',key_message:'研究到此为止',title_mode:'topic',layout:'tcl-ending-01',visualization:'none',reason:'使用企业封底',sources:allSources});
  let slides=[cover,...content,end];slides.forEach((slide,index)=>slide.slide_id=id(index+1));
  const visualMatch=visualManifest?matchSlideAssets(slides,visualManifest):{slides,used:[],missing:[]};slides=visualMatch.slides;
  const visualPlan={slots:slides.flatMap(slide=>(slide.visual_requirement?.entities??[]).map(entity=>({id:`${slide.slide_id}:${entity}`,slide_id:slide.slide_id,entity,asset_type:'product_image',required:false})))};
  if(domainContext?.packs?.length)comparison.notes.push(`方法上下文：${domainContext.packs.map(x=>x.id).join(', ')}；只用于研究范围，不充当产品事实。`);
  const deck={deck_id:'deck-web-evidence',deck_title:`${topic} 公开证据概览`,objective:'对已核验公开页面做有界比较',audience:[config.presentation?.audience??'产品团队'],core_message:statement,storyline:[{section_id:'sec-evidence',role:'evidence',question:'这些公开页面能直接支持什么？',answer:'保留页面原文、同维度对照及缺口'}],slides:slides.map((slide,index)=>({slide_id:slide.slide_id,sequence:index+1,section_id:'sec-evidence',purpose:slide.purpose,question:slide.title,key_message:slide.key_message,evidence_needed:slide.evidence.map(e=>e.evidence_id),analysis_method:'source-bounded synthesis',visualization_candidate:slide.visualization.type,dependencies:index?[slides[index-1].slide_id]:[]})),open_questions:gaps,renderer_entry_gate:{status:'ready',blockers:[]}};
  await fs.mkdir(out,{recursive:true});
  await Promise.all([
    fs.writeFile(path.join(out,'insights.json'),JSON.stringify([insight],null,2)),
    fs.writeFile(path.join(out,'deck-plan.json'),JSON.stringify(deck,null,2)),
    fs.writeFile(path.join(out,'slide-specs.json'),JSON.stringify(slides,null,2)),
    fs.writeFile(path.join(out,'visual-decisions.json'),JSON.stringify(slides.map(slide=>({slide_id:slide.slide_id,visualization:slide.visualization.type,layout_id:slide.layout.layout_id,reason:slide.visualization.reason,asset_ids:slide.assets.map(x=>x.asset_id)})),null,2)),
    fs.writeFile(path.join(out,'citations.json'),JSON.stringify(slides.map((slide,index)=>({slide:index+1,...citationsForSlide(slide,all,allSources)})),null,2)),
    fs.writeFile(path.join(out,'sources-appendix.md'),'# Sources Appendix\n'+allSources.map((source,index)=>`[${index+1}] ${source.title}. ${source.locator.uri} (accessed ${source.locator.accessed_at})`).join('\n')+'\n'+(visualManifest?'\n## Visual Sources (internal review only)\n'+visualMatch.used.map(match=>{const asset=visualManifest.assets.find(x=>x.asset_id===match.asset_id);return `- ${match.slide_id} ${match.entity} [${asset.asset_id}] ${asset.source.page_url}; reuse rights unverified`;}).join('\n')+'\n':'')),
  ]);
  return {deck,slides,insight,visualMatch,visualPlan};
}
