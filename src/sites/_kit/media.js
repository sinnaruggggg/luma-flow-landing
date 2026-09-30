import { withBasePath } from '../../lib/appPaths.js';
import STOCK from './stock-photos.json' with { type: 'json' };

const STOCK_BY_KEY = new Map(STOCK.map((item) => [item.key, item]));

// 보유 사진: stock('brand/p2u7eu00DCA') → /agency-assets/photos/brand/p2u7eu00DCA.jpg
export function stock(key) {
  return withBasePath(`/agency-assets/photos/${key}.jpg`);
}

export function stockAlt(key) {
  return STOCK_BY_KEY.get(key)?.alt || '';
}

// 사이트 전용 이미지: siteImage('movelab', 'hero.webp') → /sites/movelab/hero.webp
export function siteImage(siteId, file) {
  return withBasePath(`/sites/${siteId}/${file}`);
}

// 사이트 content.js의 PHOTOS 값 하나를 { src, alt }로 바꿉니다.
// 문자열이면 보유 사진 키, { file, alt } 객체면 public/sites/<siteId>/ 안의 사이트 전용 이미지입니다.
// ready: 실제로 폴더에 들어온 파일명 목록(선택). 목록에 없으면 fallback(보유 사진 키)을 쓰고, 그것도 없으면 src가 null입니다.
export function resolvePhoto(siteId, value, ready) {
  if (value && typeof value === 'object') {
    if (!ready || ready.includes(value.file)) return { src: siteImage(siteId, value.file), alt: value.alt || '' };
    if (value.fallback) return { src: stock(value.fallback), alt: value.alt || stockAlt(value.fallback) };
    return { src: null, alt: value.alt || '' };
  }
  return { src: stock(value), alt: stockAlt(value) };
}

// 사진 출처 목록 (보유 사진 키 배열 → 작가·라이선스 정보)
export function creditsFor(keys) {
  return keys.map((key) => STOCK_BY_KEY.get(key)).filter(Boolean);
}
