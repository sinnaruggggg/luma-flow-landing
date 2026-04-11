const styleDescriptors = {
  neo: {
    promptStyle: "neo-brutalist commercial art direction with thick borders, raw confidence, loud color blocking, and poster-like hierarchy",
    palette: "butter yellow, coral red, cyan blue, black ink, clean white",
  },
  minimal: {
    promptStyle: "bold minimal premium brand direction with clean geometry, strong whitespace, and disciplined typography",
    palette: "ivory, charcoal, silver gray, soft stone, muted navy",
  },
  max: {
    promptStyle: "maximal editorial campaign direction with layered graphics, stacked color, and energetic composition",
    palette: "hot coral, electric pink, bright yellow, deep plum, white",
  },
  retro: {
    promptStyle: "retrofuturist neon design direction with sci-fi interfaces, chrome highlights, and dark-grid atmosphere",
    palette: "deep midnight, cyan neon, fuchsia glow, ice white, chrome silver",
  },
  collage: {
    promptStyle: "handmade paper collage editorial direction with layered scraps, tape, torn edges, and warm print textures",
    palette: "paper beige, cream white, sky blue, blush pink, sunflower yellow",
  },
  grain: {
    promptStyle: "cinematic editorial direction with grain, tactile texture, restrained luxury, and soft tonal contrast",
    palette: "warm taupe, oatmeal, moss brown, muted sand, off-white",
  },
  hand: {
    promptStyle: "warm handcrafted brand direction with doodle accents, analog imperfection, and approachable warmth",
    palette: "warm cream, honey yellow, powder blue, chocolate brown, soft paper white",
  },
  organic: {
    promptStyle: "soft organic lifestyle direction with rounded forms, human warmth, and natural-flow layouts",
    palette: "sage green, oat white, warm peach, moss, soft clay",
  },
  playful: {
    promptStyle: "playful type-led campaign direction with bold lettering, youthful energy, and high recall",
    palette: "butter yellow, cobalt blue, hot pink, black, bright white",
  },
  chrome: {
    promptStyle: "metallic premium direction with reflective surfaces, future-luxe materials, and polished glass depth",
    palette: "chrome silver, frosted white, graphite, cool steel blue, glossy black",
  },
};

const modeDescriptors = {
  commerce: {
    contactTitle: "구매 전환 안내",
    contactBody: "결제, 배송, 재고, 사이즈 또는 옵션 선택까지 실제 판매 페이지처럼 바로 이어지는 흐름입니다.",
    contactRows: [
      ["응답 채널", "챗봇 + 카카오 상담"],
      ["운영 시간", "매일 10:00 - 20:00"],
      ["전환 목표", "장바구니 / 즉시 구매"],
    ],
    gallery: [
      {
        key: "brand",
        title: "브랜드 콘셉트 컷",
        caption: "메인 히어로나 캠페인 섹션에 바로 쓰는 브랜드 대표 비주얼",
        useCase: "photorealistic-natural",
        assetType: "website hero image",
        promptFocus:
          "show the brand world as a customer-facing campaign image with a premium editorial composition",
      },
      {
        key: "product",
        title: "대표 상품 컷",
        caption: "실제 제품 판매 카드와 상세 섹션에 들어가는 시그니처 상품 이미지",
        useCase: "product-mockup",
        assetType: "product showcase image",
        promptFocus:
          "create a polished commercial product shot focused on the signature item or kit",
      },
      {
        key: "scene",
        title: "사용 장면 컷",
        caption: "매장, 스타일링, 사용 맥락을 보여주는 현장형 이미지",
        useCase: "photorealistic-natural",
        assetType: "lifestyle usage image",
        promptFocus:
          "show the real context in which the product is used, sold, or styled in a believable commercial scene",
      },
    ],
  },
  booking: {
    contactTitle: "예약 안내",
    contactBody: "예약, 상담, 방문 시간 선택까지 실제 운영 페이지처럼 확인할 수 있는 구조입니다.",
    contactRows: [
      ["응답 채널", "상담 챗봇 + 예약 문의"],
      ["운영 시간", "평일 10:00 - 19:00"],
      ["전환 목표", "상담 / 체험 예약"],
    ],
    gallery: [
      {
        key: "brand",
        title: "공간 콘셉트 컷",
        caption: "서비스 분위기와 브랜드 인상을 전달하는 메인 비주얼",
        useCase: "photorealistic-natural",
        assetType: "service landing hero image",
        promptFocus:
          "show the overall service mood, environment, and premium first impression for the landing hero",
      },
      {
        key: "product",
        title: "프로그램 또는 서비스 컷",
        caption: "예약 대상 프로그램이나 핵심 서비스 구성을 보여주는 이미지",
        useCase: "photorealistic-natural",
        assetType: "program showcase image",
        promptFocus:
          "highlight the main program, service setup, or treatment scene without readable text",
      },
      {
        key: "scene",
        title: "현장 운영 컷",
        caption: "방문했을 때의 현장 경험과 운영 분위기를 보여주는 이미지",
        useCase: "photorealistic-natural",
        assetType: "on-site experience image",
        promptFocus:
          "show the real on-site environment customers would encounter when they visit or book",
      },
    ],
  },
  membership: {
    contactTitle: "가입 안내",
    contactBody: "멤버십 비교, 혜택 선택, 참여 신청까지 실제 가입 플로우처럼 설계합니다.",
    contactRows: [
      ["응답 채널", "운영팀 챗봇 + 이메일"],
      ["운영 시간", "평일 11:00 - 18:00"],
      ["전환 목표", "가입 / 멤버십 신청"],
    ],
    gallery: [
      {
        key: "brand",
        title: "커뮤니티 메인 컷",
        caption: "클럽이나 멤버십 분위기를 전달하는 대표 이미지",
        useCase: "photorealistic-natural",
        assetType: "membership landing hero image",
        promptFocus:
          "show the emotional appeal and premium identity of the membership or club in a real-world branded scene",
      },
      {
        key: "product",
        title: "혜택 또는 구성 컷",
        caption: "멤버십 혜택, 키트, 프로그램 구성을 보여주는 이미지",
        useCase: "product-mockup",
        assetType: "membership benefits image",
        promptFocus:
          "show the tangible benefits, included items, or premium membership package in a polished commercial composition",
      },
      {
        key: "scene",
        title: "참여 현장 컷",
        caption: "실제 참여 분위기와 현장 경험을 담는 이미지",
        useCase: "photorealistic-natural",
        assetType: "community event image",
        promptFocus:
          "show a believable participation scene or event atmosphere aligned with the membership experience",
      },
    ],
  },
  ticketing: {
    contactTitle: "예매 안내",
    contactBody: "티켓 옵션, 일정, 현장 동선, 예매 결정까지 실제 이벤트 페이지처럼 이어집니다.",
    contactRows: [
      ["응답 채널", "예매 챗봇 + 운영 FAQ"],
      ["운영 시간", "매일 10:00 - 22:00"],
      ["전환 목표", "티켓 예매"],
    ],
    gallery: [
      {
        key: "brand",
        title: "이벤트 콘셉트 컷",
        caption: "메인 랜딩에서 세계관과 분위기를 전달하는 비주얼",
        useCase: "stylized-concept",
        assetType: "event hero image",
        promptFocus:
          "show a customer-facing event campaign visual with strong atmosphere, lighting, and destination appeal",
      },
      {
        key: "product",
        title: "티켓 또는 굿즈 컷",
        caption: "예매 상품, 패스, 관련 구성품을 보여주는 이미지",
        useCase: "product-mockup",
        assetType: "ticket package image",
        promptFocus:
          "create a premium ticket package, pass, or merch-style commercial shot suitable for purchase sections",
      },
      {
        key: "scene",
        title: "현장 장면 컷",
        caption: "무대, 동선, 참여 분위기를 보여주는 현장형 이미지",
        useCase: "photorealistic-natural",
        assetType: "event scene image",
        promptFocus:
          "show the real event atmosphere, venue scale, and crowd energy as a premium website image",
      },
    ],
  },
  saas: {
    contactTitle: "도입 안내",
    contactBody: "실시간 데모, 플랜 판단, 도입 상담까지 실제 SaaS 도입 페이지처럼 보이게 구성합니다.",
    contactRows: [
      ["응답 채널", "데모 챗봇 + 영업 문의"],
      ["운영 시간", "평일 09:00 - 18:00"],
      ["전환 목표", "데모 시작 / 상담"],
    ],
    gallery: [
      {
        key: "brand",
        title: "브랜드 및 팀 컷",
        caption: "서비스가 쓰이는 맥락과 브랜드 인상을 보여주는 대표 이미지",
        useCase: "photorealistic-natural",
        assetType: "saas hero image",
        promptFocus:
          "show a premium SaaS brand world with team context, modern workspace, and high trust",
      },
      {
        key: "product",
        title: "대시보드 컷",
        caption: "핵심 기능과 화면 구성을 보여주는 제품 이미지",
        useCase: "ui-mockup",
        assetType: "software product image",
        promptFocus:
          "show the product dashboard or interface clearly on devices, suitable for a real software landing page",
      },
      {
        key: "scene",
        title: "도입 현장 컷",
        caption: "팀이 실제로 서비스를 쓰는 환경을 보여주는 이미지",
        useCase: "photorealistic-natural",
        assetType: "team workflow image",
        promptFocus:
          "show a believable team workflow scene where the software is actively used in a modern company",
      },
    ],
  },
  consulting: {
    contactTitle: "프로젝트 문의 안내",
    contactBody: "브리프 입력, 범위 판단, 상담 접수까지 실제 프로젝트 페이지처럼 구성합니다.",
    contactRows: [
      ["응답 채널", "프로젝트 챗봇 + 이메일"],
      ["운영 시간", "평일 10:00 - 19:00"],
      ["전환 목표", "문의 / 제안 요청"],
    ],
    gallery: [
      {
        key: "brand",
        title: "브랜드 콘셉트 컷",
        caption: "회사 철학과 프로젝트 태도를 보여주는 대표 이미지",
        useCase: "photorealistic-natural",
        assetType: "consulting hero image",
        promptFocus:
          "show the consulting or studio brand world in a premium, believable editorial composition",
      },
      {
        key: "product",
        title: "컨셉 보드 컷",
        caption: "제안서, 재료, 무드보드, 기획 화면 등을 보여주는 이미지",
        useCase: "stylized-concept",
        assetType: "concept board image",
        promptFocus:
          "show concept boards, material samples, or planning surfaces that communicate the service process",
      },
      {
        key: "scene",
        title: "현장 프로젝트 컷",
        caption: "실제 공간이나 프로젝트 현장을 보여주는 이미지",
        useCase: "photorealistic-natural",
        assetType: "project site image",
        promptFocus:
          "show a believable project site, built result, or on-site consultation scene suited to the consulting service",
      },
    ],
  },
};

function getStyleDescriptor(sample) {
  return styleDescriptors[sample.preview] ?? styleDescriptors.minimal;
}

function getModeDescriptor(industry) {
  return modeDescriptors[industry.mode] ?? modeDescriptors.consulting;
}

export function getIndustryImageSpecs(sample, industry) {
  const mode = getModeDescriptor(industry);

  return mode.gallery.map((entry) => ({
    ...entry,
    fileName: `pages/${sample.id}--${industry.id}--${entry.key}.png`,
    src: `/generated/pages/${sample.id}--${industry.id}--${entry.key}.png`,
  }));
}

export function buildIndustryExperience(sample, industry) {
  const mode = getModeDescriptor(industry);
  const gallery = getIndustryImageSpecs(sample, industry);

  return {
    sectionNav: [
      { id: "overview", label: "개요" },
      { id: "about", label: "회사 소개" },
      { id: "catalog", label: "구성" },
      { id: "gallery", label: "이미지" },
      { id: "ai", label: "AI 기능" },
      { id: "contact", label: "문의" },
    ],
    gallery,
    contact: {
      title: mode.contactTitle,
      body: mode.contactBody,
      rows: mode.contactRows,
    },
    quickFacts: [
      ["대표 메뉴", industry.nav[0]],
      ["핵심 액션", industry.panel.primary],
      ["추천 흐름", industry.panel.secondary],
    ],
  };
}

export function buildIndustryImagePrompt(sample, industry, entry) {
  const style = getStyleDescriptor(sample);

  return `Use case: ${entry.useCase}
Asset type: ${entry.assetType}
Primary request: Create a customer-facing commercial website image for ${industry.company}, a ${industry.label}. This asset will be used on a real service landing page and must feel production-ready.
Scene/backdrop: ${entry.promptFocus}. Keep the setting specific to ${industry.label} and consistent with the brand story.
Subject: A premium visual for ${industry.company} that supports the landing page narrative, using the core offer "${industry.offers[0][0]}" or the brand promise "${industry.title}" as guidance.
Style/medium: Photorealistic commercial photography or polished editorial product visualization; incorporate ${style.promptStyle}.
Composition/framing: 16:9 website-friendly composition with strong focal point, clean edges, and room for interface cropping if needed.
Lighting/mood: High-end commercial lighting, intentional, trend-aware, customer-facing, believable, not generic stock.
Color palette: ${style.palette}.
Materials/textures: Realistic surfaces, premium textures, subtle depth, no fake CGI plastic look unless the style clearly supports it.
Text (verbatim): ""
Constraints: No watermark, no readable logos, no visible third-party branding, no text overlay, suitable for a real homepage, visually coherent with the ${sample.name} design direction.
Avoid: Cheap stock-photo look, clutter, collage of unrelated objects, meme style, unreadable signage, generic template composition.`;
}

export function buildIndustryImageManifest(styleSamples) {
  return styleSamples.flatMap((sample) =>
    sample.industries.flatMap((industry) =>
      getIndustryImageSpecs(sample, industry).map((entry) => ({
        id: `${sample.id}-${industry.id}-${entry.key}`,
        sampleId: sample.id,
        industryId: industry.id,
        company: industry.company,
        fileName: entry.fileName,
        prompt: buildIndustryImagePrompt(sample, industry, entry),
        title: entry.title,
        caption: entry.caption,
      })),
    ),
  );
}
