"""Freeze the same focused motion-icon acceptance feedback for both CLIs."""
import json
import shutil
from prepare import ROOT, WORKSPACES, inventory
from check_inputs import verify

BRIEF='''# Stage 4: motion icon state

Actual-browser review found a playback control whose accessible label correctly says Pause background while its visible icon stays a Play triangle. The affected SVG has a JavaScript expando `.hidden` property that disagrees with its real `hidden` attribute: the pause SVG still has the attribute and display:none; the play SVG has no attribute and remains display:block. Stub DOM checks missed this SVG behavior. Both candidates receive this exact same acceptance requirement.

During eligible motion the visible icon must be Pause; after manual Pause it must be Play/Resume; on explicit Resume it returns to Pause. Match visible icons, accessible action and actual behavior. Update real SVG attributes with toggleAttribute/setAttribute/removeAttribute, or use consistent action-state CSS, rather than relying on an SVG .hidden expando. If your existing implementation already uses correct action-state CSS, verify it and make no unnecessary source change.

This is a narrowly bounded final fix. Read AGENTS.md and this brief, then inspect only your own relevant motion controller/icon CSS/markup. Write a short evidence/stage-4/design-plan.md, fix if needed, build and run one meaningful source/attribute check that cannot mistake an SVG expando for an HTML hidden property. Do not rerun unrelated geometry suites or rewrite Stage 1–3 evidence. Keep all media bytes, layout, copy, eight pages, Contact and other controller behavior unchanged. Save evidence/stage-4/self-review.md and update own README; rendered SVG verification belongs to the coordinator. No outside files, Git, /tmp, other agent/model, network/MCP, browser shell scripts, media generation, dependencies/configuration or server. Finish this small fix now.
'''

def main():
    verify()
    inputs=ROOT/'stage-4'
    assert not inputs.exists()
    inputs.mkdir()
    (inputs/'BRIEF.md').write_text(BRIEF)
    (inputs/'PROMPT.txt').write_text('Complete the narrowly bounded Stage 4 motion-icon check/fix now. Read AGENTS.md and input-stage4/BRIEF.md. Inspect own motion icon code only; plan, fix an SVG attribute mismatch if present, build and perform one meaningful attribute-state check, then self-review under evidence/stage-4/ and update README.md. No unrelated changes or broad re-analysis. Both workers receive identical feedback and requested low effort for this small repair.\n')
    before={}
    for name in ['codex','claude']:
        w=WORKSPACES/name
        shutil.copytree(inputs,w/'input-stage4')
        (w/'evidence/stage-4').mkdir()
        before[name]=inventory(w/'demo')
    frozen=inventory(inputs)
    assert all(inventory(WORKSPACES/n/'input-stage4')==frozen for n in before)
    (ROOT/'stage-4-input-manifest.json').write_text(json.dumps({'stage':4,'shared_files':frozen,'pre_stage4_demo':before,'effort':'low per process on both native CLIs','human_acceptance':'open'},indent=2)+'\n')
    print(json.dumps({'stage':4,'shared_files':len(frozen)}))

if __name__=='__main__':main()
