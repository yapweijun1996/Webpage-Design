async (page) => {
  const runner = '__RUNNER__';
  const origin = '__ORIGIN__';
  const output = '__OUTPUT__';
  const routes = [
    ['home', '/'], ['collections', '/collections/'],
    ['fish', '/collections/ornamental-fish/'], ['plants', '/collections/aquatic-plants/'],
    ['driftwood', '/collections/driftwood/'], ['story', '/our-story/'],
    ['quality', '/quality/'], ['contact', '/contact/']
  ];
  const errors = [], failedRequests = [], errorResponses = [], layouts = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('requestfailed', request => failedRequests.push({url: request.url(), error: request.failure()?.errorText}));
  page.on('response', response => { if (response.status() >= 400) errorResponses.push({url: response.url(), status: response.status()}); });
  const inspect = async () => page.evaluate(() => {
    const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    return {
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map(el => el.innerText.trim()),
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      scrollY: window.scrollY,
      pageHeight: document.documentElement.scrollHeight,
      mainText: document.querySelector('main')?.innerText.trim(),
      images: [...document.images].map(el => ({src: el.currentSrc, rendered: visible(el), width: el.naturalWidth, alt: el.alt})),
      links: [...document.querySelectorAll('a[href]')].map(el => ({text: el.innerText.trim(), href: el.getAttribute('href'), current: el.getAttribute('aria-current'), inHeader: !!el.closest('header'), inFooter: !!el.closest('footer'), visible: visible(el)})),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(el => el.hash.length > 1 && !document.getElementById(decodeURIComponent(el.hash.slice(1)))).map(el => el.getAttribute('href')),
      header: (() => { const el = document.querySelector('header'); if (!el) return null; const r = el.getBoundingClientRect(); const css = getComputedStyle(el); return {x:r.x,y:r.y,width:r.width,height:r.height,position:css.position}; })(),
      outside: [...document.querySelectorAll('main *, header *, footer *')].filter(el => { if (!visible(el)) return false; const r=el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth+1; }).slice(0,12).map(el => ({tag:el.tagName,class:el.className})),
      controls: [...document.querySelectorAll('button,summary,input,textarea,select')].map(el => ({tag:el.tagName,text:el.innerText.trim(),name:el.getAttribute('aria-label'),type:el.getAttribute('type'),id:el.id}))
    };
  });
  const settle = async (scrollAll) => {
    if (scrollAll) {
      for (let y=0; y<await page.evaluate(() => document.documentElement.scrollHeight); y+=700) {
        await page.evaluate(y => scrollTo({top:y,left:0,behavior:'instant'}), y);
        await page.waitForTimeout(50);
      }
    }
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(el => el.getBoundingClientRect().width > 0).map(el => el.decode().catch(() => {})));
      if (document.fonts) await document.fonts.ready;
      scrollTo({top:0,left:0,behavior:'instant'});
    });
    await page.waitForTimeout(200);
  };
  for (const viewport of __VIEWPORTS__) {
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    for (const [name,path] of routes) {
      const response = await page.goto(origin+path,{waitUntil:'networkidle'});
      await settle(true);
      const item = await inspect();
      layouts.push({runner,route:path,page:name,viewport:viewport.name,httpStatus:response?.status(),...item});
      if (viewport.capture) {
        await page.screenshot({path:`${output}/${name}-${viewport.name}-first.png`,animations:'disabled'});
        await page.screenshot({path:`${output}/${name}-${viewport.name}-full.png`,fullPage:true,animations:'disabled'});
      }
    }
  }
  page.removeAllListeners('pageerror');
  page.removeAllListeners('requestfailed');
  page.removeAllListeners('response');
  return {runner,origin,browser:await page.evaluate(() => navigator.userAgent),layouts,errors,failedRequests,errorResponses};
}
