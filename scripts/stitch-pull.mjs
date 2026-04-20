import { Stitch, StitchToolClient } from "@google/stitch-sdk";

import {
  buildScreenRecord,
  downloadToFile,
  ensureStitchAuth,
  getRouteOrThrow,
  getScreenHtmlPath,
  getScreenImagePath,
  getScreenKey,
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

if (!siteId) {
  console.error("Usage: npm run stitch:pull -- --site <siteId> [--page home] [--device desktop|mobile]");
  process.exit(1);
}

ensureStitchAuth();

const site = getSiteOrThrow(siteId);
await scaffoldSite(site);
getRouteOrThrow(siteId, pageSlug);

const metadataPath = getSiteMetadataPath(siteId);
const metadata = await readJson(metadataPath, null);
if (!metadata?.projectId) throw new Error(`Missing metadata projectId for ${siteId}. Run stitch:generate first.`);

const screenKey = getScreenKey(pageSlug, deviceType);
const screenMeta = metadata.screens?.[screenKey];
if (!screenMeta?.screenId) throw new Error(`Missing screenId for ${siteId}/${pageSlug}/${deviceType}. Generate the route first.`);

const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  accessToken: process.env.STITCH_ACCESS_TOKEN,
  projectId: process.env.STITCH_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
});
const sdk = new Stitch(client);
const project = sdk.project(metadata.projectId);
const screen = await project.getScreen(screenMeta.screenId);
const screenRaw = await client.callTool("get_screen", {
  projectId: metadata.projectId,
  screenId: screenMeta.screenId,
  name: `projects/${metadata.projectId}/screens/${screenMeta.screenId}`,
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
await replaceHumanImagesInFile(htmlPath);

await writeJson(metadataPath, {
  ...metadata,
  updatedAt: new Date().toISOString(),
  screens: {
    ...(metadata.screens ?? {}),
    [screenKey]: buildScreenRecord({ screenId: screen.screenId, pageSlug, deviceType, htmlPath, imagePath }),
  },
});

await client.close();
console.log(`Pulled ${siteId}/${pageSlug} (${deviceType})`);
console.log(`Screen: ${screen.screenId}`);
console.log(`HTML: ${htmlPath}`);
console.log(`Image: ${imagePath}`);
