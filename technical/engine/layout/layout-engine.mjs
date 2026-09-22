const SAFE={x:120,y:124,w:900,h:500};
const layouts={
  L22_HERO_EVIDENCE:{screenshot:{x:135,y:150,w:870,h:360},highlight:{x:120,y:548,w:900,h:62}},
  L23_EVIDENCE_INSIGHT:{screenshot_panel:{x:120,y:137,w:510,h:350},screenshot:{x:130,y:147,w:490,h:330},findings:{x:658,y:145,w:350,h:300},product_insight:{x:120,y:510,w:900,h:100}},
  L24_EVIDENCE_GRID:{grid:{x:120,y:145,w:900,h:450,columns:2,gap:18}},
  L25_MULTI_SOURCE_EVIDENCE:{columns:{x:120,y:142,w:900,h:399,columns:3,gap:16},insight:{x:120,y:557,w:900,h:53}},
  L02_HERO_INSIGHT:{primary_message:{x:120,y:145,w:900,h:125},body:{x:120,y:290,w:900,h:285}},
  L10_COMPARISON_TABLE:{table:{x:120,y:155,w:900,h:420},insight:{x:120,y:585,w:900,h:38}},
  L11_CHART_INSIGHT:{chart:{x:120,y:150,w:610,h:420},insight:{x:752,y:156,w:268,h:220},number:{x:752,y:414,w:268,h:146}},
  L07_IMAGE_TEXT:{image:{x:120,y:145,w:470,h:430},insight:{x:620,y:145,w:400,h:90},body:{x:620,y:255,w:400,h:300}},
  L01_TITLE_TEXT:{body:{x:120,y:150,w:900,h:430}},
  L20_EXECUTIVE_SUMMARY:{headline:{x:120,y:138,w:900,h:88},findings:{x:120,y:264,w:900,h:242},decision:{x:120,y:540,w:900,h:76}},
  L21_COMPETITOR_VISUAL_3COL:{columns:{x:120,y:145,w:900,h:413,columns:3,gap:16},insight:{x:120,y:574,w:900,h:50}},
  L08_COMPETITOR_3COL:{columns:{x:120,y:145,w:900,h:413,columns:3,gap:16},insight:{x:120,y:574,w:900,h:50}},
  L09_COMPETITOR_4COL:{columns:{x:120,y:145,w:900,h:413,columns:4,gap:16},insight:{x:120,y:574,w:900,h:50}},
  L17_USER_JOURNEY:{stages:{x:120,y:160,w:900,h:385,columns:4,gap:16},insight:{x:120,y:575,w:900,h:49}},
  L15_STRATEGY_HOUSE:{goal:{x:140,y:140,w:880,h:75},pillars:{x:140,y:245,w:880,h:260,columns:3,gap:18},foundation:{x:140,y:540,w:880,h:66}},
  L16_ARCHITECTURE:{layers:{x:135,y:145,w:870,h:430,rows:4,gap:18}},
  L19_ROADMAP:{phases:{x:120,y:155,w:900,h:395,columns:3,gap:17},insight:{x:120,y:575,w:900,h:49}},
};

export function planDeckLayouts(slides){
  const planned=structuredClone(slides),blockers=[];
  for(const slide of planned){
    if(['cover','ending','section'].includes(slide.slide_type)){slide.layout_plan={layout_id:slide.layout.layout_id,safe_area:null,regions:{},status:'ready'};continue;}
    const regions=layouts[slide.layout?.layout_id];
    if(!regions){blockers.push({slide_id:slide.slide_id,code:'LAYOUT_PLAN_UNSUPPORTED',layout_id:slide.layout?.layout_id});slide.layout_plan={layout_id:slide.layout?.layout_id,safe_area:SAFE,regions:{},status:'blocked'};continue;}
    slide.layout_plan={layout_id:slide.layout.layout_id,safe_area:SAFE,regions,space_utilization_target:{minimum:.55,maximum:.80,hard_floor:.45},status:'ready'};
  }
  return {slides:planned,plans:planned.map(slide=>({slide_id:slide.slide_id,...slide.layout_plan})),gate:{status:blockers.length?'blocked':'ready',blockers}};
}

export function validateLayoutPlans(slides){
  const blockers=[];for(const slide of slides){if(['cover','ending','section'].includes(slide.slide_type))continue;if(!slide.layout_plan||slide.layout_plan.status!=='ready')blockers.push({slide_id:slide.slide_id,code:'LAYOUT_PLAN_MISSING_OR_BLOCKED'});}
  return {status:blockers.length?'blocked':'ready',blockers};
}
