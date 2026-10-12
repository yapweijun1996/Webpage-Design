"""Assert durable observations collected through CUA, without automating a browser."""
import json
from pathlib import Path
import struct
from check_inputs import ROOT, WORKSPACES, sha

SIZES = {1280: 800, 768: 1024, 390: 844, 360: 800, 320: 800}

def jpeg_size(data):
    assert data[:2] == b"\xff\xd8", "Expected native JPEG screenshot bytes"
    index = 2
    while index < len(data):
        assert data[index] == 255
        while data[index] == 255:
            index += 1
        marker = data[index]
        index += 1
        size = int.from_bytes(data[index:index + 2], "big")
        if marker in {192, 193, 194}:
            height, width = struct.unpack(">HH", data[index + 3:index + 7])
            return width, height
        index += size
    raise AssertionError("JPEG frame dimensions absent")

def main():
    output = {"checked_on": "2026-10-12", "method": "Actual-site CUA observations and native JPEG captures (no re-encoding)",
              "workers": {}, "user_acceptance": "pending"}
    delivery = json.loads((ROOT / "evidence/delivery-checks.json").read_text())
    for name in ["codex", "claude"]:
        raw = json.loads((ROOT / f"evidence/{name}/browser.json").read_text())
        passed = []
        def get(scenario):
            matches = [item for item in raw if item["scenario"] == scenario]
            assert matches, f"Missing {name}:{scenario}"
            return matches[-1]
        def check(condition, label):
            assert condition, f"{name}: {label}"
            passed.append(label)
        def decorations(scene):
            # getAnimations(subtree) also observes brief button hover transitions.
            # CSSAnimation names identify the intended ambient layers; transitions
            # have no animationName and do not belong to the paused ambient scene.
            return [animation for animation in scene["animations"] if animation.get("name")]
        geometries = []
        for width, height in SIZES.items():
            home = get(f"final-home-top-{width}")
            scene = home["scene"]
            image = scene["image"]
            check(home["viewport"] == {"width": width, "height": height} and home["scrollY"] == 0 and home["overflow"] == 0,
                  f"Home {width}: exact viewport, stable top, no horizontal overflow")
            check(image["complete"] and image["natural"] == [1882, 836] and image["transform"] == "none" and image["objectFit"] == "contain"
                  and abs(image["rect"]["width"] / image["rect"]["height"] - 1882 / 836) < .001,
                  f"Home {width}: complete natural-ratio image without transform/crop")
            check(scene["lightCount"] == 1 and scene["particleCount"] == 10 and scene["button"]["font"] == "16px"
                  and scene["button"]["rect"]["height"] >= 44 and scene["button"]["rect"]["width"] >= 44,
                  f"Home {width}: prescribed counts and readable 44px control")
            check(scene["effects"]["aria"] == "true" and scene["effects"]["pointer"] == "none", f"Home {width}: decorations are noninteractive/hidden from accessibility")
            ambient = decorations(scene)
            check(len(ambient) == 11 and ambient[0]["duration"] == 18000
                  and all(animation["keyframes"][0]["opacity"] == animation["keyframes"][-1]["opacity"]
                          and animation["keyframes"][0]["transform"] == animation["keyframes"][-1]["transform"]
                          for animation in ambient), f"Home {width}: actual decorative keyframe endpoints match")
            for animation in ambient[1:]:
                # Fractional translations introduce subpixel float error in DOMRect.
                assert abs(animation["rect"]["width"] - 2) < .001 and abs(animation["rect"]["height"] - 2) < .001
                assert animation["rect"]["right"] < scene["frame"]["x"] + scene["frame"]["width"] * .5
            contact = get(f"final-contact-top-{width}")
            groups = get(f"final-contact-groups-{width}")["details"]["formGroups"]
            check(contact["viewport"] == {"width": width, "height": height} and contact["scrollY"] == 0
                  and contact["overflow"] == 0 and len(groups) == 4, f"Contact {width}: exact viewport, top, four groups, no overflow")
            for page in ["home", "contact"]:
                capture = (ROOT / f"evidence/{name}/{page}-{width}.jpg").read_bytes()
                assert jpeg_size(capture) == (width, height), f"Capture dimensions: {name}:{page}:{width}"
            geometries.append({"viewport": f"{width}x{height}", "image_width": image["rect"]["width"],
                               "image_height": image["rect"]["height"], "image_bottom": image["rect"]["bottom"],
                               "button_bottom": scene["button"]["rect"]["bottom"],
                               "button_inside_first_viewport": scene["button"]["rect"]["bottom"] <= height})
        desktop = get("final-home-top-1280")["scene"]
        check(desktop["frame"]["bottom"] <= 800 and desktop["button"]["rect"]["bottom"] <= 800, "1280 desktop shows complete image and control together")
        cycle_prefix = "desktop-1280-cycle" if name == "codex" else "desktop-cycle"
        cycle_start, cycle_end = get(cycle_prefix + "-start"), get(cycle_prefix + "-end")
        check(cycle_start["viewport"]["width"] == 1280 and cycle_end["scene"]["animations"][0]["time"] - cycle_start["scene"]["animations"][0]["time"] >= 18000
              and cycle_start["scene"]["image"]["rect"] == cycle_end["scene"]["image"]["rect"], "Whole 18s actual desktop light cycle advances while image geometry stays fixed")
        for first, last, label in [("menu-auto-pause", "menu-phase-frozen", "Native menu pause freezes phase"),
                                   ("fully-offscreen", "offscreen-frozen", "Fully offscreen pause freezes phase"),
                                   ("native-hidden-background-start", "native-hidden-background-end", "Genuine hidden Chrome tab freezes phase")]:
            before, after = get(first), get(last)
            check(before["scene"]["data"]["motion"] == "paused" and after["scene"]["data"]["motion"] == "paused"
                  and len(decorations(before["scene"])) == len(decorations(after["scene"])) == 11
                  and all(a["time"] == b["time"] for a, b in zip(decorations(before["scene"]), decorations(after["scene"]))), label)
            if first.startswith("native-hidden"):
                assert before["hidden"] and after["hidden"]
        for scenario in ["manual-pause-reentry", "native-manual-pause-visible-return"]:
            check(get(scenario)["scene"]["data"]["motion"] == "paused", f"User Pause survives {scenario}")
        initial, optin = get("native-reduced-initial"), get("native-reduced-explicit-play")
        check(initial["reduced"] and initial["scene"]["data"]["motion"] == "paused" and initial["scene"]["data"]["effects"] == "off"
              and optin["reduced"] and optin["scene"]["data"]["motion"] == "playing" and optin["scene"]["animations"][0]["duration"] == 18000,
              "Native reduced-motion starts static and explicit Play retains real animation timing")
        check(get("native-reduced-live-stop")["scene"]["data"]["motion"] == "paused"
              and get("native-reduced-sticky-return")["scene"]["data"]["motion"] == "paused", "Native live reduced-motion stops; returning preference cannot resume")
        initial, optin = get("native-save-data-initial"), get("native-save-data-explicit-play")
        check(initial["saveData"] and "[native code]" in initial["saveDataGetter"] and initial["scene"]["data"]["effects"] == "off"
              and optin["saveData"] and optin["scene"]["data"]["motion"] == "playing", "Native Save-Data initial static policy and explicit opt-in")
        nojs = get("final-native-no-javascript")["scene"]
        check(nojs["image"]["natural"] == [1882, 836] and nojs["button"]["hidden"] and nojs["effects"]["visibility"] == "hidden"
              and get("no-js-navigation-collections")["url"].endswith("/collections/"), "No JavaScript preserves image and genuine native link navigation; no dead animation control")
        error = get("native-image-error" if name == "codex" else "native-image-error-enabled-network")["scene"]
        check(error["image"]["natural"] == [0, 0] and error["data"]["image"] == "error" and error["button"]["hidden"]
              and error["data"]["effects"] == "off", "Real blocked-image error hides motion/control and preserves reserved frame")
        for suffix in ["home-primary-cta", "inner-header-quality", "mobile-menu-contact-navigation"]:
            check(get(suffix)["url"].endswith({"home-primary-cta": "/collections/", "inner-header-quality": "/quality/", "mobile-menu-contact-navigation": "/contact/"}[suffix]), f"Genuine destination: {suffix}")
        check("3 field" in get("contact-required-validation")["details"]["focus"]["text"], "Empty required fields receive actual 3-field validation feedback")
        check("1 field" in get("contact-email-validation")["details"]["focus"]["text"], "Invalid Email receives actual single-field feedback")
        check("Nothing was sent" in get("contact-local-preview")["details"]["focus"]["text"], "Local preview states that nothing was sent")
        edited = {field["name"]: field["value"] for field in get("contact-edit-preserves")["details"]["fields"]}
        cleared = get("contact-clear")["details"]["fields"]
        check(edited["name"] == "Demo Buyer" and edited["email"] == "buyer@example.invalid" and "fictional demo" in edited["project"], "Edit preserves actual sample values")
        check(all(not field["value"] for field in cleared if field["name"] in ["name", "email", "project"])
              and not any(field.get("checked") for field in cleared), "Clear removes actual sample values and checkbox choices")
        check(get("history-back")["url"].endswith("/collections/ornamental-fish/") and "/contact/" in get("history-forward")["url"], "Actual Back/Forward returns to the expected pages")
        for scenario, slug in [("fish-prefill", "ornamental-fish"), ("category-prefill-aquatic-plants", "aquatic-plants"), ("category-prefill-driftwood", "driftwood")]:
            details = get(scenario)["details"]
            field_name = "category" if name == "codex" else "interest"
            check(any(field["name"] == field_name and field["value"] == slug and (name == "codex" or field.get("checked")) for field in details["fields"]), f"Actual category-to-Contact prefill: {slug}")
        data_folder = WORKSPACES / name / "demo" / ("public" if name == "codex" else "dist")
        for relative, expected in delivery["workers"][name]["delivered_files"].items():
            assert sha(data_folder / relative) == expected, "Delivery changed after browser evaluation"
        live = get("save-data-live-interface-observation")
        cleanup = get("save-data-observer-cleanup")
        check(cleanup["observerAbsent"] and cleanup["saveData"] is False, "Save-Data override/temporary observation listener restored")
        if name == "claude":
            check(get("native-visible-auto-resume")["scene"]["data"]["motion"] == "playing", "Eligible genuine visible return resumes")
        else:
            check(get("native-visible-auto-resume-ui-evidence")["observedPauseControl"], "Eligible genuine visible return exposes actual Pause control (UI/state evidence)")
        logs = json.loads((ROOT / f"evidence/{name}/console.json").read_text())
        site_errors = [log for log in logs if "chrome-extension://" not in log.get("message", "")]
        check(not site_errors, "No site-origin warnings/errors observed; extension module errors recorded separately")
        output["workers"][name] = {"passed_observation_checks": len(passed), "checks": passed,
                                  "geometry": geometries, "save_data_live": live,
                                  "browser_extension_errors": len(logs),
                                  "native_followup_limit": get("native-followup-limit")}
    (ROOT / "evidence/browser-acceptance.json").write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({name: {"passed": data["passed_observation_checks"], "save_data_live_network": "unverified"} for name, data in output["workers"].items()}))

if __name__ == "__main__":
    main()
