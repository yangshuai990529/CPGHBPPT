import fs from 'node:fs/promises';
import path from 'node:path';
import {createInterface} from 'node:readline/promises';

const SOURCE_ALIASES={1:'local',2:'web',3:'hybrid',local:'local',web:'web',hybrid:'hybrid','本地':'local','联网':'web','本地+联网':'hybrid'};
const IMAGE_ALIASES={1:true,2:false,yes:true,no:false,true:true,false:false,'是':true,'否':false,'需要':true,'不需要':false};
export function parseSourceChoice(value){const key=String(value??'').trim().toLowerCase();const mode=SOURCE_ALIASES[key];if(!mode)throw new Error('数据来源必须选择 1/本地、2/联网或 3/本地+联网。');return mode;}
export function parseImageChoice(value){const key=String(value??'').trim().toLowerCase();if(!(key in IMAGE_ALIASES))throw new Error('图片需求必须选择 1/需要或 2/不需要。');return IMAGE_ALIASES[key];}

export async function askGenerationOptions({input=process.stdin,output=process.stdout,sourceMode,images}={}){
  let selectedSource=sourceMode==null?null:parseSourceChoice(sourceMode),selectedImages=images==null?null:parseImageChoice(images);
  if(selectedSource!==null&&selectedImages!==null)return {sourceMode:selectedSource,images:selectedImages};
  if(!input.isTTY||!output.isTTY)throw new Error('当前不是交互终端。请明确传入 --source-mode local|web|hybrid 和 --images yes|no。');
  const rl=createInterface({input,output});
  try{
    if(selectedSource===null)selectedSource=parseSourceChoice(await rl.question('请选择数据来源：\n  1. 本地数据\n  2. 联网生成\n  3. 本地 + 联网生成\n请输入 1/2/3：'));
    if(selectedImages===null)selectedImages=parseImageChoice(await rl.question('是否需要图片？\n  1. 需要（系统自行截取网页画面并放入 PPT）\n  2. 不需要\n请输入 1/2：'));
    return {sourceMode:selectedSource,images:selectedImages};
  }finally{rl.close();}
}

export async function discoverLocalInputs(root){
  const candidates=[];
  for(const dir of [path.join(root,'input'),path.join(root,'workspace/input')]){
    for(const name of await fs.readdir(dir).catch(()=>[]))if(/\.(?:pdf|md|txt|csv)$/i.test(name))candidates.push(path.join(dir,name));
  }
  return [...new Set(candidates)];
}
