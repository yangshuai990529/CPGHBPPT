export function planVisualResearch(dataset) {
  const brands=dataset.research_plan?.brief?.brands??[];
  const slots=brands.flatMap(brand=>[
    {id:`S05:${brand}:product`,slide_id:'s05',entity:brand,asset_type:'product_image',priority:'high',purpose:'competitor_product_context',supporting_evidence:dataset.evidence.filter(e=>e.entity===brand).map(e=>e.evidence_id),required:true},
    {id:`S05:${brand}:feature`,slide_id:'s05',entity:brand,asset_type:'feature_image',priority:'medium',purpose:'picture_capability_explanation',supporting_evidence:dataset.evidence.filter(e=>e.entity===brand&&/AI Picture|AI Processing/.test(e.capability)).map(e=>e.evidence_id),required:true},
    {id:`S05:${brand}:screenshot`,slide_id:'s05',entity:brand,asset_type:'feature_screenshot',priority:'medium',purpose:'official_feature_section',supporting_evidence:dataset.evidence.filter(e=>e.entity===brand).map(e=>e.evidence_id),required:true},
  ]);
  return {generated_at:new Date().toISOString(),research_question_ids:dataset.research_plan?.questions?.filter(x=>x.type==='competitor').map(x=>x.id)??[],slots,stop_conditions:{max_candidates_per_source:24,max_downloads_per_brand:4,max_screenshots_per_brand:1,no_new_limit:2},notes:['The slots are visual research needs, not proof of image relevance.','A missing slot remains missing rather than generating a decorative visual.']};
}
