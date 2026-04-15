import { mkdir, readFile, writeFile } from "node:fs/promises";
import https from "node:https";
import { fileURLToPath } from "node:url";

const outputDirectory = new URL("../public/generated/", import.meta.url);
const outputFile = new URL("webforge-logo-board-v3.png", outputDirectory);
const promptFile = new URL("webforge-logo-board-v3.prompt.txt", outputDirectory);
const envFile = new URL("../.env", import.meta.url);

const prompt = `Use case: logo-brand
Asset type: brand exploration board for a homepage logo
Primary request: Create one single concept board showing exactly 20 different logo ideas for a website brand named WebForge. Every idea must feel relevant to web building, digital craft, layout systems, code, interface, spark, forge, badge, frame, grid, monogram, or creator tools.
Scene/backdrop: Clean premium presentation board on a soft cream background, arranged as a 4-column by 5-row grid of evenly spaced logo cards.
Subject: 20 distinct WebForge logo concepts. Each card contains a readable number label from 01 to 20 in the top-left, one centered logo symbol, and a small clean wordmark reading WebForge below the symbol. Concept families should include different mixes of WF monogram, browser frame, spark, shield, forge mark, layout grid, bracket/code mark, compass/star, badge, and minimal app-icon styles.
Style/medium: polished logo concept sheet, vector-like brand presentation, flat graphic design, clean black and warm brown linework, not photorealistic.
Composition/framing: full board in view, balanced margins, each card clearly separated, consistent layout, easy to compare all 20 at once.
Lighting/mood: bright, editorial, premium, minimal, curated.
Color palette: ivory, soft cream, charcoal black, warm brown accent.
Materials/textures: subtle paper grain only, no heavy texture.
Text (verbatim): "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 WebForge"
Constraints: show exactly 20 numbered concepts, keep the board clean, each logo must feel different, suitable for selecting a final homepage logo direction, and keep all concepts brand-relevant.
Avoid: photoreal objects, devices, mockups, people, heavy gradients, purple palette, watermark, extra random text, messy collage, duplicated concepts, generic nature icons, rockets, lighthouses, clouds, plants, hands, finance arrows, unrelated pictograms.`;

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
    // Ignore missing .env and rely on existing environment variables.
  }
}

function ensureApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }
}

function getImagePart(response) {
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts.find((part) => part.inlineData?.data);
}

async function generateBoard() {
  const payload = JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: "2K",
      },
    },
  });

  const requestPath = `/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

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

async function main() {
  await loadDotEnv();
  ensureApiKey();
  await mkdir(outputDirectory, { recursive: true });
  const response = await generateBoard();
  const imagePart = getImagePart(response);

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data returned from Gemini.");
  }

  await writeFile(outputFile, Buffer.from(imagePart.inlineData.data, "base64"));
  await writeFile(promptFile, prompt, "utf8");
  console.log(fileURLToPath(outputFile));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
