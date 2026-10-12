'use strict';
// Navigation is an ordinary disclosure: background content remains reachable.
const menuButton = document.querySelector('[data-menu-toggle]');
const menuLabel = document.querySelector('[data-menu-label]');
const navigation = document.querySelector('#main-navigation');
const header = document.querySelector('#site-header');
const narrow = window.matchMedia('(max-width: 899px)');
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
function closeDetail(restoreFocus = true) {
  if (!activeDetail) return;
  activeDetail.open = false;
  activeDetail.hidden = true;
  detailGroup.hidden = true;
  activeDetail = null;
  if (location.hash.startsWith('#collection-')) history.replaceState(null, '', '#collections');
  if (restoreFocus && returnTarget) returnTarget.focus({ preventScroll: true });
}
function openDetail(id, trigger = null, focus = true) {
  const target = details.find(detail => detail.id === id);
  if (!target) return false;
  for (const detail of details) { detail.hidden = detail !== target; detail.open = detail === target; }
  detailGroup.hidden = false;
  activeDetail = target;
  returnTarget = trigger || document.querySelector(`[data-open-detail][href="#${id}"]`);
  if (focus) target.querySelector('[data-detail-title]').focus({ preventScroll: true });
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  return true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
  if (open) navigation.querySelector('a')?.focus();
});
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  setMenu(false);
  if (link.hash) focusDestination(link.hash);
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-detail]');
  if (trigger && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
    const id = trigger.hash.slice(1);
    if (openDetail(id, trigger)) { event.preventDefault(); history.pushState(null, '', trigger.hash); }
  }
  if (event.target.closest('[data-close-detail]')) closeDetail();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  else if (activeDetail) closeDetail();
});
window.addEventListener('hashchange', () => {
  if (location.hash.startsWith('#collection-')) openDetail(location.hash.slice(1));
  else if (activeDetail) closeDetail(false);
});
narrow.addEventListener('change', syncMenu);
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 25), { passive: true });
for (const detail of details) { detail.hidden = true; detail.querySelector('[data-close-detail]').hidden = false; }
if (detailGroup) detailGroup.hidden = true;
document.documentElement.classList.add('has-js');
syncMenu();
header.classList.toggle('is-scrolled', window.scrollY > 25);
if (location.hash.startsWith('#collection-')) openDetail(location.hash.slice(1), null, false);
