// Safe, deliberately limited YAML mapping + scalar list subset; JSON is also accepted.
export function parseYaml(text) {
  const scalar=(s)=>{s=s.trim();if(/^(!|&|\*)/.test(s))throw new Error('YAML aliases/tags are unsupported');if(s==='true')return true;if(s==='false')return false;if(s==='null')return null;if(s==='[]')return [];if(/^[-+]?\d+(\.\d+)?$/.test(s))return Number(s);if((s.startsWith('"')&&s.endsWith('"'))||(s.startsWith("'")&&s.endsWith("'")))return s.slice(1,-1);return s;};
  const lines=text.split(/\r?\n/).map((raw,i)=>({raw,number:i+1})).filter(x=>x.raw.trim()&&!x.raw.trim().startsWith('#'));
  const root={},stack=[{indent:-1,node:root}];
  for(let i=0;i<lines.length;i++){
    const {raw,number}=lines[i];if(/\t/.test(raw))throw new Error(`YAML tab on line ${number}`);const indent=raw.match(/^ */)[0].length,body=raw.trim();while(stack.length>1&&indent<=stack.at(-1).indent)stack.pop();const node=stack.at(-1).node;
    if(body.startsWith('- ')){if(!Array.isArray(node))throw new Error(`Unexpected list at line ${number}`);node.push(scalar(body.slice(2)));continue;}
    const m=body.match(/^([\w-]+):(?:\s*(.*))?$/);if(!m||Array.isArray(node))throw new Error(`Unsupported YAML at line ${number}`);const [,key,value='']=m;if(Object.hasOwn(node,key))throw new Error(`Duplicate key ${key}`);
    if(value){node[key]=scalar(value);continue;}
    const next=lines[i+1];node[key]=next&&next.raw.match(/^ */)[0].length>indent&&next.raw.trim().startsWith('- ')?[]:{};stack.push({indent,node:node[key]});
  }
  return root;
}
