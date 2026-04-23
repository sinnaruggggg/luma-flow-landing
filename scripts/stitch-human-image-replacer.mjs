import fs from "node:fs/promises";
import path from "node:path";

import { siteCatalog } from "../src/content/siteCatalog.js";
import { designRoot, rootDir } from "./stitch-utils.mjs";

const HUMAN_IMAGE_PATTERN = /\b(portrait|profile|headshot|avatar|person|people|professional|professionals|woman|man|female|male|doctor|dermatologist|patient|creator|model|coach|trainer|consultant|founder|athlete|face|smile|receiving|performing|collaborating|consultation|treatment|massage|session|stylist|artist)\b/i;
const PORTRAIT_PATTERN = /\b(portrait|profile|headshot|avatar|doctor|dermatologist|creator|model|coach|trainer|consultant|founder|female|male|woman|man|professional|athlete|face|smile)\b/i;
const ACTION_PATTERN = /\b(patient|receiving|performing|consultation|treatment|massage|session|training|scan|diagnosis|coach|trainer)\b/i;
const IMAGE_TAG_PATTERN = /<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi;
const REMOTE_STITCH_IMAGE_PATTERN = /^https:\/\/lh3\.googleusercontent\.com\/aida-public\//i;
const LOCAL_GENERATED_IMAGE_PATTERN = /^\/generated\/(?:pages|pages-v2)\//i;
const GENERATED_PEOPLE_DIRECTORY = path.join(rootDir, "public", "generated", "people");

const siteMap = new Map(siteCatalog.map((site) => [site.id, site]));

export async function replaceHumanImagesInFile(filePath) {
  const relativePath = path.relative(designRoot, filePath);
  const [siteId] = relativePath.split(path.sep);
  const site = siteMap.get(siteId);

  if (!site?.imageStyle) {
    return { filePath, siteId, changed: 0 };
  }

  const replacements = await buildReplacementSources(site);
  if (!replacements.all.length) {
    return { filePath, siteId, changed: 0 };
  }

  const original = await fs.readFile(filePath, "utf8");
  const humanSrcCounts = collectHumanSrcCounts(original);
  const usage = collectReservedHumanSources(original, humanSrcCounts);
  let changed = 0;

  const next = original.replace(IMAGE_TAG_PATTERN, (imgTag, src) => {
    const alt = extractAltText(imgTag);
    if (!HUMAN_IMAGE_PATTERN.test(alt)) {
      return imgTag;
    }

    const shouldReplace = shouldReplaceSource(src, humanSrcCounts);
    if (!shouldReplace) {
      return imgTag;
    }

    const bucket = chooseReplacementBucket(alt);
    const candidates = replacements[bucket].length ? replacements[bucket] : replacements.all;
    const replacementSrc = chooseLeastUsedSource(candidates, src, usage);
    if (!replacementSrc || src === replacementSrc) {
      return imgTag;
    }

    changed += 1;
    return imgTag.replace(src, replacementSrc);
  });

  if (changed > 0) {
    await fs.writeFile(filePath, next, "utf8");
  }

  return { filePath, siteId, changed };
}

export async function replaceHumanImagesInAllStitchHtml() {
  const htmlFiles = await collectHtmlFiles(designRoot);
  const results = [];

  for (const filePath of htmlFiles) {
    results.push(await replaceHumanImagesInFile(filePath));
  }

  return results;
}

async function buildReplacementSources(site) {
  const people = await listGeneratedPeopleSources(site.id);
  const v2 = await buildExistingSources([
    ["brand", `/generated/pages-v2/${site.id}-brand.png`, path.join(rootDir, "public", "generated", "pages-v2", `${site.id}-brand.png`)],
    ["product", `/generated/pages-v2/${site.id}-product.png`, path.join(rootDir, "public", "generated", "pages-v2", `${site.id}-product.png`)],
    ["scene", `/generated/pages-v2/${site.id}-scene.png`, path.join(rootDir, "public", "generated", "pages-v2", `${site.id}-scene.png`)],
  ]);
  const legacy = await buildExistingSources([
    ["brand", `/generated/pages/${site.imageStyle}--${site.id}--brand.png`, path.join(rootDir, "public", "generated", "pages", `${site.imageStyle}--${site.id}--brand.png`)],
    ["product", `/generated/pages/${site.imageStyle}--${site.id}--product.png`, path.join(rootDir, "public", "generated", "pages", `${site.imageStyle}--${site.id}--product.png`)],
    ["scene", `/generated/pages/${site.imageStyle}--${site.id}--scene.png`, path.join(rootDir, "public", "generated", "pages", `${site.imageStyle}--${site.id}--scene.png`)],
  ]);
  const stylePeers = await buildStylePeerSources(site);

  const portrait = uniqueSources([
    ...people,
    ...v2.filter((source) => source.kind === "brand"),
    ...legacy.filter((source) => source.kind === "brand"),
    ...v2.filter((source) => source.kind === "product"),
    ...v2.filter((source) => source.kind === "scene"),
    ...legacy.filter((source) => source.kind !== "brand"),
    ...stylePeers,
  ]);
  const action = uniqueSources([
    ...v2.filter((source) => source.kind === "scene"),
    ...legacy.filter((source) => source.kind === "scene"),
    ...v2.filter((source) => source.kind === "product"),
    ...legacy.filter((source) => source.kind === "product"),
    ...people,
    ...v2.filter((source) => source.kind === "brand"),
    ...legacy.filter((source) => source.kind === "brand"),
    ...stylePeers,
  ]);
  const all = uniqueSources([...portrait, ...action, ...v2, ...legacy, ...people]);

  return { portrait, action, all };
}

function chooseReplacementBucket(altText) {
  if (PORTRAIT_PATTERN.test(altText)) {
    return "portrait";
  }
  if (ACTION_PATTERN.test(altText)) {
    return "action";
  }
  return "action";
}

function extractAltText(imgTag) {
  const matches = [
    imgTag.match(/\bdata-alt="([^"]*)"/i)?.[1] ?? "",
    imgTag.match(/\balt="([^"]*)"/i)?.[1] ?? "",
  ];

  return matches.join(" ").trim();
}

async function collectHtmlFiles(rootDirPath) {
  const files = [];
  const entries = await fs.readdir(rootDirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function buildExistingSources(entries) {
  const sources = [];

  for (const [kind, src, filePath] of entries) {
    try {
      await fs.access(filePath);
      sources.push({ kind, src });
    } catch {
      // Missing generated assets are expected while a site is still being filled out.
    }
  }

  return sources;
}

async function buildStylePeerSources(site) {
  const entries = siteCatalog
    .filter((candidate) => candidate.id !== site.id && candidate.imageStyle === site.imageStyle)
    .flatMap((candidate) => [
      ["brand", `/generated/pages-v2/${candidate.id}-brand.png`, path.join(rootDir, "public", "generated", "pages-v2", `${candidate.id}-brand.png`)],
      ["product", `/generated/pages-v2/${candidate.id}-product.png`, path.join(rootDir, "public", "generated", "pages-v2", `${candidate.id}-product.png`)],
      ["scene", `/generated/pages-v2/${candidate.id}-scene.png`, path.join(rootDir, "public", "generated", "pages-v2", `${candidate.id}-scene.png`)],
      ["brand", `/generated/pages/${candidate.imageStyle}--${candidate.id}--brand.png`, path.join(rootDir, "public", "generated", "pages", `${candidate.imageStyle}--${candidate.id}--brand.png`)],
      ["product", `/generated/pages/${candidate.imageStyle}--${candidate.id}--product.png`, path.join(rootDir, "public", "generated", "pages", `${candidate.imageStyle}--${candidate.id}--product.png`)],
      ["scene", `/generated/pages/${candidate.imageStyle}--${candidate.id}--scene.png`, path.join(rootDir, "public", "generated", "pages", `${candidate.imageStyle}--${candidate.id}--scene.png`)],
    ]);

  return buildExistingSources(entries);
}

async function listGeneratedPeopleSources(siteId) {
  try {
    const entries = await fs.readdir(GENERATED_PEOPLE_DIRECTORY, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => fileName.startsWith(`${siteId}-`) && /\.(png|jpe?g|webp)$/i.test(fileName))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => ({ kind: "person", src: `/generated/people/${fileName}` }));
  } catch {
    return [];
  }
}

function collectHumanSrcCounts(html) {
  const counts = new Map();

  for (const match of html.matchAll(IMAGE_TAG_PATTERN)) {
    const [imgTag, src] = match;
    if (!src || !HUMAN_IMAGE_PATTERN.test(extractAltText(imgTag))) {
      continue;
    }

    counts.set(src, (counts.get(src) ?? 0) + 1);
  }

  return counts;
}

function collectReservedHumanSources(html, humanSrcCounts) {
  const usage = new Map();

  for (const match of html.matchAll(IMAGE_TAG_PATTERN)) {
    const [imgTag, src] = match;
    if (!src || !HUMAN_IMAGE_PATTERN.test(extractAltText(imgTag)) || shouldReplaceSource(src, humanSrcCounts)) {
      continue;
    }

    reserveExistingSource(src, usage);
  }

  return usage;
}

function shouldReplaceSource(src, humanSrcCounts) {
  return REMOTE_STITCH_IMAGE_PATTERN.test(src) || (
    LOCAL_GENERATED_IMAGE_PATTERN.test(src) &&
    (humanSrcCounts.get(src) ?? 0) > 1
  );
}

function chooseLeastUsedSource(candidates, currentSrc, usage) {
  const pool = candidates.length > 1 ? candidates.filter((source) => source.src !== currentSrc) : candidates;
  const fallbackPool = pool.length ? pool : candidates;

  let selected = fallbackPool[0];
  for (const source of fallbackPool) {
    const selectedCount = usage.get(selected.src) ?? 0;
    const sourceCount = usage.get(source.src) ?? 0;
    if (sourceCount < selectedCount) {
      selected = source;
    }
  }

  reserveExistingSource(selected?.src, usage);
  return selected?.src ?? "";
}

function reserveExistingSource(src, usage) {
  if (!src) {
    return;
  }

  usage.set(src, (usage.get(src) ?? 0) + 1);
}

function uniqueSources(sources) {
  const seen = new Set();
  const unique = [];

  for (const source of sources) {
    if (!source?.src || seen.has(source.src)) {
      continue;
    }

    seen.add(source.src);
    unique.push(source);
  }

  return unique;
}
