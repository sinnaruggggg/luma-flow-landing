// 견적 계산기 기능 카드용 선 아이콘 (24×24, 선 굵기 1.6). name 은 data/quote.js 의 icon 값.
const PATHS = {
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
  chat: 'M4 5h16v11H9l-5 4zM8 10h8M8 13h5',
  bot: 'M6 8h12v10H6zM12 4v4M9 12h.01M15 12h.01M9.5 15.5h5M3 12v3M21 12v3',
  board: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z',
  popup: 'M3 6h18v12H3zM7 9h10v6H7zM15.5 10.5l-1 1',
  person: 'M9 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 20c0-4 3-6 7-6s7 2 7 6M17 4l3 3',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M8 14h2M12 14h2M8 17h2',
  card: 'M3 6h18v12H3zM3 10h18M6 15h4',
  cart: 'M3 4h3l2.4 11h10.1L21 8H7M10 20h.01M17 20h.01',
  repeat: 'M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4',
  user: 'M8 8a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
  key: 'M14 4a6 6 0 1 1-4.3 10.2L4 20v-3h3v-3h3l.2-.3A6 6 0 0 1 14 4zM16 8h.01',
  ticket: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10',
  phone: 'M7 3h10v18H7zM11 18h2M16 6l3-2M17 9h3',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  globe: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18',
  chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
  camera: 'M4 7h4l2-2h4l2 2h4v12H4zM9 13a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  pen: 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
  move: 'M4 6h7v6H4zM13 12h7v6h-7zM11 9h4l-2-2M13 15H9l2 2',
  logo: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 8l4 2.2v4.6L12 17l-4-2.2v-4.6z',
  check: 'M5 12.5l4.5 4.5L19 7',
};

export function QuoteIcon({ name, size = 24 }) {
  return (
    <svg className="q-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name] ?? PATHS.check} />
    </svg>
  );
}

// 기본 구성 카드의 미니 도식 (한 장 / 여러 장 / 사이트맵 / 대시보드)
export function BaseDiagram({ id }) {
  if (id === 'landing') {
    return <svg className="q-diagram" viewBox="0 0 64 48" aria-hidden="true"><rect x="22" y="3" width="20" height="42" rx="1" /><path d="M25 8h14M25 13h14M25 18h9M25 24h14M25 30h14M25 36h9" /></svg>;
  }
  if (id === 'intro') {
    return <svg className="q-diagram" viewBox="0 0 64 48" aria-hidden="true"><rect x="6" y="10" width="15" height="28" rx="1" /><rect x="24.5" y="10" width="15" height="28" rx="1" /><rect x="43" y="10" width="15" height="28" rx="1" /><path d="M9 15h9M27.5 15h9M46 15h9M9 20h6M27.5 20h6M46 20h6" /></svg>;
  }
  if (id === 'brand') {
    return <svg className="q-diagram" viewBox="0 0 64 48" aria-hidden="true"><rect x="26" y="4" width="12" height="9" rx="1" /><path d="M32 13v6M12 19h40M12 19v5M32 19v5M52 19v5M8 24h8v7H8zM28 24h8v7h-8zM48 24h8v7h-8zM12 31v5M52 31v5" /><rect x="8" y="36" width="8" height="7" rx="1" /><rect x="48" y="36" width="8" height="7" rx="1" /></svg>;
  }
  return <svg className="q-diagram" viewBox="0 0 64 48" aria-hidden="true"><rect x="4" y="5" width="56" height="38" rx="2" /><path d="M4 12h56M15 12v31" /><path d="M20 18h16M20 23h10M41 18h14v10H41zM20 30h35M20 35h35" /></svg>;
}
