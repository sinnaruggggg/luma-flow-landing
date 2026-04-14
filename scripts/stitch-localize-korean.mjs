import { StitchToolClient } from "@google/stitch-sdk";

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
import { getRoutesForSite } from "./stitch-blueprints.mjs";

const args = parseArgs();
const siteId = args.site;
const pageArg = args.page;
const deviceArg = args.device ? normalizeDevice(args.device) : null;

if (!siteId) {
  console.error("Usage: npm run stitch:localize:ko -- --site <siteId> [--page home] [--device desktop|mobile]");
  process.exit(1);
}

ensureStitchAuth();

const site = getSiteOrThrow(siteId);
await scaffoldSite(site);

const metadataPath = getSiteMetadataPath(siteId);
const metadata = await readJson(metadataPath, null);
if (!metadata?.projectId) {
  throw new Error(`Missing metadata projectId for ${siteId}. Generate the site first.`);
}

const routes = getRoutesForSite(siteId);
const selectedEntries = routes.flatMap((route) => {
  if (pageArg && route.slug !== pageArg) return [];
  if (pageArg) getRouteOrThrow(siteId, pageArg);
  const devices = deviceArg ? [deviceArg] : ["DESKTOP", "MOBILE"];
  return devices.map((deviceType) => {
    const key = getScreenKey(route.slug, deviceType);
    const screenMeta = metadata.screens?.[key];
    if (!screenMeta?.screenId) {
      throw new Error(`Missing screenId for ${siteId}/${route.slug}/${deviceType}.`);
    }
    return {
      route,
      deviceType,
      key,
      currentScreenId: screenMeta.screenId,
    };
  });
});

if (!selectedEntries.length) {
  throw new Error(`No screens selected for ${siteId}.`);
}

const prompt = buildLocalizationPrompt(site, selectedEntries);
const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  accessToken: process.env.STITCH_ACCESS_TOKEN,
  projectId: process.env.STITCH_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
});

const edited = await editWithRetry(client, {
  projectId: metadata.projectId,
  prompt,
  selectedScreenIds: selectedEntries.map((entry) => entry.currentScreenId),
});

const screens = collectScreens(edited);
if (!screens.length) {
  throw new Error(`No edited screens returned for ${siteId}.`);
}

const remaining = new Map(selectedEntries.map((entry) => [entry.key, entry]));
const nextScreens = { ...(metadata.screens ?? {}) };

for (const screenRaw of screens) {
  const match = matchScreen(screenRaw, remaining, selectedEntries);
  if (!match) continue;

  const screenId = screenRaw?.id || screenRaw?.screenId || screenRaw?.name?.split("/").pop() || "";
  const htmlUrl = screenRaw?.htmlCode?.downloadUrl || "";
  const imageUrl = screenRaw?.screenshot?.downloadUrl || "";
  if (!screenId || !htmlUrl || !imageUrl) {
    throw new Error(`Missing download URLs for ${siteId}/${match.route.slug}/${match.deviceType}.`);
  }

  const htmlPath = getScreenHtmlPath(siteId, match.route.slug, match.deviceType);
  const imagePath = getScreenImagePath(siteId, match.route.slug, match.deviceType);
  await downloadToFile(htmlUrl, htmlPath, "text");
  await downloadToFile(imageUrl, imagePath, "binary");

  nextScreens[match.key] = buildScreenRecord({
    screenId,
    pageSlug: match.route.slug,
    deviceType: match.deviceType,
    htmlPath,
    imagePath,
  });
  remaining.delete(match.key);
}

if (remaining.size) {
  const pending = [...remaining.values()].map((entry) => `${entry.route.slug}:${entry.deviceType.toLowerCase()}`).join(", ");
  throw new Error(`Edited screens could not be matched for ${siteId}: ${pending}`);
}

await writeJson(metadataPath, {
  ...metadata,
  updatedAt: new Date().toISOString(),
  screens: nextScreens,
});

await client.close();
console.log(`Localized ${siteId} to Korean.`);
console.log(`Updated screens: ${selectedEntries.length}`);

function buildLocalizationPrompt(currentSite, entries) {
  const targetRoutes = entries.map((entry) => {
    const deviceLabel = entry.deviceType === "MOBILE" ? "모바일" : "데스크톱";
    return `- ${entry.route.label} (${entry.route.slug}) / ${deviceLabel}`;
  });

  return [
    `${currentSite.brand} 사이트의 선택한 화면들을 한국 서비스 기준으로 전면 현지화한다.`,
    "",
    "필수 규칙:",
    "- 화면에 보이는 모든 내비게이션, 버튼, 제목, 본문, 가격 설명, 폼 라벨, 캡션은 기본적으로 한국어로 바꾼다.",
    "- 영어는 브랜드명, 1~2단어 길이의 짧은 라벨, 제품 스타일 포인트 정도만 허용한다.",
    "- Home, Pricing, Contact, Features 같은 영문 메뉴는 절대 남기지 않는다.",
    "- 숫자와 가격 표기는 `29,900원`, `월 39,000원`, `7분`, `4.9점`처럼 한국 서비스 문법으로 쓴다.",
    "- 긴 문단은 줄이고, 화면만 봐도 기능과 행동이 이해되게 만든다.",
    "- 기존 레이아웃 문법과 시각 분위기는 유지하되 문구만 번역하는 수준을 넘어서 한국 서비스처럼 자연스럽게 다듬는다.",
    "- 모바일은 한국어 문장 길이에 맞춰 줄바꿈과 버튼 폭을 다시 정리한다.",
    "",
    "이 사이트의 메뉴는 다음 한국어 라벨을 사용한다:",
    ...getRoutesForSite(currentSite.id).map((route) => `- ${route.slug}: ${route.label}`),
    "",
    "이번 편집 대상:",
    ...targetRoutes,
    "",
    "편집된 각 화면의 제목에는 해당 페이지의 한국어 라벨이 드러나야 한다. 예: `브랜드명 - 홈`, `브랜드명 - 요금`, `브랜드명 - 문의`.",
  ].join("\n");
}

function collectScreens(result) {
  const outputComponents = Array.isArray(result?.outputComponents) ? result.outputComponents : [];
  const nestedScreens = outputComponents.flatMap((component) => component?.design?.screens ?? []);
  if (nestedScreens.length) return nestedScreens;
  if (Array.isArray(result?.design?.screens)) return result.design.screens;
  return [];
}

function matchScreen(screenRaw, remaining, allEntries) {
  const deviceType = normalizeDevice(screenRaw?.deviceType || inferDeviceFromTitle(screenRaw?.title || ""));
  const title = `${screenRaw?.title || ""} ${screenRaw?.name || ""}`.toLowerCase();
  const candidates = [...remaining.values()].filter((entry) => entry.deviceType === deviceType);

  for (const entry of candidates) {
    const tokens = [entry.route.label, entry.route.legacyLabel, entry.route.slug]
      .filter(Boolean)
      .map((value) => `${value}`.toLowerCase());
    if (tokens.some((token) => title.includes(token))) {
      return entry;
    }
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  return candidates[0] ?? allEntries.find((entry) => entry.deviceType === deviceType) ?? null;
}

function inferDeviceFromTitle(title) {
  return `${title}`.includes("모바일") ? "MOBILE" : "DESKTOP";
}

async function editWithRetry(toolClient, request) {
  let attempt = 0;
  let lastError = null;

  while (attempt < 3) {
    try {
      return await toolClient.callTool("edit_screens", request);
    } catch (error) {
      lastError = error;
      const message = `${error?.message || error}`.toLowerCase();
      const retryable = message.includes("service is currently unavailable")
        || message.includes("rate limit")
        || message.includes("429")
        || message.includes("resource has been exhausted")
        || message.includes("quota");
      attempt += 1;
      if (!retryable || attempt >= 3) break;
      const delayMs = attempt * 5000;
      console.warn(`Retrying edit_screens in ${delayMs / 1000}s (${attempt}/3)...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
