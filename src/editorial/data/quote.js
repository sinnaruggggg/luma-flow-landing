// 홈 비용 섹션 견적 계산기(QuoteEstimator.jsx)의 기준값.
// 금액은 가격표(라이트 45 / 스타터 90 / 스탠다드 150 / 프리미엄 250 만원부터)와 맞춘 대략값이며, 실제 견적은 상담 후 확정합니다.
export const BASES = [
  { id: 'landing', label: '랜딩 1페이지', price: 45, weeks: '1~2주', plan: '라이트', includes: [] },
  { id: 'intro', label: '소개형 3~5페이지', price: 90, weeks: '2~3주', plan: '스타터', includes: [] },
  { id: 'brand', label: '기업·브랜드 5~10페이지', price: 150, weeks: '4~6주', plan: '스탠다드', includes: ['admin', 'motion'] },
  { id: 'platform', label: '기능형 플랫폼', price: 250, weeks: '6주~', plan: '프리미엄', includes: ['admin', 'motion', 'booking', 'payment', 'member'] },
];
export const ADDONS = [
  { id: 'admin', label: '관리자 페이지(게시판)', price: 30 },
  { id: 'booking', label: '예약·신청 기능', price: 40, week: 1 },
  { id: 'payment', label: '온라인 결제', price: 50, week: 1 },
  { id: 'member', label: '회원·로그인', price: 40, week: 1 },
  { id: 'motion', label: '3D·고급 인터랙션', price: 40 },
  { id: 'i18n', label: '다국어(영문 등)', price: 30 },
  { id: 'content', label: '문구·사진 정리 도움', price: 20 },
];
export const BUDGET_BUCKETS = [[50, '50만원 이하'], [100, '50~100만원'], [200, '100~200만원'], [300, '200~300만원'], [Infinity, '300만원 이상']];
const round5 = (value) => Math.round(value / 5) * 5;

export function estimate(baseId, picked) {
  const base = BASES.find((item) => item.id === baseId) ?? BASES[0];
  const lines = ADDONS.filter((addon) => picked.includes(addon.id)).map((addon) => ({ ...addon, included: base.includes.includes(addon.id) }));
  const min = base.price + lines.reduce((sum, line) => sum + (line.included ? 0 : line.price), 0);
  const extraWeeks = lines.reduce((sum, line) => sum + (line.included ? 0 : line.week ?? 0), 0);
  return { base, lines, min, max: round5(min * 1.3), weeks: extraWeeks ? `${base.weeks} + 약 ${extraWeeks}주` : base.weeks };
}
