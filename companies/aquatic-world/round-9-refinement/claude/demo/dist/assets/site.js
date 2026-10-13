// Progressive enhancement only: every page and link works without this file.
(() => {
  "use strict";

  /* ---------- Header: compact menu ----------
     The scrolled state (html.is-scrolled) is tracked by the inline <head> script. */
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  // Inner pages switch below 1100px; Home declares its own 1120px query on the header.
  const compact = window.matchMedia(header.dataset.compactQuery || "(max-width: 1099.98px)");

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  // Set by the Home environment below; the open menu suspends its film.
  let onMenuChange = () => {};
  function setMenu(open, { returnFocus = false } = {}) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".menu-text").textContent = open ? "Close" : "Menu";
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (!open && returnFocus) toggle.focus();
    onMenuChange();
  }

  toggle.addEventListener("click", () => setMenu(!isOpen()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setMenu(false, { returnFocus: true });
  });
  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) setMenu(false);
  });
  header.addEventListener("focusout", (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  compact.addEventListener("change", () => isOpen() && setMenu(false));
  // Back/Forward cache: a menu left open by choosing one of its links returns closed.
  window.addEventListener("pageshow", (event) => event.persisted && isOpen() && setMenu(false));

  /* ---------- Home: background environment film ----------
     One owner combines the visitor's Pause (kept for the tab session), reduced-motion / data-saving
     policy, autoplay refusal, media failure, the open menu and tab visibility. Automatic gates only
     suspend; they never clear a Pause or a policy stop. Only an explicit Play/Resume does that.
     The film's src is attached only when playback is wanted, so a poster state downloads no video.
     URLs and the orientation query come from the already-resolved HTML attributes. */
  const env = document.querySelector("[data-home-env]");
  const bgToggle = document.querySelector("[data-bg-toggle]");
  if (env && bgToggle) {
    const video = env.querySelector("video");
    const poster = env.querySelector("img");
    const bgLabel = bgToggle.querySelector("[data-bg-label]");
    const landscape = window.matchMedia(env.querySelector("source").media);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const connection = navigator.connection;
    const dataSaving = () => Boolean(connection && connection.saveData) || reducedData.matches;
    const PAUSE_KEY = "aquatic-world:background-paused";
    const storedPause = () => {
      try { return window.sessionStorage.getItem(PAUSE_KEY) === "1"; } catch { return false; }
    };
    const storePause = (paused) => {
      try {
        if (paused) window.sessionStorage.setItem(PAUSE_KEY, "1");
        else window.sessionStorage.removeItem(PAUSE_KEY);
      } catch { /* storage unavailable: the Pause still holds for this page view */ }
    };

    let userPaused = storedPause();
    let policyStopped = reducedMotion.matches || dataSaving();
    // null | "blocked" (autoplay refused) | "denied" (explicit Play refused too) | "error" (film unusable)
    let failure = video.canPlayType("video/mp4") ? null : "error";

    const wantsMotion = () => !userPaused && !policyStopped && failure === null;
    const sourceFor = () => (landscape.matches ? video.dataset.landscapeSrc : video.dataset.portraitSrc);

    function detach() {
      if (!video.hasAttribute("src")) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
      env.dataset.video = "none";
    }

    function play(explicit) {
      const src = sourceFor();
      if (video.getAttribute("src") !== src) {
        video.setAttribute("src", src);
        env.dataset.video = "loading";
      }
      const attempt = video.play();
      if (!attempt) return;
      attempt.catch((error) => {
        if (error.name === "NotAllowedError") failure = explicit ? "denied" : "blocked";
        else if (error.name === "NotSupportedError") failure = "error";
        // AbortError: a pause or source change interrupted the request; render() already reflects it.
        render();
      });
    }

    function render(explicit = false) {
      const run = wantsMotion() && !document.hidden && !isOpen();
      if (run && video.paused) play(explicit);
      else if (!run && !video.paused) video.pause();

      const action = wantsMotion() ? "pause" : userPaused ? "resume" : "play";
      const text = { pause: "Pause background", resume: "Resume background", play: "Play background" }[action];
      bgToggle.dataset.action = action;
      if (bgLabel.textContent !== text) bgLabel.textContent = text;
      // A control that cannot work is hidden: unusable film, or Play refused even after an explicit request.
      bgToggle.hidden = failure === "error" || failure === "denied";
      env.dataset.state = failure || (wantsMotion() ? "motion" : "poster");
    }

    bgToggle.addEventListener("click", () => {
      if (wantsMotion()) {
        userPaused = true;
        storePause(true);
        render();
        return;
      }
      userPaused = false;
      policyStopped = false;
      if (failure === "blocked") failure = null;
      storePause(false);
      render(true);
    });

    // A change towards reduced motion or data saving stops; a change back alone cannot resume.
    const applyPolicy = () => {
      if (reducedMotion.matches || dataSaving()) policyStopped = true;
      render();
    };
    reducedMotion.addEventListener("change", applyPolicy);
    reducedData.addEventListener("change", applyPolicy);
    if (connection && typeof connection.addEventListener === "function") connection.addEventListener("change", applyPolicy);

    // Orientation switch: the <picture> swaps the poster; an attached film is dropped and, if playback
    // is wanted, reattached from the other orientation's data attribute.
    landscape.addEventListener("change", () => {
      detach();
      if (failure === "error" && video.canPlayType("video/mp4")) failure = null;
      render();
    });

    video.addEventListener("playing", () => { env.dataset.video = "shown"; });
    video.addEventListener("error", () => {
      if (!video.hasAttribute("src")) return; // the error of a deliberate detach
      failure = "error";
      env.dataset.video = "none";
      render();
    });
    const posterFailed = () => { env.dataset.poster = "error"; };
    poster.addEventListener("error", posterFailed);
    poster.addEventListener("load", () => { env.dataset.poster = "ready"; });
    if (poster.complete && poster.naturalWidth === 0 && poster.currentSrc) posterFailed();

    document.addEventListener("visibilitychange", () => render());
    onMenuChange = () => render();
    // Leaving Home stops the film; a Back/Forward return re-reads the session Pause.
    window.addEventListener("pagehide", () => video.pause());
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      userPaused = storedPause();
      render();
    });

    env.dataset.video = "none";
    render();
  }

  /* ---------- Contact: enquiry brief preview ---------- */
  const form = document.querySelector("[data-enquiry-form]");
  if (!form) return;

  const summary = document.querySelector("[data-error-summary]");
  const summaryList = summary.querySelector("[data-error-list]");
  const summaryCount = summary.querySelector("[data-error-count]");
  const preview = document.querySelector("[data-preview]");
  const previewList = preview.querySelector("[data-preview-list]");
  // The editable-state disclosure; the preview carries its own "Nothing was sent" status instead.
  const localNote = document.querySelector("[data-local-note]");
  const categoryNames = {
    "ornamental-fish": "Ornamental Fish",
    "aquatic-plants": "Aquatic Plants",
    driftwood: "Driftwood",
    "not-sure": "Not sure yet",
  };

  form.querySelectorAll("[data-requires-js]").forEach((el) => (el.disabled = false));

  // Prefill collections from ?interest=slug (repeatable or comma separated).
  const params = new URLSearchParams(window.location.search);
  const requested = params.getAll("interest").flatMap((v) => v.split(",")).filter((v) => v in categoryNames);
  requested.forEach((slug) => {
    const box = form.querySelector(`input[name="interest"][value="${slug}"]`);
    if (box) box.checked = true;
  });
  // Category context sits inside the Collection(s) group; it is shown only for a valid prefill.
  const context = document.querySelector("[data-context]");
  const interestGroup = form.querySelector('[data-field="interest"]');
  const setContext = (show) => {
    context.hidden = !show;
    const ids = ["f-interest-hint", "f-interest-error"];
    interestGroup.setAttribute("aria-describedby", (show ? [context.id, ...ids] : ids).join(" "));
  };
  if (requested.length) {
    const first = requested[0];
    const text = context.querySelector("[data-context-text]");
    const link = context.querySelector("[data-context-link]");
    if (first === "not-sure") {
      text.textContent = "Preselected: Not sure yet.";
      link.textContent = "Browse the collections";
    } else {
      text.textContent = `Preselected from ${categoryNames[first]}.`;
      link.textContent = `Back to ${categoryNames[first]}`;
      link.href = link.getAttribute("href") + `${first}/`;
    }
    setContext(true);
  }

  // form.name is the form's own attribute, so controls are always read through form.elements.
  const field = (name) => form.elements.namedItem(name);

  const rules = {
    name: () => (field("name").value.trim() ? "" : "Enter your name."),
    email: () => {
      const value = field("email").value.trim();
      if (!value) return "Enter an email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : "Enter an email address in the format name@example.com.";
    },
    interest: () => (form.querySelector('input[name="interest"]:checked') ? "" : "Choose at least one collection, or “Not sure yet”."),
    project: () => {
      const length = field("project").value.trim().length;
      if (!length) return "Describe the project in a sentence or two.";
      return length < 20 ? `Add a little more detail (${length} of 20 characters).` : "";
    },
  };
  const fieldTarget = { name: "f-name", email: "f-email", project: "f-project", interest: null };
  const firstControl = (name) =>
    fieldTarget[name] ? document.getElementById(fieldTarget[name]) : form.querySelector(`input[name="${name}"]`);

  function showFieldError(name, message) {
    const wrapper = form.querySelector(`[data-field="${name}"]`);
    wrapper.classList.toggle("has-error", Boolean(message));
    wrapper.querySelector(`[data-error-for="${name}"]`).textContent = message;
    const controls = name === "interest" ? form.querySelectorAll('input[name="interest"]') : [firstControl(name)];
    controls.forEach((el) => (message ? el.setAttribute("aria-invalid", "true") : el.removeAttribute("aria-invalid")));
  }

  function renderSummary(errors) {
    summaryList.replaceChildren(
      ...errors.map(([name, message]) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${firstControl(name).id || fieldTarget[name]}`;
        a.textContent = message;
        a.addEventListener("click", (event) => {
          event.preventDefault();
          firstControl(name).focus();
        });
        li.append(a);
        return li;
      }),
    );
    summaryCount.textContent = errors.length === 1 ? "1 field" : `${errors.length} fields`;
    summary.hidden = errors.length === 0;
  }

  const validate = () =>
    Object.entries(rules)
      .map(([name, rule]) => [name, rule()])
      .filter(([, message]) => message);

  // Recover as the visitor corrects: re-check fields that already show an error.
  form.addEventListener("input", (event) => {
    const name = event.target.name;
    if (!(name in rules)) return;
    const wrapper = form.querySelector(`[data-field="${name}"]`);
    if (!wrapper.classList.contains("has-error")) return;
    showFieldError(name, rules[name]());
    if (!summary.hidden) renderSummary(validate().filter(([n]) => form.querySelector(`[data-field="${n}"]`).classList.contains("has-error")));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = validate();
    Object.keys(rules).forEach((name) => showFieldError(name, errors.find(([n]) => n === name)?.[1] ?? ""));
    renderSummary(errors);
    if (errors.length) {
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ block: "start" });
      return;
    }
    const data = new FormData(form);
    const rows = [
      ["Name", data.get("name")],
      ["Email", data.get("email")],
      ["Collections", data.getAll("interest").map((v) => categoryNames[v]).join(", ")],
      ["Project", data.get("project")],
    ];
    previewList.replaceChildren(
      ...rows.map(([label, value]) => {
        const div = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = String(value).trim();
        div.append(dt, dd);
        return div;
      }),
    );
    form.hidden = true;
    localNote.hidden = true;
    preview.hidden = false;
    // Focus without the browser's "nearest" scroll, then align the panel start below the sticky header
    // (html scroll-padding-top) so the "Nothing was sent" status is visible on phones.
    preview.focus({ preventScroll: true });
    preview.scrollIntoView({ block: "start" });
  });

  preview.querySelector("[data-edit]").addEventListener("click", () => {
    preview.hidden = true;
    form.hidden = false;
    localNote.hidden = false;
    field("name").focus();
  });
  preview.querySelector("[data-clear]").addEventListener("click", () => {
    form.reset();
    Object.keys(rules).forEach((name) => showFieldError(name, ""));
    renderSummary([]);
    // The prefill no longer applies: hide its context and drop the query so a reload starts empty too.
    setContext(false);
    if (location.search) history.replaceState(history.state, "", location.pathname);
    preview.hidden = true;
    form.hidden = false;
    localNote.hidden = false;
    field("name").focus();
  });
})();
