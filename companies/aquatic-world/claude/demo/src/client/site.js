// Progressive enhancement only: the page is complete and readable without this file.
// Brand-neutral: every label is read from data attributes rendered from configuration.
(function () {
  'use strict';

  var desktopNav = window.matchMedia('(min-width: 900px)');

  /* ---------- Header: scrolled state ---------- */
  var header = document.querySelector('[data-header]');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  var label = document.querySelector('[data-menu-label]');

  function focusables() {
    return [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])')));
  }
  function setMenu(open, restoreFocus) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var first = menu.querySelector('a[href]');
      if (first) first.focus();
    } else if (restoreFocus) {
      toggle.focus();
    }
  }
  function isOpen() { return toggle && toggle.getAttribute('aria-expanded') === 'true'; }

  if (toggle && menu) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () { setMenu(!isOpen(), true); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href]') && isOpen()) setMenu(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setMenu(false, true); return; }
      if (e.key === 'Tab') {
        // Keep focus inside the open menu (toggle + links) while it overlays the page.
        var items = focusables();
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setMenu(false, false);
    });
    desktopNav.addEventListener('change', function (e) { if (e.matches && isOpen()) setMenu(false, false); });
  }

  /* ---------- Collection explorer ---------- */
  var explorer = document.querySelector('[data-explorer]');
  var panels = explorer ? Array.prototype.slice.call(explorer.querySelectorAll('[data-collection-panel]')) : [];
  var closeBtn = explorer && explorer.querySelector('[data-explorer-close]');
  var lastTrigger = null;

  function scrollTo(el) {
    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }
  function showCollection(id, focusTarget) {
    if (!explorer || !panels.length) return false;
    var panel = panels.filter(function (p) { return p.dataset.collectionPanel === id; })[0] || panels[0];
    var active = panel.dataset.collectionPanel;
    explorer.classList.add('is-open');
    panels.forEach(function (p) { p.hidden = p !== panel; });
    document.querySelectorAll('[data-collection-link]').forEach(function (a) {
      if (a.dataset.collectionLink === active && (a.closest('.explorer__index') || a.classList.contains('collection-card__link'))) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });
    var target = focusTarget || panel;
    scrollTo(explorer);
    target.focus({ preventScroll: true });
    return true;
  }
  function closeExplorer() {
    explorer.classList.remove('is-open');
    document.querySelectorAll('[data-collection-link][aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
    if (history.replaceState) history.replaceState(null, '', '#collections');
    var back = lastTrigger && document.body.contains(lastTrigger) && lastTrigger.offsetParent !== null
      ? lastTrigger
      : document.querySelector('.collection-card__link');
    if (back) back.focus();
  }

  if (explorer && panels.length) {
    closeBtn.hidden = false;
    closeBtn.addEventListener('click', closeExplorer);
    explorer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeExplorer(); }
    });
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-collection-link], [data-explorer-open]');
      if (!link) return;
      e.preventDefault();
      if (!link.closest('.explorer')) lastTrigger = link;
      var id = link.dataset.collectionLink || null;
      var hash = link.getAttribute('href');
      if (history.pushState) history.pushState(null, '', hash);
      showCollection(id, id ? null : explorer);
    });
  }

  function fromHash() {
    var hash = decodeURIComponent(location.hash.slice(1));
    if (!explorer || !hash) return;
    if (hash === explorer.id) { showCollection(null, explorer); return; }
    var match = panels.filter(function (p) { return p.id === hash; })[0];
    if (match) showCollection(match.dataset.collectionPanel);
  }
  window.addEventListener('popstate', fromHash);
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------- Enquiry preview form (local validation only, never sends) ---------- */
  var form = document.querySelector('[data-enquiry-form]');
  var formToggle = document.querySelector('[data-form-toggle]');
  if (form && formToggle) {
    var summary = form.querySelector('[data-error-summary]');
    var result = form.querySelector('[data-form-result]');
    var title = form.querySelector('#enquiry-form-title');
    var topic = form.querySelector('#enq-topic');
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var rules = [
      { name: 'name', test: function (v) { return v.trim().length > 0; } },
      { name: 'email', test: function (v) { return EMAIL.test(v.trim()); } },
      { name: 'message', test: function (v) { return v.trim().length >= 10; } }
    ];

    formToggle.hidden = false;
    function openForm(focus) {
      form.hidden = false;
      formToggle.setAttribute('aria-expanded', 'true');
      if (focus) title.focus();
    }
    formToggle.addEventListener('click', function () {
      if (form.hidden) openForm(true);
      else { form.hidden = true; formToggle.setAttribute('aria-expanded', 'false'); }
    });

    // "Ask about <collection>" links preselect the topic and open the preview.
    document.addEventListener('click', function (e) {
      var ask = e.target.closest('[data-enquiry-topic]');
      if (!ask) return;
      if (topic) topic.value = ask.dataset.enquiryTopic;
      result.hidden = true;
      openForm(false);
    });

    function setError(rule, message) {
      var input = form.elements[rule.name];
      var err = form.querySelector('#enq-' + rule.name + '-error');
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', err.id);
        err.textContent = message;
        err.hidden = false;
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        err.textContent = '';
        err.hidden = true;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      result.hidden = true;
      var failed = [];
      rules.forEach(function (rule) {
        var ok = rule.test(form.elements[rule.name].value);
        var msg = ok ? '' : form.dataset['error' + rule.name.charAt(0).toUpperCase() + rule.name.slice(1)];
        setError(rule, msg);
        if (!ok) failed.push({ id: 'enq-' + rule.name, msg: msg });
      });
      var list = summary.querySelector('ul');
      list.textContent = '';
      if (failed.length) {
        failed.forEach(function (f) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + f.id;
          a.textContent = f.msg;
          a.addEventListener('click', function (ev) { ev.preventDefault(); document.getElementById(f.id).focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;
      // No backend exists: report that nothing was sent. Never show a success state.
      result.hidden = false;
    });
  }
})();
