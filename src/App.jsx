import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Monitor, Smartphone, Sparkles } from "lucide-react";
import { showcasePages } from "./content/showcasePages";

const siteProfiles = {
  "sneaker-drop": {
    family: "commerce",
    previewTone: "neo",
    homeLayout: "drop",
    itemsKey: "drops",
    tokenKey: "quickTools",
    supportRows: [["오늘 출고", "20:00 이전"], ["AI 사이즈", "270 추천"], ["교환", "1회 무료"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "drops", label: "드롭", kind: "browse" },
      { slug: "styles", label: "스타일", kind: "detail" },
      { slug: "cart", label: "장바구니", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "supplement-brand": {
    family: "commerce",
    previewTone: "neo",
    homeLayout: "routine",
    itemsKey: "routines",
    tokenKey: "plans",
    supportRows: [["섭취 타이밍", "운동 전 / 후"], ["정기 배송", "월 1회"], ["성분 비교", "2분 확인"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "routine", label: "루틴", kind: "browse" },
      { slug: "compare", label: "비교", kind: "detail" },
      { slug: "subscribe", label: "구독", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "boxing-gym": {
    family: "booking",
    previewTone: "retro",
    homeLayout: "booking",
    itemsKey: "plans",
    tokenKey: "classSlots",
    detailKey: "coaches",
    supportRows: [["샤워실", "상시"], ["장갑 대여", "무료"], ["주차", "2시간"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "classes", label: "수업", kind: "browse" },
      { slug: "coaches", label: "코치", kind: "detail" },
      { slug: "join", label: "등록", kind: "reserve" },
      { slug: "guide", label: "안내", kind: "guide" },
    ],
  },
  "wealth-app": {
    family: "software",
    previewTone: "minimal",
    homeLayout: "dashboard",
    itemsKey: "goals",
    tokenKey: "boards",
    detailKey: "cards",
    pricingItems: [
      ["Starter", "개인 자동 연동", "월 0원"],
      ["Pro", "목표 보드", "월 39,000원"],
      ["Scale", "권한 관리", "월 99,000원"],
    ],
    supportRows: [["자동 분류", "92%"], ["리포트", "주 1회"], ["연동 계좌", "8개"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "features", label: "기능", kind: "features" },
      { slug: "cases", label: "활용", kind: "cases" },
      { slug: "pricing", label: "요금", kind: "pricing" },
      { slug: "contact", label: "문의", kind: "contact" },
    ],
  },
  "skin-clinic": {
    family: "booking",
    previewTone: "minimal",
    homeLayout: "clinic",
    itemsKey: "programs",
    tokenKey: "slots",
    detailKey: "doctors",
    supportRows: [["사전 진단", "3분"], ["담당 원장", "선택"], ["회복 안내", "문자 발송"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "programs", label: "프로그램", kind: "browse" },
      { slug: "scan", label: "AI 진단", kind: "detail" },
      { slug: "booking", label: "예약", kind: "reserve" },
      { slug: "clinic", label: "클리닉", kind: "guide" },
    ],
  },
  "arch-studio": {
    family: "studio",
    previewTone: "grain",
    homeLayout: "editorial",
    itemsKey: "works",
    tokenKey: "process",
    serviceItems: [
      ["설계", "평면 · 동선", "브리프"],
      ["스타일링", "가구 · 조명", "큐레이션"],
      ["현장", "시공 체크", "주 1회"],
    ],
    supportRows: [["실측", "주 1회"], ["도면", "7일"], ["현장", "오픈 전 체크"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "works", label: "프로젝트", kind: "works" },
      { slug: "services", label: "서비스", kind: "services" },
      { slug: "brief", label: "브리프", kind: "brief" },
      { slug: "contact", label: "문의", kind: "contact" },
    ],
  },
  "beauty-flash-sale": {
    family: "commerce",
    previewTone: "max",
    homeLayout: "sale",
    itemsKey: "kits",
    tokenKey: "shades",
    supportRows: [["오늘 출고", "23:00 전"], ["무료 배송", "5만원 이상"], ["색상 저장", "무제한"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "shop", label: "쇼핑", kind: "browse" },
      { slug: "shades", label: "컬러", kind: "detail" },
      { slug: "cart", label: "장바구니", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "festival-page": {
    family: "event",
    previewTone: "retro",
    homeLayout: "festival",
    itemsKey: "tickets",
    tokenKey: "lineup",
    detailKey: "timetable",
    supportRows: [["입장 오픈", "17:00"], ["리스트밴드", "현장 수령"], ["물품보관", "유료"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "lineup", label: "라인업", kind: "lineup" },
      { slug: "schedule", label: "시간표", kind: "schedule" },
      { slug: "tickets", label: "티켓", kind: "tickets" },
      { slug: "guide", label: "가이드", kind: "guide" },
    ],
  },
  "creator-club": {
    family: "club",
    previewTone: "max",
    homeLayout: "club",
    itemsKey: "passes",
    tokenKey: "posts",
    detailKey: "perks",
    supportRows: [["주간 피드백", "매주 수"], ["오프라인 모임", "월 1회"], ["협업 공고", "실시간"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "feed", label: "피드", kind: "feed" },
      { slug: "perks", label: "혜택", kind: "perks" },
      { slug: "join", label: "가입", kind: "join" },
      { slug: "guide", label: "안내", kind: "guide" },
    ],
  },
  "ev-mobility": {
    family: "booking",
    previewTone: "retro",
    homeLayout: "compare",
    itemsKey: "models",
    tokenKey: "specs",
    detailKey: "planner",
    supportRows: [["급속 충전", "24분"], ["시승 장소", "성수"], ["상담", "당일 가능"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "models", label: "모델", kind: "browse" },
      { slug: "charge", label: "충전", kind: "detail" },
      { slug: "drive", label: "시승", kind: "reserve" },
      { slug: "support", label: "지원", kind: "guide" },
    ],
  },
  "gaming-gear": {
    family: "commerce",
    previewTone: "retro",
    homeLayout: "setup",
    itemsKey: "gear",
    tokenKey: "specs",
    supportRows: [["배송", "당일 출고"], ["세팅 지원", "무료"], ["보증", "2년"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "gear", label: "기어", kind: "browse" },
      { slug: "bundle", label: "번들", kind: "detail" },
      { slug: "cart", label: "장바구니", kind: "checkout" },
      { slug: "support", label: "지원", kind: "brand" },
    ],
  },
  "ai-saas": {
    family: "software",
    previewTone: "retro",
    homeLayout: "pipeline",
    itemsKey: "useCases",
    tokenKey: "flows",
    detailKey: "kpis",
    pricingItems: [
      ["Starter", "개인 자동화", "월 29,000원"],
      ["Team", "협업 워크플로", "월 89,000원"],
      ["Scale", "SSO · 권한", "월 189,000원"],
    ],
    supportRows: [["파일 처리", "12초"], ["권한 관리", "역할별"], ["보고서", "자동 생성"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "flows", label: "플로우", kind: "features" },
      { slug: "cases", label: "사례", kind: "cases" },
      { slug: "pricing", label: "요금", kind: "pricing" },
      { slug: "contact", label: "문의", kind: "contact" },
    ],
  },
  "indie-bookstore": {
    family: "commerce",
    previewTone: "collage",
    homeLayout: "shelf",
    itemsKey: "picks",
    tokenKey: "shelf",
    supportRows: [["포장", "리본 무료"], ["메모 카드", "기본 제공"], ["픽업", "성수"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "shelf", label: "큐레이션", kind: "browse" },
      { slug: "picks", label: "추천", kind: "detail" },
      { slug: "gift", label: "선물", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "stationery-shop": {
    family: "commerce",
    previewTone: "collage",
    homeLayout: "kit",
    itemsKey: "kits",
    tokenKey: "colors",
    supportRows: [["선물 포장", "즉시"], ["이니셜 스티커", "옵션"], ["세트 할인", "12%"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "kits", label: "키트", kind: "browse" },
      { slug: "colors", label: "컬러", kind: "detail" },
      { slug: "basket", label: "바스켓", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "local-cafe": {
    family: "booking",
    previewTone: "hand",
    homeLayout: "menu",
    itemsKey: "menus",
    tokenKey: "seats",
    detailKey: "storeRows",
    supportRows: [["좌석 예약", "30분 단위"], ["주차", "2대"], ["라스트오더", "21:30"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "menu", label: "메뉴", kind: "browse" },
      { slug: "visit", label: "매장", kind: "detail" },
      { slug: "reserve", label: "예약", kind: "reserve" },
      { slug: "info", label: "안내", kind: "guide" },
    ],
  },
  "boutique-hotel": {
    family: "booking",
    previewTone: "grain",
    homeLayout: "hotel",
    itemsKey: "rooms",
    tokenKey: "dates",
    detailKey: "perks",
    supportRows: [["체크인", "15:00"], ["조식", "포함 선택"], ["루프탑", "이용 가능"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "rooms", label: "객실", kind: "browse" },
      { slug: "offers", label: "오퍼", kind: "detail" },
      { slug: "booking", label: "예약", kind: "reserve" },
      { slug: "guide", label: "안내", kind: "guide" },
    ],
  },
  "perfume-house": {
    family: "commerce",
    previewTone: "grain",
    homeLayout: "scent",
    itemsKey: "sets",
    tokenKey: "notes",
    supportRows: [["디스커버리", "5종"], ["포장", "기프트 박스"], ["레이어링", "추천"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "sets", label: "세트", kind: "browse" },
      { slug: "notes", label: "노트", kind: "detail" },
      { slug: "gift", label: "선물", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "furniture-store": {
    family: "commerce",
    previewTone: "organic",
    homeLayout: "room",
    itemsKey: "bundles",
    tokenKey: "rooms",
    supportRows: [["공간 상담", "당일"], ["배치 보기", "즉시"], ["배송", "지역별"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "rooms", label: "룸별", kind: "browse" },
      { slug: "planner", label: "배치", kind: "detail" },
      { slug: "cart", label: "구매", kind: "checkout" },
      { slug: "service", label: "서비스", kind: "brand" },
    ],
  },
  "youth-fashion": {
    family: "commerce",
    previewTone: "playful",
    homeLayout: "look",
    itemsKey: "looks",
    tokenKey: "sizes",
    supportRows: [["AI 착용", "5초"], ["교환", "1회 무료"], ["세트 할인", "자동 적용"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "looks", label: "룩북", kind: "browse" },
      { slug: "shop", label: "쇼핑", kind: "detail" },
      { slug: "cart", label: "장바구니", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
  "jewelry-brand": {
    family: "commerce",
    previewTone: "chrome",
    homeLayout: "luxury",
    itemsKey: "collections",
    tokenKey: "bespoke",
    supportRows: [["각인", "가능"], ["상담", "주말 가능"], ["선물 포장", "기본"]],
    routes: [
      { slug: "home", label: "홈", kind: "home" },
      { slug: "collection", label: "컬렉션", kind: "browse" },
      { slug: "bespoke", label: "맞춤", kind: "detail" },
      { slug: "consult", label: "상담", kind: "checkout" },
      { slug: "brand", label: "브랜드", kind: "brand" },
    ],
  },
};

const familyTitles = {
  commerce: { browse: "바로 고르는 상품", detail: "상세 먼저 확인", checkout: "주문 바로 진행", brand: "운영 정보" },
  booking: { browse: "빠르게 선택하는 화면", detail: "핵심 정보 먼저 보기", reserve: "예약 바로 진행", guide: "방문 전 안내" },
  software: { features: "핵심 기능 한눈에", cases: "실사용 흐름 확인", pricing: "요금 바로 선택", contact: "도입 문의 연결" },
  event: { lineup: "라인업 먼저 보기", schedule: "시간표 바로 확인", tickets: "티켓 비교 후 결제", guide: "현장 가이드" },
  studio: { works: "프로젝트 먼저 보기", services: "서비스 범위 확인", brief: "브리프 바로 작성", contact: "문의 연결" },
  club: { feed: "멤버 피드 확인", perks: "혜택 모아보기", join: "가입 바로 진행", guide: "운영 안내" },
};

function buildSitePath(siteId, slug = "home") {
  return slug === "home" ? `/${siteId}` : `/${siteId}/${slug}`;
}

function parseAppPath(pathname) {
  const cleanPath = pathname === "/index.html" ? "/" : pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  if (cleanPath === "/") return { kind: "gallery" };

  const [siteId, pageSlug = "home"] = cleanPath.split("/").filter(Boolean);
  const profile = siteProfiles[siteId];
  if (!profile) return { kind: "not-found" };

  const route = profile.routes.find((entry) => entry.slug === pageSlug);
  if (!route) return { kind: "not-found" };

  return { kind: "site", siteId, route };
}

function themeStyle(theme) {
  return {
    "--page-bg": theme.bg,
    "--page-surface": theme.surface,
    "--page-panel": theme.panel,
    "--page-text": theme.text,
    "--page-muted": theme.muted,
    "--page-accent": theme.accent,
    "--page-accent-soft": theme.accentSoft,
    "--page-line": theme.line,
    "--page-shadow": theme.shadow,
    "--page-button-text": theme.buttonText,
  };
}

function useBackdropPointer() {
  const [style, setStyle] = useState({ "--pointer-x": "50%", "--pointer-y": "18%" });

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setStyle({ "--pointer-x": `${x}%`, "--pointer-y": `${y}%` });
  };

  return [style, onPointerMove];
}

function pickArray(page, key, fallback = []) {
  if (!key) return fallback;
  const value = page[key];
  return Array.isArray(value) ? value : fallback;
}

function normalizeCards(items, fallbackLabel = "추천", fallbackValue = "지금 보기") {
  return items.slice(0, 6).map((item) => {
    if (Array.isArray(item)) {
      if (item.length >= 3) return [item[0], item[1], item[2]];
      if (item.length === 2) return [item[0], item[1], fallbackValue];
      return [item[0], fallbackLabel, fallbackValue];
    }
    return [item, fallbackLabel, fallbackValue];
  });
}

function normalizeRows(items) {
  return items.slice(0, 6).map((item) => {
    if (Array.isArray(item)) {
      if (item.length >= 3) return [item[0], item[item.length - 1]];
      if (item.length === 2) return [item[0], item[1]];
      return [item[0], ""];
    }
    return [item, ""];
  });
}

function tableRowsFromArray(items, fallbackThird = "확인") {
  return items.slice(0, 6).map((item) => {
    if (Array.isArray(item)) {
      return [item[0], item[1] ?? "-", item[2] ?? fallbackThird];
    }
    return [item, "-", fallbackThird];
  });
}

function rowsFromStats(page) {
  return (page.stats ?? []).map(([value, label]) => [label, value]);
}

function routeTitle(page, route, profile) {
  if (route.kind === "home") return page.hero.title;
  return familyTitles[profile.family]?.[route.kind] ?? route.label;
}

function routeSubtitle(page, route, profile) {
  if (route.kind === "home") return page.hero.subtitle;

  if (profile.family === "commerce") {
    if (route.kind === "browse") return `${route.label} 중심으로 바로 고르는 화면`;
    if (route.kind === "detail") return `${route.label}와 핵심 정보만 빠르게 확인`;
    if (route.kind === "checkout") return `선택한 구성을 한 화면에서 정리`;
    if (route.kind === "brand") return `${page.brand} 운영 정보와 기본 안내`;
  }

  if (profile.family === "booking") {
    if (route.kind === "browse") return `${route.label}와 시간대를 먼저 확인`;
    if (route.kind === "detail") return `${route.label} 핵심 포인트만 남긴 화면`;
    if (route.kind === "reserve") return `일정 입력 후 바로 예약을 진행`;
    if (route.kind === "guide") return `방문 전 필요한 정보만 간단히 정리`;
  }

  if (profile.family === "software") {
    if (route.kind === "features") return `실제 사용 흐름 기준으로 기능을 정리`;
    if (route.kind === "cases") return `팀 단위 활용 예시만 빠르게 확인`;
    if (route.kind === "pricing") return `팀 크기 기준으로 바로 선택`;
    if (route.kind === "contact") return `도입 문의와 온보딩 안내`;
  }

  if (profile.family === "event") {
    if (route.kind === "lineup") return `무대별 아티스트를 빠르게 확인`;
    if (route.kind === "schedule") return `입장부터 퇴장까지 시간 흐름 정리`;
    if (route.kind === "tickets") return `입장권 종류와 혜택을 바로 비교`;
    if (route.kind === "guide") return `현장 입장과 이동 정보 확인`;
  }

  if (profile.family === "studio") {
    if (route.kind === "works") return `실제 작업 결과 위주로 정리`;
    if (route.kind === "services") return `진행 범위와 산출물 중심 안내`;
    if (route.kind === "brief") return `프로젝트 브리프를 바로 입력`;
    if (route.kind === "contact") return `일정과 예산 기준으로 문의 연결`;
  }

  if (profile.family === "club") {
    if (route.kind === "feed") return `지금 열리는 피드와 활동만 모아서`;
    if (route.kind === "perks") return `가입 전 확인할 혜택 정리`;
    if (route.kind === "join") return `플랜 선택 후 바로 가입`;
    if (route.kind === "guide") return `운영 방식과 제출 루틴 안내`;
  }

  return page.summary;
}

function primaryAction(route, page) {
  switch (route.kind) {
    case "home":
      return page.hero.primary;
    case "browse":
    case "features":
    case "feed":
    case "lineup":
    case "works":
      return `${route.label} 보기`;
    case "detail":
    case "cases":
    case "perks":
    case "services":
      return "바로 확인";
    case "checkout":
      return "결제하기";
    case "reserve":
      return "예약하기";
    case "pricing":
    case "join":
    case "tickets":
      return "진행하기";
    case "contact":
    case "brief":
      return "문의 남기기";
    case "guide":
    case "brand":
      return "안내 확인";
    default:
      return page.hero.primary;
  }
}

function secondaryAction(route, page) {
  switch (route.kind) {
    case "home":
      return page.hero.secondary;
    case "browse":
    case "features":
    case "feed":
    case "lineup":
    case "works":
      return "다음 보기";
    case "detail":
    case "cases":
    case "perks":
    case "services":
      return "저장하기";
    case "checkout":
      return "계속 보기";
    case "reserve":
      return "일정 바꾸기";
    case "pricing":
    case "join":
    case "tickets":
      return "비교하기";
    case "contact":
    case "brief":
      return "자료 받기";
    case "guide":
    case "brand":
      return "목록 보기";
    default:
      return page.hero.secondary;
  }
}

function makeCardsFromProfile(page, profile) {
  const items = normalizeCards(pickArray(page, profile.itemsKey), page.industry, "상세 보기");
  return items.length ? items : normalizeCards(page.hero.badges, page.industry, "바로 보기");
}

function chipValues(items) {
  return items.slice(0, 6).map((item) => {
    if (Array.isArray(item)) return item[0];
    return item;
  });
}

function makeCardsFromKey(page, profile, key) {
  const items = normalizeCards(pickArray(page, key), page.industry, "바로 보기");
  return items.length ? items : makeCardsFromProfile(page, profile);
}

function makeSupportRows(page, profile) {
  if (profile.supportRows?.length) return profile.supportRows;

  const detailRows = normalizeRows(pickArray(page, profile.detailKey));
  if (detailRows.length) return detailRows.slice(0, 3);

  return rowsFromStats(page).slice(0, 3);
}

function makeDetailRows(page, profile) {
  const detailRows = normalizeRows(pickArray(page, profile.detailKey));
  if (detailRows.length) return detailRows;

  return rowsFromStats(page).slice(0, 4);
}

function makeCompareRows(page, profile) {
  const sources = [profile.detailKey, profile.tokenKey, profile.itemsKey];

  for (const key of sources) {
    const items = pickArray(page, key);
    if (items.length) {
      return tableRowsFromArray(items, page.brand);
    }
  }

  return rowsFromStats(page).map(([label, value]) => [label, value, page.brand]);
}

function makeTokenChips(page, profile) {
  const base = pickArray(page, profile.tokenKey, page.hero.badges);
  const chips = chipValues(base);
  return chips.length ? chips : page.hero.badges;
}

function makePriceItems(page, profile) {
  if (profile.pricingItems?.length) return profile.pricingItems;
  if (profile.serviceItems?.length) return profile.serviceItems;
  return makeCardsFromProfile(page, profile).slice(0, 3);
}

function getHomeRoute(profile) {
  return profile.routes[0];
}

function getPrimaryRoute(profile) {
  return (
    profile.routes.find((route) =>
      ["checkout", "reserve", "pricing", "tickets", "brief", "join", "contact"].includes(route.kind),
    ) ?? profile.routes[1] ?? profile.routes[0]
  );
}

function mobilePreviewSrc(page) {
  return page.images.scene || page.images.product || page.images.hero;
}

function detectMobileClient() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
}

function useIsMobileClient() {
  const [isMobileClient, setIsMobileClient] = useState(() => detectMobileClient());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const update = () => setIsMobileClient(mediaQuery.matches);

    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isMobileClient;
}

function SceneBackdrop({ tone }) {
  return (
    <div className="scene-backdrop" data-style={tone}>
      <div className="scene-backdrop__orb scene-backdrop__orb--a" />
      <div className="scene-backdrop__orb scene-backdrop__orb--b" />
      <div className="scene-backdrop__orb scene-backdrop__orb--c" />
      <div className="scene-backdrop__ribbon scene-backdrop__ribbon--a" />
      <div className="scene-backdrop__ribbon scene-backdrop__ribbon--b" />
      <div className="scene-backdrop__mesh" />
      <div className="scene-backdrop__cursor" />
      <div className="scene-backdrop__grain" />
    </div>
  );
}

function Badge({ children, dark = false }) {
  return <span className={`badge ${dark ? "badge--dark" : ""}`}>{children}</span>;
}

function ActionRow({ primary, secondary }) {
  return (
    <div className="action-row">
      <button type="button" className="action-button action-button--primary">
        {primary}
        <ArrowRight size={18} />
      </button>
      <button type="button" className="action-button action-button--secondary">
        {secondary}
      </button>
    </div>
  );
}

function StatStrip({ items = [] }) {
  return (
    <div className="stat-strip">
      {items.slice(0, 3).map(([value, label]) => (
        <article key={`${value}-${label}`} className="stat-card">
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}

function HeroLead({ eyebrow, title, subtitle, badges = [], stats = [], primary, secondary }) {
  return (
    <div className="hero-lead">
      <span className="hero-lead__eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="badge-row">
        {badges.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <ActionRow primary={primary} secondary={secondary} />
      <StatStrip items={stats} />
    </div>
  );
}

function ImageCard({ src, label, title, hero = false, className = "" }) {
  return (
    <figure className={`image-card ${hero ? "image-card--hero" : ""} ${className}`.trim()}>
      <img src={src} alt={title} />
      <figcaption className="image-card__copy">
        <span>{label}</span>
        <strong>{title}</strong>
      </figcaption>
    </figure>
  );
}

function SectionBlock({ label, title, children }) {
  return (
    <section className="section-block">
      <div className="section-block__head">
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PriceDeck({ items = [], stack = false }) {
  return (
    <div className={`price-deck ${stack ? "price-deck--stack" : ""}`}>
      {items.map(([title, desc, value]) => (
        <article key={`${title}-${value}`} className="price-card">
          <span>{desc}</span>
          <strong>{title}</strong>
          <em>{value}</em>
        </article>
      ))}
    </div>
  );
}

function MiniPanel({ title, rows = [], chips = [], accent = false }) {
  return (
    <aside className={`mini-panel ${accent ? "mini-panel--accent" : ""}`}>
      <div className="mini-panel__title">{title}</div>
      {chips.length ? (
        <div className="token-rail token-rail--wide">
          {chips.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      {rows.length ? (
        <div className="mini-panel__rows">
          {rows.map(([label, value]) => (
            <div key={`${label}-${value}`} className="mini-panel__row">
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

function CompareTable({ headers, rows }) {
  return (
    <div className="compare-table">
      <div className="compare-table__head">
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.join("-")} className="compare-table__row">
          {row.map((cell) => (
            <span key={cell}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function RouteLead({ page, profile, route }) {
  return (
    <section className="section-block route-lead">
      <div className="section-block__head">
        <span>{page.brand}</span>
        <h2>{routeTitle(page, route, profile)}</h2>
      </div>
      <p className="section-copy">{routeSubtitle(page, route, profile)}</p>
      <ActionRow primary={primaryAction(route, page)} secondary={secondaryAction(route, page)} />
    </section>
  );
}

function PageTopbar({ page, profile, route, viewMode, onViewChange, onBack, onNavigate }) {
  const primaryRoute = getPrimaryRoute(profile);

  return (
    <>
      <div className="page-topbar">
        <button type="button" className="page-topbar__back" onClick={onBack}>
          <ArrowLeft size={16} />
          전체 보기
        </button>
        <div className="page-topbar__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
        <div className="page-topbar__tools">
          <div className="page-view-switch" aria-label="뷰 전환">
            <button
              type="button"
              className={viewMode === "desktop" ? "is-active" : ""}
              aria-pressed={viewMode === "desktop"}
              onClick={() => onViewChange("desktop")}
            >
              <Monitor size={16} />
            </button>
            <button
              type="button"
              className={viewMode === "mobile" ? "is-active" : ""}
              aria-pressed={viewMode === "mobile"}
              onClick={() => onViewChange("mobile")}
            >
              <Smartphone size={16} />
            </button>
          </div>
          <button
            type="button"
            className="page-topbar__cta"
            onClick={() => onNavigate(buildSitePath(page.id, primaryRoute.slug))}
          >
            {primaryAction(primaryRoute, page)}
          </button>
        </div>
      </div>
      <section className="section-block page-routebar">
        <div className="nav-row">
          {profile.routes.map((entry) => {
            const active = entry.slug === route.slug;
            return (
              <button
                key={entry.slug}
                type="button"
                className={active ? "is-active" : ""}
                onClick={() => onNavigate(buildSitePath(page.id, entry.slug))}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function MobileAwarePageTopbar({ page, profile, route, viewMode, showViewSwitch, onViewChange, onBack, onNavigate }) {
  const primaryRoute = getPrimaryRoute(profile);

  return (
    <>
      <div className="page-topbar">
        <button type="button" className="page-topbar__back" onClick={onBack}>
          <ArrowLeft size={16} />
          전체 보기
        </button>
        <div className="page-topbar__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
        <div className="page-topbar__tools">
          {showViewSwitch ? (
            <div className="page-view-switch" aria-label="뷰 전환">
              <button
                type="button"
                className={viewMode === "desktop" ? "is-active" : ""}
                aria-pressed={viewMode === "desktop"}
                onClick={() => onViewChange("desktop")}
              >
                <Monitor size={16} />
              </button>
              <button
                type="button"
                className={viewMode === "mobile" ? "is-active" : ""}
                aria-pressed={viewMode === "mobile"}
                onClick={() => onViewChange("mobile")}
              >
                <Smartphone size={16} />
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className="page-topbar__cta"
            onClick={() => onNavigate(buildSitePath(page.id, primaryRoute.slug))}
          >
            {primaryAction(primaryRoute, page)}
          </button>
        </div>
      </div>
      <section className="section-block page-routebar">
        <div className="nav-row">
          {profile.routes.map((entry) => {
            const active = entry.slug === route.slug;
            return (
              <button
                key={entry.slug}
                type="button"
                className={active ? "is-active" : ""}
                onClick={() => onNavigate(buildSitePath(page.id, entry.slug))}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function GalleryCard({ page, profile, onOpen }) {
  const mobilePreview = mobilePreviewSrc(page);

  return (
    <Motion.button
      type="button"
      className="gallery-card"
      data-tone={profile.previewTone}
      data-size="square"
      onClick={() => onOpen(buildSitePath(page.id, getHomeRoute(profile).slug))}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.2 }}
    >
      <div className="gallery-card__visual">
        <img src={page.images.hero} alt={page.brand} />
        <div className="gallery-card__phone" aria-hidden="true">
          <div className="gallery-card__phone-notch" />
          <img src={mobilePreview} alt="" />
          <div className="gallery-card__phone-shine" />
        </div>
        <div className="gallery-card__veil" />
        <span className="gallery-card__eyebrow">{page.card.eyebrow}</span>
        <div className="gallery-card__widgets">
          {page.card.widgets.slice(0, 3).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="gallery-card__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
      </div>
      <div className="gallery-card__body">
        <div className="gallery-card__nav">
          {profile.routes.map((entry) => (
            <span key={entry.slug}>{entry.label}</span>
          ))}
        </div>
        <h3>{page.card.title}</h3>
        <p>{page.card.summary}</p>
        <span className="gallery-card__action">
          사이트 열기
          <ChevronRight size={16} />
        </span>
      </div>
    </Motion.button>
  );
}

function GalleryHome({ onOpen }) {
  return (
    <div className="gallery-home">
      <div className="gallery-topbar">
        <div className="gallery-topbar__brand">
          <strong>20 Sample Sites</strong>
          <span>카드를 누르면 바로 실제 홈으로 이동합니다.</span>
        </div>
      </div>
      <section className="gallery-hero">
        <div className="gallery-hero__lead">
          <Badge dark>
            <Sparkles size={14} />
            운영형 샘플
          </Badge>
          <h1>바로 들어가서 쓰임을 보는 20개 사이트</h1>
          <p>소개 페이지 없이 홈으로 열리고, 내부는 5개 페이지로 이어집니다.</p>
        </div>
      </section>
      <div className="gallery-grid">
        {showcasePages.map((page) => (
          <GalleryCard key={page.id} page={page} profile={siteProfiles[page.id]} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CommercePage({ page, profile, route }) {
  const catalog = makeCardsFromProfile(page, profile);
  const details = makeCardsFromKey(page, profile, profile.detailKey || profile.tokenKey);
  const tokens = makeTokenChips(page, profile);
  const support = makeSupportRows(page, profile);
  const detailRows = makeDetailRows(page, profile);
  const compareRows = makeCompareRows(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label={page.industry} title={page.brand} />
            <ImageCard src={page.images.product} label={route.label} title={catalog[0]?.[0] ?? page.nav[0]} />
            <MiniPanel title={page.nav[0]} rows={support} chips={tokens.slice(0, 4)} accent />
          </div>
        </section>
        <SectionBlock label={page.nav[0]} title="지금 담기 좋은 셀렉션">
          <PriceDeck items={catalog.slice(0, 3)} />
        </SectionBlock>
        <div className="split-zone">
          <SectionBlock label={page.nav[1] || "상세"} title="선택 전에 보는 디테일">
            <div className="image-deck image-deck--split">
              <ImageCard src={page.images.product} label={page.nav[1] || "상품"} title={details[0]?.[0] ?? page.brand} />
              <ImageCard src={page.images.scene} label={page.nav[2] || "공간"} title={details[1]?.[0] ?? page.industry} />
            </div>
          </SectionBlock>
          <MiniPanel title="빠른 선택" rows={rowsFromStats(page)} chips={tokens} />
        </div>
      </>
    );
  }

  if (route.kind === "browse") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="바로 고르는 목록">
          <PriceDeck items={catalog} stack />
        </SectionBlock>
        <div className="split-zone split-zone--compact">
          <MiniPanel title="필터" rows={support} chips={tokens} />
          <ImageCard hero src={page.images.scene} label={page.industry} title={page.card.title} />
        </div>
      </>
    );
  }

  if (route.kind === "detail") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone">
          <ImageCard hero src={page.images.product} label={route.label} title={details[0]?.[0] ?? page.brand} />
          <MiniPanel title="옵션" rows={detailRows} chips={tokens} />
        </div>
        <SectionBlock label="비교" title="한눈에 확인">
          <CompareTable headers={["항목", "옵션 1", "옵션 2"]} rows={compareRows.slice(0, 5)} />
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "checkout") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone split-zone--compact">
          <PriceDeck items={catalog.slice(0, 3)} stack />
          <MiniPanel title="주문 요약" rows={support} chips={tokens.slice(0, 3)} accent />
        </div>
        <SectionBlock label="결제" title="바로 진행">
          <div className="image-deck image-deck--split">
            <ImageCard src={page.images.product} label="상품" title={catalog[0]?.[0] ?? page.brand} />
            <ImageCard src={page.images.scene} label="배송" title={page.summary} />
          </div>
        </SectionBlock>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="mosaic-grid">
        <ImageCard hero src={page.images.hero} label={page.brand} title={page.industry} />
        <ImageCard src={page.images.scene} label="브랜드" title={page.card.summary} />
        <MiniPanel title="브랜드" rows={rowsFromStats(page)} chips={page.hero.badges} accent />
      </div>
    </>
  );
}

function BookingPage({ page, profile, route }) {
  const programs = makeCardsFromProfile(page, profile);
  const tokens = makeTokenChips(page, profile);
  const support = makeSupportRows(page, profile);
  const details = makeDetailRows(page, profile);
  const compareRows = makeCompareRows(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label={page.industry} title={page.brand} />
            <MiniPanel title="빠른 예약" rows={support} chips={tokens.slice(0, 4)} accent />
            <ImageCard src={page.images.scene} label={route.label} title={programs[0]?.[0] ?? page.nav[0]} />
          </div>
        </section>
        <SectionBlock label={page.nav[0]} title="지금 바로 고르는 일정">
          <PriceDeck items={programs.slice(0, 3)} />
        </SectionBlock>
        <div className="split-zone">
          <SectionBlock label={page.nav[1] || "상세"} title="공간과 프로그램">
            <div className="image-deck image-deck--split">
              <ImageCard src={page.images.product} label={page.nav[1] || "상세"} title={page.card.title} />
              <ImageCard src={page.images.scene} label={page.nav[2] || "현장"} title={page.card.summary} />
            </div>
          </SectionBlock>
          <MiniPanel title="오늘 상태" rows={rowsFromStats(page)} chips={tokens} />
        </div>
      </>
    );
  }

  if (route.kind === "browse") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="선택 가능한 구성">
          <PriceDeck items={programs} stack />
        </SectionBlock>
        <div className="split-zone split-zone--compact">
          <MiniPanel title="슬롯" rows={support} chips={tokens} accent />
          <ImageCard hero src={page.images.product} label="현장" title={page.industry} />
        </div>
      </>
    );
  }

  if (route.kind === "detail") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone">
          <ImageCard hero src={page.images.product} label={route.label} title={page.brand} />
          <MiniPanel title="상세" rows={details} chips={tokens} />
        </div>
        <SectionBlock label="비교" title="확인 후 선택">
          <CompareTable headers={["항목", "선택 1", "선택 2"]} rows={compareRows.slice(0, 5)} />
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "reserve") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone split-zone--compact">
          <MiniPanel title="예약 정보" rows={support} chips={tokens.slice(0, 4)} accent />
          <PriceDeck items={programs.slice(0, 3)} stack />
        </div>
        <SectionBlock label="확정" title="입력 후 바로 완료">
          <ImageCard hero src={page.images.scene} label="예약" title={page.summary} />
        </SectionBlock>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="split-zone">
        <ImageCard hero src={page.images.scene} label="안내" title={page.brand} />
        <MiniPanel title="방문 전 확인" rows={support.concat(rowsFromStats(page)).slice(0, 5)} chips={page.hero.badges} />
      </div>
    </>
  );
}

function SoftwarePage({ page, profile, route }) {
  const cards = makeCardsFromProfile(page, profile);
  const tokens = makeTokenChips(page, profile);
  const support = makeSupportRows(page, profile);
  const compareRows = makeCompareRows(page, profile);
  const pricing = makePriceItems(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label="Product" title={page.brand} />
            <MiniPanel title="실시간 보드" rows={support} chips={tokens} accent />
            <ImageCard src={page.images.product} label="Dashboard" title={cards[0]?.[0] ?? page.nav[0]} />
          </div>
        </section>
        <SectionBlock label={page.nav[0]} title="바로 시작하는 핵심 흐름">
          <CompareTable headers={["단계", "결과", "상태"]} rows={compareRows.slice(0, 5)} />
        </SectionBlock>
        <div className="split-zone">
          <SectionBlock label={page.nav[1] || "활용"} title="업무에서 바로 쓰는 장면">
            <PriceDeck items={cards.slice(0, 3)} />
          </SectionBlock>
          <MiniPanel title="핵심 지표" rows={rowsFromStats(page)} chips={tokens} />
        </div>
      </>
    );
  }

  if (route.kind === "features") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="기능 흐름">
          <CompareTable headers={["기능", "입력", "출력"]} rows={compareRows.slice(0, 6)} />
        </SectionBlock>
        <div className="split-zone split-zone--compact">
          <MiniPanel title="빠른 실행" rows={support} chips={tokens} />
          <ImageCard hero src={page.images.product} label="Flow" title={page.card.title} />
        </div>
      </>
    );
  }

  if (route.kind === "cases") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="실제 활용 장면">
          <PriceDeck items={cards} stack />
        </SectionBlock>
        <div className="image-deck image-deck--split">
          <ImageCard src={page.images.scene} label="Use case" title={page.industry} />
          <ImageCard src={page.images.hero} label="Team" title={page.brand} />
        </div>
      </>
    );
  }

  if (route.kind === "pricing") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone split-zone--compact">
          <PriceDeck items={pricing} />
          <MiniPanel title="도입 기준" rows={support} chips={tokens.slice(0, 4)} accent />
        </div>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="split-zone">
        <ImageCard hero src={page.images.scene} label="문의" title={page.brand} />
        <MiniPanel title="도입 문의" rows={support.concat(rowsFromStats(page)).slice(0, 5)} chips={page.hero.badges} accent />
      </div>
    </>
  );
}

function EventPage({ page, profile, route }) {
  const tickets = makeCardsFromProfile(page, profile);
  const lineup = chipValues(pickArray(page, profile.tokenKey));
  const schedule = makeCompareRows(page, profile);
  const support = makeSupportRows(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label={page.industry} title={page.brand} />
            <MiniPanel title="티켓" rows={support} chips={lineup.slice(0, 4)} accent />
            <ImageCard src={page.images.scene} label="Stage" title={page.card.title} />
          </div>
        </section>
        <SectionBlock label={page.nav[1] || "라인업"} title="오늘의 무대">
          <div className="token-rail token-rail--wide">
            {lineup.slice(0, 8).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </SectionBlock>
        <div className="split-zone">
          <SectionBlock label={page.nav[2] || "시간표"} title="입장 전 확인">
            <CompareTable headers={["구간", "시작", "무대"]} rows={schedule.slice(0, 5)} />
          </SectionBlock>
          <PriceDeck items={tickets.slice(0, 3)} stack />
        </div>
      </>
    );
  }

  if (route.kind === "lineup") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="무대별 라인업">
          <div className="token-rail token-rail--wide">
            {lineup.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </SectionBlock>
        <ImageCard hero src={page.images.hero} label="Poster" title={page.brand} />
      </>
    );
  }

  if (route.kind === "schedule") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="시간표">
          <CompareTable headers={["구간", "시작", "무대"]} rows={schedule} />
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "tickets") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone split-zone--compact">
          <PriceDeck items={tickets} stack />
          <MiniPanel title="구매 전 확인" rows={support} chips={lineup.slice(0, 4)} accent />
        </div>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="split-zone">
        <ImageCard hero src={page.images.scene} label="Guide" title={page.brand} />
        <MiniPanel title="현장 안내" rows={support.concat(rowsFromStats(page)).slice(0, 5)} chips={page.hero.badges} />
      </div>
    </>
  );
}

function StudioPage({ page, profile, route }) {
  const works = makeCardsFromProfile(page, profile);
  const process = makeTokenChips(page, profile);
  const support = makeSupportRows(page, profile);
  const services = makePriceItems(page, profile);
  const briefRows = makeCompareRows(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label={page.industry} title={page.brand} />
            <ImageCard src={page.images.product} label="Project" title={works[0]?.[0] ?? page.card.title} />
            <MiniPanel title="Process" rows={support} chips={process} accent />
          </div>
        </section>
        <SectionBlock label={page.nav[0]} title="대표 프로젝트">
          <div className="mosaic-grid">
            <ImageCard hero src={page.images.hero} label="Main" title={page.brand} />
            <ImageCard src={page.images.product} label="Detail" title={page.card.summary} />
            <ImageCard src={page.images.scene} label="Space" title={page.industry} />
          </div>
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "works") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="작업 보드">
          <PriceDeck items={works} stack />
        </SectionBlock>
        <div className="image-deck image-deck--split">
          <ImageCard src={page.images.hero} label="Project" title={works[0]?.[0] ?? page.brand} />
          <ImageCard src={page.images.scene} label="Site" title={page.summary} />
        </div>
      </>
    );
  }

  if (route.kind === "services") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="서비스 범위">
          <PriceDeck items={services} />
        </SectionBlock>
        <MiniPanel title="진행 방식" rows={support} chips={process} />
      </>
    );
  }

  if (route.kind === "brief") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="입력 항목">
          <CompareTable headers={["항목", "내용", "상태"]} rows={briefRows.slice(0, 5)} />
        </SectionBlock>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="split-zone">
        <ImageCard hero src={page.images.scene} label="Contact" title={page.brand} />
        <MiniPanel title="상담 연결" rows={support.concat(rowsFromStats(page)).slice(0, 5)} chips={page.hero.badges} accent />
      </div>
    </>
  );
}

function ClubPage({ page, profile, route }) {
  const feed = makeCardsFromKey(page, profile, profile.tokenKey);
  const perks = makeCardsFromKey(page, profile, profile.detailKey);
  const plans = makeCardsFromProfile(page, profile);
  const support = makeSupportRows(page, profile);

  if (route.kind === "home") {
    return (
      <>
        <section className={`hero-layout hero-layout--${profile.homeLayout}`}>
          <HeroLead
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            subtitle={page.hero.subtitle}
            badges={page.hero.badges}
            stats={page.stats}
            primary={page.hero.primary}
            secondary={page.hero.secondary}
          />
          <div className={`hero-visual hero-visual--${profile.homeLayout}`}>
            <ImageCard hero src={page.images.hero} label={page.industry} title={page.brand} />
            <MiniPanel title="멤버십" rows={support} chips={page.hero.badges} accent />
            <ImageCard src={page.images.scene} label="Club" title={page.card.title} />
          </div>
        </section>
        <div className="split-zone">
          <SectionBlock label={page.nav[1] || "피드"} title="지금 올라온 활동">
            <PriceDeck items={feed.slice(0, 3)} />
          </SectionBlock>
          <SectionBlock label={page.nav[2] || "혜택"} title="가입 후 바로 쓰는 혜택">
            <PriceDeck items={perks.slice(0, 3)} />
          </SectionBlock>
        </div>
      </>
    );
  }

  if (route.kind === "feed") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="멤버 피드">
          <PriceDeck items={feed} stack />
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "perks") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <SectionBlock label={route.label} title="멤버 혜택">
          <PriceDeck items={perks} stack />
        </SectionBlock>
      </>
    );
  }

  if (route.kind === "join") {
    return (
      <>
        <RouteLead page={page} profile={profile} route={route} />
        <div className="split-zone split-zone--compact">
          <PriceDeck items={plans} />
          <MiniPanel title="가입 전 확인" rows={support} chips={page.hero.badges} accent />
        </div>
      </>
    );
  }

  return (
    <>
      <RouteLead page={page} profile={profile} route={route} />
      <div className="split-zone">
        <ImageCard hero src={page.images.scene} label="Guide" title={page.brand} />
        <MiniPanel title="운영 안내" rows={support.concat(rowsFromStats(page)).slice(0, 5)} chips={page.hero.badges} />
      </div>
    </>
  );
}

function renderSiteRoute(page, route, profile) {
  switch (profile.family) {
    case "commerce":
      return <CommercePage page={page} profile={profile} route={route} />;
    case "booking":
      return <BookingPage page={page} profile={profile} route={route} />;
    case "software":
      return <SoftwarePage page={page} profile={profile} route={route} />;
    case "event":
      return <EventPage page={page} profile={profile} route={route} />;
    case "studio":
      return <StudioPage page={page} profile={profile} route={route} />;
    case "club":
      return <ClubPage page={page} profile={profile} route={route} />;
    default:
      return null;
  }
}

function SiteView({ page, route, viewMode, isMobileClient, onViewChange, onBack, onNavigate }) {
  const profile = siteProfiles[page.id];
  const [pointerStyle, onPointerMove] = useBackdropPointer();
  const framedMobilePreview = viewMode === "mobile" && !isMobileClient;

  return (
    <div
      className="page-view"
      data-tone={page.backdrop}
      data-page={page.id}
      data-view={viewMode}
      style={{ ...themeStyle(page.theme), ...pointerStyle }}
      onPointerMove={onPointerMove}
    >
      <SceneBackdrop tone={page.backdrop} />
      <div className="page-view__content">
        <div className={`page-view__device ${framedMobilePreview ? "page-view__device--mobile" : ""}`}>
          {framedMobilePreview ? <div className="page-view__device-notch" aria-hidden="true" /> : null}
          <div className="page-main">
            <MobileAwarePageTopbar
              page={page}
              profile={profile}
              route={route}
              viewMode={viewMode}
              showViewSwitch={!isMobileClient}
              onViewChange={onViewChange}
              onBack={onBack}
              onNavigate={onNavigate}
            />
            {renderSiteRoute(page, route, profile)}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundView({ onHome }) {
  return (
    <div className="gallery-home">
      <div className="gallery-topbar">
        <div className="gallery-topbar__brand">
          <strong>Route not found</strong>
          <span>존재하지 않는 경로입니다.</span>
        </div>
      </div>
      <section className="gallery-hero">
        <div className="gallery-hero__lead">
          <h1>다시 목록으로 이동</h1>
          <p>잘못된 경로이거나 아직 준비되지 않은 페이지입니다.</p>
          <button type="button" className="action-button action-button--primary" onClick={onHome}>
            목록으로
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname || "/");
  const [viewMode, setViewMode] = useState("desktop");
  const isMobileClient = useIsMobileClient();
  const pagesById = useMemo(() => Object.fromEntries(showcasePages.map((page) => [page.id, page])), []);

  useEffect(() => {
    const onPopState = () => {
      const nextPath = window.location.pathname || "/";
      if (nextPath === "/") {
        setViewMode("desktop");
      }
      setPathname(nextPath);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    const normalized = nextPath || "/";
    if (normalized === pathname) return;
    if (normalized === "/") {
      setViewMode("desktop");
    }
    window.history.pushState({}, "", normalized);
    window.scrollTo(0, 0);
    setPathname(normalized);
  };

  const routeState = parseAppPath(pathname);
  const page = routeState.kind === "site" ? pagesById[routeState.siteId] : null;

  return (
    <AnimatePresence mode="wait">
      {routeState.kind === "gallery" ? (
        <Motion.div
          key="gallery"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
        >
          <GalleryHome onOpen={navigate} />
        </Motion.div>
      ) : null}

      {routeState.kind === "site" && page ? (
        <Motion.div
          key={`${page.id}-${routeState.route.slug}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
        >
          <SiteView
            page={page}
            route={routeState.route}
            viewMode={isMobileClient ? "mobile" : viewMode}
            isMobileClient={isMobileClient}
            onViewChange={setViewMode}
            onBack={() => navigate("/")}
            onNavigate={navigate}
          />
        </Motion.div>
      ) : null}

      {routeState.kind === "not-found" ? (
        <Motion.div
          key="not-found"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
        >
          <NotFoundView onHome={() => navigate("/")} />
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
}
