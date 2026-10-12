async(page)=>{
 const runner='__RUNNER__',origin='__ORIGIN__',output='__OUTPUT__',checks=[];
 const previewSelector=runner==='codex'?'#preview-result':'[data-preview]',editSelector=runner==='codex'?'#edit-brief':'[data-edit]';
 const focus=()=>page.evaluate(()=>{
  const el=document.activeElement,r=el.getBoundingClientRect(),header=document.querySelector('header');
  const x=Math.max(1,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(1,Math.min(innerHeight-1,r.top+Math.min(20,r.height/2))),hit=document.elementFromPoint(x,y);
  return {id:el.id,tag:el.tagName,top:r.top,bottom:r.bottom,visible:el.checkVisibility()&&r.bottom>0&&r.top<innerHeight,covered:header.contains(hit)&&!header.contains(el)&&!el.contains(hit),width:innerWidth,scrollWidth:document.documentElement.scrollWidth};
 });
 for(const width of [320,360]){
  await page.setViewportSize({width,height:800});await page.goto(origin+'/contact/');
  const submit=page.locator('form button[type=submit]');await submit.click();await page.waitForTimeout(400);
  const blank=await focus(),errorLinks=await page.locator('.error-summary a').count();
  checks.push({scenario:'PHONE-ERROR',width,blank,errorLinks,pass:blank.visible&&!blank.covered&&errorLinks>=3&&blank.scrollWidth<=width});
  await page.screenshot({path:output+'/contact-error-links-phone'+width+'.png',fullPage:true,animations:'disabled'});
  for(let i=0;i<errorLinks;i++){
   await page.locator('.error-summary a').nth(i).click();await page.waitForTimeout(300);
   const s=await focus();checks.push({scenario:'PHONE-ERROR-LINK',width,index:i,...s,pass:s.visible&&!s.covered&&['INPUT','SELECT','TEXTAREA'].includes(s.tag)});
  }
  await page.locator('form [name=name]').fill('Alex Example');await page.locator('form [name=email]').fill('alex@example.invalid');
  await page.locator('form [name=project]').fill('An illustrative planted aquarium display with foliage and a natural composition. '+ 'LongUnbrokenProjectToken'.repeat(12));
  if(runner==='codex')await page.locator('form [name=category]').selectOption('aquatic-plants');else await page.locator('form [name=interest][value=aquatic-plants]').check();
  await submit.click();await page.waitForTimeout(400);
  const state=await focus(),preview=page.locator(previewSelector),text=await preview.innerText();
  checks.push({scenario:'PHONE-PREVIEW',width,state,pass:await preview.isVisible()&&text.includes('Alex Example')&&/nothing was sent/i.test(text)&&state.visible&&!state.covered&&state.scrollWidth<=width});
  await page.screenshot({path:output+'/contact-preview-phone'+width+'.png',fullPage:true,animations:'disabled'});
  await page.locator(editSelector).click();const kept=await page.locator('form [name=name]').inputValue();
  checks.push({scenario:'PHONE-EDIT',width,pass:kept==='Alex Example'&&await page.locator('form [name=name]').isVisible()});
  await submit.click();await page.getByRole('button',{name:/clear/i}).click();
  checks.push({scenario:'PHONE-CLEAR',width,pass:await page.locator('form [name=name]').inputValue()===''&&await page.locator('form [name=email]').inputValue()===''&&await page.locator('form [name=project]').inputValue()===''&&!await preview.isVisible()&&await page.locator('[aria-invalid=true]').count()===0});
 }
 await page.goto(origin+'/collections/aquatic-plants/');await page.locator('main a[href*="/contact/?"]').first().click();await page.waitForLoadState('load');
 await page.locator('form [name=name]').fill('Context Example');await page.locator('form [name=email]').fill('context@example.invalid');await page.locator('form [name=project]').fill('An illustrative aquatic plant palette for a small display.');
 await page.locator('form button[type=submit]').click();await page.getByRole('button',{name:/clear/i}).click();
 const selected=await page.locator('form select,form input[type=checkbox]:checked').evaluateAll(els=>els.map(el=>el.value));
 const s=await focus();
 checks.push({scenario:'PHONE-CONTEXT-CLEAR',selected,state:s,pass:await page.locator('form [name=name]').inputValue()===''&&!selected.includes('aquatic-plants')&&s.visible&&!s.covered});
 return {checks};
}