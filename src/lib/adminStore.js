import { useEffect, useMemo, useState } from "react";
import { GALLERY_COPY_DEFAULTS, INQUIRY_DEFAULTS } from "../content/siteAdminDefaults";
import { siteRegistry } from "../content/siteRegistry";

export const ADMIN_PATH = "/sinnaruggggg_admin";

const STORAGE_KEY = "webforge_admin_state_v1";
const STORAGE_EVENT = "webforge:admin-state-updated";
const PRIORITY_SITE_IDS = ["indie-bookstore", "stationery-shop", "local-cafe", "boutique-hotel"];

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function sortBaseSites(sites) {
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

const DEFAULT_SITE_ORDER = Object.fromEntries(sortBaseSites(siteRegistry).map((site, index) => [site.id, index]));

function sanitizeText(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function sanitizeNonEmptyArray(value, fallback) {
  if (!Array.isArray(value)) return cloneState(fallback);

  const next = value
    .map((item) => sanitizeText(item).trim())
    .filter(Boolean);

  return next.length > 0 ? next : cloneState(fallback);
}

function sanitizeOptionalArray(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => sanitizeText(item).trim())
    .filter(Boolean);
}

function sanitizePricingPlans(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) {
    return cloneState(fallback);
  }

  return value.map((plan, index) => {
    const fallbackPlan = fallback[index] ?? fallback[fallback.length - 1];

    return {
      name: sanitizeText(plan?.name, fallbackPlan?.name ?? ""),
      price: sanitizeText(plan?.price, fallbackPlan?.price ?? ""),
      description: sanitizeText(plan?.description, fallbackPlan?.description ?? ""),
      items: sanitizeOptionalArray(plan?.items),
      featured: typeof plan?.featured === "boolean" ? plan.featured : Boolean(fallbackPlan?.featured),
    };
  });
}

function sanitizeChannels(value, fallback) {
  if (!Array.isArray(value)) {
    return cloneState(fallback);
  }

  return value
    .map((channel, index) => {
      const fallbackChannel = fallback[index] ?? {};

      return {
        name: sanitizeText(channel?.name, fallbackChannel.name ?? ""),
        href: sanitizeText(channel?.href, fallbackChannel.href ?? ""),
        description: sanitizeText(channel?.description, fallbackChannel.description ?? ""),
      };
    })
    .filter((channel) => channel.name || channel.href || channel.description);
}

function sanitizeSampleSettings(value, fallback) {
  const parsedOrder = Number.parseInt(value?.order, 10);

  return {
    visible: typeof value?.visible === "boolean" ? value.visible : fallback.visible,
    order: Number.isFinite(parsedOrder) ? Math.max(0, parsedOrder) : fallback.order,
    brand: sanitizeText(value?.brand, fallback.brand),
    industry: sanitizeText(value?.industry, fallback.industry),
    summary: sanitizeText(value?.summary, fallback.summary),
    homeMode: sanitizeText(value?.homeMode, fallback.homeMode),
  };
}

export function createDefaultAdminState(baseSites = siteRegistry) {
  const orderedSites = sortBaseSites(baseSites);

  return cloneState({
    content: GALLERY_COPY_DEFAULTS,
    inquiry: INQUIRY_DEFAULTS,
    samples: Object.fromEntries(
      orderedSites.map((site, index) => [
        site.id,
        {
          visible: true,
          order: index,
          brand: site.brand,
          industry: site.industry,
          summary: site.summary,
          homeMode: site.homeMode,
        },
      ]),
    ),
  });
}

export function sanitizeAdminState(value, baseSites = siteRegistry) {
  const defaults = createDefaultAdminState(baseSites);
  const content = value?.content ?? {};
  const inquiry = value?.inquiry ?? {};
  const sampleSettings = value?.samples ?? {};

  return {
    content: {
      heroTitle: sanitizeText(content.heroTitle, defaults.content.heroTitle),
      showcaseDescription: sanitizeText(content.showcaseDescription, defaults.content.showcaseDescription),
      processHeading: sanitizeText(content.processHeading, defaults.content.processHeading),
      featuresHeading: sanitizeText(content.featuresHeading, defaults.content.featuresHeading),
      pricingHeading: sanitizeText(content.pricingHeading, defaults.content.pricingHeading),
      pricingDescription: sanitizeText(content.pricingDescription, defaults.content.pricingDescription),
      contactHeading: sanitizeText(content.contactHeading, defaults.content.contactHeading),
      contactDescription: sanitizeText(content.contactDescription, defaults.content.contactDescription),
    },
    inquiry: {
      pricingPlans: sanitizePricingPlans(inquiry.pricingPlans, defaults.inquiry.pricingPlans),
      contactPoints: sanitizeOptionalArray(inquiry.contactPoints),
      customizationLevels: sanitizeNonEmptyArray(inquiry.customizationLevels, defaults.inquiry.customizationLevels),
      budgetOptions: sanitizeNonEmptyArray(inquiry.budgetOptions, defaults.inquiry.budgetOptions),
      timelineOptions: sanitizeNonEmptyArray(inquiry.timelineOptions, defaults.inquiry.timelineOptions),
      externalChannels: sanitizeChannels(inquiry.externalChannels, defaults.inquiry.externalChannels),
    },
    samples: Object.fromEntries(
      baseSites.map((site) => [
        site.id,
        sanitizeSampleSettings(sampleSettings[site.id], defaults.samples[site.id] ?? {
          visible: true,
          order: DEFAULT_SITE_ORDER[site.id] ?? 0,
          brand: site.brand,
          industry: site.industry,
          summary: site.summary,
          homeMode: site.homeMode,
        }),
      ]),
    ),
  };
}

export function loadAdminState(baseSites = siteRegistry) {
  if (typeof window === "undefined") {
    return createDefaultAdminState(baseSites);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAdminState(baseSites);
    }

    return sanitizeAdminState(JSON.parse(raw), baseSites);
  } catch {
    return createDefaultAdminState(baseSites);
  }
}

export function persistAdminState(value, baseSites = siteRegistry) {
  const sanitized = sanitizeAdminState(value, baseSites);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }

  return sanitized;
}

export function resetStoredAdminState(baseSites = siteRegistry) {
  return persistAdminState(createDefaultAdminState(baseSites), baseSites);
}

function compareManagedSites(left, right) {
  const leftOrder = left.admin?.order ?? DEFAULT_SITE_ORDER[left.id] ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.admin?.order ?? DEFAULT_SITE_ORDER[right.id] ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const leftFallback = DEFAULT_SITE_ORDER[left.id] ?? Number.MAX_SAFE_INTEGER;
  const rightFallback = DEFAULT_SITE_ORDER[right.id] ?? Number.MAX_SAFE_INTEGER;

  if (leftFallback !== rightFallback) {
    return leftFallback - rightFallback;
  }

  return left.brand.localeCompare(right.brand);
}

export function buildManagedSites(adminState, baseSites = siteRegistry) {
  const sanitized = sanitizeAdminState(adminState, baseSites);

  return [...baseSites]
    .map((site) => {
      const settings = sanitized.samples[site.id];

      return {
        ...site,
        brand: settings.brand,
        industry: settings.industry,
        summary: settings.summary,
        homeMode: settings.homeMode,
        admin: {
          visible: settings.visible,
          order: settings.order,
        },
      };
    })
    .sort(compareManagedSites);
}

export function getVisibleGallerySites(sites) {
  return sites.filter((site) => site.admin?.visible !== false);
}

export function useAdminState(baseSites = siteRegistry) {
  const [adminState, setAdminState] = useState(() => loadAdminState(baseSites));

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncAdminState = () => {
      setAdminState(loadAdminState(baseSites));
    };

    window.addEventListener("storage", syncAdminState);
    window.addEventListener(STORAGE_EVENT, syncAdminState);

    return () => {
      window.removeEventListener("storage", syncAdminState);
      window.removeEventListener(STORAGE_EVENT, syncAdminState);
    };
  }, [baseSites]);

  const api = useMemo(
    () => ({
      adminState,
      saveAdminState(nextState) {
        const next = persistAdminState(nextState, baseSites);
        setAdminState(next);
        return next;
      },
      resetAdminState() {
        const next = resetStoredAdminState(baseSites);
        setAdminState(next);
        return next;
      },
    }),
    [adminState, baseSites],
  );

  return api;
}
