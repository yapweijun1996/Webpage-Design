async (page) => {
  const origin='__ORIGIN__', output='__OUTPUT__';
  const views=[{name:'desktop',width:1440,height:900},{name:'tablet',width:768,height:1024},{name:'mobile',width:390,height:844},{name:'phone360',width:360,height:800},{name:'phone320',width:320,height:800},{name:'phone430',width:430,height:932}];
  const observations=[],errors=[],failures=[];
  const onError=e=>errors.push(String(e)), onResponse=r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});};
  page.on('pageerror',onError); page.on('response',onResponse);
  for(const view of views){
    await page.setViewportSize({width:view.width,height:view.height});
    await page.goto(origin+'/contact/',{waitUntil:'networkidle'});
    // Load all lazy content for consistent full-page and total-height measurements.
    for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(30);}
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(el=>el.getBoundingClientRect().width>0).map(el=>el.decode().catch(()=>{})));scrollTo({top:0,left:0,behavior:'instant'});});
    await page.waitForTimeout(100);
    const state=await page.evaluate(()=>{
      const form=document.querySelector('form');
      const fields=[...form.querySelectorAll('input:not([type="hidden"]),select,textarea')].map(el=>{const r=el.getBoundingClientRect();return {id:el.id,name:el.name,type:el.type,top:r.top,bottom:r.bottom,height:r.height,font:parseFloat(getComputedStyle(el).fontSize),visible:el.checkVisibility(),required:el.required};});
      const headings=[...document.querySelectorAll('main h1,main h2,main h3')].map(el=>({text:el.innerText,visible:el.checkVisibility(),top:el.getBoundingClientRect().top}));
      const submit=form.querySelector('button[type="submit"]'), r=submit.getBoundingClientRect();
      return {width:innerWidth,height:innerHeight,scrollY,pageHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,fields,groups:[...new Set(fields.filter(el=>el.visible).map(el=>el.name))],headings,submit:{top:r.top,bottom:r.bottom,text:submit.innerText},headerHeight:document.querySelector('header').getBoundingClientRect().height};
    });
    observations.push({viewport:view.name,...state});
    await page.screenshot({path:`${output}/contact-${view.name}-first.png`,animations:'disabled'});
    await page.screenshot({path:`${output}/contact-${view.name}-full.png`,fullPage:true,animations:'disabled'});
  }
  page.removeListener('pageerror',onError);page.removeListener('response',onResponse);
  return {browser:await page.evaluate(()=>navigator.userAgent),observations,errors,failedResponses:failures};
}