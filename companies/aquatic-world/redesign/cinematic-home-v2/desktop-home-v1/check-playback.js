async (page) => {
  const out = "output/playwright/aquatic-desktop-v1";
  const captures = [];
  const pending = [];
  await page.setViewportSize({width:1440,height:900});
  await page.goto("http://127.0.0.1:4285/");
  await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
  await page.exposeBinding("captureRawJoin", async (_, info) => {
    const promise = (async () => {
      const start = await page.evaluate(() => document.querySelector("video").currentTime);
      const file = "join-" + info.join + "-" + info.edge + ".png";
      await page.screenshot({path:out + "/" + file});
      const end = await page.evaluate(() => document.querySelector("video").currentTime);
      captures.push({...info,file,captureStartMediaTime:start,captureEndMediaTime:end});
    })();
    pending.push(promise);
    await promise;
  });
  await page.evaluate(async () => {
    const video = document.querySelector("video");
    video.pause();
    video.currentTime = 0;
    const stats = window.rawPlaybackCheck = {rate:video.playbackRate, frames:[], wraps:[], plays:[], started:performance.now(),complete:false};
    let previous = -1, play = 1;
    const before = new Set();
    const observe = (_, frame) => {
      const time = frame.mediaTime;
      if (time < previous - 1) {
        stats.wraps.push({from:previous,to:time,wallTime:performance.now()});
        if (stats.wraps.length <= 3) window.captureRawJoin({join:stats.wraps.length,edge:"after",callbackMediaTime:time});
        play++;
      }
      stats.frames.push({play,time});
      const current = stats.plays[play-1] ||= {play,frames:0,first:time,last:time};
      current.frames++;
      current.last = time;
      if (play <= 3 && time >= 9.7 && !before.has(play)) {
        before.add(play);
        window.captureRawJoin({join:play,edge:"before",callbackMediaTime:time});
      }
      if (stats.wraps.length >= 4) {
        video.pause();
        stats.elapsed=performance.now()-stats.started;
        stats.complete=true;
        return;
      }
      previous = time;
      video.requestVideoFrameCallback(observe);
    };
    video.requestVideoFrameCallback(observe);
    await video.play();
  });
  await page.waitForFunction(() => window.rawPlaybackCheck.complete, null, {timeout:50000});
  await Promise.all(pending);
  const stats = await page.evaluate(() => window.rawPlaybackCheck);
  const frames = stats.frames.length;
  delete stats.frames;
  if (stats.rate !== 1 || stats.wraps.length !== 4 || stats.plays.slice(0,4).some(play => play.first > .05 || play.last < 9.9)) {
    throw new Error("Incomplete forward raw playback");
  }
  return {...stats,frameCallbacks:frames,captures,loopVisualVerdict:"Raw scene reset remains visible; no seam edit applied."};
}
