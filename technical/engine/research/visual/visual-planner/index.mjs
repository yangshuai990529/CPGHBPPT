export function planVisualResearch(dataset) {
  const brands=dataset.research_plan?.brief?.brands??[];
  const slots=brands.filter(brand=>dataset.evidence.some(e=>e.entity===brand)).map((brand,index)=>({id:`BRAND:${brand}:visual`,slide_id:`s${String(index+4).padStart(2,'0')}`,entity:brand,asset_type:'product_image',priority:'medium',purpose:'show_original_product_or_feature_context_when_relevant',supporting_evidence:dataset.evidence.filter(e=>e.entity===brand).map(e=>e.evidence_id),required:false}));
  return {generated_at:new Date().toISOString(),research_question_ids:dataset.research_plan?.questions?.filter(x=>x.type==='competitor').map(x=>x.id)??[],slots,stop_conditions:{max_candidates_per_source:24,max_downloads_per_brand:4,max_screenshots_per_brand:1,no_new_limit:2},notes:['The slots are visual research needs, not proof of image relevance.','A missing slot remains missing rather than generating a decorative visual.']};
}
