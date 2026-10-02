import { useRef } from 'react';
import { useCountUp } from './effects.js';
import './build-visuals.css';

// 품질 기준 섹션: 이 사이트를 실제로 잰 Lighthouse 점수. 화면에 들어오면 원이 차오르고 숫자가 올라갑니다.
// 다시 측정하면 아래 숫자와 날짜를 고쳐 주세요. (측정: Lighthouse 12, 데스크톱 기준)
const MEASURED = '2026.10.02';
const SCORES = [['성능', 91], ['접근성', 100], ['권장사항', 100], ['검색 최적화', 100]];

export function ScoreGauges() {
  const ref = useRef(null);
  useCountUp(ref);
  return (
    <div className="scores" ref={ref} data-reveal>
      <p className="scores__head"><span>LIGHTHOUSE</span>이 사이트 실측 점수 · 데스크톱 · {MEASURED}</p>
      <ul>
        {SCORES.map(([label, value], index) => (
          <li key={label} style={{ '--v': value, '--i': index }}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="scores__track" cx="60" cy="60" r="52" />
              <circle className="scores__ring" cx="60" cy="60" r="52" pathLength="100" />
            </svg>
            <strong><span data-count={value} aria-hidden="true">{value}</span><span className="sr-only">{label} {value}점</span></strong>
            <span className="scores__label" aria-hidden="true">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 제작 과정 섹션: 단계(data-step)에 따라 사이트맵 → 와이어프레임 → 디자인+코드·검수 → 공개(LIVE)로 조립되는 시안.
const CODE_LINES = [
  '<header class="nav">',
  '  <a href="/">브랜드</a>',
  '</header>',
  '<section class="hero">',
  '  <h1>{title}</h1>',
  '  <Button to="#contact" />',
  '</section>',
  'test(360, 768, 1440) ✓',
];

export function BuildPreview({ steps }) {
  return (
    <div className="build" aria-hidden="true">
      <div className="build__bar">
        <i /><i /><i />
        <span className="build__url"><b className="build__lock" />your-brand.kr</span>
        <span className="build__live">LIVE</span>
      </div>
      <div className="build__body">
        <div className="build__map">
          <span className="m-root">HOME</span>
          <span className="m-a">소개</span>
          <span className="m-b">서비스</span>
          <span className="m-c">문의</span>
        </div>
        <div className="build__page">
          <i className="b-nav" />
          <i className="b-t1" />
          <i className="b-t2" />
          <i className="b-btn" />
          <i className="b-hero" />
          <i className="b-card" /><i className="b-card" /><i className="b-card" />
        </div>
        <pre className="build__code">{CODE_LINES.join('\n')}</pre>
        <div className="build__checks"><span>360 ✓</span><span>768 ✓</span><span>1440 ✓</span><span>접근성 ✓</span></div>
        <div className="build__stats"><span>visitors · live</span><p>{[30, 42, 38, 55, 61, 58, 74, 88].map((height, index) => <i key={index} style={{ '--h': `${height}%`, '--i': index }} />)}</p></div>
      </div>
      <ol className="build__steps">
        {steps.map((step) => <li key={step.number}><b>{step.number}</b>{step.title}</li>)}
      </ol>
    </div>
  );
}
