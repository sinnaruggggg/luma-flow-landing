import { useEffect, useRef } from 'react';
import './hero-tech.css';

// 히어로 첫 장면의 "테크" 연출 모음. Hero3D 안에서만 씁니다.
// 1) 커서에 반응하는 입자 별자리(스크롤하면 워프처럼 퍼짐)
// 2) 커서를 따라다니는 X-ray 렌즈(문구의 설계도·코드가 보임, 터치 기기는 자동으로 떠다님)
// 3) HUD: 빌드 로그 타이핑 + 실시간 FPS·좌표·스크롤
const clamp01 = (value) => Math.min(1, Math.max(0, value));

const BUILD_LOG = [
  '$ nanaweb build --target=responsive',
  '✓ 구조 설계 · 12 sections',
  '✓ 디자인 시스템 · 48 tokens',
  '✓ 반응형 · 1440 / 768 / 390',
  '✓ 성능 최적화 · LCP 0.9s',
  '✓ 배포 완료 · https://your.site',
];

const CODE = `<section class="hero" data-scroll="3d">
  <h1>생각을 <em>작동하는</em> 웹으로.</h1>
  <p class="lead">목적 → 구조 → 화면 → 개발</p>
</section>

const site = await nanaweb.build({
  목적: '문의 전환',
  구조: ['메인', '서비스', '포트폴리오', '문의'],
  디자인: tokens({ accent: '#d9492f', grid: 8 }),
  반응형: [1440, 768, 390],
});

await site.deploy({ ssl: true, cdn: 'edge' });
// ✓ ready in 0.9s · lighthouse 98`;

export function HeroTech({ rootRef, stageRef, paused, reduced, children }) {
  const canvasRef = useRef(null);
  const termRef = useRef(null);
  const fpsRef = useRef(null);
  const posRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas || reduced) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let parts = [];
    let frameId = 0;
    let visible = true;
    let last = performance.now();
    let lastP = -1;
    let warp = 0;
    let clock = 0;
    let frames = 0;
    let fpsTime = last;
    let typeTime = 0;
    let lineIndex = 0;
    let charIndex = 0;
    let holdUntil = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, lastMove: -1e9 };
    // 커서가 없을 때 렌즈가 떠다니는 범위 (본문을 가리지 않게 큰 제목 주변만)
    const home = { x: 0, y: 0, ax: 0, ay: 0 };

    const spawn = (nearCenter) => ({
      x: nearCenter ? width / 2 + (Math.random() - 0.5) * 120 : Math.random() * width,
      y: nearCenter ? height / 2 + (Math.random() - 0.5) * 90 : Math.random() * height,
      d: 0.35 + Math.random() * 0.65,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    });

    function resize() {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, Math.max(38, (width * height) / 13000)));
      parts = Array.from({ length: count }, () => spawn(false));
      const title = stage.querySelector('.hero3d__title');
      const stageBox = stage.getBoundingClientRect();
      const titleBox = title ? title.getBoundingClientRect() : null;
      home.x = titleBox ? titleBox.left - stageBox.left + titleBox.width / 2 : width / 2;
      home.y = titleBox ? titleBox.top - stageBox.top + titleBox.height / 2 : height * 0.4;
      home.ax = titleBox ? titleBox.width * 0.4 : width * 0.3;
      home.ay = titleBox ? titleBox.height * 0.28 : height * 0.1;
      pointer.x = pointer.tx = home.x;
      pointer.y = pointer.ty = home.y;
    }

    function step(now) {
      const dt = Math.min(48, now - last);
      last = now;
      clock += dt;

      // 스크롤 속도만큼 입자가 가운데에서 바깥으로 튀어 나갑니다.
      const scrollable = Math.max(1, root.offsetHeight - stage.offsetHeight);
      const p = clamp01(-root.getBoundingClientRect().top / scrollable);
      const speed = lastP < 0 ? 0 : Math.abs(p - lastP) * scrollable;
      lastP = p;
      warp += (Math.min(1, speed / 26) - warp) * 0.12;

      // 커서가 한동안 없으면 렌즈가 스스로 천천히 떠다닙니다.
      if (now - pointer.lastMove > 3500) {
        pointer.tx = home.x + Math.cos(clock * 0.00042) * home.ax;
        pointer.ty = home.y + Math.sin(clock * 0.00067) * home.ay;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      stage.style.setProperty('--lx', `${pointer.x.toFixed(1)}px`);
      stage.style.setProperty('--ly', `${pointer.y.toFixed(1)}px`);

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const repel = width < 761 ? 90 : 130;
      for (const part of parts) {
        part.x += part.vx * dt * 0.06;
        part.y += part.vy * dt * 0.06;
        const dx = part.x - cx;
        const dy = part.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const push = warp * part.d * 22 * (dt / 16);
        part.x += (dx / dist) * push;
        part.y += (dy / dist) * push;
        const px = part.x - pointer.x;
        const py = part.y - pointer.y;
        const pd = Math.hypot(px, py) || 1;
        if (pd < repel) {
          const force = (1 - pd / repel) * 2.2 * part.d;
          part.x += (px / pd) * force;
          part.y += (py / pd) * force;
        }
        if (part.x < -40 || part.x > width + 40 || part.y < -40 || part.y > height + 40) {
          Object.assign(part, spawn(warp > 0.25));
          if (warp <= 0.25) {
            if (part.x < 0) part.x = width;
            else if (part.x > width) part.x = 0;
          }
        }
        part.sx = dx / dist;
        part.sy = dy / dist;
        part.push = push;
      }

      // 가까운 입자끼리 선으로 잇습니다.
      const link = width < 761 ? 90 : 120;
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i += 1) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j += 1) {
          const b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(23,32,35,${((1 - d / link) * 0.16).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (d < repel * 1.45) {
          ctx.strokeStyle = `rgba(217,73,47,${((1 - d / (repel * 1.45)) * 0.55).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      for (const part of parts) {
        ctx.fillStyle = `rgba(23,32,35,${(0.22 + part.d * 0.38).toFixed(3)})`;
        if (part.push > 1.2) {
          // 워프 중에는 점이 빛줄기처럼 늘어납니다.
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = part.d * 1.6;
          ctx.beginPath();
          ctx.moveTo(part.x, part.y);
          ctx.lineTo(part.x - part.sx * part.push * 4, part.y - part.sy * part.push * 4);
          ctx.stroke();
          ctx.lineWidth = 1;
        } else {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.d * 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HUD: 빌드 로그 타이핑
      typeTime += dt;
      if (termRef.current && now > holdUntil && typeTime > 38) {
        typeTime = 0;
        const line = BUILD_LOG[lineIndex];
        charIndex += 1;
        termRef.current.textContent = line.slice(0, charIndex);
        if (charIndex >= line.length) {
          holdUntil = now + (lineIndex === BUILD_LOG.length - 1 ? 2600 : 900);
          lineIndex = (lineIndex + 1) % BUILD_LOG.length;
          charIndex = 0;
        }
      }

      // HUD: 실시간 수치 (0.25초마다)
      frames += 1;
      if (now - fpsTime > 250) {
        const fps = Math.round((frames * 1000) / (now - fpsTime));
        frames = 0;
        fpsTime = now;
        if (fpsRef.current) fpsRef.current.textContent = `FPS ${String(Math.min(fps, 120)).padStart(3, '0')}`;
        if (posRef.current) posRef.current.textContent = `X ${(pointer.x / width * 2 - 1).toFixed(2).padStart(5, ' ')} · Y ${(pointer.y / height * 2 - 1).toFixed(2).padStart(5, ' ')}`;
        if (scrollRef.current) scrollRef.current.textContent = `SCROLL ${String(Math.round(p * 100)).padStart(3, '0')}%`;
      }
    }

    function loop(now) {
      step(now);
      frameId = visible && !paused ? requestAnimationFrame(loop) : 0;
    }
    function start() {
      if (frameId || paused || !visible) return;
      last = performance.now();
      frameId = requestAnimationFrame(loop);
    }

    const onPointer = (event) => {
      const rect = stage.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.lastMove = performance.now();
    };
    const onResize = () => { resize(); step(performance.now()); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });

    resize();
    step(performance.now());
    observer.observe(stage);
    window.addEventListener('resize', onResize);
    if (window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', onPointer, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [rootRef, stageRef, paused, reduced]);

  if (reduced) return null;

  return (
    <>
      <canvas ref={canvasRef} className="htech__field" aria-hidden="true" />
      <div className="htech__lens" aria-hidden="true">
        <pre className="htech__code">{`${CODE}\n\n${CODE}`}</pre>
        {children}
      </div>
      <div className="htech__ring" aria-hidden="true"><span>X-RAY · 설계도 보기</span></div>
      <div className="htech__hud" aria-hidden="true">
        <p className="htech__term"><span ref={termRef} /><i /></p>
        <p className="htech__metrics"><span ref={fpsRef}>FPS 060</span><span ref={posRef}>X  0.00 · Y  0.00</span><span ref={scrollRef}>SCROLL 000%</span></p>
      </div>
    </>
  );
}

export default HeroTech;
