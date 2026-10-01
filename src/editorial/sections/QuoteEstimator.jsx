import { useEffect, useRef, useState } from 'react';
import { ADDONS, BASES, BUDGET_BUCKETS, estimate } from '../data/quote.js';
import './quote-estimator.css';

// 비용 섹션의 "직접 계산해 보기". 기본 구성 + 추가 기능을 고르면 예상 범위가 바로 바뀝니다.
// 숫자가 목표값까지 부드럽게 굴러가게 합니다. (동작 줄이기면 바로 표시)
function useTween(target) {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const t = reduced ? 1 : Math.min(1, (now - start) / 600);
      const value = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
      fromRef.current = value;
      setShown(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

export function QuoteEstimator() {
  const [baseId, setBaseId] = useState('intro');
  const [picked, setPicked] = useState(['admin']);
  const [care, setCare] = useState(false);
  const result = estimate(baseId, picked);
  const shownMin = useTween(result.min);
  const shownMax = useTween(result.max);

  const toggle = (id) => setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  // 상담 폼(예산·문의 내용)에 이 구성을 채워 넣고 문의 영역으로 이동합니다.
  const sendToContact = () => {
    const middle = (result.min + result.max) / 2;
    const budget = BUDGET_BUCKETS.find(([limit]) => middle <= limit)[1];
    const details = [
      `[예상 견적 계산 결과]`,
      `기본 구성: ${result.base.label} (${result.base.plan})`,
      `추가 기능: ${result.lines.length ? result.lines.map((line) => line.label + (line.included ? '(포함)' : '')).join(', ') : '없음'}`,
      `유지보수: ${care ? '희망 (월 10만원부터)' : '미정'}`,
      `예상 범위: ${result.min}~${result.max}만원 · 기간 ${result.weeks}`,
      '',
      '추가로 원하는 점: ',
    ].join('\n');
    window.dispatchEvent(new CustomEvent('nanaweb:estimate', { detail: { budget, details } }));
    document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <div className="quote" data-reveal>
      <div className="quote__form">
        <p className="quote__kicker">직접 계산해 보기</p>
        <h3 className="quote__title">필요한 것만 골라<br />예상 비용을 확인하세요.</h3>
        <fieldset className="quote__group">
          <legend>1. 기본 구성</legend>
          <div className="quote__bases">
            {BASES.map((base) => (
              <label key={base.id} className={`quote__base${baseId === base.id ? ' is-on' : ''}`}>
                <input type="radio" name="quote-base" value={base.id} checked={baseId === base.id} onChange={() => setBaseId(base.id)} />
                <span className="quote__base-name">{base.label}</span>
                <span className="quote__base-price">{base.price}만원~</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="quote__group">
          <legend>2. 추가 기능 <small>여러 개 선택</small></legend>
          <div className="quote__chips">
            {ADDONS.map((addon) => {
              const included = result.base.includes.includes(addon.id);
              return (
                <label key={addon.id} className={`quote__chip${picked.includes(addon.id) ? ' is-on' : ''}${included ? ' is-included' : ''}`}>
                  <input type="checkbox" checked={picked.includes(addon.id)} onChange={() => toggle(addon.id)} />
                  <span>{addon.label}</span>
                  <b>{included ? '포함' : `+${addon.price}`}</b>
                </label>
              );
            })}
          </div>
        </fieldset>
        <label className={`quote__care${care ? ' is-on' : ''}`}>
          <input type="checkbox" checked={care} onChange={() => setCare((value) => !value)} />
          <span>공개 후 유지보수도 맡기고 싶어요 <small>월 10만원부터 · 별도</small></span>
        </label>
      </div>

      <div className="quote__receipt">
        <div className="quote__receipt-head"><span>ESTIMATE.preview</span><span>{result.base.plan} 구간</span></div>
        <ul className="quote__lines">
          <li><span>{result.base.label}</span><b>{result.base.price}</b></li>
          {result.lines.map((line) => (
            <li key={line.id} className="is-new"><span>+ {line.label}</span><b>{line.included ? '포함' : line.price}</b></li>
          ))}
          {care ? <li className="is-new quote__line-care"><span>+ 유지보수 (월)</span><b>10~</b></li> : null}
        </ul>
        <div className="quote__total">
          <span className="quote__total-label">예상 제작비</span>
          <p className="quote__total-value" aria-hidden="true"><strong>{shownMin}</strong><i>~</i><strong>{shownMax}</strong><small>만원</small></p>
          <p className="sr-only" aria-live="polite">예상 제작비 {result.min}만원에서 {result.max}만원, 예상 기간 {result.weeks}</p>
          <p className="quote__weeks">예상 기간 <b>{result.weeks}</b></p>
        </div>
        <button type="button" className="btn btn--accent quote__cta" onClick={sendToContact} data-magnetic>이 구성으로 상담하기 <span className="btn__arrow" aria-hidden="true">→</span></button>
        <p className="quote__note">부가세 별도 · 대략의 범위입니다. 정확한 금액은 상담에서 범위를 정한 뒤 확정합니다.</p>
      </div>
    </div>
  );
}

export default QuoteEstimator;
