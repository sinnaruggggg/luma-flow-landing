import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  ChevronDown,
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
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function SampleVisual({ sample, compact = false }) {
  return (
    <article
      className={`sample-visual ${compact ? "sample-visual--compact" : ""}`}
      style={{
        "--card-accent": sample.theme.accent,
        "--card-soft": sample.theme.accentSoft,
      }}
    >
      <div className="sample-visual__media">
        <img src={`/generated/${sample.asset}`} alt={`${sample.name} preview`} />
        <div className="sample-visual__veil" />
        <div className="sample-visual__chips">
          <span className="sample-visual__chip">{sample.badge}</span>
          <span className="sample-visual__chip sample-visual__chip--ghost">{sample.en}</span>
        </div>
        <div className="sample-visual__title">
          <strong>{sample.name}</strong>
          <span>{sample.summary}</span>
        </div>
      </div>
      {!compact ? (
        <div className="sample-visual__footer">
          {sample.industries.map((industry) => (
            <span key={industry.id}>{industry.label}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function HomeCard({ sample, onOpen }) {
  return (
    <Motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="home-card"
    >
      <SampleVisual sample={sample} />
      <div className="home-card__body">
        <div className="home-card__meta">
          <span className="pill pill--dark">{sample.badge}</span>
          <span className="pill">{sample.category}</span>
        </div>
        <h3>{sample.name}</h3>
        <p>{sample.summary}</p>
        <button type="button" className="inline-action" onClick={() => onOpen(sample.id)}>
          실제 서비스형 상세 보기
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
            <p className="hero__description">{product.description}</p>

            <div className="hero__actions">
              <a href="#samples" className="button button--primary">
                샘플 보기
                <ArrowRight size={18} />
              </a>
              <a href="#pricing" className="button button--secondary">
                패키지 확인
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
              <SampleVisual sample={styleSamples[0]} compact />
              <SampleVisual sample={styleSamples[3]} compact />
              <SampleVisual sample={styleSamples[9]} compact />
            </div>

            <div className="hero__visual-note">
              <strong>10개 메인 스타일과 30개 상세 시나리오</strong>
              <span>메인에서 고르고, 상세에서 업종을 바꾸며 실제 페이지처럼 판단합니다.</span>
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
            title="이전 버전의 톤으로 다시 정리한 메인 샘플 갤러리"
            description="과장된 스타일 장식은 빼고, 동일한 플랫폼 안에서 비교하는 느낌으로 정리했습니다. 각 카드에 들어가면 업종 3개를 바꿔볼 수 있습니다."
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
            title="판단 순서는 그대로 유지합니다"
            description="스타일 선택, 업종 전환, 실제 서비스 흐름 확인의 구조는 유지하고, 보이는 방식만 이전 버전 톤으로 되돌립니다."
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
            title="실서비스에 붙일 AI 기능도 같은 구조로 유지합니다"
            description="가상 착용, 추천, 배치 미리보기, 챗봇 같은 기능 구조는 그대로 두고 표현만 단정하게 묶습니다."
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
            title="가격 섹션도 이전 버전의 톤으로 단순하게 유지합니다"
            description="메인 화면에서 바로 판단할 수 있게 가격과 범위는 짧고 분명하게 유지합니다."
          />

          <div className="pricing-grid">
            {packageCards.map((item) => (
              <article key={item.name} className={`pricing-card ${item.highlight ? "pricing-card--highlight" : ""}`}>
                <span className="pill">{item.name}</span>
                <h3>{item.price}</h3>
                <p>{item.description}</p>
                <ul className="pricing-card__list">
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
            title="샘플 성격과 실제 사용 가능 범위를 먼저 설명합니다"
            description="여기서 보는 건 단순 디자인 카드가 아니라 실제 기능 흐름까지 들어간 서비스형 샘플이라는 점을 분명하게 남깁니다."
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
        "--sample-accent": sample.theme.accent,
        "--sample-soft": sample.theme.accentSoft,
        "--sample-button-text": sample.theme.buttonText,
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
            <SampleVisual sample={sample} compact />

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
            <h2>실제 서비스 구간처럼 보이는 핵심 섹션</h2>
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
            <h2>업종에 맞게 붙인 AI 기능 흐름</h2>
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

        <section className="detail-section">
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
