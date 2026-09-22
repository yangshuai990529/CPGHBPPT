import sharp from 'sharp';

export async function inspectRenderedSlides(images,models){
  const issues=[];
  for(let i=0;i<images.length;i++){
    const model=models[i];if(!model||['cover','ending'].includes(model.kind))continue;
    const meta=await sharp(images[i]).metadata(),left=Math.round((meta.width??1280)*120/1280),top=Math.round((meta.height??720)*124/720),width=Math.round((meta.width??1280)*900/1280),height=Math.round((meta.height??720)*500/720);const {data,info}=await sharp(images[i]).extract({left,top,width,height}).removeAlpha().raw().toBuffer({resolveWithObject:true});const cols=6,rows=4,active=[];let darkTotal=0;
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const x0=Math.floor(col*info.width/cols),x1=Math.floor((col+1)*info.width/cols),y0=Math.floor(row*info.height/rows),y1=Math.floor((row+1)*info.height/rows);let dark=0,total=0;for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){const p=(y*info.width+x)*info.channels;if(data[p]<242||data[p+1]<242||data[p+2]<242)dark++;total++;}darkTotal+=dark;if(dark/Math.max(total,1)>.006)active.push({row,col});}
    const hasVisual=model.elements.some(x=>['Image','Chart','Table'].includes(x.type)),textChars=model.elements.filter(x=>x.text&&x.type!=='Source').reduce((n,x)=>n+x.text.length,0),activeRows=new Set(active.map(x=>x.row)).size,activeCols=new Set(active.map(x=>x.col)).size;
    if(!hasVisual&&textChars<90)issues.push({slide:i+1,code:'VISIBLE_CONTENT_TOO_THIN',severity:'error',message:`Rendered slide has only ${textChars} visible text characters and no image/chart`});
    if(active.length<4)issues.push({slide:i+1,code:'RENDERED_CONTENT_TOO_SPARSE',severity:'error',message:`Rendered content reaches only ${active.length}/24 canvas regions`});
    else if(activeRows<2||activeCols<2)issues.push({slide:i+1,code:'VISUAL_BALANCE',severity:'warning',message:'Rendered content is concentrated in one narrow part of the editable area'});
  }
  return issues;
}
