import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, Calculator, Check, UserRound } from 'lucide-react';
import { Link } from '../_kit/SiteProvider.jsx';
import { resolvePhoto } from '../_kit/media.js';
import { CASES, CORP_TAX, DEADLINES, FAQS, INCOME_TAX, LEGAL, NOTICES, PEOPLE_PHOTOS, REPORT, TRUST } from './content.js';

// 만원 단위 숫자를 "1억 2,000만 원"처럼 읽기 쉽게 바꿉니다.
const won = (manwon) => {
  const value = Math.round(manwon);
  const eok = Math.floor(value / 10000);
  const rest = value % 10000;
  if (!eok) return `${rest.toLocaleString('ko-KR')}만 원`;
  return rest ? `${eok}억 ${rest.toLocaleString('ko-KR')}만 원` : `${eok}억 원`;
};

// ───────── 히어로: 코드로 그린 월별 손익 리포트 ─────────
export function ReportCard() {
  const max = Math.max(...REPORT.map(([, sales]) => sales));
  const profit = REPORT.map(([, sales, cost]) => sales - cost);
  const pMax = Math.max(...profit);
  const points = profit.map((value, index) => `${8 + index * 16.8},${88 - (value / pMax) * 60}`).join(' ');
  const total = profit.reduce((sum, value) => sum + value, 0);
  return (
    <figure className="dt-report" aria-label="월별 손익 리포트 예시">
      <figcaption>
        <span>월별 손익 리포트 <small>예시</small></span>
        <b>상반기 순이익 {won(total)}</b>
      </figcaption>
      <div className="dt-report__chart">
        <div className="dt-report__bars">
          {REPORT.map(([month, sales, cost], index) => (
            <div key={month} className="dt-report__col" style={{ '--i': index }}>
              <i className="is-sales" style={{ height: `${(sales / max) * 100}%` }} />
              <i className="is-cost" style={{ height: `${(cost / max) * 100}%` }} />
              <span>{month}</span>
            </div>
          ))}
        </div>
        <svg className="dt-report__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} /></svg>
      </div>
      <ul className="dt-report__legend"><li className="is-sales">매출</li><li className="is-cost">비용</li><li className="is-profit">순이익</li></ul>
      <p className="dt-report__tip"><Check size={14} aria-hidden="true" /> 6월 예상 부가세 미리 안내 완료</p>
    </figure>
  );
}

// ───────── 신뢰 숫자 ─────────
export function TrustBand() {
  return (
    <ul className="dt-trust">
      {TRUST.map(([value, unit, label], index) => <li key={label} data-reveal style={{ '--d': `${index * 80}ms` }}><b>{value}<small>{unit}</small></b><span>{label}</span></li>)}
    </ul>
  );
}

// ───────── 대표 연출: 개인 vs 법인 세금 비교 계산기 ─────────
const bracketTax = (table, base) => {
  const [, rate, deduct] = table.find(([limit]) => base <= limit);
  return Math.max(0, base * rate - deduct);
};

export function TaxSimulator() {
  const [profit, setProfit] = useState(12000);
  const personal = bracketTax(INCOME_TAX, Math.max(0, profit - 150)) * 1.1;
  const corp = bracketTax(CORP_TAX, profit) * 1.1;
  const max = Math.max(personal, corp, 1);
  const diff = personal - corp;
  return (
    <div className="dt-sim" data-reveal>
      <div className="dt-sim__input">
        <p className="dt-kicker dt-kicker--light"><Calculator size={16} aria-hidden="true" /> 개인 vs 법인 비교 계산기</p>
        <h2>올해 이익이 이 정도라면,<br />세금은 얼마나 다를까요?</h2>
        <label htmlFor="dt-profit">연간 사업 이익 (매출 − 비용)</label>
        <output htmlFor="dt-profit" className="dt-sim__value">{won(profit)}</output>
        <input id="dt-profit" type="range" min="2000" max="50000" step="500" value={profit} onChange={(event) => setProfit(Number(event.target.value))} style={{ '--p': `${((profit - 2000) / 48000) * 100}%` }} />
        <div className="dt-sim__presets">
          {[5000, 12000, 25000, 40000].map((value) => <button key={value} type="button" aria-pressed={profit === value} onClick={() => setProfit(value)}>{value >= 10000 ? `${value / 10000}억` : `${value / 1000}천만`}</button>)}
        </div>
      </div>
      <div className="dt-sim__result" aria-live="polite">
        <div className="dt-sim__row">
          <p><UserRound size={18} aria-hidden="true" /> 개인사업자 <small>종합소득세 + 지방세</small></p>
          <div className="dt-sim__bar"><i className="is-personal" style={{ width: `${(personal / max) * 100}%` }} /></div>
          <b>{won(personal)} <small>실효 {((personal / profit) * 100).toFixed(1)}%</small></b>
        </div>
        <div className="dt-sim__row">
          <p><Building2 size={18} aria-hidden="true" /> 법인 <small>법인세 + 지방세</small></p>
          <div className="dt-sim__bar"><i className="is-corp" style={{ width: `${(corp / max) * 100}%` }} /></div>
          <b>{won(corp)} <small>실효 {((corp / profit) * 100).toFixed(1)}%</small></b>
        </div>
        <p className="dt-sim__msg">
          {diff > 300
            ? <>지금 이익이면 법인이 약 <strong>{won(diff)}</strong> 적게 나옵니다. 다만 법인 돈을 대표가 가져갈 때 급여·배당 세금이 더해지니, 상담에서 실제 숫자로 비교해 드려요.</>
            : <>이 이익 규모에서는 차이가 크지 않거나 개인사업자가 유리합니다. 장부 정리와 공제만 잘 챙겨도 세금을 줄일 수 있어요.</>}
        </p>
        <Link to="contact" className="dt-btn dt-btn--gold">내 숫자로 정확히 비교받기 <ArrowRight size={18} aria-hidden="true" /></Link>
        <p className="dt-sim__note">2024년 귀속 세율로 단순 계산한 예시입니다. 공제·감면과 대표 급여·배당은 반영하지 않았습니다.</p>
      </div>
    </div>
  );
}

// ───────── 세무 캘린더 (1년 신고 일정) ─────────
export function TaxCalendar() {
  const now = new Date().getMonth() + 1;
  return (
    <div className="dt-cal" data-reveal>
      {Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const items = DEADLINES.filter((item) => item.month === month);
        return (
          <div key={month} className={`dt-cal__month${month === now ? ' is-now' : ''}${items.length ? ' has-item' : ''}`}>
            <span className="dt-cal__label">{month}월{month === now ? <em>이번 달</em> : null}</span>
            <ul>
              {items.map((item) => <li key={item.name + item.who}><b>{item.day}일</b>{item.name}</li>)}
              <li className="is-monthly"><b>10일</b>원천세</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ───────── 구성원 ─────────
export function TeamCard({ person, full = false }) {
  const { src, alt } = resolvePhoto('dasom-tax', PEOPLE_PHOTOS[person.id]);
  return (
    <article className="dt-person" data-reveal>
      <div className="dt-person__photo">{src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null}<span>{person.role}</span></div>
      <div className="dt-person__body">
        <h3>{person.name} <small>{person.role}</small></h3>
        <p className="dt-person__words">“{person.words}”</p>
        <ul className="dt-person__focus">{person.focus.map((item) => <li key={item}>{item}</li>)}</ul>
        {full ? <ul className="dt-person__career">{person.career.map((line) => <li key={line}>{line}</li>)}</ul> : null}
      </div>
    </article>
  );
}

// ───────── 고객 사례 ─────────
export function CaseList() {
  return (
    <>
      <div className="dt-cases">
        {CASES.map((item, index) => (
          <article key={item.title} className="dt-case" data-reveal style={{ '--d': `${index * 90}ms` }}>
            <p className="dt-case__tag">{item.tag}</p>
            <h3>{item.title}</h3>
            <dl><div><dt>Before</dt><dd>{item.before}</dd></div><div><dt>After</dt><dd>{item.after}</dd></div></dl>
            <p className="dt-case__result">{item.result}</p>
          </article>
        ))}
      </div>
      <p className="dt-fine">※ 가상의 사례를 익명으로 요약했습니다. 절세 효과는 사업자마다 다릅니다.</p>
    </>
  );
}

// ───────── FAQ · 공지 ─────────
export function FaqList({ items = FAQS }) {
  return <div className="dt-faq">{items.map(([question, answer]) => <details key={question} data-reveal><summary>{question}</summary><p>{answer}</p></details>)}</div>;
}

export function NoticeList({ items = NOTICES, compact = false }) {
  return (
    <ul className={`dt-notices${compact ? ' is-compact' : ''}`}>
      {items.map((notice) => (
        <li key={notice.id} data-reveal>
          <Link to={`notice/${notice.id}`}><span className="dt-notices__tag">{notice.tag}</span><b>{notice.title}</b>{compact ? null : <p>{notice.summary}</p>}<time>{notice.date}</time></Link>
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
    <div className="dt-article">
      {notice.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <nav className="dt-article__nav" aria-label="이전·다음 공지">
        {next ? <Link to={`notice/${next.id}`}><small>다음 글</small>{next.title}</Link> : <span />}
        {prev ? <Link to={`notice/${prev.id}`}><small>이전 글</small>{prev.title}</Link> : <span />}
      </nav>
      <Link to="notice" className="dt-textlink">목록으로 <ArrowRight size={16} aria-hidden="true" /></Link>
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
  const titles = { terms: '이용약관 (예시)', privacy: '개인정보 처리방침 (예시)', ad: '사례·계산기 안내 (예시)' };
  return (
    <dialog ref={ref} className="dt-dialog" onClose={onClose} aria-labelledby="dt-legal-title">
      <div>
        <h2 id="dt-legal-title">{titles[kind] || ''}</h2>
        {kind ? LEGAL[kind].map((line) => <p key={line}>{line}</p>) : null}
        <button type="button" className="dt-btn dt-btn--sm" onClick={onClose}>닫기</button>
      </div>
    </dialog>
  );
}
