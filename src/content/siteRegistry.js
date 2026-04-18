import { getBlueprintForSite, getRouteDescription, getStageHeight, siteCatalog } from "./siteCatalog";

const stitchImages = import.meta.glob("../../design/stitch/*/screens/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const stitchHtml = import.meta.glob("../../design/stitch/*/screens/*.html", {
  eager: true,
  query: "?url",
  import: "default",
});

const fallbackKinds = {
  home: "brand",
  browse: "scene",
  detail: "product",
  checkout: "scene",
  brand: "brand",
  reserve: "scene",
  guide: "scene",
  features: "scene",
  cases: "scene",
  pricing: "scene",
  contact: "scene",
  works: "brand",
  services: "scene",
  brief: "product",
  lineup: "brand",
  schedule: "product",
  tickets: "scene",
  feed: "scene",
  perks: "product",
  join: "scene",
};

function findAsset(glob, siteId, pageSlug, device) {
  const prefix = `../../design/stitch/${siteId}/screens/${pageSlug}-${device}.`;
  return Object.entries(glob).find(([key]) => key.startsWith(prefix))?.[1] ?? null;
}

function getFallbackImage(site, routeKind, device) {
  const kind = fallbackKinds[routeKind] ?? "scene";
  if (device === "mobile" && routeKind === "home") {
    return site.images.product ?? site.images.brand;
  }
  return site.images[kind] ?? site.images.scene ?? site.images.brand;
}

function buildStage(site, route, device) {
  const stitchedImage = findAsset(stitchImages, site.id, route.slug, device);
  const image = stitchedImage ?? getFallbackImage(site, route.kind, device);
  const html = findAsset(stitchHtml, site.id, route.slug, device);
  const stitched = Boolean(html || stitchedImage);

  return {
    image,
    html,
    stitched,
    source: html ? "stitch-html" : stitched ? "stitch-image" : "fallback-image",
    stageHeight: getStageHeight(route.kind, device),
    alt: `${site.brand} ${route.label} ${device} preview`,
  };
}

function buildRouteAssets(site, routes) {
  return Object.fromEntries(
    routes.map((route) => [
      route.slug,
      {
        desktop: buildStage(site, route, "desktop"),
        mobile: buildStage(site, route, "mobile"),
      },
    ]),
  );
}

function buildGalleryThumb(site, device) {
  const stitchedImage = findAsset(stitchImages, site.id, "home", device);

  return {
    src: `/generated/thumbs/${site.id}-home-${device}.webp`,
    fallbackSrc: stitchedImage ?? getFallbackImage(site, "home", device),
    alt: `${site.brand} home ${device} card preview`,
  };
}

function isRouteReady(entry) {
  return entry.desktop.stitched && entry.mobile.stitched;
}

function getCoverage(routeAssets) {
  const values = Object.values(routeAssets);
  const stitchedRoutes = values.filter((entry) => entry.desktop.stitched || entry.mobile.stitched).length;
  const readyRoutes = values.filter(isRouteReady).length;
  const stitchedScreens = values.reduce((sum, entry) => sum + Number(entry.desktop.stitched) + Number(entry.mobile.stitched), 0);
  return { stitchedRoutes, readyRoutes, stitchedScreens };
}

export function buildSitePath(siteId, slug = "home") {
  return slug === "home" ? `/${siteId}` : `/${siteId}/${slug}`;
}

export function parseSitePath(pathname) {
  const cleanPath = pathname === "/index.html" ? "/" : pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  if (cleanPath === "/") return { kind: "gallery" };

  const [siteId, pageSlug = "home"] = cleanPath.split("/").filter(Boolean);
  const site = siteRegistryById[siteId];
  if (!site) return { kind: "not-found" };

  const route = site.routes.find((entry) => entry.slug === pageSlug);
  if (!route) return { kind: "not-found" };
  if (!route.ready) return { kind: "staging", siteId, route };

  return { kind: "site", siteId, route };
}

export const siteRegistry = siteCatalog.map((site) => {
  const blueprint = getBlueprintForSite(site.id);
  const routes = site.routes.map((route) => ({ ...route, description: getRouteDescription(route.kind) }));
  const routeAssets = buildRouteAssets(site, routes);
  const coverage = getCoverage(routeAssets);
  const galleryThumbs = {
    desktop: buildGalleryThumb(site, "desktop"),
    mobile: buildGalleryThumb(site, "mobile"),
  };

  return {
    ...site,
    blueprint,
    routes: routes.map((route) => ({ ...route, ready: isRouteReady(routeAssets[route.slug]) })),
    routeAssets,
    galleryThumbs,
    gallery: {
      desktop: routeAssets.home.desktop.image,
      mobile: routeAssets.home.mobile.image,
      homeMode: site.homeMode,
      hook: blueprint.heroMode,
      homeReady: isRouteReady(routeAssets.home),
      stitchedRoutes: coverage.stitchedRoutes,
      readyRoutes: coverage.readyRoutes,
      stitchedScreens: coverage.stitchedScreens,
      totalRoutes: routes.length,
      publicReady: coverage.readyRoutes === routes.length,
    },
  };
});

export const siteRegistryById = Object.fromEntries(siteRegistry.map((site) => [site.id, site]));
