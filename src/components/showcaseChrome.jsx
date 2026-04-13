import { ArrowLeft, CheckCircle2, ChevronRight, Layers3, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { HubMark, SceneBackdrop, ShowcasePhone } from "./showcaseAtoms";

function totals() {
  const routes = siteRegistry.reduce((sum, site) => sum + site.gallery.totalRoutes, 0);
  const staged = siteRegistry.reduce((sum, site) => sum + site.gallery.stitchedRoutes, 0);
  return { sites: siteRegistry.length, routes, staged };
}

function coverageLabel(site) {
  if (site.gallery.fullRoutes === site.gallery.totalRoutes) return "Full Stitch";
  if (site.gallery.stitchedRoutes > 0) return `${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes} staged`;
  return "Fallback preview";
}

function GalleryCard({ site, onOpen }) {
  return (
    <button type="button" className="hub-card" onClick={() => onOpen(buildSitePath(site.id))}>
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
            Enter site
            <ChevronRight size={16} />
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
              <strong>20 Independent Sample Sites</strong>
              <span>Same-sized cards. Direct entry into each site home. Five-route structure per site.</span>
            </div>
          </div>
          <div className="hub-topbar__meta">
            <span>{summary.sites} sites</span>
            <span>{summary.routes} routes</span>
            <span>{summary.staged} stitched routes</span>
          </div>
        </header>

        <section className="hub-hero">
          <span className="hub-hero__eyebrow">Stitch-first Gallery</span>
          <h1>Twenty sites that enter as sites, not as one family of layout variations.</h1>
          <p>
            Every card opens straight into <code>/{'{'}siteId{'}'}</code>. The viewer prefers local Stitch HTML, then local Stitch screenshots,
            then the existing fallback previews until each route is staged.
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
          Gallery
        </button>
        <div className="site-topbar__brand">
          <strong>{site.brand}</strong>
          <span>{site.blueprint.family}</span>
        </div>
      </div>
      <nav className="site-nav" aria-label={`${site.brand} routes`}>
        {site.routes.map((item) => (
          <button key={item.slug} type="button" className={item.slug === route.slug ? "is-active" : ""} onClick={() => onNavigate(buildSitePath(site.id, item.slug))}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="site-topbar__end">{!isMobileClient ? <DeviceSwitch viewMode={viewMode} onViewChange={onViewChange} /> : null}</div>
    </header>
  );
}

function StatusBadge({ stage }) {
  const label = stage.source === "stitch-html" ? "Stitch HTML" : stage.source === "stitch-image" ? "Stitch PNG" : "Fallback preview";
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
      <Panel eyebrow="Intent" title={route.description}>
        <p>{site.summary}</p>
        <div className="tag-rail">{site.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
      </Panel>
      <Panel eyebrow="Design DNA" title={site.homeMode}>
        <RouteRows rows={[{ label: "First screen", value: site.blueprint.heroMode }, { label: "Background", value: site.blueprint.background }, { label: "Motion", value: site.blueprint.motion }, { label: actualView === "mobile" ? "Mobile" : "Desktop", value: actualView === "mobile" ? site.mobileRule : "Keep the opening frame spacious and layered." }]} />
      </Panel>
      <Panel eyebrow="Stats" title={`${site.industry} signals`}>
        <RouteRows rows={site.stats} />
      </Panel>
      <Panel eyebrow="Routes" title="Move through the site">
        <div className="route-links">
          {homeLink.slug !== route.slug ? <button type="button" className="route-link" onClick={() => onNavigate(buildSitePath(site.id, homeLink.slug))}>Home</button> : null}
          {nextRoutes.map((item) => (
            <button key={item.slug} type="button" className="route-link" onClick={() => onNavigate(buildSitePath(site.id, item.slug))}>
              {item.label}
            </button>
          ))}
          <span className="route-note">{stage.html ? "Live Stitch HTML is active for this route." : "This route is still using a static preview until Stitch output is staged."}</span>
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

export function NotFound({ onHome }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <section className="missing-card">
          <span>Route not found</span>
          <h1>This route is not staged yet.</h1>
          <p>Return to the gallery and enter another site.</p>
          <button type="button" className="cta cta--primary" onClick={onHome}>Back to gallery</button>
        </section>
      </div>
    </div>
  );
}
