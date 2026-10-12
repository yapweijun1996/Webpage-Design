"use strict";
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

// SVG .hidden is intentionally an unrelated expando, never attribute reflection.
function svg(hidden) {
  const attrs = new Set(hidden ? ['hidden'] : []);
  return {
    hidden: !hidden,
    toggleAttribute(name, force) {
      if (force) attrs.add(name); else attrs.delete(name);
    },
    hasAttribute: name => attrs.has(name)
  };
}
const results = [];
for (const path of ['demo/home-motion.js', 'demo/public/home-motion.js']) {
  const source = fs.readFileSync(path, 'utf8');
  const render = source.match(/  function render\(\) \{[\s\S]*?\n  \}/)?.[0];
  assert.ok(render, 'render function exists');
  assert.doesNotMatch(render, /(?:pauseIcon|playIcon)\.hidden\s*=/);
  const pauseIcon = svg(true);
  const playIcon = svg(false);
  const attrs = {};
  const context = {
    failedSources: new Set(), orientation: () => 'landscape',
    wantsPlayback: () => !context.userPaused,
    temporarilySuspended: () => false,
    userPaused: false, autoplayBlocked: false,
    environment: { dataset: {} }, hasFrame: true,
    buffering: false, video: { paused: false }, attachedOrientation: 'landscape',
    control: { setAttribute: (name, value) => { attrs[name] = value; } },
    label: {}, pauseIcon, playIcon, document: { activeElement: null }
  };
  vm.createContext(context);
  vm.runInContext(render, context);
  for (const [state, paused, action] of [
    ['eligible motion', false, 'Pause background'],
    ['manual Pause', true, 'Resume background'],
    ['explicit Resume', false, 'Pause background']
  ]) {
    context.userPaused = paused;
    context.video.paused = paused;
    vm.runInContext('render()', context);
    assert.equal(attrs['aria-label'], action);
    assert.equal(context.control.title, action);
    assert.equal(context.label.textContent, action);
    assert.equal(pauseIcon.hasAttribute('hidden'), paused);
    assert.equal(playIcon.hasAttribute('hidden'), !paused);
    results.push({ path, state, action, pauseHidden: paused, playHidden: !paused });
  }
}
assert.match(fs.readFileSync('demo/styles.css', 'utf8'), /\[hidden\]\s*\{\s*display:none!important;/);
assert.equal(fs.readFileSync('demo/home-motion.js', 'utf8'), fs.readFileSync('demo/public/home-motion.js', 'utf8'));
fs.writeFileSync('evidence/stage-4/attribute-results.json', JSON.stringify({ passed: true, results, limitation: 'Focused render/attribute check; native SVG rendering and real playback transitions remain for coordinator browser review.' }, null, 2) + '\n');
console.log('PASS: source and output real hidden attributes and action labels agree in all three states; SVG expandos cannot satisfy the assertions.');
