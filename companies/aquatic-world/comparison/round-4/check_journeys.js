async (page) => {
  const origin='__ORIGIN__';
  const checks=[];
  const categories=['ornamental-fish','aquatic-plants','driftwood'];
  const go=async(path)=>page.goto(origin+path);
  const clickMain=async(href)=>{
    await page.locator(`main a[href=${JSON.stringify(href)}]:visible`).first().click();
    // Click navigation can commit before a deferred form enhancement finishes.
    await page.waitForLoadState('load');
  };
  await page.setViewportSize({width:1440,height:900});
  await go('/');
  await clickMain('/collections/');
  checks.push({scenario:'IA-03',step:'Home to index',url:page.url(),pass:new URL(page.url()).pathname==='/collections/'});
  for(const slug of categories){
    const route=`/collections/${slug}/`;
    await go('/collections/');
    await clickMain(route);
    const heading=(await page.locator('h1').innerText()).trim();
    checks.push({scenario:'IA-03',step:'Index to category',slug,url:page.url(),heading,pass:new URL(page.url()).pathname===route && !!heading});
    const enquiry=await page.locator('main a[href*="/contact/?"]').first().getAttribute('href');
    await clickMain(enquiry);
    const context=await page.evaluate(()=>({
      values:[...document.querySelectorAll('select,input[type="checkbox"]:checked')].map(el=>el.value),
      text:document.querySelector('main')?.innerText
    }));
    checks.push({scenario:'IA-03',step:'Category to enquiry context',slug,url:page.url(),selected:context.values,
      pass:new URL(page.url()).pathname==='/contact/' && context.values.includes(slug)});
    await go(route);
    const breadcrumb=page.locator('main nav[aria-label*="breadcrumb" i]');
    await breadcrumb.locator('a[href="/collections/"]').click();
    checks.push({scenario:'IA-05',step:'Breadcrumb to index',slug,url:page.url(),pass:new URL(page.url()).pathname==='/collections/'});
    for(const sibling of categories.filter(value=>value!==slug)){
      await go(route);
      const href=`/collections/${sibling}/`;
      await clickMain(href);
      checks.push({scenario:'IA-05',step:'Sibling category',slug,sibling,url:page.url(),
        pass:new URL(page.url()).pathname===href && (await page.locator('h1').innerText()).trim()!==heading});
    }
    await go(route);
    await page.locator('header a[href="/"]').first().click();
    checks.push({scenario:'IA-05',step:'Logo to Home',slug,url:page.url(),pass:new URL(page.url()).pathname==='/'});
  }
  await go('/');
  await clickMain('/collections/');
  await clickMain('/collections/ornamental-fish/');
  await page.goBack();
  const back=new URL(page.url()).pathname;
  await page.goForward();
  const forward=new URL(page.url()).pathname;
  checks.push({scenario:'IA-04',step:'Back and Forward',back,forward,pass:back==='/collections/' && forward==='/collections/ornamental-fish/'});
  await go('/collections/');
  try {
    const popupPromise=page.context().waitForEvent('page',{timeout:5000});
    await page.locator('main a[href="/collections/aquatic-plants/"]').first().click({modifiers:['Meta']});
    const popup=await popupPromise;
    await popup.waitForURL(origin+'/collections/aquatic-plants/');
    await popup.waitForLoadState('domcontentloaded');
    const url=popup.url(),heading=await popup.locator('h1').innerText();
    checks.push({scenario:'IA-04',step:'Native modifier click opens a new tab',url,heading,pass:new URL(url).pathname==='/collections/aquatic-plants/' && !!heading});
    await popup.close();
  } catch(error){checks.push({scenario:'IA-04',step:'Native modifier click opens a new tab',pass:false,error:String(error)});}
  const response=await go('/missing-round-4-page/');
  const heading=await page.locator('h1').innerText();
  await clickMain('/');
  checks.push({scenario:'IA-06',status:response.status(),heading,recovery:page.url(),pass:response.status()===404 && new URL(page.url()).pathname==='/'});
  return {checks};
}
