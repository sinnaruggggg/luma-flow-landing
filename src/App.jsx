import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { parseSitePath, siteRegistryById } from "./content/siteRegistry";
import { useIsMobileClient } from "./lib/showcaseUtils";
import { GalleryHome, NotFound, SiteView } from "./components/showcaseChrome";
import "./site-app.css";

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname || "/");
  const [viewMode, setViewMode] = useState("desktop");
  const isMobileClient = useIsMobileClient();
  const sitesById = useMemo(() => siteRegistryById, []);

  useEffect(() => {
    const onPopState = () => {
      const nextPath = window.location.pathname || "/";
      if (nextPath === "/") {
        setViewMode("desktop");
      }
      setPathname(nextPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    const normalized = nextPath || "/";
    if (normalized === pathname) {
      return;
    }

    if (normalized === "/") {
      setViewMode("desktop");
    }

    window.history.pushState({}, "", normalized);
    window.scrollTo(0, 0);
    setPathname(normalized);
  };

  const routeState = parseSitePath(pathname);
  const site = routeState.kind === "site" ? sitesById[routeState.siteId] : null;

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
          <GalleryHome onOpen={navigate} />
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
