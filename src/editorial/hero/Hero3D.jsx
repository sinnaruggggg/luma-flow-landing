import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import { HERO_AUDIENCES, HERO_SCREENS } from '../data/homeContent.js';
import './hero-3d.css';

// 스크롤 진행도(p: 0~1)에 따라 세 장면이 이어집니다.
// 1) 소개 문구 + 3D 공간에 떠 있는 샘플 화면  2) 대상 고객 단어 전환  3) 잉크색 패널로 전환
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const range = (p, start, end) => clamp01((p - start) / (end - start));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const MOBILE_SCREEN_COUNT = 9;

export function Hero3D() {
  const root = useRef(null);
  const stage = useRef(null);
  const world = useRef(null);
  const screenNodes = useRef([]);
  const wordNodes = useRef([]);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const el = root.current;
    const stageEl = stage.current;
    if (!el || !stageEl) return undefined;

    let items = [];
    let depth = 1;
    let gap = 420;
    let near = 520;
    let fadeStart = -2100;
    let drift = 0;
    let last = performance.now();
    let frameId = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function layout() {
      const width = stageEl.clientWidth;
      const height = stageEl.clientHeight;
      const small = width < 761;
      const count = small ? MOBILE_SCREEN_COUNT : screenNodes.current.length;
      const rx = width * (small ? 0.56 : 0.5);
      const ry = height * (small ? 0.36 : 0.4);
      gap = small ? 340 : 420;
      near = small ? 420 : 520;
      fadeStart = small ? -1700 : -2100;
      depth = count * gap;
      items = screenNodes.current.map((node, index) => {
        if (!node) return null;
        // display:none이면 지연 로딩 이미지가 로드되지 않으므로 visibility로만 숨깁니다.
        node.style.visibility = index < count ? '' : 'hidden';
        // 황금각으로 흩뿌려 화면들이 가운데 문구를 둘러싸게 배치합니다.
        const angle = index * 2.399963 + 0.6;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        return index < count ? { node, x, y, rx, ry, offset: index * gap } : null;
      }).filter(Boolean);
    }

    function render(now) {
      const dt = Math.min(64, now - last);
      last = now;
      const scrollable = Math.max(1, el.offsetHeight - stageEl.offsetHeight);
      const p = reduced ? 0 : clamp01(-el.getBoundingClientRect().top / scrollable);
      if (!pausedRef.current && !reduced) drift += dt * 0.05;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      const intro = easeInOut(range(p, 0.03, 0.3));
      const end = easeInOut(range(p, 0.68, 0.94));
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--intro', intro.toFixed(4));
      el.style.setProperty('--mid', (range(p, 0.24, 0.3) * (1 - range(p, 0.66, 0.72))).toFixed(4));
      el.style.setProperty('--end', end.toFixed(4));
      el.style.setProperty('--drift', `${(drift * 0.4) % 80}px`);
      // 문구가 사라지면 버튼 포커스를 막고, 잉크 패널에서는 HUD 색을 반전합니다.
      el.toggleAttribute('data-past', intro > 0.98);
      el.toggleAttribute('data-dark', end > 0.5);

      if (world.current) {
        world.current.style.transform = `rotateX(${(pointer.y * -5).toFixed(2)}deg) rotateY(${(pointer.x * 7).toFixed(2)}deg)`;
      }

      // 스크롤할수록 카메라가 화면들 사이를 빠르게 통과합니다.
      const travel = p * depth * 1.6;
      const fadeAll = 1 - end;
      for (const item of items) {
        const raw = (item.offset + drift + travel) % depth;
        const z = raw - depth + near;
        // 멀리 있는 화면은 가운데로 모여 문구를 가리므로, 가까워진 뒤에만 보이게 합니다.
        const fadeIn = range(z, fadeStart, fadeStart + 1000);
        const fadeOut = 1 - range(z, near - 320, near - 40);
        const tiltY = (-item.x / item.rx) * 24;
        const tiltX = (item.y / item.ry) * 12;
        item.node.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
        item.node.style.opacity = (fadeIn * fadeOut * fadeAll).toFixed(3);
      }

      // 대상 고객 단어가 차례로 떠올랐다가 사라집니다.
      const mid = range(p, 0.28, 0.68) * HERO_AUDIENCES.length;
      wordNodes.current.forEach((node, index) => {
        if (!node) return;
        const local = mid - index;
        const show = clamp01((0.5 - Math.abs(local - 0.5)) * 5);
        node.style.opacity = show.toFixed(3);
        node.style.transform = `translate3d(0, ${((0.5 - clamp01(local)) * 60).toFixed(1)}px, 0) rotateX(${((0.5 - clamp01(local)) * 50).toFixed(1)}deg)`;
      });
    }

    function loop(now) {
      render(now);
      frameId = visible ? requestAnimationFrame(loop) : 0;
    }

    function start() {
      if (frameId || reduced) return;
      last = performance.now();
      frameId = requestAnimationFrame(loop);
    }

    const onPointer = (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => { layout(); render(performance.now()); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });

    layout();
    render(performance.now());
    observer.observe(el);
    window.addEventListener('resize', onResize);
    if (window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  const stopped = paused || reduced;

  return (
    <section ref={root} className={`hero hero3d${reduced ? ' is-reduced' : ''}`} aria-labelledby="hero-title">
      <div ref={stage} className="hero3d__stage hero-art">
        <div className="hero3d__space" aria-hidden="true">
          <div className="hero3d__floor" />
          <div ref={world} className="hero3d__world">
            {HERO_SCREENS.map((src, index) => (
              <figure className="hero3d__screen" key={src} ref={(node) => { screenNodes.current[index] = node; }}>
                <span className="hero3d__chrome"><i /><i /><i /></span>
                <img src={withBasePath(src)} alt="" decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </div>
        </div>

        <div className="hero3d__copy">
          <p className="hero3d__kicker"><span>웹사이트 기획 · 디자인 · 개발 스튜디오</span></p>
          <h1 id="hero-title" className="hero3d__title">
            <span className="hero3d__line hero3d__line--1">생각을</span>
            <span className="hero3d__line hero3d__line--2"><em>작동하는</em> 웹으로.</span>
          </h1>
          <p className="hero3d__lead">개인 포트폴리오부터 스타트업, 기업, 비영리 단체까지.<br />목적에 맞는 구조를 설계하고, 화면을 디자인하고, 직접 개발합니다.</p>
          <div className="hero3d__actions">
            <a className="btn btn--solid" href="#contact" data-magnetic>프로젝트 문의하기 <span aria-hidden="true">→</span></a>
            <a className="btn btn--line" href="#work" data-magnetic>작업 보기</a>
          </div>
        </div>

        <div className="hero3d__mid" aria-hidden="true">
          <p>누구의 웹사이트든,</p>
          <div className="hero3d__words">
            {HERO_AUDIENCES.map((word, index) => (
              <span key={word} ref={(node) => { wordNodes.current[index] = node; }}>{word}</span>
            ))}
          </div>
          <p>그 목적에 맞게 만듭니다.</p>
        </div>

        <div className="hero3d__end" aria-hidden="true">
          <div className="hero3d__end-inner">
            <span className="hero3d__end-meta">기획 → 디자인 → 개발 → 운영</span>
            <strong>보는 순간 이해되고,<br />누르는 순간 작동하는 웹.</strong>
          </div>
        </div>

        <div className="hero3d__hud">
          <button className="motion-control" type="button" aria-pressed={stopped} disabled={reduced} onClick={() => setPaused((value) => !value)}>
            {reduced ? '동작 줄이기 적용 중' : paused ? '모션 재생' : '모션 정지'}
          </button>
          <div className="hero3d__progress" aria-hidden="true"><i /></div>
          <span className="hero3d__scroll" aria-hidden="true">스크롤</span>
        </div>
      </div>
    </section>
  );
}

export default Hero3D;
