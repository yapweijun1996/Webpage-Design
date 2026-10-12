// Static (no-browser) checks of the built site against the Home motion contract.
// Usage: node scripts/check-motion.mjs   (run after `npm run build`)
// Reads ../input/animation/styles.css only to compare values; nothing at runtime references input/.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(demoDir, "dist");
const SHA = "8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1";
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${pass || !detail ? "" : `  ${detail}`}`);
};
const read = (p) => readFileSync(p, "utf8");
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const count = (s, needle) => s.split(needle).length - 1;

/* Asset bytes */
check("source PNG hash (demo/assets/motion)", sha(join(demoDir, "assets/motion/hero-angelfish.png")) === SHA);
check("built PNG hash (dist/assets/motion)", sha(join(dist, "assets/motion/hero-angelfish.png")) === SHA);

/* Home markup */
const home = read(join(dist, "index.html"));
const scene = home.slice(home.indexOf("<figure class=\"home-scene\""), home.indexOf("</figure>", home.indexOf("home-scene")));
check("Home has one scene", count(home, "data-home-scene") === 1);
check("scene image is the owned PNG at 1882×836", /<img src="\/assets\/motion\/hero-angelfish\.png" width="1882" height="836" alt="[^"]+"/.test(scene));
check("no <picture>/crop derivative in hero", !home.includes("hero-angelfish-fish") && !scene.includes("<picture"));
check("exactly one water-light layer", count(home, "class=\"water-light\"") === 1);
const particles = scene.match(/<div class="particles">(.*?)<\/div>/)?.[1] ?? "";
check("exactly ten particles", count(particles, "<i></i>") === 10 && particles.replace(/<i><\/i>/g, "") === "");
check("decorations aria-hidden", /<div class="water-effects" aria-hidden="true">/.test(scene));
check("button native, hidden until JS readiness, labelled", /<button class="motion-toggle" type="button" data-motion-toggle aria-controls="home-scene-frame" hidden>/.test(scene) && scene.includes("<span data-motion-label>Play animation</span>"));
check("copy and primary collection action precede media in source order", home.indexOf("Browse the collections") < home.indexOf("home-scene-frame") && home.indexOf("<h1") < home.indexOf("home-scene-frame"));
check("initial state paused, effects off", /data-motion="paused" data-effects="off" data-opt-in="false" data-image="loading"/.test(scene));

/* CSS against the shared reference values */
const css = read(join(dist, "assets/site.css"));
const ref = read(join(demoDir, "..", "input/animation/styles.css"));
const norm = (s) => s.replace(/\s+/g, " ").replace(/(^|[^\d])\.(\d)/g, "$10.$2").trim();
const rule = (src, sel) => {
  const i = src.indexOf(sel + " {");
  return i < 0 ? null : norm(src.slice(i + sel.length + 2, src.indexOf("}", i)));
};
const keyframes = (src, name) => {
  const i = src.indexOf(`@keyframes ${name}`);
  const body = src.slice(src.indexOf("{", i) + 1);
  return norm(body.slice(0, body.indexOf("}\n}") + 1 || body.indexOf("}}")));
};
for (let n = 1; n <= 10; n++) {
  const sel = `.particles i:nth-child(${n})`;
  check(`particle ${n} position/delay/duration match reference`, rule(css, sel) === rule(ref, sel), `${rule(css, sel)} vs ${rule(ref, sel)}`);
}
check("particle field inset matches reference", rule(css, ".particles") === rule(ref, ".particles"));
check("water-light keyframes match reference", keyframes(css, "water-light") === keyframes(ref, "water-light"), keyframes(css, "water-light"));
check("particle keyframes match reference", keyframes(css, "water-particle") === keyframes(ref, "water-particle"), keyframes(css, "water-particle"));
const light = rule(css, ".water-light");
check("water-light geometry/timing", ["left: 3%", "top: 3%", "width: 46%", "height: 85%", "animation: water-light 18s ease-in-out infinite"].every((p) => light.includes(p)), light);
const dot = rule(css, ".particles i");
check("particles 2px round, 16s ease-in-out base", ["width: 2px", "height: 2px", "border-radius: 50%", "animation: water-particle 16s ease-in-out infinite"].every((p) => dot.includes(p)), dot);
check("decorations non-interactive, clipped, hidden by visibility", /\.water-effects \{ position: absolute; inset: 0; overflow: hidden; pointer-events: none; visibility: hidden; \}/.test(css));
check("no-JS hides decorations", css.includes(".no-js .water-effects { display: none; }"));
check("frame reserves 1882/836, image contain", /\.home-scene-frame \{[^}]*aspect-ratio: 1882 \/ 836/.test(css) && /\.home-scene-frame img \{[^}]*object-fit: contain/.test(css));
check("no transform/crop on scene image", !/\.home-scene-frame img \{[^}]*(transform|object-fit: cover|scale)/.test(css));
check("global reduced-motion rule excludes decorations", css.includes("*:not(.water-effects, .water-effects *), *::before, *::after"));

/* Runtime references stay inside the build */
const files = walk(dist).filter((f) => /\.(html|css|js)$/.test(f));
const escapes = files.filter((f) => /(input\/|baseline\/|round-5|canonical|\.\.\/|https?:\/\/(?!www\.w3\.org))/.test(read(f)));
check("no runtime URL escapes into input/baseline/other workspaces or external hosts", escapes.length === 0, escapes.join(", "));

/* Routes and Contact */
const routes = ["", "collections/", "collections/ornamental-fish/", "collections/aquatic-plants/", "collections/driftwood/", "our-story/", "quality/", "contact/"];
const pages = routes.map((r) => join(dist, r, "index.html")).concat(join(dist, "404.html"));
check("eight routes + 404 built", pages.every(existsSync));
const h1s = pages.map((p) => read(p).match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]);
const titles = pages.map((p) => read(p).match(/<title>(.*?)<\/title>/)?.[1]);
check("distinct H1 and title per page", new Set(h1s).size === pages.length && new Set(titles).size === pages.length);
check("scene only on Home", pages.slice(1).every((p) => !read(p).includes("data-home-scene")));
check("header current-page indicator per route", pages.slice(0, 8).every((p) => /aria-current="(page|location)"/.test(read(p).match(/<header[\s\S]*?<\/header>/)[0])));
const contact = read(join(dist, "contact/index.html"));
check("Contact keeps four field groups", ["name", "email", "interest", "project"].every((f) => contact.includes(`data-field="${f}"`)) && count(contact, "data-field=\"") === 4);
check("Contact keeps preview/edit/clear and no-send copy", ["data-preview", "data-edit", "data-clear", "data-error-summary"].every((m) => contact.includes(m)) && /nothing is sent|never sent|Nothing was sent/i.test(contact));

/* Internal links and assets resolve */
const broken = [];
for (const f of files.filter((f) => f.endsWith(".html"))) {
  for (const [, u] of read(f).matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
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
console.log(`\n${results.length - failed}/${results.length} static checks passed`);
process.exit(failed ? 1 : 0);
