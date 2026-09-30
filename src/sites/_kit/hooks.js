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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
