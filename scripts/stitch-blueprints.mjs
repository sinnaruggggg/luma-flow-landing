import {
  getBlueprintForSite as getCatalogBlueprintForSite,
  getRouteDescription,
  getRoutesForSite as getCatalogRoutesForSite,
} from "../src/content/siteCatalog.js";

const toneRules = {
  neo: { atmosphere: "강한 대비, 또렷한 형태, 즉시 구매를 유도하는 에너지.", typography: "볼드한 디스플레이 타이포와 짧고 직설적인 보조 라벨을 사용한다.", components: "굵은 보더, 스티커, 촉각적인 블록을 적극적으로 사용한다." },
  minimal: { atmosphere: "절제되고 프리미엄이며 조용한 서비스 톤.", typography: "여백과 간격이 통제된 깔끔한 타이포를 사용한다.", components: "카드는 차분하고 제품급 완성도로 보여야 한다." },
  max: { atmosphere: "화려하고 글로시하지만 흐리지 않은 캠페인 무드.", typography: "큰 디스플레이 서체와 날카로운 보조 라벨을 쓴다.", components: "태그, 가격, 배지가 경쟁하되 통제된 질서를 유지한다." },
  retro: { atmosphere: "기술적 글로우, 메시 깊이, 다크 콘솔 감성.", typography: "정밀한 기술 라벨과 단호한 헤드라인을 사용한다.", components: "패널은 카드가 아니라 장비 계기판처럼 느껴져야 한다." },
  collage: { atmosphere: "종이 질감, 에디토리얼 온기, 손에 잡히는 구성.", typography: "노트처럼 큐레이션된 타이포를 사용한다.", components: "겹쳐 붙인 종이와 콜라주 같은 행동을 활용한다." },
  grain: { atmosphere: "부드러운 그레인과 영화적 깊이를 가진 에디토리얼 럭셔리.", typography: "조용하지만 고급스러운 타이포를 사용한다.", components: "패널은 이미지 위에 겹쳐 올라오는 시트처럼 보여야 한다." },
  hand: { atmosphere: "동네 가게의 온기와 생활감 있는 유용함.", typography: "짧은 라벨과 읽기 쉬운 계층을 섞어 쓴다.", components: "메뉴와 예약 블록은 손으로 올려놓은 듯하지만 정돈돼야 한다." },
  organic: { atmosphere: "공간감 있고 차분하며 부드러운 그라디언트 중심.", typography: "부드러운 위계와 넉넉한 간격을 사용한다.", components: "플래너와 공간 선택기는 유기적이고 촉각적이어야 한다." },
  playful: { atmosphere: "밝고 타입 중심이며 젊은 이미지 리듬.", typography: "리드미컬한 디스플레이 타이포를 전면에 둔다.", components: "룩과 구매 유도 요소가 편집 스티커처럼 움직여야 한다." },
  chrome: { atmosphere: "갤러리 같은 정제감, 금속성 깊이, 프리미엄 절제.", typography: "정밀하고 세련된 타이포를 사용한다.", components: "컬렉션 패널은 반사광과 긴장감을 가진 상태여야 한다." },
};

const homeStructures = {
  commerce: [
    "Opening commerce surface tailored to the brand's home grammar, with a product or campaign focal point visible immediately.",
    "Fast browse or product entry module in the first viewport. The user must understand what can be purchased without scrolling.",
    "Price, drop timing, or subscription value visible near the primary CTA.",
    "Brand proof or product-world section that feels specific to the brand, not a generic about block.",
  ],
  booking: [
    "Booking or reservation module visible in the first viewport, ahead of generic storytelling.",
    "Program, room, or coach snapshot that clarifies what is being booked.",
    "Operational trust block with schedule, preparation, or visit guidance.",
    "Service depth section that makes the next booking step obvious.",
  ],
  saas: [
    "Product surface first: show a board, dashboard, graph, or workflow state before explanatory marketing copy.",
    "Capability strip or module row that explains core features through interface fragments.",
    "Proof section with outcomes, use cases, or customer metrics.",
    "Conversion block for pricing, demo, or contact with clear business intent.",
  ],
  event: [
    "Event-opening surface with lineup, date, or ticket path visible immediately.",
    "Discovery block for lineup, schedule, or community activity depending on the route.",
    "Decision block for ticket classes, passes, or membership commitment.",
    "Operational guide block for logistics, venue, or participation rules.",
  ],
  portfolio: [
    "Editorial or project-led opening surface that behaves like a real studio or creator homepage.",
    "Project or work index with clear case entry and curation rhythm.",
    "Service or collaboration framing that feels premium and specific, not generic agency copy.",
    "Brief or contact action that matches the brand voice and site grammar.",
  ],
};

const routeStructures = {
  home: "Build a full operating homepage. The first viewport must establish how the site works, what the user can do next, and why the brand feels distinct.",
  browse: "Use a browsing surface with filtering, category anchors, or modular collections. This should help users compare options quickly.",
  detail: "Lead with the core item, service, program, or room itself. Show key decision information in the first screen and keep supporting detail structured below.",
  checkout: "Design a conversion-first page with selection state, price summary, purchase confidence, and the final action clearly visible.",
  brand: "Present the brand world with proof, process, trust, or editorial identity. Avoid a generic about-us column layout.",
  reserve: "Make reservation state, schedule, available options, and the booking action obvious above the fold.",
  guide: "Organize guide information into clear, scannable modules such as map, FAQ, prep notes, rules, or visit flow.",
  features: "Explain capabilities through modules, diagrams, flows, or interactive-looking product sections. Avoid a generic three-card features row.",
  cases: "Use specific use-case or results framing with concrete teams, numbers, before-after logic, or operational outcomes.",
  pricing: "Make plan comparison immediate. Show differences, commitment model, and recommended choice with minimal copy.",
  contact: "Build a high-trust inquiry surface with clear response expectations, form structure, and business cues.",
  works: "Use a project index or editorial gallery with obvious case entry and filtering or curation logic.",
  services: "Frame services through deliverables, process, and fit. Avoid boilerplate agency language.",
  brief: "Create a premium intake form or brief capture page with structured fields and expectations.",
  lineup: "Design around discovery of artists, speakers, or featured talent with date and stage context.",
  schedule: "Make schedule comprehension immediate. Time slots, stage or room movement, and key anchors should be obvious.",
  tickets: "Present ticket classes, perks, and purchase logic in a compact but confident layout.",
  feed: "Use a living feed or activity surface that feels current and community-driven.",
  perks: "Show membership or pass value through concise benefit blocks with strong visual differentiation.",
  join: "Treat the page as a join or signup flow with clear commitment, plan choice, and reasons to act now.",
};

const mobileLayouts = {
  commerce: "Use a mobile-first purchase layout with product media cropped for portrait, sticky buy action, concise specs, and a fast route to cart or checkout.",
  booking: "Use a mobile booking layout with availability, date or time selection, and the booking CTA within the first scroll.",
  saas: "Use stacked product modules sized for handheld reading. The first mobile screen should show active product state, KPI context, and one main CTA.",
  event: "Use a mobile event layout with lineup or ticket entry first, followed by time, place, and guide modules in a compact rhythm.",
  portfolio: "Use a mobile editorial deck with project cards, concise service cues, and a direct inquiry or brief action before long narrative content.",
};

export function getRoutesForSite(siteId) {
  return getCatalogRoutesForSite(siteId);
}

export function getBlueprintForSite(siteId) {
  return getCatalogBlueprintForSite(siteId);
}

export function buildPrompt({ site, route, deviceType }) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  const routes = getCatalogRoutesForSite(site.id);
  const deviceLabel = deviceType === "MOBILE" ? "mobile" : "desktop";
  const pageStructure = routeStructures[route.kind] ?? "Organize the page around the route's real task, with clear hierarchy and no generic section stack.";
  const homeStructure = homeStructures[site.category] ?? homeStructures.saas;
  const mobileLayout = mobileLayouts[site.category] ?? mobileLayouts.saas;
  const structureHints = route.kind === "home" ? homeStructure : [pageStructure];

  return [
    `${site.brand} ${route.label} 페이지`,
    "",
    `${deviceLabel === "mobile" ? "모바일" : "데스크톱"} 우선 웹페이지를 만든다. 결과물은 템플릿 변주가 아니라 실제 운영 사이트처럼 보여야 한다.`,
    "이 화면은 5페이지로 구성된 하나의 사이트 일부이며, 갤러리의 다른 19개 사이트와 구조 문법이 겹치면 안 된다.",
    "",
    "카피 규칙:",
    "- 화면에 보이는 기본 언어는 한국어다.",
    "- 영어는 브랜드명, 짧은 라벨, 스타일 포인트에만 제한적으로 사용한다.",
    "- 긴 문단은 최소화하고 화면만 봐도 기능이 이해되게 만든다.",
    "- 내비게이션, 버튼, 섹션 제목, 폼 라벨은 한국어를 기본으로 쓴다.",
    "- 가격은 `29,900원`, `월 39,000원` 같은 한국 서비스 표기를 사용한다.",
    "",
    "사이트 정체성:",
    `- 브랜드명: ${site.brand}`,
    `- 업종: ${site.industry}`,
    `- 요약: ${site.summary}`,
    `- 첫 화면 문법: ${site.homeMode}`,
    `- 모바일 규칙: ${site.mobileRule}`,
    "",
    "디자인 DNA:",
    `- 디자인 계열: ${blueprint.family}`,
    `- 첫 화면 방식: ${blueprint.heroMode}`,
    `- 배경 연출: ${blueprint.background}`,
    `- 모션 연출: ${blueprint.motion}`,
    `- 키워드: ${blueprint.keywords.join(", ")}`,
    "",
    "페이지 과업:",
    `- 라우트 슬러그: ${route.slug}`,
    `- 라우트 라벨: ${route.label}`,
    `- 페이지 의도: ${getRouteDescription(route.kind)}`,
    `- 필수 구조: ${pageStructure}`,
    `- 기기별 지시: ${deviceType === "MOBILE" ? site.mobileRule : "데스크톱은 여유 있는 폭과 레이어 깊이로 사이트 고유 문법이 선명하게 보여야 한다."}`,
    "",
    "전역 규칙:",
    "- 상단 내비게이션은 유지하되 한국어 메뉴를 기본으로 쓴다.",
    "- 공통 히어로 템플릿을 쓰지 않는다.",
    "- 같은 이미지 박스 + 텍스트 박스 + CTA 패턴으로 조립하지 않는다.",
    "- 흔한 스타트업 헤드라인과 버튼 2개를 중심 정렬한 첫 화면을 쓰지 않는다.",
    "- 교환 가능한 마케팅 섹션을 반복해 쌓지 않는다.",
    "- 첫 뷰포트는 분위기만이 아니라 실제 운영 방식이 바로 이해되어야 한다.",
    "- 이미지형이면 고해상도 대표컷과 스크롤 시 떠오르는 레이어 블록을 사용한다.",
    "- 배경 사진, 룸컷, 공간컷, 제품컷은 확대되어도 버티는 고해상도 비주얼로 만들고 흐리거나 저해상도처럼 보이면 안 된다.",
    "- 비이미지형이면 콘텐츠를 방해하지 않는 메시, 오로라, 깊이감을 사용한다.",
    "- 의사, 상담사, 전문가, 코치, 담당자 등 신뢰형 프로필이 등장하면 한국인 실사 인물 사진처럼 보여야 하며 그래픽 캐릭터나 일러스트 인물은 금지한다.",
    "- 모바일은 축소판이 아니라 전용 모바일 레이아웃이어야 한다.",
    "",
    "첫 화면 필수 요건:",
    ...structureHints.map((hint) => `- ${hint}`),
    "",
    "모바일 실행 규칙:",
    `- ${mobileLayout}`,
    "- 데스크톱 블록 순서를 그대로 유지하지 말고 손안 화면에 맞춰 다시 배치한다.",
    "- 첫 스크롤 안에 주 CTA 하나는 반드시 보이게 하고, 너무 작은 대시보드 미니어처를 만들지 않는다.",
    "",
    "전체 라우트 맵:",
    ...routes.map((entry, index) => `${index + 1}. ${entry.label} (${entry.slug})`),
  ].join("\n");
}

export function buildSiteBrief(site) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  return [
    `# ${site.brand}`,
    "",
    `- 사이트 ID: ${site.id}`,
    `- 업종: ${site.industry}`,
    `- 요약: ${site.summary}`,
    `- 첫 화면 문법: ${site.homeMode}`,
    `- 디자인 계열: ${blueprint.family}`,
    `- 첫 화면: ${blueprint.heroMode}`,
    `- 배경: ${blueprint.background}`,
    `- 모션: ${blueprint.motion}`,
    `- 모바일 규칙: ${site.mobileRule}`,
  ].join("\n");
}

export function buildSiteDesignMd(site) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  const routes = getCatalogRoutesForSite(site.id);
  const tone = toneRules[site.backdrop] ?? toneRules.minimal;

  return [
    `# 디자인 시스템: ${site.brand}`,
    `**사이트 ID:** ${site.id}`,
    "",
    "## 1. 정체성",
    `- 업종: ${site.industry}`,
    `- 요약: ${site.summary}`,
    `- 첫 화면 문법: ${site.homeMode}`,
    `- 모바일 규칙: ${site.mobileRule}`,
    "",
    "## 2. 비주얼 방향",
    `- 계열: ${blueprint.family}`,
    `- 첫 화면: ${blueprint.heroMode}`,
    `- 배경: ${blueprint.background}`,
    `- 모션: ${blueprint.motion}`,
    `- 분위기: ${tone.atmosphere}`,
    "",
    "## 3. 팔레트",
    `- 배경: ${site.theme.bg}`,
    `- 표면: ${site.theme.surface}`,
    `- 패널: ${site.theme.panel}`,
    `- 본문: ${site.theme.text}`,
    `- 보조: ${site.theme.muted}`,
    `- 강조: ${site.theme.accent}`,
    `- 보조 강조: ${site.theme.accentSoft}`,
    "",
    "## 4. 타이포그래피",
    `- ${tone.typography}`,
    "- 카피는 짧고 기능적으로 유지한다.",
    "- 기본 콘텐츠 언어는 한국어다.",
    "",
    "## 5. 컴포넌트",
    `- ${tone.components}`,
    "- 공용 primitive는 버튼, 배지, 입력, 단순 카드 정도로 제한한다.",
    "- 첫 화면 문법은 이 사이트만의 구조여야 한다.",
    "- 신뢰형 프로필 이미지가 필요하면 한국인 실사 인물 사진처럼 보여야 한다.",
    "- 배경 컷과 대표 사진은 확대 시에도 버티는 고해상도 질감이어야 한다.",
    "",
    "## 6. 금지 패턴",
    "- 공통 히어로 템플릿 금지.",
    "- 공통 섹션 조립기 금지.",
    "- 반복적인 이미지 박스 + 텍스트 박스 + CTA 블록 금지.",
    "",
    "## 7. 라우트 목표",
    ...routes.map((route) => `- ${route.label} (${route.slug}): ${getRouteDescription(route.kind)}`),
  ].join("\n");
}
