import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogOut, RefreshCw, RotateCcw, Save } from "lucide-react";
import { createDefaultAdminState, buildManagedSites, getVisibleGallerySites, sanitizeAdminState } from "../lib/adminStore";
import { clearAdminToken, fetchAdminInquiries, fetchAdminVisits, getAdminToken, loginAdmin, setAdminToken } from "../lib/inquiryApi";
import { useBackdropPointer } from "../lib/showcaseUtils";
import { BrandMark, SceneBackdrop } from "./showcaseAtoms";

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEmptyInquiryState() {
  return { items: [], storage: null, loading: false, error: "" };
}

function createEmptyVisitState() {
  return { items: [], storage: null, loading: false, error: "" };
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

function formatDateTime(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function isSameCalendarDate(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
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

const ADMIN_TABS = [
  { id: "overview", label: "상태", tone: "overview" },
  { id: "submissions", label: "문의", tone: "submissions" },
  { id: "visits", label: "접속", tone: "submissions" },
  { id: "copy", label: "문구", tone: "copy" },
  { id: "inquiry", label: "견적", tone: "inquiry" },
  { id: "samples", label: "샘플", tone: "samples" },
];

export function AdminConsole({ adminState, onSave, onReset, onBack }) {
  const [draft, setDraft] = useState(() => cloneState(adminState));
  const [flashMessage, setFlashMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [adminToken, setAdminTokenState] = useState(() => getAdminToken());
  const [authStatus, setAuthStatus] = useState(() => (getAdminToken() ? "checking" : "logged_out"));
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [inquiryState, setInquiryState] = useState(createEmptyInquiryState);
  const [visitState, setVisitState] = useState(createEmptyVisitState);
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

  useEffect(() => {
    let ignore = false;

    if (!adminToken) {
      setAuthStatus("logged_out");
      setInquiryState(createEmptyInquiryState());
      return undefined;
    }

    setAuthStatus("checking");
    setInquiryState((current) => ({ ...current, loading: true, error: "" }));

    fetchAdminInquiries(adminToken)
      .then((payload) => {
        if (ignore) return;
        setAuthStatus("logged_in");
        setInquiryState({
          items: payload?.inquiries ?? [],
          storage: payload?.storage ?? null,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (ignore) return;
        clearAdminToken();
        setAdminTokenState("");
        setAuthStatus("logged_out");
        setAuthMessage(error.message || "관리자 로그인이 필요합니다.");
        setInquiryState(createEmptyInquiryState());
      });

    return () => {
      ignore = true;
    };
  }, [adminToken]);

  useEffect(() => {
    let ignore = false;

    if (!adminToken) {
      setVisitState(createEmptyVisitState());
      return undefined;
    }

    setVisitState((current) => ({ ...current, loading: true, error: "" }));

    fetchAdminVisits(adminToken)
      .then((payload) => {
        if (ignore) return;
        setVisitState({
          items: payload?.visits ?? [],
          storage: payload?.storage ?? null,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (ignore) return;
        setVisitState({
          items: [],
          storage: null,
          loading: false,
          error: error.message || "접속 기록을 불러오지 못했습니다.",
        });
      });

    return () => {
      ignore = true;
    };
  }, [adminToken]);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(adminState), [draft, adminState]);
  const previewSites = useMemo(() => buildManagedSites(draft), [draft]);
  const visibleSites = useMemo(() => getVisibleGallerySites(previewSites), [previewSites]);
  const hiddenCount = previewSites.length - visibleSites.length;
  const fullyReadyCount = previewSites.filter((site) => site.gallery.publicReady).length;
  const partialReadyCount = previewSites.filter((site) => !site.gallery.publicReady && site.gallery.stitchedRoutes > 0).length;
  const emptyChannelState = draft.inquiry.externalChannels.length === 0;
  const isLoggedIn = authStatus === "logged_in";
  const inquiryCount = inquiryState.items.length;
  const totalVisitCount = visitState.items.length;

  const todayVisitCount = useMemo(() => {
    const today = new Date();
    return visitState.items.filter((visit) => {
      const createdAt = new Date(visit.createdAt);
      return Number.isFinite(createdAt.getTime()) && isSameCalendarDate(createdAt, today);
    }).length;
  }, [visitState.items]);

  const visitSummary = useMemo(() => {
    const siteMap = new Map(previewSites.map((site) => [site.id, site]));
    const grouped = new Map();

    visitState.items.forEach((visit) => {
      const existing = grouped.get(visit.siteId) ?? {
        siteId: visit.siteId,
        brand: siteMap.get(visit.siteId)?.brand ?? visit.siteId,
        industry: siteMap.get(visit.siteId)?.industry ?? "",
        totalCount: 0,
        lastVisitedAt: "",
        lastRouteLabel: "",
        lastPath: "",
      };

      existing.totalCount += 1;

      if (!existing.lastVisitedAt || new Date(visit.createdAt) > new Date(existing.lastVisitedAt)) {
        existing.lastVisitedAt = visit.createdAt;
        existing.lastRouteLabel = visit.routeLabel || visit.routeSlug || "-";
        existing.lastPath = visit.sourcePath || "-";
      }

      grouped.set(visit.siteId, existing);
    });

    return [...grouped.values()].sort((left, right) => {
      if (left.totalCount !== right.totalCount) {
        return right.totalCount - left.totalCount;
      }

      return new Date(right.lastVisitedAt) - new Date(left.lastVisitedAt);
    });
  }, [previewSites, visitState.items]);

  const recentVisits = useMemo(() => visitState.items.slice(0, 30), [visitState.items]);

  const adminTabs = useMemo(() => ([
    {
      ...ADMIN_TABS[0],
      value: `${visibleSites.length}/${previewSites.length}`,
      hint: hiddenCount > 0 ? `숨김 ${hiddenCount}` : "전체 노출",
    },
    {
      ...ADMIN_TABS[1],
      value: `${inquiryCount}건`,
      hint: inquiryState.loading ? "불러오는 중" : "문의 내역",
    },
    {
      ...ADMIN_TABS[2],
      value: `${totalVisitCount}회`,
      hint: visitState.loading ? "집계 중" : `오늘 ${todayVisitCount}회`,
    },
    {
      ...ADMIN_TABS[3],
      value: hasChanges ? "수정 중" : "안정",
      hint: "메인 카피",
    },
    {
      ...ADMIN_TABS[4],
      value: `${draft.inquiry.pricingPlans.length}플랜`,
      hint: `채널 ${draft.inquiry.externalChannels.length}`,
    },
    {
      ...ADMIN_TABS[5],
      value: `${previewSites.length}개`,
      hint: `${fullyReadyCount}개 공개`,
    },
  ]), [
    draft.inquiry.externalChannels.length,
    draft.inquiry.pricingPlans.length,
    fullyReadyCount,
    hasChanges,
    hiddenCount,
    inquiryCount,
    inquiryState.loading,
    previewSites.length,
    todayVisitCount,
    totalVisitCount,
    visitState.loading,
    visibleSites.length,
  ]);

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

  async function handleAdminLogin(event) {
    event.preventDefault();
    setAuthStatus("logging_in");
    setAuthMessage("");

    try {
      const payload = await loginAdmin(authForm);
      setAdminToken(payload.token);
      setAdminTokenState(payload.token);
      setAuthStatus("checking");
      setAuthMessage("관리자 로그인을 완료했습니다.");
      setAuthForm({ username: "", password: "" });
    } catch (error) {
      setAuthStatus("logged_out");
      setAuthMessage(error.message || "로그인에 실패했습니다.");
    }
  }

  async function handleRefreshAdminData() {
    if (!adminToken) return;

    setInquiryState((current) => ({ ...current, loading: true, error: "" }));
    setVisitState((current) => ({ ...current, loading: true, error: "" }));

    const [inquiryResult, visitResult] = await Promise.allSettled([
      fetchAdminInquiries(adminToken),
      fetchAdminVisits(adminToken),
    ]);

    if (inquiryResult.status === "fulfilled") {
      setInquiryState({
        items: inquiryResult.value?.inquiries ?? [],
        storage: inquiryResult.value?.storage ?? null,
        loading: false,
        error: "",
      });
    } else {
      setInquiryState((current) => ({
        ...current,
        loading: false,
        error: inquiryResult.reason?.message || "문의 내역을 다시 불러오지 못했습니다.",
      }));
    }

    if (visitResult.status === "fulfilled") {
      setVisitState({
        items: visitResult.value?.visits ?? [],
        storage: visitResult.value?.storage ?? null,
        loading: false,
        error: "",
      });
    } else {
      setVisitState((current) => ({
        ...current,
        loading: false,
        error: visitResult.reason?.message || "접속 기록을 다시 불러오지 못했습니다.",
      }));
    }
  }

  function handleLogout() {
    clearAdminToken();
    setAdminTokenState("");
    setAuthStatus("logged_out");
    setAuthMessage("로그아웃했습니다.");
  }

  return (
    <div className="hub-page admin-page" style={pointerStyle} onPointerMove={onPointerMove}>
      <SceneBackdrop tone="gallery" />
      <div className="hub-page__content admin-page__content">
        <header className="hub-topbar admin-topbar">
          <div className="hub-topbar__brand">
            <BrandMark />
            <div>
              <strong>sinnaruggggg_admin</strong>
              <span>문의, 접속 기록, 갤러리 설정을 한 화면에서 관리합니다.</span>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <button type="button" className="admin-button admin-button--secondary" onClick={onBack}>
              <ArrowLeft size={16} />
              갤러리
            </button>
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="admin-button admin-button--ghost"
                  onClick={handleRefreshAdminData}
                  disabled={inquiryState.loading || visitState.loading}
                >
                  <RefreshCw size={16} />
                  새로고침
                </button>
                <button type="button" className="admin-button admin-button--ghost" onClick={handleResetDraft} disabled={!hasChanges}>
                  되돌리기
                </button>
                <button type="button" className="admin-button admin-button--ghost" onClick={handleResetAll}>
                  <RotateCcw size={16} />
                  초기화
                </button>
                <button type="button" className="hub-topbar__cta admin-button admin-button--primary" onClick={handleSave} disabled={!hasChanges}>
                  <Save size={16} />
                  저장
                </button>
                <button type="button" className="admin-button admin-button--ghost" onClick={handleLogout}>
                  <LogOut size={16} />
                  로그아웃
                </button>
              </>
            ) : null}
          </div>
        </header>

        <section className="admin-hero">
          <div className="admin-hero__copy">
            <span className="hub-section__eyebrow">Admin</span>
            <h1>sinnaruggggg_admin</h1>
            <p>
              문의 접수, 접속 기록, 메인 카피, 샘플 노출 설정을 한 번에 확인하는 관리자 화면입니다.
              저장되는 문의와 방문 로그는 서버 API로 별도 보관됩니다.
            </p>
          </div>
          <div className="admin-hero__status">
            <strong>
              {isLoggedIn
                ? (hasChanges ? "저장되지 않은 갤러리 변경사항이 있습니다." : "관리자 로그인 상태입니다.")
                : "관리자 로그인이 필요합니다."}
            </strong>
            <p>{flashMessage || authMessage || "갤러리 카드와 문의/접속 데이터는 서로 분리되어 관리됩니다."}</p>
          </div>
        </section>

        {!isLoggedIn ? (
          <section className="hub-section admin-section" aria-labelledby="admin-login-heading">
            <div className="hub-section__header">
              <span className="hub-section__eyebrow">Login</span>
              <h2 id="admin-login-heading">관리자 로그인</h2>
              <p>아이디와 비밀번호를 입력하면 문의 내역과 갤러리 설정을 확인할 수 있습니다.</p>
            </div>

            <div className="admin-login-card">
              <form className="admin-login-form" onSubmit={handleAdminLogin}>
                <label className="admin-field">
                  <span>아이디</span>
                  <input
                    type="text"
                    autoComplete="username"
                    value={authForm.username}
                    onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="sinnaruggggg"
                  />
                </label>
                <label className="admin-field">
                  <span>비밀번호</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={authForm.password}
                    onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="비밀번호"
                  />
                </label>
                <button type="submit" className="hub-topbar__cta admin-button admin-button--primary" disabled={authStatus === "logging_in" || authStatus === "checking"}>
                  {authStatus === "logging_in" || authStatus === "checking" ? "확인 중..." : "로그인"}
                </button>
              </form>
              <p className="admin-empty-note">로그인 후에는 문의 목록과 사이트 접속 집계를 같이 확인할 수 있습니다.</p>
            </div>
          </section>
        ) : (
          <>
            <nav className="admin-tabs" aria-label="관리자 메뉴">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`admin-tab ${activeTab === tab.id ? "is-active" : ""}`.trim()}
                  data-tone={tab.tone}
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="admin-tab__label">{tab.label}</span>
                  <strong className="admin-tab__value">{tab.value}</strong>
                  <span className="admin-tab__hint">{tab.hint}</span>
                </button>
              ))}
            </nav>

            {activeTab === "overview" ? (
              <section className="hub-section admin-section" data-tone="overview" aria-labelledby="admin-dashboard-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Status</span>
                  <h2 id="admin-dashboard-heading">상태 보드</h2>
                  <p>공개 상태, 문의, 접속 집계를 빠르게 보는 영역입니다.</p>
                </div>
                <div className="admin-metric-grid">
                  <MetricCard label="노출 샘플" value={`${visibleSites.length}/${previewSites.length}`} note={hiddenCount > 0 ? `숨김 ${hiddenCount}개` : "전체 노출"} />
                  <MetricCard label="전체 공개" value={`${fullyReadyCount}개`} note="모든 라우트가 준비된 샘플" />
                  <MetricCard label="제작 중" value={`${partialReadyCount}개`} note="일부 라우트만 공개된 샘플" />
                  <MetricCard label="문의 채널" value={`${draft.inquiry.externalChannels.length}개`} note="연결된 외부 문의 채널" />
                  <MetricCard label="문의 접수" value={`${inquiryCount}건`} note="누적 저장 문의 수" />
                  <MetricCard label="사이트 접속" value={`${totalVisitCount}회`} note={visitSummary.length > 0 ? `방문 기록 사이트 ${visitSummary.length}개` : "아직 접속 기록 없음"} />
                </div>
              </section>
            ) : null}

            {activeTab === "submissions" ? (
              <section className="hub-section admin-section" data-tone="submissions" aria-labelledby="admin-submissions-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Submissions</span>
                  <h2 id="admin-submissions-heading">문의</h2>
                  <p>문의 폼으로 저장된 내용과 저장 위치를 확인합니다.</p>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel__header admin-panel__header--spread">
                    <div>
                      <strong>저장 상태</strong>
                      <p>{inquiryState.storage?.note || "문의 저장 방식을 확인하는 중입니다."}</p>
                    </div>
                    <button type="button" className="admin-button admin-button--secondary" onClick={handleRefreshAdminData} disabled={inquiryState.loading || visitState.loading}>
                      <RefreshCw size={16} />
                      {inquiryState.loading ? "불러오는 중..." : "새로고침"}
                    </button>
                  </div>

                  {inquiryState.error ? <p className="hub-feedback-note hub-feedback-note--error">{inquiryState.error}</p> : null}

                  {inquiryCount > 0 ? (
                    <div className="admin-inquiry-list">
                      {inquiryState.items.map((inquiry) => (
                        <article key={inquiry.id} className="admin-inquiry-card">
                          <div className="admin-inquiry-card__header">
                            <div>
                              <strong>{inquiry.contactName || "이름 없음"}</strong>
                              <p>{formatDateTime(inquiry.createdAt)}</p>
                            </div>
                            <div className="admin-badge-rail">
                              <span className="admin-badge admin-badge--active">{inquiry.sampleBrand || inquiry.sampleId}</span>
                              <span className="admin-badge">{inquiry.plan || "플랜 미정"}</span>
                            </div>
                          </div>

                          <div className="admin-inquiry-meta">
                            <span>이메일 {inquiry.email || "-"}</span>
                            <span>연락처 {inquiry.phone || "-"}</span>
                            <span>예산 {inquiry.budget || "-"}</span>
                            <span>일정 {inquiry.timeline || "-"}</span>
                          </div>

                          <div className="admin-inquiry-body">
                            <p><strong>커스터마이징</strong>{inquiry.customization || "-"}</p>
                            <p><strong>참고 링크</strong>{inquiry.references || "-"}</p>
                            <p><strong>문의 내용</strong>{inquiry.details || "-"}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-empty-note">아직 저장된 문의가 없습니다.</p>
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === "visits" ? (
              <section className="hub-section admin-section" data-tone="submissions" aria-labelledby="admin-visits-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Visits</span>
                  <h2 id="admin-visits-heading">접속 기록</h2>
                  <p>각 샘플 사이트가 언제 몇 번 열렸는지 집계합니다.</p>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel__header admin-panel__header--spread">
                    <div>
                      <strong>집계 상태</strong>
                      <p>{visitState.storage?.note || "접속 기록 저장 방식을 확인하는 중입니다."}</p>
                    </div>
                    <button type="button" className="admin-button admin-button--secondary" onClick={handleRefreshAdminData} disabled={inquiryState.loading || visitState.loading}>
                      <RefreshCw size={16} />
                      {visitState.loading ? "집계 중..." : "새로고침"}
                    </button>
                  </div>

                  <p className="admin-help">같은 브라우저 탭에서 같은 사이트는 한 번만 기록합니다. 탭을 새로 열면 다시 카운트됩니다.</p>
                  {visitState.error ? <p className="hub-feedback-note hub-feedback-note--error">{visitState.error}</p> : null}

                  <div className="admin-metric-grid">
                    <MetricCard label="총 접속" value={`${totalVisitCount}회`} note="누적 접속 수" />
                    <MetricCard label="오늘 접속" value={`${todayVisitCount}회`} note="관리자 브라우저 기준 오늘" />
                    <MetricCard label="접속 사이트" value={`${visitSummary.length}개`} note={visitSummary[0] ? `최다 접속 ${visitSummary[0].brand}` : "아직 기록 없음"} />
                  </div>

                  {visitSummary.length > 0 ? (
                    <div className="admin-sample-grid">
                      {visitSummary.map((entry) => (
                        <article key={entry.siteId} className="admin-sample-card">
                          <div className="admin-sample-card__header">
                            <div>
                              <strong>{entry.brand}</strong>
                              <p>{entry.siteId}</p>
                            </div>
                            <div className="admin-badge-rail">
                              <span className="admin-badge admin-badge--active">{entry.totalCount}회</span>
                            </div>
                          </div>

                          <div className="admin-sample-card__meta">
                            <span>마지막 접속 {formatDateTime(entry.lastVisitedAt)}</span>
                            <span>최근 진입 {entry.lastRouteLabel}</span>
                          </div>
                          <p className="admin-help">{entry.lastPath}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-empty-note">아직 저장된 접속 기록이 없습니다.</p>
                  )}
                </div>

                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <strong>최근 접속 로그</strong>
                    <p>최신 30개 기록을 시간순으로 보여줍니다.</p>
                  </div>

                  {recentVisits.length > 0 ? (
                    <div className="admin-inquiry-list">
                      {recentVisits.map((visit) => {
                        const site = previewSites.find((item) => item.id === visit.siteId);
                        const brand = site?.brand ?? visit.siteId;

                        return (
                          <article key={visit.id} className="admin-inquiry-card">
                            <div className="admin-inquiry-card__header">
                              <div>
                                <strong>{brand}</strong>
                                <p>{formatDateTime(visit.createdAt)}</p>
                              </div>
                              <div className="admin-badge-rail">
                                <span className="admin-badge admin-badge--active">{visit.routeLabel || visit.routeSlug || "-"}</span>
                              </div>
                            </div>

                            <div className="admin-inquiry-meta">
                              <span>사이트 ID {visit.siteId}</span>
                              <span>경로 {visit.sourcePath || "-"}</span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="admin-empty-note">표시할 접속 로그가 없습니다.</p>
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === "copy" ? (
              <section className="hub-section admin-section" data-tone="copy" aria-labelledby="admin-copy-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Copy</span>
                  <h2 id="admin-copy-heading">문구</h2>
                  <p>메인 페이지에 노출되는 카피를 수정합니다.</p>
                </div>
                <div className="admin-form-grid">
                  <label className="admin-field admin-field--wide">
                    <span>메인 헤드라인</span>
                    <textarea rows={2} value={draft.content.heroTitle} onChange={(event) => updateContentField("heroTitle", event.target.value)} />
                  </label>
                  <label className="admin-field admin-field--wide">
                    <span>샘플 소개</span>
                    <textarea rows={3} value={draft.content.showcaseDescription} onChange={(event) => updateContentField("showcaseDescription", event.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span>제작 방식</span>
                    <input type="text" value={draft.content.processHeading} onChange={(event) => updateContentField("processHeading", event.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span>기능 제목</span>
                    <input type="text" value={draft.content.featuresHeading} onChange={(event) => updateContentField("featuresHeading", event.target.value)} />
                  </label>
                  <label className="admin-field admin-field--wide">
                    <span>가격 제목</span>
                    <textarea rows={2} value={draft.content.pricingHeading} onChange={(event) => updateContentField("pricingHeading", event.target.value)} />
                  </label>
                  <label className="admin-field admin-field--wide">
                    <span>가격 설명</span>
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
            ) : null}

            {activeTab === "inquiry" ? (
              <section className="hub-section admin-section" data-tone="inquiry" aria-labelledby="admin-inquiry-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Inquiry</span>
                  <h2 id="admin-inquiry-heading">견적과 채널</h2>
                  <p>플랜, 옵션, 외부 문의 채널을 이 화면에서 관리합니다.</p>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <strong>플랜</strong>
                    <p>가격 카드와 문의 폼의 선택 옵션을 여기서 수정합니다.</p>
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
                          <span>구성</span>
                          <textarea rows={4} value={toLineText(plan.items)} onChange={(event) => updatePlanItems(index, event.target.value)} />
                        </label>
                        <label className="admin-toggle">
                          <input type="checkbox" checked={plan.featured} onChange={(event) => updatePlanField(index, "featured", event.target.checked)} />
                          추천 플랜
                        </label>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span>문의 포인트</span>
                    <textarea rows={5} value={toLineText(draft.inquiry.contactPoints)} onChange={(event) => updateInquiryList("contactPoints", event.target.value)} />
                    <small>줄바꿈 기준으로 항목을 나눕니다.</small>
                  </label>
                  <label className="admin-field">
                    <span>커스터마이징 옵션</span>
                    <textarea rows={5} value={toLineText(draft.inquiry.customizationLevels)} onChange={(event) => updateInquiryList("customizationLevels", event.target.value)} />
                    <small>문의 폼 선택 항목으로 사용됩니다.</small>
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
                      <p>숨고, 크몽, 메일 같은 문의 채널을 관리합니다.</p>
                    </div>
                    <button type="button" className="admin-button admin-button--secondary" onClick={addChannel}>
                      채널 추가
                    </button>
                  </div>

                  {emptyChannelState ? <p className="admin-empty-note">아직 등록된 외부 문의 채널이 없습니다. 필요하면 채널을 추가해 주세요.</p> : null}

                  <div className="admin-channel-grid">
                    {draft.inquiry.externalChannels.map((channel, index) => (
                      <article key={`channel-${index}`} className="admin-channel-card">
                        <div className="admin-channel-card__header">
                          <strong>채널 {index + 1}</strong>
                          <button type="button" className="admin-button admin-button--ghost" onClick={() => removeChannel(index)}>
                            삭제
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
            ) : null}

            {activeTab === "samples" ? (
              <section className="hub-section admin-section" data-tone="samples" aria-labelledby="admin-samples-heading">
                <div className="hub-section__header">
                  <span className="hub-section__eyebrow">Samples</span>
                  <h2 id="admin-samples-heading">샘플</h2>
                  <p>노출, 순서, 브랜드 정보만 빠르게 조정합니다.</p>
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
                          <span>정렬</span>
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
                        <span>홈 무드</span>
                        <input type="text" value={site.homeMode} onChange={(event) => updateSample(site.id, "homeMode", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>요약</span>
                        <textarea rows={4} value={site.summary} onChange={(event) => updateSample(site.id, "summary", event.target.value)} />
                      </label>

                      <div className="admin-sample-card__meta">
                        <span>완성 라우트 {site.gallery.readyRoutes}/{site.gallery.totalRoutes}</span>
                        <span>{site.gallery.homeReady ? "홈 공개 가능" : "홈 미완성"}</span>
                      </div>
                      <p className="admin-help">갤러리 카드와 상세 상단 정보에만 반영됩니다. 샘플 HTML은 별도로 수정해야 합니다.</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
