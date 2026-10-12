// Page renderers. Each page has its own composition; shared pieces come from layout.mjs.
import { categories, categoryBySlug, cta } from "./content.mjs";
import { arrow, breadcrumbs, img, srcsetFor, url } from "./layout.mjs";

const enquiryHref = (slug) => url(`/contact/?interest=${slug}#enquiry`);

function categoryCard(cat, { sizes, headingLevel = 3, variant = "" } = {}) {
  const h = `h${headingLevel}`;
  return `<article class="cat-card ${variant}">
  <div class="cat-card-media">${img(cat.image, { sizes })}</div>
  <div class="cat-card-body">
    <p class="cat-card-num">${cat.number}</p>
    <${h} class="cat-card-title"><a class="stretched" href="${url(`/collections/${cat.slug}/`)}">${cat.name}</a></${h}>
    <p class="cat-card-text">${cat.teaser}</p>
    <span class="cat-card-more" aria-hidden="true">Explore ${arrow}</span>
  </div>
</article>`;
}

function siblings(current) {
  const others = categories.filter((c) => c.slug !== current);
  return `<section class="section siblings" aria-labelledby="siblings-title">
  <div class="wrap">
    <div class="section-head section-head--row">
      <div><p class="eyebrow">Continue exploring</p><h2 id="siblings-title" class="h2">Other collections</h2></div>
      <a class="text-link" href="${url("/collections/")}">Back to all collections ${arrow}</a>
    </div>
    <div class="sibling-grid">${others.map((c) => categoryCard(c, { sizes: "(min-width: 760px) 45vw, 100vw", variant: "cat-card--row" })).join("")}</div>
  </div>
</section>`;
}

function crumbs(cat) {
  return breadcrumbs([
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections/" },
    { label: cat.name },
  ]);
}

function enquiryPrep(cat, title, items) {
  return `<section class="section prep" aria-labelledby="prep-title">
  <div class="wrap prep-grid">
    <div>
      <p class="eyebrow">Enquiry context</p>
      <h2 id="prep-title" class="h2">${title}</h2>
      <p class="muted">A short, specific brief makes the first conversation useful. The contact page will start with ${cat.short.toLowerCase()} selected.</p>
      <a class="btn btn-gold" href="${enquiryHref(cat.slug)}">${cat.enquiryLabel} ${arrow}</a>
    </div>
    <ul class="checklist">${items.map((i) => `<li>${i}</li>`).join("")}</ul>
  </div>
</section>`;
}

/* ---------------- Home ---------------- */
export function home() {
  return `<section class="home-hero" aria-labelledby="home-title">
  <picture class="home-hero-media">
    <source media="(max-width: 640px)" srcset="${srcsetFor("heroFish")}" sizes="100vw">
    ${img("hero", { eager: true, sizes: "100vw" })}
  </picture>
  <div class="wrap home-hero-inner">
    <div class="home-hero-copy">
      <p class="eyebrow eyebrow--gold">Fish · Plants · Driftwood</p>
      <h1 id="home-title" class="display">A world of ornamental beauty, <em>curated with care.</em></h1>
      <p class="lead">A proposed home for living colour, planted landscapes and natural structure — for retailers, aquascapers and enthusiasts who plan with intent.</p>
      <div class="actions">
        <a class="btn btn-gold btn-lg" href="${url("/collections/")}">Browse the collections ${arrow}</a>
        <a class="text-link text-link--light" href="${url("/quality/")}">How we think about quality ${arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="section home-collections" aria-labelledby="home-collections-title">
  <div class="wrap">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow eyebrow--gold">The collections</p>
        <h2 id="home-collections-title" class="h2">Three families, one composition.</h2>
      </div>
      <p class="section-intro">Fish bring movement, plants build the landscape and driftwood gives it structure. Each family has its own page.</p>
    </div>
    <div class="home-cat-grid">${categories.map((c) => categoryCard(c, { sizes: "(min-width: 900px) 30vw, (min-width: 600px) 50vw, 100vw" })).join("")}</div>
    <p class="section-foot"><a class="text-link text-link--light" href="${url("/collections/")}">View the collections overview ${arrow}</a></p>
  </div>
</section>

<section class="home-story" aria-labelledby="home-story-title">
  <figure class="home-story-media">
    ${img("waterfront", { sizes: "(min-width: 900px) 50vw, 100vw" })}
    <figcaption>Illustrative scene</figcaption>
  </figure>
  <div class="home-story-copy">
    <p class="eyebrow">Our story</p>
    <h2 id="home-story-title" class="h2">Nature, people and water.</h2>
    <p>Aquatic World starts from a simple idea: the beauty of a living landscape can travel, if it is chosen and handled with care. The story page sets out the perspective behind the brand.</p>
    <blockquote class="pull-quote pull-quote--sm"><p>Bringing the beauty of nature a little further.</p></blockquote>
    <a class="text-link" href="${url("/our-story/")}">Read our story ${arrow}</a>
  </div>
</section>

<section class="section home-quality" aria-labelledby="home-quality-title">
  <div class="wrap home-quality-grid">
    <div>
      <p class="eyebrow">Quality</p>
      <h2 id="home-quality-title" class="h2">Care in every step, stated plainly.</h2>
      <p class="muted">Four proposed principles that guide selection and handling. They describe an approach, not a certification.</p>
      <a class="text-link" href="${url("/quality/")}">See the full approach ${arrow}</a>
    </div>
    <ol class="principles">
      <li><h3>Select with questions</h3><p>Every choice starts from the display it is meant for.</p></li>
      <li><h3>Observe before offering</h3><p>Condition and behaviour are watched, not assumed.</p></li>
      <li><h3>Handle with intent</h3><p>Packing is planned for the journey, not for appearance.</p></li>
      <li><h3>Follow up honestly</h3><p>Ask how things settled and say what is unknown.</p></li>
    </ol>
  </div>
</section>

<section class="enquiry-band" aria-labelledby="home-enquiry-title">
  ${img("school", { sizes: "100vw", cls: "enquiry-band-bg", alt: "" })}
  <div class="wrap enquiry-band-inner">
    <p class="eyebrow eyebrow--gold">Plan a project</p>
    <h2 id="home-enquiry-title" class="h2">Tell us what you are building.</h2>
    <p>Prepare a short enquiry brief. In this demo it is previewed in your browser and never sent.</p>
    <a class="btn btn-gold" href="${url(cta.href)}">${cta.label} ${arrow}</a>
  </div>
</section>`;
}

/* ---------------- Collections index ---------------- */
export function collections() {
  const [fish, plants, wood] = categories;
  const feature = (cat, cls, sizes) => `<article class="col-card ${cls}">
    <div class="col-card-media">${img(cat.image, { sizes })}</div>
    <div class="col-card-body">
      <p class="col-card-num"><span>${cat.number}</span> Collection</p>
      <h2 class="col-card-title"><a class="stretched" href="${url(`/collections/${cat.slug}/`)}">${cat.name}</a></h2>
      <p>${cat.summary}</p>
      <ul class="tags" aria-label="Considered for">${cat.considered.map((t) => `<li>${t}</li>`).join("")}</ul>
      <span class="cat-card-more" aria-hidden="true">Explore ${cat.short.toLowerCase()} ${arrow}</span>
    </div>
  </article>`;
  return `<section class="page-intro" aria-labelledby="collections-title">
  <div class="wrap page-intro-grid">
    <div>
      <p class="eyebrow">Collections</p>
      <h1 id="collections-title" class="display display--ink">Three collection families</h1>
    </div>
    <div>
      <p class="lead lead--ink">A good aquatic display is a composition: something that moves, a landscape that grows and a structure that holds it together. Start with the family you need, or read how they work together below.</p>
      <ul class="intro-links">${categories.map((c) => `<li><a href="${url(`/collections/${c.slug}/`)}"><span>${c.number}</span>${c.name}${arrow}</a></li>`).join("")}</ul>
    </div>
  </div>
</section>

<section class="section col-section" aria-label="Collection families">
  <div class="wrap col-grid">
    ${feature(fish, "col-card--feature", "(min-width: 980px) 58vw, 100vw")}
    ${feature(plants, "col-card--side", "(min-width: 980px) 36vw, 100vw")}
    ${feature(wood, "col-card--side", "(min-width: 980px) 36vw, 100vw")}
  </div>
</section>

<section class="section compare" aria-labelledby="compare-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow eyebrow--gold">How the families differ</p>
      <h2 id="compare-title" class="h2">Each family does a different job.</h2>
    </div>
    <div class="compare-grid">
      ${categories
        .map(
          (c) => `<div class="compare-col">
        <h3><span>${c.number}</span>${c.name}</h3>
        <dl>
          <div><dt>Role in a display</dt><dd>${c.role}</dd></div>
          <div><dt>What to look at</dt><dd>${c.look}</dd></div>
          <div><dt>A question to bring</dt><dd>${c.ask}</dd></div>
        </dl>
        <a class="text-link text-link--light" href="${url(`/collections/${c.slug}/`)}">${c.name} ${arrow}</a>
      </div>`,
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section cta-strip" aria-labelledby="col-cta-title">
  <div class="wrap cta-strip-inner">
    <h2 id="col-cta-title" class="h3">Not sure which family you need?</h2>
    <p class="muted">Describe the display you have in mind and choose “Not sure yet”.</p>
    <a class="btn btn-ink" href="${url("/contact/?interest=not-sure#enquiry")}">Start an enquiry brief ${arrow}</a>
  </div>
</section>`;
}

/* ---------------- Ornamental fish ---------------- */
export function ornamentalFish() {
  const cat = categoryBySlug["ornamental-fish"];
  return `<section class="cat-hero cat-hero--split" aria-labelledby="cat-title">
  <div class="wrap cat-hero-grid">
    <div class="cat-hero-copy">
      ${crumbs(cat)}
      <p class="eyebrow eyebrow--gold">Collection ${cat.number}</p>
      <h1 id="cat-title" class="display">${cat.name}</h1>
      <p class="lead">${cat.summary}</p>
      <div class="actions">
        <a class="btn btn-gold" href="${enquiryHref(cat.slug)}">${cat.enquiryLabel} ${arrow}</a>
        <a class="text-link text-link--light" href="${url("/collections/")}">All collections</a>
      </div>
    </div>
    <figure class="cat-hero-media">${img("fish", { eager: true, sizes: "(min-width: 980px) 50vw, 100vw" })}</figure>
  </div>
</section>

<section class="section studies" aria-labelledby="studies-title">
  <div class="wrap">
    <div class="section-head section-head--row">
      <div><p class="eyebrow eyebrow--gold">Studies</p><h2 id="studies-title" class="h2">Colour and form, side by side.</h2></div>
      <p class="section-intro">Two illustrative studies. Descriptions note what is visible in the image; they are not confirmed species or available stock.</p>
    </div>
    <div class="studies-grid">
      <figure class="study">
        <div class="study-frame">${img("betta", { sizes: "(min-width: 760px) 45vw, 100vw" })}</div>
        <figcaption><span class="study-num">Study 01</span><strong>Single-colour, long-finned form</strong>Deep red throughout; the spread of the fins carries most of the visual weight.</figcaption>
      </figure>
      <figure class="study">
        <div class="study-frame">${img("angelfish", { sizes: "(min-width: 760px) 45vw, 100vw" })}</div>
        <figcaption><span class="study-num">Study 02</span><strong>Banded, tall-bodied form</strong>Vertical bands and long trailing fins read strongly against planted backgrounds.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section considerations" aria-labelledby="consider-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Selection considerations</p>
      <h2 id="consider-title" class="h2">What shapes a fish selection</h2>
      <p class="muted">Framed as questions for a conversation. Care requirements vary by fish and should be confirmed for each case.</p>
    </div>
    <div class="consider-grid">
      <article><p class="consider-num">i.</p><h3>Colour and finnage</h3><p>Is colour meant to lead the display or accent it? Long fins read beautifully in calm water but change how a fish fits with others.</p></article>
      <article><p class="consider-num">ii.</p><h3>Form and movement</h3><p>Tall, slow-moving forms suit open water; small, quick fish bring life to planted edges. Movement is part of the composition.</p></article>
      <article><p class="consider-num">iii.</p><h3>Community fit</h3><p>Which inhabitants are already there or planned? Temperament and pace matter as much as appearance.</p></article>
      <article><p class="consider-num">iv.</p><h3>Display context</h3><p>Viewing distance, lighting and background colour all change how a fish is seen. A dark planted scape and a bright open tank ask for different choices.</p></article>
    </div>
  </div>
</section>

${enquiryPrep(cat, "Preparing a fish enquiry", [
  "Display size, layout and where it will be viewed from",
  "Current or planned inhabitants",
  "The look you are after: colour, movement, calm or lively",
  "An approximate quantity range and timing",
  "Whether plants or driftwood are part of the same plan",
])}

${siblings(cat.slug)}`;
}

/* ---------------- Aquatic plants ---------------- */
export function aquaticPlants() {
  const cat = categoryBySlug["aquatic-plants"];
  return `<section class="cat-hero cat-hero--banner" aria-labelledby="cat-title">
  <div class="cat-banner-media">${img("plants", { eager: true, sizes: "100vw" })}</div>
  <div class="wrap">
    <div class="cat-banner-panel">
      ${crumbs(cat)}
      <p class="eyebrow">Collection ${cat.number}</p>
      <h1 id="cat-title" class="display display--ink">${cat.name}</h1>
      <p class="lead lead--ink">${cat.summary}</p>
      <div class="actions">
        <a class="btn btn-ink" href="${enquiryHref(cat.slug)}">${cat.enquiryLabel} ${arrow}</a>
        <a class="text-link" href="${url("/collections/")}">All collections</a>
      </div>
    </div>
  </div>
</section>

<section class="section layers" aria-labelledby="layers-title">
  <div class="wrap layers-grid">
    <div>
      <p class="eyebrow eyebrow--gold">Composition</p>
      <h2 id="layers-title" class="h2">How plants shape an aquascape</h2>
      <p class="section-intro">Most planted displays read in three layers. Thinking in layers makes it easier to describe what a scape needs.</p>
      <ol class="layer-list">
        <li><span class="layer-key layer-key--3">3</span><div><h3>Background</h3><p>Tall, upright growth that gives height and hides the back of the display.</p></div></li>
        <li><span class="layer-key layer-key--2">2</span><div><h3>Midground</h3><p>Bushier forms that bridge the layers and soften hardscape edges.</p></div></li>
        <li><span class="layer-key layer-key--1">1</span><div><h3>Foreground</h3><p>Low, fine growth that keeps the front open and creates a sense of depth.</p></div></li>
      </ol>
    </div>
    <figure class="layer-diagram">
      <svg viewBox="0 0 520 340" role="img" aria-labelledby="layer-svg-title">
        <title id="layer-svg-title">Diagram: a display seen from the front, with a tall background layer, a medium midground layer and a low foreground layer.</title>
        <rect x="10" y="10" width="500" height="300" rx="2" fill="none" stroke="currentColor" stroke-opacity=".35"/>
        <path d="M10 310V90c40-30 70 10 100-25s60 20 90-15 70 25 110-5 60 15 90-20 70 20 110 0v285Z" fill="#2f6b4f" fill-opacity=".55"/>
        <path d="M10 310V200c50-40 90 5 140-25s80 30 130 0 100 20 150-10 50 5 80 0v145Z" fill="#3f8a5a" fill-opacity=".75"/>
        <path d="M10 310v-50c60-14 120 4 200-6s160 10 220 0 60 4 80 2v54Z" fill="#7fb36a"/>
        <g font-family="system-ui, sans-serif" font-size="15" fill="currentColor">
          <circle cx="470" cy="60" r="14" fill="#061C26" stroke="#DFC087"/><text x="470" y="65" text-anchor="middle" fill="#DFC087">3</text>
          <circle cx="470" cy="170" r="14" fill="#061C26" stroke="#DFC087"/><text x="470" y="175" text-anchor="middle" fill="#DFC087">2</text>
          <circle cx="470" cy="245" r="14" fill="#061C26" stroke="#DFC087"/><text x="470" y="250" text-anchor="middle" fill="#DFC087">1</text>
        </g>
      </svg>
      <figcaption>Front view, simplified. Proportions are illustrative.</figcaption>
    </figure>
  </div>
</section>

<section class="section traits" aria-labelledby="traits-title">
  <div class="wrap traits-grid">
    <figure class="traits-media">
      ${img("redPlants", { sizes: "(min-width: 900px) 42vw, 100vw" })}
      <figcaption>Illustrative study: red and bronze foliage against green.</figcaption>
    </figure>
    <div>
      <p class="eyebrow">Visual characteristics</p>
      <h2 id="traits-title" class="h2">What to look at in a plant</h2>
      <dl class="ruled-list">
        <div><dt>Leaf form</dt><dd>Broad leaves read as calm surfaces; fine leaves and stems read as texture and movement.</dd></div>
        <div><dt>Colour</dt><dd>Most scapes are built on greens. A single group of red or bronze foliage becomes a focal point.</dd></div>
        <div><dt>Texture</dt><dd>Mixing coarse and fine textures helps each layer stay distinct from a distance.</dd></div>
        <div><dt>Growth habit</dt><dd>Upright, spreading or carpeting growth decides where a plant belongs in the layers.</dd></div>
      </dl>
    </div>
  </div>
</section>

${enquiryPrep(cat, "Questions to plan a plant enquiry around", [
  "Which layer needs attention: background, midground or foreground?",
  "The mood you want: lush and dense, or open and minimal",
  "Display dimensions and lighting, as far as you know them",
  "Existing hardscape the planting should work with",
  "Approximate quantities and timing",
])}

${siblings(cat.slug)}`;
}

/* ---------------- Driftwood ---------------- */
export function driftwood() {
  const cat = categoryBySlug["driftwood"];
  return `<section class="cat-hero cat-hero--tall" aria-labelledby="cat-title">
  <div class="wrap cat-tall-grid">
    <figure class="cat-tall-media">${img("driftwood", { eager: true, sizes: "(min-width: 980px) 46vw, 100vw" })}</figure>
    <div class="cat-hero-copy">
      ${crumbs(cat)}
      <p class="eyebrow eyebrow--gold">Collection ${cat.number}</p>
      <h1 id="cat-title" class="display">${cat.name}</h1>
      <p class="lead">${cat.summary}</p>
      <dl class="glance">
        <div><dt>Role</dt><dd>${cat.role}</dd></div>
        <div><dt>Look at</dt><dd>${cat.look}</dd></div>
      </dl>
      <div class="actions">
        <a class="btn btn-gold" href="${enquiryHref(cat.slug)}">${cat.enquiryLabel} ${arrow}</a>
        <a class="text-link text-link--light" href="${url("/collections/")}">All collections</a>
      </div>
    </div>
  </div>
</section>

<section class="section composition" aria-labelledby="comp-title">
  <div class="wrap comp-grid">
    <figure class="comp-diagram">
      <svg viewBox="0 0 520 320" role="img" aria-labelledby="comp-svg-title">
        <title id="comp-svg-title">Diagram: a driftwood line rising from the lower left, a focal point about one third across, and open water on the right.</title>
        <rect x="10" y="10" width="500" height="300" fill="none" stroke="currentColor" stroke-opacity=".35"/>
        <path d="M177 10v300M343 10v300M10 110h500M10 210h500" stroke="currentColor" stroke-opacity=".14" stroke-dasharray="4 6"/>
        <path d="M40 300c40-60 90-110 137-150 30-26 60-60 70-110M177 150c40 0 90 20 140 70M150 180c-30-30-40-70-35-110M210 120c30-30 70-40 110-40" fill="none" stroke="#a7774a" stroke-width="9" stroke-linecap="round"/>
        <rect x="360" y="40" width="130" height="150" fill="#DFC087" fill-opacity=".08" stroke="#DFC087" stroke-opacity=".5" stroke-dasharray="3 5"/>
        <circle cx="177" cy="150" r="16" fill="none" stroke="#DFC087" stroke-width="2"/>
        <g font-family="system-ui, sans-serif" font-size="14" fill="currentColor">
          <text x="196" y="210">Focal point</text>
          <text x="374" y="120">Open water</text>
          <text x="92" y="296">Main line</text>
        </g>
      </svg>
      <figcaption>Simplified front view with thirds marked.</figcaption>
    </figure>
    <div>
      <p class="eyebrow eyebrow--gold">Structure</p>
      <h2 id="comp-title" class="h2">Structure sets the composition</h2>
      <ol class="numbered">
        <li><h3>Lines lead the eye</h3><p>The main direction of a piece decides how a viewer moves through the display.</p></li>
        <li><h3>Mass sets the scale</h3><p>A heavy base grounds the scene; fine branches make a display feel larger than it is.</p></li>
        <li><h3>Space lets it breathe</h3><p>Leaving open water beside the structure gives fish room to be seen.</p></li>
      </ol>
    </div>
  </div>
</section>

<section class="section material" aria-labelledby="material-title">
  <div class="wrap material-grid">
    <div>
      <p class="eyebrow">Material</p>
      <h2 id="material-title" class="h2">Reading the material</h2>
      <p class="muted">Visual notes for choosing between pieces. Preparation and suitability depend on the individual piece and display, and should be confirmed case by case.</p>
    </div>
    <dl class="ruled-list ruled-list--wide">
      <div><dt>Silhouette</dt><dd>Seen from the main viewing side, does the outline have one clear direction or several competing ones?</dd></div>
      <div><dt>Branching</dt><dd>Dense, fine branching creates detail and shelter; few heavy limbs create a bolder, calmer shape.</dd></div>
      <div><dt>Surface</dt><dd>Deep grooves and worn edges catch light differently from smooth wood, and plants attach to them differently.</dd></div>
      <div><dt>Tone</dt><dd>Warm brown tones contrast with green planting; darker wood recedes into a dark background.</dd></div>
    </dl>
  </div>
</section>

${enquiryPrep(cat, "Planning a hardscape enquiry", [
  "Display dimensions and the main viewing side",
  "The shape you imagine: upright, spreading or a single branch",
  "Whether one statement piece or several smaller pieces",
  "Planting and fish planned around the structure",
  "Photos or sketches of the space, if you have them",
])}

${siblings(cat.slug)}`;
}

/* ---------------- Our Story ---------------- */
export function story() {
  return `<section class="story-intro" aria-labelledby="story-title">
  <div class="wrap story-intro-inner">
    <p class="eyebrow">Our story</p>
    <h1 id="story-title" class="display display--ink">Bringing the beauty of nature <em>a little further.</em></h1>
    <p class="lead lead--ink">A proposed perspective for the Aquatic World brand: why living water matters, who it is for, and how it should be handled.</p>
  </div>
</section>

<figure class="story-wide">
  ${img("waterfront", { sizes: "100vw" })}
  <figcaption class="wrap">Illustrative waterfront scene. It does not depict company premises or a confirmed location.</figcaption>
</figure>

<article class="section story-body" aria-label="The story">
  <div class="story-column">
    <section aria-labelledby="ch-nature">
      <p class="chapter-num">I</p>
      <h2 id="ch-nature" class="h2">Nature</h2>
      <p class="drop">A planted aquarium is a small landscape that keeps changing. Light moves through leaves, wood softens with time and fish settle into the spaces left for them. The brand begins from respect for that living quality — the idea that a display is grown and looked after, not simply assembled.</p>
    </section>
    <section aria-labelledby="ch-people">
      <p class="chapter-num">II</p>
      <h2 id="ch-people" class="h2">People</h2>
      <p>The people behind a beautiful display are rarely seen: the retailer who advises a first-time keeper, the aquascaper who spends weeks on a single layout, the enthusiast who rebuilds a tank until it feels right. Aquatic World is imagined as a partner to them — useful in conversation, careful in what it promises.</p>
    </section>
    <blockquote class="pull-quote"><p>Good aquatic things travel far — when they are chosen with care.</p></blockquote>
    <section aria-labelledby="ch-water">
      <p class="chapter-num">III</p>
      <h2 id="ch-water" class="h2">Water</h2>
      <p>Water connects every part of the work, from the place a plant grows to the display where it finally sits. Moving living things through water asks for patience and honesty about what can and cannot be known in advance. That is where quality starts.</p>
    </section>
  </div>
</article>

<figure class="story-pause">
  ${img("school", { sizes: "100vw", alt: "" })}
  <figcaption class="story-pause-text"><span>Still water. Slow decisions.</span></figcaption>
</figure>

<section class="section values" aria-labelledby="values-title">
  <div class="wrap values-grid">
    <div>
      <p class="eyebrow">Proposed values</p>
      <h2 id="values-title" class="h2">What the brand would stand for</h2>
      <p class="muted">Draft values for discussion; they would need to be confirmed by a real organisation before public use.</p>
    </div>
    <ol class="values-list">
      <li><h3>Composition over collection</h3><p>Help people build displays that work as a whole, not lists of items.</p></li>
      <li><h3>Care that can be explained</h3><p>Every handling decision should have a reason someone can ask about.</p></li>
      <li><h3>Honesty about the unknown</h3><p>Say clearly what is illustrative, uncertain or still to be confirmed.</p></li>
    </ol>
  </div>
</section>

<section class="section cta-strip cta-strip--dark" aria-labelledby="story-next-title">
  <div class="wrap cta-strip-inner">
    <h2 id="story-next-title" class="h3">See where the story leads.</h2>
    <p>Three collection families, each with its own page.</p>
    <a class="btn btn-gold" href="${url("/collections/")}">Explore the collections ${arrow}</a>
    <a class="text-link text-link--light" href="${url("/quality/")}">Read about quality ${arrow}</a>
  </div>
</section>`;
}

/* ---------------- Quality ---------------- */
export function quality() {
  const steps = [
    ["Sourcing", "Know where each item comes from and keep a record that can be shared.", "Where does this come from, and how is that recorded?"],
    ["Observation", "Allow time to watch condition and behaviour before anything is offered.", "How long is something observed before it is offered?"],
    ["Preparation", "Plan holding and acclimation around the receiving display, not a generic routine.", "What do you need to know about my setup?"],
    ["Handling & packing", "Pack for the journey and the conditions, and keep handling to a minimum.", "How is packing adapted to distance and timing?"],
    ["Follow-up", "Ask how things settled and record what should change next time.", "What happens if something does not settle well?"],
  ];
  return `<section class="page-intro" aria-labelledby="quality-title">
  <div class="wrap page-intro-grid">
    <div>
      <p class="eyebrow">Quality</p>
      <h1 id="quality-title" class="display display--ink">A thoughtful selection process, explained.</h1>
    </div>
    <div>
      <p class="lead lead--ink">Quality in living goods is mostly about decisions made before anything moves. This page sets out what a careful process should consider and the questions worth asking.</p>
      <p class="notice"><strong>Proposed principles.</strong> Aquatic World is an illustrative concept. Nothing on this page is a certification, guarantee or audited standard.</p>
    </div>
  </div>
</section>

<section class="section process" aria-labelledby="process-title">
  <div class="wrap">
    <div class="section-head section-head--row">
      <div><p class="eyebrow eyebrow--gold">The process</p><h2 id="process-title" class="h2">Five considerations, in order</h2></div>
      <p class="section-intro">Each step pairs a principle with a question a buyer can reasonably ask.</p>
    </div>
    <ol class="process-line">
      ${steps
        .map(
          ([title, text, ask], i) => `<li>
        <span class="process-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <h3>${title}</h3>
        <p>${text}</p>
        <p class="process-ask"><span>Ask</span>${ask}</p>
      </li>`,
        )
        .join("")}
    </ol>
  </div>
</section>

<section class="section questions" aria-labelledby="questions-title">
  <div class="wrap questions-grid">
    <figure class="questions-media">
      ${img("angelfish", { sizes: "(min-width: 900px) 38vw, 100vw" })}
      <figcaption>Illustrative study image.</figcaption>
    </figure>
    <div>
      <p class="eyebrow">Practical questions</p>
      <h2 id="questions-title" class="h2">Questions worth asking any supplier</h2>
      <ul class="checklist checklist--two">
        <li>What information comes with each item?</li>
        <li>How are condition and behaviour checked?</li>
        <li>How is packing chosen for distance and timing?</li>
        <li>What should be ready before arrival?</li>
        <li>Who can I talk to if something looks wrong?</li>
        <li>What cannot be known in advance?</li>
      </ul>
    </div>
  </div>
</section>

<section class="section expectations" aria-labelledby="expect-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow eyebrow--gold">Expectations</p>
      <h2 id="expect-title" class="h2">Reasonable expectations, on both sides</h2>
    </div>
    <div class="expect-grid">
      <div><h3>What a supplier can describe</h3><p>How items are selected, observed, packed and followed up — and what records exist.</p></div>
      <div><h3>What depends on the receiver</h3><p>A prepared display, a plan for arrival and honest information about the setup.</p></div>
      <div><h3>What no one can promise</h3><p>Living things vary. Clear communication matters more than guarantees.</p></div>
    </div>
  </div>
</section>

<section class="section cta-strip" aria-labelledby="quality-cta-title">
  <div class="wrap cta-strip-inner">
    <h2 id="quality-cta-title" class="h3">Have specific requirements?</h2>
    <p class="muted">Note them in an enquiry brief so they can be discussed first.</p>
    <a class="btn btn-ink" href="${url(cta.href)}">Discuss requirements ${arrow}</a>
  </div>
</section>`;
}

/* ---------------- Contact ---------------- */
export function contact() {
  const interests = [...categories.map((c) => [c.slug, c.name]), ["not-sure", "Not sure yet"]];
  return `<section class="contact-banner" aria-labelledby="contact-title">
  ${img("school", { eager: true, sizes: "100vw", alt: "", cls: "contact-banner-bg" })}
  <div class="wrap contact-banner-inner">
    <p class="eyebrow eyebrow--gold">Contact</p>
    <h1 id="contact-title" class="display">Prepare an enquiry brief</h1>
    <p class="lead">Describe your project in a few fields and preview a tidy brief. This demo keeps everything in your browser.</p>
  </div>
</section>

<section class="section contact-body" aria-label="Enquiry workspace">
  <div class="wrap contact-grid">
    <aside class="contact-aside" aria-labelledby="how-title">
      <h2 id="how-title" class="h3">How this works</h2>
      <ol class="steps-small">
        <li>Describe the project and the families involved.</li>
        <li>Preview the brief and check it reads well.</li>
        <li>Nothing is sent: there is no enquiry service behind this demo.</li>
      </ol>
      <div class="context-card" data-context hidden>
        <p class="eyebrow">Your context</p>
        <p data-context-text></p>
        <a class="text-link" data-context-link href="${url("/collections/")}">Back to the collection ${arrow}</a>
      </div>
      <div class="helpful">
        <h3>What makes a brief useful</h3>
        <ul class="checklist">
          <li>Display size and viewing side</li>
          <li>Existing or planned inhabitants and planting</li>
          <li>The look and mood you want</li>
          <li>Approximate quantities and timing</li>
        </ul>
      </div>
      <p class="notice notice--quiet"><strong>Demo limitation.</strong> This concept has no email address, phone number or form endpoint. Real contact details would be added only once verified.</p>
    </aside>

    <div class="form-panel" id="enquiry" tabindex="-1">
      <h2 class="h3" id="form-title">Your enquiry brief</h2>
      <p class="form-note">Fields marked <span class="req-mark">Required</span> must be completed. Nothing you type leaves this page.</p>
      <noscript><p class="notice">JavaScript is turned off, so the preview cannot run. You can still use these fields as a checklist for your own notes — nothing on this page is sent anywhere. Browse the <a href="${url("/collections/")}">collections</a> for context.</p></noscript>
      <div class="error-summary" data-error-summary role="alert" tabindex="-1" hidden>
        <h3>Please check <span data-error-count>these fields</span></h3>
        <ul data-error-list></ul>
      </div>
      <form class="enquiry-form" data-enquiry-form aria-labelledby="form-title" novalidate>
        <div class="field-row">
          <div class="field" data-field="name">
            <label for="f-name">Name <span class="req-mark">Required</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-error">
            <p class="field-error" id="f-name-error" data-error-for="name"></p>
          </div>
          <div class="field" data-field="organisation">
            <label for="f-org">Organisation <span class="opt-mark">Optional</span></label>
            <input id="f-org" name="organisation" type="text" autocomplete="organization">
          </div>
        </div>
        <div class="field-row">
          <div class="field" data-field="email">
            <label for="f-email">Email <span class="req-mark">Required</span></label>
            <input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-hint f-email-error">
            <p class="field-hint" id="f-email-hint">Used only in the preview below.</p>
            <p class="field-error" id="f-email-error" data-error-for="email"></p>
          </div>
          <div class="field" data-field="role">
            <label for="f-role">You are <span class="opt-mark">Optional</span></label>
            <select id="f-role" name="role">
              <option value="">Choose one</option>
              <option>Aquarium retailer</option>
              <option>Aquascaping professional</option>
              <option>Enthusiast</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <fieldset class="field" data-field="interest" aria-describedby="f-interest-error">
          <legend>Collections involved <span class="req-mark">Required</span></legend>
          <div class="choice-grid">
            ${interests
              .map(
                ([value, label]) => `<label class="choice"><input type="checkbox" name="interest" value="${value}"><span>${label}</span></label>`,
              )
              .join("")}
          </div>
          <p class="field-error" id="f-interest-error" data-error-for="interest"></p>
        </fieldset>
        <div class="field" data-field="project">
          <label for="f-project">About the project <span class="req-mark">Required</span></label>
          <textarea id="f-project" name="project" rows="5" required aria-describedby="f-project-hint f-project-error"></textarea>
          <p class="field-hint" id="f-project-hint">At least 20 characters. Display size, look and timing are a good start.</p>
          <p class="field-error" id="f-project-error" data-error-for="project"></p>
        </div>
        <div class="field" data-field="timing">
          <label for="f-timing">Timing <span class="opt-mark">Optional</span></label>
          <select id="f-timing" name="timing">
            <option value="">No fixed timing</option>
            <option>Within a month</option>
            <option>In one to three months</option>
            <option>Later / exploring</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn btn-gold" type="submit" data-requires-js disabled>Preview enquiry ${arrow}</button>
          <p class="form-actions-note">Preview only. No message is sent.</p>
        </div>
      </form>
      <section class="preview" data-preview tabindex="-1" aria-labelledby="preview-title" hidden>
        <p class="preview-status"><strong>Nothing was sent.</strong> This is a local preview; the demo has no enquiry service.</p>
        <h3 id="preview-title">Brief preview</h3>
        <dl class="preview-list" data-preview-list></dl>
        <div class="preview-actions">
          <button class="btn btn-outline" type="button" data-edit>Edit brief</button>
          <button class="btn btn-quiet" type="button" data-clear>Clear and start again</button>
        </div>
      </section>
    </div>
  </div>
</section>`;
}

/* ---------------- Not found ---------------- */
export function notFound() {
  return `<section class="page-intro not-found" aria-labelledby="nf-title">
  <div class="wrap not-found-inner">
    <p class="eyebrow">Error 404</p>
    <h1 id="nf-title" class="display display--ink">This page is not part of the collection.</h1>
    <p class="lead lead--ink">The address may be mistyped, or the page may not exist in this demo. These destinations are available:</p>
    <ul class="nf-links">
      <li><a href="${url("/")}">Home ${arrow}</a></li>
      <li><a href="${url("/collections/")}">Collections ${arrow}</a></li>
      ${categories.map((c) => `<li><a href="${url(`/collections/${c.slug}/`)}">${c.name} ${arrow}</a></li>`).join("")}
      <li><a href="${url("/our-story/")}">Our Story ${arrow}</a></li>
      <li><a href="${url("/quality/")}">Quality ${arrow}</a></li>
      <li><a href="${url("/contact/")}">Contact ${arrow}</a></li>
    </ul>
  </div>
</section>`;
}
