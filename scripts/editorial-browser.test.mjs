import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.EDITORIAL_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || 'C:/Users/sinna/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const out = new URL('../artifacts/editorial/', import.meta.url);
await mkdir(out, {recursive:true});
const evidence=[];
try {
 for (const width of [1440,390,360]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.setDefaultTimeout(60000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.hero-art').waitFor();await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:new URL(`home-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,'')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'home horizontal overflow');
  const cta=page.locator(width>760?'.finder-rail':'.finder-inline');
  await cta.click();await page.locator('dialog[open]').waitFor();
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>document.querySelector('.finder-dialog').contains(document.activeElement)),true);
  assert.equal(await page.locator('.finder-form__submit').isDisabled(),true);
  await page.screenshot({path:new URL(`finder-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,'')});
  for(let i=0;i<26;i++){
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.querySelector('.finder-dialog').contains(document.activeElement)),true,'focus stays in dialog');
  }
  for(let i=0;i<12;i++){
   await page.keyboard.press('Shift+Tab');
   assert.equal(await page.evaluate(()=>document.querySelector('.finder-dialog').contains(document.activeElement)),true,'reverse focus stays in dialog');
  }
  await page.keyboard.press('Escape');await page.locator('.finder-dialog').waitFor({state:'detached'});
  assert.equal(await cta.evaluate(el=>el===document.activeElement),true,'return focus');
  await cta.click();
  // Click label text instead of visually clipped native inputs.
  for(const [group,value] of [['budget','premium'],['industry','medical'],['style','minimal']]) await page.locator(`input[name="finder-${group}"][value="${value}"] + span`).click();
  assert.equal(await page.locator('.finder-form__submit').isEnabled(),true);
  await page.getByRole('button',{name:'예상 예산 선택 해제',exact:true}).click();
  assert.equal(await page.locator('.finder-form__submit').isDisabled(),true);
  await page.locator('input[value="premium"] + span').click();
  await page.getByRole('button',{name:'맞는 제작 사례 보기',exact:true}).click();
  await page.waitForURL('**/projects?**');
  assert.equal(new URL(page.url()).searchParams.get('industry'),'medical');
  assert.equal(await page.locator('.project-card').count(),1);
  await page.goBack();await page.locator('.hero-art').waitFor();
  await page.goForward();await page.locator('.project-card').first().waitFor();
  assert.equal(await page.locator('.project-card').count(),1,'history restores committed filters');
  await page.reload();await page.locator('.project-card').first().waitFor();
  assert.equal(await page.locator('.project-card').count(),1);
  await page.getByRole('button',{name:'조건 변경',exact:true}).click();
  assert.equal(await page.locator('input:checked').count(),3);
  await page.getByRole('button',{name:'전체 초기화',exact:true}).click();
  assert.equal(await page.locator('input:checked').count(),0);
  await page.getByRole('button',{name:'프로젝트 찾기 닫기',exact:true}).click();
  assert.equal(await page.locator('.project-card').count(),1,'cancel keeps committed URL');
  await page.locator('.project-card a').first().click();await page.locator('.detail-title').waitFor();
  assert.ok(page.url().includes('/projects/orda-dental'));
  await page.reload();await page.locator('.detail-cover').waitFor();
  await page.getByRole('link',{name:'← 프로젝트 목록',exact:true}).click();
  await page.locator('.project-card').first().waitFor();assert.equal(await page.locator('.project-card').count(),1);
  await page.goto(`${base}/projects?budget=light&industry=medical&style=impact`);
  await page.locator('.project-card').first().waitFor();
  const recommendationCount=await page.locator('.project-card').count();assert.ok(recommendationCount>0);
  await page.screenshot({path:new URL(`recommendations-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,'')});
  await page.goto(`${base}/projects/nonexistent`);await page.locator('.not-found').waitFor();
  await page.goto(base);await page.locator('.hero-art').waitFor();
  for(const image of await page.locator('img').all()) {
   await image.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
   await image.evaluate(el=>el.decode());
  }
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
  assert.deepEqual(broken,[],'images should load');
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:new URL(`home-full-${width}.png`,out).pathname.replace(/^\/(?=[A-Z]:)/i,''),fullPage:true});
  await page.evaluate(()=>scrollTo(0,0));
  if(width>760){
   await page.locator('.finder-rail').click();await page.mouse.click(20,450);await page.locator('.finder-dialog').waitFor({state:'detached'});
   await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(150);
   assert.equal(await page.locator('.finder-rail').isVisible(),false);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.motion-control')?.disabled);
  if(width===1440){
   await page.goto(`${base}/projects`);await page.locator('.project-card').first().waitFor();
   assert.ok(await page.locator('.project-card').count()>=6,'all ready portfolio sites are listed');
   for(const image of await page.locator('.project-card img').all()){
    await image.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
    await image.evaluate(el=>el.decode());
   }
  }
  assert.deepEqual(errors,[]);
  evidence.push({width,errors,recommendationCount,status:'passed'});
  await page.close();
 }
 await writeFile(new URL('browser-results.json',out),JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
} finally {await browser.close()}
