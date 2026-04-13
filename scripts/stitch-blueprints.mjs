import {
  getBlueprintForSite as getCatalogBlueprintForSite,
  getRouteDescription,
  getRoutesForSite as getCatalogRoutesForSite,
} from "../src/content/siteCatalog.js";

const toneRules = {
  neo: { atmosphere: "Punchy contrast, visible shapes, and immediate commerce energy.", typography: "Bold display type and blunt supporting labels.", components: "Use strong borders, stickers, and tactile blocks." },
  minimal: { atmosphere: "Restrained, premium, quiet, and service-led.", typography: "Use clean typography with controlled spacing and minimal copy.", components: "Cards should feel calm and product-grade." },
  max: { atmosphere: "Loud, glossy, and campaign-driven without losing clarity.", typography: "Use oversized display text and sharp support labels.", components: "Let tags, pricing, and badges compete visually in a controlled way." },
  retro: { atmosphere: "Technical glow, mesh depth, and dark future-console energy.", typography: "Use assertive headlines with precise technical labeling.", components: "Panels should feel like instruments, not generic cards." },
  collage: { atmosphere: "Paper texture, editorial warmth, and tactile composition.", typography: "Type should feel curated, note-like, and slightly hand-placed.", components: "Use collage overlap and clipped-paper behavior." },
  grain: { atmosphere: "Editorial luxury with soft grain and cinematic image depth.", typography: "Use elegant type with quiet supporting copy.", components: "Panels should appear as layered sheets over imagery." },
  hand: { atmosphere: "Local storefront warmth with useful, lived-in energy.", typography: "Mix compact labels with practical, readable hierarchy.", components: "Menu and booking blocks should feel hand-placed but clean." },
  organic: { atmosphere: "Spatial, calm, and room-oriented with soft gradients.", typography: "Use smooth hierarchy and generous spacing.", components: "Planner and room selectors should feel soft and tactile." },
  playful: { atmosphere: "Bright, type-forward, youthful, and image-led.", typography: "Let display type be visible and rhythmic.", components: "Looks and buy prompts should move like editorial stickers." },
  chrome: { atmosphere: "Gallery polish, metallic depth, and premium restraint.", typography: "Precise, polished typography with clean spacing.", components: "Collection panels should feel reflective and deliberate." },
};

export function getRoutesForSite(siteId) {
  return getCatalogRoutesForSite(siteId);
}

export function getBlueprintForSite(siteId) {
  return getCatalogBlueprintForSite(siteId);
}

export function buildPrompt({ site, route, deviceType }) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  const routes = getCatalogRoutesForSite(site.id);
  const deviceLabel = deviceType === "MOBILE" ? "mobile" : "desktop";

  return [
    `${site.brand} ${route.label} page`,
    "",
    `Create a ${deviceLabel}-first web page for a fully independent sample website. The result must look like a real operating site, not a template variation.`,
    "",
    "COPY RULES:",
    "- Primary copy language should be Korean.",
    "- English is allowed only for brand names, short labels, and style accents.",
    "- Keep long paragraphs to a minimum.",
    "- When pricing is relevant, use formats like `29,900원` and `월 39,000원`.",
    "",
    "SITE IDENTITY:",
    `- Brand: ${site.brand}`,
    `- Industry: ${site.industry}`,
    `- Summary: ${site.summary}`,
    `- Home grammar: ${site.homeMode}`,
    `- Mobile rule: ${site.mobileRule}`,
    "",
    "DESIGN DNA:",
    `- Design family: ${blueprint.family}`,
    `- First-screen mode: ${blueprint.heroMode}`,
    `- Background behavior: ${blueprint.background}`,
    `- Motion behavior: ${blueprint.motion}`,
    `- Keywords: ${blueprint.keywords.join(", ")}`,
    "",
    "PAGE TASK:",
    `- Route slug: ${route.slug}`,
    `- Route label: ${route.label}`,
    `- Route intent: ${getRouteDescription(route.kind)}`,
    `- Device-specific instruction: ${deviceType === "MOBILE" ? site.mobileRule : "Desktop should feel spacious and layered, with enough depth to establish the site's own grammar."}`,
    "",
    "GLOBAL RULES:",
    "- Keep the top navigation visible.",
    "- Do not use a generic shared hero template.",
    "- Do not build the page from the same image box + text box + CTA pattern.",
    "- If the page is image-led, use a high-resolution hero visual and floating layered blocks on scroll.",
    "- If the page is not image-led, use responsive mesh or aura depth without overpowering content.",
    "- Mobile must be a dedicated mobile layout, not a scaled-down desktop board.",
    "",
    "FULL ROUTE MAP:",
    ...routes.map((entry, index) => `${index + 1}. ${entry.label} (${entry.slug})`),
  ].join("\n");
}

export function buildSiteBrief(site) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  return [
    `# ${site.brand}`,
    "",
    `- Site ID: ${site.id}`,
    `- Industry: ${site.industry}`,
    `- Summary: ${site.summary}`,
    `- Home grammar: ${site.homeMode}`,
    `- Design family: ${blueprint.family}`,
    `- First screen: ${blueprint.heroMode}`,
    `- Background: ${blueprint.background}`,
    `- Motion: ${blueprint.motion}`,
    `- Mobile rule: ${site.mobileRule}`,
  ].join("\n");
}

export function buildSiteDesignMd(site) {
  const blueprint = getCatalogBlueprintForSite(site.id);
  const routes = getCatalogRoutesForSite(site.id);
  const tone = toneRules[site.backdrop] ?? toneRules.minimal;

  return [
    `# Design System: ${site.brand}`,
    `**Site ID:** ${site.id}`,
    "",
    "## 1. Identity",
    `- Industry: ${site.industry}`,
    `- Summary: ${site.summary}`,
    `- Home grammar: ${site.homeMode}`,
    `- Mobile rule: ${site.mobileRule}`,
    "",
    "## 2. Visual Direction",
    `- Family: ${blueprint.family}`,
    `- First screen: ${blueprint.heroMode}`,
    `- Background: ${blueprint.background}`,
    `- Motion: ${blueprint.motion}`,
    `- Atmosphere: ${tone.atmosphere}`,
    "",
    "## 3. Palette",
    `- Background: ${site.theme.bg}`,
    `- Surface: ${site.theme.surface}`,
    `- Panel: ${site.theme.panel}`,
    `- Text: ${site.theme.text}`,
    `- Muted: ${site.theme.muted}`,
    `- Accent: ${site.theme.accent}`,
    `- Accent soft: ${site.theme.accentSoft}`,
    "",
    "## 4. Typography",
    `- ${tone.typography}`,
    "- Keep copy short and functional.",
    "- Use Korean as the default content language.",
    "",
    "## 5. Components",
    `- ${tone.components}`,
    "- Shared primitives are limited to buttons, badges, inputs, and simple cards.",
    "- The first screen grammar must be unique to this site.",
    "",
    "## 6. Prohibited Patterns",
    "- No shared hero template.",
    "- No shared section assembler.",
    "- No repetitive image box + text box + CTA blocks.",
    "",
    "## 7. Route Targets",
    ...routes.map((route) => `- ${route.label} (${route.slug}): ${getRouteDescription(route.kind)}`),
  ].join("\n");
}
