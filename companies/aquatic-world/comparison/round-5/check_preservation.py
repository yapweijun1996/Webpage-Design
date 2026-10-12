"""Verify frozen inputs and native deliveries for every preserved experiment."""
import datetime as dt,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent
COMPARISON=ROOT.parent
checks=[]
for folder in [COMPARISON,*[COMPARISON/f'round-{n}' for n in range(2,6)]]:
 for suffix in [('check_inputs.py',),('verify_delivery.py','check','codex'),('verify_delivery.py','check','claude')]:
  command=['python3','-B',str(folder/suffix[0]),*suffix[1:]]
  result=subprocess.run(command,capture_output=True,text=True)
  checks.append({'command':command,'exit_code':result.returncode,'output':result.stdout.strip(),'error':result.stderr.strip()})
passed=all(c['exit_code']==0 for c in checks)
(ROOT/'output/preservation-checks.json').write_text(json.dumps({'checked_at':dt.datetime.now(dt.timezone.utc).isoformat(),'checks':checks,'pass':passed},indent=2)+'\n')
print(json.dumps({'checks':len(checks),'pass':passed,'failed':[c for c in checks if c['exit_code']]}))
raise SystemExit(0 if passed else 1)
