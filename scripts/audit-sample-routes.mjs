import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { createServer as createViteServer } from "vite";
import { siteCatalog } from "../src/content/siteCatalog.js";
import { rootDir } from "./stitch-utils.mjs";

const outputDirectory = path.resolve(rootDir, "tmp", "sample-audit");
const reportPath = path.join(outputDirectory, "report.json");

const deviceConfigs = {
  desktop: {
    viewport: { width: 1600, height: 900 },
    context: { isMobile: false, hasTouch: false, deviceScaleFactor: 1.5 },
  },
  mobile: {
    viewport: { width: 430, height: 932 },
    context: { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  },
};

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

function getAuditRoutes(site) {
  return site.routes.map((route) => ({
    slug: route.slug,
    path: route.slug === "home" ? `/${site.id}` : `/${site.id}/${route.slug}`,
  }));
}

async function waitForPageReady(page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
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
  await page.waitForTimeout(250);
}

async function captureRoute(browser, server, site, route, device) {
  const config = deviceConfigs[device];
  const context = await browser.newContext({
    viewport: config.viewport,
    ...config.context,
  });

  const url = `${server.baseUrl}${route.path}`;
  const consoleEntries = [];
  const requestFailures = [];
  const pageErrors = [];

  try {
    await context.route("**/api/visits", (interceptedRoute) =>
      interceptedRoute.fulfill({
        status: 204,
        body: "",
      }),
    );

    const page = await context.newPage();

    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleEntries.push({
          type: message.type(),
          text: message.text(),
        });
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    page.on("requestfailed", (request) => {
      requestFailures.push({
        url: request.url(),
        failure: request.failure()?.errorText ?? "unknown",
      });
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForPageReady(page);

    const pageState = await page.evaluate(() => {
      const isNotFound = Boolean(document.querySelector(".missing-card"));
      const homeRoot = document.querySelector(".sample-home, .motion-home-stage");
      const iframe = document.querySelector(".screen-stage > .screen-stage__frame iframe");
      const fallbackImage = document.querySelector(".screen-stage > .screen-stage__frame > img");
      const toolbar = document.querySelector(".site-preview-toolbar");
      const title = document.title;

      return {
        title,
        isNotFound,
        hasToolbar: Boolean(toolbar),
        hasHomeRoot: Boolean(homeRoot),
        homeRootClass: homeRoot?.className ?? "",
        hasIframe: Boolean(iframe),
        iframeSrc: iframe?.getAttribute("src") ?? "",
        hasFallbackImage: Boolean(fallbackImage),
        fallbackImageSrc: fallbackImage?.getAttribute("src") ?? "",
        bodyTextSample: (document.body.innerText || "").replace(/\s+/g, " ").trim().slice(0, 220),
      };
    });

    const blockingConsoleEntries = consoleEntries.filter((entry) => (
      !entry.text.includes("cdn.tailwindcss.com should not be used in production")
    ));

    const blockingRequestFailures = requestFailures.filter((entry) => (
      !entry.url.endsWith("/api/visits")
    ));

    return {
      siteId: site.id,
      route: route.slug,
      path: route.path,
      device,
      url,
      ok: !pageState.isNotFound && pageErrors.length === 0 && blockingRequestFailures.length === 0 && blockingConsoleEntries.length === 0,
      consoleEntries,
      blockingConsoleEntries,
      requestFailures,
      blockingRequestFailures,
      pageErrors,
      pageState,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(outputDirectory, { recursive: true });

  const server = await createAppServer();
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const results = [];

    for (const site of siteCatalog) {
      const routes = getAuditRoutes(site);

      for (const route of routes) {
        for (const device of Object.keys(deviceConfigs)) {
          const result = await captureRoute(browser, server, site, route, device);
          results.push(result);

          const status = result.ok ? "ok" : "issue";
          console.log(`${status} ${site.id} ${route.slug} ${device}`);
        }
      }
    }

    const issues = results.filter((item) => !item.ok);
    const summary = {
      generatedAt: new Date().toISOString(),
      totalSites: siteCatalog.length,
      totalChecks: results.length,
      issueCount: issues.length,
      issues,
      results,
    };

    await writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");
    console.log(`report ${reportPath}`);
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
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
