import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, Menu, X, Zap } from 'lucide-react';
import { usePageTitle } from '../_kit/siteContext.js';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { siteImage } from '../_kit/media.js';
import { useFonts, useMockForm, useReveal, useScrolled } from '../_kit/hooks.js';
import { CLASS_TYPES, COACHES, GOALS, GYM, IMAGES, NAV, PRICES, PROGRAMS, SCHEDULE, SLOTS, WORDS } from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Anton&display=swap',
];
const DAYS = ['월', '화', '수', '목', '금', '토'];
const won = (value) => value.toLocaleString('ko-KR');

// 스크롤 위치를 --sy로 넘겨 글자 띠가 스크롤에 따라 움직이게 합니다.
function useScrollVar(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const update = () => { frame = 0; el.style.setProperty('--sy', String(Math.round(window.scrollY))); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, [ref]);
}

// 심박수처럼 오르내리는 숫자
function Bpm() {
  const [bpm, setBpm] = useState(128);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setBpm((value) => Math.max(118, Math.min(146, value + Math.round(Math.random() * 8 - 4)))), 900);
    return () => window.clearInterval(timer);
  }, []);
  return <p className="ml-bpm" aria-hidden="true"><Zap size={16} /> <b>{bpm}</b> BPM</p>;
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`ml-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="ml-wrap ml-header__inner">
        <a href="#top" className="ml-logo" aria-label="무브랩 처음으로">MOVE<span>LAB</span></a>
        <nav className="ml-nav" aria-label="주 메뉴">{NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <a href="#trial" className="ml-btn ml-btn--sm ml-header__cta">무료 체험</a>
        <button type="button" className="ml-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="ml-drawer">
        <div className="ml-drawer__top"><span className="ml-logo">MOVE<span>LAB</span></span><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">{[...NAV, ['trial', '무료 체험']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={close}>{label}</a>)}</nav>
      </MenuDrawer>
    </header>
  );
}

function Schedule() {
  const [type, setType] = useState('all');
  const [now] = useState(() => new Date());
  const todayIndex = now.getDay() === 0 ? 1 : now.getDay();
  const [day, setDay] = useState(todayIndex);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  const list = SCHEDULE.filter((item) => item.day === day && (type === 'all' || item.type === type));
  return (
    <section className="ml-section" id="schedule" aria-labelledby="ml-schedule-title">
      <div className="ml-wrap">
        <div className="ml-head" data-reveal><p className="ml-kicker">02 / SCHEDULE</p><h2 id="ml-schedule-title">이번 주 시간표</h2></div>
        <div className="ml-filters">
          <div className="ml-days" role="group" aria-label="요일">
            {DAYS.map((name, index) => (
              <button key={name} type="button" aria-pressed={day === index + 1} onClick={() => setDay(index + 1)}>{name}{index + 1 === todayIndex ? <small>오늘</small> : null}</button>
            ))}
          </div>
          <div className="ml-types" role="group" aria-label="수업 종류">
            {CLASS_TYPES.map(([value, label]) => <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{label}</button>)}
          </div>
        </div>
        <ul className="ml-classes" aria-live="polite">
          {list.length ? list.map((item) => {
            const live = day === now.getDay() && minutes >= toMin(item.time) && minutes < toMin(item.end);
            const full = item.booked >= 4;
            return (
              <li key={`${item.day}-${item.time}`} className={`${live ? 'is-live ' : ''}${full ? 'is-full' : ''}`}>
                <p className="ml-classes__time">{item.time}<small>– {item.end}</small></p>
                <div><h3>{item.name}</h3><p>{item.coach} 코치 · {CLASS_TYPES.find(([value]) => value === item.type)[1]}</p></div>
                <p className="ml-classes__spots">{live ? <em>지금 진행 중</em> : full ? '마감' : `${4 - item.booked}자리 남음`}</p>
                <span className="ml-classes__bar" aria-hidden="true">{[0, 1, 2, 3].map((seat) => <i key={seat} className={seat < item.booked ? 'is-on' : ''} />)}</span>
              </li>
            );
          }) : <li className="ml-classes__empty">이 날에는 해당 수업이 없어요. 다른 요일을 확인해 보세요.</li>}
        </ul>
      </div>
    </section>
  );
}

function Trial() {
  const [initial] = useState({ goal: '', slot: '', name: '', phone: '', agree: false });
  const validate = useCallback((values) => ({
    goal: values.goal ? '' : '목표를 골라 주세요.',
    slot: values.slot ? '' : '운동하기 편한 시간을 골라 주세요.',
    name: values.name.trim() ? '' : '이름을 입력해 주세요.',
    phone: /^01[0-9]-?\d{3,4}-?\d{4}$/.test(values.phone.trim()) ? '' : '휴대폰 번호를 확인해 주세요.',
    agree: values.agree ? '' : '개인정보 수집에 동의해 주세요.',
  }), []);
  const { values, errors, status, update, setValue, submit, reset, formRef } = useMockForm(initial, validate);
  return (
    <section className="ml-trial" id="trial" aria-labelledby="ml-trial-title">
      <div className="ml-wrap ml-trial__grid">
        <div data-reveal>
          <p className="ml-kicker ml-kicker--dark">05 / FREE TRIAL</p>
          <h2 id="ml-trial-title">첫 50분은<br />무료입니다.</h2>
          <p>체성분 검사, 움직임 테스트, 맛보기 운동까지. 등록을 권하지 않는 것이 원칙입니다.</p>
        </div>
        {status === 'done' ? (
          <div className="ml-trial__done" role="status">
            <p className="ml-trial__big">SEE YOU<br />AT THE LAB.</p>
            <p>{values.name}님, {values.slot} 시간대로 체험 신청을 정리했어요.</p>
            <p className="ml-fine">※ 시안이므로 실제로 접수되거나 연락이 가지 않습니다.</p>
            <button type="button" className="ml-btn ml-btn--dark" onClick={reset}>다시 작성</button>
          </div>
        ) : (
          <form ref={formRef} className="ml-form" noValidate onSubmit={submit}>
            <fieldset>
              <legend>운동 목표</legend>
              <div className="ml-chips">{GOALS.map((goal) => <button key={goal} type="button" name="goal" aria-pressed={values.goal === goal} onClick={() => setValue('goal', goal)}>{goal}</button>)}</div>
              {errors.goal ? <p className="ml-error">{errors.goal}</p> : null}
            </fieldset>
            <fieldset>
              <legend>편한 시간</legend>
              <div className="ml-chips">{SLOTS.map((slot) => <button key={slot} type="button" name="slot" aria-pressed={values.slot === slot} onClick={() => setValue('slot', slot)}>{slot}</button>)}</div>
              {errors.slot ? <p className="ml-error">{errors.slot}</p> : null}
            </fieldset>
            <div className="ml-form__row">
              <label>이름<input name="name" value={values.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} /></label>
              <label>휴대폰<input name="phone" inputMode="tel" placeholder="010-0000-0000" value={values.phone} onChange={update} autoComplete="tel" aria-invalid={Boolean(errors.phone)} /></label>
            </div>
            {errors.name || errors.phone ? <p className="ml-error">{errors.name || errors.phone}</p> : null}
            <label className="ml-agree"><input type="checkbox" name="agree" checked={values.agree} onChange={update} aria-invalid={Boolean(errors.agree)} />체험 안내를 위한 개인정보 수집·이용에 동의합니다.</label>
            {errors.agree ? <p className="ml-error">{errors.agree}</p> : null}
            <button type="submit" className="ml-btn ml-btn--dark ml-btn--full" disabled={status === 'pending'}>{status === 'pending' ? '확인 중…' : '무료 체험 신청'} <ArrowRight size={20} aria-hidden="true" /></button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Site() {
  useFonts(FONTS);
  usePageTitle(`${GYM.english} — 움직이면 달라진다`);
  const root = useReveal([]);
  const strip = useRef(null);
  useScrollVar(strip);
  return (
    <div className="ml" ref={root} id="top">
      <Header />
      <main id="site-main" tabIndex={-1}>
        <section className={`ml-hero${IMAGES.hero ? ' has-photo' : ''}`}>
          {IMAGES.hero ? <img className="ml-hero__bg" src={siteImage('movelab', IMAGES.hero)} alt="" fetchPriority="high" /> : null}
          <svg className="ml-ecg" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 110 H300 L330 110 L350 60 L370 160 L395 20 L420 180 L440 110 H700 L725 110 L745 70 L765 150 L790 40 L815 170 L835 110 H1200" />
          </svg>
          <div className="ml-wrap ml-hero__grid">
            <div>
              <Bpm />
              <h1><span>움직이면</span><span className="ml-hero__accent">달라진다.</span></h1>
              <p className="ml-hero__lead">혼자서는 작심삼일이던 운동, 코치와 함께라면 12주가 됩니다. 마포 합정역 5분, 새벽 6시부터 문을 엽니다.</p>
              <div className="ml-hero__actions">
                <a href="#trial" className="ml-btn">무료 체험 신청 <ArrowDownRight size={20} aria-hidden="true" /></a>
                <a href="#schedule" className="ml-btn ml-btn--line">시간표 보기</a>
              </div>
            </div>
            <div className="ml-hero__graphic" aria-hidden="true">
              <span className="ml-stat"><b>1:1</b>퍼스널 트레이닝</span>
              <span className="ml-stat"><b>4</b>명 이하 소그룹</span>
              <span className="ml-stat"><b>06</b>시 오픈</span>
              <i className="ml-stripes" />
            </div>
          </div>
        </section>

        <div className="ml-strip" ref={strip} aria-hidden="true">
          <p className="ml-strip__row">{[...WORDS.top, ...WORDS.top].map((word, index) => <span key={index}>{word}</span>)}</p>
          <p className="ml-strip__row ml-strip__row--rev">{[...WORDS.bottom, ...WORDS.bottom].map((word, index) => <span key={index}>{word}</span>)}</p>
        </div>

        <section className="ml-section" id="programs" aria-labelledby="ml-programs-title">
          <div className="ml-wrap">
            <div className="ml-head" data-reveal><p className="ml-kicker">01 / PROGRAMS</p><h2 id="ml-programs-title">목표마다 다른 네 가지 프로그램</h2></div>
            <ul className="ml-programs">
              {PROGRAMS.map((program, index) => (
                <li key={program.no} data-reveal style={{ '--d': `${index * 80}ms` }}>
                  <p className="ml-programs__no">{program.no}</p>
                  <p className="ml-programs__en">{program.english}</p>
                  <h3>{program.title}</h3>
                  <p>{program.text}</p>
                  <p className="ml-programs__tags">{program.tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
                  <p className="ml-intensity" aria-label={`강도 5단계 중 ${program.intensity}`}>강도 {[1, 2, 3, 4, 5].map((step) => <i key={step} className={step <= program.intensity ? 'is-on' : ''} />)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {IMAGES.gallery.length ? (
          <section className="ml-gallery" aria-label="무브랩 스튜디오 사진">
            {IMAGES.gallery.map(([file, label, alt], index) => (
              <figure key={file} className={`ml-gallery__item ml-gallery__item--${index + 1}`} data-reveal style={{ '--d': `${index * 70}ms` }}>
                <img src={siteImage('movelab', file)} alt={alt} loading="lazy" decoding="async" />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </section>
        ) : null}

        <Schedule />

        <section className="ml-section ml-section--alt" id="coaches" aria-labelledby="ml-coaches-title">
          <div className="ml-wrap">
            <div className="ml-head" data-reveal><p className="ml-kicker">03 / COACHES</p><h2 id="ml-coaches-title">당신 옆에 설 코치들</h2></div>
            <div className="ml-coaches">
              {COACHES.map((coach, index) => (
                <article key={coach.name} data-reveal style={{ '--d': `${index * 100}ms` }}>
                  <p className="ml-coaches__letters" aria-hidden="true">{coach.letters}</p>
                  <p className="ml-coaches__role">{coach.role}</p>
                  <h3>{coach.name}</h3>
                  <p className="ml-coaches__line">“{coach.line}”</p>
                  <p className="ml-programs__tags">{coach.focus.map((tag) => <span key={tag}>{tag}</span>)}</p>
                </article>
              ))}
            </div>
            <p className="ml-fine">표시된 코치는 가상 인물입니다.</p>
          </div>
        </section>

        <section className="ml-section" id="pricing" aria-labelledby="ml-pricing-title">
          <div className="ml-wrap">
            <div className="ml-head" data-reveal><p className="ml-kicker">04 / PRICING</p><h2 id="ml-pricing-title">숨김 없는 가격</h2></div>
            <ul className="ml-prices">
              {PRICES.map((price, index) => (
                <li key={price.name} className={price.featured ? 'is-featured' : ''} data-reveal style={{ '--d': `${index * 80}ms` }}>
                  <p className="ml-prices__note">{price.note}</p>
                  <h3>{price.name}</h3>
                  <p className="ml-prices__total"><b>{won(price.total)}</b>원</p>
                  <p className="ml-prices__per">{price.per ? `회당 ${won(price.per)}원` : '월 12회 수업'}</p>
                </li>
              ))}
            </ul>
            <p className="ml-fine">부가세 포함 · 3개월 이상 등록 시 개인 락커 무료 · 환불은 체육시설법 기준에 따릅니다.</p>
          </div>
        </section>

        <Trial />
      </main>
      <footer className="ml-footer">
        <div className="ml-wrap ml-footer__inner">
          <p className="ml-logo">MOVE<span>LAB</span></p>
          <p>{GYM.address} · {GYM.hours} · {GYM.phone}</p>
          <p>© 2026 {GYM.name}. 나나웹이 제작한 가상 업체 시안입니다. 사업자등록번호 000-00-00000 · 사진은 AI로 생성한 이미지입니다.</p>
        </div>
      </footer>
    </div>
  );
}
