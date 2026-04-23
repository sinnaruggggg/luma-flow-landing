import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { buildSitePath } from "../content/siteRegistry";
import "../site-experience.css";

function normalizeRouteLabel(label = "") {
  return label.replace(/\s+/g, "").trim().toLowerCase();
}

const ROUTE_ALIASES = {
  home: ["start", "main", "index"],
  classes: ["class", "schedule", "timetable", "program", "programs", "session"],
  coaches: ["coach", "roster", "trainer", "trainers", "team"],
  join: ["membership", "member", "signup", "signin", "register", "jointhering", "jointhehouse", "jointheclub", "pass"],
  guide: ["info", "faq", "facility", "story", "philosophy", "hours", "visitus"],
  features: ["feature", "product"],
  cases: ["case", "stories"],
  pricing: ["plans", "plan", "fees"],
  contact: ["consult", "inquiry", "inquire", "문의"],
  routine: ["buildstack", "stack"],
  compare: ["compareplans", "comparison"],
  subscribe: ["subscription"],
  brand: ["science", "about"],
  lineup: ["artists"],
  schedule: ["timetable"],
  tickets: ["ticket", "buystickets", "purchase", "purchasenow"],
  feed: ["community", "livefeed"],
  perks: ["benefits", "benefit"],
  models: ["model", "telemetry"],
  charge: ["charging", "network"],
  drive: ["testdrive", "scheduledrive", "bookdrive"],
  support: ["help", "warranty"],
  shop: ["shopall", "catalog", "viewcatalog"],
  shades: ["shade"],
  menu: ["menuboard", "allmenu", "fullmenu"],
  visit: ["location", "directions", "map"],
  reserve: ["booking", "availability", "book"],
  info: ["guide", "details"],
  rooms: ["room", "viewroom", "viewallrooms", "allrooms"],
  offers: ["packages", "offer"],
  sets: ["set"],
  planner: ["spaces", "space"],
  looks: ["lookbook", "getthelook"],
  collection: ["series", "collections"],
  bespoke: ["custom", "custommade"],
  consult: ["consultation", "bookaconsult", "inquirynow"],
};

function addRouteAlias(routeMap, site, key, slug) {
  const route = site.routes.find((item) => item.slug === slug && item.ready);
  if (!route) return;
  routeMap.set(normalizeRouteLabel(key), route);
}

function addKeywordAliases(routeMap, site) {
  site.routes.forEach((route) => {
    if (!route.ready) return;
    (ROUTE_ALIASES[route.slug] ?? []).forEach((alias) => {
      addRouteAlias(routeMap, site, alias, route.slug);
    });
  });

  if (site.id === "boxing-gym") {
    addRouteAlias(routeMap, site, "roster", "coaches");
    addRouteAlias(routeMap, site, "schedule", "classes");
    addRouteAlias(routeMap, site, "facility", "guide");
    addRouteAlias(routeMap, site, "membership", "join");
    addRouteAlias(routeMap, site, "initializebooking", "join");
    addRouteAlias(routeMap, site, "jointhering", "join");
  }
}

function patchStageRouteLinks(frame, site, onNavigate) {
  try {
    const doc = frame.contentDocument;
    if (!doc) return;

    const routeMap = new Map();
    site.routes.forEach((item) => {
      if (!item.ready) return;

      [item.label, item.legacyLabel].forEach((candidate) => {
        const normalized = normalizeRouteLabel(candidate);
        if (normalized) {
          routeMap.set(normalized, item);
        }
      });
    });

    addKeywordAliases(routeMap, site);

    doc.querySelectorAll("a, button, [role='button']").forEach((element) => {
      const label = normalizeRouteLabel(element.getAttribute("aria-label") || element.textContent || "");
      const matchedRoute = routeMap.get(label);
      if (!matchedRoute) return;
      if (element.dataset.webforgeRoute === matchedRoute.slug) return;

      element.dataset.webforgeRoute = matchedRoute.slug;

      if (element.tagName === "A") {
        element.setAttribute("href", buildSitePath(site.id, matchedRoute.slug));
      }

      element.style.cursor = "pointer";
      element.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onNavigate(buildSitePath(site.id, matchedRoute.slug));
      };
    });
  } catch {
    // Ignore cross-document patch failures and keep the static stage visible.
  }
}

function buildShellStyle(theme = {}) {
  return {
    "--site-shell-surface": theme.panel ?? "rgba(12, 16, 24, 0.72)",
    "--site-shell-line": theme.line ?? "rgba(255, 255, 255, 0.16)",
    "--site-shell-text": theme.text ?? "#f5f7fb",
    "--site-shell-muted": theme.muted ?? "rgba(245, 247, 251, 0.72)",
    "--site-shell-accent": theme.accent ?? "#ffffff",
    "--site-shell-button-text": theme.buttonText ?? theme.text ?? "#121212",
    "--site-shell-backdrop": theme.bg ?? "#0a0c12",
  };
}

function SiteDock({ actualView, isMobileClient, onBack, onViewChange, route, site }) {
  return (
    <div className="site-experience__dock" role="toolbar" aria-label={`${site.brand} controls`}>
      <button type="button" className="site-experience__dock-back" onClick={onBack}>
        <ArrowLeft size={15} />
        Showcase
      </button>
      <div className="site-experience__dock-copy" aria-hidden="true">
        <strong>{site.brand}</strong>
        <span>{route.label}</span>
      </div>
      {!isMobileClient ? (
        <div className="site-experience__dock-switch" role="tablist" aria-label="Viewport mode">
          <button type="button" className={actualView === "desktop" ? "is-active" : ""} onClick={() => onViewChange("desktop")}>
            <Monitor size={15} />
            Desktop
          </button>
          <button type="button" className={actualView === "mobile" ? "is-active" : ""} onClick={() => onViewChange("mobile")}>
            <Smartphone size={15} />
            Mobile
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SiteView({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack }) {
  const actualView = isMobileClient ? "mobile" : viewMode;
  const stage = site.routeAssets[route.slug]?.[actualView] ?? site.routeAssets.home?.[actualView];
  const frameRef = useRef(null);
  const shellStyle = useMemo(() => buildShellStyle(site.theme), [site.theme]);
  const title = `${site.brand} ${route.label}`;
  const mobileDesktopPreview = actualView === "mobile" && !isMobileClient;

  useEffect(() => {
    if (!stage?.html || !frameRef.current) {
      return undefined;
    }

    const frame = frameRef.current;
    const handleLoad = () => {
      patchStageRouteLinks(frame, site, onNavigate);
    };

    frame.addEventListener("load", handleLoad);

    if (frame.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      frame.removeEventListener("load", handleLoad);
    };
  }, [onNavigate, site, stage?.html]);

  return (
    <main className="site-experience" data-view={actualView} data-mobile-preview={mobileDesktopPreview ? "true" : "false"} style={shellStyle}>
      <div className="site-experience__viewport">
        <div className={`site-experience__frame ${mobileDesktopPreview ? "site-experience__frame--mobile" : ""}`.trim()}>
          {stage?.html ? (
            <iframe ref={frameRef} className="site-experience__document" title={title} src={stage.html} loading="eager" />
          ) : (
            <img className="site-experience__image" src={stage?.image} alt={stage?.alt ?? title} loading="eager" />
          )}
        </div>
      </div>
      <SiteDock actualView={actualView} isMobileClient={isMobileClient} onBack={onBack} onViewChange={onViewChange} route={route} site={site} />
    </main>
  );
}
