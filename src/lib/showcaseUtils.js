import { useCallback, useEffect, useRef, useState } from "react";

export function themeStyle(theme) {
  return {
    "--site-bg": theme.bg,
    "--site-surface": theme.surface,
    "--site-panel": theme.panel,
    "--site-text": theme.text,
    "--site-muted": theme.muted,
    "--site-accent": theme.accent,
    "--site-accent-soft": theme.accentSoft,
    "--site-line": theme.line,
    "--site-shadow": theme.shadow,
    "--site-button-text": theme.buttonText,
  };
}

export function useIsMobileClient() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 820px)").matches);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 820px)");
    const onChange = (event) => setIsMobile(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

const DEFAULT_BACKDROP_POINTER_STYLE = {
  "--cursor-x": "54%",
  "--cursor-y": "18%",
  "--pointer-shift-x": "0",
  "--pointer-shift-y": "0",
};

export function useBackdropPointer() {
  const frameRef = useRef(0);
  const latestRef = useRef(null);

  useEffect(
    () => () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  const onPointerMove = useCallback((event) => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    latestRef.current = { node, x, y };

    if (frameRef.current) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      const latest = latestRef.current;
      if (!latest) return;

      latest.node.style.setProperty("--cursor-x", `${latest.x}%`);
      latest.node.style.setProperty("--cursor-y", `${latest.y}%`);
      latest.node.style.setProperty("--pointer-shift-x", `${latest.x - 50}`);
      latest.node.style.setProperty("--pointer-shift-y", `${latest.y - 50}`);
    });
  }, []);

  return [DEFAULT_BACKDROP_POINTER_STYLE, onPointerMove];
}
