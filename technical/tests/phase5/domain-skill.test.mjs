import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {selectPacks,chooseDimensions} from '../../engine/knowledge/index.mjs';import {discoverSkills} from '../../app/runtime/skills.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
for(const [scenario,topic,needed,unneeded] of [
 ['high-end Mini LED','High-end Mini LED TV',["Local Dimming","Peak Brightness"],["Personalization"]],
 ['mid-range LCD','Mid-range LCD TV',["Picture Mode","Motion"],["Local Dimming"]],
 ['AI Picture','AI Picture competitor review',["Scene Detection","Ambient Environment Adaptation"],["Local Dimming"]],
 ['calibration','电视校准 Calibration',["Signal Type","Result Validation"],["Peak Brightness"]]
])test(`domain skill dimension routing: ${scenario}`,async()=>{const packs=await selectPacks(root,topic),chosen=chooseDimensions(packs,topic);for(const x of needed)assert.ok(chosen.dimensions.includes(x),`${scenario} missing ${x}`);for(const x of unneeded)assert.ok(!chosen.dimensions.includes(x),`${scenario} unexpectedly selected ${x}`);});
test('only four basically evaluated domain skills are enabled',async()=>{const skills=(await discoverSkills(root)).filter(x=>x.category==='custom'&&x.id!=='tv-picture-quality');const active=skills.filter(x=>x.enabled);assert.deepEqual(active.map(x=>x.id).sort(),['ai-agent-analysis','ai-picture-analysis','calibration-analysis','picture-quality-competitor-analysis']);for(const s of active){const manifest=JSON.parse(await fs.readFile(path.join(root,path.dirname(s.path),'manifest.json'),'utf8'));assert.equal(manifest.evaluation_status,'basic_cases_passed');}});
