import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { parseSitePath, siteRegistryById } from "./content/siteRegistry";
import { useIsMobileClient } from "./lib/showcaseUtils";
import { GalleryHome, NotFound, SiteStaging, SiteView } from "./components/showcaseChrome";
import "./site-app.css";

function readLocationState() {
  return {
    pathname: window.location.pathname || "/",
    search: window.location.search || "",
  };
}

export default function App() {
  const [locationState, setLocationState] = useState(readLocationState);
  const [viewMode, setViewMode] = useState("desktop");
  const isMobileClient = useIsMobileClient();
  const sitesById = useMemo(() => siteRegistryById, []);

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
    const nextUrl = new URL(nextPath || "/", window.location.origin);
    const nextLocation = {
      pathname: nextUrl.pathname || "/",
      search: nextUrl.search || "",
    };

    if (nextLocation.pathname === locationState.pathname && nextLocation.search === locationState.search) {
      return;
    }

    if (nextLocation.pathname === "/") {
      setViewMode("desktop");
    }

    window.history.pushState({}, "", `${nextLocation.pathname}${nextLocation.search}`);
    window.scrollTo(0, 0);
    setLocationState(nextLocation);
  };

  const routeState = parseSitePath(locationState.pathname);
  const site = routeState.kind === "site" || routeState.kind === "staging" ? sitesById[routeState.siteId] : null;
  const selectedContactSiteId = routeState.kind === "gallery" ? new URLSearchParams(locationState.search).get("contact") ?? "" : "";
  const contactPathForSite = (siteId) => `/?contact=${siteId}`;

  return (
    <AnimatePresence mode="wait">
      {routeState.kind === "gallery" ? (
        <Motion.div
          key="gallery"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26 }}
        >
          <GalleryHome onOpen={navigate} onContactSample={(siteId) => navigate(contactPathForSite(siteId))} selectedContactSiteId={selectedContactSiteId} />
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
            onContact={() => navigate(contactPathForSite(site.id))}
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
