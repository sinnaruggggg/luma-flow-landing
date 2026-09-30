import { useEffect, useState } from 'react';

export function ProjectFinderCTA({ onOpen }) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    let observer;
    const frame = requestAnimationFrame(() => {
      const footer = document.querySelector('footer');
      if (!footer || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0.01 },
      );
      observer.observe(footer);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  const handleOpen = (event) => onOpen?.(event.currentTarget);

  return (
    <div className="project-finder-cta">
      <button
        type="button"
        className={`finder-rail${footerVisible ? ' is-footer-hidden' : ''}`}
        aria-haspopup="dialog"
        aria-hidden={footerVisible}
        hidden={footerVisible}
        inert={footerVisible}
        onClick={handleOpen}
      >
        내 프로젝트 찾기
      </button>
      <button
        type="button"
        className="finder-inline"
        aria-haspopup="dialog"
        onClick={handleOpen}
      >
        내 프로젝트 찾기
      </button>
    </div>
  );
}

export default ProjectFinderCTA;
