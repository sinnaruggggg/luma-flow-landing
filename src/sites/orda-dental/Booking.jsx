import { useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { HOURS, TREATMENTS } from './content.js';

// 시안용 예약 흐름: 진료 선택 → 날짜 → 시간 → 정보 → 확인. 실제로 예약되지 않습니다.
const STEPS = ['진료 선택', '날짜', '시간', '예약자 정보', '확인'];
const WEEK = ['월', '화', '수', '목', '금', '토', '일'];
const pad = (value) => String(value).padStart(2, '0');
const keyOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const labelOf = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일 (${'일월화수목금토'[date.getDay()]})`;

// 오늘 이후 4주 달력 (월요일 시작)
function buildDays() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);
  const first = new Date(start);
  first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    const inRange = date >= start && (date - start) / 86400000 < 28;
    return { date, key: keyOf(date), inRange, closed: date.getDay() === 0 };
  });
}

// 요일별 진료 가능 시간. 일부는 '마감'으로 보여 줍니다 (날짜로 정해지는 가짜 예약 현황).
function slotsFor(date) {
  const day = date.getDay();
  const base = day === 6 ? ['09:30', '10:30', '11:30', '12:30'] : ['09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00'];
  const all = day === 4 ? [...base, '18:30', '19:30'] : base;
  return all.map((time, index) => ({ time, full: (date.getDate() * 7 + index * 3) % 5 === 0 }));
}

export function Booking({ initialTreatment = '' }) {
  const [step, setStep] = useState(initialTreatment ? 1 : 0);
  const [treatment, setTreatment] = useState(initialTreatment);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState('');
  const [info, setInfo] = useState({ name: '', phone: '', first: 'yes', memo: '', agree: false });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const panel = useRef(null);
  const [days] = useState(buildDays);
  const selected = TREATMENTS.find((item) => item.slug === treatment);

  const valid = [Boolean(treatment), Boolean(day), Boolean(time), true, true][step];
  const go = (next) => {
    if (step === 3 && next > 3) {
      const nextErrors = {};
      if (!info.name.trim()) nextErrors.name = '성함을 입력해 주세요.';
      if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(info.phone.trim())) nextErrors.phone = '휴대폰 번호를 확인해 주세요. (예: 010-1234-5678)';
      if (!info.agree) nextErrors.agree = '개인정보 수집에 동의해 주세요.';
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        panel.current?.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
    }
    setStep(next);
    requestAnimationFrame(() => panel.current?.querySelector('h3')?.focus());
  };
  const updateInfo = (event) => {
    const { name, value, type, checked } = event.target;
    setInfo((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  if (done) {
    return (
      <div className="od-booking od-booking--done" role="status">
        <span className="od-done-icon"><Check size={30} aria-hidden="true" /></span>
        <h3>예약 요청이 정리되었습니다.</h3>
        <p>{labelOf(day.date)} {time} · {selected.title}</p>
        <p className="od-note">※ 이 사이트는 시안이므로 실제로 예약되지 않으며 문자도 발송되지 않습니다.</p>
        <button type="button" className="od-btn od-btn--line" onClick={() => { setDone(false); setStep(0); setTreatment(''); setDay(null); setTime(''); }}>처음부터 다시 해보기</button>
      </div>
    );
  }

  return (
    <div className="od-booking">
      <ol className="od-stepper" aria-label="예약 단계">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? 'is-current' : index < step ? 'is-done' : ''} aria-current={index === step ? 'step' : undefined}>
            <span>{index < step ? <Check size={14} aria-hidden="true" /> : index + 1}</span>{label}
          </li>
        ))}
      </ol>

      <div className="od-booking__panel" ref={panel}>
        {step === 0 ? (
          <>
            <h3 tabIndex={-1}>어떤 진료가 필요하신가요?</h3>
            <div className="od-choices">
              {TREATMENTS.map((item) => (
                <button key={item.slug} type="button" aria-pressed={treatment === item.slug} onClick={() => setTreatment(item.slug)}>
                  <b>{item.title}</b><span>{item.short} · 약 {item.minutes}분</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <h3 tabIndex={-1}>방문하실 날짜를 골라 주세요.</h3>
            <p className="od-hint">일요일·공휴일은 휴진, 목요일은 21시까지 야간 진료합니다.</p>
            <div className="od-calendar" role="grid" aria-label="예약 가능 날짜">
              {WEEK.map((label) => <span key={label} className="od-calendar__head" role="columnheader">{label}</span>)}
              {days.map((item) => {
                const disabled = !item.inRange || item.closed;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="gridcell"
                    disabled={disabled}
                    aria-pressed={day?.key === item.key}
                    aria-label={`${labelOf(item.date)}${item.closed ? ' 휴진' : ''}`}
                    className={`${item.date.getDate() === 1 ? 'is-month ' : ''}${item.date.getDay() === 4 ? 'is-night' : ''}`}
                    onClick={() => { setDay(item); setTime(''); }}
                  >
                    {item.date.getDate() === 1 ? <small>{item.date.getMonth() + 1}월</small> : null}
                    {item.date.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {step === 2 && day ? (
          <>
            <h3 tabIndex={-1}>{labelOf(day.date)}, 몇 시가 편하세요?</h3>
            <p className="od-hint">{HOURS[day.date.getDay()].time}{HOURS[day.date.getDay()].note ? ` · ${HOURS[day.date.getDay()].note}` : ''}</p>
            <div className="od-slots">
              {slotsFor(day.date).map((slot) => (
                <button key={slot.time} type="button" disabled={slot.full} aria-pressed={time === slot.time} onClick={() => setTime(slot.time)}>
                  {slot.time}{slot.full ? <small>마감</small> : null}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h3 tabIndex={-1}>예약하시는 분의 정보를 알려 주세요.</h3>
            <div className="od-fields">
              <label>성함<input name="name" value={info.name} onChange={updateInfo} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby="od-err-name" /></label>
              {errors.name ? <p className="od-error" id="od-err-name">{errors.name}</p> : null}
              <label>휴대폰 번호<input name="phone" inputMode="tel" placeholder="010-0000-0000" value={info.phone} onChange={updateInfo} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby="od-err-phone" /></label>
              {errors.phone ? <p className="od-error" id="od-err-phone">{errors.phone}</p> : null}
              <fieldset className="od-toggle">
                <legend>오르다치과는 처음이신가요?</legend>
                {[['yes', '처음이에요'], ['no', '다녀본 적 있어요']].map(([value, label]) => (
                  <label key={value} className={info.first === value ? 'is-on' : ''}><input type="radio" name="first" value={value} checked={info.first === value} onChange={updateInfo} />{label}</label>
                ))}
              </fieldset>
              <label>불편한 곳 (선택)<textarea name="memo" rows={3} value={info.memo} onChange={updateInfo} placeholder="예: 왼쪽 아래 어금니가 찬 물에 시려요" /></label>
              <label className="od-agree"><input type="checkbox" name="agree" checked={info.agree} onChange={updateInfo} aria-invalid={Boolean(errors.agree)} aria-describedby="od-err-agree" /><span>예약 확인을 위한 개인정보(성함, 연락처) 수집·이용에 동의합니다.</span></label>
              {errors.agree ? <p className="od-error" id="od-err-agree">{errors.agree}</p> : null}
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h3 tabIndex={-1}>이대로 예약할까요?</h3>
            <dl className="od-summary">
              <div><dt>진료</dt><dd>{selected?.title} (약 {selected?.minutes}분)</dd></div>
              <div><dt>일시</dt><dd>{labelOf(day.date)} {time}</dd></div>
              <div><dt>예약자</dt><dd>{info.name} · {info.phone}</dd></div>
              <div><dt>구분</dt><dd>{info.first === 'yes' ? '첫 방문 (10분 일찍 와 주세요)' : '재방문'}</dd></div>
            </dl>
          </>
        ) : null}
      </div>

      <div className="od-booking__nav">
        <button type="button" className="od-btn od-btn--line" onClick={() => go(step - 1)} disabled={step === 0}><ChevronLeft size={18} aria-hidden="true" /> 이전</button>
        {step < 4 ? (
          <button type="button" className="od-btn" onClick={() => go(step + 1)} disabled={!valid}>다음 <ChevronRight size={18} aria-hidden="true" /></button>
        ) : (
          <button type="button" className="od-btn" onClick={() => setDone(true)}>예약 요청하기</button>
        )}
      </div>
    </div>
  );
}

export default Booking;
