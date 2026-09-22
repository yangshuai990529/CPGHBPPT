import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {PlaywrightBrowserProvider} from '../../browser/index.mjs';
import {visualHash} from '../deduplication/index.mjs';

const safeName=value=>String(value).toLowerCase().replace(/[^a-z0-9\p{L}-]+/gu,'-').replace(/^-|-$/g,'').slice(0,60)||'page';
const escapeAttr=value=>String(value).replace(/\\/g,'\\\\').replace(/"/g,'\\"');

async function cropExtremeWideEvidence(file,receipt){
  const meta=await sharp(file).metadata(),ratio=(meta.width??1)/(meta.height??1);
  if(receipt.element==='viewport_fallback'||ratio<=2.6)return {cropped:false,original_resolution:{width:meta.width,height:meta.height}};
  const targetWidth=Math.min(meta.width,Math.round(meta.height*16/9));
  if(targetWidth>=meta.width)return {cropped:false,original_resolution:{width:meta.width,height:meta.height}};
  const left=Math.max(0,Math.round((meta.width-targetWidth)/2)),tmp=`${file}.crop.png`;
  await sharp(file).extract({left,top:0,width:targetWidth,height:meta.height}).png().toFile(tmp);
  await fs.rename(tmp,file);
  return {cropped:true,original_resolution:{width:meta.width,height:meta.height},crop:{left,top:0,width:targetWidth,height:meta.height},strategy:'center_crop_16_9_around_verified_element'};
}

async function hasBlackEdgeBar(image,meta){
  const bandHeight=Math.max(1,Math.round((meta.height??1)*0.1));
  const innerTop=Math.min(meta.height-1,bandHeight),innerHeight=Math.max(1,meta.height-bandHeight*2);
  const [top,bottom,inner]=await Promise.all([
    image.clone().extract({left:0,top:0,width:meta.width,height:bandHeight}).stats(),
    image.clone().extract({left:0,top:Math.max(0,meta.height-bandHeight),width:meta.width,height:bandHeight}).stats(),
    image.clone().extract({left:0,top:innerTop,width:meta.width,height:innerHeight}).stats(),
  ]);
  const mean=stats=>stats.channels.slice(0,3).reduce((sum,channel)=>sum+channel.mean,0)/3;
  const uniformDark=stats=>mean(stats)<12&&stats.channels.slice(0,3).every(channel=>channel.stdev<10);
  const innerMean=mean(inner);
  return [top,bottom].some(edge=>uniformDark(edge)&&innerMean>mean(edge)+25);
}

export async function capturePageVisual({url,source_id,brand,asset_type='feature_screenshot',hint=null,text=null,dir,browser=new PlaywrightBrowserProvider()}){
  await fs.mkdir(dir,{recursive:true});
  const file=path.join(dir,`${safeName(brand)}-${safeName(asset_type)}.png`);
  const selector=hint?`img[src*="${escapeAttr(hint)}"],img[data-src*="${escapeAttr(hint)}"],img[srcset*="${escapeAttr(hint)}"]`:null;
  const receipt=await browser.screenshot(url,file,{elementText:text??undefined,selector:selector??undefined,fullPage:false});
  const crop=await cropExtremeWideEvidence(file,receipt);
  const bytes=await fs.readFile(file),image=sharp(bytes),meta=await image.metadata(),stats=await image.stats();
  const digest=createHash('sha256').update(bytes).digest('hex'),low=Math.min(meta.width??0,meta.height??0)<320,ratio=(meta.width??1)/(meta.height??1);
  const poorFrame=ratio<0.55||ratio>2.6,viewportFallback=receipt.element==='viewport_fallback';
  const blank=stats.entropy<0.35||stats.channels.slice(0,3).every(channel=>channel.mean<8&&channel.stdev<8);
  const blackBar=await hasBlackEdgeBar(image,meta),needsReview=poorFrame||viewportFallback||blank||blackBar;
  return {
    asset_id:'A'+digest.slice(0,12),type:'website_screenshot',asset_type,brand,entity:brand,entities:[brand],product:'',source_url:url,source_page_url:url,source_id,
    local_path:path.resolve(file),format:'png',width:meta.width,height:meta.height,has_transparency:!!meta.hasAlpha,usage:'internal research review only',
    license_notes:'Screenshot of a verified public webpage section; external reuse rights still require review.',status:low?'LOW_RESOLUTION':needsReview?'review_required':'approved_internal',
    content_hash:digest,perceptual_hash:await visualHash(bytes),related_evidence:[],related_claims:[],related_slides:[],
    semantic_description:`${brand} official webpage screenshot${text?` near ${text}`:''}`,visual_content:['official webpage screenshot'],
    semantic_review:low||needsReview?'pending':'source_and_slot_verified',visual_role:asset_type==='product_image'?'CONTEXT_VISUAL':'EVIDENCE_VISUAL',
    quality:{authority:'official_page_screenshot',resolution:low?'low':'adequate',visual_clarity:blank?'blank_or_uniform':blackBar?'black_bar':needsReview?'review_required':'captured_at_native_browser_resolution',watermark:'not_assessed',text_density:'not_assessed',aspect_ratio:ratio,entropy:stats.entropy,black_bar_detected:blackBar,crop_strategy:crop.strategy??(viewportFallback?'replace_with_element_crop':'target_element_or_verified_asset')},
    source:{page_url:url,page_title:receipt.title,asset_url:null,source_id,origin:viewportFallback?'viewport_fallback':'element_screenshot',derivation:crop,captured_at:receipt.timestamp,viewport:receipt.viewport,element:receipt.element},
    rights:{status:'unverified',scope:'internal_review'},used:false,
  };
}
export async function captureFeature(args){return capturePageVisual({...args,asset_type:'feature_screenshot'});}
