# Actual command and tool record

All outputs are local to this workspace. Commands below were actually attempted; the later browser matrix is prepared but not represented as executed.

| Command / tool | Actual result |
| --- | --- |
| `rg --files` restricted to named workspace contracts/input | Located current inputs; no historical implementation read |
| Python reads of AGENTS.md, TASK.md, BRIEF.md, ACCEPTANCE.md, input/CONTEXT.md and frozen director skill/references | Read current authority; optional instruction modules absent |
| `view_image` on both references and all nine source PNGs | 11 actual image inspections; composition recorded before coding |
| `node --version`, `npm --version`, `codex --version`, `python3 --version` | v23.10.0 / 10.9.2 / codex-cli 0.160.0 / Python 3.14.3 |
| Playwright skill wrapper `--help` via bounded subprocess | Timed out after 20 seconds; no install or permission change |
| Cached `@playwright/cli/cli.js --help` | Failed: incorrect local entry filename; resolved using package bin metadata |
| Cached `@playwright/cli/playwright-cli.js --help` | Exit 0; version 0.1.22 from package metadata |
| `python3 demo/tools/prepare_assets.py --source input/assets --output demo/assets` | Exit 0; nine source IDs, eighteen WebP derivatives |
| `python3 demo/build.py` and later `python3 -B demo/build.py` | Exit 0; eight pages plus 404; final output reproduced identically |
| `node --check demo/script.js` | Exit 0 |
| `python3 demo/serve.py --port 4191` through exec_command | Exit 1; socket bind denied with PermissionError errno 1 |
| Direct Playwright/Chrome headless launch through exec_command | Failed before page load; owned pid 82841 exited SIGABRT; no screenshot |
| Node tool spawned the same Python preview | Owned pid 85052 exited 1 with the same socket restriction |
| Node tool Playwright ESM import | Failed due package export mismatch; cached CJS require resolved it |
| Node tool CJS Playwright/Chrome launch | Owned pid 88452 exited SIGABRT; no page load or screenshot |
| `cua.getState()` | Inventory obtained; no unrelated pages opened |
| `cua.createBrowserTab` with owned local HTML file URL | Rejected by browser security policy: only HTTP/HTTPS allowed. No bypass attempted |
| Local Georgia font metrics with Pillow | Source-based inference identified a narrow header spacing risk; smaller wordmark at <=430px added. This is not rendered visual evidence |
| `python3 -B evidence/verify-static.py` | Exit 0; 537 checks pass, zero fail; actual request handler exercised in-process without binding a socket |
| `node --check evidence/browser-qa.cjs` | Exit 0; prepared matrix syntax only |
| Frozen-file SHA-256 comparison | All 59 protected files preserved byte-for-byte |

Browser and server failures were not retried without a distinct available-tool hypothesis. No live server remains from this worker. No user server was stopped. No broad process-name kill, deployment, publication, push, enquiry, external account or global change was made.

The browser matrix `node evidence/browser-qa.cjs` was not run after the confirmed launch restrictions. It is a reproducible follow-up, not evidence of a passing check. Full-size desktop, phone, tablet and menu screenshots are absent.
