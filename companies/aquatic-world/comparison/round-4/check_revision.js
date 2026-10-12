async (page) => {
  const origin = '__ORIGIN__';
  const checks = [], observations = [];
  const routes = ['/', '/collections/', '/collections/ornamental-fish/', '/collections/aquatic-plants/', '/collections/driftwood/', '/our-story/', '/quality/', '/contact/'];
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1440, 1024, 768, 390, 360, 320]) {
    await page.setViewportSize({width,height:width===390?844:900});
    for (const route of routes) {
      await page.goto(origin+route, {waitUntil:'load'});
      await page.evaluate(async()=>{await document.fonts.ready;scrollTo({top:0,behavior:'instant'});});
      const state = await page.evaluate(() => {
        const header = document.querySelector('header'), rect = header.getBoundingClientRect();
        const controls = [...header.querySelectorAll('a,button,summary')].map(el=>{
          const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return {text:el.innerText.trim(),tag:el.tagName,href:el.getAttribute('href'),visible:el.checkVisibility()&&r.width>0&&r.height>0&&s.visibility!=='hidden',
            x:r.x,y:r.y,width:r.width,height:r.height,fontSize:parseFloat(s.fontSize),current:el.getAttribute('aria-current')};
        }).filter(el=>el.visible);
        const collisions=[];
        for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){
          const a=controls[i],b=controls[j];
          if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)collisions.push([a.text,b.text]);
        }
        return {headerHeight:rect.height,headerPosition:getComputedStyle(header).position,scrollY,controls,collisions,
          width:innerWidth,scrollWidth:document.documentElement.scrollWidth};
      });
      observations.push({kind:'closed-header',width,route,...state,
        sizingTargetMet:width<=767?state.headerHeight>=64&&state.headerHeight<=72:width===1440?state.headerHeight>=72&&state.headerHeight<=84:null});
      checks.push({scenario:'REV-NAV',width,route,...state,
        pass:state.scrollY===0&&state.scrollWidth<=width&&state.collisions.length===0&&state.controls.every(el=>el.height>=43.5&&el.x>=-1&&el.x+el.width<=width+1)&&state.controls.filter(el=>['/','/collections/','/our-story/','/quality/','/contact/'].includes(el.href)).every(el=>el.fontSize>=15)});
    }
  }
  for (const noJS of [false,true]) {
    const cdp = noJS ? await page.context().newCDPSession(page) : null;
    if(cdp)await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
    for (const width of [390,320]) {
      await page.setViewportSize({width,height:width===390?844:900});
      await page.goto(origin+'/contact/',{waitUntil:'load'});
      await page.evaluate(async()=>{await document.fonts.ready;scrollTo({top:0,behavior:'instant'});});
      const state = await page.evaluate(()=>{
        const form=document.querySelector('form'),field=form.querySelector('input:not([type=hidden]),select,textarea');
        const label=[...document.querySelectorAll('label')].find(el=>el.htmlFor===field.id),workspace=document.getElementById('enquiry');
        const r=field.getBoundingClientRect(),lr=label?.getBoundingClientRect();
        const secondary=[...document.querySelectorAll('main aside,main .contact-help,main .contact-photo')].filter(el=>!workspace.contains(el));
        return {scrollY,field:{id:field.id,top:r.top,bottom:r.bottom,height:r.height},label:lr?{text:label.innerText,top:lr.top,bottom:lr.bottom}:null,
          secondary:secondary.map(el=>({tag:el.tagName,class:el.className,text:el.innerText.trim().slice(0,100),afterWorkspace:!!(workspace.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)})),
          headingOrder:[...document.querySelectorAll('main h1,main h2,main h3')].map(el=>({text:el.innerText,inWorkspace:workspace.contains(el),afterWorkspace:!!(workspace.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)}))};
      });
      checks.push({scenario:'REV-FORM-ORDER',width,noJS,...state,pass:state.secondary.length>0&&state.secondary.every(el=>el.afterWorkspace)});
      if(!noJS&&width===390)checks.push({scenario:'REV-FORM-FIRST-VIEW',width,noJS,...state,
        pass:state.scrollY===0&&state.field.top>=0&&state.field.bottom<=844&&state.label&&state.label.top>=0&&state.label.bottom<=state.field.top+1});
      observations.push({kind:'contact-first-field',width,noJS,...state});
    }
    if(cdp){await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});await cdp.detach();}
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/contact/',{waitUntil:'load'});
  const focusPath=[];
  for(let index=0;index<24;index++){
    await page.keyboard.press('Tab');
    const el=await page.evaluate(()=>{const el=document.activeElement;return {tag:el.tagName,id:el.id,text:el.innerText?.trim().slice(0,80),href:el.getAttribute('href'),inSecondary:!!el.closest('main aside,main .contact-help,main .contact-photo'),inForm:!!el.closest('form')};});
    focusPath.push(el);
    if(el.inForm)break;
  }
  checks.push({scenario:'REV-FORM-KEYBOARD',focusPath,pass:focusPath.at(-1)?.inForm&&focusPath.every(el=>!el.inSecondary)});
  await page.emulateMedia({reducedMotion:'no-preference'});
  return {checks,observations};
}
