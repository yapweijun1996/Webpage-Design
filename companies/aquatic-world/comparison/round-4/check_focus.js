async (page) => {
  const origin='__ORIGIN__';
  const checks=[];
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await page.goto(origin+'/contact/');
    for(let step=1;step<=40;step++){
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
      const state=await page.evaluate(()=>{
        const el=document.activeElement,rect=el.getBoundingClientRect(),style=getComputedStyle(el);
        const header=document.querySelector('header'),hr=header.getBoundingClientRect();
        const interactive=el.matches('a,button,input,select,textarea,summary');
        const visible=rect.width>0 && rect.height>0 && rect.bottom>0 && rect.top<innerHeight && rect.right>0 && rect.left<innerWidth;
        const hit=document.elementFromPoint(Math.max(1,Math.min(innerWidth-1,rect.left+rect.width/2)),Math.max(1,Math.min(innerHeight-1,rect.top+rect.height/2)));
        // Geometry alone misclassifies a high-z-index skip link above a sticky bar.
        const covered=!header.contains(el) && header.contains(hit) && !el.contains(hit) && hr.top<=0 && rect.top<hr.bottom;
        return {tag:el.tagName,id:el.id,name:el.name||el.getAttribute('aria-label')||el.textContent.trim().slice(0,80),interactive,visible,covered,
          focusVisible:el.matches(':focus-visible'),outline:style.outlineStyle,outlineWidth:parseFloat(style.outlineWidth),top:rect.top,bottom:rect.bottom,hitSelf:el.contains(hit),zIndex:style.zIndex};
      });
      checks.push({scenario:'NAV-03',viewport:viewport.name,step,...state,
        pass:!state.interactive || (state.visible && !state.covered && state.focusVisible && state.outline!=='none' && state.outlineWidth>=1)});
    }
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.goto(origin+'/contact/');
  await page.locator('form button[type=submit]').click();
  const count=await page.locator('.error-summary a').count();
  for(let index=0;index<count;index++){
    await page.locator('.error-summary a').nth(index).click();
    const state=await page.evaluate(()=>({tag:document.activeElement.tagName,name:document.activeElement.name,invalid:document.activeElement.getAttribute('aria-invalid')}));
    checks.push({scenario:'FORM-01',step:'Error summary link focuses its invalid control',index,...state,pass:['INPUT','TEXTAREA','SELECT'].includes(state.tag) && state.invalid==='true'});
  }
  return {checks};
}
