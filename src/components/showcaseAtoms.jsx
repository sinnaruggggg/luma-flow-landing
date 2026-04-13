import { Sparkles } from "lucide-react";

export function SceneBackdrop({ tone = "gallery" }) {
  return (
    <div className="showcase-backdrop" data-tone={tone}>
      <span className="showcase-backdrop__orb showcase-backdrop__orb--a" />
      <span className="showcase-backdrop__orb showcase-backdrop__orb--b" />
      <span className="showcase-backdrop__orb showcase-backdrop__orb--c" />
      <span className="showcase-backdrop__mesh" />
      <span className="showcase-backdrop__cursor" />
      <span className="showcase-backdrop__grain" />
    </div>
  );
}

export function ShowcasePhone({ src, alt = "" }) {
  return (
    <div className="phone-shot" aria-hidden={alt ? undefined : true}>
      <span className="phone-shot__notch" />
      <img src={src} alt={alt} />
    </div>
  );
}

export function HubMark() {
  return (
    <span className="hub-topbar__mark">
      <Sparkles size={16} />
    </span>
  );
}
