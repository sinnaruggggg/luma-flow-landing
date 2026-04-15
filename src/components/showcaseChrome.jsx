import { ArrowLeft, ChevronRight, Clock3, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { SceneBackdrop, ShowcasePhone, WebForgeMark } from "./showcaseAtoms";

const PRIORITY_SITE_IDS = ["indie-bookstore", "stationery-shop", "local-cafe", "boutique-hotel"];

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

function PreviewSurface({ stage, title, className = "", loading = "lazy" }) {
  return (
    <div className={`preview-surface ${className}`.trim()}>
      {stage.html ? <iframe title={title} src={stage.html} loading={loading} tabIndex={-1} /> : <img src={stage.image} alt={stage.alt} loading={loading} />}
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
        <PreviewSurface stage={desktopStage} title={`${site.brand} PC 미리보기`} className="hub-card__desktop-shot" />
        <ShowcasePhone src={mobileStage.image} html={mobileStage.html} alt={`${site.brand} 모바일 미리보기`} title={`${site.brand} 모바일 홈`} />
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
          <nav className="hub-topbar__menu-slot" aria-label="메인 메뉴" />
        </header>

        <section className="hub-hero hub-hero--minimal" aria-label="WebForge 소개">
          <div className="hub-hero__content hub-hero__content--minimal">
            <h1>누구나 쉽게 만드는 나만의 web</h1>
          </div>
        </section>

        <section className="hub-grid">
          {orderedSites.map((site) => (
            <GalleryCard key={site.id} site={site} onOpen={onOpen} />
          ))}
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
