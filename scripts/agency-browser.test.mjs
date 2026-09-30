import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base=process.env.EDITORIAL_URL || 'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'C:/Users/sinna/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const out=new URL('../artifacts/agency/',import.meta.url);
await mkdir(out,{recursive:true});
const evidence=[];
try {
 for(const width of [1440,390,360]){
  const page=await browser.newPage({viewport:{width,height:960}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.hero-art').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.site-header').evaluate(el=>getComputedStyle(el).position),'fixed');
  const heroBounds=await page.locator('.hero-art').evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,viewport:document.documentElement.clientWidth}));
  assert.equal(heroBounds.left,0,'hero starts at viewport edge');assert.equal(heroBounds.right,heroBounds.viewport,'hero spans viewport');
  assert.equal(await page.locator('.hero-scene').count(),4,'hero has four authored motion scenes');
  await page.locator('.site-reveal img').evaluate(el=>el.decode());
  assert.equal(await page.locator('.kinetic-website').count(),0,'retired floating cards are absent');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:new URL(`home-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,'')});
  const cta=page.locator(width>760?'.finder-rail':'.finder-inline');
  await cta.click();await page.locator('dialog[open]').waitFor();
  assert.equal(await page.getByRole('button',{name:'맞는 제작 사례 보기',exact:true}).isDisabled(),true);
  for(let i=0;i<15;i++) {await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.querySelector('.finder-dialog').contains(document.activeElement)),true);}
  await page.keyboard.press('Escape');
  // A transient style explanation may close first; Escape again closes the finder.
  if(await page.locator('dialog[open]').count()) await page.keyboard.press('Escape');
  await page.locator('.finder-dialog').waitFor({state:'detached'});
  assert.equal(await cta.evaluate(el=>el===document.activeElement),true);
  await cta.click();
  for(const [group,value] of [['budget','700-1500'],['industry','medical'],['style','trust']]){
   await page.locator(`input[name="finder-${group}"][value="${value}"]`).evaluate(el=>el.click());
  }
  await page.getByRole('button',{name:'맞는 제작 사례 보기',exact:true}).click();
  await page.waitForURL('**/projects?**');
  assert.equal(new URL(page.url()).searchParams.get('industry'),'medical');
  assert.ok(await page.locator('.project-card').count()>0);
  await page.reload();await page.locator('.project-card').first().waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(`${base}/projects/sample-medical-trust?budget=700-1500`);
  await page.locator('.detail-title').waitFor();
  await page.locator('.sample-open').click();
  await page.waitForURL('**/samples/medical-trust**');
  await page.locator('h1').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'sample overflow');
  await page.screenshot({path:new URL(`sample-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,''),fullPage:true});
  await page.goto(base);await page.locator('.hero-art').waitFor();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.motion-control')?.disabled);
  assert.equal(await page.locator('.motion-control').isDisabled(),true);
  assert.deepEqual(errors,[]);
  evidence.push({width,status:'passed',errors});await page.close();
 }
 await writeFile(new URL('browser-results.json',out),JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
}finally{await browser.close();}
