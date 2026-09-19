import { lookup } from 'node:dns/promises';
import net from 'node:net';
const OFFICIAL = ['samsung.com','sony.com','sony.net','hisense.com','hisense-usa.com'];
const RESEARCH = ['idc.com','omdia.tech','gartner.com','counterpointresearch.com','statista.com','arxiv.org'];
export function authority(url, origin = 'external') {
  if (origin !== 'external') return 'USER';
  const host = new URL(url).hostname.toLowerCase();
  if (OFFICIAL.some(d => host === d || host.endsWith('.'+d)) || host.endsWith('.gov') || host.endsWith('.edu') || host.endsWith('.org') && /iso|itu|ieee/.test(host)) return 'A';
  if (RESEARCH.some(d => host === d || host.endsWith('.'+d))) return 'B';
  if (/reddit\.com$|forum\./.test(host)) return 'D';
  return 'C'; // unknown domain is NOT declared official
}
function privateIp(ip) {
  const s=ip.toLowerCase();
  if (s.includes(':')) return s === '::1' || s.startsWith('fe80:') || s.startsWith('fc') || s.startsWith('fd') || s.startsWith('::ffff:');
  const [a,b] = s.split('.').map(Number);
  return a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a===100&&b>=64&&b<=127;
}
export async function safeUrl(input) {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Only public HTTPS URLs without credentials are allowed');
  if (url.hostname==='localhost'||url.hostname.endsWith('.local')||net.isIP(url.hostname) && privateIp(url.hostname)) throw new Error('Local/private URL denied');
  const addresses = await lookup(url.hostname,{all:true});
  if (!addresses.length || addresses.some(a=>privateIp(a.address))) throw new Error('Private DNS destination denied');
  return url;
}
export async function safeFetch(input, options={}) {
  let url=await safeUrl(input);
  for(let i=0;i<4;i++) {
    const r=await fetch(url,{...options,redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'User-Agent':'ProductPPTAgentResearch/0.1 (+public evidence; no login)',...(options.headers||{})}});
    if([301,302,303,307,308].includes(r.status)) { url=await safeUrl(new URL(r.headers.get('location'),url).href); continue; }
    return { response:r,url:url.href };
  }
  throw new Error('Too many redirects');
}
export function sourcePriority(type) { return ['market','trend'].includes(type) ? ['B','A','C','D','E'] : ['A','B','C','D','E']; }
export function rankSources(sources,type) { const order=sourcePriority(type); return [...sources].sort((a,b)=>order.indexOf(a.authority_level)-order.indexOf(b.authority_level)); }
export function freshness(type) { return ({pricing:1,product:14,specification:14,market:365,trend:90,technology:365})[type]??90; }
