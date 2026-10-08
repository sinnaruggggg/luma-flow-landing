import { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, Menu, Phone, X } from 'lucide-react';
import { usePageTitle, useSite } from '../_kit/siteContext.js';
import { Link } from '../_kit/SiteProvider.jsx';
import { MenuDrawer } from '../_kit/MenuDrawer.jsx';
import { PhotoCredits } from '../_kit/SampleBadge.jsx';
import { useFonts, useReveal, useScrolled } from '../_kit/hooks.js';
import { ALL_PHOTO_KEYS, AREAS, ARTICLES, FIRM, LEGAL, NAV, NOTICES } from './content.js';
import { AboutPage, AreaPage, ArticlePage, ContactPage, HomePage, InsightsPage, NoticeDetailPage, NoticePage, NotFoundPage, PeoplePage, PracticePage } from './Pages.jsx';
import './site.css';

const FONTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700&display=swap',
];

// 주소(page)에 맞는 화면을 고릅니다.
function resolvePage(page) {
  const [section, slug] = page.split('/');
  const titled = (Page, title, props = {}) => ({ Page, props, title: `${title} — ${FIRM.name}` });
  if (!section) return { Page: HomePage, props: {}, title: `${FIRM.name} — 원칙대로 풀어가는 법률 파트너` };
  if (section === 'about' && !slug) return titled(AboutPage, '사무소 소개');
  if (section === 'practice' && !slug) return titled(PracticePage, '업무 분야');
  if (section === 'practice') {
    const area = AREAS.find((item) => item.slug === slug);
    if (area) return titled(AreaPage, area.title, { area });
  }
  if (section === 'people' && !slug) return titled(PeoplePage, '구성원');
  if (section === 'insights' && !slug) return titled(InsightsPage, '법률 칼럼');
  if (section === 'insights') {
    const article = ARTICLES.find((item) => item.slug === slug);
    if (article) return titled(ArticlePage, article.title, { article });
  }
  if (section === 'notice' && !slug) return titled(NoticePage, '공지사항');
  if (section === 'notice') {
    const notice = NOTICES.find((item) => item.id === slug);
    if (notice) return titled(NoticeDetailPage, notice.title, { notice });
  }
  if (section === 'contact' && !slug) return titled(ContactPage, '상담 예약');
  return titled(NotFoundPage, '페이지를 찾을 수 없습니다');
}

function Logo() {
  return (
    <Link to="" className="hg-logo" aria-label={`${FIRM.name} 홈`}>
      <span className="hg-logo__mark" aria-hidden="true">결</span>
      <span className="hg-logo__text"><b>{FIRM.short}</b><small>법률사무소</small></span>
    </Link>
  );
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <div className="hg-util">
        <div className="hg-wrap">
          <span><Clock size={14} aria-hidden="true" /> {FIRM.hours} · {FIRM.after}</span>
          <a href={`tel:${FIRM.phone.replace(/-/g, '')}`}><Phone size={14} aria-hidden="true" /> 대표 상담 {FIRM.phone}</a>
        </div>
      </div>
      <header className={`hg-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="hg-wrap hg-header__inner">
          <Logo />
          <nav className="hg-nav" aria-label="주 메뉴">
            {NAV.filter(([to]) => to !== 'contact').map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>
          <Link to="contact" className="hg-btn hg-btn--navy hg-header__cta">상담 예약</Link>
          <button type="button" className="hg-burger" aria-label="전체 메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
        </div>
      </header>
      <MenuDrawer open={open} onClose={close} className="hg-drawer">
        <div className="hg-drawer__top">
          <span className="hg-logo__text"><b>{FIRM.short}</b><small>법률사무소</small></span>
          <button type="button" aria-label="메뉴 닫기" onClick={close}><X aria-hidden="true" /></button>
        </div>
        <nav aria-label="모바일 메뉴">
          <Link to="" onClick={close}>홈</Link>
          {NAV.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}</Link>)}
        </nav>
        <a className="hg-drawer__call" href={`tel:${FIRM.phone.replace(/-/g, '')}`}><Phone size={18} aria-hidden="true" /> {FIRM.phone}</a>
      </MenuDrawer>
    </>
  );
}

function LegalDialog({ kind, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);
  const titles = { terms: '이용약관 (예시)', privacy: '개인정보 처리방침 (예시)', ad: '변호사 광고 고지 (예시)' };
  return (
    <dialog ref={ref} className="hg-dialog" onClose={onClose} aria-labelledby="hg-legal-title">
      <div>
        <h2 id="hg-legal-title">{titles[kind] || ''}</h2>
        {kind ? LEGAL[kind].map((line) => <p key={line}>{line}</p>) : null}
        <button type="button" className="hg-btn hg-btn--navy" onClick={onClose}>닫기</button>
      </div>
    </dialog>
  );
}

function Footer({ onLegal }) {
  return (
    <footer className="hg-footer">
      <div className="hg-wrap hg-footer__grid">
        <div>
          <p className="hg-footer__name">{FIRM.name}</p>
          <p className="hg-footer__en">{FIRM.english}</p>
        </div>
        <ul>
          <li>대표변호사 {FIRM.owner} · 광고책임변호사 {FIRM.owner}</li>
          <li>{FIRM.address}</li>
          <li>대표전화 {FIRM.phone} · {FIRM.hours}</li>
          <li>{FIRM.registration} · 사업자등록번호 {FIRM.business}</li>
          <li>{FIRM.email} · FAX {FIRM.fax}</li>
        </ul>
        <nav aria-label="하단 메뉴">
          {NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
      </div>
      <div className="hg-wrap hg-footer__legal">
        <button type="button" onClick={() => onLegal('terms')}>이용약관</button>
        <button type="button" onClick={() => onLegal('privacy')}>개인정보 처리방침</button>
        <button type="button" onClick={() => onLegal('ad')}>변호사 광고 고지</button>
      </div>
      <div className="hg-wrap hg-footer__bottom">
        <p>© 2026 {FIRM.name}. 이 사이트는 나나웹이 제작한 가상 업체 시안이며 법률 자문을 제공하지 않습니다.</p>
        <PhotoCredits keys={ALL_PHOTO_KEYS} className="hg-credits" />
      </div>
    </footer>
  );
}

export default function Site() {
  useFonts(FONTS);
  const { page } = useSite();
  const { Page, props, title } = resolvePage(page);
  usePageTitle(title);
  const root = useReveal([page]);
  const [legal, setLegal] = useState(null);
  return (
    <div className="hg" ref={root}>
      <a className="hg-skip" href="#site-main">본문 바로가기</a>
      <Header />
      <main id="site-main" tabIndex={-1}>
        <Page key={page} {...props} />
      </main>
      <Footer onLegal={setLegal} />
      <LegalDialog kind={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
