"use strict";

(() => {
  const environment = document.querySelector('[data-home-environment]');
  if (!environment) return;
  const video = environment.querySelector('video');
  const poster = environment.querySelector('img');
  const control = document.querySelector('[data-motion-toggle]');
  const label = document.querySelector('[data-motion-label]');
  const pauseIcon = control.querySelector('[data-pause-icon]');
  const playIcon = control.querySelector('[data-play-icon]');
  const menu = document.querySelector('.mobile-menu');
  const summary = menu.querySelector('summary');
  const header = document.querySelector('.site-header');
  const headerInner = header.querySelector('.header-inner');
  const landscape = window.matchMedia('(min-aspect-ratio: 6/5)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 1119px)');
  const connection = navigator.connection;
  const storageKey = 'aquatic-world-ecosystem-local-background-stop';
  const failedSources = new Set();
  let userPaused = false;
  let policyStopped = false;
  let optedIn = false;
  let lastReduced = false;
  let lastSaveData = false;
  let autoplayBlocked = false;
  let leaving = false;
  let attachedOrientation = null;
  let hasFrame = false;
  let buffering = false;
  let playVersion = 0;
  let pendingPlay = false;

  try {
    const retained = window.sessionStorage.getItem(storageKey);
    userPaused = retained === 'paused';
    policyStopped = retained === 'policy';
  } catch {
    // Storage can be disabled; the current document still respects every stop.
  }

  function rememberStop() {
    try {
      if (userPaused || policyStopped) {
        window.sessionStorage.setItem(storageKey, userPaused ? 'paused' : 'policy');
      } else {
        window.sessionStorage.removeItem(storageKey);
      }
    } catch {
      // Preference persistence is optional; no enquiry data is stored here.
    }
  }

  function orientation() {
    return landscape.matches ? 'landscape' : 'portrait';
  }

  function syncPolicy() {
    const reduced = reducedMotion.matches;
    const saveData = Boolean(connection?.saveData);
    if ((reduced && !lastReduced) || (saveData && !lastSaveData)) {
      policyStopped = true;
      optedIn = false;
      rememberStop();
    }
    lastReduced = reduced;
    lastSaveData = saveData;
  }

  function wantsPlayback() {
    const restricted = reducedMotion.matches || Boolean(connection?.saveData);
    return !userPaused && !policyStopped && (!restricted || optedIn);
  }

  function temporarilySuspended() {
    return leaving || document.hidden || menu.open;
  }

  function canRun() {
    return landscape.matches && wantsPlayback() && !temporarilySuspended() && !autoplayBlocked
      && !failedSources.has(orientation());
  }

  function pause() {
    // Invalidating pending promises prevents a late play result from undoing a stop.
    playVersion += 1;
    pendingPlay = false;
    video.pause();
  }

  function render() {
    const failed = failedSources.has(orientation());
    const moving = wantsPlayback() && !autoplayBlocked;
    const action = userPaused ? 'Resume background' : moving ? 'Pause background' : 'Play background';
    environment.dataset.frame = hasFrame ? 'video' : 'poster';
    environment.dataset.state = !landscape.matches ? 'portrait-still' : failed ? 'unavailable'
      : autoplayBlocked ? 'blocked'
      : !wantsPlayback() ? 'paused'
      : temporarilySuspended() ? 'suspended'
      : buffering ? 'buffering'
      : hasFrame && !video.paused ? 'playing'
      : attachedOrientation ? 'loading' : 'poster';
    control.hidden = !landscape.matches || failed || menu.open;
    control.setAttribute('aria-label', action);
    control.title = action;
    label.textContent = action;
    pauseIcon.toggleAttribute('hidden', action !== 'Pause background');
    playIcon.toggleAttribute('hidden', action === 'Pause background');
    if (failed && document.activeElement === control) {
      document.querySelector('.home-arrival .home-primary').focus();
    }
  }

  function detachForOrientation() {
    if (!attachedOrientation || attachedOrientation === orientation()) return;
    pause();
    attachedOrientation = null;
    hasFrame = false;
    buffering = false;
    autoplayBlocked = false;
    environment.dataset.frame = 'poster';
    video.removeAttribute('src');
    video.preload = 'none';
    video.load();
  }

  function tryPlayback() {
    if (pendingPlay || !video.paused) return;
    const version = ++playVersion;
    pendingPlay = true;
    try {
      const attempt = video.play();
      if (!attempt || typeof attempt.then !== 'function') {
        pendingPlay = false;
        return;
      }
      attempt.then(() => {
        if (!canRun()) video.pause();
        if (version !== playVersion) return;
        pendingPlay = false;
        render();
      }).catch(error => {
        if (version !== playVersion) return;
        pendingPlay = false;
        if (error.name === 'AbortError') return;
        if (error.name === 'NotSupportedError') {
          failedSources.add(orientation());
          hasFrame = false;
        } else {
          autoplayBlocked = true;
        }
        video.pause();
        render();
      });
    } catch (error) {
      pendingPlay = false;
      if (error.name === 'NotSupportedError') failedSources.add(orientation());
      else autoplayBlocked = true;
      video.pause();
      render();
    }
  }

  function sync() {
    syncPolicy();
    detachForOrientation();
    environment.dataset.orientation = orientation();
    if (!canRun()) {
      pause();
      render();
      return;
    }
    if (!attachedOrientation) {
      attachedOrientation = orientation();
      // The packager rebases these literal HTML attributes. JS owns no root URLs.
      const prefix = attachedOrientation;
      video.poster = video.dataset[`${prefix}Poster`];
      video.muted = true;
      video.defaultMuted = true;
      video.preload = 'auto';
      video.src = video.dataset[`${prefix}Src`];
      video.load();
    }
    render();
    tryPlayback();
  }

  control.addEventListener('click', () => {
    syncPolicy();
    if (wantsPlayback() && !autoplayBlocked) {
      userPaused = true;
      optedIn = false;
    } else {
      userPaused = false;
      policyStopped = false;
      optedIn = true;
      autoplayBlocked = false;
    }
    rememberStop();
    sync();
  });

  video.addEventListener('playing', () => {
    syncPolicy();
    if (!canRun()) {
      pause();
    } else {
      hasFrame = true;
      buffering = false;
    }
    render();
  });
  video.addEventListener('pause', render);
  video.addEventListener('waiting', () => {
    buffering = true;
    render();
  });
  video.addEventListener('stalled', () => {
    buffering = true;
    render();
  });
  video.addEventListener('error', () => {
    if (!attachedOrientation || !video.error) return;
    failedSources.add(attachedOrientation);
    hasFrame = false;
    pause();
    render();
  });
  poster.addEventListener('load', () => {
    poster.hidden = false;
    environment.dataset.poster = 'ready';
  });
  poster.addEventListener('error', () => {
    poster.hidden = true;
    environment.dataset.poster = 'unavailable';
  });
  if (poster.complete) {
    poster.hidden = poster.naturalWidth === 0;
    environment.dataset.poster = poster.hidden ? 'unavailable' : 'ready';
  }

  // A disclosure leaves the page and ordinary tab order available.
  function updateMenuGeometry() {
    // Text enlargement can grow the bar beyond its normal minimum height.
    const barBottom = `${headerInner.getBoundingClientRect().bottom}px`;
    header.style.setProperty('--home-menu-top', barBottom);
    document.body.style.setProperty('--home-bar-bottom', barBottom);
  }

  function syncMenu() {
    updateMenuGeometry();
    summary.setAttribute('aria-expanded', String(menu.open));
    sync();
  }

  function closeMenu(restoreFocus = false) {
    menu.open = false;
    // Do not wait for the native, coalesced toggle event to restore movie state.
    syncMenu();
    if (restoreFocus) summary.focus();
  }

  menu.addEventListener('toggle', () => {
    syncMenu();
    if (menu.open) menu.querySelector('nav a').focus();
  });
  compact.addEventListener('change', event => {
    if (event.matches) return;
    const focusWasInside = menu.contains(document.activeElement);
    const focusedLink = focusWasInside && document.activeElement.closest('a');
    const href = focusedLink && focusedLink.getAttribute('href');
    closeMenu();
    if (focusWasInside) {
      const destination = href && Array.from(document.querySelectorAll('.desktop-nav a'))
        .find(anchor => anchor.getAttribute('href') === href);
      (destination || header.querySelector('.brand')).focus();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!menu.open) return;
    if (!header.contains(event.target) || event.target.closest('a')) closeMenu();
  });
  document.addEventListener('focusin', () => {
    if (menu.open && !header.contains(document.activeElement)) closeMenu();
  });
  window.addEventListener('resize', updateMenuGeometry);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateMenuGeometry).observe(headerInner);
  }

  reducedMotion.addEventListener('change', sync);
  connection?.addEventListener?.('change', sync);
  landscape.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => {
    leaving = true;
    pause();
    render();
  });
  window.addEventListener('pageshow', () => {
    leaving = false;
    // History may restore a cached disclosure and scroll position together.
    menu.open = false;
    updateHeader();
    syncMenu();
    // Recheck after the browser's restoration step without touching playback.
    window.requestAnimationFrame(updateHeader);
  });

  function updateHeader() {
    header.dataset.scrolled = String(window.scrollY > 0);
  }
  // Scrolling affects header readability only; it never changes the video timeline.
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  syncMenu();
})();
