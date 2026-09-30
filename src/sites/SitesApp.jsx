import { lazy, Suspense } from 'react';
import { stripBasePath, withBasePath } from '../lib/appPaths.js';
import { FORMATS, MOODS, SITES, getSite } from './catalog.js';
import { SITE_LOADERS } from './registry.js';
import { SiteProvider } from './_kit/SiteProvider.jsx';
import { SampleBadge } from './_kit/SampleBadge.jsx';
import { usePageTitle } from './_kit/siteContext.js';
import './_kit/kit.css';
import './sites-index.css';

const LAZY_SITES = Object.fromEntries(Object.entries(SITE_LOADERS).map(([id, loader]) => [id, lazy(loader)]));

function SitesIndex() {
  usePageTitle('시안 사이트 목록 — 나나웹');
  return (
    <main className="sites-index">
      <header>
        <a href={withBasePath('/')}>← 나나웹</a>
        <h1>포트폴리오 시안 사이트</h1>
        <p>완성 {SITES.filter((item) => item.status === 'ready').length} / 계획 {SITES.length}</p>
      </header>
      {[1, 2, 3, 4].map((wave) => (
        <section key={wave} aria-labelledby={`wave-${wave}`}>
          <h2 id={`wave-${wave}`}>{wave}차</h2>
          <ul>
            {SITES.filter((item) => item.wave === wave).map((item) => (
              <li key={item.id} data-status={item.status}>
                {item.status === 'ready' ? <a href={withBasePath(`/sites/${item.id}`)}>{item.name}</a> : <span>{item.name}</span>}
                <small>{item.industry} · {MOODS[item.mood]} · {FORMATS[item.format]}</small>
                <em>{item.status === 'ready' ? '완성' : '제작 예정'}</em>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function NotFound() {
  return (
    <main className="sites-index">
      <h1>찾는 시안 사이트가 없습니다.</h1>
      <p><a href={withBasePath('/sites')}>시안 목록으로 돌아가기</a></p>
    </main>
  );
}

export default function SitesApp() {
  const path = stripBasePath(window.location.pathname).replace(/\/$/, '');
  const id = path.split('/')[2] || '';
  if (!id) return <SitesIndex />;
  const Site = LAZY_SITES[id];
  if (!Site || getSite(id)?.status !== 'ready') return <NotFound />;
  return (
    <SiteProvider siteId={id}>
      <Suspense fallback={<div className="nw-loading">불러오는 중…</div>}>
        <Site />
      </Suspense>
      <SampleBadge />
    </SiteProvider>
  );
}
