"""Reuse stage-1 checks while preserving their original evidence artifacts."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent

for script in ('home-motion.js', 'script.js'):
    subprocess.run(['node', '--check', str(ROOT / 'demo' / script)], check=True)
subprocess.run(['python3', '-B', str(HERE / 'check-motion-label.py')], check=True)

source_file = ROOT / 'evidence/check-source.py'
source = source_file.read_text().replace(
    'evidence/source-check-results.json', 'evidence/stage-2/source-check-results.json')
exec(compile(source, str(source_file), 'exec'), {'__file__': str(source_file)})

# Preserve all existing controller assertions; add full action-name agreement.
controller_runner = r"""
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const filename = path.resolve('evidence/check-home-controller.cjs');
let source = fs.readFileSync(filename, 'utf8');
const extra = `check('All three full action labels match visible text, accessible name and title', () => {
  const app = setup();
  function verify(state, action) {
    assert.equal(state.control.attrs['aria-label'], action);
    assert.equal(state.control.title, action);
    assert.equal(state.document.querySelector('[data-motion-label]').textContent, action);
  }
  verify(app, 'Pause background');
  app.control.emit('click');
  verify(app, 'Resume background');
  app.menu.open = true;
  app.menu.emit('toggle');
  app.menu.open = false;
  app.menu.emit('toggle');
  verify(app, 'Resume background');
  app.control.emit('click');
  verify(app, 'Pause background');
  verify(setup({ reduced: true }), 'Play background');
  verify(setup({ saveData: true }), 'Play background');
});\n`;
source = source.replace('const result = { check_type:', extra + 'const result = { check_type:');
source = source.replace("path.join(__dirname, 'controller-check-results.json')",
  "path.join(__dirname, 'stage-2/controller-check-results.json')");
const check = new Module(filename, module);
check.filename = filename;
check.paths = module.paths;
check._compile(source, filename);
"""
subprocess.run(['node'], input=controller_runner, text=True, cwd=ROOT, check=True)
