async (page) => {
  const base='http://127.0.0.1:4170/comparison/round-4/preview.html';
  const routes={home:'/',collections:'/collections/',fish:'/collections/ornamental-fish/',plants:'/collections/aquatic-plants/',driftwood:'/collections/driftwood/',story:'/our-story/',quality:'/quality/',contact:'/contact/'};
  const checks=[],errors=[];
  const onError=error=>errors.push(String(error));
  page.on('pageerror',onError);
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base);
  for(const stage of ['before','after']){
   await page.locator('#stage').selectOption(stage);
   for(const name of Object.keys(routes)){
    await page.locator('#page').selectOption(name);
    for(const viewport of ['desktop','tablet','mobile']){
      await page.locator('#viewport').selectOption(viewport);
      for(const extent of ['first','full']){
        await page.locator('#extent').selectOption(extent);
        await page.waitForFunction(()=>[...document.querySelectorAll('.capture img')].every(img=>img.complete && img.naturalWidth>0));
        const state=await page.evaluate(()=>({images:[...document.querySelectorAll('.capture img')].map(img=>({src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight,alt:img.alt})),links:[...document.querySelectorAll('.caption a')].map(a=>a.href)}));
        checks.push({stage,name,viewport,extent,...state,pass:state.images.length===2 && state.images.every((img,i)=>img.src===`${stage==='before'?'../round-3/':''}output/playwright/${i?'claude':'codex'}/${name}-${viewport}-${extent}.png` && !!img.alt) && state.links.every((href,i)=>href===`http://127.0.0.1:${stage==='before'?(i?4192:4191):(i?4202:4201)}${routes[name]}`)});
      }
    }
  }
  }
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    await page.goto(base+'?stage=before&page=quality&viewport=mobile&extent=first');
    await page.waitForFunction(()=>[...document.querySelectorAll('.capture img')].every(img=>img.complete && img.naturalWidth>0));
    const state=await page.evaluate(()=>({stage:document.querySelector('#stage').value,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,page:document.querySelector('#page').value,viewport:document.querySelector('#viewport').value,extent:document.querySelector('#extent').value}));
    checks.push({step:'Viewer layout and shareable selection',...state,pass:state.stage==='before' && state.scrollWidth<=state.width && state.page==='quality' && state.viewport==='mobile' && state.extent==='first'});
    await page.screenshot({path:'__OUTPUT__/viewer-'+width+'.png',animations:'disabled'});
  }
  page.removeListener('pageerror',onError);
  return {checks,errors};
}
