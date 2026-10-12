"use strict";

(() => {
  const scene = document.querySelector("[data-aquatic-motion]");
  const frame = scene.querySelector(".scene-frame");
  const image = scene.querySelector("img");
  const toggle = scene.querySelector("[data-motion-toggle]");
  const label = toggle.querySelector("[data-motion-label]");
  const icon = toggle.querySelector("[data-motion-icon]");
  const menu = document.querySelector("#review-menu");
  const openMenu = document.querySelector("[data-menu-open]");
  const closeMenu = menu.querySelector("[data-menu-close]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let userPaused = false;
  let policyStopped = reducedMotion.matches || Boolean(connection?.saveData);
  let optedIn = false;
  let inView = false;
  let imageReady = image.complete && image.naturalWidth > 0;

  function render() {
    const running = imageReady && inView && !document.hidden && !menu.open && !userPaused && !policyStopped;
    scene.dataset.motion = running ? "playing" : "paused";
    scene.dataset.optIn = String(optedIn);
    scene.dataset.effects = imageReady && !policyStopped ? "on" : "off";
    toggle.hidden = !imageReady;
    label.textContent = running ? "Pause animation" : "Play animation";
    icon.textContent = running ? "Ⅱ" : "▷";
  }

  toggle.addEventListener("click", () => {
    if (scene.dataset.motion === "playing") {
      userPaused = true;
    } else {
      userPaused = false;
      policyStopped = false;
      optedIn = true;
    }
    render();
  });

  function stopForPolicy() {
    if (reducedMotion.matches || connection?.saveData) {
      policyStopped = true;
      optedIn = false;
    }
    // Returning to the default preference cannot erase a policy stop.
    render();
  }
  reducedMotion.addEventListener("change", stopForPolicy);
  connection?.addEventListener("change", stopForPolicy);
  document.addEventListener("visibilitychange", render);
  image.addEventListener("load", () => { imageReady = image.naturalWidth > 0; render(); });
  image.addEventListener("error", () => { imageReady = false; render(); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0;
      render();
    }, { threshold: 0 });
    observer.observe(frame);
  } else {
    const checkView = () => {
      const rect = frame.getBoundingClientRect();
      inView = rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      render();
    };
    addEventListener("scroll", checkView, { passive: true });
    addEventListener("resize", checkView);
    checkView();
  }

  if (typeof menu.showModal === "function") {
    openMenu.hidden = false;
    openMenu.addEventListener("click", () => {
      menu.showModal();
      openMenu.setAttribute("aria-expanded", "true");
      closeMenu.focus();
      render();
    });
    closeMenu.addEventListener("click", () => menu.close());
    menu.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const items = [...menu.querySelectorAll("button:not([disabled]), a[href]")];
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    menu.addEventListener("click", event => {
      const rect = menu.getBoundingClientRect();
      if (event.target === menu && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) menu.close();
    });
    menu.addEventListener("close", () => {
      openMenu.setAttribute("aria-expanded", "false");
      openMenu.focus();
      render();
    });
  }
  render();
})();
