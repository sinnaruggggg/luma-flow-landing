import { useEffect } from 'react';
import { PROJECTS } from '../data/projects.js';
import { ProjectFinderCTA } from '../components/ProjectFinderCTA.jsx';
import { Audience, CapabilityTicker, Faq, Pricing, Process, QualitySpec, Services, WorkSection } from './HomeSections.jsx';
import { SiteHud } from './SiteHud.jsx';
import { QuoteFab } from './QuoteFab.jsx';
import { useReveal } from './useReveal.js';

// 홈의 히어로 아래 섹션 전체. 첫 화면을 먼저 보여 주기 위해 따로 불러옵니다. (EditorialApp.jsx 의 Home)
export default function HomeBelow({ onOpen, contact }) {
  useReveal();

  // 주소에 #pricing 같은 위치가 붙어 들어오면, 섹션이 그려진 뒤 그곳으로 이동합니다.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <SiteHud />
      <QuoteFab />
      <CapabilityTicker />
      <ProjectFinderCTA onOpen={onOpen} />
      <WorkSection projects={PROJECTS.slice(0, 6)} />
      <Services />
      <Audience />
      <QualitySpec />
      <Process />
      <Pricing />
      <Faq />
      {contact}
    </>
  );
}
