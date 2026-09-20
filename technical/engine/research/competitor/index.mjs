import { CAPABILITIES } from '../planner/index.mjs';
export function competitorMatrix(brands,claims) {
  const observed=[...new Set(claims.map(x=>x.capability).filter(Boolean))],capabilities=observed.length?observed:CAPABILITIES;
  return {legend:{'✓':'supported by evidence','?':'no reliable evidence; not equivalent to absence','!':'conflict'},rows:capabilities.map(capability=>({capability,cells:Object.fromEntries(brands.map(brand=>{
    const cs=claims.filter(c=>c.entity===brand&&c.capability===capability);
    const valid=cs.filter(c=>c.status==='SUPPORTED');
    return [brand,{value:cs.some(c=>c.status==='CONFLICTED')?'!':valid.length?'✓':'?',claim_ids:valid.map(c=>c.claim_id),evidence_ids:valid.flatMap(c=>c.evidence_ids)}];
  }))}))};
}
export function coverage(brands,claims,required) {
  const rows=brands.map(brand=>{const keys=required.filter(k=>k.startsWith(brand+':'));const found=keys.filter(k=>claims.some(c=>c.entity===brand&&c.capability===k.slice(brand.length+1)&&c.status==='SUPPORTED'));return {brand,required:keys.length,found:found.length,coverage:keys.length?found.length/keys.length:0,gaps:keys.filter(x=>!found.includes(x))};});
  return {rows,overall:{required:rows.reduce((n,x)=>n+x.required,0),found:rows.reduce((n,x)=>n+x.found,0)}};
}
