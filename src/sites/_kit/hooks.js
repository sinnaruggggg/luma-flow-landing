import { useCallback, useEffect, useRef, useState } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 사이트 전용 웹폰트를 한 번만 불러옵니다.
export function useFonts(hrefs) {
  const key = hrefs.join('|');
  useEffect(() => {
    key.split('|').filter(Boolean).forEach((href) => {
      if (document.querySelector(`link[data-site-font="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.siteFont = href;
      document.head.appendChild(link);
    });
  }, [key]);
}

// 컨테이너 안 [data-reveal] 요소를 화면에 들어올 때 등장시킵니다. deps가 바뀌면(페이지 전환) 다시 연결합니다.
export function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || !('IntersectionObserver' in window)) return undefined;
    root.classList.add('reveal-ready');
    // 등장 표시는 data-in 속성으로 합니다. (React가 className을 다시 쓰는 재렌더에도 지워지지 않게)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-in', '');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    const watch = (node) => { if (!node.hasAttribute('data-in')) observer.observe(node); };
    root.querySelectorAll('[data-reveal]').forEach(watch);
    // 페이지 안에서 나중에 생기는 요소(결과 화면 등)도 등장시킵니다.
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      if (node.hasAttribute('data-reveal')) watch(node);
      node.querySelectorAll?.('[data-reveal]').forEach(watch);
    })));
    mutations.observe(root, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// 스크롤이 조금이라도 내려갔는지 (헤더 그림자 등에 사용)
export function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);
  return scrolled;
}

// 시안용 폼: 검증 → 잠시 대기 → 완료 화면. 실제로 어디에도 전송하지 않습니다.
export function useMockForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const update = useCallback((event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }, []);

  const submit = useCallback((event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(Object.entries(validate(values)).filter(([, message]) => message));
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('pending');
    window.setTimeout(() => setStatus('done'), 700);
  }, [validate, values]);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    setStatus('idle');
  }, [initial]);

  return { values, errors, status, update, setValue, submit, reset, formRef };
}

// 오늘 기준 n일 뒤 날짜 (YYYY-MM-DD)
export function dateAfter(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 모바일 첫 화면에서는 떠 있는 버튼이 히어로 버튼을 가리지 않도록, 조금 스크롤한 뒤에 보여 줍니다.
export function useFloatingReady() {
  const [ready, setReady] = useState(() => typeof window === 'undefined' || window.innerWidth > 760);
  useEffect(() => {
    const update = () => setReady(window.innerWidth > 760 || window.scrollY > window.innerHeight * 0.3);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return ready;
}
