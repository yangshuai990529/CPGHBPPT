import { safeFetch } from '../source/index.mjs';
export class SearchProvider { async search(_query) { throw new Error('SearchProvider.search not implemented'); } }
export class SeedSearchProvider extends SearchProvider {
  constructor(records=[]) { super(); this.records=records; }
  async search(query) { const q=String(query).toLowerCase(); return this.records.filter(x=>[x.brand,x.title,x.url].join(' ').toLowerCase().includes(q)); }
}
export class BraveSearchProvider extends SearchProvider {
  constructor(key=process.env.BRAVE_SEARCH_API_KEY) { super(); this.key=key; }
  async search(query) { if(!this.key) throw new Error('BRAVE_SEARCH_API_KEY missing; use verified seed URLs or configure a search provider');
    const u='https://api.search.brave.com/res/v1/web/search?q='+encodeURIComponent(query)+'&count=10';
    const {response}=await safeFetch(u,{headers:{'X-Subscription-Token':this.key,'Accept':'application/json'}});
    if(!response.ok) throw new Error('Search HTTP '+response.status);
    return (await response.json()).web?.results?.map(x=>({url:x.url,title:x.title,description:x.description}))??[];
  }
}
