import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.EDITORIAL_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  || "C:/Users/sinna/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";

const browser = await chromium.launch({ headless: true, executablePath });

async function openFinder(page) {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  const opener = page.locator("button.finder-rail:visible, button.finder-inline:visible").first();
  await opener.click();
  const finder = page.locator("dialog.finder-dialog[open]");
  await finder.waitFor();
  return { finder, opener };
}

async function verifyDesktop() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(8_000);

  const { finder, opener } = await openFinder(page);
  const minimal = page.locator('input[name="finder-style"][value="minimal"]');
  const minimalLabel = minimal.locator("xpath=..");
  await minimal.scrollIntoViewIfNeeded();

  await minimalLabel.hover();
  await page.locator('.style-preview[data-locked="false"]').waitFor();
  await page.locator(".finder-fieldset__title").first().hover();
  await page.locator(".style-preview").waitFor({ state: "detached" });

  await minimal.focus();
  await page.locator('.style-preview[data-locked="false"]').waitFor();
  await page.locator('input[name="finder-budget"]').first().focus();
  await page.locator(".style-preview").waitFor({ state: "detached" });

  const trust = page.locator('input[name="finder-style"][value="trust"]');
  await trust.locator("xpath=..").click();
  await page.locator('.style-preview[data-locked="true"]').waitFor();
  assert.equal(await trust.isChecked(), true, "click should select the style");

  await page.keyboard.press("Escape");
  await page.locator(".style-preview").waitFor({ state: "detached" });
  assert.equal(await trust.evaluate((element) => element === document.activeElement), true, "Escape should return focus to the selected style");
  assert.equal(await finder.isVisible(), true, "the first Escape should keep the finder open");

  await page.keyboard.press("Escape");
  await finder.waitFor({ state: "detached" });
  assert.equal(await opener.evaluate((element) => element === document.activeElement), true, "closing the finder should return focus to its opener");

  await context.close();
}

async function verifyTouchAndMobileInset() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8_000);

  const { finder, opener } = await openFinder(page);
  const photography = page.locator('input[name="finder-style"][value="photography"]');
  await photography.scrollIntoViewIfNeeded();
  await photography.locator("xpath=..").tap();

  const preview = page.locator('.style-preview[data-locked="true"]');
  await preview.waitFor();
  assert.equal(await photography.isChecked(), true, "touch should select the style");

  const bounds = await preview.boundingBox();
  assert.ok(bounds, "the touch preview should have visible bounds");
  const minimumVisibleInset = 12;
  assert.ok(bounds.x >= minimumVisibleInset && bounds.y >= minimumVisibleInset, "the mobile preview should keep its top and left inset");
  assert.ok(390 - bounds.x - bounds.width >= minimumVisibleInset, "the mobile preview should keep its right inset");
  assert.ok(844 - bounds.y - bounds.height >= minimumVisibleInset, "the mobile preview should keep its bottom inset");

  await page.keyboard.press("Escape");
  await preview.waitFor({ state: "detached" });
  assert.equal(await photography.evaluate((element) => element === document.activeElement), true, "Escape should restore the touched style focus");
  assert.equal(await finder.isVisible(), true, "the style preview should close before the finder");

  await page.keyboard.press("Escape");
  await finder.waitFor({ state: "detached" });
  assert.equal(await opener.evaluate((element) => element === document.activeElement), true, "the finder should restore the mobile opener focus");

  await context.close();
}

try {
  await verifyDesktop();
  await verifyTouchAndMobileInset();
  console.log("style preview: desktop and mobile interaction checks passed");
} finally {
  await browser.close();
}
