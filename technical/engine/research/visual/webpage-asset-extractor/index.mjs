const attr=(tag,name)=>{const re=new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,'i');const m=tag.match(re);return m?(m[1]??m[2]??m[3]).replace(/&amp;/g,'&'):'';};
function normal(raw,base){try{const u=new URL(raw.trim().replace(/&amp;/g,'&'),base);if(u.protocol!=='https:'||u.username||u.password)return null;u.hash='';return u.href;}catch{return null;}}
export function extractPageAssets(page,{max=750}={}){
 const html=page.html??'',all=[],seen=new Set();const add=(raw,origin,alt='',context='')=>{const url=normal(raw,page.url);if(!url||seen.has(url)||!/\.(png|jpe?g|webp|gif|svg)(?:\/|\?|$)|\/is\/image\//i.test(url))return;seen.add(url);all.push({url,source_page_url:page.url,page_title:page.title,origin,alt:alt.slice(0,240),context:context.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,250)});};
 for(const tag of html.match(/<(?:img|source|meta)\b[^>]*>/gi)??[]){const type=tag.match(/^<(\w+)/)?.[1].toLowerCase(),alt=attr(tag,'alt')||attr(tag,'title')||attr(tag,'aria-label');if(type==='meta'&&!/og:image|twitter:image/i.test(tag))continue;const direct=type==='meta'?attr(tag,'content'):attr(tag,'data-src')||attr(tag,'src');if(direct)add(direct,type,alt,tag);
 for(const set of [attr(tag,'srcset'),attr(tag,'data-srcset')])for(const item of set.split(/,\s*(?=https?:|\/)/)){const url=item.trim().split(/\s+/)[0];if(url)add(url,'srcset',alt,tag);}}
 // CSS background images may be useful for feature illustrations; do not execute page scripts.
 for(const m of html.matchAll(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi))add(m[1],'css-background','',html.slice(Math.max(0,m.index-120),m.index+200));
 return all.slice(0,max);
}
