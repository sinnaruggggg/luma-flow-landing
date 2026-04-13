import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { showcasePages } from "../src/content/showcasePages.js";
import { buildPrompt, buildSiteBrief, buildSiteDesignMd, getBlueprintForSite, getRoutesForSite } from "./stitch-blueprints.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const rootDir = path.resolve(__dirname, "..");
export const stitchDir = path.join(rootDir, ".stitch");
export const designRoot = path.join(rootDir, "design", "stitch");

const truthy = new Set(["1", "true", "yes", "on"]);

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;

    const key = value.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeIfMissing(filePath, content) {
  if (await exists(filePath)) return false;
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
  return true;
}

export function normalizeDevice(device) {
  const raw = `${device || "DESKTOP"}`.trim().toUpperCase();
  if (raw === "MOBILE") return "MOBILE";
  if (raw === "TABLET") return "TABLET";
  return "DESKTOP";
}

export function deviceSuffix(deviceType) {
  return normalizeDevice(deviceType).toLowerCase();
}

export function loadEnvFiles() {
  const inheritedKeys = new Set(Object.keys(process.env));
  const files = [".env", ".env.local"];

  for (const name of files) {
    const filePath = path.join(rootDir, name);
    try {
      const raw = requireEnvFile(filePath);
      for (const [key, value] of Object.entries(raw)) {
        if (inheritedKeys.has(key)) continue;
        process.env[key] = value;
      }
    } catch {
      // Ignore missing env files.
    }
  }
}

function requireEnvFile(filePath) {
  const content = fsSync.readFileSync(filePath, "utf8");
  const parsed = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const rawValue = trimmed.slice(eqIndex + 1).trim();
    parsed[key] = stripQuotes(rawValue);
  }

  return parsed;
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

export function ensureStitchAuth() {
  loadEnvFiles();

  const hasApiKey = Boolean(process.env.STITCH_API_KEY);
  const hasOAuth = Boolean(process.env.STITCH_ACCESS_TOKEN && (process.env.STITCH_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT));

  if (!hasApiKey && !hasOAuth) {
    throw new Error(
      [
        "Stitch 인증 정보가 없습니다.",
        "STITCH_API_KEY를 .env 또는 현재 셸에 설정하거나,",
        "`npx @_davideast/stitch-mcp init` 으로 인증을 먼저 완료하세요.",
      ].join(" "),
    );
  }
}

export function getSiteOrThrow(siteId) {
  const site = showcasePages.find((entry) => entry.id === siteId);
  if (!site) {
    throw new Error(`알 수 없는 siteId 입니다: ${siteId}`);
  }
  return site;
}

export function getRouteOrThrow(siteId, pageSlug) {
  const routes = getRoutesForSite(siteId);
  const route = routes.find((entry) => entry.slug === pageSlug);
  if (!route) {
    throw new Error(`알 수 없는 page slug 입니다: ${pageSlug}`);
  }
  return route;
}

export function getSiteDir(siteId) {
  return path.join(designRoot, siteId);
}

export function getSiteManifestPath(siteId) {
  return path.join(getSiteDir(siteId), "site.json");
}

export function getSiteBriefPath(siteId) {
  return path.join(getSiteDir(siteId), "brief.md");
}

export function getSiteMetadataPath(siteId) {
  return path.join(getSiteDir(siteId), "metadata.json");
}

export function getSiteDesignPath(siteId) {
  return path.join(getSiteDir(siteId), "DESIGN.md");
}

export function getPromptPath(siteId, pageSlug, deviceType) {
  return path.join(getSiteDir(siteId), "prompts", `${pageSlug}-${deviceSuffix(deviceType)}.md`);
}

export function getScreenHtmlPath(siteId, pageSlug, deviceType) {
  return path.join(getSiteDir(siteId), "screens", `${pageSlug}-${deviceSuffix(deviceType)}.html`);
}

export function getScreenImagePath(siteId, pageSlug, deviceType) {
  return path.join(getSiteDir(siteId), "screens", `${pageSlug}-${deviceSuffix(deviceType)}.png`);
}

export function buildSiteManifest(site) {
  return {
    siteId: site.id,
    brand: site.brand,
    industry: site.industry,
    summary: site.summary,
    blueprint: getBlueprintForSite(site.id),
    routes: getRoutesForSite(site.id),
  };
}

export async function scaffoldSite(site) {
  const siteDir = getSiteDir(site.id);
  await ensureDir(siteDir);
  await ensureDir(path.join(siteDir, "prompts"));
  await ensureDir(path.join(siteDir, "screens"));

  await writeJson(getSiteManifestPath(site.id), buildSiteManifest(site));
  await fs.writeFile(getSiteBriefPath(site.id), `${buildSiteBrief(site)}\n`, "utf8");
  await writeIfMissing(getSiteDesignPath(site.id), `${buildSiteDesignMd(site)}\n`);
}

export async function downloadToFile(url, destinationPath, mode = "text") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`다운로드 실패: ${response.status} ${response.statusText} (${url})`);
  }

  await ensureDir(path.dirname(destinationPath));

  if (mode === "binary") {
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(destinationPath, buffer);
    return;
  }

  await fs.writeFile(destinationPath, await response.text(), "utf8");
}

export function buildScreenRecord({ screenId, pageSlug, deviceType, htmlPath, imagePath }) {
  return {
    screenId,
    pageSlug,
    deviceType: normalizeDevice(deviceType),
    htmlPath: path.relative(rootDir, htmlPath).replaceAll("\\", "/"),
    imagePath: path.relative(rootDir, imagePath).replaceAll("\\", "/"),
    updatedAt: new Date().toISOString(),
  };
}

export function getScreenKey(pageSlug, deviceType) {
  return `${pageSlug}:${deviceSuffix(deviceType)}`;
}

export function boolFlag(value) {
  return truthy.has(`${value || ""}`.trim().toLowerCase());
}

export function formatPrompt(site, route, deviceType) {
  return buildPrompt({ site, route, deviceType: normalizeDevice(deviceType) });
}
