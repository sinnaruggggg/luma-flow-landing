import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, Car, Check, Clock, MapPin, Menu, Phone, Play, RotateCcw, Sparkles, Square, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { SitePhoto } from '../_kit/SitePhoto.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { dateAfter, useFonts, useMockForm, useReveal, useScrolled } from '../_kit/hooks.js';
import {
  ACADEMY, ALL_PHOTO_KEYS, CLASS_DAY, FAQS, FINDER, HISTORY, LEGAL, LEVELS, NAV, NOTICES, PHOTOS, PROMISES,
  READY_IMAGES, REPORT, REVIEWS, SCHEDULE, STATS, TEACHERS, WORD_PAIRS,
} from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap',
];
const MAIN_NAV = NAV.filter(([to]) => to !== 'test');

function Photo({ name, className = '', eager = false }) {
  return <SitePhoto siteId="saebom-english" value={PHOTOS[name]} ready={READY_IMAGES} className={className} eager={eager} />;
}

// 선생님 사진. 사진 파일이 아직 없으면 이니셜 원으로 보입니다.
function Portrait({ name, initial, className = '' }) {
  const { src, alt } = resolvePhoto('saebom-english', PHOTOS[name], READY_IMAGES);
  if (src) return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" />;
  return <span className={`${className} sb-portrait-fallback`} aria-hidden="true">{initial}</span>;
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
        <nav className="sb-nav" aria-label="주 메뉴">{MAIN_NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
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

// 반을 상징하는 식물 그림: 새싹 → 잎새 → 가지 → 나무
function LevelArt({ id }) {
  return (
    <svg className="sb-levelart" viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="rgba(45,56,52,.1)" />
      {id === 'sprout' ? (
        <>
          <path d="M60 106 V76" stroke="#3d8a55" strokeWidth="5" strokeLinecap="round" />
          <path d="M60 78 C 40 78 32 62 34 50 C 50 50 60 62 60 78Z" fill="var(--tone,var(--leaf))" />
          <path d="M60 74 C 78 74 88 58 84 44 C 68 46 58 58 60 74Z" fill="var(--tone,var(--leaf))" opacity=".75" />
        </>
      ) : null}
      {id === 'leaf' ? (
        <>
          <path d="M60 106 V58" stroke="#3d8a55" strokeWidth="5" strokeLinecap="round" />
          <path d="M60 86 C 38 88 26 72 28 58 C 46 56 60 68 60 86Z" fill="var(--tone,var(--leaf))" />
          <path d="M60 72 C 82 72 94 56 90 40 C 72 42 58 54 60 72Z" fill="var(--tone,var(--leaf))" opacity=".75" />
          <path d="M60 58 C 50 50 50 38 58 28 C 68 36 68 50 60 58Z" fill="var(--tone,var(--leaf))" />
        </>
      ) : null}
      {id === 'branch' ? (
        <>
          <path d="M60 106 V50 M60 80 L38 62 M60 66 L84 48" stroke="#8a6a3d" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="40" r="16" fill="var(--tone,var(--leaf))" />
          <circle cx="36" cy="58" r="12" fill="var(--tone,var(--leaf))" opacity=".8" />
          <circle cx="86" cy="44" r="12" fill="var(--tone,var(--leaf))" opacity=".8" />
          <circle cx="68" cy="34" r="4" fill="#fff" opacity=".7" />
        </>
      ) : null}
      {id === 'tree' ? (
        <>
          <path d="M54 106 V70 H66 V106Z" fill="#8a6a3d" />
          <circle cx="60" cy="50" r="30" fill="var(--tone,var(--leaf))" />
          <circle cx="38" cy="62" r="16" fill="var(--tone,var(--leaf))" opacity=".8" />
          <circle cx="82" cy="62" r="16" fill="var(--tone,var(--leaf))" opacity=".8" />
          <circle cx="52" cy="40" r="5" fill="#fff" opacity=".6" />
          <circle cx="70" cy="56" r="5" fill="#fff" opacity=".6" />
        </>
      ) : null}
    </svg>
  );
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
          <LevelArt id={level.id} />
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

// 숫자가 화면에 들어오면 0부터 올라갑니다.
function CountNumber({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    el.textContent = '0';
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1100);
        el.textContent = String(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); el.textContent = String(value); };
  }, [value]);
  return <b ref={ref}>{value}</b>;
}

function Wave({ flip = false }) {
  return <svg className={`sb-wave${flip ? ' is-flip' : ''}`} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C 240 70 480 -10 720 30 S 1200 70 1440 30 V60 H0Z" /></svg>;
}

// 대표 놀이: 그림과 영어 단어 짝 맞추기 (8장, 4쌍)
function makeDeck() {
  const cards = WORD_PAIRS.flatMap((pair) => [
    { key: `${pair.id}-icon`, pair: pair.id, kind: 'icon', label: pair.icon, sr: pair.ko },
    { key: `${pair.id}-word`, pair: pair.id, kind: 'word', label: pair.word, sr: pair.word },
  ]);
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function WordPlay() {
  const [deck, setDeck] = useState(makeDeck);
  const [open, setOpen] = useState([]);
  const [found, setFound] = useState([]);
  const [moves, setMoves] = useState(0);
  const done = found.length === WORD_PAIRS.length;

  useEffect(() => {
    if (open.length !== 2) return undefined;
    const [a, b] = open.map((index) => deck[index]);
    const match = a.pair === b.pair;
    const timer = window.setTimeout(() => {
      if (match) setFound((current) => [...current, a.pair]);
      setOpen([]);
    }, match ? 420 : 950);
    return () => window.clearTimeout(timer);
  }, [open, deck]);

  const flip = (index) => {
    if (open.length >= 2 || open.includes(index) || found.includes(deck[index].pair)) return;
    if (open.length === 1) setMoves((value) => value + 1);
    setOpen((current) => [...current, index]);
  };
  const reset = () => { setDeck(makeDeck()); setOpen([]); setFound([]); setMoves(0); };

  return (
    <div className="sb-play">
      <div className="sb-play__board" role="group" aria-label="단어 카드 짝 맞추기">
        {deck.map((card, index) => {
          const faceUp = open.includes(index) || found.includes(card.pair);
          return (
            <button
              key={card.key}
              type="button"
              className={`sb-card sb-card--${card.kind}${faceUp ? ' is-up' : ''}${found.includes(card.pair) ? ' is-found' : ''}`}
              aria-label={faceUp ? `${card.sr} 카드` : '뒤집힌 카드'}
              aria-pressed={faceUp}
              onClick={() => flip(index)}
            >
              <span className="sb-card__inner">
                <span className="sb-card__back" aria-hidden="true">?</span>
                <span className="sb-card__front">{card.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="sb-play__side" aria-live="polite">
        {done ? (
          <div className="sb-play__win">
            <span className="sb-play__emoji" aria-hidden="true">🎉</span>
            <h3>참 잘했어요! Great job!</h3>
            <p>{moves}번 만에 {WORD_PAIRS.length}쌍을 모두 찾았어요.</p>
            <div className="sb-play__actions">
              <Link to="test" className="sb-btn">우리 아이 레벨 확인하기</Link>
              <button type="button" className="sb-textbtn" onClick={reset}><RotateCcw size={16} aria-hidden="true" /> 한 번 더</button>
            </div>
            <span className="sb-confetti" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
          </div>
        ) : (
          <>
            <p className="sb-play__hint">그림과 영어 단어가 짝이에요. 두 장씩 뒤집어 같은 짝을 찾아보세요!</p>
            <p className="sb-play__count"><b>{found.length}</b> / {WORD_PAIRS.length} 쌍 · {moves}번 뒤집음</p>
            <button type="button" className="sb-textbtn" onClick={reset}><RotateCcw size={16} aria-hidden="true" /> 다시 섞기</button>
          </>
        )}
      </div>
    </div>
  );
}

// 월간 성장 리포트 예시 카드
function ReportCard() {
  const [playing, setPlaying] = useState(false);
  const months = ['6월', '7월', '8월', '9월', REPORT.month];
  return (
    <article className="sb-report" aria-label="월간 성장 리포트 예시">
      <header>
        <p className="sb-report__kicker">MONTHLY REPORT · 예시</p>
        <h3>{REPORT.child}</h3>
        <p>{REPORT.month} 성장 리포트</p>
      </header>
      <div className="sb-report__stats">
        <div><b>{REPORT.books}권</b><span>읽은 책</span></div>
        <div><b>{REPORT.words}개</b><span>새로 익힌 단어</span></div>
      </div>
      <div className="sb-report__chart" role="img" aria-label={`발음 점수 변화 ${REPORT.pronunciation.join(', ')}`}>
        <p>발음 정확도 변화</p>
        <div>{REPORT.pronunciation.map((score, index) => <span key={months[index]} style={{ '--h': `${score}%` }}><i>{score}</i><em>{months[index]}</em></span>)}</div>
      </div>
      <button type="button" className={`sb-report__play${playing ? ' is-on' : ''}`} aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
        {playing ? <Square size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        {playing ? '재생 중…' : '이달의 발음 녹음 듣기'}
        <span className="sb-report__wave" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
      </button>
      <p className="sb-report__comment">“{REPORT.comment}”<small>— {REPORT.teacher}</small></p>
    </article>
  );
}

function ReviewCards({ items }) {
  return (
    <ul className="sb-reviews">
      {items.map((review, index) => (
        <li key={review.name} className={`sb-tone--${review.color}`} data-reveal style={{ '--d': `${index * 70}ms` }}>
          <p className="sb-reviews__stars" aria-label="별점 5점">★★★★★</p>
          <p className="sb-reviews__text">{review.text}</p>
          <p className="sb-reviews__who"><b>{review.name}</b><span>{review.child} · {review.period}</span></p>
        </li>
      ))}
    </ul>
  );
}

function FaqList({ items }) {
  return (
    <div className="sb-faq">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}<span aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

function NoticeRows({ items }) {
  return (
    <ul className="sb-notices">
      {items.map((notice) => (
        <li key={notice.id}>
          <Link to={`notice/${notice.id}`}>
            <span className="sb-notices__tag">{notice.tag}</span>
            <span className="sb-notices__title">{notice.title}</span>
            <time dateTime={notice.date}>{notice.date.replaceAll('-', '.')}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 간단한 약도 (시안용 도식)
function MapSketch() {
  return (
    <svg className="sb-map" viewBox="0 0 640 380" role="img" aria-label="○○역 2번 출구에서 새봄영어까지 도보 5분 약도">
      <rect width="640" height="380" rx="28" fill="#eef6ea" />
      <path d="M-10 250 C 150 220 260 300 420 262 S 600 230 660 250 V 300 C 560 280 440 320 300 330 S 100 290 -10 300Z" fill="#cfe7f6" />
      <g stroke="#fff" strokeWidth="18" strokeLinecap="round" fill="none">
        <path d="M40 90 H600" /><path d="M120 20 V230" /><path d="M360 20 V240" /><path d="M520 20 V240" />
      </g>
      <g stroke="#f4efe2" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="2 10">
        <path d="M40 90 H600" /><path d="M120 20 V230" /><path d="M360 20 V240" /><path d="M520 20 V240" />
      </g>
      <rect x="150" y="116" width="80" height="54" rx="10" fill="#fde6dd" /><rect x="388" y="112" width="104" height="62" rx="10" fill="#fdf1d3" />
      <rect x="30" y="116" width="62" height="86" rx="10" fill="#e3f1fb" />
      <text x="190" y="148" textAnchor="middle" fontSize="13" fill="#8a7a6a">○○아파트</text>
      <text x="440" y="148" textAnchor="middle" fontSize="13" fill="#8a7a6a">○○초등학교</text>
      <path d="M120 90 H 360 V 190" stroke="#f38a6b" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 11" fill="none" />
      <g transform="translate(120 90)"><circle r="26" fill="#2d3834" /><text textAnchor="middle" y="-3" fontSize="11" fill="#fff" fontWeight="700">○○역</text><text textAnchor="middle" y="12" fontSize="11" fill="#fff">2번 출구</text></g>
      <g transform="translate(360 190)"><path d="M0 0 C -26 -26 -26 -58 0 -58 C 26 -58 26 -26 0 0Z" fill="#6fbf85" /><circle cy="-40" r="9" fill="#fff" /></g>
      <rect x="296" y="196" width="128" height="30" rx="15" fill="#fff" /><text x="360" y="216" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2d3834">새봄영어 3층</text>
      <g transform="translate(236 70)"><rect width="84" height="26" rx="13" fill="#fff" /><text x="42" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f38a6b">도보 5분</text></g>
    </svg>
  );
}

function HomePage() {
  const heroRef = useRef(null);
  const onPointer = (event) => {
    const el = heroRef.current;
    if (!el || event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    el.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };
  return (
    <>
      <section className="sb-hero" ref={heroRef} onPointerMove={onPointer}>
        <span className="sb-float sb-float--a" aria-hidden="true">A</span>
        <span className="sb-float sb-float--b" aria-hidden="true">B</span>
        <span className="sb-float sb-float--c" aria-hidden="true">C</span>
        <span className="sb-float sb-float--d" aria-hidden="true">★</span>
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
        <ul className="sb-wrap sb-stats" aria-label="새봄영어 숫자로 보기">
          {STATS.map((stat) => <li key={stat.label}><span><CountNumber value={stat.value} /><em>{stat.unit}</em></span><small>{stat.label}</small></li>)}
        </ul>
      </section>
      <Wave />
      <section className="sb-section sb-section--mint">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">3가지 질문</p><h2>우리 아이에게 맞는 반은?</h2></div>
          <LevelFinder />
        </div>
      </section>
      <Wave flip />
      <section className="sb-section sb-section--play">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker sb-kicker--sun">1분 영어 놀이</p><h2>그림과 단어, 짝을 찾아요!</h2></div>
          <WordPlay />
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">새봄영어의 약속</p><h2>작은 반, 꼼꼼한 관심.</h2></div>
          <ul className="sb-promises">
            {PROMISES.map(([title, text], index) => <li key={title} data-reveal style={{ '--d': `${index * 90}ms` }}><b>{title}</b><p>{text}</p></li>)}
          </ul>
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">수업 하루</p><h2>50분이 이렇게 흘러가요</h2></div>
          <ol className="sb-day">
            {CLASS_DAY.map((step, index) => (
              <li key={step.title} className={`sb-tone--${step.color}`} data-reveal style={{ '--d': `${index * 90}ms` }}>
                <Photo name={step.photo} />
                <div><span>{step.time}</span><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap sb-split">
          <div data-reveal>
            <p className="sb-kicker">매달 받는 성장 리포트</p>
            <h2>우리 아이가 얼마나 자랐는지<br />귀로도 확인해요.</h2>
            <ul className="sb-checks">
              <li><Check size={18} aria-hidden="true" />읽은 책과 새 단어를 숫자로 정리</li>
              <li><Check size={18} aria-hidden="true" />매달 발음 녹음으로 변화를 직접 들어 보기</li>
              <li><Check size={18} aria-hidden="true" />선생님이 손으로 쓴 한 줄 코멘트</li>
            </ul>
            <Link to="programs" className="sb-textbtn">반별 커리큘럼 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ReportCard />
        </div>
      </section>
      <section className="sb-section sb-section--sky">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">선생님</p><h2>아이 이름을 먼저 불러 주는 선생님</h2></div>
          <ul className="sb-teacherrow">
            {TEACHERS.map((teacher, index) => (
              <li key={teacher.name} className={`sb-tone--${teacher.color}`} data-reveal style={{ '--d': `${index * 90}ms` }}>
                <Link to="teachers">
                  <Portrait name={teacher.photo} initial={teacher.initial} className="sb-teacherrow__img" />
                  <b>{teacher.name}</b><span>{teacher.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap">
          <div className="sb-head sb-head--row" data-reveal><div><p className="sb-kicker">공간 둘러보기</p><h2>아이가 편하게 머무는 3층</h2></div><Link to="about" className="sb-textbtn">학원 이야기 보기 <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <ul className="sb-tour">
            {['entrance', 'library', 'activity', 'hallway'].map((key, index) => (
              <li key={key} data-reveal style={{ '--d': `${index * 80}ms` }}><Photo name={key} /><span>{['현관·접수', '원내 도서관', '활동실', '복도 보관함'][index]}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sb-section sb-section--cream2">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">학부모 후기</p><h2>먼저 보내 보신 분들의 이야기</h2></div>
          <ReviewCards items={REVIEWS.slice(0, 3)} />
          <p className="sb-fine sb-center">※ 가상 학원의 예시 후기입니다.</p>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap sb-twocol">
          <div data-reveal><div className="sb-head sb-head--left"><p className="sb-kicker">자주 묻는 질문</p><h2>시작 전에 궁금한 것들</h2></div><FaqList items={FAQS.slice(0, 5)} /></div>
          <div data-reveal><div className="sb-head sb-head--left"><p className="sb-kicker">공지사항</p><h2>새봄영어 소식</h2></div><NoticeRows items={NOTICES} /><Link to="notice" className="sb-textbtn">공지 전체 보기 <ArrowRight size={16} aria-hidden="true" /></Link></div>
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
  return (
    <>
      <PageTop kicker="프로그램" title="아이의 속도에 맞춘 네 개의 반" lead="레벨테스트 결과와 학년을 함께 보고 반을 정해요. 중간에 반을 옮길 수도 있어요." />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-levels">
          {LEVELS.map((level) => (
            <article key={level.id} className={`sb-level sb-level--static sb-tone--${level.color}`} data-reveal>
              <div className="sb-level__head">
                <LevelArt id={level.id} />
                <span className="sb-level__name">{level.name}</span><span className="sb-level__grade">{level.grade}</span><span className="sb-level__title">{level.title}</span>
              </div>
              <div className="sb-level__body">
                <p>{level.text}</p>
                <ul>{level.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                <p className="sb-level__time">수업 시간: {SCHEDULE[level.id].map(([days, time]) => `${days} ${time}`).join(' / ')}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-gallery">
          <Photo name="phonics" /><Photo name="minibook" /><Photo name="roleplay" />
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap sb-split">
          <div data-reveal>
            <p className="sb-kicker">수업 하루</p>
            <h2>50분 수업, 이렇게 구성돼요</h2>
            <ol className="sb-timeline">
              {CLASS_DAY.map((step) => <li key={step.title}><b>{step.time}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
            </ol>
          </div>
          <ReportCard />
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
              <div className="sb-teacher__photo"><Portrait name={teacher.photo} initial={teacher.initial} className="sb-teacher__face" /></div>
              <h2>{teacher.name}</h2>
              <p className="sb-teacher__role">{teacher.role}</p>
              <ul className="sb-teacher__tags">{teacher.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <p className="sb-teacher__line">“{teacher.line}”</p>
              <p className="sb-teacher__bio">{teacher.bio}</p>
              <ul className="sb-teacher__career">{teacher.career.map((line) => <li key={line}>{line}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-center"><Link to="test" className="sb-btn">선생님과 만나는 무료 레벨테스트</Link></div>
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
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-twocol">
          <div><div className="sb-head sb-head--left"><h2>하원 셔틀</h2></div><p className="sb-lead">인근 초등학교 3곳을 오가는 소형 셔틀을 운행합니다. 학교와 시간은 상담 때 확인해 드려요.</p></div>
          <div><div className="sb-head sb-head--left"><h2>보강 안내</h2></div><p className="sb-lead">사전에 알려 주시면 같은 주 다른 반 시간에 보강할 수 있어요.</p></div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  const owner = TEACHERS[0];
  return (
    <>
      <PageTop kicker="학원 이야기" title="2014년, 다섯 아이로 시작했어요" lead="새봄영어가 만든 작은 약속과 공간, 그리고 찾아오시는 길을 소개합니다." />
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-greeting">
          <div className="sb-greeting__photo"><Portrait name={owner.photo} initial={owner.initial} className="sb-teacher__face" /></div>
          <div data-reveal>
            <p className="sb-kicker">원장 인사</p>
            <h2>“책 한 권을 끝까지 읽은 날이<br />영어가 좋아지는 날이에요.”</h2>
            <p className="sb-lead">영어를 잘하는 아이보다, 영어를 좋아하는 아이로 자라길 바라며 새봄영어를 열었습니다. 아이마다 속도가 다르다는 것을 알기에, 한 반을 여섯 명으로 지키고 매달 성장을 기록해 부모님과 나눕니다.</p>
            <p className="sb-sign">원장 {ACADEMY.owner} <small>(가상 인물)</small></p>
          </div>
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">걸어온 길</p><h2>새봄영어의 12년</h2></div>
          <ol className="sb-history">
            {HISTORY.map(([year, text]) => <li key={year} data-reveal><b>{year}</b><p>{text}</p></li>)}
          </ol>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">공간</p><h2>아이 눈높이로 만든 3층</h2></div>
          <ul className="sb-tour sb-tour--big">
            {['entrance', 'library', 'activity', 'hallway'].map((key, index) => (
              <li key={key} data-reveal style={{ '--d': `${index * 80}ms` }}><Photo name={key} /><span>{['현관·접수', '원내 도서관', '활동실', '복도 보관함'][index]}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sb-section sb-section--sky">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">오시는 길</p><h2>○○역에서 걸어서 5분</h2></div>
          <div className="sb-where">
            <MapSketch />
            <div className="sb-where__info">
              <p><MapPin size={18} aria-hidden="true" />{ACADEMY.address}</p>
              <p><Clock size={18} aria-hidden="true" />{ACADEMY.hours}</p>
              <p><Phone size={18} aria-hidden="true" />{ACADEMY.phone}</p>
              <p><Car size={18} aria-hidden="true" />{ACADEMY.parking}</p>
              <dl>{ACADEMY.access.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
            </div>
          </div>
        </div>
      </section>
      <section className="sb-section">
        <div className="sb-wrap">
          <div className="sb-head" data-reveal><p className="sb-kicker">학부모 후기</p><h2>먼저 보내 보신 분들의 이야기</h2></div>
          <ReviewCards items={REVIEWS} />
          <p className="sb-fine sb-center">※ 가상 학원의 예시 후기입니다.</p>
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-faqwrap"><div className="sb-head sb-head--left"><p className="sb-kicker">자주 묻는 질문</p><h2>FAQ</h2></div><FaqList items={FAQS} /></div>
      </section>
    </>
  );
}

function NoticePage({ slug }) {
  if (!slug) {
    return (
      <>
        <PageTop kicker="공지사항" title="새봄영어 소식" lead="휴원, 특강, 이벤트 소식을 알려 드려요." />
        <section className="sb-section sb-section--tight"><div className="sb-wrap sb-narrow"><NoticeRows items={NOTICES} /></div></section>
      </>
    );
  }
  const index = NOTICES.findIndex((item) => item.id === slug);
  if (index === -1) return <PageTop kicker="404" title="앗, 글을 찾을 수 없어요." />;
  const notice = NOTICES[index];
  const next = NOTICES[index - 1];
  const prev = NOTICES[index + 1];
  return (
    <>
      <PageTop kicker={notice.tag} title={notice.title} lead={notice.date.replaceAll('-', '.')} />
      <section className="sb-section sb-section--tight">
        <article className="sb-wrap sb-narrow sb-article">
          {notice.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <nav className="sb-article__nav" aria-label="이전·다음 글">
            {prev ? <Link to={`notice/${prev.id}`}>← {prev.title}</Link> : <span />}
            {next ? <Link to={`notice/${next.id}`}>{next.title} →</Link> : <span />}
          </nav>
          <Link to="notice" className="sb-btn sb-btn--line">목록으로</Link>
        </article>
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
            <p>{ACADEMY.access[0][1]}</p>
            <p>{ACADEMY.parking}</p>
            <p className="sb-info__tel">{ACADEMY.phone}</p>
            <Link to="about" className="sb-textbtn"><Calendar size={16} aria-hidden="true" /> 약도 보기</Link>
          </aside>
        </div>
      </section>
      <section className="sb-section sb-section--tight">
        <div className="sb-wrap sb-faqwrap"><div className="sb-head sb-head--left"><p className="sb-kicker">신청 전에 확인해 보세요</p><h2>자주 묻는 질문</h2></div><FaqList items={FAQS.slice(0, 4)} /></div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return <PageTop kicker="404" title="앗, 페이지를 찾을 수 없어요." />;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title, props = {}) => ({ Page, title: `${title} — ${ACADEMY.name}`, props });
  if (!section) return { Page: HomePage, title: `${ACADEMY.name} — 초등 영어, 재밌어야 멈추지 않아요`, props: {} };
  if (section === 'notice') {
    const notice = NOTICES.find((item) => item.id === slug);
    if (slug && !notice) return make(NotFoundPage, '페이지를 찾을 수 없습니다');
    return make(NoticePage, notice ? notice.title : '공지사항', { slug });
  }
  if (slug) return make(NotFoundPage, '페이지를 찾을 수 없습니다');
  if (section === 'programs') return make(ProgramsPage, '프로그램');
  if (section === 'teachers') return make(TeachersPage, '선생님');
  if (section === 'schedule') return make(SchedulePage, '시간표');
  if (section === 'about') return make(AboutPage, '학원 이야기');
  if (section === 'test') return make(TestPage, '무료 레벨테스트');
  return make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

// 가상 약관·개인정보 처리방침 요약 창
function LegalDialog({ kind, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);
  return (
    <dialog ref={ref} className="sb-dialog" onClose={onClose} aria-labelledby="sb-legal-title">
      <div>
        <h2 id="sb-legal-title">{kind === 'privacy' ? '개인정보 처리방침 (예시)' : '이용약관 (예시)'}</h2>
        {kind ? LEGAL[kind].map((line) => <p key={line}>{line}</p>) : null}
        <button type="button" className="sb-btn sb-btn--sm" onClick={onClose}>닫기</button>
      </div>
    </dialog>
  );
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, title, props } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  const [legal, setLegal] = useState(null);
  return (
    <div className="sb" ref={root}>
      <Header />
      <main id="site-main" tabIndex={-1}><Page key={page} {...props} /></main>
      <footer className="sb-footer">
        <div className="sb-wrap sb-footer__inner">
          <Logo />
          <p>{ACADEMY.address} · 대표 {ACADEMY.owner} · {ACADEMY.phone} · {ACADEMY.email}</p>
          <p>학원등록번호 {ACADEMY.registration} · 교습과목 외국어(영어) · 사업자등록번호 {ACADEMY.business}</p>
          <p className="sb-footer__links"><button type="button" onClick={() => setLegal('terms')}>이용약관</button><button type="button" onClick={() => setLegal('privacy')}>개인정보 처리방침</button></p>
          <p>© 2026 {ACADEMY.name}. 나나웹이 제작한 가상 학원 시안입니다. 등장하는 인물·후기·수치는 모두 가상입니다.</p>
          <PhotoCredits keys={ALL_PHOTO_KEYS} extra="" />
        </div>
      </footer>
      <LegalDialog kind={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
