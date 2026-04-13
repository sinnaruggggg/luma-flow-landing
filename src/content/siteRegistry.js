import { showcasePages } from "./showcasePages";
import { getBlueprintForSite, getRoutesForSite } from "../../scripts/stitch-blueprints.mjs";

const stitchScreens = import.meta.glob("../../design/stitch/*/screens/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const siteExperiencePresets = {
  "sneaker-drop": {
    homeStyle: "drop-cascade",
    firstScreenMode: "제품 디테일 선행형",
    mobileFocus: "모바일은 드롭 타이머와 즉시 구매를 첫 화면에 고정한다.",
  },
  "supplement-brand": {
    homeStyle: "routine-split",
    firstScreenMode: "제품 구성 선행형",
    mobileFocus: "모바일은 루틴 선택과 구독 전환을 한 화면에 묶는다.",
  },
  "boxing-gym": {
    homeStyle: "reservation-punch",
    firstScreenMode: "예약 위젯 선행형",
    mobileFocus: "모바일은 체험 예약 슬롯과 코치 매칭을 먼저 노출한다.",
  },
  "wealth-app": {
    homeStyle: "dashboard-bento",
    firstScreenMode: "대시보드형",
    mobileFocus: "모바일은 KPI와 목표 진행 상태를 카드 우선으로 쌓는다.",
  },
  "skin-clinic": {
    homeStyle: "clinic-stack",
    firstScreenMode: "예약 위젯 선행형",
    mobileFocus: "모바일은 진단 CTA와 예약 슬롯을 상단에 고정한다.",
  },
  "arch-studio": {
    homeStyle: "editorial-canvas",
    firstScreenMode: "에디토리얼형",
    mobileFocus: "모바일은 프로젝트 사진과 브리프 CTA를 잡지처럼 순차 배치한다.",
  },
  "beauty-flash-sale": {
    homeStyle: "poster-sale",
    firstScreenMode: "포스터형",
    mobileFocus: "모바일은 할인, 세트, 컬러 스와치를 세로 리듬으로 쌓는다.",
  },
  "festival-page": {
    homeStyle: "festival-poster",
    firstScreenMode: "포스터형",
    mobileFocus: "모바일은 라인업과 티켓 가격을 포스터 하단 카드로 붙인다.",
  },
  "creator-club": {
    homeStyle: "community-feed",
    firstScreenMode: "피드형",
    mobileFocus: "모바일은 활동 피드와 가입 플랜을 한 손 엄지선에 배치한다.",
  },
  "ev-mobility": {
    homeStyle: "mobility-compare",
    firstScreenMode: "비교 대시보드형",
    mobileFocus: "모바일은 모델 비교, 충전, 시승 예약 순으로 정보를 압축한다.",
  },
  "gaming-gear": {
    homeStyle: "setup-command",
    firstScreenMode: "셋업 선행형",
    mobileFocus: "모바일은 번들 스펙과 장바구니 진입을 우선한다.",
  },
  "ai-saas": {
    homeStyle: "workflow-graph",
    firstScreenMode: "워크플로 보드형",
    mobileFocus: "모바일은 플로우 단계와 데모 시작을 카드 중심으로 전개한다.",
  },
  "indie-bookstore": {
    homeStyle: "shelf-editorial",
    firstScreenMode: "에디토리얼형",
    mobileFocus: "모바일은 큐레이션 메모와 추천 서가를 종이 노트처럼 쌓는다.",
  },
  "stationery-shop": {
    homeStyle: "paper-kit",
    firstScreenMode: "콜라주 키트형",
    mobileFocus: "모바일은 키트 구성과 컬러 스와치를 손안의 보드처럼 재배치한다.",
  },
  "local-cafe": {
    homeStyle: "cafe-window",
    firstScreenMode: "매장 윈도우형",
    mobileFocus: "모바일은 오늘 메뉴와 좌석 예약을 상단 2블록으로 정리한다.",
  },
  "boutique-hotel": {
    homeStyle: "hotel-booking",
    firstScreenMode: "대형 배경 이미지형",
    mobileFocus: "모바일은 객실 이미지 위에 예약 바를 먼저 보여준다.",
  },
  "perfume-house": {
    homeStyle: "scent-mood",
    firstScreenMode: "무드 디테일형",
    mobileFocus: "모바일은 노트, 세트, 선물 CTA를 향수 병 디테일 아래에 쌓는다.",
  },
  "furniture-store": {
    homeStyle: "room-planner",
    firstScreenMode: "공간 플래너형",
    mobileFocus: "모바일은 룸 선택과 배치 보기 CTA를 카드 위주로 압축한다.",
  },
  "youth-fashion": {
    homeStyle: "lookbook-rail",
    firstScreenMode: "룩북형",
    mobileFocus: "모바일은 룩 이미지와 쇼핑 진입을 세로 스택으로 바꾼다.",
  },
  "jewelry-brand": {
    homeStyle: "luxe-collection",
    firstScreenMode: "컬렉션형",
    mobileFocus: "모바일은 컬렉션과 상담 진입을 정교한 카드 리듬으로 구성한다.",
  },
};

const contentKeys = {
  "sneaker-drop": { primary: "drops", secondary: "quickTools", tertiary: "miniPanels" },
  "supplement-brand": { primary: "routines", secondary: "plans", tertiary: "compareRows" },
  "boxing-gym": { primary: "plans", secondary: "classSlots", tertiary: "coaches" },
  "wealth-app": { primary: "goals", secondary: "boards", tertiary: "cards" },
  "skin-clinic": { primary: "programs", secondary: "slots", tertiary: "doctors" },
  "arch-studio": { primary: "works", secondary: "process", tertiary: "briefRows" },
  "beauty-flash-sale": { primary: "kits", secondary: "shades", tertiary: "checkout" },
  "festival-page": { primary: "tickets", secondary: "lineup", tertiary: "timetable" },
  "creator-club": { primary: "passes", secondary: "perks", tertiary: "posts" },
  "ev-mobility": { primary: "models", secondary: "specs", tertiary: "planner" },
  "gaming-gear": { primary: "gear", secondary: "specs", tertiary: "cartRows" },
  "ai-saas": { primary: "useCases", secondary: "flows", tertiary: "kpis" },
  "indie-bookstore": { primary: "picks", secondary: "shelf", tertiary: "notes" },
  "stationery-shop": { primary: "kits", secondary: "colors", tertiary: "basket" },
  "local-cafe": { primary: "menus", secondary: "seats", tertiary: "storeRows" },
  "boutique-hotel": { primary: "rooms", secondary: "dates", tertiary: "perks" },
  "perfume-house": { primary: "sets", secondary: "notes", tertiary: "matches" },
  "furniture-store": { primary: "bundles", secondary: "rooms", tertiary: "placement" },
  "youth-fashion": { primary: "looks", secondary: "sizes", tertiary: "cartRows" },
  "jewelry-brand": { primary: "collections", secondary: "bespoke", tertiary: "consultRows" },
};

const routeImageKinds = {
  home: "hero",
  browse: "scene",
  detail: "product",
  checkout: "scene",
  brand: "scene",
  reserve: "scene",
  guide: "scene",
  features: "product",
  cases: "scene",
  pricing: "scene",
  contact: "scene",
  works: "hero",
  services: "scene",
  brief: "product",
  lineup: "hero",
  schedule: "product",
  tickets: "scene",
  feed: "scene",
  perks: "product",
  join: "scene",
};

function normalizeCard(item) {
  if (Array.isArray(item)) {
    if (item.length >= 3) {
      return { title: item[0], meta: item[1], value: item[2] };
    }

    if (item.length === 2) {
      return { title: item[0], meta: "", value: item[1] };
    }

    return { title: item[0], meta: "", value: "지금 보기" };
  }

  return { title: item, meta: "", value: "지금 보기" };
}

function normalizeRow(item) {
  if (Array.isArray(item)) {
    if (item.length >= 2) {
      return { label: item[0], value: item[item.length - 1] };
    }

    return { label: item[0], value: "" };
  }

  return { label: item, value: "" };
}

function normalizeTag(item) {
  if (Array.isArray(item)) {
    return `${item[0]}${item[1] ? ` · ${item[1]}` : ""}`;
  }

  return item;
}

function pickStitchScreen(siteId, pageSlug, deviceSuffix) {
  const prefix = `../../design/stitch/${siteId}/screens/${pageSlug}-${deviceSuffix}.`;
  return Object.entries(stitchScreens).find(([key]) => key.startsWith(prefix))?.[1] ?? null;
}

function pickArray(page, key) {
  const value = key ? page[key] : [];
  return Array.isArray(value) ? value : [];
}

function buildRouteAssets(page, routes) {
  return Object.fromEntries(
    routes.map((route) => {
      const fallbackKind = routeImageKinds[route.kind] ?? "scene";
      const desktopStitch = pickStitchScreen(page.id, route.slug, "desktop");
      const mobileStitch = pickStitchScreen(page.id, route.slug, "mobile");

      return [
        route.slug,
        {
          desktop: desktopStitch ?? page.images[fallbackKind] ?? page.images.hero,
          mobile:
            mobileStitch ??
            (route.kind === "home" ? page.images.product ?? page.images.hero : page.images[fallbackKind] ?? page.images.product),
          stitchReady: Boolean(desktopStitch && mobileStitch),
        },
      ];
    }),
  );
}

function buildContent(page) {
  const keys = contentKeys[page.id] ?? {};

  return {
    primary: pickArray(page, keys.primary).map(normalizeCard),
    secondary: pickArray(page, keys.secondary).map(normalizeTag),
    tertiary: pickArray(page, keys.tertiary).map(normalizeRow),
    stats: (page.stats ?? []).map(([value, label]) => ({ label, value })),
    badges: (page.hero?.badges ?? []).map(normalizeTag),
    widgets: (page.card?.widgets ?? []).map(normalizeTag),
  };
}

export function buildSitePath(siteId, slug = "home") {
  return slug === "home" ? `/${siteId}` : `/${siteId}/${slug}`;
}

export function parseSitePath(pathname) {
  const cleanPath = pathname === "/index.html" ? "/" : pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";

  if (cleanPath === "/") {
    return { kind: "gallery" };
  }

  const [siteId, pageSlug = "home"] = cleanPath.split("/").filter(Boolean);
  const site = siteRegistryById[siteId];

  if (!site) {
    return { kind: "not-found" };
  }

  const route = site.routes.find((entry) => entry.slug === pageSlug);
  if (!route) {
    return { kind: "not-found" };
  }

  return { kind: "site", siteId, route };
}

export const siteRegistry = showcasePages.map((page) => {
  const blueprint = getBlueprintForSite(page.id);
  const routes = getRoutesForSite(page.id);
  const presentation = siteExperiencePresets[page.id] ?? {
    homeStyle: "drop-cascade",
    firstScreenMode: "대형 비주얼형",
    mobileFocus: "모바일은 핵심 전환 행동을 첫 화면에 배치한다.",
  };
  const routeAssets = buildRouteAssets(page, routes);

  return {
    ...page,
    blueprint,
    presentation,
    routes,
    routeAssets,
    content: buildContent(page),
    gallery: {
      desktop: routeAssets.home.desktop,
      mobile: routeAssets.home.mobile,
      modeLabel: presentation.firstScreenMode,
      hook: blueprint.heroMode,
      stitchReady: routeAssets.home.stitchReady,
    },
  };
});

export const siteRegistryById = Object.fromEntries(siteRegistry.map((site) => [site.id, site]));
