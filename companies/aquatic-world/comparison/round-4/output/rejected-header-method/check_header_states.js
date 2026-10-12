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
  for(const width of [1024,320]){
    await page.setViewportSize({width,height:900});
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(el=>el.checkVisibility()).map(el=>el.decode().catch(()=>{})));scrollTo({top:0,behavior:'instant'});});
    await page.screenshot({path:output+'/home-extra-'+width+'.png',animations:'disabled'});
  }
  return {checks};
}
