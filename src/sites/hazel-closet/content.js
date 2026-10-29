// 헤이즐 (가상 쇼핑몰) — 카페24 의류 스킨 시안. 상품·문구는 모두 샘플입니다.
// 같은 디자인의 카페24 적용 파일: cafe24-skins/hazel/ (README 참고)

export const SHOP = Object.freeze({
  name: '헤이즐',
  english: 'HAZEL',
  slogan: '오래 입는 데일리웨어',
  freeShipping: 50000,
  shippingFee: 3000,
  cs: '평일 10:00 – 17:00 · 점심 12:30 – 13:30 · 주말·공휴일 휴무',
  phone: '1588-0000',
  email: 'cs@hazel-closet.example',
  bank: '○○은행 000-000000-00-000 (예금주: 헤이즐)',
  owner: '홍길동',
  business: '000-00-00000',
  mailorder: '제0000-서울성수-0000호',
  address: '서울특별시 성동구 ○○로 00, 2층',
});

// Codex로 만든 이미지가 public/sites/hazel-closet/ 에 들어오면 파일명을 추가합니다.
export const READY_IMAGES = Object.freeze(['wool-coat.webp', 'cable-cardigan.webp', 'cotton-shirt.webp', 'wide-slacks.webp', 'cashmere-muffler.webp', 'leather-bag.webp', 'straight-denim.webp', 'rib-turtleneck.webp', 'lookbook-hero.webp', 'lookbook-knit.webp', 'store-rack.webp']);

export const LOOKS = Object.freeze({
  hero: { file: 'lookbook-hero.webp', alt: '창가에서 아이보리 코트와 차콜 슬랙스를 입은 모델의 뒷모습' },
  knit: { file: 'lookbook-knit.webp', alt: '오트밀 가디건과 크림 터틀넥을 입은 모델의 상반신' },
  rack: { file: 'store-rack.webp', alt: '원목 행거에 뉴트럴 컬러 옷이 걸린 쇼룸' },
});

export const CATEGORIES = Object.freeze([
  ['all', '전체'],
  ['outer', '아우터'],
  ['knit', '니트'],
  ['shirt', '셔츠'],
  ['pants', '팬츠'],
  ['acc', '액세서리'],
]);

const photo = (file, alt) => ({ file, alt });

// price = 정가, sale = 판매가 (할인 없으면 같음)
export const PRODUCTS = Object.freeze([
  { id: 'wool-coat', category: 'outer', name: '울 블렌드 싱글 롱코트', price: 289000, sale: 239000, badge: ['NEW', 'BEST'], colors: [['아이보리', '#ece5d6'], ['차콜', '#3b3b3b']], sizes: ['S', 'M', 'L'], reviews: 128, rating: 4.9, photo: photo('wool-coat.webp', '아이보리 울 블렌드 싱글 롱코트'), fabric: '울 70% · 폴리에스터 30% / 안감 큐프라', fit: '어깨가 살짝 내려오는 세미 오버핏', desc: '군더더기 없는 싱글 버튼과 낮은 카라로 어떤 옷 위에도 편하게 걸치는 롱코트입니다. 울 블렌드 원단이라 무게는 가볍고 보온은 충분합니다.' },
  { id: 'cable-cardigan', category: 'knit', name: '케이블 니트 가디건', price: 129000, sale: 109000, badge: ['BEST'], colors: [['오트밀', '#d8c8ad'], ['크림', '#efe7d7'], ['차콜', '#3b3b3b']], sizes: ['FREE'], reviews: 214, rating: 4.8, photo: photo('cable-cardigan.webp', '오트밀 케이블 니트 가디건'), fabric: '울 50% · 아크릴 30% · 나일론 20%', fit: '여유 있는 루즈핏, 엉덩이를 살짝 덮는 기장', desc: '도톰한 케이블 조직이 포인트인 가디건입니다. 단독으로도, 셔츠 위에 겹쳐도 단정하게 떨어집니다.' },
  { id: 'cotton-shirt', category: 'shirt', name: '오버핏 코튼 셔츠', price: 69000, sale: 69000, badge: ['NEW'], colors: [['화이트', '#f6f4ef'], ['스카이', '#cfdce6']], sizes: ['S', 'M', 'L'], reviews: 96, rating: 4.7, photo: photo('cotton-shirt.webp', '화이트 오버핏 코튼 셔츠'), fabric: '코튼 100% (60수 옥스퍼드)', fit: '어깨가 떨어지는 오버핏', desc: '세탁할수록 부드러워지는 60수 코튼 셔츠. 단추를 풀어 아우터처럼 입어도 좋습니다.' },
  { id: 'wide-slacks', category: 'pants', name: '와이드 울 슬랙스', price: 99000, sale: 89000, badge: ['BEST'], colors: [['차콜', '#3b3b3b'], ['베이지', '#cdbb9c']], sizes: ['S', 'M', 'L'], reviews: 302, rating: 4.9, photo: photo('wide-slacks.webp', '차콜 와이드 울 슬랙스'), fabric: '울 30% · 폴리에스터 68% · 스판 2%', fit: '허리 뒷밴딩, 바닥에 살짝 닿는 와이드 기장', desc: '앞주름이 다리를 길어 보이게 잡아 주는 와이드 슬랙스. 뒷밴딩이라 하루 종일 편합니다.' },
  { id: 'cashmere-muffler', category: 'acc', name: '캐시미어 머플러', price: 79000, sale: 69000, badge: ['NEW'], colors: [['카멜', '#b98d5f'], ['그레이', '#a7a7a3']], sizes: ['FREE'], reviews: 57, rating: 4.9, photo: photo('cashmere-muffler.webp', '카멜 캐시미어 머플러'), fabric: '캐시미어 100%', fit: '180 × 30cm', desc: '얼굴에 닿아도 따갑지 않은 캐시미어 100% 머플러. 선물 포장을 무료로 해 드립니다.' },
  { id: 'leather-bag', category: 'acc', name: '레더 미니 숄더백', price: 159000, sale: 139000, badge: [], colors: [['블랙', '#1f1f1f'], ['브라운', '#7a5236']], sizes: ['FREE'], reviews: 41, rating: 4.8, photo: photo('leather-bag.webp', '블랙 레더 미니 숄더백'), fabric: '소가죽 100%', fit: '가로 22 × 세로 15 × 폭 7cm, 스트랩 조절', desc: '휴대폰·지갑·립스틱이 꼭 맞게 들어가는 미니 숄더백. 스트랩을 짧게 하면 토트로 들 수 있어요.' },
  { id: 'straight-denim', category: 'pants', name: '스트레이트 데님 팬츠', price: 79000, sale: 79000, badge: [], colors: [['인디고', '#2f4561'], ['라이트', '#8fa6bd']], sizes: ['S', 'M', 'L'], reviews: 188, rating: 4.7, photo: photo('straight-denim.webp', '인디고 스트레이트 데님 팬츠'), fabric: '코튼 99% · 스판 1%', fit: '허벅지부터 일자로 떨어지는 스트레이트핏', desc: '물 빠짐을 줄인 원워싱 인디고 데님. 체형을 크게 타지 않는 정직한 일자 실루엣입니다.' },
  { id: 'rib-turtleneck', category: 'knit', name: '리브 터틀넥 니트', price: 59000, sale: 49000, badge: ['NEW'], colors: [['크림', '#efe7d7'], ['블랙', '#1f1f1f'], ['모카', '#8b6f5a']], sizes: ['FREE'], reviews: 263, rating: 4.8, photo: photo('rib-turtleneck.webp', '크림 리브 터틀넥 니트'), fabric: '레이온 60% · 나일론 40%', fit: '몸에 적당히 붙는 슬림핏', desc: '코트 안에 받쳐 입기 좋은 얇은 리브 터틀넥. 목이 답답하지 않도록 넥 높이를 낮췄습니다.' },
]);

export const REVIEWS = Object.freeze([
  { product: 'wide-slacks', name: '김*은', size: 'M · 163cm', rating: 5, text: '허리 뒷밴딩이라 하루 종일 편해요. 기장도 운동화·로퍼 둘 다 예뻐요. 색 하나 더 샀습니다.' },
  { product: 'cable-cardigan', name: '이*지', size: 'FREE · 158cm', rating: 5, text: '도톰한데 무겁지 않아요. 오트밀 색이 사진보다 실물이 더 따뜻해 보여요.' },
  { product: 'wool-coat', name: '박*린', size: 'S · 165cm', rating: 5, text: '어깨가 자연스럽게 떨어져서 니트 위에 입어도 끼지 않아요. 가격 대비 원단이 좋습니다.' },
  { product: 'rib-turtleneck', name: '최*아', size: 'FREE · 170cm', rating: 4, text: '목이 덜 답답한 높이라 좋아요. 얇아서 코트 안에 딱입니다.' },
]);

export const NOTICES = Object.freeze([
  ['2026.10.27', '겨울 아우터 사전 예약 안내 (11/3 순차 출고)'],
  ['2026.10.20', '회원 등급별 쿠폰이 지급되었습니다'],
  ['2026.10.02', '추석 연휴 배송 일정 안내'],
]);

export const SIZE_GUIDE = Object.freeze({
  head: ['사이즈', '어깨', '가슴', '총장', '소매'],
  rows: [['S', '44', '54', '108', '59'], ['M', '46', '57', '110', '60'], ['L', '48', '60', '112', '61']],
});
