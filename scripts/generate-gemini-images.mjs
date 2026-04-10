import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { imageBlueprints, imageGenerationDefaults } from "../src/lib/imageBlueprints.js";

const force = process.argv.includes("--force");
const outputDirectory = new URL("../public/generated/", import.meta.url);

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
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

async function generateImage(ai, blueprint) {
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

  const response = await ai.models.generateContent({
    model: imageGenerationDefaults.model,
    contents: blueprint.prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: imageGenerationDefaults.aspectRatio,
        imageSize: imageGenerationDefaults.imageSize,
      },
    },
  });

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
  ensureApiKey();
  await mkdir(outputDirectory, { recursive: true });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const manifest = [];

  for (const blueprint of imageBlueprints) {
    const result = await generateImage(ai, blueprint);
    manifest.push(result);
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
