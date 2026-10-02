import { useEffect, useRef, useState } from 'react';
import { ADDONS, BASES, BASIC_INCLUDED, CATEGORIES, QUOTE_EXTRAS, budgetLabel, estimate, toggleAddon } from '../data/quote.js';
import { BaseDiagram, QuoteIcon } from './QuoteIcon.jsx';
import { QuoteWizard } from './QuoteWizard.jsx';
import { SitePreview } from './SitePreview.jsx';
import './quote-estimator.css';

// 비용 섹션의 "견적 계산기". 간단 질문 추천 → 기본 구성 → 기능 카드 → 내 사이트 미리보기·견적서.
// 금액·설명·추천 규칙은 data/quote.js 에서 고칩니다.

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

const scrollIntoViewSmooth = (el) => el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });

export function QuoteEstimator() {
  const [baseId, setBaseId] = useState('intro');
  const [picked, setPicked] = useState(['admin']);
  const [extras, setExtras] = useState([]);
  const [care, setCare] = useState(false);
  const [tab, setTab] = useState(CATEGORIES[0].id);
  const [fromWizard, setFromWizard] = useState(null);
  const [barVisible, setBarVisible] = useState(false);
  const calcRef = useRef(null);
  const receiptRef = useRef(null);
  const result = estimate(baseId, picked);
  const shownMin = useTween(result.min);
  const shownMax = useTween(result.max);
  const base = result.base;

  // 좁은 화면: 계산기가 보이는 동안 아래에 예상 금액 바를 띄웁니다. (견적서가 보이면 숨김)
  useEffect(() => {
    const calc = calcRef.current;
    const receipt = receiptRef.current;
    if (!calc || !receipt || !('IntersectionObserver' in window)) return undefined;
    let inCalc = false;
    let receiptShown = false;
    const update = () => setBarVisible(inCalc && !receiptShown);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === calc) inCalc = entry.isIntersecting;
        if (entry.target === receipt) receiptShown = entry.isIntersecting;
      });
      update();
    }, { threshold: [0, 0.25] });
    observer.observe(calc);
    observer.observe(receipt);
    return () => observer.disconnect();
  }, []);

  const applyPlan = (plan, summary) => {
    setBaseId(plan.baseId);
    setPicked(plan.picked);
    setFromWizard({ title: plan.title, summary });
    if (plan.picked.length) setTab(ADDONS.find((addon) => addon.id === plan.picked[0])?.cat ?? CATEGORIES[0].id);
    window.setTimeout(() => scrollIntoViewSmooth(calcRef.current), 60);
  };

  const toggleExtra = (item) => setExtras((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));

  // 상담 폼(예산·문의 내용)에 이 구성을 채워 넣고 문의 영역으로 이동합니다.
  const sendToContact = () => {
    const details = [
      '[예상 견적 계산 결과]',
      ...(fromWizard ? [`추천 구성: ${fromWizard.title}`, ...fromWizard.summary] : []),
      `기본 구성: ${base.label} (${base.plan})`,
      `추가 기능: ${result.lines.length ? result.lines.map((line) => line.label + (line.included ? '(포함)' : '')).join(', ') : '없음'}`,
      extras.length ? `별도 상담: ${extras.join(', ')}` : '',
      `유지보수: ${care ? '희망 (월 10만원부터)' : '미정'}`,
      `예상 범위: ${result.min}~${result.max}만원 · 기간 ${result.weeks}`,
      '',
      '추가로 원하는 점: ',
    ].filter((line, index, list) => line !== '' || index === list.length - 2).join('\n');
    window.dispatchEvent(new CustomEvent('nanaweb:estimate', { detail: { budget: budgetLabel(result.min, result.max), details } }));
    scrollIntoViewSmooth(document.getElementById('contact'));
  };

  const tabAddons = ADDONS.filter((addon) => addon.cat === tab);
  const countIn = (cat) => picked.filter((id) => ADDONS.find((addon) => addon.id === id)?.cat === cat).length;

  return (
    <div className="quote">
      <QuoteWizard onApply={applyPlan} />

      <div className="quote__calc" ref={calcRef} id="quote-calc">
        <div className="quote__form">
          <p className="quote__kicker">직접 골라 계산하기</p>
          <h3 className="quote__title">필요한 것만 골라<br />예상 비용을 확인하세요.</h3>
          {fromWizard ? <p className="quote__applied">✓ <b>{fromWizard.title}</b> 구성을 담았어요. 자유롭게 더하거나 빼 보세요.</p> : null}

          <fieldset className="quote__group">
            <legend><span>1</span>기본 구성</legend>
            <div className="quote__bases">
              {BASES.map((item) => (
                <label key={item.id} className={`quote__base${baseId === item.id ? ' is-on' : ''}`}>
                  <input type="radio" name="quote-base" value={item.id} checked={baseId === item.id} onChange={() => setBaseId(item.id)} />
                  <BaseDiagram id={item.id} />
                  <span className="quote__base-text">
                    <b>{item.label}</b>
                    <span>{item.desc}</span>
                    <small>이런 분께 · {item.forWho}</small>
                  </span>
                  <span className="quote__base-price">{item.price}만원~<small>{item.weeks}</small></span>
                </label>
              ))}
            </div>
            <p className="quote__basic"><b>모든 구성에 기본 포함</b>{BASIC_INCLUDED.map((item) => <span key={item}><QuoteIcon name="check" size={12} />{item}</span>)}</p>
          </fieldset>

          <fieldset className="quote__group">
            <legend><span>2</span>추가 기능 <small>여러 개 선택 · 필요한 기능은 함께 선택돼요</small></legend>
            <div className="quote__tabs" role="tablist" aria-label="기능 분류">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} type="button" role="tab" aria-selected={tab === cat.id} className={tab === cat.id ? 'is-on' : ''} onClick={() => setTab(cat.id)}>
                  {cat.label}{countIn(cat.id) ? <b>{countIn(cat.id)}</b> : null}
                </button>
              ))}
            </div>
            <div className="quote__cards" role="tabpanel">
              {tabAddons.map((addon) => {
                const on = picked.includes(addon.id);
                const included = base.includes.includes(addon.id);
                return (
                  <label key={addon.id} className={`quote__card${on ? ' is-on' : ''}${included ? ' is-included' : ''}${addon.id === 'app' ? ' is-new' : ''}`}>
                    <input type="checkbox" checked={on} onChange={() => setPicked((current) => toggleAddon(current, addon.id))} />
                    <span className="quote__card-icon"><QuoteIcon name={addon.icon} /></span>
                    <span className="quote__card-text"><b>{addon.label}{addon.id === 'app' ? <em>NEW</em> : null}</b><span>{addon.desc}</span></span>
                    <span className="quote__card-price">{included ? '포함' : `+${addon.price}`}</span>
                    <span className="quote__card-check" aria-hidden="true"><QuoteIcon name="check" size={14} /></span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="quote__group">
            <legend><span>3</span>이런 것도 필요해요 <small>금액은 상담에서 따로 안내</small></legend>
            <div className="quote__extras">
              {QUOTE_EXTRAS.map((item) => (
                <label key={item} className={`quote__extra${extras.includes(item) ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={extras.includes(item)} onChange={() => toggleExtra(item)} />{item}
                </label>
              ))}
            </div>
            <label className={`quote__care${care ? ' is-on' : ''}`}>
              <input type="checkbox" checked={care} onChange={() => setCare((value) => !value)} />
              <span>공개 후 유지보수도 맡기고 싶어요 <small>월 10만원부터 · 별도</small></span>
            </label>
          </fieldset>
        </div>

        <div className="quote__side">
          <div className="quote__receipt" ref={receiptRef}>
            <div className="quote__receipt-head"><span>내 사이트 미리보기</span><span>{base.plan} 구간</span></div>
            <SitePreview baseId={baseId} picked={picked} />
            <p className="quote__count"><span>견적 항목</span><span>{result.lines.length + 1 + (extras.length ? 1 : 0) + (care ? 1 : 0)}개</span></p>
            <ul className="quote__lines">
              <li><span>{base.label}</span><b>{base.price}</b></li>
              {result.lines.map((line) => (
                <li key={line.id} className="is-new"><span>+ {line.label}</span><b>{line.included ? '포함' : line.price}</b></li>
              ))}
              {extras.length ? <li className="is-new quote__line-extra"><span>+ {extras.join(', ')}</span><b>상담</b></li> : null}
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
      </div>

      <div className={`quote__bar${barVisible ? ' is-on' : ''}`} aria-hidden={!barVisible}>
        <span>예상 <b>{result.min}~{result.max}</b>만원 · {result.lines.length + 1}개 항목</span>
        <button type="button" tabIndex={barVisible ? 0 : -1} onClick={() => scrollIntoViewSmooth(receiptRef.current)}>견적 보기 ↓</button>
      </div>
    </div>
  );
}

export default QuoteEstimator;
