import { useEffect, useRef, useState } from 'react';
import { stripBasePath, withBasePath } from '../lib/appPaths.js';
import { PROJECTS, parseFilters, filterProjects, recommendProjects, labelFor } from './data/projects.js';
import { ProjectGrid } from './components/ProjectGrid.jsx';
import { ProjectFinderCTA } from './components/ProjectFinderCTA.jsx';
import { FilterPanel } from './components/FilterPanel.jsx';
import { Hero3D } from './hero/Hero3D.jsx';
import { SiteHud } from './sections/SiteHud.jsx';
import { QuoteFab } from './sections/QuoteFab.jsx';
import { Audience, CapabilityTicker, Faq, Pricing, Process, QualitySpec, Services, WorkSection } from './sections/HomeSections.jsx';
import { useReveal } from './sections/useReveal.js';
import { useMagnetic, usePageProgress } from './sections/effects.js';
import { AGENCY_CONFIG } from './data/agencyConfig.js';
import ContactSection from './ContactSection.jsx';
import { PrivacyPolicy } from './PrivacyPolicy.jsx';
import './editorial.css';
import './components/finder.css';
import './agency-shell.css';
import './studio-shell.css';

const readLocation = () => ({ path: stripBasePath(location.pathname).replace(/\/$/, '') || '/', search: location.search });
const GROUPS = ['budget', 'industry', 'style'];
function projectIdFromPath(path) {
  try { return decodeURIComponent(path.slice('/projects/'.length)); }
  catch { return ''; }
}

function Header() {
  return <header className="site-header"><a className="wordmark" href={withBasePath('/')} aria-label="나나웹 홈">나나웹</a><nav className="site-nav" aria-label="주요 메뉴"><a className="nav-link" href={withBasePath('/projects')}>프로젝트</a><a className="nav-link nav-link--wide" href={withBasePath('/#services')}>서비스</a><a className="nav-link nav-link--wide" href={withBasePath('/#approach')}>과정</a><a className="nav-link nav-link--wide" href={withBasePath('/#pricing')}>비용</a><a className="nav-link nav-link--wide" href={withBasePath('/#faq')}>FAQ</a><a className="nav-cta" href={withBasePath('/#contact')} data-magnetic>프로젝트 문의</a></nav><span className="scroll-progress" aria-hidden="true" /></header>;
}

function Contact() {
  return <ContactSection />;
}

// 푸터의 큰 브랜드명: 화면에 들어오면 글자가 차례로 솟아오르고, 커서가 가까운 글자가 살짝 들립니다.
function FooterWord({ text }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    el.classList.add('is-armed');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('is-in'); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    const letters = [...el.children];
    const onMove = (event) => {
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2)) / rect.width;
        letter.style.setProperty('--lift', Math.max(0, 1 - distance * 1.3).toFixed(3));
      });
    };
    const onLeave = () => letters.forEach((letter) => letter.style.setProperty('--lift', '0'));
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      observer.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return <div ref={ref} className="studio-footer__word" aria-hidden="true">{[...text].map((letter, index) => <span key={`${letter}-${index}`} style={{ '--i': index }}>{letter}</span>)}</div>;
}

function Footer() {
  const { brandName, companyName, contact, business } = AGENCY_CONFIG;
  return <footer className="site-footer studio-footer" id="site-footer">
    <div className="studio-footer__top"><p className="studio-footer__cta">다음 웹사이트,<br />함께 만들어 볼까요?</p><a className="btn btn--accent" href={withBasePath('/#contact')} data-magnetic>프로젝트 문의하기 <span className="btn__arrow" aria-hidden="true">→</span></a></div>
    <div className="studio-footer__grid">
      <div><h3>메뉴</h3><ul><li><a href={withBasePath('/projects')}>프로젝트</a></li><li><a href={withBasePath('/#services')}>서비스</a></li><li><a href={withBasePath('/#pricing')}>비용</a></li><li><a href={withBasePath('/#faq')}>자주 묻는 질문</a></li></ul></div>
      <div><h3>연락처</h3><ul><li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>{contact.phone ? <li><a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a></li> : null}{contact.kakao ? <li>{contact.kakao}</li> : null}<li>{contact.hours}</li></ul></div>
      <div><h3>사업자 정보</h3><ul><li>상호 {companyName}</li><li>사업자등록번호 {business.registration}</li></ul></div>
    </div>
    <FooterWord text={brandName} />
    <div className="studio-footer__bottom"><span>© {new Date().getFullYear()} {companyName} · {brandName} · 웹사이트 기획·디자인·개발</span><a className="studio-footer__privacy" href={withBasePath('/privacy')}>개인정보 처리방침</a><a href="#top">맨 위로 ↑</a></div>
  </footer>;
}


function Home({ onOpen }) {
  useReveal();
  return <><Hero3D />
    <SiteHud />
    <QuoteFab />
    <CapabilityTicker />
    <ProjectFinderCTA onOpen={onOpen} />
    <WorkSection projects={PROJECTS.slice(0, 6)} />
    <Services />
    <Audience />
    <QualitySpec />
    <Process />
    <Pricing />
    <Faq />
    <Contact /></>;
}

function Results({ filters, onOpen }) {
  const hasFilters = GROUPS.some(key => filters[key]);
  const matches = filterProjects(filters);
  const recommendations = matches.length ? [] : recommendProjects(filters, 3);
  return <><section className="results-intro"><div className="eyebrow">웹사이트 찾기</div><h1>우리 사업에 맞는<br />웹사이트를 찾아보세요.</h1><p>예산, 업종, 원하는 분위기를 기준으로 제작 사례를 살펴봅니다.</p></section><div className="search-bar"><div className="search-summary" aria-label="현재 검색 조건">{GROUPS.map(key => <span key={key}>{labelFor(key, filters[key]) || ({budget:'모든 예산',industry:'모든 업종',style:'모든 스타일'})[key]}</span>)}</div><button className="outline-button" onClick={event => onOpen(event.currentTarget)}>조건 변경</button></div>
      {matches.length ? <><p className="result-count mono">{hasFilters ? '검색 결과' : '전체 사례'} / {String(matches.length).padStart(2, '0')}</p><ProjectGrid projects={matches} /></> : <><div className="empty-state"><h2>정확히 일치하는 사례는 없지만,<br />아래 사례를 추천합니다.</h2><p>{recommendations.length ? '선택하신 업종 또는 스타일이 같은 사례입니다. 예산과 제작 범위를 함께 확인해 주세요.' : '현재는 비슷한 업종이나 스타일의 예시도 준비되어 있지 않습니다. 조건을 바꾸거나 상담 준비 항목을 살펴보세요.'}</p><a className="outline-button" href="#contact">상담으로 맞춤 제안 받기 ↗</a></div><ProjectGrid projects={recommendations} /></>}
      <p className="section-note">모든 사례는 가상 프로젝트입니다. 예산은 예시이며 실제 견적은 제작 범위에 따라 달라집니다.</p><Contact /></>;
}

function Detail({ id }) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) return <section className="not-found"><div className="eyebrow">사례를 찾을 수 없습니다</div><h1>찾으시는 사례가 없습니다.</h1><p>주소를 확인하거나 다른 제작 사례를 살펴보세요.</p><a className="text-link" href={withBasePath('/projects')}>프로젝트 목록으로 ↗</a></section>;
  return <><section className="detail-top"><a className="text-link" href={withBasePath(`/projects${location.search}`)}>← 프로젝트 목록</a><div className="detail-heading"><div><div className="eyebrow">웹사이트 상세</div><h1 className="detail-title">{project.title}</h1></div><p>{project.summary}</p></div><img className="detail-cover" src={project.thumbnail} alt={`${project.title} 웹사이트 첫 화면`} /></section><a className="sample-open" href={withBasePath(project.siteUrl)}>웹사이트 직접 보기 ↗</a><p className="section-note">실제로 작동하는 시안 사이트가 새로 열립니다. 메뉴, 예약·문의 흐름까지 직접 눌러 보세요.</p><section className="detail-body"><dl><dt>업종</dt><dd>{labelFor('industry', project.industry)}</dd><dt>분위기</dt><dd>{project.meta.split(' / ')[1]}</dd><dt>형식</dt><dd>{project.meta.split(' / ')[2]}</dd><dt>제작 구간</dt><dd>{labelFor('budget', project.budgetRange)}</dd><dt>구분</dt><dd>가상 업체 / 디자인·개발 시안</dd></dl><div><h2>업종에 맞는 구조와 분위기.</h2><p>{project.summary} 첫 화면부터 문의·예약까지 이어지는 흐름을 설계하고, PC와 모바일에서 모두 확인했습니다.</p><div className="detail-web" aria-label="웹사이트 상세 시안"><div className="detail-web-header"><span>{project.title}</span><span>{project.meta.split(' / ')[2]}</span></div><img src={project.thumbnail} alt={`${project.title} 웹사이트 화면`} loading="lazy" /><p className="section-note">데스크톱 · 모바일 대응</p></div></div></section><Contact /></>;
}

export default function EditorialApp() {
  usePageProgress();
  useMagnetic();
  const [route, setRoute] = useState(readLocation);
  const [finderTrigger, setFinderTrigger] = useState(null);
  const resultFocus = useRef(null);
  const filters = parseFilters(route.search);
  const isResults = route.path === '/projects';
  const isDetail = route.path.startsWith('/projects/');
  const isPrivacy = route.path === '/privacy';
  useEffect(() => {
    const onPop = () => { setFinderTrigger(null); setRoute(readLocation()); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.title = isPrivacy ? '개인정보 처리방침 — 나나웹' : isResults ? '제작 사례 찾기 — 나나웹' : isDetail ? '프로젝트 상세 — 나나웹' : '나나웹 — 홈페이지 제작';
    document.querySelector('meta[name="description"]')?.setAttribute('content', '브랜드의 이야기를 정돈하는 웹사이트 디자인과 개발. 예산, 업종, 스타일에 맞는 제작 사례를 살펴보세요.');
  }, [isResults, isDetail, isPrivacy, route.path]);
  function submit(selection) {
    const params = new URLSearchParams();
    GROUPS.forEach(key => params.set(key, selection[key]));
    window.history.pushState({}, '', withBasePath(`/projects?${params}`));
    setFinderTrigger(null);
    setRoute(readLocation());
    window.scrollTo(0, 0);
    // A result navigation moves focus to the new page, unlike cancel/close.
    setTimeout(() => resultFocus.current?.focus({ preventScroll: true }), 50);
  }
  return <><a className="skip-link" href="#main">본문으로 이동</a><div className="wrap" id="top"><Header /><main id="main" tabIndex={-1} ref={resultFocus}>{isPrivacy ? <PrivacyPolicy /> : isDetail ? <Detail id={projectIdFromPath(route.path)} /> : isResults ? <Results filters={filters} onOpen={setFinderTrigger} /> : <Home onOpen={setFinderTrigger} />}</main><Footer /></div>{finderTrigger ? <FilterPanel selection={filters} trigger={finderTrigger} onClose={() => setFinderTrigger(null)} onSubmit={submit} /> : null}</>;
}
