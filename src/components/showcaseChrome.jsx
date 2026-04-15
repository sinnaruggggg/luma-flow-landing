import { ArrowLeft, ChevronRight, Clock3, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { SceneBackdrop, ShowcasePhone, WebForgeMark } from "./showcaseAtoms";

const PRIORITY_SITE_IDS = ["indie-bookstore", "stationery-shop", "local-cafe", "boutique-hotel"];
const TOP_NAV_ITEMS = [
  { label: "샘플 둘러보기", sectionId: "samples" },
  { label: "제작 방식", sectionId: "process" },
  { label: "기능", sectionId: "features" },
  { label: "요금", sectionId: "pricing" },
  { label: "문의하기", sectionId: "contact" },
];

const PROCESS_STEPS = [
  { step: "01", title: "샘플 선택", text: "업종과 무드가 가장 가까운 샘플을 먼저 고르고 출발합니다." },
  { step: "02", title: "기능 정리", text: "예약, 상담, 커머스, 브랜드 소개 중 필요한 흐름만 묶어 구조를 잡습니다." },
  { step: "03", title: "빠른 제작", text: "확정된 방향으로 PC와 모바일 화면을 함께 다듬고 바로 배포 가능한 상태까지 만듭니다." },
];

const FEATURE_ITEMS = [
  { title: "샘플 기반 제작", text: "추상적인 설명이 아니라 실제 샘플을 보고 바로 방향을 정할 수 있습니다." },
  { title: "반응형 동시 설계", text: "데스크톱과 모바일을 따로 땜질하지 않고 처음부터 함께 맞춥니다." },
  { title: "업종별 흐름 반영", text: "브랜드형, 예약형, 쇼핑형, 소개형 페이지 흐름을 목적에 맞게 다듬습니다." },
  { title: "빠른 수정 대응", text: "시안 확정 후 텍스트, 섹션, CTA 흐름을 빠르게 정리할 수 있습니다." },
];

const PRICING_PLANS = [
  { name: "Lite", price: "KRW 290K", description: "가볍게 시작하는 원페이지 소개형 사이트", items: ["메인 페이지 1종", "모바일 최적화", "기본 수정 1회"] },
  { name: "Standard", price: "KRW 490K", description: "문의와 전환 흐름까지 담은 기본 패키지", items: ["핵심 섹션 확장", "CTA·문의 흐름 구성", "기본 수정 2회"], featured: true },
  { name: "Pro", price: "KRW 790K", description: "다중 페이지와 맞춤 흐름이 필요한 확장형 구성", items: ["서브 페이지 추가", "예약·문의 구조 설계", "배포 반영 지원"] },
];

const CONTACT_POINTS = [
  "마음에 드는 샘플 이름",
  "필요한 기능 2~3가지",
  "원하는 일정과 예산 범위",
];

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
}

function orderSites(sites) {
  const rank = new Map(PRIORITY_SITE_IDS.map((siteId, index) => [siteId, index]));

  return [...sites].sort((left, right) => {
    const leftRank = rank.get(left.id);
    const rightRank = rank.get(right.id);

    if (leftRank !== undefined || rightRank !== undefined) {
      if (leftRank === undefined) return 1;
      if (rightRank === undefined) return -1;
      return leftRank - rightRank;
    }

    return left.brand.localeCompare(right.brand);
  });
}

function coverageLabel(site) {
  if (site.gallery.publicReady) return "5페이지 완성";
  if (site.gallery.homeReady) return `라우트 공개 ${site.gallery.readyRoutes}/${site.gallery.totalRoutes}`;
  if (site.gallery.stitchedRoutes > 0) return `제작 중 ${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes}`;
  return "준비 중";
}

function PreviewSurface({ stage, title, className = "", loading = "lazy", preferImage = false }) {
  return (
    <div className={`preview-surface ${className}`.trim()}>
      {stage.html && !preferImage ? <iframe title={title} src={stage.html} loading={loading} tabIndex={-1} /> : <img src={stage.image} alt={stage.alt} loading={loading} />}
    </div>
  );
}

function GalleryCard({ site, onOpen }) {
  const canOpen = site.gallery.homeReady;
  const desktopStage = site.routeAssets.home.desktop;
  const mobileStage = site.routeAssets.home.mobile;

  return (
    <article className={`hub-card ${canOpen ? "" : "hub-card--disabled"}`.trim()}>
      <button
        type="button"
        className="hub-card__hit"
        onClick={() => onOpen(buildSitePath(site.id))}
        disabled={!canOpen}
        aria-label={`${site.brand} 사이트 보기`}
      />
      <div className="hub-card__visual">
        <div className="hub-card__desktop-frame">
          <PreviewSurface stage={desktopStage} title={`${site.brand} PC 미리보기`} className="hub-card__desktop-shot" preferImage />
        </div>
        <ShowcasePhone src={mobileStage.image} alt={`${site.brand} 모바일 미리보기`} title={`${site.brand} 모바일 홈`} />
      </div>
      <div className="hub-card__body">
        <div className="hub-card__meta">
          <span>{site.homeMode}</span>
          <span>{coverageLabel(site)}</span>
        </div>
        <strong>{site.brand}</strong>
        <p>{site.summary}</p>
        <div className="hub-card__footer">
          <span>{site.industry}</span>
          <span className="hub-card__action">
            {canOpen ? "사이트 보기" : "준비 중"}
            {canOpen ? <ChevronRight size={16} /> : <Clock3 size={16} />}
          </span>
        </div>
      </div>
    </article>
  );
}

export function GalleryHome({ onOpen }) {
  const orderedSites = orderSites(siteRegistry);
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  return (
    <div className="hub-page" style={pointerStyle} onPointerMove={onPointerMove}>
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <header className="hub-topbar">
          <div className="hub-topbar__brand">
            <WebForgeMark />
            <div>
              <strong>WebForge</strong>
            </div>
          </div>
          <nav className="hub-topbar__nav" aria-label="메인 메뉴">
            {TOP_NAV_ITEMS.map((item) => (
              <button key={item.sectionId} type="button" className="hub-topbar__nav-item" onClick={() => scrollToSection(item.sectionId)}>
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="hub-topbar__cta" onClick={() => scrollToSection("contact")}>사이트 만들기</button>
        </header>

        <section className="hub-hero hub-hero--minimal" aria-label="WebForge 소개">
          <div className="hub-hero__content hub-hero__content--minimal">
            <h1>누구나 쉽게 만드는 나만의 web</h1>
          </div>
        </section>

        <section id="samples" className="hub-section" aria-labelledby="samples-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Showcase</span>
            <h2 id="samples-heading">업종과 무드가 맞는 샘플을 바로 비교하세요.</h2>
            <p>실제 홈페이지처럼 구성된 샘플을 보고, 가장 가까운 스타일과 구조를 빠르게 고를 수 있습니다.</p>
          </div>
          <div className="hub-grid">
            {orderedSites.map((site) => (
              <GalleryCard key={site.id} site={site} onOpen={onOpen} />
            ))}
          </div>
        </section>

        <section id="process" className="hub-section" aria-labelledby="process-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">How It Works</span>
            <h2 id="process-heading">복잡하게 설명하지 않고, 빠르게 방향을 잡습니다.</h2>
          </div>
          <div className="hub-process-grid">
            {PROCESS_STEPS.map((item) => (
              <article key={item.step} className="hub-info-card">
                <span className="hub-info-card__step">{item.step}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="hub-section" aria-labelledby="features-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Features</span>
            <h2 id="features-heading">실제로 필요한 기능만 정리해서 붙입니다.</h2>
          </div>
          <div className="hub-feature-grid">
            {FEATURE_ITEMS.map((item) => (
              <article key={item.title} className="hub-info-card hub-info-card--feature">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="hub-section" aria-labelledby="pricing-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Pricing</span>
            <h2 id="pricing-heading">부담을 낮춘 3단계 요금으로 단순하게 선택할 수 있습니다.</h2>
          </div>
          <div className="hub-pricing-grid">
            {PRICING_PLANS.map((plan) => (
              <article key={plan.name} className={`hub-price-card ${plan.featured ? "hub-price-card--featured" : ""}`.trim()}>
                <span>{plan.name}</span>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="hub-section hub-section--contact" aria-labelledby="contact-heading">
          <div className="hub-contact-card">
            <div className="hub-section__header">
              <span className="hub-section__eyebrow">Contact</span>
              <h2 id="contact-heading">원하는 샘플 이름만 정해도 다음 단계로 바로 갈 수 있습니다.</h2>
              <p>아래 3가지만 정리하면 문의 준비가 끝납니다. 이후 메뉴 버튼과 CTA는 이 섹션으로 연결됩니다.</p>
            </div>
            <div className="hub-contact-card__points">
              {CONTACT_POINTS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <button type="button" className="hub-topbar__cta" onClick={() => scrollToSection("samples")}>샘플 다시 보기</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function DeviceSwitch({ viewMode, onViewChange }) {
  return (
    <div className="device-switch">
      <button type="button" className={viewMode === "desktop" ? "is-active" : ""} onClick={() => onViewChange("desktop")}>
        <Monitor size={15} />
        PC
      </button>
      <button type="button" className={viewMode === "mobile" ? "is-active" : ""} onClick={() => onViewChange("mobile")}>
        <Smartphone size={15} />
        Mobile
      </button>
    </div>
  );
}

function SiteTopbar({ site, viewMode, isMobileClient, onViewChange, onBack }) {
  return (
    <header className="site-topbar">
      <div className="site-topbar__start">
        <button type="button" className="site-topbar__back" onClick={onBack}>
          <ArrowLeft size={18} />
          갤러리
        </button>
        <div className="site-topbar__brand">
          <strong>{site.brand}</strong>
          <span>{site.industry}</span>
        </div>
      </div>
      <div className="site-topbar__end">{!isMobileClient ? <DeviceSwitch viewMode={viewMode} onViewChange={onViewChange} /> : null}</div>
    </header>
  );
}

function RouteDock({ site, route, onNavigate }) {
  return (
    <nav className="route-dock" aria-label={`${site.brand} 페이지 이동`}>
      {site.routes.map((item) => (
        <button
          key={item.slug}
          type="button"
          className={item.slug === route.slug ? "is-active" : ""}
          onClick={() => onNavigate(buildSitePath(site.id, item.slug))}
          disabled={!item.ready}
          aria-current={item.slug === route.slug ? "page" : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function ScreenStage({ site, route, actualView, isMobileClient }) {
  const stage = site.routeAssets[route.slug][actualView];
  const frameClass = actualView === "mobile" && !isMobileClient ? "screen-stage__frame screen-stage__frame--phone" : "screen-stage__frame";
  const title = `${site.brand} ${route.label}`;

  return (
    <section className={`screen-stage screen-stage--${actualView}`} aria-label={title}>
      <div className={frameClass} style={{ "--stage-height": `${stage.stageHeight}px` }}>
        {actualView === "mobile" && !isMobileClient ? <span className="screen-stage__notch" aria-hidden="true" /> : null}
        {stage.html ? <iframe title={title} src={stage.html} loading="lazy" /> : <img src={stage.image} alt={stage.alt} loading="lazy" />}
      </div>
    </section>
  );
}

export function SiteView({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack }) {
  const actualView = isMobileClient ? "mobile" : viewMode;
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  return (
    <div className="site-shell" data-tone={site.backdrop} data-view={actualView} style={{ ...themeStyle(site.theme), ...pointerStyle }} onPointerMove={onPointerMove}>
      <SceneBackdrop tone={site.backdrop} />
      <div className="site-shell__content">
        <div className="site-shell__frame">
          <SiteTopbar site={site} viewMode={actualView} isMobileClient={isMobileClient} onViewChange={onViewChange} onBack={onBack} />
          <main className="site-main site-main--immersive">
            <ScreenStage site={site} route={route} actualView={actualView} isMobileClient={isMobileClient} />
            <RouteDock site={site} route={route} onNavigate={onNavigate} />
          </main>
        </div>
      </div>
    </div>
  );
}

export function SiteStaging({ site, route, onHome, onOpenHome }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone={site.backdrop} />
      <div className="hub-page__content">
        <section className="missing-card">
          <span>준비 중</span>
          <h1>{site.brand} {route.label} 페이지를 정리하고 있습니다.</h1>
          <p>현재는 홈 화면까지 공개되어 있고, 나머지 페이지는 순차적으로 연결 중입니다.</p>
          <div className="tag-rail">
            <span>{site.homeMode}</span>
            <span>{site.industry}</span>
            <span>완성 라우트 {site.gallery.readyRoutes}/{site.gallery.totalRoutes}</span>
          </div>
          {site.gallery.homeReady ? <button type="button" className="cta cta--primary" onClick={onOpenHome}>홈 보기</button> : null}
          <button type="button" className="cta cta--secondary" onClick={onHome}>갤러리로 돌아가기</button>
        </section>
      </div>
    </div>
  );
}

export function NotFound({ onHome }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <section className="missing-card">
          <span>찾을 수 없음</span>
          <h1>요청한 페이지를 찾지 못했습니다.</h1>
          <p>갤러리로 돌아가 다른 샘플 사이트를 확인해 주세요.</p>
          <button type="button" className="cta cta--primary" onClick={onHome}>갤러리로 돌아가기</button>
        </section>
      </div>
    </div>
  );
}
