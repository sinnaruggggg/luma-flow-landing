import { useEffect, useRef } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import { usePointerVars } from './effects.js';
import './work-gallery.css';

// 홈 "작업" 섹션 갤러리.
// 넓은 화면: 섹션이 화면에 고정된 채 스크롤하면 브라우저 창들이 옆으로 흘러가고, 가운데에서 멀수록 3D로 기웁니다.
// 좁은 화면: 손가락으로 넘기는 가로 슬라이드. 마우스를 올리면 X-ray 렌즈로 화면의 윤곽(설계도)이 보입니다.
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const HEADER = 76;

export function WorkGallery({ projects }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const countRef = useRef(null);
  usePointerVars(trackRef, '.wg-shot');

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return undefined;
    const wide = window.matchMedia('(min-width: 761px)');
    const cards = [...track.querySelectorAll('.wg-card')];
    let distance = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!wide.matches) return;
      const p = distance > 0 ? clamp01((HEADER - outer.getBoundingClientRect().top) / distance) : 0;
      const shift = p * distance;
      track.style.transform = `translate3d(${(-shift).toFixed(1)}px,0,0)`;
      outer.style.setProperty('--wp', p.toFixed(4));
      const center = window.innerWidth / 2;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((card, index) => {
        const mid = card.offsetLeft + card.offsetWidth / 2 - shift;
        const d = (mid - center) / window.innerWidth;
        if (Math.abs(d) < best) { best = Math.abs(d); nearest = index; }
        card.style.setProperty('--d', Math.max(-1, Math.min(1, d)).toFixed(3));
      });
      if (countRef.current) countRef.current.textContent = `${String(nearest + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    };

    const layout = () => {
      if (!wide.matches) {
        outer.style.height = '';
        track.style.transform = '';
        cards.forEach((card) => card.style.removeProperty('--d'));
        return;
      }
      const sticky = window.innerHeight - HEADER;
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      outer.style.height = `${Math.round(distance + sticky)}px`;
      paint();
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    // 키보드로 카드에 들어오면 그 카드가 가운데 오도록 페이지를 스크롤합니다.
    const onFocus = (event) => {
      const card = event.target.closest?.('.wg-card');
      if (!card || !wide.matches || distance <= 0) return;
      // 브라우저가 포커스 때문에 고정 영역을 옆으로 밀어 둔 경우 되돌립니다.
      track.parentElement.scrollLeft = 0;
      const target = card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2;
      const top = outer.getBoundingClientRect().top + window.scrollY - HEADER + clamp01(target / distance) * distance;
      window.scrollTo({ top, behavior: 'auto' });
    };

    layout();
    const images = [...track.querySelectorAll('img')];
    images.forEach((img) => { if (!img.complete) img.addEventListener('load', layout, { once: true }); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    wide.addEventListener('change', layout);
    track.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
      wide.removeEventListener('change', layout);
      track.removeEventListener('focusin', onFocus);
      images.forEach((img) => img.removeEventListener('load', layout));
    };
  }, [projects]);

  return (
    <div ref={outerRef} className="wg">
      <svg className="wg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        {/* 사진에서 윤곽선만 뽑아 하늘색 설계도처럼 보이게 하는 필터 */}
        <filter id="wg-edge" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feColorMatrix type="matrix" values="1.6 0 0 0 0  0 3.4 0 0 0  0 0 3.8 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <div className="wg__sticky">
        <div ref={trackRef} className="wg__track" role="list">
          {projects.map((project, index) => (
            <article className="wg-card" role="listitem" key={project.id}>
              <a href={withBasePath(project.url)} aria-label={`${project.title} 프로젝트 자세히 보기`}>
                <div className="wg-win">
                  <div className="wg-bar" aria-hidden="true"><i /><i /><i /><span>nanaweb.kr{project.siteUrl}</span></div>
                  <div className="wg-shot">
                    <img src={project.thumbnail} alt={`${project.title} 웹사이트 첫 화면`} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
                    <div className="wg-xray" aria-hidden="true">
                      <img src={project.thumbnail} alt="" loading="lazy" decoding="async" />
                      <span>X-RAY · {project.format === 'landing' ? 'LANDING' : 'MULTI-PAGE'}</span>
                    </div>
                  </div>
                </div>
                <div className="wg-cap">
                  <span className="wg-no">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="wg-meta">{project.meta}</p>
                    <h3 className="wg-title">{project.title}</h3>
                  </div>
                  <span className="wg-go" aria-hidden="true">↗</span>
                </div>
              </a>
            </article>
          ))}
          <article className="wg-card wg-card--end" role="listitem">
            <a href={withBasePath('/projects')}>
              <span className="wg-end__kicker">ALL PROJECTS</span>
              <strong>전체 사례<br />모두 보기</strong>
              <span className="wg-end__go" aria-hidden="true">→</span>
            </a>
          </article>
        </div>
        <div className="wg__hud" aria-hidden="true">
          <span ref={countRef}>01 / {String(projects.length + 1).padStart(2, '0')}</span>
          <i className="wg__bar"><b /></i>
          <span className="wg__hint">스크롤하면 옆으로 넘어갑니다</span>
          <span className="wg__hint--touch">옆으로 넘겨 보세요 →</span>
        </div>
      </div>
    </div>
  );
}

export default WorkGallery;
