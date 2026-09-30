import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const rootDir = resolve(".");
const screensRoot = join(rootDir, "design", "stitch");
const pagecraftPublicDir = join(rootDir, "public", "pagecraft");

const samples = [
  {
    id: "pagecraft-business",
    image: "sample-business.png",
    brand: "SEGMENT PARTNER",
    eyebrow: "Business Partner",
    title: "상담 전환을 만드는 비즈니스 랜딩페이지",
    summary: "기업 소개, 서비스 신뢰 근거, 성과 사례, 문의 흐름을 한 화면에서 설득력 있게 연결합니다.",
    tone: "business",
    accent: "#1457ff",
    dark: "#071b42",
    soft: "#edf5ff",
    nav: [
      ["strategy", "전략"],
      ["services", "서비스"],
      ["cases", "성과"],
      ["contact", "문의"],
    ],
    routes: [
      ["home", "홈", "방문자가 첫 화면에서 회사의 강점과 상담 이유를 바로 이해하는 메인 페이지"],
      ["strategy", "전략", "고객 문제, 해결 방향, 전환 지표를 한눈에 정리한 전략 페이지"],
      ["services", "서비스", "제공 범위와 진행 방식을 비교하기 쉽게 정리한 서비스 페이지"],
      ["cases", "성과", "실제 결과와 신뢰 근거를 중심으로 보여주는 성과 페이지"],
      ["contact", "문의", "상담 신청까지 망설임 없이 이어지는 문의 페이지"],
    ],
    metrics: [
      ["상담 전환", "+38%"],
      ["제작 흐름", "4단계"],
      ["모바일 대응", "완료"],
    ],
    sections: [
      ["진단", "현재 사이트의 메시지, CTA, 고객 흐름을 먼저 점검합니다."],
      ["설계", "업종에 맞는 정보 구조와 문의 유도 흐름을 만듭니다."],
      ["제작", "PC와 모바일에서 안정적으로 보이는 화면을 구현합니다."],
      ["개선", "공개 후 반응을 보고 문구와 섹션을 조정합니다."],
    ],
    proof: ["B2B 소개", "서비스 설명", "상담 유도", "성과 사례"],
    cta: "무료 진단 문의",
  },
  {
    id: "pagecraft-premium",
    image: "sample-premium.png",
    brand: "LUXE LINE",
    eyebrow: "Premium Brand",
    title: "고급 브랜드의 결을 살리는 프리미엄 페이지",
    summary: "제품의 무드, 브랜드 스토리, 멤버십 혜택, 프라이빗 상담을 차분하고 고급스럽게 연결합니다.",
    tone: "premium",
    accent: "#d7ad63",
    dark: "#080b12",
    soft: "#f7efe2",
    nav: [
      ["collection", "컬렉션"],
      ["journal", "스토리"],
      ["benefits", "혜택"],
      ["contact", "상담"],
    ],
    routes: [
      ["home", "홈", "브랜드의 첫인상과 핵심 상품을 고급스럽게 보여주는 메인 페이지"],
      ["collection", "컬렉션", "대표 상품 라인과 추천 구성을 정돈된 카드로 보여주는 컬렉션 페이지"],
      ["journal", "스토리", "브랜드 철학과 제작 배경을 차분하게 전달하는 스토리 페이지"],
      ["benefits", "혜택", "멤버십, 선물 포장, 프라이빗 상담 혜택을 설명하는 페이지"],
      ["contact", "상담", "고객이 프라이빗 상담을 신청하도록 안내하는 상담 페이지"],
    ],
    metrics: [
      ["브랜드 무드", "Luxury"],
      ["상담 방식", "Private"],
      ["구매 흐름", "정돈"],
    ],
    sections: [
      ["시그니처", "대표 제품을 중심으로 브랜드의 깊이를 먼저 보여줍니다."],
      ["컬렉션", "라인별 차이와 추천 대상을 간결하게 비교합니다."],
      ["멤버십", "고객이 상담해야 하는 이유를 혜택 중심으로 설명합니다."],
      ["상담", "과한 입력 없이 프라이빗 문의로 자연스럽게 연결합니다."],
    ],
    proof: ["프리미엄 무드", "제품 컬렉션", "브랜드 스토리", "프라이빗 상담"],
    cta: "프라이빗 상담 신청",
  },
  {
    id: "pagecraft-emotion",
    image: "sample-emotion.png",
    brand: "WARM MOMENT",
    eyebrow: "Emotional Brand",
    title: "따뜻한 감성으로 예약을 이끄는 브랜드 페이지",
    summary: "카페, 클리닉, 라이프스타일 브랜드의 분위기와 예약 흐름을 부드럽게 연결합니다.",
    tone: "emotion",
    accent: "#9b6b35",
    dark: "#352215",
    soft: "#fff3e6",
    nav: [
      ["space", "공간"],
      ["program", "프로그램"],
      ["reserve", "예약"],
      ["contact", "문의"],
    ],
    routes: [
      ["home", "홈", "브랜드의 감성과 예약 이유를 첫 화면에서 전달하는 메인 페이지"],
      ["space", "공간", "공간의 분위기와 이용 경험을 소개하는 페이지"],
      ["program", "프로그램", "서비스 구성과 추천 프로그램을 쉽게 고르는 페이지"],
      ["reserve", "예약", "날짜, 시간, 요청 사항을 자연스럽게 선택하는 예약 페이지"],
      ["contact", "문의", "방문 전 궁금한 점을 빠르게 남기는 문의 페이지"],
    ],
    metrics: [
      ["예약 흐름", "간편"],
      ["브랜드 톤", "Warm"],
      ["모바일 문의", "강화"],
    ],
    sections: [
      ["첫인상", "부드러운 문구와 여백으로 브랜드의 감도를 만듭니다."],
      ["경험", "방문자가 받을 수 있는 경험을 장면 중심으로 설명합니다."],
      ["예약", "복잡한 절차 없이 상담과 예약으로 이어지게 합니다."],
      ["안내", "위치, 운영 시간, 준비 사항을 명확하게 보여줍니다."],
    ],
    proof: ["따뜻한 무드", "예약 유도", "공간 소개", "방문 안내"],
    cta: "예약 문의하기",
  },
  {
    id: "pagecraft-event",
    image: "sample-event.png",
    brand: "CONVERT STAGE",
    eyebrow: "Event Conversion",
    title: "참가 신청을 빠르게 만드는 이벤트 페이지",
    summary: "세미나, 강의, 웨비나의 핵심 메시지와 프로그램, 연사, 신청 흐름을 한 방향으로 정리합니다.",
    tone: "event",
    accent: "#6747ff",
    dark: "#080c2f",
    soft: "#f1efff",
    nav: [
      ["program", "프로그램"],
      ["speakers", "연사"],
      ["schedule", "일정"],
      ["register", "신청"],
    ],
    routes: [
      ["home", "홈", "행사의 핵심 가치와 참가 신청 버튼을 강하게 보여주는 메인 페이지"],
      ["program", "프로그램", "세션 구성과 참가자가 얻을 내용을 정리한 프로그램 페이지"],
      ["speakers", "연사", "연사 프로필과 신뢰 근거를 보여주는 페이지"],
      ["schedule", "일정", "시간표와 진행 순서를 보기 쉽게 정리한 일정 페이지"],
      ["register", "신청", "참가 정보를 입력하고 신청하도록 안내하는 페이지"],
    ],
    metrics: [
      ["신청 CTA", "고정"],
      ["세션 구성", "4개"],
      ["모바일 신청", "최적화"],
    ],
    sections: [
      ["핵심 메시지", "누구를 위한 행사인지 첫 화면에서 바로 이해시킵니다."],
      ["프로그램", "세션별 주제와 기대 효과를 카드로 정리합니다."],
      ["신뢰", "연사, 일정, 후기를 통해 신청 장벽을 낮춥니다."],
      ["신청", "마지막 행동을 명확한 버튼과 간단한 폼으로 유도합니다."],
    ],
    proof: ["세미나", "웨비나", "강의 신청", "일정 안내"],
    cta: "참가 신청하기",
  },
  {
    id: "pagecraft-saas",
    image: "sample-saas.png",
    brand: "SERVICE FLOW",
    eyebrow: "Service SaaS",
    title: "서비스 가치를 빠르게 이해시키는 SaaS 페이지",
    summary: "기능, 요금, 후기, 데모 문의까지 고객이 필요한 정보를 순서대로 확인하게 만듭니다.",
    tone: "saas",
    accent: "#2458ff",
    dark: "#07114a",
    soft: "#eef3ff",
    nav: [
      ["features", "기능"],
      ["pricing", "요금"],
      ["reviews", "후기"],
      ["contact", "상담"],
    ],
    routes: [
      ["home", "홈", "제품 가치와 데모 신청 흐름을 첫 화면에서 보여주는 메인 페이지"],
      ["features", "기능", "핵심 기능과 사용 장점을 모듈별로 설명하는 기능 페이지"],
      ["pricing", "요금", "플랜 차이와 선택 기준을 비교하는 요금 페이지"],
      ["reviews", "후기", "고객 후기와 도입 성과를 보여주는 페이지"],
      ["contact", "상담", "데모 신청과 도입 상담을 받는 페이지"],
    ],
    metrics: [
      ["기능 카드", "6개"],
      ["요금 비교", "명확"],
      ["데모 전환", "강화"],
    ],
    sections: [
      ["문제 정의", "고객이 겪는 업무 문제를 짧고 명확하게 제시합니다."],
      ["기능 흐름", "복잡한 기능을 실제 사용 순서대로 보여줍니다."],
      ["요금 선택", "플랜별 차이를 쉽게 비교하도록 구성합니다."],
      ["데모 신청", "도입 문의까지 필요한 정보를 최소화합니다."],
    ],
    proof: ["SaaS 소개", "기능 설명", "요금 비교", "데모 상담"],
    cta: "무료 데모 신청",
  },
];

const routeMeta = {
  home: {
    eyebrow: "Overview",
    titleSuffix: "운영형 메인",
    focus: "첫 화면에서 무엇을 제공하는지, 왜 문의해야 하는지 바로 보이게 구성했습니다.",
  },
  strategy: {
    eyebrow: "Strategy",
    titleSuffix: "전략 설계",
    focus: "목표 고객, 신뢰 근거, 문의 전환 흐름을 하나의 구조로 정리합니다.",
  },
  services: {
    eyebrow: "Services",
    titleSuffix: "서비스 안내",
    focus: "제공 범위와 진행 방식을 카드와 절차 중심으로 보여줍니다.",
  },
  cases: {
    eyebrow: "Cases",
    titleSuffix: "성과 사례",
    focus: "수치, 후기, 전후 비교를 통해 방문자의 신뢰를 높입니다.",
  },
  collection: {
    eyebrow: "Collection",
    titleSuffix: "컬렉션 소개",
    focus: "대표 상품군을 명확한 분류와 추천 기준으로 보여줍니다.",
  },
  journal: {
    eyebrow: "Journal",
    titleSuffix: "브랜드 스토리",
    focus: "철학, 제작 과정, 고객 경험을 차분한 이야기 구조로 전달합니다.",
  },
  benefits: {
    eyebrow: "Benefits",
    titleSuffix: "고객 혜택",
    focus: "상담과 구매를 결정할 수 있는 혜택을 구체적으로 정리합니다.",
  },
  space: {
    eyebrow: "Space",
    titleSuffix: "공간 소개",
    focus: "공간의 분위기, 이용 장면, 방문 전 확인 사항을 보여줍니다.",
  },
  program: {
    eyebrow: "Program",
    titleSuffix: "프로그램",
    focus: "서비스 또는 행사 프로그램을 쉽게 고를 수 있도록 정리합니다.",
  },
  reserve: {
    eyebrow: "Reservation",
    titleSuffix: "예약 안내",
    focus: "예약 전 필요한 정보와 선택 항목을 간단한 흐름으로 보여줍니다.",
  },
  speakers: {
    eyebrow: "Speakers",
    titleSuffix: "연사 소개",
    focus: "연사 경험과 세션 주제를 신뢰감 있게 소개합니다.",
  },
  schedule: {
    eyebrow: "Schedule",
    titleSuffix: "일정 안내",
    focus: "시간표, 진행 순서, 준비 사항을 보기 쉽게 정리합니다.",
  },
  register: {
    eyebrow: "Register",
    titleSuffix: "참가 신청",
    focus: "신청자가 필요한 정보만 입력하도록 간단한 등록 화면을 제공합니다.",
  },
  features: {
    eyebrow: "Features",
    titleSuffix: "기능 소개",
    focus: "핵심 기능과 사용 장점을 실제 업무 흐름에 맞춰 설명합니다.",
  },
  pricing: {
    eyebrow: "Pricing",
    titleSuffix: "요금 비교",
    focus: "플랜별 차이와 추천 대상을 빠르게 비교하게 만듭니다.",
  },
  reviews: {
    eyebrow: "Reviews",
    titleSuffix: "고객 후기",
    focus: "도입 성과, 후기, 신뢰 지표를 중심으로 설득합니다.",
  },
  contact: {
    eyebrow: "Contact",
    titleSuffix: "상담 문의",
    focus: "문의 장벽을 낮추고 다음 연락을 받을 수 있게 안내합니다.",
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routePath(site, slug) {
  return slug === "home" ? `/${site.id}` : `/${site.id}/${slug}`;
}

function renderNav(site, currentSlug) {
  return site.nav
    .map(([slug, label]) => `<a class="${slug === currentSlug ? "is-active" : ""}" href="${routePath(site, slug)}">${escapeHtml(label)}</a>`)
    .join("");
}

function renderMetrics(site) {
  return site.metrics
    .map(([label, value]) => `<div class="metric"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`)
    .join("");
}

function renderProof(site) {
  return site.proof.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

function renderCards(site, route) {
  const active = route[0];
  const cards = site.sections.map(([title, text], index) => {
    const label = active === "home" ? title : `${title} ${index + 1}`;
    return `
      <article class="info-card">
        <small>0${index + 1}</small>
        <h3>${escapeHtml(label)}</h3>
        <p>${escapeHtml(text)}</p>
      </article>
    `;
  });

  return cards.join("");
}

function renderProcess(site) {
  return site.sections
    .map(([title], index) => `
      <li>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(title)}</strong>
      </li>
    `)
    .join("");
}

function renderOffer(site, route) {
  const slug = route[0];

  if (["contact", "reserve", "register"].includes(slug)) {
    return `
      <div class="form-card">
        <div>
          <h2>${escapeHtml(site.cta)}</h2>
          <p>필요한 정보만 남기면 담당자가 확인 후 연락드리는 흐름입니다. 실제 저장 기능은 없는 정적 샘플 UI입니다.</p>
        </div>
        <form>
          <input aria-label="이름" placeholder="이름 또는 업체명" />
          <input aria-label="연락처" placeholder="연락처" />
          <select aria-label="관심 항목">
            <option>관심 항목 선택</option>
            <option>신규 제작</option>
            <option>기존 사이트 개선</option>
            <option>상담 후 결정</option>
          </select>
          <textarea aria-label="문의 내용" placeholder="문의 내용을 간단히 적어주세요"></textarea>
          <button type="button">${escapeHtml(site.cta)}</button>
        </form>
      </div>
    `;
  }

  return `
    <div class="split-panel">
      <div>
        <span class="section-kicker">Live Structure</span>
        <h2>${escapeHtml(routeMeta[slug]?.titleSuffix ?? route[1])}</h2>
        <p>${escapeHtml(routeMeta[slug]?.focus ?? route[2])}</p>
        <div class="proof-row">${renderProof(site)}</div>
      </div>
      <div class="preview-card">
        <img src="/pagecraft/${escapeHtml(site.image)}" alt="${escapeHtml(site.brand)} 시안 미리보기" />
      </div>
    </div>
  `;
}

function renderHtml(site, route, device) {
  const [slug, label, description] = route;
  const isMobile = device === "mobile";
  const meta = routeMeta[slug] ?? routeMeta.home;
  const dark = site.tone === "premium" || site.tone === "event";
  const pageTitle = slug === "home" ? site.title : `${label} 페이지`;
  const pageSummary = slug === "home" ? site.summary : description;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(site.brand)} ${escapeHtml(label)}</title>
  <style>
    :root {
      --accent: ${site.accent};
      --dark: ${site.dark};
      --soft: ${site.soft};
      --text: ${dark ? "#f8fafc" : "#0b1220"};
      --muted: ${dark ? "rgba(248, 250, 252, .72)" : "#667085"};
      --line: ${dark ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.12)"};
      --panel: ${dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.86)"};
      --panel-strong: ${dark ? "rgba(255,255,255,.11)" : "#ffffff"};
      font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--text);
      background:
        radial-gradient(circle at 78% 12%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 30%),
        linear-gradient(135deg, ${dark ? "#05070d 0%, #111827 55%, #1d160b 100%" : "#ffffff 0%, var(--soft) 58%, #ffffff 100%"});
    }
    a { color: inherit; text-decoration: none; }
    button, input, select, textarea { font: inherit; }
    button { border: 0; cursor: pointer; }
    .page {
      width: min(${isMobile ? "430px" : "1180px"}, calc(100% - 32px));
      min-height: ${isMobile ? "860px" : "1180px"};
      margin: 0 auto;
      padding: ${isMobile ? "18px 0 40px" : "28px 0 72px"};
    }
    .topbar {
      position: sticky;
      top: 14px;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      min-height: 64px;
      padding: 12px 14px 12px 18px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: ${dark ? "rgba(5, 7, 13, .72)" : "rgba(255,255,255,.78)"};
      backdrop-filter: blur(18px);
      box-shadow: 0 18px 48px rgba(15, 23, 42, .12);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 950;
      letter-spacing: -.04em;
      white-space: nowrap;
    }
    .brand-mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 12px;
      color: #fff;
      background: linear-gradient(135deg, var(--accent), #6b43ff);
      font-size: 15px;
    }
    .nav {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
      flex-wrap: wrap;
    }
    .nav a {
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      padding: 0 13px;
      border-radius: 999px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 850;
    }
    .nav a.is-active,
    .nav a:hover {
      color: ${dark ? "#111827" : "#ffffff"};
      background: ${dark ? "#ffffff" : "var(--accent)"};
    }
    .hero {
      display: grid;
      grid-template-columns: ${isMobile ? "1fr" : "1.05fr .95fr"};
      gap: ${isMobile ? "24px" : "46px"};
      align-items: center;
      padding: ${isMobile ? "42px 0 22px" : "82px 0 54px"};
    }
    .eyebrow, .section-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      color: ${dark ? "var(--accent)" : "#1457ff"};
      font-size: 13px;
      font-weight: 950;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .eyebrow::before, .section-kicker::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 99px;
      background: currentColor;
    }
    h1, h2, h3, p, .btn { word-break: keep-all; overflow-wrap: break-word; }
    h1 {
      margin: 0;
      max-width: 760px;
      font-size: clamp(${isMobile ? "42px" : "58px"}, ${isMobile ? "12vw" : "6vw"}, ${isMobile ? "66px" : "94px"});
      line-height: .96;
      letter-spacing: -.07em;
    }
    .hero-copy p {
      max-width: 620px;
      margin: 22px 0 0;
      color: var(--muted);
      font-size: ${isMobile ? "16px" : "19px"};
      line-height: 1.75;
      font-weight: 750;
    }
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 30px;
    }
    .btn {
      min-height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border-radius: 14px;
      font-weight: 950;
    }
    .btn-primary {
      color: #fff;
      background: linear-gradient(135deg, var(--accent), #6b43ff);
      box-shadow: 0 16px 38px color-mix(in srgb, var(--accent) 34%, transparent);
    }
    .btn-secondary {
      color: var(--text);
      border: 1px solid var(--line);
      background: var(--panel-strong);
    }
    .hero-board {
      padding: ${isMobile ? "16px" : "20px"};
      border: 1px solid var(--line);
      border-radius: 32px;
      background: var(--panel);
      box-shadow: 0 32px 80px rgba(15, 23, 42, .18);
    }
    .board-inner {
      min-height: ${isMobile ? "330px" : "500px"};
      padding: ${isMobile ? "20px" : "28px"};
      border-radius: 26px;
      background:
        radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 34%),
        linear-gradient(160deg, ${dark ? "#121826, #05070d" : "#ffffff, var(--soft)"});
      border: 1px solid var(--line);
    }
    .board-top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 13px;
      font-weight: 900;
      color: var(--muted);
    }
    .board-title {
      margin-top: ${isMobile ? "44px" : "70px"};
      font-size: ${isMobile ? "30px" : "46px"};
      line-height: 1.05;
      letter-spacing: -.05em;
      font-weight: 950;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 24px;
    }
    .metric {
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--panel-strong);
    }
    .metric strong {
      display: block;
      font-size: ${isMobile ? "20px" : "24px"};
      letter-spacing: -.04em;
    }
    .metric span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 850;
    }
    .section {
      margin-top: 26px;
      padding: ${isMobile ? "24px" : "34px"};
      border: 1px solid var(--line);
      border-radius: 30px;
      background: var(--panel);
      box-shadow: 0 20px 54px rgba(15, 23, 42, .08);
    }
    .section h2 {
      margin: 0;
      max-width: 720px;
      font-size: ${isMobile ? "30px" : "44px"};
      line-height: 1.08;
      letter-spacing: -.055em;
    }
    .section > p, .split-panel p, .form-card p {
      color: var(--muted);
      line-height: 1.75;
      font-weight: 750;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(${isMobile ? 1 : 4}, minmax(0, 1fr));
      gap: 14px;
      margin-top: 24px;
    }
    .info-card {
      min-height: ${isMobile ? "auto" : "220px"};
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: var(--panel-strong);
    }
    .info-card small {
      color: var(--accent);
      font-weight: 950;
    }
    .info-card h3 {
      margin: 16px 0 9px;
      font-size: 20px;
      letter-spacing: -.035em;
    }
    .info-card p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.65;
      font-weight: 720;
    }
    .split-panel {
      display: grid;
      grid-template-columns: ${isMobile ? "1fr" : "1fr 360px"};
      gap: 24px;
      align-items: center;
    }
    .proof-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 24px;
    }
    .proof-row span {
      padding: 9px 12px;
      border-radius: 999px;
      color: ${dark ? "#ffffff" : "#1457ff"};
      background: ${dark ? "rgba(255,255,255,.09)" : "rgba(20,87,255,.08)"};
      border: 1px solid var(--line);
      font-size: 13px;
      font-weight: 850;
    }
    .preview-card {
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid var(--line);
      background: var(--panel-strong);
      aspect-ratio: ${isMobile ? "16 / 10" : "4 / 3"};
    }
    .preview-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.02);
    }
    .process-list {
      display: grid;
      grid-template-columns: repeat(${isMobile ? 1 : 4}, minmax(0, 1fr));
      gap: 12px;
      padding: 0;
      margin: 24px 0 0;
      list-style: none;
    }
    .process-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--panel-strong);
      font-weight: 900;
    }
    .process-list span {
      color: var(--accent);
      font-size: 13px;
    }
    .form-card {
      display: grid;
      grid-template-columns: ${isMobile ? "1fr" : ".9fr 1.1fr"};
      gap: 24px;
      align-items: start;
    }
    form {
      display: grid;
      gap: 10px;
    }
    input, select, textarea {
      width: 100%;
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid var(--line);
      border-radius: 14px;
      color: ${dark ? "#f8fafc" : "#0b1220"};
      background: ${dark ? "rgba(255,255,255,.08)" : "#fff"};
      font-weight: 750;
    }
    textarea {
      min-height: 96px;
      padding-top: 14px;
      resize: vertical;
    }
    form button {
      min-height: 52px;
      border-radius: 14px;
      color: #fff;
      background: linear-gradient(135deg, var(--accent), #6b43ff);
      font-weight: 950;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 28px;
      padding: 24px 4px 0;
      color: var(--muted);
      font-size: 13px;
      font-weight: 800;
    }
    @media (max-width: 760px) {
      .topbar {
        position: relative;
        top: auto;
        align-items: stretch;
        flex-direction: column;
      }
      .nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .nav a {
        justify-content: center;
        min-height: 38px;
      }
      .actions {
        display: grid;
        grid-template-columns: 1fr;
      }
      .actions .btn {
        width: 100%;
        min-height: 54px;
        padding: 0 16px;
        line-height: 1.25;
        text-align: center;
      }
      .metric-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="topbar">
      <a class="brand" href="${routePath(site, "home")}" aria-label="${escapeHtml(site.brand)} 홈">
        <span class="brand-mark">P</span>
        ${escapeHtml(site.brand)}
      </a>
      <nav class="nav" aria-label="주요 메뉴">
        ${renderNav(site, slug)}
      </nav>
    </header>

    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="eyebrow">${escapeHtml(meta.eyebrow)}</span>
        <h1 id="hero-title">${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(pageSummary)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="${routePath(site, site.nav.at(-1)[0])}">${escapeHtml(site.cta)}</a>
          <a class="btn btn-secondary" href="${routePath(site, site.nav[0][0])}">${escapeHtml(site.nav[0][1])} 보기</a>
        </div>
      </div>
      <aside class="hero-board" aria-label="핵심 지표">
        <div class="board-inner">
          <div class="board-top">
            <span>${escapeHtml(site.eyebrow)}</span>
            <span>${escapeHtml(label)}</span>
          </div>
          <div class="board-title">${escapeHtml(meta.focus)}</div>
          <div class="metric-grid">${renderMetrics(site)}</div>
        </div>
      </aside>
    </section>

    <section class="section" aria-labelledby="structure-title">
      <span class="section-kicker">Structure</span>
      <h2 id="structure-title">${escapeHtml(site.brand)}에 맞춘 실제 운영 구조</h2>
      <p>시안 이미지를 붙여놓는 방식이 아니라 방문자가 읽고, 비교하고, 문의할 수 있는 실제 페이지 섹션으로 구성했습니다.</p>
      <div class="card-grid">${renderCards(site, route)}</div>
    </section>

    <section class="section" aria-labelledby="offer-title">
      ${renderOffer(site, route)}
    </section>

    <section class="section" aria-labelledby="process-title">
      <span class="section-kicker">Flow</span>
      <h2 id="process-title">방문자가 다음 행동으로 이동하는 흐름</h2>
      <p>상단 메시지에서 신뢰 근거, 세부 정보, 문의 버튼까지 끊기지 않도록 화면을 설계했습니다.</p>
      <ol class="process-list">${renderProcess(site)}</ol>
    </section>

    <footer class="footer">
      <span>${escapeHtml(site.brand)} static sample</span>
      <span>운영형 정적 랜딩페이지 샘플</span>
    </footer>
  </main>
</body>
</html>`;
}

for (const site of samples) {
  const screensDir = join(screensRoot, site.id, "screens");
  mkdirSync(screensDir, { recursive: true });

  const sourceImage = join(pagecraftPublicDir, site.image);
  if (existsSync(sourceImage)) {
    copyFileSync(sourceImage, join(screensDir, "home-desktop.png"));
    copyFileSync(sourceImage, join(screensDir, "home-mobile.png"));
  }

  for (const route of site.routes) {
    for (const device of ["desktop", "mobile"]) {
      writeFileSync(join(screensDir, `${route[0]}-${device}.html`), renderHtml(site, route, device), "utf8");
    }
  }
}

console.log(`Generated ${samples.length} PageCraft operating-site samples.`);
