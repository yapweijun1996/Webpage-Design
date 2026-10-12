/* Execute the actual enhancement script with bounded DOM doubles.
   This verifies event logic, not browser rendering, native focus or validity. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'demo/script.js'), 'utf8');
const results = [];
function check(name, fn) { fn(); results.push({check: name, status: 'pass'}); }

function fixture(search = '', includeForm = true) {
  const nodes = new Map();
  const document = {activeElement: null, listeners: {},
    addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); },
    fire(t, arg) { (this.listeners[t] || []).forEach(fn => fn(arg)); },
    querySelector(sel) { return nodes.get(sel) || null; },
    querySelectorAll(sel) { return sel === '.desktop-nav a, .header-cta' ? desktop : []; },
    createElement(tag) { return new Element(tag); }
  };
  class Element {
    constructor(tag = 'div', id = '') {
      this.tagName = tag; this.id = id; this.children = []; this.listeners = {};
      this.attrs = {}; this.value = ''; this.hidden = true; this.open = false;
      this.disabled = false; this.textContent = '';
    }
    append(...children) { children.forEach(c => { c.parent = this; this.children.push(c); }); }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k] ?? null; }
    removeAttribute(k) { delete this.attrs[k]; }
    addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); }
    fire(t, arg = {}) {
      const event = {target: this, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }, ...arg};
      (this.listeners[t] || []).forEach(fn => fn(event)); return event;
    }
    focus() { document.activeElement = this; }
    contains(node) { return node === this || this.children.some(c => c.contains(node)); }
    closest(tag) { return this.tagName === tag ? this : this.parent?.closest(tag) || null; }
    querySelector(sel) { return sel === 'summary' ? control : null; }
    get validity() { return {typeMismatch: this.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)}; }
    get selectedOptions() { return this.options.filter(o => o.value === this.value); }
  }
  const menu = new Element('details');
  const control = new Element('summary');
  const menuLink = new Element('a'); menuLink.setAttribute('href', '/quality/');
  menu.append(control, menuLink);
  const brand = new Element('a');
  const desktopLink = new Element('a'); desktopLink.setAttribute('href', '/quality/');
  const desktop = [desktopLink];
  nodes.set('.mobile-menu', menu); nodes.set('.site-header .brand', brand);
  const media = {listeners: [], addEventListener(t, fn) { this.listeners.push(fn); },
    fire(matches) { this.listeners.forEach(fn => fn({matches})); }};
  const window = {matchMedia: () => media, location: {search}};
  for (const id of ['enquiry-form', 'name', 'email', 'project', 'category', 'category-context',
    'error-summary', 'preview-result', 'preview-content', 'preview-button', 'edit-brief',
    'name-error', 'email-error', 'project-error', 'form-status']) {
    const node = new Element('div', id); nodes.set('#' + id, node);
  }
  const form = nodes.get('#enquiry-form');
  form.elements = {};
  for (const id of ['name', 'email', 'project', 'category']) {
    const field = nodes.get('#' + id); field.name = id;
    form.elements[id] = field;
  }
  const category = form.elements.category;
  category.options = [
    ['general', 'Not sure yet'], ['ornamental-fish', 'Ornamental Fish'],
    ['aquatic-plants', 'Aquatic Plants'], ['driftwood', 'Driftwood']
  ].map(([value, textContent]) => ({value, textContent}));
  category.value = 'general';
  nodes.get('#preview-button').disabled = true;
  if (!includeForm) nodes.delete('#enquiry-form');
  vm.runInNewContext(code, {document, window, URLSearchParams,
    fetch() { throw new Error('Unexpected network use'); },
    localStorage: new Proxy({}, {get() { throw new Error('Unexpected persistence'); }}),
    sessionStorage: new Proxy({}, {get() { throw new Error('Unexpected persistence'); }})});
  return {nodes, form, fields: form.elements, document, menu, control, media,
    menuLink, desktopLink, brand, summary: nodes.get('#error-summary'),
    result: nodes.get('#preview-result'), output: nodes.get('#preview-content')};
}

for (const slug of ['ornamental-fish', 'aquatic-plants', 'driftwood']) {
  const f = fixture('?category=' + slug);
  check('allowlisted category prefill ' + slug, () => assert.equal(f.fields.category.value, slug));
  check('category focus copy ' + slug, () => assert.match(f.nodes.get('#category-context').textContent, /Your enquiry focus:/));
  f.fields.name.value = 'Sample'; f.fields.category.value = 'general';
  const event = f.form.fire('reset');
  check('clear retains incoming context ' + slug, () => {
    assert.equal(f.fields.category.value, slug); assert.equal(f.fields.name.value, '');
    assert.equal(event.defaultPrevented, true); assert.equal(f.document.activeElement, f.fields.name);
  });
}
for (const search of ['', '?category=unknown', '?category=%3Cscript%3E']) {
  const f = fixture(search);
  check('unknown or missing context uses general ' + search, () => assert.equal(f.fields.category.value, 'general'));
}
const f = fixture();
check('enhancement enables local preview', () => assert.equal(f.nodes.get('#preview-button').disabled, false));
let event = f.form.fire('submit');
check('blank submit is prevented with three associated errors', () => {
  assert.equal(event.defaultPrevented, true); assert.equal(f.summary.hidden, false);
  assert.equal(f.summary.children[1].children.length, 3);
  for (const id of ['name','email','project']) {
    assert.equal(f.fields[id].getAttribute('aria-invalid'), 'true');
    assert.equal(f.nodes.get('#'+id+'-error').hidden, false);
  }
  assert.equal(f.document.activeElement, f.summary);
});
event = f.summary.children[1].children[0].children[0].fire('click');
check('summary link prevents jump and focuses named field', () => {
  assert.equal(event.defaultPrevented, true); assert.equal(f.document.activeElement, f.fields.name);
});
f.fields.name.value = '  Sample Aquascaper  '; f.fields.name.fire('input');
f.fields.email.value = 'invalid'; f.fields.email.fire('input');
f.fields.project.value = 'short'; f.fields.project.fire('input');
check('live correction removes only corrected error', () => {
  assert.equal(f.fields.name.getAttribute('aria-invalid'), null);
  assert.equal(f.summary.children[1].children.length, 2);
});
f.fields.email.value = 'sample@example.com'; f.fields.email.fire('input');
f.fields.project.value = '<img src=x onerror=alert(1)> A long illustrative scene with plants.';
f.fields.project.fire('input');
f.form.fire('submit');
check('valid preview is local, focused and literal', () => {
  assert.equal(f.result.hidden, false); assert.equal(f.document.activeElement, f.result);
  assert.equal(f.summary.hidden, true); assert.equal(f.output.children.length, 8);
  assert.equal(f.output.children[1].textContent, 'Sample Aquascaper');
  assert.equal(f.output.children[7].textContent, f.fields.project.value);
  assert.equal(f.output.children[7].children.length, 0);
  assert.equal(f.output.children[5].textContent, 'Not sure yet / A complete aquascape');
});
f.nodes.get('#edit-brief').fire('click');
check('edit returns to description without losing data', () => {
  assert.equal(f.result.hidden, true); assert.equal(f.document.activeElement, f.fields.project);
  assert.ok(f.fields.project.value.length > 20);
});
f.form.fire('submit'); f.fields.name.fire('input');
check('editing invalidates stale preview', () => assert.equal(f.result.hidden, true));
f.form.fire('submit'); f.fields.category.value = 'aquatic-plants'; f.fields.category.fire('change');
check('category change updates context and invalidates preview', () => {
  assert.equal(f.result.hidden, true); assert.match(f.nodes.get('#category-context').textContent, /Aquatic Plants/);
});
f.fields.project.value = 'a'.repeat(2001); f.form.fire('submit');
check('length upper bound is enforced', () => assert.match(f.nodes.get('#project-error').textContent, /2,000/));
f.form.fire('reset');
check('clear removes preview, errors and sample data', () => {
  for (const id of ['name','email','project']) {
    assert.equal(f.fields[id].value, ''); assert.equal(f.fields[id].getAttribute('aria-invalid'), null);
    assert.equal(f.nodes.get('#'+id+'-error').hidden, true);
  }
  assert.equal(f.output.children.length, 0); assert.equal(f.result.hidden, true);
  assert.equal(f.summary.hidden, true); assert.equal(f.fields.category.value, 'general');
  assert.match(f.nodes.get('#form-status').textContent, /Nothing was saved or sent/);
});
f.menu.open = true; f.menuLink.focus(); f.document.fire('keydown', {key:'Escape'});
check('Escape closes menu and returns focus', () => {
  assert.equal(f.menu.open, false); assert.equal(f.document.activeElement, f.control);
});
f.menu.open = true; f.menuLink.focus(); f.media.fire(false);
check('resize transfers focused menu destination to desktop', () => {
  assert.equal(f.menu.open, false); assert.equal(f.document.activeElement, f.desktopLink);
});
f.menu.open = true; f.control.focus(); f.media.fire(false);
check('resize from summary has a visible brand fallback', () => assert.equal(f.document.activeElement, f.brand));
f.menu.open = true; f.menuLink.focus(); f.document.fire('click', {target:f.brand});
check('outside dismissal avoids focus left on hidden link', () => {
  assert.equal(f.menu.open, false); assert.equal(f.document.activeElement, f.control);
});
const nonContact = fixture('', false);
nonContact.menu.open = true; nonContact.document.fire('keydown', {key:'Escape'});
check('enhancement works on pages without a form', () => assert.equal(nonContact.menu.open, false));
const report = {kind:'actual-script-with-DOM-doubles', passed:results.length, failed:0,
  limits:'No browser layout, native email validity, hit testing, accessibility tree or real keyboard verified.', checks:results};
fs.writeFileSync(path.join(__dirname,'interaction-results.json'), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({kind:report.kind,passed:report.passed,failed:report.failed}));
