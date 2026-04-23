import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { parseSitePath } from "./content/siteRegistry";
import { AdminConsole } from "./components/adminConsole";
import { trackSiteVisit } from "./lib/inquiryApi";
import { stripBasePath, withBasePath } from "./lib/appPaths";
import { useIsMobileClient } from "./lib/showcaseUtils";
import { ADMIN_PATH, buildManagedPortfolioItems, buildManagedSites, useAdminState } from "./lib/adminStore";
import { GalleryHome, NotFound, PortfolioEmbedView, PortfolioIndexView, SiteStaging } from "./components/showcaseChrome";
import { SiteView } from "./components/siteExperience";
import "./site-app.css";

function readLocationState() {
  return {
    pathname: stripBasePath(window.location.pathname || "/"),
    search: window.location.search || "",
  };
}

function normalizePathname(pathname) {
  return pathname === "/index.html" ? "/" : pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

export default function App() {
  const [locationState, setLocationState] = useState(readLocationState);
  const [viewMode, setViewMode] = useState("desktop");
  const lastVisitKeyRef = useRef("");
  const isMobileClient = useIsMobileClient();
  const { adminState, saveAdminState, resetAdminState } = useAdminState();
  const managedSites = useMemo(() => buildManagedSites(adminState), [adminState]);
  const managedPortfolioItems = useMemo(() => buildManagedPortfolioItems(adminState), [adminState]);
  const sitesById = useMemo(() => Object.fromEntries(managedSites.map((site) => [site.id, site])), [managedSites]);
  const portfolioItemsById = useMemo(() => Object.fromEntries(managedPortfolioItems.map((item) => [item.id, item])), [managedPortfolioItems]);

  useEffect(() => {
    const onPopState = () => {
      const nextLocation = readLocationState();
      if (nextLocation.pathname === "/") {
        setViewMode("desktop");
      }
      setLocationState(nextLocation);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    const targetPath = withBasePath(nextPath || "/");
    const nextUrl = new URL(targetPath, window.location.origin);
    const nextLocation = {
      pathname: stripBasePath(nextUrl.pathname || "/"),
      search: nextUrl.search || "",
    };

    if (nextLocation.pathname === locationState.pathname && nextLocation.search === locationState.search) {
      return;
    }

    if (nextLocation.pathname === "/") {
      setViewMode("desktop");
    }

    window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
    window.scrollTo(0, 0);
    setLocationState(nextLocation);
  };

  const normalizedPath = useMemo(() => normalizePathname(locationState.pathname), [locationState.pathname]);
  const routeState = useMemo(
    () => {
      if (normalizedPath === ADMIN_PATH) {
        return { kind: "admin" };
      }

      if (normalizedPath === "/portfolio") {
        return { kind: "portfolio-index" };
      }

      if (normalizedPath.startsWith("/portfolio/")) {
        const [, , portfolioId = ""] = normalizedPath.split("/");
        return { kind: "portfolio", portfolioId: decodeURIComponent(portfolioId) };
      }

      return parseSitePath(normalizedPath);
    },
    [normalizedPath],
  );
  const site = useMemo(
    () => (routeState.kind === "site" || routeState.kind === "staging" ? sitesById[routeState.siteId] : null),
    [routeState, sitesById],
  );
  const selectedContactSiteId = routeState.kind === "gallery" ? new URLSearchParams(locationState.search).get("contact") ?? "" : "";
  const contactPathForSite = (siteId) => `/?contact=${siteId}`;

  useEffect(() => {
    if (routeState.kind !== "site" || !site) {
      lastVisitKeyRef.current = "";
      return;
    }

    const sessionKey = `webforge-site-visit:${site.id}`;
    const visitKey = `${normalizedPath}${locationState.search}`;

    if (window.sessionStorage.getItem(sessionKey) || lastVisitKeyRef.current === visitKey) {
      return;
    }

    lastVisitKeyRef.current = visitKey;
    window.sessionStorage.setItem(sessionKey, new Date().toISOString());

    trackSiteVisit({
      siteId: site.id,
      routeSlug: routeState.route.slug,
      routeLabel: routeState.route.label,
      sourcePath: `${normalizedPath}${locationState.search}`,
    });
  }, [locationState.search, normalizedPath, routeState, site]);

  return (
    <AnimatePresence mode="wait">
      {routeState.kind === "admin" ? (
        <Motion.div
          key="admin"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <AdminConsole adminState={adminState} onSave={saveAdminState} onReset={resetAdminState} onBack={() => navigate("/")} />
        </Motion.div>
      ) : null}

      {routeState.kind === "gallery" ? (
        <Motion.div
          key="gallery"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <GalleryHome
            sites={managedSites}
            content={adminState.content}
            inquirySettings={adminState.inquiry}
            onOpen={navigate}
            onOpenPortfolioIndex={() => navigate("/portfolio")}
            onContactSample={(siteId) => navigate(contactPathForSite(siteId))}
            selectedContactSiteId={selectedContactSiteId}
          />
        </Motion.div>
      ) : null}

      {routeState.kind === "portfolio-index" ? (
        <Motion.div
          key="portfolio-index"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <PortfolioIndexView
            items={managedPortfolioItems}
            onBack={() => navigate("/")}
            onOpen={(portfolioId) => navigate(`/portfolio/${portfolioId}`)}
          />
        </Motion.div>
      ) : null}

      {routeState.kind === "portfolio" ? (
        <Motion.div
          key={`portfolio-${routeState.portfolioId}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <PortfolioEmbedView item={portfolioItemsById[routeState.portfolioId]} onBack={() => navigate("/portfolio")} />
        </Motion.div>
      ) : null}

      {routeState.kind === "site" && site ? (
        <Motion.div
          key={`${site.id}-${routeState.route.slug}-${isMobileClient ? "mobile" : viewMode}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <SiteView
            site={site}
            route={routeState.route}
            viewMode={viewMode}
            isMobileClient={isMobileClient}
            onViewChange={setViewMode}
            onNavigate={navigate}
            onBack={() => navigate("/")}
          />
        </Motion.div>
      ) : null}

      {routeState.kind === "staging" && site ? (
        <Motion.div
          key={`staging-${site.id}-${routeState.route.slug}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <SiteStaging site={site} route={routeState.route} onHome={() => navigate("/")} onOpenHome={() => navigate(`/${site.id}`)} />
        </Motion.div>
      ) : null}

      {routeState.kind === "not-found" ? (
        <Motion.div
          key="not-found"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <NotFound onHome={() => navigate("/")} />
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
}
