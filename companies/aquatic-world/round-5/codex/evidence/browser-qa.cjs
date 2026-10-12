// Optional real Chromium checks for an environment that permits loopback preview.
// No package installation, file URL, external service, or server startup is performed.
const fs = require('node:fs');
const path = require('node:path');
const reportPath = path.join(__dirname,'browser-results.json');
const result = {status:'not_run', method:'Playwright Chromium on loopback HTTP, when available', checks:[], screenshots:[], runtimeErrors:[], externalRequests:[]};
let playwright;
try {
  playwright = require(process.env.AQUATIC_PLAYWRIGHT_MODULE || 'playwright');
} catch (error) {
  result.reason = `An existing Playwright module is unavailable: ${error.code || error.message}. No install attempted.`;
  fs.writeFileSync(reportPath,JSON.stringify(result,null,2)+'\n');
  console.log(`Browser checks: not_run. ${result.reason}`);
  process.exit(0);
}
const base = new URL(process.env.AQUATIC_BASE_URL || 'http://127.0.0.1:4211/');
if (base.protocol !== 'http:' || base.hostname !== '127.0.0.1') throw new Error('Use the owned loopback HTTP server only.');
const routes = ['/','/collections/','/collections/ornamental-fish/','/collections/aquatic-plants/','/collections/driftwood/','/our-story/','/quality/','/contact/'];
const sizes = [[1440,900],[1024,900],[768,1024],[390,844],[360,800],[320,800]];
let browser;
function check(name, condition, detail) {
  result.checks.push({check:name,status:condition?'pass':'fail',...(detail?{detail}:{})});
}
async function capture(page, name, fullPage=false) {
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).map(img=>img.decode().catch(()=>{})));
  });
  const file = path.join('evidence/screenshots',`${name}.png`);
  await page.screenshot({path:path.join(__dirname,'..',file),fullPage});
  result.screenshots.push(file);
}
async function geometry(page, name, firstInput=false) {
  const detail = await page.evaluate(()=>{
    const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height};};
    return {width:innerWidth,height:innerHeight,scrollY,overflow:document.documentElement.scrollWidth>innerWidth,name:document.getElementById('name')?rect('name'):null,email:document.getElementById('email')?rect('email'):null};
  });
  check(`${name}: no horizontal overflow`,!detail.overflow,detail);
  if (firstInput) check(`${name}: top zero, Name <=320, Name/Email fully visible`,detail.scrollY===0&&detail.name.top<=320&&detail.name.bottom<=detail.height&&detail.email.bottom<=detail.height&&detail.name.height>=44&&detail.email.height>=44,detail);
}
(async()=>{
  try {
    browser = await playwright.chromium.launch({headless:true});
    const context = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
    const page = await context.newPage();
    page.on('pageerror',e=>result.runtimeErrors.push(e.message));
    page.on('console',msg=>{if(msg.type()==='error')result.runtimeErrors.push(msg.text());});
    page.on('request',req=>{if(new URL(req.url()).origin!==base.origin)result.externalRequests.push(req.url());});
    fs.mkdirSync(path.join(__dirname,'screenshots'),{recursive:true});
    const headings = new Set();
    for (const route of routes) {
      const response=await page.goto(new URL(route,base).href);
      const h1=await page.locator('h1').textContent(); headings.add(h1);
      check(`Direct load ${route}`,response.status()===200&&await page.locator('h1').count()===1);
      await page.reload();
      check(`Reload ${route}`,await page.locator('h1').textContent()===h1);
      for (const [width,height] of sizes) {
        await page.setViewportSize({width,height});
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await geometry(page,`${route} ${width}x${height}`,route==='/contact/'&&(width===360||width===390));
        if ([1440,390].includes(width)||route==='/contact/') await capture(page,`${route==='/'?'home':route.slice(1,-1).replaceAll('/','-')}-${width}x${height}-first`);
      }
    }
    check('Eight distinct substantive page headings',headings.size===8);
    const missing=await page.goto(new URL('/not-a-page/',base).href);
    check('Unknown route has real 404 recovery',missing.status()===404&&await page.getByText('404 · Uncharted waters').isVisible());
    await page.setViewportSize({width:1440,height:900});
    for (const slug of ['ornamental-fish','aquatic-plants','driftwood']) {
      await page.goto(new URL('/',base).href);
      await page.locator('main').getByRole('link',{name:'Explore the collections',exact:false}).first().click();
      await page.locator(`main a[href='/collections/${slug}/']`).first().click();
      const categoryURL=page.url();
      await page.locator(`main a[href='/contact/?category=${slug}#enquiry']`).first().click();
      check(`${slug}: real enquiry journey and prefill`,await page.locator('#category').inputValue()===slug);
      await page.goBack(); check(`${slug}: history Back`,page.url()===categoryURL);
      await page.goForward(); check(`${slug}: history Forward`,await page.locator('#category').inputValue()===slug);
    }
    await page.goto(new URL('/quality/',base).href);
    await page.locator("main a[href='/contact/#enquiry']").first().click();
    check('Quality journey uses open category context',await page.locator('#category').inputValue()==='general');
    await page.goto(new URL('/contact/?category=unrecognised',base).href);
    check('Unknown prefill falls back safely',await page.locator('#category').inputValue()==='general');
    await page.setViewportSize({width:390,height:844});
    await page.locator('#preview-button').click();
    check('Blank errors focus summary and mark three fields',await page.evaluate(()=>document.activeElement.id==='error-summary')&&await page.locator('[aria-invalid=true]').count()===3);
    await capture(page,'contact-errors-390x844');
    await page.locator('#error-summary a[href="#email"]').click();
    check('Error link focuses unobscured Email',await page.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect();return e.id==='email'&&r.top>=0&&r.bottom<=innerHeight&&document.elementFromPoint(r.left+10,r.top+10)===e;}));
    await page.locator('#name').fill('Sample Visitor');
    await page.locator('#email').fill('invalid');
    await page.locator('#project').fill('short');
    await page.locator('#preview-button').click();
    check('Invalid email and project stay associated',await page.locator('[aria-invalid=true]').count()===2);
    await page.locator('#email').fill('sample@example.com');
    const literal='<img src=x onerror=alert(1)> '+ 'LongAquaticComposition'.repeat(60)+'\nA second line.';
    await page.locator('#project').fill(literal);
    await page.locator('#category').selectOption('driftwood');
    await page.locator('#preview-button').click();
    check('Success has four safe rows and explicit nothing-sent message',await page.locator('#preview-content dt').count()===4&&await page.locator('#preview-content dd').last().textContent()===literal&&await page.locator('#preview-content img').count()===0&&await page.getByText('Preview created. Nothing was sent.',{exact:true}).isVisible());
    check('Preview focus and editable form visibility',await page.evaluate(()=>document.activeElement.id==='preview-result')&&!await page.locator('#enquiry-form').isVisible());
    await geometry(page,'Long preview 390x844');
    await capture(page,'contact-long-preview-390x844',true);
    await page.locator('#edit-brief').click();
    check('Edit preserves category/project',await page.locator('#category').inputValue()==='driftwood'&&await page.locator('#project').inputValue()===literal);
    await page.locator('#clear-brief').click();
    check('Clear empties all text and context',await page.locator('#name').inputValue()===''&&await page.locator('#email').inputValue()===''&&await page.locator('#project').inputValue()===''&&await page.locator('#category').inputValue()==='general');
    await page.goto(new URL('/contact/?category=driftwood',base).href);
    await page.locator('#clear-brief').click();
    check('Clear drops incoming context',await page.locator('#category').inputValue()==='general');
    const menu=page.locator('.mobile-menu');
    await menu.locator('summary').click();
    await capture(page,'contact-menu-open-390x844');
    await menu.locator('summary').press('Escape');
    check('Menu Escape closes and focuses summary',await menu.getAttribute('open')===null&&await page.evaluate(()=>document.activeElement.matches('.mobile-menu summary')));
    await page.keyboard.press('Control+Home');
    await page.locator('.skip-link').focus(); await page.keyboard.press('Enter');
    check('Keyboard skip link focuses main',await page.evaluate(()=>document.activeElement.id==='main'));
    await page.locator('#name').focus();
    await page.keyboard.press('Tab');
    check('Name then Email in keyboard order',await page.evaluate(()=>document.activeElement.id==='email'));
    await page.emulateMedia({reducedMotion:'reduce'});
    check('Reduced motion disables smooth scrolling',await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'));
    const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const offline=await noJS.newPage(); await offline.goto(new URL('/contact/',base).href);
    check('No-JS single visible notice and disabled preview',await offline.locator('.local-disclosure:visible').count()===1&&!await offline.locator('#preview-button').isEnabled()&&!await offline.locator('#name').isEnabled());
    await offline.locator('.mobile-menu summary').click();
    check('No-JS native menu remains usable',await offline.locator('.mobile-menu nav').isVisible());
    await offline.locator('.mobile-menu summary').click();
    await offline.locator('.contact-help summary').click();
    check('No-JS help remains available',await offline.getByText('Start with your setting, preferred colours or materials,',{exact:false}).isVisible());
    await capture(offline,'contact-no-js-390x844',true);
    await noJS.close();
    check('No runtime errors',result.runtimeErrors.length===0,result.runtimeErrors);
    check('No external requests',result.externalRequests.length===0,result.externalRequests);
    result.status=result.checks.some(c=>c.status==='fail')?'fail':'pass';
  } catch (error) {
    result.status=result.checks.length?'incomplete':'not_run';
    result.reason=error.message;
  } finally {
    if(browser)await browser.close();
    fs.writeFileSync(reportPath,JSON.stringify(result,null,2)+'\n');
    console.log(`Browser checks: ${result.status}; ${result.checks.length} actual assertions, ${result.screenshots.length} actual captures.`);
    if(result.reason)console.log(result.reason);
    process.exitCode=['fail','incomplete'].includes(result.status)?1:0;
  }
})();
