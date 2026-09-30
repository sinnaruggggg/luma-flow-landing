import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { stripBasePath, withBasePath } from './lib/appPaths.js'

// Keep legacy admin/templates/portfolio isolated from the new studio stylesheet.
const pathname = stripBasePath(window.location.pathname).replace(/\/$/, '') || '/'
// 예전 샘플 주소(/samples/...)는 폐기되어 새 포트폴리오 목록으로 보냅니다.
if (pathname.startsWith('/samples')) window.location.replace(withBasePath('/projects'))
const isEditorial = pathname === '/' || pathname === '/index.html' || pathname === '/projects' || pathname.startsWith('/projects/')
// 포트폴리오 시안 사이트(/sites/...)는 에이전시 스타일과 섞이지 않도록 따로 불러옵니다.
const isSites = pathname === '/sites' || pathname.startsWith('/sites/')
const { default: App } = isSites
  ? await import('./sites/SitesApp.jsx')
  : isEditorial
  ? await import('./editorial/EditorialApp.jsx')
  : await Promise.all([import('./App.jsx'), import('./index.css')]).then(([app]) => app)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
