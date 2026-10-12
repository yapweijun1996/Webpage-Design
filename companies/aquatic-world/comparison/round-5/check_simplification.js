async(page)=>{
 const origin='__ORIGIN__',runner='__RUNNER__',checks=[],observations=[];
 const localPattern=/nothing (?:is|was) sent|no (?:message|enquiry) (?:is sent|service)|local(?:[- ]only)? preview|preview only|nothing you type|entries stay|browser only|does not save|never (?:used|sent)|leaves this page/i;
 const state=()=>page.evaluate(pattern=>{
  const visible=el=>el.checkVisibility()&&el.getBoundingClientRect().width>0;
  const form=document.querySelector('form'),field=form.querySelector('[name="name"]'),email=form.querySelector('[name="email"]'),r=field.getBoundingClientRect(),er=email.getBoundingClientRect();
  const controls=[...form.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(visible);
  const groups=[...new Set(controls.map(el=>el.name))];
  const headings=[...document.querySelectorAll('main h1,main h2,main h3')].filter(visible).map(el=>({tag:el.tagName,text:el.innerText,top:el.getBoundingClientRect().top,secondary:!!el.closest('aside,.contact-secondary,.contact-aside')}));
  const labels=[...document.querySelectorAll('label')].filter(el=>el.htmlFor===field.id||el.htmlFor===email.id).map(el=>({text:el.innerText,top:el.getBoundingClientRect().top}));
  const notices=[...document.querySelectorAll('main p')].filter(visible).filter(el=>new RegExp(pattern,'i').test(el.innerText)).map(el=>el.innerText.trim());
  const workspace=document.getElementById('enquiry');
  const secondary=[...document.querySelectorAll('main aside,main .contact-help,main .contact-photo')].filter(el=>!workspace.contains(el));
  return {scrollY,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,name:{top:r.top,bottom:r.bottom},email:{top:er.top,bottom:er.bottom},labels,groups,headings,notices,
   secondary:secondary.map(el=>({tag:el.tagName,after:!!(workspace.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)})),
   missingReferences:[...document.querySelectorAll('[aria-labelledby],[aria-describedby]')].flatMap(el=>['aria-labelledby','aria-describedby'].flatMap(attr=>(el.getAttribute(attr)||'').split(/\s+/).filter(id=>id&&!document.getElementById(id)).map(id=>({element:el.id,attr,id})))),
   controls:controls.map(el=>({id:el.id,name:el.name,type:el.type,height:el.getBoundingClientRect().height,font:parseFloat(getComputedStyle(el).fontSize),label:(()=>{const label=el.closest('label');return label?{font:parseFloat(getComputedStyle(label).fontSize),height:label.getBoundingClientRect().height}:null;})()}))};
 },localPattern.source);
 for(const view of [{width:390,height:844},{width:360,height:800},{width:320,height:800},{width:768,height:1024},{width:1440,height:900}]){
  await page.setViewportSize(view);await page.goto(origin+'/contact/',{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;scrollTo({top:0,behavior:'instant'});});
  const s=await state();observations.push(s);
  checks.push({scenario:'SIM-FOUR-GROUPS',width:view.width,groups:s.groups,pass:s.groups.length===4&&['name','email','project'].every(x=>s.groups.includes(x))&&!s.groups.some(x=>/organisation|organization|role|timing/i.test(x))});
  checks.push({scenario:'SIM-ONE-INTRO',width:view.width,headings:s.headings,pass:s.headings.filter(x=>x.tag==='H1').length===1&&!s.headings.some(x=>x.tag!=='H1'&&!x.secondary&&x.top<s.name.top)});
  checks.push({scenario:'SIM-ONE-DISCLOSURE',width:view.width,notices:s.notices,pass:s.notices.length===1});
  checks.push({scenario:'SIM-READABLE',width:view.width,controls:s.controls,pass:s.controls.every(x=>(['checkbox','radio'].includes(x.type)?x.label&&x.label.font>=15.5&&x.label.height>=43.5:x.font>=15.5&&x.height>=43.5))&&s.scrollWidth<=view.width});
  checks.push({scenario:'SIM-ACCESSIBLE-REFERENCES',width:view.width,missing:s.missingReferences,pass:s.missingReferences.length===0});
  checks.push({scenario:'SIM-HELP-ORDER',width:view.width,secondary:s.secondary,pass:s.secondary.length>0&&s.secondary.every(x=>x.after)});
  if([390,360].includes(view.width))checks.push({scenario:'SIM-FIRST-SCREEN',width:view.width,...s,pass:s.scrollY===0&&s.name.top<=320&&s.name.top>=0&&s.email.bottom<=view.height&&s.labels.length===2&&s.labels.every(x=>x.top>=0)});
 }
 // Category navigation uses actual own links, then checks the rendered selected values.
 await page.setViewportSize({width:390,height:844});
 for(const category of ['ornamental-fish','aquatic-plants','driftwood']){
  await page.goto(origin+'/collections/'+category+'/');
  await page.locator('main a[href*="/contact/?"]').first().click();await page.waitForLoadState('load');
  const selected=await page.locator('form select,form input[type=checkbox]:checked').evaluateAll(els=>els.map(el=>el.value));
  const s=await state();
  checks.push({scenario:'SIM-CONTEXT',category,selected,name:s.name,email:s.email,pass:selected.includes(category)&&s.name.top<=320&&s.email.bottom<=844});
 }
 await page.goto(origin+'/quality/');
 await page.locator('main a[href*="/contact/"]').first().click();await page.waitForLoadState('load');
 checks.push({scenario:'SIM-QUALITY-ENQUIRY',url:page.url(),pass:new URL(page.url()).pathname==='/contact/'&&await page.locator('form [name=name]').isVisible()});
 const param=runner==='codex'?'category':'interest';
 await page.goto(origin+'/contact/?'+param+'='+encodeURIComponent('<svg onload=alert(1)>'));
 const malicious=await page.locator('main').innerText();const invalid=await page.locator('[aria-invalid=true]').count();
 checks.push({scenario:'SIM-UNKNOWN-CONTEXT',pass:!malicious.includes('<svg')&&invalid===0});
 // A valid preview must have exactly the four current field groups and safely display source-like text.
 await page.locator('form [name=name]').fill('Alex Example');await page.locator('form [name=email]').fill('alex@example.invalid');
 const project='An illustrative planted display. <img src=x onerror=alert(1)> '+ 'LongUnbrokenProjectToken'.repeat(10);
 await page.locator('form [name=project]').fill(project);
 if(runner==='codex')await page.locator('form [name=category]').selectOption('aquatic-plants');
 else await page.locator('form input[name=interest][value=aquatic-plants]').check();
 await page.locator('form button[type=submit]').click();
 const preview=page.locator(runner==='codex'?'#preview-result':'[data-preview]');
 const text=await preview.innerText(),terms=await preview.locator('dt').allTextContents();
 checks.push({scenario:'SIM-PREVIEW-ROWS',terms,text,pass:terms.length===4&&!terms.some(x=>/organisation|organization|you are|role|timing/i.test(x))&&text.includes(project)&&/nothing was sent/i.test(text)&&await preview.locator('img').count()===0});
 checks.push({scenario:'SIM-PREVIEW-NO-OVERFLOW',pass:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)});
 const cdp=await page.context().newCDPSession(page);
 try{
  await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
  await page.goto(origin+'/contact/',{waitUntil:'load'});
  const fields=await page.locator('form input,form select,form textarea').evaluateAll(els=>[...new Set(els.map(el=>el.name))]);
  const main=await page.locator('main').innerText();
  const disabled=await page.locator('form button[type=submit]').isDisabled();
  await page.screenshot({path:'__OUTPUT__/contact-no-js-mobile.png',fullPage:true,animations:'disabled'});
  checks.push({scenario:'SIM-NO-JS',groups:fields,disabled,pass:fields.length===4&&disabled&&/javascript/i.test(main)&&/nothing|no (?:form|message)|cannot run/i.test(main)});
 }finally{await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});await cdp.detach();}
 return {checks,observations};
}