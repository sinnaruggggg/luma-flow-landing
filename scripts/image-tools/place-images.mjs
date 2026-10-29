// Codex 원본 PNG를 WebP(최대 1600px)로 바꿔 사이트 폴더에 넣고, 원본은 assets-src 에 보관합니다.
// 사용: node scripts/image-tools/place-images.mjs <사이트id> "파일이름=원본경로.png" ...
// 결과: public/sites/<사이트id>/<파일이름>.webp, assets-src/sites/<사이트id>/<파일이름>.png
import { chromium } from 'playwright';
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const [siteId, ...pairs] = process.argv.slice(2);
if (!siteId || !pairs.length) { console.error('사용: node place-images.mjs <사이트id> "이름=경로.png" ...'); process.exit(1); }
const out = `D:/www/mypages/public/sites/${siteId}`;
const keep = `D:/www/mypages/assets-src/sites/${siteId}`;
mkdirSync(out, { recursive: true }); mkdirSync(keep, { recursive: true });

// sharp 대신 Edge 브라우저의 canvas로 변환합니다. (이 PC에서는 sharp가 로드되지 않음)
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
for (const pair of pairs) {
  const [name, src] = pair.split('=');
  const path = src.replace(/\\/g, '/');
  const b64 = readFileSync(path).toString('base64');
  const result = await page.evaluate(async (data) => {
    const img = new Image(); img.src = data; await img.decode();
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
    const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, c.width, c.height);
    return { w: img.naturalWidth, h: img.naturalHeight, webp: c.toDataURL('image/webp', 0.8).split(',')[1] };
  }, `data:image/png;base64,${b64}`);
  const buf = Buffer.from(result.webp, 'base64');
  writeFileSync(`${out}/${name}.webp`, buf);
  copyFileSync(path, `${keep}/${name}.png`);
  console.log(`${siteId}/${name}.webp ${result.w}x${result.h} ${Math.round(statSync(path).size / 1024)}KB → ${Math.round(buf.length / 1024)}KB`);
}
await browser.close();
