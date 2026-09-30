import { useEffect, useRef } from 'react';

// 모바일 전체 메뉴. 모양은 className으로 사이트가 정하고, 여기서는 동작만 담당합니다.
// Esc·바깥 클릭으로 닫힘, 열리면 첫 링크로 초점, 닫히면 여는 버튼으로 초점 복귀, 뒤 화면 스크롤 잠금.
export function MenuDrawer({ open, onClose, className = '', label = '전체 메뉴', children }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a,button')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll('a,button,input,select,textarea')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={className} role="dialog" aria-modal="true" aria-label={label} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panel} className={`${className}__panel`}>{children}</div>
    </div>
  );
}

export default MenuDrawer;
