async (page) => {
  const root="http://127.0.0.1:4285/";
  const out="output/playwright/aquatic-playback-comparison";
  const errors=[], httpErrors=[], requests=[], checks=[];
  page.on("pageerror",error=>errors.push(String(error)));
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
  page.on("response",response=>{if(response.status()>=400)httpErrors.push({url:response.url(),status:response.status()});});
  page.on("request",request=>{if(request.url().endsWith(".mp4"))requests.push(request.url());});
  const check=(name,condition)=>{if(!condition)throw new Error(name);checks.push({name,status:"pass"});};
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(root+"collections/");
  await page.evaluate(()=>sessionStorage.setItem("aquatic-world-ecosystem-local-background-stop","paused"));
  await page.goto(root+"playback-comparison/");
  await page.waitForFunction(()=>!document.querySelector("#start").disabled);
  const initial=await page.locator("iframe").evaluateAll(frames=>frames.map(frame=>{
    const doc=frame.contentDocument, video=doc.querySelector("video");
    return {loop:video.loop,source:video.getAttribute("src"),width:frame.contentWindow.innerWidth,height:frame.contentWindow.innerHeight,copy:doc.querySelector(".home-arrival-copy").getBoundingClientRect().toJSON()};
  }));
  check("Comparison uses identical desktop viewports",initial.every(frame=>frame.width===1440&&frame.height===900));
  check("Copy geometry is identical",JSON.stringify(initial[0].copy)===JSON.stringify(initial[1].copy));
  check("Modes differ only in repeat policy",initial[0].loop===false&&initial[1].loop===true);
  check("Review does not attach movies before explicit start",initial.every(frame=>frame.source===null)&&requests.length===0);
  await page.locator("iframe").evaluateAll(frames=>frames.forEach(frame=>{
    const win=frame.contentWindow, video=frame.contentDocument.querySelector("video");
    const stats=win.comparisonTelemetry={frames:0,first:null,last:null,wraps:0,ended:0};
    video.addEventListener("ended",()=>stats.ended++);
    function observe(_,data){
      if(stats.first===null)stats.first=data.mediaTime;
      if(stats.last!==null&&data.mediaTime<stats.last-1)stats.wraps++;
      stats.last=data.mediaTime;stats.frames++;
      if(stats.wraps<4)video.requestVideoFrameCallback(observe);
    }
    video.requestVideoFrameCallback(observe);
  }));
  await page.getByRole("button",{name:"Play both from the start",exact:true}).click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll("iframe")).every(frame=>frame.contentDocument.querySelector("video").readyState>=2));
  await page.waitForFunction(()=>document.querySelector('[data-mode="once"] iframe').contentDocument.querySelector("video").ended,null,{timeout:20000});
  const afterEnd=await page.locator("iframe").evaluateAll(frames=>frames.map(frame=>{
    const video=frame.contentDocument.querySelector("video");
    const quality=video.getVideoPlaybackQuality();
    return {ended:video.ended,paused:video.paused,time:video.currentTime,duration:video.duration,rate:video.playbackRate,state:frame.contentDocument.querySelector(".home-environment").dataset.state,stats:{...frame.contentWindow.comparisonTelemetry},quality:{total:quality.totalVideoFrames,dropped:quality.droppedVideoFrames,corrupted:quality.corruptedVideoFrames}};
  }));
  check("Single play ends naturally and retains its final frame",afterEnd[0].ended&&afterEnd[0].paused&&afterEnd[0].time===afterEnd[0].duration&&afterEnd[0].state==="ended");
  check("Single play presents the complete native take",afterEnd[0].quality.total===241&&afterEnd[0].quality.dropped===0&&afterEnd[0].quality.corrupted===0&&afterEnd[0].stats.first===0&&afterEnd[0].stats.last===10);
  check("Loop remains in motion",!afterEnd[1].paused&&!afterEnd[1].ended&&afterEnd[1].rate===1);
  await page.waitForFunction(()=>document.querySelector('[data-mode="loop"] iframe').contentWindow.comparisonTelemetry.wraps>=1);
  await page.screenshot({path:out+"/after-first-end.png"});
  await page.getByRole("button",{name:"Pause both",exact:true}).click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll("iframe")).every(frame=>frame.contentDocument.querySelector("video").paused));
  check("Pause stops both previews",true);
  await page.getByRole("button",{name:"Resume both",exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('[data-mode="loop"] iframe').contentDocument.querySelector("video").paused);
  check("Resume does not restart completed single play",await page.locator('[data-mode="once"] iframe').evaluate(frame=>frame.contentDocument.querySelector("video").ended));
  await page.waitForFunction(()=>document.querySelector('[data-mode="loop"] iframe').contentWindow.comparisonTelemetry.wraps>=4,null,{timeout:45000});
  const naturalPhase=await page.locator("iframe").evaluateAll(frames=>frames.map(frame=>{
    const quality=frame.contentDocument.querySelector("video").getVideoPlaybackQuality();
    return {...frame.contentWindow.comparisonTelemetry,quality:{total:quality.totalVideoFrames,dropped:quality.droppedVideoFrames,corrupted:quality.corruptedVideoFrames}};
  }));
  check("Loop completes four natural forward wraps",naturalPhase[1].wraps===4&&naturalPhase[1].first===0&&naturalPhase[1].last===0&&naturalPhase[1].quality.total>=964&&naturalPhase[1].quality.corrupted===0);
  check("Single play remains stopped through repeated loop joins",naturalPhase[0].ended===1&&naturalPhase[0].wraps===0&&naturalPhase[0].quality.total===241);
  await page.screenshot({path:out+"/after-four-loops.png"});
  await page.getByRole("button",{name:"Restart both from the start",exact:true}).click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll("iframe")).every(frame=>{
    const video=frame.contentDocument.querySelector("video");return !video.paused&&!video.ended&&video.currentTime<2;
  }));
  check("Restart returns both to forward playback from zero",true);
  check("Review leaves normal Home pause preference intact",await page.evaluate(()=>sessionStorage.getItem("aquatic-world-ecosystem-local-background-stop")==="paused"));
  await page.getByRole("button",{name:"Pause both",exact:true}).click();
  const layouts=[];
  for(const [width,height] of [[1440,1000],[1280,900],[900,900],[390,844],[320,568]]){
    await page.setViewportSize({width,height});
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:out+"/board-"+width+"x"+height+".png"});
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,cards:Array.from(document.querySelectorAll(".viewport")).map(node=>node.getBoundingClientRect().toJSON())}));
    check("Comparison layout "+width+"x"+height,!geometry.overflow&&geometry.cards.every(card=>card.left>=0&&card.right<=width));
    layouts.push({width,height,...geometry});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(root+"?playback=once");
  await page.waitForFunction(()=>document.querySelector(".home-environment").dataset.state==="ended",null,{timeout:20000});
  check("Standalone single play offers Replay",await page.getByRole("button",{name:"Replay background",exact:true}).isVisible());
  await page.screenshot({path:out+"/single-ended.png"});
  await page.setViewportSize({width:1024,height:768});
  await page.locator(".mobile-menu > summary").click();await page.keyboard.press("Escape");
  check("Menu close does not auto-replay a completed take",await page.locator("video").evaluate(video=>video.ended&&video.paused));
  await page.getByRole("button",{name:"Replay background",exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector("video").paused&&document.querySelector("video").currentTime<2);
  check("Standalone Replay restarts naturally",true);
  await page.getByRole("button",{name:"Pause background",exact:true}).click();
  await page.reload();
  check("Single play respects retained manual pause",await page.locator("video").evaluate(video=>video.paused&&!video.getAttribute("src")));
  await page.goto(root);
  check("Default Home remains looping and respects its own pause",await page.locator("video").evaluate(video=>video.loop&&video.paused&&!video.getAttribute("src")));
  check("Normal Home cannot receive review commands",await page.evaluate(()=>document.body.dataset.playbackReview==="false"));
  if(errors.length||httpErrors.length)throw new Error(JSON.stringify({errors,httpErrors}));
  return {checks,initial,afterEnd,naturalPhase,layouts,movieRequests:requests.length,movieUrls:Array.from(new Set(requests)),errors,httpErrors,sourceUnedited:true,loadingScope:"Both start at 0; independent loading is not frame-locked.",singlePlayScope:"Native ended state per page load; no encoded hold or loop repair."};
}
