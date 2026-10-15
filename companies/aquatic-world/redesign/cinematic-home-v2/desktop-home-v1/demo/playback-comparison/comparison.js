"use strict";

(() => {
  const cards = Array.from(document.querySelectorAll(".candidate")).map(node => ({
    node, frame: node.querySelector("iframe"), viewport: node.querySelector(".viewport"),
    status: node.querySelector(".status"), clock: node.querySelector(".clock")
  }));
  const start = document.querySelector("#start");
  const pause = document.querySelector("#pause");
  const readiness = document.querySelector("#readiness");
  let started = false;
  let paused = false;

  function inspect(card) {
    const doc = card.frame.contentDocument;
    return {video: doc?.querySelector("video"), environment: doc?.querySelector(".home-environment")};
  }

  function command(action) {
    cards.forEach(card => card.frame.contentWindow.postMessage({
      type: "aquatic-playback-review", action
    }, location.origin));
  }

  start.addEventListener("click", () => {
    started = true;
    paused = false;
    command("restart");
    start.firstChild.textContent = "Restart both from the start ";
    pause.disabled = false;
    pause.textContent = "Pause both";
  });
  pause.addEventListener("click", () => {
    paused = !paused;
    command(paused ? "pause" : "resume");
    pause.textContent = paused ? "Resume both" : "Pause both";
  });

  const observer = new ResizeObserver(() => {
    cards.forEach(card => { card.frame.style.transform = "scale(" + card.viewport.clientWidth / 1440 + ")"; });
  });
  cards.forEach(card => observer.observe(card.viewport));

  function update() {
    const ready = cards.every(card => inspect(card).environment?.dataset.orientation === "landscape");
    start.disabled = !ready;
    readiness.textContent = ready ? "Same film. Same layout. Compare after 10 seconds." : "Preparing the two Home previews…";
    cards.forEach(card => {
      const {video, environment} = inspect(card);
      if (!video || !environment?.dataset.orientation) return;
      const state = environment.dataset.state;
      const label = !started ? "Ready"
        : state === "ended" ? "Finished · Replay from the start"
        : state === "unavailable" ? "Film unavailable · open the full Home"
        : state === "blocked" ? "Playback blocked · open the full Home"
        : paused || state === "paused" ? "Paused"
        : state === "playing" ? "Playing"
        : state === "suspended" ? "Temporarily paused"
        : "Loading";
      if (card.status.textContent !== label) card.status.textContent = label;
      card.clock.textContent = Number(video.currentTime || 0).toFixed(1) + "s";
    });
  }
  let timer;
  function startUpdates() {
    clearInterval(timer);
    timer = setInterval(update, 250);
    update();
  }
  window.addEventListener("pagehide", () => clearInterval(timer));
  window.addEventListener("pageshow", startUpdates);
  startUpdates();
})();
