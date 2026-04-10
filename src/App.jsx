import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  ChevronRight,
  LayoutGrid,
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

const modeMeta = {
  commerce: { offersTitle: "대표 상품", panelTitle: "구매 패널" },
  booking: { offersTitle: "대표 프로그램", panelTitle: "예약 패널" },
  membership: { offersTitle: "멤버십 구성", panelTitle: "가입 패널" },
  ticketing: { offersTitle: "티켓 옵션", panelTitle: "예매 패널" },
  saas: { offersTitle: "핵심 기능", panelTitle: "도입 패널" },
  consulting: { offersTitle: "대표 서비스", panelTitle: "문의 패널" },
};

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function PreviewTile({ sample, compact = false }) {
  return (
    <div
      className={`preview-tile ${compact ? "preview-tile--compact" : ""}`}
      data-preview={sample.preview}
      style={{
        "--preview-shell": sample.theme.shell,
        "--preview-surface": sample.theme.surface,
        "--preview-accent": sample.theme.accent,
        "--preview-soft": sample.theme.accentSoft,
        "--preview-text": sample.theme.text,
        "--preview-border": sample.theme.border,
      }}
    >
      <div className="preview-tile__top">
        <span>{sample.badge}</span>
        <span>{sample.en}</span>
      </div>
      <div className="preview-tile__word">{sample.en}</div>
      <div className="preview-tile__canvas">
        <div className="preview-tile__hero" />
        <div className="preview-tile__card preview-tile__card--a" />
        <div className="preview-tile__card preview-tile__card--b" />
        <div className="preview-tile__card preview-tile__card--c" />
        <div className="preview-tile__line-group">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function HomeCard({ sample, onOpen }) {
  return (
    <Motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="home-card"
      style={{
        "--card-accent": sample.theme.accent,
        "--card-soft": sample.theme.accentSoft,
      }}
    >
      <PreviewTile sample={sample} />
      <div className="home-card__body">
        <div className="home-card__meta">
          <span className="pill pill--dark">{sample.badge}</span>
          <span className="pill">{sample.category}</span>
        </div>
        <h3>{sample.name}</h3>
        <p>{sample.summary}</p>
        <div className="home-card__industries">
          {sample.industries.map((industry) => (
            <span key={industry.id}>{industry.label}</span>
          ))}
        </div>
        <button type="button" className="inline-action" onClick={() => onOpen(sample.id)}>
          실제 샘플 보기
          <ChevronRight size={18} />
        </button>
      </div>
    </Motion.article>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <article className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button type="button" className="faq-item__button" onClick={onToggle}>
        <span>{item.question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open ? <p>{item.answer}</p> : null}
    </article>
  );
}

function HomePage({ onOpen }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="page-shell">
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
          <div className="hero__copy">
            <span className="hero__label">{product.label}</span>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <div className="hero__actions">
              <a href="#samples" className="button button--primary">
                샘플 고르기
                <ArrowRight size={18} />
              </a>
              <a href="#pricing" className="button button--secondary">
                가격 확인
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
          </div>

          <div className="hero__visual">
            <div className="hero__visual-stack">
              <PreviewTile sample={styleSamples[0]} compact />
              <PreviewTile sample={styleSamples[3]} compact />
              <PreviewTile sample={styleSamples[9]} compact />
            </div>
            <div className="hero__visual-note">
              <strong>10개 스타일 / 30개 업종 시나리오</strong>
              <span>메인에서 고르고 상세에서 실제 페이지처럼 판단합니다.</span>
            </div>
          </div>
        </section>

        <section className="metric-grid">
          {studioMetrics.map((item) => (
            <article key={item.label} className="metric-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="section" id="samples">
          <SectionHeader
            eyebrow="Samples"
            title="바로 선택하고 비교할 수 있는 10개 메인 스타일"
            description="원하는 무드에 가까운 메인 스타일을 고르면 상세에서 업종 3개를 오가며 실제 서비스 페이지처럼 볼 수 있습니다."
          />
          <div className="sample-grid">
            {styleSamples.map((sample) => (
              <HomeCard key={sample.id} sample={sample} onOpen={onOpen} />
            ))}
          </div>
        </section>

        <section className="section" id="process">
          <SectionHeader
            eyebrow="Process"
            title="보는 순서를 단순하게 만들었습니다"
            description="스타일을 먼저 고르고, 업종을 바꿔 보고, 실제 서비스 흐름까지 한 번에 판단하는 구조입니다."
          />
          <div className="process-grid">
            {processSteps.map((item) => (
              <article key={item.step} className="process-card">
                <span className="process-card__step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeader
            eyebrow="AI Ideas"
            title="실서비스에 바로 붙이기 좋은 기능 예시"
            description="업종별로 효율이 높은 기능만 남겼습니다. 상세 샘플 안에서도 같은 흐름으로 확인할 수 있습니다."
          />
          <div className="idea-grid">
            {aiRecommendations.map((item) => (
              <article key={item.title} className="idea-card">
                <div className="idea-card__icon">
                  <Bot size={18} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="pricing">
          <SectionHeader
            eyebrow="Pricing"
            title="필요한 범위에 맞게 바로 판단할 수 있는 패키지"
            description="실험용 한 페이지부터 실제 전환형 랜딩까지 기준을 명확하게 나눴습니다."
          />
          <div className="pricing-grid">
            {packageCards.map((item) => (
              <article key={item.name} className={`pricing-card ${item.highlight ? "pricing-card--highlight" : ""}`}>
                <span className="pill">{item.name}</span>
                <h3>{item.price}</h3>
                <p>{item.description}</p>
                <ul>
                  {item.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="faq">
          <SectionHeader
            eyebrow="FAQ"
            title="고객이 가장 먼저 묻는 질문"
            description="이 샘플이 단순 무드보드인지, 실제 서비스 페이지처럼 쓸 수 있는지부터 바로 답합니다."
          />
          <div className="faq-list">
            {faqs.map((item, index) => (
              <FaqItem key={item.question} item={item} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DetailPage({ sample, industry, onBack, onSelectIndustry }) {
  const currentMode = modeMeta[industry.mode] ?? modeMeta.consulting;

  return (
    <div
      className="detail-shell"
      style={{
        "--detail-shell": sample.theme.shell,
        "--detail-surface": sample.theme.surface,
        "--detail-panel": sample.theme.panel,
        "--detail-text": sample.theme.text,
        "--detail-muted": sample.theme.muted,
        "--detail-accent": sample.theme.accent,
        "--detail-soft": sample.theme.accentSoft,
        "--detail-border": sample.theme.border,
        "--detail-button-text": sample.theme.buttonText,
        "--detail-shadow": sample.theme.shadow,
      }}
    >
      <header className="detail-topbar">
        <button type="button" className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          메인 샘플로
        </button>
        <div className="detail-topbar__title">
          <span>{sample.name}</span>
          <strong>{industry.company}</strong>
        </div>
        <span className="pill pill--dark">{industry.label}</span>
      </header>

      <main className="detail-page">
        <section className="detail-hero">
          <div className="detail-hero__copy">
            <div className="detail-hero__meta">
              <span className="pill pill--dark">{sample.badge}</span>
              <span className="pill">{industry.label}</span>
            </div>
            <h1>{industry.title}</h1>
            <p>{industry.desc}</p>
            <div className="detail-hero__actions">
              <button type="button" className="button button--primary">
                {industry.panel.primary}
                <ArrowRight size={18} />
              </button>
              <button type="button" className="button button--secondary">
                {industry.panel.secondary}
              </button>
            </div>
            <div className="detail-nav">
              {industry.nav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="detail-hero__aside">
            <div className="detail-visual">
              <img src={`/generated/${sample.asset}`} alt={`${industry.company} sample visual`} />
              <div className="detail-visual__preview">
                <PreviewTile sample={sample} compact />
              </div>
            </div>
            <div className="detail-panel">
              <span className="detail-panel__eyebrow">
                <LayoutGrid size={15} />
                {currentMode.panelTitle}
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
            </div>
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
          {industry.stats.map(([value, label]) => (
            <article key={label} className="detail-stat">
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="detail-section detail-section--split">
          <article className="story-card">
            <span className="detail-section__eyebrow">Company Intro</span>
            <h2>{industry.company}</h2>
            <p>{industry.story}</p>
          </article>
          <div className="value-grid">
            {industry.values.map(([title, text]) => (
              <article key={title} className="value-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-section__head">
            <span className="detail-section__eyebrow">
              <ShoppingBag size={15} />
              {currentMode.offersTitle}
            </span>
            <h2>실제 전환을 만드는 핵심 구간</h2>
          </div>
          <div className="offer-grid">
            {industry.offers.map(([name, info, price]) => (
              <article key={name} className="offer-card">
                <h3>{name}</h3>
                <p>{info}</p>
                <strong>{price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <div className="detail-section__head">
            <span className="detail-section__eyebrow">
              <Bot size={15} />
              AI Experience
            </span>
            <h2>이 업종에서 바로 체감되는 AI 기능</h2>
          </div>
          <div className="tool-grid">
            {industry.tools.map(([title, text]) => (
              <article key={title} className="tool-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-section detail-section--quote">
          <article className="quote-card">
            <span className="detail-section__eyebrow">Brand Voice</span>
            <blockquote>{industry.quote}</blockquote>
            <p>{industry.author}</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);

  const selectedSample = styleSamples.find((sample) => sample.id === selectedStyleId) ?? null;
  const selectedIndustry =
    selectedSample?.industries.find((industry) => industry.id === selectedIndustryId) ??
    selectedSample?.industries[0] ??
    null;

  const handleOpenSample = (sampleId) => {
    const sample = styleSamples.find((entry) => entry.id === sampleId);
    setSelectedStyleId(sampleId);
    setSelectedIndustryId(sample?.industries[0]?.id ?? null);
  };

  return (
    <AnimatePresence mode="wait">
      {selectedSample && selectedIndustry ? (
        <Motion.div key={selectedSample.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
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
        <Motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
          <HomePage onOpen={handleOpenSample} />
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
