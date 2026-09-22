import { analyzeContentDensity } from "../layout/content-density.mjs";

const SAFE = { x: 120, y: 124, w: 900, h: 500 };
const LOCKED = [
  { id: "logo", x: 1030, y: 14, w: 242, h: 222 },
  { id: "page-number", x: 930, y: 660, w: 330, h: 50 },
];
const GENERIC_TITLE=/(?:官方页面证据|官方资料|research|研究证据|来源画面证据|材料证据\s*\d*)$/i;

export function runRuleBasedQa(models, slideSpecs, assetList=[]) {
  const issues = [],designer_metrics=[];
  models.forEach((model, index) => {
    const spec = slideSpecs[index];
    if (model.kind === "cover" || model.kind === "ending") return;
    if (!model.elements.length) add(issues, index, "EMPTY_SLIDE", "error", "Slide has no rendered content");

    if(!spec.visual_plan)add(issues,index,'VISUAL_PLAN_MISSING','error','Renderer input has no Visual Planner decision');
    else{
      if(!spec.visual_plan.visual_center)add(issues,index,'VISUAL_CENTER_MISSING','error','Every content slide needs a visual center');
      if(spec.visual_plan.status!=='ready')add(issues,index,'VISUAL_PLAN_BLOCKED','error',(spec.visual_plan.blockers??[]).join(', ')||'Visual plan is blocked');
      if(!spec.visual_plan.quality_precheck?.three_second_rule)add(issues,index,'THREE_SECOND_RULE','error','Primary message is not obvious within three seconds');
      for(const item of spec.visual_plan.screenshot_readability??[])if(!item.readable)add(issues,index,'SCREENSHOT_READABILITY_FAILED','error',`${item.asset_id}: ${item.reason}`);
    }
    if(spec.title_mode!=='conclusion'||GENERIC_TITLE.test(spec.title??''))add(issues,index,'ASSERTION_TITLE_MISSING','error','Evidence/content page title must state what was learned');
    if(!spec.key_message?.trim())add(issues,index,'PRIMARY_MESSAGE_MISSING','error','Slide has no primary message');

    const used=new Set();
    for(const ref of spec.assets??[]){
      if(ref.status!=='approved')continue;
      const asset=assetList.find(a=>a.asset_id===ref.asset_id);
      if(!asset){add(issues,index,'IMAGE_SOURCE_MISSING','error',`Asset ${ref.asset_id} missing from manifest`);continue;}
      if(asset.entity!==ref.entity)add(issues,index,'IMAGE_WRONG_ENTITY','error',`${ref.asset_id}: ${asset.entity} on ${ref.entity} slot`);
      if(!asset.source?.page_url)add(issues,index,'IMAGE_SOURCE_MISSING','error',`${ref.asset_id} has no source page`);
      if(ref.fit==='stretch')add(issues,index,'IMAGE_STRETCHED','error',`${ref.asset_id} stretched`);
      if(used.has(ref.asset_id))add(issues,index,'IMAGE_DUPLICATED','warning',`${ref.asset_id} repeated on slide`);used.add(ref.asset_id);
      if(asset.quality?.resolution==='low')add(issues,index,'IMAGE_LOW_RESOLUTION','error',`${ref.asset_id} low resolution`);
      if(!['human_verified_for_internal_use','source_and_slot_verified'].includes(asset.semantic_review))add(issues,index,'IMAGE_IRRELEVANT','error',`${ref.asset_id} semantic review missing`);
      if(asset.quality?.watermark===true)add(issues,index,'IMAGE_WATERMARK','warning',`${ref.asset_id} has watermark`);
    }
    const renderedImages=model.elements.filter(e=>e.type==='Image');
    for(const id of used)if(!renderedImages.some(image=>image.asset_id===id))add(issues,index,'IMAGE_NOT_RENDERED','error',`Asset ${id} not rendered`);
    if(spec.visualization?.type==='feature-table'&&!model.elements.some(e=>e.type==='Table'))add(issues,index,'TABLE_NOT_RENDERED','error','Slide plan requires an editable table');
    if(['bar-chart','line-chart'].includes(spec.visualization?.type)&&!model.elements.some(e=>e.type==='Chart'))add(issues,index,'CHART_NOT_RENDERED','error','Slide plan requires an editable chart');
    if(spec.visualization?.type==='image'&&!renderedImages.length)add(issues,index,'IMAGE_NOT_RENDERED','error','Slide plan requires a verified screenshot');
    if(spec.visual_requirement?.entities?.length){
      if(!renderedImages.length)add(issues,index,'REQUIRED_VISUAL_MISSING','error','Slide requested webpage screenshots but none were rendered');
      for(const entity of spec.visual_requirement.entities)if(!(spec.assets??[]).some(a=>a.status==='approved'&&a.entity===entity))add(issues,index,'VISUAL_ENTITY_MISSING','warning',`No verified screenshot available for ${entity}`);
    }

    const density = analyzeContentDensity(spec);
    if (density.level === "OVERFLOW") add(issues, index, "CONTENT_DENSITY", "error", `Density score ${density.score}`);
    if (!spec.sources?.length) add(issues, index, "MISSING_SOURCE", "warning", "No source label supplied");
    for (const el of model.elements) {
      if (el.minFontPt && el.minFontPt < 14 && el.role !== "source") add(issues, index, "FONT_TOO_SMALL", "error", `${el.type} uses ${el.minFontPt} pt`);
      if (!insideSlide(el.frame)) add(issues, index, "SHAPE_OVERFLOW", "error", `${el.type} exceeds slide bounds`);
      if (contentRole(el) && !inside(el.frame, SAFE)) add(issues, index, "SAFE_AREA_VIOLATION", "warning", `${el.type} exceeds content safe area`);
      for (const lock of LOCKED) if (contentRole(el) && overlaps(el.frame, lock)) add(issues, index, lock.id === "logo" ? "LOGO_COLLISION" : "PAGE_NUMBER_COLLISION", "error", `${el.type} collides with ${lock.id}`);
    }
    for (let a = 0; a < model.elements.length; a += 1) for (let b = a + 1; b < model.elements.length; b += 1) {
      const x = model.elements[a], y = model.elements[b];
      if (!x.allowOverlap && !y.allowOverlap && topLevel(x) && topLevel(y) && overlapArea(x.frame, y.frame) > 80) add(issues, index, "ELEMENT_OVERLAP", "warning", `${x.type} overlaps ${y.type}`);
    }

    const space=spaceUtilization(model.elements),weights=visualWeights(model.elements);
    designer_metrics.push({slide:index+1,space_utilization_score:space.score,occupied_area_ratio:space.occupied,center_of_gravity:space.center,unused_regions:space.unused_regions,visual_weights:weights});
    const hero=['Hero','Screenshot-led'].includes(spec.visual_plan?.recommended_composition);
    if(space.occupied<.45)add(issues,index,'BAD_SPACE_UTILIZATION','error',`Only ${Math.round(space.occupied*100)}% of effective area is used`);
    else if(space.occupied<.55&&!hero)add(issues,index,'SPACE_UTILIZATION_LOW','warning',`Effective area use is ${Math.round(space.occupied*100)}%; target is 55–80%`);
    if(space.occupied>.86&&!hero)add(issues,index,'SPACE_UTILIZATION_HIGH','warning',`Effective area use is ${Math.round(space.occupied*100)}%; hierarchy may feel crowded`);
    if(Math.abs(space.center.x-.5)>.28||Math.abs(space.center.y-.5)>.28)add(issues,index,'VISUAL_BALANCE','warning','Visual center of gravity is concentrated near one edge');
    if(renderedImages.length){
      const imageArea=renderedImages.reduce((sum,item)=>sum+clippedArea(item.frame,SAFE),0)/(SAFE.w*SAFE.h);
      if(imageArea<.20)add(issues,index,'SCREENSHOT_TOO_SMALL','error',`Screenshots occupy only ${Math.round(imageArea*100)}% of effective area`);
      const imageWeight=Math.max(...weights.filter(item=>item.type==='Image').map(item=>item.weight),0),supportWeight=Math.max(...weights.filter(item=>!['Image','Title'].includes(item.type)).map(item=>item.weight),0);
      if(supportWeight>imageWeight*1.15)add(issues,index,'VISUAL_WEIGHT_INVERTED','error','Supporting text is more visually dominant than the primary evidence');
    }
    if(weights.length>=2&&weights[0].weight<=weights[1].weight*1.08)add(issues,index,'VISUAL_HIERARCHY_FLAT','warning','The first and second visual weights are too similar; P1 > P2 is not clear');
  });
  return { generated_at: new Date().toISOString(), engine: "rule-based-qa-v2", checks: 20, summary: summarize(issues), designer_qa:{questions:['What is seen first, second and third?','Does the page have a focal point?','Is the main evidence readable?','Is whitespace intentional?','Is the conclusion obvious within three seconds?'],metrics:designer_metrics}, issues };
}

function add(issues, index, code, severity, message) { if (!issues.some((i) => i.slide === index + 1 && i.code === code && i.message === message)) issues.push({ slide: index + 1, code, severity, message }); }
function summarize(issues) { return { total: issues.length, errors: issues.filter((i) => i.severity === "error").length, warnings: issues.filter((i) => i.severity === "warning").length, passed: issues.every((i) => i.severity !== "error") }; }
function inside(f, p) { return f.x >= p.x && f.y >= p.y && f.x + f.w <= p.x + p.w && f.y + f.h <= p.y + p.h; }
function insideSlide(f) { return inside(f, { x: 0, y: 0, w: 1280, h: 720 }); }
function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function overlapArea(a, b) { if (!overlaps(a, b)) return 0; return Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)); }
function clippedArea(frame,bounds){const x0=Math.max(frame.x,bounds.x),y0=Math.max(frame.y,bounds.y),x1=Math.min(frame.x+frame.w,bounds.x+bounds.w),y1=Math.min(frame.y+frame.h,bounds.y+bounds.h);return Math.max(0,x1-x0)*Math.max(0,y1-y0);}
function contentRole(e) { return !["Title", "Source", "Divider"].includes(e.type); }
function topLevel(e) { return ["Insight", "Card", "BigNumber", "Chart", "Table", "VizNode", "Text", "Image", "Panel", "Label"].includes(e.type); }
function spaceUtilization(elements){
  const active=elements.filter(topLevel),cols=30,rows=18,cells=new Set();let sx=0,sy=0,total=0;
  for(const item of active){const frame=item.frame,x0=Math.max(SAFE.x,frame.x),y0=Math.max(SAFE.y,frame.y),x1=Math.min(SAFE.x+SAFE.w,frame.x+frame.w),y1=Math.min(SAFE.y+SAFE.h,frame.y+frame.h);if(x1<=x0||y1<=y0)continue;const area=(x1-x0)*(y1-y0);sx+=((x0+x1)/2-SAFE.x)/SAFE.w*area;sy+=((y0+y1)/2-SAFE.y)/SAFE.h*area;total+=area;for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const cx=SAFE.x+(col+.5)*SAFE.w/cols,cy=SAFE.y+(row+.5)*SAFE.h/rows;if(cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1)cells.add(`${row}:${col}`);}}
  const occupied=cells.size/(cols*rows),center=total?{x:Number((sx/total).toFixed(3)),y:Number((sy/total).toFixed(3))}:{x:.5,y:.5};
  const unused_regions=[];for(const [name,test] of [['top-left',(r,c)=>r<rows/2&&c<cols/2],['top-right',(r,c)=>r<rows/2&&c>=cols/2],['bottom-left',(r,c)=>r>=rows/2&&c<cols/2],['bottom-right',(r,c)=>r>=rows/2&&c>=cols/2]]){let used=0,count=0;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(test(r,c)){count++;if(cells.has(`${r}:${c}`))used++;}if(used/count<.2)unused_regions.push(name);}
  const balancePenalty=Math.min(.25,Math.abs(center.x-.5)+Math.abs(center.y-.5));return {occupied,center,unused_regions,score:Math.max(0,Math.min(100,Math.round(occupied*100-balancePenalty*35)))};
}
function visualWeights(elements){
  const factors={Image:1.45,Chart:1.4,Table:1.3,BigNumber:1.35,Insight:1.18,Card:1,Text:.9,Label:.72,Panel:.18};
  return elements.filter(topLevel).map(item=>{const area=clippedArea(item.frame,SAFE)/(SAFE.w*SAFE.h),font=(item.minFontPt??14)/30,weight=area*(factors[item.type]??1)+font*.08+(item.type==='Image'?.08:0);return {type:item.type,role:item.role,weight:Number(weight.toFixed(3)),frame:item.frame};}).sort((a,b)=>b.weight-a.weight);
}
