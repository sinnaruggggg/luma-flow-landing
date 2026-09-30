import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const rootDir = resolve(".");
const stitchRoot = join(rootDir, "design", "stitch");
const asset = (key, name) => `/pagecraft/site-assets-v4/${key}-${name}.webp`;

const route = (slug, label, title, description) => ({ slug, label, title, description });
const card = (title, text) => ({ title, text });

const sites = {
  "pagecraft-business": {
    key: "business",
    brand: "브릿지파트너스",
    tone: "business",
    routes: [
      route("home", "홈", "상담으로 이어지는 기업 소개", "서비스와 사례를 확인하고 바로 문의할 수 있습니다."),
      route("strategy", "소개", "회사 소개", "강점과 일하는 방식을 간단하게 확인합니다."),
      route("services", "서비스", "서비스 안내", "제공 범위와 진행 방식을 비교합니다."),
      route("cases", "사례", "고객 사례", "성과와 진행 과정을 빠르게 살펴봅니다."),
      route("contact", "문의", "상담 문의", "필요한 내용을 남기고 답변 방식을 확인합니다."),
    ],
    cards: [
      card("서비스", "주요 제공 범위를 한눈에 정리합니다."),
      card("사례", "결과와 신뢰 근거를 먼저 보여줍니다."),
      card("진행 방식", "상담부터 실행까지 단계를 안내합니다."),
      card("문의", "연락 방법과 응답 시간을 명확히 둡니다."),
    ],
  },
  "pagecraft-premium": {
    key: "premium",
    brand: "루미에르",
    tone: "premium",
    routes: [
      route("home", "홈", "시그니처 컬렉션", "대표 상품과 상담 정보를 바로 확인합니다."),
      route("collection", "컬렉션", "컬렉션", "시즌 라인과 추천 구성을 살펴봅니다."),
      route("journal", "브랜드", "브랜드 스토리", "소재와 제작 기준을 차분하게 확인합니다."),
      route("benefits", "혜택", "고객 혜택", "멤버십과 상담 혜택을 정리합니다."),
      route("contact", "문의", "1:1 상담", "궁금한 상품과 방문 상담을 요청합니다."),
    ],
    cards: [
      card("대표 상품", "주요 라인과 가격대를 확인합니다."),
      card("컬렉션", "시즌별 구성과 추천 조합을 봅니다."),
      card("브랜드", "소재, 제작, 관리 기준을 안내합니다."),
      card("문의", "1:1 상담과 방문 예약을 연결합니다."),
    ],
  },
  "pagecraft-emotion": {
    key: "emotion",
    brand: "온유스튜디오",
    tone: "emotion",
    routes: [
      route("home", "홈", "예약 안내", "공간, 프로그램, 예약 시간을 빠르게 확인합니다."),
      route("space", "공간", "공간 소개", "방문 전 분위기와 이용 환경을 살펴봅니다."),
      route("program", "프로그램", "프로그램", "체험 옵션과 시간을 쉽게 비교합니다."),
      route("reserve", "예약", "예약하기", "날짜와 옵션을 확인하고 문의합니다."),
      route("contact", "오시는길", "오시는길", "위치, 운영 시간, 준비 사항을 확인합니다."),
    ],
    cards: [
      card("공간", "사진으로 분위기와 좌석 구성을 확인합니다."),
      card("프로그램", "체험별 소요 시간과 구성을 비교합니다."),
      card("예약", "가능 시간과 요청 사항을 남깁니다."),
      card("오시는길", "위치와 방문 전 안내를 정리합니다."),
    ],
  },
  "pagecraft-event": {
    key: "event",
    brand: "컨퍼런스데이",
    tone: "event",
    routes: [
      route("home", "홈", "컨퍼런스 신청", "일정과 신청 정보를 먼저 확인합니다."),
      route("program", "소개", "행사 소개", "핵심 주제와 참가 대상을 확인합니다."),
      route("speakers", "연사", "연사", "연사와 세션 정보를 함께 살펴봅니다."),
      route("schedule", "일정", "일정표", "시간대별 진행 순서를 확인합니다."),
      route("register", "신청", "참가 신청", "좌석과 신청 정보를 확인하고 등록합니다."),
    ],
    cards: [
      card("행사 소개", "주제와 대상이 바로 보이게 정리합니다."),
      card("연사", "이름, 역할, 세션을 함께 안내합니다."),
      card("일정", "시간표와 주요 순서를 빠르게 확인합니다."),
      card("신청", "좌석과 등록 정보를 분명하게 둡니다."),
    ],
  },
  "pagecraft-saas": {
    key: "saas",
    brand: "플로우업",
    tone: "saas",
    routes: [
      route("home", "홈", "서비스 데모 문의", "기능과 요금을 보고 데모를 요청합니다."),
      route("features", "기능", "주요 기능", "업무 흐름에 맞는 기능을 확인합니다."),
      route("pricing", "요금", "요금 안내", "플랜 차이와 추천 기준을 비교합니다."),
      route("cases", "고객사례", "고객 사례", "활용 방식과 성과를 살펴봅니다."),
      route("contact", "데모문의", "데모 문의", "팀 규모와 도입 목적을 남깁니다."),
    ],
    cards: [
      card("기능", "업무 흐름별 핵심 기능을 정리합니다."),
      card("요금", "플랜 차이와 선택 기준을 비교합니다."),
      card("고객사례", "활용 장면과 결과를 확인합니다."),
      card("데모문의", "도입 상담과 제품 데모를 요청합니다."),
    ],
  },
};

const css = `
*{box-sizing:border-box}body{margin:0;font-family:Pretendard,Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5}a{text-decoration:none;color:inherit}img{display:block;width:100%;height:100%;object-fit:cover}h1,h2,h3,p{margin:0;word-break:keep-all}.shell{width:min(1180px,calc(100% - 40px));margin:auto}.top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0}.brand{font-weight:950;letter-spacing:0}.nav{display:flex;gap:6px;flex-wrap:wrap}.nav a{min-height:38px;padding:10px 12px;border-radius:999px;font-size:13px;font-weight:850;opacity:.72}.nav a.on{opacity:1;background:var(--accent);color:var(--accentText)}.hero{display:grid;grid-template-columns:minmax(0,.88fr) minmax(420px,1.12fr);gap:34px;align-items:center;padding:34px 0 56px}.copy{display:grid;gap:18px}.copy h1{max-width:520px}h1{font-size:56px;line-height:1.08;letter-spacing:0}.route-panel p,.card p{color:var(--muted);font-weight:700;line-height:1.72}.media{position:relative;min-height:560px;border-radius:8px;overflow:hidden;box-shadow:0 30px 80px rgba(15,23,42,.16)}.media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(0,0,0,.34))}.route-panel{position:absolute;left:22px;right:22px;bottom:22px;z-index:2;display:grid;gap:8px;padding:20px;border-radius:8px;background:rgba(255,255,255,.88);backdrop-filter:blur(18px);box-shadow:0 18px 50px rgba(15,23,42,.14)}.route-panel strong{font-size:24px;letter-spacing:0}.grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:18px;padding:0 0 64px}.cards{display:grid;gap:12px}.card{min-height:132px;padding:20px;border-radius:8px;background:var(--card);border:1px solid var(--line)}.card strong{display:block;margin-bottom:8px}.gallery{display:grid;grid-template-columns:1fr 1fr;gap:14px}.gallery figure{min-height:360px;margin:0;border-radius:8px;overflow:hidden;box-shadow:0 22px 60px rgba(15,23,42,.1)}.business{--bg:#f5f8ff;--text:#07111f;--muted:#526173;--accent:#07111f;--accentText:#fff;--card:#fff;--line:rgba(7,17,31,.1)}.premium{--bg:#080706;--text:#f8efe2;--muted:rgba(248,239,226,.74);--accent:#d8b16b;--accentText:#080706;--card:rgba(255,255,255,.08);--line:rgba(216,177,107,.18)}.emotion{--bg:#fbf1e7;--text:#2b1f18;--muted:#6d5c50;--accent:#b96d4c;--accentText:#fff;--card:#fffaf5;--line:rgba(43,31,24,.08)}.event{--bg:#050714;--text:#eff8ff;--muted:#b5d1e4;--accent:#36d7ff;--accentText:#050714;--card:rgba(255,255,255,.06);--line:rgba(54,215,255,.24)}.saas{--bg:#f7fbff;--text:#101828;--muted:#667085;--accent:#226cff;--accentText:#fff;--card:#fff;--line:rgba(16,24,40,.08)}body{background:var(--bg);color:var(--text)}.premium .route-panel,.event .route-panel{background:rgba(10,10,12,.72);color:var(--text);border:1px solid var(--line)}.premium .route-panel p,.event .route-panel p{color:var(--muted)}@media(max-width:860px){.shell{width:min(100% - 20px,560px)}.top{align-items:flex-start;flex-direction:column}.nav{width:100%;overflow-x:auto;flex-wrap:nowrap}.nav a{flex:0 0 auto}.hero,.grid,.gallery{grid-template-columns:1fr}.hero{gap:18px;padding:22px 0 36px}.media{min-height:390px}.route-panel{left:14px;right:14px;bottom:14px}.gallery figure{min-height:260px}h1{font-size:34px;line-height:1.12}}
`;

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function render(siteId, site, currentRoute) {
  const nav = site.routes
    .map((item) => `<a target="_parent" class="${item.slug === currentRoute.slug ? "on" : ""}" href="/${siteId}/${item.slug === "home" ? "" : item.slug}">${esc(item.label)}</a>`)
    .join("");
  const cards = site.cards
    .map((item, index) => `<article class="card"><strong>0${index + 1} ${esc(item.title)}</strong><p>${esc(item.text)}</p></article>`)
    .join("");

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(site.brand)} ${esc(currentRoute.label)}</title><style>${css}</style></head><body class="${site.tone}"><header class="shell top"><a class="brand" target="_parent" href="/${siteId}">${esc(site.brand)}</a><nav class="nav">${nav}</nav></header><main><section class="shell hero"><div class="copy"><h1>${esc(currentRoute.title)}</h1></div><figure class="media"><img src="${asset(site.key, "hero")}" alt="${esc(site.brand)} ${esc(currentRoute.label)} 대표 이미지"><figcaption class="route-panel"><strong>${esc(currentRoute.label)}</strong><p>${esc(currentRoute.description)}</p></figcaption></figure></section><section class="shell grid"><div class="cards">${cards}</div><div class="gallery"><figure><img src="${asset(site.key, "detail-a")}" alt="${esc(site.brand)} 상세 이미지 1"></figure><figure><img src="${asset(site.key, "detail-b")}" alt="${esc(site.brand)} 상세 이미지 2"></figure></div></section></main></body></html>`;
}

for (const [siteId, site] of Object.entries(sites)) {
  const dir = join(stitchRoot, siteId, "screens");
  mkdirSync(dir, { recursive: true });
  for (const item of site.routes) {
    const html = render(siteId, site, item);
    writeFileSync(join(dir, `${item.slug}-desktop.html`), html, "utf8");
    writeFileSync(join(dir, `${item.slug}-mobile.html`), html, "utf8");
  }
}

console.log("Generated PageCraft static sample pages without template-style hero copy.");
