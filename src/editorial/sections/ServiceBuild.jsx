import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import './service-build.css';

// 서비스 섹션 오른쪽 미리보기. 고른 서비스의 코드가 타이핑되는 만큼 샘플 화면이 위에서부터 그려집니다.
const SNIPPETS = {
  brand: ['brand-site.config.js', `export default site({
  pages: ['회사소개', '서비스', '채용', '소식'],
  layout: 'corporate',
  admin: true,
  responsive: [360, 768, 1440],
});`],
  landing: ['campaign.jsx', `<Landing goal="사전 신청">
  <Hero headline="흩어진 요청을 하나로" />
  <Proof items={reviews} />
  <Form cta="14일 무료 체험" />
</Landing>`],
  feature: ['booking.api.js', `app.post('/api/booking', async (req) => {
  const room = await rooms.reserve(req.body);
  await pay.charge(room.price);
  return { ok: true, room };
});`],
  care: ['care.log', `$ nanaweb care --monthly
✓ 콘텐츠 업데이트 3건
✓ 보안 패치 · 백업
✓ 속도 점검 · LCP 1.1s
✓ 월간 리포트 전달`],
};
const TYPE_MS = 1500;

export function ServiceBuild({ services, active }) {
  const rootRef = useRef(null);
  const codeRef = useRef(null);
  const statusRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const service = services[active];
  const [file, code] = SNIPPETS[service.id] ?? ['index.js', ''];

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const codeEl = codeRef.current;
    if (!root || !codeEl) return undefined;
    const finish = () => {
      codeEl.textContent = code;
      root.style.setProperty('--rp', '1');
      root.removeAttribute('data-building');
      if (statusRef.current) statusRef.current.textContent = '✓ rendered';
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !visible) {
      finish();
      return undefined;
    }
    const start = performance.now();
    let frame = 0;
    root.setAttribute('data-building', '');
    if (statusRef.current) statusRef.current.textContent = '● building…';
    const tick = (now) => {
      const t = Math.min(1, (now - start) / TYPE_MS);
      codeEl.textContent = code.slice(0, Math.round(code.length * t));
      root.style.setProperty('--rp', t.toFixed(3));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [code, visible]);

  return (
    <div ref={rootRef} className="services__preview svc" aria-hidden="true">
      <div className="services__frame svc__frame">
        {services.map((item, index) => (
          <img key={item.id} src={withBasePath(item.image)} alt="" loading="lazy" decoding="async" className={active === index ? 'is-active' : ''} />
        ))}
        <span className="svc__scan" />
      </div>
      <div className="svc__ide">
        <div className="svc__bar"><i /><i /><i /><span className="svc__file">{file}</span><span ref={statusRef} className="svc__status">✓ rendered</span></div>
        <pre className="svc__code"><code ref={codeRef}>{code}</code><b className="svc__caret" /></pre>
      </div>
      <span className="services__caption">{service.title} · 샘플 화면</span>
    </div>
  );
}

export default ServiceBuild;
