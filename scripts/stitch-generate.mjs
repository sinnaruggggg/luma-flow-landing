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
import { replaceHumanImagesInFile } from "./stitch-human-image-replacer.mjs";

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

const generated = await generateScreenWithRetry(client, {
  projectId: project.projectId,
  prompt,
  deviceType,
});
const outputComponents = Array.isArray(generated?.outputComponents) ? generated.outputComponents : [];
const screenRaw = outputComponents.find((component) => component?.design?.screens?.[0])?.design?.screens?.[0] ?? generated;
const screenId = screenRaw?.id || screenRaw?.screenId || screenRaw?.name?.split("/").pop() || "";
const htmlUrl = screenRaw?.htmlCode?.downloadUrl || "";
const imageUrl = screenRaw?.screenshot?.downloadUrl || "";
if (!htmlUrl || !imageUrl) {
  throw new Error(`Missing download URLs for ${siteId}/${pageSlug} (${deviceType})`);
}
const htmlPath = getScreenHtmlPath(siteId, pageSlug, deviceType);
const imagePath = getScreenImagePath(siteId, pageSlug, deviceType);
await downloadToFile(htmlUrl, htmlPath, "text");
await downloadToFile(imageUrl, imagePath, "binary");
await replaceHumanImagesInFile(htmlPath);

await writeJson(metadataPath, {
  ...metadata,
  siteId,
  brand: site.brand,
  projectId: project.projectId,
  projectTitle: desiredTitle,
  updatedAt: new Date().toISOString(),
  screens: {
    ...(metadata.screens ?? {}),
    [getScreenKey(pageSlug, deviceType)]: buildScreenRecord({ screenId, pageSlug, deviceType, htmlPath, imagePath }),
  },
});

await client.close();
console.log(`Generated ${siteId}/${pageSlug} (${deviceType})`);
console.log(`Project: ${project.projectId}`);
console.log(`Screen: ${screenId}`);
console.log(`HTML: ${htmlPath}`);
console.log(`Image: ${imagePath}`);

async function generateScreenWithRetry(toolClient, request) {
  let attempt = 0;
  let lastError = null;

  while (attempt < 3) {
    try {
      return await toolClient.callTool("generate_screen_from_text", request);
    } catch (error) {
      lastError = error;
      const message = `${error?.message || error}`.toLowerCase();
      const retryable = message.includes("service is currently unavailable") || message.includes("rate limit") || message.includes("429");
      attempt += 1;
      if (!retryable || attempt >= 3) break;
      const delayMs = attempt * 5000;
      console.warn(`Retrying generate_screen_from_text in ${delayMs / 1000}s (${attempt}/3)...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
