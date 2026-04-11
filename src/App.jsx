import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  aiRecommendations,
  faqs,
  highlights,
  packageCards,
  processSteps,
  product,
  studioMetrics,
} from "./content/siteContent";
import { styleSamples } from "./content/styleSamples";
import { buildIndustryExperience, getIndustryImageSpecs } from "./lib/sampleExperience";

const modeMeta = {
  commerce: { label: "구매형", cta: "장바구니 / 구매 흐름" },
  booking: { label: "예약형", cta: "상담 / 예약 흐름" },
  membership: { label: "가입형", cta: "가입 / 멤버십 흐름" },
  ticketing: { label: "예매형", cta: "티켓 / 일정 흐름" },
  saas: { label: "도입형", cta: "데모 / 도입 상담" },
  consulting: { label: "문의형", cta: "프로젝트 문의 흐름" },
};

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function usePointerBackdrop() {
  const ref = useRef(null);

  const updatePointer = (clientX, clientY) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    node.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x))}%`);
    node.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y))}%`);
  };

  return {
    containerRef: ref,
    handlePointerMove: (event) => updatePointer(event.clientX, event.clientY),
    handlePointerLeave: () => {
      const node = ref.current;
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

function getPrimaryPreviewImage(sample) {
  const primary = sample.industries[0];
  const generated = getIndustryImageSpecs(sample, primary)[0];
  return generated?.src ?? `/generated/${sample.asset}`;
}

function StyleThumb({ sample }) {
  return (
    <div className="style-thumb" data-style={sample.preview}>
      <div className="style-thumb__chrome" />
      <div className="style-thumb__surface">
        <img src={getPrimaryPreviewImage(sample)} alt={`${sample.name} preview`} />
        <div className="style-thumb__overlay" />
        <div className="style-thumb__frame style-thumb__frame--a" />
        <div className="style-thumb__frame style-thumb__frame--b" />
        <div className="style-thumb__frame style-thumb__frame--c" />
        <div className="style-thumb__copy">
          <span>{sample.badge}</span>
          <strong>{sample.en}</strong>
        </div>
      </div>
    </div>
  );
}

function HomeCard({ sample, onOpen }) {
  const primaryIndustry = sample.industries[0];
  const mode = modeMeta[primaryIndustry.mode] ?? modeMeta.consulting;

  return (
    <Motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="home-card"
      data-style={sample.preview}
    >
      <StyleThumb sample={sample} />
      <div className="home-card__body">
        <div className="home-card__meta">
          <span className="pill pill--dark">{sample.badge}</span>
          <span className="pill">{sample.category}</span>
          <span className="pill">{mode.label}</span>
        </div>
        <h3>{sample.name}</h3>
        <p>{sample.summary}</p>
        <div className="home-card__industries">
          {sample.industries.map((industry) => (
            <span key={industry.id}>{industry.company}</span>
          ))}
        </div>
        <button type="button" className="inline-action" onClick={() => onOpen(sample.id)}>
          실제 서비스 페이지 보기
          <ChevronRight size={18} />
        </button>
      </div>
    </Motion.article>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <Motion.article layout className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button type="button" className="faq-item__button" onClick={onToggle}>
        <span>{item.question}</span>
        <Motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} />
        </Motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <Motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="faq-item__wrap"
          >
            <div className="faq-item__content">{item.answer}</div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </Motion.article>
  );
}

function HomePage({ onOpen }) {
  const [openFaq, setOpenFaq] = useState(0);
  const { containerRef, handlePointerMove, handlePointerLeave } = usePointerBackdrop();

  return (
    <div className="page-shell page-shell--home" ref={containerRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <SceneBackdrop variant="gallery" scope="home" />
      <div className="page-shell__content">
      <header className="site-header">
        <a href="#top" className="brand-mark">
          <span className="brand-mark__icon">
            <Sparkles size={14} />
          </span>
          <span>{product.name}</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#samples">샘플</a>
          <a href="#process">진행 방식</a>
          <a href="#pricing">가격</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a href="#samples" className="site-header__cta">
          샘플 보기
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <Reveal className="hero__copy">
            <span className="hero__label">{product.label}</span>
            <h1>{product.title}</h1>
            <p className="hero__description">{product.description}</p>

            <div className="hero__actions">
              <a href="#samples" className="button button--primary">
                샘플 고르기
                <ArrowRight size={18} />
              </a>
              <a href="#pricing" className="button button--secondary">
                패키지 보기
              </a>
            </div>

            <ul className="hero__highlights">
              {highlights.map((item) => (
                <li key={item}>
                  <BadgeCheck size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="hero__visual" delay={0.08}>
            <div className="hero__visual-grid">
              <StyleThumb sample={styleSamples[0]} />
              <StyleThumb sample={styleSamples[3]} />
              <StyleThumb sample={styleSamples[9]} />
            </div>
            <div className="hero__visual-note">
              <strong>10개 스타일 모두 다른 화면 언어</strong>
              <span>상세에 들어가면 회사 소개, 상품·서비스, 현장 사진, 제품 사진, AI 기능, 문의 흐름까지 실제 사이트처럼 확인할 수 있습니다.</span>
            </div>
          </Reveal>
        </section>

        <section className="metric-grid">
          {studioMetrics.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04}>
              <article className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            </Reveal>
          ))}
        </section>

        <section className="section" id="samples">
          <Reveal>
            <SectionHeader
              eyebrow="Samples"
              title="메인 카드부터 전부 다른 스타일로 비교합니다"
              description="같은 카드 틀을 반복하지 않고, 스타일마다 전혀 다른 시각 언어를 써서 첫 단계에서부터 구분이 명확하게 보이도록 바꿨습니다."
            />
          </Reveal>
          <div className="sample-grid">
            {styleSamples.map((sample, index) => (
              <Reveal key={sample.id} delay={index * 0.03}>
                <HomeCard sample={sample} onOpen={onOpen} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="process">
          <Reveal>
            <SectionHeader
              eyebrow="Process"
              title="메인에서 고르고 상세에서 실제 서비스 흐름을 봅니다"
              description="상세 페이지 안에서는 내부 메뉴, 회사 소개, 제품·프로그램, 현장 이미지, AI 기능, 문의 패널까지 사이트처럼 움직입니다."
            />
          </Reveal>
          <div className="process-grid">
            {processSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <article className="process-card">
                  <span className="process-card__step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section">
          <Reveal>
            <SectionHeader
              eyebrow="AI Ideas"
              title="실제 운영용으로 넣을 만한 기능도 업종별로 잡았습니다"
              description="가상 착용, 공간 배치, 추천, 챗봇 같은 기능은 이제 상세 페이지 안에서 업종에 맞게 바로 읽히도록 배치합니다."
            />
          </Reveal>
          <div className="idea-grid">
            {aiRecommendations.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="idea-card">
                  <div className="idea-card__icon">
                    <Bot size={18} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="pricing">
          <Reveal>
            <SectionHeader
              eyebrow="Pricing"
              title="패키지 구간은 빠르게 판단할 수 있게 유지합니다"
              description="메인 페이지에서는 가격 판단을 방해하지 않도록 간결하게 두고, 상세에서 각 업종 흐름을 깊게 보도록 분리합니다."
            />
          </Reveal>
          <div className="pricing-grid">
            {packageCards.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05}>
                <article className={`pricing-card ${item.highlight ? "pricing-card--highlight" : ""}`}>
                  <span className="pill">{item.name}</span>
                  <h3>{item.price}</h3>
                  <p>{item.description}</p>
                  <ul className="pricing-card__list">
                    {item.items.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="faq">
          <Reveal>
            <SectionHeader
              eyebrow="FAQ"
              title="이제 단순 무드보드가 아니라 실제 운용형 샘플입니다"
              description="상세 페이지 내부에 이미지, 섹션 메뉴, 전환 패널, 문의·구매 흐름이 모두 있는지 기준으로 검증 가능한 상태로 만들겠습니다."
            />
          </Reveal>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <FaqItem key={item.question} item={item} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />
            ))}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}

function DetailPage({ sample, industry, onBack, onSelectIndustry }) {
  const experience = buildIndustryExperience(sample, industry);
  const gallery = experience.gallery;
  const mode = modeMeta[industry.mode] ?? modeMeta.consulting;
  const { containerRef, handlePointerMove, handlePointerLeave } = usePointerBackdrop();

  return (
    <div className="detail-shell" data-style={sample.preview} ref={containerRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <SceneBackdrop variant={sample.preview} />
      <div className="detail-shell__content">
      <header className="detail-topbar">
        <button type="button" className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          메인 샘플로
        </button>

        <div className="detail-topbar__title">
          <span>{sample.name}</span>
          <strong>{industry.company}</strong>
        </div>

        <span className="pill pill--dark">{mode.label}</span>
      </header>

      <main className="detail-page">
        <section className="detail-overview" id="overview">
          <div className="detail-overview__intro">
            <div className="detail-overview__badges">
              <span className="pill pill--dark">{sample.badge}</span>
              <span className="pill">{industry.label}</span>
              <span className="pill">{industry.company}</span>
            </div>

            <div className="detail-overview__site-nav">
              {industry.nav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <h1>{industry.title}</h1>
            <p>{industry.desc}</p>

            <div className="detail-overview__actions">
              <button type="button" className="button button--primary">
                {industry.panel.primary}
                <ArrowRight size={18} />
              </button>
              <button type="button" className="button button--secondary">
                {industry.panel.secondary}
              </button>
            </div>

            <div className="detail-subnav">
              {experience.sectionNav.map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="detail-overview__visual">
            <Reveal className="detail-media-card detail-media-card--hero" delay={0.05}>
              <img src={gallery[0].src} alt={`${industry.company} ${gallery[0].title}`} />
              <div className="detail-media-card__copy">
                <strong>{gallery[0].title}</strong>
                <span>{gallery[0].caption}</span>
              </div>
            </Reveal>
            <Reveal className="detail-media-card detail-media-card--secondary" delay={0.1}>
              <img src={gallery[1].src} alt={`${industry.company} ${gallery[1].title}`} />
              <div className="detail-media-card__copy">
                <strong>{gallery[1].title}</strong>
                <span>{gallery[1].caption}</span>
              </div>
            </Reveal>
            <Reveal className="detail-panel" delay={0.15}>
              <span className="detail-panel__eyebrow">
                <LayoutGrid size={15} />
                {industry.panel.badge}
              </span>
              <h3>{industry.panel.title}</h3>
              <p>{industry.panel.text}</p>
              <div className="detail-panel__rows">
                {industry.panel.rows.map(([label, value]) => (
                  <div key={label} className="detail-panel__row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="industry-switcher">
          {sample.industries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`industry-chip ${entry.id === industry.id ? "industry-chip--active" : ""}`}
              onClick={() => onSelectIndustry(entry.id)}
            >
              <strong>{entry.company}</strong>
              <span>{entry.label}</span>
            </button>
          ))}
        </section>

        <section className="detail-stats">
          {industry.stats.map(([value, label], index) => (
            <Reveal key={label} delay={index * 0.05}>
              <article className="detail-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            </Reveal>
          ))}
        </section>

        <section className="detail-section detail-section--split" id="about">
          <Reveal>
            <article className="story-card">
              <span className="detail-section__eyebrow">Company Intro</span>
              <h2>{industry.company}</h2>
              <p>{industry.story}</p>

              <div className="story-card__facts">
                {experience.quickFacts.map(([label, value]) => (
                  <div key={label} className="story-card__fact">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          <div className="value-grid">
            {industry.values.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.05}>
                <article className="value-card">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="detail-section" id="catalog">
          <Reveal>
            <div className="detail-section__head">
              <span className="detail-section__eyebrow">
                <ShoppingBag size={15} />
                {mode.cta}
              </span>
              <h2>실제 서비스처럼 읽히는 핵심 상품·프로그램 섹션</h2>
              <p>가격, 구성, 선택 이유가 한 번에 읽히도록 구성했습니다.</p>
            </div>
          </Reveal>

          <div className="catalog-layout">
            <div className="offer-grid">
              {industry.offers.map(([name, info, price], index) => (
                <Reveal key={name} delay={index * 0.05}>
                  <article className="offer-card">
                    <h3>{name}</h3>
                    <p>{info}</p>
                    <strong>{price}</strong>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="detail-media-card detail-media-card--catalog" delay={0.1}>
              <img src={gallery[1].src} alt={`${industry.company} catalog visual`} />
              <div className="detail-media-card__copy">
                <strong>{gallery[1].title}</strong>
                <span>{gallery[1].caption}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="detail-section" id="gallery">
          <Reveal>
            <div className="detail-section__head">
              <span className="detail-section__eyebrow">
                <Sparkles size={15} />
                Visual Assets
              </span>
              <h2>제품 컷, 콘셉트 컷, 현장 컷을 전부 별도 자산으로 구성했습니다</h2>
              <p>겉핥기용 카드가 아니라 실제 상세 페이지 안에 쓰는 이미지 구간처럼 보이도록 분리했습니다.</p>
            </div>
          </Reveal>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <Reveal key={item.key} delay={index * 0.06}>
                <article className="detail-media-card detail-media-card--gallery">
                  <img src={item.src} alt={`${industry.company} ${item.title}`} />
                  <div className="detail-media-card__copy">
                    <strong>{item.title}</strong>
                    <span>{item.caption}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="detail-section" id="ai">
          <Reveal>
            <div className="detail-section__head">
              <span className="detail-section__eyebrow">
                <Bot size={15} />
                AI Experience
              </span>
              <h2>이 업종에 실제로 붙일 만한 AI 기능 흐름</h2>
              <p>상담형, 구매형, 예약형에 따라 체감 기능이 다르게 보이도록 업종별로 다르게 배치했습니다.</p>
            </div>
          </Reveal>

          <div className="tool-grid">
            {industry.tools.map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.05}>
                <article className="tool-card">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="detail-section detail-section--contact" id="contact">
          <Reveal>
            <article className="contact-card">
              <div className="contact-card__copy">
                <span className="detail-section__eyebrow">
                  <MessageCircle size={15} />
                  Contact Flow
                </span>
                <h2>{experience.contact.title}</h2>
                <p>{experience.contact.body}</p>
                <div className="contact-card__rows">
                  {experience.contact.rows.map(([label, value]) => (
                    <div key={label} className="contact-card__row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quote-card">
                <span className="detail-section__eyebrow">Brand Voice</span>
                <blockquote>{industry.quote}</blockquote>
                <p>{industry.author}</p>
              </div>
            </article>
          </Reveal>
        </section>
      </main>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);

  const selectedSample = useMemo(
    () => styleSamples.find((sample) => sample.id === selectedStyleId) ?? null,
    [selectedStyleId],
  );

  const selectedIndustry = useMemo(
    () =>
      selectedSample?.industries.find((industry) => industry.id === selectedIndustryId) ??
      selectedSample?.industries[0] ??
      null,
    [selectedIndustryId, selectedSample],
  );

  const handleOpenSample = (sampleId) => {
    const sample = styleSamples.find((entry) => entry.id === sampleId);
    setSelectedStyleId(sampleId);
    setSelectedIndustryId(sample?.industries[0]?.id ?? null);
  };

  return (
    <AnimatePresence mode="wait">
      {selectedSample && selectedIndustry ? (
        <Motion.div key={`${selectedSample.id}-${selectedIndustry.id}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
          <DetailPage
            sample={selectedSample}
            industry={selectedIndustry}
            onBack={() => {
              setSelectedStyleId(null);
              setSelectedIndustryId(null);
            }}
            onSelectIndustry={setSelectedIndustryId}
          />
        </Motion.div>
      ) : (
        <Motion.div key="home" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
          <HomePage onOpen={handleOpenSample} />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
