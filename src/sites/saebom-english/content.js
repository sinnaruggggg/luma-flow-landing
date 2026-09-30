// 새봄영어 (가상 업체) — 모든 문구·시간표는 이 파일에서 수정합니다.
// 브리프: 초등 영어학원 / 대상 = 초등 자녀를 둔 학부모 / 목표 = 레벨테스트 신청 / 무드 = 따뜻한 친근 / 형식 = 홈페이지 5페이지

export const ACADEMY = Object.freeze({
  name: '새봄영어',
  english: 'Saebom English',
  phone: '031-000-0000',
  address: '경기도 수원시 영통구 ○○로 00, 3층',
  hours: '평일 13:00 – 21:00 · 토 10:00 – 15:00',
});

// GPT 이미지가 public/sites/saebom-english/ 에 들어오면 파일명을 추가합니다.
export const READY_IMAGES = Object.freeze([]);

export const PHOTOS = Object.freeze({
  hero: { file: 'hero-classroom.webp', alt: '작은 원형 테이블이 있는 밝은 영어 교실', fallback: 'education/Qw6wa96IvvQ' },
  reading: { file: 'reading.webp', alt: '영어 그림책을 넘기는 아이의 손', fallback: 'education/asviIGR3CPE' },
  blocks: { file: 'blocks.webp', alt: '알파벳 블록과 단어 카드', fallback: 'education/vDUIhgASz6c' },
  corner: { file: 'reading-corner.webp', alt: '빈백 쿠션이 있는 독서 코너', fallback: 'education/DknG_UtWXyA' },
  room: 'education/dFohf_GUZJ0',
  desk: 'education/TcFBT8y-AlE',
});
export const ALL_PHOTO_KEYS = Object.freeze(Object.values(PHOTOS).map((value) => (typeof value === 'string' ? value : value.fallback)));

export const NAV = Object.freeze([['programs', '프로그램'], ['teachers', '선생님'], ['schedule', '시간표'], ['test', '레벨테스트']]);

export const LEVELS = Object.freeze([
  { id: 'sprout', name: '새싹반', grade: '초1–2', color: 'leaf', title: '소리와 친해지기', text: '파닉스와 노래, 그림책으로 영어 소리에 익숙해집니다. 쓰기보다 듣고 따라 말하기가 먼저예요.', skills: ['파닉스', '챈트·노래', '그림책 읽기'] },
  { id: 'leaf', name: '잎새반', grade: '초2–4', color: 'sky', title: '혼자 읽는 즐거움', text: '짧은 리더스북을 스스로 읽고, 읽은 내용을 한두 문장으로 말하고 씁니다.', skills: ['리더스북', '어휘 게임', '문장 쓰기'] },
  { id: 'branch', name: '가지반', grade: '초4–6', color: 'sun', title: '생각을 영어로', text: '챕터북을 읽고 토론하며, 한 단락 글쓰기와 발표를 연습합니다.', skills: ['챕터북', '단락 쓰기', '발표'] },
  { id: 'tree', name: '나무반', grade: '초5–6', color: 'coral', title: '중학 영어 준비', text: '문법을 이야기 속에서 익히고, 에세이 쓰기와 듣기 평가를 준비합니다.', skills: ['문법', '에세이', '듣기 평가'] },
]);

export const FINDER = Object.freeze([
  { id: 'grade', question: '아이는 몇 학년인가요?', options: [['1', '1–2학년'], ['3', '3–4학년'], ['5', '5–6학년']] },
  { id: 'exp', question: '영어를 배운 지 얼마나 됐나요?', options: [['0', '처음이에요'], ['1', '1–2년'], ['3', '3년 이상']] },
  { id: 'read', question: '영어 그림책을 혼자 읽을 수 있나요?', options: [['no', '아직 어려워요'], ['some', '짧은 책은 읽어요'], ['yes', '술술 읽어요']] },
]);

// 가상 인물입니다.
export const TEACHERS = Object.freeze([
  { name: 'Jenny 선생님', role: '원장 · 리딩', initial: 'J', color: 'leaf', line: '책 한 권을 끝까지 읽은 경험이 가장 큰 자신감이 됩니다.', career: ['영어교육 석사', '초등 영어 지도 12년'] },
  { name: 'Daniel 선생님', role: '스피킹 · 토론', initial: 'D', color: 'sky', line: '틀려도 괜찮아요. 말하는 게 먼저예요.', career: ['TESOL 자격', '어린이 토론 프로그램 운영'] },
  { name: 'Sora 선생님', role: '파닉스 · 새싹반', initial: 'S', color: 'coral', line: '노래 하나로 알파벳 26자를 다 외워요.', career: ['유아·초등 영어 교사 8년', '파닉스 교재 공동 집필'] },
]);

export const SCHEDULE = Object.freeze({
  sprout: [['월·수', '14:00 – 14:50'], ['화·목', '15:00 – 15:50']],
  leaf: [['월·수', '15:00 – 16:10'], ['화·목', '16:00 – 17:10'], ['토', '10:00 – 11:40']],
  branch: [['월·수·금', '16:30 – 17:50'], ['화·목', '17:30 – 18:50']],
  tree: [['월·수·금', '18:00 – 19:30'], ['화·목', '19:00 – 20:30']],
});

export const PROMISES = Object.freeze([
  ['한 반 6명', '선생님이 모든 아이의 이름과 오늘 기분까지 압니다.'],
  ['매달 성장 리포트', '읽은 책, 새 단어, 발음 녹음을 모아 보내 드려요.'],
  ['숙제는 20분', '집에서는 부담 없이 복습만 할 수 있도록 설계했습니다.'],
]);
