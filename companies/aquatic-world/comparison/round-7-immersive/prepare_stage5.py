"""Freeze identical feedback for the observed opaque Home footer cascade."""
import json
import shutil
from prepare import ROOT, WORKSPACES, inventory
from check_inputs import verify

BRIEF='''# Stage 5: continuous Home footer environment

Actual browser bottom-of-Home review found a footer that becomes an opaque solid block and hides the aquarium behind it. A Home-specific transparent rule earlier in a shared stylesheet is overridden by a later generic .site-footer rule of equal specificity. The runtime video itself continues; CSS hides the environmental scene. Both candidates receive this same narrow acceptance feedback.

Ensure the computed Home footer background is transparent and the water/plant/light detail stays visible through a soft translucent readability wash, including at 390×844 and 1440×900. Use an explicitly Home-scoped selector with sufficient specificity, rather than modifying shared inner-page footer styling. Preserve the existing useful footer links, concise disclosure and motion-control clearance. Check pseudo-element washes do not introduce a hard opaque boundary. If already correct, verify and make no needless change.

Read AGENTS.md and this brief; inspect only own Home footer markup and relevant CSS cascade. Write a short evidence/stage-5/design-plan.md, fix if needed, build and perform a focused CSS/source/output check, then write evidence/stage-5/self-review.md and update README.md. No unrelated changes, broad suites, geometry retest, previous evidence rewrite, media alteration, network/MCP, agents/models, Git, outside writes, /tmp, dependencies/configuration, browser scripts or server. Existing source and shared media are otherwise unchanged. Coordinator owns actual computed-style and rendered footer verification.
'''

def main():
    verify()
    inputs=ROOT/'stage-5'
    assert not inputs.exists()
    inputs.mkdir()
    (inputs/'BRIEF.md').write_text(BRIEF)
    (inputs/'PROMPT.txt').write_text('Complete the narrow Stage 5 Home footer cascade check/fix now. Read AGENTS.md and input-stage5/BRIEF.md, inspect own footer CSS/markup only, plan, fix only if needed, build, check the focused cascade/output, then self-review under evidence/stage-5/ and update README.md. Preserve every other behavior, media byte, inner-page footer and prior evidence. Finish now; same feedback and requested low effort go to both native CLIs.\n')
    before={}
    for name in ['codex','claude']:
        w=WORKSPACES/name
        shutil.copytree(inputs,w/'input-stage5')
        (w/'evidence/stage-5').mkdir()
        before[name]=inventory(w/'demo')
    frozen=inventory(inputs)
    assert all(inventory(WORKSPACES/n/'input-stage5')==frozen for n in before)
    (ROOT/'stage-5-input-manifest.json').write_text(json.dumps({'stage':5,'shared_files':frozen,'pre_stage5_demo':before,'effort':'low per process on both native CLIs','human_acceptance':'open'},indent=2)+'\n')
    print(json.dumps({'stage':5,'shared_files':len(frozen)}))

if __name__=='__main__':main()
