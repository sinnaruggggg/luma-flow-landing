// 홈 비용 섹션 "견적 계산기 + 간단 질문 추천"의 기준값과 계산 함수.
// 금액은 가격표(라이트 27 / 스타터 54 / 스탠다드 90 / 프리미엄 150 만원부터)와 맞춘 대략값이며, 실제 견적은 상담 후 확정합니다.
// 금액·설명을 바꿀 때는 이 파일만 고치면 됩니다. (scripts/quote.test.mjs 가 가격표와 맞는지 확인)

// 가격 원칙: 기본 구성 가격 = 페이지·디자인 범위 + 포함 기능.
// 페이지·디자인 범위는 라이트 27 < 스타터 54 < 스탠다드 72(=90-18) < 프리미엄 102(=150-48) 순으로 커져야 합니다.
// 그래야 같은 기능을 골랐을 때 큰 구성이 항상 더 비쌉니다. (scripts/quote.test.mjs 가 확인)

// 모든 구성에 기본으로 들어가는 것 (계산기에 "기본 포함"으로 표시)
export const BASIC_INCLUDED = Object.freeze(['PC·모바일 반응형', '보안 연결(HTTPS)', '문의 폼', '지도·오시는 길', '카카오톡 상담 버튼', '검색 등록(네이버·구글)']);

export const BASES = Object.freeze([
  { id: 'landing', label: '랜딩 1페이지', price: 27, weeks: '1~2주', plan: '라이트', desc: '한 페이지에 핵심만 담아 문의로 연결해요.', forWho: '이벤트·신규 서비스·개인 브랜드', includes: [] },
  { id: 'intro', label: '소개형 3~5페이지', price: 54, weeks: '2~3주', plan: '스타터', desc: '소개·서비스·오시는 길·문의를 나눠 보여 줘요.', forWho: '카페·병원·학원·소규모 사업장', includes: [] },
  { id: 'brand', label: '기업·브랜드 5~10페이지', price: 90, weeks: '4~6주', plan: '스탠다드', desc: '브랜드 이야기, 소식·채용까지 담고 게시판으로 직접 관리해요.', forWho: '기업·스타트업·기관', includes: ['admin'] },
  { id: 'platform', label: '기능형 플랫폼', price: 150, weeks: '6주~', plan: '프리미엄', desc: '회원·관리자 기반의 서비스 구조를 만들어요. 예약·결제는 골라 더해요.', forWho: '예약 서비스·회원제·플랫폼', includes: ['admin', 'member', 'analytics'] },
]);

export const CATEGORIES = Object.freeze([
  { id: 'connect', label: '고객 연결' },
  { id: 'content', label: '콘텐츠 관리' },
  { id: 'sales', label: '매출·운영' },
  { id: 'growth', label: '마케팅·확장' },
]);

// icon 은 SitePreview/QuoteIcon 에서 그림으로 바꿉니다. week 는 늘어나는 제작 기간(주).
export const ADDONS = Object.freeze([
  { id: 'alert', cat: 'connect', icon: 'bell', label: '문의 알림 (카톡·문자)', desc: '문의가 오면 사장님 휴대폰으로 바로 알려 드려요. (발송비 별도)', price: 12 },
  { id: 'chat', cat: 'connect', icon: 'chat', label: '실시간 채팅 상담', desc: '사이트 구석의 채팅창으로 바로 대화해요.', price: 6 },
  { id: 'chatbot', cat: 'connect', icon: 'bot', label: 'AI 상담 챗봇', desc: '자주 묻는 질문에 24시간 자동으로 답해요.', price: 36, week: 1 },
  { id: 'admin', cat: 'content', icon: 'board', label: '게시판·공지·소식', desc: '공지·소식·블로그 글을 직접 올리고 고쳐요.', price: 18 },
  { id: 'gallery', cat: 'content', icon: 'image', label: '갤러리·포트폴리오', desc: '작업 사진·시공 사례를 직접 올려요.', price: 12 },
  { id: 'review', cat: 'content', icon: 'star', label: '후기·리뷰', desc: '고객 후기와 별점을 보여 줘요.', price: 12 },
  { id: 'popup', cat: 'content', icon: 'popup', label: '팝업·배너 관리', desc: '휴무 안내·이벤트 팝업을 직접 켜고 꺼요.', price: 9 },
  { id: 'recruit', cat: 'content', icon: 'person', label: '채용·지원서 접수', desc: '채용 공고를 올리고 지원서를 받아요.', price: 18 },
  { id: 'booking', cat: 'sales', icon: 'calendar', label: '예약·신청', desc: '고객이 날짜와 시간을 골라 예약해요.', price: 24, week: 1 },
  { id: 'payment', cat: 'sales', icon: 'card', label: '온라인 결제', desc: '카드·간편결제로 바로 결제해요. (PG 계약 필요)', price: 30, week: 1 },
  { id: 'shop', cat: 'sales', icon: 'cart', label: '쇼핑몰', desc: '상품 등록, 장바구니, 주문·배송 관리까지.', price: 60, week: 2 },
  { id: 'subscription', cat: 'sales', icon: 'repeat', label: '정기결제·구독', desc: '구독 상품·회원권을 매달 자동 결제해요.', price: 48, week: 1 },
  { id: 'member', cat: 'sales', icon: 'user', label: '회원·로그인', desc: '회원가입, 마이페이지, 회원 전용 글.', price: 24, week: 1 },
  { id: 'social', cat: 'sales', icon: 'key', label: '카카오·네이버 간편 로그인', desc: '아이디 없이 소셜 계정으로 가입해요.', price: 12 },
  { id: 'coupon', cat: 'sales', icon: 'ticket', label: '쿠폰·포인트', desc: '할인 쿠폰과 적립금을 줘요.', price: 24 },
  { id: 'app', cat: 'growth', icon: 'phone', label: '앱으로 만들기', desc: '안드로이드 앱 + 푸시 알림, 스토어 등록까지 도와드려요.', price: 48, week: 2 },
  { id: 'motion', cat: 'growth', icon: 'spark', label: '3D·고급 인터랙션', desc: '이 사이트 첫 화면처럼 움직이는 연출.', price: 24 },
  { id: 'i18n', cat: 'growth', icon: 'globe', label: '다국어', desc: '영문 등 다른 언어 버전과 전환 버튼.', price: 18 },
  { id: 'analytics', cat: 'growth', icon: 'chart', label: '방문 통계', desc: '구글·네이버 애널리틱스로 방문자를 분석해요.', price: 6 },
  { id: 'instagram', cat: 'growth', icon: 'camera', label: '인스타그램 피드 연동', desc: '인스타 게시물이 사이트에 자동으로 보여요.', price: 9 },
  { id: 'newsletter', cat: 'growth', icon: 'mail', label: '뉴스레터·소식 구독', desc: '이메일 구독을 받고 소식을 보내요.', price: 12 },
  { id: 'content', cat: 'growth', icon: 'pen', label: '문구·사진 정리 도움', desc: '소개 글을 다듬고 사진을 골라 보정해요.', price: 12 },
  { id: 'migrate', cat: 'growth', icon: 'move', label: '기존 사이트 이전', desc: '옛 사이트의 글·사진을 옮겨 와요.', price: 12 },
  { id: 'logo', cat: 'growth', icon: 'logo', label: '로고·브랜드 디자인', desc: '로고와 대표 색을 함께 정해요.', price: 24 },
]);

// 함께 있어야 하는 기능 (쇼핑몰을 고르면 결제도 자동 선택 등)
export const REQUIRES = Object.freeze({ shop: ['payment'], subscription: ['payment'], coupon: ['member'], social: ['member'] });

// 금액을 바로 정하기 어려운 것: 고르면 상담 문의 내용에만 붙습니다.
export const QUOTE_EXTRAS = Object.freeze(['사진 촬영', '영상 제작', '웹 접근성 인증(공공기관)', '외부 시스템 연동', '도메인 구매 대행']);

export const BUDGET_BUCKETS = Object.freeze([[50, '50만원 이하'], [100, '50~100만원'], [200, '100~200만원'], [300, '200~300만원'], [Infinity, '300만원 이상']]);

const round5 = (value) => Math.round(value / 5) * 5;

// 기능 선택/해제. 필요한 기능은 함께 켜고, 그 기능을 끄면 그걸 필요로 하던 기능도 함께 끕니다.
export function toggleAddon(picked, id) {
  if (picked.includes(id)) {
    const dependents = Object.entries(REQUIRES).filter(([, needs]) => needs.includes(id)).map(([key]) => key);
    return picked.filter((item) => item !== id && !dependents.includes(item));
  }
  return [...new Set([...picked, id, ...(REQUIRES[id] ?? [])])];
}

export function estimate(baseId, picked) {
  const base = BASES.find((item) => item.id === baseId) ?? BASES[0];
  const lines = ADDONS.filter((addon) => picked.includes(addon.id)).map((addon) => ({ ...addon, included: base.includes.includes(addon.id) }));
  const min = base.price + lines.reduce((sum, line) => sum + (line.included ? 0 : line.price), 0);
  const extraWeeks = lines.reduce((sum, line) => sum + (line.included ? 0 : line.week ?? 0), 0);
  return { base, lines, min, max: round5(min * 1.3), weeks: extraWeeks ? `${base.weeks} + 약 ${extraWeeks}주` : base.weeks };
}

export function budgetLabel(min, max) {
  return BUDGET_BUCKETS.find(([limit]) => (min + max) / 2 <= limit)[1];
}

// ---------------------------------------------------------------------------
// 간단 질문 → 추천 구성 3개
// ---------------------------------------------------------------------------
export const QUESTIONS = Object.freeze([
  { id: 'industry', title: '어떤 일을 하시나요?', type: 'one', options: [
    ['food', '카페·음식점'], ['medical', '병원·의료'], ['education', '학원·교육'], ['beauty', '뷰티·헬스'],
    ['brand', '기업·전문직'], ['retail', '쇼핑몰·브랜드'], ['it', 'IT·스타트업'], ['hospitality', '숙소·여행'],
    ['nonprofit', '비영리·단체'], ['other', '그 외'],
  ] },
  { id: 'shape', title: '어떤 사이트를 만들고 싶으세요?', type: 'one', options: [
    ['onepage', '한 페이지 소개', '이벤트·신규 서비스 알리기'],
    ['homepage', '가게·회사 홈페이지', '소개·서비스·오시는 길'],
    ['booking', '예약 받는 사이트', '날짜·시간 골라 예약'],
    ['shop', '물건 파는 쇼핑몰', '상품·장바구니·결제'],
    ['service', '회원제 서비스', '로그인·구독·마이페이지'],
  ] },
  { id: 'budget', title: '생각하시는 예산은요?', type: 'one', options: [
    ['50', '50만원 이하'], ['100', '50~100만원'], ['200', '100~200만원'], ['300', '200~300만원'], ['999', '300만원 이상'], ['0', '아직 모르겠어요'],
  ] },
  { id: 'needs', title: '꼭 필요한 것이 있다면 골라 주세요.', hint: '여러 개 선택 · 없으면 건너뛰기', type: 'many', options: [
    ['admin', '글·사진을 직접 올리고 싶어요'], ['booking', '예약을 받아야 해요'], ['payment', '사이트에서 결제가 돼야 해요'],
    ['app', '앱도 있었으면 해요'], ['i18n', '외국인 고객이 있어요'], ['content', '글·사진이 아직 준비 안 됐어요'],
    ['migrate', '지금 쓰는 사이트가 있어요'], ['alert', '문의를 휴대폰으로 바로 받고 싶어요'],
  ] },
  { id: 'timing', title: '언제쯤 공개하고 싶으세요?', type: 'one', options: [
    ['soon', '한 달 안에'], ['normal', '2~3개월 안에'], ['flexible', '여유 있어요'],
  ] },
]);

// 작은 쇼핑몰은 소개형 + 쇼핑몰·결제 기능으로, 회원제 서비스는 기능형 플랫폼으로 시작합니다.
const SHAPE_BASE = { onepage: 'landing', homepage: 'intro', booking: 'intro', shop: 'intro', service: 'platform' };
const SHAPE_ADDONS = { onepage: [], homepage: [], booking: ['booking'], shop: ['shop'], service: ['member', 'subscription'] };
// 업종별로 있으면 좋은 기능 (추천형에 포함)
const INDUSTRY_ADDONS = {
  food: ['gallery', 'instagram', 'popup'], medical: ['booking', 'review', 'popup'], education: ['admin', 'booking', 'review'],
  beauty: ['booking', 'gallery', 'review', 'instagram'], brand: ['admin', 'recruit'], retail: ['review', 'coupon', 'instagram'],
  it: ['analytics', 'newsletter', 'motion'], hospitality: ['booking', 'gallery', 'i18n', 'review'], nonprofit: ['admin', 'gallery', 'newsletter'], other: ['gallery', 'review'],
};
// 확장형에 더 얹는 성장 기능
const GROWTH_ADDONS = ['analytics', 'app', 'motion', 'alert'];
const BASE_ORDER = BASES.map((base) => base.id);
const SAMPLE_INDUSTRY = { beauty: 'other', nonprofit: 'education' };

const withRequirements = (ids) => ids.reduce((list, id) => (list.includes(id) ? list : toggleAddon(list, id)), []);

export function recommend(answers) {
  const shape = answers.shape || 'homepage';
  const needs = answers.needs ?? [];
  const budgetMax = Number(answers.budget) || 0; // 0 = 모름
  let baseId = SHAPE_BASE[shape];
  // 글을 직접 올리면서 소개형 이상이 필요한 업종은 한 단계 위 구성을 추천
  if (shape === 'homepage' && ['brand', 'it'].includes(answers.industry)) baseId = 'brand';
  const must = withRequirements([...SHAPE_ADDONS[shape], ...needs]);
  const nice = withRequirements([...must, ...(INDUSTRY_ADDONS[answers.industry] ?? [])]);
  const grow = withRequirements([...nice, ...GROWTH_ADDONS]);
  const plans = [
    { key: 'value', title: '가성비형', tagline: '꼭 필요한 것만 담아 부담 없이 시작', baseId, picked: must },
    { key: 'best', title: '추천형', tagline: '업종에 맞는 기능까지 갖춘 균형 잡힌 구성', baseId, picked: nice },
    { key: 'grow', title: '확장형', tagline: '방문자 분석·앱까지 키워 가는 구성', baseId: BASE_ORDER[Math.min(BASE_ORDER.length - 1, BASE_ORDER.indexOf(baseId) + (baseId === 'landing' ? 1 : 0))], picked: grow },
  ];
  return plans.map((plan) => {
    const result = estimate(plan.baseId, plan.picked);
    return { ...plan, result, fitsBudget: budgetMax ? result.min <= budgetMax : null, rush: answers.timing === 'soon' && /6주|\+ 약 [3-9]주/.test(result.weeks) };
  }).map((plan, index, list) => ({ ...plan, recommended: budgetMax && !list[1].fitsBudget ? index === 0 : index === 1 }));
}

// 추천 결과 옆에 보여 줄 비슷한 업종 시안의 업종 값 (projects.js 의 industry)
export function sampleIndustry(industry) {
  return SAMPLE_INDUSTRY[industry] ?? industry;
}
