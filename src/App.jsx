import { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { showcasePages } from "./content/showcasePages";
import { EffectStage } from "./components/interactiveEffects";
import "./app-v3.css";

const pageDesigns = {
  "sneaker-drop": { effect: "magnetic", preview: "drop", header: "ticker", hero: "drop" },
  "supplement-brand": { effect: "rain", preview: "product", header: "capsule", hero: "routine" },
  "boxing-gym": { effect: "links", preview: "gym", header: "score", hero: "training" },
  "wealth-app": { effect: "lens", preview: "dashboard", header: "ledger", hero: "dashboard" },
  "skin-clinic": { effect: "wave", preview: "clinic", header: "clean", hero: "clinic" },
  "arch-studio": { effect: "parallax", preview: "editorial", header: "editorial", hero: "studio" },
  "beauty-flash-sale": { effect: "fluid", preview: "sale", header: "promo", hero: "sale" },
  "festival-page": { effect: "rails", preview: "poster", header: "poster", hero: "poster" },
  "creator-club": { effect: "mesh", preview: "club", header: "club", hero: "feed" },
  "ev-mobility": { effect: "boxes", preview: "compare", header: "tech", hero: "compare" },
  "gaming-gear": { effect: "glitch", preview: "setup", header: "console", hero: "setup" },
  "ai-saas": { effect: "lines", preview: "bento", header: "glass", hero: "pipeline" },
  "indie-bookstore": { effect: "ink", preview: "shelf", header: "editorial", hero: "shelf" },
  "stationery-shop": { effect: "sand", preview: "paper", header: "paper", hero: "paper" },
  "local-cafe": { effect: "smoke", preview: "warm", header: "warm", hero: "menu" },
  "boutique-hotel": { effect: "jelly", preview: "stay", header: "luxe", hero: "stay" },
  "perfume-house": { effect: "slime", preview: "scent", header: "luxe", hero: "scent" },
  "furniture-store": { effect: "cloud", preview: "room", header: "organic", hero: "room" },
  "youth-fashion": { effect: "wind", preview: "fashion", header: "play", hero: "fashion" },
  "jewelry-brand": { effect: "hole", preview: "chrome", header: "chrome", hero: "jewelry" },
};

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

function Pill({ children, dark = false, className = "" }) {
  return <span className={`v3-pill ${dark ? "v3-pill--dark" : ""} ${className}`}>{children}</span>;
}

function ActionRow({ primary, secondary, className = "" }) {
  return (
    <div className={`v3-actions ${className}`}>
      <button type="button" className="v3-button v3-button--primary">
        {primary}
        <ArrowRight size={17} />
      </button>
      <button type="button" className="v3-button v3-button--ghost">
        {secondary}
      </button>
    </div>
  );
}

function StatRail({ items = [], className = "" }) {
  return (
    <div className={`v3-stats ${className}`}>
      {items.map(([value, label]) => (
        <article key={`${value}-${label}`} className="v3-stat">
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}

function PriceTiles({ items = [], className = "", compact = false }) {
  return (
    <div className={`v3-priceTiles ${compact ? "v3-priceTiles--compact" : ""} ${className}`}>
      {items.map(([title, meta, value]) => (
        <article key={`${title}-${value}`} className="v3-priceTile">
          <span>{meta}</span>
          <strong>{title}</strong>
          <em>{value}</em>
        </article>
      ))}
    </div>
  );
}

function ChipStrip({ items = [], className = "" }) {
  return (
    <div className={`v3-chipStrip ${className}`}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function MediaCard({ src, label, title, className = "" }) {
  return (
    <figure className={`v3-media ${className}`}>
      <img src={src} alt={title} />
      <figcaption>
        <span>{label}</span>
        <strong>{title}</strong>
      </figcaption>
    </figure>
  );
}

function SiteHeader({ page, variant = "", right = null, center = null }) {
  return (
    <header className={`v3-siteHeader v3-siteHeader--${variant}`}>
      <div className="v3-siteHeader__brand">
        <span>{page.industry}</span>
        <strong>{page.brand}</strong>
      </div>
      {center ? <div className="v3-siteHeader__center">{center}</div> : <ChipStrip items={page.nav} className="v3-siteHeader__nav" />}
      <div className="v3-siteHeader__right">{right ?? <button type="button" className="v3-inlineButton">{page.hero.primary}</button>}</div>
    </header>
  );
}

function IntroBlock({ page, className = "", headingClass = "" }) {
  return (
    <div className={`v3-intro ${className}`}>
      <div className="v3-intro__top">
        <Pill>{page.hero.eyebrow}</Pill>
        <ChipStrip items={page.hero.badges} className="v3-intro__badges" />
      </div>
      <h1 className={`v3-heading ${headingClass}`}>{page.hero.title}</h1>
      <p className="v3-subcopy">{page.hero.subtitle}</p>
      <ActionRow primary={page.hero.primary} secondary={page.hero.secondary} />
    </div>
  );
}

function SectionHeading({ label, title, className = "" }) {
  return (
    <div className={`v3-sectionHeading ${className}`}>
      <span>{label}</span>
      <h2>{title}</h2>
    </div>
  );
}

function GalleryCard({ page, onOpen }) {
  const design = pageDesigns[page.id];

  return (
    <Motion.button
      type="button"
      className="v3-card"
      data-preview={design.preview}
      data-size={page.card.size}
      onClick={() => onOpen(page.id)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      <div className="v3-card__stage">
        <EffectStage kind={design.effect} density="card" />
        <img className="v3-card__image" src={page.images.hero} alt={`${page.brand} 미리보기`} />
        <div className="v3-card__mask" />
        <div className="v3-card__chips">
          <Pill className="v3-card__eyebrow" dark={design.preview === "poster" || design.preview === "chrome"}>
            {page.card.eyebrow}
          </Pill>
          <div className="v3-card__metrics">
            {page.card.widgets.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="v3-card__brand">
          <strong>{page.brand}</strong>
          <span>{page.industry}</span>
        </div>
      </div>
      <div className="v3-card__body">
        <div className="v3-card__nav">
          {page.nav.slice(0, 3).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <h3>{page.card.title}</h3>
        <p>{page.summary}</p>
        <span className="v3-card__action">
          사이트 보기
          <ChevronRight size={18} />
        </span>
      </div>
    </Motion.button>
  );
}

function GalleryHome({ pages, onOpen }) {
  return (
    <div className="v3-app">
      <div className="v3-home">
        <div className="v3-home__halo" />
        <header className="v3-home__topbar">
          <div className="v3-home__brand">
            <span className="v3-home__spark">
              <Sparkles size={14} />
            </span>
            <strong>LUMA FLOW</strong>
          </div>
          <div className="v3-home__meta">
            <span>20개 독립 사이트</span>
            <span>실무형 14 / 실험형 6</span>
            <span>Spline + 인터랙션 참고</span>
          </div>
        </header>
        <section className="v3-home__hero">
          <Pill>실전 레이아웃 샘플</Pill>
          <h1>이미지 몇 장 바꾼 템플릿이 아니라 다른 사이트 20개</h1>
          <p>쇼핑, 예약, SaaS, 티켓, 포트폴리오, 럭셔리 브랜드를 각각 다른 웹 문법으로 다시 풀었습니다.</p>
        </section>
        <section className="v3-home__grid">
          {pages.map((page, index) => (
            <Motion.div
              key={page.id}
              className={`v3-home__cell v3-home__cell--${page.card.size}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <GalleryCard page={page} onOpen={onOpen} />
            </Motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

function PageFrame({ page, onBack, children }) {
  const design = pageDesigns[page.id];

  return (
    <div className="v3-page" data-page={page.id} data-tone={page.backdrop} data-preview={design.preview} style={themeStyle(page.theme)}>
      <div className="v3-page__ambient">
        <div className="v3-page__glow" />
        <div className="v3-page__grain" />
      </div>
      <button type="button" className="v3-back" onClick={onBack}>
        <ArrowLeft size={16} />
        샘플 목록
      </button>
      <div className="v3-page__inner">{children}</div>
    </div>
  );
}

function SneakerDropPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="ticker" right={<Pill dark>DROP 20:00</Pill>} />
      <section className="v3-scene v3-scene--drop">
        <IntroBlock page={page} headingClass="v3-heading--slam" />
        <div className="v3-stageCard v3-stageCard--drop">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="오늘 드롭" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-floatingInfo">
            {page.miniPanels.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <MediaCard src={page.images.product} label="신규 룩" title="Aero Runner" className="v3-stageCard__float" />
        </div>
      </section>
      <section className="v3-strip">
        <SectionHeading label="드롭" title="지금 담는 구성" />
        <PriceTiles items={page.drops} />
      </section>
      <section className="v3-duo">
        <div className="v3-callout v3-callout--sharp">
          <span>빠른 기능</span>
          <ChipStrip items={page.quickTools} />
        </div>
        <MediaCard src={page.images.scene} label="매장 컷" title="현장 룩" />
      </section>
    </PageFrame>
  );
}

function SupplementBrandPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="capsule" right={<Pill dark>구독 ON</Pill>} />
      <section className="v3-scene v3-scene--routine">
        <div className="v3-stackPanel">
          <IntroBlock page={page} />
          <StatRail items={page.stats} />
        </div>
        <div className="v3-stageCard v3-stageCard--routine">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="루틴 빌더" title={page.brand} className="v3-stageCard__hero" />
          <PriceTiles items={page.routines} compact className="v3-stageCard__dock" />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-compareBox">
          <SectionHeading label="성분" title="한 줄 비교" />
          <div className="v3-compareTable">
            <div className="v3-compareTable__head">
              <span>항목</span>
              <span>퍼포먼스</span>
              <span>회복</span>
            </div>
            {page.compareRows.map((row) => (
              <div key={row.join("-")} className="v3-compareTable__row">
                {row.map((cell) => (
                  <span key={cell}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="v3-callout">
          <span>구독 플랜</span>
          <ChipStrip items={page.plans} />
          <MediaCard src={page.images.product} label="추천 세트" title="오늘 조합" />
        </div>
      </section>
    </PageFrame>
  );
}

function BoxingGymPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="score" right={<Pill dark>{page.classSlots[0]}</Pill>} />
      <section className="v3-scene v3-scene--training">
        <div className="v3-scoreHero">
          <IntroBlock page={page} headingClass="v3-heading--impact" />
          <StatRail items={page.stats} className="v3-stats--boxed" />
        </div>
        <div className="v3-trainingBoard">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <div className="v3-trainingBoard__slots">
            {page.classSlots.map((slot) => (
              <span key={slot}>{slot}</span>
            ))}
          </div>
          <MediaCard src={page.images.hero} label="체험 등록" title={page.brand} />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-callout v3-callout--sharp">
          <span>코치</span>
          <ChipStrip items={page.coaches} />
        </div>
        <PriceTiles items={page.plans} />
      </section>
      <MediaCard src={page.images.scene} label="현장" title="체육관 컷" className="v3-fullMedia" />
    </PageFrame>
  );
}

function WealthAppPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="ledger" right={<Pill>무료 시작</Pill>} />
      <section className="v3-dashboardHero">
        <aside className="v3-dashboardHero__aside">
          <IntroBlock page={page} />
          <div className="v3-railPanel">
            {page.boards.map((board) => (
              <span key={board}>{board}</span>
            ))}
          </div>
        </aside>
        <div className="v3-dashboardHero__main">
          <div className="v3-dashboardShell">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <MediaCard src={page.images.hero} label="대시보드" title="이번 달" className="v3-dashboardShell__hero" />
            <StatRail items={page.stats} className="v3-dashboardShell__stats" />
          </div>
          <PriceTiles items={page.goals} compact />
        </div>
      </section>
      <section className="v3-gridSection">
        <MediaCard src={page.images.product} label="리포트" title="주간 요약" />
        <div className="v3-callout">
          <span>추천 카드</span>
          <ChipStrip items={page.cards} />
        </div>
      </section>
    </PageFrame>
  );
}

function SkinClinicPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="clean" right={<Pill>예약 가능</Pill>} />
      <section className="v3-clinicHero">
        <div className="v3-clinicHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <div className="v3-bookingWidget">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <span>AI 스캔</span>
            {page.slots.slice(0, 3).map((slot) => (
              <strong key={slot}>{slot}</strong>
            ))}
          </div>
        </div>
        <MediaCard src={page.images.hero} label="상담실" title={page.brand} className="v3-clinicHero__media" />
      </section>
      <PriceTiles items={page.programs} />
      <section className="v3-gridSection">
        <div className="v3-callout">
          <span>의료진</span>
          <ChipStrip items={page.doctors} />
        </div>
        <div className="v3-callout">
          <span>예약 가능</span>
          <ChipStrip items={page.slots} />
        </div>
      </section>
    </PageFrame>
  );
}

function ArchStudioPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="editorial" right={<Pill>브리프 접수</Pill>} />
      <section className="v3-editorialHero">
        <div className="v3-editorialHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.works} />
        </div>
        <div className="v3-mosaic">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="프로젝트" title="메인 작업" className="v3-mosaic__large" />
          <MediaCard src={page.images.product} label="도면" title="제안 컷" />
          <MediaCard src={page.images.scene} label="현장" title="오픈 컷" />
        </div>
      </section>
      <section className="v3-gridSection">
        <div className="v3-callout">
          <span>진행</span>
          <ChipStrip items={page.process} />
        </div>
        <div className="v3-callout">
          <span>브리프</span>
          {page.briefRows.map(([label, value]) => (
            <div key={label} className="v3-metaLine">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function BeautyFlashSalePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="promo" right={<Pill dark>FLASH SALE</Pill>} />
      <section className="v3-saleHero">
        <div className="v3-saleHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.checkout} className="v3-chipStrip--bold" />
        </div>
        <div className="v3-stageCard v3-stageCard--sale">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="핫딜" title={page.brand} className="v3-salePoster__main" />
          <MediaCard src={page.images.product} label="발색" title="컬러 컷" className="v3-salePoster__side" />
        </div>
      </section>
      <PriceTiles items={page.kits} />
      <section className="v3-callout v3-callout--soft">
        <span>컬러 먼저</span>
        <ChipStrip items={page.shades} className="v3-chipStrip--color" />
      </section>
    </PageFrame>
  );
}

function FestivalPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="poster" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">티켓 구매</button>} />
      <section className="v3-posterHero">
        <div className="v3-posterHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--poster" />
          <StatRail items={page.stats} />
        </div>
        <div className="v3-stageCard v3-stageCard--poster">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <div className="v3-lineupRail">
            {page.lineup.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <MediaCard src={page.images.hero} label="메인 스테이지" title={page.brand} className="v3-posterHero__media" />
        </div>
      </section>
      <section className="v3-callout v3-callout--dark">
        <SectionHeading label="시간표" title="오늘 동선" />
        <ChipStrip items={page.timetable} className="v3-chipStrip--wide" />
      </section>
      <PriceTiles items={page.tickets} />
    </PageFrame>
  );
}

function CreatorClubPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="club" right={<Pill dark>월 39,000원</Pill>} />
      <section className="v3-feedHero">
        <div className="v3-feedHero__left">
          <IntroBlock page={page} />
          <PriceTiles items={page.passes} compact />
        </div>
        <div className="v3-feedHero__right">
          <div className="v3-feedBoard">
            <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
            <MediaCard src={page.images.hero} label="멤버십" title={page.brand} className="v3-feedBoard__hero" />
            <div className="v3-feedBoard__posts">
              {page.posts.map((post) => (
                <span key={post}>{post}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="v3-gridSection">
        <div className="v3-callout v3-callout--soft">
          <span>혜택</span>
          <ChipStrip items={page.perks} />
        </div>
        <MediaCard src={page.images.scene} label="이벤트" title="커뮤니티 컷" />
      </div>
    </PageFrame>
  );
}

function EvMobilityPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="tech" right={<Pill>다음 시승 토 11:00</Pill>} />
      <section className="v3-compareHero">
        <div className="v3-compareHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.specs} className="v3-chipStrip--tech" />
        </div>
        <div className="v3-stageCard v3-stageCard--compare">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="시승 예약" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-plannerDock">
            {page.planner.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.models} />
    </PageFrame>
  );
}

function GamingGearPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="console" right={<Pill dark>Cart 3</Pill>} />
      <section className="v3-setupHero">
        <div className="v3-stageCard v3-stageCard--setup">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="셋업" title={page.brand} className="v3-stageCard__hero" />
        </div>
        <div className="v3-setupHero__side">
          <IntroBlock page={page} />
          <div className="v3-callout v3-callout--dark">
            <span>카트</span>
            <ChipStrip items={page.cartRows} />
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.gear} />
        <div className="v3-callout v3-callout--dark">
          <span>핵심 사양</span>
          <ChipStrip items={page.specs} />
        </div>
      </section>
    </PageFrame>
  );
}

function AiSaasPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="glass" right={<Pill>Demo Live</Pill>} />
      <section className="v3-bentoHero">
        <div className="v3-bentoHero__copy">
          <IntroBlock page={page} />
          <ChipStrip items={page.flows} className="v3-chipStrip--tech" />
        </div>
        <div className="v3-stageCard v3-stageCard--bento">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="실시간 데모" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-miniBento">
            {page.useCases.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-callout v3-callout--dark">
        <SectionHeading label="성과" title="팀이 먼저 보는 숫자" />
        <ChipStrip items={page.kpis} className="v3-chipStrip--wide" />
      </section>
      <div className="v3-gridSection">
        <MediaCard src={page.images.product} label="제품" title="플로우 컷" />
        <MediaCard src={page.images.scene} label="팀" title="사용 장면" />
      </div>
    </PageFrame>
  );
}

function IndieBookstorePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="editorial" right={<Pill>메모 카드 무료</Pill>} />
      <section className="v3-shelfHero">
        <aside className="v3-shelfHero__rail">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.shelf} className="v3-chipStrip--paper" />
        </aside>
        <div className="v3-stageCard v3-stageCard--shelf">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="이번 주 셀렉션" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-noteStack">
            {page.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.picks} />
    </PageFrame>
  );
}

function StationeryShopPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="paper" right={<Pill>Gift Ready</Pill>} />
      <section className="v3-paperHero">
        <div className="v3-paperHero__copy">
          <IntroBlock page={page} />
        </div>
        <div className="v3-paperBoard">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="데스크 키트" title={page.brand} className="v3-paperBoard__hero" />
          <div className="v3-paperBoard__basket">
            {page.basket.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.kits} />
        <div className="v3-callout v3-callout--paper">
          <span>컬러</span>
          <ChipStrip items={page.colors} className="v3-chipStrip--color" />
        </div>
      </section>
    </PageFrame>
  );
}

function LocalCafePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="warm" right={<Pill>창가 4석</Pill>} />
      <section className="v3-menuHero">
        <div className="v3-menuHero__board">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <PriceTiles items={page.menus} compact />
        </div>
        <div className="v3-stageCard v3-stageCard--menu">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="오늘 메뉴" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-seatDock">
            {page.seats.map((seat) => (
              <span key={seat}>{seat}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-callout v3-callout--paper">
        <SectionHeading label="매장" title="기본 정보" />
        <ChipStrip items={page.storeRows} className="v3-chipStrip--wide" />
      </section>
    </PageFrame>
  );
}

function BoutiqueHotelPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="luxe" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">예약하기</button>} />
      <section className="v3-stayHero">
        <div className="v3-stayHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <div className="v3-bookingDock">
            {page.dates.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="v3-stayHero__visual">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="객실 선택" title={page.brand} className="v3-stageCard__hero" />
        </div>
      </section>
      <PriceTiles items={page.rooms} />
      <section className="v3-callout">
        <SectionHeading label="포함" title="기본 제공" />
        <ChipStrip items={page.perks} className="v3-chipStrip--wide" />
      </section>
      <MediaCard src={page.images.scene} label="현장" title="스테이 컷" className="v3-fullMedia" />
    </PageFrame>
  );
}

function PerfumeHousePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="luxe" right={<Pill>Discovery Set</Pill>} />
      <section className="v3-scentHero">
        <div className="v3-scentHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--serif" />
          <ChipStrip items={page.notes} className="v3-chipStrip--paper" />
        </div>
        <div className="v3-scentHero__visual">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="시그니처" title={page.brand} className="v3-stageCard__hero" />
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.sets} />
        <div className="v3-callout">
          <span>자주 쓰는 흐름</span>
          <ChipStrip items={page.matches} />
          <MediaCard src={page.images.product} label="디테일" title="노트 컷" />
        </div>
      </section>
    </PageFrame>
  );
}

function FurnitureStorePage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="organic" right={<Pill>배치 보기</Pill>} />
      <section className="v3-roomHero">
        <div className="v3-roomHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--soft" />
          <ChipStrip items={page.rooms} />
        </div>
        <div className="v3-roomHero__planner">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="룸 기준" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-plannerDock">
            {page.placement.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.bundles} />
    </PageFrame>
  );
}

function YouthFashionPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="play" right={<Pill dark>AI 착용</Pill>} />
      <section className="v3-fashionHero">
        <div className="v3-fashionHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--shout" />
          <ChipStrip items={page.sizes} className="v3-chipStrip--bold" />
        </div>
        <div className="v3-fashionHero__stack">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="룩 먼저" title={page.brand} className="v3-fashionHero__main" />
          <div className="v3-fashionHero__cart">
            {page.cartRows.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <PriceTiles items={page.looks} />
      <div className="v3-gridSection">
        <MediaCard src={page.images.product} label="제품" title="상세 컷" />
        <MediaCard src={page.images.scene} label="룩북" title="현장 컷" />
      </div>
    </PageFrame>
  );
}

function JewelryBrandPage({ page, onBack }) {
  return (
    <PageFrame page={page} onBack={onBack}>
      <SiteHeader page={page} variant="chrome" right={<button type="button" className="v3-inlineButton v3-inlineButton--accent">상담 예약</button>} />
      <section className="v3-jewelryHero">
        <div className="v3-jewelryHero__copy">
          <IntroBlock page={page} headingClass="v3-heading--chrome" />
          <ChipStrip items={page.bespoke} className="v3-chipStrip--wide" />
        </div>
        <div className="v3-stageCard v3-stageCard--jewelry">
          <EffectStage kind={pageDesigns[page.id].effect} density="hero" />
          <MediaCard src={page.images.hero} label="컬렉션" title={page.brand} className="v3-stageCard__hero" />
          <div className="v3-consultDock">
            {page.consultRows.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="v3-gridSection">
        <PriceTiles items={page.collections} />
        <MediaCard src={page.images.product} label="디테일" title="제품 컷" />
      </section>
    </PageFrame>
  );
}

const pageComponents = {
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

  const CurrentPage = selectedPage ? pageComponents[selectedPage.id] : null;

  const openPage = (pageId) => {
    setSelectedPageId(pageId);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const closePage = () => {
    setSelectedPageId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return (
    <AnimatePresence mode="wait">
      {selectedPage && CurrentPage ? (
        <Motion.div
          key={selectedPage.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <CurrentPage page={selectedPage} onBack={closePage} />
        </Motion.div>
      ) : (
        <Motion.div
          key="gallery"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <GalleryHome pages={showcasePages} onOpen={openPage} />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
