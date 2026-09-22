import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const run=(cmd,args)=>new Promise((resolve,reject)=>{const child=spawn(cmd,args,{stdio:['ignore','pipe','pipe']});let error='';child.stderr.on('data',x=>error+=x);child.on('close',code=>code===0?resolve():reject(new Error(`${cmd} failed: ${error.slice(0,200)}`)));child.on('error',reject);});

export async function captureLocalVisuals(inputs,outputDir){
  const dir=path.join(outputDir,'assets/local-screenshots');await fs.mkdir(dir,{recursive:true});
  const assets=[],attempts=[],slots=[];
  for(const [inputIndex,input] of inputs.entries()){
    if(input.type!=='pdf')continue;
    const visualPages=(input.pages??[]).filter(page=>page.has_visual).slice(0,4);
    if(!visualPages.length){attempts.push({source:input.name,status:'NOT_NEEDED',reason:'PDF has no embedded raster visual; a screenshot would only shrink readable text.'});continue;}
    for(const page of visualPages){
      const entity=`${input.name}#p${page.page}`,slotId=`LOCAL:${inputIndex+1}:${page.page}`;
      const prefix=path.join(dir,createHash('sha256').update(`${input.filename}:${page.page}`).digest('hex').slice(0,12));
      try{
        await run('pdftoppm',['-f',String(page.page),'-l',String(page.page),'-r','150','-png','-singlefile',input.filename,prefix]);
        const file=prefix+'.png',bytes=await fs.readFile(file),meta=await sharp(bytes).metadata(),digest=createHash('sha256').update(bytes).digest('hex');
        const asset={asset_id:'A'+digest.slice(0,12),type:'document_page_screenshot',asset_type:'local_page_screenshot',brand:input.name,entity,entities:[entity],source_url:input.name,source_page_url:input.name,source_id:`src-user-${inputIndex+1}`,local_path:path.resolve(file),format:'png',width:meta.width,height:meta.height,has_transparency:!!meta.hasAlpha,usage:'local source evidence',license_notes:'User-provided local material',status:'approved_internal',content_hash:digest,perceptual_hash:null,related_evidence:[],related_claims:[],related_slides:[],semantic_description:`Page ${page.page} screenshot of ${input.name}`,visual_content:['user-provided document page'],semantic_review:'source_and_slot_verified',visual_role:'EVIDENCE_VISUAL',quality:{authority:'user_provided',resolution:'adequate',visual_clarity:'captured_from_source_pdf',watermark:'not_assessed',text_density:'not_assessed',aspect_ratio:meta.width/meta.height},source:{page_url:input.name,page_title:input.name,asset_url:null,source_id:`src-user-${inputIndex+1}`,origin:'local_pdf_page_screenshot',captured_at:new Date().toISOString(),page:page.page},rights:{status:'user_provided',scope:'requested_presentation'},used:false};
        assets.push(asset);attempts.push({source:input.name,page:page.page,status:'approved_internal',method:'pdf_page_screenshot'});
        slots.push({slot_id:slotId,slide_id:null,entity,asset_type:'local_page_screenshot',found:true,usable:true,used:false,asset_ids:[asset.asset_id],status:'USABLE'});
      }catch(e){attempts.push({source:input.name,page:page.page,status:'NOT_FOUND',reason:e.message});slots.push({slot_id:slotId,slide_id:null,entity,asset_type:'local_page_screenshot',found:false,usable:false,used:false,asset_ids:[],status:'NOT_FOUND'});}
    }
  }
  const manifest={generated_at:new Date().toISOString(),assets,attempts,coverage:{slots,summary:{required:slots.length,found:slots.filter(x=>x.found).length,usable:slots.filter(x=>x.usable).length,used:0}},qa:{issues:[],not_assessed:['Visual meaning beyond presence of PDF image'],status:'partial'}};
  await fs.mkdir(path.join(outputDir,'assets'),{recursive:true});await fs.writeFile(path.join(outputDir,'assets/asset-manifest.json'),JSON.stringify(manifest,null,2));return manifest;
}
