import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OPTIONS, PROJECTS, parseFilters, filterProjects, recommendProjects } from '../src/editorial/data/projects.js';
import { SITES, READY_SITES } from '../src/sites/catalog.js';

test('options: 4 price tiers + consult, 8 industries, 6 styles', () => {
  assert.deepEqual(Object.values(OPTIONS).map(items => items.length), [5, 8, 6]);
});
test('every ready site becomes one complete project record', () => {
  assert.equal(PROJECTS.length, READY_SITES.length);
  assert.ok(PROJECTS.length >= 6);
  assert.equal(new Set(PROJECTS.map(p => p.id)).size, PROJECTS.length);
  for (const project of PROJECTS) {
    for (const key of ['id', 'title', 'thumbnail', 'budgetRange', 'industry', 'style', 'summary', 'url', 'siteUrl', 'meta']) assert.ok(project[key], `${project.id}.${key}`);
    assert.equal(project.url, `/projects/${project.id}`);
    assert.equal(project.siteUrl, `/sites/${project.id}`);
    for (const group of ['industry', 'style']) assert.ok(OPTIONS[group].some(o => o.value === project[group]), `${project.id} ${group}`);
    assert.ok(OPTIONS.budget.some(o => o.value === project.budgetRange));
  }
});
test('catalogue ids are unique and planned sites stay hidden', () => {
  assert.equal(new Set(SITES.map(s => s.id)).size, SITES.length);
  assert.ok(PROJECTS.every(p => READY_SITES.some(s => s.id === p.id)));
});
test('query validation drops unknowns and injected strings', () => {
  assert.deepEqual(parseFilters('?budget=premium&industry=medical&style=minimal'), { budget: 'premium', industry: 'medical', style: 'minimal' });
  assert.deepEqual(parseFilters('?budget=wrong&industry=%3Cscript%3E&style=trust&foo=bar'), { style: 'trust' });
});
test('budget shows sites buildable within the chosen tier', () => {
  const premium = filterProjects({ budget: 'premium' });
  assert.equal(premium.length, PROJECTS.length);
  assert.ok(filterProjects({ budget: 'starter' }).every(p => ['light', 'starter'].includes(p.budgetRange)));
  assert.equal(filterProjects({ budget: 'consult', style: 'undecided' }).length, PROJECTS.length);
  assert.equal(filterProjects({}).length, PROJECTS.length);
});
test('the finder test combination has exactly one match', () => {
  assert.equal(filterProjects({ budget: 'premium', industry: 'medical', style: 'minimal' }).length, 1);
});
test('recommendations use industry or style similarity, max 3', () => {
  const selection = { budget: 'light', industry: 'medical', style: 'impact' };
  const recommended = recommendProjects(selection);
  assert.ok(recommended.length > 0 && recommended.length <= 3);
  assert.ok(recommended.every(p => p.industry === selection.industry || p.style === selection.style));
  assert.deepEqual(recommendProjects({}), []);
});
