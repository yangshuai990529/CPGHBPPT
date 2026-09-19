import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {learnDirectory} from '../../app/knowledge/incremental-learn.mjs';
import {createPptxFixture} from '../helpers/pptx-fixture.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');

test('folder learn is hash-idempotent, skips lock files, adds only new and changed PPTX',async()=>{
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'cpghbppt-learn-'));
  const source=path.join(temp,'workspace/旧PPT库');
  try{
    await fs.mkdir(source,{recursive:true});
    await fs.mkdir(path.join(temp,'tools'),{recursive:true});
    await fs.copyFile(path.join(root,'tools/extract_pptx_text.py'),path.join(temp,'tools/extract_pptx_text.py'));
    const fixtures=await Promise.all([1,2,3,4].map(async i=>createPptxFixture(path.join(temp,'fixtures',`history-${i}.pptx`),`fixture-${i}`)));
    for(let i=0;i<3;i++)await fs.copyFile(fixtures[i],path.join(source,`history-${i+1}.pptx`));
    await fs.writeFile(path.join(source,'.~产品PPT模板.pptx'),'lock');
    const manifestPath=path.join(temp,'workspace/learning-manifest.json');
    let result=await learnDirectory(temp,source,{manifestPath});
    assert.equal(result.learned.length,3);
    assert.equal(result.ignored.length,1);
    result=await learnDirectory(temp,source,{manifestPath});
    assert.equal(result.learned.length,0);
    assert.equal(result.skipped.length,3);
    await fs.copyFile(fixtures[3],path.join(source,'history-4.pptx'));
    result=await learnDirectory(temp,source,{manifestPath});
    assert.equal(result.learned.length,1);
    assert.equal(result.skipped.length,3);
    await fs.copyFile(fixtures[3],path.join(source,'history-1.pptx'));
    result=await learnDirectory(temp,source,{manifestPath});
    assert.equal(result.learned.length,1);
    assert.equal(result.skipped.length,3);
    const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
    assert.equal(manifest.history.length,1);
    assert.equal(Object.keys(manifest.files).length,4);
  } finally {
    await fs.rm(temp,{recursive:true,force:true});
  }
});
