// 스테이 여백 (가상 업체) — 모든 문구·사진·요금은 이 파일에서 수정합니다.
// 브리프: 프라이빗 스테이 / 대상 = 조용한 휴식을 원하는 30~40대 커플 / 목표 = 객실 예약 / 무드 = 럭셔리 다크 / 형식 = 기능형(날짜 범위 예약)

export const STAY = Object.freeze({
  name: '스테이 여백',
  english: 'STAY YEOBAEK',
  place: '경상남도 남해군 ○○면 바닷가',
  address: '경상남도 남해군 ○○면 ○○로 00',
  checkin: '15:00',
  checkout: '11:00',
  phone: '055-000-0000',
});

// 문자열 = 보유 사진 키, { file, alt } = public/sites/stay-yeobaek/ 의 AI 생성 이미지
export const PHOTOS = Object.freeze({
  hero: { file: 'hero-exterior.webp', alt: '블루아워의 바닷가 노출 콘크리트 스테이' },
  bath: { file: 'outdoor-bath.webp', alt: '밤바다를 바라보는 히노키 노천탕' },
  roomDark: { file: 'room-dark.webp', alt: '통창 너머 저녁 바다가 보이는 어두운 객실' },
  details: { file: 'details.webp', alt: '빛이 떨어지는 돌 세면대와 황동 수전' },
  breakfast: { file: 'breakfast.webp', alt: '원목 트레이에 차린 한식 조식' },
  haeon1: 'hospitality/oxeCZrodz78',
  haeon2: 'hospitality/qifUgNsrWmU',
  soop1: 'hospitality/T5pL6ciEn-I',
  soop2: 'hospitality/p3UWyaujtQo',
  dal1: 'hospitality/Id2IIl1jOB0',
  dal2: 'hospitality/R5v8Xtc0ecg',
});
// 사진 출처 표기에는 보유 사진(문자열 키)만 들어갑니다.
export const ALL_PHOTO_KEYS = Object.freeze(Object.values(PHOTOS).filter((value) => typeof value === 'string'));

export const NAV = Object.freeze([['', '여백'], ['rooms', '객실'], ['booking', '예약']]);

export const ROOMS = Object.freeze([
  {
    slug: 'haeon', name: '해온', english: 'HAEON', tagline: '바다를 품은 방',
    photos: ['roomDark', 'haeon1'], size: 42, base: 2, max: 3, weekday: 320000, weekend: 390000,
    description: '침대에 누우면 통창 가득 남해 바다가 들어옵니다. 해가 지면 테라스의 히노키 노천탕에 물을 받아 두세요. 파도 소리 말고는 아무것도 들리지 않습니다.',
    features: ['바다 전망 통창', '프라이빗 히노키 노천탕', '킹 사이즈 침대', '드립 커피 세트'],
  },
  {
    slug: 'soop', name: '숲결', english: 'SOOPGYEOL', tagline: '정원으로 열린 방',
    photos: ['soop1', 'soop2'], size: 36, base: 2, max: 2, weekday: 260000, weekend: 320000,
    description: '작은 대나무 정원을 향해 낮은 침대를 두었습니다. 아침이면 잎 사이로 들어온 빛이 방 안을 천천히 옮겨 다닙니다. 반신욕 욕조에서 하루를 마무리하세요.',
    features: ['정원 전망 좌식 창', '반신욕 욕조', '퀸 사이즈 침대', '다도 세트'],
  },
  {
    slug: 'dal', name: '달무리', english: 'DALMURI', tagline: '마당이 있는 복층',
    photos: ['dal1', 'dal2'], size: 58, base: 2, max: 4, weekday: 420000, weekend: 490000,
    description: '위층은 잠을 위한 곳, 아래층은 이야기를 위한 곳입니다. 개별 마당의 화로에 불을 지피면, 달이 뜨는 동안 저녁이 길어집니다.',
    features: ['복층 구조 · 최대 4인', '개별 마당과 화로', '퀸 침대 2개', '미니 주방'],
  },
]);

export const EXPERIENCES = Object.freeze([
  ['해 질 녘 산책', '체크인 때 그날 일몰 시간과 가장 조용한 산책길 지도를 드립니다.'],
  ['조식 바구니', '남해에서 난 제철 재료로 차린 한식 조식을 객실로 가져다드립니다.'],
  ['화로의 밤', '장작과 마시멜로, 담요를 담은 화로 세트를 준비해 드립니다.'],
]);

export const OPTIONS = Object.freeze([
  { id: 'breakfast', label: '조식 바구니', price: 25000, unit: 'person' },
  { id: 'fire', label: '화로 세트', price: 40000, unit: 'stay' },
  { id: 'late', label: '레이트 체크아웃 (13시)', price: 50000, unit: 'stay' },
]);

export const EXTRA_GUEST = 30000; // 기준 인원 초과 1인 1박

// 낮·밤 전환 (Site.jsx 의 TimeToggle). 첫 화면 문구가 시간에 따라 바뀝니다.
export const HERO_COPY = Object.freeze({
  night: ['머무는 동안,', '아무것도 하지', '않아도 되는 곳.'],
  day: ['아침 햇살이', '먼저 깨워 주는', '바다 앞의 방.'],
});

// "여백의 장면" 끌어서 넘기는 갤러리. [사진 키(PHOTOS), 설명]
export const SCENES = Object.freeze([
  ['hero', '해 질 녘, 블루아워의 스테이'],
  ['bath', '파도 소리를 듣는 노천탕'],
  ['roomDark', '통창 너머 저녁 바다'],
  ['details', '빛이 머무는 돌 세면대'],
  ['breakfast', '원목 트레이에 차린 아침'],
  ['soop1', '숲 쪽으로 열린 방'],
  ['dal2', '달빛이 드는 마당'],
]);
