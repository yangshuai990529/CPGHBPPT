import { createHash } from 'node:crypto';
export const digest=x=>createHash('sha256').update(x).digest('hex');
export function extract(page,source,probe,index) {
  // Only exact substrings found in fetched body become evidence; no model interpretation.
  const needle=probe.needle.trim(); if(!needle) return null;
  const at=page.text.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase()); if(at<0) return null;
  const quote=page.text.slice(at,at+needle.length); const context=page.text.slice(Math.max(0,at-90),Math.min(page.text.length,at+needle.length+120));
  return {evidence_id:`E${String(index).padStart(3,'0')}`,claim_id:`C${String(index).padStart(3,'0')}`,source_id:source.source_id,quote_or_fact:quote,context,entity:probe.brand,capability:probe.capability,market:probe.market??source.region??'',date:source.published_at??'',confidence:source.authority_level==='A'?'high':'low',verified:true,community_evidence:source.authority_level==='D',content_hash:digest(page.text),offset:at};
}
export function claimFromProbe(probe,evidence,index) { return {claim_id:`C${String(index).padStart(3,'0')}`,statement:probe.statement,entity:probe.brand,capability:probe.capability,evidence_ids:evidence?[evidence.evidence_id]:[],status:!evidence?'UNSUPPORTED':evidence.confidence==='high'?'SUPPORTED':'LOW_CONFIDENCE',scope:probe.scope??''}; }
export function detectConflicts(claims,evidence) {
  const groups=new Map(); for(const c of claims.filter(c=>c.status==='SUPPORTED')) {const key=`${c.entity}:${c.capability}:${c.scope}`; groups.set(key,[...(groups.get(key)??[]),c]);}
  const conflicts=[]; for(const [key,cs] of groups) {const numbers=cs.map(c=>c.statement.match(/\b\d[\d,.]*\s*(?:nits|hz|usd|%)/i)?.[0]?.toLowerCase()).filter(Boolean); if(new Set(numbers).size>1) {cs.forEach(c=>c.status='CONFLICTED'); conflicts.push({key,claim_ids:cs.map(c=>c.claim_id),evidence_ids:cs.flatMap(c=>c.evidence_ids),check:['model','region','test_conditions','publisher','published_at'],status:'CONFLICTED_EVIDENCE'});}}
  return conflicts;
}
