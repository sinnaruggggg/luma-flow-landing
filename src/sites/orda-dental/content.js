// 오르다치과 (가상 업체) — 모든 문구·사진은 이 파일에서 수정합니다.
// 브리프: 치과 / 대상 = 치과가 무서운 직장인·가족 / 목표 = 온라인 진료 예약 / 무드 = 차분한 미니멀 + 신뢰 / 형식 = 기능형(예약 흐름)

export const CLINIC = Object.freeze({
  name: '오르다치과',
  english: 'ORDA DENTAL CLINIC',
  phone: '031-000-0000',
  address: '경기도 성남시 분당구 ○○로 00, 오르다빌딩 3층',
  subway: '신분당선 ○○역 2번 출구 도보 2분',
  parking: '건물 지하 주차 2시간 무료',
});

// 요일별 진료 시간 (0=일요일)
export const HOURS = Object.freeze([
  { day: 0, label: '일요일', time: '휴진', closed: true },
  { day: 1, label: '월요일', time: '09:30 – 18:30' },
  { day: 2, label: '화요일', time: '09:30 – 18:30' },
  { day: 3, label: '수요일', time: '09:30 – 18:30' },
  { day: 4, label: '목요일', time: '09:30 – 21:00', note: '야간 진료' },
  { day: 5, label: '금요일', time: '09:30 – 18:30' },
  { day: 6, label: '토요일', time: '09:30 – 14:00', note: '점심시간 없음' },
]);

// 문자열 = 보유 사진 키, { file, alt } = public/sites/orda-dental/ 의 AI 생성 이미지
export const PHOTOS = Object.freeze({
  hero: { file: 'hero-lobby.webp', alt: '햇살이 드는 치과 접수 데스크와 대기 공간' },
  consult: { file: 'consult-room.webp', alt: '치아 모형과 엑스레이 화면이 있는 상담실' },
  sterilization: { file: 'sterilization.webp', alt: '기구가 파우치에 담겨 정리된 멸균실' },
  careHands: { file: 'care-hands.webp', alt: '치아 모형을 들고 설명하는 손' },
  window: 'medical/e7MJLM5VGjY',
  chair: 'medical/44jaETSVX2I',
  room: 'medical/Fdku_oMrDvk',
  waiting: 'medical/2d3cHa8RMSY',
  tools: 'medical/8YUH8Jne5S0',
  mirror: 'medical/ux18C551ghI',
  unit: 'medical/yJsMOVwazRU',
});
// 사진 출처 표기에는 보유 사진(문자열 키)만 들어갑니다.
export const ALL_PHOTO_KEYS = Object.freeze(Object.values(PHOTOS).filter((value) => typeof value === 'string'));

export const NAV = Object.freeze([['care', '진료 안내'], ['doctors', '의료진'], ['guide', '이용 안내'], ['booking', '진료 예약']]);

export const TREATMENTS = Object.freeze([
  {
    slug: 'checkup', title: '검진·스케일링', short: '6개월마다 가볍게', photo: 'mirror', minutes: 40,
    intro: '문제가 생기기 전에 찾는 것이 가장 편한 치료입니다. 구강 검진과 스케일링을 한 번에 진행하고, 사진으로 현재 상태를 함께 확인합니다.',
    for: ['마지막 검진이 1년 이상 지났다면', '잇몸에서 피가 자주 난다면', '입 냄새가 신경 쓰인다면'],
    steps: ['구강 사진·필요 시 엑스레이 촬영', '의사 검진과 설명', '스케일링', '관리 방법 안내'],
    note: '만 19세 이상은 연 1회 스케일링에 건강보험이 적용됩니다.',
  },
  {
    slug: 'cavity', title: '충치 치료', short: '작을 때 작게', photo: 'tools', minutes: 30,
    intro: '충치는 초기에 치료할수록 치아를 덜 깎습니다. 충치의 깊이와 위치를 사진으로 보여드리고, 재료별 장단점을 설명한 뒤 함께 결정합니다.',
    for: ['찬 물을 마실 때 시린 느낌이 있다면', '치아에 검은 점이나 구멍이 보인다면', '음식물이 자주 끼는 곳이 있다면'],
    steps: ['충치 범위 확인', '치료 방법·재료 설명', '마취 후 치료', '씹는 높이 조정'],
    note: '재료에 따라 건강보험 적용 여부가 다르며, 치료 전에 비용을 먼저 안내합니다.',
  },
  {
    slug: 'root', title: '신경 치료', short: '살릴 수 있는 치아라면', photo: 'consult', minutes: 60,
    intro: '깊은 충치나 금으로 통증이 심해졌다면 신경 치료로 치아를 살릴 수 있습니다. 통증을 줄이기 위해 충분히 마취하고, 회차마다 진행 상황을 설명합니다.',
    for: ['가만히 있어도 치아가 욱신거린다면', '뜨거운 음식에 통증이 오래 간다면', '잇몸이 붓고 고름이 난다면'],
    steps: ['엑스레이로 뿌리 상태 확인', '감염된 신경 제거·소독 (2~4회)', '뿌리 충전', '크라운으로 보호'],
    note: '신경 치료는 건강보험이 적용되며, 크라운 재료에 따라 비용이 달라집니다.',
  },
  {
    slug: 'implant', title: '임플란트', short: '급하지 않게, 정확하게', photo: 'unit', minutes: 60,
    intro: 'CT로 뼈의 양과 신경 위치를 확인한 뒤 계획을 세웁니다. 모든 경우에 임플란트가 답은 아니므로, 브릿지나 틀니와 비교해 설명드립니다.',
    for: ['치아를 뽑았거나 뽑아야 한다고 들었다면', '오래된 브릿지·틀니가 불편하다면', '씹을 때 한쪽만 쓰게 된다면'],
    steps: ['CT 촬영과 상담', '식립 수술', '뼈와 붙는 기간 (2~4개월)', '보철물 연결과 정기 점검'],
    note: '만 65세 이상은 평생 2개까지 건강보험이 적용됩니다.',
  },
  {
    slug: 'ortho', title: '교정', short: '보이는 것보다 편하게', photo: 'careHands', minutes: 50,
    intro: '가지런함뿐 아니라 잘 씹히는지를 함께 봅니다. 투명 교정과 장치 교정의 차이를 실제 사례 모형으로 보여드리고 생활에 맞는 방법을 권합니다.',
    for: ['치아가 겹치거나 틈이 있다면', '앞니로 음식을 끊기 어렵다면', '턱이 자주 아프거나 소리가 난다면'],
    steps: ['정밀 검사 (사진·모형·엑스레이)', '진단과 치료 계획 설명', '장치 부착 또는 투명 장치 제작', '월 1회 조정과 유지 관리'],
    note: '치료 기간과 비용은 정밀 검사 후 서면으로 안내합니다.',
  },
  {
    slug: 'kids', title: '소아 치과', short: '무섭지 않은 첫 치과', photo: 'waiting', minutes: 30,
    intro: '아이가 치과를 무서워하지 않도록 기구를 먼저 만져 보게 하고, 짧게 끊어서 진료합니다. 보호자에게는 양치 방법과 간식 습관을 함께 안내합니다.',
    for: ['첫 치과 검진을 앞두고 있다면', '영구치가 나기 시작했다면 (실란트)', '불소 도포가 필요하다면'],
    steps: ['치과와 친해지기', '검진과 불소 도포', '필요 시 실란트·충치 치료', '보호자 상담'],
    note: '만 18세 이하 첫째 큰어금니 실란트에는 건강보험이 적용됩니다.',
  },
]);

// 가상 인물입니다.
export const DOCTORS = Object.freeze([
  { name: '윤하람', role: '대표원장', field: '치과보존과', initial: '윤', words: '치료보다 설명이 먼저인 치과를 만들고 싶었습니다.', career: ['치과보존과 전문의', '前 대학병원 보존과 임상강사', '대한치과보존학회 정회원'] },
  { name: '서지안', role: '원장', field: '치과교정과', initial: '서', words: '웃을 때보다 씹을 때 더 편한 교정을 합니다.', career: ['치과교정과 전문의', '前 교정 전문 치과 진료원장', '대한치과교정학회 정회원'] },
  { name: '문태오', role: '원장', field: '구강악안면외과', initial: '문', words: '수술은 짧게, 계획은 길게 봅니다.', career: ['구강악안면외과 전문의', '前 대학병원 구강외과 전공의', '대한구강악안면임플란트학회 정회원'] },
]);

export const PROMISES = Object.freeze([
  ['화면으로 먼저 보여드립니다', '구강 사진과 엑스레이를 모니터로 함께 보며 지금 상태를 설명합니다.'],
  ['필요한 만큼만 치료합니다', '당장 필요한 치료와 지켜봐도 되는 치료를 나누어 안내합니다.'],
  ['비용은 치료 전에 말씀드립니다', '보험 적용 여부와 예상 비용을 먼저 알려드리고 동의 후 진행합니다.'],
]);
