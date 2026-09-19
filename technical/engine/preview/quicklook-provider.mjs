import fs from 'node:fs/promises';import path from 'node:path';import {spawn} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {PreviewProvider} from './provider.mjs';
const run=(cmd,args)=>new Promise((resolve,reject)=>{const c=spawn(cmd,args,{stdio:['ignore','pipe','pipe']});let log='';c.stdout.on('data',b=>log+=b);c.stderr.on('data',b=>log+=b);c.on('close',code=>code===0?resolve(log):reject(new Error(`${cmd} exited ${code}: ${log.slice(0,400)}`)));c.on('error',reject)});
async function rasterizePdfAttachments(previewDir,htmlPath){
 let html=await fs.readFile(htmlPath,'utf8');
 const names=[...new Set([...html.matchAll(/(?:src|href)=["']([^"']+\.pdf)["']/gi)].map(x=>decodeURIComponent(x[1])))];
 for(const name of names){
  const source=path.resolve(previewDir,name),target=source+'.png',prefix=target.slice(0,-4);
  if(!source.startsWith(path.resolve(previewDir)+path.sep))throw new Error(`Unsafe QuickLook attachment path: ${name}`);
  await run('pdftoppm',['-f','1','-singlefile','-png','-r','144',source,prefix]);
  html=html.split(name).join(name+'.png');
 }
 if(names.length)await fs.writeFile(htmlPath,html);
 return names;
}
export class QuickLookPreviewProvider extends PreviewProvider {
 async render(pptxPath,outputDir,{expectedSlides}={}){if(process.platform!=='darwin')throw new Error('QuickLook preview is macOS-only');await fs.mkdir(outputDir,{recursive:true});await run('qlmanage',['-p','-o',outputDir,pptxPath]);const previewDir=path.join(outputDir,path.basename(pptxPath)+'.qlpreview'),html=path.join(previewDir,'Preview.html');await fs.access(html);const convertedAttachments=await rasterizePdfAttachments(previewDir,html);const {chromium}=await import('playwright'),systemChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',bundled=chromium.executablePath(),executablePath=await fs.access(bundled).then(()=>bundled,()=>systemChrome);await fs.access(executablePath);const browser=await chromium.launch({headless:true,executablePath,args:['--allow-file-access-from-files']});const images=[],warnings=[];
 try{const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});await page.goto(pathToFileURL(html).href,{waitUntil:'load',timeout:15000});const slides=page.locator('div.slide'),count=await slides.count();if(expectedSlides&&count!==expectedSlides)throw new Error(`QuickLook slide count mismatch ${count}/${expectedSlides}`);for(let i=0;i<count;i++){const slide=slides.nth(i),broken=await slide.locator('img').evaluateAll(xs=>xs.filter(x=>x.complete&&!x.naturalWidth).map(x=>x.getAttribute('src')));if(broken.length)warnings.push({slide:i+1,code:'QUICKLOOK_BROKEN_ATTACHMENT',count:broken.length});const target=path.join(outputDir,`slide-${String(i+1).padStart(2,'0')}.png`);await slide.screenshot({path:target,timeout:15000});images.push(target);}}finally{await browser.close();}
 return {provider:'macOS QuickLook + Chrome',images,pdfPath:null,warnings,convertedAttachments,claim_boundary:'QuickLook approximates macOS viewing; PowerPoint native execution and edits are not verified'};
 }
}
