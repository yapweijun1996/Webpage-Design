async (page) => {
  const origin = '__ORIGIN__';
  const source = '__SOURCE__';
  const checks = [];
  const routes = ['/', '/collections/', '/collections/ornamental-fish/', '/collections/aquatic-plants/', '/collections/driftwood/', '/our-story/', '/quality/', '/contact/'];
  const headings = {};
  await page.setViewportSize({width:1440,height:900});
  for (const path of routes) {
    const response = await page.goto(origin+path);
    headings[path] = await page.locator('h1').allTextContents();
    const title = await page.title();
    const before = await page.locator('main').innerText();
    const current = await page.locator('header nav a[aria-current]:visible').evaluateAll(elements => elements.map(el => ({href:el.getAttribute('href'),state:el.getAttribute('aria-current')})));
    const category = path.startsWith('/collections/') && path!=='/collections/';
    checks.push({scenario:'NAV-01-current',path,current,
      pass:current.length===1 && current[0].href===(category?'/collections/':path) && current[0].state===(category?'location':'page')});
    await page.reload();
    checks.push({scenario:'IA-01',path,status:response.status(),title,headings:headings[path],
      pass:response.status()===200 && headings[path].length===1 && before===(await page.locator('main').innerText())});
  }
  await page.goto(origin+source);
  const links = await page.locator('header a[href],footer a[href]').evaluateAll(elements =>
    elements.filter(el => el.getBoundingClientRect().width>0).map(el => ({
      area:el.closest('header')?'header':'footer',href:el.getAttribute('href'),text:el.innerText.trim()
    })));
  for (const [index,link] of links.entries()) {
    const target = new URL(link.href,origin+source);
    if (target.origin!==origin) {
      checks.push({scenario:'IA-02',source,...link,pass:false,reason:'External destination needs review'});
      continue;
    }
    await page.goto(origin+source);
    const selector = `${link.area} a[href=${JSON.stringify(link.href)}]:visible`;
    await page.locator(selector).first().click();
    const actual = new URL(page.url());
    const h1 = await page.locator('h1').allTextContents();
    const topUtility=link.area==='footer' && link.href==='#top' && /back to top/i.test(link.text) &&
      await page.evaluate(()=>!!document.getElementById('top'));
    checks.push({scenario:topUtility?'Utility-back-to-top':'IA-02',index,source,...link,url:page.url(),headings:h1,
      pass:(!link.href.startsWith('#') || topUtility) && actual.pathname===target.pathname && actual.search===target.search && actual.hash===target.hash &&
        JSON.stringify(h1)===JSON.stringify(headings[target.pathname])});
  }
  return {source,checks};
}
