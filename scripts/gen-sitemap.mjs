// public/sitemap.xml 을 만듭니다. 새 시안 사이트를 공개하거나 도메인을 바꾼 뒤 실행하세요.
// 실행: node scripts/gen-sitemap.mjs   (도메인 변경 시: SITE_URL=https://새도메인 node scripts/gen-sitemap.mjs)
import { writeFileSync } from 'node:fs';
import { SITES } from '../src/sites/catalog.js';

const base = (process.env.SITE_URL || 'https://nanaweb-nine.vercel.app').replace(/\/$/, '');
const ready = SITES.filter((site) => site.status === 'ready').map((site) => site.id);
const paths = ['/', '/projects', '/privacy', ...ready.map((id) => `/projects/${id}`), ...ready.map((id) => `/sites/${id}`)];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${base}${path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
writeFileSync(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap.xml: ${paths.length}개 주소, robots.txt 갱신 (${base})`);
