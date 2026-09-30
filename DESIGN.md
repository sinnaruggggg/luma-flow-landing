# Design

## Agency production direction — current override

- Latest visual override: all 40 samples require individually authored page structures, not five common templates with swapped industry copy. Avoid generic left-text/right-image hero. Each page must differ in information sequence, navigation, hero geometry, and local interaction.
- Latest motion override: reject floating screenshots, generic grids/orbits and word replacement. Reference Studio Dumbar Instagram for coherent motion physics, elastic type, motivated masks and perspective handoffs, not its logo or visual assets. Compose one focal action at a time with reading holds. Keep fullbleed fixed-menu layout and reduced-motion/pause support.
- Latest media override: each of the 40 sites owns a distinct set of context-appropriate photographs. Do not reuse upstream photos or crop variants across sites. A gallery/room/product selection changes the actual image source, and its label must match the content. Store photographer, source, license and file hash. Never present stock photography as real client work.
- QA gate: verify form geometry at the container level, not viewport overflow alone. Check all 40 pages at 360/390/768/1440, including narrow desktop sidebars, labels, date fields, submit buttons, validation and summary states. Inspect screenshots instead of inferring visual success from build/lint.

- Work root stays D:/www/mypages. This section supersedes the serif/slow-paper hero direction below.
- Korean-first UI. Keep only necessary brand names and standard technical terms in English. Angular sans-serif headlines and square controls.
- Fixed translucent navigation integrated with a simple full-height kinetic typography hero. No long hero copy, gradients, neon, or rounded cards.
- Motion has timed reading holds, geometric hierarchy, pause, offscreen suspension, and reduced-motion fallback.
- Style finder previews explain each style visually on hover, keyboard focus, and touch within an inset translucent layer.
- Catalogue expands to 8 industries × 5 concrete layout styles. Budget selection describes scope, not a claim that different price tiers are separate designs. Consult/undecided widen the search.
- Generated industry imagery is copied into public/agency-assets on D:. Samples are fictional businesses, never fabricated client work.
- Independent sample routes /samples/[id] preserve agency /projects/[id] case routes. Sample booking/payment must not pretend to complete external transactions.
- Actual agency identity and inquiry deployment configuration require owner values. Never show success before a real API acknowledgement.

## Active homepage update — 2026-09-16

The current homepage contract supersedes older gallery-home guidance below. Work only in D:/www/mypages. Preserve existing admin, portfolio, templates, API, and uncommitted work.

- Routes: /, /projects?budget=...&industry=...&style=..., /projects/[id]. React/Vite retained; no new dependencies.
- Direction: concept 03 editorial structure + concept 05 muted green. Studio fnt is a reference for restrained case-led presentation, not a copied identity.
- Visual language: warm white, ink, forest accent, fine rules, no rounded cards/gradient/neon. Korean serif headlines, sans body, monospace metadata. Two-column desktop and one-column mobile work grid.
- Hero: slow editorial-paper motion composition, pause control, reduced-motion support and offscreen suspension. Project photography remains primary.
- Components: ProjectFinderCTA, FilterPanel, FilterChips, ProjectGrid, ProjectCard in src/editorial; separate replaceable project data.
- Interaction: desktop vertical CTA, hidden near footer; mobile inline CTA. Native modal dialog, Escape/backdrop/close, focus containment and return, radio fieldsets, category clear/reset, disabled submit until three choices.
- State: validated URL queries are committed search truth; modal choices are a cancelable draft. Browser back/forward and direct links work.
- Empty state: industry/style similarity recommendations, maximum 3; no fabricated match. Invalid query values ignored, unknown id gets not-found view.
- Content: 12 explicitly fictional concept projects, illustrative budgets not quotations. No fabricated clients, live lead submissions or success claims.
- Verify: data tests, build, targeted lint, desktop/mobile keyboard and URL flows, no-match recommendations, motion and footer CTA, legacy route smoke.
- Open: actual company name, portfolio rights, real contact destination and CMS/API integration remain undecided.

## Source of truth
- Status: Active
- Last refreshed: 2026-06-22
- Primary product surfaces:
  - Gallery home (`/`)
  - Template/site preview pages (`/:siteId`, especially `local-cafe` / TABLE WARM)
  - Portfolio pages (`/portfolio`, `/portfolio/:id`)
  - Admin console (`/admin`)
- Evidence reviewed:
  - `index.html` ? Vite entry and page metadata.
  - `src/main.jsx` ? React mount and global CSS import.
  - `src/App.jsx` ? route/view-mode orchestration.
  - `src/components/showcaseChrome.jsx` ? gallery/site preview chrome and CTA flows.
  - `src/content/siteRegistry.js` ? Stitch HTML/PNG asset binding.
  - `src/content/siteCatalog.js` ? site themes, routes, hero/content metadata.
  - `src/site-app.css`, `src/app-v3.css`, `src/index.css` ? existing layout, tokens, responsive behavior.
  - `.stitch/SITE.md` ? Stitch workspace rule: 20 independent websites.
  - `design/stitch/local-cafe/brief.md`, `design/stitch/local-cafe/DESIGN.md`, `design/stitch/local-cafe/metadata.json` ? TABLE WARM source material.
  - User-provided screenshot dated 2026-06-22 ? rejected visual direction: dark split preview panel with giant English mood headline.

## Brand
- Personality:
  - Practical, modern, conversion-focused, beginner-friendly, and polished.
  - Each sample site should feel like a real business homepage, not an abstract portfolio poster.
- Trust signals:
  - Clear Korean headline, concrete status chips, visible CTA, route labels, pricing/availability/reservation cues when relevant.
  - Use real-service microcopy over decorative English mood copy.
- Avoid:
  - Dark half-screen panels for warm/local service templates unless the specific brand requires dark mode.
  - Giant English-first mood titles such as ?WARM MOMENT?.
  - Generic split image + information-panel compositions repeated across samples.
  - Overly cinematic mockup/portfolio-preview layouts that hide the actual user flow.

## Product goals
- Goals:
  - Let visitors quickly understand what each template/site does and how to act.
  - Keep PC previews full-screen and production-like, especially for desktop samples.
  - Preserve the existing React/Vite/Stitch asset workflow while improving visual quality.
- Non-goals:
  - Do not rebuild the whole app shell or routing system for one visual change.
  - Do not introduce a new UI framework or heavy design-system dependency.
  - Do not make all 20 sample sites look identical.
- Success signals:
  - First desktop viewport communicates offer + CTA without needing preview chrome explanation.
  - Korean copy is primary; supporting English can be used only as brand/detail copy.
  - Build passes and `siteRegistry` continues to load Stitch HTML/PNG assets.

## Personas and jobs
- Primary personas:
  - Small-business owner choosing a homepage/template.
  - Non-technical user reviewing desktop/mobile previews before requesting production work.
  - Future AI/coder maintaining sample pages and replacing Stitch outputs.
- User jobs:
  - Compare sample styles quickly.
  - Open a site preview and understand the intended user flow.
  - Contact/request a template without confusion.
- Key contexts of use:
  - Desktop browser for review and sales demonstration.
  - Mobile browser for quick checking and responsive validation.
  - Local development/Vercel preview during edits.

## Information architecture
- Primary navigation:
  - Gallery: samples, process, features, pricing/contact, portfolio.
  - Site preview: back, PC/Mobile toggle, inquiry CTA, per-site route navigation.
- Core routes/screens:
  - `/` gallery home.
  - `/:siteId` home preview.
  - `/:siteId/:slug` route preview.
  - `/portfolio`, `/portfolio/:id`.
  - Admin route from `ADMIN_PATH`.
- Content hierarchy:
  - For sample sites, first viewport should prioritize business purpose, primary CTA, and 2?4 concrete proof/status elements.
  - Secondary route cards can appear below the fold; they should not dominate the hero.

## Design principles
- Principle 1:
  - Real homepage first, mood board second. Every sample must look usable by an actual business.
- Principle 2:
  - Desktop previews should feel full-screen and complete, not like a boxed screenshot inside a dark template panel.
- Tradeoffs:
  - Preserve current code/asset wiring even if generated HTML is not perfect; improve individual Stitch assets incrementally.
  - Favor readable, mainstream modern design over highly experimental visual systems for generic/business templates.

## Visual language
- Color:
  - Base: warm ivory/white/soft neutral canvases for mainstream business templates.
  - Action: one high-contrast primary CTA color per site.
  - Status: muted greens/blues/ambers only for meaningful availability, success, warning, or category states.
- Typography:
  - Korean-first hierarchy.
  - Large display headline on desktop, but avoid decorative English-only hero copy for Korean-facing sites.
  - Body copy must remain readable at 16px+ with generous line-height.
- Spacing/layout rhythm:
  - Desktop: 12-column/flexible grid, generous margins, full-viewport hero when requested.
  - Cards and widgets should overlap lightly only when it improves hierarchy.
- Shape/radius/elevation:
  - Rounded cards 20?28px, pill CTAs/chips, whisper-soft shadows.
  - Avoid heavy bordered stacks and repeated accordion blocks in the hero.
- Motion:
  - Existing Framer Motion route transitions can remain subtle.
  - Avoid motion that hides CTA or harms readability.
- Imagery/iconography:
  - Use high-quality business-relevant imagery or product/status UI compositions.
  - Avoid generic stock-photo dominance when the user needs clear service flow.

## Components
- Existing components to reuse:
  - `GalleryHome`, `SiteView`, `SiteStaging`, `PortfolioIndexView`, `PortfolioEmbedView` from `src/components/showcaseChrome.jsx`.
  - Stitch screen assets loaded through `src/content/siteRegistry.js`.
  - Existing buttons, badges, cards, topbars, and responsive rules in `src/site-app.css`.
- New/changed components:
  - No React component change required for this task.
  - TABLE WARM desktop home Stitch asset is refreshed as the first PC full-screen trend sample.
- Variants and states:
  - Desktop and mobile Stitch screens remain separate files.
  - Current task changes desktop only; mobile remains as-is until separately requested.
- Token/component ownership:
  - Repo shell tokens stay in CSS.
  - Per-site design tokens live in `design/stitch/<siteId>/DESIGN.md` and generated Stitch HTML.

## Accessibility
- Target standard:
  - Aim for WCAG 2.1 AA contrast and keyboard-visible controls for implemented React UI.
- Keyboard/focus behavior:
  - Buttons, links, toggles, and forms must remain semantic and reachable.
- Contrast/readability:
  - Avoid low-contrast beige-on-white body text.
  - Dark panels need strong contrast if used, but current TABLE WARM direction avoids dark hero panels.
- Screen-reader semantics:
  - Preserve headings, button labels, and route/link text in generated/implemented pages.
- Reduced motion and sensory considerations:
  - Existing `prefers-reduced-motion` handling in CSS should remain.

## Responsive behavior
- Supported breakpoints/devices:
  - Desktop: 1440px+ primary review target for PC preview.
  - Tablet/narrow desktop: collapse hero/grid carefully.
  - Mobile: separate Stitch mobile assets where available.
- Layout adaptations:
  - Desktop can use two-column hero with supporting widgets.
  - Mobile should stack headline, CTA, status, and core module in that order.
- Touch/hover differences:
  - Desktop hover can be subtle; mobile must not rely on hover-only cues.

## Interaction states
- Loading:
  - Keep visible skeleton/empty fallback if Stitch HTML/image is missing.
- Empty:
  - Use staging/not-found views already in `showcaseChrome.jsx`.
- Error:
  - Keep not-found route behavior intact.
- Success:
  - CTA/inquiry flows should show clear confirmation when implemented.
- Disabled:
  - Disabled CTAs should be visibly muted and non-clickable.
- Offline/slow network, if applicable:
  - Generated images/HTML should have fallback images where possible via `siteRegistry`.

## Content voice
- Tone:
  - Direct, concrete, Korean-first, service-oriented.
- Terminology:
  - Use real labels: ??, ?? ??, ??, ??? ?, ??.
  - Avoid abstract labels like Mood Tone / Visit CTA in customer-facing hero content.
- Microcopy rules:
  - State what the user can do now.
  - Prefer measurable cues: ??? ?? 7??, ??? ?? 12??.

## Implementation constraints
- Framework/styling system:
  - React 19 + Vite, CSS files, Framer Motion, lucide-react.
  - Stitch static HTML/PNG assets are imported through Vite glob imports.
- Design-token constraints:
  - Do not add a separate token library for this task.
  - Keep per-site design decisions documented in Markdown and generated assets.
- Performance constraints:
  - Keep images optimized and avoid adding heavy runtime dependencies.
  - Build output warning about chunk size may exist, but visual asset changes must not introduce JS bloat.
- Compatibility constraints:
  - Vite base path must keep working for Vercel and GitHub Pages.
  - File paths under `design/stitch/<siteId>/screens` must stay stable.
- Test/screenshot expectations:
  - Run `npm run build` after asset changes.
  - For visual tasks, open the affected route and inspect desktop first viewport when possible.

## Open questions
- [ ] Should the same Warm Minimalism direction be applied to TABLE WARM mobile and subpages? / owner: user / impact: visual consistency.
- [ ] Should all 20 Stitch sites be refreshed away from bespoke experimental layouts toward mainstream business landing trends? / owner: user / impact: broader scope.
- [ ] Should the gallery preview chrome be hidden in production sample detail pages for a more ?real site? feel? / owner: user / impact: product IA.
