import { useEffect, useState } from 'react';
import { QuoteIcon } from './QuoteIcon.jsx';
import './quote-fab.css';

// 화면 오른쪽 아래 "내 사이트 견적내기" 바로가기. 누르면 비용 섹션의 1분 질문이 바로 열립니다.
// 첫 화면(히어로)과 비용 섹션, 푸터 근처에서는 숨깁니다.
export function QuoteFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      const work = document.getElementById('work')?.getBoundingClientRect();
      const pricing = document.getElementById('pricing')?.getBoundingClientRect();
      const footer = document.querySelector('.studio-footer')?.getBoundingClientRect();
      const pastHero = Boolean(work && work.top < h * 0.6);
      const inPricing = Boolean(pricing && pricing.top < h * 0.85 && pricing.bottom > h * 0.15);
      const nearFooter = Boolean(footer && footer.top < h * 0.9);
      setVisible(pastHero && !inPricing && !nearFooter);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const first = window.setTimeout(update, 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(first);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const open = () => window.dispatchEvent(new CustomEvent('nanaweb:quote-open', { detail: { mode: 'wizard' } }));

  return (
    <button type="button" className={`quote-fab${visible ? ' is-on' : ''}`} onClick={open} tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      <span className="quote-fab__icon"><QuoteIcon name="spark" size={18} /></span>
      <span className="quote-fab__text"><b>내 사이트 견적내기</b><small>1분 질문 · 바로 추천</small></span>
    </button>
  );
}

export default QuoteFab;
