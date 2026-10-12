"""Run independent browser journeys or interaction checks, retaining full results."""
import argparse
import json
from capture_report import ROOT, run, result

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('mode',choices=['journeys','interactions','focus'])
    parser.add_argument('runner',choices=['codex','claude'])
    parser.add_argument('origin')
    args=parser.parse_args()
    output=ROOT/'output/playwright'/args.runner
    output.mkdir(parents=True,exist_ok=True)
    run('goto',args.origin+'/')
    run('snapshot')
    source=(ROOT/f'check_{args.mode}.js').read_text().replace('__RUNNER__',args.runner).replace('__ORIGIN__',args.origin).replace('__OUTPUT__',str(output))
    report=result(run('run-code',source))
    report['runner']=args.runner
    (output/f'{args.mode}-checks.json').write_text(json.dumps(report,indent=2)+'\n')
    failed=[item for item in report['checks'] if not item['pass']]
    print(json.dumps({'runner':args.runner,'mode':args.mode,'checks':len(report['checks']),'failed':failed}))
    raise SystemExit(1 if failed else 0)

if __name__=='__main__':
    main()
