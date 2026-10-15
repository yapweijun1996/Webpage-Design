async (page) => {
  const root = "http://127.0.0.1:4285/";
  const out = "output/playwright/aquatic-desktop-v1";
  const checks = [];
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", error => pageErrors.push(String(error)));
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push({text:message.text(),url:message.location().url});
  });
  const check = (name, value) => { if (!value) throw new Error(name); checks.push({name,status:"pass"}); };
  const setHidden = hidden => page.evaluate(value => {
    window.testDocumentHidden=value;
    Object.defineProperty(document,"hidden",{configurable:true,get:() => window.testDocumentHidden});
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
  await page.setViewportSize({width:1440,height:900});
  await page.goto(root);
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.querySelector(".home-environment").dataset.state === "playing");
  await page.getByRole("button",{name:"Pause background",exact:true}).click();
  await page.reload();
  check("Manual pause survives reload",await page.locator("video").evaluate(video => video.paused && !video.getAttribute("src")));
  await page.getByRole("button",{name:"Resume background",exact:true}).click();
  await page.waitForFunction(() => document.querySelector(".home-environment").dataset.state === "playing");
  await setHidden(true);
  await page.waitForFunction(() => document.hidden && document.querySelector("video").paused);
  check("Simulated hidden document suspends video",true);
  await setHidden(false);
  await page.waitForFunction(() => !document.hidden && !document.querySelector("video").paused);
  check("Simulated visible document resumes eligible video",true);
  await page.getByRole("button",{name:"Pause background",exact:true}).click();
  await setHidden(true);
  await setHidden(false);
  check("Visibility does not undo a manual pause",await page.locator("video").evaluate(video => video.paused));
  await page.evaluate(() => {delete document.hidden; delete window.testDocumentHidden;});
  await page.getByRole("button",{name:"Resume background",exact:true}).click();
  await page.setViewportSize({width:1024,height:768});
  await page.locator(".mobile-menu > summary").click();
  await page.waitForFunction(() => document.querySelector("video").paused && document.activeElement === document.querySelector("#home-menu-links a"));
  check("Menu suspends film and focuses first link",true);
  await page.keyboard.press("Escape");
  check("Escape closes menu and restores focus",await page.locator(".mobile-menu").evaluate(menu => !menu.open && document.activeElement === menu.querySelector("summary")));
  await page.waitForFunction(() => !document.querySelector("video").paused);
  await page.locator(".mobile-menu > summary").click();
  await page.locator(".mobile-menu > summary").click();
  check("Visible Close dismisses menu",await page.locator(".mobile-menu").evaluate(menu => !menu.open));
  await page.locator(".mobile-menu > summary").click();
  await page.mouse.click(20, 640);
  check("Outside click dismisses menu",await page.locator(".mobile-menu").evaluate(menu => !menu.open));
  await page.waitForFunction(() => !document.querySelector("video").paused);
  check("Outside dismissal resumes eligible film",true);
  await page.setViewportSize({width:390,height:844});
  await page.reload();
  check("Portrait uses only its still",await page.locator("video").evaluate(video => video.paused && !video.getAttribute("src")));
  await page.locator(".mobile-menu > summary").click();
  await page.screenshot({path:out+"/phone-menu.png"});
  await page.keyboard.press("Escape");
  await page.locator(".ecosystem-chapter").nth(1).scrollIntoViewIfNeeded();
  await page.locator(".ecosystem-photo img").evaluateAll(images => Promise.all(images.map(img => img.decode())));
  await page.screenshot({path:out+"/phone-middle.png"});
  await page.evaluate(() => scrollTo(0,document.documentElement.scrollHeight));
  await page.screenshot({path:out+"/phone-bottom.png"});
  check("Portrait middle/bottom have no horizontal overflow",await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
  await page.setViewportSize({width:1440,height:900});
  await page.goto(root);
  await page.keyboard.press("Tab");
  check("Keyboard reaches skip link",await page.evaluate(() => document.activeElement.classList.contains("skip-link")));
  await page.keyboard.press("Enter");
  check("Skip link focuses main",await page.evaluate(() => document.activeElement.id === "main"));
  await page.locator(".home-arrival .home-primary").click();
  check("Home action opens real Collections",page.url()===root+"collections/");
  check("Inner page has no film",await page.locator("video").count()===0);
  await page.locator(".category-card").first().click();
  check("Category opens real Fish page",page.url()===root+"collections/ornamental-fish/");
  await page.locator(".fish-intro .button").click();
  check("Category context reaches Contact",new URL(page.url()).searchParams.get("category")==="ornamental-fish");
  await page.locator("#name").fill("Demo Visitor");
  await page.locator("#email").fill("demo@example.com");
  await page.locator("#project").fill("A planted aquarium with open water and branching driftwood.");
  await page.locator("#preview-button").click();
  check("Local preview shows sample brief",await page.locator("#preview-result").isVisible());
  await page.screenshot({path:out+"/local-contact-preview.png"});
  await page.locator("#edit-brief").click();
  check("Edit retains the draft",await page.locator("#name").inputValue()==="Demo Visitor");
  await page.locator("#preview-button").click();
  await page.locator("#clear-preview").click();
  check("Clear resets local preview",await page.locator("#name").inputValue()==="" && await page.locator("#enquiry-form").isVisible());
  await page.goBack();
  check("Back restores category URL",page.url()===root+"collections/ornamental-fish/");
  await page.goForward(); await page.reload();
  check("Direct Contact refresh keeps route context",await page.locator("#category").inputValue()==="ornamental-fish");
  for (const route of ["","collections/","collections/ornamental-fish/","collections/aquatic-plants/","collections/driftwood/","our-story/","quality/","contact/"]) {
    const response=await page.goto(root+route);
    check("Direct route "+(route||"Home"),response.status()===200 && await page.locator("h1").count()===1);
  }
  const missing=await page.goto(root+"missing-page/");
  check("Unknown route returns honest 404",missing.status()===404);
  await page.goto(root); await page.setViewportSize({width:1440,height:900});
  await page.evaluate(() => {
    const elements=Array.from(document.querySelectorAll("body *"));
    const sizes=elements.map(node => parseFloat(getComputedStyle(node).fontSize));
    elements.forEach((node,i) => node.style.fontSize=sizes[i]*2+"px");
  });
  check("200 percent text simulation has no document overflow",await page.evaluate(() => document.documentElement.scrollWidth===innerWidth));
  await page.locator(".home-arrival .home-primary").scrollIntoViewIfNeeded();
  check("Enlarged action remains reachable",await page.locator(".home-arrival .home-primary").isVisible());
  await page.screenshot({path:out+"/desktop-text-200.png"});
  await page.setViewportSize({width:720,height:450}); await page.goto(root);
  check("Half-width zoom-equivalent viewport fits",await page.evaluate(() => document.documentElement.scrollWidth===innerWidth));
  await page.screenshot({path:out+"/zoom-equivalent.png"});
  const policies=[];
  for (const policy of ["reduced-motion","save-data","movie-failure","autoplay-refusal"]) {
    const tab=await page.context().newPage();
    await tab.setViewportSize({width:1280,height:800});
    const requests=[];
    tab.on("request",request => {if(request.url().endsWith(".mp4")) requests.push(request.url());});
    if(policy==="reduced-motion") await tab.emulateMedia({reducedMotion:"reduce"});
    if(policy==="save-data") await tab.addInitScript(() => {Object.defineProperty(navigator.connection,"saveData",{value:true});});
    if(policy==="movie-failure") await tab.route("**/*.mp4",route => route.fulfill({status:503,body:"Test-only failure"}));
    if(policy==="autoplay-refusal") await tab.addInitScript(() => {
      HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException("Test-only refusal","NotAllowedError"));};
    });
    await tab.goto(root);
    if(policy==="movie-failure") await tab.waitForFunction(() => document.querySelector(".home-environment").dataset.state==="unavailable");
    if(policy==="autoplay-refusal") await tab.waitForFunction(() => document.querySelector(".home-environment").dataset.state==="blocked");
    const before=await tab.locator("video").evaluate(video => ({paused:video.paused,src:video.getAttribute("src")}));
    check(policy+" leaves title/action usable",await tab.locator("h1").isVisible() && await tab.locator(".home-arrival .home-primary").isVisible());
    if(policy==="reduced-motion" || policy==="save-data") {
      check(policy+" downloads no default movie",before.src===null && requests.length===0);
      await tab.getByRole("button",{name:"Play background",exact:true}).click();
      await tab.waitForFunction(() => !document.querySelector("video").paused && document.querySelector("video").readyState>=2);
      check(policy+" permits explicit opt-in",requests.length>0);
    }
    await tab.screenshot({path:out+"/policy-"+policy+".png"});
    policies.push({policy,before,movieRequests:requests.length});
    await tab.close();
  }
  await page.setViewportSize({width:1440,height:900}); await page.goto(root);
  const unexpectedConsoleErrors=consoleErrors.filter(error => error.url !== root+"missing-page/");
  if(pageErrors.length || unexpectedConsoleErrors.length) {
    throw new Error(JSON.stringify({pageErrors,unexpectedConsoleErrors}));
  }
  check("Normal browser journeys have no runtime errors",pageErrors.length===0 && unexpectedConsoleErrors.length===0);
  return {checks,policies,pageErrors,consoleErrors,visibilityScope:"Native tab activation kept both pages visible in this CLI browser; real hidden-tab behavior is not certified. Synthetic document.hidden transitions exercise the controller branch.",zoomScope:"200% text simulated with inline sizes; half-width CSS viewport checked. Native browser zoom was not measured."};
}
