import { useCallback, useState } from 'react';
import { ArrowRight, CalendarDays, Check, FileText, HardDrive, History, Lock, Mail, Menu, MessageSquare, Server, ShieldCheck, Sparkles, Webhook, X, Zap } from 'lucide-react';
import { usePageTitle } from '../_kit/siteContext.js';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { useFonts, useMockForm, useReveal, useScrolled } from '../_kit/hooks.js';
import { BOARD, FAQS, FEATURES, INTEGRATIONS, NAV, PLANS, PRODUCT, SECURITY, STEPS, TEAMS } from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap',
];
const ICONS = { Mail, CalendarDays, MessageSquare, HardDrive, FileText, Webhook, Lock, ShieldCheck, History, Server };
const won = (value) => value.toLocaleString('ko-KR');

function Logo() {
  return <a href="#top" className="fd-logo" aria-label="FlowDeck 처음으로"><span aria-hidden="true"><i /><i /><i /></span>FlowDeck</a>;
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`fd-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="fd-wrap fd-header__inner">
        <Logo />
        <nav className="fd-nav" aria-label="주 메뉴">{NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <div className="fd-header__actions">
          <a href="#signup" className="fd-link">로그인</a>
          <a href="#signup" className="fd-btn fd-btn--primary fd-btn--sm">무료로 시작</a>
        </div>
        <button type="button" className="fd-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="fd-drawer">
        <div className="fd-drawer__top"><Logo /><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">{NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={close}>{label}</a>)}</nav>
        <a href="#signup" className="fd-btn fd-btn--primary" onClick={close}>무료로 시작</a>
      </MenuDrawer>
    </header>
  );
}

// 코드로 그린 제품 화면 (카드가 요청 → 진행 → 완료로 흘러가는 애니메이션)
function BoardMock() {
  const columns = [['todo', '요청', 3], ['doing', '진행 중', 2], ['done', '완료', 2]];
  return (
    <div className="fd-app" aria-hidden="true">
      <div className="fd-app__bar"><i /><i /><i /><span>flowdeck.app / 마케팅 요청 보드</span></div>
      <div className="fd-app__body">
        <aside className="fd-app__side">
          <b>워크스페이스</b>
          {['전체 요청', '마케팅', '디자인', '운영'].map((item, index) => <span key={item} className={index === 1 ? 'is-on' : ''}>{item}</span>)}
          <b>자동화</b><span>규칙 6개 실행 중</span>
        </aside>
        <div className="fd-app__board">
          {columns.map(([key, label, count]) => (
            <div className="fd-col" key={key}>
              <p className="fd-col__head">{label}<em>{count}</em></p>
              {BOARD[key].map(([title, team, flag]) => (
                <div className={`fd-card${flag ? ' is-urgent' : ''}`} key={title}>
                  <span className="fd-card__team">{team}</span>
                  <p>{title}</p>
                  <span className="fd-card__meta"><i />{flag ? '긴급' : '이번 주'}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="fd-flycard"><span className="fd-card__team">CS</span><p>환불 문의 답변</p><span className="fd-card__meta"><i />자동 배정됨</span></div>
        </div>
      </div>
      <div className="fd-toast"><Zap size={14} /> 규칙 실행 · 긴급 태그 → 김리더에게 배정</div>
    </div>
  );
}

function RulesMock() {
  return (
    <div className="fd-screen fd-rules" aria-hidden="true">
      <p className="fd-screen__title">새 규칙</p>
      <div className="fd-rule"><em>언제</em><span>요청에 <b>긴급</b> 태그가 붙으면</span></div>
      <div className="fd-rule"><em>그리고</em><span>팀이 <b>고객지원</b>이면</span></div>
      <div className="fd-rule fd-rule--do"><em>그러면</em><span><b>팀 리더</b>에게 배정하고 <b>메신저</b>로 알림</span></div>
      <p className="fd-rules__log"><Check size={14} /> 지난 7일 동안 42번 실행됨</p>
    </div>
  );
}

function ReportMock() {
  const bars = [62, 48, 70, 40, 34, 28, 22];
  return (
    <div className="fd-screen fd-report" aria-hidden="true">
      <p className="fd-screen__title">주간 리포트 · 평균 처리 시간</p>
      <div className="fd-report__kpis"><div><small>이번 주 처리</small><b>128건</b></div><div><small>평균 처리</small><b>5.2시간</b></div><div><small>밀린 요청</small><b>7건</b></div></div>
      <div className="fd-bars">{bars.map((height, index) => <i key={index} style={{ '--h': `${height}%`, '--d': `${index * 70}ms` }} />)}</div>
      <p className="fd-report__axis"><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span></p>
    </div>
  );
}

function Features() {
  const [active, setActive] = useState(FEATURES[0].id);
  const feature = FEATURES.find((item) => item.id === active);
  const onKey = (event) => {
    const index = FEATURES.findIndex((item) => item.id === active);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const next = FEATURES[(index + (event.key === 'ArrowRight' ? 1 : FEATURES.length - 1)) % FEATURES.length];
      setActive(next.id);
      document.getElementById(`fd-tab-${next.id}`)?.focus();
    }
  };
  return (
    <section className="fd-section" id="features" aria-labelledby="fd-features-title">
      <div className="fd-wrap">
        <div className="fd-head" data-reveal>
          <p className="fd-kicker">기능</p>
          <h2 id="fd-features-title">요청이 들어와서 끝날 때까지,<br />필요한 건 세 가지면 충분합니다.</h2>
        </div>
        <div className="fd-tabs" role="tablist" aria-label="주요 기능" onKeyDown={onKey}>
          {FEATURES.map((item) => (
            <button key={item.id} id={`fd-tab-${item.id}`} role="tab" type="button" aria-selected={active === item.id} aria-controls="fd-tabpanel" tabIndex={active === item.id ? 0 : -1} onClick={() => setActive(item.id)}>{item.label}</button>
          ))}
        </div>
        <div className="fd-feature" id="fd-tabpanel" role="tabpanel" aria-labelledby={`fd-tab-${feature.id}`} key={feature.id}>
          <div className="fd-feature__text">
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
            <ul>{feature.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
          </div>
          <div className="fd-feature__visual">
            {feature.id === 'board' ? <BoardMock /> : feature.id === 'rules' ? <RulesMock /> : <ReportMock />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section className="fd-section" id="pricing" aria-labelledby="fd-pricing-title">
      <div className="fd-wrap">
        <div className="fd-head fd-head--center" data-reveal>
          <p className="fd-kicker">요금제</p>
          <h2 id="fd-pricing-title">팀이 커지는 만큼만.</h2>
          <div className="fd-toggle" role="group" aria-label="결제 주기">
            <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>월간 결제</button>
            <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>연간 결제 <em>2개월 무료</em></button>
          </div>
        </div>
        <div className="fd-plans">
          {PLANS.map((plan, index) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <article key={plan.name} className={`fd-plan${plan.featured ? ' is-featured' : ''}`} data-reveal style={{ '--d': `${index * 90}ms` }}>
                {plan.featured ? <span className="fd-plan__badge"><Sparkles size={14} aria-hidden="true" /> 가장 많이 선택</span> : null}
                <h3>{plan.name}</h3>
                <p className="fd-plan__desc">{plan.desc}</p>
                <p className="fd-plan__price" aria-live="polite"><b>{price ? `₩${won(price)}` : '₩0'}</b><span>{plan.unit}</span></p>
                <p className="fd-plan__note">{price && yearly ? `연 ₩${won(price * 12)} 청구` : price ? '매월 청구' : '카드 등록 없음'}</p>
                <a href="#signup" className={`fd-btn ${plan.featured ? 'fd-btn--primary' : 'fd-btn--line'}`}>{plan.cta}</a>
                <ul>{plan.features.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Signup({ id = 'signup' }) {
  const validate = useCallback((values) => ({ email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? '' : '업무용 이메일 주소를 확인해 주세요.' }), []);
  const [initial] = useState({ email: '' });
  const { values, errors, status, update, submit, formRef } = useMockForm(initial, validate);
  if (status === 'done') {
    return <p className="fd-signup__done" role="status"><Check size={18} aria-hidden="true" /> {values.email} 로 시작 링크를 보냈다고 가정한 화면입니다. (시안이라 실제 메일은 발송되지 않습니다)</p>;
  }
  return (
    <form ref={formRef} className="fd-signup" id={id} noValidate onSubmit={submit}>
      <label className="sr-only" htmlFor={`${id}-email`}>업무용 이메일</label>
      <input id={`${id}-email`} name="email" type="email" placeholder="업무용 이메일 주소" value={values.email} onChange={update} aria-invalid={Boolean(errors.email)} aria-describedby={`${id}-err`} autoComplete="email" />
      <button type="submit" className="fd-btn fd-btn--primary" disabled={status === 'pending'}>{status === 'pending' ? '확인 중…' : '14일 무료 체험'} <ArrowRight size={16} aria-hidden="true" /></button>
      {errors.email ? <p className="fd-signup__err" id={`${id}-err`}>{errors.email}</p> : null}
    </form>
  );
}

export default function Site() {
  useFonts(FONTS);
  usePageTitle(`${PRODUCT.name} — ${PRODUCT.tagline}`);
  const root = useReveal([]);
  return (
    <div className="fd" ref={root} id="top">
      <Header />
      <main id="site-main" tabIndex={-1}>
        <section className="fd-hero">
          <div className="fd-hero__glow" aria-hidden="true" />
          <div className="fd-wrap fd-hero__inner">
            <p className="fd-pill"><Sparkles size={14} aria-hidden="true" /> {PRODUCT.badge}</p>
            <h1>흩어진 요청을<br /><span>하나의 흐름으로.</span></h1>
            <p className="fd-hero__lead">{PRODUCT.lead}</p>
            <Signup id="signup" />
            <p className="fd-hero__note">카드 등록 없이 시작 · 5명까지 영구 무료</p>
          </div>
          <div className="fd-wrap fd-hero__product"><BoardMock /></div>
        </section>

        <section className="fd-teams" aria-label="플로우덱을 쓰는 팀 유형">
          <p>요청이 많은 모든 팀을 위해</p>
          <div className="fd-teams__track">{[...TEAMS, ...TEAMS].map((team, index) => <span key={`${team}-${index}`} aria-hidden={index >= TEAMS.length}>{team}</span>)}</div>
        </section>

        <section className="fd-section fd-compare" aria-labelledby="fd-compare-title">
          <div className="fd-wrap">
            <div className="fd-head" data-reveal>
              <p className="fd-kicker">왜 플로우덱인가요</p>
              <h2 id="fd-compare-title">요청은 늘었는데,<br />일하는 방식은 그대로라면.</h2>
            </div>
            <div className="fd-compare__grid">
              <div className="fd-compare__before" data-reveal>
                <p className="fd-compare__label">지금</p>
                <ul><li>메신저 대화 속에 묻힌 요청</li><li>메일함에서 다시 찾는 첨부파일</li><li>누가 하는지 모르는 스프레드시트</li><li>회의 때마다 새로 만드는 현황표</li></ul>
              </div>
              <div className="fd-compare__after" data-reveal style={{ '--d': '120ms' }}>
                <p className="fd-compare__label">플로우덱 이후</p>
                <ul><li>들어오는 즉시 카드로 정리</li><li>요청과 파일, 대화가 한곳에</li><li>규칙이 담당자를 자동 배정</li><li>매주 월요일 자동 리포트</li></ul>
              </div>
            </div>
          </div>
        </section>

        <Features />

        <section className="fd-section" id="how" aria-labelledby="fd-how-title">
          <div className="fd-wrap">
            <div className="fd-head" data-reveal>
              <p className="fd-kicker">사용 흐름</p>
              <h2 id="fd-how-title">설정은 한 번, 흐름은 계속.</h2>
            </div>
            <ol className="fd-steps">
              {STEPS.map(([title, text, code], index) => (
                <li key={title} data-reveal style={{ '--d': `${index * 100}ms` }}>
                  <span className="fd-steps__no">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <code>{code}</code>
                </li>
              ))}
            </ol>
            <div className="fd-integrations" data-reveal>
              <p>이미 쓰는 도구와 연결됩니다</p>
              <ul>{INTEGRATIONS.map(([icon, label]) => { const Icon = ICONS[icon]; return <li key={label}><Icon size={22} aria-hidden="true" />{label}</li>; })}</ul>
            </div>
          </div>
        </section>

        <Pricing />

        <section className="fd-section" aria-labelledby="fd-security-title">
          <div className="fd-wrap fd-security">
            <div className="fd-head" data-reveal>
              <p className="fd-kicker">보안</p>
              <h2 id="fd-security-title">팀의 데이터는<br />팀의 것입니다.</h2>
            </div>
            <ul>{SECURITY.map(([icon, title, text], index) => { const Icon = ICONS[icon]; return <li key={title} data-reveal style={{ '--d': `${index * 70}ms` }}><Icon size={22} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>; })}</ul>
          </div>
        </section>

        <section className="fd-section" id="faq" aria-labelledby="fd-faq-title">
          <div className="fd-wrap fd-faq">
            <div className="fd-head" data-reveal><p className="fd-kicker">FAQ</p><h2 id="fd-faq-title">자주 묻는 질문</h2></div>
            <div>{FAQS.map(([question, answer]) => <details key={question} data-reveal><summary>{question}</summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="fd-final" aria-labelledby="fd-final-title">
          <div className="fd-wrap fd-final__inner" data-reveal>
            <h2 id="fd-final-title">다음 주 월요일 회의는<br />리포트 한 장으로.</h2>
            <Signup id="signup-bottom" />
          </div>
        </section>
      </main>
      <footer className="fd-footer">
        <div className="fd-wrap fd-footer__inner">
          <Logo />
          <p>© 2026 FlowDeck (가상 서비스). 나나웹이 제작한 시안이며 실제 서비스가 아닙니다.</p>
        </div>
      </footer>
    </div>
  );
}
