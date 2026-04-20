import { replaceHumanImagesInAllStitchHtml } from "./stitch-human-image-replacer.mjs";

const results = await replaceHumanImagesInAllStitchHtml();
const changedFiles = results.filter((result) => result.changed > 0);
const totalReplacements = changedFiles.reduce((sum, result) => sum + result.changed, 0);

console.log(`Updated files: ${changedFiles.length}`);
console.log(`Replaced human images: ${totalReplacements}`);

for (const result of changedFiles) {
  console.log(`- ${result.siteId}: ${result.changed} -> ${result.filePath}`);
}
