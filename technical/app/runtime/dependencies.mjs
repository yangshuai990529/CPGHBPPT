import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {spawnSync} from 'node:child_process';
export async function dependencies(root=process.cwd()){
  let modules=process.env.RUNTIME_NODE_MODULES;if(!modules&&await fs.access(path.join(root,'node_modules')).then(()=>true,()=>false))modules=path.join(root,'node_modules');
  let python=process.env.RUNTIME_PYTHON;for(const candidate of [python,path.join(root,'.venv/bin/python3'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')]){if(candidate&&await fs.access(candidate).then(()=>true,()=>false)){python=candidate;break;}}
  if(!python){const found=spawnSync('which',['python3'],{encoding:'utf8'});python=found.status===0?found.stdout.trim():'python3';}
  return {RUNTIME_NODE_MODULES:modules,RUNTIME_PYTHON:python};}
