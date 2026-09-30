import { useState } from 'react';
import { withBasePath } from '../../lib/appPaths.js';
import { creditsFor } from './media.js';

// 모든 시안 사이트 왼쪽 아래에 붙는 "가상 업체 시안" 표시. 나나웹으로 돌아가는 길도 제공합니다.
export function SampleBadge() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="nw-badge" aria-label="나나웹 시안 안내">
      <a href={withBasePath('/projects')}>← 나나웹</a>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>시안 안내</button>
      {open ? (
        <p>나나웹이 디자인·개발 역량을 보여 주기 위해 만든 <strong>가상 업체의 시안</strong>입니다. 업체명, 인물, 연락처, 가격은 실제와 관계없으며 예약·주문·문의는 실제로 처리되지 않습니다.</p>
      ) : null}
    </aside>
  );
}

// 사진 출처 표기 (사이트 푸터 안에서 사용)
export function PhotoCredits({ keys, extra = 'AI로 생성한 이미지가 일부 포함되어 있습니다.', className = '' }) {
  const credits = creditsFor(keys);
  return (
    <details className={`nw-credits ${className}`}>
      <summary>사진 출처</summary>
      <ul>
        {credits.map((item) => (
          <li key={item.sourceUrl}><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.photographer}</a> · {item.license}</li>
        ))}
      </ul>
      {extra ? <p>{extra}</p> : null}
    </details>
  );
}
