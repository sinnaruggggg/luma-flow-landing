import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, EXPERIENCES, NAV, PHOTOS, ROOMS, STAY, HERO_COPY, SCENES } from './content.js';
import { Booking } from './Booking.jsx';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap',
];
const won = (value) => `${value.toLocaleString('ko-KR')}원`;

function Photo({ name, className = '', eager = false }) {
  const { src, alt } = resolvePhoto('stay-yeobaek', PHOTOS[name]);
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

function Header({ overHero, time, onTime }) {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`sy-header${overHero && !scrolled ? ' is-clear' : ''}`}>
      <div className="sy-wrap sy-header__inner">
        <Link to="" className="sy-logo" aria-label={`${STAY.name} 홈`}><span>여백</span><small>{STAY.english}</small></Link>
        <nav className="sy-nav" aria-label="주 메뉴">{NAV.slice(1).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
        <button type="button" className="sy-time" aria-pressed={time === 'day'} onClick={onTime} aria-label={time === 'day' ? '밤 분위기로 보기' : '아침 분위기로 보기'}>
          <span className={time === 'night' ? 'is-on' : ''}>☾ 밤</span><span className={time === 'day' ? 'is-on' : ''}>☀ 아침</span>
        </button>
        <button type="button" className="sy-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="sy-drawer">
        <div className="sy-drawer__top"><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">{NAV.map(([to, label]) => <Link key={label} to={to} onClick={close}>{label}</Link>)}</nav>
        <p>{STAY.place}</p>
      </MenuDrawer>
    </header>
  );
}

function Footer() {
  return (
    <footer className="sy-footer">
      <div className="sy-wrap sy-footer__inner">
        <p className="sy-logo"><span>여백</span><small>{STAY.english}</small></p>
        <p>{STAY.address} · {STAY.phone} · 사업자등록번호 000-00-00000 · 농어촌민박 신고번호 제0000-0호</p>
        <p>© 2026 {STAY.name}. 나나웹이 제작한 가상 숙소 시안입니다.</p>
        <PhotoCredits keys={ALL_PHOTO_KEYS} />
      </div>
    </footer>
  );
}

function RoomRow({ room, index }) {
  return (
    <article className={`sy-room${index % 2 ? ' is-flip' : ''}`}>
      <div className="sy-room__media" data-reveal><Photo name={room.photos[0]} className="sy-parallax" /></div>
      <div className="sy-room__text" data-reveal>
        <p className="sy-eyebrow">{String(index + 1).padStart(2, '0')} · {room.english}</p>
        <h3>{room.name}</h3>
        <p className="sy-room__tag">{room.tagline}</p>
        <p>{room.description}</p>
        <p className="sy-room__meta">{room.size}㎡ · 기준 {room.base}인 / 최대 {room.max}인 · {won(room.weekday)}부터</p>
        <Link to={`rooms/${room.slug}`} className="sy-textlink">객실 자세히 <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

// 대표 장면: 처음엔 창문만 한 사진이 "여 · 백" 사이에 걸려 있다가, 스크롤하면 화면 가득 열립니다.
function OpeningHero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--o', '1'); return undefined; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const o = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (total * 0.8)));
      el.style.setProperty('--o', (1 - Math.pow(1 - o, 2)).toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return (
    <section className="sy-open" ref={ref}>
      <div className="sy-hero">
        <Photo name="hero" className="sy-hero__img" eager />
        <div className="sy-hero__shade" />
        <span className="sy-open__char sy-open__char--l" aria-hidden="true">여</span>
        <span className="sy-open__char sy-open__char--r" aria-hidden="true">백</span>
        <div className="sy-wrap sy-hero__text">
          <p className="sy-eyebrow">{STAY.place}</p>
          <h1>
            <span className="sy-time-night">{HERO_COPY.night.map((line, i) => <span key={line}>{line}{i < HERO_COPY.night.length - 1 ? <br /> : null}</span>)}</span>
            <span className="sy-time-day">{HERO_COPY.day.map((line, i) => <span key={line}>{line}{i < HERO_COPY.day.length - 1 ? <br /> : null}</span>)}</span>
          </h1>
          <Link to="booking" className="sy-btn">예약하기</Link>
        </div>
        <p className="sy-open__hint" aria-hidden="true">SCROLL TO OPEN</p>
      </div>
    </section>
  );
}

// 끌어서(또는 화살표로) 넘기는 "여백의 장면" 사진 띠
function SceneGallery() {
  const track = useRef(null);
  const drag = useRef(null);
  const onDown = (event) => {
    if (event.pointerType !== 'mouse') return;
    drag.current = { x: event.clientX, left: track.current.scrollLeft, moved: false };
    track.current.setPointerCapture(event.pointerId);
    track.current.classList.add('is-dragging');
  };
  const onMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - dx;
  };
  const onUp = () => { drag.current = null; track.current?.classList.remove('is-dragging'); };
  const step = (dir) => {
    const card = track.current?.querySelector('li');
    track.current?.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 24), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <section className="sy-section sy-scenes" aria-labelledby="sy-scenes-title">
      <div className="sy-wrap sy-scenes__head">
        <div className="sy-head" data-reveal><p className="sy-eyebrow">SCENES</p><h2 id="sy-scenes-title">여백의 장면</h2></div>
        <div className="sy-scenes__nav">
          <span aria-hidden="true">끌어서 넘겨 보세요</span>
          <button type="button" aria-label="이전 장면" onClick={() => step(-1)}>←</button>
          <button type="button" aria-label="다음 장면" onClick={() => step(1)}>→</button>
        </div>
      </div>
      <ul className="sy-scenes__track" ref={track} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {SCENES.map(([key, caption], index) => (
          <li key={key}>
            <Photo name={key} />
            <p><span>{String(index + 1).padStart(2, '0')}</span>{caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <OpeningHero />

      <section className="sy-section sy-intro">
        <div className="sy-wrap">
          <p className="sy-quote" data-reveal>세 개의 방, 하나의 바다.<br />여백은 채우지 않고 비워 두는 법을 압니다.</p>
          <div className="sy-intro__grid">
            <Photo name="details" className="sy-intro__a" />
            <p data-reveal>하루에 세 팀만 머뭅니다. 객실마다 출입구와 마당을 따로 두어, 머무는 동안 다른 손님과 마주칠 일이 거의 없습니다. 필요한 것은 미리 준비해 두고, 부르지 않으면 찾아가지 않습니다.</p>
            <Photo name="breakfast" className="sy-intro__b" />
          </div>
        </div>
      </section>

      <section className="sy-section">
        <div className="sy-wrap">
          <div className="sy-head" data-reveal><p className="sy-eyebrow">ROOMS</p><h2>세 개의 방</h2></div>
          {ROOMS.map((room, index) => <RoomRow key={room.slug} room={room} index={index} />)}
        </div>
      </section>

      <section className="sy-section sy-exp">
        <div className="sy-wrap">
          <div className="sy-head" data-reveal><p className="sy-eyebrow">EXPERIENCE</p><h2>여백을 채우는 세 가지</h2></div>
          <ol className="sy-exp__list">
            {EXPERIENCES.map(([title, text], index) => (
              <li key={title} data-reveal style={{ '--d': `${index * 120}ms` }}><span>{['一', '二', '三'][index]}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <SceneGallery />

      <section className="sy-closing">
        <Photo name="bath" className="sy-closing__img sy-parallax" />
        <div className="sy-closing__text" data-reveal>
          <h2>오늘 밤, 파도 소리를 예약하세요.</h2>
          <Link to="booking" className="sy-btn">빈 날짜 보기</Link>
        </div>
      </section>
    </>
  );
}

function PageTop({ eyebrow, title, lead }) {
  return (
    <section className="sy-pagetop">
      <div className="sy-wrap">
        <p className="sy-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </section>
  );
}

function RoomsPage() {
  return (
    <>
      <PageTop eyebrow="ROOMS" title="세 개의 방" lead="모든 객실은 독립된 출입구와 마당을 가지고 있습니다." />
      <section className="sy-section sy-section--tight"><div className="sy-wrap">{ROOMS.map((room, index) => <RoomRow key={room.slug} room={room} index={index} />)}</div></section>
    </>
  );
}

function RoomPage({ room }) {
  return (
    <>
      <section className="sy-roomtop">
        <Photo name={room.photos[0]} className="sy-roomtop__img" eager />
        <div className="sy-wrap sy-roomtop__text">
          <nav className="sy-crumbs" aria-label="현재 위치"><Link to="rooms">객실</Link> / <b aria-current="page">{room.name}</b></nav>
          <h1>{room.name}<small>{room.english}</small></h1>
          <p>{room.tagline}</p>
        </div>
      </section>
      <section className="sy-section sy-section--tight">
        <div className="sy-wrap sy-roomdetail">
          <div data-reveal>
            <p className="sy-roomdetail__lead">{room.description}</p>
            <ul className="sy-features">{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </div>
          <aside className="sy-rate" data-reveal>
            <dl>
              <div><dt>면적</dt><dd>{room.size}㎡</dd></div>
              <div><dt>인원</dt><dd>기준 {room.base}인 · 최대 {room.max}인</dd></div>
              <div><dt>주중</dt><dd>{won(room.weekday)}</dd></div>
              <div><dt>주말</dt><dd>{won(room.weekend)}</dd></div>
              <div><dt>입퇴실</dt><dd>{STAY.checkin} / {STAY.checkout}</dd></div>
            </dl>
            <Link to={`booking/${room.slug}`} className="sy-btn">이 객실 예약하기</Link>
          </aside>
          <Photo name={room.photos[1]} className="sy-roomdetail__img" />
        </div>
      </section>
    </>
  );
}

function BookingPage({ room }) {
  return (
    <>
      <PageTop eyebrow="RESERVATION" title="빈 날짜 보기" lead="객실과 날짜를 고르면 요금이 바로 계산됩니다." />
      <section className="sy-section sy-section--tight"><div className="sy-wrap"><Booking key={room} initialRoom={room} /></div></section>
    </>
  );
}

function NotFoundPage() {
  return <PageTop eyebrow="404" title="찾을 수 없는 페이지입니다." />;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title, props = {}, hero = false) => ({ Page, props, hero, title: `${title} — ${STAY.name}` });
  if (!section) return { Page: HomePage, props: {}, hero: true, title: `${STAY.name} — 남해 바닷가의 프라이빗 스테이` };
  if (section === 'rooms' && !slug) return make(RoomsPage, '객실');
  if (section === 'rooms') {
    const room = ROOMS.find((item) => item.slug === slug);
    if (room) return make(RoomPage, room.name, { room }, true);
  }
  if (section === 'booking' && (!slug || ROOMS.some((item) => item.slug === slug))) return make(BookingPage, '예약', { room: slug || '' });
  return make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, props, title, hero } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  // 낮·밤 전환: 사이트 전체 색과 첫 화면 문구가 아침/밤 분위기로 바뀝니다.
  const [time, setTime] = useState('night');
  return (
    <div className="sy" ref={root} data-time={time}>
      <Header overHero={hero} time={time} onTime={() => setTime((value) => (value === 'night' ? 'day' : 'night'))} />
      <main id="site-main" tabIndex={-1}><Page key={page} {...props} /></main>
      <Footer />
    </div>
  );
}
