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

const homeStructures = {
  commerce: [
    "Opening commerce surface tailored to the brand's home grammar, with a product or campaign focal point visible immediately.",
    "Fast browse or product entry module in the first viewport. The user must understand what can be purchased without scrolling.",
    "Price, drop timing, or subscription value visible near the primary CTA.",
    "Brand proof or product-world section that feels specific to the brand, not a generic about block.",
  ],
  booking: [
    "Booking or reservation module visible in the first viewport, ahead of generic storytelling.",
    "Program, room, or coach snapshot that clarifies what is being booked.",
    "Operational trust block with schedule, preparation, or visit guidance.",
    "Service depth section that makes the next booking step obvious.",
  ],
  saas: [
    "Product surface first: show a board, dashboard, graph, or workflow state before explanatory marketing copy.",
    "Capability strip or module row that explains core features through interface fragments.",
    "Proof section with outcomes, use cases, or customer metrics.",
    "Conversion block for pricing, demo, or contact with clear business intent.",
  ],
  event: [
    "Event-opening surface with lineup, date, or ticket path visible immediately.",
    "Discovery block for lineup, schedule, or community activity depending on the route.",
    "Decision block for ticket classes, passes, or membership commitment.",
    "Operational guide block for logistics, venue, or participation rules.",
  ],
  portfolio: [
    "Editorial or project-led opening surface that behaves like a real studio or creator homepage.",
    "Project or work index with clear case entry and curation rhythm.",
    "Service or collaboration framing that feels premium and specific, not generic agency copy.",
    "Brief or contact action that matches the brand voice and site grammar.",
  ],
};

const routeStructures = {
  home: "Build a full operating homepage. The first viewport must establish how the site works, what the user can do next, and why the brand feels distinct.",
  browse: "Use a browsing surface with filtering, category anchors, or modular collections. This should help users compare options quickly.",
  detail: "Lead with the core item, service, program, or room itself. Show key decision information in the first screen and keep supporting detail structured below.",
  checkout: "Design a conversion-first page with selection state, price summary, purchase confidence, and the final action clearly visible.",
  brand: "Present the brand world with proof, process, trust, or editorial identity. Avoid a generic about-us column layout.",
  reserve: "Make reservation state, schedule, available options, and the booking action obvious above the fold.",
  guide: "Organize guide information into clear, scannable modules such as map, FAQ, prep notes, rules, or visit flow.",
  features: "Explain capabilities through modules, diagrams, flows, or interactive-looking product sections. Avoid a generic three-card features row.",
  cases: "Use specific use-case or results framing with concrete teams, numbers, before-after logic, or operational outcomes.",
  pricing: "Make plan comparison immediate. Show differences, commitment model, and recommended choice with minimal copy.",
  contact: "Build a high-trust inquiry surface with clear response expectations, form structure, and business cues.",
  works: "Use a project index or editorial gallery with obvious case entry and filtering or curation logic.",
  services: "Frame services through deliverables, process, and fit. Avoid boilerplate agency language.",
  brief: "Create a premium intake form or brief capture page with structured fields and expectations.",
  lineup: "Design around discovery of artists, speakers, or featured talent with date and stage context.",
  schedule: "Make schedule comprehension immediate. Time slots, stage or room movement, and key anchors should be obvious.",
  tickets: "Present ticket classes, perks, and purchase logic in a compact but confident layout.",
  feed: "Use a living feed or activity surface that feels current and community-driven.",
  perks: "Show membership or pass value through concise benefit blocks with strong visual differentiation.",
  join: "Treat the page as a join or signup flow with clear commitment, plan choice, and reasons to act now.",
};

const mobileLayouts = {
  commerce: "Use a mobile-first purchase layout with product media cropped for portrait, sticky buy action, concise specs, and a fast route to cart or checkout.",
  booking: "Use a mobile booking layout with availability, date or time selection, and the booking CTA within the first scroll.",
  saas: "Use stacked product modules sized for handheld reading. The first mobile screen should show active product state, KPI context, and one main CTA.",
  event: "Use a mobile event layout with lineup or ticket entry first, followed by time, place, and guide modules in a compact rhythm.",
  portfolio: "Use a mobile editorial deck with project cards, concise service cues, and a direct inquiry or brief action before long narrative content.",
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
  const pageStructure = routeStructures[route.kind] ?? "Organize the page around the route's real task, with clear hierarchy and no generic section stack.";
  const homeStructure = homeStructures[site.category] ?? homeStructures.saas;
  const mobileLayout = mobileLayouts[site.category] ?? mobileLayouts.saas;
  const structureHints = route.kind === "home" ? homeStructure : [pageStructure];

  return [
    `${site.brand} ${route.label} page`,
    "",
    `Create a ${deviceLabel}-first web page for a fully independent sample website. The result must look like a real operating site, not a template variation.`,
    "This page is one part of a 5-page site, and it must feel structurally distinct from the other 19 sample sites in the gallery.",
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
    `- Required page structure: ${pageStructure}`,
    `- Device-specific instruction: ${deviceType === "MOBILE" ? site.mobileRule : "Desktop should feel spacious and layered, with enough depth to establish the site's own grammar."}`,
    "",
    "GLOBAL RULES:",
    "- Keep the top navigation visible.",
    "- Do not use a generic shared hero template.",
    "- Do not build the page from the same image box + text box + CTA pattern.",
    "- Do not open with a centered startup headline and two buttons over a generic background.",
    "- Do not use a repeated stack of interchangeable marketing sections.",
    "- The first viewport must communicate the site's operating model, not just its mood.",
    "- If the page is image-led, use a high-resolution hero visual and floating layered blocks on scroll.",
    "- If the page is not image-led, use responsive mesh or aura depth without overpowering content.",
    "- Mobile must be a dedicated mobile layout, not a scaled-down desktop board.",
    "",
    "FIRST-VIEWPORT REQUIREMENTS:",
    ...structureHints.map((hint) => `- ${hint}`),
    "",
    "MOBILE EXECUTION RULES:",
    `- ${mobileLayout}`,
    "- Reorder content for handheld use instead of preserving desktop block order.",
    "- Keep one primary CTA visible early and avoid tiny dashboard miniatures.",
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
