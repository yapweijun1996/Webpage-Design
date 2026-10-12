async(page)=>{
 const base='http://127.0.0.1:4170/comparison/round-5/preview.html',checks=[],errors=[];
 const onError=e=>errors.push(String(e));page.on('pageerror',onError);
 await page.setViewportSize({width:1440,height:900});await page.goto(base);
 for(const stage of ['before','after'])for(const viewport of ['mobile','phone360','phone320','phone430','tablet','desktop'])for(const extent of ['first','full']){
  await page.locator('#stage').selectOption(stage);await page.locator('#viewport').selectOption(viewport);await page.locator('#extent').selectOption(extent);
  await page.waitForLoadState('networkidle');
  const state=await page.evaluate(()=>({url:location.href,images:[...document.querySelectorAll('.capture img')].map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0,natural:el.naturalWidth,maxWidth:el.style.maxWidth})),links:[...document.querySelectorAll('.caption a')].map(el=>el.href),width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  const params=new URL(state.url).searchParams,folder=stage==='before'?'before':'playwright',ports=stage==='before'?[4201,4202]:[4211,4212];
  checks.push({stage,viewport,extent,...state,pass:params.get('stage')===stage&&params.get('viewport')===viewport&&params.get('extent')===extent&&state.images.length===2&&state.images.every(el=>el.loaded&&el.src.includes('/'+folder+'/')&&el.src.endsWith('contact-'+viewport+'-'+extent+'.png'))&&state.links.every((url,i)=>url==='http://127.0.0.1:'+ports[i]+'/contact/')&&state.scrollWidth<=state.width});
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base+'?stage=after&page=contact&viewport=mobile&extent=first');await page.waitForLoadState('networkidle');
  const state=await page.evaluate(()=>({stage:document.getElementById('stage').value,viewport:document.getElementById('viewport').value,extent:document.getElementById('extent').value,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(el=>el.complete&&el.naturalWidth>0)}));
  checks.push({scenario:'Shareable URL and responsive viewer',...state,pass:state.stage==='after'&&state.viewport==='mobile'&&state.extent==='first'&&state.images&&state.scrollWidth<=width});
 }
 page.removeListener('pageerror',onError);return {checks,errors};
}