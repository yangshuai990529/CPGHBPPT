import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const expected=JSON.parse(await fs.readFile(path.join(root,'tests/golden/ai-picture.expected.json'),'utf8'));
const actual=JSON.parse(await fs.readFile(path.join(root,'tests/golden/ai-picture.actual.json'),'utf8'));
for(const key of Object.keys(expected))assert.deepEqual(actual[key],expected[key],`golden mismatch: ${key}`);
assert.equal(actual.qa_passed,true);
assert.equal(actual.has_research_evidence_notes,true);
assert.equal(actual.contains_mock_source,false);
console.log('Golden semantic/readout contract: PASS');
