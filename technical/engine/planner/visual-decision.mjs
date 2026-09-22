const numeric = value => {
  const text=String(value??'').trim().replaceAll(',','');
  if(!/^[-+]?\d+(?:\.\d+)?%?$/.test(text)) return null;
  return {value:Number(text.replace('%','')),unit:text.endsWith('%')?'%':''};
};

export function inspectStructuredTable(table) {
  const headers=table?.headers??[],rows=table?.rows??[];
  if(headers.length<2||rows.length<2||rows.some(row=>row.length!==headers.length))return null;
  const numericColumns=[];
  for(let col=1;col<headers.length;col++){
    const parsed=rows.map(row=>numeric(row[col]));
    if(parsed.every(Boolean)&&new Set(parsed.map(x=>x.unit)).size===1)numericColumns.push({name:headers[col],values:parsed.map(x=>x.value),unit:parsed[0].unit});
  }
  const comparable=rows.length>=3&&rows.length<=10&&numericColumns.length>0&&numericColumns.length===headers.length-1&&new Set(numericColumns.map(x=>x.unit)).size===1;
  return {headers,rows,chart:comparable?{categories:rows.map(row=>row[0]),series:numericColumns.map(({name,values})=>({name,values})),unit:numericColumns[0].unit}:null};
}

export function decideSlideVisual({table=null, screenshot=null, imagesEnabled=true, visualEvidenceNeeded=false, preferExactValues=false}={}) {
  const data=inspectStructuredTable(table);
  if(data?.chart&&!preferExactValues)return {type:'bar-chart',layout:'L11_CHART_INSIGHT',reason:'同一类别维度下有至少三行、数值列口径一致；用图比较大小。',data:data.chart};
  if(data)return {type:'feature-table',layout:'L10_COMPARISON_TABLE',reason:'保留原始行列和精确值；混合单位或类别不适合合并成图。',data:{headers:data.headers,rows:data.rows}};
  if(imagesEnabled&&visualEvidenceNeeded&&screenshot?.status==='approved_internal')return {type:'image',layout:'L07_IMAGE_TEXT',reason:'这页需要展示来源画面本身，截图与该页证据绑定。',data:null};
  return {type:'text',layout:'L02_HERO_INSIGHT',reason:!imagesEnabled?'用户选择不需要图片。':visualEvidenceNeeded?'缺少可核验的相关画面，保留文字证据。':'文字能更直接传达该页信息；不为装饰而截图。',data:null};
}
