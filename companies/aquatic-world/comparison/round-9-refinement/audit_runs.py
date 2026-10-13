"""Review bounded native execution metadata without publishing raw transcripts."""
import collections
import argparse
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
WORK=ROOT.parents[1]/"round-9-refinement"
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--stage",choices=["stage-2"])
args=parser.parse_args()
result={}
for name in ("codex","claude"):
    folder=WORK/name/"evidence"
    if args.stage:folder/=args.stage
    record=json.loads((folder/"process-run.json").read_text())
    counts=collections.Counter(); images=[]; result_event=None
    for line in (folder/"cli-events.jsonl").read_text().splitlines():
        try: event=json.loads(line)
        except ValueError: continue
        if name=="codex" and event.get("type")=="item.completed":
            item=event.get("item",{}); counts[item.get("type","unknown")]+=1
            if item.get("type")=="mcp_tool_call": counts[item.get("tool","unknown")]+=1
        if name=="claude" and event.get("type")=="assistant":
            for block in event.get("message",{}).get("content",[]):
                if block.get("type")=="tool_use":
                    tool=block.get("name");counts[tool]+=1
                    path=block.get("input",{}).get("file_path","")
                    if tool=="Read" and Path(path).suffix.lower() in {".jpg",".png",".webp"}: images.append(path.split("/input/")[-1])
        if event.get("type")=="result":
            result_event={key:event[key] for key in ("subtype","is_error","num_turns","duration_ms") if key in event}
    if name=="codex":
        command=record["command"]
        images=[command[i+1] for i,item in enumerate(command) if item=="--image"]
    result[name]={"process":record,"tool_counts":dict(counts),"native_image_inputs_or_reads":sorted(set(images)),"result":result_event,"limit":"Requested Codex model is not independently exposed by the JSON events. CLI configurations and own-code baselines differ; this is not an isolated model ranking."}
(ROOT/("evidence/cli-audit-"+args.stage+".json" if args.stage else "evidence/cli-audit.json")).write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps({n:{"status":r["process"]["status"],"exit":r["process"].get("exit_code"),"image_paths":len(r["native_image_inputs_or_reads"]),"tools":r["tool_counts"]} for n,r in result.items()}))
