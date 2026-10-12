'use strict';
// Navigation is an ordinary disclosure: background content remains reachable.
const menuButton = document.querySelector('[data-menu-toggle]');
const menuLabel = document.querySelector('[data-menu-label]');
const navigation = document.querySelector('#main-navigation');
const header = document.querySelector('#site-header');
const narrow = window.matchMedia('(max-width: 1023px)');
const detailGroup = document.querySelector('[data-details]');
const details = [...document.querySelectorAll('[data-detail]')];
let returnTarget = null;
let activeDetail = null;
function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? menuLabel.dataset.closeLabel : menuLabel.dataset.openLabel;
  navigation.hidden = narrow.matches && !open;
  if (restoreFocus && narrow.matches) menuButton.focus();
}
function syncMenu() {
  const hadFocus = navigation.contains(document.activeElement);
  menuButton.hidden = !narrow.matches;
  setMenu(false, hadFocus);
}
function focusDestination(hash) {
  const target = document.getElementById(hash.slice(1));
  const heading = target?.querySelector('h1,h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}
// Hiding a panel never changes the URL: history owns the visible selection.
function hideDetail(restoreFocus = false) {
  if (!activeDetail) return;
  const hadFocus = activeDetail.contains(document.activeElement);
  activeDetail.open = false;
  activeDetail.hidden = true;
  detailGroup.hidden = true;
  activeDetail = null;
  if ((restoreFocus || hadFocus) && returnTarget) returnTarget.focus({ preventScroll: true });
}
function closeDetail() {
  if (!activeDetail) return;
  hideDetail(true);
  history.replaceState(null, '', '#collections');
}
function openDetail(id, trigger = null, focus = true, scroll = true) {
  const target = details.find(detail => detail.id === id);
  if (!target) return false;
  for (const detail of details) { detail.hidden = detail !== target; detail.open = detail === target; }
  detailGroup.hidden = false;
  activeDetail = target;
  returnTarget = trigger || (returnTarget?.hash === `#${id}` ? returnTarget : document.querySelector(`.collection-card[href="#${id}"]`));
  if (focus) target.querySelector('[data-detail-title]').focus({ preventScroll: true });
  if (scroll) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  return true;
}
function syncLocation() {
  const target = details.find(detail => detail.id === location.hash.slice(1));
  if (target) {
    // Back/Forward can emit both events for the same destination.
    if (activeDetail !== target) openDetail(target.id);
  } else {
    hideDetail();
    focusDestination(location.hash);
  }
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  if (open) navigation.querySelector('a')?.focus();
});
document.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const trigger = event.target.closest('[data-open-detail]');
  if (trigger) {
    const id = trigger.hash.slice(1);
    if (openDetail(id, trigger)) {
      event.preventDefault();
      if (location.hash !== trigger.hash) history.pushState(null, '', trigger.hash);
    }
  } else {
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      hideDetail();
      setMenu(false);
      focusDestination(link.hash);
    }
  }
  if (event.target.closest('[data-close-detail]')) closeDetail();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  else if (activeDetail) closeDetail();
});
window.addEventListener('hashchange', syncLocation);
window.addEventListener('popstate', syncLocation);
narrow.addEventListener('change', syncMenu);
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 25), { passive: true });
for (const detail of details) { detail.hidden = true; detail.querySelector('[data-close-detail]').hidden = false; }
if (detailGroup) detailGroup.hidden = true;
document.documentElement.classList.add('has-js');
syncMenu();
header.classList.toggle('is-scrolled', window.scrollY > 25);
if (location.hash.startsWith('#collection-')) openDetail(location.hash.slice(1), null, false);
