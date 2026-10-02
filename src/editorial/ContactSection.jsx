import { useEffect, useMemo, useRef, useState } from 'react';
import { withBasePath } from '../lib/appPaths.js';
import { AGENCY_CONFIG } from './data/agencyConfig.js';
import { INQUIRY_CONSENT } from './data/privacyPolicy.js';
import './contact-section.css';

const EMPTY_FORM = Object.freeze({
  company: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  budget: '',
  timeline: '',
  details: '',
  privacy: false,
});

const BUDGETS = ['50만원 이하', '50~100만원', '100~200만원', '200~300만원', '300만원 이상', '상담 후 결정'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(value) {
  return value.replace(/[^0-9+]/g, '');
}

function validate(form) {
  const errors = {};
  if (!form.contactName.trim()) errors.contactName = '담당자 이름을 입력해 주세요.';
  if (!form.email.trim() && !form.phone.trim()) errors.contact = '이메일 또는 연락처를 하나 이상 입력해 주세요.';
  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) errors.email = '이메일 형식을 확인해 주세요.';
  if (form.phone.trim() && normalizePhone(form.phone).length < 9) errors.phone = '연락처를 확인해 주세요.';
  if (!form.details.trim()) errors.details = '문의 내용을 입력해 주세요.';
  if (!form.privacy) errors.privacy = '개인정보 수집·이용에 동의해 주세요.';
  return errors;
}

function readCampaignContext() {
  if (typeof window === 'undefined') return { sourcePath: '/', campaign: '' };
  const source = new URL(window.location.href);
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const campaign = allowed
    .map((key) => [key, source.searchParams.get(key)])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return { sourcePath: `${source.pathname}${source.search}`, campaign };
}

function buildBrief(form) {
  return [
    `${AGENCY_CONFIG.brandName} 웹사이트 제작 상담`,
    '',
    `회사·브랜드: ${form.company.trim() || '미입력'}`,
    `담당자: ${form.contactName.trim()}`,
    `이메일: ${form.email.trim() || '미입력'}`,
    `연락처: ${form.phone.trim() || '미입력'}`,
    `현재 웹사이트: ${form.website.trim() || '없음'}`,
    `예상 예산: ${form.budget || '상담 후 결정'}`,
    `공개 희망 시기: ${form.timeline.trim() || '협의 필요'}`,
    '',
    '[문의 내용]',
    form.details.trim(),
    '',
    '※ 이 파일은 현재 기기에만 저장되며 상담 접수로 전송되지 않았습니다.',
  ].join('\n');
}

function downloadBrief(form) {
  const blob = new Blob([buildBrief(form)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `웹사이트-제작-상담-${date}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// 폼 위 터미널 명령줄: 입력한 값이 옵션처럼 실시간으로 붙습니다. (화면 장식용, 길면 자름)
function commandArgs(form) {
  const short = (value, max = 14) => (value.length > max ? `${value.slice(0, max)}…` : value);
  return [
    form.contactName.trim() && ` --name "${short(form.contactName.trim())}"`,
    form.company.trim() && ` --brand "${short(form.company.trim())}"`,
    form.budget && ` --budget "${form.budget}"`,
    form.details.trim() && ` --brief "${short(form.details.trim().split('\n')[0], 18)}"`,
  ].filter(Boolean).join('');
}

export function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ type: 'idle', message: '' });
  const submittingRef = useRef(false);
  const lastAcceptedRef = useRef('');
  const submitButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // 비용 섹션 견적 계산기에서 "이 구성으로 상담하기"를 누르면 예산·문의 내용을 채웁니다. (이미 쓴 내용은 지우지 않음)
  useEffect(() => {
    const onEstimate = (event) => {
      const { budget, details } = event.detail ?? {};
      setForm((current) => ({
        ...current,
        budget: budget || current.budget,
        details: current.details.trim() ? `${current.details.trim()}

${details}` : details,
      }));
    };
    window.addEventListener('nanaweb:estimate', onEstimate);
    return () => window.removeEventListener('nanaweb:estimate', onEstimate);
  }, []);

  const signature = useMemo(() => JSON.stringify({
    name: form.contactName.trim().toLowerCase(),
    phone: normalizePhone(form.phone),
    email: form.email.trim().toLowerCase(),
    details: form.details.trim(),
  }), [form.contactName, form.phone, form.email, form.details]);

  useEffect(() => {
    if (state.type !== 'success' && state.type !== 'duplicate') return undefined;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();
    return undefined;
  }, [state.type]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === 'email' || name === 'phone' ? { contact: undefined } : {}) }));
    if (state.type === 'error' || state.type === 'saved') setState({ type: 'idle', message: '' });
  }

  function closeDialog() {
    dialogRef.current?.close();
    setState({ type: 'idle', message: '' });
    submitButtonRef.current?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const formElement = event.currentTarget;
      window.requestAnimationFrame(() => formElement.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    if (!AGENCY_CONFIG.inquiryEnabled) {
      downloadBrief(form);
      setState({ type: 'saved', message: '상담 내용을 파일로 저장했습니다. 현재는 접수처와 연결되어 있지 않아 전송되지 않았습니다.' });
      return;
    }

    if (signature === lastAcceptedRef.current) {
      setState({ type: 'duplicate', message: '같은 내용이 이 화면에서 이미 접수되었습니다.' });
      return;
    }

    submittingRef.current = true;
    setState({ type: 'pending', message: '접수 내용을 확인하고 있습니다.' });
    const { sourcePath, campaign } = readCampaignContext();
    try {
      const response = await fetch(withBasePath(AGENCY_CONFIG.inquiryEndpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          sampleId: AGENCY_CONFIG.inquirySampleId,
          sampleBrand: form.company.trim() || AGENCY_CONFIG.brandName,
          plan: form.budget,
          customization: form.timeline.trim(),
          budget: form.budget,
          timeline: form.timeline.trim(),
          references: [form.website.trim() ? `현재 웹사이트: ${form.website.trim()}` : '', campaign].filter(Boolean).join('\n'),
          details: form.details.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          sourcePath,
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) throw new Error('서버가 올바른 접수 응답을 보내지 않았습니다.');
      const payload = await response.json();
      if (!response.ok || payload?.ok !== true) throw new Error(payload?.message || '문의 접수가 완료되지 않았습니다.');
      lastAcceptedRef.current = signature;
      setState({ type: 'success', message: '접수되었습니다. 담당자가 확인 후 연락드리겠습니다.', id: String(payload.id ?? '') });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      setState({ type: 'error', message: error instanceof Error ? error.message : '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      submittingRef.current = false;
    }
  }

  const contactError = errors.contact || errors.email || errors.phone;

  return <section className="agency-contact" id="contact" aria-labelledby="agency-contact-title">
    <div className="agency-contact__intro" data-reveal>
      <span className="eyebrow">제작 상담</span>
      <h2 id="agency-contact-title">필요한 웹사이트를<br />함께 정리해 보세요.</h2>
      <p>정해진 내용이 많지 않아도 괜찮습니다. 사업의 목적과 지금 고민되는 지점부터 적어 주세요.</p>
      <div className="agency-contact__notice" aria-label="문의 접수 상태">
        <strong>{AGENCY_CONFIG.inquiryEnabled ? '온라인 접수 가능' : '온라인 접수 준비 중'}</strong>
        <span>{AGENCY_CONFIG.inquiryEnabled ? AGENCY_CONFIG.responseTime : '지금은 작성한 내용을 파일로 저장할 수 있습니다. 저장한 파일을 아래 이메일로 보내 주세요.'}</span>
      </div>
      <ul className="agency-contact__channels" aria-label="연락 채널">
        <li><span>이메일</span><a href={`mailto:${AGENCY_CONFIG.contact.email}`}>{AGENCY_CONFIG.contact.email}</a></li>
        {AGENCY_CONFIG.contact.phone ? <li><span>전화</span><a href={`tel:${AGENCY_CONFIG.contact.phone.replace(/[^0-9+]/g, '')}`}>{AGENCY_CONFIG.contact.phone}</a></li> : null}
        {AGENCY_CONFIG.contact.kakao ? <li><span>메신저</span>{AGENCY_CONFIG.contact.kakao}</li> : null}
        <li><span>상담 시간</span>{AGENCY_CONFIG.contact.hours}</li>
      </ul>
    </div>

    <form className="agency-contact__form" noValidate onSubmit={handleSubmit} aria-describedby="contact-form-status">
      <div className="contact-term" aria-hidden="true">
        <div className="contact-term__bar"><i /><i /><i /><span>new-project.request</span><b>● online</b></div>
        <p className="contact-term__cmd"><span>$</span> nanaweb request{commandArgs(form)}<i /></p>
      </div>
      <div className="agency-contact__row">
        <label><span>회사·브랜드</span><input name="company" value={form.company} onChange={updateField} autoComplete="organization" placeholder="선택 입력" /></label>
        <label><span>담당자 이름 <b aria-hidden="true">*</b></span><input name="contactName" value={form.contactName} onChange={updateField} autoComplete="name" aria-invalid={Boolean(errors.contactName)} aria-describedby={errors.contactName ? 'contact-name-error' : undefined} /></label>
      </div>
      {errors.contactName ? <p className="agency-contact__error" id="contact-name-error">{errors.contactName}</p> : null}

      <div className="agency-contact__row">
        <label><span>이메일</span><input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" inputMode="email" aria-invalid={Boolean(errors.email || errors.contact)} aria-describedby={contactError ? 'contact-channel-error' : undefined} placeholder="둘 중 하나 이상" /></label>
        <label><span>연락처</span><input type="tel" name="phone" value={form.phone} onChange={updateField} autoComplete="tel" inputMode="tel" aria-invalid={Boolean(errors.phone || errors.contact)} aria-describedby={contactError ? 'contact-channel-error' : undefined} placeholder="둘 중 하나 이상" /></label>
      </div>
      {contactError ? <p className="agency-contact__error" id="contact-channel-error">{contactError}</p> : null}

      <label><span>현재 웹사이트</span><input type="url" name="website" value={form.website} onChange={updateField} inputMode="url" placeholder="주소가 있다면 입력해 주세요" /></label>

      <div className="agency-contact__row">
        <label><span>예상 예산</span><select name="budget" value={form.budget} onChange={updateField}><option value="">선택해 주세요</option>{BUDGETS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>공개 희망 시기</span><input name="timeline" value={form.timeline} onChange={updateField} placeholder="예: 2026년 12월" /></label>
      </div>

      <label><span>문의 내용 <b aria-hidden="true">*</b></span><textarea name="details" value={form.details} onChange={updateField} rows="6" maxLength="4000" aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? 'contact-details-error' : undefined} placeholder="필요한 페이지, 기능, 참고 사이트, 현재 고민을 자유롭게 적어 주세요." /></label>
      {errors.details ? <p className="agency-contact__error" id="contact-details-error">{errors.details}</p> : null}

      <div className="agency-contact__consent">
        <label className="agency-contact__privacy">
          <input type="checkbox" name="privacy" checked={form.privacy} onChange={updateField} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? 'contact-privacy-error' : 'contact-privacy-help'} />
          <span><strong>개인정보 수집·이용에 동의합니다. <em>(필수)</em></strong><small id="contact-privacy-help">{AGENCY_CONFIG.inquiryEnabled ? '아래 안내를 확인해 주세요. 상담 확인과 회신에만 사용합니다.' : '현재는 서버로 전송하지 않으며, 저장 버튼을 누르면 입력 내용이 내 기기에만 내려받아집니다.'}</small></span>
        </label>
        <details className="agency-contact__terms">
          <summary>수집·이용 안내 보기</summary>
          <dl>{INQUIRY_CONSENT.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl>
          <a href={withBasePath('/privacy')} target="_blank" rel="noopener">개인정보 처리방침 전문 보기 ↗</a>
        </details>
      </div>
      {errors.privacy ? <p className="agency-contact__error" id="contact-privacy-error">{errors.privacy}</p> : null}

      <div className="agency-contact__actions">
        <button ref={submitButtonRef} type="submit" disabled={state.type === 'pending'}>{state.type === 'pending' ? '접수 중입니다' : AGENCY_CONFIG.inquiryEnabled ? '제작 상담 접수' : '상담 내용 저장'}</button>
        <p id="contact-form-status" role="status" aria-live="polite" className={`agency-contact__status is-${state.type}`}>{state.message}</p>
      </div>
    </form>

    <dialog ref={dialogRef} className="agency-contact__dialog" aria-labelledby="contact-result-title" onCancel={(event) => { event.preventDefault(); closeDialog(); }} onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }}>
      <div>
        <span className="eyebrow">상담 접수</span>
        <h3 id="contact-result-title">{state.type === 'duplicate' ? '이미 접수된 내용입니다.' : '문의가 접수되었습니다.'}</h3>
        {state.type === 'success' ? (
          <ol className="contact-log" aria-hidden="true">
            <li>$ nanaweb inquiry submit</li>
            <li>✓ 입력 내용 확인</li>
            <li>✓ 담당자에게 알림 전송</li>
            {state.id ? <li>✓ 접수 번호 NW-{state.id.slice(0, 6).toUpperCase()}</li> : null}
            <li className="contact-log__done">● 접수 완료</li>
          </ol>
        ) : null}
        <p>{state.message}</p>
        <button ref={closeButtonRef} type="button" onClick={closeDialog}>확인하고 닫기</button>
      </div>
    </dialog>
  </section>;
}

export default ContactSection;
