import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import https from "node:https";
import { fileURLToPath } from "node:url";

const outputDirectory = new URL("../public/generated/lumaflow-logos/", import.meta.url);
const manifestFile = new URL("manifest.json", outputDirectory);
const previewFile = new URL("index.html", outputDirectory);
const envFile = new URL("../.env", import.meta.url);
const model = "gemini-3.1-flash-image-preview";
const force = process.argv.includes("--force");

const logoConcepts = [
  { id: "01", slug: "aurora-orbit", label: "Aurora Orbit", subject: "an elegant LF monogram wrapped by a soft orbit arc and one luminous breakpoint" },
  { id: "02", slug: "flow-grid", label: "Flow Grid", subject: "a minimal grid tile symbol where one path breaks out into a smooth flowing curve" },
  { id: "03", slug: "ribbon-lf", label: "Ribbon LF", subject: "a single ribbon stroke shaping an LF monogram with calm motion and clean geometry" },
  { id: "04", slug: "halo-frame", label: "Halo Frame", subject: "a browser-like frame with a halo cut through one corner to suggest flow and clarity" },
  { id: "05", slug: "beam-window", label: "Beam Window", subject: "a rounded app icon mark with a vertical beam and two horizontal light bars" },
  { id: "06", slug: "pulse-path", label: "Pulse Path", subject: "a refined path mark that moves from a strict line into a fluid pulse wave" },
  { id: "07", slug: "constellation-lf", label: "Constellation LF", subject: "an LF logo built from minimal points and connected line segments, premium and sparse" },
  { id: "08", slug: "stream-badge", label: "Stream Badge", subject: "a compact badge symbol with a flowing diagonal channel through the center" },
  { id: "09", slug: "crescent-grid", label: "Crescent Grid", subject: "a clean geometric grid icon intersected by a soft crescent of light" },
  { id: "10", slug: "line-wave", label: "Line Wave", subject: "a balanced monoline mark where one steady line turns into a gentle wave" },
  { id: "11", slug: "loop-shard", label: "Loop Shard", subject: "a sharp but elegant looped shard icon suggesting motion, editing, and direction" },
  { id: "12", slug: "echo-tile", label: "Echo Tile", subject: "a rounded square tile with nested lines that ripple outward like a controlled echo" },
  { id: "13", slug: "signal-arc", label: "Signal Arc", subject: "a modern signal bar icon softened by an arc of light and subtle premium spacing" },
  { id: "14", slug: "lightrail-monogram", label: "Lightrail Monogram", subject: "a geometric monogram with parallel rails and a single sweeping curve" },
  { id: "15", slug: "portal-mark", label: "Portal Mark", subject: "a portal-like rounded rectangle mark with a luminous opening and forward flow" },
  { id: "16", slug: "nimbus-slab", label: "Nimbus Slab", subject: "a heavier icon with calm slab geometry and a soft luminous cutout" },
  { id: "17", slug: "vector-bloom", label: "Vector Bloom", subject: "a restrained four-point bloom made from interface vectors and rounded joins" },
  { id: "18", slug: "flux-star", label: "Flux Star", subject: "a compact star-like spark built from motion lines, premium not playful" },
  { id: "19", slug: "soft-spark", label: "Soft Spark", subject: "a subtle spark icon merged with a rounded square app mark" },
  { id: "20", slug: "horizon-loop", label: "Horizon Loop", subject: "a horizontal loop mark that suggests continuity, navigation, and calm motion" },
];

async function loadDotEnv() {
  if (process.env.GEMINI_API_KEY) return;

  try {
    const raw = await readFile(envFile, "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing .env and rely on shell environment.
  }
}

function ensureApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }
}

async function fileExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function buildPrompt(concept) {
  return `Use case: logo-brand
Asset type: website brand logo exploration image
Primary request: Create one polished logo concept for a website brand named LumaFlow. Concept direction: ${concept.label}. The result should feel like a premium final-candidate logo for a modern web studio, digital showcase, or productized website service.
Scene/backdrop: a single centered logo on a warm ivory square canvas with generous whitespace and no mockup objects.
Subject: ${concept.subject}. The symbol should feel suitable for a site header, favicon, app icon, and social avatar. A tiny wordmark may appear only if the model can render the exact word correctly; otherwise use a symbol-only logo.
Style/medium: flat vector-like brand presentation, crisp edges, polished graphic design, premium, minimal, not photorealistic.
Composition/framing: one logo only, centered, square composition, balanced margins, easy to compare with other concepts.
Lighting/mood: calm, luminous, curated, modern.
Color palette: charcoal black, espresso brown, soft gold, pale cream, optional muted steel-blue accent.
Materials/textures: mostly flat with only ultra-subtle paper grain if needed.
Text (verbatim): "LumaFlow"
Constraints: one concept only, no number labels, no extra typography, no device mockup, no people, no scene objects, favicon-friendly silhouette, brand-ready simplicity.
Avoid: purple palette, 3D chrome, glossy bevels, mascots, finance arrows, AI brain icons, rockets, literal browser screenshots, clutter, duplicated motifs, unreadable text.`;
}

function getImagePart(response) {
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts.find((part) => part.inlineData?.data);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRest(prompt) {
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K",
      },
    },
  });

  const requestPath = `/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: "generativelanguage.googleapis.com",
        port: 443,
        path: requestPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let raw = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });

        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Gemini API ${response.statusCode}: ${raw.slice(0, 600) || "empty response"}`));
            return;
          }

          try {
            resolve(JSON.parse(raw));
          } catch (error) {
            reject(new Error(`Failed to parse Gemini response: ${error.message}`));
          }
        });
      },
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function buildPreviewHtml(items) {
  const cards = items
    .map((item) => `    <article class="card">
      <img src="./${item.fileName}" alt="LumaFlow logo ${item.id} ${item.label}" loading="lazy" />
      <div class="meta">
        <strong>${item.id}. ${item.label}</strong>
        <span>${item.fileName}</span>
      </div>
    </article>`)
    .join("\n");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LumaFlow Logo Explorations</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5efe7;
        --panel: rgba(255, 251, 246, 0.96);
        --line: rgba(57, 42, 30, 0.12);
        --ink: #201812;
        --muted: rgba(32, 24, 18, 0.62);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Inter", "Manrope", system-ui, sans-serif;
        background:
          radial-gradient(circle at top, rgba(255, 255, 255, 0.82), transparent 32%),
          linear-gradient(180deg, #f8f4ee, var(--bg));
        color: var(--ink);
      }
      main {
        width: min(1440px, calc(100vw - 40px));
        margin: 0 auto;
        padding: 40px 0 72px;
      }
      header {
        margin-bottom: 28px;
      }
      h1 {
        margin: 0 0 10px;
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 0.98;
        letter-spacing: -0.05em;
      }
      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.65;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .card {
        display: grid;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 24px;
        background: var(--panel);
        box-shadow: 0 16px 40px rgba(52, 39, 28, 0.06);
      }
      .card img {
        width: 100%;
        aspect-ratio: 1 / 1;
        display: block;
        border-radius: 18px;
        border: 1px solid rgba(57, 42, 30, 0.08);
        background: #fff8ef;
      }
      .meta {
        display: grid;
        gap: 4px;
      }
      .meta strong {
        font-size: 0.98rem;
      }
      .meta span {
        color: var(--muted);
        font-size: 0.78rem;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>LumaFlow Logo Explorations</h1>
        <p>LumaFlow 브랜드 방향에 맞춰 생성한 로고 시안 20개입니다. 파일명을 기준으로 선택 후보를 고르면 됩니다.</p>
      </header>
      <section class="grid">
${cards}
      </section>
    </main>
  </body>
</html>`;
}

async function main() {
  await loadDotEnv();
  ensureApiKey();
  await mkdir(outputDirectory, { recursive: true });

  const manifest = [];

  for (const concept of logoConcepts) {
    const prompt = buildPrompt(concept);
    const fileName = `${concept.id}-${concept.slug}.png`;
    const destination = new URL(fileName, outputDirectory);
    const destinationPath = fileURLToPath(destination);

    if (!force && await fileExists(destination)) {
      manifest.push({
        id: concept.id,
        slug: concept.slug,
        label: concept.label,
        fileName,
        prompt,
        path: destinationPath,
      });
      console.log(`skip ${concept.id} ${destinationPath}`);
      continue;
    }

    const response = await generateWithRest(prompt);
    const imagePart = getImagePart(response);

    if (!imagePart?.inlineData?.data) {
      throw new Error(`No image data returned for ${concept.id} ${concept.slug}.`);
    }

    await writeFile(destination, Buffer.from(imagePart.inlineData.data, "base64"));

    manifest.push({
      id: concept.id,
      slug: concept.slug,
      label: concept.label,
      fileName,
      prompt,
      path: destinationPath,
    });

    console.log(`${concept.id} ${destinationPath}`);
    await sleep(1200);
  }

  await writeFile(
    manifestFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        brand: "LumaFlow",
        model,
        items: manifest,
      },
      null,
      2,
    ),
    "utf8",
  );

  await writeFile(previewFile, buildPreviewHtml(manifest), "utf8");
  console.log(fileURLToPath(previewFile));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
