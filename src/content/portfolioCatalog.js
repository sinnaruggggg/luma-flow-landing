import { withBasePath } from "../lib/appPaths";

export const DEFAULT_PORTFOLIO_ITEMS = [
  {
    id: "aim-furniture",
    title: "에임가구",
    category: "실제 제작 포트폴리오",
    status: "내부 임베드",
    stack: "Next.js · React · 가구 쇼룸",
    description:
      "원목 가구 브랜드의 쇼룸형 웹사이트입니다. 메인 갤러리, 컬렉션, 공간 배치 미리보기, 마감 비교 흐름을 포트폴리오 안에서 바로 확인할 수 있게 연결했습니다.",
    embedSrc: withBasePath("/portfolio/aim-furniture/site/index.html"),
    desktopImage: withBasePath("/portfolio/aim-furniture/site/assets/hero-main.webp"),
    mobileImage: withBasePath("/portfolio/aim-furniture/site/assets/placement-hero.webp"),
    highlights: ["가구 쇼룸", "공간 배치", "마감 비교", "이미지 생성 흐름"],
    visible: true,
    order: 0,
  },
  {
    id: "serene-market-shop",
    title: "Serene Market Shop",
    category: "쇼핑몰 포트폴리오",
    status: "내부 임베드",
    stack: "HTML · CSS · JavaScript · 장바구니",
    description:
      "라이프스타일 쇼핑몰 데모입니다. 30개 상품, 카테고리 필터, 장바구니 저장, 배송 정보 입력, 결제 직전 주문 확인 흐름까지 한 화면에서 테스트할 수 있습니다.",
    embedSrc: withBasePath("/portfolio/serene-market-shop/site/index.html"),
    desktopImage: withBasePath("/portfolio/serene-market-shop/home-desktop.png"),
    mobileImage: withBasePath("/portfolio/serene-market-shop/home-mobile.png"),
    highlights: ["30개 상품", "카테고리 필터", "장바구니", "주문 확인"],
    visible: true,
    order: 1,
  },
];
