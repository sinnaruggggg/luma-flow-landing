export const product = {
  name: "LUMA FLOW",
  label: "Landing Design Studio",
  title: "샘플을 고르면 바로 실제 서비스 페이지처럼 볼 수 있는 30개 랜딩 시나리오",
  description:
    "10개의 메인 스타일과 스타일별 업종 3개를 연결했습니다. 메인에서는 분위기를 빠르게 고르고, 상세에서는 회사 소개, 브랜드 가치, 핵심 메뉴, 문의 또는 구매 흐름까지 실제 서비스처럼 판단할 수 있습니다.",
};

export const highlights = [
  "10개 메인 스타일 샘플",
  "스타일별 업종 3개 연결",
  "총 30개 실제 서비스형 상세 페이지",
];

export const studioMetrics = [
  { value: "10", label: "메인 스타일" },
  { value: "30", label: "상세 조합" },
  { value: "3", label: "스타일당 업종" },
  { value: "100%", label: "모바일 대응" },
];

export const processSteps = [
  {
    step: "01",
    title: "스타일 선택",
    description: "메인 갤러리에서 브랜드 톤과 가장 가까운 메인 스타일을 먼저 고릅니다.",
  },
  {
    step: "02",
    title: "업종 전환",
    description: "같은 스타일 안에서 업종 3개를 즉시 바꿔보며 무엇이 가장 잘 맞는지 비교합니다.",
  },
  {
    step: "03",
    title: "실제 페이지 판단",
    description: "회사 소개, 가치 제안, 상품·서비스, 핵심 기능, 문의 또는 구매 흐름까지 한 번에 확인합니다.",
  },
];

export const packageCards = [
  {
    name: "Starter",
    price: "KRW 690K",
    description: "단일 랜딩과 핵심 섹션이 필요한 초기 브랜드용",
    items: ["메인 히어로", "기본 섹션 설계", "모바일 대응", "수정 1회"],
  },
  {
    name: "Growth",
    price: "KRW 1.49M",
    description: "문의나 구매 전환까지 설계하는 기본 서비스형",
    items: ["맞춤 비주얼", "전환 중심 섹션", "카피 구조 정리", "수정 2회"],
    highlight: true,
  },
  {
    name: "Campaign",
    price: "KRW 2.9M+",
    description: "복수 섹션과 프로모션 흐름까지 포함하는 확장형",
    items: ["복수 CTA 흐름", "업종별 기능 설계", "운영 가이드", "상세 페이지 확장"],
  },
];

export const faqs = [
  {
    question: "이건 단순 무드보드인가요?",
    answer:
      "아닙니다. 각 샘플은 실제 서비스 페이지처럼 메뉴, 소개, 상품·서비스, 핵심 기능, 문의 또는 구매 흐름까지 포함한 구조로 만들었습니다.",
  },
  {
    question: "같은 스타일 안에서 업종을 바꿔볼 수 있나요?",
    answer:
      "가능합니다. 각 스타일마다 어울리는 업종 3개를 연결해 두어 같은 디자인 언어가 업종별로 어떻게 달라지는지 바로 비교할 수 있습니다.",
  },
  {
    question: "실제 런칭용 기능도 같이 설계할 수 있나요?",
    answer:
      "가능합니다. 스타일 미리보기, 사이즈 안내, 가구 배치, 취향별 제안, 상담 접수, 예약, 장바구니 같은 기능을 업종에 맞게 실제 흐름으로 붙일 수 있습니다.",
  },
  {
    question: "어떤 스타일부터 보는 게 좋나요?",
    answer:
      "전환이 중요하면 볼드 미니멀, 크롬 럭스, 레트로퓨처 계열을 먼저 보고, 브랜드 감성과 스토리가 중요하면 콜라주, 그레인, 핸드크래프트 계열을 먼저 보는 편이 좋습니다.",
  },
];

export const featureRecommendations = [
  {
    title: "패션·뷰티: 스타일 미리보기와 조합 제안",
    description:
      "고객이 고른 아이템이나 선호 스타일을 바탕으로 어울리는 상품과 룩 조합을 보여주면 구매 전환을 빠르게 만들 수 있습니다.",
  },
  {
    title: "가구·인테리어: 공간 배치 미리보기",
    description:
      "집 사진 위에 가구를 배치하거나 무드별 구성을 추천하면 문의 전환과 체류시간이 함께 올라갑니다.",
  },
  {
    title: "상담형 서비스: 브리프 접수와 패키지 안내",
    description:
      "목적, 예산, 일정만 입력해도 맞는 패키지와 작업 방향을 바로 정리해 주는 접수 흐름이 가장 실용적입니다.",
  },
];

export const aiRecommendations = featureRecommendations;
