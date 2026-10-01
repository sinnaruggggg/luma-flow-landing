import { useEffect, useRef, useState } from 'react';
import { useCursorGrid, useDecodeHeadings } from './effects.js';
import './site-hud.css';

// 히어로 아래 섹션들을 하나로 묶는 "테크" 장치.
// 1) 왼쪽 고정 HUD: 지금 섹션 번호·이름, 스크롤 %, 누르면 그 섹션으로 이동 (넓은 화면에서만)
// 2) 커서 주변에만 보이는 격자 + 좌표
// 3) 섹션 제목 글자 해독 효과
export function SiteHud() {
  const gridRef = useRef(null);
  const tagRef = useRef(null);
  const scrollRef = useRef(null);
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);

  useDecodeHeadings();
  useCursorGrid(gridRef, tagRef);

  useEffect(() => {
    const nodes = [...document.querySelectorAll('#main section.sx')].filter((node) => node.querySelector('.sx-index'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = -1;
      nodes.forEach((node, index) => { if (node.getBoundingClientRect().top < line) current = index; });
      const footer = document.querySelector('.studio-footer');
      const beforeFooter = !footer || footer.getBoundingClientRect().top > window.innerHeight * 0.6;
      // 작업 갤러리가 화면에 고정된 동안은 카드를 가리지 않게 숨깁니다.
      const gallery = document.querySelector('.wg')?.getBoundingClientRect();
      const pinned = Boolean(gallery && gallery.top <= 80 && gallery.bottom >= window.innerHeight - 4);
      setActive(current);
      setVisible(current >= 0 && beforeFooter && !pinned);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollRef.current) scrollRef.current.textContent = `${String(Math.round(max > 0 ? (window.scrollY / max) * 100 : 0)).padStart(3, '0')}%`;
    };
    // 섹션 정보는 화면에 그려진 뒤에만 읽을 수 있어 한 박자 늦게 저장합니다.
    const first = window.setTimeout(() => {
      setSections(nodes.map((node) => ({
        id: node.id,
        index: node.querySelector('.sx-index')?.textContent ?? '',
        label: node.querySelector('.sx-head__meta span:last-child')?.textContent ?? '',
      })));
      update();
    }, 0);
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(first);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <>
      <nav className={`site-hud${visible ? ' is-on' : ''}`} aria-label="섹션 바로가기">
        <ol>
          {sections.map((section, index) => (
            <li key={section.id || index} className={index === active ? 'is-active' : ''}>
              <button type="button" onClick={() => go(section.id)} disabled={!section.id} aria-current={index === active ? 'true' : undefined} tabIndex={visible ? 0 : -1}>
                <span className="site-hud__no">{section.index}</span>
                <span className="site-hud__label">{section.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="site-hud__meta" aria-hidden="true"><span>{String(Math.max(active + 1, 1)).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span><span ref={scrollRef}>000%</span></p>
      </nav>
      <div ref={gridRef} className={`cursor-grid${visible ? ' is-on' : ''}`} aria-hidden="true"><span ref={tagRef} className="cursor-grid__tag" /></div>
    </>
  );
}

export default SiteHud;
