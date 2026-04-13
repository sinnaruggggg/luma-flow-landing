import fs from "node:fs/promises";
import path from "node:path";

import { siteCatalog } from "../src/content/siteCatalog.js";
import { designRoot, ensureDir, rootDir, scaffoldSite, stitchDir } from "./stitch-utils.mjs";

const siteSummary = siteCatalog.map((site) => `- \`${site.id}\` | ${site.brand} | ${site.industry}`).join("\n");

const siteGuide = `# Stitch Workspace

This directory stores the Stitch MCP workspace for the 20 independent sample sites.

## Structure

- Each site lives in \`design/stitch/<siteId>\`.
- Each site keeps \`DESIGN.md\`, \`brief.md\`, \`site.json\`, \`prompts/\`, and \`screens/\`.
- Desktop and mobile screens are generated separately.
- The first delivery target is \`home-desktop\` and \`home-mobile\` for every site.
- Generated HTML and PNG files are stored under each site's \`screens/\` folder.
- \`metadata.json\` is local workspace state for Stitch project and screen mapping.

## Common commands

\`\`\`bash
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
npm run stitch:pull -- --site sneaker-drop --page home --device desktop
\`\`\`

## Sites

${siteSummary}
`;

const rootSiteDoc = `# Stitch Site Workspace

This repository now treats the gallery as **20 independent websites**, not one shared family renderer.

## Rules

- Stitch outputs are organized per site.
- Before generating or editing screens, read \`design/stitch/<siteId>/DESIGN.md\` and \`brief.md\`.
- Desktop and mobile screens are generated separately.
- Each site must keep its own first-screen grammar and information structure.
- Shared primitives are limited to buttons, badges, inputs, and basic cards.

## Sites

${siteSummary}
`;

await ensureDir(stitchDir);
await ensureDir(designRoot);
await fs.writeFile(path.join(designRoot, "README.md"), `${siteGuide}\n`, "utf8");
await fs.writeFile(path.join(stitchDir, "SITE.md"), `${rootSiteDoc}\n`, "utf8");

for (const site of siteCatalog) {
  await scaffoldSite(site);
}

const inventory = siteCatalog.map((site) => ({
  siteId: site.id,
  brand: site.brand,
  industry: site.industry,
  dir: path.relative(rootDir, path.join(designRoot, site.id)).replaceAll("\\", "/"),
}));

await fs.writeFile(path.join(designRoot, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");

console.log(`Initialized Stitch workspace for ${siteCatalog.length} sites.`);
