export const PAGECRAFT_SAMPLE_IDS = [
  "pagecraft-business",
  "pagecraft-premium",
  "pagecraft-emotion",
  "pagecraft-event",
  "pagecraft-saas",
];

const PAGECRAFT_SAMPLE_ID_SET = new Set(PAGECRAFT_SAMPLE_IDS);

export function isPagecraftSample(siteId) {
  return PAGECRAFT_SAMPLE_ID_SET.has(siteId);
}

export function getPagecraftSampleRank(siteId) {
  const index = PAGECRAFT_SAMPLE_IDS.indexOf(siteId);
  return index === -1 ? undefined : index;
}
