import { ArrowLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { getSiteLinks, themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { HomeScene } from "./homeLayouts";
import { RouteScene } from "./routeLayouts";
import { HubMark, SceneBackdrop, ShowcasePhone } from "./showcaseAtoms";

function GalleryCard({ site, onOpen }) {
  return (
    <button type="button" className="hub-card" onClick={() => onOpen(buildSitePath(site.id))}>
      <div className="hub-card__visual">
        <img src={site.gallery.desktop} alt={`${site.brand} desktop preview`} />
        <ShowcasePhone src={site.gallery.mobile} />
      </div>
      <div className="hub-card__body">
        <div className="hub-card__meta">
          <span>{site.presentation.firstScreenMode}</span>
          <span>{site.blueprint.designFamily}</span>
        </div>
        <strong>{site.brand}</strong>
        <p>{site.blueprint.heroMode}</p>
        <div className="hub-card__footer">
          <span>{site.industry}</span>
          <span className="hub-card__action">
            사이트 진입
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </button>
  );
}

export function GalleryHome({ onOpen }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <header className="hub-topbar">
          <div className="hub-topbar__brand">
            <HubMark />
            <div>
              <strong>20 Independent Sample Sites</strong>
              <span>메인 카드는 같고, 안으로 들어가면 완전히 다른 사이트처럼 보이게 구성했습니다.</span>
            </div>
          </div>
          <div className="hub-topbar__meta">
            <span>메인 카드 20개</span>
            <span>/{`{siteId}`} 바로 진입</span>
            <span>PC / Mobile 별도 설계</span>
          </div>
        </header>

        <section className="hub-hero">
          <span className="hub-hero__eyebrow">Showcase Hub</span>
          <h1>같은 템플릿 변주가 아니라, 20개의 실제 다른 사이트처럼 다시 구성한 허브</h1>
          <p>
            카드는 모두 같은 크기로 정리하되, 각 카드를 열면 소개 페이지 없이 곧바로 해당 사이트 홈으로 진입합니다. 홈 화면 문법은 사이트마다
            다르게 만들고, 모바일은 축소가 아니라 전용 레이아웃 기준으로 보이게 구성했습니다.
          </p>
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
          허브
        </button>
        <div className="site-topbar__brand">
          <strong>{site.brand}</strong>
          <span>{site.blueprint.designFamily}</span>
        </div>
      </div>

      <nav className="site-nav" aria-label={`${site.brand} routes`}>
        {site.routes.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={item.slug === route.slug ? "is-active" : ""}
            onClick={() => onNavigate(buildSitePath(site.id, item.slug))}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="site-topbar__end">
        {!isMobileClient ? <DeviceSwitch viewMode={viewMode} onViewChange={onViewChange} /> : null}
      </div>
    </header>
  );
}

export function SiteView({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack }) {
  const actualView = isMobileClient ? "mobile" : viewMode;
  const [pointerStyle, onPointerMove] = useBackdropPointer();
  const links = getSiteLinks(site);

  return (
    <div
      className="site-shell"
      data-tone={site.backdrop}
      data-view={actualView}
      style={{ ...themeStyle(site.theme), ...pointerStyle }}
      onPointerMove={onPointerMove}
    >
      <SceneBackdrop tone={site.backdrop} />
      <div className="site-shell__content">
        <div className={`site-shell__frame ${actualView === "mobile" ? "site-shell__frame--mobile" : ""}`}>
          {actualView === "mobile" && !isMobileClient ? <span className="site-shell__notch" aria-hidden="true" /> : null}
          <SiteTopbar
            site={site}
            route={route}
            viewMode={actualView}
            isMobileClient={isMobileClient}
            onViewChange={onViewChange}
            onNavigate={onNavigate}
            onBack={onBack}
          />
          <main className="site-main">
            {route.kind === "home" ? (
              <HomeScene site={site} isMobileView={actualView === "mobile"} onNavigate={onNavigate} primaryRoute={links.browse} />
            ) : (
              <RouteScene site={site} route={route} isMobileView={actualView === "mobile"} onNavigate={onNavigate} />
            )}
          </main>
        </div>
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
          <span>Route not found</span>
          <h1>해당 경로는 아직 준비되지 않았습니다.</h1>
          <p>메인 허브로 돌아가 다른 사이트를 바로 탐색할 수 있습니다.</p>
          <button type="button" className="cta cta--primary" onClick={onHome}>
            허브로 이동
          </button>
        </section>
      </div>
    </div>
  );
}
