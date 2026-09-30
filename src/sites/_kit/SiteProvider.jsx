import { useCallback, useEffect, useMemo, useState } from 'react';
import { stripBasePath, withBasePath } from '../../lib/appPaths.js';
import { SiteContext, useSite } from './siteContext.js';

function readPage(siteId) {
  const path = stripBasePath(window.location.pathname).replace(/\/$/, '');
  return path.slice(`/sites/${siteId}`.length).replace(/^\//, '');
}

// /sites/:id/:page... 하위 페이지 이동을 새로고침 없이 처리합니다. 뒤로가기·새로고침·직접 링크 모두 동작합니다.
export function SiteProvider({ siteId, children }) {
  const [page, setPage] = useState(() => readPage(siteId));

  useEffect(() => {
    const onPop = () => setPage(readPage(siteId));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [siteId]);

  const href = useCallback((to = '') => withBasePath(`/sites/${siteId}${to ? `/${to}` : ''}`), [siteId]);

  const go = useCallback((to = '', hash = '') => {
    const [slug, inlineHash] = to.split('#');
    const target = hash || inlineHash || '';
    const next = slug.replace(/^\/|\/$/g, '');
    if (next !== readPage(siteId) || !target) {
      window.history.pushState({}, '', `${href(next)}${target ? `#${target}` : ''}`);
    }
    setPage(next);
    requestAnimationFrame(() => {
      const anchor = target && document.getElementById(target);
      if (anchor) anchor.scrollIntoView();
      else window.scrollTo(0, 0);
      // 페이지가 바뀌면 화면 읽기 프로그램이 새 본문부터 읽도록 초점을 옮깁니다.
      if (!target) document.getElementById('site-main')?.focus({ preventScroll: true });
    });
  }, [href, siteId]);

  const value = useMemo(() => ({ siteId, page, go, href }), [siteId, page, go, href]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

// 사이트 안 링크. to="about" 또는 to="practice/family" 처럼 하위 경로만 적습니다.
export function Link({ to = '', children, onClick, ...rest }) {
  const { go, href, page } = useSite();
  const slug = to.split('#')[0];
  const current = slug === page || (slug && page.startsWith(`${slug}/`));
  return (
    <a
      href={`${href(slug)}${to.includes('#') ? `#${to.split('#')[1]}` : ''}`}
      aria-current={slug === page ? 'page' : undefined}
      data-active={current ? '' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
