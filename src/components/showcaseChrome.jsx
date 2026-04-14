import { ArrowLeft, CheckCircle2, ChevronRight, Clock3, Layers3, Monitor, Smartphone } from "lucide-react";
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
  if (site.gallery.publicReady) return "전체 공개";
  if (site.gallery.homeReady) return `${site.gallery.readyRoutes}/${site.gallery.totalRoutes} 공개`;
  if (site.gallery.stitchedRoutes > 0) return `${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes} 준비`;
  return "스티치 준비 중";
}

function GalleryCard({ site, onOpen }) {
  const canOpen = site.gallery.homeReady;

  return (
    <button type="button" className={`hub-card ${canOpen ? "" : "hub-card--disabled"}`.trim()} onClick={() => onOpen(buildSitePath(site.id))} disabled={!canOpen}>
      <div className="hub-card__visual">
        <img src={site.gallery.desktop} alt={`${site.brand} desktop preview`} />
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
            {canOpen ? "사이트 입장" : "준비 중"}
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
              <span>같은 크기 카드로 나열하고, 클릭하면 각 사이트 홈으로 바로 진입합니다. 사이트마다 5개 라우트 구조를 가집니다.</span>
            </div>
          </div>
          <div className="hub-topbar__meta">
            <span>사이트 {summary.sites}개</span>
            <span>홈 공개 {summary.liveHomes}개</span>
            <span>라우트 공개 {summary.readyRoutes}/{summary.totalRoutes}</span>
            <span>전체 공개 {summary.readySites}개</span>
          </div>
        </header>

        <section className="hub-hero">
          <span className="hub-hero__eyebrow">스티치 우선 갤러리</span>
          <h1>하나의 템플릿 변주가 아니라, 20개의 실제 다른 사이트처럼 바로 들어가게 만듭니다.</h1>
          <p>
            카드 슬롯은 20개를 모두 유지하되, 실제 데스크톱과 모바일 Stitch 산출물이 있는 홈만 열립니다.
            fallback 미리보기는 공개 라우트로 쓰지 않습니다.
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
          갤러리
        </button>
        <div className="site-topbar__brand">
          <strong>{site.brand}</strong>
          <span>{site.industry}</span>
        </div>
      </div>
      <nav className="site-nav" aria-label={`${site.brand} routes`}>
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

function StatusBadge({ stage }) {
  const label = stage.source === "stitch-html" ? "Stitch HTML" : stage.source === "stitch-image" ? "Stitch PNG" : "대체 미리보기";
  return (
    <span className={`status-pill status-pill--${stage.source}`}>
      {stage.stitched ? <CheckCircle2 size={14} /> : <Layers3 size={14} />}
      {label}
    </span>
  );
}

function ScreenStage({ site, route, actualView, isMobileClient }) {
  const stage = site.routeAssets[route.slug][actualView];
  const frameClass = actualView === "mobile" && !isMobileClient ? "screen-stage__frame screen-stage__frame--phone" : "screen-stage__frame";

  return (
    <section className="screen-stage">
      <div className="screen-stage__head">
        <div>
          <span className="screen-stage__eyebrow">{route.label}</span>
          <h1>{site.brand}</h1>
        </div>
        <StatusBadge stage={stage} />
      </div>
      <div className={frameClass} style={{ "--stage-height": `${stage.stageHeight}px` }}>
        {actualView === "mobile" && !isMobileClient ? <span className="screen-stage__notch" aria-hidden="true" /> : null}
        {stage.html ? <iframe title={`${site.brand} ${route.label}`} src={stage.html} loading="lazy" /> : <img src={stage.image} alt={stage.alt} />}
      </div>
    </section>
  );
}

function Panel({ eyebrow, title, children }) {
  return (
    <section className="info-panel">
      <span className="info-panel__eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function RouteRows({ rows }) {
  return (
    <div className="info-panel__rows">
      {rows.map((row) => (
        <div key={`${row.label}-${row.value}`} className="info-panel__row">
          <span>{row.label}</span>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

function SidePanels({ site, route, actualView, onNavigate }) {
  const stage = site.routeAssets[route.slug][actualView];
  const homeLink = site.routes[0];
  const nextRoutes = site.routes.filter((item) => item.slug !== route.slug).slice(0, 3);

  return (
    <aside className="site-side">
      <Panel eyebrow="의도" title={route.description}>
        <p>{site.summary}</p>
      </Panel>
      <Panel eyebrow="구조" title={site.homeMode}>
        <RouteRows rows={[{ label: "첫 화면", value: site.homeMode }, { label: actualView === "mobile" ? "모바일 우선 규칙" : "데스크톱 포인트", value: actualView === "mobile" ? site.mobileRule : "첫 화면이 넓고 깊이감 있게 열려 사이트 문법이 바로 보여야 한다." }]} />
      </Panel>
      <Panel eyebrow="운영 지표" title={`${site.industry} 핵심 수치`}>
        <RouteRows rows={site.stats} />
      </Panel>
      <Panel eyebrow="이동" title="사이트 안에서 이동">
        <div className="route-links">
          {homeLink.slug !== route.slug ? <button type="button" className="route-link" onClick={() => onNavigate(buildSitePath(site.id, homeLink.slug))} disabled={!homeLink.ready}>홈</button> : null}
          {nextRoutes.map((item) => (
            <button key={item.slug} type="button" className="route-link" onClick={() => onNavigate(buildSitePath(site.id, item.slug))} disabled={!item.ready}>
              {item.label}
            </button>
          ))}
          <span className="route-note">
            {stage.html ? "이 라우트는 실제 Stitch HTML이 연결되어 있습니다." : "이 라우트는 Stitch 스크린샷을 사용 중이며 HTML 캡처는 아직 정리 중입니다."}
          </span>
        </div>
      </Panel>
    </aside>
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
          <main className="site-main">
            <ScreenStage site={site} route={route} actualView={actualView} isMobileClient={isMobileClient} />
            <SidePanels site={site} route={route} actualView={actualView} onNavigate={onNavigate} />
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
          <span>스티치 준비 중</span>
          <h1>{site.brand} {route.label} 페이지는 아직 공개 준비가 끝나지 않았습니다.</h1>
          <p>
            데스크톱과 모바일 Stitch 산출물이 모두 로컬에 저장되기 전까지는 이 라우트를 막아둡니다.
            현재 공개 범위: {site.gallery.readyRoutes}/{site.gallery.totalRoutes} 라우트.
          </p>
          <div className="tag-rail">
            <span>{site.homeMode}</span>
            <span>{site.industry}</span>
            <span>생성 화면 {site.gallery.stitchedScreens}개</span>
          </div>
          {site.gallery.homeReady ? <button type="button" className="cta cta--primary" onClick={onOpenHome}>홈 열기</button> : null}
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
          <span>라우트를 찾을 수 없음</span>
          <h1>이 경로는 현재 준비된 사이트 맵에 없습니다.</h1>
          <p>갤러리로 돌아가 다른 사이트를 열어주세요.</p>
          <button type="button" className="cta cta--primary" onClick={onHome}>갤러리로 돌아가기</button>
        </section>
      </div>
    </div>
  );
}
