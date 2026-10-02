import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import { PROJECTS } from '../data/projects.js';
import { ADDONS, QUESTIONS, recommend, sampleIndustry } from '../data/quote.js';
import { QuoteIcon } from './QuoteIcon.jsx';

// 간단 질문 5개 → 추천 구성 3개(가성비형·추천형·확장형). "이 구성으로 계산하기"를 누르면 아래 계산기에 그대로 담깁니다.
const optionLabel = (question, value) => question.options.find(([id]) => id === value)?.[1] ?? '';

function summarizeAnswers(answers) {
  return QUESTIONS.map((question) => {
    const value = answers[question.id];
    const text = Array.isArray(value) ? value.map((id) => optionLabel(question, id)).join(', ') : optionLabel(question, value);
    return text ? `${question.title.replace(/[?.]$/, '').replace(' 골라 주세요', '')}: ${text}` : '';
  }).filter(Boolean);
}

export function QuoteWizard({ onApply }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ needs: [] });
  const titleRef = useRef(null);
  const started = useRef(false);
  const done = step >= QUESTIONS.length;
  const question = QUESTIONS[step];
  const plans = done ? recommend(answers) : [];

  // 질문이 바뀌면 제목으로 초점을 옮겨 화면 낭독기·키보드 사용자도 따라오게 합니다. (처음 화면에서는 옮기지 않음)
  useEffect(() => {
    if (!started.current) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next) => { started.current = true; setStep(next); };
  const choose = (id) => {
    setAnswers((current) => ({ ...current, [question.id]: id }));
    window.setTimeout(() => go(step + 1), 180);
  };
  const toggleNeed = (id) => setAnswers((current) => ({ ...current, needs: current.needs.includes(id) ? current.needs.filter((item) => item !== id) : [...current.needs, id] }));
  const restart = () => { setAnswers({ needs: [] }); go(0); };

  const sampleFor = () => {
    const industry = sampleIndustry(answers.industry);
    return PROJECTS.find((project) => project.industry === industry) ?? null;
  };
  const sample = done ? sampleFor() : null;

  return (
    <div className="qw" data-reveal>
      <div className="qw__head">
        <p className="qw__kicker">1분 질문으로 추천받기</p>
        <div className="qw__progress" aria-hidden="true"><i style={{ '--p': Math.min(step, QUESTIONS.length) / QUESTIONS.length }} /></div>
        <span className="qw__count">{done ? '추천 완료' : `${step + 1} / ${QUESTIONS.length}`}</span>
      </div>

      {!done ? (
        <div className="qw__q" key={question.id}>
          <h3 ref={titleRef} tabIndex={-1}>{question.title}</h3>
          {question.hint ? <p className="qw__hint">{question.hint}</p> : null}
          <div className={`qw__options qw__options--${question.id}`} role="group" aria-label={question.title}>
            {question.options.map(([id, label, sub]) => {
              const on = question.type === 'many' ? answers.needs.includes(id) : answers[question.id] === id;
              return (
                <button key={id} type="button" className={`qw__opt${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => (question.type === 'many' ? toggleNeed(id) : choose(id))}>
                  <span>{label}</span>{sub ? <small>{sub}</small> : null}
                </button>
              );
            })}
          </div>
          <div className="qw__nav">
            {step > 0 ? <button type="button" className="qw__back" onClick={() => go(step - 1)}>← 이전</button> : <span />}
            {question.type === 'many' ? <button type="button" className="btn btn--solid qw__next" onClick={() => go(step + 1)}>{answers.needs.length ? '다음' : '건너뛰기'} <span aria-hidden="true">→</span></button> : null}
          </div>
        </div>
      ) : (
        <div className="qw__result">
          <div className="qw__summary">
            <h3 ref={titleRef} tabIndex={-1}>이런 구성을 추천드려요</h3>
            <ul>{summarizeAnswers(answers).map((line) => <li key={line}>{line}</li>)}</ul>
            <button type="button" className="qw__back" onClick={restart}>↺ 다시 답하기</button>
          </div>
          <div className="qw__plans">
            {plans.map((plan) => (
              <article key={plan.key} className={`qw-plan${plan.recommended ? ' is-best' : ''}`}>
                {plan.recommended ? <span className="qw-plan__badge">★ 가장 추천</span> : null}
                <h4>{plan.title}</h4>
                <p className="qw-plan__tag">{plan.tagline}</p>
                <p className="qw-plan__price"><strong>{plan.result.min}~{plan.result.max}</strong>만원</p>
                <p className="qw-plan__meta">{plan.result.base.label} · {plan.result.weeks}</p>
                {plan.fitsBudget === true ? <p className="qw-plan__fit is-ok">✓ 예산 안</p> : plan.fitsBudget === false ? <p className="qw-plan__fit">예산보다 높아요</p> : null}
                {plan.rush ? <p className="qw-plan__fit">한 달 안 공개는 빠듯해요 · 일부는 공개 후 추가 추천</p> : null}
                <ul className="qw-plan__features">
                  {plan.picked.map((id) => {
                    const addon = ADDONS.find((item) => item.id === id);
                    return addon ? <li key={id}><QuoteIcon name={addon.icon} size={14} />{addon.label}</li> : null;
                  })}
                  {!plan.picked.length ? <li>기본 구성만으로 충분해요</li> : null}
                </ul>
                <button type="button" className={`btn ${plan.recommended ? 'btn--accent' : 'btn--line'} qw-plan__cta`} onClick={() => onApply(plan, summarizeAnswers(answers))}>이 구성으로 계산하기 <span aria-hidden="true">↓</span></button>
              </article>
            ))}
          </div>
          {plans.every((plan) => plan.fitsBudget === false) ? (
            <p className="qw__budget-note">세 구성 모두 생각하신 예산보다 높아요. 꼭 필요한 기능부터 시작하고 나머지는 공개 후 단계적으로 더하는 방법도 있어요. 상담에서 예산에 맞춰 조정해 드릴게요.</p>
          ) : null}
          {sample ? (
            <a className="qw__sample" href={withBasePath(sample.url)}>
              <img src={sample.thumbnail} alt="" loading="lazy" decoding="async" />
              <span><small>비슷한 업종 시안</small><b>{sample.title}</b><em>{sample.meta}</em></span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default QuoteWizard;
