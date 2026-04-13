# Stitch Workspace

This directory stores the Stitch MCP workspace for the 20 independent sample sites.

## Structure

- Each site lives in `design/stitch/<siteId>`.
- Each site keeps `DESIGN.md`, `brief.md`, `site.json`, `prompts/`, and `screens/`.
- Desktop and mobile screens are generated separately.
- The first delivery target is `home-desktop` and `home-mobile` for every site.
- Generated HTML and PNG files are stored under each site's `screens/` folder.
- `metadata.json` is local workspace state for Stitch project and screen mapping.

## Common commands

```bash
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
npm run stitch:pull -- --site sneaker-drop --page home --device desktop
```

## Sites

- `sneaker-drop` | RIFT/01 | Sneaker Commerce
- `supplement-brand` | PUNCH FUEL | Supplement Commerce
- `boxing-gym` | UPPERCUT CLUB | Boxing Gym
- `wealth-app` | CLARO | Wealth SaaS
- `skin-clinic` | ATELIER SKIN | Skin Clinic
- `arch-studio` | PLAIN GRID | Architecture Studio
- `beauty-flash-sale` | MELT POP | Beauty Flash Commerce
- `festival-page` | NOISE WAVE | Festival Event
- `creator-club` | RALLY HOUSE | Creator Community
- `ev-mobility` | ORBIT E | EV Mobility
- `gaming-gear` | VOID ARC | Gaming Gear
- `ai-saas` | SIGNAL GRID | AI Workflow SaaS
- `indie-bookstore` | PAPER NOOK | Independent Bookstore
- `stationery-shop` | CUT & NOTE | Stationery Shop
- `local-cafe` | TABLE WARM | Cafe Reservation
- `boutique-hotel` | HOTEL STILL | Boutique Hotel
- `perfume-house` | MOSS & AMBER | Perfume House
- `furniture-store` | MOSS HOME | Furniture Commerce
- `youth-fashion` | BOP BOP | Youth Fashion
- `jewelry-brand` | LUNE FORM | Jewelry Brand

