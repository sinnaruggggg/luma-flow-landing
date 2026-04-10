import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { imageBlueprints, imageGenerationDefaults } from "../src/lib/imageBlueprints.js";

const force = process.argv.includes("--force");
const outputDirectory = new URL("../public/generated/", import.meta.url);
const envFile = new URL("../.env", import.meta.url);

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadDotEnv() {
  if (process.env.GEMINI_API_KEY) {
    return;
  }

  try {
    const raw = await readFile(envFile, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing .env file and fall back to existing environment variables.
  }
}

function ensureApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing. Set it in your shell or .env loader before running npm run generate:images.",
    );
  }
}

function getImagePart(response) {
  const candidateParts = response?.candidates?.[0]?.content?.parts ?? response?.parts ?? [];
  return candidateParts.find((part) => part.inlineData?.data);
}

function getTextParts(response) {
  const candidateParts = response?.candidates?.[0]?.content?.parts ?? response?.parts ?? [];
  return candidateParts
    .filter((part) => typeof part.text === "string" && part.text.trim())
    .map((part) => part.text.trim());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRest(prompt) {
  const payload = JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      imageConfig: {
        aspectRatio: imageGenerationDefaults.aspectRatio,
        imageSize: imageGenerationDefaults.imageSize,
      },
    },
  });

  const requestPath = `/v1beta/models/${imageGenerationDefaults.model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

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
            reject(
              new Error(
                `Gemini API ${response.statusCode}: ${raw.slice(0, 600) || "empty response"}`,
              ),
            );
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

    request.on("error", (error) => {
      reject(error);
    });

    request.write(payload);
    request.end();
  });
}

function isTransientError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("socket hang up") ||
    message.includes("econnreset") ||
    message.includes("etimedout") ||
    message.includes("fetch failed")
  );
}

async function generateImage(blueprint) {
  const destination = new URL(blueprint.fileName, outputDirectory);
  const destinationPath = fileURLToPath(destination);

  if (!force && (await fileExists(destination))) {
    console.log(`skip ${blueprint.fileName} (already exists)`);
    return {
      id: blueprint.id,
      fileName: blueprint.fileName,
      status: "skipped",
      prompt: blueprint.prompt,
      path: destinationPath,
    };
  }

  console.log(`generate ${blueprint.fileName}`);

  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await generateWithRest(blueprint.prompt);
      break;
    } catch (error) {
      lastError = error;

      if (!isTransientError(error) || attempt === 3) {
        throw error;
      }

      const waitMs = attempt * 3000;
      console.log(`retry ${blueprint.fileName} (${attempt}/3) after ${waitMs}ms`);
      await sleep(waitMs);
    }
  }

  if (!response) {
    throw lastError ?? new Error(`No response returned for ${blueprint.id}.`);
  }

  const imagePart = getImagePart(response);

  if (!imagePart?.inlineData?.data) {
    throw new Error(`No image data returned for ${blueprint.id}.`);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  await writeFile(destination, buffer);

  return {
    id: blueprint.id,
    fileName: blueprint.fileName,
    status: "generated",
    prompt: blueprint.prompt,
    path: destinationPath,
    notes: getTextParts(response),
  };
}

async function main() {
  await loadDotEnv();
  ensureApiKey();
  await mkdir(outputDirectory, { recursive: true });
  const manifest = [];

  for (const blueprint of imageBlueprints) {
    const result = await generateImage(blueprint);
    manifest.push(result);
    await sleep(1200);
  }

  const manifestPath = new URL("manifest.json", outputDirectory);
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        model: imageGenerationDefaults.model,
        imageConfig: {
          aspectRatio: imageGenerationDefaults.aspectRatio,
          imageSize: imageGenerationDefaults.imageSize,
        },
        items: manifest,
      },
      null,
      2,
    ),
  );

  console.log(`done ${path.normalize(fileURLToPath(manifestPath))}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
