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

const args = parseArgs();
const siteId = args.site;
const pageSlug = args.page || "home";
const deviceType = normalizeDevice(args.device);

if (!siteId) {
  console.error("사용법: npm run stitch:pull -- --site <siteId> [--page home] [--device desktop|mobile]");
  process.exit(1);
}

ensureStitchAuth();

const site = getSiteOrThrow(siteId);
await scaffoldSite(site);
getRouteOrThrow(siteId, pageSlug);

const metadataPath = getSiteMetadataPath(siteId);
const metadata = await readJson(metadataPath, null);

if (!metadata?.projectId) {
  throw new Error(`metadata.json 에 projectId 가 없습니다. 먼저 stitch:generate 를 실행하세요. (${siteId})`);
}

const screenKey = getScreenKey(pageSlug, deviceType);
const screenMeta = metadata.screens?.[screenKey];

if (!screenMeta?.screenId) {
  throw new Error(`${siteId}/${pageSlug}/${deviceType} 에 해당하는 screenId 가 없습니다. 먼저 해당 화면을 생성하세요.`);
}

const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  accessToken: process.env.STITCH_ACCESS_TOKEN,
  projectId: process.env.STITCH_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
});
const sdk = new Stitch(client);
const project = sdk.project(metadata.projectId);
const screen = await project.getScreen(screenMeta.screenId);

const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

const htmlPath = getScreenHtmlPath(siteId, pageSlug, deviceType);
const imagePath = getScreenImagePath(siteId, pageSlug, deviceType);

await downloadToFile(htmlUrl, htmlPath, "text");
await downloadToFile(imageUrl, imagePath, "binary");

const nextMetadata = {
  ...metadata,
  updatedAt: new Date().toISOString(),
  screens: {
    ...(metadata.screens ?? {}),
    [screenKey]: buildScreenRecord({
      screenId: screen.screenId,
      pageSlug,
      deviceType,
      htmlPath,
      imagePath,
    }),
  },
};

await writeJson(metadataPath, nextMetadata);
await client.close();

console.log(`Pulled ${siteId}/${pageSlug} (${deviceType})`);
console.log(`Screen: ${screen.screenId}`);
console.log(`HTML: ${htmlPath}`);
console.log(`Image: ${imagePath}`);
