/* Prepared real-browser acceptance. HTTP loopback only; no file URL workaround.
   Requires an already installed Playwright package and an owned running preview. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'screenshots');
const reportPath = path.join(__dirname, 'browser-results.json');
const base = process.env.AQUATIC_BASE_URL || `http://127.0.0.1:${process.env.AQUATIC_PREVIEW_PORT || 4201}`;
const origin = new URL(base);
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname), 'Only an owned loopback preview is allowed');
assert.equal(origin.protocol, 'http:');
const routes = ['/', '/collections/', '/collections/ornamental-fish/', '/collections/aquatic-plants/',
  '/collections/driftwood/', '/our-story/', '/quality/', '/contact/'];
const globalRoutes = ['/', '/collections/', '/our-story/', '/quality/', '/contact/'];
const categories = ['ornamental-fish', 'aquatic-plants', 'driftwood'];
const sizes = [[1440,900],[1024,900],[768,1024],[390,844],[360,844],[320,844]];
const checks = [], errors = [], requests = [];
let browser;
function pass(name, details = {}) { checks.push({check:name,status:'pass',...details}); }
function slug(route) { return route === '/' ? 'home' : route.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','-'); }
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async img => {
      img.loading = 'eager';
      try { await img.decode(); } catch { /* Report below instead of hiding broken images. */ }
    }));
    window.scrollTo({top:0,behavior:'instant'});
  });
}
async function fresh(page, route) {
  const response = await page.goto(base + route);
  await settle(page);
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('main h1').count(), 1);
  return (await page.locator('main h1').innerText()).replace(/\s+/g,' ').trim();
}
async function layout(page, route, width, height) {
  const state = await page.evaluate(() => {
    const box = el => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
    const visible = el => el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden';
    const controls = [...document.querySelectorAll('.site-header .brand, .desktop-nav a, .header-cta, .mobile-menu>summary')].filter(visible);
    const field = document.querySelector('#name');
    const label = document.querySelector('label[for="name"]');
    return {scrollY,overflow:document.documentElement.scrollWidth > innerWidth,
      header:box(document.querySelector('.site-header')),
      controls:controls.map(el => ({text:el.innerText,...box(el),font:parseFloat(getComputedStyle(el).fontSize)})),
      broken:[...document.images].filter(img=>!img.complete || !img.naturalWidth).map(img=>img.src),
      current:[...document.querySelectorAll('.desktop-nav [aria-current]')].map(el=>({href:el.getAttribute('href'),current:el.getAttribute('aria-current')})),
      firstField:field ? box(field) : null, firstLabel:label ? box(label) : null,
      heroCopy:document.querySelector('.hero-inner') ? box(document.querySelector('.hero-inner')) : null,
      heroImage:document.querySelector('.hero-image') ? box(document.querySelector('.hero-image')) : null};
  });
  assert.equal(state.scrollY,0,'First-screen must be scroll zero');
  assert.equal(state.overflow,false,`${route} at ${width}: horizontal overflow`);
  assert.deepEqual(state.broken,[]);
  assert.ok(state.header.height >= (width <= 767 ? 64 : 72) && state.header.height <= (width <= 767 ? 72 : 84));
  for (const c of state.controls) {
    assert.ok(c.height >= 44 && c.x >= 0 && c.right <= width, 'Header target fits and is at least 44px');
  }
  for (let i=0;i<state.controls.length;i++) for (let j=i+1;j<state.controls.length;j++) {
    const a=state.controls[i], b=state.controls[j];
    assert.ok(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y, 'Visible header controls must not overlap');
  }
  if(width >= 1120) {
    for (const c of state.controls.slice(1,-1)) assert.ok(c.font>=15,'Desktop labels remain readable');
  }
  const expected = route.startsWith('/collections/') ? '/collections/' : route;
  assert.equal(state.current[0].href, expected);
  assert.equal(state.current[0].current, route.startsWith('/collections/') && route !== '/collections/' ? 'location' : 'page');
  if(route === '/contact/' && width === 390) {
    assert.ok(state.firstLabel.y >= 0 && state.firstField.bottom <= height,'First labeled editable field fully visible at scroll zero');
    const hit = await page.locator('#name').evaluate(el => { const r=el.getBoundingClientRect(); return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===el; });
    assert.equal(hit,true);
  }
  if(route==='/' && width >= 768 && width <= 1119) assert.ok(state.heroCopy.bottom <= state.heroImage.y, 'Copy must be separate from the fish photo');
  pass(`${route} ${width}×${height} closed first viewport`,state);
}
async function main() {
  let pw;
  try { pw = require(process.env.AQUATIC_PLAYWRIGHT_MODULE || 'playwright'); }
  catch (error) {
    fs.writeFileSync(reportPath,JSON.stringify({status:'not_run',reason:'Playwright module unavailable in default Node resolution',base,detail:error.code},null,2)+'\n');
    console.error('not_run: supply an already installed Playwright module via AQUATIC_PLAYWRIGHT_MODULE. No browser was launched.');
    process.exitCode=2; return;
  }
  browser=await pw.chromium.launch({headless:true, ...(process.env.AQUATIC_CHROME_PATH ? {executablePath:process.env.AQUATIC_CHROME_PATH} : {})});
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.route('**/*', async route => {
    const req=route.request(), url=new URL(req.url());
    if(url.origin!==origin.origin || !['GET','HEAD'].includes(req.method())) {
      requests.push({method:req.method(),origin:url.origin}); await route.abort();
    } else await route.continue();
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',msg=>{if(['error','warning'].includes(msg.type())) errors.push(msg.text());});
  fs.mkdirSync(output,{recursive:true});
  const headings = new Map();
  for(const [width,height] of sizes) {
    await page.setViewportSize({width,height});
    for(const route of routes) {
      const h=await fresh(page,route); headings.set(route,h);
      await page.reload(); await settle(page);
      assert.equal((await page.locator('main h1').innerText()).replace(/\s+/g,' ').trim(),h);
      await layout(page,route,width,height);
      await page.screenshot({path:path.join(output,`${slug(route)}-${width}-first.png`)});
      if([1440,390].includes(width)) await page.screenshot({path:path.join(output,`${slug(route)}-${width}-full.png`),fullPage:true});
    }
  }
  assert.equal(new Set(headings.values()).size,8);
  for(const width of [430,1119,1120,1920]) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) { await fresh(page,route); await layout(page,route,width,900); }
  }
  await page.setViewportSize({width:1440,height:900});
  for(const start of ['/','/quality/','/contact/']) for(const area of ['.desktop-nav','.footer-nav[aria-label="Footer navigation"]']) for(const dest of globalRoutes) {
    await fresh(page,start); await page.locator(`${area} a[href="${dest}"]`).click();
    assert.equal(new URL(page.url()).pathname,dest);
    assert.equal((await page.locator('main h1').innerText()).replace(/\s+/g,' ').trim(),headings.get(dest));
  }
  pass('IA-02 global header/footer destinations from Home/Quality/Contact');
  for(const category of categories) {
    await fresh(page,'/'); await page.locator('.hero-copy .button').click();
    await page.locator(`.category-card[href="/collections/${category}/"]`).click();
    await page.reload(); assert.equal(new URL(page.url()).pathname,`/collections/${category}/`);
    const crumbs=await page.locator('.breadcrumb a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
    assert.deepEqual(crumbs,['/','/collections/']);
    for(const sibling of categories.filter(c=>c!==category)) {
      await page.locator(`.sibling-card[href="/collections/${sibling}/"]`).click();
      assert.equal(new URL(page.url()).pathname,`/collections/${sibling}/`); await page.goBack();
    }
    await page.locator(`a[href="/contact/?category=${category}#enquiry"]`).first().click();
    assert.equal(await page.locator('#category').inputValue(),category);
    await page.goBack(); assert.equal(new URL(page.url()).pathname,`/collections/${category}/`);
    await page.goForward(); assert.equal(await page.locator('#category').inputValue(),category);
    await fresh(page,`/collections/${category}/`);
    await page.locator('.sibling-section a[href="/collections/"]').click();
    const popupPromise=context.waitForEvent('page');
    await page.locator(`.category-card[href="/collections/${category}/"]`).click({modifiers:[process.platform==='darwin'?'Meta':'Control']});
    const popup=await popupPromise; await popup.waitForLoadState();
    assert.equal(new URL(popup.url()).pathname,`/collections/${category}/`); await popup.close();
  }
  pass('IA-03/04/05 real category journeys, prefill, siblings, breadcrumbs, history and new tabs');
  await fresh(page,'/quality/'); await page.locator('.site-header .brand').click();
  assert.equal(new URL(page.url()).pathname,'/'); pass('Logo returns Home');
  const missing=await page.goto(base+'/uncharted-water/'); assert.equal(missing.status(),404);
  assert.match(await page.locator('main').innerText(),/Uncharted waters/);
  await page.locator('main .button').click(); assert.equal(new URL(page.url()).pathname,'/'); pass('IA-06 real HTTP 404 and recovery');
  for(const width of [320,390,768,1024]) {
    await page.setViewportSize({width,height:844}); await fresh(page,'/contact/');
    await page.locator('.mobile-menu>summary').press('Enter');
    assert.equal(await page.locator('.mobile-menu').getAttribute('open'),'');
    await page.locator('.mobile-menu>summary').press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'/');
    await page.screenshot({path:path.join(output,`menu-${width}-open-focus.png`)});
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null);
    assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
    await page.locator('.mobile-menu>summary').click(); await page.locator('.mobile-menu>summary').click();
    assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null);
    await page.locator('.mobile-menu>summary').click(); await page.locator('main h1').click();
    assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null);
  }
  pass('NAV-02 compact menu Enter/Tab/Escape/Close/outside dismissal');
  await fresh(page,'/contact/'); await page.locator('.mobile-menu>summary').click();
  await page.locator('.mobile-menu a[href="/quality/"]').focus();
  await page.setViewportSize({width:1440,height:900});
  assert.equal(await page.evaluate(()=>document.activeElement.closest('nav')?.className),'desktop-nav');
  pass('Compact-to-desktop resize keeps focus visible');
  await page.setViewportSize({width:390,height:844}); await fresh(page,'/contact/');
  await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
  await page.keyboard.press('Enter'); assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
  const tabOrder=[];
  for(let i=0;i<20;i++) {
    await page.keyboard.press('Tab');
    tabOrder.push(await page.evaluate(()=>document.activeElement.id || document.activeElement.textContent.trim()));
    if(tabOrder.at(-1)==='Explore the collections↗') break;
  }
  const helpIndex=tabOrder.findIndex(s=>s.startsWith('Explore the collections'));
  assert.ok(helpIndex>=0 && tabOrder.indexOf('name')>=0);
  const editableIds=['name','email','category','project','preview-button','clear-brief'];
  for(let i=0;i<editableIds.length;i++) {
    assert.ok(tabOrder.indexOf(editableIds[i])>=0 && tabOrder.indexOf(editableIds[i])<helpIndex);
    if(i) assert.ok(tabOrder.indexOf(editableIds[i-1])<tabOrder.indexOf(editableIds[i]));
  }
  pass('NAV-03 skip and actual Contact tab order',{tabOrder});
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:width===1440?900:844});
    await fresh(page,'/contact/'); await page.locator('#preview-button').click();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'error-summary');
    assert.equal(await page.locator('#error-summary a').count(),3);
    await page.locator('#error-summary a[href="#name"]').click();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'name');
    await page.locator('#name').fill('Sample Aquascaper');
    await page.locator('#email').fill('invalid'); await page.locator('#project').fill('short');
    await page.locator('#preview-button').click(); assert.equal(await page.locator('#error-summary a').count(),2);
    await page.screenshot({path:path.join(output,`contact-${width}-errors.png`),fullPage:true});
    await page.locator('#email').fill('sample@example.com');
    const literal='<img src=x onerror=alert(1)> An illustrative garden with green layers and open space.';
    await page.locator('#project').fill(literal); await page.locator('#preview-button').click();
    assert.equal(await page.locator('#preview-result').isVisible(),true);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'preview-result');
    assert.equal(await page.locator('#preview-content img').count(),0);
    assert.ok((await page.locator('#preview-content').innerText()).includes(literal));
    assert.match(await page.locator('#preview-title').innerText(),/Nothing was sent/);
    await page.screenshot({path:path.join(output,`contact-${width}-preview.png`),fullPage:true});
    await page.locator('#edit-brief').click(); assert.equal(await page.locator('#project').inputValue(),literal);
    await page.locator('#clear-brief').click();
    assert.equal(await page.locator('#name').inputValue(),'');
    assert.equal(await page.locator('#project').inputValue(),'');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'name');
    assert.equal(await page.locator('#preview-result').isVisible(),false);
  }
  pass('FORM-01 invalid/recovery/literal preview/edit/clear at 320/390/1440');
  for(const category of categories) {
    await fresh(page,`/contact/?category=${category}#enquiry`);
    await page.locator('#clear-brief').click(); assert.equal(await page.locator('#category').inputValue(),category);
  }
  await fresh(page,'/contact/?category=unknown'); assert.equal(await page.locator('#category').inputValue(),'general');
  pass('Clear preserves allowlisted category; unknown context is ignored');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain=await nojs.newPage();
  for(const route of routes) {
    await plain.goto(base+route); await plain.locator('.mobile-menu>summary').click();
    assert.equal(await plain.locator('.mobile-menu nav a[href="/quality/"]').isVisible(),true);
    await plain.locator('.mobile-menu nav a[href="/quality/"]').click();
    assert.equal(new URL(plain.url()).pathname,'/quality/');
  }
  await plain.goto(base+'/contact/'); assert.equal(await plain.locator('#preview-button').isDisabled(),true);
  assert.match(await plain.locator('noscript').innerText(),/No form submission is available/);
  await plain.screenshot({path:path.join(output,'contact-390-nojs.png'),fullPage:true});
  await nojs.close(); pass('NAV-04 all pages and honest Contact with JavaScript disabled');
  await page.setViewportSize({width:390,height:844}); await fresh(page,'/contact/');
  const scrollStates=[];
  for(const fraction of [0,0.5,1]) {
    await page.evaluate(f=>window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*f,behavior:'instant'}),fraction);
    await page.screenshot({path:path.join(output,`contact-scroll-${fraction}.png`)});
    scrollStates.push(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})));
  }
  assert.ok(scrollStates.every(s=>!s.overflow)); pass('Contact top/middle/bottom',{scrollStates});
  await page.setViewportSize({width:1440,height:900}); await fresh(page,'/quality/');
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('nav')?.className),'desktop-nav');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'solid');
  await page.screenshot({path:path.join(output,'header-1440-keyboard-focus.png')});
  await page.locator('.desktop-nav a[href="/collections/"]').hover();
  await page.screenshot({path:path.join(output,'header-1440-hover-current.png')});
  const reduced=await page.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior,
    transition:getComputedStyle(document.querySelector('.button')).transitionDuration}));
  assert.equal(reduced.scroll,'auto'); assert.equal(reduced.transition,'0s');
  pass('Desktop focus/hover/current and reduced motion',{reduced});
  assert.deepEqual(requests,[],'No outbound or submission requests');
  // A missing route may log its expected 404; keep other errors visible.
  const unexpected=errors.filter(e=>!e.includes('404 (Not Found)'));
  assert.deepEqual(unexpected,[]); pass('No unexpected page/console errors or outbound requests');
  fs.writeFileSync(reportPath,JSON.stringify({status:'pass',base,browserVersion:browser.version(),checks,console:errors,blockedRequests:requests},null,2)+'\n');
  console.log(`Browser acceptance passed: ${checks.length} checks. Review actual screenshots separately.`);
}
main().catch(error=>{
  fs.writeFileSync(reportPath,JSON.stringify({status:'fail',base,error:String(error),checks,console:errors,blockedRequests:requests},null,2)+'\n');
  console.error(error); process.exitCode=1;
}).finally(async()=>{if(browser) await browser.close();});
