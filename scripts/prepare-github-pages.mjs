import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const repoName = process.env.GITHUB_PAGES_REPO || "luma-flow-landing";
const basePath = `/${repoName}`;
const distDir = resolve("dist");
const portfolioDir = join(distDir, "portfolio");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".mjs", ".svg", ".txt", ".webmanifest", ".xml"]);

if (!existsSync(distDir)) {
  throw new Error("dist directory does not exist. Run npm run build first.");
}

writeFileSync(join(distDir, ".nojekyll"), "", "utf8");

const indexFile = join(distDir, "index.html");
if (existsSync(indexFile)) {
  copyFileSync(indexFile, join(distDir, "404.html"));
}

function rewriteFile(filePath) {
  if (!textExtensions.has(extname(filePath).toLowerCase())) {
    return;
  }

  const current = readFileSync(filePath, "utf8");
  const next = current
    .replaceAll("/portfolio/", `${basePath}/portfolio/`)
    .replaceAll('"/_next/', `"${basePath}/portfolio/aim-furniture/site/_next/`)
    .replaceAll("'/_next/", `'${basePath}/portfolio/aim-furniture/site/_next/`)
    .replaceAll('"/finish-samples/', `"${basePath}/portfolio/aim-furniture/site/finish-samples/`)
    .replaceAll("'/finish-samples/", `'${basePath}/portfolio/aim-furniture/site/finish-samples/`);

  if (next !== current) {
    writeFileSync(filePath, next, "utf8");
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (statSync(filePath).isDirectory()) {
      walk(filePath);
    } else {
      rewriteFile(filePath);
    }
  }
}

if (existsSync(portfolioDir)) {
  walk(portfolioDir);
}
