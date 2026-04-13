import fs from "node:fs/promises";
import path from "node:path";

import { showcasePages } from "../src/content/showcasePages.js";
import { designRoot, ensureDir, rootDir, scaffoldSite, stitchDir } from "./stitch-utils.mjs";

const siteSummary = showcasePages
  .map((site) => `- \`${site.id}\` | ${site.brand} | ${site.industry}`)
  .join("\n");

const siteGuide = `# Stitch Workspace

이 저장소는 20개의 독립 샘플 사이트를 Stitch MCP 기준으로 설계하고 결과를 추출하기 위한 작업 공간을 포함합니다.

## 기본 원칙

- 각 샘플 사이트는 \`design/stitch/<siteId>\` 아래에서 관리합니다.
- 각 사이트는 자기 전용 \`DESIGN.md\`, \`brief.md\`, \`site.json\` 을 가집니다.
- 데스크톱과 모바일은 별도 화면으로 생성합니다.
- 1차 생성 우선순위는 모든 사이트의 \`home-desktop\`, \`home-mobile\` 입니다.
- 생성된 HTML/PNG는 각 사이트의 \`screens/\` 아래에 저장합니다.
- \`metadata.json\` 은 로컬 Stitch 프로젝트/스크린 매핑용 파일이며 git 추적에서 제외됩니다.

## 자주 쓰는 명령

\`\`\`bash
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
npm run stitch:pull -- --site sneaker-drop --page home --device desktop
\`\`\`

## 사이트 목록

${siteSummary}
`;

const rootSiteDoc = `# Stitch Site Workspace

이 레포지토리는 하나의 서비스가 아니라 **20개의 독립 사이트 쇼케이스**입니다.

## 운영 규칙

- Stitch 결과는 사이트별로 분리합니다.
- 한 사이트를 수정할 때는 해당 사이트의 \`design/stitch/<siteId>/DESIGN.md\`, \`brief.md\` 를 먼저 참고합니다.
- 데스크톱과 모바일 화면은 별도로 생성합니다.
- 홈 화면은 사이트마다 다른 첫 화면 문법을 가져야 하며, 공통 히어로 템플릿처럼 보이면 안 됩니다.
- 공통화는 버튼, 배지, 입력, 카드 정도까지만 허용합니다.

## 사이트 목록

${siteSummary}
`;

await ensureDir(stitchDir);
await ensureDir(designRoot);
await fs.writeFile(path.join(designRoot, "README.md"), `${siteGuide}\n`, "utf8");
await fs.writeFile(path.join(stitchDir, "SITE.md"), `${rootSiteDoc}\n`, "utf8");

for (const site of showcasePages) {
  await scaffoldSite(site);
}

const inventory = showcasePages.map((site) => ({
  siteId: site.id,
  brand: site.brand,
  industry: site.industry,
  dir: path.relative(rootDir, path.join(designRoot, site.id)).replaceAll("\\", "/"),
}));

await fs.writeFile(path.join(designRoot, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");

console.log(`Initialized Stitch workspace for ${showcasePages.length} sites.`);
