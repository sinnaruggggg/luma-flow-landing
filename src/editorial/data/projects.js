import { withBasePath } from '../../lib/appPaths.js';
import { FORMATS, MOODS, READY_SITES } from '../../sites/catalog.js';

// 포트폴리오 목록은 새 시안 사이트 목록(src/sites/catalog.js)에서 만들어집니다.
// 사이트가 'ready'가 되면 자동으로 홈·목록·검색에 나타납니다.

export const OPTIONS = Object.freeze({
  budget: Object.freeze([
    { value: 'light', label: '라이트 · 45만원부터' },
    { value: 'starter', label: '스타터 · 90만원부터' },
    { value: 'standard', label: '스탠다드 · 150만원부터' },
    { value: 'premium', label: '프리미엄 · 250만원부터' },
    { value: 'consult', label: '상담 후 결정' },
  ]),
  industry: Object.freeze([
    { value: 'brand', label: '기업·전문직' },
    { value: 'medical', label: '병원·의료' },
    { value: 'education', label: '교육·학원·기관' },
    { value: 'hospitality', label: '숙소·여행' },
    { value: 'retail', label: '쇼핑몰·리테일' },
    { value: 'food', label: '카페·식음' },
    { value: 'it', label: 'IT·스타트업' },
    { value: 'other', label: '생활·서비스·기타' },
  ]),
  style: Object.freeze([
    { value: 'editorial', label: '에디토리얼' },
    { value: 'minimal', label: '미니멀·차분함' },
    { value: 'trust', label: '신뢰·기업형' },
    { value: 'impact', label: '임팩트' },
    { value: 'photography', label: '사진·감성' },
    { value: 'undecided', label: '아직 모르겠음' },
  ]),
});

const GROUPS = Object.freeze(['budget', 'industry', 'style']);
const BUDGET_ORDER = Object.freeze(['light', 'starter', 'standard', 'premium']);

// 사이트별 업종 분류와 제작 구간 (catalog.js의 id 기준)
const INDUSTRY_OF = Object.freeze({
  'hangyeol-law': 'brand', flowdeck: 'it', 'orda-dental': 'medical', 'ondo-coffee': 'food', 'stay-yeobaek': 'hospitality', movelab: 'other',
  'daesung-precision': 'brand', 'gyeol-hair': 'other', 'saebom-english': 'education', monohouse: 'other', 'objet-market': 'retail', 'seoyoon-photo': 'other',
  'dasom-tax': 'brand', 'sum-pilates': 'other', 'together-walk': 'other', 'soopgyeol-clinic': 'medical', 'yeon-dining': 'food', pinda: 'it',
  'green-energy': 'brand', 'momo-illust': 'other', 'haru-pet': 'medical', 'bloom-wedding': 'other', 'hanbit-realty': 'other', 'kkeut-clean': 'other',
  autofit: 'other', kkotsaem: 'retail', 'maum-rest': 'medical', codingsoop: 'education', 'haneulbit-church': 'other', 'jecheol-farm': 'retail',
  'sonkkeut-atelier': 'education', 'coach-lee': 'other',
});
const TIER_OF_FORMAT = Object.freeze({ landing: 'starter', homepage: 'standard', feature: 'premium' });
const TIER_OVERRIDE = Object.freeze({ flowdeck: 'standard', movelab: 'starter' });
const STYLE_OF_MOOD = Object.freeze({
  corporate: 'trust', calm: 'minimal', editorial: 'editorial', bold: 'impact', tech: 'impact',
  luxury: 'photography', friendly: 'minimal', commerce: 'photography', interactive: 'impact',
});

export const PROJECTS = Object.freeze(READY_SITES.map((site) => Object.freeze({
  id: site.id,
  title: site.name,
  summary: site.summary,
  thumbnail: withBasePath(`/agency-assets/sites/${site.id}.jpg`),
  budgetRange: TIER_OVERRIDE[site.id] || TIER_OF_FORMAT[site.format],
  industry: INDUSTRY_OF[site.id] || 'other',
  style: STYLE_OF_MOOD[site.mood] || 'editorial',
  meta: `${site.industry} / ${MOODS[site.mood]} / ${FORMATS[site.format]}${site.pages > 1 ? ` · ${site.pages}페이지` : ''}`,
  format: site.format,
  mood: site.mood,
  siteUrl: `/sites/${site.id}`,
  url: `/projects/${site.id}`,
})));

export function labelFor(group, value) {
  return OPTIONS[group]?.find((option) => option.value === value)?.label ?? '';
}

export function parseFilters(search = globalThis.location?.search ?? '') {
  const params = new URLSearchParams(search);
  return GROUPS.reduce((selection, group) => {
    const value = params.get(group);
    if (value && OPTIONS[group].some((option) => option.value === value)) selection[group] = value;
    return selection;
  }, {});
}

// 예산은 "이 금액으로 만들 수 있는 사이트"를 보여 줍니다. (높은 구간을 고르면 낮은 구간 사례도 포함)
function budgetFits(selected, projectTier) {
  if (!selected || selected === 'consult') return true;
  return BUDGET_ORDER.indexOf(projectTier) <= BUDGET_ORDER.indexOf(selected);
}

export function filterProjects(selection = {}) {
  return PROJECTS.filter((project) =>
    budgetFits(selection.budget, project.budgetRange) &&
    (!selection.industry || project.industry === selection.industry) &&
    (!selection.style || selection.style === 'undecided' || project.style === selection.style),
  );
}

export function recommendProjects(selection = {}, max = 3) {
  const exactIds = new Set(filterProjects(selection).map((project) => project.id));
  return PROJECTS
    .map((project, index) => ({
      project,
      index,
      score:
        Number(Boolean(selection.industry && project.industry === selection.industry)) * 2 +
        Number(Boolean(selection.style && project.style === selection.style)),
    }))
    .filter(({ project, score }) => score > 0 && !exactIds.has(project.id))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, max)
    .map(({ project }) => project);
}

export default PROJECTS;
