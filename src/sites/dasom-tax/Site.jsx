import { useCallback, useState } from 'react';
import { ArrowRight, CalendarClock, Check, Menu, Phone, Printer, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { SitePhoto } from '../_kit/SitePhoto.jsx';
import { useFonts, useMockForm, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, CHECKLISTS, DEADLINES, FEES, NAV, OFFICE, PHOTOS, READY_IMAGES, SERVICES, STEPS } from './content.js';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=Hahmlet:wght@500;700&display=swap',
];

function Photo({ name, className = '', eager = false }) {
  return <SitePhoto siteId="dasom-tax" value={PHOTOS[name]} ready={READY_IMAGES} className={className} eager={eager} />;
}

// 오늘 기준 다가오는 신고 기한 n개 (D-day 포함)
function upcomingDeadlines(count = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list = [];
  for (let offset = 0; offset < 2; offset += 1) {
    const year = today.getFullYear() + offset;
    DEADLINES.forEach((item) => {
      if (item.monthly) {
        for (let month = 0; month < 12; month += 1) list.push({ ...item, date: new Date(year, month, item.day) });
      } else {
        list.push({ ...item, date: new Date(year, item.month - 1, item.day) });
      }
    });
  }
  return list
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, count)
    .map((item) => ({ ...item, dday: Math.round((item.date - today) / 86400000) }));
}

function Logo() {
  return <Link to="" className="dt-logo" aria-label={`${OFFICE.name} 홈`}><span aria-hidden="true">多</span><b>다솜</b>세무회계</Link>;
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <header className={`dt-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="dt-wrap dt-header__inner">
        <Logo />
        <nav className="dt-nav" aria-label="주 메뉴">{NAV.slice(0, 3).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
        <a className="dt-header__tel" href={`tel:${OFFICE.phone.replace(/-/g, '')}`}><Phone size={16} aria-hidden="true" />{OFFICE.phone}</a>
        <Link to="contact" className="dt-btn dt-btn--sm dt-header__cta">상담 신청</Link>
        <button type="button" className="dt-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      <MenuDrawer open={open} onClose={close} className="dt-drawer">
        <div className="dt-drawer__top"><Logo /><button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button></div>
        <nav aria-label="모바일 메뉴"><Link to="" onClick={close}>홈</Link>{NAV.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}</Link>)}</nav>
      </MenuDrawer>
    </header>
  );
}

function DeadlineCard() {
  const [list] = useState(() => upcomingDeadlines(3));
  const format = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
  return (
    <aside className="dt-deadline" aria-label="다가오는 세무 신고 일정">
      <p className="dt-deadline__title"><CalendarClock size={18} aria-hidden="true" /> 다가오는 신고 일정</p>
      <ol>
        {list.map((item, index) => (
          <li key={`${item.name}-${item.date.getTime()}`} className={index === 0 ? 'is-next' : ''}>
            <span className="dt-dday">{item.dday === 0 ? 'D-DAY' : `D-${item.dday}`}</span>
            <div><b>{item.name}</b><small>{format(item.date)} · {item.who}</small></div>
          </li>
        ))}
      </ol>
      <Link to="checklist" className="dt-textlink">필요한 서류 확인하기 <ArrowRight size={16} aria-hidden="true" /></Link>
    </aside>
  );
}

function HomePage() {
  return (
    <>
      <section className="dt-hero">
        <div className="dt-wrap dt-hero__grid">
          <div className="dt-hero__text">
            <p className="dt-kicker">개인사업자 · 소규모 법인 전문</p>
            <h1>세금 걱정은 덜고,<br /><em>사업에만</em> 집중하세요.</h1>
            <p>신고 일정은 먼저 알려 드리고, 아낄 수 있는 세금은 숫자로 보여 드립니다. 영수증 정리부터 절세 상담까지 한곳에서.</p>
            <div className="dt-hero__actions">
              <Link to="contact" className="dt-btn">무료 세무 진단 신청 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="fees" className="dt-btn dt-btn--line">수수료 보기</Link>
            </div>
          </div>
          <div className="dt-hero__media">
            <Photo name="hero" className="dt-hero__img" eager />
            <DeadlineCard />
          </div>
        </div>
      </section>
      <section className="dt-section">
        <div className="dt-wrap">
          <div className="dt-head" data-reveal><p className="dt-kicker">업무 안내</p><h2>사업의 모든 단계에서 필요한 세무</h2></div>
          <ul className="dt-services">
            {SERVICES.map((service, index) => (
              <li key={service.id} data-reveal style={{ '--d': `${index * 70}ms` }}>
                <span className="dt-services__no">{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="dt-section dt-section--green">
        <div className="dt-wrap dt-steps">
          <div data-reveal><p className="dt-kicker dt-kicker--light">진행 과정</p><h2>처음이라도 네 단계면 됩니다.</h2></div>
          <ol>{STEPS.map(([title, text], index) => <li key={title} data-reveal style={{ '--d': `${index * 90}ms` }}><span>{index + 1}</span><b>{title}</b><p>{text}</p></li>)}</ol>
        </div>
      </section>
      <section className="dt-section">
        <div className="dt-wrap dt-split">
          <Photo name="consult" className="dt-split__img" />
          <div data-reveal>
            <p className="dt-kicker">다솜의 방식</p>
            <h2>전문 용어 대신<br />대표님의 말로 설명합니다.</h2>
            <p>“이번 달에 세금이 왜 이만큼 나왔는지”를 한 장짜리 리포트로 드립니다. 궁금한 점은 담당 세무사에게 바로 물어보세요.</p>
            <Link to="services" className="dt-textlink">업무 자세히 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PageTop({ kicker, title, lead }) {
  return <section className="dt-pagetop"><div className="dt-wrap"><p className="dt-kicker">{kicker}</p><h1>{title}</h1>{lead ? <p>{lead}</p> : null}</div></section>;
}

function ServicesPage() {
  return (
    <>
      <PageTop kicker="업무 안내" title="필요한 만큼만 맡기세요" lead="기장부터 신고, 절세 상담까지 필요한 업무를 골라 계약할 수 있습니다." />
      <section className="dt-section dt-section--tight">
        <div className="dt-wrap dt-servicelist">
          {SERVICES.map((service, index) => (
            <article key={service.id} data-reveal>
              <span className="dt-services__no">{String(index + 1).padStart(2, '0')}</span>
              <div><h2>{service.title}</h2><p>{service.text}</p></div>
              <ul>{service.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ChecklistPage() {
  const keys = Object.keys(CHECKLISTS);
  const [kind, setKind] = useState(keys[0]);
  const [checked, setChecked] = useState({});
  const items = CHECKLISTS[kind].items;
  const done = items.filter((item) => checked[`${kind}:${item}`]).length;
  return (
    <>
      <PageTop kicker="서류 체크리스트" title="상담 전에 준비하면 좋은 서류" lead="업무를 고르고 준비된 서류에 체크해 보세요. 이 체크는 이 화면에서만 쓰이고 어디에도 저장되지 않습니다." />
      <section className="dt-section dt-section--tight">
        <div className="dt-wrap dt-check">
          <div className="dt-check__tabs" role="tablist" aria-label="업무 선택">
            {keys.map((key) => <button key={key} type="button" role="tab" aria-selected={kind === key} onClick={() => setKind(key)}>{CHECKLISTS[key].label}</button>)}
          </div>
          <div className="dt-check__panel" role="tabpanel">
            <div className="dt-progress" aria-live="polite">
              <p><b>{done}</b> / {items.length}개 준비됨</p>
              <i><b style={{ width: `${(done / items.length) * 100}%` }} /></i>
            </div>
            <ul>
              {items.map((item) => {
                const id = `${kind}:${item}`;
                return (
                  <li key={id} className={checked[id] ? 'is-on' : ''}>
                    <label><input type="checkbox" checked={Boolean(checked[id])} onChange={(event) => setChecked((current) => ({ ...current, [id]: event.target.checked }))} /><span className="dt-box" aria-hidden="true"><Check size={14} /></span>{item}</label>
                  </li>
                );
              })}
            </ul>
            <div className="dt-check__actions">
              {done === items.length ? <p className="dt-ready">모두 준비됐어요! 상담을 신청해 주세요.</p> : null}
              <button type="button" className="dt-btn dt-btn--line" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> 목록 인쇄</button>
              <Link to="contact" className="dt-btn">상담 신청</Link>
            </div>
          </div>
          <Photo name="binders" className="dt-check__img" />
        </div>
      </section>
    </>
  );
}

function FeesPage() {
  return (
    <>
      <PageTop kicker="수수료" title="기장 수수료 안내" lead="매출 규모와 업무 범위에 따라 달라지며, 첫 상담에서 정확한 금액을 안내합니다. (부가세 별도, 예시 금액)" />
      <section className="dt-section dt-section--tight">
        <div className="dt-wrap">
          <table className="dt-fees">
            <thead><tr><th scope="col">구분</th><th scope="col">월 기장료</th><th scope="col">포함 업무</th></tr></thead>
            <tbody>{FEES.map(([kind, fee, note]) => <tr key={kind}><th scope="row">{kind}</th><td>{fee}</td><td>{note}</td></tr>)}</tbody>
          </table>
          <p className="dt-fine">종합소득세·법인세 신고 조정료는 별도이며, 첫 달 기장료는 무료입니다.</p>
        </div>
      </section>
    </>
  );
}

const INITIAL = Object.freeze({ type: '', topic: '', name: '', phone: '', message: '', agree: false });

function ContactPage() {
  const validate = useCallback((values) => ({
    type: values.type ? '' : '사업자 유형을 선택해 주세요.',
    topic: values.topic ? '' : '상담 주제를 선택해 주세요.',
    name: values.name.trim() ? '' : '성함을 입력해 주세요.',
    phone: /^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(values.phone.trim()) ? '' : '연락처를 확인해 주세요.',
    agree: values.agree ? '' : '개인정보 수집에 동의해 주세요.',
  }), []);
  const { values, errors, status, update, setValue, submit, reset, formRef } = useMockForm(INITIAL, validate);
  return (
    <>
      <PageTop kicker="상담 신청" title="무료 세무 진단을 받아 보세요" lead="담당 세무사가 영업일 기준 하루 안에 연락드립니다." />
      <section className="dt-section dt-section--tight">
        <div className="dt-wrap dt-contact">
          {status === 'done' ? (
            <div className="dt-done" role="status"><Check size={32} aria-hidden="true" /><h2>상담 신청이 정리되었습니다.</h2><p>{values.name}님 · {values.topic}</p><p className="dt-fine">※ 시안이므로 실제로 접수되지 않습니다.</p><button type="button" className="dt-btn dt-btn--line" onClick={reset}>다시 작성</button></div>
          ) : (
            <form ref={formRef} className="dt-form" noValidate onSubmit={submit}>
              <fieldset><legend>사업자 유형</legend><div className="dt-pills">{['예비 창업자', '개인사업자', '법인', '프리랜서'].map((value) => <button key={value} type="button" name="type" aria-pressed={values.type === value} onClick={() => setValue('type', value)}>{value}</button>)}</div></fieldset>
              <label>상담 주제
                <select name="topic" value={values.topic} onChange={update} aria-invalid={Boolean(errors.topic)}><option value="">선택해 주세요</option>{SERVICES.map((service) => <option key={service.id}>{service.title}</option>)}</select>
              </label>
              <div className="dt-form__row">
                <label>성함<input name="name" value={values.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} /></label>
                <label>연락처<input name="phone" inputMode="tel" placeholder="010-0000-0000" value={values.phone} onChange={update} autoComplete="tel" aria-invalid={Boolean(errors.phone)} /></label>
              </div>
              <label>문의 내용 (선택)<textarea name="message" rows={4} value={values.message} onChange={update} placeholder="업종, 연 매출 규모, 궁금한 점을 적어 주세요." /></label>
              <label className="dt-agree"><input type="checkbox" name="agree" checked={values.agree} onChange={update} />상담을 위한 개인정보 수집·이용에 동의합니다.</label>
              {Object.values(errors).some(Boolean) ? <p className="dt-error" role="alert">{Object.values(errors).find(Boolean)}</p> : null}
              <button type="submit" className="dt-btn dt-btn--full" disabled={status === 'pending'}>{status === 'pending' ? '확인 중…' : '상담 신청하기'}</button>
            </form>
          )}
          <aside className="dt-side"><DeadlineCard /><div className="dt-side__info"><p>{OFFICE.address}</p><p>{OFFICE.hours}</p><a href={`tel:${OFFICE.phone.replace(/-/g, '')}`}>{OFFICE.phone}</a></div></aside>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return <PageTop kicker="404" title="페이지를 찾을 수 없습니다." />;
}

function resolvePage(page) {
  const [section, slug] = page.split('/');
  const make = (Page, title) => ({ Page, title: `${title} — ${OFFICE.name}` });
  if (slug) return make(NotFoundPage, '페이지를 찾을 수 없습니다');
  if (!section) return { Page: HomePage, title: `${OFFICE.name} — 세금 걱정은 덜고 사업에 집중하세요` };
  const pages = { services: [ServicesPage, '업무 안내'], checklist: [ChecklistPage, '서류 체크리스트'], fees: [FeesPage, '수수료'], contact: [ContactPage, '상담 신청'] };
  return pages[section] ? make(...pages[section]) : make(NotFoundPage, '페이지를 찾을 수 없습니다');
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  return (
    <div className="dt" ref={root}>
      <Header />
      <main id="site-main" tabIndex={-1}><Page key={page} /></main>
      <footer className="dt-footer">
        <div className="dt-wrap dt-footer__inner">
          <Logo />
          <p>{OFFICE.address} · 대표 세무사 ○○○ · 사업자등록번호 000-00-00000 · {OFFICE.phone}</p>
          <p>© 2026 {OFFICE.name}. 나나웹이 제작한 가상 세무사무소 시안이며 세무 자문을 제공하지 않습니다.</p>
          <PhotoCredits keys={ALL_PHOTO_KEYS} extra="" />
        </div>
      </footer>
    </div>
  );
}
