const query = new URLSearchParams(location.search);
const focus = query.get('focus');
if (focus === 'landscape' || focus === 'portrait') {
  document.body.classList.add('focus');
  document.body.dataset.focus = focus;
}

// The diagram uses the same source coordinates and cover crop as the photo.
const compositions = {
  landscape: {
    size: [1280, 720],
    corridor: [0.55, 0.25, 0.33, 0.39],
    fish: [0.59, 0.28, 0.12, 0.25],
    pocket: [0.81, 0.40],
    path: 'M 1037 288 C 984 258 888 259 826 284 C 786 300 785 334 850 349 C 918 365 1009 341 1037 288',
    phases: [[0.74, 0.36, '2'], [0.63, 0.44, '3'], [0.75, 0.48, '4']]
  },
  portrait: {
    size: [720, 1280],
    corridor: [0.22, 0.22, 0.58, 0.28],
    fish: [0.41, 0.24, 0.27, 0.19],
    pocket: [0.74, 0.19],
    path: 'M 533 243 C 494 324 428 399 390 425 C 342 450 337 488 385 501 C 427 513 502 351 533 243',
    phases: [[0.64, 0.30, '2'], [0.47, 0.37, '3'], [0.64, 0.34, '4']]
  }
};

for (const [orientation, spec] of Object.entries(compositions)) {
  const [width, height] = spec.size;
  const rect = (values, className) => {
    const [x, y, w, h] = values;
    return `<rect class="${className}" x="${x * width}" y="${y * height}" width="${w * width}" height="${h * height}" rx="5"/>`;
  };
  const id = `arrow-${orientation}`;
  const [pocketX, pocketY] = spec.pocket;
  const phases = spec.phases.map(([x, y, label]) => `<circle class="phase" cx="${x * width}" cy="${y * height}" r="13"/><text class="phase-label" x="${x * width}" y="${y * height}">${label}</text>`).join('');
  const svg = `<svg class="route" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e6c67d"/></marker></defs>${rect(spec.corridor, 'corridor')}${rect(spec.fish, 'fish-bound')}<path class="path" d="${spec.path}" marker-mid="url(#${id})" marker-end="url(#${id})"/><circle class="pocket" cx="${pocketX * width}" cy="${pocketY * height}" r="17"/><text class="phase-label" x="${pocketX * width}" y="${pocketY * height}">1/5</text>${phases}<text x="${width * (orientation === 'landscape' ? 0.55 : 0.25)}" y="${height * (orientation === 'landscape' ? 0.68 : 0.54)}">Proposed route · full fins stay clear</text></svg>`;
  document.querySelector(orientation === 'landscape' ? '.desktop' : '.phone').insertAdjacentHTML('beforeend', svg);
}

let endpoint = query.get('scene') === 'endpoint';
let route = query.get('route') === '1';
const sceneToggle = document.querySelector('#scene-toggle');
const routeToggle = document.querySelector('#route-toggle');
function render() {
  document.body.classList.toggle('show-route', route);
  document.body.dataset.scene = endpoint ? 'endpoint' : 'midpoint';
  for (const img of document.querySelectorAll('.habitat')) {
    img.src = endpoint ? img.dataset.endpoint : img.dataset.midpoint;
    img.closest('.hero').setAttribute('aria-label', `Static ${img.closest('.desktop') ? 'desktop' : 'phone'} design, fish ${endpoint ? 'concealed behind roots' : 'visible in the upper-middle water'}`);
  }
  sceneToggle.setAttribute('aria-pressed', String(endpoint));
  sceneToggle.textContent = endpoint ? 'Show visible midpoint' : 'Show concealed endpoint';
  routeToggle.setAttribute('aria-pressed', String(route));
  routeToggle.textContent = route ? 'Hide proposed route' : 'Show proposed route';
  document.querySelector('.state').textContent = endpoint ? 'Endpoint · fish concealed' : 'Midpoint · fish visible';
}
sceneToggle.addEventListener('click', () => { endpoint = !endpoint; render(); });
routeToggle.addEventListener('click', () => { route = !route; render(); });
render();
