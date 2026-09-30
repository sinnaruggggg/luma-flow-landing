import { useCallback, useState } from 'react';
import { ArrowRight, Check, Menu, RotateCcw, Sparkles, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { SitePhoto } from '../_kit/SitePhoto.jsx';
import { dateAfter, useFonts, useMockForm, useReveal, useScrolled } from '../_kit/hooks.js';
import { ACADEMY, ALL_PHOTO_KEYS, FINDER, LEVELS, NAV, PHOTOS, PROMISES, READY_IMAGES, SCHEDULE, TEACHERS } from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  'https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap',
];

function Photo({ name, className = '', eager = false }) {
  return <SitePhoto siteId="saebom-english" value={PHOTOS[name]} ready={READY_IMAGES} className={className} eager={eager} />;
}

function Logo() {
  return <Link to="" className="sb-logo" aria-label={`${ACADEMY.name} 홈`}><span aria-hidden="true">🌱</span>{ACADEMY.name}</Link>;
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`sb-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="sb-wrap sb-header__inner">
        <Logo />
        <nav className="sb-nav" aria-label="주 메뉴">{NAV.slice(0, 3).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
        <Link to="test" className="sb-btn sb-btn--sm sb-header__cta">무료 레벨테스트</Link>
        <button type="button" className="sb-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="sb-drawer">
        <div className="sb-drawer__top"><Logo /><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴"><Link to="" onClick={close}>홈</Link>{NAV.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}</Link>)}</nav>
      </MenuDrawer>
    </header>
  );
}

function recommend(answers) {
  const grade = Number(answers.grade);
  const score = Number(answers.exp) + ({ no: 0, some: 1, yes: 3 })[answers.read];
  if (grade >= 5) return score >= 4 ? 'tree' : 'branch';
  if (grade >= 3) return score >= 3 ? 'branch' : 'leaf';
  return score >= 2 ? 'leaf' : 'sprout';
}

function LevelFinder() {
  const [answers, setAnswers] = useState({});
  const step = FINDER.findIndex((item) => !answers[item.id]);
  const level = step === -1 ? LEVELS.find((item) => item.id === recommend(answers)) : null;
  return (
    <div className="sb-finder" aria-live="polite">
      {!level ? (
        <div key={FINDER[step].id} className="sb-finder__q">
          <p className="sb-finder__count">{step + 1} / {FINDER.length}</p>
          <h3>{FINDER[step].question}</h3>
          <div className="sb-finder__opts">
            {FINDER[step].options.map(([value, label]) => (
              <button key={value} type="button" onClick={() => setAnswers((current) => ({ ...current, [FINDER[step].id]: value }))}>{label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`sb-finder__result sb-tone--${level.color}`}>
          <p className="sb-finder__count"><Sparkles size={16} aria-hidden="true" /> 추천 반</p>
          <h3>{level.name} <small>{level.grade}</small></h3>
          <p>{level.title} — {level.text}</p>
          <div className="sb-finder__actions">
            <Link to="test" className="sb-btn">레벨테스트로 확인하기</Link>
            <button type="button" className="sb-textbtn" onClick={() => setAnswers({})}><RotateCcw size={16} aria-hidden="true" /> 다시 하기</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Wave({ flip = false }) {
  return <svg className={`sb-wave${flip ? ' is-flip' : ''}`} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C 240 70 480 -10 720 30 S 1200 70 1440 30 V60 H0Z" /></svg>;
}

function HomePage() {
  return (
    <>
      <section className="sb-hero">
        <div className="sb-wrap sb-hero__grid">
          <div className="sb-hero__text">
            <p className="sb-sticker">초등 1–6학년 · 한 반 6명</p>
            <h1>영어가 <mark>재밌는</mark> 아이는<br />멈추지 않아요.</h1>
            <p>그림책과 노래, 친구와의 대화로 배우는 새봄영어. 아이의 속도에 맞춰 한 걸음씩 자랍니다.</p>
            <div className="sb-hero__actions">
              <Link to="test" className="sb-btn">무료 레벨테스트 신청 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="programs" className="sb-btn sb-btn--line">프로그램 보기</Link>
            </div>
          </div>
          <div className="sb-hero__media">
            <span className="sb-blob sb-blob--a" aria-hidden="true" /><span className="sb-blob sb-blob--b" aria-hidden="true" />
            <Photo name="hero" className="sb-hero__img" eager />
            <p className="sb-bubble" aria-hidden="true">Hello! 👋</p>
          </div>
        </div>
      </section>
      <Wave />
      <section className="sb-section sb-section--mint">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">3가지 질문</p><h2>우리 아이에게 맞는 반은?</h2></div>
          <LevelFinder />
        </div>
      </section>
      <Wave flip />
      <section className="sb-section">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">새봄영어의 약속</p><h2>작은 반, 꼼꼼한 관심.</h2></div>
          <ul className="sb-promises">
            {PROMISES.map(([title, text], index) => <li key={title} data-reveal style={{ '--d': `${index * 90}ms` }}><b>{title}</b><p>{text}</p></li>)}
          </ul>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap sb-split">
          <Photo name="reading" className="sb-split__img" />
          <div data-reveal>
            <p className="sb-kicker">수업 방식</p>
            <h2>읽고, 말하고,<br />직접 만들어 봐요.</h2>
            <ul className="sb-checks">
              <li><Check size={18} aria-hidden="true" />매 수업 그림책 한 권 함께 읽기</li>
              <li><Check size={18} aria-hidden="true" />짝과 역할극으로 말하기 연습</li>
              <li><Check size={18} aria-hidden="true" />한 달에 한 번 나만의 미니북 만들기</li>
            </ul>
            <Link to="programs" className="sb-textbtn">반별 커리큘럼 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className="sb-cta">
        <div className="sb-wrap sb-cta__inner" data-reveal>
          <h2>첫 상담과 레벨테스트는 무료예요.</h2>
          <p>30분이면 충분해요. 결과지와 추천 반을 바로 알려 드립니다.</p>
          <Link to="test" className="sb-btn sb-btn--white">신청하러 가기</Link>
        </div>
      </section>
    </>
  );
}

function PageTop({ kicker, title, lead }) {
  return (
    <section className="sb-pagetop">
      <div className="sb-wrap"><p className="sb-kicker">{kicker}</p><h1>{title}</h1>{lead ? <p>{lead}</p> : null}</div>
    </section>
  );
}

function ProgramsPage() {
  const [open, setOpen] = useState(LEVELS[0].id);
  return (
    <>
      <PageTop kicker="프로그램" title="아이의 속도에 맞춘 네 개의 반" lead="레벨테스트 결과와 학년을 함께 보고 반을 정해요. 중간에 반을 옮길 수도 있어요." />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-levels">
          {LEVELS.map((level) => (
            <article key={level.id} className={`sb-level sb-tone--${level.color}${open === level.id ? ' is-open' : ''}`} data-reveal>
              <button type="button" aria-expanded={open === level.id} onClick={() => setOpen(open === level.id ? '' : level.id)}>
                <span className="sb-level__name">{level.name}</span><span className="sb-level__grade">{level.grade}</span><span className="sb-level__title">{level.title}</span>
              </button>
              {open === level.id ? (
                <div className="sb-level__body">
                  <p>{level.text}</p>
                  <ul>{level.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                  <p className="sb-level__time">수업 시간: {SCHEDULE[level.id].map(([days, time]) => `${days} ${time}`).join(' / ')}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-gallery">
          <Photo name="blocks" /><Photo name="corner" /><Photo name="desk" />
        </div>
      </section>
    </>
  );
}

function TeachersPage() {
  return (
    <>
      <PageTop kicker="선생님" title="아이 이름을 먼저 불러 주는 선생님들" lead="표시된 선생님은 가상 인물입니다." />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-teachers">
          {TEACHERS.map((teacher, index) => (
            <article key={teacher.name} className={`sb-teacher sb-tone--${teacher.color}`} data-reveal style={{ '--d': `${index * 90}ms` }}>
              <span className="sb-teacher__face" aria-hidden="true">{teacher.initial}</span>
              <h2>{teacher.name}</h2>
              <p className="sb-teacher__role">{teacher.role}</p>
              <p className="sb-teacher__line">“{teacher.line}”</p>
              <ul>{teacher.career.map((line) => <li key={line}>{line}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SchedulePage() {
  const [tab, setTab] = useState(LEVELS[0].id);
  const level = LEVELS.find((item) => item.id === tab);
  return (
    <>
      <PageTop kicker="시간표" title="반별 수업 시간" lead={ACADEMY.hours} />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap">
          <div className="sb-tabs" role="tablist" aria-label="반 선택">
            {LEVELS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={`sb-tone--${item.color}`} onClick={() => setTab(item.id)}>{item.name}<small>{item.grade}</small></button>)}
          </div>
          <div className={`sb-timetable sb-tone--${level.color}`} role="tabpanel" key={tab}>
            {SCHEDULE[tab].map(([days, time]) => <div key={days}><b>{days}</b><span>{time}</span></div>)}
          </div>
          <p className="sb-fine">방학 특강과 보강 일정은 학부모 알림장으로 따로 안내합니다.</p>
        </div>
      </section>
    </>
  );
}

const INITIAL = Object.freeze({ child: '', grade: '', date: '', parent: '', phone: '', agree: false });

function TestPage() {
  const validate = useCallback((values) => ({
    child: values.child.trim() ? '' : '아이 이름을 입력해 주세요.',
    grade: values.grade ? '' : '학년을 선택해 주세요.',
    date: values.date ? '' : '희망 날짜를 선택해 주세요.',
    parent: values.parent.trim() ? '' : '보호자 성함을 입력해 주세요.',
    phone: /^01[0-9]-?\d{3,4}-?\d{4}$/.test(values.phone.trim()) ? '' : '휴대폰 번호를 확인해 주세요.',
    agree: values.agree ? '' : '개인정보 수집에 동의해 주세요.',
  }), []);
  const { values, errors, status, update, submit, reset, formRef } = useMockForm(INITIAL, validate);
  return (
    <>
      <PageTop kicker="무료 레벨테스트" title="30분이면 우리 아이 반을 알 수 있어요" lead="말하기·듣기·읽기를 가볍게 확인하고, 결과지와 함께 상담해 드려요." />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-testwrap">
          {status === 'done' ? (
            <div className="sb-done" role="status">
              <span aria-hidden="true">🎉</span>
              <h2>{values.child} 어린이의 레벨테스트 신청이 정리됐어요!</h2>
              <p>{values.date} · 담당 선생님이 확인 문자를 보낸다고 가정한 화면이에요.</p>
              <p className="sb-fine">※ 시안이므로 실제로 접수되지 않습니다.</p>
              <button type="button" className="sb-btn sb-btn--line" onClick={reset}>다시 작성하기</button>
            </div>
          ) : (
            <form ref={formRef} className="sb-form" noValidate onSubmit={submit}>
              <div className="sb-form__row">
                <label>아이 이름<input name="child" value={values.child} onChange={update} aria-invalid={Boolean(errors.child)} /></label>
                <label>학년
                  <select name="grade" value={values.grade} onChange={update} aria-invalid={Boolean(errors.grade)}>
                    <option value="">선택</option>{[1, 2, 3, 4, 5, 6].map((grade) => <option key={grade} value={`${grade}학년`}>초등 {grade}학년</option>)}
                  </select>
                </label>
              </div>
              <label>희망 날짜<input type="date" name="date" min={dateAfter(1)} value={values.date} onChange={update} aria-invalid={Boolean(errors.date)} /></label>
              <div className="sb-form__row">
                <label>보호자 성함<input name="parent" value={values.parent} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.parent)} /></label>
                <label>휴대폰 번호<input name="phone" inputMode="tel" placeholder="010-0000-0000" value={values.phone} onChange={update} autoComplete="tel" aria-invalid={Boolean(errors.phone)} /></label>
              </div>
              <label className="sb-agree"><input type="checkbox" name="agree" checked={values.agree} onChange={update} aria-invalid={Boolean(errors.agree)} />상담을 위한 개인정보 수집·이용에 동의합니다.</label>
              {Object.values(errors).some(Boolean) ? <p className="sb-error" role="alert">{Object.values(errors).find(Boolean)}</p> : null}
              <button type="submit" className="sb-btn sb-btn--full" disabled={status === 'pending'}>{status === 'pending' ? '확인 중…' : '레벨테스트 신청하기'}</button>
            </form>
          )}
          <aside className="sb-info">
            <h2>찾아오시는 길</h2>
            <p>{ACADEMY.address}</p>
            <p>{ACADEMY.hours}</p>
            <p className="sb-info__tel">{ACADEMY.phone}</p>
          </aside>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return <PageTop kicker="404" title="앗, 페이지를 찾을 수 없어요." />;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title) => ({ Page, title: `${title} — ${ACADEMY.name}` });
  if (slug) return make(NotFoundPage, '페이지를 찾을 수 없습니다');
  if (!section) return { Page: HomePage, title: `${ACADEMY.name} — 초등 영어, 재밌어야 멈추지 않아요` };
  if (section === 'programs') return make(ProgramsPage, '프로그램');
  if (section === 'teachers') return make(TeachersPage, '선생님');
  if (section === 'schedule') return make(SchedulePage, '시간표');
  if (section === 'test') return make(TestPage, '무료 레벨테스트');
  return make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  return (
    <div className="sb" ref={root}>
      <Header />
      <main id="site-main" tabIndex={-1}><Page key={page} /></main>
      <footer className="sb-footer">
        <div className="sb-wrap sb-footer__inner">
          <Logo />
          <p>{ACADEMY.address} · {ACADEMY.phone} · 학원등록번호 제0000-00호 · 교습과목 외국어(영어)</p>
          <p>© 2026 {ACADEMY.name}. 나나웹이 제작한 가상 학원 시안입니다.</p>
          <PhotoCredits keys={ALL_PHOTO_KEYS} extra="" />
        </div>
      </footer>
    </div>
  );
}
