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
  assert.equal(estimate('intro', []).min, 90);
  assert.equal(estimate('intro', ['admin', 'booking']).min, 160);
  assert.equal(estimate('brand', ['admin', 'motion']).min, 150);
  assert.equal(estimate('platform', ['payment', 'i18n']).min, 280);
});

test('범위 상한은 하한보다 크고 5만원 단위, 기간은 무거운 기능만큼 늘어난다', () => {
  const result = estimate('intro', ['booking', 'payment']);
  assert.ok(result.max > result.min);
  assert.equal(result.max % 5, 0);
  assert.equal(result.weeks, '2~3주 + 약 2주');
  assert.equal(estimate('platform', ['booking']).weeks, '6주~');
});
