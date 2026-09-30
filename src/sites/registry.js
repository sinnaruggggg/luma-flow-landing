// 완성된 시안 사이트의 코드 불러오기. 사이트마다 따로 나뉘어 필요할 때만 받습니다.
export const SITE_LOADERS = Object.freeze({
  'hangyeol-law': () => import('./hangyeol-law/Site.jsx'),
  flowdeck: () => import('./flowdeck/Site.jsx'),
  'orda-dental': () => import('./orda-dental/Site.jsx'),
  'ondo-coffee': () => import('./ondo-coffee/Site.jsx'),
  'stay-yeobaek': () => import('./stay-yeobaek/Site.jsx'),
  movelab: () => import('./movelab/Site.jsx'),
  'objet-market': () => import('./objet-market/Site.jsx'),
  'saebom-english': () => import('./saebom-english/Site.jsx'),
  'dasom-tax': () => import('./dasom-tax/Site.jsx'),
});
