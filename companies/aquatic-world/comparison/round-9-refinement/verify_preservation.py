"""Build disposable baselines and check preserved inner-page markup/media."""
import json
import re
import hashlib
from pathlib import Path
import shutil
import subprocess
import tempfile
from check_inputs import verify, ROOT, WORKSPACES

result={"frozen":verify(),"candidates":{}}
with tempfile.TemporaryDirectory(prefix="aquatic-refinement-verify-") as scratch:
    for name in ("codex","claude"):
        built={}
        for version,source in (("baseline",WORKSPACES/name/"baseline/demo"),("current",WORKSPACES/name/"demo")):
            target=Path(scratch)/name/version
            shutil.copytree(source,target,ignore=shutil.ignore_patterns("public","dist","node_modules","__pycache__"))
            command=["python3","-B","build.py"] if name=="codex" else ["node","scripts/build.mjs"]
            run=subprocess.run(command,cwd=target,text=True,capture_output=True,check=True)
            built[version]=target/("public" if name=="codex" else "dist")
        pages=[]
        bootstrap_changes=[]
        for old in built["baseline"].rglob("*.html"):
            relative=old.relative_to(built["baseline"])
            if relative.as_posix()=="index.html":continue
            before=old.read_text();after=(built["current"]/relative).read_text()
            if before!=after:
                # The reviewed Claude diff moves scroll initialization into the
                # existing inline JS-support bootstrap; no other markup may vary.
                assert name=="claude",f"Unexpected inner markup change: {name}/{relative}"
                pattern=r"<script>(.*?)</script>"
                old_script=re.search(pattern,before,re.S).group(1)
                new_script=re.search(pattern,after,re.S).group(1)
                assert old_script=='document.documentElement.classList.replace("no-js", "js");'
                assert 'root.classList.toggle("is-scrolled", !on)' in new_script
                assert re.sub(pattern,'<script>REVIEWED_BOOTSTRAP</script>',before,count=1,flags=re.S)==re.sub(pattern,'<script>REVIEWED_BOOTSTRAP</script>',after,count=1,flags=re.S),f"Non-bootstrap inner markup changed: {relative}"
                bootstrap_changes.append({"page":relative.as_posix(),"old_sha256":hashlib.sha256(old_script.encode()).hexdigest(),"new_sha256":hashlib.sha256(new_script.encode()).hexdigest()})
            pages.append(relative.as_posix())
        result["candidates"][name]={"preserved_inner_markup":sorted(pages),"reviewed_bootstrap_changes":bootstrap_changes,"limit":"Shared CSS/JS changes require actual browser checks; byte-identical markup alone does not establish appearance/behavior."}
(ROOT/"evidence/preservation.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps({n:len(r["preserved_inner_markup"]) for n,r in result["candidates"].items()}))
