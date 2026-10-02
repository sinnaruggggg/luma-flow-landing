import { useEffect } from 'react';
import { decodeText } from '../hero/useDecodeTitle.js';

// 홈 하단의 작은 인터랙션 모음. 모두 '동작 줄이기' 설정이면 꺼집니다.
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(pointer: fine)').matches;
const clamp01 = (value) => Math.min(1, Math.max(0, value));

// 페이지 전체 스크롤 진행도(0~1)를 <html>의 --page-progress로 제공합니다. (헤더 아래 진행 막대)
export function usePageProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--page-progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

// [data-magnetic] 버튼이 커서 쪽으로 살짝 끌려옵니다. (마우스 환경에서만)
export function useMagnetic() {
  useEffect(() => {
    if (reducedMotion() || !finePointer()) return undefined;
    let current = null;
    const reset = (el) => { if (el) el.style.transform = ''; };
    const onMove = (event) => {
      const el = event.target.closest?.('[data-magnetic]') || null;
      if (el !== current) { reset(current); current = el; }
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      el.style.transform = `translate(${(x * 6).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      reset(current);
    };
  }, []);
}

// 커서 위치를 요소의 CSS 변수로 넘깁니다. --px/--py는 요소 안 픽셀, --nx/--ny는 -1~1
export function usePointerVars(ref, selector) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || !finePointer()) return undefined;
    const onMove = (event) => {
      const el = selector ? event.target.closest?.(selector) : root;
      if (!el || !root.contains(el)) return;
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      el.style.setProperty('--px', `${px.toFixed(0)}px`);
      el.style.setProperty('--py', `${py.toFixed(0)}px`);
      el.style.setProperty('--nx', ((px / rect.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--ny', ((py / rect.height) * 2 - 1).toFixed(3));
    };
    const onLeave = (event) => {
      const el = selector ? event.target.closest?.(selector) : root;
      if (el) { el.style.setProperty('--nx', '0'); el.style.setProperty('--ny', '0'); }
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerout', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerout', onLeave);
    };
  }, [ref, selector]);
}

// 목록에서 화면 가운데에 온 항목에 data-active를 붙이고, 진행도를 --pp(0~1)로 넘깁니다.
export function useActiveStep(ref) {
  useEffect(() => {
    const list = ref.current;
    if (!list) return undefined;
    const items = [...list.querySelectorAll('li')];
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      const rect = list.getBoundingClientRect();
      list.style.setProperty('--pp', clamp01((line - rect.top) / rect.height).toFixed(3));
      let active = -1;
      items.forEach((item, index) => { if (item.getBoundingClientRect().top < line) active = index; });
      items.forEach((item, index) => item.toggleAttribute('data-active', index === active));
      // [data-steps] 조상에 지금 단계 번호를 알려 줍니다. (제작 과정 시안 조립용)
      list.closest('[data-steps]')?.setAttribute('data-step', String(Math.max(active, 0)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
}

// 화면에 들어오면 [data-count] 숫자를 0부터 목표값까지 올립니다.
export function useCountUp(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const nodes = [...root.querySelectorAll('[data-count]')];
    nodes.forEach((node) => { node.textContent = '0'; });
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = clamp01((now - start) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        nodes.forEach((node, index) => {
          const local = clamp01(eased * 1.15 - index * 0.05);
          node.textContent = Math.round(Number(node.dataset.count) * local).toLocaleString('ko-KR');
        });
        if (t < 1) frame = requestAnimationFrame(tick);
        else nodes.forEach((node) => { node.textContent = Number(node.dataset.count).toLocaleString('ko-KR'); });
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      nodes.forEach((node) => { node.textContent = Number(node.dataset.count).toLocaleString('ko-KR'); });
    };
  }, [ref]);
}

// 섹션 제목(.sx-head h2)이 화면에 들어오면 히어로처럼 글자 해독 효과를 한 번 실행합니다.
export function useDecodeHeadings() {
  useEffect(() => {
    if (reducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const cancels = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        cancels.push(decodeText(entry.target, 900));
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('#main .sx-head h2').forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      cancels.forEach((cancel) => cancel());
    };
  }, []);
}

// 글·카드·버튼·이미지 위에서는 격자를 숨겨 글이 어지럽게 보이지 않게 합니다. (빈 배경에서만 보임)
const CONTENT_SELECTOR = 'p,h1,h2,h3,h4,h5,li,dt,dd,a,button,label,input,select,textarea,img,svg,figure,pre,table,summary,details,[role="tab"],[role="listitem"],.btn,.quote__calc,.qw,.services__preview,.spec__visual,.build,.wg__sticky,.agency-contact,.pricing,.scores,.audience>*';

// 커서 위치를 화면 좌표(--mx/--my)와 페이지 좌표 글자로 넘깁니다. (커서 주변 격자용, 마우스 환경에서만)
export function useCursorGrid(ref, tagRef) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !finePointer()) return undefined;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      if (tagRef.current) tagRef.current.textContent = `X ${String(Math.round(x)).padStart(4, '0')} · Y ${String(Math.round(y + window.scrollY)).padStart(5, '0')}`;
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      el.toggleAttribute('data-over-content', Boolean(event.target.closest?.(CONTENT_SELECTOR)));
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref, tagRef]);
}
