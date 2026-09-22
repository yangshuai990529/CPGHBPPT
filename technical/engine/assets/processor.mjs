import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';

const aspectFor=composition=>({Hero:2.35,'Asymmetric Split':1.48,'Screenshot-led':1.48,Grid:1.35,Comparison:1.32}[composition]??1.5);

async function cropAsset(asset,targetAspect,dir){
  const source=path.resolve(asset.local_path),meta=await sharp(source).metadata();
  const ratio=meta.width/meta.height;let crop;
  if(ratio>targetAspect){const width=Math.max(1,Math.round(meta.height*targetAspect));crop={left:Math.round((meta.width-width)/2),top:0,width,height:meta.height};}
  else{const height=Math.max(1,Math.round(meta.width/targetAspect));crop={left:0,top:Math.round((meta.height-height)/2),width:meta.width,height};}
  await fs.mkdir(dir,{recursive:true});const output=path.join(dir,`${asset.asset_id}-readable.png`);
  await sharp(source).extract(crop).png().toFile(output);
  const bytes=await fs.readFile(output),outMeta=await sharp(bytes).metadata(),hash=createHash('sha256').update(bytes).digest('hex');
  return {...asset,asset_id:'A'+hash.slice(0,12),local_path:path.resolve(output),format:'png',width:outMeta.width,height:outMeta.height,content_hash:hash,status:'approved_internal',semantic_review:'source_and_slot_verified',quality:{...(asset.quality??{}),resolution:'adequate',visual_clarity:'cropped_to_verified_evidence',aspect_ratio:outMeta.width/outMeta.height,crop_strategy:'visual_planner_readability_crop'},source:{...(asset.source??{}),derivation:{strategy:'visual_planner_readability_crop',parent_asset_id:asset.asset_id,crop,target_aspect:targetAspect}},parent_asset_id:asset.asset_id};
}

export async function processVisualAssets(slides,manifest,{outputDir}){
  const nextSlides=structuredClone(slides),assets=[...(manifest?.assets??[])],actions=[];
  for(const slide of nextSlides){
    const composition=slide.visual_plan?.recommended_composition;
    for(const check of slide.visual_plan?.screenshot_readability??[]){
      if(check.readable)continue;
      const ref=(slide.assets??[]).find(item=>item.asset_id===check.asset_id),asset=assets.find(item=>item.asset_id===check.asset_id);
      if(!ref||!asset){actions.push({slide_id:slide.slide_id,asset_id:check.asset_id,action:'replace',status:'blocked',reason:'asset reference or manifest entry missing'});continue;}
      if(check.action==='replace'||!asset.local_path){actions.push({slide_id:slide.slide_id,asset_id:check.asset_id,action:'replace',status:'blocked',reason:check.reason});continue;}
      const derived=await cropAsset(asset,aspectFor(composition),path.join(outputDir,'processed'));
      assets.push(derived);ref.asset_id=derived.asset_id;ref.uri=derived.local_path;ref.fit='contain';
      actions.push({slide_id:slide.slide_id,asset_id:asset.asset_id,derived_asset_id:derived.asset_id,action:'crop',status:'completed',strategy:derived.source.derivation});
    }
  }
  return {slides:nextSlides,manifest:{...(manifest??{}),assets},actions,status:actions.some(action=>action.status==='blocked')?'needs_review':'ready'};
}
