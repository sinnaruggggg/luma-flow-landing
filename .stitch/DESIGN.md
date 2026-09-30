# Stitch Design Source of Truth

- Status: Active
- Last refreshed: 2026-06-22
- Scope: `design/stitch/*` generated site screens.
- Current priority: `local-cafe` / TABLE WARM desktop home refresh.

## Direction
Use mainstream 2026 Korean landing-page design for general business templates:
- Light full-screen desktop hero.
- Korean-first headline and CTA.
- Glassy sticky nav.
- Real-service modules: status, reservation, menu, guide.
- Rounded white cards with soft warm shadows.

## Global avoid list
- Dark split-screen template previews unless the brand specifically needs dark mode.
- Half photo + right dark information panel as the default structure.
- Giant English mood headlines as the primary hero content.
- Accordion/card stacks in the first viewport when the actual user action is hidden.
- Reusing one generic composition across all industries.

## Recommended Stitch prompt pattern
```markdown
Clean, mainstream, conversion-focused Korean landing page.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, desktop-first PC full-screen.
- Palette: Warm Ivory canvas (#FFF8F1), Clean White surfaces (#FFFFFF), Espresso primary (#4B2E1F), Soft Latte accent (#E8D4B8), Charcoal text (#1F1B16).
- Styles: 20?28px rounded cards, pill CTAs, glassmorphism sticky header, whisper-soft shadows.

**PAGE STRUCTURE:**
1. Header: sticky glass navigation with logo, route labels, primary CTA.
2. Hero Section: full viewport with Korean headline, subcopy, CTA row, status chips.
3. Primary Content Area: useful service modules visible below the fold.
4. Footer: minimal, light, not a heavy dark block.
```

## Asset rule
Generated/edited assets must be saved both to:
- `.stitch/designs/<descriptive-slug>/` for raw Stitch handoff.
- `design/stitch/<siteId>/screens/<pageSlug>-<device>.html|png` when they should appear in the live repo preview.
