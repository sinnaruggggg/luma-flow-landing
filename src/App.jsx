import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { showcasePages } from "./content/showcasePages";

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function usePointerBackdrop() {
  const nodeRef = useRef(null);

  const updatePointer = (clientX, clientY) => {
    const node = nodeRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    node.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x))}%`);
    node.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y))}%`);
  };

  return {
    containerRef: nodeRef,
    onPointerMove: (event) => updatePointer(event.clientX, event.clientY),
    onPointerLeave: () => {
      const node = nodeRef.current;
      if (!node) return;
      node.style.setProperty("--pointer-x", "50%");
      node.style.setProperty("--pointer-y", "20%");
    },
  };
}

function SceneBackdrop({ variant, scope = "detail" }) {
  return (
    <div className="scene-backdrop" data-style={variant} data-scope={scope} aria-hidden="true">
      <Motion.div
        className="scene-backdrop__orb scene-backdrop__orb--a"
        animate={{ x: [0, 36, -18, 0], y: [0, -28, 22, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="scene-backdrop__orb scene-backdrop__orb--b"
        animate={{ x: [0, -32, 20, 0], y: [0, 18, -24, 0], scale: [1, 0.94, 1.06, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <Motion.div
        className="scene-backdrop__orb scene-backdrop__orb--c"
        animate={{ x: [0, 22, -24, 0], y: [0, -18, 20, 0], rotate: [0, 10, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <Motion.div
        className="scene-backdrop__ribbon scene-backdrop__ribbon--a"
        animate={{ rotate: [0, 10, -6, 0], x: [0, -24, 14, 0], y: [0, 20, -14, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <Motion.div
        className="scene-backdrop__ribbon scene-backdrop__ribbon--b"
        animate={{ rotate: [0, -12, 8, 0], x: [0, 18, -18, 0], y: [0, -20, 16, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <div className="scene-backdrop__mesh" />
      <div className="scene-backdrop__cursor" />
      <div className="scene-backdrop__grain" />
    </div>
  );
}

function themeStyle(theme) {
  return {
    "--page-bg": theme.bg,
    "--page-surface": theme.surface,
    "--page-panel": theme.panel,
    "--page-text": theme.text,
    "--page-muted": theme.muted,
    "--page-accent": theme.accent,
    "--page-accent-soft": theme.accentSoft,
    "--page-line": theme.line,
    "--page-shadow": theme.shadow,
    "--page-button-text": theme.buttonText,
  };
}

function Badge({ children, dark = false }) {
  return <span className={`badge ${dark ? "badge--dark" : ""}`}>{children}</span>;
}

function BadgeRow({ items = [] }) {
  return (
    <div className="badge-row">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

function NavRow({ items = [] }) {
  return (
    <div className="nav-row">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ActionRow({ primary, secondary }) {
  return (
    <div className="action-row">
      <button type="button" className="action-button action-button--primary">
        {primary}
        <ArrowRight size={18} />
      </button>
      <button type="button" className="action-button action-button--secondary">
        {secondary}
      </button>
    </div>
  );
}

function StatStrip({ items = [] }) {
  return (
    <div className="stat-strip">
      {items.map(([value, label]) => (
        <article key={`${value}-${label}`} className="stat-card">
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}

function SectionBlock({ label, title, className = "", children }) {
  return (
    <section className={`section-block ${className}`}>
      <div className="section-block__head">
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ImageCard({ src, label, title, className = "" }) {
  return (
    <article className={`image-card ${className}`}>
      <img src={src} alt={title} />
      <div className="image-card__copy">
        <span>{label}</span>
        <strong>{title}</strong>
      </div>
    </article>
  );
}

function PriceDeck({ items = [], className = "" }) {
  return (
    <div className={`price-deck ${className}`}>
      {items.map(([title, meta, value]) => (
        <article key={`${title}-${value}`} className="price-card">
          <span>{meta}</span>
          <strong>{title}</strong>
          <em>{value}</em>
        </article>
      ))}
    </div>
  );
}

function TokenRail({ items = [], className = "" }) {
  return (
    <div className={`token-rail ${className}`}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function MiniPanel({ title, rows = [], className = "" }) {
  return (
    <article className={`mini-panel ${className}`}>
      <strong className="mini-panel__title">{title}</strong>
      <div className="mini-panel__rows">
        {rows.map((row) =>
          Array.isArray(row) ? (
            <div key={`${title}-${row[0]}`} className="mini-panel__row">
              <span>{row[0]}</span>
              <b>{row[1]}</b>
            </div>
          ) : (
            <div key={`${title}-${row}`} className="mini-panel__chip">
              {row}
            </div>
          ),
        )}
      </div>
    </article>
  );
}

function CompareTable({ headers = [], rows = [] }) {
  return (
    <div className="compare-table">
      <div className="compare-table__head">
        {headers.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.join("-")} className="compare-table__row">
          {row.map((cell) => (
            <span key={cell}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function GalleryCard({ page, onOpen }) {
  return (
    <Motion.button
      type="button"
      className="gallery-card"
      data-tone={page.card.tone}
      data-size={page.card.size}
      onClick={() => onOpen(page.id)}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <div className="gallery-card__visual">
        <img src={page.images.hero} alt={`${page.brand} 미리보기`} />
        <div className="gallery-card__veil" />
        <span className="gallery-card__eyebrow">{page.card.eyebrow}</span>
        <div className="gallery-card__widgets">
          {page.card.widgets.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="gallery-card__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
      </div>

      <div className="gallery-card__body">
        <div className="gallery-card__nav">
          {page.nav.slice(0, 3).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <h3>{page.card.title}</h3>
        <p>{page.summary}</p>
        <span className="gallery-card__action">
          페이지 보기
          <ChevronRight size={18} />
        </span>
      </div>
    </Motion.button>
  );
}

function GalleryHome({ pages, onOpen }) {
  const { containerRef, onPointerMove, onPointerLeave } = usePointerBackdrop();

  return (
    <div className="gallery-home" ref={containerRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <SceneBackdrop variant="gallery" scope="home" />
      <div className="gallery-home__content">
        <header className="gallery-topbar">
          <div className="gallery-topbar__brand">
            <span className="gallery-topbar__dot">
              <Sparkles size={14} />
            </span>
            <strong>LUMA FLOW</strong>
          </div>
          <div className="gallery-topbar__meta">
            <span>20개</span>
            <span>독립 페이지</span>
            <span>한글 중심</span>
          </div>
        </header>

        <section className="gallery-hero">
          <Reveal>
            <BadgeRow items={["20개 샘플", "단일 페이지", "설명 최소"]} />
            <h1>바로 고르고 바로 비교하는 20개의 독립 홈페이지</h1>
            <p>카드 하나가 사이트 하나입니다.</p>
          </Reveal>
        </section>

        <section className="gallery-grid">
          {pages.map((page, index) => (
            <Reveal key={page.id} delay={index * 0.02}>
              <GalleryCard page={page} onOpen={onOpen} />
            </Reveal>
          ))}
        </section>
      </div>
    </div>
  );
}

function PageShell({ page, onBack, children }) {
  const { containerRef, onPointerMove, onPointerLeave } = usePointerBackdrop();

  return (
    <div
      className="page-view"
      data-tone={page.backdrop}
      data-page={page.id}
      style={themeStyle(page.theme)}
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <SceneBackdrop variant={page.backdrop} />
      <div className="page-view__content">
        <header className="page-topbar">
          <button type="button" className="page-topbar__back" onClick={onBack}>
            <ArrowLeft size={18} />
            샘플 목록
          </button>

          <div className="page-topbar__brand">
            <span>{page.industry}</span>
            <strong>{page.brand}</strong>
          </div>

          <button type="button" className="page-topbar__cta">
            {page.hero.primary}
          </button>
        </header>

        <main className="page-main">{children}</main>
      </div>
    </div>
  );
}

function HeroLead({ page }) {
  return (
    <div className="hero-lead">
      <BadgeRow items={page.hero.badges} />
      <span className="hero-lead__eyebrow">{page.hero.eyebrow}</span>
      <h1>{page.hero.title}</h1>
      <p>{page.hero.subtitle}</p>
      <NavRow items={page.nav} />
      <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
      <StatStrip items={page.stats} />
    </div>
  );
}

function SneakerDropPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--drop">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--drop">
          <ImageCard src={page.images.hero} label="오늘 드롭" title={page.brand} className="image-card--hero" />
          <MiniPanel title="바로 고르기" rows={page.miniPanels} className="mini-panel--accent" />
          <ImageCard src={page.images.product} label="신규 룩" title="Aero Runner" className="image-card--float" />
        </div>
      </section>

      <SectionBlock label="드롭" title="바로 담는 구성">
        <PriceDeck items={page.drops} />
      </SectionBlock>

      <section className="split-zone">
        <MiniPanel title="AI 사이즈" rows={page.miniPanels} />
        <MiniPanel title="빠른 기능" rows={page.quickTools} />
      </section>

      <SectionBlock label="룩북" title="지금 화면">
        <div className="image-deck image-deck--triple">
          <ImageCard src={page.images.product} label="제품" title="드롭 컷" />
          <ImageCard src={page.images.scene} label="현장" title="매장 컷" />
          <ImageCard src={page.images.hero} label="메인" title="히어로 컷" />
        </div>
      </SectionBlock>
    </PageShell>
  );
}

function SupplementBrandPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--routine">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--routine">
          <ImageCard src={page.images.hero} label="루틴" title={page.brand} className="image-card--hero" />
          <PriceDeck items={page.routines} className="price-deck--stack" />
        </div>
      </section>

      <SectionBlock label="비교" title="성분 한 줄 비교">
        <CompareTable headers={["항목", "퍼포먼스", "회복"]} rows={page.compareRows} />
      </SectionBlock>

      <section className="split-zone split-zone--compact">
        <ImageCard src={page.images.product} label="제품" title="오늘 조합" />
        <MiniPanel title="구독" rows={page.plans} />
      </section>
    </PageShell>
  );
}

function BoxingGymPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--booking">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--booking">
          <ImageCard src={page.images.hero} label="체험 등록" title={page.brand} className="image-card--hero" />
          <MiniPanel title="오늘 수업" rows={page.classSlots} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="코치" title="바로 고르는 코치">
        <TokenRail items={page.coaches} className="token-rail--wide" />
      </SectionBlock>

      <SectionBlock label="요금" title="체험부터 정규반까지">
        <PriceDeck items={page.plans} />
      </SectionBlock>

      <div className="image-deck image-deck--split">
        <ImageCard src={page.images.product} label="프로그램" title="클래스 컷" />
        <ImageCard src={page.images.scene} label="현장" title="체육관 컷" />
      </div>
    </PageShell>
  );
}

function WealthAppPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--dashboard">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--dashboard">
          <ImageCard src={page.images.hero} label="대시보드" title="이번 달" className="image-card--hero" />
          <MiniPanel title="목표 보드" rows={page.boards} />
        </div>
      </section>

      <SectionBlock label="목표" title="지금 진행 중">
        <PriceDeck items={page.goals} />
      </SectionBlock>

      <section className="split-zone">
        <ImageCard src={page.images.product} label="리포트" title="주간 요약" />
        <MiniPanel title="추천 카드" rows={page.cards} />
      </section>
    </PageShell>
  );
}

function SkinClinicPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--clinic">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--clinic">
          <MiniPanel title="AI 스캔" rows={page.slots.slice(0, 3)} className="mini-panel--accent" />
          <ImageCard src={page.images.hero} label="상담실" title={page.brand} className="image-card--hero" />
        </div>
      </section>

      <SectionBlock label="프로그램" title="오늘 추천 구성">
        <PriceDeck items={page.programs} />
      </SectionBlock>

      <section className="split-zone split-zone--compact">
        <MiniPanel title="의료진" rows={page.doctors} />
        <MiniPanel title="예약 가능" rows={page.slots} />
      </section>
    </PageShell>
  );
}

function ArchStudioPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--editorial">
        <div className="hero-lead">
          <BadgeRow items={page.hero.badges} />
          <span className="hero-lead__eyebrow">{page.hero.eyebrow}</span>
          <h1>{page.hero.title}</h1>
          <p>{page.hero.subtitle}</p>
          <TokenRail items={page.nav} />
          <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
        </div>
        <div className="mosaic-grid">
          <ImageCard src={page.images.hero} label="작업" title="메인 프로젝트" className="image-card--hero" />
          <ImageCard src={page.images.product} label="도면" title="제안 컷" />
          <ImageCard src={page.images.scene} label="현장" title="오픈 컷" />
        </div>
      </section>

      <SectionBlock label="작업" title="지금 보는 유형">
        <TokenRail items={page.works} className="token-rail--wide" />
      </SectionBlock>

      <section className="split-zone">
        <MiniPanel title="진행" rows={page.process} />
        <MiniPanel title="브리프" rows={page.briefRows} />
      </section>
    </PageShell>
  );
}

function BeautyFlashSalePage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--sale">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--sale">
          <ImageCard src={page.images.hero} label="핫딜" title={page.brand} className="image-card--hero" />
          <MiniPanel title="체크아웃" rows={page.checkout} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="세트" title="가장 빨리 담는 구성">
        <PriceDeck items={page.kits} />
      </SectionBlock>

      <SectionBlock label="발색" title="색상 먼저">
        <TokenRail items={page.shades} className="token-rail--color" />
      </SectionBlock>

      <div className="image-deck image-deck--split">
        <ImageCard src={page.images.product} label="발색" title="제품 컷" />
        <ImageCard src={page.images.scene} label="현장" title="캠페인 컷" />
      </div>
    </PageShell>
  );
}

function FestivalPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--festival">
        <div className="hero-lead">
          <BadgeRow items={page.hero.badges} />
          <span className="hero-lead__eyebrow">{page.hero.eyebrow}</span>
          <h1>{page.hero.title}</h1>
          <p>{page.hero.subtitle}</p>
          <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
          <StatStrip items={page.stats} />
        </div>
        <div className="hero-visual hero-visual--festival">
          <MiniPanel title="라인업" rows={page.lineup} className="mini-panel--accent" />
          <ImageCard src={page.images.hero} label="메인 스테이지" title={page.brand} className="image-card--hero" />
        </div>
      </section>

      <SectionBlock label="시간표" title="오늘 동선">
        <TokenRail items={page.timetable} className="token-rail--wide" />
      </SectionBlock>

      <SectionBlock label="티켓" title="입장 옵션">
        <PriceDeck items={page.tickets} />
      </SectionBlock>
    </PageShell>
  );
}

function CreatorClubPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--club">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--club">
          <PriceDeck items={page.passes} className="price-deck--stack" />
          <ImageCard src={page.images.hero} label="멤버십" title={page.brand} className="image-card--hero" />
        </div>
      </section>

      <section className="split-zone">
        <MiniPanel title="혜택" rows={page.perks} />
        <MiniPanel title="피드" rows={page.posts} />
      </section>

      <div className="image-deck image-deck--split">
        <ImageCard src={page.images.product} label="워크룸" title="멤버 컷" />
        <ImageCard src={page.images.scene} label="이벤트" title="커뮤니티 컷" />
      </div>
    </PageShell>
  );
}

function EvMobilityPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--compare">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--compare">
          <ImageCard src={page.images.hero} label="시승 예약" title={page.brand} className="image-card--hero" />
          <MiniPanel title="핵심 사양" rows={page.specs} />
        </div>
      </section>

      <SectionBlock label="모델" title="바로 비교">
        <PriceDeck items={page.models} />
      </SectionBlock>

      <section className="split-zone">
        <ImageCard src={page.images.product} label="모델" title="차량 컷" />
        <MiniPanel title="플래너" rows={page.planner} className="mini-panel--accent" />
      </section>
    </PageShell>
  );
}

function GamingGearPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--setup">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--setup">
          <ImageCard src={page.images.hero} label="셋업" title={page.brand} className="image-card--hero" />
          <MiniPanel title="카트" rows={page.cartRows} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="기어" title="바로 담는 조합">
        <PriceDeck items={page.gear} />
      </SectionBlock>

      <SectionBlock label="사양" title="핵심 체크">
        <TokenRail items={page.specs} className="token-rail--wide" />
      </SectionBlock>

      <ImageCard src={page.images.scene} label="현장" title="셋업 컷" />
    </PageShell>
  );
}

function AiSaasPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--pipeline">
        <div className="hero-lead">
          <BadgeRow items={page.hero.badges} />
          <span className="hero-lead__eyebrow">{page.hero.eyebrow}</span>
          <h1>{page.hero.title}</h1>
          <p>{page.hero.subtitle}</p>
          <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
          <TokenRail items={page.flows} className="token-rail--wide" />
        </div>
        <div className="hero-visual hero-visual--pipeline">
          <ImageCard src={page.images.hero} label="실시간 데모" title={page.brand} className="image-card--hero" />
          <MiniPanel title="사용 사례" rows={page.useCases} />
        </div>
      </section>

      <SectionBlock label="성과" title="팀이 먼저 보는 숫자">
        <TokenRail items={page.kpis} className="token-rail--wide" />
      </SectionBlock>

      <div className="image-deck image-deck--split">
        <ImageCard src={page.images.product} label="제품" title="플로우 컷" />
        <ImageCard src={page.images.scene} label="팀" title="사용 장면" />
      </div>
    </PageShell>
  );
}

function IndieBookstorePage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--shelf">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--shelf">
          <ImageCard src={page.images.hero} label="이번 주 셀렉션" title={page.brand} className="image-card--hero" />
          <MiniPanel title="메모" rows={page.notes} />
        </div>
      </section>

      <SectionBlock label="큐레이션" title="선반 전체">
        <TokenRail items={page.shelf} className="token-rail--wide" />
      </SectionBlock>

      <SectionBlock label="선물" title="바로 고르는 구성">
        <PriceDeck items={page.picks} />
      </SectionBlock>
    </PageShell>
  );
}

function StationeryShopPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--kit">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--kit">
          <ImageCard src={page.images.hero} label="데스크 키트" title={page.brand} className="image-card--hero" />
          <MiniPanel title="바스켓" rows={page.basket} />
        </div>
      </section>

      <SectionBlock label="키트" title="바로 만드는 조합">
        <PriceDeck items={page.kits} />
      </SectionBlock>

      <SectionBlock label="컬러" title="지금 고르는 색">
        <TokenRail items={page.colors} className="token-rail--color" />
      </SectionBlock>
    </PageShell>
  );
}

function LocalCafePage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--menu">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--menu">
          <ImageCard src={page.images.hero} label="오늘 메뉴" title={page.brand} className="image-card--hero" />
          <MiniPanel title="좌석" rows={page.seats} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="메뉴" title="바로 고르는 메뉴">
        <PriceDeck items={page.menus} />
      </SectionBlock>

      <SectionBlock label="매장" title="기본 정보">
        <TokenRail items={page.storeRows} className="token-rail--wide" />
      </SectionBlock>
    </PageShell>
  );
}

function BoutiqueHotelPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--hotel">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--hotel">
          <ImageCard src={page.images.hero} label="객실 선택" title={page.brand} className="image-card--hero" />
          <MiniPanel title="날짜" rows={page.dates} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="객실" title="바로 고르는 타입">
        <PriceDeck items={page.rooms} />
      </SectionBlock>

      <SectionBlock label="포함" title="기본 제공">
        <TokenRail items={page.perks} className="token-rail--wide" />
      </SectionBlock>

      <ImageCard src={page.images.scene} label="현장" title="스테이 컷" />
    </PageShell>
  );
}

function PerfumeHousePage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--scent">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--scent">
          <ImageCard src={page.images.hero} label="시그니처" title={page.brand} className="image-card--hero" />
          <MiniPanel title="노트" rows={page.notes} />
        </div>
      </section>

      <SectionBlock label="세트" title="먼저 고르는 구성">
        <PriceDeck items={page.sets} />
      </SectionBlock>

      <SectionBlock label="선택" title="자주 쓰는 흐름">
        <TokenRail items={page.matches} className="token-rail--wide" />
      </SectionBlock>
    </PageShell>
  );
}

function FurnitureStorePage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--room">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--room">
          <ImageCard src={page.images.hero} label="룸 기준" title={page.brand} className="image-card--hero" />
          <MiniPanel title="배치" rows={page.placement} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="룸" title="먼저 고를 공간">
        <TokenRail items={page.rooms} className="token-rail--wide" />
      </SectionBlock>

      <SectionBlock label="세트" title="바로 사는 조합">
        <PriceDeck items={page.bundles} />
      </SectionBlock>
    </PageShell>
  );
}

function YouthFashionPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--look">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--look">
          <ImageCard src={page.images.hero} label="룩 먼저" title={page.brand} className="image-card--hero" />
          <MiniPanel title="장바구니" rows={page.cartRows} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="룩" title="바로 담는 조합">
        <PriceDeck items={page.looks} />
      </SectionBlock>

      <SectionBlock label="사이즈" title="가상 착용 전 선택">
        <TokenRail items={page.sizes} className="token-rail--wide" />
      </SectionBlock>

      <div className="image-deck image-deck--split">
        <ImageCard src={page.images.product} label="제품" title="상세 컷" />
        <ImageCard src={page.images.scene} label="현장" title="룩북 컷" />
      </div>
    </PageShell>
  );
}

function JewelryBrandPage({ page, onBack }) {
  return (
    <PageShell page={page} onBack={onBack}>
      <section className="hero-layout hero-layout--luxury">
        <HeroLead page={page} />
        <div className="hero-visual hero-visual--luxury">
          <ImageCard src={page.images.hero} label="컬렉션" title={page.brand} className="image-card--hero" />
          <MiniPanel title="상담" rows={page.consultRows} className="mini-panel--accent" />
        </div>
      </section>

      <SectionBlock label="컬렉션" title="바로 보는 제품">
        <PriceDeck items={page.collections} />
      </SectionBlock>

      <SectionBlock label="맞춤" title="진행 순서">
        <TokenRail items={page.bespoke} className="token-rail--wide" />
      </SectionBlock>

      <ImageCard src={page.images.product} label="제품" title="디테일 컷" />
    </PageShell>
  );
}

const pageMap = {
  "sneaker-drop": SneakerDropPage,
  "supplement-brand": SupplementBrandPage,
  "boxing-gym": BoxingGymPage,
  "wealth-app": WealthAppPage,
  "skin-clinic": SkinClinicPage,
  "arch-studio": ArchStudioPage,
  "beauty-flash-sale": BeautyFlashSalePage,
  "festival-page": FestivalPage,
  "creator-club": CreatorClubPage,
  "ev-mobility": EvMobilityPage,
  "gaming-gear": GamingGearPage,
  "ai-saas": AiSaasPage,
  "indie-bookstore": IndieBookstorePage,
  "stationery-shop": StationeryShopPage,
  "local-cafe": LocalCafePage,
  "boutique-hotel": BoutiqueHotelPage,
  "perfume-house": PerfumeHousePage,
  "furniture-store": FurnitureStorePage,
  "youth-fashion": YouthFashionPage,
  "jewelry-brand": JewelryBrandPage,
};

export default function App() {
  const [selectedPageId, setSelectedPageId] = useState(null);

  const selectedPage = useMemo(
    () => showcasePages.find((page) => page.id === selectedPageId) ?? null,
    [selectedPageId],
  );

  const openPage = (pageId) => {
    setSelectedPageId(pageId);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const closePage = () => {
    setSelectedPageId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const CurrentPage = selectedPage ? pageMap[selectedPage.id] : null;

  return (
    <AnimatePresence mode="wait">
      {selectedPage && CurrentPage ? (
        <Motion.div key={selectedPage.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>
          <CurrentPage page={selectedPage} onBack={closePage} />
        </Motion.div>
      ) : (
        <Motion.div key="gallery" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>
          <GalleryHome pages={showcasePages} onOpen={openPage} />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
