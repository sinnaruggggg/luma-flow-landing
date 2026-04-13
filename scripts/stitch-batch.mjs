import { spawn } from "node:child_process";

import { siteCatalog } from "../src/content/siteCatalog.js";
import { getRoutesForSite } from "./stitch-blueprints.mjs";
import { normalizeDevice, parseArgs, rootDir } from "./stitch-utils.mjs";

const args = parseArgs();
const devices = args.device ? [normalizeDevice(args.device)] : ["DESKTOP", "MOBILE"];
const siteIds = args.site ? [args.site] : siteCatalog.map((site) => site.id);
const pageOverride = args.page || null;

for (const siteId of siteIds) {
  const pages = pageOverride ? [pageOverride] : getRoutesForSite(siteId).map((route) => route.slug);
  for (const pageSlug of pages) {
    for (const deviceType of devices) {
      await runGenerate(siteId, pageSlug, deviceType);
    }
  }
}

async function runGenerate(siteId, pageSlug, deviceType) {
  const commandArgs = ["scripts/stitch-generate.mjs", "--site", siteId, "--page", pageSlug, "--device", deviceType.toLowerCase()];
  process.stdout.write(`\n> node ${commandArgs.join(" ")}\n`);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, { cwd: rootDir, stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`stitch:generate failed for ${siteId}/${pageSlug}/${deviceType}`))));
    child.on("error", reject);
  });
}
