import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { createServer as createViteServer } from "vite";
import { siteCatalog } from "../src/content/siteCatalog.js";
import { rootDir } from "./stitch-utils.mjs";

const outputDirectory = new URL("../public/generated/thumbs/", import.meta.url);
const filterArg = process.argv.find((arg) => arg.startsWith("--filter="));
const filter = filterArg ? filterArg.split("=")[1].toLowerCase() : "";
const CAPTURE_STYLE = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  html, body {
    overflow: hidden !important;
    scrollbar-width: none !important;
  }
  .site-preview-toolbar {
    display: none !important;
  }
  ::-webkit-scrollbar {
    display: none !important;
  }
`;

const deviceConfigs = {
  desktop: {
    viewport: { width: 1600, height: 900 },
    thumb: { width: 1280, height: 720, quality: 76 },
    context: { isMobile: false, hasTouch: false, deviceScaleFactor: 2 },
    settleMs: 900,
  },
  mobile: {
    viewport: { width: 540, height: 1170 },
    thumb: { width: 480, height: 1040, quality: 72 },
    context: { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    settleMs: 900,
  },
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

async function resolveFallbackSource(site, device) {
  const stitchImage = new URL(`../design/stitch/${site.id}/screens/home-${device}.png`, import.meta.url);

  if (await fileExists(fileURLToPath(stitchImage))) {
    return {
      kind: "stitch-home",
      file: stitchImage,
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

async function resolveSource(site, device) {
  const fallback = await resolveFallbackSource(site, device);

  return {
    kind: "app-route",
    routePath: `/${site.id}`,
    fallback,
  };
}

async function createAppServer() {
  const vite = await createViteServer({
    root: rootDir,
    logLevel: "error",
    server: {
      host: "127.0.0.1",
      port: 0,
      strictPort: false,
    },
  });

  await vite.listen();
  const address = vite.httpServer.address();
  const port = typeof address === "object" && address ? address.port : 5173;

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => vite.close(),
  };
}

async function waitForPageReady(page, settleMs) {
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  await page.addStyleTag({ content: CAPTURE_STYLE });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.evaluate(async () => {
    const pendingImages = Array.from(document.images).filter((image) => !image.complete);
    await Promise.all(
      pendingImages.map(
        (image) =>
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
    );

    if (document.fonts?.ready) {
      await document.fonts.ready.catch(() => {});
    }
  });
  await page.waitForTimeout(settleMs);
}

async function captureAppBuffer(browser, server, source, device) {
  const config = deviceConfigs[device];
  const context = await browser.newContext({
    viewport: config.viewport,
    ...config.context,
  });

  try {
    const page = await context.newPage();
    await page.route("**/api/visits", (route) =>
      route.fulfill({
        status: 204,
        body: "",
      }),
    );
    await page.goto(`${server.baseUrl}${source.routePath}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForPageReady(page, config.settleMs);
    await page.waitForSelector(".motion-home-stage__hero, .sample-home", { timeout: 30000 });
    return await page.screenshot({ type: "png" });
  } finally {
    await context.close();
  }
}

async function toThumbBuffer(input, device) {
  const config = deviceConfigs[device].thumb;

  return sharp(input)
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
    .toBuffer();
}

async function generateThumb(site, device, browser, server) {
  const source = await resolveSource(site, device);

  if (!source) {
    return {
      siteId: site.id,
      device,
      status: "missing-source",
    };
  }

  const outputFile = new URL(`${site.id}-home-${device}.webp`, outputDirectory);
  const outputPath = fileURLToPath(outputFile);
  await mkdir(path.dirname(outputPath), { recursive: true });

  try {
    let thumbBuffer;

    if (source.kind === "app-route") {
      const captureBuffer = await captureAppBuffer(browser, server, source, device);
      thumbBuffer = await toThumbBuffer(captureBuffer, device);
    } else {
      thumbBuffer = await toThumbBuffer(fileURLToPath(source.file), device);
    }

    await writeFile(outputPath, thumbBuffer);

    return {
      siteId: site.id,
      device,
      status: "generated",
      source: source.kind,
      output: outputPath,
    };
  } catch (error) {
    if (source.fallback) {
      const thumbBuffer = await toThumbBuffer(fileURLToPath(source.fallback.file), device);
      await writeFile(outputPath, thumbBuffer);

      return {
        siteId: site.id,
        device,
        status: "generated-with-fallback",
        source: source.fallback.kind,
        output: outputPath,
        note: error.message,
      };
    }

    throw error;
  }
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });

  const sites = filter
    ? siteCatalog.filter((site) => `${site.id} ${site.brand} ${site.industry}`.toLowerCase().includes(filter))
    : siteCatalog;

  const results = [];
  const server = await createAppServer();
  let browser;

  try {
    browser = await chromium.launch({ headless: true });

    for (const site of sites) {
      for (const device of Object.keys(deviceConfigs)) {
        const result = await generateThumb(site, device, browser, server);
        results.push(result);
        console.log(`${result.status} ${site.id} ${device}`);
      }
    }
  } catch (error) {
    if (`${error.message || error}`.toLowerCase().includes("executable")) {
      throw new Error("Chromium is not installed for Playwright. Run `npx playwright install chromium` and retry.");
    }
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    await server.close();
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
