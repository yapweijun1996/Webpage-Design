async (page) => {
  const origin='__ORIGIN__', output='__OUTPUT__',checks=[];
  await page.setViewportSize({width:1440,height:900});
  await page.goto(origin+'/',{waitUntil:'load'});
  const quality=page.locator('header nav a[href="/quality/"]:visible').first();
  const before=await quality.boundingBox();
  await quality.hover();
  await page.waitForTimeout(250);
  const after=await quality.boundingBox();
  checks.push({scenario:'REV-HEADER-HOVER',before,after,pass:['x','y','width','height'].every(key=>Math.abs(before[key]-after[key])<=0.5)});
  await page.screenshot({path:output+'/header-hover-desktop.png',animations:'disabled'});
  await page.goto(origin+'/collections/ornamental-fish/',{waitUntil:'load'});
  const current=await page.locator('header nav a[href="/collections/"]:visible').first().evaluate(el=>({current:el.getAttribute('aria-current'),text:el.textContent.trim(),decoration:getComputedStyle(el).textDecorationLine,before:getComputedStyle(el,'::before').content,after:getComputedStyle(el,'::after').content}));
  checks.push({scenario:'REV-HEADER-SECTION',current,pass:current.current==='location'});
  await page.screenshot({path:output+'/header-section-desktop.png',animations:'disabled'});
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/collections/ornamental-fish/',{waitUntil:'load'});
  await page.locator('header summary:visible,header button[aria-expanded]:visible').first().click();
  const compact=await page.locator('header a[href="/collections/"]:visible').first().evaluate(el=>({current:el.getAttribute('aria-current'),text:el.innerText,height:el.getBoundingClientRect().height}));
  checks.push({scenario:'REV-HEADER-COMPACT-SECTION',compact,pass:compact.current==='location'&&compact.height>=44});
  await page.screenshot({path:output+'/menu-section-mobile.png',animations:'disabled'});
  // Check each side of the changed menu/hero transitions, where wide rows can first collide.
  for(const width of [860,861,1099,1100,1119,1120,1199,1200,1024,320]){
    await page.setViewportSize({width,height:900});
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(el=>{const r=el.getBoundingClientRect();return el.checkVisibility()&&r.top<innerHeight&&r.bottom>0;}).map(el=>el.decode().catch(()=>{})));scrollTo({top:0,behavior:'instant'});});
    const state=await page.evaluate(()=>{
      const controls=[...document.querySelectorAll('header a,header button,header summary')].filter(el=>el.checkVisibility()).map(el=>{const r=el.getBoundingClientRect();return {text:el.innerText,x:r.x,y:r.y,width:r.width,height:r.height};});
      const collisions=[];
      for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)collisions.push([a.text,b.text]);}
      return {scrollY,scrollWidth:document.documentElement.scrollWidth,controls,collisions};
    });
    checks.push({scenario:'REV-MEDIA-BOUNDARY',width,...state,pass:state.scrollY===0&&state.scrollWidth<=width&&state.controls.length>=2&&state.collisions.length===0&&state.controls.every(el=>el.height>=43.5&&el.x>=-1&&el.x+el.width<=width+1)});
    await page.screenshot({path:output+'/home-extra-'+width+'.png',animations:'disabled'});
  }
  return {checks};
}
