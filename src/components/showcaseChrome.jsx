import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FilePenLine,
  MessageCircle,
  Monitor,
  SendHorizontal,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { BRAND_INQUIRY_HEADER, BRAND_NAME } from "../content/brand";
import { PAGECRAFT_SAMPLE_IDS, isPagecraftSample } from "../content/pagecraftSamples";
import { INQUIRY_DEFAULTS } from "../content/siteAdminDefaults";
import { buildSitePath, siteRegistry } from "../content/siteRegistry";
import { getTemplateDetailModel } from "../content/templateCatalog";
import { submitInquiry } from "../lib/inquiryApi";
import { withBasePath } from "../lib/appPaths";
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

const PAGECRAFT_NAV_ITEMS = [
  { label: "포트폴리오", routePath: "/" },
  { label: "시안", sectionId: "samples" },
  { label: "서비스", sectionId: "services" },
  { label: "진행 과정", sectionId: "process" },
  { label: "문의", sectionId: "contact" },
];

const PAGECRAFT_SERVICES = [
  { icon: Sparkles, title: "\uc2dc\uc548 \uc120\ud0dd", text: "\ubaa9\uc801\uc5d0 \ub9de\ub294 \ud398\uc774\uc9c0 \ud750\ub984\uc744 \ube60\ub974\uac8c \uace0\ub985\ub2c8\ub2e4." },
  { icon: MessageCircle, title: "\uc0c1\ub2f4 \uc5f0\uacb0", text: "\ubb38\uc758 \ud3fc\uacfc CTA\ub97c \uc790\uc5f0\uc2a4\ub7fd\uac8c \uc5f0\uacb0\ud569\ub2c8\ub2e4." },
  { icon: CalendarCheck, title: "\uc608\uc57d/\uc2e0\uccad", text: "\uc608\uc57d, \uc2e0\uccad, \ubc29\ubb38 \uc720\ub3c4 \ud750\ub984\uc744 \uc815\ub9ac\ud569\ub2c8\ub2e4." },
  { icon: ChartNoAxesCombined, title: "\uc804\ud658 \uad6c\uc131", text: "\uc18c\uac1c\uc5d0\uc11c \ubb38\uc758\uae4c\uc9c0 \ud55c \ud750\ub984\uc73c\ub85c \ubcf4\uc774\uac8c \ub9cc\ub4ed\ub2c8\ub2e4." },
];

const PAGECRAFT_PROCESS = [
  { step: "01", title: "\uc120\ud0dd", text: "\ub9de\ub294 \uc2dc\uc548\uc744 \uace0\ub985\ub2c8\ub2e4.", icon: Target },
  { step: "02", title: "\uc815\ub9ac", text: "\ucf58\ud150\uce20\uc640 CTA\ub97c \uc815\ub9ac\ud569\ub2c8\ub2e4.", icon: FilePenLine },
  { step: "03", title: "\uc81c\uc791", text: "PC/\ubaa8\ubc14\uc77c \ud654\uba74\uc744 \ub9de\ucda5\ub2c8\ub2e4.", icon: Monitor },
  { step: "04", title: "\uc810\uac80", text: "\ubc30\ud3ec \uc804 \ub3d9\uc120\uc744 \ud655\uc778\ud569\ub2c8\ub2e4.", icon: BadgeCheck },
];

const PAGECRAFT_FEATURES = [
  { icon: Monitor, title: "첫 화면 정리", text: "대표 문구, CTA, 주요 메뉴를 한눈에 보이게 배치합니다." },
  { icon: Smartphone, title: "반응형 기본", text: "PC와 모바일에서 같은 흐름으로 자연스럽게 이어지게 구성합니다." },
  { icon: FilePenLine, title: "쉬운 수정", text: "문구와 이미지 교체가 쉬운 섹션 단위 구조를 유지합니다." },
  { icon: SendHorizontal, title: "문의 연결", text: "상담 버튼과 문의 폼까지 짧은 동선으로 연결합니다." },
];


const PAGECRAFT_FEATURED_VARIANTS = {
  "pagecraft-business": {
    dataTheme: "strategy-console",
    dataArchetype: "strategy-console",
    fallbackTitle: "기업 상담형",
    cue: "서비스 소개 · 사례 · 문의",
    label: "BUSINESS",
    panelTitle: "소개 → 사례 → 문의",
    panelCopy: "회사와 서비스를 빠르게 이해하고 상담까지 이어지도록 구성합니다.",
    chips: ["서비스", "사례", "문의"],
    metrics: ["신뢰", "사례", "상담"],
  },
  "pagecraft-premium": {
    dataTheme: "private-showroom",
    dataArchetype: "private-showroom",
    fallbackTitle: "고급 브랜드형",
    cue: "대표 제품 · 컬렉션 · 상담",
    label: "BRAND",
    panelTitle: "제품 → 컬렉션 → 상담",
    panelCopy: "제품 이미지를 크게 보여주고 상담 동선을 단순하게 이어갑니다.",
    chips: ["제품", "컬렉션", "상담"],
    metrics: ["제품", "브랜드", "상담"],
  },
  "pagecraft-emotion": {
    dataTheme: "warm-booking",
    dataArchetype: "booking-studio",
    fallbackTitle: "공간 예약형",
    cue: "공간 소개 · 프로그램 · 예약",
    label: "BOOKING",
    panelTitle: "공간 → 프로그램 → 예약",
    panelCopy: "공간 분위기와 예약 버튼을 가까이 배치해 방문 전환을 쉽게 만듭니다.",
    chips: ["공간", "프로그램", "예약"],
    metrics: ["공간", "일정", "방문"],
  },
  "pagecraft-event": {
    dataTheme: "ticket-poster",
    dataArchetype: "ticket-poster",
    fallbackTitle: "행사 신청형",
    cue: "행사 소개 · 일정 · 신청",
    label: "EVENT",
    panelTitle: "소개 → 일정 → 신청",
    panelCopy: "행사 정보와 신청 버튼을 첫 화면에서 바로 찾을 수 있게 정리합니다.",
    chips: ["소개", "일정", "신청"],
    metrics: ["날짜", "연사", "신청"],
  },
  "pagecraft-saas": {
    dataTheme: "workflow-board",
    dataArchetype: "workflow-board",
    fallbackTitle: "SaaS 소개형",
    cue: "기능 · 요금 · 데모 문의",
    label: "SAAS",
    panelTitle: "기능 → 요금 → 데모",
    panelCopy: "기능과 요금을 빠르게 비교하고 데모 문의로 이어지게 구성합니다.",
    chips: ["기능", "요금", "데모"],
    metrics: ["기능", "요금", "문의"],
  },
};

function getPagecraftFeaturedVariant(siteId) {
  return PAGECRAFT_FEATURED_VARIANTS[siteId] ?? PAGECRAFT_FEATURED_VARIANTS[PAGECRAFT_SAMPLE_IDS[0]];
}

function orderPagecraftSites(sites) {
  const rank = new Map(PAGECRAFT_SAMPLE_IDS.map((id, index) => [id, index]));
  return [...sites].sort((left, right) => {
    const leftRank = rank.get(left.id);
    const rightRank = rank.get(right.id);

    if (leftRank !== undefined || rightRank !== undefined) {
      if (leftRank === undefined) return 1;
      if (rightRank === undefined) return -1;
      return leftRank - rightRank;
    }

    return (left.admin?.order ?? 999) - (right.admin?.order ?? 999);
  });
}


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
        element.setAttribute("href", withBasePath(buildSitePath(site.id, matchedRoute.slug)));
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
  const liveSrc = preview.html || preview.liveSrc || "";

  return (
    <div className={`preview-surface ${className}`.trim()} data-mode={mode} data-live={liveSrc ? "true" : undefined}>
      {liveSrc ? (
        <div className="preview-surface__live">
          <iframe title={preview.title || preview.alt || "site preview"} src={liveSrc} loading="lazy" tabIndex={-1} />
        </div>
      ) : (
        <img
          src={preview.src}
          alt={preview.alt}
          loading="lazy"
          decoding="async"
          onError={preview.fallbackSrc ? (event) => applyFallbackImage(event, preview.fallbackSrc) : undefined}
        />
      )}
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
  const [copyLabel, setCopyLabel] = useState("\ubb38\uc758 \ub0b4\uc6a9 \ubcf5\uc0ac");
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const selectedSample = sampleOptions.find((item) => item.id === form.sampleId);
  const selectedTemplateDetail = selectedSample ? getTemplateDetailModel(selectedSample.id) : null;
  const selectedTemplateName = selectedTemplateDetail?.meta.displayName || selectedSample?.brand || "\ubbf8\uc815";
  const inquiryText = [
    BRAND_INQUIRY_HEADER,
    `\uc120\ud0dd\ud55c \uc2dc\uc548: ${selectedTemplateName}`,
    `\ucd94\ucc9c \uc5c5\uc885: ${selectedTemplateDetail?.meta.recommendedFor || "\ubbf8\uc815"}`,
    `\uc608\uc0c1 \ud50c\ub79c: ${form.plan}`,
    `\ucee4\uc2a4\ud130\ub9c8\uc774\uc9d5 \ubc94\uc704: ${form.customization}`,
    `\uc608\uc0b0 \ubc94\uc704: ${form.budget}`,
    `\ud76c\ub9dd \uc77c\uc815: ${form.timeline}`,
    `\uc774\ub984: ${form.contactName || "\uc5c6\uc74c"}`,
    `\uc774\uba54\uc77c: ${form.email || "\uc5c6\uc74c"}`,
    `\uc5f0\ub77d\ucc98: ${form.phone || "\uc5c6\uc74c"}`,
    `\ucc38\uace0 \uc0ac\uc774\ud2b8/\uc774\ubbf8\uc9c0: ${form.references || "\uc5c6\uc74c"}`,
    `\ubb38\uc758 \ub0b4\uc6a9: ${form.details || "\uc5c6\uc74c"}`,
  ].join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopyLabel("\ubcf5\uc0ac \uc644\ub8cc");
      window.setTimeout(() => setCopyLabel("\ubb38\uc758 \ub0b4\uc6a9 \ubcf5\uc0ac"), 1800);
    } catch {
      setCopyLabel("\ubcf5\uc0ac \uc2e4\ud328");
      window.setTimeout(() => setCopyLabel("\ubb38\uc758 \ub0b4\uc6a9 \ubcf5\uc0ac"), 1800);
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.contactName.trim()) {
      setSubmitState({ status: "error", message: "\uc774\ub984\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694." });
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setSubmitState({ status: "error", message: "\uc774\uba54\uc77c \ub610\ub294 \uc5f0\ub77d\ucc98\ub97c \ud558\ub098 \uc774\uc0c1 \uc785\ub825\ud574 \uc8fc\uc138\uc694." });
      return;
    }

    if (!form.details.trim()) {
      setSubmitState({ status: "error", message: "\ubb38\uc758 \ub0b4\uc6a9\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694." });
      return;
    }

    setSubmitState({ status: "submitting", message: "\ubb38\uc758 \ub0b4\uc6a9\uc744 \uc800\uc7a5\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4." });

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

      setSubmitState({ status: "success", message: "\ubb38\uc758\uc0ac\ud56d\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4." });
    } catch (error) {
      setSubmitState({ status: "error", message: error.message || "\ubb38\uc758 \uc800\uc7a5\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4." });
    }
  }

  return (
    <div className="hub-brief-form">
      {selectedTemplateDetail ? (
        <div className={`hub-brief-selected-template hub-brief-selected-template--${selectedTemplateDetail.meta.category}`}>
          <span>{"\uc120\ud0dd\ud55c \uc2dc\uc548"}</span>
          <strong>{selectedTemplateName}</strong>
          <p className="hub-brief-selected-template__copy">{selectedTemplateDetail.meta.selectionCopy}</p>
          <div>
            <em>{selectedTemplateDetail.category.label}</em>
            {selectedTemplateDetail.meta.goalTags.slice(0, 3).map((tag) => <em key={tag}>{tag}</em>)}
          </div>
        </div>
      ) : null}

      <div className="hub-brief-grid">
        <label className="hub-brief-field">
          <span>{"\uc2dc\uc548 \uc120\ud0dd"}</span>
          <select value={form.sampleId} onChange={(event) => updateField("sampleId", event.target.value)}>
            {sampleOptions.map((site) => (
              <option key={site.id} value={site.id}>
                {getTemplateDetailModel(site.id).meta.displayName || site.brand}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>{"\uc608\uc0c1 \ud50c\ub79c"}</span>
          <select value={form.plan} onChange={(event) => updateField("plan", event.target.value)}>
            {pricingPlans.map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name} {"\u00b7"} {plan.price}
              </option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>{"\ucee4\uc2a4\ud130\ub9c8\uc774\uc9d5 \uc815\ub3c4"}</span>
          <select value={form.customization} onChange={(event) => updateField("customization", event.target.value)}>
            {customizationLevels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>{"\uc774\ub984"}</span>
          <input type="text" value={form.contactName} onChange={(event) => updateField("contactName", event.target.value)} placeholder="\uc131\ud568 \ub610\ub294 \uc5c5\uccb4\uba85" />
        </label>

        <label className="hub-brief-field">
          <span>{"\uc774\uba54\uc77c"}</span>
          <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="\ub2f5\ubcc0 \ubc1b\uc744 \uc774\uba54\uc77c" />
        </label>

        <label className="hub-brief-field">
          <span>{"\uc5f0\ub77d\ucc98"}</span>
          <input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="010-0000-0000" />
        </label>

        <label className="hub-brief-field">
          <span>{"\uc608\uc0b0 \ubc94\uc704"}</span>
          <select value={form.budget} onChange={(event) => updateField("budget", event.target.value)}>
            {budgetOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="hub-brief-field">
          <span>{"\ud76c\ub9dd \uc77c\uc815"}</span>
          <select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)}>
            {timelineOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <label className="hub-brief-field">
        <span>{"\ucc38\uace0 \uc0ac\uc774\ud2b8 / \uc774\ubbf8\uc9c0 \ub9c1\ud06c"}</span>
        <textarea rows={3} value={form.references} onChange={(event) => updateField("references", event.target.value)} placeholder="\ucc38\uace0\ud560 \uc0ac\uc774\ud2b8 URL, \uc778\uc2a4\ud0c0\uadf8\ub7a8, \ub4dc\ub77c\uc774\ube0c \ub9c1\ud06c \ub4f1" />
      </label>

      <label className="hub-brief-field">
        <span>{"\ubb38\uc758 \ub0b4\uc6a9"}</span>
        <textarea rows={5} value={form.details} onChange={(event) => updateField("details", event.target.value)} placeholder="\uc6d0\ud558\ub294 \ubd84\uc704\uae30, \ud544\uc694\ud55c \uae30\ub2a5, \ubc14\uafb8\uace0 \uc2f6\uc740 \ub0b4\uc6a9\uc744 \uc801\uc5b4\uc8fc\uc138\uc694." />
      </label>

      <div className="hub-brief-actions">
        <div className="hub-brief-actions__row">
          <button type="button" className="hub-topbar__cta hub-topbar__cta--soft" onClick={handleCopy}>
            <Copy size={15} />
            {copyLabel}
          </button>
          <button type="button" className="hub-topbar__cta" onClick={handleSubmit} disabled={submitState.status === "submitting"}>
            <SendHorizontal size={15} />
            {submitState.status === "submitting" ? "\uc800\uc7a5 \uc911..." : "\ubb38\uc758\ud558\uae30"}
          </button>
        </div>
        <p className="hub-contact-note">{"\uc120\ud0dd\ud55c \uc2dc\uc548 \uc815\ubcf4\uac00 \ubb38\uc758 \ub0b4\uc6a9\uc5d0 \ud568\uaed8 \ub4e4\uc5b4\uac11\ub2c8\ub2e4."}</p>
        {submitState.message ? (
          <p className={`hub-feedback-note hub-feedback-note--${submitState.status === "error" ? "error" : "success"}`.trim()}>
            {submitState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const PORTFOLIO_FALLBACK_DESKTOP = "/portfolio/aim-furniture/site/site/hero-main.jpg";
const PORTFOLIO_FALLBACK_MOBILE = "/portfolio/aim-furniture/site/site/placement-hero.jpg";

function resolveStaticPath(path = "") {
  const cleanPath = String(path || "").trim();

  if (!cleanPath) {
    return "";
  }

  if (/^(https?:\/\/|\/\/)/i.test(cleanPath)) {
    return cleanPath;
  }

  return cleanPath.startsWith("/") ? withBasePath(cleanPath) : cleanPath;
}

function PortfolioCard({ item, onOpen }) {
  const canOpen = Boolean(item.embedSrc);
  const embedPreviewSrc = resolveStaticPath(item.embedSrc);
  const hasDesktopImage = Boolean(String(item.desktopImage || item.mobileImage || "").trim());
  const hasMobileImage = Boolean(String(item.mobileImage || item.desktopImage || "").trim());
  const desktopPreview = {
    src: resolveStaticPath(item.desktopImage || item.mobileImage || PORTFOLIO_FALLBACK_DESKTOP),
    html: hasDesktopImage ? "" : embedPreviewSrc,
    fallbackSrc: resolveStaticPath(PORTFOLIO_FALLBACK_DESKTOP),
    alt: `${item.title} desktop preview`,
  };
  const mobileImage = resolveStaticPath(item.mobileImage || item.desktopImage || PORTFOLIO_FALLBACK_MOBILE);

  return (
    <article className="hub-card portfolio-card">
      <div className="hub-card__visual portfolio-card__visual">
        <div className="hub-card__desktop-frame">
          <PreviewSurface preview={desktopPreview} className="hub-card__desktop-shot" mode="desktop" />
        </div>
        <ShowcasePhone
          src={hasMobileImage ? mobileImage : resolveStaticPath(PORTFOLIO_FALLBACK_MOBILE)}
          html={hasMobileImage ? "" : embedPreviewSrc}
          fallbackSrc={resolveStaticPath(PORTFOLIO_FALLBACK_MOBILE)}
          alt={`${item.title} mobile preview`}
          title={`${item.title} mobile preview`}
          loading="lazy"
          decoding="async"
        />
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
  const isPagecraft = isPagecraftSample(site.id);

  return (
    <article
      className={`hub-card ${canOpen ? "" : "hub-card--disabled"} ${isPagecraft ? "is-pagecraft" : ""}`.trim()}
      data-pagecraft={isPagecraft ? "true" : undefined}
      data-profile={isPagecraft ? site.motion?.profile : undefined}
    >
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
            <button type="button" className="hub-card__button hub-card__button--primary" onClick={() => onOpen?.(buildSitePath(site.id))} disabled={!canOpen}>
              {canOpen ? "사이트 보기" : "준비 중"}
              {canOpen ? <ChevronRight size={16} /> : <Clock3 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}



function PageCraftFeaturedCard({ site, onOpen, onContact, isSelectedForInquiry }) {
  const canOpen = site.gallery.homeReady;
  const desktopPreview = site.galleryThumbs.desktop;
  const mobilePreview = site.galleryThumbs.mobile;
  const detail = getTemplateDetailModel(site.id);
  const variant = getPagecraftFeaturedVariant(site.id);
  const title = detail?.meta?.displayName ?? variant.fallbackTitle;
  const copy = detail?.meta?.selectionCopy ?? variant.panelCopy;
  const recommendedFor = detail?.meta?.recommendedFor ?? site.industry;

  return (
    <article
      className="hub-card pagecraft-featured-card"
      data-pagecraft="true"
      data-pagecraft-featured="true"
      data-theme={variant.dataTheme}
      data-archetype={variant.dataArchetype}
    >
      <div className="pagecraft-featured-card__visual" aria-label={`${title} \ubbf8\ub9ac\ubcf4\uae30`}>
        <div className="pagecraft-featured-card__desktop">
          <PreviewSurface preview={desktopPreview} className="pagecraft-featured-card__preview" mode="desktop" />
        </div>
        <div className="pagecraft-featured-card__phone">
          <ShowcasePhone
            src={mobilePreview.src}
            fallbackSrc={mobilePreview.fallbackSrc}
            alt={mobilePreview.alt}
            title={`${title} mobile preview`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="pagecraft-featured-card__motif" aria-hidden="true">
          {variant.metrics.map((item, index) => (
            <span key={`${site.id}-motif-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className="pagecraft-featured-card__body">
        <div className="pagecraft-featured-card__eyebrow">
          <span>{variant.label}</span>
          <strong>{variant.cue}</strong>
        </div>
        <h3>{title}</h3>
        <p>{copy}</p>
        <div className="pagecraft-featured-card__panel">
          <strong>{variant.panelTitle}</strong>
          <span>{recommendedFor}</span>
        </div>
        <div className="pagecraft-featured-card__chips" aria-label={`${title} \ud575\uc2ec \uad6c\uc131`}>
          {variant.chips.map((chip, index) => (
            <span key={`${site.id}-chip-${index}`}>{chip}</span>
          ))}
        </div>
        <div className="pagecraft-featured-card__actions">
          <button
            type="button"
            className={`pagecraft-featured-card__button pagecraft-featured-card__button--secondary ${isSelectedForInquiry ? "is-selected" : ""}`.trim()}
            onClick={() => onContact(site.id)}
          >
            {"\ubb38\uc758\ud558\uae30"}
          </button>
          <button
            type="button"
            className="pagecraft-featured-card__button pagecraft-featured-card__button--primary"
            onClick={() => onOpen?.(buildSitePath(site.id))}
            disabled={!canOpen}
          >
            {canOpen ? "\ubbf8\ub9ac\ubcf4\uae30" : "\uc900\ube44 \uc911"}
            {canOpen ? <ChevronRight size={16} /> : <Clock3 size={16} />}
          </button>
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

  const embedSrc = resolveStaticPath(item.embedSrc);
  const isExternalEmbed = /^https?:\/\//i.test(embedSrc);

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
        {isExternalEmbed ? (
          <a className="portfolio-embed-toolbar__external" href={embedSrc} target="_blank" rel="noreferrer">
            새 창 열기
            <ExternalLink size={15} />
          </a>
        ) : null}
      </div>
      {embedSrc ? (
        <iframe
          className="portfolio-embed-frame"
          title={`${item.title} 임베딩`}
          src={embedSrc}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen; clipboard-read; clipboard-write"
          allowFullScreen
        />
      ) : (
        <section className="missing-card">
          <span>임베드 주소 없음</span>
          <h1>이 포트폴리오에 연결된 임베드 주소가 없습니다.</h1>
          <p>관리자 페이지의 포트폴리오 탭에서 내부 경로 또는 https://로 시작하는 외부 URL을 입력해 주세요.</p>
        </section>
      )}
    </main>
  );
}

export function PortfolioIndexView({ items = [], onOpen, onOpenTemplates }) {
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
          <nav className="hub-topbar__nav" aria-label="메인 메뉴">
            <button type="button" className="hub-topbar__nav-item is-active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              포트폴리오
            </button>
            <button type="button" className="hub-topbar__nav-item" onClick={onOpenTemplates}>
              템플릿
            </button>
          </nav>
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
  inquirySettings = INQUIRY_DEFAULTS,
  onOpen,
  onOpenPortfolioIndex,
  onNavigate,
  selectedContactSiteId = "",
}) {
  const visibleSites = orderPagecraftSites(sites.filter((site) => site.admin?.visible !== false));
  const featuredSites = PAGECRAFT_SAMPLE_IDS.map((siteId) => visibleSites.find((site) => site.id === siteId)).filter(Boolean);
  const featuredIds = new Set(featuredSites.map((site) => site.id));
  const standardSites = visibleSites.filter((site) => !featuredIds.has(site.id));
  const sampleOptions = visibleSites.length > 0 ? visibleSites : sites;
  const heroPreviewSite = featuredSites[0] ?? visibleSites[0] ?? sites[0];
  const heroPreview = heroPreviewSite?.galleryThumbs?.desktop ?? heroPreviewSite?.galleryThumbs?.mobile ?? null;
  const [contactSiteId, setContactSiteId] = useState(selectedContactSiteId);
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  function handleTemplateContact(siteId) {
    setContactSiteId(siteId);
    scrollToSection("contact");
  }

  useEffect(() => {
    if (!selectedContactSiteId) return undefined;

    const frame = window.requestAnimationFrame(() => scrollToSection("contact"));
    return () => window.cancelAnimationFrame(frame);
  }, [selectedContactSiteId]);

  return (
    <div className="hub-page hub-page--pagecraft" style={pointerStyle} onPointerMove={onPointerMove}>
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content pagecraft-shell">
        <header className="pagecraft-topbar">
          <button type="button" className="pagecraft-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img className="pagecraft-brand__mark" src={withBasePath("/brand/jw-studio-mark.png")} alt="" aria-hidden="true" />
            <strong>J.W Studio</strong>
          </button>
          <nav className="pagecraft-nav" aria-label="PageCraft menu">
            {PAGECRAFT_NAV_ITEMS.map((item) => (
              <button
                key={item.routePath ?? item.sectionId}
                type="button"
                onClick={() => {
                  if (item.routePath) {
                    if (onNavigate) {
                      onNavigate(item.routePath);
                    } else {
                      onOpenPortfolioIndex?.();
                    }
                    return;
                  }

                  scrollToSection(item.sectionId);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="pagecraft-cta pagecraft-cta--solid" onClick={() => scrollToSection("contact")}>
            {"\uc0c1\ub2f4 \ubb38\uc758\ud558\uae30"}
          </button>
        </header>

        <section className="pagecraft-hero" aria-labelledby="pagecraft-hero-heading">
          <div className="pagecraft-hero__copy">
            <span className="pagecraft-eyebrow">{"\uac01\uc9c4 \uba54\uc778\ud398\uc774\uc9c0 \uc81c\uc791"}</span>
            <h1 id="pagecraft-hero-heading">{"깔끔한 메인페이지를 빠르게 시작하세요"}</h1>
            <div className="pagecraft-hero__actions">
              <button type="button" className="pagecraft-cta pagecraft-cta--solid" onClick={() => scrollToSection("services")}>
                {"\uc11c\ube44\uc2a4 \ubcf4\uae30"}
                <ChevronRight size={17} />
              </button>
              <button type="button" className="pagecraft-cta pagecraft-cta--light" onClick={() => scrollToSection("contact")}>
                {"상담 문의"}
              </button>
            </div>
            <div className="pagecraft-proof-row" aria-label="PageCraft 핵심 장점">
              <span><BadgeCheck size={17} />{"깔끔한 첫인상"}</span>
              <span><Smartphone size={17} />{"모바일 대응"}</span>
              <span><SendHorizontal size={17} />{"문의 전환"}</span>
            </div>
          </div>

          <div className="pagecraft-hero__visual pagecraft-hero__visual--clean" aria-label="대표 시안 미리보기">
            {heroPreview ? (
              <PreviewSurface preview={heroPreview} className="pagecraft-hero-preview" mode="desktop" />
            ) : null}
            <div className="pagecraft-hero-floating pagecraft-hero-floating--top">
              <span>{"MAIN"}</span>
              <strong>{"메인 → 소개 → 문의"}</strong>
            </div>
            <div className="pagecraft-hero-floating pagecraft-hero-floating--bottom">
              <span>{"RESPONSIVE"}</span>
              <strong>{"PC·모바일 동시 구성"}</strong>
            </div>
          </div>
        </section>

        <section className="pagecraft-feature-strip" aria-label="PageCraft 핵심 장점">
          {PAGECRAFT_FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={24} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section id="samples" className="pagecraft-section pagecraft-template-section" aria-labelledby="samples-heading">
          <div className="pagecraft-section__header pagecraft-section__header--center">
            <span>{"\uc2dc\uc548"}</span>
            <h2 id="samples-heading">{"바로 고를 수 있는 사이트 시안"}</h2>
            <p>{"기업형, 프리미엄형, 예약형, 이벤트형, SaaS형을 다시 한눈에 볼 수 있게 정리했습니다."}</p>
          </div>
          <div className="pagecraft-featured-grid" aria-label="추천 시안 5종">
            {featuredSites.map((site) => (
              <PageCraftFeaturedCard
                key={site.id}
                site={site}
                onOpen={onOpen}
                onContact={handleTemplateContact}
                isSelectedForInquiry={contactSiteId === site.id}
              />
            ))}
          </div>
          <div className="pagecraft-template-grid pagecraft-template-grid--standard" aria-label="전체 시안 목록">
            {standardSites.map((site) => (
              <GalleryCard
                key={site.id}
                site={site}
                onOpen={onOpen}
                onContact={handleTemplateContact}
                isSelectedForInquiry={contactSiteId === site.id}
              />
            ))}
          </div>
        </section>

        <section id="services" className="pagecraft-section" aria-labelledby="services-heading">
          <div className="pagecraft-section__header pagecraft-section__header--center">
            <span>{"\uc11c\ube44\uc2a4"}</span>
            <h2 id="services-heading">{"\uc11c\ube44\uc2a4 \uc720\ud615"}</h2>
            <p>{"\ud68c\uc0ac\uc18c\uac1c, \uc608\uc57d, \uc774\ubca4\ud2b8, \uc11c\ube44\uc2a4 \uc18c\uac1c\uae4c\uc9c0 \ubaa9\uc801\uc5d0 \ub9de\ub294 \ud750\ub984\uc73c\ub85c \uc815\ub9ac\ud569\ub2c8\ub2e4."}</p>
          </div>
          <div className="pagecraft-service-grid">
            {PAGECRAFT_SERVICES.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <Icon size={26} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="process" className="pagecraft-section pagecraft-process" aria-labelledby="process-heading">
          <div className="pagecraft-section__header">
            <span>{"\uacfc\uc815"}</span>
            <h2 id="process-heading">{"\uc791\uc5c5 \ud504\ub85c\uc138\uc2a4"}</h2>
            <p>{"\uc2dc\uc548 \uc120\ud0dd\ubd80\ud130 \ucf58\ud150\uce20 \uc815\ub9ac, \ubc18\uc751\ud615 \uc81c\uc791, \ubc30\ud3ec \uc804 \uc810\uac80\uae4c\uc9c0 \ub2e8\uacc4\ubcc4\ub85c \uc9c4\ud589\ud569\ub2c8\ub2e4."}</p>
          </div>
          <div className="pagecraft-process__steps">
            {PAGECRAFT_PROCESS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step}>
                  <Icon size={28} />
                  <span>{item.step}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="pagecraft-contact" aria-labelledby="contact-heading">
          <div className="pagecraft-contact__copy">
            <span>{"\uc0c1\ub2f4\uc740 \ubb34\ub8cc\uc785\ub2c8\ub2e4"}</span>
            <h2 id="contact-heading">{"\ud544\uc694\ud55c \ud398\uc774\uc9c0\ub9cc \uace8\ub77c \ubc14\ub85c \ubb38\uc758\ud558\uc138\uc694"}</h2>
            <p>{"\ubaa9\uc801\uacfc \uc608\uc0b0\uc5d0 \ub9de\ucdb0 \uaf2d \ud544\uc694\ud55c \uad6c\uc131\ub9cc \uc815\ub9ac\ud569\ub2c8\ub2e4."}</p>
            <div>
              <span><MessageCircle size={18} />{"\ubb34\ub8cc \uc0c1\ub2f4 \ubc0f \uacac\uc801"}</span>
              <span><Zap size={18} />{"\ube60\ub978 \uc751\ub2f5"}</span>
              <span><ShieldCheck size={18} />{"\ube44\ubc00 \uc720\uc9c0 \ubcf4\uc7a5"}</span>
            </div>
          </div>
          <div className="pagecraft-contact__form">
            <h3>{"\uc0c1\ub2f4 \ubb38\uc758\ud558\uae30"}</h3>
            <ContactBrief key={contactSiteId || "default-contact-brief"} sampleOptions={sampleOptions} initialSampleId={contactSiteId} inquirySettings={inquirySettings} />
          </div>
        </section>

        <footer className="pagecraft-footer">
          <span>{"\u00a9 2026 J.W Studio. All rights reserved."}</span>
          <div>
            <button type="button" onClick={() => scrollToSection("contact")}>{"\uc0c1\ub2f4 \ubb38\uc758"}</button>
            <button type="button" onClick={onOpenPortfolioIndex}>{"\uae30\uc874 \ud3ec\ud2b8\ud3f4\ub9ac\uc624"}</button>
          </div>
        </footer>
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

function getHomePreviewModel(site, onNavigate) {
  const allRoutes = site.routes.filter((item) => item.slug !== "home");
  const readyRoutes = allRoutes.filter((item) => item.ready);
  const routes = readyRoutes.length ? readyRoutes : allRoutes;
  const primaryRoute = routes[0] ?? allRoutes[0] ?? site.routes[0];
  const secondaryRoute = routes[1] ?? primaryRoute;
  const stats = site.stats.slice(0, 4);
  const chips = site.chips.slice(0, 6);

  return {
    allRoutes,
    chips,
    primaryRoute,
    readyRoutes,
    routes,
    secondaryRoute,
    stats,
    openRoute(targetRoute) {
      if (!targetRoute) return;
      onNavigate(buildSitePath(site.id, targetRoute.slug));
    },
  };
}

function getHomeStyleVars(site) {
  const theme = site.theme ?? {};

  return {
    "--site-bg": theme.bg,
    "--site-surface": theme.surface,
    "--site-panel": theme.panel,
    "--site-text": theme.text,
    "--site-muted": theme.muted,
    "--site-accent": theme.accent,
    "--site-accent-soft": theme.accentSoft,
    "--site-line": theme.line,
    "--site-button-text": theme.buttonText,
  };
}

function ExperienceShell({ site, actualView, children }) {
  const motion = site.motion ?? {};
  const isPagecraft = isPagecraftSample(site.id);
  const navRoutes = site.routes.slice(0, 5);

  return (
    <div
      className={`sample-home ${isPagecraft ? "is-pagecraft" : ""}`.trim()}
      data-pagecraft={isPagecraft ? "true" : undefined}
      data-pagecraft-id={isPagecraft ? site.id : undefined}
      data-experience={motion.homeExperience ?? "cinematic-scroll"}
      data-variant={motion.homeVariant ?? motion.layout ?? "default"}
      data-view={actualView}
      style={getHomeStyleVars(site)}
    >
      <nav className="sample-home__site-nav" aria-label={`${site.brand} 메뉴`}>
        <a className="sample-home__site-brand" href={withBasePath(buildSitePath(site.id))}>
          {site.brand}
        </a>
        <div className="sample-home__site-links">
          {navRoutes.map((route) => (
            <a key={`${site.id}-site-nav-${route.slug}`} href={withBasePath(buildSitePath(site.id, route.slug))}>
              {route.label}
            </a>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}

function HomeActions({ model, site, compact = false }) {
  return (
    <div className={compact ? "sample-home__actions sample-home__actions--compact" : "sample-home__actions"}>
      <button type="button" onClick={() => model.openRoute(model.primaryRoute)}>
        {site.hero.primary}
        <ChevronRight size={16} />
      </button>
      <button type="button" onClick={() => model.openRoute(model.secondaryRoute)}>
        {site.hero.secondary}
      </button>
    </div>
  );
}

function StatList({ model, className = "sample-home__stats", limit = 3 }) {
  return (
    <div className={className}>
      {model.stats.slice(0, limit).map((item) => (
        <span key={`${className}-${item.label}`}>
          <strong>{item.value}</strong>
          {item.label}
        </span>
      ))}
    </div>
  );
}

function RouteGrid({ model, className = "sample-home__route-grid", limit = 4 }) {
  return (
    <div className={className}>
      {model.routes.slice(0, limit).map((item) => (
        <button key={`${className}-${item.slug}`} type="button" onClick={() => model.openRoute(item)}>
          <span>{item.label}</span>
          <ChevronRight size={15} />
        </button>
      ))}
    </div>
  );
}

function ChipList({ model, className = "sample-home__chips", limit = 5 }) {
  return (
    <div className={className}>
      {model.chips.slice(0, limit).map((item) => (
        <span key={`${className}-${item}`}>{item}</span>
      ))}
    </div>
  );
}

function DynamicLaunchHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__launch">
        <div className="sample-home__launch-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} />
        </div>
        <div className="sample-home__launch-wall" aria-hidden="true">
          <img src={site.images.brand} alt="" decoding="async" />
          <img src={site.images.product} alt="" decoding="async" />
        </div>
        <StatList model={model} className="sample-home__launch-stats" />
      </section>
      <div className="sample-home__ticker" aria-hidden="true">
        {model.chips.slice(0, 5).map((item) => (
          <span key={`${site.id}-ticker-${item}`}>{item}</span>
        ))}
      </div>
    </ExperienceShell>
  );
}

function RetailBrowseHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__retail">
        <div className="sample-home__retail-head">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__retail-grid">
          {model.chips.slice(0, 4).map((item, index) => (
            <button key={`${site.id}-retail-${item}`} type="button" onClick={() => model.openRoute(model.routes[index] ?? model.primaryRoute)}>
              <img src={index % 2 === 0 ? site.images.product : site.images.brand} alt="" decoding="async" />
              <span>{item}</span>
            </button>
          ))}
        </div>
        <aside className="sample-home__retail-feature">
          <img src={site.images.scene} alt="" decoding="async" />
          <strong>{site.homeMode}</strong>
          <p>{site.summary}</p>
        </aside>
      </section>
    </ExperienceShell>
  );
}

function KineticSplitHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__kinetic">
        <div className="sample-home__kinetic-copy">
          <span>{site.homeMode}</span>
          <h1>{site.hero.title}</h1>
          <HomeActions model={model} site={site} />
        </div>
        <img className="sample-home__kinetic-figure" src={site.images.brand} alt="" decoding="async" />
        <div className="sample-home__kinetic-board">
          <StatList model={model} limit={3} />
          <RouteGrid model={model} limit={3} />
        </div>
      </section>
    </ExperienceShell>
  );
}

function BusinessCleanHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);
  const statCards = model.stats.slice(0, 4);
  const routeCards = model.routes.slice(0, 4);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__business">
        <div className="sample-home__business-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__business-dashboard">
          <div className="sample-home__business-kpis">
            {statCards.map((item) => (
              <article key={`${site.id}-kpi-${item.label}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="sample-home__business-board">
            <div className="sample-home__business-chart" aria-hidden="true">
              {statCards.map((item) => (
                <span key={`${site.id}-chart-${item.label}`} />
              ))}
            </div>
            <div className="sample-home__business-allocation">
              <span>{site.homeMode}</span>
              <strong>{site.hero.subtitle}</strong>
              <p>{site.summary}</p>
            </div>
          </div>
        </div>
        <div className="sample-home__business-routes">
          {routeCards.map((item, index) => (
            <button key={`${site.id}-business-${item.slug}`} type="button" onClick={() => model.openRoute(item)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <em>{model.chips[index] ?? site.homeMode}</em>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>
    </ExperienceShell>
  );
}

function BeautyCounterHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);
  const leadStat = model.stats[0];
  const supportStats = model.stats.slice(1, 3);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__counter">
        <div className="sample-home__counter-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__counter-shelf">
          <img src={site.images.scene} alt="" decoding="async" />
          <div className="sample-home__counter-diagnosis">
            <span>{leadStat?.label ?? site.homeMode}</span>
            <strong>{leadStat?.value ?? site.hero.primary}</strong>
            <p>{site.hero.subtitle}</p>
            <div className="sample-home__counter-stats">
              {supportStats.map((item) => (
                <span key={`${site.id}-counter-${item.label}`}>
                  {item.label}
                  <strong>{item.value}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
        <RouteGrid model={model} className="sample-home__counter-menu" limit={4} />
      </section>
    </ExperienceShell>
  );
}

function EditorialMagazineHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__magazine">
        <div className="sample-home__magazine-title">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
        </div>
        <img className="sample-home__magazine-cover" src={site.images.brand} alt="" decoding="async" />
        <div className="sample-home__magazine-copy">
          <h2>{site.hero.title}</h2>
          <p>{site.summary}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <ChipList model={model} className="sample-home__magazine-index" limit={5} />
      </section>
    </ExperienceShell>
  );
}

function FlashSaleHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__flash">
        <img className="sample-home__flash-bg" src={site.images.scene} alt="" decoding="async" />
        <div className="sample-home__flash-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} />
        </div>
        <div className="sample-home__flash-products">
          {[site.images.product, site.images.brand, site.images.product].map((src, index) => (
            <button key={`${site.id}-flash-${index}`} type="button" onClick={() => model.openRoute(model.routes[index] ?? model.primaryRoute)}>
              <img src={src} alt="" decoding="async" />
              <span>{model.chips[index] ?? site.homeMode}</span>
            </button>
          ))}
        </div>
      </section>
    </ExperienceShell>
  );
}

function PosterWorldHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__poster-world">
        <img src={site.images.scene} alt="" decoding="async" />
        <div className="sample-home__poster-copy">
          <span>{site.homeMode}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
        </div>
        <RouteGrid model={model} className="sample-home__poster-tickets" limit={4} />
      </section>
    </ExperienceShell>
  );
}

function LiveFeedHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__live">
        <div className="sample-home__live-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__live-feed">
          {model.chips.slice(0, 5).map((item, index) => (
            <article key={`${site.id}-live-${item}`}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <p>{model.routes[index]?.label ?? site.homeMode}</p>
            </article>
          ))}
        </div>
        <img className="sample-home__live-media" src={site.images.product} alt="" decoding="async" />
      </section>
    </ExperienceShell>
  );
}

function TechConsoleHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__console">
        <div className="sample-home__console-map" aria-hidden="true">
          <img src={site.images.scene} alt="" decoding="async" />
          {model.stats.map((item) => (
            <span key={`${site.id}-console-dot-${item.label}`} />
          ))}
        </div>
        <div className="sample-home__console-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
        </div>
        <div className="sample-home__console-panel">
          <StatList model={model} limit={4} />
          <RouteGrid model={model} limit={3} />
        </div>
      </section>
    </ExperienceShell>
  );
}

function GamingHudHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__hud">
        <div className="sample-home__hud-frame">
          <img src={site.images.product} alt="" decoding="async" />
          <span>{site.homeMode}</span>
        </div>
        <div className="sample-home__hud-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} />
        </div>
        <RouteGrid model={model} className="sample-home__hud-loadout" limit={4} />
      </section>
    </ExperienceShell>
  );
}

function WorkflowMapHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__workflow">
        <div className="sample-home__workflow-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <strong>{site.hero.title}</strong>
          <p>{site.summary}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__workflow-canvas">
          <div className="sample-home__workflow-nodes">
            {model.routes.slice(0, 5).map((item, index) => (
              <button key={`${site.id}-flow-${item.slug}`} type="button" onClick={() => model.openRoute(item)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
          </div>
          <article className="sample-home__workflow-command">
            <span>{site.homeMode}</span>
            <strong>{site.hero.title}</strong>
            <p>{site.hero.subtitle}</p>
            <div className="sample-home__workflow-command-grid">
              {model.stats.slice(0, 3).map((item) => (
                <span key={`${site.id}-workflow-${item.label}`}>
                  {item.label}
                  <strong>{item.value}</strong>
                </span>
              ))}
            </div>
          </article>
        </div>
        <StatList model={model} className="sample-home__workflow-stats" limit={3} />
      </section>
    </ExperienceShell>
  );
}

function QuietCatalogHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__quiet">
        <div className="sample-home__quiet-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__quiet-shelf">
          <article className="sample-home__quiet-note">
            <span>{site.homeMode}</span>
            <strong>{site.hero.subtitle}</strong>
            <p>{site.summary}</p>
            <ChipList model={model} limit={4} />
          </article>
          <img src={site.images.scene} alt="" decoding="async" />
          <div className="sample-home__quiet-stack">
            {model.routes.slice(0, 3).map((item, index) => (
              <button key={`${site.id}-quiet-${item.slug}`} type="button" onClick={() => model.openRoute(item)}>
                <strong>{item.label}</strong>
                <span>{model.stats[index]?.value ?? model.chips[index] ?? site.hero.secondary}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </ExperienceShell>
  );
}

function KitTableHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__kit">
        <div className="sample-home__kit-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__kit-table">
          <button type="button" className="sample-home__kit-hero" onClick={() => model.openRoute(model.primaryRoute)}>
            <img src={site.images.product} alt="" decoding="async" />
            <span>{model.chips[0] ?? site.homeMode}</span>
          </button>
          <article className="sample-home__kit-swatches">
            {model.chips.slice(0, 4).map((item, index) => (
              <span key={`${site.id}-swatch-${item}`} data-index={index}>{item}</span>
            ))}
          </article>
          <button type="button" className="sample-home__kit-detail" onClick={() => model.openRoute(model.routes[1] ?? model.secondaryRoute)}>
            <img src={site.images.scene} alt="" decoding="async" />
            <span>{model.chips[1] ?? site.hero.secondary}</span>
          </button>
          <article className="sample-home__kit-summary">
            {model.stats.slice(0, 3).map((item) => (
              <span key={`${site.id}-kit-stat-${item.label}`}>
                {item.label}
                <strong>{item.value}</strong>
              </span>
            ))}
          </article>
        </div>
      </section>
    </ExperienceShell>
  );
}

function StorefrontWindowHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__storefront">
        <div className="sample-home__storefront-window">
          <img src={site.images.scene} alt="" decoding="async" />
        </div>
        <div className="sample-home__storefront-board">
          <span>{site.homeMode}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <div className="sample-home__storefront-stats">
            {model.stats.slice(0, 3).map((item) => (
              <span key={`${site.id}-store-${item.label}`}>
                {item.label}
                <strong>{item.value}</strong>
              </span>
            ))}
          </div>
          <RouteGrid model={model} limit={4} />
        </div>
      </section>
    </ExperienceShell>
  );
}

function LuxuryLoungeHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__lounge">
        <img className="sample-home__lounge-bg" src={site.images.scene} alt="" decoding="async" />
        <div className="sample-home__lounge-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <div className="sample-home__lounge-offers">
            {model.routes.slice(0, 3).map((item, index) => (
              <button key={`${site.id}-offer-${item.slug}`} type="button" onClick={() => model.openRoute(item)}>
                <strong>{item.label}</strong>
                <span>{model.chips[index] ?? site.homeMode}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="sample-home__lounge-card">
          <span>{site.homeMode}</span>
          <StatList model={model} limit={3} />
          <HomeActions model={model} site={site} compact />
        </div>
      </section>
    </ExperienceShell>
  );
}

function MinimalStatementHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__minimal">
        <img src={site.images.scene} alt="" decoding="async" />
        <div className="sample-home__minimal-copy">
          <span>{site.hero.eyebrow}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__minimal-notes">
          {model.stats.slice(0, 3).map((item, index) => (
            <article key={`${site.id}-note-${item.label}`}>
              <span>{model.chips[index] ?? item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>
    </ExperienceShell>
  );
}

function ShowroomPlannerHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__showroom">
        <div className="sample-home__showroom-plan" aria-hidden="true">
          {model.chips.slice(0, 6).map((item) => (
            <span key={`${site.id}-plan-${item}`} />
          ))}
        </div>
        <div className="sample-home__showroom-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <img className="sample-home__showroom-room" src={site.images.scene} alt="" decoding="async" />
      </section>
    </ExperienceShell>
  );
}

function LookbookRailHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__lookbook">
        <div className="sample-home__lookbook-copy">
          <span>{site.homeMode}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
        </div>
        <div className="sample-home__lookbook-rail">
          {[site.images.brand, site.images.product, site.images.scene].map((src, index) => (
            <button key={`${site.id}-look-${index}`} type="button" onClick={() => model.openRoute(model.routes[index] ?? model.primaryRoute)}>
              <img src={src} alt="" decoding="async" />
              <span>{model.chips[index] ?? site.hero.primary}</span>
            </button>
          ))}
        </div>
      </section>
    </ExperienceShell>
  );
}

function GalleryFocusHome({ site, actualView, onNavigate }) {
  const model = getHomePreviewModel(site, onNavigate);

  return (
    <ExperienceShell site={site} actualView={actualView}>
      <section className="sample-home__gallery">
        <div className="sample-home__gallery-copy">
          <span>{site.industry}</span>
          <h1>{site.brand}</h1>
          <p>{site.hero.title}</p>
          <HomeActions model={model} site={site} compact />
        </div>
        <div className="sample-home__gallery-wall">
          <img src={site.images.product} alt="" decoding="async" />
          <img src={site.images.brand} alt="" decoding="async" />
          <RouteGrid model={model} limit={3} />
        </div>
      </section>
    </ExperienceShell>
  );
}

function MotionHomeStage({ site, actualView, onNavigate }) {
  const experience = site.motion?.homeExperience ?? "cinematic-scroll";

  switch (experience) {
    case "dynamic-launch":
      return <DynamicLaunchHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "retail-browse":
      return <RetailBrowseHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "kinetic-split":
      return <KineticSplitHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "business-clean":
      return <BusinessCleanHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "beauty-counter":
      return <BeautyCounterHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "editorial-magazine":
      return <EditorialMagazineHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "flash-sale":
      return <FlashSaleHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "poster-world":
      return <PosterWorldHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "live-feed":
      return <LiveFeedHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "tech-console":
      return <TechConsoleHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "gaming-hud":
      return <GamingHudHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "workflow-map":
      return <WorkflowMapHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "quiet-catalog":
      return <QuietCatalogHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "kit-table":
      return <KitTableHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "storefront-window":
      return <StorefrontWindowHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "luxury-lounge":
      return <LuxuryLoungeHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "minimal-statement":
      return <MinimalStatementHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "showroom-planner":
      return <ShowroomPlannerHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "lookbook-rail":
      return <LookbookRailHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    case "gallery-focus":
      return <GalleryFocusHome site={site} actualView={actualView} onNavigate={onNavigate} />;
    default:
      return <CinematicScrollHome site={site} actualView={actualView} onNavigate={onNavigate} />;
  }
}

function CinematicScrollHome({ site, actualView, onNavigate }) {
  const stageRef = useRef(null);
  const theme = site.theme ?? {};
  const motion = site.motion ?? {};
  const layout = motion.layout ?? "poster";
  const variant = motion.homeVariant ?? layout;
  const layoutGroup = getHomeLayoutGroup(layout);
  const readyRoutes = site.routes.filter((item) => item.slug !== "home" && item.ready);
  const primaryRoute = readyRoutes[0] ?? site.routes.find((item) => item.slug !== "home") ?? site.routes[0];
  const secondaryRoute = readyRoutes[1] ?? readyRoutes[0] ?? primaryRoute;
  const isPagecraft = isPagecraftSample(site.id);
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
      className={`motion-home-stage ${isPagecraft ? "is-pagecraft" : ""}`.trim()}
      data-pagecraft={isPagecraft ? "true" : undefined}
      data-pagecraft-id={isPagecraft ? site.id : undefined}
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
  const useStaticHomeStage = site.id === "local-cafe" && route.kind === "home" && actualView === "desktop";
  const useStaticStage = Boolean(stage.html && (route.kind !== "home" || useStaticHomeStage));
  const frameClass = actualView === "mobile" && !isMobileClient ? "screen-stage__frame screen-stage__frame--narrow" : "screen-stage__frame";
  const title = `${site.brand} ${route.label}`;
  const frameRef = useRef(null);

  useEffect(() => {
    if (!useStaticStage || !frameRef.current) {
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
  }, [onNavigate, site, stage.html, useStaticStage]);

  if (route.kind === "home" && !useStaticStage) {
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
          <iframe ref={frameRef} title={title} src={stage.html} loading="lazy" style={{ height: "100%" }} />
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
        {"\uc81c\uc791 \ubb38\uc758"}
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
