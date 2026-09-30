# TABLE WARM Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-22
- Site ID: `local-cafe`
- Brand: TABLE WARM
- Surface refreshed in this pass: `home-desktop`
- Stitch project: `7135745222730086952`
- Latest desktop screen: `056259e30b4945d99fc0ad250579ade2`
- Evidence reviewed:
  - `.stitch/SITE.md`
  - `design/stitch/local-cafe/brief.md`
  - `design/stitch/local-cafe/metadata.json`
  - `design/stitch/local-cafe/screens/home-desktop.html`
  - User screenshot rejecting dark split-panel ?WARM MOMENT? direction.

## Brand
- Personality: warm, practical, premium but familiar, Korean local cafe reservation service.
- Trust signals: visible seats, waiting time, opening hours, today?s menu, direct reservation CTA.
- Avoid: dark mood panels, giant English hero title, portfolio/mockup feeling, boxed accordion stacks in the first viewport.

## Product goals
- Goals:
  - Make desktop home feel like a real cafe homepage.
  - Make booking/menu/status immediately understandable.
  - Use a full PC first viewport instead of a framed preview composition.
- Non-goals:
  - Do not redesign mobile/subpages in this pass.
  - Do not replace the React app shell.
- Success signals:
  - First viewport has Korean headline, primary CTA, status chips, and reservation/menu widgets.

## Personas and jobs
- Primary personas: cafe visitor, small cafe owner reviewing a template, site buyer comparing samples.
- User jobs: check today?s availability, view menu, reserve seat, find visit info.
- Key contexts of use: desktop preview and sales review first; mobile later.

## Information architecture
- Primary navigation: ??, ?? ??, ??, ??? ?, CTA ????.
- Core routes/screens: home, menu, visit, reserve, info.
- Content hierarchy: hero headline ? CTA ? status chips ? visual reservation/menu widgets ? 3-column service preview.

## Design principles
- Principle 1: Real service flow over atmosphere-only design.
- Principle 2: Bright mainstream landing trend over dark editorial split-panel.
- Tradeoffs: Keep the generated Stitch HTML integration and only replace the desktop home asset now.

## Visual language
- Color:
  - Canvas: #FFF8F1.
  - Surface: #FFFFFF.
  - Primary action: #4B2E1F.
  - Accent: #E8D4B8.
  - Status: #6F8F72.
  - Text: #1F1B16.
- Typography: Korean-first bold sans-serif headline; readable Korean body copy.
- Spacing/layout rhythm: 1440px+ desktop full-screen hero, large margins, 12-column balance.
- Shape/radius/elevation: 20?28px rounded cards, pill CTAs, soft shadow `0 20px 60px rgba(31,27,22,0.10)`.
- Motion: subtle only; no CTA-hiding animation.
- Imagery/iconography: bright cafe interior/food imagery with useful overlaid UI cards.

## Components
- Existing components to reuse: repo `SiteView` embeds Stitch HTML/PNG through `siteRegistry`.
- New/changed components: generated desktop home Stitch asset only.
- Variants and states: desktop changed; mobile unchanged.
- Token/component ownership: this file owns TABLE WARM direction; generated HTML owns per-screen exact CSS.

## Accessibility
- Target standard: WCAG 2.1 AA where implemented.
- Keyboard/focus behavior: CTAs and nav should remain semantic links/buttons in future implementation.
- Contrast/readability: charcoal on ivory/white; do not use low-contrast beige body text.
- Screen-reader semantics: preserve logical heading and button labels.
- Reduced motion and sensory considerations: keep motion subtle.

## Responsive behavior
- Supported breakpoints/devices: desktop 1440px+ first; mobile separate generated screen remains unchanged.
- Layout adaptations: desktop uses hero text + visual widgets; mobile should stack in future refresh.
- Touch/hover differences: no hover-only essential information.

## Interaction states
- Loading: use existing repo fallback behavior when HTML/image is unavailable.
- Empty: show status/menu modules with safe default values.
- Error: route should fall back through existing not-found/staging patterns.
- Success: reservation CTA should imply clear next step.
- Disabled: unavailable seats/time slots should be visibly muted in future reserve screen.
- Offline/slow network, if applicable: keep PNG fallback available.

## Content voice
- Tone: warm, direct, practical Korean.
- Terminology: ??? ??, ?? ??, ?? ??, ????, ??? ?.
- Microcopy rules: mention concrete quantities/times instead of abstract mood labels.

## Implementation constraints
- Framework/styling system: static Stitch HTML/PNG consumed by React/Vite.
- Design-token constraints: no new JS/CSS token library.
- Performance constraints: keep image count modest, no heavy scripts.
- Compatibility constraints: preserve `design/stitch/local-cafe/screens/home-desktop.html` and `.png` paths.
- Test/screenshot expectations: run Vite build and inspect `/local-cafe` PC view.

## Open questions
- [ ] Apply this style to mobile home? / owner: user / impact: PC/mobile consistency.
- [ ] Refresh menu/visit/reserve/info pages to match? / owner: user / impact: route consistency.
- [ ] Replace all cafe imagery with user-owned photos? / owner: user / impact: licensing/brand authenticity.
