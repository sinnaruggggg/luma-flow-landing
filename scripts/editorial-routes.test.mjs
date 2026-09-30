import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.EDITORIAL_URL||'http://127.0.0.1:4174';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:/Users/sinna/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,selector] of [['/','.hero-art'],['/projects?budget=premium&industry=medical&style=minimal','.project-card'],['/projects/hangyeol-law','.detail-cover'],['/templates','#samples-heading'],['/portfolio','#portfolio-index-heading']]){
  await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator(selector).first().waitFor({timeout:60000});
  console.log('PASS production route',route);
 }
 await page.goto(base+'/unknown-legacy-path',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'갤러리로 돌아가기',exact:true}).click();
 await page.locator('.hero-art').waitFor();assert.equal(new URL(page.url()).pathname,'/');
 assert.deepEqual(errors,[]);console.log('PASS legacy home boundary; no page errors');
}finally{await browser.close()}
