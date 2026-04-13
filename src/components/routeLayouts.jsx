import { getSiteLinks } from "../lib/showcaseUtils";
import { ActionPair, Deck, InfoPanel, MediaCard, MetricStrip, StoryBlock } from "./showcaseAtoms";

const catalogKinds = new Set(["browse", "features", "works", "feed", "lineup"]);
const detailKinds = new Set(["detail", "cases", "perks", "schedule", "brief"]);
const conversionKinds = new Set(["checkout", "pricing", "contact", "reserve", "tickets", "join"]);

function routeRowsFromSite(site) {
  return site.content.tertiary.length ? site.content.tertiary : site.content.stats;
}

function getRouteNarrative(site, route) {
  if (route.kind === "home") {
    return {
      title: site.hero.title,
      body: site.hero.subtitle,
    };
  }

  const map = {
    browse: `${route.label}을 빠르게 훑고 바로 다음 행동으로 이어지게 만든 탐색 화면입니다.`,
    detail: `${route.label}의 세부 선택 기준과 비교 포인트를 짧고 선명하게 보여주는 상세 화면입니다.`,
    checkout: `${route.label} 결정을 망설이지 않게 핵심 옵션과 전환 CTA를 앞세운 화면입니다.`,
    brand: `${site.brand}의 신뢰와 결을 짧고 밀도 있게 보여주는 브랜드 안내 화면입니다.`,
    reserve: `${route.label}을 실제 서비스처럼 진행할 수 있게 슬롯, 절차, 응답 방식을 정리한 예약 화면입니다.`,
    guide: `방문 전에 필요한 정보만 정리해서 보여주는 ${route.label} 화면입니다.`,
    features: `제품 흐름과 핵심 기능을 바로 이해하게 만드는 ${route.label} 화면입니다.`,
    cases: `실제 활용 시나리오와 효과를 사례 중심으로 보여주는 ${route.label} 화면입니다.`,
    pricing: `플랜 차이와 전환 지점을 짧고 명확하게 보여주는 ${route.label} 화면입니다.`,
    contact: `도입 문의나 데모 요청을 바로 보낼 수 있게 설계한 ${route.label} 화면입니다.`,
    works: `대표 프로젝트와 결과물을 빠르게 탐색하게 만드는 ${route.label} 화면입니다.`,
    services: `제공 범위와 산출물을 한눈에 이해하게 하는 ${route.label} 화면입니다.`,
    brief: `프로젝트 브리프를 빠르게 남길 수 있게 만든 ${route.label} 화면입니다.`,
    lineup: `라인업을 포스터 감도 대신 실제 탐색 흐름으로 재구성한 ${route.label} 화면입니다.`,
    schedule: `복잡한 시간표를 빠르게 이해하게 만드는 ${route.label} 화면입니다.`,
    tickets: `티켓 종류와 가격, 선택 동선을 한 화면에 정리한 ${route.label} 화면입니다.`,
    feed: `지금 커뮤니티 안에서 일어나는 일을 바로 읽게 만드는 ${route.label} 화면입니다.`,
    perks: `가입 전후 혜택을 한 번에 비교하게 만드는 ${route.label} 화면입니다.`,
    join: `플랜 비교와 가입 결정을 바로 연결하는 ${route.label} 화면입니다.`,
  };

  return {
    title: `${site.brand} ${route.label}`,
    body: map[route.kind] ?? `${route.label} 화면입니다.`,
  };
}

function RouteHero({ site, route, isMobileView, onNavigate }) {
  const routeArt = site.routeAssets[route.slug][isMobileView ? "mobile" : "desktop"];
  const links = getSiteLinks(site);
  const narrative = getRouteNarrative(site, route);

  return (
    <section className="route-hero">
      <StoryBlock title={narrative.title} body={narrative.body} tags={site.content.badges.slice(0, 3)} />
      <div className="route-hero__aside">
        <MediaCard src={routeArt} label={route.label} title={site.brand} body={site.summary} />
        <ActionPair site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.info} />
      </div>
    </section>
  );
}

function CatalogRoute({ site, route, isMobileView, onNavigate }) {
  return (
    <>
      <RouteHero site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />
      <section className="route-grid route-grid--wide">
        <Deck items={site.content.primary.slice(0, 4)} />
        <InfoPanel eyebrow="Quick Scan" title={`${route.label} 핵심 포인트`} rows={routeRowsFromSite(site).slice(0, 4)} tags={site.content.secondary.slice(0, 4)} />
      </section>
      <section className="route-grid">
        <MediaCard
          src={site.routeAssets[route.slug][isMobileView ? "mobile" : "desktop"]}
          label={route.label}
          title={site.blueprint.heroMode}
          body={site.presentation.mobileFocus}
        />
        <MetricStrip items={site.content.stats} />
      </section>
    </>
  );
}

function DetailRoute({ site, route, isMobileView, onNavigate }) {
  return (
    <>
      <RouteHero site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />
      <section className="route-grid">
        <InfoPanel
          eyebrow="Detail"
          title={`${route.label} 이해를 돕는 기준`}
          rows={routeRowsFromSite(site).slice(0, 5)}
          tags={site.content.secondary.slice(0, 4)}
          accent
        />
        <Deck items={site.content.primary.slice(0, 3)} compact />
      </section>
      <section className="route-grid route-grid--wide">
        <MediaCard
          src={site.routeAssets[route.slug][isMobileView ? "mobile" : "desktop"]}
          label={route.label}
          title={site.brand}
          body={site.summary}
        />
        <StoryBlock title={`${route.label} 화면은 긴 설명 대신 선택 기준을 먼저 보여줍니다.`} body={site.presentation.mobileFocus} tags={site.content.badges.slice(0, 3)} />
      </section>
    </>
  );
}

function ConversionRoute({ site, route, isMobileView, onNavigate }) {
  const links = getSiteLinks(site);

  return (
    <>
      <RouteHero site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />
      <section className="route-grid">
        <Deck items={site.content.primary.slice(0, 3)} compact />
        <InfoPanel eyebrow="Next Action" title={`${route.label} 전환 플로우`} rows={routeRowsFromSite(site).slice(0, 4)} tags={site.content.secondary.slice(0, 3)} accent />
      </section>
      <section className="route-action">
        <MediaCard
          src={site.routeAssets[route.slug][isMobileView ? "mobile" : "desktop"]}
          label={route.label}
          title={site.hero.primary}
          body="실제 운영 사이트처럼 짧은 정보와 강한 행동 유도만 남겼습니다."
        />
        <div className="route-action__card">
          <span>Flow</span>
          <h3>{route.label} 진행</h3>
          <p>설명을 길게 두지 않고, 필요한 입력과 결정 지점만 차례대로 보이게 구성합니다.</p>
          <div className="route-action__rows">
            {routeRowsFromSite(site).slice(0, 4).map((row) => (
              <div key={`${row.label}-${row.value}`}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <ActionPair site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.info} />
        </div>
      </section>
    </>
  );
}

function StoryRoute({ site, route, isMobileView, onNavigate }) {
  return (
    <>
      <RouteHero site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />
      <section className="route-grid route-grid--wide">
        <StoryBlock
          title={`${site.brand}의 정보 구조는 화면만 봐도 이해되게 설계합니다.`}
          body={`이 ${route.label} 화면은 긴 회사 소개보다, 운영 방식과 핵심 가치가 바로 읽히도록 짧은 설명과 수치 중심으로 정리합니다.`}
          tags={site.content.secondary.slice(0, 4)}
        />
        <InfoPanel eyebrow="Guide" title={`${route.label} 핵심 정보`} rows={routeRowsFromSite(site).slice(0, 5)} tags={site.content.badges.slice(0, 3)} />
      </section>
      <section className="route-grid">
        <MetricStrip items={site.content.stats} />
        <MediaCard
          src={site.routeAssets[route.slug][isMobileView ? "mobile" : "desktop"]}
          label={route.label}
          title={site.blueprint.background}
          body={site.summary}
        />
      </section>
    </>
  );
}

export function RouteScene({ site, route, isMobileView, onNavigate }) {
  if (catalogKinds.has(route.kind)) {
    return <CatalogRoute site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />;
  }

  if (detailKinds.has(route.kind)) {
    return <DetailRoute site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />;
  }

  if (conversionKinds.has(route.kind)) {
    return <ConversionRoute site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />;
  }

  return <StoryRoute site={site} route={route} isMobileView={isMobileView} onNavigate={onNavigate} />;
}
