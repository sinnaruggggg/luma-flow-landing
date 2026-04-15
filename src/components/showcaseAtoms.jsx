export function SceneBackdrop({ tone = "gallery" }) {
  return (
    <div className="showcase-backdrop" data-tone={tone}>
      <span className="showcase-backdrop__orb showcase-backdrop__orb--a" />
      <span className="showcase-backdrop__orb showcase-backdrop__orb--b" />
      <span className="showcase-backdrop__orb showcase-backdrop__orb--c" />
      <span className="showcase-backdrop__aura" />
      <span className="showcase-backdrop__glow" />
      <span className="showcase-backdrop__beam" />
      <span className="showcase-backdrop__mesh" />
      <span className="showcase-backdrop__cursor" />
      <span className="showcase-backdrop__grain" />
    </div>
  );
}

export function ConstellationField({ className = "" }) {
  return (
    <svg className={`constellation-field ${className}`.trim()} viewBox="0 0 1440 720" preserveAspectRatio="none" aria-hidden="true">
      <g className="constellation-field__lines">
        <path d="M96 138L262 198L428 142L612 232L826 174L1038 260L1264 188L1368 246" />
        <path d="M154 390L314 318L478 402L676 338L864 418L1048 354L1274 430" />
        <path d="M208 580L374 514L558 596L754 524L942 614L1148 538L1322 602" />
      </g>
      <g className="constellation-field__stars">
        {[
          ["96", "138"],
          ["262", "198"],
          ["428", "142"],
          ["612", "232"],
          ["826", "174"],
          ["1038", "260"],
          ["1264", "188"],
          ["1368", "246"],
          ["154", "390"],
          ["314", "318"],
          ["478", "402"],
          ["676", "338"],
          ["864", "418"],
          ["1048", "354"],
          ["1274", "430"],
          ["208", "580"],
          ["374", "514"],
          ["558", "596"],
          ["754", "524"],
          ["942", "614"],
          ["1148", "538"],
          ["1322", "602"],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />
        ))}
      </g>
    </svg>
  );
}

export function ShowcasePhone({ src, html, alt = "", title = "" }) {
  return (
    <div className="phone-shot" aria-hidden={alt ? undefined : true}>
      <span className="phone-shot__button phone-shot__button--volume-up" />
      <span className="phone-shot__button phone-shot__button--volume-down" />
      <span className="phone-shot__button phone-shot__button--power" />
      <span className="phone-shot__frame-highlight" />
      <span className="phone-shot__camera-island">
        <span className="phone-shot__speaker" />
        <span className="phone-shot__lens phone-shot__lens--a" />
        <span className="phone-shot__lens phone-shot__lens--b" />
      </span>
      <div className="phone-shot__screen">
        {html ? <iframe title={title || alt || "mobile preview"} src={html} loading="lazy" /> : <img src={src} alt={alt} />}
      </div>
      <span className="phone-shot__homebar" />
    </div>
  );
}

export function WebForgeMark() {
  return (
    <span className="hub-topbar__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="presentation">
        <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.5" />
        <path d="M6.75 7.5V16.5L10.1 11.9L13.45 16.5V7.5" />
        <path d="M15.6 7.5H18.2" />
        <path d="M15.6 11.85H17.8" />
        <path d="M15.6 16.2H17.2" />
      </svg>
    </span>
  );
}
