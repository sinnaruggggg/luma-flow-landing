import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Clock3, Copy, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { themeStyle, useBackdropPointer } from "../lib/showcaseUtils";
import { SceneBackdrop, ShowcasePhone, WebForgeMark } from "./showcaseAtoms";

const PRIORITY_SITE_IDS = ["indie-bookstore", "stationery-shop", "local-cafe", "boutique-hotel"];
const TOP_NAV_ITEMS = [
  { label: "샘플 둘러보기", sectionId: "samples" },
  { label: "제작 방식", sectionId: "process" },
  { label: "기능", sectionId: "features" },
  { label: "요금", sectionId: "pricing" },
  { label: "문의하기", sectionId: "contact" },
];

const PROCESS_STEPS = [
  { step: "01", title: "샘플 선택", text: "업종과 무드가 가장 가까운 샘플을 먼저 고르고 출발합니다." },
  { step: "02", title: "기능 정리", text: "예약, 상담, 커머스, 브랜드 소개 중 필요한 흐름만 묶어 구조를 잡습니다." },
  { step: "03", title: "빠른 제작", text: "확정된 방향으로 PC와 모바일 화면을 함께 다듬고 바로 배포 가능한 상태까지 만듭니다." },
];

const FEATURE_ITEMS = [
  { title: "샘플 기반 제작", text: "추상적인 설명이 아니라 실제 샘플을 보고 바로 방향을 정할 수 있습니다." },
  { title: "반응형 동시 설계", text: "데스크톱과 모바일을 따로 땜질하지 않고 처음부터 함께 맞춥니다." },
  { title: "업종별 흐름 반영", text: "브랜드형, 예약형, 쇼핑형, 소개형 페이지 흐름을 목적에 맞게 다듬습니다." },
  { title: "빠른 수정 대응", text: "시안 확정 후 텍스트, 섹션, CTA 흐름을 빠르게 정리할 수 있습니다." },
];

const PRICING_PLANS = [
  { name: "시작형", price: "149,000원", description: "가볍게 시작하는 기본형입니다. 소개 화면을 빠르게 만들고 싶은 경우에 맞습니다.", items: ["랜딩 1페이지 + 1~3페이지", "문구·이미지 교체", "모바일 최적화"] },
  { name: "기본형", price: "299,000원", description: "가장 많이 선택하는 구성입니다. 문의 유도와 화면 구성을 함께 다듬습니다.", items: ["핵심 섹션 확장", "CTA·문의 흐름 구성", "기본 수정 2회"], featured: true },
  { name: "확장형", price: "499,000원", description: "페이지 추가나 커스터마이징 범위가 더 큰 경우에 맞는 확장형입니다.", items: ["서브 페이지 추가", "예약·상담 흐름 설계", "배포 반영 지원"] },
];

const CONTACT_POINTS = [
  "원하는 샘플 1개 고르기",
  "어디까지 바꿀지 정하기",
  "참조 링크와 이미지를 함께 보내기",
];

const CUSTOMIZATION_LEVELS = [
  "문구와 이미지 정도만 바꾸기",
  "섹션 순서와 구성을 조금 바꾸기",
  "페이지 추가와 기능까지 같이 바꾸기",
];

const BUDGET_OPTIONS = [
  "149,000원 ~ 299,000원",
  "300,000원 ~ 499,000원",
  "500,000원 이상",
];

const TIMELINE_OPTIONS = ["1주 이내", "2주 이내", "3주 이상"];

const EXTERNAL_REQUEST_CHANNELS = [
  {
    name: "크몽",
    href: "https://kmong.com",
    description: "공식 사이트에서 홈페이지 제작 또는 랜딩페이지 제작으로 검색한 뒤, 아래 문의 내용을 붙여넣어 요청하세요.",
  },
  {
    name: "숨고",
    href: "https://soomgo.com",
    description: "요청서에 샘플명, 예산, 일정, 참조 링크를 함께 적으면 비교와 상담이 더 빨라집니다.",
  },
];

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
}

function orderSites(sites) {
  const rank = new Map(PRIORITY_SITE_IDS.map((siteId, index) => [siteId, index]));

  return [...sites].sort((left, right) => {
    const leftRank = rank.get(left.id);
    const rightRank = rank.get(right.id);

    if (leftRank !== undefined || rightRank !== undefined) {
      if (leftRank === undefined) return 1;
      if (rightRank === undefined) return -1;
      return leftRank - rightRank;
    }

    return left.brand.localeCompare(right.brand);
  });
}

function coverageLabel(site) {
  if (site.gallery.publicReady) return "5페이지 완성";
  if (site.gallery.homeReady) return `라우트 공개 ${site.gallery.readyRoutes}/${site.gallery.totalRoutes}`;
  if (site.gallery.stitchedRoutes > 0) return `제작 중 ${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes}`;
  return "준비 중";
}

function normalizeRouteLabel(label = "") {
  return label.replace(/\s+/g, "").trim();
}

function patchStageRouteLinks(frame, site, onNavigate) {
  try {
    const doc = frame.contentDocument;
    if (!doc) return;

    const routeMap = new Map();
    site.routes.forEach((item) => {
      if (!item.ready) return;

      [item.label, item.legacyLabel].forEach((candidate) => {
        const normalized = normalizeRouteLabel(candidate);
        if (normalized) {
          routeMap.set(normalized, item);
        }
      });
    });

    doc.querySelectorAll("a, button, [role='button']").forEach((element) => {
      const label = normalizeRouteLabel(element.getAttribute("aria-label") || element.textContent || "");
      const matchedRoute = routeMap.get(label);
      if (!matchedRoute) return;
      if (element.dataset.webforgeRoute === matchedRoute.slug) return;

      element.dataset.webforgeRoute = matchedRoute.slug;

      if (element.tagName === "A") {
        element.setAttribute("href", buildSitePath(site.id, matchedRoute.slug));
      }

      element.style.cursor = "pointer";
      element.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onNavigate(buildSitePath(site.id, matchedRoute.slug));
      };
    });
  } catch {
    // Static previews are same-origin HTML; if a page falls back to an image, we simply skip patching.
  }
}

function PreviewSurface({ stage, title, className = "", loading = "lazy", mode = "desktop" }) {
  const hasLivePreview = Boolean(stage.html);

  return (
    <div className={`preview-surface ${className}`.trim()} data-mode={mode} data-live={hasLivePreview ? "true" : "false"}>
      {hasLivePreview ? (
        <div className="preview-surface__live">
          <iframe title={title} src={stage.html} loading={loading} tabIndex={-1} />
        </div>
      ) : (
        <img src={stage.image} alt={stage.alt} loading={loading} />
      )}
    </div>
  );
}

function ContactBrief({ sampleOptions, initialSampleId = "" }) {
  const [form, setForm] = useState(() => ({
    sampleId: (initialSampleId || sampleOptions[0]?.id) ?? "",
    plan: PRICING_PLANS[1]?.name ?? "",
    customization: CUSTOMIZATION_LEVELS[1],
    budget: BUDGET_OPTIONS[0],
    timeline: TIMELINE_OPTIONS[1],
    references: "",
    details: "",
  }));
  const [copyLabel, setCopyLabel] = useState("문의 내용 복사");

  const selectedSample = sampleOptions.find((item) => item.id === form.sampleId);
  const inquiryText = [
    "[WebForge 문의 정리]",
    `선택한 샘플: ${selectedSample ? selectedSample.brand : "미정"}`,
    `예상 플랜: ${form.plan}`,
    `커스터마이징 범위: ${form.customization}`,
    `예산 범위: ${form.budget}`,
    `희망 일정: ${form.timeline}`,
    `참조 사이트 / 이미지: ${form.references || "없음"}`,
    `문의 내용: ${form.details || "없음"}`,
  ].join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopyLabel("복사 완료");
      window.setTimeout(() => setCopyLabel("문의 내용 복사"), 1800);
    } catch {
      setCopyLabel("복사 실패");
      window.setTimeout(() => setCopyLabel("문의 내용 복사"), 1800);
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="hub-brief-form">
      <div className="hub-brief-grid">
        <label className="hub-brief-field">
          <span>샘플 선택</span>
          <select value={form.sampleId} onChange={(event) => updateField("sampleId", event.target.value)}>
            {sampleOptions.map((site) => (
              <option key={site.id} value={site.id}>
                {site.brand}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>예상 플랜</span>
          <select value={form.plan} onChange={(event) => updateField("plan", event.target.value)}>
            {PRICING_PLANS.map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name} · {plan.price}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>커스터마이징 정도</span>
          <select value={form.customization} onChange={(event) => updateField("customization", event.target.value)}>
            {CUSTOMIZATION_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>예산 범위</span>
          <select value={form.budget} onChange={(event) => updateField("budget", event.target.value)}>
            {BUDGET_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>희망 일정</span>
          <select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)}>
            {TIMELINE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

      </div>

      <label className="hub-brief-field">
        <span>참조 사이트 / 참조 이미지 링크</span>
        <textarea
          rows={3}
          value={form.references}
          onChange={(event) => updateField("references", event.target.value)}
          placeholder="참고하고 싶은 사이트 URL, 인스타그램 링크, 드라이브 링크 등을 적어주세요."
        />
      </label>

      <label className="hub-brief-field">
        <span>문의 내용</span>
        <textarea
          rows={5}
          value={form.details}
          onChange={(event) => updateField("details", event.target.value)}
          placeholder="원하는 분위기, 꼭 필요한 기능, 바꾸고 싶은 부분을 편하게 적어주세요."
        />
      </label>

      <div className="hub-brief-actions">
        <button type="button" className="hub-topbar__cta" onClick={handleCopy}>
          <Copy size={15} />
          {copyLabel}
        </button>
        <p className="hub-contact-note">복사한 내용을 크몽, 숨고, 메일, 오픈채팅, DM 등에 그대로 붙여넣어 문의할 수 있습니다.</p>
      </div>
    </div>
  );
}

function GalleryCard({ site, onOpen, onContact, isSelectedForInquiry }) {
  const canOpen = site.gallery.homeReady;
  const desktopStage = site.routeAssets.home.desktop;
  const mobileStage = site.routeAssets.home.mobile;

  return (
    <article className={`hub-card ${canOpen ? "" : "hub-card--disabled"}`.trim()}>
      <div className="hub-card__visual">
        <div className="hub-card__desktop-frame">
          <PreviewSurface stage={desktopStage} title={`${site.brand} PC 미리보기`} className="hub-card__desktop-shot" mode="desktop" />
        </div>
        <ShowcasePhone src={mobileStage.image} html={mobileStage.html} alt={`${site.brand} 모바일 미리보기`} title={`${site.brand} 모바일 홈`} />
      </div>
      <div className="hub-card__body">
        <div className="hub-card__meta">
          <span>{site.homeMode}</span>
          <span>{coverageLabel(site)}</span>
        </div>
        <strong>{site.brand}</strong>
        <p>{site.summary}</p>
        <div className="hub-card__footer">
          <span>{site.industry}</span>
          <div className="hub-card__actions">
            <button
              type="button"
              className={`hub-card__button hub-card__button--secondary ${isSelectedForInquiry ? "is-selected" : ""}`.trim()}
              onClick={() => onContact(site.id)}
            >
              문의하기
            </button>
            <button type="button" className="hub-card__button hub-card__button--primary" onClick={() => onOpen(buildSitePath(site.id))} disabled={!canOpen}>
              {canOpen ? "사이트 보기" : "준비 중"}
              {canOpen ? <ChevronRight size={16} /> : <Clock3 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function GalleryHome({ onOpen, onContactSample, selectedContactSiteId = "" }) {
  const orderedSites = orderSites(siteRegistry);
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  useEffect(() => {
    if (!selectedContactSiteId) return undefined;

    const frame = window.requestAnimationFrame(() => scrollToSection("contact"));
    return () => window.cancelAnimationFrame(frame);
  }, [selectedContactSiteId]);

  function handleContactSample(siteId) {
    onContactSample(siteId);

    if (selectedContactSiteId === siteId) {
      scrollToSection("contact");
    }
  }

  return (
    <div className="hub-page" style={pointerStyle} onPointerMove={onPointerMove}>
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <header className="hub-topbar">
          <div className="hub-topbar__brand">
            <WebForgeMark />
            <div>
              <strong>WebForge</strong>
            </div>
          </div>
          <nav className="hub-topbar__nav" aria-label="메인 메뉴">
            {TOP_NAV_ITEMS.map((item) => (
              <button key={item.sectionId} type="button" className="hub-topbar__nav-item" onClick={() => scrollToSection(item.sectionId)}>
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="hub-topbar__cta" onClick={() => scrollToSection("contact")}>사이트 만들기</button>
        </header>

        <section className="hub-hero hub-hero--minimal" aria-label="WebForge 소개">
          <div className="hub-hero__content hub-hero__content--minimal">
            <h1>원하는 분위기의 샘플로 내 사이트를 빠르게 시작하세요</h1>
          </div>
        </section>

        <section id="samples" className="hub-section" aria-label="샘플 갤러리">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Showcase</span>
            <p>실제 홈페이지처럼 구성된 샘플을 보고, 가장 가까운 스타일과 구조를 빠르게 고를 수 있습니다.</p>
          </div>
          <div className="hub-grid">
            {orderedSites.map((site) => (
              <GalleryCard key={site.id} site={site} onOpen={onOpen} onContact={handleContactSample} isSelectedForInquiry={selectedContactSiteId === site.id} />
            ))}
          </div>
        </section>

        <section id="process" className="hub-section" aria-labelledby="process-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">How It Works</span>
            <h2 id="process-heading">복잡하게 설명하지 않고, 빠르게 방향을 잡습니다.</h2>
          </div>
          <div className="hub-process-grid">
            {PROCESS_STEPS.map((item) => (
              <article key={item.step} className="hub-info-card">
                <span className="hub-info-card__step">{item.step}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="hub-section" aria-labelledby="features-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Features</span>
            <h2 id="features-heading">실제로 필요한 기능만 정리해서 붙입니다.</h2>
          </div>
          <div className="hub-feature-grid">
            {FEATURE_ITEMS.map((item) => (
              <article key={item.title} className="hub-info-card hub-info-card--feature">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="hub-section" aria-labelledby="pricing-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Pricing</span>
            <h2 id="pricing-heading">149,000원부터 시작하는 3단계 요금으로 쉽게 고를 수 있습니다.</h2>
            <p>복잡한 견적 대신 시작형, 기본형, 확장형으로 나눴습니다. 먼저 고르고, 필요한 만큼만 커스터마이징하면 됩니다.</p>
          </div>
          <div className="hub-pricing-grid">
            {PRICING_PLANS.map((plan) => (
              <article key={plan.name} className={`hub-price-card ${plan.featured ? "hub-price-card--featured" : ""}`.trim()}>
                <span>{plan.name}</span>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="hub-section hub-section--contact" aria-labelledby="contact-heading">
          <div className="hub-contact-card">
            <div className="hub-section__header">
              <span className="hub-section__eyebrow">Contact</span>
              <h2 id="contact-heading">샘플 선택부터 문의 정리까지 이 화면에서 바로 준비할 수 있습니다.</h2>
              <p>어느 정도 커스터마이징할지 고르고, 참조 사이트나 이미지를 적고, 문의 내용을 작성한 뒤 복사해서 원하는 채널로 보내면 됩니다.</p>
            </div>
            <div className="hub-contact-card__points">
              {CONTACT_POINTS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="hub-contact-layout">
              <ContactBrief key={selectedContactSiteId || "default-contact-brief"} sampleOptions={orderedSites} initialSampleId={selectedContactSiteId} />

              <div className="hub-contact-side">
                <article className="hub-contact-panel">
                  <strong>이렇게 보내면 이해가 빠릅니다.</strong>
                  <ul className="hub-contact-checklist">
                    <li>선택한 샘플 이름을 먼저 적습니다.</li>
                    <li>문구만 수정인지, 섹션 변경인지, 새 기능 추가인지 같이 적습니다.</li>
                    <li>참조 사이트 링크나 캡처 이미지를 함께 보내면 방향을 맞추기 쉽습니다.</li>
                  </ul>
                </article>

                <article className="hub-contact-panel">
                  <strong>외부 플랫폼으로도 요청할 수 있습니다.</strong>
                  <p>아래 버튼은 공식 사이트로 연결됩니다. 복사한 문의 내용을 붙여넣어 요청서를 작성하면 됩니다.</p>
                  <div className="hub-platform-grid">
                    {EXTERNAL_REQUEST_CHANNELS.map((channel) => (
                      <a key={channel.name} className="hub-link-button" href={channel.href} target="_blank" rel="noreferrer">
                        <span>{channel.name}</span>
                        <ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                  <div className="hub-platform-list">
                    {EXTERNAL_REQUEST_CHANNELS.map((channel) => (
                      <p key={channel.name}>{channel.description}</p>
                    ))}
                  </div>
                </article>

                <article className="hub-contact-panel">
                  <strong>기타 문의 방법 안내</strong>
                  <p>크몽이나 숨고가 아니어도 괜찮습니다. 메일, 오픈채팅, DM, 카카오톡 상담 링크가 있다면 같은 내용으로 먼저 문의하면 됩니다.</p>
                </article>
              </div>
            </div>
            <button type="button" className="hub-topbar__cta" onClick={() => scrollToSection("samples")}>샘플 다시 보기</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function DeviceSwitch({ viewMode, onViewChange }) {
  return (
    <div className="device-switch">
      <button type="button" className={viewMode === "desktop" ? "is-active" : ""} onClick={() => onViewChange("desktop")}>
        <Monitor size={15} />
        PC
      </button>
      <button type="button" className={viewMode === "mobile" ? "is-active" : ""} onClick={() => onViewChange("mobile")}>
        <Smartphone size={15} />
        Mobile
      </button>
    </div>
  );
}

function SiteTopbar({ site, viewMode, isMobileClient, onViewChange, onBack, onContact }) {
  return (
    <header className="site-topbar">
      <div className="site-topbar__start">
        <button type="button" className="site-topbar__back" onClick={onBack}>
          <ArrowLeft size={18} />
          갤러리
        </button>
        <div className="site-topbar__brand">
          <strong>{site.brand}</strong>
          <span>{site.industry}</span>
        </div>
      </div>
      <div className="site-topbar__end">
        {!isMobileClient ? <DeviceSwitch viewMode={viewMode} onViewChange={onViewChange} /> : null}
        <button type="button" className="site-topbar__contact" onClick={onContact}>
          문의하기
        </button>
      </div>
    </header>
  );
}

function ScreenStage({ site, route, actualView, isMobileClient, onNavigate }) {
  const stage = site.routeAssets[route.slug][actualView];
  const frameClass = actualView === "mobile" && !isMobileClient ? "screen-stage__frame screen-stage__frame--phone" : "screen-stage__frame";
  const title = `${site.brand} ${route.label}`;
  const frameRef = useRef(null);

  useEffect(() => {
    if (!stage.html || !frameRef.current) {
      return undefined;
    }

    const frame = frameRef.current;
    const syncRoutes = () => patchStageRouteLinks(frame, site, onNavigate);

    frame.addEventListener("load", syncRoutes);
    syncRoutes();

    return () => frame.removeEventListener("load", syncRoutes);
  }, [onNavigate, site, stage.html]);

  return (
    <section className={`screen-stage screen-stage--${actualView}`} aria-label={title}>
      <div className={frameClass} style={{ "--stage-height": `${stage.stageHeight}px` }}>
        {actualView === "mobile" && !isMobileClient ? <span className="screen-stage__notch" aria-hidden="true" /> : null}
        {stage.html ? <iframe ref={frameRef} title={title} src={stage.html} loading="lazy" /> : <img src={stage.image} alt={stage.alt} loading="lazy" />}
      </div>
    </section>
  );
}

export function SiteView({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack, onContact }) {
  const actualView = isMobileClient ? "mobile" : viewMode;
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  return (
    <div className="site-shell" data-tone={site.backdrop} data-view={actualView} style={{ ...themeStyle(site.theme), ...pointerStyle }} onPointerMove={onPointerMove}>
      <SceneBackdrop tone={site.backdrop} />
      <div className="site-shell__content site-shell__content--immersive">
        <SiteTopbar site={site} viewMode={actualView} isMobileClient={isMobileClient} onViewChange={onViewChange} onBack={onBack} onContact={onContact} />
        <main className="site-main site-main--immersive">
          <ScreenStage site={site} route={route} actualView={actualView} isMobileClient={isMobileClient} onNavigate={onNavigate} />
        </main>
      </div>
    </div>
  );
}

export function SiteStaging({ site, route, onHome, onOpenHome }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone={site.backdrop} />
      <div className="hub-page__content">
        <section className="missing-card">
          <span>준비 중</span>
          <h1>{site.brand} {route.label} 페이지를 정리하고 있습니다.</h1>
          <p>현재는 홈 화면까지 공개되어 있고, 나머지 페이지는 순차적으로 연결 중입니다.</p>
          <div className="tag-rail">
            <span>{site.homeMode}</span>
            <span>{site.industry}</span>
            <span>완성 라우트 {site.gallery.readyRoutes}/{site.gallery.totalRoutes}</span>
          </div>
          {site.gallery.homeReady ? <button type="button" className="cta cta--primary" onClick={onOpenHome}>홈 보기</button> : null}
          <button type="button" className="cta cta--secondary" onClick={onHome}>갤러리로 돌아가기</button>
        </section>
      </div>
    </div>
  );
}

export function NotFound({ onHome }) {
  return (
    <div className="hub-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <section className="missing-card">
          <span>찾을 수 없음</span>
          <h1>요청한 페이지를 찾지 못했습니다.</h1>
          <p>갤러리로 돌아가 다른 샘플 사이트를 확인해 주세요.</p>
          <button type="button" className="cta cta--primary" onClick={onHome}>갤러리로 돌아가기</button>
        </section>
      </div>
    </div>
  );
}
