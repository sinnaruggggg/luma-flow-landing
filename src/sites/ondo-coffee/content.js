// 온도 커피로스터스 (가상 업체) — 모든 문구·사진은 이 파일에서 수정합니다.
// 브리프: 스페셜티 로스터리 / 대상 = 집에서 커피를 내리는 2030 / 목표 = 정기구독 / 무드 = 감각적 에디토리얼(잡지) / 형식 = 랜딩

export const BRAND = Object.freeze({
  name: '온도 커피로스터스',
  english: 'ONDO Coffee Roasters',
  issue: 'Vol. 27 · Autumn Issue',
  since: 'Roasted in Seongsu since 2019',
  address: '서울 성동구 ○○길 00, 1층',
  hours: '매일 10:00 – 20:00 (월요일 로스팅 휴무)',
  phone: '02-000-0000',
});

// 문자열 = 보유 사진 키, { file, alt } = public/sites/ondo-coffee/ 의 AI 생성 이미지
export const PHOTOS = Object.freeze({
  roaster: { file: 'hero-roaster.webp', alt: '냉각 트레이에서 식고 있는 갓 볶은 원두와 로스팅 기계' },
  bags: { file: 'bean-bags.webp', alt: '색이 다른 라벨을 붙인 크라프트 원두 봉투 세 개' },
  drip: { file: 'hand-drip.webp', alt: '구리 주전자로 핸드드립 커피를 내리는 모습' },
  cupping: { file: 'cupping.webp', alt: '커핑 테이블 위의 작은 유리컵들' },
  storefront: { file: 'storefront.webp', alt: '골목 모퉁이의 로스터리 카페 외관' },
  beans: 'food/lsmu0rUhUOk',
  window: 'food/hi3SkqB9rMI',
  latte: 'food/ZLqxSzvVr7I',
  seats: 'food/ekDdIRQbrwE',
  brick: 'food/gltUMFm_i4Q',
  plants: 'food/j6ERcKXdlXw',
  croissant: 'food/t7jTtJ9iyUE',
  bread: 'food/1k7TnX5GAww',
});
// 사진 출처 표기에는 보유 사진(문자열 키)만 들어갑니다.
export const ALL_PHOTO_KEYS = Object.freeze(Object.values(PHOTOS).filter((value) => typeof value === 'string'));

export const CONTENTS = Object.freeze([
  ['beans', '01', '이번 달의 원두'],
  ['finder', '02', '나에게 맞는 원두 찾기'],
  ['story', '03', '온도에 대하여'],
  ['subscribe', '04', '정기구독 만들기'],
  ['cafe', '05', '성수 로스터리 카페'],
]);

// 맛 지표는 1~5
export const BEANS = Object.freeze([
  { id: 'guji', name: '에티오피아 구지 함벨라', english: 'Ethiopia Guji Hambela', notes: ['자스민', '백도', '얼그레이'], process: '워시드', roast: 2, acidity: 5, sweetness: 4, body: 2, price: 18000, color: '#c9a36b', mood: '아침의 창가처럼 산뜻하게' },
  { id: 'huila', name: '콜롬비아 우일라', english: 'Colombia Huila', notes: ['밀크초콜릿', '캐러멜', '붉은 사과'], process: '워시드', roast: 3, acidity: 3, sweetness: 5, body: 3, price: 16000, color: '#a8663f', mood: '오후의 대화처럼 둥글게' },
  { id: 'dusk', name: '온도 블렌드 · 해질녘', english: 'ONDO Blend · Dusk', notes: ['다크초콜릿', '흑설탕', '구운 견과'], process: '블렌드', roast: 4, acidity: 1, sweetness: 4, body: 5, price: 14000, color: '#5b3824', mood: '저녁의 라떼처럼 진하게' },
]);

export const QUIZ = Object.freeze([
  { id: 'milk', question: '커피는 주로 어떻게 드세요?', options: [['black', '그대로, 블랙으로'], ['milk', '우유를 넣어서']] },
  { id: 'taste', question: '가장 끌리는 맛은?', options: [['fruit', '꽃과 과일처럼 산뜻한'], ['sweet', '캐러멜처럼 달콤한'], ['dark', '초콜릿처럼 진한']] },
]);

export const SIZES = Object.freeze([
  ['200', '200g', 1],
  ['400', '200g × 2', 2],
  ['500', '500g', 2.3],
]);
export const CADENCES = Object.freeze([['2', '2주마다'], ['4', '4주마다']]);
export const GRINDS = Object.freeze([['whole', '홀빈 (분쇄 안 함)'], ['drip', '핸드드립용'], ['espresso', '에스프레소용'], ['moka', '모카포트용']]);
export const SUBSCRIBE_DISCOUNT = 0.1;

export const STORY = Object.freeze({
  title: '온도는 숫자가 아니라 태도입니다.',
  body: [
    '같은 원두라도 볶는 날의 습도와 온도, 그 원두가 지나온 계절에 따라 맛이 달라집니다. 우리는 매주 월요일, 문을 닫고 그 차이를 맞추는 일에 하루를 씁니다.',
    '로스팅이 끝난 원두는 사흘 동안 쉬게 한 뒤 직접 컵에 담아 확인합니다. 기대한 맛이 나오지 않으면 그 배치는 판매하지 않습니다. 느리지만, 한 잔의 온도를 지키는 가장 확실한 방법이라고 믿습니다.',
    '정기구독 원두는 로스팅 후 48시간 안에 발송합니다. 봉투에는 볶은 날짜와 권장 추출 레시피를 적어 보냅니다.',
  ],
  quote: '“기대한 맛이 나오지 않으면, 그 배치는 판매하지 않습니다.”',
});
