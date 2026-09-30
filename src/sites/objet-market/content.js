// 오브제마켓 (가상 업체) — 상품·문구는 이 파일에서 수정합니다.
// 브리프: 리빙 편집숍 / 대상 = 집을 꾸미는 2040 / 목표 = 상품 구매 / 무드 = 커머스 모던 / 형식 = 기능형(목록 → 상세 → 장바구니 → 주문)

export const SHOP = Object.freeze({
  name: '오브제마켓',
  english: 'objet market',
  freeShipping: 50000,
  shippingFee: 3000,
  address: '서울 마포구 ○○로 00',
  phone: '02-000-0000',
  cs: '평일 10:00 – 17:00 (점심 12:30 – 13:30)',
});

// GPT 이미지가 public/sites/objet-market/ 에 들어오면 파일명을 여기에 추가합니다.
export const READY_IMAGES = Object.freeze([]);

export const BANNERS = Object.freeze({
  table: { file: 'banner-table.webp', alt: '수공예 도자기가 차려진 식탁', fallback: 'retail/YI2YkyaREHk' },
  shelf: { file: 'banner-shelf.webp', alt: '도자기 화병이 놓인 원목 선반', fallback: 'retail/OtXADkUh3-I' },
  green: 'retail/KSfe2Z4REEM',
  sun: 'retail/EQpXnijYejQ',
});

export const CATEGORIES = Object.freeze([['all', '전체'], ['vase', '화병'], ['bowl', '그릇'], ['cup', '컵·잔'], ['objet', '오브제']]);

export const PRODUCTS = Object.freeze([
  { id: 'earth-vase-set', name: '흙결 화병 세트', maker: '공방 소담', category: 'vase', price: 68000, photo: 'retail/zeGT9j4ltRA', isNew: true, colors: ['흙빛'], desc: '거친 흙의 질감을 그대로 살린 화병 세 점. 마른 가지 한두 개만 꽂아도 공간이 정리됩니다.' },
  { id: 'line-bowl', name: '실선 볼', maker: '백토 스튜디오', category: 'bowl', price: 32000, photo: 'retail/Mz__0nr1AM8', colors: ['화이트'], desc: '물레 자국을 가는 선으로 남긴 흰 볼. 샐러드와 과일에 두루 어울립니다.' },
  { id: 'celadon-vase', name: '청자 싱글 베이스', maker: '공방 소담', category: 'vase', price: 54000, photo: 'retail/L_bXRw-bZ9I', colors: ['청자', '백자'], desc: '은은한 청자 유약을 입힌 한 송이용 화병. 찻잔과 함께 두면 차분한 테이블이 됩니다.' },
  { id: 'marble-vase', name: '마블 패턴 화병', maker: '흙과불', category: 'vase', price: 72000, photo: 'retail/R0qthXq3jec', isNew: true, colors: ['마블'], desc: '두 가지 흙을 섞어 빚어 같은 무늬가 하나도 없습니다.' },
  { id: 'small-dish-set', name: '소담 종지 세트', maker: '공방 소담', category: 'bowl', price: 28000, photo: 'retail/ypi0l7vP0Vw', colors: ['믹스'], desc: '장, 소스, 반찬을 담기 좋은 작은 종지 다섯 개 세트.' },
  { id: 'morning-mug', name: '아침 머그', maker: '백토 스튜디오', category: 'cup', price: 24000, photo: 'retail/he_xuL-CyyI', colors: ['화이트', '오트'], desc: '손에 쥐었을 때 가장 편한 두께를 찾아 만든 350ml 머그.' },
  { id: 'branch-vase', name: '가지 한 줄 화병', maker: '흙과불', category: 'vase', price: 46000, photo: 'retail/WUrXahlyjBo', colors: ['화이트'], desc: '둥근 몸통에 좁은 입구. 가지 한 줄이 가장 아름답게 서도록 설계했습니다.' },
  { id: 'speckle-plate', name: '점박이 접시', maker: '백토 스튜디오', category: 'bowl', price: 38000, photo: 'retail/bgIO-u4GEfI', colors: ['점박이'], desc: '철분이 섞인 흙이 구워지며 생긴 점무늬가 매력인 접시.' },
  { id: 'sand-cup', name: '모래 컵', maker: '흙과불', category: 'cup', price: 22000, photo: 'retail/4fXPCj0_828', colors: ['베이지'], desc: '모래를 섞은 흙으로 만들어 손끝에 닿는 결이 거칩니다.' },
  { id: 'cobalt-objet', name: '코발트 오브제 세트', maker: '아틀리에 청', category: 'objet', price: 89000, photo: 'retail/Uo2W75MB8uU', isNew: true, colors: ['코발트'], desc: '화병 두 점과 컵 하나로 이루어진 오브제 세트. 선반 위 포인트로 좋습니다.' },
  { id: 'stack-teacups', name: '겹 찻잔 세트', maker: '백토 스튜디오', category: 'cup', price: 56000, photo: 'retail/u_jt9A7FADk', colors: ['화이트'], desc: '겹쳐 보관할 수 있는 찻잔 네 개 세트.' },
  { id: 'lemon-bowl', name: '레몬 볼', maker: '아틀리에 청', category: 'bowl', price: 34000, photo: 'retail/zCYO9HxEAjI', colors: ['레몬'], desc: '옅은 노란 유약이 식탁에 봄을 들여옵니다.' },
  { id: 'dot-shot-set', name: '도트 잔 세트', maker: '아틀리에 청', category: 'cup', price: 26000, photo: 'retail/NENc84l109g', colors: ['도트'], desc: '손으로 하나씩 점을 찍은 작은 잔 네 개.' },
  { id: 'gold-mug', name: '골드 핸들 머그', maker: '흙과불', category: 'cup', price: 29000, photo: 'retail/2dDJdOlA3CY', colors: ['그레이'], desc: '무광 회색 몸체에 금빛 손잡이를 더한 머그.' },
  { id: 'brown-teacup', name: '브라운 찻잔과 받침', maker: '공방 소담', category: 'cup', price: 31000, photo: 'retail/3MrkGyBoRc0', colors: ['브라운'], desc: '깊은 갈색 유약의 찻잔과 받침 한 벌.' },
  { id: 'blue-mug', name: '하늘 머그', maker: '아틀리에 청', category: 'objet', price: 27000, photo: 'retail/Ha5_JcYArf0', colors: ['화이트'], desc: '매끈한 흰 머그. 선물 포장이 가장 많이 선택되는 제품입니다.' },
]);

export const ALL_PHOTO_KEYS = Object.freeze([
  ...PRODUCTS.map((item) => item.photo),
  ...Object.values(BANNERS).map((value) => (typeof value === 'string' ? value : value.fallback)),
]);
