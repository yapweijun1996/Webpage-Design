// Progressive enhancement only: every page and link works without this file.
(() => {
  "use strict";

  /* ---------- Header: scrolled state and compact menu ---------- */
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const compact = window.matchMedia("(max-width: 1099.98px)");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  // Set by the Home scene below; the open menu suspends its animation.
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

  /* ---------- Home: ambient scene motion ----------
     One owner combines image readiness, visibility, the menu, the visitor's Pause and
     reduced-motion / Save-Data policy. Automatic gates only suspend; they never clear a
     Pause or policy stop. Only an explicit Play does that. */
  const scene = document.querySelector("[data-home-scene]");
  if (scene) {
    const frame = scene.querySelector(".home-scene-frame");
    const image = frame.querySelector("img");
    const button = scene.querySelector("[data-motion-toggle]");
    const label = button.querySelector("[data-motion-label]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    const saveData = () => Boolean(connection && connection.saveData);

    let imageState = image.complete ? (image.naturalWidth > 0 ? "ready" : "error") : "loading";
    let inView = false;
    let userPaused = false;
    let policyStopped = reducedMotion.matches || saveData();
    let optedIn = false;

    const render = () => {
      const ready = imageState === "ready";
      const running = ready && inView && !document.hidden && !isOpen() && !userPaused && !policyStopped;
      scene.dataset.image = imageState;
      scene.dataset.motion = running ? "playing" : "paused";
      scene.dataset.effects = ready && !policyStopped ? "on" : "off";
      scene.dataset.optIn = String(optedIn);
      button.hidden = !ready;
      const text = running ? "Pause animation" : "Play animation";
      if (label.textContent !== text) label.textContent = text;
    };

    button.addEventListener("click", () => {
      if (scene.dataset.motion === "playing") {
        userPaused = true;
      } else {
        userPaused = false;
        policyStopped = false;
        optedIn = true;
      }
      render();
    });

    // A change towards reduced motion or Save-Data stops; a change back alone cannot resume.
    const applyPolicy = () => {
      if (reducedMotion.matches || saveData()) {
        policyStopped = true;
        optedIn = false;
      }
      render();
    };
    reducedMotion.addEventListener("change", applyPolicy);
    if (connection && typeof connection.addEventListener === "function") connection.addEventListener("change", applyPolicy);

    image.addEventListener("load", () => { imageState = image.naturalWidth > 0 ? "ready" : "error"; render(); });
    image.addEventListener("error", () => { imageState = "error"; render(); });
    document.addEventListener("visibilitychange", render);
    onMenuChange = render;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; render(); }, { threshold: 0 }).observe(frame);
    } else {
      const checkView = () => {
        const r = frame.getBoundingClientRect();
        inView = r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
        render();
      };
      window.addEventListener("scroll", checkView, { passive: true });
      window.addEventListener("resize", checkView);
      checkView();
    }
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
