import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { showcasePages } from "./content/showcasePages";
import { EffectStage } from "./components/interactiveEffects";
import "./app-v3.css";

const pageDesigns = {
  "sneaker-drop": { effect: "magnetic", preview: "drop", header: "ticker", hero: "drop" },
  "supplement-brand": { effect: "rain", preview: "product", header: "capsule", hero: "routine" },
  "boxing-gym": { effect: "links", preview: "gym", header: "score", hero: "training" },
  "wealth-app": { effect: "lens", preview: "dashboard", header: "ledger", hero: "dashboard" },
  "skin-clinic": { effect: "wave", preview: "clinic", header: "clean", hero: "clinic" },
  "arch-studio": { effect: "parallax", preview: "editorial", header: "editorial", hero: "studio" },
  "beauty-flash-sale": { effect: "fluid", preview: "sale", header: "promo", hero: "sale" },
  "festival-page": { effect: "rails", preview: "poster", header: "poster", hero: "poster" },
  "creator-club": { effect: "mesh", preview: "club", header: "club", hero: "feed" },
  "ev-mobility": { effect: "boxes", preview: "compare", header: "tech", hero: "compare" },
  "gaming-gear": { effect: "glitch", preview: "setup", header: "console", hero: "setup" },
  "ai-saas": { effect: "lines", preview: "bento", header: "glass", hero: "pipeline" },
  "indie-bookstore": { effect: "ink", preview: "shelf", header: "editorial", hero: "shelf" },
  "stationery-shop": { effect: "sand", preview: "paper", header: "paper", hero: "paper" },
  "local-cafe": { effect: "smoke", preview: "warm", header: "warm", hero: "menu" },
  "boutique-hotel": { effect: "jelly", preview: "stay", header: "luxe", hero: "stay" },
  "perfume-house": { effect: "slime", preview: "scent", header: "luxe", hero: "scent" },
  "furniture-store": { effect: "cloud", preview: "room", header: "organic", hero: "room" },
  "youth-fashion": { effect: "wind", preview: "fashion", header: "play", hero: "fashion" },
  "jewelry-brand": { effect: "hole", preview: "chrome", header: "chrome", hero: "jewelry" },
};

const SiteRouteContext = createContext(null);

const siteRoutes = {
  "sneaker-drop": [
    { slug: "home", label: "홈" },
    { slug: "drops", label: "드롭" },
    { slug: "looks", label: "룩북" },
    { slug: "cart", label: "장바구니" },
  ],
  "supplement-brand": [
    { slug: "home", label: "홈" },
    { slug: "routine", label: "루틴" },
    { slug: "compare", label: "비교" },
    { slug: "subscribe", label: "구독" },
  ],
  "boxing-gym": [
    { slug: "home", label: "홈" },
    { slug: "classes", label: "수업" },
    { slug: "coaches", label: "코치" },
    { slug: "join", label: "등록" },
  ],
  "wealth-app": [
    { slug: "home", label: "홈" },
    { slug: "features", label: "기능" },
    { slug: "cases", label: "활용" },
    { slug: "pricing", label: "요금" },
  ],
  "skin-clinic": [
    { slug: "home", label: "홈" },
    { slug: "programs", label: "프로그램" },
    { slug: "scan", label: "AI 진단" },
    { slug: "booking", label: "예약" },
  ],
  "arch-studio": [
    { slug: "home", label: "홈" },
    { slug: "works", label: "프로젝트" },
    { slug: "services", label: "서비스" },
    { slug: "contact", label: "문의" },
  ],
  "beauty-flash-sale": [
    { slug: "home", label: "홈" },
    { slug: "shop", label: "쇼핑" },
    { slug: "shades", label: "컬러" },
    { slug: "cart", label: "장바구니" },
  ],
  "festival-page": [
    { slug: "home", label: "홈" },
    { slug: "lineup", label: "라인업" },
    { slug: "schedule", label: "시간표" },
    { slug: "tickets", label: "티켓" },
  ],
  "creator-club": [
    { slug: "home", label: "홈" },
    { slug: "feed", label: "피드" },
    { slug: "perks", label: "혜택" },
    { slug: "join", label: "가입" },
  ],
  "ev-mobility": [
    { slug: "home", label: "홈" },
    { slug: "models", label: "모델" },
    { slug: "charge", label: "충전" },
    { slug: "drive", label: "시승" },
  ],
  "gaming-gear": [
    { slug: "home", label: "홈" },
    { slug: "gear", label: "기어" },
    { slug: "bundle", label: "번들" },
    { slug: "cart", label: "장바구니" },
  ],
  "ai-saas": [
    { slug: "home", label: "홈" },
    { slug: "flows", label: "플로우" },
    { slug: "cases", label: "사례" },
    { slug: "pricing", label: "요금" },
  ],
  "indie-bookstore": [
    { slug: "home", label: "홈" },
    { slug: "shelf", label: "큐레이션" },
    { slug: "picks", label: "추천" },
    { slug: "gift", label: "선물" },
  ],
  "stationery-shop": [
    { slug: "home", label: "홈" },
    { slug: "kits", label: "키트" },
    { slug: "colors", label: "컬러" },
    { slug: "basket", label: "바스켓" },
  ],
  "local-cafe": [
    { slug: "home", label: "홈" },
    { slug: "menu", label: "메뉴" },
    { slug: "visit", label: "매장" },
    { slug: "reserve", label: "예약" },
  ],
  "boutique-hotel": [
    { slug: "home", label: "홈" },
    { slug: "rooms", label: "객실" },
    { slug: "offers", label: "오퍼" },
    { slug: "booking", label: "예약" },
  ],
  "perfume-house": [
    { slug: "home", label: "홈" },
    { slug: "notes", label: "노트" },
    { slug: "sets", label: "세트" },
    { slug: "brand", label: "브랜드" },
  ],
  "furniture-store": [
    { slug: "home", label: "홈" },
    { slug: "rooms", label: "룸별" },
    { slug: "planner", label: "배치" },
    { slug: "cart", label: "구매" },
  ],
  "youth-fashion": [
    { slug: "home", label: "홈" },
    { slug: "looks", label: "룩북" },
    { slug: "shop", label: "쇼핑" },
    { slug: "cart", label: "장바구니" },
  ],
  "jewelry-brand": [
    { slug: "home", label: "홈" },
    { slug: "collection", label: "컬렉션" },
    { slug: "bespoke", label: "맞춤" },
    { slug: "consult", label: "상담" },
  ],
};

const subpageConfigs = {
  "sneaker-drop": {
    drops: { variant: "catalog", eyebrow: "오늘 드롭", title: "지금 고르면 바로 출고되는 라인업", itemsKey: "drops", chipsKey: "quickTools", mediaKey: "product", secondaryMediaKey: "scene", primary: "즉시 구매", secondary: "알림 받기", headingClass: "v3-heading--slam" },
    looks: { variant: "story", eyebrow: "룩북", title: "실착과 코디만 먼저 빠르게 보기", statsKey: "stats", chipsKey: "quickTools", mediaKey: "scene", gallery: ["hero", "product"], primary: "룩 저장", secondary: "사이즈 보기" },
    cart: { variant: "checkout", eyebrow: "장바구니", title: "오늘 결제하면 오늘 출고", rowsFrom: "drops", mediaKey: "product", summary: ["무료 교환 1회", "오늘 출고", "카드 즉시 할인"], primary: "결제하기", secondary: "계속 쇼핑" },
  },
  "supplement-brand": {
    routine: { variant: "catalog", eyebrow: "루틴", title: "목표별 조합을 바로 고르는 페이지", itemsKey: "routines", chipsKey: "plans", mediaKey: "hero", secondaryMediaKey: "product", primary: "루틴 시작", secondary: "성분 보기" },
    compare: { variant: "compare", eyebrow: "성분 비교", title: "운동 전과 회복 라인을 한 번에 비교", tableHeaders: ["항목", "퍼포먼스", "회복"], tableKey: "compareRows", chipsKey: "plans", mediaKey: "product", primary: "비교 저장", secondary: "추천 받기" },
    subscribe: { variant: "pricing", eyebrow: "구독", title: "매달 끊기지 않게 도착하는 루틴", items: [["Starter", "한 달 루틴", "월 39,000원"], ["Pro", "운동 전 + 회복", "월 79,000원"], ["Team", "3인 구성", "월 149,000원"]], chipsKey: "plans", mediaKey: "scene", primary: "구독 시작", secondary: "구성 보기" },
  },
  "boxing-gym": {
    classes: { variant: "booking", eyebrow: "수업 예약", title: "시간대와 반만 고르면 등록이 끝나는 구조", itemsKey: "plans", chipsKey: "classSlots", mediaKey: "hero", summary: ["체험 1회", "장갑 대여", "샤워실 이용"], primary: "체험 예약", secondary: "시간표 보기" },
    coaches: { variant: "story", eyebrow: "코치", title: "코치와 수업 톤을 먼저 보는 페이지", chipsKey: "coaches", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "코치 선택", secondary: "수업 보기" },
    join: { variant: "pricing", eyebrow: "등록", title: "입문부터 주 5회까지 바로 비교", itemsKey: "plans", chipsKey: "classSlots", mediaKey: "product", primary: "등록하기", secondary: "체험 먼저" },
  },
  "wealth-app": {
    features: { variant: "dashboard", eyebrow: "기능", title: "팀이 먼저 보는 목표 보드와 카드 추천", itemsKey: "goals", chipsKey: "boards", mediaKey: "hero", summaryKey: "cards", primary: "데모 시작", secondary: "기능 보기" },
    cases: { variant: "story", eyebrow: "활용", title: "주간 리포트와 카드 추천 흐름", chipsKey: "cards", statsKey: "stats", mediaKey: "product", gallery: ["hero", "scene"], primary: "리포트 보기", secondary: "예시 열기" },
    pricing: { variant: "pricing", eyebrow: "요금", title: "개인부터 팀까지 바로 시작하는 요금", items: [["Starter", "개인", "월 0원"], ["Pro", "목표 보드", "월 39,000원"], ["Scale", "권한 관리", "월 99,000원"]], chipsKey: "boards", mediaKey: "scene", primary: "무료 시작", secondary: "상담 요청" },
  },
  "skin-clinic": {
    programs: { variant: "booking", eyebrow: "프로그램", title: "피부 고민별 프로그램을 바로 예약", itemsKey: "programs", chipsKey: "slots", mediaKey: "hero", summaryKey: "doctors", primary: "예약하기", secondary: "비교 보기", headingClass: "v3-heading--serif" },
    scan: { variant: "story", eyebrow: "AI 진단", title: "스캔 결과와 상담 포인트를 먼저 보는 화면", chipsKey: "doctors", statsKey: "stats", mediaKey: "product", gallery: ["hero", "scene"], primary: "진단 시작", secondary: "결과 보기", headingClass: "v3-heading--serif" },
    booking: { variant: "booking", eyebrow: "상담 예약", title: "가능 시간만 골라 빠르게 확정", itemsKey: "programs", chipsKey: "slots", mediaKey: "scene", summary: ["당일 예약 가능", "AI 사전 진단", "담당 원장 선택"], primary: "시간 선택", secondary: "전화 문의", headingClass: "v3-heading--serif" },
  },
  "arch-studio": {
    works: { variant: "portfolio", eyebrow: "프로젝트", title: "공간별 사례를 바로 훑는 포트폴리오", itemsKey: "works", chipsKey: "process", mediaKey: "hero", gallery: ["product", "scene"], primary: "사례 보기", secondary: "브리프 작성", headingClass: "v3-heading--serif" },
    services: { variant: "portfolio", eyebrow: "서비스", title: "설계부터 현장 디렉션까지 한 화면", items: [["설계", "평면 · 동선", "브리프"], ["스타일링", "가구 · 조명", "큐레이션"], ["현장", "시공 체크", "주 1회"]], chipsKey: "process", mediaKey: "product", gallery: ["hero", "scene"], primary: "상담 열기", secondary: "범위 보기", headingClass: "v3-heading--serif" },
    contact: { variant: "checkout", eyebrow: "프로젝트 문의", title: "예산과 일정만 고르면 바로 접수", rows: [["예산 범위", "5,000만원 이상"], ["공간 유형", "상업 공간"], ["착수 희망", "다음 달"]], mediaKey: "scene", summaryKey: "briefRows", primary: "문의 보내기", secondary: "사례 더 보기", headingClass: "v3-heading--serif" },
  },
  "beauty-flash-sale": {
    shop: { variant: "catalog", eyebrow: "쇼핑", title: "세트와 단품을 바로 고르는 세일 화면", itemsKey: "kits", chipsKey: "checkout", mediaKey: "hero", secondaryMediaKey: "product", primary: "구매하기", secondary: "세트 비교" },
    shades: { variant: "story", eyebrow: "컬러", title: "발색 컷과 추천 조합을 빠르게 확인", chipsKey: "shades", statsKey: "stats", mediaKey: "product", gallery: ["hero", "scene"], primary: "컬러 저장", secondary: "세트 담기" },
    cart: { variant: "checkout", eyebrow: "장바구니", title: "한정 할인 그대로 바로 결제", rowsFrom: "kits", mediaKey: "scene", summaryKey: "checkout", primary: "결제하기", secondary: "계속 쇼핑" },
  },
  "festival-page": {
    lineup: { variant: "timeline", eyebrow: "라인업", title: "헤드라이너부터 서브 스테이지까지 한 화면", itemsKey: "tickets", chipsKey: "lineup", mediaKey: "hero", scheduleKey: "lineup", primary: "티켓 구매", secondary: "시간표 보기", headingClass: "v3-heading--poster" },
    schedule: { variant: "timeline", eyebrow: "시간표", title: "입장 동선과 스테이지 시간을 먼저 확인", itemsKey: "tickets", chipsKey: "timetable", mediaKey: "scene", scheduleKey: "timetable", primary: "내 일정 저장", secondary: "티켓 보기", headingClass: "v3-heading--poster" },
    tickets: { variant: "pricing", eyebrow: "티켓", title: "원데이부터 패스까지 바로 비교", itemsKey: "tickets", chipsKey: "lineup", mediaKey: "product", primary: "구매하기", secondary: "입장 가이드", headingClass: "v3-heading--poster" },
  },
  "creator-club": {
    feed: { variant: "feed", eyebrow: "멤버 피드", title: "콘텐츠와 과제를 바로 보는 멤버 페이지", itemsKey: "passes", chipsKey: "posts", mediaKey: "hero", listKey: "posts", primary: "피드 열기", secondary: "플랜 보기" },
    perks: { variant: "feed", eyebrow: "혜택", title: "혜택과 제출 루틴을 한 번에 보기", itemsKey: "passes", chipsKey: "perks", mediaKey: "scene", listKey: "perks", primary: "혜택 보기", secondary: "가입하기" },
    join: { variant: "pricing", eyebrow: "가입", title: "월 단위로 바로 들어오는 멤버십", itemsKey: "passes", chipsKey: "perks", mediaKey: "product", primary: "가입하기", secondary: "포트폴리오 제출" },
  },
  "ev-mobility": {
    models: { variant: "compare", eyebrow: "모델 비교", title: "주행거리와 가격을 바로 비교", tableHeaders: ["모델", "핵심", "가격"], tableKey: "models", chipsKey: "specs", mediaKey: "hero", primary: "모델 선택", secondary: "시승 예약" },
    charge: { variant: "story", eyebrow: "충전", title: "충전 계획과 이동 루트를 미리 보는 화면", chipsKey: "planner", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "루트 저장", secondary: "시승 보기" },
    drive: { variant: "booking", eyebrow: "시승", title: "원하는 날짜와 모델만 골라 예약", itemsKey: "models", chipsKey: "planner", mediaKey: "product", summary: ["주말 가능", "즉시 확정", "충전 안내 포함"], primary: "예약 확정", secondary: "모델 비교" },
  },
  "gaming-gear": {
    gear: { variant: "catalog", eyebrow: "기어", title: "입문부터 하이엔드까지 바로 선택", itemsKey: "gear", chipsKey: "specs", mediaKey: "hero", secondaryMediaKey: "product", primary: "장비 담기", secondary: "스펙 보기" },
    bundle: { variant: "compare", eyebrow: "번들", title: "셋업 조합을 바로 비교", tableHeaders: ["구성", "포함", "가격"], tableKey: "gear", chipsKey: "cartRows", mediaKey: "scene", primary: "번들 담기", secondary: "커스텀 보기" },
    cart: { variant: "checkout", eyebrow: "장바구니", title: "세트 그대로 바로 결제", rowsFrom: "gear", mediaKey: "product", summaryKey: "cartRows", primary: "결제하기", secondary: "셋업 더 보기" },
  },
  "ai-saas": {
    flows: { variant: "dashboard", eyebrow: "플로우", title: "요약부터 분류까지 바로 보이는 흐름", itemsKey: "useCases", chipsKey: "flows", mediaKey: "hero", summaryKey: "kpis", primary: "데모 시작", secondary: "사례 보기" },
    cases: { variant: "feed", eyebrow: "활용 사례", title: "팀별 활용 화면을 바로 보는 페이지", itemsKey: "useCases", chipsKey: "kpis", mediaKey: "scene", listKey: "useCases", primary: "사례 열기", secondary: "요금 보기" },
    pricing: { variant: "pricing", eyebrow: "요금", title: "작업량 기준으로 바로 고르는 플랜", items: [["Starter", "개인 자동화", "월 29,000원"], ["Team", "협업 워크플로", "월 89,000원"], ["Scale", "SSO · 권한", "월 189,000원"]], chipsKey: "kpis", mediaKey: "product", primary: "무료 시작", secondary: "세일즈 문의" },
  },
  "indie-bookstore": {
    shelf: { variant: "catalog", eyebrow: "큐레이션", title: "진열대처럼 보는 추천 도서", itemsKey: "picks", chipsKey: "shelf", mediaKey: "hero", secondaryMediaKey: "scene", primary: "바로 담기", secondary: "리스트 저장", headingClass: "v3-heading--serif" },
    picks: { variant: "story", eyebrow: "추천", title: "메모와 태그 중심으로 고르는 방식", chipsKey: "notes", statsKey: "stats", mediaKey: "product", gallery: ["hero", "scene"], primary: "추천 받기", secondary: "선물 보기", headingClass: "v3-heading--serif" },
    gift: { variant: "checkout", eyebrow: "선물 세트", title: "세트와 포장을 한 번에 선택", rowsFrom: "picks", mediaKey: "scene", summary: ["리본 포장", "메시지 카드", "당일 출고"], primary: "선물 결제", secondary: "큐레이션 보기", headingClass: "v3-heading--serif" },
  },
  "stationery-shop": {
    kits: { variant: "catalog", eyebrow: "키트", title: "데스크 구성을 한 번에 고르는 페이지", itemsKey: "kits", chipsKey: "basket", mediaKey: "hero", secondaryMediaKey: "product", primary: "바로 담기", secondary: "구성 보기" },
    colors: { variant: "story", eyebrow: "컬러", title: "색감과 재질을 먼저 고르는 방식", chipsKey: "colors", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "색상 저장", secondary: "키트 보기" },
    basket: { variant: "checkout", eyebrow: "바스켓", title: "선물 구성을 바로 확정", rowsFrom: "kits", mediaKey: "product", summaryKey: "basket", primary: "주문하기", secondary: "계속 고르기" },
  },
  "local-cafe": {
    menu: { variant: "catalog", eyebrow: "메뉴", title: "오늘 메뉴와 페어링을 바로 고르는 페이지", itemsKey: "menus", chipsKey: "seats", mediaKey: "hero", secondaryMediaKey: "product", primary: "주문하기", secondary: "좌석 보기", headingClass: "v3-heading--serif" },
    visit: { variant: "story", eyebrow: "매장", title: "좌석과 매장 정보를 먼저 보는 화면", chipsKey: "storeRows", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "길찾기", secondary: "예약 보기", headingClass: "v3-heading--serif" },
    reserve: { variant: "booking", eyebrow: "예약", title: "좌석만 고르면 바로 예약 완료", itemsKey: "menus", chipsKey: "seats", mediaKey: "product", summaryKey: "storeRows", primary: "예약하기", secondary: "메뉴 보기", headingClass: "v3-heading--serif" },
  },
  "boutique-hotel": {
    rooms: { variant: "catalog", eyebrow: "객실", title: "뷰와 타입 기준으로 객실 비교", itemsKey: "rooms", chipsKey: "dates", mediaKey: "hero", secondaryMediaKey: "product", primary: "객실 선택", secondary: "예약 보기", headingClass: "v3-heading--serif" },
    offers: { variant: "story", eyebrow: "오퍼", title: "포함 혜택과 현장 컷을 먼저 보는 페이지", chipsKey: "perks", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "오퍼 저장", secondary: "예약 보기", headingClass: "v3-heading--serif" },
    booking: { variant: "booking", eyebrow: "예약", title: "날짜와 타입만 정하면 바로 확정", itemsKey: "rooms", chipsKey: "dates", mediaKey: "product", summaryKey: "perks", primary: "예약 확정", secondary: "객실 보기", headingClass: "v3-heading--serif" },
  },
  "perfume-house": {
    notes: { variant: "story", eyebrow: "향 노트", title: "노트와 무드만 빠르게 고르는 화면", chipsKey: "notes", statsKey: "stats", mediaKey: "hero", gallery: ["product", "scene"], primary: "노트 저장", secondary: "세트 보기", headingClass: "v3-heading--serif" },
    sets: { variant: "catalog", eyebrow: "세트", title: "디스커버리부터 풀사이즈까지 비교", itemsKey: "sets", chipsKey: "matches", mediaKey: "product", secondaryMediaKey: "scene", primary: "세트 구매", secondary: "노트 보기", headingClass: "v3-heading--serif" },
    brand: { variant: "story", eyebrow: "브랜드", title: "무드와 추천 조합 중심의 브랜드 페이지", chipsKey: "matches", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "매칭 보기", secondary: "세트 구매", headingClass: "v3-heading--serif" },
  },
  "furniture-store": {
    rooms: { variant: "catalog", eyebrow: "룸별", title: "공간 기준으로 가구를 바로 고르는 방식", itemsKey: "bundles", chipsKey: "rooms", mediaKey: "hero", secondaryMediaKey: "scene", primary: "번들 담기", secondary: "배치 보기", headingClass: "v3-heading--soft" },
    planner: { variant: "story", eyebrow: "배치 보기", title: "배치 옵션과 공간 컷을 바로 확인", chipsKey: "placement", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "배치 저장", secondary: "구매하기", headingClass: "v3-heading--soft" },
    cart: { variant: "checkout", eyebrow: "구매", title: "공간 세트를 그대로 바로 결제", rowsFrom: "bundles", mediaKey: "product", summaryKey: "placement", primary: "결제하기", secondary: "룸별 보기", headingClass: "v3-heading--soft" },
  },
  "youth-fashion": {
    looks: { variant: "story", eyebrow: "룩북", title: "룩부터 고르고 사이즈를 맞추는 방식", chipsKey: "sizes", statsKey: "stats", mediaKey: "hero", gallery: ["product", "scene"], primary: "룩 저장", secondary: "쇼핑 보기", headingClass: "v3-heading--shout" },
    shop: { variant: "catalog", eyebrow: "쇼핑", title: "카테고리보다 룩 중심으로 고르는 화면", itemsKey: "looks", chipsKey: "sizes", mediaKey: "product", secondaryMediaKey: "scene", primary: "바로 담기", secondary: "가상 착용" , headingClass: "v3-heading--shout"},
    cart: { variant: "checkout", eyebrow: "장바구니", title: "선택한 룩을 그대로 결제", rowsFrom: "looks", mediaKey: "scene", summaryKey: "cartRows", primary: "결제하기", secondary: "룩북 보기", headingClass: "v3-heading--shout" },
  },
  "jewelry-brand": {
    collection: { variant: "catalog", eyebrow: "컬렉션", title: "컬렉션과 가격을 바로 보는 페이지", itemsKey: "collections", chipsKey: "bespoke", mediaKey: "hero", secondaryMediaKey: "product", primary: "컬렉션 보기", secondary: "상담 예약", headingClass: "v3-heading--chrome" },
    bespoke: { variant: "story", eyebrow: "맞춤", title: "각인과 세팅 옵션을 먼저 확인", chipsKey: "bespoke", statsKey: "stats", mediaKey: "scene", gallery: ["hero", "product"], primary: "옵션 선택", secondary: "상담 예약", headingClass: "v3-heading--chrome" },
    consult: { variant: "booking", eyebrow: "상담", title: "방문 상담과 맞춤 주문을 바로 접수", itemsKey: "collections", chipsKey: "consultRows", mediaKey: "product", summaryKey: "consultRows", primary: "상담 예약", secondary: "컬렉션 보기", headingClass: "v3-heading--chrome" },
  },
};

function buildSitePath(siteId, slug = "home") {
  return slug === "home" ? `/${siteId}` : `/${siteId}/${slug}`;
}

function parseAppPath(pathname) {
  const cleanPath = pathname === "/index.html" ? "/" : pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  if (cleanPath === "/") return { kind: "gallery" };

  const parts = cleanPath.split("/").filter(Boolean);
  if (!parts.length) return { kind: "gallery" };

  const [siteId, pageSlug = "home"] = parts;
  const page = showcasePages.find((entry) => entry.id === siteId);
  if (!page) return { kind: "not-found" };

  const routes = siteRoutes[siteId] ?? [{ slug: "home", label: "홈" }];
  if (!routes.some((route) => route.slug === pageSlug)) {
    return { kind: "not-found", siteId };
  }

  return { kind: "site", siteId, pageSlug };
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

function Pill({ children, dark = false, className = "" }) {
  return <span className={`v3-pill ${dark ? "v3-pill--dark" : ""} ${className}`}>{children}</span>;
}

function ActionRow({ primary, secondary, className = "" }) {
  return (
    <div className={`v3-actions ${className}`}>
      <button type="button" className="v3-button v3-button--primary">
        {primary}
        <ArrowRight size={17} />
      </button>
      <button type="button" className="v3-button v3-button--ghost">
        {secondary}
      </button>
    </div>
  );
}

function StatRail({ items = [], className = "" }) {
  return (
    <div className={`v3-stats ${className}`}>
      {items.map(([value, label]) => (
        <article key={`${value}-${label}`} className="v3-stat">
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}

function PriceTiles({ items = [], className = "", compact = false }) {
  return (
    <div className={`v3-priceTiles ${compact ? "v3-priceTiles--compact" : ""} ${className}`}>
      {items.map(([title, meta, value]) => (
        <article key={`${title}-${value}`} className="v3-priceTile">
          <span>{meta}</span>
          <strong>{title}</strong>
          <em>{value}</em>
        </article>
      ))}
    </div>
  );
}

function ChipStrip({ items = [], className = "" }) {
  return (
    <div className={`v3-chipStrip ${className}`}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function MediaCard({ src, label, title, className = "" }) {
  return (
    <figure className={`v3-media ${className}`}>
      <img src={src} alt={title} />
      <figcaption>
        <span>{label}</span>
        <strong>{title}</strong>
      </figcaption>
    </figure>
  );
}

function SiteHeader({ page, variant = "", right = null, center = null }) {
  const routeState = useContext(SiteRouteContext);

  return (
    <header className={`v3-siteHeader v3-siteHeader--${variant}`}>
      <div className="v3-siteHeader__brand">
        <span>{page.industry}</span>
        <strong>{page.brand}</strong>
      </div>
      {center ? (
        <div className="v3-siteHeader__center">{center}</div>
      ) : routeState ? (
        <div className="v3-siteHeader__nav v3-siteHeader__nav--interactive">
          {routeState.routes.map((route) => (
            <button
              key={route.slug}
              type="button"
              className={`v3-routeButton ${routeState.currentSlug === route.slug ? "is-active" : ""}`}
              onClick={() => routeState.onNavigate(route.slug)}
            >
              {route.label}
            </button>
          ))}
        </div>
      ) : (
        <ChipStrip items={page.nav} className="v3-siteHeader__nav" />
      )}
      <div className="v3-siteHeader__right">{right ?? <button type="button" className="v3-inlineButton">{page.hero.primary}</button>}</div>
    </header>
  );
}

function IntroBlock({ page, className = "", headingClass = "" }) {
  return (
    <div className={`v3-intro ${className}`}>
      <div className="v3-intro__top">
        <Pill>{page.hero.eyebrow}</Pill>
        <ChipStrip items={page.hero.badges} className="v3-intro__badges" />
      </div>
      <h1 className={`v3-heading ${headingClass}`}>{page.hero.title}</h1>
      <p className="v3-subcopy">{page.hero.subtitle}</p>
      <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
    </div>
  );
}

function SectionHeading({ label, title, className = "" }) {
  return (
    <div className={`v3-sectionHeading ${className}`}>
      <span>{label}</span>
      <h2>{title}</h2>
    </div>
  );
}

function GalleryCard({ page, onOpen }) {
  const design = pageDesigns[page.id];
  const routeCount = siteRoutes[page.id]?.length ?? 1;

  return (
    <Motion.button
      type="button"
      className="v3-card"
      data-preview={design.preview}
      onClick={() => onOpen(page.id)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      <div className="v3-card__stage">
        <EffectStage kind={design.effect} density="card" />
        <img className="v3-card__image" src={page.images.hero} alt={`${page.brand} 미리보기`} />
        <div className="v3-card__mask" />
        <div className="v3-card__chips">
          <Pill className="v3-card__eyebrow" dark={design.preview === "poster" || design.preview === "chrome"}>
            {page.card.eyebrow}
          </Pill>
          <div className="v3-card__metrics">
            {page.card.widgets.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="v3-card__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
      </div>
      <div className="v3-card__body">
        <div className="v3-card__nav">
          {siteRoutes[page.id].slice(0, 4).map((route) => (
            <span key={route.slug}>{route.label}</span>
          ))}
        </div>
        <h3>{page.card.title}</h3>
        <p>{page.summary}</p>
        <span className="v3-card__action">
          {routeCount}개 페이지 보기
          <ChevronRight size={18} />
        </span>
      </div>
    </Motion.button>
  );
}

function GalleryHome({ pages, onOpen }) {
  return (
    <div className="v3-app">
      <div className="v3-home">
        <div className="v3-home__halo" />
        <header className="v3-home__topbar">
          <div className="v3-home__brand">
            <span className="v3-home__spark">
              <Sparkles size={14} />
            </span>
            <strong>LUMA FLOW</strong>
          </div>
          <div className="v3-home__meta">
            <span>20개 독립 사이트</span>
            <span>실무형 14 / 실험형 6</span>
            <span>Spline + 인터랙션 참고</span>
          </div>
        </header>
        <section className="v3-home__hero">
          <Pill>실제 구동 샘플</Pill>
          <h1>같은 크기의 썸네일에서 고르고, 들어가면 바로 운영 중인 사이트 화면</h1>
          <p>소개 페이지 없이 바로 홈으로 진입합니다. 각 샘플은 내부 4개 내외 페이지로 이어집니다.</p>
        </section>
        <section className="v3-home__grid">
          {pages.map((page, index) => (
            <Motion.div
              key={page.id}
              className="v3-home__cell"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <GalleryCard page={page} onOpen={onOpen} />
            </Motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

function resolveCollection(page, key) {
  if (!key) return [];
  return page[key] ?? [];
}

function resolveRouteRows(page, config) {
  if (config.rows) return config.rows;
  if (!config.rowsFrom) return [];
  const source = page[config.rowsFrom] ?? [];

  return source.slice(0, 3).map((item) => {
    if (Array.isArray(item)) {
      return [item[0], item[item.length - 1]];
    }
    return [item, ""];
  });
}

function RouteIntro({ page, config }) {
  return (
    <div className="v3-subHero__copy">
      <Pill>{config.eyebrow}</Pill>
      <h1 className={`v3-routeTitle ${config.headingClass ?? ""}`}>{config.title}</h1>
      <p className="v3-subcopy">{config.subtitle ?? page.summary}</p>
      <ActionRow primary={config.primary ?? page.hero.primary} secondary={config.secondary ?? page.hero.secondary} />
      <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? page.hero.badges} className="v3-chipStrip--wide" />
    </div>
  );
}

function RouteMediaSet({ page, config }) {
  const gallery = config.gallery ?? [];

  if (!gallery.length) return null;

  return (
    <div className="v3-gridSection">
      {gallery.map((mediaKey) => (
        <MediaCard key={mediaKey} src={page.images[mediaKey]} label="추가 화면" title={page.brand} />
      ))}
    </div>
  );
}

function CatalogSubpage({ page, config }) {
  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={resolveCollection(page, config.itemsKey).length ? resolveCollection(page, config.itemsKey) : config.items} />
        <div className="v3-callout">
          <span>빠른 선택</span>
          <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? []} />
          {config.secondaryMediaKey ? <MediaCard src={page.images[config.secondaryMediaKey]} label="상세 컷" title={page.brand} /> : null}
        </div>
      </section>
    </>
  );
}

function StorySubpage({ page, config }) {
  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <div className="v3-panelStack">
          {resolveCollection(page, config.statsKey).length ? <StatRail items={resolveCollection(page, config.statsKey)} /> : null}
          <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
        </div>
      </section>
      <RouteMediaSet page={page} config={config} />
    </>
  );
}

function CheckoutSubpage({ page, config }) {
  const rows = resolveRouteRows(page, config);
  const summary = resolveCollection(page, config.summaryKey).length ? resolveCollection(page, config.summaryKey) : config.summary ?? [];

  return (
    <section className="v3-subHero">
      <RouteIntro page={page} config={config} />
      <div className="v3-checkoutPanel">
        <MediaCard src={page.images[config.mediaKey ?? "product"]} label={config.eyebrow} title={page.brand} className="v3-checkoutPanel__media" />
        <div className="v3-orderList">
          {rows.map(([label, value]) => (
            <div key={`${label}-${value}`} className="v3-orderList__row">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <ChipStrip items={summary} className="v3-chipStrip--wide" />
      </div>
    </section>
  );
}

function BookingSubpage({ page, config }) {
  const items = resolveCollection(page, config.itemsKey).length ? resolveCollection(page, config.itemsKey) : config.items ?? [];
  const summary = resolveCollection(page, config.summaryKey).length ? resolveCollection(page, config.summaryKey) : config.summary ?? [];

  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={items} />
        <div className="v3-bookingPanel">
          <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? []} className="v3-chipStrip--wide" />
          <div className="v3-formStack">
            <span>이름</span>
            <span>연락처</span>
            <span>희망 일정</span>
          </div>
          <ChipStrip items={summary} />
        </div>
      </section>
    </>
  );
}

function CompareSubpage({ page, config }) {
  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <div className="v3-compareBox">
          <SectionHeading label={config.eyebrow} title={config.tableTitle ?? "한 번에 비교"} />
          <CompareTable headers={config.tableHeaders} rows={resolveCollection(page, config.tableKey)} />
        </div>
        <div className="v3-callout">
          <span>바로 선택</span>
          <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? []} />
        </div>
      </section>
    </>
  );
}

function PricingSubpage({ page, config }) {
  const items = resolveCollection(page, config.itemsKey).length ? resolveCollection(page, config.itemsKey) : config.items ?? [];

  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "scene"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={items} />
        <div className="v3-callout">
          <span>빠른 비교</span>
          <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? []} className="v3-chipStrip--wide" />
        </div>
      </section>
    </>
  );
}

function DashboardSubpage({ page, config }) {
  const items = resolveCollection(page, config.itemsKey).length ? resolveCollection(page, config.itemsKey) : config.items ?? [];
  const summary = resolveCollection(page, config.summaryKey).length ? resolveCollection(page, config.summaryKey) : config.summary ?? [];

  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={items} />
        <div className="v3-callout v3-callout--dark">
          <span>바로 쓰는 흐름</span>
          <ChipStrip items={summary} className="v3-chipStrip--wide" />
        </div>
      </section>
    </>
  );
}

function TimelineSubpage({ page, config }) {
  const schedule = resolveCollection(page, config.scheduleKey).length ? resolveCollection(page, config.scheduleKey) : config.schedule ?? [];

  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <div className="v3-callout v3-callout--dark">
          <SectionHeading label="스케줄" title="오늘 동선" />
          <ChipStrip items={schedule} className="v3-chipStrip--wide" />
        </div>
        <PriceTiles items={resolveCollection(page, config.itemsKey)} />
      </section>
    </>
  );
}

function FeedSubpage({ page, config }) {
  const list = resolveCollection(page, config.listKey).length ? resolveCollection(page, config.listKey) : config.list ?? [];

  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={resolveCollection(page, config.itemsKey)} />
        <div className="v3-callout v3-callout--soft">
          <span>바로 확인</span>
          <ChipStrip items={list} className="v3-chipStrip--wide" />
        </div>
      </section>
    </>
  );
}

function PortfolioSubpage({ page, config }) {
  return (
    <>
      <section className="v3-subHero">
        <RouteIntro page={page} config={config} />
        <MediaCard src={page.images[config.mediaKey ?? "hero"]} label={config.eyebrow} title={page.brand} className="v3-subHero__media" />
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={resolveCollection(page, config.itemsKey).length ? resolveCollection(page, config.itemsKey) : config.items ?? []} />
        <div className="v3-callout">
          <span>프로세스</span>
          <ChipStrip items={resolveCollection(page, config.chipsKey).length ? resolveCollection(page, config.chipsKey) : config.chips ?? []} className="v3-chipStrip--wide" />
        </div>
      </section>
      <RouteMediaSet page={page} config={config} />
    </>
  );
}

function renderSubpageContent(page, pageSlug) {
  const config = subpageConfigs[page.id]?.[pageSlug];
  if (!config) return null;

  switch (config.variant) {
    case "catalog":
      return <CatalogSubpage page={page} config={config} />;
    case "story":
      return <StorySubpage page={page} config={config} />;
    case "checkout":
      return <CheckoutSubpage page={page} config={config} />;
    case "booking":
      return <BookingSubpage page={page} config={config} />;
    case "compare":
      return <CompareSubpage page={page} config={config} />;
    case "pricing":
      return <PricingSubpage page={page} config={config} />;
    case "dashboard":
      return <DashboardSubpage page={page} config={config} />;
    case "timeline":
      return <TimelineSubpage page={page} config={config} />;
    case "feed":
      return <FeedSubpage page={page} config={config} />;
    case "portfolio":
      return <PortfolioSubpage page={page} config={config} />;
    default:
      return null;
  }
}

function PageFrame({ page, onBack, children }) {
  const design = pageDesigns[page.id];

  return (
    <div className="v3-page" data-page={page.id} data-tone={page.backdrop} data-preview={design.preview} style={themeStyle(page.theme)}>
      <div className="v3-page__ambient">
        <div className="v3-page__glow" />
        <div className="v3-page__grain" />
      </div>
      <button type="button" className="v3-back" onClick={onBack}>
        <ArrowLeft size={16} />
        샘플 목록
      </button>
      <div className="v3-page__inner">{children}</div>
    </div>
  );
}

function SneakerDropPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="ticker" right={<Pill dark>DROP 20:00</Pill>} />
      <section className="v3-scene v3-scene--drop">
        <IntroBlock page={page} headingClass="v3-heading--slam" />
        <div className="v3-stageCard v3-stageCard--drop">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="오늘 드롭" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-floatingInfo">
            {page.miniPanels.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <MediaCard src={page.images.product} label="신규 룩" title="Aero Runner" className="v3-stageCard__float" />
        </div>
      </section>
      <section className="v3-strip">
        <SectionHeading label="드롭" title="지금 담는 구성" />
        <PriceTiles items={page.drops} />
      </section>
      <section className="v3-duo">
        <div className="v3-callout v3-callout--sharp">
          <span>빠른 기능</span>
          <ChipStrip items={page.quickTools} />
        </div>
        <MediaCard src={page.images.scene} label="매장 컷" title="현장 룩" />
      </section>
    </PageFrame>
  );
}

function SupplementBrandPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="capsule" right={<Pill dark>구독 ON</Pill>} />
      <section className="v3-scene v3-scene--routine">
        <div className="v3-stackPanel">
          <IntroBlock page={page} />
          <StatRail items={page.stats} />
        </div>
        <div className="v3-stageCard v3-stageCard--routine">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="루틴 빌더" title={page.brand} className="v3-stageCard__hero" />
          <PriceTiles items={page.routines} compact className="v3-stageCard__dock" />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-compareBox">
          <SectionHeading label="성분" title="한 줄 비교" />
          <div className="v3-compareTable">
            <div className="v3-compareTable__head">
              <span>항목</span>
              <span>퍼포먼스</span>
              <span>회복</span>
            </div>
            {page.compareRows.map((row) => (
              <div key={row.join("-")} className="v3-compareTable__row">
                {row.map((cell) => (
                  <span key={cell}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="v3-callout">
          <span>구독 플랜</span>
          <ChipStrip items={page.plans} />
          <MediaCard src={page.images.product} label="추천 세트" title="오늘 조합" />
        </div>
      </section>
    </PageFrame>
  );
}

function BoxingGymPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="score" right={<Pill dark>{page.classSlots[0]}</Pill>} />
      <section className="v3-scene v3-scene--training">
        <div className="v3-scoreHero">
          <IntroBlock page={page} headingClass="v3-heading--impact" />
          <StatRail items={page.stats} className="v3-stats--boxed" />
        </div>
        <div className="v3-trainingBoard">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <div className="v3-trainingBoard__slots">
            {page.classSlots.map((slot) => (
              <span key={slot}>{slot}</span>
            ))}
          </div>
          <MediaCard src={page.images.hero} label="체험 등록" title={page.brand} />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-callout v3-callout--sharp">
          <span>코치</span>
          <ChipStrip items={page.coaches} />
        </div>
        <PriceTiles items={page.plans} />
      </section>
      <MediaCard src={page.images.scene} label="현장" title="체육관 컷" className="v3-fullMedia" />
    </PageFrame>
  );
}

function WealthAppPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="ledger" right={<Pill>무료 시작</Pill>} />
      <section className="v3-dashboardHero">
        <aside className="v3-dashboardHero__aside">
          <IntroBlock page={page} />
          <div className="v3-railPanel">
            {page.boards.map((board) => (
              <span key={board}>{board}</span>
            ))}
          </div>
        </aside>
        <div className="v3-dashboardHero__main">
          <div className="v3-dashboardShell">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <MediaCard src={page.images.hero} label="대시보드" title="이번 달" className="v3-dashboardShell__hero" />
            <StatRail items={page.stats} className="v3-dashboardShell__stats" />
          </div>
          <PriceTiles items={page.goals} compact />
        </div>
      </section>
      <section className="v3-gridSection">
        <MediaCard src={page.images.product} label="리포트" title="주간 요약" />
        <div className="v3-callout">
          <span>추천 카드</span>
          <ChipStrip items={page.cards} />
        </div>
      </section>
    </PageFrame>
  );
}

function SkinClinicPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="clean" right={<Pill>예약 가능</Pill>} />
      <section className="v3-clinicHero">
        <div className="v3-clinicHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <div className="v3-bookingWidget">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <span>AI 스캔</span>
            {page.slots.slice(0, 3).map((slot) => (
              <strong key={slot}>{slot}</strong>
            ))}
          </div>
        </div>
        <MediaCard src={page.images.hero} label="상담실" title={page.brand} className="v3-clinicHero__media" />
      </section>
      <PriceTiles items={page.programs} />
      <section className="v3-gridSection">
        <div className="v3-callout">
          <span>의료진</span>
          <ChipStrip items={page.doctors} />
        </div>
        <div className="v3-callout">
          <span>예약 가능</span>
          <ChipStrip items={page.slots} />
        </div>
      </section>
    </PageFrame>
  );
}

function ArchStudioPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="editorial" right={<Pill>브리프 접수</Pill>} />
      <section className="v3-editorialHero">
        <div className="v3-editorialHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.works} />
        </div>
        <div className="v3-mosaic">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="프로젝트" title="메인 작업" className="v3-mosaic__large" />
          <MediaCard src={page.images.product} label="도면" title="제안 컷" />
          <MediaCard src={page.images.scene} label="현장" title="오픈 컷" />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-callout">
          <span>진행</span>
          <ChipStrip items={page.process} />
        </div>
        <div className="v3-callout">
          <span>브리프</span>
          {page.briefRows.map(([label, value]) => (
            <div key={label} className="v3-metaLine">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function BeautyFlashSalePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="promo" right={<Pill dark>FLASH SALE</Pill>} />
      <section className="v3-saleHero">
        <div className="v3-saleHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.checkout} className="v3-chipStrip--bold" />
        </div>
        <div className="v3-stageCard v3-stageCard--sale">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="핫딜" title={page.brand} className="v3-salePoster__main" />
          <MediaCard src={page.images.product} label="발색" title="컬러 컷" className="v3-salePoster__side" />
        </div>
      </section>
      <PriceTiles items={page.kits} />
      <section className="v3-callout v3-callout--soft">
        <span>컬러 먼저</span>
        <ChipStrip items={page.shades} className="v3-chipStrip--color" />
      </section>
    </PageFrame>
  );
}

function FestivalPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="poster" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">티켓 구매</button>} />
      <section className="v3-posterHero">
        <div className="v3-posterHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--poster" />
          <StatRail items={page.stats} />
        </div>
        <div className="v3-stageCard v3-stageCard--poster">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <div className="v3-lineupRail">
            {page.lineup.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <MediaCard src={page.images.hero} label="메인 스테이지" title={page.brand} className="v3-posterHero__media" />
        </div>
      </section>
      <section className="v3-callout v3-callout--dark">
        <SectionHeading label="시간표" title="오늘 동선" />
        <ChipStrip items={page.timetable} className="v3-chipStrip--wide" />
      </section>
      <PriceTiles items={page.tickets} />
    </PageFrame>
  );
}

function CreatorClubPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="club" right={<Pill dark>월 39,000원</Pill>} />
      <section className="v3-feedHero">
        <div className="v3-feedHero__left">
          <IntroBlock page={page} />
          <PriceTiles items={page.passes} compact />
        </div>
        <div className="v3-feedHero__right">
          <div className="v3-feedBoard">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <MediaCard src={page.images.hero} label="멤버십" title={page.brand} className="v3-feedBoard__hero" />
            <div className="v3-feedBoard__posts">
              {page.posts.map((post) => (
                <span key={post}>{post}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="v3-gridSection">
        <div className="v3-callout v3-callout--soft">
          <span>혜택</span>
          <ChipStrip items={page.perks} />
        </div>
        <MediaCard src={page.images.scene} label="이벤트" title="커뮤니티 컷" />
      </div>
    </PageFrame>
  );
}

function EvMobilityPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="tech" right={<Pill>다음 시승 토 11:00</Pill>} />
      <section className="v3-compareHero">
        <div className="v3-compareHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.specs} className="v3-chipStrip--tech" />
        </div>
        <div className="v3-stageCard v3-stageCard--compare">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="시승 예약" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-plannerDock">
            {page.planner.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.models} />
    </PageFrame>
  );
}

function GamingGearPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="console" right={<Pill dark>Cart 3</Pill>} />
      <section className="v3-setupHero">
        <div className="v3-stageCard v3-stageCard--setup">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="셋업" title={page.brand} className="v3-stageCard__hero" />
        </div>
        <div className="v3-setupHero__side">
          <IntroBlock page={page} />
          <div className="v3-callout v3-callout--dark">
            <span>카트</span>
            <ChipStrip items={page.cartRows} />
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.gear} />
        <div className="v3-callout v3-callout--dark">
          <span>핵심 사양</span>
          <ChipStrip items={page.specs} />
        </div>
      </section>
    </PageFrame>
  );
}

function AiSaasPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="glass" right={<Pill>Demo Live</Pill>} />
      <section className="v3-bentoHero">
        <div className="v3-bentoHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.flows} className="v3-chipStrip--tech" />
        </div>
        <div className="v3-stageCard v3-stageCard--bento">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="실시간 데모" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-miniBento">
            {page.useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-callout v3-callout--dark">
        <SectionHeading label="성과" title="팀이 먼저 보는 숫자" />
        <ChipStrip items={page.kpis} className="v3-chipStrip--wide" />
      </section>
      <div className="v3-gridSection">
        <MediaCard src={page.images.product} label="제품" title="플로우 컷" />
        <MediaCard src={page.images.scene} label="팀" title="사용 장면" />
      </div>
    </PageFrame>
  );
}

function IndieBookstorePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="editorial" right={<Pill>메모 카드 무료</Pill>} />
      <section className="v3-shelfHero">
        <aside className="v3-shelfHero__rail">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.shelf} className="v3-chipStrip--paper" />
        </aside>
        <div className="v3-stageCard v3-stageCard--shelf">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="이번 주 셀렉션" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-noteStack">
            {page.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.picks} />
    </PageFrame>
  );
}

function StationeryShopPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="paper" right={<Pill>Gift Ready</Pill>} />
      <section className="v3-paperHero">
        <div className="v3-paperHero__copy">
          <IntroBlock page={page} />
        </div>
        <div className="v3-paperBoard">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="데스크 키트" title={page.brand} className="v3-paperBoard__hero" />
          <div className="v3-paperBoard__basket">
            {page.basket.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.kits} />
        <div className="v3-callout v3-callout--paper">
          <span>컬러</span>
          <ChipStrip items={page.colors} className="v3-chipStrip--color" />
        </div>
      </section>
    </PageFrame>
  );
}

function LocalCafePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="warm" right={<Pill>창가 4석</Pill>} />
      <section className="v3-menuHero">
        <div className="v3-menuHero__board">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <PriceTiles items={page.menus} compact />
        </div>
        <div className="v3-stageCard v3-stageCard--menu">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="오늘 메뉴" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-seatDock">
            {page.seats.map((seat) => (
              <span key={seat}>{seat}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-callout v3-callout--paper">
        <SectionHeading label="매장" title="기본 정보" />
        <ChipStrip items={page.storeRows} className="v3-chipStrip--wide" />
      </section>
    </PageFrame>
  );
}

function BoutiqueHotelPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="luxe" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">예약하기</button>} />
      <section className="v3-stayHero">
        <div className="v3-stayHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <div className="v3-bookingDock">
            {page.dates.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="v3-stayHero__visual">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="객실 선택" title={page.brand} className="v3-stageCard__hero" />
        </div>
      </section>
      <PriceTiles items={page.rooms} />
      <section className="v3-callout">
        <SectionHeading label="포함" title="기본 제공" />
        <ChipStrip items={page.perks} className="v3-chipStrip--wide" />
      </section>
      <MediaCard src={page.images.scene} label="현장" title="스테이 컷" className="v3-fullMedia" />
    </PageFrame>
  );
}

function PerfumeHousePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="luxe" right={<Pill>Discovery Set</Pill>} />
      <section className="v3-scentHero">
        <div className="v3-scentHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.notes} className="v3-chipStrip--paper" />
        </div>
        <div className="v3-scentHero__visual">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="시그니처" title={page.brand} className="v3-stageCard__hero" />
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.sets} />
        <div className="v3-callout">
          <span>자주 쓰는 흐름</span>
          <ChipStrip items={page.matches} />
          <MediaCard src={page.images.product} label="디테일" title="노트 컷" />
        </div>
      </section>
    </PageFrame>
  );
}

function FurnitureStorePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="organic" right={<Pill>배치 보기</Pill>} />
      <section className="v3-roomHero">
        <div className="v3-roomHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--soft" />
          <ChipStrip items={page.rooms} />
        </div>
        <div className="v3-roomHero__planner">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="룸 기준" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-plannerDock">
            {page.placement.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.bundles} />
    </PageFrame>
  );
}

function YouthFashionPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="play" right={<Pill dark>AI 착용</Pill>} />
      <section className="v3-fashionHero">
        <div className="v3-fashionHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--shout" />
          <ChipStrip items={page.sizes} className="v3-chipStrip--bold" />
        </div>
        <div className="v3-fashionHero__stack">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="룩 먼저" title={page.brand} className="v3-fashionHero__main" />
          <div className="v3-fashionHero__cart">
            {page.cartRows.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.looks} />
      <div className="v3-gridSection">
        <MediaCard src={page.images.product} label="제품" title="상세 컷" />
        <MediaCard src={page.images.scene} label="룩북" title="현장 컷" />
      </div>
    </PageFrame>
  );
}

function JewelryBrandPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="chrome" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">상담 예약</button>} />
      <section className="v3-jewelryHero">
        <div className="v3-jewelryHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--chrome" />
          <ChipStrip items={page.bespoke} className="v3-chipStrip--wide" />
        </div>
        <div className="v3-stageCard v3-stageCard--jewelry">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="컬렉션" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-consultDock">
            {page.consultRows.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.collections} />
        <MediaCard src={page.images.product} label="디테일" title="제품 컷" />
      </section>
    </PageFrame>
  );
}

const pageComponents = {
  "sneaker-drop": SneakerDropPage,
  "supplement-brand": SupplementBrandPage,
  "boxing-gym": BoxingGymPage,
  "wealth-app": WealthAppPage,
  "skin-clinic": SkinClinicPage,
  "arch-studio": ArchStudioPage,
  "beauty-flash-sale": BeautyFlashSalePage,
  "festival-page": FestivalPage,
  "creator-club": CreatorClubPage,
  "ev-mobility": EvMobilityPage,
  "gaming-gear": GamingGearPage,
  "ai-saas": AiSaasPage,
  "indie-bookstore": IndieBookstorePage,
  "stationery-shop": StationeryShopPage,
  "local-cafe": LocalCafePage,
  "boutique-hotel": BoutiqueHotelPage,
  "perfume-house": PerfumeHousePage,
  "furniture-store": FurnitureStorePage,
  "youth-fashion": YouthFashionPage,
  "jewelry-brand": JewelryBrandPage,
};

function LiveSubpage({ page, pageSlug, onBack }) {
  const design = pageDesigns[page.id];
  const routeConfig = subpageConfigs[page.id]?.[pageSlug];

  if (!routeConfig) return null;

  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader
        page={page}
        variant={design.header}
        right={
          <button type="button" className="v3-inlineButton v3-inlineButton--accent">
            {routeConfig.primary ?? page.hero.primary}
          </button>
        }
      />
      {renderSubpageContent(page, pageSlug)}
    </PageFrame>
  );
}

function NotFoundView({ onBack }) {
  return (
    <div className="v3-app">
      <div className="v3-home">
        <div className="v3-home__halo" />
        <div className="v3-notFound">
          <Pill>Not found</Pill>
          <h1>찾을 수 없는 페이지입니다.</h1>
          <p>썸네일 목록으로 돌아가서 다시 선택하세요.</p>
          <button type="button" className="v3-button v3-button--primary" onClick={onBack}>
            샘플 목록으로
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const route = useMemo(() => parseAppPath(pathname), [pathname]);

  const navigate = (targetPath, replace = false) => {
    const nextPath = targetPath || "/";
    if (replace) {
      window.history.replaceState({}, "", nextPath);
    } else {
      window.history.pushState({}, "", nextPath);
    }
    setPathname(window.location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const openPage = (pageId) => navigate(buildSitePath(pageId));
  const goHome = () => navigate("/");

  const selectedPage = route.kind === "site" ? showcasePages.find((page) => page.id === route.siteId) ?? null : null;
  const CurrentPage = selectedPage ? pageComponents[selectedPage.id] : null;
  const routes = selectedPage ? siteRoutes[selectedPage.id] ?? [{ slug: "home", label: "홈" }] : [];
  const routeContextValue = selectedPage
    ? {
        routes,
        currentSlug: route.pageSlug,
        onNavigate: (slug) => navigate(buildSitePath(selectedPage.id, slug)),
      }
    : null;

  return (
    <AnimatePresence mode="wait">
      {route.kind === "gallery" ? (
        <Motion.div
          key="gallery"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <GalleryHome pages={showcasePages} onOpen={openPage} />
        </Motion.div>
      ) : route.kind === "site" && selectedPage ? (
        <Motion.div
          key={`${selectedPage.id}-${route.pageSlug}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <SiteRouteContext.Provider value={routeContextValue}>
            {route.pageSlug === "home" && CurrentPage ? (
              <CurrentPage page={selectedPage} onBack={goHome} />
            ) : (
              <LiveSubpage page={selectedPage} pageSlug={route.pageSlug} onBack={goHome} />
            )}
          </SiteRouteContext.Provider>
        </Motion.div>
      ) : (
        <Motion.div
          key="not-found"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <NotFoundView onBack={goHome} />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
