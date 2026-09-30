import { useCallback, useState } from 'react';
import { ArrowRight, ArrowUpRight, Clock, MapPin, Menu, Phone, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, CLINIC, DOCTORS, HOURS, NAV, PHOTOS, PROMISES, TREATMENTS } from './content.js';
import { Booking } from './Booking.jsx';
import './site.css';

const FONTS = ['https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css'];

function Photo({ name, className = '', eager = false }) {
  const { src, alt } = resolvePhoto('orda-dental', PHOTOS[name]);
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

// 지금 진료 중인지 계산 (예: 목요일 20시 → 진료 중, 21:00까지)
function openStatus() {
  const now = new Date();
  const today = HOURS[now.getDay()];
  if (today.closed) return { open: false, text: '오늘은 휴진입니다' };
  const [start, end] = today.time.split(' – ');
  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
  if (minutes < toMin(start)) return { open: false, text: `오늘 ${start}부터 진료합니다` };
  if (minutes >= toMin(end)) return { open: false, text: '오늘 진료가 끝났습니다' };
  return { open: true, text: `지금 진료 중 · ${end}까지` };
}

function Logo() {
  return (
    <Link to="" className="od-logo" aria-label={`${CLINIC.name} 홈`}>
      <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" /><path d="M9 17c2 4 12 4 14 0" /></svg>
      <span>{CLINIC.name}</span>
    </Link>
  );
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`od-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="od-wrap od-header__inner">
        <Logo />
        <nav className="od-nav" aria-label="주 메뉴">{NAV.slice(0, 3).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
        <Link to="booking" className="od-btn od-btn--sm od-header__cta">진료 예약</Link>
        <button type="button" className="od-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="od-drawer">
        <div className="od-drawer__top"><Logo /><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴">
          <Link to="" onClick={close}>홈</Link>
          {NAV.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}</Link>)}
        </nav>
        <a className="od-drawer__tel" href={`tel:${CLINIC.phone.replace(/-/g, '')}`}><Phone size={18} aria-hidden="true" /> {CLINIC.phone}</a>
      </MenuDrawer>
    </header>
  );
}

function Footer() {
  return (
    <footer className="od-footer">
      <div className="od-wrap od-footer__grid">
        <div><Logo /><p className="od-footer__en">{CLINIC.english}</p></div>
        <ul>
          <li>{CLINIC.address}</li>
          <li>대표전화 {CLINIC.phone}</li>
          <li>대표원장 윤하람 · 사업자등록번호 000-00-00000</li>
        </ul>
        <ul>{HOURS.slice(1).concat(HOURS[0]).map((item) => <li key={item.day}><b>{item.label.slice(0, 1)}</b> {item.time}</li>)}</ul>
      </div>
      <div className="od-wrap od-footer__bottom">
        <p>© 2026 {CLINIC.name}. 나나웹이 제작한 가상 치과 시안이며, 의료 정보나 진료를 제공하지 않습니다. 치료 결과는 개인에 따라 다를 수 있습니다.</p>
        <PhotoCredits keys={ALL_PHOTO_KEYS} />
      </div>
    </footer>
  );
}

function SectionHead({ kicker, title, action }) {
  return (
    <div className="od-head" data-reveal>
      <div><p className="od-kicker">{kicker}</p><h2>{title}</h2></div>
      {action}
    </div>
  );
}

function HomePage() {
  const [status] = useState(openStatus);
  const today = HOURS[new Date().getDay()];
  return (
    <>
      <section className="od-hero">
        <div className="od-wrap od-hero__grid">
          <div className="od-hero__copy">
            <p className={`od-status${status.open ? ' is-open' : ''}`}><i aria-hidden="true" />{status.text}</p>
            <h1>치과가 조금 덜<br />무서워지도록.</h1>
            <p className="od-hero__lead">사진으로 먼저 보여드리고, 필요한 만큼만 치료합니다.<br />분당 ○○역 앞, 목요일은 밤 9시까지 진료해요.</p>
            <div className="od-hero__actions">
              <Link to="booking" className="od-btn">진료 예약하기 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="care" className="od-btn od-btn--line">진료 안내</Link>
            </div>
            <ul className="od-hero__facts">
              <li><Clock size={18} aria-hidden="true" /><span>오늘</span><b>{today.time}</b></li>
              <li><Phone size={18} aria-hidden="true" /><span>전화</span><b>{CLINIC.phone}</b></li>
              <li><MapPin size={18} aria-hidden="true" /><span>위치</span><b>○○역 2번 출구</b></li>
            </ul>
          </div>
          <div className="od-hero__media">
            <Photo name="hero" className="od-hero__img" eager />
            <div className="od-float"><b>첫 방문이신가요?</b><span>모니터로 구강 사진을 함께 보며<br />지금 상태부터 설명드려요.</span></div>
          </div>
        </div>
      </section>

      <section className="od-section">
        <div className="od-wrap">
          <SectionHead kicker="오르다의 약속" title={<>설명은 충분히,<br />치료는 필요한 만큼.</>} />
          <ol className="od-promises">
            {PROMISES.map(([title, text], index) => (
              <li key={title} data-reveal style={{ '--d': `${index * 90}ms` }}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="od-section od-section--sand">
        <div className="od-wrap">
          <SectionHead kicker="진료 안내" title="어디가 불편하신가요?" action={<Link to="care" className="od-textlink">전체 진료 보기 <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <ul className="od-cards">
            {TREATMENTS.map((item, index) => (
              <li key={item.slug} data-reveal style={{ '--d': `${index * 60}ms` }}>
                <Link to={`care/${item.slug}`}>
                  <Photo name={item.photo} />
                  <div><h3>{item.title}</h3><p>{item.short}</p></div>
                  <ArrowUpRight size={20} aria-hidden="true" className="od-cards__go" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="od-section">
        <div className="od-wrap">
          <SectionHead kicker="진료실 둘러보기" title="밝고 조용한 공간에서 진료합니다." />
        </div>
        <div className="od-tour" tabIndex={0} aria-label="진료실 사진 (옆으로 넘겨 보기)">
          {[['consult', '상담실'], ['room', '개별 진료실'], ['sterilization', '멸균실'], ['window', '창가 진료실'], ['waiting', '대기 공간']].map(([name, caption]) => (
            <figure key={name}><Photo name={name} /><figcaption>{caption}</figcaption></figure>
          ))}
        </div>
      </section>

      <section className="od-section od-section--sand">
        <div className="od-wrap">
          <SectionHead kicker="의료진" title="전문의가 분야별로 진료합니다." action={<Link to="doctors" className="od-textlink">의료진 소개 <ArrowRight size={16} aria-hidden="true" /></Link>} />
          <div className="od-doctors">{DOCTORS.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} />)}</div>
        </div>
      </section>

      <section className="od-cta">
        <div className="od-wrap od-cta__inner" data-reveal>
          <h2>예약은 1분이면 충분합니다.</h2>
          <p>진료, 날짜, 시간만 고르시면 확인 문자를 보내드려요.</p>
          <Link to="booking" className="od-btn od-btn--white">지금 예약하기 <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

function DoctorCard({ doctor, full = false }) {
  return (
    <article className="od-doctor" data-reveal>
      <span className="od-doctor__mono" aria-hidden="true">{doctor.initial}</span>
      <p className="od-doctor__role">{doctor.role} · {doctor.field}</p>
      <h3>{doctor.name}</h3>
      <p className="od-doctor__words">“{doctor.words}”</p>
      {full ? <ul>{doctor.career.map((line) => <li key={line}>{line}</li>)}</ul> : null}
    </article>
  );
}

function PageTop({ kicker, title, lead }) {
  return (
    <section className="od-pagetop">
      <div className="od-wrap">
        <p className="od-kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </section>
  );
}

function CarePage() {
  return (
    <>
      <PageTop kicker="진료 안내" title="진료 과목" lead="증상과 치료 과정을 미리 알아 두시면 진료가 훨씬 편해집니다." />
      <section className="od-section od-section--tight">
        <div className="od-wrap">
          <ul className="od-carelist">
            {TREATMENTS.map((item) => (
              <li key={item.slug} data-reveal>
                <Link to={`care/${item.slug}`}>
                  <Photo name={item.photo} />
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.intro}</p>
                    <span className="od-textlink">자세히 보기 <ArrowRight size={16} aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function CareDetailPage({ item }) {
  const others = TREATMENTS.filter((other) => other.slug !== item.slug).slice(0, 3);
  return (
    <>
      <section className="od-detailtop">
        <div className="od-wrap od-detailtop__grid">
          <div>
            <nav className="od-crumbs" aria-label="현재 위치"><Link to="care">진료 안내</Link><span aria-hidden="true">/</span><b aria-current="page">{item.title}</b></nav>
            <h1>{item.title}</h1>
            <p>{item.intro}</p>
            <Link to={`booking/${item.slug}`} className="od-btn">이 진료 예약하기 <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <Photo name={item.photo} className="od-detailtop__img" eager />
        </div>
      </section>
      <section className="od-section od-section--tight">
        <div className="od-wrap od-detail">
          <div data-reveal>
            <h2>이런 분께 권해요</h2>
            <ul className="od-checks">{item.for.map((line) => <li key={line}>{line}</li>)}</ul>
          </div>
          <div data-reveal>
            <h2>진료 순서</h2>
            <ol className="od-steps">{item.steps.map((line) => <li key={line}>{line}</li>)}</ol>
          </div>
          <aside className="od-notecard" data-reveal>
            <p><b>1회 진료 시간</b> 약 {item.minutes}분</p>
            <p>{item.note}</p>
          </aside>
        </div>
      </section>
      <section className="od-section od-section--sand od-section--tight">
        <div className="od-wrap">
          <SectionHead kicker="다른 진료" title="함께 보면 좋은 진료" />
          <ul className="od-cards od-cards--three">
            {others.map((other) => (
              <li key={other.slug}><Link to={`care/${other.slug}`}><Photo name={other.photo} /><div><h3>{other.title}</h3><p>{other.short}</p></div><ArrowUpRight size={20} aria-hidden="true" className="od-cards__go" /></Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function DoctorsPage() {
  return (
    <>
      <PageTop kicker="의료진" title="전문의 세 명이 함께합니다." lead="분야별 전문의가 직접 진료하고, 필요하면 협진합니다. (표시된 인물은 가상 인물입니다)" />
      <section className="od-section od-section--tight">
        <div className="od-wrap od-doctors od-doctors--full">{DOCTORS.map((doctor) => <DoctorCard key={doctor.name} doctor={doctor} full />)}</div>
      </section>
    </>
  );
}

function GuidePage() {
  const todayIndex = new Date().getDay();
  return (
    <>
      <PageTop kicker="이용 안내" title="진료 시간과 오시는 길" />
      <section className="od-section od-section--tight">
        <div className="od-wrap od-guide">
          <div className="od-panel" data-reveal>
            <h2>진료 시간</h2>
            <table className="od-hours">
              <tbody>
                {HOURS.slice(1).concat(HOURS[0]).map((item) => (
                  <tr key={item.day} className={item.day === todayIndex ? 'is-today' : ''}>
                    <th scope="row">{item.label}{item.day === todayIndex ? <em>오늘</em> : null}</th>
                    <td>{item.time}{item.note ? <small>{item.note}</small> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="od-hint">평일 점심시간 13:00 – 14:00 · 공휴일 휴진</p>
          </div>
          <div className="od-panel" data-reveal>
            <h2>오시는 길</h2>
            <div className="od-map" role="img" aria-label="치과 위치 약도"><i /><i /><i /><span className="od-map__pin">오르다치과</span><span className="od-map__st">○○역</span></div>
            <ul className="od-infolist">
              <li><MapPin size={18} aria-hidden="true" />{CLINIC.address}</li>
              <li><ArrowRight size={18} aria-hidden="true" />{CLINIC.subway}</li>
              <li><Clock size={18} aria-hidden="true" />{CLINIC.parking}</li>
            </ul>
          </div>
          <div className="od-panel od-panel--wide" data-reveal>
            <h2>비용과 보험 안내</h2>
            <ul className="od-checks">
              <li>치료 전에 건강보험 적용 여부와 예상 비용을 먼저 안내합니다.</li>
              <li>비급여 항목의 비용은 원내에 게시하고, 상담 시 서면으로 드립니다.</li>
              <li>실손보험 청구에 필요한 서류는 진료 당일 요청하시면 발급해 드립니다.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function BookingPage({ treatment }) {
  return (
    <>
      <PageTop kicker="진료 예약" title="원하는 시간에 예약하세요." lead="예약 후 확인 문자를 보내드립니다. 급한 통증은 전화로 먼저 연락해 주세요." />
      <section className="od-section od-section--tight">
        <div className="od-wrap"><Booking key={treatment} initialTreatment={treatment} /></div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return <PageTop kicker="404" title="페이지를 찾을 수 없습니다." lead="주소를 다시 확인해 주세요." />;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title, props = {}) => ({ Page, props, title: `${title} — ${CLINIC.name}` });
  if (!section) return { Page: HomePage, props: {}, title: `${CLINIC.name} — 분당 ○○역 치과` };
  if (section === 'care' && !slug) return make(CarePage, '진료 안내');
  if (section === 'care') {
    const item = TREATMENTS.find((treatment) => treatment.slug === slug);
    if (item) return make(CareDetailPage, item.title, { item });
  }
  if (section === 'doctors' && !slug) return make(DoctorsPage, '의료진');
  if (section === 'guide' && !slug) return make(GuidePage, '이용 안내');
  if (section === 'booking' && (!slug || TREATMENTS.some((item) => item.slug === slug))) return make(BookingPage, '진료 예약', { treatment: slug || '' });
  return make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, props, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  return (
    <div className="od" ref={root}>
      <Header />
      <main id="site-main" tabIndex={-1}><Page key={page} {...props} /></main>
      <Footer />
    </div>
  );
}
