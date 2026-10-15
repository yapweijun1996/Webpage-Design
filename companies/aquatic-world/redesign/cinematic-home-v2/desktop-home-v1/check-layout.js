async (page) => {
  const root = "http://127.0.0.1:4285/";
  const out = "output/playwright/aquatic-desktop-v1";
  const errors = [];
  const responses = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) responses.push({url: response.url(), status: response.status()}); });
  const result = {viewports: [], errors, responses};
  const sizes = [[1920,1080],[1440,900],[1280,800],[1280,720],[1024,768],[844,390],[640,360],[768,1024],[390,844],[320,568]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height});
    await page.goto(root);
    const landscape = width / height >= 1.2;
    if (landscape) {
      await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
      await page.evaluate(() => document.querySelector("video").pause());
    } else {
      await page.waitForFunction(() => document.querySelector(".home-environment img").complete);
    }
    const frames = [];
    for (const time of landscape ? [0,4,7.5,9.99] : [0]) {
      if (landscape) {
        await page.evaluate(time => new Promise((resolve,reject) => {
          const video = document.querySelector("video");
          const timer = setTimeout(() => reject(new Error("Painted seek timeout")), 5000);
          video.requestVideoFrameCallback((_, frame) => { clearTimeout(timer); resolve(frame.mediaTime); });
          video.currentTime = time;
        }), time);
      }
      const name = width + "x" + height + "-" + time.toFixed(2).replace(".", "-");
      await page.screenshot({path: out + "/" + name + ".png"});
      if (landscape && width >= 1024) {
        await page.locator(".home-arrival-copy").screenshot({path: out + "/copy-" + name + ".png"});
      }
      frames.push(await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
        const video = document.querySelector("video");
        return {time: video.currentTime, copy: box(".home-arrival-copy"), title: box("h1"),
          action: box(".home-arrival .home-primary"), header: box(".header-inner"),
          environment: box(".home-environment"), overflow: document.documentElement.scrollWidth > innerWidth,
          state: document.querySelector(".home-environment").dataset.state, videoSource: video.getAttribute("src"),
          media: {muted: video.muted, inline: video.playsInline, rate: video.playbackRate, loop: video.loop},
          wash: {background: getComputedStyle(document.querySelector(".home-arrival-copy"),"::before").backgroundImage,
            mask: getComputedStyle(document.querySelector(".home-arrival-copy"),"::before").maskImage}};
      }));
    }
    const first = frames[0];
    if (first.overflow) throw new Error("Horizontal overflow at " + width + "x" + height);
    if (first.action.bottom > height - 16) throw new Error("First-screen action clearance at " + width + "x" + height);
    if (first.copy.top < first.header.bottom + 12) throw new Error("Header/copy collision");
    if (!landscape && first.videoSource !== null) throw new Error("Unexpected portrait movie attachment");
    result.viewports.push({width,height,frames});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto(root);
  await page.locator(".ecosystem-chapter").nth(1).scrollIntoViewIfNeeded();
  await page.locator(".ecosystem-photo img").evaluateAll(images => Promise.all(images.map(img => img.decode())));
  await page.screenshot({path:out+"/desktop-chapters.png"});
  result.scrolledHeader = await page.evaluate(() => ({
    scrolled: document.querySelector(".site-header").dataset.scrolled,
    background: getComputedStyle(document.querySelector(".site-header")).backgroundColor,
    images: Array.from(document.querySelectorAll(".ecosystem-photo img")).map(img => ({src:img.getAttribute("src"), naturalWidth:img.naturalWidth}))
  }));
  await page.evaluate(() => scrollTo(0,document.documentElement.scrollHeight));
  await page.screenshot({path:out+"/desktop-footer.png"});
  return result;
}
