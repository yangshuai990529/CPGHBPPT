import fs from 'node:fs/promises'; import path from 'node:path';
import {planResearch} from './planner/index.mjs'; import {authority,rankSources,freshness} from './source/index.mjs';
import {HttpBrowserProvider} from './browser/index.mjs';import {extract,claimFromProbe,detectConflicts,digest} from './evidence/index.mjs';
import {competitorMatrix,coverage} from './competitor/index.mjs';import {ResearchCache} from './cache/index.mjs';import {summarize} from './synthesis/index.mjs';import {reasoningContext} from '../context/index.mjs';import {HttpAssetProvider} from './assets/index.mjs';
const write=(p,data)=>fs.writeFile(p,JSON.stringify(data,null,2)+'\n');
export async function runResearch({brief,deckPlan,outputDir,browser=new HttpBrowserProvider(),search,assets=[],cacheDir,now=()=>new Date()}) {
  const dir=path.join(outputDir,'research');await fs.mkdir(dir,{recursive:true});await fs.mkdir(path.join(dir,'assets'),{recursive:true});await fs.mkdir(path.join(dir,'screenshots'),{recursive:true});
  const cache=new ResearchCache(cacheDir??path.join(outputDir,'../../cache/research'));const plan=planResearch(brief,deckPlan);const logs=[]; const log=(event,detail)=>logs.push({at:now().toISOString(),event,detail});
  const sources=[], evidence=[],claims=[],issues=[];let noNew=0,requests=0;const candidates=[...(brief.sources??[])];
  if(!candidates.length&&search)for(const brand of brief.brands){let discovered=await search.search(`${brand} official AI Picture TV`);candidates.push(...discovered.map(x=>({brand,url:x.url,title:x.title})));}
  const ranked=rankSources(candidates.map(x=>({...x,authority_level:authority(x.url)})),'product');
  for(const [i,candidate] of ranked.entries()) {
    if(sources.length>=plan.stop_conditions.max_sources||requests>=plan.stop_conditions.max_requests||noNew>=plan.stop_conditions.max_no_new) {log('stop','budget or no-new limit reached');break;}
    const source_id=`src-research-${String(i+1).padStart(3,'0')}`;requests++;
    try {const cached=await cache.get(candidate.url,freshness('product'));const page=cached?.page??await browser.open(candidate.url);if(!cached)await cache.put(candidate.url,{page:{url:page.url,title:page.title,text:page.text}});const source={source_id,title:page.title||candidate.title||candidate.url,source_type:'external_primary',locator:{uri:page.url,accessed_at:now().toISOString()},status:'verified',publisher:candidate.brand,published_at:null,scope:candidate.product??null,supports:[],limitations:['Feature claim only; availability can vary by model, region and date.'],license_or_usage:null,content_hash:digest(page.text),authority_level:authority(page.url),origin:'external',language:null,region:candidate.region??'US',relevance:'official product information',notes:cached?'cache hit':'live fetch'};
      if(source.authority_level!=='A'){source.source_type='external_secondary';source.status='unverified';}
      sources.push(source); let added=0;
      for(const probe of candidate.probes??[]) {const idx=claims.length+1;const ev=extract(page,source,probe,idx);const claim=claimFromProbe(probe,ev,idx);claims.push(claim); if(ev){ evidence.push(ev);source.supports.push(ev.evidence_id);added++;}else log('probe_not_found',{url:page.url,needle:probe.needle});}
      noNew=added?0:noNew+1;log('source_read',{url:page.url,source_id,cached:!!cached,evidence_added:added});
    } catch(e){issues.push({url:candidate.url,error:e.message});noNew++;log('source_failed',{url:candidate.url,error:e.message});}
  }
  const assetManifest=[...assets];for(const target of brief.asset_targets??[]){try {const parent=sources.find(x=>x.locator.uri===target.page_url);if(!parent||parent.authority_level!=='A')throw new Error('Official parent source not verified');const page=await browser.open(parent.locator.uri);if(!page.html?.includes(target.url))throw new Error('Asset URL not referenced by verified official page');const a=await new HttpAssetProvider().download({url:target.url,source_id:parent.source_id,brand:target.brand,product:target.product??'',usage:target.usage??''},path.join(dir,'assets'),assetManifest);assetManifest.push(a);
      const idx=claims.length+1;const rawOffset=page.html.indexOf(target.url);
      const e={evidence_id:`E${String(idx).padStart(3,'0')}`,claim_id:`C${String(idx).padStart(3,'0')}`,source_id:parent.source_id,quote_or_fact:target.url,context:'Image URL referenced in verified official page HTML; usage rights pending review.',entity:target.brand,capability:'Official Product Assets',market:parent.region??'',date:parent.published_at??'',confidence:'high',verified:true,community_evidence:false,content_hash:digest(page.html),offset:rawOffset};
      evidence.push(e);parent.supports.push(e.evidence_id);
      claims.push({claim_id:e.claim_id,statement:`${target.brand} official page references a product visual asset (reuse rights unverified).`,entity:target.brand,capability:e.capability,evidence_ids:[e.evidence_id],status:'SUPPORTED',scope:target.product??''});
      log('asset_downloaded',{asset_id:a.asset_id,status:a.status,url:a.source_url});}catch(e){issues.push({url:target.url,error:e.message});log('asset_failed',{url:target.url,error:e.message});}}
  const conflicts=detectConflicts(claims,evidence), cov=coverage(brief.brands,claims,plan.required_evidence),matrix=competitorMatrix(brief.brands,claims);
  const dataset={research_plan:plan,sources,evidence,claims,conflicts,coverage:cov,competitor_matrix:matrix,assets:assetManifest,issues};
  for(const [name,value] of Object.entries({'research-plan':plan,sources,claims,evidence,competitors:matrix,'market-data':[],assets:assetManifest,coverage:cov,conflicts,'research-dataset':dataset,'product-reasoning-context':reasoningContext(dataset),issues}))await write(path.join(dir,name+'.json'),value);
  await fs.writeFile(path.join(dir,'research-summary.md'),summarize(dataset));await fs.writeFile(path.join(dir,'research-log.jsonl'),logs.map(l=>JSON.stringify(l)).join('\n')+'\n');return dataset;
}
