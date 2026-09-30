// 무브랩 (가상 업체) — 모든 문구·가격·시간표는 이 파일에서 수정합니다.
// 브리프: PT 스튜디오 / 대상 = 운동을 꾸준히 못 했던 2040 직장인 / 목표 = 무료 체험 신청 / 무드 = 임팩트 볼드 / 형식 = 랜딩

export const GYM = Object.freeze({
  name: '무브랩',
  english: 'MOVELAB',
  address: '서울 마포구 ○○로 00, B1',
  hours: '평일 06:00 – 23:00 · 토 09:00 – 18:00 · 일 휴무',
  phone: '02-000-0000',
});

// public/sites/movelab/ 의 AI 생성 이미지. hero를 비우면 사진 없이 글자 디자인으로 보입니다.
export const IMAGES = Object.freeze({
  hero: 'hero-athlete.webp',
  gallery: [
    ['studio.webp', 'THE LAB', '검은 고무 바닥과 스쿼트랙이 있는 스튜디오'],
    ['hero-mobile.webp', 'LOAD', '바벨 원판을 끼우는 손과 초크 가루'],
    ['group-class.webp', 'CIRCUIT', '4인 소그룹 서킷 수업'],
    ['kettlebells.webp', 'IRON', '무게별로 놓인 케틀벨'],
    ['rowing.webp', 'ENGINE', '로잉머신을 당기는 다리와 팔'],
    ['recovery.webp', 'RECOVER', '운동 후 폼롤러와 물병이 놓인 매트'],
  ],
});

export const NAV = Object.freeze([['programs', '프로그램'], ['schedule', '시간표'], ['coaches', '코치'], ['pricing', '가격']]);

export const WORDS = Object.freeze({
  top: ['STRENGTH', '근력', 'CARDIO', '체력', 'MOBILITY', '유연성'],
  bottom: ['RECOVERY', '회복', 'CONSISTENCY', '꾸준함', 'FORM', '자세'],
});

export const PROGRAMS = Object.freeze([
  { no: '01', title: '1:1 퍼스널 트레이닝', english: 'PERSONAL', text: '체성분과 움직임 검사로 시작해 주 2~3회, 50분 동안 코치가 옆에서 자세를 잡아 드립니다.', intensity: 4, tags: ['체형 분석', '맞춤 루틴', '식단 코칭'] },
  { no: '02', title: '4인 소그룹 서킷', english: 'CIRCUIT', text: '최대 4명이 함께 순환 운동을 합니다. 혼자보다 덜 지루하고, 대형 수업보다 꼼꼼합니다.', intensity: 5, tags: ['최대 4명', '45분', '심박 관리'] },
  { no: '03', title: '8주 바디 챌린지', english: 'CHALLENGE', text: '8주 동안 주 3회 운동과 주간 인바디, 식단 피드백을 묶었습니다. 목표 체중을 함께 정합니다.', intensity: 4, tags: ['8주', '주간 측정', '식단 피드백'] },
  { no: '04', title: '체형 교정·재활', english: 'MOBILITY', text: '거북목, 허리 통증처럼 일상에서 굳은 몸을 풀고 바로 세웁니다. 무리한 중량은 쓰지 않습니다.', intensity: 2, tags: ['통증 완화', '가동성', '저중량'] },
]);

export const CLASS_TYPES = Object.freeze([['all', '전체'], ['circuit', '서킷'], ['strength', '근력'], ['mobility', '모빌리티']]);

// 요일 1=월 … 6=토, 정원 4명
export const SCHEDULE = Object.freeze([
  { day: 1, time: '06:30', end: '07:15', type: 'circuit', name: '모닝 서킷', coach: '강도윤', booked: 3 },
  { day: 1, time: '12:10', end: '12:50', type: 'mobility', name: '점심 스트레칭', coach: '한서우', booked: 1 },
  { day: 1, time: '19:30', end: '20:15', type: 'strength', name: '하체 근력', coach: '박지호', booked: 4 },
  { day: 2, time: '07:00', end: '07:45', type: 'strength', name: '상체 근력', coach: '박지호', booked: 2 },
  { day: 2, time: '20:00', end: '20:45', type: 'circuit', name: '퇴근 서킷', coach: '강도윤', booked: 3 },
  { day: 3, time: '06:30', end: '07:15', type: 'circuit', name: '모닝 서킷', coach: '강도윤', booked: 2 },
  { day: 3, time: '12:10', end: '12:50', type: 'mobility', name: '점심 스트레칭', coach: '한서우', booked: 0 },
  { day: 3, time: '19:30', end: '20:15', type: 'strength', name: '전신 근력', coach: '박지호', booked: 3 },
  { day: 4, time: '07:00', end: '07:45', type: 'mobility', name: '코어 & 호흡', coach: '한서우', booked: 1 },
  { day: 4, time: '20:00', end: '20:45', type: 'circuit', name: '퇴근 서킷', coach: '강도윤', booked: 4 },
  { day: 5, time: '06:30', end: '07:15', type: 'circuit', name: '모닝 서킷', coach: '강도윤', booked: 1 },
  { day: 5, time: '19:00', end: '19:45', type: 'strength', name: '데드리프트 클리닉', coach: '박지호', booked: 2 },
  { day: 6, time: '10:00', end: '10:50', type: 'circuit', name: '주말 파워 서킷', coach: '강도윤', booked: 2 },
  { day: 6, time: '11:30', end: '12:20', type: 'mobility', name: '회복 요가', coach: '한서우', booked: 3 },
]);

// 가상 인물입니다.
export const COACHES = Object.freeze([
  { name: '강도윤', role: '헤드 코치', letters: 'KDY', focus: ['서킷', '체력', '다이어트'], line: '숨이 찰 때 한 세트 더.' },
  { name: '박지호', role: '스트렝스 코치', letters: 'PJH', focus: ['근력', '파워리프팅', '자세 교정'], line: '무게보다 자세가 먼저.' },
  { name: '한서우', role: '모빌리티 코치', letters: 'HSW', focus: ['체형 교정', '재활', '요가'], line: '굳은 몸부터 풀어야 멀리 갑니다.' },
]);

export const PRICES = Object.freeze([
  { name: 'PT 10회', total: 700000, per: 70000, note: '처음 시작하는 분께' },
  { name: 'PT 20회', total: 1280000, per: 64000, note: '가장 많이 선택', featured: true },
  { name: 'PT 30회', total: 1800000, per: 60000, note: '습관이 될 때까지' },
  { name: '소그룹 월 정기권', total: 220000, per: null, note: '주 3회 서킷 수업' },
]);

export const GOALS = Object.freeze(['체중 감량', '근력 향상', '체형 교정', '체력 회복']);
export const SLOTS = Object.freeze(['새벽 (06–09시)', '점심 (11–14시)', '저녁 (18–23시)', '주말']);
