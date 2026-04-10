export const imageBlueprints = [
  {
    id: "hero-orchestra",
    fileName: "hero-orchestra.png",
    label: "Hero Canvas",
    title: "AI 크리에이티브 오케스트라",
    caption: "히어로 메인 비주얼. 데스크 위 디바이스와 유리 UI 패널이 함께 보이는 프리미엄 장면.",
    prompt: `Use case: stylized-concept
Asset type: SaaS landing page hero image
Primary request: Create a premium hero visual for an AI landing page platform called LUMA FLOW.
Scene/backdrop: A bright editorial studio desk with soft sculptural light, layered devices, floating translucent interface panels, art-directed stationery, and a refined creative workspace feeling.
Subject: A campaign planning dashboard blended with tactile brand boards, image placeholders, approval chips, and performance graphs.
Style/medium: High-end 3D editorial render with realistic materials and subtle cinematic polish.
Composition/framing: Wide 16:9 composition with generous negative space on the left for headline copy, main visual weight on the right.
Lighting/mood: Morning light, crisp but warm, premium and confident.
Color palette: Warm ivory, seafoam, coral, pale citrus, graphite.
Materials/textures: Frosted glass, matte aluminum, textured paper, soft shadows.
Text (verbatim): ""
Constraints: No watermark, no legible UI brand names, no gibberish text blocks, no people faces, suitable for a modern landing page.
Avoid: Dark cyberpunk look, purple dominant palette, cluttered composition, stock-photo feel.`,
  },
  {
    id: "campaign-board",
    fileName: "campaign-board.png",
    label: "Campaign Board",
    title: "캠페인 보드 비주얼",
    caption: "기획 보드, 우선순위 카드, 실험 지표가 한 패널 안에 정리된 장면.",
    prompt: `Use case: ui-mockup
Asset type: feature section visual
Primary request: Create a modern dashboard scene that represents campaign planning, approval, and launch analytics in one workspace.
Scene/backdrop: Clean studio backdrop with one large floating board and stacked supporting cards.
Subject: Modular blocks for brief, AI copy, image requests, approval states, and analytics.
Style/medium: Polished isometric product mockup with realistic depth and tactile UI surfaces.
Composition/framing: 16:9 landscape, centered composition, readable block hierarchy.
Lighting/mood: Soft daylight with subtle highlights and confident startup energy.
Color palette: Sand, teal, black ink, coral accents, soft mint.
Materials/textures: Matte surfaces, frosted acrylic, card shadows, subtle grain.
Text (verbatim): ""
Constraints: No visible brand logos, no unreadable tiny text, no hands, no watermark.
Avoid: Excess neon, game UI, heavy dark mode, chaotic charts.`,
  },
  {
    id: "brand-kit",
    fileName: "brand-kit.png",
    label: "Brand Kit",
    title: "브랜드 스타일팩 장면",
    caption: "타이포 샘플, 컬러칩, 모바일 프레임이 아트보드처럼 정리된 감도형 비주얼.",
    prompt: `Use case: stylized-concept
Asset type: brand system showcase image
Primary request: Create an art-directed tabletop composition showing a landing page style pack system for a creative SaaS platform.
Scene/backdrop: Neutral warm surface with layered paper samples, color swatches, a phone mockup, typography strips, and layout cards.
Subject: A cohesive style kit for landing page design with tactile editorial arrangement.
Style/medium: Premium product photography mixed with graphic design collage.
Composition/framing: 16:9 top-down or slight angle composition with clean spacing and rhythm.
Lighting/mood: Bright editorial studio light, fresh and design-forward.
Color palette: Cream, moss green, chrome silver, coral red, charcoal.
Materials/textures: Paper grain, glossy card, metal clip, soft shadow.
Text (verbatim): ""
Constraints: No watermark, no actual brand trademarks, no messy clutter, no hands.
Avoid: Flat corporate stock look, low contrast mud, purple heavy gradients.`,
  },
  {
    id: "team-review",
    fileName: "team-review.png",
    label: "Review Loop",
    title: "팀 승인 루프 장면",
    caption: "실제 사람 대신 손이나 얼굴 없이, 리뷰 보드와 코멘트 흐름 자체를 보여주는 승인 장면.",
    prompt: `Use case: product-mockup
Asset type: proof section visual
Primary request: Create a cinematic workspace scene that represents team review and approval loops for a landing page platform.
Scene/backdrop: Large screen on desk, floating comment cards, version chips, and approval stamps in an elegant creative office environment.
Subject: A polished review system with annotations, revision markers, and launch readiness cues.
Style/medium: Photorealistic editorial product scene with soft depth of field.
Composition/framing: 16:9 horizontal composition, hero object centered with layered supporting notes around it.
Lighting/mood: Warm afternoon light, focused, collaborative, premium.
Color palette: Oat, graphite, pale teal, burnt coral, off-white.
Materials/textures: Screen glow, paper notes, soft fabric, metal desk accessories.
Text (verbatim): ""
Constraints: No visible human faces or readable long text, no watermark, suitable for website use.
Avoid: Messy office, generic business handshake, dark moody thriller look.`,
  },
];

export const imageGenerationDefaults = {
  model: "gemini-3.1-flash-image-preview",
  aspectRatio: "16:9",
  imageSize: "2K",
};
