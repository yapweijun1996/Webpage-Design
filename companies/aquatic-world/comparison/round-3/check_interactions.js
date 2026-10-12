async (page) => {
  const runner='__RUNNER__',origin='__ORIGIN__',output='__OUTPUT__';
  const checks=[],outbound=[];
  const requests=request=>{if(!['GET','HEAD'].includes(request.method()) || new URL(request.url()).origin!==origin)outbound.push({url:request.url(),method:request.method()});};
  page.on('request',requests);
  const config=runner==='codex'?{name:'#name',email:'#email',project:'#project',preview:'#preview-result',edit:'#edit-brief'}:
    {name:'#f-name',email:'#f-email',project:'#f-project',preview:'[data-preview]',edit:'[data-edit]'};
  await page.setViewportSize({width:1440,height:900});
  await page.goto(origin+'/');
  await page.keyboard.press('Tab');
  const skip=await page.evaluate(()=>{const el=document.activeElement,r=el.getBoundingClientRect(),css=getComputedStyle(el);return {text:el.textContent.trim(),href:el.getAttribute('href'),box:{x:r.x,y:r.y,width:r.width,height:r.height},outline:css.outlineWidth};});
  await page.keyboard.press('Enter');
  const focusTarget=await page.evaluate(()=>document.activeElement.tagName);
  checks.push({scenario:'NAV-03',step:'Keyboard skip link',skip,focusTarget,pass:/skip/i.test(skip.text) && skip.box.y>=0 && skip.box.width>0 && focusTarget==='MAIN'});
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/');
  const menu=page.locator('header summary:visible,header button[aria-expanded]:visible').first();
  const state=()=>menu.evaluate(el=>({open:el.tagName==='SUMMARY'?el.closest('details').open:el.getAttribute('aria-expanded')==='true',focused:document.activeElement===el}));
  await menu.focus();
  await page.keyboard.press('Enter');
  const opened=await state();
  await page.screenshot({path:output+'/menu-mobile.png',animations:'disabled'});
  await page.keyboard.press('Escape');
  const closed=await state();
  await menu.click();
  const pointer=await state();
  await page.locator('header a[href="/quality/"]:visible').first().click();
  checks.push({scenario:'NAV-02',opened,closed,pointer,destination:page.url(),pass:opened.open && !closed.open && closed.focused && pointer.open && new URL(page.url()).pathname==='/quality/'});
  const cdp=await page.context().newCDPSession(page);
  try{
    await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
    for(const path of ['/','/collections/','/collections/ornamental-fish/','/collections/aquatic-plants/','/collections/driftwood/','/our-story/','/quality/','/contact/']){
      await page.goto(origin+path);
      const summary=page.locator('header summary:visible');
      if(await summary.count())await summary.click();
      const visible=await page.locator('header a[href]:visible').evaluateAll(elements=>elements.map(el=>el.getAttribute('href')));
      const heading=await page.locator('h1').innerText();
      const disabled=path!=='/contact/' || await page.locator('button[type="submit"]').isDisabled();
      checks.push({scenario:'NAV-04',path,heading,visible,previewDisabled:disabled,
        pass:!!heading && ['/','/collections/','/our-story/','/quality/','/contact/'].every(href=>visible.includes(href)) && disabled});
    }
    await page.locator('header a[href="/quality/"]:visible').first().click();
    checks.push({scenario:'NAV-04',step:'Actual no-JS page navigation',url:page.url(),pass:new URL(page.url()).pathname==='/quality/'});
    await page.screenshot({path:output+'/quality-no-js-mobile.png',animations:'disabled'});
  }finally{await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});await cdp.detach();}
  for(const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await page.goto(origin+'/contact/');
    const submit=page.locator('form button[type="submit"]');
    if(viewport.name==='desktop'){
      await submit.click();
      const blank=await page.evaluate(()=>({
        invalid:[...document.querySelectorAll('[aria-invalid="true"]')].map(el=>el.id),
        summary:document.querySelector('.error-summary')?.innerText,
        focusSummary:document.activeElement.matches('.error-summary'),
        associated:[...document.querySelectorAll('input[aria-invalid="true"],textarea[aria-invalid="true"]')].every(el=>{
          // A checkbox family may describe its error on the semantic fieldset.
          const owners=[el];
          if(['checkbox','radio'].includes(el.type)){
            const group=el.closest('fieldset');
            if(group?.querySelector('legend'))owners.push(group);
          }
          return owners.some(owner=>(owner.getAttribute('aria-describedby')||'').split(/\s+/).some(id=>{
            const message=document.getElementById(id);
            return message?.matches('.field-error') && !!message.innerText.trim();
          }));
        })
      }));
      checks.push({scenario:'FORM-01',step:'Blank fields',...blank,pass:blank.invalid.length>=3 && !!blank.summary && blank.focusSummary && blank.associated});
      await page.locator(config.name).fill('Alex Example');
      await page.locator(config.email).fill('invalid');
      await page.locator(config.project).fill('short');
      await submit.click();
      const invalid=await page.evaluate(()=>[...document.querySelectorAll('input[aria-invalid="true"],textarea[aria-invalid="true"]')].map(el=>el.id));
      checks.push({scenario:'FORM-01',step:'Invalid email and short project',invalid,pass:invalid.includes(config.email.slice(1)) && invalid.includes(config.project.slice(1))});
      await page.screenshot({path:output+'/contact-errors-desktop.png',animations:'disabled'});
    }
    await page.locator(config.name).fill('Alex Example');
    await page.locator(config.email).fill('alex@example.invalid');
    await page.locator(config.project).fill('A planted aquarium display for an illustrative shop. Please help explore foliage and composition. '+ 'LongUnbrokenProjectToken'.repeat(8));
    if(runner==='codex')await page.locator('#category').selectOption('aquatic-plants');
    else await page.locator('input[name="interest"][value="aquatic-plants"]').check();
    await submit.click();
    const preview=page.locator(config.preview);
    const visible=await preview.isVisible(),text=await preview.innerText();
    const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,invalid:document.querySelectorAll('[aria-invalid="true"]').length}));
    checks.push({scenario:'FORM-01',step:'Valid honest preview',viewport:viewport.name,visible,text,layout,
      pass:visible && text.includes('Alex Example') && text.includes('alex@example.invalid') && /nothing was sent/i.test(text) && layout.invalid===0 && layout.scrollWidth<=layout.width});
    await preview.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({path:output+`/contact-preview-${viewport.name}.png`,animations:'disabled'});
    await page.locator(config.edit).click();
    const kept=await page.locator(config.name).inputValue();
    checks.push({scenario:'FORM-01',step:'Return to edit',viewport:viewport.name,kept,pass:kept==='Alex Example' && await page.locator(config.name).isVisible()});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(origin+'/');
  const motion=await page.locator('main').evaluate(el=>({text:el.innerText.length,opacity:getComputedStyle(el).opacity,
    transitions:[...el.querySelectorAll('a')].slice(0,8).map(a=>getComputedStyle(a).transitionDuration)}));
  checks.push({scenario:'UI-03',step:'Reduced motion',...motion,pass:motion.text>100 && motion.opacity==='1' && motion.transitions.every(value=>value.split(',').every(part=>parseFloat(part)<=0.001))});
  await page.emulateMedia({reducedMotion:'no-preference'});
  page.removeListener('request',requests);
  checks.push({scenario:'FORM-01',step:'No outbound submission or external requests',outbound,pass:outbound.length===0});
  return {runner,checks};
}
