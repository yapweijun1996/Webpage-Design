// Stage 3 focused verifier: Home text reflow under doubled text at 390/320 (source/output + arithmetic model).
// Usage (from the workspace root, after `node demo/scripts/build.mjs`): node evidence/stage-3/check-home-text-reflow.mjs
// Not a rendered check: glyph widths are approximate Georgia/Arial advances; real wrapping needs a browser.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const dist = join(root, "demo", "dist");
const read = (p) => readFileSync(p, "utf8");
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const results = [];
const check = (name, pass) => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);
};

const css = read(join(dist, "assets", "site.css"));
const code = css.replace(/\/\*[\s\S]*?\*\//g, "");
const rule = (src, selector) => src.match(new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.()[\]*+:>]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";

// 1. Rules exist, are Home-scoped and neither shrink, clip nor hide.
const enquiry = rule(code, ".page-home .home-enquiry");
check("A: secondary enquiry action wraps inside the column (max-width 100%, white-space normal)", /max-width: 100%/.test(enquiry) && /white-space: normal/.test(enquiry));
const footName = rule(code, ".home-footer .brand-name");
check("B: footer brand wraps (white-space normal, line-height 1.15)", /white-space: normal/.test(footName) && /line-height: 1\.15/.test(footName));
check("B: no brand rule anywhere uses overflow-wrap/word-break/hyphens (word-boundary wrapping only)",
  [...code.matchAll(/([^{}]*\.brand[^{}]*)\{([^}]*)\}/g)].every((m) => !/overflow-wrap|word-break|hyphens/.test(m[2])));
check("C: entry list is an inline-size container", /container-type: inline-size/.test(rule(code, ".home-entries")));
const cq = code.match(/@container \(max-width: 16em\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
check("C: under 16em the entry stacks: num+arrow row, then full-width name and note",
  /\.home-entry \{ grid-template-columns: minmax\(0, 1fr\) auto; grid-template-areas: "num arrow" "name name" "text text"; \}/.test(cq));
check("C: ordinary entry grid unchanged (2.25rem / minmax(0,1fr) / auto, same areas)",
  /grid-template-columns: 2\.25rem minmax\(0, 1fr\) auto; grid-template-areas: "num name arrow" "\. text arrow";/.test(rule(code, ".home-entry")));
const safety = rule(code, ".home-arrival-copy, .home-chapter-inner, .home-footer-base");
check("D: break-word safety net on Home reading content only (not header/footer brand)", /^\s*overflow-wrap: break-word;\s*$/.test(safety));
check("D: no overflow-wrap: anywhere / word-break in Home rules", !/overflow-wrap: anywhere|word-break/.test(css.slice(css.indexOf(".page-home {"), css.indexOf("/* ---------- Page intro"))) && css.indexOf("/* ---------- Page intro") > css.indexOf(".page-home {"));
const added = enquiry + footName + cq + safety + rule(code, ".home-entries");
check("new rules change no font-size and add no clipping, hiding or overflow-x", !/font-size|font:|overflow|display: none|visibility|text-overflow|clip/.test(added.replace("overflow-wrap", "")));
check("no overflow-x: hidden anywhere on html/body/Home", !/overflow-x: hidden/.test(code));
const htmlFiles = ["index.html", "collections/index.html", "collections/ornamental-fish/index.html", "collections/aquatic-plants/index.html", "collections/driftwood/index.html", "our-story/index.html", "quality/index.html", "contact/index.html", "404.html"];
const allHtml = htmlFiles.map((f) => read(join(dist, f))).join("\n");
const js = read(join(dist, "assets", "site.js")).replace(/^\s*\/\/.*$/gm, "");
check("no text-size preference, injection or QA hook in CSS/JS/HTML",
  !/text-size|textSize|fontScale|font-scale|data-qa|qa\.css|\?qa|enlarg/i.test(code.replace("-webkit-text-size-adjust: 100%;", "") + js + allHtml));
check("every new selector is Home-only (.page-home / .home-*)", ["home-enquiry", "home-footer .brand-name", "home-entries", "home-entry {", "home-arrival-copy, .home-chapter-inner"].every((s) => code.includes(s)) && !/@container[^{]*\{[^}]*\.(?!home-)[a-z]/.test(cq));
check("stage-2 header/menu rules still present (wordmark word-boundary wrap, 100% panel cap)",
  /\.page-home \.site-header \.brand-name \{ white-space: normal; line-height: 1\.15; \}/.test(code) && /max-height: calc\(100dvh - 100%\)/.test(code));

// 2. Only site.css changed in the build; markup, controller and media are byte-identical.
const before = Object.fromEntries(read(join(here, "pre-change-dist-sha256.txt")).trim().split("\n").map((l) => { const [h, f] = l.split(/\s+/); return [f.replace(/^dist\//, ""), h]; }));
const changed = Object.keys(before).filter((f) => sha(join(dist, f)) !== before[f]);
check(`only assets/site.css differs from the pre-change build (changed: ${changed.join(", ") || "none"})`, changed.length === 1 && changed[0] === "assets/site.css");
const media = JSON.parse(read(join(root, "input", "media", "manifest.json")));
const mediaFiles = ["landscape.mp4", "portrait.mp4", "landscape-poster.webp", "portrait-poster.webp"];
check("four Home media files byte-identical to input/media", mediaFiles.every((f) => sha(join(dist, "assets", "immersive", f)) === sha(join(root, "input", "media", f))) && !!media);

// 3. Arithmetic model (approximate advances in em; not measurements).
const georgia = { A: .67, Q: .74, U: .74, T: .62, I: .37, C: .64, W: .98, O: .74, R: .7, L: .6, D: .74, " ": .24,
  a: .5, c: .49, d: .58, e: .495, f: .33, i: .3, l: .29, m: .88, n: .6, o: .574, q: .57, r: .42, s: .4, t: .35, u: .6, w: .75, ".": .25 };
const arialBold = { D: .722, i: .278, s: .556, c: .556, u: .611, " ": .278, a: .556, p: .611, r: .389, o: .611, j: .278, e: .556, t: .333 };
const width = (table, text, px, track = 0) => [...text].reduce((w, ch) => w + (table[ch] ?? .6) + track, 0) * px;
const content = { 320: 288, 390: 350 }; // viewport − 2 × Home inset (16px below 360, max(20px, 4.5vw) above)
const inset = { 320: 16, 390: 20 };

// A. Discuss a project (Arial 600, 16px → 32px, 0.02em tracking) + 10 gap + 18 arrow + 2 × 26 padding + 2 border.
const chrome = 10 + 18 + 52 + 2;
const oneLine = (px) => width(arialBold, "Discuss a project", px, .02) + chrome;
const longestWord = (px) => width(arialBold, "project", px, .02) + chrome;
check(`A normal: one line ≈${oneLine(16).toFixed(0)}px fits 288 (unchanged)`, oneLine(16) <= 288);
check(`A 200% at 320: one line ≈${(inset[320] + oneLine(32)).toFixed(0)}px end overflowed before; wrapped widest word row ≈${longestWord(32).toFixed(0)}px ≤ 288`, inset[320] + oneLine(32) > 320 && longestWord(32) <= 288);

// B. Footer brand (Georgia caps, 17px/0.1em at 320; 18px/0.12em at 390).
const brandAt = { 320: [17, .1], 390: [18, .12] };
for (const vw of [320, 390]) {
  const [px, tr] = brandAt[vw];
  const line = width(georgia, "AQUATIC WORLD", px, tr), big = width(georgia, "AQUATIC WORLD", 2 * px, tr), word = width(georgia, "AQUATIC", 2 * px, tr);
  check(`B ${vw}: normal one line ≈${line.toFixed(0)}px ≤ ${content[vw]}; 200% one line ≈${big.toFixed(0)}px, wraps to "AQUATIC" ≈${word.toFixed(0)}px ≤ ${content[vw]}`, line <= content[vw] && word <= content[vw]);
}

// C. Container threshold 16em: never at ordinary widths (16px), always at 390/320 with 32px text.
const ordinaryWidths = { "320 portrait": 288, "360 portrait": 324, "390 portrait": 350, "500×500": 455, "568×320 landscape (50vw)": 284, "667×375 landscape (50vw)": 333.5, "844×390 landscape": 422, "1440×900": 640 };
check(`C: 16em (256px at 16px) below every ordinary content width (min ${Math.min(...Object.values(ordinaryWidths))}px)`, Object.values(ordinaryWidths).every((w) => w > 16 * 16));
check("C: 16em (512px at 32px) reached at 390 and 320 with doubled text", content[390] <= 16 * 32 && content[320] <= 16 * 32);
const names = ["Ornamental", "Aquatic", "Plants", "Driftwood", "Fish"];
const widest = Math.max(...names.map((n) => width(georgia, n, 48)));
const oldTrack = content[320] - 8 - 36 - 24 - 18;
check(`C 320: widest name word ≈${widest.toFixed(0)}px overflowed the old ≈${oldTrack}px track; fits stacked full row ${content[320] - 8}px`, widest > oldTrack && widest <= content[320] - 8);
check(`C normal 320: "Ornamental Fish" ≈${width(georgia, "Ornamental Fish", 24).toFixed(0)}px fits the unchanged ${oldTrack}px track`, width(georgia, "Ornamental Fish", 24) <= oldTrack);

// D. Headings: words wider than the column break inside it (safety net), everything else fits.
const h2Word = width(georgia, "connection", 64);
check(`D 320: "connection" at 64px ≈${h2Word.toFixed(0)}px > 288 needs break-word; at 32px ≈${(h2Word / 2).toFixed(0)}px fits (normal unchanged)`, h2Word > 288 && h2Word / 2 <= 288);
check(`D 390: "connection" at 64px ≈${h2Word.toFixed(0)}px fits 350 without breaking`, h2Word <= 350);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} stage-3 checks passed (source/output and arithmetic only; not rendered)`);
process.exit(passed === results.length ? 0 : 1);
