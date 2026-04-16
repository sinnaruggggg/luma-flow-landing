export const GALLERY_COPY_DEFAULTS = {
  heroTitle: "원하는 분위기의 샘플로 내 사이트를 빠르게 시작하세요",
  showcaseDescription: "실제 홈페이지처럼 구성된 샘플을 보고, 가장 가까운 스타일과 구조를 빠르게 고를 수 있습니다.",
  processHeading: "복잡하게 설명하지 않고, 빠르게 방향을 잡습니다.",
  featuresHeading: "실제로 필요한 기능만 정리해서 붙입니다.",
  pricingHeading: "149,000원부터 시작하는 3단계 요금으로 쉽게 고를 수 있습니다.",
  pricingDescription: "복잡한 견적 대신 시작형, 기본형, 확장형으로 나눴습니다. 먼저 고르고, 필요한 만큼만 커스터마이징하면 됩니다.",
  contactHeading: "샘플 선택부터 문의 정리까지 이 화면에서 바로 준비할 수 있습니다.",
  contactDescription: "어느 정도 커스터마이징할지 고르고, 참조 사이트나 이미지를 적고, 문의 내용을 작성한 뒤 복사해서 원하는 채널로 보내면 됩니다.",
};

export const INQUIRY_DEFAULTS = {
  pricingPlans: [
    {
      name: "시작형",
      price: "149,000원",
      description: "가볍게 시작하는 기본형입니다. 소개 화면을 빠르게 만들고 싶은 경우에 맞습니다.",
      items: ["랜딩 1페이지 + 1~3페이지", "문구·이미지 교체", "모바일 최적화"],
      featured: false,
    },
    {
      name: "기본형",
      price: "299,000원",
      description: "가장 많이 선택하는 구성입니다. 문의 유도와 화면 구성을 함께 다듬습니다.",
      items: ["핵심 섹션 확장", "CTA·문의 흐름 구성", "기본 수정 2회"],
      featured: true,
    },
    {
      name: "확장형",
      price: "499,000원",
      description: "페이지 추가나 커스터마이징 범위가 더 큰 경우에 맞는 확장형입니다.",
      items: ["서브 페이지 추가", "예약·상담 흐름 설계", "배포 반영 지원"],
      featured: false,
    },
  ],
  contactPoints: [
    "원하는 샘플 1개 고르기",
    "어디까지 바꿀지 정하기",
    "참조 링크와 이미지를 함께 보내기",
  ],
  customizationLevels: [
    "문구와 이미지 정도만 바꾸기",
    "섹션 순서와 구성을 조금 바꾸기",
    "페이지 추가와 기능까지 같이 바꾸기",
  ],
  budgetOptions: [
    "149,000원 ~ 299,000원",
    "300,000원 ~ 499,000원",
    "500,000원 이상",
  ],
  timelineOptions: ["1주 이내", "2주 이내", "3주 이상"],
  externalChannels: [
    {
      name: "크몽",
      href: "https://kmong.com",
      description: "공식 사이트에서 홈페이지 제작 또는 랜딩페이지 제작으로 검색한 뒤, 아래 문의 내용을 붙여넣어 요청하세요.",
    },
    {
      name: "숨고",
      href: "https://soomgo.com",
      description: "요청서에 샘플명, 예산, 일정, 참조 링크를 함께 적으면 비교와 상담이 더 빨라집니다.",
    },
  ],
};
