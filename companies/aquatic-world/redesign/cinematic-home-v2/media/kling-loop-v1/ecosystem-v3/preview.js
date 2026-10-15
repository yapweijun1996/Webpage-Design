const query = new URLSearchParams(location.search);
const focus = query.get('focus');
if (focus === 'landscape' || focus === 'portrait') {
  document.body.classList.add('focus');
  document.body.dataset.focus = focus;
}

// Review annotations describe intent; they do not simulate or certify motion.
const plans = {
  landscape: {
    size: [1672, 941],
    paths: [
      ['lead', 'M 1100 347 C 1050 358 997 388 960 400 C 1010 430 1090 432 1150 405', [1110, 360], '1'],
      ['school', 'M 1320 248 C 1240 236 1150 249 1110 263', [1280, 255], '2'],
      ['school', 'M 1100 468 C 1160 481 1220 454 1260 438', null, ''],
      ['water', 'M 400 135 C 451 119 502 120 556 132', [455, 145], '3'],
      ['plants', 'M 1180 622 C 1210 608 1240 613 1261 635', [1230, 665], '4'],
      ['plants', 'M 1440 378 C 1465 362 1496 368 1510 389', null, '']
    ]
  },
  portrait: {
    size: [941, 1672],
    paths: [
      ['lead', 'M 538 515 C 502 493 463 490 431 514 C 476 549 531 550 585 534', [600, 535], '1'],
      ['school', 'M 352 261 C 400 241 459 255 495 274', [419, 218], '2'],
      ['school', 'M 780 696 C 754 666 740 625 723 598', null, ''],
      ['water', 'M 329 194 C 398 174 467 174 520 190', [614, 175], '3'],
      ['plants', 'M 175 745 C 205 722 242 726 270 748', [229, 779], '4'],
      ['plants', 'M 761 730 C 785 708 822 714 842 739', null, '']
    ]
  }
};
for (const [orientation, plan] of Object.entries(plans)) {
  const [width, height] = plan.size;
  const types = ['lead', 'school', 'water', 'plants'];
  const markers = types.map(type => `<marker id="${orientation}-${type}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" class="${type}"/></marker>`).join('');
  const paths = plan.paths.map(([type, path, label, number]) => `<path d="${path}" class="motion-line ${type}" marker-end="url(#${orientation}-${type})"/>${label ? `<circle cx="${label[0]}" cy="${label[1]}" r="19" class="motion-marker ${type}"/><text x="${label[0]}" y="${label[1]}" class="motion-number">${number}</text>` : ''}`).join('');
  document.querySelector(orientation === 'landscape' ? '.desktop' : '.phone').insertAdjacentHTML('beforeend', `<svg class="motion-overlay" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${markers}</defs>${paths}</svg>`);
}

let motion = query.get('motion') === '1';
let clean = query.get('clean') === '1';
const motionToggle = document.querySelector('#motion-toggle');
const copyToggle = document.querySelector('#copy-toggle');
function render() {
  document.body.classList.toggle('show-motion', motion);
  document.body.classList.toggle('clean-scene', clean);
  motionToggle.setAttribute('aria-pressed', String(motion));
  copyToggle.setAttribute('aria-pressed', String(clean));
  motionToggle.textContent = motion ? '关闭动势标注' : '显示动势方案';
  copyToggle.textContent = clean ? '显示文字布局' : '只看生态画面';
  document.querySelector('.state').textContent = `${clean ? '纯生态画面' : '完整静态稿'} · 动势标注${motion ? '开启' : '关闭'}`;
}
motionToggle.addEventListener('click', () => { motion = !motion; render(); });
copyToggle.addEventListener('click', () => { clean = !clean; render(); });
render();
