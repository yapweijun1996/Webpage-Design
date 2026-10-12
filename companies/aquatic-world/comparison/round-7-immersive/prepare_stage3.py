"""Freeze identical feedback for the observed narrow-landscape crop failure."""
import json
import shutil
from prepare import ROOT, WORKSPACES, inventory
from check_inputs import verify

BRIEF = '''# Stage 3: narrow landscape art direction

Coordinator actual-browser review found both candidates select the portrait movie at 844×390 because the landscape query has a 900px width guard. The portrait cover crop clips fins and brings the subject into the copy. This blocks visual acceptance. Both candidates receive this same correction, not private feedback.

Change the common film/poster/composition selection query to `(min-aspect-ratio: 6/5)` at EVERY width. Update the picture source media, controller query (or its HTML source), relevant Home CSS and current checks/provenance. Landscape remains centered cover; portrait stays cover at 50% 30%. Existing supplied MP4/poster bytes must stay exactly unchanged. Earlier input/media manifests are historical frozen stages; this stage owns the revised selection contract, not new generation.

Near-square portrait is now exactly `(4/5 <= aspect-ratio < 6/5)`, with no height or width guard. Keep copy below roughly 70svh in this range, using normal growing/scrolling sections. Put its rules after any narrow-screen overrides. At narrow landscape sizes such as 844×390 and 667×375, use the landscape left-copy/right-fish composition with compact navigation. Keep type and CTA readable; let short windows scroll naturally instead of fixed-height clipping, fish overlap or shrunken supporting copy. Standard 430×932 / 390×844 / 360×800 / 320×800 remain portrait and must keep the current usable first-screen offer/action. Preserve all eight pages and the inner Contact journey.

Scope is this art-direction correction only. Preserve working media/controller fallback and interaction behavior. Write evidence/stage-3/design-plan.md, implement, build and run focused source/output checks. Record exact modifications and unrun browser checks in evidence/stage-3/self-review.md; update own README. Do not rewrite earlier evidence, inputs, baseline or root contracts. No outside writes, /tmp, Git (including status/diff), network, MCP, other model/agent, media generation/repair, dependencies/configuration, browser shell scripts or server. Coordinator owns all rendered acceptance and publication.
'''

def main():
    verify()
    stage2=json.loads((ROOT/'stage-2-input-manifest.json').read_text())['shared_files']
    assert all(inventory(WORKSPACES/n/'input-stage2')==stage2 for n in ['codex','claude'])
    inputs=ROOT/'stage-3'
    assert not inputs.exists(), 'Stage 3 already exists'
    inputs.mkdir()
    (inputs/'BRIEF.md').write_text(BRIEF)
    (inputs/'PROMPT.txt').write_text('Complete the focused Stage 3 correction now. Read AGENTS.md, input-stage3/BRIEF.md and your own Stage 2 code/evidence. Both candidates receive identical feedback for the observed 844×390 crop failure. Plan under evidence/stage-3/, revise the Home media query/crop composition consistently, preserve supplied media bytes and all inner pages, build and run focused checks, document results without claiming browser passes, then finish.\n')
    before={}
    for name in ['codex','claude']:
        w=WORKSPACES/name
        shutil.copytree(inputs,w/'input-stage3')
        (w/'evidence/stage-3').mkdir()
        before[name]=inventory(w/'demo')
    frozen=inventory(inputs)
    assert all(inventory(WORKSPACES/n/'input-stage3')==frozen for n in before)
    (ROOT/'stage-3-input-manifest.json').write_text(json.dumps({'stage':3,'shared_files':frozen,'pre_stage3_demo':before,'human_acceptance':'open'},indent=2)+'\n')
    print(json.dumps({'stage':3,'shared_files':len(frozen)}))

if __name__=='__main__':main()
