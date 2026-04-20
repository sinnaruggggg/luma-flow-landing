import fs from "node:fs/promises";
import path from "node:path";

import { siteCatalog } from "../src/content/siteCatalog.js";
import { designRoot, rootDir } from "./stitch-utils.mjs";

const HUMAN_IMAGE_PATTERN = /\b(portrait|person|people|woman|man|female|male|doctor|dermatologist|patient|creator|model|coach|trainer|consultant|founder|face|smile|receiving|performing|consultation|treatment|massage|session|stylist|artist)\b/i;
const PORTRAIT_PATTERN = /\b(portrait|doctor|dermatologist|creator|model|coach|trainer|consultant|founder|female|male|woman|man|face|smile)\b/i;
const ACTION_PATTERN = /\b(patient|receiving|performing|consultation|treatment|massage|session|training|scan|diagnosis|coach|trainer)\b/i;
const REMOTE_STITCH_IMAGE_PATTERN = /<img\b[^>]*\bsrc="(https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^"]+)"[^>]*>/gi;

const siteMap = new Map(siteCatalog.map((site) => [site.id, site]));

export async function replaceHumanImagesInFile(filePath) {
  const relativePath = path.relative(designRoot, filePath);
  const [siteId] = relativePath.split(path.sep);
  const site = siteMap.get(siteId);

  if (!site?.imageStyle) {
    return { filePath, siteId, changed: 0 };
  }

  const replacements = await buildReplacementSources(site);
  if (!replacements.brand && !replacements.scene) {
    return { filePath, siteId, changed: 0 };
  }

  const original = await fs.readFile(filePath, "utf8");
  let changed = 0;

  const next = original.replace(REMOTE_STITCH_IMAGE_PATTERN, (imgTag, src) => {
    const alt = extractAltText(imgTag);
    if (!HUMAN_IMAGE_PATTERN.test(alt)) {
      return imgTag;
    }

    const kind = chooseReplacementKind(alt);
    const replacementSrc = replacements[kind] || replacements.scene || replacements.brand;
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
  const buildPublicPath = (kind) => `/generated/pages/${site.imageStyle}--${site.id}--${kind}.png`;
  const buildFilePath = (kind) => path.join(rootDir, "public", "generated", "pages", `${site.imageStyle}--${site.id}--${kind}.png`);

  const kinds = ["brand", "scene", "product"];
  const entries = await Promise.all(
    kinds.map(async (kind) => {
      const filePath = buildFilePath(kind);
      try {
        await fs.access(filePath);
        return [kind, buildPublicPath(kind)];
      } catch {
        return [kind, ""];
      }
    }),
  );

  return Object.fromEntries(entries);
}

function chooseReplacementKind(altText) {
  if (PORTRAIT_PATTERN.test(altText)) {
    return "brand";
  }
  if (ACTION_PATTERN.test(altText)) {
    return "scene";
  }
  return "scene";
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
