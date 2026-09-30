export const TEMPLATE_CATEGORIES = [
  {
    id: "all",
    label: "전체",
    description: "모든 템플릿을 한 번에 비교합니다.",
  },
  {
    id: "business",
    label: "기업/서비스형",
    description: "회사 소개, SaaS, 상담 전환에 적합합니다.",
  },
  {
    id: "premium",
    label: "프리미엄/브랜드형",
    description: "고급 브랜드, 제품 갤러리, 예약 상담에 적합합니다.",
  },
  {
    id: "local-booking",
    label: "감성/예약형",
    description: "카페, 클리닉, 공간, 체험 예약에 적합합니다.",
  },
  {
    id: "event",
    label: "이벤트/전환형",
    description: "행사, 커뮤니티, 신청/가입 전환에 적합합니다.",
  },
  {
    id: "commerce",
    label: "쇼핑/커머스형",
    description: "상품 판매, 룩북, 장바구니 흐름에 적합합니다.",
  },
];

const DEFAULT_TEMPLATE_META = {
  displayName: "맞춤형 템플릿",
  category: "business",
  recommendedFor: "업종별 기본 페이지가 필요한 고객",
  moodTags: ["정돈된", "실용적인"],
  goalTags: ["소개", "문의"],
  tier: "standard",
  selectionCopy: "기본 구조가 준비된 템플릿입니다. 업종과 콘텐츠에 맞춰 빠르게 조정할 수 있습니다.",
};

export const TEMPLATE_META_BY_SITE_ID = {
  "pagecraft-business": {
    displayName: "기업 상담형",
    category: "business",
    recommendedFor: "B2B 컨설팅, 전문 서비스, 상담 전환형 사업",
    moodTags: ["정돈된", "신뢰감", "실용적인"],
    goalTags: ["서비스소개", "사례", "상담전환"],
    tier: "featured",
    selectionCopy: "서비스 소개, 사례, 문의 버튼이 자연스럽게 이어지는 기업형 구성입니다.",
  },
  "pagecraft-saas": {
    displayName: "SaaS 소개형",
    category: "business",
    recommendedFor: "IT 서비스, SaaS, 앱, 자동화 도구",
    moodTags: ["제품중심", "간결한", "명확한"],
    goalTags: ["기능", "요금", "데모문의"],
    tier: "featured",
    selectionCopy: "기능, 요금, 고객사례, 데모 문의를 빠르게 비교하는 서비스형 구성입니다.",
  },
  "wealth-app": {
    displayName: "핀테크 서비스형",
    category: "business",
    recommendedFor: "금융 앱, 자산관리, 멤버십 서비스",
    moodTags: ["프리미엄", "데이터중심"],
    goalTags: ["앱소개", "신뢰확보"],
    tier: "standard",
    selectionCopy: "수치와 신뢰 요소를 차분하게 보여주는 서비스형 구성입니다.",
  },
  "ai-saas": {
    displayName: "자동화 SaaS형",
    category: "business",
    recommendedFor: "자동화 도구, B2B SaaS, 생산성 서비스",
    moodTags: ["현대적", "기능중심"],
    goalTags: ["데모신청", "기능설명"],
    tier: "standard",
    selectionCopy: "기능 가치와 데모 신청을 빠르게 설득하는 구조입니다.",
  },
  "arch-studio": {
    displayName: "건축 스튜디오형",
    category: "business",
    recommendedFor: "건축, 인테리어, 디자인 스튜디오",
    moodTags: ["정제된", "포트폴리오형"],
    goalTags: ["프로젝트소개", "상담문의"],
    tier: "standard",
    selectionCopy: "프로젝트 이미지와 스튜디오 철학을 균형 있게 보여줍니다.",
  },
  "ev-mobility": {
    displayName: "모빌리티 소개형",
    category: "business",
    recommendedFor: "모빌리티, 기기, 테크 브랜드",
    moodTags: ["깔끔한", "제품중심"],
    goalTags: ["제품비교", "예약문의"],
    tier: "standard",
    selectionCopy: "제품 강점과 비교 정보를 정돈해서 보여주는 서비스형 템플릿입니다.",
  },
  "pagecraft-premium": {
    displayName: "고급 브랜드형",
    category: "premium",
    recommendedFor: "고급 브랜드, 제품 라인업, 프라이빗 상담",
    moodTags: ["절제된", "프리미엄", "제품중심"],
    goalTags: ["컬렉션", "제품소개", "상담문의"],
    tier: "featured",
    selectionCopy: "대표 제품과 컬렉션, 상담 동선을 고급스럽지만 쉽게 보여줍니다.",
  },
  "jewelry-brand": {
    displayName: "주얼리 브랜드형",
    category: "premium",
    recommendedFor: "주얼리, 액세서리, 프리미엄 제품",
    moodTags: ["섬세한", "고급스러운"],
    goalTags: ["컬렉션", "예약상담"],
    tier: "standard",
    selectionCopy: "작은 제품의 디테일과 브랜드 감도를 강조하는 구성입니다.",
  },
  "perfume-house": {
    displayName: "향수 하우스형",
    category: "premium",
    recommendedFor: "향수, 뷰티, 라이프스타일 브랜드",
    moodTags: ["감각적인", "여백있는"],
    goalTags: ["제품스토리", "구매전환"],
    tier: "standard",
    selectionCopy: "제품 스토리와 감성 이미지를 과하지 않게 배치합니다.",
  },
  "boutique-hotel": {
    displayName: "부티크 호텔형",
    category: "premium",
    recommendedFor: "호텔, 스테이, 프리미엄 숙박",
    moodTags: ["편안한", "고급스러운"],
    goalTags: ["객실소개", "예약"],
    tier: "standard",
    selectionCopy: "공간의 분위기와 예약 동선을 함께 보여주는 템플릿입니다.",
  },
  "pagecraft-emotion": {
    displayName: "공간 예약형",
    category: "local-booking",
    recommendedFor: "공간, 원데이클래스, 로컬 브랜드",
    moodTags: ["따뜻한", "예약중심", "친근한"],
    goalTags: ["공간소개", "프로그램", "예약"],
    tier: "featured",
    selectionCopy: "공간 분위기와 프로그램을 보여주고 예약으로 바로 연결합니다.",
  },
  "local-cafe": {
    displayName: "로컬 카페형",
    category: "local-booking",
    recommendedFor: "카페, 베이커리, 로컬 매장",
    moodTags: ["따뜻한", "친근한"],
    goalTags: ["매장소개", "방문유도"],
    tier: "standard",
    selectionCopy: "메뉴, 공간, 위치 정보를 자연스럽게 보여줍니다.",
  },
  "skin-clinic": {
    displayName: "클리닉 예약형",
    category: "local-booking",
    recommendedFor: "피부과, 뷰티샵, 케어 서비스",
    moodTags: ["깨끗한", "신뢰감"],
    goalTags: ["시술안내", "예약"],
    tier: "standard",
    selectionCopy: "전문성과 예약 동선을 깔끔하게 정리할 수 있습니다.",
  },
  "boxing-gym": {
    displayName: "피트니스 체험형",
    category: "local-booking",
    recommendedFor: "짐, 필라테스, 체험 수업",
    moodTags: ["활동적인", "직관적인"],
    goalTags: ["체험신청", "프로그램"],
    tier: "standard",
    selectionCopy: "프로그램 소개와 체험 신청을 빠르게 연결합니다.",
  },
  "pagecraft-event": {
    displayName: "행사 신청형",
    category: "event",
    recommendedFor: "세미나, 클래스, 행사, 모집 페이지",
    moodTags: ["정보중심", "집중도높은", "전환중심"],
    goalTags: ["소개", "일정", "신청"],
    tier: "featured",
    selectionCopy: "행사명, 날짜, 신청 버튼이 첫 화면에서 바로 보이는 전환형 구성입니다.",
  },
  "festival-page": {
    displayName: "페스티벌 안내형",
    category: "event",
    recommendedFor: "공연, 축제, 팝업 이벤트",
    moodTags: ["활기찬", "정보중심"],
    goalTags: ["일정안내", "참여신청"],
    tier: "standard",
    selectionCopy: "일정, 장소, 프로그램을 한눈에 이해하기 쉽게 구성합니다.",
  },
  "creator-club": {
    displayName: "커뮤니티 모집형",
    category: "event",
    recommendedFor: "멤버십, 크리에이터, 커뮤니티",
    moodTags: ["친근한", "참여형"],
    goalTags: ["가입", "멤버모집"],
    tier: "standard",
    selectionCopy: "모임의 가치와 가입 이유를 분명하게 보여줍니다.",
  },
  "sneaker-drop": {
    displayName: "스니커 드롭형",
    category: "commerce",
    recommendedFor: "한정판 상품, 스트릿 브랜드",
    moodTags: ["강한", "상품중심"],
    goalTags: ["출시안내", "구매전환"],
    tier: "standard",
    selectionCopy: "신상품 출시와 구매 전환을 강하게 보여주는 구성입니다.",
  },
  "supplement-brand": {
    displayName: "건강식품 브랜드형",
    category: "commerce",
    recommendedFor: "건강식품, 구독 상품, 웰니스 브랜드",
    moodTags: ["깨끗한", "신뢰감"],
    goalTags: ["제품소개", "구독전환"],
    tier: "standard",
    selectionCopy: "성분, 혜택, 구매 이유를 순서대로 설명하기 좋습니다.",
  },
  "beauty-flash-sale": {
    displayName: "뷰티 프로모션형",
    category: "commerce",
    recommendedFor: "뷰티 세일, 시즌 프로모션",
    moodTags: ["밝은", "전환중심"],
    goalTags: ["세일", "구매"],
    tier: "standard",
    selectionCopy: "기간 한정 혜택과 구매 버튼을 분명하게 보여줍니다.",
  },
  "gaming-gear": {
    displayName: "게이밍 기어형",
    category: "commerce",
    recommendedFor: "전자기기, 장비, 퍼포먼스 상품",
    moodTags: ["강렬한", "스펙중심"],
    goalTags: ["스펙소개", "구매전환"],
    tier: "standard",
    selectionCopy: "제품 스펙과 사용 장면을 강조하는 커머스형 템플릿입니다.",
  },
  "indie-bookstore": {
    displayName: "독립서점형",
    category: "commerce",
    recommendedFor: "서점, 큐레이션, 소규모 상점",
    moodTags: ["차분한", "큐레이션"],
    goalTags: ["상품추천", "방문유도"],
    tier: "standard",
    selectionCopy: "큐레이션과 매장 분위기를 함께 보여주기 좋습니다.",
  },
  "stationery-shop": {
    displayName: "문구샵형",
    category: "commerce",
    recommendedFor: "문구, 소품, 라이프스타일 상점",
    moodTags: ["아기자기한", "정돈된"],
    goalTags: ["상품진열", "구매"],
    tier: "standard",
    selectionCopy: "여러 상품군을 깔끔하게 비교해 보여줍니다.",
  },
  "furniture-store": {
    displayName: "가구 쇼룸형",
    category: "commerce",
    recommendedFor: "가구, 인테리어 소품, 쇼룸",
    moodTags: ["여백있는", "실용적인"],
    goalTags: ["제품비교", "쇼룸방문"],
    tier: "standard",
    selectionCopy: "공간 이미지와 제품 정보를 균형 있게 보여줍니다.",
  },
  "youth-fashion": {
    displayName: "패션 룩북형",
    category: "commerce",
    recommendedFor: "의류, 룩북, 시즌 컬렉션",
    moodTags: ["캐주얼", "룩북형"],
    goalTags: ["컬렉션", "구매전환"],
    tier: "standard",
    selectionCopy: "룩북 이미지와 상품 흐름을 쉽게 탐색할 수 있습니다.",
  },
};

export function getTemplateMeta(siteId) {
  return {
    siteId,
    ...DEFAULT_TEMPLATE_META,
    ...(TEMPLATE_META_BY_SITE_ID[siteId] ?? {}),
  };
}

export function getTemplateCategory(siteId) {
  return getTemplateMeta(siteId).category;
}

export function getTemplateCategoryInfo(categoryId) {
  return TEMPLATE_CATEGORIES.find((category) => category.id === categoryId) ?? TEMPLATE_CATEGORIES[0];
}

const TEMPLATE_DETAIL_BY_CATEGORY = {
  business: {
    label: "기업/서비스형 상세 구성",
    headline: "신뢰, 기능 설명, 상담 전환이 한 흐름으로 이어집니다.",
    description: "첫 화면에서는 사업의 신뢰도를 만들고, 본문에서는 서비스 강점과 도입 효과를 정리한 뒤 상담 문의로 연결합니다.",
    sections: ["회사/서비스 소개", "핵심 기능 3~4개", "도입 효과와 숫자", "상담 문의 폼"],
    ctaPrimary: "서비스 미리보기",
    ctaSecondary: "이 구성으로 상담하기",
  },
  premium: {
    label: "프리미엄/브랜드형 상세 구성",
    headline: "브랜드 무드와 제품 이미지를 고급스럽게 보여줍니다.",
    description: "큰 이미지, 여백, 컬렉션/스토리 섹션을 중심으로 구성해 브랜드의 감도를 먼저 느끼게 합니다.",
    sections: ["브랜드 스토리", "대표 컬렉션", "제품 디테일", "예약/구매 상담"],
    ctaPrimary: "브랜드 화면 보기",
    ctaSecondary: "프리미엄 구성 문의",
  },
  "local-booking": {
    label: "감성/예약형 상세 구성",
    headline: "방문하고 싶게 만들고, 예약까지 자연스럽게 연결합니다.",
    description: "공간 분위기, 프로그램, 위치/운영 정보를 먼저 보여주고 예약 버튼을 반복 배치합니다.",
    sections: ["공간/서비스 분위기", "프로그램 안내", "운영 정보", "예약 CTA"],
    ctaPrimary: "예약형 미리보기",
    ctaSecondary: "예약 페이지 문의",
  },
  event: {
    label: "이벤트/전환형 상세 구성",
    headline: "하나의 행동을 빠르게 유도하는 전환 중심 구조입니다.",
    description: "일정, 혜택, 참여 방법을 짧게 정리하고 신청 버튼을 명확하게 노출합니다.",
    sections: ["이벤트 핵심 혜택", "일정/장소", "참여 방법", "신청 CTA"],
    ctaPrimary: "이벤트 화면 보기",
    ctaSecondary: "신청형 페이지 문의",
  },
  commerce: {
    label: "쇼핑/커머스형 상세 구성",
    headline: "상품 탐색과 구매 이유가 한눈에 보이도록 구성합니다.",
    description: "상품군, 추천 포인트, 혜택/신뢰 요소를 정리해 구매 또는 상담 전환까지 이어지게 합니다.",
    sections: ["대표 상품 진열", "상품 비교/혜택", "신뢰 요소", "구매/상담 CTA"],
    ctaPrimary: "상품형 화면 보기",
    ctaSecondary: "커머스 구성 문의",
  },
};

export function getTemplateDetailModel(siteId) {
  const meta = getTemplateMeta(siteId);
  const categoryInfo = getTemplateCategoryInfo(meta.category);
  const detail = TEMPLATE_DETAIL_BY_CATEGORY[meta.category] ?? TEMPLATE_DETAIL_BY_CATEGORY.business;

  return {
    ...detail,
    category: categoryInfo,
    meta,
  };
}
