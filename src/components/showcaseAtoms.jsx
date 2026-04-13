import { ArrowRight, Sparkles } from "lucide-react";
import { buildSitePath } from "../content/siteRegistry";

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

export function MetricStrip({ items }) {
  return (
    <div className="metric-strip">
      {items.map((item) => (
        <article key={`${item.label}-${item.value}`} className="metric-pill">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </div>
  );
}

export function ActionPair({ site, onNavigate, primaryRoute, secondaryRoute }) {
  const primaryPath = primaryRoute ? buildSitePath(site.id, primaryRoute.slug) : null;
  const secondaryPath = secondaryRoute ? buildSitePath(site.id, secondaryRoute.slug) : null;

  return (
    <div className="button-row">
      {primaryPath ? (
        <button type="button" className="cta cta--primary" onClick={() => onNavigate(primaryPath)}>
          {site.hero.primary}
          <ArrowRight size={18} />
        </button>
      ) : null}
      {secondaryPath ? (
        <button type="button" className="cta cta--ghost" onClick={() => onNavigate(secondaryPath)}>
          {site.hero.secondary}
        </button>
      ) : null}
    </div>
  );
}

export function TagRail({ items, accent = false }) {
  return (
    <div className={`tag-rail ${accent ? "tag-rail--accent" : ""}`}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function MediaCard({ src, label, title, body, className = "", tall = false }) {
  return (
    <figure className={`media-card ${tall ? "media-card--tall" : ""} ${className}`.trim()}>
      <img src={src} alt={title} />
      <figcaption>
        <span>{label}</span>
        <strong>{title}</strong>
        {body ? <p>{body}</p> : null}
      </figcaption>
    </figure>
  );
}

export function InfoPanel({ eyebrow, title, rows = [], tags = [], accent = false, className = "" }) {
  return (
    <section className={`info-panel ${accent ? "info-panel--accent" : ""} ${className}`.trim()}>
      <span className="info-panel__eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      {rows.length ? (
        <div className="info-panel__rows">
          {rows.map((row) => (
            <div key={`${row.label}-${row.value}`} className="info-panel__row">
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {tags.length ? <TagRail items={tags} accent={accent} /> : null}
    </section>
  );
}

export function Deck({ items, compact = false, className = "" }) {
  return (
    <div className={`deck ${compact ? "deck--compact" : ""} ${className}`.trim()}>
      {items.map((item) => (
        <article key={`${item.title}-${item.value}`} className="deck-card">
          <span>{item.meta || "핵심 구성"}</span>
          <strong>{item.title}</strong>
          <b>{item.value}</b>
        </article>
      ))}
    </div>
  );
}

export function StoryBlock({ title, body, tags }) {
  return (
    <section className="story-block">
      <span className="story-block__eyebrow">Story</span>
      <h2>{title}</h2>
      <p>{body}</p>
      {tags?.length ? <TagRail items={tags} /> : null}
    </section>
  );
}

export function SiteIntro({ site, onNavigate, primaryRoute, secondaryRoute, className = "", body }) {
  return (
    <div className={`site-intro ${className}`.trim()}>
      <span className="site-intro__eyebrow">{site.hero.eyebrow}</span>
      <h1>{site.hero.title}</h1>
      <p>{body ?? site.hero.subtitle}</p>
      <ActionPair site={site} onNavigate={onNavigate} primaryRoute={primaryRoute} secondaryRoute={secondaryRoute} />
      <TagRail items={site.content.badges} />
    </div>
  );
}

export function ShowcasePhone({ src }) {
  return (
    <div className="phone-shot" aria-hidden="true">
      <span className="phone-shot__notch" />
      <img src={src} alt="" />
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
