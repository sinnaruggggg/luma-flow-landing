import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { siteCatalog } from "../src/content/siteCatalog.js";

const outputDirectory = new URL("../public/generated/thumbs/", import.meta.url);
const filterArg = process.argv.find((arg) => arg.startsWith("--filter="));
const filter = filterArg ? filterArg.split("=")[1].toLowerCase() : "";

const deviceConfigs = {
  desktop: { width: 1280, height: 720, quality: 76 },
  mobile: { width: 480, height: 1040, quality: 72 },
};

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolvePublicAsset(assetPath) {
  return new URL(`../public${assetPath}`, import.meta.url);
}

function getFallbackSources(site, device) {
  if (device === "mobile") {
    return [site.images.product, site.images.brand, site.images.scene];
  }

  return [site.images.brand, site.images.scene, site.images.product];
}

async function resolveSource(site, device) {
  const stitchSource = new URL(`../design/stitch/${site.id}/screens/home-${device}.png`, import.meta.url);

  if (await fileExists(fileURLToPath(stitchSource))) {
    return {
      kind: "stitch-home",
      file: stitchSource,
    };
  }

  for (const fallback of getFallbackSources(site, device)) {
    const file = resolvePublicAsset(fallback);
    if (await fileExists(fileURLToPath(file))) {
      return {
        kind: "fallback-image",
        file,
      };
    }
  }

  return null;
}

async function generateThumb(site, device) {
  const source = await resolveSource(site, device);

  if (!source) {
    return {
      siteId: site.id,
      device,
      status: "missing-source",
    };
  }

  const config = deviceConfigs[device];
  const outputFile = new URL(`${site.id}-home-${device}.webp`, outputDirectory);
  const outputPath = fileURLToPath(outputFile);

  await mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(fileURLToPath(source.file))
    .resize({
      width: config.width,
      height: config.height,
      fit: "cover",
      position: "top",
    })
    .sharpen()
    .webp({
      quality: config.quality,
      effort: 4,
    })
    .toFile(outputPath);

  return {
    siteId: site.id,
    device,
    status: "generated",
    source: source.kind,
    output: outputPath,
  };
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });

  const sites = filter
    ? siteCatalog.filter((site) => `${site.id} ${site.brand} ${site.industry}`.toLowerCase().includes(filter))
    : siteCatalog;

  const results = [];

  for (const site of sites) {
    for (const device of Object.keys(deviceConfigs)) {
      const result = await generateThumb(site, device);
      results.push(result);
      console.log(`${result.status} ${site.id} ${device}`);
    }
  }

  const manifestFile = new URL("manifest.json", outputDirectory);
  await writeFile(
    manifestFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalSites: sites.length,
        items: results,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`done ${path.normalize(fileURLToPath(manifestFile))}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
