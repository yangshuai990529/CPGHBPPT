import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {capabilityBaseline} from '../../app/runtime/capabilities.mjs';
import {cli} from '../../app/commands/cli.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');

test('Phase 1 capability baseline is explicit and all source pointers resolve', async () => {
  const report=await capabilityBaseline(root);
  const byId=Object.fromEntries(report.capabilities.map(item=>[item.id,item]));
  assert.equal(byId.per_slide_image_planning.status,'partial');
  assert.equal(byId.autonomous_web_research.status,'not_implemented');
  assert.equal(byId.pptxgenjs_provider.status,'not_implemented');
  assert.equal(byId.corporate_template_renderer.status,'implemented_bounded');
  assert.equal(byId.closed_loop_auto_repair.status,'not_implemented');
  assert.deepEqual(report.capabilities.flatMap(item=>item.missing_evidence_paths),[]);
});

test('CLI capabilities reports the same audited baseline', async () => {
  const output=[];
  const report=await cli(['capabilities'],line=>output.push(line));
  assert.equal(JSON.parse(output.join('\n')).capabilities.length,report.capabilities.length);
});
