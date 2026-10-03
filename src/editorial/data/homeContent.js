// 홈 화면 문구·가격·FAQ를 한곳에서 관리합니다.
// 문구를 바꿀 때는 이 파일만 수정하면 됩니다.

const preview = (id) => `/agency-assets/sites/${id}.webp`;

// 히어로 3D 공간에 떠 있는 샘플 화면 (모바일은 앞의 9개만 사용)
export const HERO_SCREENS = Object.freeze([
  'hangyeol-law', 'ondo-coffee', 'flowdeck', 'orda-dental',
  'stay-yeobaek', 'movelab', 'hangyeol-law-practice', 'ondo-coffee-subscribe',
  'orda-dental-booking', 'stay-yeobaek-room', 'movelab-schedule', 'flowdeck-pricing',
].map(preview));

export const HERO_AUDIENCES = Object.freeze(['개인', '스타트업', '기업·기관', '비영리 단체']);

export const CAPABILITIES = Object.freeze([
  '브랜드 웹사이트', '랜딩페이지', '기업 홈페이지', '쇼핑몰', '예약 시스템',
  '관리자 페이지', '반응형 웹', '검색 최적화', '웹 접근성', '유지보수',
]);

export const SERVICES = Object.freeze([
  {
    id: 'brand',
    title: '브랜드·기업 웹사이트',
    text: '회사 소개부터 서비스, 채용, 소식까지. 브랜드가 한눈에 읽히는 정보 구조를 설계합니다.',
    items: ['정보 구조 설계', '맞춤 UI 디자인', '반응형 개발', '관리자 페이지'],
    period: '4~8주',
    image: preview('hangyeol-law'),
  },
  {
    id: 'landing',
    title: '랜딩페이지·캠페인',
    text: '하나의 목적에 집중하는 페이지. 방문자가 망설임 없이 다음 행동으로 이어지게 만듭니다.',
    items: ['전환 흐름 설계', '카피 구성', '인터랙션', '문의·신청 폼'],
    period: '2~4주',
    image: preview('flowdeck'),
  },
  {
    id: 'feature',
    title: '쇼핑몰·예약·기능 개발',
    text: '결제, 예약, 회원, 외부 API 연동처럼 실제로 작동해야 하는 기능을 직접 개발합니다.',
    items: ['예약·결제 연동', '회원·권한', 'API 연동', '데이터 관리'],
    period: '6~12주',
    image: preview('stay-yeobaek-room'),
  },
  {
    id: 'care',
    title: '운영·유지보수',
    text: '공개 이후가 시작입니다. 콘텐츠 업데이트, 속도·보안 점검, 기능 추가를 이어갑니다.',
    items: ['콘텐츠 업데이트', '속도·보안 점검', '기능 추가', '월간 리포트'],
    period: '월 단위',
    image: preview('orda-dental'),
  },
]);

export const AUDIENCES = Object.freeze([
  { title: '개인·프리랜서', text: '포트폴리오, 개인 브랜드, 강의·작업 소개 페이지', need: '빠르고 가볍게' },
  { title: '스타트업', text: '서비스 소개, 사전 신청 랜딩, 투자·채용용 브랜드 사이트', need: '빠른 검증과 반복' },
  { title: '기업·기관', text: '기업 홈페이지, 브랜드 사이트, 다중 콘텐츠와 관리자 페이지', need: '신뢰와 확장성' },
  { title: '비영리·봉사단체', text: '활동 소개, 후원·봉사자 모집, 소식 게시판', need: '쉬운 운영' },
]);

export const QUALITY_SPECS = Object.freeze([
  ['반응형 검수', '360 · 390 · 768 · 1440px 화면에서 직접 확인'],
  ['웹 접근성', 'WCAG 2.1 AA 기준 키보드·명도·대체텍스트 점검'],
  ['로딩 속도', '주요 화면 LCP 2.5초 이내를 목표로 이미지·코드 최적화'],
  ['검색 노출', '메타 정보, 공유 이미지, 사이트맵, 구조화 데이터 설정'],
  ['관리 편의', '필요 시 직접 수정 가능한 관리자 페이지 제공'],
  ['인계', '소스, 계정, 운영 가이드 문서를 함께 전달'],
]);

export const SPEC_LAYERS = Object.freeze(['구조', '디자인', '코드', '데이터']);

export const PROCESS_STEPS = Object.freeze([
  { number: '01', title: '방향과 범위', text: '목표, 콘텐츠, 필요한 기능을 정리하고 제작 범위와 일정을 합의합니다.', output: '요구사항 정리서 · 일정표', period: '1주' },
  { number: '02', title: '구조와 디자인', text: '정보의 순서를 잡고 PC와 모바일 화면을 함께 설계합니다.', output: '사이트맵 · 화면 시안', period: '1~3주' },
  { number: '03', title: '개발과 검수', text: '실제 콘텐츠를 연결하고 기능, 속도, 접근성을 기기별로 확인합니다.', output: '테스트 사이트 · 검수 리포트', period: '2~6주' },
  { number: '04', title: '공개와 운영', text: '도메인 연결과 공개를 진행하고, 관리 방법과 운영 가이드를 전달합니다.', output: '운영 가이드 · 유지보수 제안', period: '공개 후 지속' },
]);

// 가격은 시작가 기준의 대략적인 구간입니다. 실제 비용은 상담 후 범위에 따라 확정됩니다.
export const PRICING_PLANS = Object.freeze([
  {
    name: '라이트',
    for: '개인 · 소상공인',
    price: '27',
    period: '1~2주',
    items: ['1페이지 랜딩', '반응형 디자인', '문의 폼 연결', '기본 검색 최적화'],
  },
  {
    name: '스타터',
    for: '개인 · 소규모 · 비영리',
    price: '54',
    period: '2~3주',
    items: ['3~5페이지 구성', '맞춤 디자인', '문의 폼·지도 연결', '기본 검색 최적화'],
  },
  {
    name: '스탠다드',
    for: '스타트업 · 브랜드 · 기업',
    price: '90',
    period: '4~6주',
    items: ['5~10페이지 맞춤 디자인', '관리자 페이지(게시판)', '기본 인터랙션·모션', '웹 접근성 점검'],
    featured: true,
  },
  {
    name: '프리미엄',
    for: '기능 개발 · 플랫폼',
    price: '210',
    period: '6주~',
    items: ['예약·결제·회원 기능', '외부 API·데이터 연동', '3D·고급 인터랙션', '관리자·방문 통계·확장형 설계'],
  },
]);

export const PRICING_NOTES = Object.freeze([
  '유지보수는 월 10만원부터이며 작업량에 따라 조정합니다.',
  '표시 금액은 부가세 별도 시작가입니다. 최종 비용은 상담으로 범위를 정한 뒤 확정합니다.',
]);

export const FAQS = Object.freeze([
  ['제작 기간은 얼마나 걸리나요?', '랜딩페이지는 보통 2~4주, 기업·브랜드 사이트는 4~8주, 예약·결제 같은 기능 개발이 포함되면 8주 이상 걸립니다. 자료 준비 상황에 따라 달라집니다.'],
  ['아직 원하는 게 정리되지 않았는데 상담해도 되나요?', '네. 첫 상담에서 목적과 방문자를 함께 정리하는 것부터 시작합니다. 참고하고 싶은 사이트가 있다면 알려 주시면 좋습니다.'],
  ['디자인 수정은 몇 번까지 가능한가요?', '시안 단계에서 2회의 수정을 기본으로 포함합니다. 범위를 벗어나는 큰 변경은 미리 협의한 뒤 진행합니다.'],
  ['도메인과 호스팅도 도와주시나요?', '도메인 구매, 호스팅 선택, 연결과 보안 인증서(HTTPS) 설정까지 함께 진행합니다. 계정은 고객 명의로 만듭니다.'],
  ['공개 후에 직접 내용을 수정할 수 있나요?', '필요하면 공지, 게시글, 이미지 등을 직접 바꿀 수 있는 관리자 페이지를 만들어 드리고 사용법을 안내합니다.'],
  ['기존 사이트 리뉴얼도 가능한가요?', '가능합니다. 현재 사이트의 구조와 콘텐츠를 먼저 점검하고, 살릴 부분과 바꿀 부분을 나눠 제안합니다.'],
  ['비용은 어떻게 나눠서 결제하나요?', '일반적으로 계약 시 50%, 공개 전 50%로 나눠 진행하며 프로젝트 규모에 따라 협의할 수 있습니다.'],
]);
