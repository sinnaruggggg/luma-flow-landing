// 견적 계산기 기준값 테스트. 실행: node --test scripts/quote.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BASES, estimate } from '../src/editorial/data/quote.js';
import { PRICING_PLANS } from '../src/editorial/data/homeContent.js';

test('기본 구성 가격이 가격표 시작가와 같다', () => {
  assert.deepEqual(BASES.map((base) => base.price), PRICING_PLANS.map((plan) => Number(plan.price)));
  assert.deepEqual(BASES.map((base) => base.plan), PRICING_PLANS.map((plan) => plan.name));
});

test('추가 기능은 더해지고, 이미 포함된 기능은 0원', () => {
  assert.equal(estimate('intro', []).min, 54);
  assert.equal(estimate('intro', ['admin', 'booking']).min, 96);
  assert.equal(estimate('brand', ['admin', 'motion']).min, 114);
  assert.equal(estimate('platform', ['admin', 'member', 'payment', 'i18n']).min, 228);
});

test('범위 상한은 하한보다 크고 5만원 단위, 기간은 무거운 기능만큼 늘어난다', () => {
  const result = estimate('intro', ['booking', 'payment']);
  assert.ok(result.max > result.min);
  assert.equal(result.max % 5, 0);
  assert.equal(result.weeks, '2~3주 + 약 2주');
  assert.equal(estimate('platform', ['member']).weeks, '6주~');
});

test('함께 필요한 기능: 쇼핑몰을 고르면 결제도 켜지고, 결제를 끄면 쇼핑몰도 꺼진다', async () => {
  const { toggleAddon } = await import('../src/editorial/data/quote.js');
  let picked = toggleAddon([], 'shop');
  assert.deepEqual(picked.sort(), ['payment', 'shop']);
  picked = toggleAddon(picked, 'payment');
  assert.deepEqual(picked, []);
  assert.deepEqual(toggleAddon(['admin'], 'admin'), []);
});

test('간단 질문 추천: 3개 구성, 가격 순서, 필수 기능 포함, 예산 초과 시 가성비형 추천', async () => {
  const { recommend } = await import('../src/editorial/data/quote.js');
  const plans = recommend({ industry: 'beauty', shape: 'booking', budget: '200', needs: ['app'], timing: 'normal' });
  assert.deepEqual(plans.map((plan) => plan.key), ['value', 'best', 'grow']);
  assert.ok(plans[0].result.min <= plans[1].result.min && plans[1].result.min <= plans[2].result.min);
  for (const plan of plans) assert.ok(plan.picked.includes('booking') && plan.picked.includes('app'), '고른 필수 기능은 모든 구성에 포함');
  assert.equal(plans.filter((plan) => plan.recommended).length, 1);
  const tight = recommend({ industry: 'medical', shape: 'homepage', budget: '100', needs: [], timing: 'soon' });
  if (!tight[1].fitsBudget) assert.equal(tight[0].recommended, true, '예산을 넘으면 가성비형을 추천');
  const shop = recommend({ industry: 'retail', shape: 'shop', budget: '0', needs: [] });
  assert.ok(shop[1].picked.includes('payment'), '쇼핑몰이면 결제 자동 포함');
  assert.equal(shop[1].fitsBudget, null, '예산 모름이면 판단하지 않음');
});

test('같은 기능을 고르면 큰 구성이 항상 같거나 더 비싸다 (라이트 ≤ 스타터 ≤ 스탠다드 ≤ 프리미엄)', async () => {
  const { ADDONS, BASES, estimate } = await import('../src/editorial/data/quote.js');
  const all = ADDONS.map((addon) => addon.id);
  const sets = [[], all, ['admin'], ['booking', 'payment'], ['member', 'admin', 'analytics'], ['app', 'motion', 'i18n']];
  for (let i = 0; i < 40; i += 1) sets.push(all.filter((id, k) => ((i * 7919 + k * 104729) % 3) === 0));
  for (const picked of sets) {
    const totals = BASES.map((base) => estimate(base.id, picked).min);
    for (let k = 1; k < totals.length; k += 1) assert.ok(totals[k] >= totals[k - 1], `${picked.join(',')} → ${totals.join(' / ')}`);
  }
  const everything = BASES.map((base) => estimate(base.id, all).min);
  assert.ok(everything[3] > everything[0], '모든 기능을 넣으면 프리미엄이 라이트보다 비싸다');
});
