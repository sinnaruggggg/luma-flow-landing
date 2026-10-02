import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { ROUTINE } from './content.js';

// 무브랩 대표 장치: 30초 미니 루틴 타이머. 10초마다 동작이 바뀌고, 원형 게이지가 줄어듭니다.
const TOTAL = ROUTINE.moves.reduce((sum, move) => sum + move[3], 0) * 1000;

export function Routine() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const lastRef = useRef(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return undefined;
    let frame = 0;
    lastRef.current = performance.now();
    const tick = (now) => {
      elapsedRef.current = Math.min(TOTAL, elapsedRef.current + (now - lastRef.current));
      lastRef.current = now;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= TOTAL) { setRunning(false); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const done = elapsed >= TOTAL;
  let acc = 0;
  let index = 0;
  for (let i = 0; i < ROUTINE.moves.length; i += 1) {
    if (elapsed < acc + ROUTINE.moves[i][3] * 1000) { index = i; break; }
    acc += ROUTINE.moves[i][3] * 1000;
    index = i;
  }
  const [name, english, howTo, seconds] = ROUTINE.moves[index];
  const moveLeft = done ? 0 : Math.ceil((acc + seconds * 1000 - elapsed) / 1000);
  const totalLeft = Math.ceil((TOTAL - elapsed) / 1000);
  const progress = elapsed / TOTAL;

  const toggle = () => {
    if (done) { elapsedRef.current = 0; setElapsed(0); setRunning(true); return; }
    setRunning((value) => !value);
  };

  return (
    <section className="ml-routine" id="try" aria-labelledby="ml-routine-title">
      <div className="ml-wrap ml-routine__grid">
        <div className="ml-routine__copy">
          <p className="ml-kicker">{ROUTINE.kicker}</p>
          <h2 id="ml-routine-title">{ROUTINE.title}</h2>
          <p className="ml-routine__lead">{ROUTINE.lead}</p>
          <ol className="ml-routine__steps">
            {ROUTINE.moves.map(([moveName, , , sec], i) => (
              <li key={moveName} className={i === index && (running || elapsed > 0) && !done ? 'is-on' : i < index || done ? 'is-done' : ''}>
                <b>0{i + 1}</b>{moveName}<span>{sec}초</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={`ml-routine__timer${running ? ' is-running' : ''}${done ? ' is-done' : ''}`}>
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle className="ml-routine__track" cx="100" cy="100" r="88" />
            <circle className="ml-routine__ring" cx="100" cy="100" r="88" pathLength="100" style={{ strokeDashoffset: 100 * progress }} />
          </svg>
          <div className="ml-routine__face" aria-live="polite">
            {done ? (
              <p className="ml-routine__done">{ROUTINE.done}</p>
            ) : (
              <>
                <span className="ml-routine__en">{english}</span>
                <strong className="ml-routine__name" key={name}>{name}</strong>
                <span className="ml-routine__sec" aria-hidden="true">{String(moveLeft).padStart(2, '0')}</span>
                <span className="ml-routine__how">{howTo}</span>
              </>
            )}
          </div>
          <div className="ml-routine__actions">
            <button type="button" className="ml-btn" onClick={toggle}>
              {done ? <><RotateCcw size={18} aria-hidden="true" /> 한 번 더</> : running ? <><Pause size={18} aria-hidden="true" /> 잠깐 멈춤</> : <><Play size={18} aria-hidden="true" /> {elapsed > 0 ? '이어서' : '30초 시작'}</>}
            </button>
            {done ? <a href="#trial" className="ml-btn ml-btn--line">무료 체험 신청</a> : <span className="ml-routine__left">남은 시간 {totalLeft}초</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Routine;
