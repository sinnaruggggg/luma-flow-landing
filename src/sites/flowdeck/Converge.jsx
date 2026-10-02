import { useEffect, useRef } from 'react';
import { FileSpreadsheet, Mail, MessageSquare, Phone } from 'lucide-react';
import { CONVERGE } from './content.js';

// 플로우덱 대표 장면: 여기저기 흩어진 요청(메신저·메일·시트)이 스크롤하면 하나씩 보드의 칸으로 날아와 카드가 됩니다.
const SOURCE_ICONS = { chat: MessageSquare, mail: Mail, sheet: FileSpreadsheet, phone: Phone };
// 흩어진 시작 위치 (무대 가로·세로 비율, 회전 각도)
const SCATTER = [[0.06, 0.16, -9], [0.62, 0.08, 7], [0.36, 0.62, -5], [0.72, 0.48, 10], [0.12, 0.7, 6], [0.48, 0.3, -12], [0.78, 0.78, -6]];
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const ease = (t) => 1 - Math.pow(1 - t, 3);

export function Converge() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const countRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let size = { w: 0, h: 0, cardW: 0, rowH: 84 };
    const rowsPerCol = [0, 0, 0];
    const targets = CONVERGE.items.map(([, , , col]) => { const row = rowsPerCol[col]; rowsPerCol[col] += 1; return { col, row }; });

    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const tallest = Math.max(60, ...itemRefs.current.map((node) => node?.offsetHeight ?? 0));
      size = { w, h, cardW: Math.min(260, w * 0.3), rowH: tallest + 42 }; // 카드가 되면 팀·배정 줄이 붙어 키가 커지므로 여유를 둡니다.
    };
    const paint = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, root.offsetHeight - window.innerHeight);
      const p = reduced ? 1 : clamp01(-rect.top / total);
      root.style.setProperty('--p', p.toFixed(3));
      const colW = size.w / 3;
      let settled = 0;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        const [sx, sy, rot] = SCATTER[index % SCATTER.length];
        const { col, row } = targets[index];
        const t = ease(clamp01((p - 0.12 - index * 0.07) / 0.38));
        const x0 = sx * (size.w - size.cardW);
        const y0 = sy * (size.h - 70);
        const x1 = col * colW + (colW - size.cardW) / 2;
        const y1 = 44 + row * size.rowH;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t;
        const r = rot * (1 - t);
        node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg)`;
        node.toggleAttribute('data-card', t > 0.55);
        if (t > 0.98) settled += 1;
      });
      if (countRef.current) countRef.current.textContent = `${settled} / ${CONVERGE.items.length}`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const onResize = () => { measure(); paint(); };
    measure();
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="fd-converge" ref={rootRef} aria-labelledby="fd-converge-title">
      <div className="fd-converge__sticky">
        <div className="fd-wrap">
          <div className="fd-converge__head">
            <p className="fd-kicker">한눈에 보는 플로우덱</p>
            <h2 id="fd-converge-title"><span className="fd-converge__before">{CONVERGE.before}</span><span className="fd-converge__after">{CONVERGE.after}</span></h2>
            <p className="fd-converge__count" aria-hidden="true">정리된 요청 <b ref={countRef}>0 / {CONVERGE.items.length}</b></p>
          </div>
          <div className="fd-converge__stage" ref={stageRef}>
            <div className="fd-converge__board" aria-hidden="true">
              {CONVERGE.columns.map((label) => <div key={label}><span>{label}</span></div>)}
            </div>
            <ul className="fd-converge__items">
              {CONVERGE.items.map(([source, sourceLabel, text, , team, urgent], index) => {
                const Icon = SOURCE_ICONS[source];
                return (
                  <li key={text} ref={(node) => { itemRefs.current[index] = node; }} className={`fd-req fd-req--${source}`}>
                    <span className="fd-req__source"><Icon size={14} aria-hidden="true" />{sourceLabel}</span>
                    <p>{text}</p>
                    <span className="fd-req__meta">{urgent ? <em>긴급</em> : null}<b>{team}</b><i>자동 배정됨</i></span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Converge;
