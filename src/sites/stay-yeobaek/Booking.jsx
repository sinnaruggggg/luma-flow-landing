import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { EXTRA_GUEST, OPTIONS, ROOMS } from './content.js';

// 시안용 숙박 예약: 객실 → 체크인·체크아웃 범위 → 인원·옵션 → 예약자 정보. 실제로 예약되지 않습니다.
const DAY = 86400000;
const pad = (value) => String(value).padStart(2, '0');
const keyOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromKey = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
const label = (key) => { const date = fromKey(key); return `${date.getMonth() + 1}.${pad(date.getDate())} (${'일월화수목금토'[date.getDay()]})`; };
const won = (value) => `${value.toLocaleString('ko-KR')}원`;
const isWeekendNight = (date) => date.getDay() === 5 || date.getDay() === 6;

function today0() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

// 객실마다 이미 찬 날짜 (날짜로 정해지는 가짜 예약 현황)
function isBooked(roomIndex, date) {
  const seed = date.getDate() + date.getMonth() * 31 + roomIndex * 5;
  return seed % 9 === 0 || seed % 13 === 0;
}

function monthDays(year, month) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, index) => new Date(year, month, index + 1))];
}

export function Booking({ initialRoom = '' }) {
  const [roomSlug, setRoomSlug] = useState(initialRoom || ROOMS[0].slug);
  const [range, setRange] = useState({ in: '', out: '' });
  const [offset, setOffset] = useState(0);
  const [adults, setAdults] = useState(2);
  const [options, setOptions] = useState({});
  const [stage, setStage] = useState('select');
  const [form, setForm] = useState({ name: '', phone: '', request: '', agree: false });
  const [error, setError] = useState('');
  const [base] = useState(today0);

  const roomIndex = ROOMS.findIndex((room) => room.slug === roomSlug);
  const room = ROOMS[roomIndex];
  const minDate = new Date(base.getTime() + DAY);
  const maxDate = new Date(base.getTime() + 90 * DAY);

  const nights = [];
  if (range.in && range.out) {
    for (let time = fromKey(range.in).getTime(); time < fromKey(range.out).getTime(); time += DAY) nights.push(new Date(time));
  }
  const roomTotal = nights.reduce((sum, date) => sum + (isWeekendNight(date) ? room.weekend : room.weekday), 0);
  const extraTotal = Math.max(0, adults - room.base) * EXTRA_GUEST * nights.length;
  const optionTotal = OPTIONS.reduce((sum, option) => sum + (options[option.id] ? option.price * (option.unit === 'person' ? adults * nights.length : 1) : 0), 0);
  const total = roomTotal + extraTotal + optionTotal;

  const pickRoom = (slug) => {
    setRoomSlug(slug);
    setRange({ in: '', out: '' });
    setAdults((value) => Math.min(value, ROOMS.find((item) => item.slug === slug).max));
  };

  const pickDay = (date) => {
    const key = keyOf(date);
    if (!range.in || range.out || date <= fromKey(range.in)) {
      setRange({ in: key, out: '' });
      return;
    }
    // 사이에 이미 찬 날이 있으면 새로 시작
    for (let time = fromKey(range.in).getTime(); time < date.getTime(); time += DAY) {
      if (isBooked(roomIndex, new Date(time))) { setRange({ in: key, out: '' }); return; }
    }
    setRange({ in: range.in, out: key });
  };

  const month = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const months = [month, new Date(month.getFullYear(), month.getMonth() + 1, 1)];

  const submit = () => {
    if (!form.name.trim() || !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.trim()) || !form.agree) {
      setError('성함, 휴대폰 번호, 개인정보 동의를 확인해 주세요.');
      return;
    }
    setError('');
    setStage('done');
  };

  if (stage === 'done') {
    return (
      <div className="sy-done" role="status">
        <span><Check size={26} aria-hidden="true" /></span>
        <h3>{room.name}, {nights.length}박의 여백을 준비하겠습니다.</h3>
        <p>{label(range.in)} 체크인 — {label(range.out)} 체크아웃 · {adults}인 · 총 {won(total)}</p>
        <p className="sy-fine">※ 이 사이트는 시안이므로 실제로 예약·결제되지 않습니다.</p>
        <button type="button" className="sy-btn sy-btn--line" onClick={() => { setStage('select'); setRange({ in: '', out: '' }); }}>다른 날짜 보기</button>
      </div>
    );
  }

  return (
    <div className="sy-booking">
      <div className="sy-booking__main">
        {stage === 'select' ? (
          <>
            <fieldset className="sy-rooms">
              <legend>객실</legend>
              {ROOMS.map((item) => (
                <label key={item.slug} className={roomSlug === item.slug ? 'is-on' : ''}>
                  <input type="radio" name="room" value={item.slug} checked={roomSlug === item.slug} onChange={() => pickRoom(item.slug)} />
                  <b>{item.name}</b><small>{item.tagline} · 최대 {item.max}인</small><em>{won(item.weekday)}~</em>
                </label>
              ))}
            </fieldset>

            <div className="sy-cal">
              <div className="sy-cal__bar">
                <p>{range.in ? (range.out ? `${label(range.in)} → ${label(range.out)}` : '체크아웃 날짜를 선택하세요') : '체크인 날짜를 선택하세요'}</p>
                <div>
                  <button type="button" aria-label="이전 달" disabled={offset === 0} onClick={() => setOffset((value) => value - 1)}><ChevronLeft size={18} /></button>
                  <button type="button" aria-label="다음 달" disabled={offset >= 2} onClick={() => setOffset((value) => value + 1)}><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="sy-cal__months">
                {months.map((current) => (
                  <div key={keyOf(current)} className="sy-month">
                    <p className="sy-month__title">{current.getFullYear()}. {pad(current.getMonth() + 1)}</p>
                    <div className="sy-month__grid">
                      {['월', '화', '수', '목', '금', '토', '일'].map((name) => <span key={name} className="sy-month__head">{name}</span>)}
                      {monthDays(current.getFullYear(), current.getMonth()).map((date, index) => {
                        if (!date) return <span key={`blank-${index}`} />;
                        const key = keyOf(date);
                        const booked = isBooked(roomIndex, date);
                        const outOfRange = date < minDate || date > maxDate;
                        // 체크아웃 날은 그날 밤이 차 있어도 선택할 수 있습니다.
                        const canCheckout = range.in && !range.out && date > fromKey(range.in);
                        const disabled = outOfRange || (booked && !canCheckout);
                        const inRange = range.in && range.out && date > fromKey(range.in) && date < fromKey(range.out);
                        const edge = key === range.in || key === range.out;
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={disabled}
                            className={`${inRange ? 'is-range ' : ''}${edge ? 'is-edge ' : ''}${booked && !outOfRange ? 'is-booked' : ''}`}
                            aria-pressed={edge}
                            aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일${booked ? ' 예약 마감' : ''}`}
                            onClick={() => pickDay(date)}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="sy-legend"><i className="is-edge" />선택 <i className="is-booked" />예약 마감 · 금·토요일 밤은 주말 요금</p>
            </div>

            <div className="sy-extras">
              <div className="sy-stepper">
                <span>인원 <small>기준 {room.base}인 · 최대 {room.max}인</small></span>
                <div>
                  <button type="button" aria-label="인원 줄이기" disabled={adults <= 1} onClick={() => setAdults((value) => value - 1)}><Minus size={16} /></button>
                  <output aria-live="polite">{adults}</output>
                  <button type="button" aria-label="인원 늘리기" disabled={adults >= room.max} onClick={() => setAdults((value) => value + 1)}><Plus size={16} /></button>
                </div>
              </div>
              <fieldset className="sy-options">
                <legend>추가 옵션</legend>
                {OPTIONS.map((option) => (
                  <label key={option.id} className={options[option.id] ? 'is-on' : ''}>
                    <input type="checkbox" checked={Boolean(options[option.id])} onChange={(event) => setOptions((current) => ({ ...current, [option.id]: event.target.checked }))} />
                    {option.label}<small>{won(option.price)}{option.unit === 'person' ? ' / 1인 1박' : ''}</small>
                  </label>
                ))}
              </fieldset>
            </div>
          </>
        ) : (
          <div className="sy-form">
            <h3>예약자 정보</h3>
            <label>성함<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label>
            <label>휴대폰 번호<input value={form.phone} inputMode="tel" placeholder="010-0000-0000" onChange={(event) => setForm({ ...form, phone: event.target.value })} autoComplete="tel" /></label>
            <label>요청 사항 (선택)<textarea rows={3} value={form.request} onChange={(event) => setForm({ ...form, request: event.target.value })} placeholder="기념일, 도착 예정 시간 등을 남겨 주세요." /></label>
            <label className="sy-agree"><input type="checkbox" checked={form.agree} onChange={(event) => setForm({ ...form, agree: event.target.checked })} />예약을 위한 개인정보 수집·이용에 동의합니다.</label>
            {error ? <p className="sy-error" role="alert">{error}</p> : null}
          </div>
        )}
      </div>

      <aside className="sy-summary" aria-live="polite">
        <p className="sy-summary__room">{room.english}</p>
        <h3>{room.name}</h3>
        <dl>
          <div><dt>일정</dt><dd>{range.in && range.out ? `${label(range.in)} – ${label(range.out)} · ${nights.length}박` : '날짜를 선택하세요'}</dd></div>
          <div><dt>객실 요금</dt><dd>{won(roomTotal)}</dd></div>
          {extraTotal ? <div><dt>추가 인원</dt><dd>{won(extraTotal)}</dd></div> : null}
          {optionTotal ? <div><dt>옵션</dt><dd>{won(optionTotal)}</dd></div> : null}
        </dl>
        <p className="sy-summary__total"><span>합계</span><b>{won(total)}</b></p>
        {stage === 'select' ? (
          <button type="button" className="sy-btn" disabled={!nights.length} onClick={() => setStage('form')}>예약 정보 입력</button>
        ) : (
          <div className="sy-summary__actions">
            <button type="button" className="sy-btn" onClick={submit}>예약 요청하기</button>
            <button type="button" className="sy-btn sy-btn--line" onClick={() => setStage('select')}>날짜·옵션 수정</button>
          </div>
        )}
        <p className="sy-fine">체크인 15:00 · 체크아웃 11:00 · 전 객실 금연</p>
      </aside>
    </div>
  );
}

export default Booking;
