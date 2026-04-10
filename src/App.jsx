import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  LayoutTemplate,
  PanelsTopLeft,
  Sparkles,
  SwatchBook,
  Workflow,
} from "lucide-react";
import {
  faqs,
  galleryCards,
  galleryTracks,
  highlights,
  metrics,
  packageCards,
  processSteps,
  product,
  serviceCards,
} from "./content/siteContent";
import { imageBlueprints } from "./lib/imageBlueprints";

const featureIcons = [LayoutTemplate, SwatchBook, Workflow];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function SectionHead({ eyebrow, title, description }) {
  return (
    <div className="section-head">
      <span className="section-head__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function ImageCard({ blueprint, compact = false, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const src = `/generated/${blueprint.fileName}`;

  return (
    <article className={`image-card ${compact ? "image-card--compact" : ""}`}>
      <div className="image-card__media">
        <div className="image-card__fallback">
          <div className="image-card__mesh" />
          <div className="image-card__orb image-card__orb--one" />
          <div className="image-card__orb image-card__orb--two" />
          <div className="image-card__panel image-card__panel--main" />
          <div className="image-card__panel image-card__panel--mini" />
        </div>
        <img
          src={src}
          alt={blueprint.title}
          loading={priority ? "eager" : "lazy"}
          className={`image-card__img ${loaded ? "image-card__img--visible" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
        <span className="image-card__badge">{blueprint.label}</span>
      </div>
      <div className="image-card__body">
        <h3>{blueprint.title}</h3>
        <p>{blueprint.caption}</p>
      </div>
    </article>
  );
}

function ServiceCard({ item, index }) {
  const Icon = featureIcons[index];

  return (
    <Motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="service-card"
    >
      <div className="service-card__icon">
        <Icon size={20} />
      </div>
      <span className="service-card__eyebrow">{item.eyebrow}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
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

export default function App() {
  const [activeTrack, setActiveTrack] = useState("전체");
  const [openFaq, setOpenFaq] = useState(0);
  const [isPending, startTransition] = useTransition();

  const blueprintMap = useMemo(
    () => Object.fromEntries(imageBlueprints.map((item) => [item.id, item])),
    [],
  );

  const filteredGallery = useMemo(() => {
    if (activeTrack === "전체") {
      return galleryCards;
    }

    return galleryCards.filter((item) => item.tag === activeTrack);
  }, [activeTrack]);

  return (
    <div className="page">
      <header className="topbar">
        <a href="#hero" className="brand">
          <span className="brand__chip">
            <Sparkles size={14} />
          </span>
          <span>{product.name}</span>
        </a>

        <nav className="topnav" aria-label="Primary">
          <a href="#samples">샘플</a>
          <a href="#service">서비스</a>
          <a href="#pricing">가격</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a href="#pricing" className="topbar__cta">
          가격 보기
        </a>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="hero__copy">
            <Reveal>
              <span className="hero__label">{product.label}</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1>{product.title}</h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="hero__description">{product.description}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="hero__actions">
                <a href="#samples" className="button button--primary">
                  샘플 보기
                  <ArrowRight size={18} />
                </a>
                <a href="#pricing" className="button button--secondary">
                  패키지 확인
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="hero__highlights">
                {highlights.map((item) => (
                  <li key={item}>
                    <BadgeCheck size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="hero__visual">
            <div className="hero__visual-frame">
              <ImageCard blueprint={imageBlueprints[0]} priority />
              <div className="hero__float hero__float--left">
                <strong>{metrics[0].value}</strong>
                <span>{metrics[0].label}</span>
              </div>
              <div className="hero__float hero__float--right">
                <strong>{metrics[3].value}</strong>
                <span>{metrics[3].label}</span>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="metrics">
          {metrics.map((item, index) => (
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
            <SectionHead
              eyebrow="Samples"
              title="먼저 보고 결정할 수 있게 샘플부터 보여드립니다"
              description="브랜드형, 전환형, 프로모션형 중 어떤 방향이 맞는지 빠르게 비교할 수 있도록 실제 랜딩 분위기로 정리했습니다."
            />
          </Reveal>

          <div className="sample-toolbar">
            {galleryTracks.map((track) => (
              <button
                key={track}
                type="button"
                className={`chip ${activeTrack === track ? "chip--active" : ""}`}
                onClick={() => startTransition(() => setActiveTrack(track))}
              >
                {track}
              </button>
            ))}
          </div>

          <div className={`sample-grid ${isPending ? "sample-grid--pending" : ""}`}>
            {filteredGallery.map((card, index) => (
              <Reveal key={card.id} delay={index * 0.05}>
                <Motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="sample-card"
                >
                  <ImageCard blueprint={blueprintMap[card.id]} compact />
                  <div className="sample-card__body">
                    <div className="sample-card__top">
                      <span className="sample-card__tag">{card.tag}</span>
                      <span className="sample-card__name">{card.name}</span>
                    </div>
                    <p>{card.summary}</p>
                  </div>
                </Motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="service">
          <Reveal>
            <SectionHead
              eyebrow="Service"
              title="상담 전에 필요한 판단이 끝나도록 구성했습니다"
              description="무드만 예쁘게 보여주는 페이지가 아니라, 실제로 무엇을 맡길 수 있는지 이해가 되도록 서비스 구조를 단순하게 정리했습니다."
            />
          </Reveal>

          <div className="service-grid">
            {serviceCards.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <ServiceCard item={item} index={index} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section">
          <Reveal>
            <SectionHead
              eyebrow="Process"
              title="진행 방식도 복잡하지 않게"
              description="샘플 선택, 브리프 전달, 시안 제작 시작. 필요한 단계만 남겨서 바로 움직일 수 있게 했습니다."
            />
          </Reveal>

          <div className="process-grid">
            {processSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.06}>
                <article className="process-card">
                  <span className="process-card__step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="pricing">
          <Reveal>
            <SectionHead
              eyebrow="Pricing"
              title="범위에 따라 바로 고를 수 있는 패키지"
              description="간단한 소개형부터 실제 판매용 랜딩까지, 필요한 수준에 맞게 바로 선택할 수 있도록 정리했습니다."
            />
          </Reveal>

          <div className="pricing-grid">
            {packageCards.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.06}>
                <Motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={`pricing-card ${item.highlight ? "pricing-card--highlight" : ""}`}
                >
                  <div className="pricing-card__head">
                    <div>
                      <span className="pricing-card__label">{item.name}</span>
                      <h3>{item.price}</h3>
                    </div>
                    {item.highlight ? <span className="pricing-card__pill">추천</span> : null}
                  </div>
                  <p className="pricing-card__description">{item.description}</p>
                  <ul className="pricing-card__list">
                    {item.items.map((entry) => (
                      <li key={entry}>
                        <BadgeCheck size={16} />
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#faq" className="button button--secondary pricing-card__button">
                    문의 전 확인
                    <ArrowRight size={18} />
                  </a>
                </Motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <Reveal>
            <SectionHead
              eyebrow="FAQ"
              title="문의 전에 많이 보는 질문"
              description="필요한 기준만 짧게 남겼습니다. 페이지를 보고 바로 판단할 수 있게 복잡한 설명은 뺐습니다."
            />
          </Reveal>

          <div className="faq-list">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.question}
                item={item}
                open={openFaq === index}
                onToggle={() => setOpenFaq((current) => (current === index ? -1 : index))}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer-cta">
        <Reveal>
          <div className="footer-cta__box">
            <div>
              <span className="footer-cta__eyebrow">Ready to start</span>
              <h2>원하는 분위기만 고르면 바로 다음 단계로 넘어갈 수 있게 만들었습니다.</h2>
              <p>샘플 확인 후 패키지 범위를 고르고, 필요한 정보만 보내면 제작을 시작하는 구조입니다.</p>
            </div>
            <div className="footer-cta__actions">
              <a href="#samples" className="button button--primary">
                샘플 다시 보기
                <PanelsTopLeft size={18} />
              </a>
              <a href="#pricing" className="button button--secondary">
                가격 확인
              </a>
            </div>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
