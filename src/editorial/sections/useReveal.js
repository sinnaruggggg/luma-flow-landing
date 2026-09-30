import { useEffect } from 'react';

// 화면에 들어온 [data-reveal] 요소를 부드럽게 등장시킵니다. 동작 줄이기 설정이면 건너뜁니다.
export function useReveal() {
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    main.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    main.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      main.classList.remove('reveal-ready');
    };
  }, []);
}

export default useReveal;
