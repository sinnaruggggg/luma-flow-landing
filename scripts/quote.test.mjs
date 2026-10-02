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
  assert.equal(estimate('brand', ['admin', 'motion']).min, 90);
  assert.equal(estimate('platform', ['payment', 'i18n']).min, 168);
});

test('범위 상한은 하한보다 크고 5만원 단위, 기간은 무거운 기능만큼 늘어난다', () => {
  const result = estimate('intro', ['booking', 'payment']);
  assert.ok(result.max > result.min);
  assert.equal(result.max % 5, 0);
  assert.equal(result.weeks, '2~3주 + 약 2주');
  assert.equal(estimate('platform', ['booking']).weeks, '6주~');
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
