import { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from '../_kit/SiteProvider.jsx';
import { FAQS, FIRST_VISIT, INSURANCE, LEGAL, NOTICES, PRICES, SYMPTOMS, TREATMENTS } from './content.js';

// ───────── 대표 연출: 아픈 곳 콕 찍기 (치아 지도) ─────────
// 화면에서 보는 사람(의사) 시점: 위 왼쪽 = 환자의 오른쪽 위(1번대), 아래 왼쪽 = 환자의 오른쪽 아래(4번대)
const KIND = ['앞니', '앞니', '송곳니', '작은어금니', '작은어금니', '큰어금니', '큰어금니'];
const SIDE = { 1: '오른쪽 위', 2: '왼쪽 위', 3: '왼쪽 아래', 4: '오른쪽 아래' };
const ORDER_UP = [17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27];
const ORDER_DOWN = [47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37];
const toothName = (no) => `${SIDE[Math.floor(no / 10)]} ${KIND[(no % 10) - 1]} (${no}번)`;

function Arch({ order, upper, selected, onPick }) {
  return (
    <div className={`od-arch ${upper ? 'is-up' : 'is-down'}`}>
      {order.map((no, index) => {
        const theta = Math.PI * (1 - index / (order.length - 1));
        const x = 50 + 45 * Math.cos(theta);
        const y = upper ? 90 - 78 * Math.sin(theta) : 10 + 78 * Math.sin(theta);
        const rotate = (upper ? 90 : -90) - (theta * 180) / Math.PI;
        const size = no % 10 >= 6 ? 'lg' : no % 10 >= 4 ? 'md' : 'sm';
        return (
          <button
            key={no}
            type="button"
            className={`od-tooth is-${size}${selected === no ? ' is-on' : ''}`}
            style={{ left: `${x}%`, top: `${y}%`, '--r': `${rotate}deg` }}
            aria-pressed={selected === no}
            aria-label={toothName(no)}
            onClick={() => onPick(no)}
          />
        );
      })}
      <span className="od-arch__label" aria-hidden="true">{upper ? '위' : '아래'}</span>
    </div>
  );
}

export function ToothMap() {
  const [tooth, setTooth] = useState(null);
  const [symptomId, setSymptomId] = useState('');
  const symptom = SYMPTOMS.find((item) => item.id === symptomId);
  const treatment = symptom && TREATMENTS.find((item) => item.slug === symptom.treat);
  const reset = () => { setTooth(null); setSymptomId(''); };
  const pick = (no) => { setTooth(no); setSymptomId(''); };
  return (
    <div className="od-toothmap" data-reveal>
      <div className="od-toothmap__board">
        <p className="od-toothmap__hint">{tooth ? toothName(tooth) : '불편한 치아를 눌러 주세요'}</p>
        <Arch order={ORDER_UP} upper selected={tooth} onPick={pick} />
        <Arch order={ORDER_DOWN} selected={tooth} onPick={pick} />
        <p className="od-toothmap__side" aria-hidden="true"><span>환자 오른쪽</span><span>환자 왼쪽</span></p>
      </div>
      <div className="od-toothmap__panel" aria-live="polite">
        {!tooth ? (
          <div className="od-toothmap__empty">
            <p className="od-kicker">아픈 곳 콕 찍기</p>
            <h3>어디가, 어떻게 불편한지<br />알려 주시면 맞는 진료를 안내해요.</h3>
            <ol><li>왼쪽 치아 그림에서 불편한 곳을 누르고</li><li>증상을 고르면</li><li>맞는 진료와 예약 버튼이 나타나요</li></ol>
          </div>
        ) : null}
        {tooth && !symptom ? (
          <div>
            <p className="od-kicker">{toothName(tooth)}</p>
            <h3>어떻게 불편하세요?</h3>
            <div className="od-symptoms">
              {SYMPTOMS.map((item) => <button key={item.id} type="button" onClick={() => setSymptomId(item.id)}>{item.label}</button>)}
            </div>
            <button type="button" className="od-reset" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> 다른 치아 고르기</button>
          </div>
        ) : null}
        {treatment ? (
          <div className="od-toothmap__result">
            <p className="od-kicker">{toothName(tooth)} · {symptom.label}</p>
            <h3>{treatment.title} 진료를 권해요</h3>
            <p>{symptom.tip}</p>
            <dl>
              <div><dt>1회 진료</dt><dd>약 {treatment.minutes}분</dd></div>
              <div><dt>보험·비용</dt><dd>{treatment.note}</dd></div>
            </dl>
            <div className="od-toothmap__actions">
              <Link to={`booking/${treatment.slug}`} className="od-btn">{treatment.title} 예약하기 <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to={`care/${treatment.slug}`} className="od-textlink">진료 자세히 보기</Link>
              <button type="button" className="od-reset" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> 다시 찍기</button>
            </div>
            <p className="od-hint">참고용 안내이며, 정확한 진단은 내원 진료로 확인합니다.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ───────── 첫 방문 흐름 ─────────
export function FirstVisit() {
  const total = FIRST_VISIT.reduce((sum, [, , minutes]) => sum + minutes, 0);
  return (
    <>
      <ol className="od-visit">
        {FIRST_VISIT.map(([title, text, minutes], index) => (
          <li key={title} data-reveal style={{ '--d': `${index * 80}ms`, '--w': `${(minutes / total) * 100}%` }}>
            <span className="od-visit__no">{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <small>약 {minutes}분</small>
          </li>
        ))}
      </ol>
      <p className="od-visit__total" data-reveal>첫 방문은 보통 <b>{total}분</b> 정도 걸려요. 치료는 설명을 들은 뒤 원하시는 날에 해도 됩니다.</p>
    </>
  );
}

// ───────── 비용·보험 ─────────
export function PriceBlock() {
  return (
    <div className="od-prices">
      <div className="od-panel" data-reveal>
        <h2>건강보험 적용 진료</h2>
        <dl className="od-pricelist">{INSURANCE.map(([name, rule]) => <div key={name}><dt>{name}</dt><dd>{rule}</dd></div>)}</dl>
      </div>
      <div className="od-panel" data-reveal>
        <h2>비급여 진료비 <small>(가상 예시)</small></h2>
        <dl className="od-pricelist">{PRICES.map(([name, price]) => <div key={name}><dt>{name}</dt><dd>{price}</dd></div>)}</dl>
        <p className="od-hint">실제 금액은 검진 후 치아 상태에 따라 안내하며, 원내 게시 금액과 같습니다.</p>
      </div>
    </div>
  );
}

// ───────── FAQ · 공지 ─────────
export function FaqList({ items = FAQS }) {
  return <div className="od-faq">{items.map(([question, answer]) => <details key={question} data-reveal><summary>{question}</summary><p>{answer}</p></details>)}</div>;
}

export function NoticeList({ items = NOTICES, compact = false }) {
  return (
    <ul className={`od-notices${compact ? ' is-compact' : ''}`}>
      {items.map((notice) => (
        <li key={notice.id} data-reveal>
          <Link to={`notice/${notice.id}`}><span className="od-notices__tag">{notice.tag}</span><b>{notice.title}</b>{compact ? null : <p>{notice.summary}</p>}<time>{notice.date}</time></Link>
        </li>
      ))}
    </ul>
  );
}

export function NoticeDetail({ notice }) {
  const index = NOTICES.findIndex((item) => item.id === notice.id);
  const next = NOTICES[index - 1];
  const prev = NOTICES[index + 1];
  return (
    <div className="od-article">
      {notice.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <nav className="od-article__nav" aria-label="이전·다음 공지">
        {next ? <Link to={`notice/${next.id}`}><small>다음 글</small>{next.title}</Link> : <span />}
        {prev ? <Link to={`notice/${prev.id}`}><small>이전 글</small>{prev.title}</Link> : <span />}
      </nav>
      <Link to="notice" className="od-textlink">목록으로 <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  );
}

// ───────── 약관 팝업 ─────────
export function LegalDialog({ kind, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);
  const titles = { terms: '이용약관 (예시)', privacy: '개인정보 처리방침 (예시)', ad: '의료광고 고지 (예시)' };
  return (
    <dialog ref={ref} className="od-dialog" onClose={onClose} aria-labelledby="od-legal-title">
      <div>
        <h2 id="od-legal-title">{titles[kind] || ''}</h2>
        {kind ? LEGAL[kind].map((line) => <p key={line}>{line}</p>) : null}
        <button type="button" className="od-btn od-btn--sm" onClick={onClose}>닫기</button>
      </div>
    </dialog>
  );
}
