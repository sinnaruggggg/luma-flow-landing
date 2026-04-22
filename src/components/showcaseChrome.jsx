import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Clock3, Copy, ExternalLink, Monitor, SendHorizontal, Smartphone } from "lucide-react";
import { BRAND_INQUIRY_HEADER, BRAND_INTRO_LABEL, BRAND_NAME } from "../content/brand";
import { GALLERY_COPY_DEFAULTS, INQUIRY_DEFAULTS } from "../content/siteAdminDefaults";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { submitInquiry } from "../lib/inquiryApi";
import { useBackdropPointer } from "../lib/showcaseUtils";
import { BrandMark, SceneBackdrop, ShowcasePhone } from "./showcaseAtoms";

const TOP_NAV_ITEMS = [
  { label: "포트폴리오", routePath: "/portfolio" },
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

const INQUIRY_RECOVERY_NOTICE = {
  title: "재접수 안내",
  text: "2026년 4월 16일 오후 9시 21분 이전에 문의하신 경우 저장 누락 가능성이 있어, 아래 폼으로 다시 접수해 주세요.",
};

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
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

function applyFallbackImage(event, fallbackSrc) {
  const target = event.currentTarget;

  if (!fallbackSrc || target.dataset.fallbackApplied === "true" || target.currentSrc === fallbackSrc) {
    return;
  }

  target.dataset.fallbackApplied = "true";
  target.src = fallbackSrc;
}

function PreviewSurface({ preview, className = "", mode = "desktop" }) {
  return (
    <div className={`preview-surface ${className}`.trim()} data-mode={mode}>
      <img
        src={preview.src}
        alt={preview.alt}
        loading="lazy"
        decoding="async"
        onError={preview.fallbackSrc ? (event) => applyFallbackImage(event, preview.fallbackSrc) : undefined}
      />
    </div>
  );
}

function ContactBrief({ sampleOptions, initialSampleId = "", inquirySettings = INQUIRY_DEFAULTS }) {
  const pricingPlans = inquirySettings.pricingPlans?.length ? inquirySettings.pricingPlans : INQUIRY_DEFAULTS.pricingPlans;
  const customizationLevels = inquirySettings.customizationLevels?.length ? inquirySettings.customizationLevels : INQUIRY_DEFAULTS.customizationLevels;
  const budgetOptions = inquirySettings.budgetOptions?.length ? inquirySettings.budgetOptions : INQUIRY_DEFAULTS.budgetOptions;
  const timelineOptions = inquirySettings.timelineOptions?.length ? inquirySettings.timelineOptions : INQUIRY_DEFAULTS.timelineOptions;
  const defaultPlanIndex = Math.min(1, Math.max(pricingPlans.length - 1, 0));
  const defaultOptionIndex = Math.min(1, Math.max(customizationLevels.length - 1, 0));

  const [form, setForm] = useState(() => ({
    sampleId: (initialSampleId || sampleOptions[0]?.id) ?? "",
    plan: pricingPlans[defaultPlanIndex]?.name ?? "",
    customization: customizationLevels[defaultOptionIndex] ?? customizationLevels[0] ?? "",
    budget: budgetOptions[0] ?? "",
    timeline: timelineOptions[defaultOptionIndex] ?? timelineOptions[0] ?? "",
    contactName: "",
    email: "",
    phone: "",
    references: "",
    details: "",
  }));
  const [copyLabel, setCopyLabel] = useState("문의 내용 복사");
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const selectedSample = sampleOptions.find((item) => item.id === form.sampleId);
  const inquiryText = [
    BRAND_INQUIRY_HEADER,
    `선택한 샘플: ${selectedSample ? selectedSample.brand : "미정"}`,
    `예상 플랜: ${form.plan}`,
    `커스터마이징 범위: ${form.customization}`,
    `예산 범위: ${form.budget}`,
    `희망 일정: ${form.timeline}`,
    `이름: ${form.contactName || "없음"}`,
    `이메일: ${form.email || "없음"}`,
    `연락처: ${form.phone || "없음"}`,
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

  async function handleSubmit() {
    if (!form.contactName.trim()) {
      setSubmitState({ status: "error", message: "이름을 입력해 주세요." });
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setSubmitState({ status: "error", message: "이메일 또는 연락처를 하나 이상 입력해 주세요." });
      return;
    }

    if (!form.details.trim()) {
      setSubmitState({ status: "error", message: "문의 내용을 입력해 주세요." });
      return;
    }

    setSubmitState({ status: "submitting", message: "문의 내용을 서버에 저장하고 있습니다." });

    try {
      await submitInquiry({
        sampleId: form.sampleId,
        sampleBrand: selectedSample?.brand ?? "",
        plan: form.plan,
        customization: form.customization,
        budget: form.budget,
        timeline: form.timeline,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        references: form.references,
        details: form.details,
        sourcePath: window.location.pathname,
      });

      setSubmitState({ status: "success", message: "문의사항이 접수되었습니다." });
    } catch (error) {
      setSubmitState({ status: "error", message: error.message || "문의 저장에 실패했습니다." });
    }
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
            {pricingPlans.map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name} · {plan.price}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>커스터마이징 정도</span>
          <select value={form.customization} onChange={(event) => updateField("customization", event.target.value)}>
            {customizationLevels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>이름</span>
          <input
            type="text"
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="성함 또는 업체명을 적어주세요."
          />
        </label>

        <label className="hub-brief-field">
          <span>이메일</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="답변 받을 이메일"
          />
        </label>

        <label className="hub-brief-field">
          <span>연락처</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="010-0000-0000"
          />
        </label>

        <label className="hub-brief-field">
          <span>예산 범위</span>
          <select value={form.budget} onChange={(event) => updateField("budget", event.target.value)}>
            {budgetOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>희망 일정</span>
          <select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)}>
            {timelineOptions.map((item) => (
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
        <div className="hub-brief-actions__row">
          <button type="button" className="hub-topbar__cta hub-topbar__cta--soft" onClick={handleCopy}>
            <Copy size={15} />
            {copyLabel}
          </button>
          <button type="button" className="hub-topbar__cta" onClick={handleSubmit} disabled={submitState.status === "submitting"}>
            <SendHorizontal size={15} />
            {submitState.status === "submitting" ? "저장 중..." : "문의하기"}
          </button>
        </div>
        <p className="hub-contact-note">복사한 내용을 크몽, 숨고, 메일, 오픈채팅, DM 등에 그대로 붙여넣어 문의할 수 있습니다.</p>
        {submitState.message ? (
          <p className={`hub-feedback-note hub-feedback-note--${submitState.status === "error" ? "error" : "success"}`.trim()}>
            {submitState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const PORTFOLIO_FALLBACK_DESKTOP = "/portfolio/aim-furniture/home-desktop.png";
const PORTFOLIO_FALLBACK_MOBILE = "/portfolio/aim-furniture/home-mobile.png";

function PortfolioCard({ item, onOpen }) {
  const canOpen = Boolean(item.embedSrc);
  const desktopPreview = {
    src: item.desktopImage || item.mobileImage || PORTFOLIO_FALLBACK_DESKTOP,
    alt: `${item.title} desktop preview`,
  };
  const mobileImage = item.mobileImage || item.desktopImage || PORTFOLIO_FALLBACK_MOBILE;

  return (
    <article className="hub-card portfolio-card">
      <div className="hub-card__visual portfolio-card__visual">
        <div className="hub-card__desktop-frame">
          <PreviewSurface preview={desktopPreview} className="hub-card__desktop-shot" mode="desktop" />
        </div>
        <ShowcasePhone src={mobileImage} alt={`${item.title} mobile preview`} title={`${item.title} mobile preview`} loading="lazy" decoding="async" />
      </div>
      <div className="hub-card__body">
        <div className="hub-card__meta">
          <span>{item.category}</span>
          <span>{item.status}</span>
        </div>
        <strong>{item.title}</strong>
        <p>{item.description}</p>
        <div className="portfolio-card__highlights">
          {(item.highlights ?? []).map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <div className="hub-card__footer">
          <span>{item.stack}</span>
          <div className="hub-card__actions">
            <button type="button" className="hub-card__button hub-card__button--primary" onClick={() => onOpen?.(item.id)} disabled={!canOpen}>
              {canOpen ? "임베딩 보기" : "임베드 준비 중"}
              {canOpen ? <ChevronRight size={16} /> : <Clock3 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GalleryCard({ site, onOpen, onContact, isSelectedForInquiry }) {
  const canOpen = site.gallery.homeReady;
  const desktopPreview = site.galleryThumbs.desktop;
  const mobilePreview = site.galleryThumbs.mobile;

  return (
    <article className={`hub-card ${canOpen ? "" : "hub-card--disabled"}`.trim()}>
      <div className="hub-card__visual">
        <div className="hub-card__desktop-frame">
          <PreviewSurface preview={desktopPreview} className="hub-card__desktop-shot" mode="desktop" />
        </div>
        <ShowcasePhone
          src={mobilePreview.src}
          fallbackSrc={mobilePreview.fallbackSrc}
          alt={mobilePreview.alt}
          title={`${site.brand} mobile home`}
          loading="lazy"
          decoding="async"
        />
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

export function PortfolioEmbedView({ item, onBack }) {
  if (!item) {
    return (
      <div className="hub-page">
        <SceneBackdrop tone="gallery" />
        <div className="hub-page__content">
          <section className="missing-card">
            <span>포트폴리오 없음</span>
            <h1>요청한 포트폴리오를 찾을 수 없습니다.</h1>
            <p>관리자 페이지에서 공개 상태와 포트폴리오 ID를 확인해 주세요.</p>
            <button type="button" className="cta cta--primary" onClick={onBack}>메인으로 돌아가기</button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <main className="portfolio-embed-view">
      <div className="portfolio-embed-toolbar">
        <button type="button" className="site-preview-toolbar__back" onClick={onBack}>
          <ArrowLeft size={15} />
          돌아가기
        </button>
        <div className="portfolio-embed-toolbar__title">
          <strong>{item.title}</strong>
          <span>{item.category} · {item.status}</span>
        </div>
      </div>
      <iframe className="portfolio-embed-frame" title={`${item.title} 임베딩`} src={item.embedSrc} loading="eager" />
    </main>
  );
}

export function PortfolioIndexView({ items = [], onBack, onOpen }) {
  return (
    <div className="hub-page portfolio-index-page">
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content">
        <header className="hub-topbar">
          <div className="hub-topbar__brand">
            <BrandMark />
            <div>
              <strong>{BRAND_NAME}</strong>
            </div>
          </div>
          <button type="button" className="hub-topbar__cta hub-topbar__cta--soft" onClick={onBack}>
            <ArrowLeft size={15} />
            메인으로
          </button>
        </header>

        <section className="portfolio-index-hero" aria-labelledby="portfolio-index-heading">
          <span className="hub-section__eyebrow">Portfolio</span>
          <h1 id="portfolio-index-heading">포트폴리오</h1>
          <p>이 프로젝트에 귀속한 사이트들을 큰 썸네일로 모았습니다. 카드를 누르면 주소를 보이지 않고 내부 화면에서 바로 열립니다.</p>
        </section>

        {items.length > 0 ? (
          <section className="portfolio-index-grid" aria-label="포트폴리오 목록">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} onOpen={onOpen} />
            ))}
          </section>
        ) : (
          <div className="hub-empty-state">
            <strong>등록된 포트폴리오가 없습니다.</strong>
            <p>관리자 페이지에서 포트폴리오 사이트를 등록하면 이 페이지에 큰 썸네일 카드로 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryHome({
  sites = siteRegistry,
  content = GALLERY_COPY_DEFAULTS,
  inquirySettings = INQUIRY_DEFAULTS,
  onOpen,
  onOpenPortfolioIndex,
  onContactSample,
  selectedContactSiteId = "",
}) {
  const visibleSites = sites.filter((site) => site.admin?.visible !== false);
  const sampleOptions = visibleSites.length > 0 ? visibleSites : sites;
  const pricingPlans = inquirySettings.pricingPlans?.length ? inquirySettings.pricingPlans : INQUIRY_DEFAULTS.pricingPlans;
  const contactPoints = inquirySettings.contactPoints ?? [];
  const externalChannels = inquirySettings.externalChannels ?? [];
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
            <BrandMark />
            <div>
              <strong>{BRAND_NAME}</strong>
            </div>
          </div>
          <nav className="hub-topbar__nav" aria-label="메인 메뉴">
            {TOP_NAV_ITEMS.map((item) => (
              <button
                key={item.routePath ?? item.sectionId}
                type="button"
                className="hub-topbar__nav-item"
                onClick={() => (item.routePath ? onOpenPortfolioIndex?.() : scrollToSection(item.sectionId))}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="hub-topbar__cta" onClick={() => scrollToSection("contact")}>사이트 만들기</button>
        </header>

        <section className="hub-hero hub-hero--minimal" aria-label={BRAND_INTRO_LABEL}>
          <div className="hub-hero__content hub-hero__content--minimal">
            <h1>{content.heroTitle}</h1>
          </div>
        </section>

        <section id="samples" className="hub-section" aria-label="샘플 갤러리">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Showcase</span>
            <p>{content.showcaseDescription}</p>
          </div>
          {visibleSites.length > 0 ? (
            <div className="hub-grid">
              {visibleSites.map((site) => (
                <GalleryCard key={site.id} site={site} onOpen={onOpen} onContact={handleContactSample} isSelectedForInquiry={selectedContactSiteId === site.id} />
              ))}
            </div>
          ) : (
            <div className="hub-empty-state">
              <strong>현재 공개된 샘플이 없습니다.</strong>
              <p>sinnaruggggg_admin 페이지에서 샘플 노출 설정을 다시 켜주세요.</p>
            </div>
          )}
        </section>

        <section id="process" className="hub-section" aria-labelledby="process-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">How It Works</span>
            <h2 id="process-heading">{content.processHeading}</h2>
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
            <h2 id="features-heading">{content.featuresHeading}</h2>
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
            <h2 id="pricing-heading">{content.pricingHeading}</h2>
            <p>{content.pricingDescription}</p>
          </div>
          <div className="hub-pricing-grid">
            {pricingPlans.map((plan) => (
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
              <h2 id="contact-heading">{content.contactHeading}</h2>
              <p>{content.contactDescription}</p>
            </div>
            {contactPoints.length > 0 ? (
              <div className="hub-contact-card__points">
                {contactPoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ) : null}
            <article className="hub-contact-alert" aria-label="문의 재접수 안내">
              <strong>{INQUIRY_RECOVERY_NOTICE.title}</strong>
              <p>{INQUIRY_RECOVERY_NOTICE.text}</p>
            </article>
            <div className="hub-contact-layout">
              <ContactBrief key={selectedContactSiteId || "default-contact-brief"} sampleOptions={sampleOptions} initialSampleId={selectedContactSiteId} inquirySettings={inquirySettings} />

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
                  {externalChannels.length > 0 ? (
                    <>
                      <p>아래 버튼은 공식 사이트로 연결됩니다. 복사한 문의 내용을 붙여넣어 요청서를 작성하면 됩니다.</p>
                      <div className="hub-platform-grid">
                        {externalChannels.map((channel) => (
                          <a key={`${channel.name}-${channel.href}`} className="hub-link-button" href={channel.href} target="_blank" rel="noreferrer">
                            <span>{channel.name}</span>
                            <ExternalLink size={15} />
                          </a>
                        ))}
                      </div>
                      <div className="hub-platform-list">
                        {externalChannels.map((channel) => (
                          <p key={`${channel.name}-${channel.description}`}>{channel.description}</p>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>현재 연결된 외부 문의 채널이 없습니다. 관리자 페이지에서 메일, 숨고, 크몽 같은 채널을 추가할 수 있습니다.</p>
                  )}
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

const DASHBOARD_HOME_LAYOUTS = new Set(["dashboard", "mobility", "command"]);
const BOOKING_HOME_LAYOUTS = new Set(["booking", "clinic", "storefront", "stay"]);
const EDITORIAL_HOME_LAYOUTS = new Set(["editorial", "paper", "scent", "gallery"]);
const COMMERCE_HOME_LAYOUTS = new Set(["commerce", "sale", "room", "lookbook"]);

function getHomeLayoutGroup(layout) {
  if (DASHBOARD_HOME_LAYOUTS.has(layout)) return "dashboard";
  if (BOOKING_HOME_LAYOUTS.has(layout)) return "booking";
  if (EDITORIAL_HOME_LAYOUTS.has(layout)) return "editorial";
  if (COMMERCE_HOME_LAYOUTS.has(layout)) return "commerce";
  return "poster";
}

function MotionHomeStage({ site, actualView, onNavigate }) {
  const stageRef = useRef(null);
  const theme = site.theme ?? {};
  const motion = site.motion ?? {};
  const layout = motion.layout ?? "poster";
  const variant = motion.homeVariant ?? layout;
  const layoutGroup = getHomeLayoutGroup(layout);
  const readyRoutes = site.routes.filter((item) => item.slug !== "home" && item.ready);
  const primaryRoute = readyRoutes[0] ?? site.routes.find((item) => item.slug !== "home") ?? site.routes[0];
  const secondaryRoute = readyRoutes[1] ?? readyRoutes[0] ?? primaryRoute;
  const routeButtons = (readyRoutes.length ? readyRoutes : site.routes.filter((item) => item.slug !== "home")).slice(0, 4);
  const finishRoutes = (readyRoutes.length ? readyRoutes : site.routes.filter((item) => item.slug !== "home")).slice(0, 3);
  const panelRoutes = (routeButtons.length ? routeButtons : [primaryRoute]).filter(Boolean).slice(0, 3);
  const featuredStats = site.stats.slice(0, 3);
  const featuredChips = site.chips.slice(0, 3);
  const panelClass = `motion-home-stage__layout-panel motion-home-stage__layout-panel--${layoutGroup} motion-home-stage__layout-panel--${variant}`;

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    let frame = 0;
    const updateScrollProgress = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const range = Math.max(node.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / range));

      node.style.setProperty("--scroll-progress", progress.toFixed(3));
      node.style.setProperty("--motion-rise", `${Math.round(progress * -150)}px`);
      node.style.setProperty("--motion-drop", `${Math.round(progress * 96)}px`);
      node.style.setProperty("--motion-lift", `${Math.round(progress * -92)}px`);
      node.style.setProperty("--motion-split", `${(progress * 24).toFixed(2)}vw`);
      node.style.setProperty("--motion-split-neg", `${(-progress * 24).toFixed(2)}vw`);
      node.style.setProperty("--motion-depth", `${(1 + progress * 0.12).toFixed(3)}`);
      node.style.setProperty("--motion-fade", `${Math.min(0.82, progress * 1.08).toFixed(3)}`);
      node.style.setProperty("--motion-copy-opacity", `${Math.max(0, 1 - progress * 3.2).toFixed(3)}`);
      node.style.setProperty("--motion-story-opacity", `${Math.min(1, progress * 1.6).toFixed(3)}`);
      node.style.setProperty("--motion-story-lift", `${Math.round((1 - progress) * 58)}px`);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  function openRoute(targetRoute) {
    if (!targetRoute) return;
    onNavigate(buildSitePath(site.id, targetRoute.slug));
  }

  function renderHeroLayoutPanel() {
    if (layoutGroup === "dashboard") {
      return (
        <div className={panelClass}>
          <div className="motion-home-stage__console-head">
            <span>{site.industry}</span>
            <strong>{site.homeMode}</strong>
          </div>
          <div className="motion-home-stage__console-grid">
            {featuredStats.map((item) => (
              <span key={`${site.id}-console-${item.label}`}>
                {item.label}
                <strong>{item.value}</strong>
              </span>
            ))}
            {panelRoutes.slice(0, 2).map((item) => (
              <button key={`${site.id}-console-${item.slug}`} type="button" onClick={() => openRoute(item)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (layoutGroup === "booking") {
      return (
        <div className={panelClass}>
          <span>{site.industry}</span>
          <strong>{site.hero.secondary}</strong>
          <p>{site.mobileRule}</p>
          <div className="motion-home-stage__booking-slots">
            {featuredStats.map((item) => (
              <span key={`${site.id}-booking-${item.label}`}>
                {item.label}
                <strong>{item.value}</strong>
              </span>
            ))}
          </div>
          <button type="button" onClick={() => openRoute(primaryRoute)}>
            {site.hero.primary}
          </button>
        </div>
      );
    }

    if (layoutGroup === "editorial") {
      return (
        <div className={panelClass}>
          <span>{site.homeMode}</span>
          <p>{site.design?.heroMode ?? site.summary}</p>
          <div>
            {featuredChips.map((item) => (
              <em key={`${site.id}-editorial-${item}`}>{item}</em>
            ))}
          </div>
        </div>
      );
    }

    if (layoutGroup === "commerce") {
      return (
        <div className={panelClass}>
          <div className="motion-home-stage__product-shelf">
            {featuredChips.map((item) => (
              <span key={`${site.id}-shelf-${item}`}>{item}</span>
            ))}
          </div>
          <button type="button" onClick={() => openRoute(primaryRoute)}>
            {site.hero.primary}
            <ChevronRight size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className={panelClass}>
        {panelRoutes.map((item) => (
          <button key={`${site.id}-poster-${item.slug}`} type="button" onClick={() => openRoute(item)}>
            {item.label}
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      className="motion-home-stage"
      data-profile={motion.profile ?? "cinematic-depth"}
      data-layout={layout}
      data-variant={variant}
      data-tempo={motion.tempo ?? "medium"}
      data-view={actualView}
      style={{
        "--site-bg": theme.bg,
        "--site-surface": theme.surface,
        "--site-panel": theme.panel,
        "--site-text": theme.text,
        "--site-muted": theme.muted,
        "--site-accent": theme.accent,
        "--site-accent-soft": theme.accentSoft,
        "--site-line": theme.line,
        "--site-button-text": theme.buttonText,
      }}
    >
      <section className="motion-home-stage__hero">
        <div className="motion-home-stage__media" aria-hidden="true">
          <img className="motion-home-stage__layer motion-home-stage__layer--scene" src={site.images.scene} alt="" decoding="async" />
          <img className="motion-home-stage__layer motion-home-stage__layer--brand" src={site.images.brand} alt="" decoding="async" />
          <img className="motion-home-stage__layer motion-home-stage__layer--product" src={site.images.product} alt="" decoding="async" />
        </div>

        <div className="motion-home-stage__variant-marker" aria-hidden="true">
          {featuredStats.map((item) => (
            <span key={`${site.id}-marker-${item.label}`} />
          ))}
        </div>

        <div className="motion-home-stage__copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <div className="motion-home-stage__actions">
            <button type="button" onClick={() => openRoute(primaryRoute)}>
              {site.hero.primary}
            </button>
            <button type="button" onClick={() => openRoute(secondaryRoute)}>
              {site.hero.secondary}
            </button>
          </div>
        </div>

        <div className="motion-home-stage__dashboard" aria-label={`${site.brand} highlights`}>
          {site.stats.map((item) => (
            <div key={`${site.id}-${item.label}`} className="motion-home-stage__metric">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        {renderHeroLayoutPanel()}
      </section>

      <section className="motion-home-stage__story" aria-label={`${site.brand} details`} data-variant={variant}>
        <div className="motion-home-stage__story-panel motion-home-stage__story-panel--lead">
          <span>{site.homeMode}</span>
          <h2>{site.hero.subtitle}</h2>
          <p>{site.summary}</p>
        </div>

        <div className="motion-home-stage__route-rail">
          {routeButtons.map((item) => (
            <button key={`${site.id}-${item.slug}`} type="button" onClick={() => openRoute(item)}>
              <span>{item.label}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        <div className="motion-home-stage__chip-wall">
          {site.chips.map((item) => (
            <span key={`${site.id}-${item}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="motion-home-stage__finish" aria-label={`${site.brand} next content`} data-variant={variant}>
        <div className="motion-home-stage__finish-media" aria-hidden="true">
          <img src={site.images.brand} alt="" decoding="async" />
          <img src={site.images.product} alt="" decoding="async" />
        </div>
        <div className="motion-home-stage__finish-panel">
          <span>{site.industry}</span>
          <h2>{site.homeMode}</h2>
          <p>{site.mobileRule}</p>
          <div className="motion-home-stage__finish-stats">
            {site.stats.map((item) => (
              <span key={`${site.id}-finish-${item.label}`}>
                <strong>{item.value}</strong>
                {item.label}
              </span>
            ))}
          </div>
          <div className="motion-home-stage__finish-actions">
            {finishRoutes.map((item) => (
              <button key={`${site.id}-finish-${item.slug}`} type="button" onClick={() => openRoute(item)}>
                {item.label}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ScreenStage({ site, route, actualView, isMobileClient, onNavigate }) {
  const stage = site.routeAssets[route.slug][actualView];
  const frameClass = actualView === "mobile" && !isMobileClient ? "screen-stage__frame screen-stage__frame--narrow" : "screen-stage__frame";
  const title = `${site.brand} ${route.label}`;
  const frameRef = useRef(null);

  useEffect(() => {
    if (route.kind === "home" || !stage.html || !frameRef.current) {
      return undefined;
    }

    const frame = frameRef.current;
    const handleLoad = () => {
      patchStageRouteLinks(frame, site, onNavigate);
    };

    frame.addEventListener("load", handleLoad);

    if (frame.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      frame.removeEventListener("load", handleLoad);
    };
  }, [onNavigate, route.kind, site, stage.html]);

  if (route.kind === "home") {
    return (
      <section className={`screen-stage screen-stage--${actualView}`} aria-label={title}>
        <MotionHomeStage site={site} actualView={actualView} onNavigate={onNavigate} />
      </section>
    );
  }

  return (
    <section className={`screen-stage screen-stage--${actualView}`} aria-label={title}>
      <div className={frameClass}>
        {stage.html ? (
          <iframe ref={frameRef} title={title} src={stage.html} loading="lazy" style={{ height: "100dvh" }} />
        ) : (
          <img src={stage.image} alt={stage.alt} loading="lazy" />
        )}
      </div>
    </section>
  );
}

function PreviewToolbar({ viewMode, isMobileClient, onViewChange, onBack, onContact }) {
  return (
    <div className="site-preview-toolbar" role="toolbar" aria-label="미리보기 전환">
      <button type="button" className="site-preview-toolbar__back" onClick={onBack}>
        <ArrowLeft size={15} />
        돌아가기
      </button>
      {!isMobileClient ? (
        <div className="site-preview-toolbar__group" role="tablist" aria-label="기기 보기">
          <button type="button" className={viewMode === "desktop" ? "is-active" : ""} onClick={() => onViewChange("desktop")}>
            <Monitor size={15} />
            PC
          </button>
          <button type="button" className={viewMode === "mobile" ? "is-active" : ""} onClick={() => onViewChange("mobile")}>
            <Smartphone size={15} />
            Mobile
          </button>
        </div>
      ) : null}
      <button type="button" className="site-preview-toolbar__contact" onClick={onContact}>
        문의하기
      </button>
    </div>
  );
}

export function SiteView({ site, route, viewMode, isMobileClient, onViewChange, onNavigate, onBack, onContact }) {
  const actualView = isMobileClient ? "mobile" : viewMode;

  return (
    <main className="site-main site-main--immersive" data-view={actualView}>
      <PreviewToolbar viewMode={actualView} isMobileClient={isMobileClient} onViewChange={onViewChange} onBack={onBack} onContact={onContact} />
      <ScreenStage site={site} route={route} actualView={actualView} isMobileClient={isMobileClient} onNavigate={onNavigate} />
    </main>
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
