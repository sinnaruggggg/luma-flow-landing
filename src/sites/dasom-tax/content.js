// 다솜세무회계 (가상 업체) — 모든 문구·요금·서류 목록은 이 파일에서 수정합니다.
// 브리프: 세무사무소 / 대상 = 개인사업자·소규모 법인 대표 / 목표 = 상담 신청 / 무드 = 따뜻한 코퍼레이트 / 형식 = 홈페이지 5페이지

export const OFFICE = Object.freeze({
  name: '다솜세무회계',
  english: 'DASOM TAX & ACCOUNTING',
  phone: '02-000-0000',
  address: '서울특별시 강서구 ○○로 00, 5층',
  hours: '평일 09:00 – 18:00 · 신고 기간 토요일 상담',
});

// GPT 이미지가 public/sites/dasom-tax/ 에 들어오면 파일명을 추가합니다.
export const READY_IMAGES = Object.freeze([]);

export const PHOTOS = Object.freeze({
  hero: { file: 'hero-desk.webp', alt: '계산기와 영수증, 노트북이 놓인 밝은 책상', fallback: 'brand/hLM702Wwj8I' },
  consult: { file: 'consult.webp', alt: '서류를 가리키며 설명하는 손과 찻잔', fallback: 'brand/ysoj_iZxfd0' },
  binders: { file: 'binders.webp', alt: '색깔별로 정리된 서류 바인더', fallback: 'brand/LyczIDJRulI' },
  desk: 'brand/r3iAqHb7JWs',
});
export const ALL_PHOTO_KEYS = Object.freeze(Object.values(PHOTOS).map((value) => (typeof value === 'string' ? value : value.fallback)));

export const NAV = Object.freeze([['services', '업무 안내'], ['checklist', '서류 체크리스트'], ['fees', '수수료'], ['contact', '상담 신청']]);

// 주요 신고 기한 (월, 일). 원천세는 매월 10일.
export const DEADLINES = Object.freeze([
  { month: 1, day: 25, name: '부가가치세 확정신고', who: '개인·법인 (2기)' },
  { month: 3, day: 31, name: '법인세 신고', who: '12월 결산 법인' },
  { month: 4, day: 25, name: '부가가치세 예정신고', who: '법인 (1기)' },
  { month: 5, day: 31, name: '종합소득세 신고', who: '개인사업자·프리랜서' },
  { month: 7, day: 25, name: '부가가치세 확정신고', who: '개인·법인 (1기)' },
  { month: 10, day: 25, name: '부가가치세 예정신고', who: '법인 (2기)' },
  { monthly: true, day: 10, name: '원천세 신고·납부', who: '직원을 둔 사업자' },
]);

export const SERVICES = Object.freeze([
  { id: 'bookkeeping', title: '기장 대리', text: '매달 장부를 정리하고 부가세·원천세 신고를 챙깁니다. 대표님은 영수증만 보내 주세요.', points: ['월별 손익 리포트', '신고 일정 알림', '카카오톡 영수증 전송'] },
  { id: 'filing', title: '신고 대행', text: '종합소득세, 부가가치세, 법인세 신고를 기한에 맞춰 정확하게 처리합니다.', points: ['경비 누락 점검', '공제·감면 검토', '신고 결과 설명'] },
  { id: 'saving', title: '절세 상담', text: '사업 구조, 차량·인건비 처리, 개인사업자와 법인의 차이까지 숫자로 비교해 드립니다.', points: ['법인 전환 시뮬레이션', '4대보험 검토', '연말 절세 점검'] },
  { id: 'inherit', title: '상속·증여', text: '재산 평가부터 신고까지, 가족 간 협의에 필요한 자료를 함께 준비합니다.', points: ['재산 평가', '사전 증여 설계', '신고 대행'] },
  { id: 'startup', title: '창업 지원', text: '사업자 등록, 업종 선택, 간이·일반과세자 판단까지 창업 첫 단계를 돕습니다.', points: ['사업자 등록', '과세 유형 상담', '초기 장부 세팅'] },
]);

export const CHECKLISTS = Object.freeze({
  income: { label: '종합소득세', items: ['신분증 사본', '사업자등록증', '카드·현금영수증 사용 내역', '세금계산서 발행·수취 내역', '인건비 지급 내역', '4대보험 납부 내역', '임차료 계약서', '연금저축·보험료 납입 증명'] },
  vat: { label: '부가가치세', items: ['매출 세금계산서', '매입 세금계산서', '신용카드 매출 내역', '현금영수증 매출 내역', '사업용 카드 사용 내역', '수출 실적 자료(해당 시)'] },
  startup: { label: '창업·사업자 등록', items: ['신분증', '임대차 계약서', '업종별 인허가증(해당 시)', '동업계약서(공동사업 시)', '자금 출처 메모'] },
});

export const FEES = Object.freeze([
  ['개인 · 연 매출 1억 원 미만', '월 10만원~', '간편장부 대상, 부가세 신고 포함'],
  ['개인 · 연 매출 1억 ~ 5억 원', '월 15만원~', '복식부기, 원천세 신고 포함'],
  ['개인 · 연 매출 5억 원 이상', '월 25만원~', '성실신고 대상 검토 포함'],
  ['법인 · 설립 1년 이내', '월 20만원~', '법인 세팅, 월별 리포트'],
  ['법인 · 일반', '월 30만원~', '결산, 법인세 신고 포함'],
]);

export const STEPS = Object.freeze([
  ['상담 신청', '온라인이나 전화로 상황을 알려 주세요.'],
  ['무료 진단', '지난 신고 내역을 보고 개선점을 찾아 드립니다.'],
  ['계약 · 자료 연결', '홈택스 수임 동의와 카드 연동을 도와드립니다.'],
  ['매달 관리', '월별 리포트와 신고 일정을 먼저 알려 드립니다.'],
]);
