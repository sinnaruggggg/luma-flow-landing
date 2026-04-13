import fs from "node:fs/promises";

import { Stitch, StitchToolClient } from "@google/stitch-sdk";

import {
  buildScreenRecord,
  downloadToFile,
  ensureStitchAuth,
  formatPrompt,
  getPromptPath,
  getRouteOrThrow,
  getScreenHtmlPath,
  getScreenImagePath,
  getScreenKey,
  getSiteDesignPath,
  getSiteMetadataPath,
  getSiteOrThrow,
  normalizeDevice,
  parseArgs,
  readJson,
  scaffoldSite,
  writeJson,
} from "./stitch-utils.mjs";

const args = parseArgs();
const siteId = args.site;
const pageSlug = args.page || "home";
const deviceType = normalizeDevice(args.device);
const forceNewProject = Boolean(args["new-project"]);

if (!siteId) {
  console.error("Usage: npm run stitch:generate -- --site <siteId> [--page home] [--device desktop|mobile]");
  process.exit(1);
}

ensureStitchAuth();

const site = getSiteOrThrow(siteId);
await scaffoldSite(site);
const route = getRouteOrThrow(siteId, pageSlug);
const designMd = await fs.readFile(getSiteDesignPath(siteId), "utf8").catch(() => "");
const promptSections = [formatPrompt(site, route, deviceType)];
if (designMd.trim()) promptSections.push("**SITE DESIGN SYSTEM:**", designMd.trim());

const prompt = promptSections.join("\n\n");
await fs.writeFile(getPromptPath(siteId, pageSlug, deviceType), `${prompt}\n`, "utf8");

const metadataPath = getSiteMetadataPath(siteId);
const metadata = (await readJson(metadataPath, {})) ?? {};

const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  accessToken: process.env.STITCH_ACCESS_TOKEN,
  projectId: process.env.STITCH_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
});
const sdk = new Stitch(client);
const desiredTitle = args.title || `${site.brand} Stitch`;
const project = !forceNewProject && metadata.projectId ? sdk.project(metadata.projectId) : await sdk.createProject(desiredTitle);

const screen = await project.generate(prompt, deviceType);
const screenRaw = await client.callTool("get_screen", {
  projectId: project.projectId,
  screenId: screen.screenId,
  name: `projects/${project.projectId}/screens/${screen.screenId}`,
});
const htmlUrl = screenRaw?.htmlCode?.downloadUrl || "";
const imageUrl = screenRaw?.screenshot?.downloadUrl || "";
if (!htmlUrl || !imageUrl) {
  throw new Error(`Missing download URLs for ${siteId}/${pageSlug} (${deviceType})`);
}
const htmlPath = getScreenHtmlPath(siteId, pageSlug, deviceType);
const imagePath = getScreenImagePath(siteId, pageSlug, deviceType);
await downloadToFile(htmlUrl, htmlPath, "text");
await downloadToFile(imageUrl, imagePath, "binary");

await writeJson(metadataPath, {
  ...metadata,
  siteId,
  brand: site.brand,
  projectId: project.projectId,
  projectTitle: desiredTitle,
  updatedAt: new Date().toISOString(),
  screens: {
    ...(metadata.screens ?? {}),
    [getScreenKey(pageSlug, deviceType)]: buildScreenRecord({ screenId: screen.screenId, pageSlug, deviceType, htmlPath, imagePath }),
  },
});

await client.close();
console.log(`Generated ${siteId}/${pageSlug} (${deviceType})`);
console.log(`Project: ${project.projectId}`);
console.log(`Screen: ${screen.screenId}`);
console.log(`HTML: ${htmlPath}`);
console.log(`Image: ${imagePath}`);
