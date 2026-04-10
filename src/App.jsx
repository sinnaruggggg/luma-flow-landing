import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChevronDown,
  Clock3,
  Images,
  Layers3,
  MessagesSquare,
  PanelsTopLeft,
  Play,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  Workflow,
} from "lucide-react";
import {
  faqs,
  featureCards,
  metrics,
  operatingSignals,
  partnerMarks,
  planCards,
  product,
  proofPoints,
  styleCards,
  styleTracks,
  testimonials,
  workflowSteps,
} from "./content/siteContent";
import { imageBlueprints } from "./lib/imageBlueprints";

const featureIcons = [Workflow, SwatchBook, ShieldCheck];

const revealTransition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1],
};

function SectionReveal({ children, delay = 0, className = "" }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </Motion.div>
  );
}

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`section-header section-header--${align}`}>
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function GeneratedVisualCard({ blueprint, index = 0, priority = false, compact = false }) {
  const [loaded, setLoaded] = useState(false);
  const src = `/generated/${blueprint.fileName}`;

  return (
    <Motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={`visual-card ${compact ? "visual-card--compact" : ""}`}
    >
      <div className="visual-card__media">
        <div className={`visual-placeholder visual-placeholder--tone-${index % 4}`}>
          <div className="visual-placeholder__grid" />
          <div className="visual-placeholder__orb visual-placeholder__orb--one" />
          <div className="visual-placeholder__orb visual-placeholder__orb--two" />
          <div className="visual-placeholder__panel visual-placeholder__panel--primary" />
          <div className="visual-placeholder__panel visual-placeholder__panel--secondary" />
          <div className="visual-placeholder__label">{blueprint.label}</div>
        </div>
        <img
          src={src}
          alt={blueprint.title}
          loading={priority ? "eager" : "lazy"}
          className={`visual-card__image ${loaded ? "visual-card__image--visible" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
        <span className={`visual-card__state ${loaded ? "visual-card__state--ready" : ""}`}>
          {loaded ? "Generated asset" : "Gemini-ready slot"}
        </span>
      </div>
      <div className="visual-card__body">
        <div className="visual-card__eyebrow">{blueprint.label}</div>
        <h3>{blueprint.title}</h3>
        <p>{blueprint.caption}</p>
      </div>
    </Motion.article>
  );
}

function FeatureCard({ feature, index }) {
  const Icon = featureIcons[index];

  return (
    <SectionReveal delay={index * 0.08}>
      <Motion.article
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="feature-card"
      >
        <div className="feature-card__icon">
          <Icon size={20} />
        </div>
        <div className="feature-card__eyebrow">{feature.eyebrow}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </Motion.article>
    </SectionReveal>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <Motion.article layout className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button className="faq-item__button" onClick={onToggle} type="button">
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
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="faq-item__content-wrap"
          >
            <div className="faq-item__content">{item.answer}</div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </Motion.article>
  );
}

function App() {
  const [activeTrack, setActiveTrack] = useState("All");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const filteredStyles = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return styleCards.filter((card) => {
      const trackMatch = activeTrack === "All" || card.track === activeTrack;
      if (!trackMatch) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [card.name, card.korean, card.summary, card.badge, card.track]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeTrack, deferredQuery]);

  return (
    <div className="page-shell">
      <div className="page-noise" />
      <header className="topbar">
        <a className="brandmark" href="#hero">
          <span className="brandmark__chip">
            <Sparkles size={14} />
          </span>
          <span>{product.name}</span>
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#platform">Platform</a>
          <a href="#visuals">Visuals</a>
          <a href="#templates">Templates</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="topbar__cta" href="#pricing">
          Launch stack
        </a>
      </header>

      <main>
        <section className="hero-section" id="hero">
          <div className="hero-copy">
            <SectionReveal>
              <div className="hero-copy__intro">
                <Pill>{product.label}</Pill>
                <div className="hero-copy__status">
                  <BadgeCheck size={16} />
                  Gemini 3.1 image slot ready
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.06}>
              <h1>{product.title}</h1>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <p className="hero-copy__description">{product.description}</p>
            </SectionReveal>

            <SectionReveal delay={0.14}>
              <div className="hero-actions">
                <a className="button button--primary" href="#visuals">
                  비주얼 구조 보기
                  <ArrowRight size={18} />
                </a>
                <a className="button button--secondary" href="#templates">
                  <Play size={16} />
                  스타일팩 탐색
                </a>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.18}>
              <ul className="proof-list">
                {proofPoints.map((item) => (
                  <li key={item}>
                    <BadgeCheck size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.08} className="hero-visual">
            <div className="hero-visual__frame">
              <GeneratedVisualCard blueprint={imageBlueprints[0]} index={0} priority />
              <div className="hero-visual__overlay hero-visual__overlay--stats">
                <div className="hero-visual__overlay-label">Launch signal</div>
                <strong>{metrics[1].value}</strong>
                <span>{metrics[1].label}</span>
              </div>
              <div className="hero-visual__overlay hero-visual__overlay--queue">
                <Clock3 size={16} />
                <span>Approval queue 03</span>
              </div>
              <div className="hero-visual__dock">
                {operatingSignals.slice(0, 3).map((item) => (
                  <div key={item.title} className="hero-visual__dock-item">
                    <span>{item.title}</span>
                    <strong>{item.detail}</strong>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </section>

        <section className="logo-strip">
          <span className="logo-strip__label">Used for launch flows by design-minded teams</span>
          <div className="logo-strip__marquee">
            {[...partnerMarks, ...partnerMarks].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <section className="metrics-grid">
          {metrics.map((item, index) => (
            <SectionReveal key={item.label} delay={index * 0.05}>
              <article className="metric-card">
                <div className="metric-card__value">{item.value}</div>
                <div className="metric-card__label">{item.label}</div>
              </article>
            </SectionReveal>
          ))}
        </section>

        <section className="section-block" id="platform">
          <SectionReveal>
            <SectionHeader
              eyebrow="Platform"
              title="예쁜 시안 모음이 아니라 실제 운영팀이 쓰는 랜딩 제작 흐름으로 재구성"
              description="원본 코드는 스타일 샘플을 전시하는 구조였습니다. 여기서는 그 장점을 유지하면서, 비주얼 생성과 승인 루프를 포함한 서비스형 랜딩 플랫폼 구조로 바꿨습니다."
            />
          </SectionReveal>

          <div className="feature-grid">
            {featureCards.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          <div className="platform-board">
            <SectionReveal delay={0.04} className="platform-board__content">
              <div className="platform-board__copy">
                <span className="section-header__eyebrow">Operating model</span>
                <h3>브리프 입력부터 승인 완료까지 누가 무엇을 해야 하는지 보이게 만듭니다.</h3>
                <p>
                  디자인 톤 비교, 자산 생성, 검토 로그, 런치 전 체크포인트를 한 대시보드 리듬으로
                  묶었습니다.
                </p>
              </div>
              <div className="platform-board__signals">
                {operatingSignals.map((item, index) => (
                  <Motion.article
                    key={item.title}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                    className="signal-card"
                  >
                    <span className="signal-card__index">0{index + 1}</span>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </Motion.article>
                ))}
              </div>
            </SectionReveal>
          </div>
        </section>

        <section className="section-block workflow-section">
          <SectionReveal>
            <SectionHeader
              eyebrow="Workflow"
              title="Gemini 이미지 생성이 실제 랜딩 제작 공정에 들어가는 위치"
              description="Gemini는 페이지 안에서 직접 키를 들고 호출하지 않고, 자산 생성 파이프라인으로 연결하는 편이 안전합니다. 이 구조를 기준으로 랜딩을 설계했습니다."
            />
          </SectionReveal>

          <div className="workflow-grid">
            {workflowSteps.map((item, index) => (
              <SectionReveal key={item.step} delay={index * 0.07}>
                <article className="workflow-card">
                  <div className="workflow-card__step">{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="section-block" id="visuals">
          <SectionReveal>
            <SectionHeader
              eyebrow="Gemini Visuals"
              title="실제 생성 자산이 들어갈 슬롯을 먼저 설계해 둔 비주얼 섹션"
              description="이미지 파일이 아직 없더라도 페이지는 완성형으로 보이고, `public/generated`에 같은 파일명이 들어오면 자동으로 비주얼이 교체됩니다."
            />
          </SectionReveal>

          <div className="visual-grid">
            {imageBlueprints.map((blueprint, index) => (
              <SectionReveal key={blueprint.id} delay={index * 0.07}>
                <GeneratedVisualCard blueprint={blueprint} index={index} compact={index > 0} />
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="section-block" id="templates">
          <SectionReveal>
            <SectionHeader
              eyebrow="Style Lab"
              title="원본 14개 스타일 쇼케이스의 장점을 템플릿 탐색 영역으로 흡수"
              description="전체 페이지를 스타일 데모 갤러리로 두는 대신, 실제 서비스 안에서 바로 비교 가능한 스타일팩 탐색 영역으로 재배치했습니다."
            />
          </SectionReveal>

          <div className="template-toolbar">
            <div className="template-toolbar__chips">
              {styleTracks.map((track) => (
                <button
                  key={track}
                  type="button"
                  className={`chip-button ${activeTrack === track ? "chip-button--active" : ""}`}
                  onClick={() => startTransition(() => setActiveTrack(track))}
                >
                  {track}
                </button>
              ))}
            </div>

            <label className="search-field">
              <Search size={16} />
              <input
                type="search"
                placeholder="스타일 이름이나 요약 검색"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className={`template-grid ${isPending ? "template-grid--pending" : ""}`}>
            {filteredStyles.map((card, index) => (
              <SectionReveal key={card.name} delay={index * 0.04}>
                <Motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="template-card"
                >
                  <div className="template-card__top">
                    <Pill>{card.badge}</Pill>
                    <span className="template-card__track">{card.track}</span>
                  </div>
                  <div className="template-card__art" data-track={card.track.toLowerCase()}>
                    <div className="template-card__art-block template-card__art-block--main" />
                    <div className="template-card__art-block template-card__art-block--side" />
                    <div className="template-card__art-chip">{card.korean}</div>
                  </div>
                  <div className="template-card__body">
                    <h3>{card.name}</h3>
                    <strong>{card.korean}</strong>
                    <p>{card.summary}</p>
                  </div>
                </Motion.article>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="section-block pricing-section" id="pricing">
          <SectionReveal>
            <SectionHeader
              eyebrow="Pricing"
              title="스타일 실험부터 운영 자동화까지 확장 가능한 플랜"
              description="랜딩페이지를 한번 예쁘게 만드는 데서 끝나지 않고, 반복 런치와 승인 프로세스까지 다룰 수 있게 가격 구조를 잡았습니다."
            />
          </SectionReveal>

          <div className="pricing-grid">
            {planCards.map((plan, index) => (
              <SectionReveal key={plan.name} delay={index * 0.06}>
                <Motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className={`pricing-card ${plan.highlight ? "pricing-card--highlight" : ""}`}
                >
                  <div className="pricing-card__top">
                    <div>
                      <span className="pricing-card__name">{plan.name}</span>
                      <p>{plan.description}</p>
                    </div>
                    {plan.highlight ? <Pill>Recommended</Pill> : null}
                  </div>
                  <div className="pricing-card__price">{plan.price}</div>
                  <ul className="pricing-card__list">
                    {plan.items.map((item) => (
                      <li key={item}>
                        <BadgeCheck size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a className="button button--ghost" href="#hero">
                    시작하기
                    <ArrowRight size={18} />
                  </a>
                </Motion.article>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="section-block bottom-grid">
          <div className="bottom-grid__left">
            <SectionReveal>
              <SectionHeader
                eyebrow="Voices"
                title="디자인 톤과 운영 속도를 같이 본다는 점이 차별점"
                description="트렌디함만 남기면 실제 작업에서는 오래 못 갑니다. 그래서 팀이 반복해서 쓰는 구조와 피드백이 함께 보이도록 설계했습니다."
              />
            </SectionReveal>

            <div className="testimonial-grid">
              {testimonials.map((item, index) => (
                <SectionReveal key={item.name} delay={index * 0.06}>
                  <Motion.article
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                    className="testimonial-card"
                  >
                    <div className="testimonial-card__icon">
                      <MessagesSquare size={18} />
                    </div>
                    <p>{item.quote}</p>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </Motion.article>
                </SectionReveal>
              ))}
            </div>
          </div>

          <div className="bottom-grid__right">
            <SectionReveal>
              <SectionHeader
                eyebrow="FAQ"
                title="실제 적용 전에 많이 묻는 부분"
                description="Gemini 키 처리와 이미지 생성 위치를 포함해, 이 구조를 바로 이어서 쓸 때 필요한 기준만 남겼습니다."
              />
            </SectionReveal>

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
          </div>
        </section>
      </main>

      <footer className="footer-cta">
        <SectionReveal>
          <div className="footer-cta__card">
            <div className="footer-cta__copy">
              <span className="section-header__eyebrow">Ready to wire images</span>
              <h2>Gemini 3.1 자산만 넣으면 바로 실제 랜딩으로 전환되는 상태까지 구성했습니다.</h2>
              <p>
                키를 로컬 환경 변수로 설정한 뒤 이미지 생성 스크립트를 실행하면, 현재 페이지 슬롯에
                실자산이 자동으로 연결됩니다.
              </p>
            </div>
            <div className="footer-cta__actions">
              <a className="button button--primary" href="#visuals">
                비주얼 슬롯 확인
                <Images size={18} />
              </a>
              <a className="button button--secondary" href="#platform">
                구현 구조 보기
                <PanelsTopLeft size={18} />
              </a>
            </div>
            <div className="footer-cta__meta">
              <span>
                <Layers3 size={16} />
                Service-platform layout
              </span>
              <span>
                <Rocket size={16} />
                Gemini asset pipeline
              </span>
              <span>
                <BarChart3 size={16} />
                Launch-ready sections
              </span>
            </div>
          </div>
        </SectionReveal>
      </footer>
    </div>
  );
}

export default App;
