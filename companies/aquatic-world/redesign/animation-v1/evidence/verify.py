from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen
import hashlib
import json
import re

PACKAGE = Path(__file__).resolve().parents[1]
COMPANY = PACKAGE.parents[1]
REPOSITORY = COMPANY.parents[1]
checks = []


def check(name, condition):
    if not condition:
        raise AssertionError(name)
    checks.append({"name": name, "passed": True})


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


manifest = json.loads((PACKAGE / "input-manifest.json").read_text())
for item in manifest["frozen_reference_inputs"]:
    path = PACKAGE / item["path"]
    check(f"Frozen input {item['path']}", path.stat().st_size == item["bytes"] and digest(path) == item["sha256"])
check("Original source bytes", digest(PACKAGE / "assets/hero-angelfish.png") == digest(COMPANY / "comparison/assets-v1/hero-angelfish.png"))
baseline = json.loads((PACKAGE / "evidence/preserved-baseline.json").read_text())
check("Preserved all historical implementation/trial files", all((COMPANY / path).is_file() and digest(COMPANY / path) == expected for path, expected in baseline.items()))
prepared = json.loads((COMPANY / "comparison/round-6/input-plan.json").read_text())
check("Preserved eight historical prepared video contracts", len(prepared["shared_prepared_contracts"]) == 8 and all(digest(COMPANY / item["path"]) == item["sha256"] for item in prepared["shared_prepared_contracts"]))
check("No native workers launched", all(item["status"] == "not_launched" for item in manifest["native_workers"].values()))
check("No paid generation in this study", manifest["new_paid_generation_cost_usd"] == 0)

browser = json.loads((PACKAGE / "evidence/browser-review.json").read_text())
check("Seven responsive widths checked", {item["viewport"][0] for item in browser["viewportChecks"]} == {320, 360, 390, 768, 1059, 1060, 1280})
for item in browser["viewportChecks"]:
    check(f"No overflow at {item['viewport'][0]}px", not item["overflow"])
    check(f"Full source at {item['viewport'][0]}px", item["image"]["natural"] == [1882, 836] and item["image"]["fit"] == "contain" and item["image"]["transform"] == "none")
    check(f"First-view frame/control at {item['viewport'][0]}px", item["scrollY"] == 0 and item["image"]["rect"]["bottom"] < item["viewport"][1] and item["button"]["rect"]["bottom"] < item["viewport"][1])
check("Desktop source stable through full light cycle", browser["cycleStart"]["image"] == browser["cycleAfter"]["image"] and browser["cycleAfter"]["animations"][0]["currentTime"] - browser["cycleStart"]["animations"][0]["currentTime"] > 18000)
check("Phone source stable through longest particle cycle", browser["mobileCycleStart"]["image"] == browser["mobileCycleAfter"]["image"] and browser["mobileCycleAfter"]["animations"][0]["currentTime"] - browser["mobileCycleStart"]["animations"][0]["currentTime"] > 22000)
check("One light and ten particles", len(browser["finalDesktop"]["animations"]) == 11)
for i, animation in enumerate(browser["finalDesktop"]["animations"]):
    start, end = animation["keyframes"][0], animation["keyframes"][-1]
    check(f"Continuous endpoints for animation {i}", start["transform"] == end["transform"] and start["opacity"] == end["opacity"])
check("Pause freezes actual animation time", all(a["currentTime"] == b["currentTime"] and a["playState"] == "paused" for a, b in zip(browser["desktopPaused"]["animations"], browser["desktopPausedLater"]["animations"])))
check("Offscreen pauses actual time", browser["phoneBottom"]["state"] == "paused" and all(a["currentTime"] == b["currentTime"] for a, b in zip(browser["phoneBottom"]["animations"], browser["phoneBottomLater"]["animations"])))
check("Re-entry resumes eligible motion", browser["returnToTop"]["state"] == "playing")
check("User pause survives scroll/menu", browser["pausedAfterScroll"]["state"] == "paused" and browser["desktopMenuClosedPaused"]["state"] == "paused")
for key in ["reducedLive", "reducedInitial", "reducedStopAfterOptIn", "preferenceReturned"]:
    check(f"Policy state {key}", browser[key]["state"] == "paused" and browser[key]["effects"] == "off")
check("Reduced-motion explicit opt-in runs", browser["reducedOptIn"]["state"] == "playing" and browser["reducedOptIn"]["optIn"] == "true")
check("Keyboard playback and focus", browser["keyboardPause"]["state"] == "paused" and browser["keyboardPlay"]["state"] == "playing" and "solid 3px" in browser["keyboardPause"]["button"]["outline"])
check("Menu keyboard cycles", "Study notes" in browser["menuKeyboardBackward"]["activeElement"] and "data-menu-close" in browser["menuKeyboardForward"]["activeElement"])
check("Menu close/Escape/backdrop", browser["phoneMenuClosed"]["state"] == "playing" and not browser["menuKeyboardClosed"]["menu"]["open"] and not browser["backdropClose"]["menu"]["open"])
for key in ["menu390", "menu768", "menu1280"]:
    check(f"Open modal {key}", browser[key]["menu"]["open"] and browser[key]["state"] == "paused" and not browser[key]["overflow"])
check("No-JavaScript static fallback", browser["noJavaScript"]["state"] == "static" and browser["noJavaScript"]["image"]["ready"] and browser["noJavaScript"]["button"]["hidden"] and browser["noJavaScript"]["hiddenLeaks"] == 0)
check("No-JavaScript HTML link navigation", "/comparison/round-5/preview.html" in browser["noJsLinkURL"])
check("Image-error fallback", not browser["imageFailureFinal"]["image"]["ready"] and browser["imageFailureFinal"]["button"]["hidden"] and browser["imageFailureFinal"]["effects"] == "off")
check("Normal console clean", browser["normalLogs"] == [])
check("Moving decorations stay in left half", all(0 <= layer["leftFraction"] < layer["rightFraction"] <= .5 and 0 <= layer["topFraction"] < layer["bottomFraction"] <= 1 for layer in browser["decorContainment"]["layers"]))
signals = json.loads((PACKAGE / "evidence/state-check.json").read_text())
check("15 synthetic signal checks identified honestly", signals["count"] == 15 and signals["kind"] == "synthetic_contract_signals_not_browser_evidence" and all(item["passed"] for item in signals["checks"]))
native = json.loads((PACKAGE / "evidence/native-signal-review.json").read_text())
check("Native evidence identified separately from mocks", native["kind"] == "real_chrome_browser_native_signals")
hidden = native["realPlayingHidden"]
check("Real hidden document pauses", hidden["visibility"] == "hidden" and hidden["hidden"] and hidden["state"] == "paused" and all(a["playState"] == "paused" for a in hidden["animations"]))
check("Real hidden document freezes time", all(a["currentTime"] == b["currentTime"] for a, b in zip(hidden["animations"], native["realPlayingHiddenLater"]["animations"])))
visible = native["realVisibleResumed"]
check("Real visible return resumes eligible motion", visible["visibility"] == "visible" and not visible["hidden"] and visible["state"] == "playing" and native["realVisibleResumedLater"]["animations"][0]["currentTime"] > visible["animations"][0]["currentTime"])
check("Real visibility changes preserve user pause", native["userPausedRealHidden"]["hidden"] and not native["userPausedRealVisible"]["hidden"] and native["userPausedRealVisible"]["state"] == "paused" and native["userPausedRealVisible"]["label"] == "Play animation")
data = native["saveDataInitial"]
check("Save-Data getter remains native", data["saveData"] and "[native code]" in data["saveDataGetter"])
check("Native Save-Data initial still fallback", data["imageReady"] and data["state"] == "paused" and data["effects"] == "off" and all(a["playState"] == "paused" for a in data["animations"]))
check("Native Save-Data freezes animation time", all(a["currentTime"] == b["currentTime"] for a, b in zip(data["animations"], native["saveDataInitialLater"]["animations"])))
check("Native Save-Data explicit opt-in", native["saveDataOptIn"]["saveData"] and native["saveDataOptIn"]["optIn"] == "true" and native["saveDataOptIn"]["state"] == "playing")
check("Native opt-in still respects real visibility", native["saveDataOptInHidden"]["hidden"] and native["saveDataOptInHidden"]["state"] == "paused" and not native["saveDataOptInVisible"]["hidden"] and native["saveDataOptInVisible"]["state"] == "playing")
check("Native Save-Data return preserves policy stop", not native["dataPolicyReturned"]["saveData"] and native["dataPolicyReturned"]["state"] == "paused")
check("Native Save-Data return preserves user pause", not native["saveDataDisabledAfterPause"]["saveData"] and native["saveDataDisabledAfterPause"]["state"] == "paused")
check("Live native override limit retained honestly", native["dataSaverEvents"] == [] and native["liveDataSaverLater"]["saveData"] and native["liveDataSaverLater"]["state"] == "playing" and any("real live network-change" in item for item in native["limits"]))
check("Temporary native observer and override removed", native["instrumentationRemoved"] and native["finalRestored"]["saveData"] == native["initial"]["saveData"] and native["finalRestored"]["state"] == "playing" and native["logs"] == [])
check("Native Save-Data proof shows full static first view", native["saveDataProofTop"]["saveData"] and native["saveDataProofTop"]["state"] == "paused" and native["saveDataProofTop"]["effects"] == "off" and native["saveDataProofTop"]["scrollY"] == 0 and native["saveDataProofTop"]["imageRect"]["top"] > 0 and native["proofOverrideRestored"])


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.values = []

    def handle_starttag(self, tag, attrs):
        self.values += [value for key, value in attrs if key in {"href", "src"} and value]


output = PACKAGE / "evidence/package-check.json"
output.write_text("{}\n")
documents = [REPOSITORY / "README.md", REPOSITORY / "companies/README.md", COMPANY / "README.md", COMPANY / "redesign/motion-v1/README.md", *PACKAGE.glob("*.md")]
resolved = set()
for path in documents:
    content = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
    for reference in re.findall(r"\]\(([^)]+)\)", content):
        url = urlsplit(reference.strip("<>"))
        if url.scheme or not url.path:
            continue
        target = (path.parent / unquote(url.path)).resolve()
        check(f"Document link {path.name}: {url.path}", target.exists())
        resolved.add(target)
parser = References()
parser.feed((PACKAGE / "preview.html").read_text())
for reference in parser.values:
    url = urlsplit(reference)
    if url.scheme or not url.path:
        continue
    target = (PACKAGE / unquote(url.path)).resolve()
    check(f"Preview target {url.path}", target.exists())
    resolved.add(target)

served = []
for target in sorted(resolved):
    try:
        relative = target.relative_to(COMPANY)
    except ValueError:
        continue
    with urlopen(f"http://127.0.0.1:4170/{relative.as_posix()}", timeout=5) as response:
        check(f"Served target {relative}", response.status == 200)
    served.append(str(relative))
report = {"checked_on": "2026-10-12", "count": len(checks), "checks": checks, "preserved_files": len(baseline), "served_targets": served, "limits": ["Native Save-Data=true is a Chrome CDP signal override, not a physical device/carrier setting", "Real live network preference change remains unverified: native override produced no change event in the bounded sample", "No physical phone, other browser engine, performance/zoom audit or native contestant revision"]}
output.write_text(json.dumps(report, indent=2) + "\n")
print(f"{len(checks)} package checks passed; {len(baseline)} historical files preserved; {len(served)} local targets served.")
