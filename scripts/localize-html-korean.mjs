import fs from "node:fs/promises";
import path from "node:path";

import { designRoot } from "./stitch-utils.mjs";

const replacements = [
  [/All Rights Reserved\./g, "판권 소유."],
  [/Designed for the Intelligent Era\./g, "지능형 운영 시대를 위한 설계."],
  [/Architecture Studio/g, "건축 스튜디오"],
  [/Project Brief/g, "프로젝트 브리프"],
  [/Quick Brief/g, "간단 브리프"],
  [/Request Portfolio/g, "포트폴리오 요청"],
  [/Technical Support/g, "기술 지원"],
  [/Full Name/g, "이름"],
  [/Tell us about your project goals and site location\.\.\./g, "프로젝트 목표와 부지 위치를 알려주세요."],
  [/Consultation \/ 상담/g, "상담"],
  [/상담 \(Consultation\)/g, "상담"],
  [/Personal Consultation/g, "개인 상담"],
  [/Private Consultation/g, "프라이빗 상담"],
  [/Consultation Types/g, "상담 유형"],
  [/Consultation Status/g, "상담 상태"],
  [/Consultation Slots/g, "상담 가능 시간"],
  [/Consultation/g, "상담"],
  [/Consulting/g, "상담"],
  [/Information Desk/g, "안내 데스크"],
  [/Usage Guidelines/g, "이용 안내"],
  [/Guidelines/g, "안내"],
  [/Information/g, "안내"],
  [/PERFORMANCE BRIEFING/g, "주행 브리핑"],
  [/Performance Briefing/g, "주행 브리핑"],
  [/Driver's License/g, "운전면허"],
  [/Shopping Bag/g, "장바구니"],
  [/Bundles/g, "번들"],
  [/Bundle/g, "번들"],
  [/Active Session: Cart_01/g, "현재 세션: 장바구니_01"],
  [/Driver Size/g, "드라이버 크기"],
  [/50mm Driver/g, "50mm 드라이버"],
  [/Driver Hub/g, "드라이버 허브"],
  [/Curated Gifts/g, "큐레이션 선물"],
  [/Gifts for Book Lovers/g, "책을 좋아하는 사람을 위한 선물"],
  [/Collections/g, "컬렉션"],
  [/Clinical Standards/g, "진료 기준"],
  [/Clinical Archive/g, "클리닉 아카이브"],
  [/Clinical Terms/g, "클리닉 약관"],
  [/Clinical Accuracy/g, "임상 정확도"],
  [/Patient Information/g, "개인 정보"],
  [/Personal Information/g, "개인 정보"],
  [/Personal Consulting/g, "개인 상담"],
  [/View Clinical Standards/g, "진료 기준 보기"],
  [/Consultant: Dr\. Choi/g, "상담 담당: 최 원장"],
  [/Archive Member Feedback/g, "아카이브 멤버 후기"],
  [/AI-Driven Rebalancing/g, "AI 자동 리밸런싱"],
  [/Joining/g, "참여 중"],
  [/CONTACT_HQ/g, "문의 센터"],
  [/CONTACT_COMMAND_CENTER/g, "문의 센터"],
  [/CONTACT_STATION/g, "문의 스테이션"],
  [/CONTACT_TERMINAL/g, "문의 터미널"],
  [/\bCONTACT\b/g, "문의"],
  [/\bSERVICES\b/g, "서비스"],
  [/\bWORKS\b/g, "프로젝트"],
  [/\bBRIEF\b/g, "브리프"],
  [/\bHome\b/g, "홈"],
  [/\bFeatures\b/g, "기능"],
  [/\bCases\b/g, "사례"],
  [/\bFlows\b/g, "플로우"],
  [/\bPricing\b/g, "요금"],
  [/\bContact\b/g, "문의"],
  [/\bWorks\b/g, "프로젝트"],
  [/\bServices\b/g, "서비스"],
  [/\bBrief\b/g, "브리프"],
  [/\bCollection\b/g, "컬렉션"],
  [/\bConsult\b/g, "상담"],
  [/\bBrand\b/g, "브랜드"],
  [/\bCart\b/g, "장바구니"],
  [/\bShop\b/g, "쇼핑"],
  [/\bMenu\b/g, "메뉴"],
  [/\bReserve\b/g, "예약"],
  [/\bBooking\b/g, "예약"],
  [/\bGuide\b/g, "안내"],
  [/\bRooms\b/g, "객실"],
  [/\bOffers\b/g, "오퍼"],
  [/\bTickets\b/g, "티켓"],
  [/\bLineup\b/g, "라인업"],
  [/\bSchedule\b/g, "시간표"],
  [/\bFeed\b/g, "피드"],
  [/\bPerks\b/g, "혜택"],
  [/\bJoin\b/g, "가입"],
  [/\bModels\b/g, "모델"],
  [/\bCharge\b/g, "충전"],
  [/\bDrive\b/g, "시승"],
  [/\bSupport\b/g, "안내"],
  [/\bKits\b/g, "키트"],
  [/\bColors\b/g, "컬러"],
  [/\bLooks\b/g, "룩북"],
  [/\bGift\b/g, "선물"],
  [/\bBasket\b/g, "장바구니"],
  [/\bRoutine\b/g, "루틴"],
  [/\bCompare\b/g, "비교"],
  [/\bSubscribe\b/g, "구독"],
  [/\bPrograms\b/g, "프로그램"],
  [/\bClinic\b/g, "클리닉"],
  [/\bShelf\b/g, "서가"],
  [/\bPicks\b/g, "추천"],
  [/\bSets\b/g, "세트"],
  [/\bNotes\b/g, "노트"],
  [/\bPlanner\b/g, "플래너"],
  [/\bService\b/g, "서비스"],
  [/\bStyles\b/g, "스타일"],
  [/\bDrops\b/g, "드롭"],
  [/\bGear\b/g, "장비"],
  [/\bBundle\b/g, "번들"],
  [/\bVisit\b/g, "방문"],
  [/\bInfo\b/g, "정보"],
  [/\bAI Scan\b/g, "AI 진단"],
];

const htmlFiles = await collectHtmlFiles(designRoot);
let updatedCount = 0;

for (const filePath of htmlFiles) {
  const original = await fs.readFile(filePath, "utf8");
  let next = original;
  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement);
  }
  if (next === original) continue;
  await fs.writeFile(filePath, next, "utf8");
  updatedCount += 1;
}

console.log(`Localized HTML files: ${updatedCount}`);

async function collectHtmlFiles(rootDir) {
  const files = [];
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}
