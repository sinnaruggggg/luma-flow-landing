import { getSiteLinks } from "../lib/showcaseUtils";
import { Deck, InfoPanel, MediaCard, MetricStrip, SiteIntro, StoryBlock } from "./showcaseAtoms";

export function HomeScene({ site, isMobileView, onNavigate }) {
  const links = getSiteLinks(site);
  const mode = isMobileView ? "mobile" : "desktop";
  const heroArt = site.routeAssets.home[mode];
  const secondaryArt = site.routeAssets[links.detail.slug][mode];
  const thirdArt = site.routeAssets[links.action.slug][mode];

  switch (site.presentation.homeStyle) {
    case "drop-cascade":
      return (
        <>
          <section className="home-drop">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.detail} className="home-drop__intro" />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-drop__media" />
            <InfoPanel eyebrow="Countdown" title="오늘 20:00 드롭" rows={site.content.stats} tags={site.content.secondary.slice(0, 3)} accent className="home-drop__count" />
            <Deck items={site.content.primary.slice(0, 3)} compact className="home-drop__deck" />
          </section>
          <section className="route-grid">
            <MediaCard src={secondaryArt} label={links.detail.label} title={site.blueprint.motion} body={site.presentation.mobileFocus} />
            <StoryBlock title="첫 화면에서 제품 디테일과 구매 진입이 동시에 보이게 설계했습니다." body={site.blueprint.heroMode} tags={site.content.badges.slice(0, 3)} />
          </section>
        </>
      );

    case "routine-split":
      return (
        <>
          <section className="home-routine">
            <InfoPanel eyebrow="Routine" title="오늘의 루틴 빌더" rows={site.content.stats} tags={site.content.secondary.slice(0, 3)} className="home-routine__panel" />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-routine__media" />
            <SiteIntro
              site={site}
              onNavigate={onNavigate}
              primaryRoute={links.browse}
              secondaryRoute={links.action}
              className="home-routine__intro"
              body="제품보다 루틴 구성이 먼저 보이게 만들어, 목표와 구독 전환을 한 번에 연결합니다."
            />
            <Deck items={site.content.primary.slice(0, 3)} compact className="home-routine__deck" />
          </section>
          <section className="route-grid">
            <MetricStrip items={site.content.stats} />
            <MediaCard src={thirdArt} label={links.action.label} title="구독 전환까지 한 줄" body={site.presentation.mobileFocus} />
          </section>
        </>
      );

    case "reservation-punch":
      return (
        <>
          <section className="home-punch">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-punch__media" tall />
            <div className="home-punch__overlay">
              <SiteIntro
                site={site}
                onNavigate={onNavigate}
                primaryRoute={links.action}
                secondaryRoute={links.detail}
                body="강한 체육관 에너지 위에 예약 위젯을 먼저 올려, 체험 신청까지 끊김 없이 이어집니다."
              />
            </div>
            <InfoPanel eyebrow="Booking" title="오늘 체험 예약" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 3)} accent className="home-punch__widget" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    case "dashboard-bento":
      return (
        <section className="home-dashboard">
          <SiteIntro
            site={site}
            onNavigate={onNavigate}
            primaryRoute={links.action}
            secondaryRoute={links.browse}
            className="home-dashboard__intro"
            body="숫자와 목표 진행이 바로 보이는 대시보드형 첫 화면으로 구성합니다."
          />
          <InfoPanel eyebrow="KPI Board" title="이번 주 흐름" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent className="home-dashboard__board" />
          <Deck items={site.content.primary.slice(0, 3)} className="home-dashboard__deck" />
          <MediaCard src={secondaryArt} label={links.detail.label} title={site.blueprint.heroMode} body={site.presentation.mobileFocus} className="home-dashboard__media" />
        </section>
      );

    case "clinic-stack":
      return (
        <>
          <section className="home-clinic">
            <SiteIntro
              site={site}
              onNavigate={onNavigate}
              primaryRoute={links.action}
              secondaryRoute={links.detail}
              className="home-clinic__intro"
              body="클리닉 공간 이미지 위에 진단과 예약 패널이 층층이 올라오는 구조입니다."
            />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-clinic__media" />
            <InfoPanel eyebrow="Appointment" title="오늘 가능한 슬롯" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} accent className="home-clinic__appointment" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MediaCard src={secondaryArt} label={links.detail.label} title={site.blueprint.motion} body={site.presentation.mobileFocus} />
          </section>
        </>
      );

    case "editorial-canvas":
      return (
        <>
          <section className="home-editorial">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-editorial__media" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} className="home-editorial__intro" />
            <InfoPanel eyebrow="Process" title="프로젝트 리듬" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} className="home-editorial__notes" />
          </section>
          <section className="route-grid">
            <MetricStrip items={site.content.stats} />
            <Deck items={site.content.primary.slice(0, 3)} compact />
          </section>
        </>
      );

    case "poster-sale":
      return (
        <>
          <section className="home-sale">
            <div className="home-sale__poster">
              <span>{site.presentation.firstScreenMode}</span>
              <strong>{site.hero.title}</strong>
              <p>{site.hero.subtitle}</p>
              <div className="home-sale__buttons">
                <button type="button" className="cta cta--primary" onClick={() => onNavigate(`/${site.id}/${links.browse.slug}`)}>
                  {site.hero.primary}
                </button>
                <button type="button" className="cta cta--ghost" onClick={() => onNavigate(`/${site.id}/${links.action.slug}`)}>
                  {site.hero.secondary}
                </button>
              </div>
            </div>
            <Deck items={site.content.primary.slice(0, 3)} compact className="home-sale__kits" />
            <InfoPanel eyebrow="Shades" title="오늘의 컬러 조합" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent className="home-sale__swatches" />
          </section>
          <section className="route-grid route-grid--wide">
            <MediaCard src={heroArt} label={site.brand} title={site.blueprint.background} body={site.presentation.mobileFocus} />
            <StoryBlock title="이미지와 세일 정보가 한 번에 읽히는 팝 구조" body="공통 섹션 조립 대신 포스터와 상품 스택의 대비로 첫 화면을 설계했습니다." tags={site.content.badges.slice(0, 3)} />
          </section>
        </>
      );

    case "festival-poster":
      return (
        <section className="home-festival">
          <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-festival__poster" tall />
          <div className="home-festival__content">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.browse} />
            <InfoPanel eyebrow="Line-up" title="오늘의 무대 흐름" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent />
            <Deck items={site.content.primary.slice(0, 3)} compact />
          </div>
        </section>
      );

    case "community-feed":
      return (
        <>
          <section className="home-club">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.browse} className="home-club__intro" />
            <Deck items={site.content.primary.slice(0, 3)} compact className="home-club__plans" />
            <InfoPanel eyebrow="Live Feed" title="오늘 올라온 활동" rows={site.content.tertiary.slice(0, 4)} tags={site.content.secondary.slice(0, 4)} accent className="home-club__feed" />
          </section>
          <section className="route-grid">
            <MetricStrip items={site.content.stats} />
            <MediaCard src={heroArt} label={site.brand} title={site.blueprint.background} body={site.presentation.mobileFocus} />
          </section>
        </>
      );

    case "mobility-compare":
      return (
        <>
          <section className="home-mobility">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-mobility__media" />
            <InfoPanel eyebrow="Compare" title="주행 · 충전 · 시승" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent className="home-mobility__compare" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.browse} className="home-mobility__intro" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MediaCard src={secondaryArt} label={links.detail.label} title={site.blueprint.motion} body={site.presentation.mobileFocus} />
          </section>
        </>
      );

    case "setup-command":
      return (
        <>
          <section className="home-setup">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-setup__media" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.detail} secondaryRoute={links.action} className="home-setup__intro" />
            <InfoPanel eyebrow="Specs" title="셋업 스냅샷" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} accent className="home-setup__specs" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    case "workflow-graph":
      return (
        <section className="home-workflow">
          <SiteIntro
            site={site}
            onNavigate={onNavigate}
            primaryRoute={links.action}
            secondaryRoute={links.browse}
            className="home-workflow__intro"
            body="이미지보다 플로우 그래프와 KPI가 먼저 보이는 비이미지형 홈입니다."
          />
          <InfoPanel eyebrow="Flow" title="업로드 → 요약 → 분류 → 승인" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent className="home-workflow__graph" />
          <Deck items={site.content.primary.slice(0, 3)} compact className="home-workflow__deck" />
          <MediaCard src={secondaryArt} label={links.detail.label} title={site.blueprint.heroMode} body={site.presentation.mobileFocus} className="home-workflow__demo" />
        </section>
      );

    case "shelf-editorial":
      return (
        <>
          <section className="home-shelf">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-shelf__media" />
            <StoryBlock title={site.hero.title} body={site.hero.subtitle} tags={site.content.secondary.slice(0, 4)} />
            <Deck items={site.content.primary.slice(0, 3)} compact />
          </section>
          <section className="route-grid">
            <MetricStrip items={site.content.stats} />
            <InfoPanel eyebrow="Notes" title="큐레이션 메모" rows={site.content.tertiary.slice(0, 4)} tags={site.content.badges.slice(0, 3)} />
          </section>
        </>
      );

    case "paper-kit":
      return (
        <>
          <section className="home-paper">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} className="home-paper__intro" />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-paper__board" />
            <InfoPanel eyebrow="Palette" title="오늘의 컬러 조합" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} className="home-paper__palette" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MediaCard src={thirdArt} label={links.action.label} title={site.blueprint.motion} body={site.presentation.mobileFocus} />
          </section>
        </>
      );

    case "cafe-window":
      return (
        <>
          <section className="home-cafe">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-cafe__window" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.browse} className="home-cafe__intro" />
            <InfoPanel eyebrow="Seats" title="지금 가능한 좌석" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 3)} accent className="home-cafe__reserve" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    case "hotel-booking":
      return (
        <>
          <section className="home-hotel">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-hotel__media" tall />
            <div className="home-hotel__overlay">
              <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.action} secondaryRoute={links.browse} />
              <InfoPanel eyebrow="Stay Finder" title="객실 · 날짜 · 오퍼" rows={site.content.stats} tags={site.content.secondary.slice(0, 3)} accent />
            </div>
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MediaCard src={secondaryArt} label={links.detail.label} title={site.presentation.mobileFocus} body={site.blueprint.motion} />
          </section>
        </>
      );

    case "scent-mood":
      return (
        <>
          <section className="home-scent">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-scent__media" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} className="home-scent__intro" />
            <InfoPanel eyebrow="Notes" title="향의 결" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} className="home-scent__notes" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    case "room-planner":
      return (
        <>
          <section className="home-room">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.detail} secondaryRoute={links.action} className="home-room__intro" />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-room__media" />
            <InfoPanel eyebrow="Planner" title="룸별 배치 보드" rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} accent className="home-room__planner" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MediaCard src={secondaryArt} label={links.detail.label} title={site.presentation.mobileFocus} body={site.blueprint.motion} />
          </section>
        </>
      );

    case "lookbook-rail":
      return (
        <>
          <section className="home-lookbook">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-lookbook__media" tall />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} className="home-lookbook__intro" />
            <Deck items={site.content.primary.slice(0, 3)} compact className="home-lookbook__deck" />
          </section>
          <section className="route-grid">
            <InfoPanel eyebrow="Fit" title="모바일 전용 진입" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} accent />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    case "luxe-collection":
      return (
        <>
          <section className="home-luxe">
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} className="home-luxe__media" />
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} className="home-luxe__intro" />
            <InfoPanel eyebrow="Consult" title="컬렉션 상담 진입" rows={site.content.tertiary.slice(0, 3)} tags={site.content.secondary.slice(0, 4)} accent className="home-luxe__consult" />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <MetricStrip items={site.content.stats} />
          </section>
        </>
      );

    default:
      return (
        <>
          <section className="route-grid route-grid--wide">
            <SiteIntro site={site} onNavigate={onNavigate} primaryRoute={links.browse} secondaryRoute={links.action} />
            <MediaCard src={heroArt} label={site.presentation.firstScreenMode} title={site.brand} body={site.summary} />
          </section>
          <section className="route-grid">
            <Deck items={site.content.primary.slice(0, 3)} compact />
            <InfoPanel eyebrow="Focus" title={site.blueprint.designFamily} rows={site.content.stats} tags={site.content.secondary.slice(0, 4)} />
          </section>
        </>
      );
  }
}
