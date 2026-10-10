// 오르다치과 장식 요소: 반짝이는 치아 일러스트, 진료별 아이콘, 흐르는 띠, 반짝이
// 모두 SVG로 그려서 이미지 파일 없이 색만 바꿔 쓸 수 있습니다.

const TOOTH = 'M50 8c-9 0-14 5-22 5S12 8 7 14c-6 8-4 24 1 36 4 10 5 22 8 34 2 8 5 12 9 12 6 0 7-10 9-20 2-9 5-15 16-15s14 6 16 15c2 10 3 20 9 20 4 0 7-4 9-12 3-12 4-24 8-34 5-12 7-28 1-36-5-6-13-1-21-1S59 8 50 8Z';

export function Sparkle({ className = '', size = 24 }) {
  return (
    <svg className={`od-sparkle ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.8 6.5 4.7 10.4 12 12-7.3 1.6-11.2 5.5-12 12-.8-6.5-4.7-10.4-12-12C7.3 10.4 11.2 6.5 12 0Z" fill="currentColor" />
    </svg>
  );
}

// 히어로의 큰 치아: 광택 그라데이션 + 웃는 얼굴 + 반짝이
export function HeroTooth() {
  return (
    <div className="od-herotooth" aria-hidden="true">
      <svg viewBox="0 0 100 112">
        <defs>
          <linearGradient id="od-tooth-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".6" stopColor="#eefbf9" />
            <stop offset="1" stopColor="#c9efe9" />
          </linearGradient>
        </defs>
        <path d={TOOTH} fill="url(#od-tooth-g)" stroke="#0b6e6a" strokeWidth="2.2" />
        <path d="M24 22c3-5 9-7 14-6" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <circle cx="38" cy="44" r="3.2" fill="#0b4f4c" />
        <circle cx="62" cy="44" r="3.2" fill="#0b4f4c" />
        <path d="M40 54c5 6 15 6 20 0" fill="none" stroke="#0b4f4c" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="31" cy="53" r="4" fill="#ff8a7a" opacity=".45" />
        <circle cx="69" cy="53" r="4" fill="#ff8a7a" opacity=".45" />
      </svg>
      <Sparkle className="s1" size={30} />
      <Sparkle className="s2" size={18} />
      <Sparkle className="s3" size={22} />
    </div>
  );
}

// 위로 떠오르는 거품 (히어로·CTA 배경)
export function Bubbles({ count = 10 }) {
  return (
    <div className="od-bubbles" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} style={{ '--x': `${(index * 37) % 100}%`, '--s': `${10 + ((index * 13) % 26)}px`, '--t': `${7 + ((index * 5) % 8)}s`, '--d': `${(index * 0.9) % 6}s` }} />)}
    </div>
  );
}

// 진료별 아이콘 일러스트
const ICONS = {
  checkup: (
    <>
      <path d={TOOTH} transform="translate(14 14) scale(.72)" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <circle cx="78" cy="30" r="14" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <path d="M88 40l12 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  cavity: (
    <>
      <path d={TOOTH} transform="translate(14 10) scale(.72)" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <circle cx="44" cy="34" r="6" fill="#3a4a46" opacity=".55" />
      <path d="M70 70l16-16M78 78l16-16" stroke="#ff8a7a" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  root: (
    <>
      <path d={TOOTH} transform="translate(14 8) scale(.72)" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <path d="M42 50c0 14-4 24-6 32M58 50c0 14 4 24 6 32" fill="none" stroke="#ff8a7a" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  implant: (
    <>
      <path d="M26 30c0-10 8-16 24-16s24 6 24 16c0 8-6 12-24 12S26 38 26 30Z" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <rect x="40" y="44" width="20" height="8" rx="2" fill="currentColor" />
      <path d="M42 56h16l-2 8H44zM43 68h14l-2 8H45zM44 80h12l-6 12z" fill="currentColor" opacity=".75" />
    </>
  ),
  ortho: (
    <>
      <path d={TOOTH} transform="translate(4 18) scale(.46)" fill="#fff" stroke="currentColor" strokeWidth="4" />
      <path d={TOOTH} transform="translate(39 18) scale(.46)" fill="#fff" stroke="currentColor" strokeWidth="4" />
      <path d="M10 42h80" stroke="#ff8a7a" strokeWidth="3" />
      <rect x="20" y="37" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="56" y="37" width="10" height="10" rx="2" fill="currentColor" />
    </>
  ),
  kids: (
    <>
      <path d={TOOTH} transform="translate(14 12) scale(.72)" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <circle cx="40" cy="38" r="3" fill="currentColor" />
      <circle cx="60" cy="38" r="3" fill="currentColor" />
      <path d="M42 48c4 5 12 5 16 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 14l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#ffc94d" />
    </>
  ),
};

export function TreatIcon({ slug }) {
  return <svg className="od-treaticon" viewBox="0 0 100 100" aria-hidden="true">{ICONS[slug] || ICONS.checkup}</svg>;
}

// 흐르는 띠 (진료 키워드)
const WORDS = ['검진·스케일링', 'SMILE', '충치 치료', 'CARE', '신경 치료', 'FRESH', '임플란트', 'CLEAN', '교정', 'GENTLE', '소아 치과', 'BRIGHT'];
export function Marquee() {
  const row = WORDS.map((word, index) => <span key={`${word}-${index}`}>{word}<Sparkle size={16} /></span>);
  return (
    <div className="od-marquee" aria-hidden="true">
      <div className="od-marquee__track">{row}{row}</div>
    </div>
  );
}

// 숫자로 보는 오르다
const NUMBERS = Object.freeze([
  ['3', '명', '분야별 전문의'],
  ['6', '실', '1인 1진료실'],
  ['21', '시', '목요일 야간 진료'],
  ['2', '분', '○○역에서 도보'],
]);

export function NumberBand() {
  return (
    <ul className="od-numbers">
      {NUMBERS.map(([value, unit, label], index) => (
        <li key={label} data-reveal style={{ '--d': `${index * 80}ms` }}>
          <b>{value}<small>{unit}</small></b>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
