// Static (no-browser) checks of the built site against the Stage 2 immersive Home contract, with the
// Stage 3 selection query (min-aspect-ratio: 6/5 at every width) and near-square range.
// Usage: node scripts/check-motion.mjs   (run after `npm run build`)
// Source/output invariants only. Rendering, contrast and real film playback are NOT tested here.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(demoDir, "dist");
// Stage 2 films and their first-frame posters (input-stage2/media/manifest.json), copied byte-for-byte.
const MEDIA = {
  "landscape.mp4": ["e2ae169d0d91e28d8f6a9b0a6ca76227312b691d8a53c00c7127abd4e66cc38b", 1325946],
  "portrait.mp4": ["df27628aeb8e3bbeb005a74eaac46af038033a752a13b20cfc2a8baa2775ac3a", 1536090],
  "landscape-poster.webp": ["9f2be6ac3c0beadfe2ed0c05076ac17389e94b85253f8eed21c0494061a7757e", 121156],
  "portrait-poster.webp": ["40d48c199a1c3aede8a4b6c42697f1b1a007392ad90c75f8c5f5d5c06e0df6f6", 93462],
};
// Stage 3: one selection query at every width (no width or height guard).
const QUERY = "(min-aspect-ratio: 6/5)";
const SQUARE = "(4/5 <= aspect-ratio < 6/5)";
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${pass || !detail ? "" : `  ${detail}`}`);
};
const note = (text) => console.log(`NOTE  ${text}`);
const read = (p) => readFileSync(p, "utf8");
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const count = (s, needle) => s.split(needle).length - 1;
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

/* Media bytes: the supplied Stage 2 films and posters, unaltered */
for (const [file, [hash, bytes]] of Object.entries(MEDIA)) {
  for (const [where, dir] of [["source", demoDir], ["built", dist]]) {
    const p = join(dir, "assets/immersive", file);
    check(`${file} ${where} bytes and SHA-256 match the manifest`, existsSync(p) && statSync(p).size === bytes && sha(p) === hash);
  }
}
check("assets/immersive holds exactly the four supplied files", readdirSync(join(dist, "assets/immersive")).sort().join() === Object.keys(MEDIA).sort().join());
// Top-level MP4 boxes: moov before mdat (progressive start), and only a video handler (no audio track).
const boxes = (buf) => {
  const out = [];
  for (let at = 0; at + 8 <= buf.length; ) {
    const size = buf.readUInt32BE(at);
    out.push(buf.toString("latin1", at + 4, at + 8));
    if (size < 8) break;
    at += size;
  }
  return out;
};
for (const film of ["landscape.mp4", "portrait.mp4"]) {
  const buf = readFileSync(join(dist, "assets/immersive", film));
  const top = boxes(buf);
  check(`${film}: ftyp, moov before mdat (fast start)`, top[0] === "ftyp" && top.indexOf("moov") > -1 && top.indexOf("moov") < top.indexOf("mdat"));
  const moov = buf.subarray(0, buf.indexOf("mdat", 0, "latin1"));
  check(`${film}: H.264 video track, no audio track`, moov.includes("avc1", 0, "latin1") && moov.includes("vide", 0, "latin1") && !moov.includes("soun", 0, "latin1"));
}
note("Film decoding, playback, loop join and frame content are NOT tested here (coordinator browser review).");
check("old framed-scene PNG no longer shipped", !existsSync(join(dist, "assets/motion")));

/* Home environment markup */
const home = read(join(dist, "index.html"));
const env = home.slice(home.indexOf('<div class="home-env"'), home.indexOf("</div>", home.indexOf('<div class="home-env"')));
const video = env.match(/<video[^>]*>/)?.[0] ?? "";
check("one environment, before the header, decorative", count(home, "data-home-env") === 1 && home.indexOf("data-home-env") < home.indexOf("<header") && env.includes('aria-hidden="true"'));
check("landscape poster <source> uses the common media query", env.includes(`<source media="${QUERY}" srcset="/assets/immersive/landscape-poster.webp"`));
check("portrait poster is the <img> fallback with empty alt", /<img class="home-env-poster" src="\/assets\/immersive\/portrait-poster\.webp" width="720" height="1280" alt=""/.test(env));
check("film URLs are literal data attributes", video.includes('data-landscape-src="/assets/immersive/landscape.mp4"') && video.includes('data-portrait-src="/assets/immersive/portrait.mp4"'));
check("no eager film src, preload none", !/\ssrc=/.test(video) && video.includes('preload="none"') && !video.includes("autoplay"));
check("film is muted, inline, looping, without controls", ["muted", "playsinline", "loop"].every((a) => new RegExp(`\\s${a}[\\s>]`).test(video)) && !video.includes("controls"));
check("no <source> children inside the video", !/<video[^>]*>[\s\S]*?<source[\s\S]*?<\/video>/.test(home));
check("motion control: native button, hidden until JS, after header, labelled", /<\/header>\n<button class="bg-toggle" type="button" data-bg-toggle hidden>/.test(home) && home.includes("data-bg-label>Pause background</span>"));

/* Rejected presentation removed */
for (const [label, needle] of [["framed scene", "home-scene"], ["particles", "particles"], ["water-light layer", "water-light"], ["figure/caption", "<figure"], ["timeline/progress", "<progress"], ["photographic band", "enquiry-band"]]) {
  check(`Home has no ${label}`, !home.includes(needle));
}
check("Home has exactly one gold button (hero CTA)", count(home, "btn-gold") === 1 && /class="btn btn-gold home-cta" href="\/collections\/">Explore the collections/.test(home));
check("Home header omits the enquiry button and divider", !home.match(/<header[\s\S]*?<\/header>/)[0].includes("header-cta") && !home.includes("header-divider"));

/* Exact shared copy */
const words = text(home);
for (const phrase of [
  "Fish · Plants · Driftwood", "A world beneath the surface.", "Discover ornamental fish, aquatic plants and natural driftwood.",
  "Explore the collections", "Scroll to explore", "Three elements. One aquatic world.", "Colour, form and gentle movement.",
  "Texture, depth and a living landscape.", "Natural lines and structure.", "A closer connection to nature.",
  "Explore the elements of an aquatic landscape, and the questions that shape it.", "Discuss a project",
]) check(`copy: “${phrase}”`, words.includes(phrase));
check("heading break is markup, not a slash", /A world beneath<br> the surface\./.test(home) && !words.includes("beneath /"));
check("one fictional-demo disclosure on Home", count(home, "illustrative design concept") === 1 && !home.includes("Design concept · Illustrative content only"));

/* Real destinations, no Home section anchors */
const hrefs = [...home.matchAll(/href="([^"]*)"/g)].map((m) => m[1]).filter((h) => !h.endsWith(".css") && !h.endsWith(".svg"));
check("Home in-page anchors are only skip link and Back to top", hrefs.filter((h) => h.startsWith("#")).every((h) => h === "#main" || h === "#top"));
for (const [label, href] of [["CTA", "/collections/\">Explore the collections"], ["fish", "/collections/ornamental-fish/"], ["plants", "/collections/aquatic-plants/"], ["driftwood", "/collections/driftwood/"], ["overview", "/collections/\">View all collections"], ["story", "/our-story/\">Our Story"], ["quality", "/quality/\">Quality"], ["enquiry", "/contact/#enquiry\">Discuss a project"]]) {
  check(`Home ${label} link → ${href.split('"')[0]}`, home.includes(`href="${href}`));
}

/* JS and CSS: no hard-coded runtime URLs or query; Home-scoped type; media without transforms */
const js = read(join(dist, "assets/site.js"));
const css = read(join(dist, "assets/site.css"));
check("site.js has no hard-coded asset URL or media query", !/\.mp4|\.webp|\/assets\/|min-aspect-ratio/.test(js));
check("site.js reads data-*-src and the <source> media attribute", js.includes("dataset.landscapeSrc") && js.includes("dataset.portraitSrc") && js.includes('querySelector("source").media'));
check("site.js sets src only inside play()", count(js, 'setAttribute("src"') === 1);
check("site.js keeps Pause in sessionStorage", js.includes("sessionStorage"));
check("site.css has no asset URLs", !/url\(/.test(css));
check("Georgia/Arial scoped to body.page-home", /\.page-home \{[^}]*--serif: Georgia[^}]*--sans: Arial/.test(css) && /:root \{[^}]*--serif: "Iowan Old Style"/.test(css));
check("portrait default: poster and film cover at 50% 30%", /\.home-env-poster, \.home-env-video \{ object-fit: cover; object-position: 50% 30%; \}/.test(css));
const landscapeBlock = css.slice(css.indexOf(`@media ${QUERY} {`), css.indexOf("\n}", css.indexOf(`@media ${QUERY} {`)));
check("landscape query: poster and film at 50% 50%", /\.home-env-poster, \.home-env-video \{ object-position: 50% 50%; \}/.test(landscapeBlock));
check("only these two crop rules position the environment media", (css.match(/^\s*\.home-env-poster, \.home-env-video \{/gm) ?? []).length === 2 && !/\.home-env(-poster|-video)?[^,{]*\{[^}]*object-position/.test(css.replace(/\.home-env-poster, \.home-env-video \{[^}]*\}/g, "")));
check("environment media never transformed or stretched", !/\.home-env[^{]*\{[^}]*(transform|scale|translate|object-fit: (fill|none))/.test(css));
const square = css.match(/@media \(4\/5 <= aspect-ratio < 6\/5\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
check("near-square portrait: arrival copy starts at 70svh and the hero grows (no fixed height)", /padding-top: calc\(70svh - var\(--header-h\)\)/.test(square) && /justify-content: flex-start/.test(square) && !/(^|[^-])height:/.test(square) && /\.home-arrival \{[^}]*min-height: calc\(100svh - var\(--header-h\)\)/.test(css));
check("near-square uses the exact 4/5 <= aspect < 6/5 range with no width/height guard", count(css, `@media ${SQUARE} {`) === 1 && !/@media[^{]*(119999|min-height: 561px)/.test(css));
const homeCss = css.slice(css.indexOf("/* ---------- Home:"), css.indexOf("/* ---------- Page intro"));
const homeMedia = [...homeCss.matchAll(/@media ([^{]+)\{/g)].map((m) => ({ q: m[1].trim(), at: m.index }));
check("near-square rule is the last Home media rule (after every narrow-screen override)", homeMedia.at(-1)?.q === SQUARE);
check("Stage 2 900px guard removed from every Home media query", homeMedia.every(({ q }) => !q.includes("900px) and (min-aspect")) && !home.includes("min-width: 900px) and (min-aspect"));
const narrow = homeCss.match(/@media \(min-aspect-ratio: 6\/5\) and \(max-height: 560px\), \(min-aspect-ratio: 6\/5\) and \(max-width: 899\.98px\) \{([\s\S]*?)\n\}/);
check("narrow/short landscape: compact left copy column ≤ 44vw, lead not shrunk, CTA ≥ 44px", Boolean(narrow) && /max-width: min\(30rem, 44vw\)/.test(narrow[1]) && /\.home-lead \{ font-size: 1\.0625rem; \}/.test(narrow[1]) && /min-height: 48px/.test(narrow[1]) && narrow.index > homeCss.indexOf(`@media ${QUERY} {`));
const short = homeCss.match(/@media \(min-aspect-ratio: 6\/5\) and \(max-height: 560px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
check("short landscape: hero grows from the top, no fixed height or overflow clip", /justify-content: flex-start/.test(short) && !/(^|[^-])height:|overflow/.test(short));
/* Aspect classification for the brief's viewports (same arithmetic as the media queries). */
const kind = (w, h) => (w / h >= 6 / 5 ? "landscape" : w / h >= 4 / 5 ? "near-square" : "portrait");
for (const [w, h, want] of [[844, 390, "landscape"], [667, 375, "landscape"], [1440, 900, "landscape"], [1024, 768, "landscape"], [900, 900, "near-square"], [900, 800, "near-square"], [1000, 900, "near-square"], [768, 1024, "portrait"], [430, 932, "portrait"], [390, 844, "portrait"], [360, 800, "portrait"], [320, 800, "portrait"]]) {
  check(`${w}×${h} selects ${want}`, kind(w, h) === want);
}
check("environment fixed behind content", /\.home-env \{ position: fixed;[^}]*z-index: -1/.test(css));
check("composition switch reuses the media query", css.includes(`@media ${QUERY} {`) && home.includes(`<source media="${QUERY}"`));
check("no Home white/cream band background", !/\.home-(arrival|chapter|footer)[^{]*\{[^}]*background: (var\(--(cream|paper)\)|#fff)/.test(css));
check("no particle/scene keyframes remain", !/@keyframes (water|particle)/.test(css));

/* Runtime references stay inside the build */
const files = walk(dist).filter((f) => /\.(html|css|js)$/.test(f));
const escapes = files.filter((f) => /(input\/|baseline\/|round-\d|canonical|\.\.\/|https?:\/\/(?!www\.w3\.org))/.test(read(f)));
check("no runtime URL escapes into input/baseline/other workspaces or external hosts", escapes.length === 0, escapes.join(", "));

/* Routes, inner pages and Contact */
const routes = ["", "collections/", "collections/ornamental-fish/", "collections/aquatic-plants/", "collections/driftwood/", "our-story/", "quality/", "contact/"];
const pages = routes.map((r) => join(dist, r, "index.html")).concat(join(dist, "404.html"));
check("eight routes + 404 built", pages.every(existsSync));
const h1s = pages.map((p) => read(p).match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]);
const titles = pages.map((p) => read(p).match(/<title>(.*?)<\/title>/)?.[1]);
check("distinct H1 and title per page", new Set(h1s).size === pages.length && new Set(titles).size === pages.length);
check("environment, film and motion control only on Home", pages.slice(1).every((p) => !/data-home-env|data-bg-toggle|\.mp4|page-home/.test(read(p))));
check("inner pages keep the header enquiry button", pages.slice(1, 8).every((p) => read(p).match(/<header[\s\S]*?<\/header>/)[0].includes('class="btn btn-gold header-cta" href="/contact/#enquiry"')));
check("header current-page indicator per route", pages.slice(0, 8).every((p) => /aria-current="(page|location)"/.test(read(p).match(/<header[\s\S]*?<\/header>/)[0])));
check("category pages mark Collections as current section", pages.slice(2, 5).every((p) => /href="\/collections\/" aria-current="location"/.test(read(p))));
check("category pages keep prefilled enquiry links", ["ornamental-fish", "aquatic-plants", "driftwood"].every((s, i) => read(pages[2 + i]).includes(`/contact/?interest=${s}#enquiry`)));
const contact = read(join(dist, "contact/index.html"));
check("Contact keeps four field groups", ["name", "email", "interest", "project"].every((f) => contact.includes(`data-field="${f}"`)) && count(contact, "data-field=\"") === 4);
check("Contact keeps preview/edit/clear, context and no-send copy", ["data-preview", "data-edit", "data-clear", "data-error-summary", "data-context"].every((m) => contact.includes(m)) && /nothing is sent|never sent|Nothing was sent/i.test(contact));
check("Contact logic still present in site.js", ["data-enquiry-form", "interest", "data-edit", "data-clear", "replaceState"].every((m) => js.includes(m)));

/* Internal links and assets resolve (films are data attributes, reported above) */
const broken = [];
for (const f of files.filter((f) => f.endsWith(".html"))) {
  for (const [, u] of read(f).matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const path = u.split(/[?#]/)[0];
    const target = join(dist, path);
    if (!(existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html"))))) broken.push(`${f.slice(dist.length)} → ${u}`);
  }
  for (const [, list] of read(f).matchAll(/srcset="([^"]*)"/g)) {
    for (const u of list.split(",").map((s) => s.trim().split(" ")[0])) if (!existsSync(join(dist, u))) broken.push(`${f.slice(dist.length)} → ${u}`);
  }
}
check("internal links, src and srcset resolve", broken.length === 0, broken.slice(0, 5).join("; "));

const pkg = JSON.parse(read(join(demoDir, "package.json")));
check("no dependencies declared", !pkg.dependencies && !pkg.devDependencies);

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} static checks passed (source/output only; not rendered or film evidence)`);
process.exit(failed ? 1 : 0);
