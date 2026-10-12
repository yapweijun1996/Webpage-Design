"use strict";

(() => {
  const scene = document.querySelector("[data-aquatic-motion]");
  if (!scene) return;
  const frame = scene.querySelector(".scene-frame");
  const image = frame.querySelector("img");
  const fallback = frame.querySelector(".scene-fallback");
  const toggle = scene.querySelector("[data-motion-toggle]");
  const label = toggle.querySelector("[data-motion-label]");
  const icon = toggle.querySelector("[data-motion-icon]");
  const menu = document.querySelector(".mobile-menu");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let userPaused = false;
  let policyStopped = false;
  let optedIn = false;
  let lastReduced = false;
  let lastSaveData = false;
  let inView = false;
  let imageState = image.complete ? (image.naturalWidth > 0 ? "ready" : "error") : "loading";

  function syncPolicy() {
    const reduced = reducedMotion.matches;
    const saveData = Boolean(connection?.saveData);
    if ((reduced && !lastReduced) || (saveData && !lastSaveData)) {
      policyStopped = true;
      optedIn = false;
    }
    lastReduced = reduced;
    lastSaveData = saveData;
  }

  function render() {
    // Read exposed policy values on real lifecycle events too: some connections
    // do not deliver change events. There is deliberately no polling.
    syncPolicy();
    const ready = imageState === "ready";
    const running = ready && inView && !document.hidden && !menu?.open && !userPaused && !policyStopped;
    scene.dataset.motion = running ? "playing" : "paused";
    scene.dataset.optIn = String(optedIn);
    scene.dataset.effects = ready && !policyStopped ? "on" : "off";
    scene.dataset.image = imageState;
    image.hidden = imageState === "error";
    fallback.hidden = imageState !== "error";
    toggle.hidden = !ready;
    label.textContent = running ? "Pause animation" : "Play animation";
    icon.textContent = running ? "Ⅱ" : "▷";
  }

  toggle.addEventListener("click", () => {
    syncPolicy();
    if (scene.dataset.motion === "playing") {
      userPaused = true;
    } else {
      userPaused = false;
      policyStopped = false;
      optedIn = true;
    }
    render();
  });
  reducedMotion.addEventListener("change", render);
  connection?.addEventListener?.("change", render);
  document.addEventListener("visibilitychange", render);
  window.addEventListener("pageshow", render);
  menu?.addEventListener("toggle", render);
  image.addEventListener("load", () => {
    imageState = image.naturalWidth > 0 ? "ready" : "error";
    render();
  });
  image.addEventListener("error", () => {
    imageState = "error";
    render();
  });

  function checkView() {
    const rect = frame.getBoundingClientRect();
    inView = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    render();
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0;
      render();
    }, { threshold: 0 });
    observer.observe(frame);
  } else {
    window.addEventListener("scroll", checkView, { passive: true });
    window.addEventListener("resize", checkView);
  }
  checkView();
})();
