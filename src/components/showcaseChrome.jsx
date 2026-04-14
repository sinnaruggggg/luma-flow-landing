import { ArrowLeft, ChevronRight, Clock3, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { HubMark, SceneBackdrop, ShowcasePhone } from "./showcaseAtoms";

function totals() {
  const totalRoutes = siteRegistry.reduce((sum, site) => sum + site.gallery.totalRoutes, 0);
  const readyRoutes = siteRegistry.reduce((sum, site) => sum + site.gallery.readyRoutes, 0);
  const readySites = siteRegistry.filter((site) => site.gallery.publicReady).length;
  const liveHomes = siteRegistry.filter((site) => site.gallery.homeReady).length;
  return { sites: siteRegistry.length, totalRoutes, readyRoutes, readySites, liveHomes };
}

function coverageLabel(site) {
  if (site.gallery.publicReady) return "5페이지 완성";
  if (site.gallery.homeReady) return `홈 공개 · ${site.gallery.readyRoutes}/${site.gallery.totalRoutes}`;
  if (site.gallery.stitchedRoutes > 0) return `제작 중 · ${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes}`;
  return "준비 중";
}

function GalleryCard({ site, onOpen }) {
  const canOpen = site.gallery.homeReady;

  return (
    <button type="button" className={`hub-card ${canOpen ? "" : "hub-card--disabled"}`.trim()} onClick={() => onOpen(buildSitePath(site.id))} disabled={!canOpen}>
      <div className="hub-card__visual">
        <img src={site.gallery.desktop} alt={`${site.brand} PC 미리보기`} />
        <ShowcasePhone src={site.gallery.mobile} />
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
    </button>
  );
}

export function GalleryHome({ onOpen }) {
  const summary = totals();

  return (
    <div className="hub-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <header className="hub-topbar">
          <div className="hub-topbar__brand">
            <HubMark />
            <div>
              <strong>20개 독립 샘플 사이트</strong>
              <span>메인 카드에서 바로 진입하고, 각 사이트는 홈 포함 5개 페이지 구조로 이어집니다.</span>
            </div>
          </div>
          <div className="hub-topbar__meta">
            <span>사이트 {summary.sites}개</span>
            <span>홈 공개 {summary.liveHomes}개</span>
            <span>라우트 공개 {summary.readyRoutes}/{summary.totalRoutes}</span>
            <span>전체 완성 {summary.readySites}개</span>
          </div>
        </header>

        <section className="hub-hero">
          <span className="hub-hero__eyebrow">Stitch 기반 갤러리</span>
          <h1>메인에서 고르고, 들어가면 바로 실제 사이트처럼 보이게 보여줍니다.</h1>
          <p>상세에서는 설명 패널 없이 사이트 화면 자체만 크게 보여줍니다. 데스크톱에서는 PC와 모바일을 전환해서 보고, 모바일 기기에서는 모바일 레이아웃만 바로 확인할 수 있습니다.</p>
        </section>

        <section className="hub-grid">
          {siteRegistry.map((site) => (
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

function SiteTopbar({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack }) {
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
      <nav className="site-nav" aria-label={`${site.brand} 메뉴`}>
        {site.routes.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={item.slug === route.slug ? "is-active" : ""}
            onClick={() => onNavigate(buildSitePath(site.id, item.slug))}
            disabled={!item.ready}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="site-topbar__end">{!isMobileClient ? <DeviceSwitch viewMode={viewMode} onViewChange={onViewChange} /> : null}</div>
    </header>
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
          <SiteTopbar site={site} route={route} viewMode={actualView} isMobileClient={isMobileClient} onViewChange={onViewChange} onNavigate={onNavigate} onBack={onBack} />
          <main className="site-main site-main--immersive">
            <ScreenStage site={site} route={route} actualView={actualView} isMobileClient={isMobileClient} />
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
          <p>이 사이트의 홈은 바로 볼 수 있고, 나머지 페이지는 순차적으로 연결됩니다.</p>
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
