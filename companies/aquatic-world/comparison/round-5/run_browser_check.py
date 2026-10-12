"""Run one bounded browser procedure through the owned Playwright CLI session."""
import argparse,json
from capture_report import ROOT,run,result
p=argparse.ArgumentParser();p.add_argument('script');p.add_argument('runner',choices=['codex','claude']);p.add_argument('origin');p.add_argument('--stage',default='after');args=p.parse_args()
output=ROOT/'output/playwright'/args.runner if args.stage=='after' else ROOT/'output/before'/args.runner
output.mkdir(parents=True,exist_ok=True)
run('goto',args.origin+'/contact/');run('snapshot')
source=(ROOT/(args.script+'.js')).read_text().replace('__ORIGIN__',args.origin).replace('__RUNNER__',args.runner).replace('__OUTPUT__',str(output))
d=result(run('run-code',source));(output/(args.script+'.json')).write_text(json.dumps(d,indent=2)+'\n')
failed=[c for c in d.get('checks',[]) if not c.get('pass')]
print(json.dumps({'runner':args.runner,'stage':args.stage,'script':args.script,'checks':len(d.get('checks',[])),'observations':len(d.get('observations',[])),'failed':failed,'errors':d.get('errors',[]),'failedResponses':d.get('failedResponses',[])}))
raise SystemExit(1 if failed or d.get('errors') or d.get('failedResponses') else 0)
