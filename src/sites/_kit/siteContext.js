import { createContext, useContext, useEffect } from 'react';

// 시안 사이트 공통 컨텍스트: 현재 하위 페이지(page)와 이동 함수(go)를 제공합니다.
export const SiteContext = createContext({ siteId: '', page: '', go: () => {}, href: (to) => to });

export function useSite() {
  return useContext(SiteContext);
}

// 브라우저 탭 제목을 "페이지 — 업체명" 형태로 맞춥니다.
export function usePageTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
