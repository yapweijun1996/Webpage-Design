import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validate,build} from './build.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const results=[];
function check(name,fn){try{const details=fn();results.push({name,status:'passed',details:details??null});}catch(error){results.push({name,status:'failed',error:error.message});}}
const fixtureNames=['default','minimal','five','alternate'];
for (const name of fixtureNames) {
 const config=JSON.parse(readFileSync(path.join(root,`content/${name}.json`)));
 const relative=name==='default'?'index.html':`fixtures/${name}.html`;
 const html=readFileSync(path.join(root,relative),'utf8');
 check(`${name}: generated output matches source`,()=>assert.equal(html,build(config,name==='default'?'':'../')));
 check(`${name}: heading and semantic landmarks`,()=>{
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for(const tag of ['header','main','footer','nav'])assert.match(html,new RegExp(`<${tag}\\b`));
  assert.match(html,/<html lang="en">/);
  assert.match(html,/<a class="skip-link" href="#main">/);
 });
 check(`${name}: IDs and anchor destinations`,()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  const links=[...html.matchAll(/href="(#[^"]+)"/g)].map(m=>m[1]);
  for(const href of links) assert.ok(ids.includes(href.slice(1)),`${href} does not resolve`);
  for(const m of html.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(m[1]));
  return {ids:ids.length,links:links.length};
 });
 check(`${name}: local resources resolve`,()=>{
  const references=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(p=>!p.startsWith('data:'));
  for(const m of html.matchAll(/srcset="([^"]+)"/g))for(const entry of m[1].split(', '))references.push(entry.split(' ')[0]);
  for(const reference of references)assert.ok(existsSync(path.resolve(path.dirname(path.join(root,relative)),reference)),`Missing ${reference}`);
  assert.equal((html.match(/<img\b/g)||[]).length,(html.match(/<img[^>]+\bwidth="\d+"[^>]+\bheight="\d+"/g)||[]).length);
  return {resolved:references.length};
 });
 check(`${name}: data-driven category count`,()=>assert.equal((html.match(/class="collection-card"/g)||[]).length,config.collections.items.length));
 check(`${name}: honest enquiry and SEO`,()=>{
  assert.match(html,/real enquiries are unavailable/);
  assert.match(html,/No message is collected, stored or sent/);
  assert.doesNotMatch(html,/<form\b|mailto:|#contact|example\.invalid|application\/ld\+json/);
  assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(html,/rel="canonical"/);
 });
}
const base=JSON.parse(readFileSync(path.join(root,'content/default.json')));
check('default: all eight regions in reference order',()=>{
 const html=build(base,'');const order=['site-header','hero','heritage','collections','quality','highlights','enquiry','site-footer'].map(id=>html.indexOf(`id="${id}"`));
 assert.ok(order.every((x,i)=>x>=0&&(i===0||x>order[i-1])));
});
check('alternate: no original brand or geographic residue',()=>{
 const html=readFileSync(path.join(root,'fixtures/alternate.html'),'utf8');assert.doesNotMatch(html,/Aquatic World|AQUATIC WORLD|Singapore|singapore|aquaticworld\.com/);assert.match(html,/TIDAL ATELIER/);
});
check('minimal: optional sections and navigation absent',()=>{
 const html=readFileSync(path.join(root,'fixtures/minimal.html'),'utf8');assert.doesNotMatch(html,/id="quality"|id="highlights"|href="#quality"|class="hero-motifs"|class="heritage-aside"/);
});
check('empty optional sections: no section or navigation remains',()=>{
 const c=structuredClone(base);c.quality.items=[];c.highlights.items=[];
 const html=build(c,'');assert.doesNotMatch(html,/id="quality"|id="highlights"|href="#quality"/);
});
check('validation: duplicate categories rejected',()=>{const c=structuredClone(base);c.collections.items.push(c.collections.items[0]);assert.throws(()=>validate(c),/duplicate/);});
check('validation: unsafe URL rejected',()=>{const c=structuredClone(base);c.cta.primary.href='javascript:alert(1)';assert.throws(()=>validate(c),/Unsafe/);});
check('validation: unsupported contact state rejected',()=>{const c=structuredClone(base);c.enquiry.contactState='success';assert.throws(()=>validate(c),/No live contact/);});
check('validation: missing asset rejected',()=>{const c=structuredClone(base);c.hero.imageId='missing';assert.throws(()=>validate(c),/Missing asset/);});
check('validation: wrong fixed source rejected',()=>{const c=structuredClone(base);c.hero.imageId='collection-driftwood';assert.throws(()=>validate(c),/slot mismatch/);});
check('validation: non-demo build rejected',()=>{const c=structuredClone(base);c.contentStatus='PRODUCTION_APPROVED';assert.throws(()=>validate(c),/fictional local demos/);});
check('validation: nonexistent CTA destination rejected',()=>{const c=structuredClone(base);c.cta.primary.href='#missing';assert.throws(()=>validate(c),/Missing destination/);});
check('rendering: text and attribute content escaped',()=>{
 const c=structuredClone(base);c.brand.name='"><img src=x onerror=alert(1)>';
 const html=build(c,'');assert.ok(html.includes('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'));assert.doesNotMatch(html,/<img src=x onerror/);
});
check('assets: derivative and source hashes match manifest',()=>{
 const manifest=JSON.parse(readFileSync(path.join(root,'assets/manifest.json')));
 let derivativeBytes=0,sourceBytes=0,variantCount=0;
 for(const a of Object.values(manifest.assets)) {
  const source=readFileSync(path.resolve(root,'..',a.source));
  assert.equal(createHash('sha256').update(source).digest('hex'),a.sha256);
  sourceBytes+=a.bytes;
  for(const v of a.variants){const data=readFileSync(path.join(root,v.file));assert.equal(data.length,v.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),v.sha256);derivativeBytes+=data.length;variantCount++;}
 }
 assert.equal(Object.keys(manifest.slots).length,11);
 return {sourceBytes,derivativeBytes,variantCount,reductionPercent:Math.round((1-derivativeBytes/sourceBytes)*10000)/100};
});
const report={type:'static-and-build-checks',executedAt:new Date().toISOString(),status:results.every(r=>r.status==='passed')?'passed':'failed',checks:results,limits:'These checks do not execute a browser, measure CSS layout, establish contrast on photographs, or verify keyboard interaction.'};
console.log(JSON.stringify(report,null,2));
if(report.status==='failed')process.exitCode=1;
