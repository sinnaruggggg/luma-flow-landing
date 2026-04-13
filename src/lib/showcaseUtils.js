import { useEffect, useState } from "react";

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

export function useBackdropPointer() {
  const [style, setStyle] = useState({ "--cursor-x": "54%", "--cursor-y": "18%" });

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setStyle({ "--cursor-x": `${x}%`, "--cursor-y": `${y}%` });
  };

  return [style, onPointerMove];
}
