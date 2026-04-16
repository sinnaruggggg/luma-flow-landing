import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { createDefaultAdminState, buildManagedSites, getVisibleGallerySites, sanitizeAdminState } from "../lib/adminStore";
import { useBackdropPointer } from "../lib/showcaseUtils";
import { SceneBackdrop, WebForgeMark } from "./showcaseAtoms";

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function toLineText(items) {
  return items.join("\n");
}

function toLineArray(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function coverageLabel(site) {
  if (site.gallery.publicReady) return "전체 공개";
  if (site.gallery.homeReady) return `부분 공개 ${site.gallery.readyRoutes}/${site.gallery.totalRoutes}`;
  if (site.gallery.stitchedRoutes > 0) return `제작 중 ${site.gallery.stitchedRoutes}/${site.gallery.totalRoutes}`;
  return "준비 중";
}

function MetricCard({ label, value, note }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

export function AdminConsole({ adminState, onSave, onReset, onBack }) {
  const [draft, setDraft] = useState(() => cloneState(adminState));
  const [flashMessage, setFlashMessage] = useState("");
  const [pointerStyle, onPointerMove] = useBackdropPointer();

  useEffect(() => {
    setDraft(cloneState(adminState));
  }, [adminState]);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFlashMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(adminState), [draft, adminState]);
  const previewSites = useMemo(() => buildManagedSites(draft), [draft]);
  const visibleSites = useMemo(() => getVisibleGallerySites(previewSites), [previewSites]);
  const hiddenCount = previewSites.length - visibleSites.length;
  const fullyReadyCount = previewSites.filter((site) => site.gallery.publicReady).length;
  const partialReadyCount = previewSites.filter((site) => !site.gallery.publicReady && site.gallery.stitchedRoutes > 0).length;
  const emptyChannelState = draft.inquiry.externalChannels.length === 0;

  function updateContentField(key, value) {
    setDraft((current) => ({
      ...current,
      content: {
        ...current.content,
        [key]: value,
      },
    }));
  }

  function updateInquiryList(key, value) {
    setDraft((current) => ({
      ...current,
      inquiry: {
        ...current.inquiry,
        [key]: toLineArray(value),
      },
    }));
  }

  function updatePlanField(index, key, value) {
    setDraft((current) => ({
      ...current,
      inquiry: {
        ...current.inquiry,
        pricingPlans: current.inquiry.pricingPlans.map((plan, planIndex) => (
          planIndex === index ? { ...plan, [key]: value } : plan
        )),
      },
    }));
  }

  function updatePlanItems(index, value) {
    updatePlanField(index, "items", toLineArray(value));
  }

  function updateChannel(index, key, value) {
    setDraft((current) => ({
      ...current,
      inquiry: {
        ...current.inquiry,
        externalChannels: current.inquiry.externalChannels.map((channel, channelIndex) => (
          channelIndex === index ? { ...channel, [key]: value } : channel
        )),
      },
    }));
  }

  function addChannel() {
    setDraft((current) => ({
      ...current,
      inquiry: {
        ...current.inquiry,
        externalChannels: [
          ...current.inquiry.externalChannels,
          { name: "", href: "", description: "" },
        ],
      },
    }));
  }

  function removeChannel(index) {
    setDraft((current) => ({
      ...current,
      inquiry: {
        ...current.inquiry,
        externalChannels: current.inquiry.externalChannels.filter((_, channelIndex) => channelIndex !== index),
      },
    }));
  }

  function updateSample(siteId, key, value) {
    setDraft((current) => ({
      ...current,
      samples: {
        ...current.samples,
        [siteId]: {
          ...current.samples[siteId],
          [key]: value,
        },
      },
    }));
  }

  function handleSave() {
    const next = sanitizeAdminState(draft);
    onSave(next);
    setDraft(next);
    setFlashMessage("변경 내용을 저장했습니다.");
  }

  function handleResetDraft() {
    setDraft(cloneState(adminState));
    setFlashMessage("저장된 상태로 되돌렸습니다.");
  }

  function handleResetAll() {
    const next = onReset ? onReset() : createDefaultAdminState();
    setDraft(cloneState(next));
    setFlashMessage("초기값으로 복원했습니다.");
  }

  return (
    <div className="hub-page admin-page" style={pointerStyle} onPointerMove={onPointerMove}>
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content admin-page__content">
        <header className="hub-topbar admin-topbar">
          <div className="hub-topbar__brand">
            <WebForgeMark />
            <div>
              <strong>sinnaruggggg_admin</strong>
              <span>현재 브라우저에 저장되는 운영용 관리자 페이지</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onBack}>
              <ArrowLeft size={16} />
              갤러리로
            </button>
            <button type="button" className="admin-button admin-button--ghost" onClick={handleResetDraft} disabled={!hasChanges}>
              저장 취소
            </button>
            <button type="button" className="admin-button admin-button--ghost" onClick={handleResetAll}>
              <RotateCcw size={16} />
              초기값 복원
            </button>
            <button type="button" className="hub-topbar__cta admin-button admin-button--primary" onClick={handleSave} disabled={!hasChanges}>
              <Save size={16} />
              변경 저장
            </button>
          </div>
        </header>

        <section className="admin-hero">
          <div className="admin-hero__copy">
            <span className="hub-section__eyebrow">Admin</span>
            <h1>sinnaruggggg_admin</h1>
            <p>
              메인 문구, 문의 옵션, 샘플 노출 순서를 한 화면에서 관리할 수 있게 만들었습니다.
              현재 저장 방식은 브라우저 `localStorage` 이므로 같은 PC와 같은 브라우저에서만 유지됩니다.
            </p>
          </div>
          <div className="admin-hero__status">
            <strong>{hasChanges ? "저장되지 않은 변경이 있습니다." : "저장된 설정을 사용 중입니다."}</strong>
            <p>{flashMessage || "샘플 내부 HTML 원본은 바뀌지 않고, 갤러리 카드·상단 정보·문의 섹션 설정만 반영됩니다."}</p>
          </div>
        </section>

        <section className="hub-section admin-section" aria-labelledby="admin-dashboard-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Dashboard</span>
            <h2 id="admin-dashboard-heading">현재 운영 상태</h2>
            <p>노출 샘플 수와 제작 완료 상태를 한 번에 확인할 수 있습니다.</p>
          </div>
          <div className="admin-metric-grid">
            <MetricCard label="노출 샘플" value={`${visibleSites.length}/${previewSites.length}`} note={`${hiddenCount}개는 숨김 처리됨`} />
            <MetricCard label="전체 공개" value={`${fullyReadyCount}개`} note="모든 라우트가 준비된 샘플" />
            <MetricCard label="제작 중" value={`${partialReadyCount}개`} note="일부 라우트만 공개된 샘플" />
            <MetricCard label="문의 채널" value={`${draft.inquiry.externalChannels.length}개`} note="관리자에서 직접 수정 가능" />
          </div>
        </section>

        <section className="hub-section admin-section" aria-labelledby="admin-copy-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Copy</span>
            <h2 id="admin-copy-heading">메인 문구 관리</h2>
            <p>홈 화면에서 자주 바뀌는 주요 카피만 먼저 관리자에서 바꿀 수 있게 뽑았습니다.</p>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--wide">
              <span>메인 헤드라인</span>
              <textarea rows={2} value={draft.content.heroTitle} onChange={(event) => updateContentField("heroTitle", event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>샘플 소개 문구</span>
              <textarea rows={3} value={draft.content.showcaseDescription} onChange={(event) => updateContentField("showcaseDescription", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>제작 방식 제목</span>
              <input type="text" value={draft.content.processHeading} onChange={(event) => updateContentField("processHeading", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>기능 제목</span>
              <input type="text" value={draft.content.featuresHeading} onChange={(event) => updateContentField("featuresHeading", event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>요금 제목</span>
              <textarea rows={2} value={draft.content.pricingHeading} onChange={(event) => updateContentField("pricingHeading", event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>요금 설명</span>
              <textarea rows={3} value={draft.content.pricingDescription} onChange={(event) => updateContentField("pricingDescription", event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>문의 제목</span>
              <textarea rows={2} value={draft.content.contactHeading} onChange={(event) => updateContentField("contactHeading", event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>문의 설명</span>
              <textarea rows={3} value={draft.content.contactDescription} onChange={(event) => updateContentField("contactDescription", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="hub-section admin-section" aria-labelledby="admin-inquiry-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Inquiry</span>
            <h2 id="admin-inquiry-heading">문의/견적 설정</h2>
            <p>문의 폼, 가격 카드, 외부 채널 안내에 쓰는 데이터를 여기서 관리합니다.</p>
          </div>

          <div className="admin-panel">
            <div className="admin-panel__header">
              <strong>가격 플랜</strong>
              <p>가격 카드와 문의 폼의 플랜 선택 옵션을 함께 바꿉니다.</p>
            </div>
            <div className="admin-plan-grid">
              {draft.inquiry.pricingPlans.map((plan, index) => (
                <article key={`${plan.name}-${index}`} className="admin-plan-card">
                  <div className="admin-form-row">
                    <label className="admin-field">
                      <span>플랜명</span>
                      <input type="text" value={plan.name} onChange={(event) => updatePlanField(index, "name", event.target.value)} />
                    </label>
                    <label className="admin-field">
                      <span>가격</span>
                      <input type="text" value={plan.price} onChange={(event) => updatePlanField(index, "price", event.target.value)} />
                    </label>
                  </div>
                  <label className="admin-field">
                    <span>설명</span>
                    <textarea rows={3} value={plan.description} onChange={(event) => updatePlanField(index, "description", event.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span>구성 항목</span>
                    <textarea rows={4} value={toLineText(plan.items)} onChange={(event) => updatePlanItems(index, event.target.value)} />
                  </label>
                  <label className="admin-toggle">
                    <input type="checkbox" checked={plan.featured} onChange={(event) => updatePlanField(index, "featured", event.target.checked)} />
                    대표 플랜으로 강조
                  </label>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>문의 포인트</span>
              <textarea rows={5} value={toLineText(draft.inquiry.contactPoints)} onChange={(event) => updateInquiryList("contactPoints", event.target.value)} />
              <small>줄바꿈으로 항목을 구분합니다.</small>
            </label>
            <label className="admin-field">
              <span>커스터마이징 옵션</span>
              <textarea rows={5} value={toLineText(draft.inquiry.customizationLevels)} onChange={(event) => updateInquiryList("customizationLevels", event.target.value)} />
              <small>문의 폼 셀렉트 옵션으로 사용됩니다.</small>
            </label>
            <label className="admin-field">
              <span>예산 옵션</span>
              <textarea rows={5} value={toLineText(draft.inquiry.budgetOptions)} onChange={(event) => updateInquiryList("budgetOptions", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>일정 옵션</span>
              <textarea rows={5} value={toLineText(draft.inquiry.timelineOptions)} onChange={(event) => updateInquiryList("timelineOptions", event.target.value)} />
            </label>
          </div>

          <div className="admin-panel">
            <div className="admin-panel__header admin-panel__header--spread">
              <div>
                <strong>외부 문의 채널</strong>
                <p>크몽, 숨고, 메일 같은 외부 문의 채널을 관리자에서 수정할 수 있습니다.</p>
              </div>
              <button type="button" className="admin-button admin-button--secondary" onClick={addChannel}>
                채널 추가
              </button>
            </div>

            {emptyChannelState ? <p className="admin-empty-note">현재 등록된 문의 채널이 없습니다. 필요하면 새 채널을 추가하세요.</p> : null}

            <div className="admin-channel-grid">
              {draft.inquiry.externalChannels.map((channel, index) => (
                <article key={`channel-${index}`} className="admin-channel-card">
                  <div className="admin-channel-card__header">
                    <strong>채널 {index + 1}</strong>
                    <button type="button" className="admin-button admin-button--ghost" onClick={() => removeChannel(index)}>
                      제거
                    </button>
                  </div>
                  <label className="admin-field">
                    <span>채널명</span>
                    <input type="text" value={channel.name} onChange={(event) => updateChannel(index, "name", event.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span>링크</span>
                    <input type="url" value={channel.href} onChange={(event) => updateChannel(index, "href", event.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span>설명</span>
                    <textarea rows={4} value={channel.description} onChange={(event) => updateChannel(index, "description", event.target.value)} />
                  </label>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hub-section admin-section" aria-labelledby="admin-samples-heading">
          <div className="hub-section__header">
            <span className="hub-section__eyebrow">Samples</span>
            <h2 id="admin-samples-heading">샘플 관리와 노출 제어</h2>
            <p>갤러리 카드 순서, 노출 여부, 상단 표기용 브랜드 정보와 요약을 바로 수정할 수 있습니다.</p>
          </div>
          <div className="admin-sample-grid">
            {previewSites.map((site) => (
              <article key={site.id} className={`admin-sample-card ${site.admin?.visible === false ? "is-hidden" : ""}`.trim()}>
                <div className="admin-sample-card__header">
                  <div>
                    <strong>{site.brand}</strong>
                    <p>{site.id}</p>
                  </div>
                  <div className="admin-badge-rail">
                    <span className={`admin-badge ${site.admin?.visible === false ? "admin-badge--muted" : "admin-badge--active"}`.trim()}>
                      {site.admin?.visible === false ? "숨김" : "노출"}
                    </span>
                    <span className="admin-badge">{coverageLabel(site)}</span>
                  </div>
                </div>

                <div className="admin-form-row">
                  <label className="admin-field admin-field--compact">
                    <span>정렬 순서</span>
                    <input
                      type="number"
                      min="0"
                      value={site.admin?.order ?? 0}
                      onChange={(event) => updateSample(site.id, "order", Number.parseInt(event.target.value, 10) || 0)}
                    />
                  </label>
                  <label className="admin-toggle admin-toggle--boxed">
                    <input type="checkbox" checked={site.admin?.visible !== false} onChange={(event) => updateSample(site.id, "visible", event.target.checked)} />
                    갤러리 노출
                  </label>
                </div>

                <label className="admin-field">
                  <span>브랜드명</span>
                  <input type="text" value={site.brand} onChange={(event) => updateSample(site.id, "brand", event.target.value)} />
                </label>
                <label className="admin-field">
                  <span>업종명</span>
                  <input type="text" value={site.industry} onChange={(event) => updateSample(site.id, "industry", event.target.value)} />
                </label>
                <label className="admin-field">
                  <span>홈 무드 한 줄</span>
                  <input type="text" value={site.homeMode} onChange={(event) => updateSample(site.id, "homeMode", event.target.value)} />
                </label>
                <label className="admin-field">
                  <span>갤러리 요약</span>
                  <textarea rows={4} value={site.summary} onChange={(event) => updateSample(site.id, "summary", event.target.value)} />
                </label>

                <div className="admin-sample-card__meta">
                  <span>완성 라우트 {site.gallery.readyRoutes}/{site.gallery.totalRoutes}</span>
                  <span>{site.gallery.homeReady ? "홈 공개 가능" : "홈 미완성"}</span>
                </div>
                <p className="admin-help">이 수정은 갤러리 카드와 상세 상단 정보에 반영됩니다. 샘플 안쪽 HTML 화면은 별도로 수정해야 합니다.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
