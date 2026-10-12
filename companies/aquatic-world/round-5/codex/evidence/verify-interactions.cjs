// Execute the shipped script against DOM doubles. This is not browser evidence.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../demo/script.js'), 'utf8');
const checks = [];
function check(name, condition) {
  checks.push({check:name, status:condition ? 'pass' : 'fail'});
}

function setup(search = '', contact = true) {
  let document;
  class Element {
    constructor(tag = 'div', id = '') {
      this.tagName = tag.toUpperCase(); this.id = id;
      this.name = id; this.value = ''; this.hidden = false;
      this.disabled = false; this.textContent = ''; this.attrs = {};
      this.children = []; this.listeners = {}; this.open = false;
      this.validity = {typeMismatch:false};
    }
    set innerHTML(_) { throw new Error('Unsafe HTML mutation'); }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    emit(type, props = {}) {
      const event = {defaultPrevented:false, preventDefault(){this.defaultPrevented = true;}, ...props};
      for (const fn of this.listeners[type] || []) fn(event);
      return event;
    }
    focus() { document.activeElement = this; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; this.textContent = ''; }
    setAttribute(k, v) { this.attrs[k] = v; }
    removeAttribute(k) { delete this.attrs[k]; }
    getAttribute(k) { return this.attrs[k] ?? null; }
    contains(node) { return this === node || this.children.some(c => c.contains(node)); }
    closest(tag) { return this.tagName.toLowerCase() === tag ? this : null; }
    reset() { return this.emit('reset'); }
    get selectedOptions() { return this.options.filter(o => o.value === this.value); }
  }
  const nodes = {};
  for (const id of ['enquiry-form','name','email','category','project','category-context','error-summary','preview-result','preview-content','preview-button','form-status','local-disclosure','enquiry-fields','edit-brief','clear-brief','clear-preview','name-error','email-error','project-error']) nodes[id] = new Element('div', id);
  nodes['enquiry-form'].elements = Object.fromEntries(['name','email','category','project'].map(id => [id,nodes[id]]));
  nodes.category.options = [['general','Not sure yet'],['ornamental-fish','Ornamental Fish'],['aquatic-plants','Aquatic Plants'],['driftwood','Driftwood']].map(([value,textContent]) => ({value,textContent}));
  nodes.category.value = 'general';
  nodes['enquiry-fields'].disabled = nodes['preview-button'].disabled = true;
  for (const id of ['local-disclosure','preview-result','error-summary','name-error','email-error','project-error']) nodes[id].hidden = true;
  const summary = new Element('summary');
  const menuLink = new Element('a'); menuLink.attrs.href = '/contact/';
  const desktopLink = new Element('a'); desktopLink.attrs.href = '/contact/';
  const brand = new Element('a');
  const menu = new Element('details'); menu.append(summary, menuLink);
  menu.querySelector = () => summary;
  const media = new Element();
  document = new Element('document');
  document.querySelector = selector => selector === '.mobile-menu' ? menu : selector === '.site-header .brand' ? brand : selector === '#enquiry-form' && !contact ? null : nodes[selector.slice(1)];
  document.querySelectorAll = () => [desktopLink];
  document.createElement = tag => new Element(tag);
  vm.runInNewContext(source, {document, window:{location:{search},matchMedia:()=>media}, URLSearchParams});
  return {nodes,document,menu,summary,menuLink,desktopLink,brand,media};
}

function fill(s, project = 'A leafy aquarium concept for a sample reception area.') {
  s.nodes.name.value = 'Sample Visitor';
  s.nodes.email.value = 'sample@example.com';
  s.nodes.email.validity.typeMismatch = false;
  s.nodes.project.value = project;
}

const base = setup();
check('Enhancement enables controls and shows one disclosure', !base.nodes['preview-button'].disabled && !base.nodes['enquiry-fields'].disabled && !base.nodes['local-disclosure'].hidden);
check('Fresh brief uses Not sure yet and compact category hint', base.nodes.category.value === 'general' && /complete aquascape/.test(base.nodes['category-context'].textContent));
for (const slug of ['ornamental-fish','aquatic-plants','driftwood','general']) {
  const s = setup(`?category=${slug}`);
  check(`Known prefill: ${slug}`, s.nodes.category.value === slug);
  if (slug !== 'general') check(`Context matches selection: ${slug}`, s.nodes['category-context'].textContent.includes(s.nodes.category.selectedOptions[0].textContent));
  fill(s); s.nodes['enquiry-form'].emit('submit');
  check(`Prefilled preview has four rows: ${slug}`, s.nodes['preview-content'].children.length === 8 && s.nodes['preview-content'].children[5].textContent.includes(slug === 'general' ? 'Not sure yet' : s.nodes.category.selectedOptions[0].textContent));
  s.nodes['clear-preview'].emit('click');
  check(`Clear drops incoming context: ${slug}`, s.nodes.category.value === 'general' && s.nodes['category-context'].textContent.startsWith('Not sure yet') && Object.values(s.nodes['enquiry-form'].elements).filter(f => f.name !== 'category').every(f => f.value === ''));
}
for (const query of ['?category=unknown','?category=%3Cscript%3Ealert(1)%3C%2Fscript%3E','?category=','?category=DRIFTWOOD']) {
  const s = setup(query);
  check(`Unknown query safely falls back: ${query}`, s.nodes.category.value === 'general' && !s.nodes['category-context'].textContent.includes('<script>'));
}
const blank = base.nodes['enquiry-form'].emit('submit');
check('Blank submission prevented with three associated errors', blank.defaultPrevented && ['name','email','project'].every(id => base.nodes[id].attrs['aria-invalid'] === 'true' && !base.nodes[`${id}-error`].hidden));
check('Blank submission focuses visible summary', base.document.activeElement === base.nodes['error-summary'] && !base.nodes['error-summary'].hidden);
const links = base.nodes['error-summary'].children[1].children.map(item => item.children[0]);
check('Summary includes all three correct field links', links.map(n => n.href).join(',') === '#name,#email,#project');
for (let i = 0; i < links.length; i++) {
  const ev = links[i].emit('click');
  check(`Summary link focuses ${['name','email','project'][i]}`, ev.defaultPrevented && base.document.activeElement === base.nodes[['name','email','project'][i]]);
}
fill(base);
base.nodes.email.value = 'invalid'; base.nodes.email.validity.typeMismatch = true;
base.nodes.project.value = 'too short'; base.nodes.name.value = '   ';
base.nodes['enquiry-form'].emit('submit');
check('Invalid email, whitespace name and short project rejected', ['name','email','project'].every(id => !base.nodes[`${id}-error`].hidden));
fill(base);
for (const id of ['name','email','project']) base.nodes[id].emit('input');
check('Correcting inputs clears errors and summary', base.nodes['error-summary'].hidden && ['name','email','project'].every(id => !base.nodes[id].attrs['aria-invalid']));
base.nodes.category.value = 'aquatic-plants'; base.nodes.category.emit('change');
check('Changing collection updates field-local context', base.nodes['category-context'].textContent.startsWith('Aquatic Plants selected.'));
const values = ['name','email','category','project'].map(id => base.nodes[id].value);
base.nodes['enquiry-form'].emit('submit');
check('Valid preview replaces editable workspace and disclosure', base.nodes['enquiry-form'].hidden && base.nodes['local-disclosure'].hidden && !base.nodes['preview-result'].hidden);
check('Preview receives focus', base.document.activeElement === base.nodes['preview-result']);
check('Preview contains exactly Name/Email/Collection/Project', base.nodes['preview-content'].children.filter((_, i) => i % 2 === 0).map(n => n.textContent).join(',') === 'Name,Email,Collection,Project');
base.nodes['edit-brief'].emit('click');
check('Edit restores values, editable disclosure and project focus', !base.nodes['enquiry-form'].hidden && !base.nodes['local-disclosure'].hidden && base.nodes['preview-result'].hidden && base.document.activeElement === base.nodes.project && ['name','email','category','project'].every((id,i) => base.nodes[id].value === values[i]));
base.nodes['enquiry-form'].emit('reset');
check('Editable Clear empties values, errors and output', ['name','email','project'].every(id => !base.nodes[id].value && !base.nodes[id].attrs['aria-invalid'] && base.nodes[`${id}-error`].hidden) && base.nodes.category.value === 'general' && base.nodes['preview-content'].children.length === 0 && base.nodes['error-summary'].hidden);
check('Clear restores Name focus and honest reset status', base.document.activeElement === base.nodes.name && base.nodes['form-status'].textContent === 'Brief cleared. Collection reset to Not sure yet.');
for (const length of [19,20,2000,2001]) {
  const s = setup(); fill(s, 'x'.repeat(length)); s.nodes['enquiry-form'].emit('submit');
  check(`Project trimmed-length boundary ${length}`, s.nodes['preview-result'].hidden === (length < 20 || length > 2000));
}
const long = setup();
const literal = '<img src=x onerror=alert(1)> ' + 'VeryLongAquascapeWord'.repeat(70) + '\nA second line.';
fill(long,literal); long.nodes.name.value = '<script>sample</script>';
long.nodes['enquiry-form'].emit('submit');
check('Long HTML-like input is rendered as literal text', !long.nodes['preview-result'].hidden && long.nodes['preview-content'].children[1].textContent === '<script>sample</script>' && long.nodes['preview-content'].children[7].textContent === literal);
check('Script has no network or browser-storage operations', !/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB)\b/.test(source));

for (const contact of [true,false]) {
  const s = setup('',contact);
  s.menu.open = true; s.menuLink.focus(); s.document.emit('keydown',{key:'Escape'});
  check(`Menu Escape closes and restores focus (Contact=${contact})`, !s.menu.open && s.document.activeElement === s.summary);
  s.menu.open = true; s.menuLink.focus(); s.document.emit('click',{target:s.brand});
  check(`Outside click closes menu and restores in-menu focus (Contact=${contact})`, !s.menu.open && s.document.activeElement === s.summary);
  s.menu.open = true; s.menuLink.focus(); s.media.emit('change',{matches:false});
  check(`Desktop resize transfers focus to matching destination (Contact=${contact})`, !s.menu.open && s.document.activeElement === s.desktopLink);
}
const result = {method:'Actual demo/script.js in Node VM with DOM doubles; native email validity represented explicitly, no browser rendering/keyboard claim', passes:checks.filter(c=>c.status==='pass').length, failures:checks.filter(c=>c.status==='fail').length, checks};
fs.writeFileSync(path.join(__dirname,'interaction-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(`Script logic checks: ${result.passes} pass, ${result.failures} fail`);
for (const c of checks.filter(c=>c.status==='fail')) console.log(c.check);
process.exitCode = result.failures ? 1 : 0;
