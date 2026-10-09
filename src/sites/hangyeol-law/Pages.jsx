import { useMemo, useState } from 'react';
import { ArrowRight, Briefcase, Building2, CalendarClock, Check, ChevronRight, HeartHandshake, MapPin, Phone, RotateCcw, Scale, ScrollText, ShieldAlert, TrainFront, Car, Video, Users } from 'lucide-react';
import { Link } from '../_kit/SiteProvider.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { dateAfter, useMockForm } from '../_kit/hooks.js';
import { AREAS, ARTICLES, CASES, DEADLINES, FACTS, FINDER_STATES, FIRM, HISTORY, LAWYERS, LAWYER_PHOTOS, NOTICES, OFFICE_FAQS, PHOTOS, PRINCIPLES, PROCESS } from './content.js';

const ICONS = { Scale, Building2, HeartHandshake, ScrollText, ShieldAlert, Briefcase };
const lawyerById = (id) => LAWYERS.find((item) => item.id === id);

function AreaIcon({ name, size = 22 }) {
  const Icon = ICONS[name] || Scale;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}

function Photo({ name, className = '', eager = false }) {
  const { src, alt } = resolvePhoto('hangyeol-law', PHOTOS[name]);
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

function PageHero({ crumbs = [], title, lead, photo = 'library' }) {
  return (
    <section className="hg-pagehero">
      <Photo name={photo} className="hg-pagehero__bg" eager />
      <div className="hg-wrap hg-pagehero__inner">
        <nav className="hg-crumbs" aria-label="현재 위치">
          <Link to="">홈</Link>
          {crumbs.map(([to, label]) => <span key={label}><ChevronRight size={14} aria-hidden="true" />{to ? <Link to={to}>{label}</Link> : <b aria-current="page">{label}</b>}</span>)}
        </nav>
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="hg-sectitle" data-reveal>
      <div>
        <p className="hg-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function LawyerPhoto({ lawyer }) {
  const { src, alt } = resolvePhoto('hangyeol-law', LAWYER_PHOTOS[lawyer.photo]);
  return src ? <img className="hg-lawyer__photo" src={src} alt={alt} loading="lazy" decoding="async" /> : <div className="hg-lawyer__mono" aria-hidden="true">{lawyer.initial}</div>;
}

function LawyerCard({ lawyer, compact = false }) {
  return (
    <article className={`hg-lawyer${compact ? ' is-compact' : ''}`} data-reveal>
      <LawyerPhoto lawyer={lawyer} />
      <div>
        <p className="hg-lawyer__role">{lawyer.role}</p>
        <h3>{lawyer.name}</h3>
        <p className="hg-lawyer__areas">{lawyer.areas.join(' · ')}</p>
        {!compact ? (
          <>
            <blockquote>“{lawyer.message}”</blockquote>
            <ul>{lawyer.career.map((line) => <li key={line}>{line}</li>)}</ul>
          </>
        ) : null}
      </div>
    </article>
  );
}

function CtaBand() {
  return (
    <section className="hg-ctaband">
      <Photo name="consult" className="hg-ctaband__bg" />
      <div className="hg-wrap hg-ctaband__inner" data-reveal>
        <div>
          <p className="hg-eyebrow hg-eyebrow--light">첫 상담 안내</p>
          <h2>혼자 고민하지 마시고,<br />먼저 상황을 들려주세요.</h2>
        </div>
        <div className="hg-ctaband__actions">
          <Link to="contact" className="hg-btn hg-btn--brass">온라인 상담 예약 <ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="hg-btn hg-btn--ghost" href={`tel:${FIRM.phone.replace(/-/g, '')}`}><Phone size={18} aria-hidden="true" /> {FIRM.phone}</a>
        </div>
      </div>
    </section>
  );
}

// 진단 결과로 고른 분야를 상담 예약 화면에서 미리 선택해 둡니다. (저장이 막힌 환경에서도 화면은 정상 동작)
const PICK_KEY = 'hg-pick-area';
const savePick = (slug) => { try { window.sessionStorage.setItem(PICK_KEY, slug); } catch { /* 저장 불가 시 무시 */ } };
const readPick = () => { try { return window.sessionStorage.getItem(PICK_KEY) || ''; } catch { return ''; } };

// 대표 연출 ①: 내 상황 진단 — 분야와 급한 정도를 고르면 분야·담당 변호사·준비 자료·예약 링크를 보여 줍니다.
function CaseFinder() {
  const [areaSlug, setAreaSlug] = useState('');
  const [stateId, setStateId] = useState('');
  const area = AREAS.find((item) => item.slug === areaSlug);
  const state = FINDER_STATES.find((item) => item.id === stateId);
  const step = !area ? 1 : !state ? 2 : 3;
  const reset = () => { setAreaSlug(''); setStateId(''); };
  return (
    <div className="hg-finder" data-reveal>
      <div className="hg-finder__head">
        <p className="hg-eyebrow">내 상황 진단</p>
        <h2>어느 분야 상담이 필요한지,<br />두 번의 선택으로 알려 드려요.</h2>
        <ol className="hg-finder__steps" aria-label="진행 단계">
          {[1, 2, 3].map((n) => <li key={n} className={n === step ? 'is-on' : n < step ? 'is-done' : ''}>{n === 3 ? '결과' : `${n}단계`}</li>)}
        </ol>
      </div>
      <div className="hg-finder__body" aria-live="polite">
        {step === 1 ? (
          <>
            <h3>1. 어떤 일로 고민하고 계신가요?</h3>
            <div className="hg-finder__opts">
              {AREAS.map((item) => (
                <button key={item.slug} type="button" onClick={() => setAreaSlug(item.slug)}><AreaIcon name={item.icon} size={22} /><b>{item.title}</b><span>{item.cases[0]}</span></button>
              ))}
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h3>2. 지금 상황은 어디쯤인가요? <small>선택: {area.title}</small></h3>
            <div className="hg-finder__opts hg-finder__opts--col">
              {FINDER_STATES.map((item) => <button key={item.id} type="button" className={`is-${item.tone}`} onClick={() => setStateId(item.id)}><b>{item.label}</b></button>)}
            </div>
            <button type="button" className="hg-finder__back" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> 처음부터</button>
          </>
        ) : null}
        {step === 3 ? (
          <div className="hg-finder__result">
            <p className={`hg-finder__tag is-${state.tone}`}>{state.tone === 'urgent' ? '서둘러 상담하세요' : state.tone === 'soon' ? '이번 주 안에 상담하세요' : '편하게 예약하세요'}</p>
            <h3>{area.title} 상담을 권해 드려요</h3>
            <p>{state.message}</p>
            <div className="hg-finder__cols">
              <div>
                <b>담당 변호사</b>
                <ul className="hg-finder__lawyers">
                  {area.lawyers.map((id) => { const lawyer = lawyerById(id); return <li key={id}><LawyerPhoto lawyer={lawyer} /><span>{lawyer.name}<small>{lawyer.role}</small></span></li>; })}
                </ul>
              </div>
              <div>
                <b>상담 전 준비하면 좋은 자료</b>
                <ul className="hg-finder__docs">{area.documents.map((doc) => <li key={doc}><Check size={14} aria-hidden="true" />{doc}</li>)}</ul>
              </div>
            </div>
            <div className="hg-finder__actions">
              <Link to="contact" className="hg-btn hg-btn--navy" onClick={() => savePick(area.slug)}>{area.title}로 상담 예약 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to={`practice/${area.slug}`} className="hg-textlink">분야 자세히 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
              <button type="button" className="hg-finder__back" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> 다시 진단</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// 대표 연출 ②: 기한 계산기 — 날짜를 넣으면 법에서 정한 기한을 달력에 표시합니다. (참고용)
const parseDate = (value) => new Date(`${value}T00:00:00`);
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const formatDate = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
function addMonths(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), last));
  return target;
}
const daysBetween = (from, to) => Math.round((to - from) / 86400000);

function DeadlineResult({ rule, base }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (rule.kind === 'after') {
    const end = addMonths(base, rule.months);
    const left = daysBetween(today, end);
    const tone = left < 0 ? 'late' : left <= 14 ? 'soon' : 'ok';
    return (
      <div className={`hg-deadline__result is-${tone}`}>
        <p className="hg-deadline__label">{rule.rule}</p>
        <p className="hg-deadline__date">{formatDate(end)}</p>
        <p className="hg-deadline__status">{left < 0 ? `기한이 ${-left}일 지났을 수 있습니다. 예외가 있을 수 있으니 바로 상담하세요.` : left === 0 ? '오늘이 마지막 날일 수 있습니다. 지금 전화 주세요.' : `남은 기간 약 ${left}일`}</p>
      </div>
    );
  }
  const from = addMonths(base, -rule.fromMonths);
  const to = addMonths(base, -rule.toMonths);
  const state = today < from ? 'before' : today <= to ? 'in' : 'late';
  return (
    <div className={`hg-deadline__result is-${state === 'in' ? 'soon' : state === 'late' ? 'late' : 'ok'}`}>
      <p className="hg-deadline__label">{rule.rule}</p>
      <p className="hg-deadline__date">{formatDate(from)} ~ {formatDate(to)}</p>
      <p className="hg-deadline__status">{state === 'before' ? `요구 가능 기간 시작까지 약 ${daysBetween(today, from)}일` : state === 'in' ? `지금이 요구 가능한 기간입니다. 마감까지 약 ${daysBetween(today, to)}일` : '요구 가능한 기간이 지났을 수 있습니다. 상담으로 확인하세요.'}</p>
    </div>
  );
}

function DeadlineTool({ initial = DEADLINES[0].id }) {
  const [ruleId, setRuleId] = useState(initial);
  const [value, setValue] = useState('');
  const rule = DEADLINES.find((item) => item.id === ruleId);
  const base = value ? parseDate(value) : null;
  const valid = base && !Number.isNaN(base.getTime());
  return (
    <div className="hg-deadline" data-reveal>
      <div className="hg-deadline__intro">
        <p className="hg-eyebrow"><CalendarClock size={16} aria-hidden="true" /> 기한 계산기</p>
        <h2>놓치면 되돌리기 어려운<br />기한을 먼저 확인하세요.</h2>
        <p>날짜 하나만 넣으면 법에서 정한 기한을 달력으로 보여 드립니다. 참고용이며, 말일이 공휴일이면 다음 날까지로 보는 등 예외가 있어 정확한 날짜는 상담에서 확인합니다.</p>
      </div>
      <div className="hg-deadline__panel">
        <div className="hg-tabs" role="group" aria-label="기한 종류">
          {DEADLINES.map((item) => <button key={item.id} type="button" aria-pressed={ruleId === item.id} onClick={() => setRuleId(item.id)}>{item.label}</button>)}
        </div>
        <label>{rule.inputLabel}
          <input type="date" value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        {valid ? <DeadlineResult rule={rule} base={base} /> : <p className="hg-deadline__empty">날짜를 고르면 결과가 여기에 나타납니다.</p>}
        <p className="hg-deadline__note">{rule.note}</p>
        <Link to="contact" className="hg-btn hg-btn--navy" onClick={() => savePick(ruleId === 'renewal' ? 'real-estate' : 'inheritance')}>이 기한으로 상담 예약 <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}

function CaseCard({ item }) {
  const area = AREAS.find((entry) => entry.slug === item.area);
  return (
    <article className="hg-case" data-reveal>
      <p className="hg-case__meta"><span>{area.title}</span><b>{item.period}</b></p>
      <h3>{item.title}</h3>
      <dl>
        <div><dt>상황</dt><dd>{item.situation}</dd></div>
        <div><dt>진행</dt><dd>{item.process}</dd></div>
        <div><dt>결과</dt><dd>{item.result}</dd></div>
      </dl>
    </article>
  );
}

function CaseNotice() {
  return <p className="hg-case-note">※ 가상의 사례를 익명으로 요약한 것입니다. 사건마다 사정이 달라 같은 결과를 보장하지 않습니다.</p>;
}

function FaqList({ items = OFFICE_FAQS }) {
  return (
    <div className="hg-faq">
      {items.map(([question, answer]) => <details key={question} data-reveal><summary>{question}</summary><p>{answer}</p></details>)}
    </div>
  );
}

function NoticeRow({ notice }) {
  return (
    <li data-reveal>
      <Link to={`notice/${notice.id}`}>
        <span className="hg-notice__tag">{notice.tag}</span>
        <div><b>{notice.title}</b><p>{notice.summary}</p></div>
        <time>{notice.date}</time>
      </Link>
    </li>
  );
}

const SLOTS = [['화', '14:30 · 16:30'], ['목', '10:00 · 13:30'], ['토', '10:00 (화상)']];

export function HomePage() {
  return (
    <>
      <section className="hg-hero">
        <div className="hg-hero__panel">
          <div className="hg-hero__copy">
            <p className="hg-eyebrow hg-eyebrow--light">서초동 · 2014년 개소</p>
            <h1>복잡한 문제일수록,<br />원칙대로 풀어갑니다.</h1>
            <p className="hg-hero__lead">한결은 첫 상담부터 변호사가 직접 듣고, 비용과 기간을 먼저 말씀드립니다. 개인과 중소기업의 민사·가사·형사 사건을 끝까지 함께합니다.</p>
            <div className="hg-hero__actions">
              <Link to="contact" className="hg-btn hg-btn--brass">상담 예약하기 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="practice" className="hg-btn hg-btn--ghost">업무 분야 보기</Link>
            </div>
          </div>
          <ul className="hg-hero__ways" aria-label="상담 방식">
            <li><Users size={18} aria-hidden="true" /><b>방문 상담</b><span>서초동 사무소</span></li>
            <li><Phone size={18} aria-hidden="true" /><b>전화 상담</b><span>예약 시간 연결</span></li>
            <li><Video size={18} aria-hidden="true" /><b>화상 상담</b><span>지방·해외 거주</span></li>
          </ul>
        </div>
        <div className="hg-hero__photo">
          <Photo name="hero" eager />
          <aside className="hg-hero__card" aria-label="이번 주 상담 가능 시간">
            <p className="hg-hero__card-label"><span aria-hidden="true" /> 이번 주 상담 가능 시간</p>
            <ul>{SLOTS.map(([day, time]) => <li key={day}><b>{day}</b>{time}</li>)}</ul>
            <Link to="contact" className="hg-hero__card-link">시간 골라 예약하기 <ArrowRight size={14} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="hg-quick" aria-labelledby="hg-quick-title">
        <div className="hg-wrap">
          <h2 id="hg-quick-title" className="sr-only">분야별 바로가기</h2>
          <ul className="hg-quick__grid">
            {AREAS.map((area, index) => (
              <li key={area.slug} data-reveal style={{ '--d': `${index * 60}ms` }}>
                <Link to={`practice/${area.slug}`}>
                  <AreaIcon name={area.icon} size={26} />
                  <b>{area.title}</b>
                  <ArrowRight size={16} aria-hidden="true" className="hg-quick__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hg-section hg-section--tint">
        <div className="hg-wrap">
          <CaseFinder />
          <p className="hg-finder__teaser"><CalendarClock size={16} aria-hidden="true" /> 상속·전세처럼 기한이 정해진 일인가요? <Link to="insights#deadline" className="hg-textlink">기한 계산기로 날짜 확인하기 <ArrowRight size={14} aria-hidden="true" /></Link></p>
        </div>
      </section>

      <section className="hg-section">
        <div className="hg-wrap">
          <SectionTitle eyebrow="한결의 원칙" title={<>결과만큼 과정도<br />분명해야 합니다.</>} />
          <ol className="hg-principles">
            {PRINCIPLES.map(([number, title, text], index) => (
              <li key={number} data-reveal style={{ '--d': `${index * 90}ms` }}>
                <span className="hg-serif-num">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <dl className="hg-facts-inline" aria-label="한결 법률사무소 소개 숫자">
            {FACTS.map(([value, label]) => <div key={label} data-reveal><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="hg-section hg-section--tint">
        <div className="hg-wrap">
          <SectionTitle eyebrow="구성원" title="사건마다 전담 변호사가 배정됩니다." action={<Link to="people" className="hg-textlink">구성원 전체 보기 <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <div className="hg-people-preview">
            {LAWYERS.slice(0, 3).map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} compact />)}
          </div>
        </div>
      </section>

      <section className="hg-section">
        <div className="hg-wrap">
          <SectionTitle eyebrow="업무 사례" title="이런 일을 이렇게 풀어 왔습니다." action={<Link to="practice" className="hg-textlink">업무 분야 보기 <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <div className="hg-cases">{CASES.slice(0, 3).map((item) => <CaseCard key={item.id} item={item} />)}</div>
          <CaseNotice />
        </div>
      </section>

      <section className="hg-section hg-office">
        <div className="hg-wrap hg-office__grid">
          <div className="hg-office__copy" data-reveal>
            <p className="hg-eyebrow">사무소 둘러보기</p>
            <h2>편하게 이야기할 수 있는<br />공간을 만들었습니다.</h2>
            <p>첫 상담이 이뤄지는 상담실은 외부 소리가 들리지 않게 방음했고, 대기 라운지는 다른 의뢰인과 마주치지 않도록 동선을 나눴습니다.</p>
            <Link to="about" className="hg-textlink">사무소 소개 <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="hg-office__photos" data-reveal>
            <Photo name="reception" /><Photo name="consultRoom" /><Photo name="partner" />
          </div>
        </div>
      </section>

      <section className="hg-section">
        <div className="hg-wrap">
          <SectionTitle eyebrow="상담 절차" title="예약부터 방향 안내까지 네 단계." />
          <ol className="hg-steps">
            {PROCESS.map(([title, text], index) => (
              <li key={title} data-reveal style={{ '--d': `${index * 80}ms` }}>
                <span>STEP {String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hg-section">
        <div className="hg-wrap">
          <SectionTitle eyebrow="법률 칼럼" title="알아 두면 덜 불안한 이야기." action={<Link to="insights" className="hg-textlink">칼럼 더 보기 <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <div className="hg-articles">
            {ARTICLES.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>

      <section className="hg-section hg-section--tint">
        <div className="hg-wrap hg-faqnotice">
          <div>
            <SectionTitle eyebrow="자주 묻는 질문" title="상담 전에 궁금하신 점" />
            <FaqList items={OFFICE_FAQS.slice(0, 5)} />
            <p className="hg-more"><Link to="contact#faq" className="hg-textlink">질문 더 보기 <ArrowRight size={16} aria-hidden="true" /></Link></p>
          </div>
          <div>
            <SectionTitle eyebrow="공지사항" title="사무소 소식" action={<Link to="notice" className="hg-textlink">전체 보기 <ArrowRight size={16} aria-hidden="true" /></Link>} />
            <ul className="hg-notices hg-notices--compact">{NOTICES.slice(0, 4).map((notice) => <NoticeRow key={notice.id} notice={notice} />)}</ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function ArticleCard({ article }) {
  return (
    <article className="hg-article-card" data-reveal>
      <Link to={`insights/${article.slug}`}>
        <p className="hg-article-card__meta"><span>{article.category}</span><time>{article.date}</time></p>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span className="hg-textlink">읽기 <ArrowRight size={16} aria-hidden="true" /></span>
      </Link>
    </article>
  );
}

export function AboutPage() {
  const owner = LAWYERS[0];
  return (
    <>
      <PageHero crumbs={[[null, '사무소 소개']]} title="사무소 소개" lead="서초동에서 12년, 의뢰인의 일상을 지키는 법률 파트너." photo="exterior" />
      <section className="hg-section">
        <div className="hg-wrap hg-greeting">
          <div data-reveal>
            <p className="hg-eyebrow">대표변호사 인사말</p>
            <h2>“한결같이, 처음 상담하던<br />그 마음으로 끝까지.”</h2>
          </div>
          <div className="hg-greeting__body" data-reveal>
            <p>법률 문제를 안고 사무소를 찾는 분들은 대부분 처음 겪는 일 앞에서 막막해하십니다. 한결은 그 막막함을 줄이는 것에서 일을 시작합니다.</p>
            <p>사건의 가능성과 한계를 솔직하게 말씀드리고, 비용과 일정을 미리 정리해 드립니다. 이기는 것만큼 의뢰인이 과정을 이해하고 납득하는 것이 중요하다고 믿기 때문입니다.</p>
            <p>2014년 작은 사무실에서 시작한 한결은 이제 여섯 명의 변호사가 함께합니다. 규모가 커져도 첫 상담은 변호사가 직접 한다는 원칙은 바꾸지 않겠습니다.</p>
            <p className="hg-sign">대표변호사 <b>{owner.name}</b></p>
          </div>
        </div>
      </section>
      <section className="hg-gallery" aria-label="사무소 사진">
        <div className="hg-wrap hg-gallery__grid">
          <Photo name="reception" /><Photo name="consultRoom" /><Photo name="lounge" /><Photo name="scales" />
        </div>
      </section>
      <section className="hg-section">
        <div className="hg-wrap hg-split">
          <SectionTitle eyebrow="연혁" title="한 걸음씩 넓혀 온 길." />
          <ol className="hg-timeline">
            {HISTORY.map(([year, text]) => <li key={year} data-reveal><span className="hg-serif-num">{year}</span><p>{text}</p></li>)}
          </ol>
        </div>
      </section>
      <section className="hg-section hg-section--tint" id="location">
        <div className="hg-wrap">
          <SectionTitle eyebrow="오시는 길" title="서초동 한결빌딩 9층" />
          <div className="hg-location">
            <div className="hg-map" role="img" aria-label="사무소 위치를 표현한 약도">
              <i className="r1" /><i className="r2" /><i className="r3" /><i className="r4" />
              <span className="hg-map__station">○○역</span>
              <span className="hg-map__pin"><MapPin size={22} aria-hidden="true" /> 한결빌딩</span>
            </div>
            <ul className="hg-location__info">
              <li><MapPin size={20} aria-hidden="true" /><div><b>주소</b><p>{FIRM.address}</p></div></li>
              <li><TrainFront size={20} aria-hidden="true" /><div><b>지하철</b><p>{FIRM.subway}</p></div></li>
              <li><Car size={20} aria-hidden="true" /><div><b>주차</b><p>{FIRM.parking}</p></div></li>
              <li><Phone size={20} aria-hidden="true" /><div><b>대표전화</b><p>{FIRM.phone} · {FIRM.hours}</p></div></li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function PracticePage() {
  return (
    <>
      <PageHero crumbs={[[null, '업무 분야']]} title="업무 분야" lead="개인과 중소기업이 가장 자주 마주하는 여섯 가지 분야에 집중합니다." photo="library" />
      <section className="hg-section">
        <div className="hg-wrap">
          <ul className="hg-arealist">
            {AREAS.map((area, index) => (
              <li key={area.slug} data-reveal>
                <Link to={`practice/${area.slug}`}>
                  <span className="hg-arealist__no">{String(index + 1).padStart(2, '0')}</span>
                  <span className="hg-arealist__icon"><AreaIcon name={area.icon} size={28} /></span>
                  <div>
                    <h2>{area.title}</h2>
                    <p>{area.summary}</p>
                    <ul>{area.cases.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <span className="hg-arealist__go">자세히 <ArrowRight size={18} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function AreaPage({ area }) {
  const others = AREAS.filter((item) => item.slug !== area.slug);
  const areaCases = CASES.filter((item) => item.area === area.slug);
  return (
    <>
      <PageHero crumbs={[['practice', '업무 분야'], [null, area.title]]} title={area.title} lead={area.summary} photo="consultRoom" />
      <section className="hg-section">
        <div className="hg-wrap hg-detail">
          <div className="hg-detail__main">
            <p className="hg-detail__intro" data-reveal>{area.intro}</p>
            <h2 className="hg-h2" data-reveal>이런 경우 상담하세요</h2>
            <ul className="hg-checks">{area.cases.map((item) => <li key={item} data-reveal><Check size={18} aria-hidden="true" />{item}</li>)}</ul>
            <h2 className="hg-h2" data-reveal>진행 절차</h2>
            <ol className="hg-flow">{area.steps.map((step, index) => <li key={step} data-reveal><span>{index + 1}</span>{step}</li>)}</ol>
            <h2 className="hg-h2" data-reveal>상담 전 준비하면 좋은 자료</h2>
            <ul className="hg-docs" data-reveal>{area.documents.map((item) => <li key={item}>{item}</li>)}</ul>
            <h2 className="hg-h2" data-reveal>자주 묻는 질문</h2>
            <FaqList items={area.faq} />
            {areaCases.length ? (
              <>
                <h2 className="hg-h2" data-reveal>이 분야의 업무 사례</h2>
                <div className="hg-cases hg-cases--one">{areaCases.map((item) => <CaseCard key={item.id} item={item} />)}</div>
                <CaseNotice />
              </>
            ) : null}
          </div>
          <aside className="hg-detail__aside">
            <div className="hg-aside-card hg-aside-card--navy">
              <p className="hg-eyebrow hg-eyebrow--light">{area.title} 상담</p>
              <p className="hg-aside-card__title">첫 상담 40분,<br />변호사가 직접 진행합니다.</p>
              <Link to="contact" className="hg-btn hg-btn--brass">상담 예약하기</Link>
              <a className="hg-aside-card__tel" href={`tel:${FIRM.phone.replace(/-/g, '')}`}><Phone size={16} aria-hidden="true" /> {FIRM.phone}</a>
            </div>
            <div className="hg-aside-card">
              <p className="hg-eyebrow">담당 변호사</p>
              {area.lawyers.map((id) => <LawyerCard key={id} lawyer={lawyerById(id)} compact />)}
            </div>
            <nav className="hg-aside-card" aria-label="다른 업무 분야">
              <p className="hg-eyebrow">다른 업무 분야</p>
              <ul className="hg-otherlinks">{others.map((item) => <li key={item.slug}><Link to={`practice/${item.slug}`}>{item.title}<ChevronRight size={16} aria-hidden="true" /></Link></li>)}</ul>
            </nav>
          </aside>
        </div>
      </section>
      {area.slug === 'inheritance' || area.slug === 'real-estate' ? (
        <section className="hg-section hg-section--tint">
          <div className="hg-wrap"><DeadlineTool initial={area.slug === 'real-estate' ? 'renewal' : 'renounce'} /></div>
        </section>
      ) : null}
    </>
  );
}

export function PeoplePage() {
  return (
    <>
      <PageHero crumbs={[[null, '구성원']]} title="구성원" lead="분야별 전담 변호사가 사건의 처음과 끝을 함께합니다. (표시된 인물은 가상 인물입니다)" photo="partner" />
      <section className="hg-section">
        <div className="hg-wrap hg-people">
          {LAWYERS.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function InsightsPage() {
  const categories = useMemo(() => ['전체', ...new Set(ARTICLES.map((item) => item.category))], []);
  const [active, setActive] = useState('전체');
  const list = active === '전체' ? ARTICLES : ARTICLES.filter((item) => item.category === active);
  return (
    <>
      <PageHero crumbs={[[null, '법률 칼럼']]} title="법률 칼럼" lead="자주 받는 질문을 변호사가 직접 정리했습니다." photo="scales" />
      <section className="hg-section hg-section--tint" id="deadline">
        <div className="hg-wrap"><DeadlineTool /></div>
      </section>
      <section className="hg-section">
        <div className="hg-wrap">
          <div className="hg-tabs" role="group" aria-label="칼럼 분류">
            {categories.map((category) => (
              <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>
            ))}
          </div>
          <p className="hg-count" aria-live="polite">{list.length}개의 글</p>
          <div className="hg-articles hg-articles--list">
            {list.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>
    </>
  );
}

export function ArticlePage({ article }) {
  const related = ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 2);
  return (
    <>
      <PageHero crumbs={[['insights', '법률 칼럼'], [null, article.category]]} title={article.title} lead={`${article.category} · ${article.date}`} photo="documents" />
      <section className="hg-section">
        <div className="hg-wrap hg-reading">
          <article>
            <p className="hg-reading__lead">{article.excerpt}</p>
            {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="hg-reading__note">이 글은 일반적인 정보를 정리한 것으로, 개별 사건에 대한 법률 자문이 아닙니다. 구체적인 판단은 상담을 통해 확인하세요.</p>
          </article>
          <aside>
            <p className="hg-eyebrow">함께 읽으면 좋은 글</p>
            {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
            <Link to="insights" className="hg-textlink">목록으로 <ArrowRight size={16} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

const TIMES = ['10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];
const METHODS = [['visit', '방문 상담'], ['phone', '전화 상담'], ['video', '화상 상담']];
const INITIAL = Object.freeze({ area: '', method: 'visit', date: '', time: '', name: '', phone: '', message: '', agree: false });

function validate(values) {
  return {
    area: values.area ? '' : '상담 분야를 선택해 주세요.',
    date: values.date ? '' : '희망 날짜를 선택해 주세요.',
    time: values.time ? '' : '희망 시간을 선택해 주세요.',
    name: values.name.trim() ? '' : '성함을 입력해 주세요.',
    phone: /^[0-9-]{9,13}$/.test(values.phone.trim()) ? '' : '연락처를 숫자와 - 로 입력해 주세요.',
    agree: values.agree ? '' : '개인정보 수집에 동의해 주세요.',
  };
}

function FieldError({ message, id }) {
  return message ? <p className="hg-error" id={id}>{message}</p> : null;
}

export function ContactPage() {
  const form = useMockForm({ ...INITIAL, area: readPick() }, validate);
  const { values, errors, status, update, submit, reset, formRef } = form;
  const areaLabel = AREAS.find((item) => item.slug === values.area)?.title;
  const methodLabel = METHODS.find(([value]) => value === values.method)?.[1];
  return (
    <>
      <PageHero crumbs={[[null, '상담 예약']]} title="상담 예약" lead="원하는 날짜와 방식을 선택하시면 담당 직원이 확인 연락을 드립니다." photo="consult" />
      <section className="hg-section">
        <div className="hg-wrap hg-contact">
          {status === 'done' ? (
            <div className="hg-done" role="status">
              <span className="hg-done__icon"><Check size={28} aria-hidden="true" /></span>
              <h2>상담 예약 요청이 정리되었습니다.</h2>
              <dl>
                <div><dt>분야</dt><dd>{areaLabel}</dd></div>
                <div><dt>방식</dt><dd>{methodLabel}</dd></div>
                <div><dt>희망 일시</dt><dd>{values.date} {values.time}</dd></div>
                <div><dt>성함</dt><dd>{values.name}</dd></div>
              </dl>
              <p className="hg-done__note">※ 이 사이트는 시안이므로 실제로 예약이 접수되거나 연락이 가지 않습니다.</p>
              <button type="button" className="hg-btn hg-btn--navy" onClick={reset}>다시 작성하기</button>
            </div>
          ) : (
            <form ref={formRef} className="hg-form" noValidate onSubmit={submit}>
              <fieldset>
                <legend>1. 상담 내용</legend>
                <label>상담 분야 <b aria-hidden="true">*</b>
                  <select name="area" value={values.area} onChange={update} aria-invalid={Boolean(errors.area)} aria-describedby="err-area">
                    <option value="">선택해 주세요</option>
                    {AREAS.map((area) => <option key={area.slug} value={area.slug}>{area.title}</option>)}
                  </select>
                </label>
                <FieldError id="err-area" message={errors.area} />
                <div className="hg-radios" role="radiogroup" aria-label="상담 방식">
                  {METHODS.map(([value, label]) => (
                    <label key={value} className={values.method === value ? 'is-on' : ''}>
                      <input type="radio" name="method" value={value} checked={values.method === value} onChange={update} />{label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>2. 희망 일시</legend>
                <div className="hg-row">
                  <label>날짜 <b aria-hidden="true">*</b>
                    <input type="date" name="date" min={dateAfter(1)} value={values.date} onChange={update} aria-invalid={Boolean(errors.date)} aria-describedby="err-date" />
                  </label>
                  <label>시간 <b aria-hidden="true">*</b>
                    <select name="time" value={values.time} onChange={update} aria-invalid={Boolean(errors.time)} aria-describedby="err-time">
                      <option value="">선택</option>
                      {TIMES.map((time) => <option key={time}>{time}</option>)}
                    </select>
                  </label>
                </div>
                <FieldError id="err-date" message={errors.date} />
                <FieldError id="err-time" message={errors.time} />
              </fieldset>
              <fieldset>
                <legend>3. 연락처</legend>
                <div className="hg-row">
                  <label>성함 <b aria-hidden="true">*</b><input name="name" value={values.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby="err-name" /></label>
                  <label>연락처 <b aria-hidden="true">*</b><input name="phone" inputMode="tel" placeholder="010-0000-0000" value={values.phone} onChange={update} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby="err-phone" /></label>
                </div>
                <FieldError id="err-name" message={errors.name} />
                <FieldError id="err-phone" message={errors.phone} />
                <label>상황 설명 (선택)<textarea name="message" rows={5} value={values.message} onChange={update} placeholder="간단한 경위와 궁금한 점을 적어 주세요. 민감한 내용은 상담 때 말씀하셔도 됩니다." /></label>
                <label className="hg-agree"><input type="checkbox" name="agree" checked={values.agree} onChange={update} aria-invalid={Boolean(errors.agree)} aria-describedby="err-agree" /><span>상담 예약을 위한 개인정보(성함, 연락처) 수집·이용에 동의합니다.</span></label>
                <FieldError id="err-agree" message={errors.agree} />
              </fieldset>
              <button type="submit" className="hg-btn hg-btn--navy hg-form__submit" disabled={status === 'pending'}>{status === 'pending' ? '확인 중…' : '상담 예약 요청'}</button>
            </form>
          )}
          <aside className="hg-contact__side">
            <div className="hg-aside-card hg-aside-card--navy">
              <p className="hg-eyebrow hg-eyebrow--light">전화 상담 예약</p>
              <a className="hg-bigtel" href={`tel:${FIRM.phone.replace(/-/g, '')}`}>{FIRM.phone}</a>
              <p>{FIRM.hours}<br />{FIRM.after}</p>
            </div>
            <div className="hg-aside-card">
              <p className="hg-eyebrow">오시는 길</p>
              <p>{FIRM.address}</p>
              <p className="hg-muted">{FIRM.subway}</p>
              <Link to="about#location" className="hg-textlink">약도 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="hg-section hg-section--tint" id="faq">
        <div className="hg-wrap hg-narrow">
          <SectionTitle eyebrow="자주 묻는 질문" title="상담 전에 궁금하신 점" />
          <FaqList />
        </div>
      </section>
    </>
  );
}

export function NoticePage() {
  return (
    <>
      <PageHero crumbs={[[null, '공지사항']]} title="공지사항" lead="휴무, 상담 시간, 세미나 등 사무소 소식을 알려 드립니다." photo="reception" />
      <section className="hg-section">
        <div className="hg-wrap hg-narrow">
          <ul className="hg-notices">{NOTICES.map((notice) => <NoticeRow key={notice.id} notice={notice} />)}</ul>
        </div>
      </section>
    </>
  );
}

export function NoticeDetailPage({ notice }) {
  const index = NOTICES.findIndex((item) => item.id === notice.id);
  const prev = NOTICES[index + 1];
  const next = NOTICES[index - 1];
  return (
    <>
      <PageHero crumbs={[['notice', '공지사항'], [null, notice.tag]]} title={notice.title} lead={`${notice.tag} · ${notice.date}`} photo="lounge" />
      <section className="hg-section">
        <div className="hg-wrap hg-narrow">
          <article className="hg-reading hg-reading--solo">
            {notice.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <nav className="hg-notice-nav" aria-label="이전·다음 공지">
            {next ? <Link to={`notice/${next.id}`}><small>다음 글</small>{next.title}</Link> : <span />}
            {prev ? <Link to={`notice/${prev.id}`}><small>이전 글</small>{prev.title}</Link> : <span />}
          </nav>
          <p className="hg-more"><Link to="notice" className="hg-textlink">목록으로 <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="hg-section">
      <div className="hg-wrap hg-notfound">
        <p className="hg-eyebrow">404</p>
        <h1>요청하신 페이지를 찾을 수 없습니다.</h1>
        <Link to="" className="hg-btn hg-btn--navy">홈으로</Link>
      </div>
    </section>
  );
}
