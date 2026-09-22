export function requestedSlideCount(config){
  const explicit=config.presentation?.slide_count??config.presentation?.slides;
  const inBrief=String(config.presentation?.brief??'').match(/(?:^|\D)(\d{1,2})\s*页(?:PPT|幻灯片|演示)?/i);
  const value=explicit??inBrief?.[1];
  if(value==null)return null;
  const count=Number(value);
  if(!Number.isInteger(count)||count<3||count>30)throw new Error('页数必须是 3–30 页，包含封面和封底。');
  return count;
}

export function selectContentSlides(candidates,requested){
  if(requested==null)return candidates;
  const needed=requested-2;
  if(needed>candidates.length)throw new Error(`材料只支持 ${candidates.length+2} 页有内容的演示（含封面封底），无法凭空填满 ${requested} 页。请补充材料或降低页数。`);
  return candidates.slice(0,needed);
}
