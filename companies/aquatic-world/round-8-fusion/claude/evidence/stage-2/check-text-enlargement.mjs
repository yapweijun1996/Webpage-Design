// Stage 2 focused verifier: Home compact header under enlarged text (source/output + arithmetic model).
// Usage (from the workspace root, after `node demo/scripts/build.mjs`): node evidence/stage-2/check-text-enlargement.mjs
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
const homeCss = css.slice(css.indexOf(".page-home .site-header {"));
const block = (src, query) => src.match(new RegExp(`@media ${query.replace(/[()./]/g, "\\$&")} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
const rule = (src, selector) => src.match(new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.()[\]*+:]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
const compact = block(homeCss, "(max-width: 1119.98px)");
const narrow = block(homeCss, "(max-width: 359.98px)");

// 1. New rules exist and are Home-scoped.
const inner = rule(compact, ".js .page-home .header-inner");
check("compact Home bar may grow and wrap: flex-wrap, auto height, 64px minimum, 8px block padding", /flex-wrap: wrap/.test(inner) && /height: auto/.test(inner) && /min-height: var\(--header-h\)/.test(inner) && /padding-block: 8px/.test(inner) && /row-gap: 8px/.test(inner));
const brandRule = rule(compact, ".page-home .site-header .brand");
check("wordmark row decision uses min-content (flex-basis 0) and never exceeds its one-line width", /flex: 1 1 0/.test(brandRule) && /max-width: max-content/.test(brandRule));
const nameRule = rule(compact, ".page-home .site-header .brand-name");
check("wordmark wraps at word boundaries only (white-space normal, no anywhere/break-all)", /white-space: normal/.test(nameRule) && !/overflow-wrap|word-break|hyphens/.test(compact + rule(css, ".brand-name")));
const toggle = rule(homeCss, ".page-home .menu-toggle");
check("Menu/Close has minimum (not fixed) 98×44 size", /min-width: 98px/.test(toggle) && /min-height: 44px/.test(toggle) && !/(^|[^-])(width|height): /.test(toggle));
check("label box reserves both Menu and Close (hidden zero-height pseudo-elements, empty alt text)",
  /\.page-home \.menu-text \{ display: inline-flex; flex-direction: column; \}/.test(homeCss) &&
  /height: 0; overflow: hidden; visibility: hidden;/.test(rule(homeCss, ".page-home .menu-text::before, .page-home .menu-text::after")) &&
  /content: "Menu" \/ "";/.test(homeCss) && /content: "Close" \/ "";/.test(homeCss));
const panel = rule(compact, ".js .page-home .site-menu");
check("panel stays absolute at top: 100% of the header (starts under the actual bar)", /position: absolute; top: 100%; left: 0; right: 0;/.test(panel));
check("panel scroller cap subtracts the actual header height (100% of its containing block), not a 64px variable", /max-height: calc\(100vh - 100%\); max-height: calc\(100dvh - 100%\);/.test(panel) && !/--header-h/.test(panel) && /overflow-y: auto/.test(panel));
check("the sticky header is the panel's containing block (positioned; header-inner and .wrap are not)", /\.site-header \{\s*position: sticky;/.test(css) && !/position:/.test(rule(css, ".header-inner") + rule(css, ".wrap")));

// 2. No text shrinking, preference, injection or QA-only hooks.
const fontSizes = (src) => [...src.matchAll(/font-size: ([^;]+);/g)].map((m) => m[1]);
check("type sizes in the compact Home header are unchanged (18px / 17px wordmark, 16px control, 18px links)",
  /\.page-home \.brand-name \{ font-size: 1\.125rem; letter-spacing: 0\.12em; \}/.test(compact) && /font-size: 1\.0625rem/.test(rule(narrow, ".page-home .brand-name")) &&
  /font: 400 1rem\/1 var\(--sans\)/.test(toggle) && fontSizes(compact).every((v) => ["1.125rem"].includes(v)));
const js = read(join(dist, "assets", "site.js"));
const htmlFiles = ["index.html", "collections/index.html", "collections/ornamental-fish/index.html", "collections/aquatic-plants/index.html", "collections/driftwood/index.html", "our-story/index.html", "quality/index.html", "contact/index.html", "404.html"];
const allHtml = htmlFiles.map((f) => read(join(dist, f))).join("\n");
// Comments are stripped; the baseline's `-webkit-text-size-adjust: 100%` (unchanged since round 7) is excluded.
const code = css.replace(/\/\*[\s\S]*?\*\//g, "").replace("-webkit-text-size-adjust: 100%;", "") + js.replace(/^\s*\/\/.*$/gm, "");
check("no text-size preference, runtime injection or QA stylesheet hooks", !/text-size|textSize|fontScale|font-scale|data-qa|qa\.css|\?qa|enlarg/i.test(code + allHtml) && (allHtml.match(/rel="stylesheet"/g) ?? []).length === htmlFiles.length);
check("no clipping/hiding introduced on the header controls or wordmark", !/overflow: hidden|text-overflow|display: none|visibility: hidden/.test(inner + brandRule + nameRule + toggle));

// 3. Only site.css changed in the build; markup, controller and media are byte-identical to the pre-change build.
const before = Object.fromEntries(read(join(here, "pre-change-dist-sha256.txt")).trim().split("\n").map((l) => { const [h, f] = l.split(/\s+/); return [f.replace(/^\.\//, ""), h]; }));
const changed = Object.keys(before).filter((f) => sha(join(dist, f)) !== before[f]);
check(`only assets/site.css differs from the pre-change build (changed: ${changed.join(", ") || "none"})`, changed.length === 1 && changed[0] === "assets/site.css");
const MEDIA = {
  "landscape.mp4": "e2ae169d0d91e28d8f6a9b0a6ca76227312b691d8a53c00c7127abd4e66cc38b",
  "portrait.mp4": "df27628aeb8e3bbeb005a74eaac46af038033a752a13b20cfc2a8baa2775ac3a",
  "landscape-poster.webp": "9f2be6ac3c0beadfe2ed0c05076ac17389e94b85253f8eed21c0494061a7757e",
  "portrait-poster.webp": "40d48c199a1c3aede8a4b6c42697f1b1a007392ad90c75f8c5f5d5c06e0df6f6",
};
check("four media files: input = dist, exact SHA-256", Object.entries(MEDIA).every(([f, h]) => sha(join(root, "input", "media", f)) === h && Object.keys(before).some((k) => k.endsWith(`/${f}`) && sha(join(dist, k)) === h)));
check("new selectors are Home-scoped (inner pages keep their header CSS)", [inner, brandRule, nameRule].every(Boolean) && !/\n\s*\.(brand|brand-name|header-inner|menu-text)\b[^{]*\{[^}]*(flex: 1 1 0|white-space: normal|flex-wrap)/.test(css));

// 4. Arithmetic model (estimates, not measurements).
const georgia = { A: 0.67, Q: 0.744, U: 0.725, T: 0.62, I: 0.389, C: 0.643, " ": 0.25, W: 0.98, O: 0.744, R: 0.7, L: 0.6, D: 0.75 };
const arial = { M: 0.833, e: 0.556, n: 0.556, u: 0.556, C: 0.722, l: 0.222, o: 0.556, s: 0.5 };
const width = (text, table, size, track) => [...text].reduce((s, c) => s + table[c] + track, 0) * size;
const lh = 1.15;
for (const scale of [1, 2]) {
  for (const w of [390, 320]) {
    const small = w < 360;
    const inset = small ? 16 : 20;
    const gap = small ? 12 : 16;
    const brandSize = (small ? 17 : 18) * scale;
    const track = small ? 0.1 : 0.12;
    const labelSize = 16 * scale;
    const label = Math.max(width("Menu", arial, labelSize, 0.01), width("Close", arial, labelSize, 0.01));
    const toggleW = Math.max(98, 15 + 18 + 8 + label + 10); // padding-left, icon, gap (≤419px), label, padding-right
    const toggleH = Math.max(44, labelSize);
    const row = w - 2 * inset;
    const minContent = Math.max(width("AQUATIC", georgia, brandSize, track), width("WORLD", georgia, brandSize, track));
    const maxContent = width("AQUATIC WORLD", georgia, brandSize, track);
    const shareRow = minContent + gap + toggleW <= row;
    const brandBox = shareRow ? Math.min(maxContent, row - gap - toggleW) : Math.min(maxContent, row);
    const lines = maxContent <= brandBox ? 1 : 2;
    const brandH = Math.max(44, lines * brandSize * lh);
    const header = shareRow ? Math.max(64, 8 + Math.max(brandH, toggleH) + 8) : 8 + brandH + 8 + toggleH + 8;
    const toggleRight = w - inset;
    const rowH = Math.max(56, 18 * scale * 1.65);
    const panelEnd = header + 5 * rowH + 24 + 0;
    const cap = 844 - header;
    const tag = `${w}px ${scale === 1 ? "normal" : "200%"}`;
    const fits = toggleRight <= w && toggleRight - toggleW >= inset && minContent <= row;
    if (scale === 1) {
      check(`model ${tag}: one-line ${maxContent.toFixed(0)}px wordmark beside a ${toggleW.toFixed(0)}×${toggleH} control, bar ${header}px, Menu ${(toggleRight - toggleW).toFixed(0)}–${toggleRight}`,
        fits && shareRow && lines === 1 && header === 64 && toggleW === 98 && (w !== 390 || header + 5 * 56 + 24 + 1 === 369));
    } else {
      check(`model ${tag}: AQUATIC ${minContent.toFixed(0)}px, control ${toggleW.toFixed(0)}px; ${shareRow ? "same row" : "Menu on second row"}; wordmark ${lines} lines in ${brandBox.toFixed(0)}px; bar ≈${header.toFixed(0)}px; Menu ${(toggleRight - toggleW).toFixed(0)}–${toggleRight}; panel content ≈${(5 * rowH + 24).toFixed(0)}px within ${cap.toFixed(0)}px cap (ends ≈${panelEnd.toFixed(0)})`,
        fits && lines === 2 && brandBox >= minContent && toggleRight <= w);
    }
  }
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} stage-2 checks passed (source/output and arithmetic only; not rendered)`);
process.exit(failed ? 1 : 0);
