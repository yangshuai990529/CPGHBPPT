const SAFE_AREA={x:120,y:124,w:900,h:500};
const GENERIC_TITLE=/^(?:.+\s)?(?:官方页面证据|官方资料|research|研究证据|来源画面证据|材料证据\s*\d*)$/i;
const COMPOSITIONS=new Set(['Hero','Split','Asymmetric Split','Grid','Comparison','Chart-led','Screenshot-led','Diagram-led','Number-led','Statement-led']);

const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const uniq=values=>[...new Set(values.filter(Boolean))];
const truncate=(value,max=92)=>{const text=clean(value);return text.length>max?`${text.slice(0,max-1)}…`:text;};

function grams(value){
  const text=clean(value).toLowerCase().replace(/[^a-z0-9\p{L}]+/gu,'');
  if(text.length<2)return new Set(text?[text]:[]);
  return new Set([...Array(text.length-1)].map((_,index)=>text.slice(index,index+2)));
}

export function semanticSimilarity(a,b){
  const left=grams(a),right=grams(b);if(!left.size||!right.size)return 0;
  let overlap=0;for(const token of left)if(right.has(token))overlap++;
  return 2*overlap/(left.size+right.size);
}

export function deduplicateEvidence(evidence=[],threshold=.85){
  const kept=[],removed=[],mergeGroups=[];
  for(const item of evidence){
    const duplicate=kept.find(previous=>semanticSimilarity(previous.claim,item.claim)>=threshold);
    if(duplicate){removed.push(item.evidence_id);let group=mergeGroups.find(row=>row.into===duplicate.evidence_id);if(!group){group={into:duplicate.evidence_id,from:[]};mergeGroups.push(group);}group.from.push(item.evidence_id);}
    else kept.push(item);
  }
  return {kept,removed,mergeGroups};
}

export function compressResearchText(value,max=92){
  let text=clean(value)
    .replace(/\b(?:according to|the official page (?:states|describes|says) that|the company describes)\b/gi,'')
    .replace(/\bauto-adjusts?\b/gi,'自动调整')
    .replace(/\bautomatically optimizes?\b/gi,'自动优化')
    .replace(/\bbased on your preferences?\b/gi,'根据用户偏好')
    .replace(/\bcolor and contrast\b/gi,'色彩与对比度')
    .replace(/\beach scene\b/gi,'不同场景')
    .replace(/\s+([,.;:])/g,'$1');
  return truncate(text,max);
}

function expectedImageFrames(composition,count){
  if(composition==='Hero')return [{x:120,y:150,w:900,h:360}];
  if(composition==='Screenshot-led'||composition==='Asymmetric Split')return [{x:130,y:147,w:490,h:330}];
  if(composition==='Split')return [{x:120,y:145,w:470,h:385}];
  if(composition==='Grid'){
    const cols=2,rows=Math.ceil(Math.min(count,6)/2),gap=16,w=(900-gap)/2,h=Math.min(190,(380-gap*(rows-1))/rows);
    return [...Array(Math.min(count,6))].map((_,index)=>({x:120+(index%cols)*(w+gap),y:145+Math.floor(index/cols)*(h+gap),w,h}));
  }
  if(composition==='Comparison'){
    const visible=Math.min(count,3),gap=16,w=(900-gap*(visible-1))/visible;
    return [...Array(visible)].map((_,index)=>({x:120+index*(w+gap),y:178,w,h:210}));
  }
  return [];
}

export function assessScreenshotReadability(asset,frame,{totalScreenshotArea=0,assetCount=1}={}){
  const sourceWidth=Number(asset?.width??0),sourceHeight=Number(asset?.height??0);
  const frameWidth=Number(frame?.w??0),frameHeight=Number(frame?.h??0);
  const scaleFactor=Math.min(frameWidth/Math.max(sourceWidth,1),frameHeight/Math.max(sourceHeight,1));
  const displayWidth=sourceWidth*scaleFactor,displayHeight=sourceHeight*scaleFactor;
  const displayAreaRatio=(displayWidth*displayHeight)/(SAFE_AREA.w*SAFE_AREA.h);
  const totalAreaRatio=assetCount>1?Math.min(1,(totalScreenshotArea/(SAFE_AREA.w*SAFE_AREA.h))*(displayWidth*displayHeight/Math.max(frameWidth*frameHeight,1))):displayAreaRatio;
  const compact=assetCount>1;
  const enoughArea=compact?totalAreaRatio>=.20:displayAreaRatio>=.20;
  const enoughDimensions=compact?(displayWidth>=240&&displayHeight>=150):(displayWidth>=360&&displayHeight>=210);
  const validSource=sourceWidth>=640&&sourceHeight>=320&&asset?.source?.element!=='viewport_fallback';
  const readable=enoughArea&&enoughDimensions&&validSource&&scaleFactor>=.22;
  const action=readable?'use':!validSource?'replace':displayAreaRatio<.20&&!compact?'crop':'extract_text_plus_screenshot';
  return {screenshot_display_width:Math.round(displayWidth),screenshot_display_height:Math.round(displayHeight),source_resolution:{width:sourceWidth,height:sourceHeight},scale_factor:Number(scaleFactor.toFixed(3)),display_area_ratio:Number(displayAreaRatio.toFixed(3)),total_screenshot_area_ratio:Number(totalAreaRatio.toFixed(3)),readable,action,reason:readable?'截图在目标构图中具备可读面积。':action==='replace'?'来源分辨率或截图定位不合格。':action==='crop'?'截图占有效内容区域不足 20%，必须重新裁切放大。':'多来源页需以局部截图配合提炼文字，不能依赖截图内小字。'};
}

function selectComposition(spec,assets){
  const type=spec.visualization?.type,entities=uniq(assets.map(asset=>asset.entity));
  if(['bar-chart','line-chart','radar'].includes(type))return 'Chart-led';
  if(type==='big-number')return 'Number-led';
  if(['architecture','journey-map','roadmap','timeline','strategy-house','funnel','pyramid','matrix-2x2'].includes(type))return 'Diagram-led';
  if(type==='feature-table'||type==='comparison-matrix')return 'Comparison';
  if(assets.length>=2&&entities.length>=2)return 'Comparison';
  if(assets.length>=2)return 'Grid';
  if(assets.length===1&&((spec.content?.structured_data?.evidence_items?.length??0)>=2||(spec.content?.analysis?.length??0)>=2))return 'Asymmetric Split';
  if(assets.length===1&&spec.evidence?.length<=1)return 'Hero';
  if(assets.length===1)return 'Asymmetric Split';
  if((spec.content?.analysis?.length??0)>=2)return 'Split';
  return 'Statement-led';
}

function layoutFor(spec,composition){
  if(composition==='Hero'&&spec.assets?.length)return 'L22_HERO_EVIDENCE';
  if(['Asymmetric Split','Screenshot-led'].includes(composition)&&spec.assets?.length)return 'L23_EVIDENCE_INSIGHT';
  if(composition==='Grid'&&spec.assets?.length)return 'L24_EVIDENCE_GRID';
  if(composition==='Comparison'&&(spec.assets?.length??0)>=2)return 'L25_MULTI_SOURCE_EVIDENCE';
  return spec.layout?.layout_id;
}

function informationHierarchy(spec,composition){
  const items=[{priority:'P1',role:'primary_message',content:spec.key_message||spec.title}];
  if(spec.assets?.length)items.push({priority:'P2',role:'evidence',content:spec.assets.map(asset=>asset.asset_id).join(', ')});
  else if(spec.visualization?.type&&!['none','text'].includes(spec.visualization.type))items.push({priority:'P2',role:'visual',content:spec.visualization.type});
  const supporting=spec.content?.analysis?.slice(0,3)??[];
  if(supporting.length)items.push({priority:'P3',role:'supporting_points',content:supporting.map(value=>compressResearchText(value,72))});
  if(spec.content?.implication)items.push({priority:'P3',role:'product_insight',content:truncate(spec.content.implication,110)});
  return items;
}

function visualCenter(spec,composition){
  if(spec.assets?.length)return {type:'Product Screenshot',asset_id:spec.assets[0].asset_id};
  if(['bar-chart','line-chart','radar'].includes(spec.visualization?.type))return {type:'Chart'};
  if(spec.visualization?.type==='big-number')return {type:'Key Number'};
  if(spec.visualization?.type==='feature-table'||spec.visualization?.type==='comparison-matrix')return {type:'Comparison'};
  if(['architecture','journey-map','roadmap','timeline','strategy-house','funnel','pyramid','matrix-2x2'].includes(spec.visualization?.type))return {type:'Diagram'};
  if(clean(spec.key_message||spec.title))return {type:'Core Statement'};
  return null;
}

function planSlide(spec,assetManifest){
  const duplicate=deduplicateEvidence(spec.evidence??[]);
  spec.evidence=duplicate.kept;
  if(Array.isArray(spec.content?.analysis))spec.content.analysis=uniq(spec.content.analysis.map(value=>compressResearchText(value))).slice(0,3);
  if(spec.content?.structured_data?.body)spec.content.structured_data.body=spec.content.analysis.length?spec.content.analysis.join('\n\n'):compressResearchText(spec.content.structured_data.body,260);
  if((spec.title_mode!=='conclusion'||GENERIC_TITLE.test(clean(spec.title)))&&clean(spec.key_message)){
    spec.notes=[...(spec.notes??[]),`Visual Planner 将分类标题“${spec.title}”改为结论标题。`];
    spec.title=truncate(spec.key_message,62);spec.title_mode='conclusion';
  }
  const assets=(spec.assets??[]).filter(asset=>asset.status==='approved');
  let composition=selectComposition(spec,assets);
  const center=visualCenter(spec,composition);
  const frames=expectedImageFrames(composition,assets.length);
  const totalScreenshotArea=frames.reduce((sum,frame)=>sum+frame.w*frame.h,0);
  const screenshotReadability=assets.map((ref,index)=>{
    const asset=assetManifest.find(candidate=>candidate.asset_id===ref.asset_id);
    return {asset_id:ref.asset_id,...assessScreenshotReadability(asset,frames[index]??frames[0],{totalScreenshotArea,assetCount:assets.length})};
  });
  const blocked=[];
  if(!center)blocked.push('VISUAL_CENTER_MISSING');
  if(assets.length&&screenshotReadability.some(item=>!item.readable))blocked.push('SCREENSHOT_READABILITY_FAILED');
  const hierarchy=informationHierarchy(spec,composition);
  const plan={
    primary_message:clean(spec.key_message||spec.title),
    visual_center:center,
    primary_asset:assets[0]?.asset_id??null,
    secondary_assets:assets.slice(1).map(asset=>asset.asset_id),
    information_hierarchy:hierarchy,
    recommended_composition:composition,
    content_to_remove:duplicate.removed,
    content_to_merge:duplicate.mergeGroups,
    content_to_visualize:spec.content?.analysis?.slice(0,3)??[],
    image_crop_strategy:assets.length?(composition==='Comparison'||composition==='Grid'?'tight_crop_per_evidence_region':'crop_to_verified_evidence_region'):'none',
    reading_order:['assertion_title',center?.type??'visual_center',...(spec.content?.analysis?.length?['supporting_findings']:[]),...(spec.content?.implication?['product_insight']:[]),'source'],
    design_rationale:`以“${center?.type??'无视觉中心'}”作为第一视觉落点，采用 ${composition} 构图；原始证据先去重、压缩和分组，再进入版面。`,
    screenshot_readability:screenshotReadability,
    quality_precheck:{three_second_rule:!!clean(spec.key_message||spec.title),has_focal_point:!!center,whitespace_intentional:true,grouping_clear:hierarchy.length>=1},
    status:blocked.length?'blocked':'ready',
    blockers:blocked,
  };
  if(!COMPOSITIONS.has(plan.recommended_composition))plan.blockers.push('UNKNOWN_COMPOSITION');
  spec.visual_plan=plan;
  const layout=layoutFor(spec,composition);
  if(layout){spec.layout.layout_id=layout;spec.layout.preferred=layout;spec.layout.reason=plan.design_rationale;}
  spec.title_mode=spec.slide_type==='cover'||spec.slide_type==='section'?'topic':'conclusion';
  spec.status=plan.status==='ready'?'ready_for_renderer':'draft';
  return spec;
}

function diversifyCompositions(slides){
  let last=null,run=0;
  for(const spec of slides){
    if(['cover','ending','section'].includes(spec.slide_type))continue;
    const composition=spec.visual_plan?.recommended_composition;
    if(composition===last)run++;else{last=composition;run=1;}
    if(run<3||composition==='Comparison')continue;
    const alternative=composition==='Split'?'Asymmetric Split':composition==='Statement-led'?'Split':null;
    if(!alternative)continue;
    spec.visual_plan.recommended_composition=alternative;
    spec.visual_plan.design_rationale+=` 为避免连续三页相同构图，本页切换为 ${alternative}。`;
    run=1;last=alternative;
  }
}

export function validateVisualPlans(slides,assetManifest=[]){
  const blockers=[];
  for(const spec of slides){
    if(['cover','ending','section'].includes(spec.slide_type))continue;
    const plan=spec.visual_plan;
    if(!plan)blockers.push({slide_id:spec.slide_id,code:'VISUAL_PLAN_MISSING'});
    else for(const code of plan.blockers??[])blockers.push({slide_id:spec.slide_id,code});
    if(spec.title_mode!=='conclusion')blockers.push({slide_id:spec.slide_id,code:'ASSERTION_TITLE_MISSING'});
    if((spec.assets??[]).some(ref=>ref.status==='approved'&&!assetManifest.some(asset=>asset.asset_id===ref.asset_id)))blockers.push({slide_id:spec.slide_id,code:'ASSET_MANIFEST_MISSING'});
  }
  return {status:blockers.length?'blocked':'ready',blockers};
}

export function planDeckVisuals(slides,{assets=[]}={}){
  const planned=structuredClone(slides).map(spec=>['cover','ending','section'].includes(spec.slide_type)?{...spec,visual_plan:{primary_message:clean(spec.key_message||spec.title),visual_center:{type:'Corporate Master'},primary_asset:null,secondary_assets:[],information_hierarchy:[{priority:'P1',role:'title',content:spec.title}],recommended_composition:'Statement-led',content_to_remove:[],content_to_merge:[],content_to_visualize:[],image_crop_strategy:'none',reading_order:['title'],design_rationale:'封面、章节页或封底使用企业母版作为视觉中心。',screenshot_readability:[],quality_precheck:{three_second_rule:true,has_focal_point:true,whitespace_intentional:true,grouping_clear:true},status:'ready',blockers:[]}}:planSlide(spec,assets));
  diversifyCompositions(planned);
  const gate=validateVisualPlans(planned,assets);
  return {slides:planned,plans:planned.map(({slide_id,visual_plan})=>({slide_id,...visual_plan})),gate};
}
