export const imageBlueprints = [
  {
    id: "hero-studio",
    fileName: "hero-studio.png",
    label: "Main Visual",
    title: "대표 랜딩 시안",
    caption: "브랜드 첫인상과 제품 구조를 함께 보여주는 대표 화면",
    prompt: `Use case: stylized-concept
Asset type: premium landing page hero image
Primary request: Create a premium hero visual for a landing page design studio service called LUMA FLOW.
Scene/backdrop: Bright editorial workspace with a large desktop screen, a phone mockup, layered landing page sections, subtle studio props, and clean creative-desk styling.
Subject: A modern landing page shown across desktop and mobile with strong hierarchy, polished typography blocks, clear CTA areas, and a premium digital product mood.
Style/medium: High-end 3D editorial render with realistic materials and polished UI composition.
Composition/framing: Wide 16:9 layout with clean negative space and the visual weighted to the right.
Lighting/mood: Warm daylight, calm, premium, design-forward.
Color palette: Ivory, black ink, soft coral, sage, warm sand.
Materials/textures: Frosted glass, brushed aluminum, paper texture, soft shadows.
Text (verbatim): ""
Constraints: No watermark, no visible logos, no human faces, no clutter, suitable for a real service landing page.
Avoid: Cyberpunk, purple-heavy palette, noisy layout, cheap stock-photo look.`,
  },
  {
    id: "style-compare",
    fileName: "style-compare.png",
    label: "Style Preview",
    title: "스타일 비교 화면",
    caption: "여러 방향을 한눈에 비교하고 빠르게 선택할 수 있는 구성",
    prompt: `Use case: ui-mockup
Asset type: showcase section image
Primary request: Create a clean showcase visual for a landing page service where multiple design directions can be compared at a glance.
Scene/backdrop: One large display board featuring four different landing page directions arranged in a refined editorial layout.
Subject: Distinct landing page mood samples with consistent product positioning but different visual systems.
Style/medium: Product mockup mixed with editorial graphic design.
Composition/framing: 16:9 landscape composition, clear overview, balanced spacing.
Lighting/mood: Crisp studio light, sharp, curated, easy to scan.
Color palette: Warm neutrals with black, coral, soft yellow, and muted green accents.
Materials/textures: Smooth display surface, paper cards, subtle reflections.
Text (verbatim): ""
Constraints: No logos, no unreadable text clutter, no people, no watermark.
Avoid: Busy collage chaos, gamer aesthetic, dark neon.`,
  },
  {
    id: "conversion-board",
    fileName: "conversion-board.png",
    label: "Conversion Layout",
    title: "전환 중심 보드",
    caption: "설명과 CTA 우선순위가 분명한 상품형 랜딩 예시",
    prompt: `Use case: ui-mockup
Asset type: feature section image
Primary request: Create a premium dashboard-like visual showing a conversion-focused landing page layout system.
Scene/backdrop: Floating layout cards, CTA blocks, analytics snippets, and product explanation panels arranged on a clean studio background.
Subject: A structured landing page system emphasizing headline, benefit blocks, proof, pricing, and CTA flow.
Style/medium: Isometric product visualization with tactile UI layers and realistic depth.
Composition/framing: 16:9 wide composition, centered, very readable visual hierarchy.
Lighting/mood: Clear daylight, sharp and trustworthy.
Color palette: Off-white, charcoal, soft teal, warm coral.
Materials/textures: Matte cards, thin glass panels, subtle grain.
Text (verbatim): ""
Constraints: No watermark, no human figures, no brand logos, no dense text paragraphs.
Avoid: Dark mode overload, loud gradients, poster-like chaos.`,
  },
  {
    id: "mobile-editorial",
    fileName: "mobile-editorial.png",
    label: "Mobile Focus",
    title: "모바일 중심 시안",
    caption: "작은 화면에서도 브랜드 인상이 선명하게 보이는 모바일 구성",
    prompt: `Use case: product-mockup
Asset type: mobile landing preview image
Primary request: Create a polished mobile-first landing page visual for a brand and campaign design service.
Scene/backdrop: A premium tabletop scene with two mobile devices, layered cards, and neatly arranged brand materials.
Subject: Mobile landing screens with strong typography, bold CTA, visual-led storytelling, and premium spacing.
Style/medium: Editorial product photography mixed with interface mockup realism.
Composition/framing: 16:9 horizontal scene with mobile devices as hero objects and supporting cards around them.
Lighting/mood: Soft studio light, refined, modern, confident.
Color palette: Cream, graphite, muted green, pale gold, coral accent.
Materials/textures: Metal edge devices, textured paper, glass reflections, soft shadow.
Text (verbatim): ""
Constraints: No watermark, no people, no visible third-party brands, suitable for customer-facing website use.
Avoid: Cluttered desk, exaggerated sci-fi glow, low-end template feel.`,
  },
];

export const imageGenerationDefaults = {
  model: "gemini-3.1-flash-image-preview",
  aspectRatio: "16:9",
  imageSize: "2K",
};
