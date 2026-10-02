import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import { ProjectGrid } from '../components/ProjectGrid.jsx';
import {
  AUDIENCES, CAPABILITIES, FAQS, PRICING_NOTES, PRICING_PLANS,
  PROCESS_STEPS, QUALITY_SPECS, SERVICES, SPEC_LAYERS,
} from '../data/homeContent.js';
import { useActiveStep, useCountUp, usePointerVars } from './effects.js';
import { WorkGallery } from './WorkGallery.jsx';
import { QuoteEstimator } from './QuoteEstimator.jsx';
import { ServiceBuild } from './ServiceBuild.jsx';
import { BuildPreview, ScoreGauges } from './BuildVisuals.jsx';
import './home-sections.css';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 요소가 화면 아래에서 가운데까지 올라오는 동안 --q를 0→1로 바꿉니다.
function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.style.setProperty('--q', '1');
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight * 0.5 + rect.height * 0.5)));
      el.style.setProperty('--q', q.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
}

function SectionHead({ index, label, title, titleId, children }) {
  return (
    <div className="sx-head" data-reveal>
      <p className="sx-head__meta"><span className="sx-index">{index}</span><span>{label}</span></p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  );
}

export function CapabilityTicker() {
  const track = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <section className="ticker" aria-label="제작 분야">
      <ul className="sr-only">{CAPABILITIES.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="ticker__track" aria-hidden="true">
        {track.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
      </div>
    </section>
  );
}

export function WorkSection({ projects }) {
  // 동작 줄이기 설정이면 움직이는 갤러리 대신 기존 그리드를 보여 줍니다.
  const [reduced] = useState(prefersReducedMotion);
  return (
    <section className="sx sx--work" id="work" aria-labelledby="work-title">
      <div className="sx-inner">
        <SectionHead index="01" label="작업" title={<>서로 다른 사업,<br />각자의 얼굴.</>} titleId="work-title">
          <a className="sx-link" href={withBasePath('/projects')}>전체 사례 보기 <span aria-hidden="true">↗</span></a>
        </SectionHead>
        {reduced ? <ProjectGrid projects={projects} variant="featured" /> : null}
      </div>
      {reduced ? null : <WorkGallery projects={projects} />}
      <div className="sx-inner">
        <p className="section-note">디자인 방향을 보여 주기 위한 가상 프로젝트입니다. 표시된 예산은 예시 범위이며 실제 견적과 다릅니다.</p>
      </div>
    </section>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  return (
    <section className="sx sx--services" id="services" aria-labelledby="services-title">
      <div className="sx-inner">
        <SectionHead index="02" label="서비스" title={<>기획부터 개발, 운영까지<br />한 팀이 끝까지 만듭니다.</>} titleId="services-title" />
        <div className="services">
          <ol className="services__list">
            {SERVICES.map((service, index) => (
              <li
                key={service.id}
                className={`services__row${active === index ? ' is-active' : ''}`}
                onPointerEnter={() => setActive(index)}
                data-reveal
              >
                <span className="services__no">{String(index + 1).padStart(2, '0')}</span>
                <div className="services__body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <ul className="services__tags">{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <span className="services__period">{service.period}</span>
              </li>
            ))}
          </ol>
          <ServiceBuild services={SERVICES} active={active} />
        </div>
      </div>
    </section>
  );
}

export function Audience() {
  return (
    <section className="sx sx--audience" id="audience" aria-labelledby="audience-title">
      <div className="sx-inner">
        <SectionHead index="03" label="함께하는 분들" title={<>개인부터 기관까지,<br />규모보다 목적에 맞춥니다.</>} titleId="audience-title" />
        <ul className="audience">
          {AUDIENCES.map((item, index) => (
            <li key={item.title} data-reveal style={{ '--d': `${index * 80}ms` }}>
              <span className="audience__no">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="audience__need">{item.need}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LayerBody({ name }) {
  if (name === '구조') {
    return <div className="layer-wire"><i className="w-head" /><i className="w-hero" /><i className="w-col" /><i className="w-col" /><i className="w-col" /><i className="w-foot" /></div>;
  }
  if (name === '디자인') {
    return <div className="layer-design"><i className="d-nav" /><b className="d-title" /><b className="d-title d-title--short" /><i className="d-image" /><i className="d-btn" /></div>;
  }
  if (name === '코드') {
    return <div className="layer-code">{[62, 44, 78, 36, 58, 70, 30].map((width, index) => <i key={index} style={{ width: `${width}%`, marginLeft: `${(index % 3) * 8}%` }} />)}</div>;
  }
  return <div className="layer-data"><span>GET /api/pages 200</span><span>POST /api/inquiries 201</span><span>cache hit · 38ms</span><span>sitemap.xml ✓</span></div>;
}

export function QualitySpec() {
  const visual = useRef(null);
  useScrollProgress(visual);
  usePointerVars(visual);
  const layers = [...SPEC_LAYERS].reverse();
  return (
    <section className="sx sx--spec" id="quality" aria-labelledby="quality-title">
      <div className="sx-inner spec">
        <div className="spec__text">
          <SectionHead index="04" label="품질 기준" title={<>보이지 않는 곳까지<br />설계합니다.</>} titleId="quality-title">
            <p className="sx-lead">예쁜 화면은 시작일 뿐입니다. 모든 프로젝트는 아래 기준으로 만들고 확인한 뒤 공개합니다.</p>
          </SectionHead>
          <dl className="spec__table">
            {QUALITY_SPECS.map(([term, detail], index) => (
              <div key={term} data-reveal style={{ '--i': index }}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
                <span className="spec__status" aria-hidden="true"><i className="spec__spin" /><b className="spec__check">통과</b></span>
              </div>
            ))}
          </dl>
          <p className="spec__summary" data-reveal style={{ '--i': QUALITY_SPECS.length }}><span aria-hidden="true">●</span> 공개 전 검수 {QUALITY_SPECS.length}개 항목 · 모두 통과해야 공개합니다</p>
        </div>
        <div className="spec__visual" ref={visual} aria-hidden="true">
          <div className="spec__iso">
            {layers.map((name, index) => (
              <div key={name} className={`spec-layer spec-layer--${index}`} style={{ '--i': index }}>
                <span className="spec-layer__label">{String(SPEC_LAYERS.indexOf(name) + 1).padStart(2, '0')} {name}</span>
                <LayerBody name={name} />
              </div>
            ))}
            <div className="spec-scan" />
          </div>
        </div>
        <ScoreGauges />
      </div>
    </section>
  );
}

export function Process() {
  const list = useRef(null);
  useActiveStep(list);
  return (
    <section className="sx sx--process" id="approach" aria-labelledby="approach-title">
      <div className="sx-inner">
        <SectionHead index="05" label="제작 과정" title={<>무엇을 만들지부터<br />함께 정리합니다.</>} titleId="approach-title">
          <p className="sx-lead">사업의 성격과 방문자의 목적을 먼저 살핍니다. 보기 좋은 화면을 넘어 다음 행동으로 이어지는 구조를 설계합니다.</p>
        </SectionHead>
        <div className="process" data-steps>
          <div className="process__side">
            <BuildPreview steps={PROCESS_STEPS} />
          </div>
          <div className="process__track" ref={list}>
            <span className="process__rail" aria-hidden="true"><i /></span>
            <ol className="process__list">
            {PROCESS_STEPS.map((step) => (
              <li key={step.number} data-reveal>
                <span className="process__no">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <dl><div><dt>산출물</dt><dd>{step.output}</dd></div><div><dt>기간</dt><dd>{step.period}</dd></div></dl>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const list = useRef(null);
  useCountUp(list);
  usePointerVars(list, '.pricing > li');
  return (
    <section className="sx sx--pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="sx-inner">
        <SectionHead index="06" label="비용" title={<>대략의 기준을 먼저,<br />자세한 건 상담으로.</>} titleId="pricing-title">
          <p className="sx-lead">프로젝트마다 범위가 다르기 때문에 시작가로 안내합니다. 상담에서 필요한 것만 골라 정확한 견적을 드립니다.</p>
        </SectionHead>
        <ul className="pricing" ref={list}>
          {PRICING_PLANS.map((plan, index) => (
            <li key={plan.name} className={plan.featured ? 'is-featured' : ''} data-reveal style={{ '--d': `${index * 90}ms` }}>
              <div className="pricing__top">
                <h3>{plan.name}</h3>
                {plan.featured ? <span className="pricing__badge">가장 많이 선택</span> : null}
              </div>
              <p className="pricing__for">{plan.for}</p>
              <p className="pricing__price"><strong><span data-count={plan.price.replace(/,/g, '')} aria-hidden="true">{plan.price}</span><span className="sr-only">{plan.price}</span></strong><span>만원부터</span></p>
              <p className="pricing__period">제작 기간 {plan.period}</p>
              <ul className="pricing__items">{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className={`btn ${plan.featured ? 'btn--accent' : 'btn--line'}`} href="#contact" data-magnetic>이 구간으로 상담하기 <span className="btn__arrow" aria-hidden="true">→</span></a>
            </li>
          ))}
        </ul>
        <QuoteEstimator />
        <ul className="pricing__notes">{PRICING_NOTES.map((note) => <li key={note}>{note}</li>)}</ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="sx sx--faq" id="faq" aria-labelledby="faq-title">
      <div className="sx-inner faq">
        <SectionHead index="07" label="자주 묻는 질문" title={<>시작 전에<br />궁금한 것들.</>} titleId="faq-title" />
        <div className="faq__list">
          {FAQS.map(([question, answer]) => (
            <details key={question} data-reveal>
              <summary>{question}<span className="faq__icon" aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
