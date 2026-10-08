// 새봄영어 (가상 업체) — 모든 문구·시간표는 이 파일에서 수정합니다.
// 브리프: 초등 영어학원 / 대상 = 초등 자녀를 둔 학부모 / 목표 = 레벨테스트 신청 / 무드 = 따뜻한 친근 / 형식 = 홈페이지 5페이지

export const ACADEMY = Object.freeze({
  name: '새봄영어',
  english: 'Saebom English',
  phone: '031-000-0000',
  address: '경기도 수원시 영통구 ○○로 00, 3층',
  hours: '평일 13:00 – 21:00 · 토 10:00 – 15:00',
  founded: 2014,
  owner: '김은서',
  registration: '제0000-00호',
  business: '000-00-00000',
  email: 'hello@saebom-english.example',
  parking: '건물 지하 주차장 2시간 무료 (상담·레벨테스트 방문 시)',
  access: [['지하철', '○○역 2번 출구에서 도보 5분'], ['버스', '○○초등학교 앞 정류장 하차 후 도보 2분'], ['셔틀', '인근 초등학교 3곳 하원 셔틀 운행 (시간표 참고)']],
});

// GPT 이미지가 public/sites/saebom-english/ 에 들어오면 파일명을 추가합니다.
export const READY_IMAGES = Object.freeze(['hero-classroom.webp', 'reading.webp', 'blocks.webp', 'reading-corner.webp', 'teacher-jenny.webp', 'teacher-daniel.webp', 'teacher-sora.webp', 'entrance.webp', 'library.webp', 'activity-room.webp', 'hallway.webp', 'minibook.webp', 'roleplay.webp', 'phonics.webp']);

export const PHOTOS = Object.freeze({
  hero: { file: 'hero-classroom.webp', alt: '작은 원형 테이블이 있는 밝은 영어 교실', fallback: 'education/Qw6wa96IvvQ' },
  reading: { file: 'reading.webp', alt: '영어 그림책을 넘기는 아이의 손', fallback: 'education/asviIGR3CPE' },
  blocks: { file: 'blocks.webp', alt: '알파벳 블록과 단어 카드', fallback: 'education/vDUIhgASz6c' },
  corner: { file: 'reading-corner.webp', alt: '빈백 쿠션이 있는 독서 코너', fallback: 'education/DknG_UtWXyA' },
  room: 'education/dFohf_GUZJ0',
  desk: 'education/TcFBT8y-AlE',
  // 선생님 (가상 인물) — Codex 로 만든 사진. 파일이 없으면 이니셜 원으로 대신 보입니다.
  jenny: { file: 'teacher-jenny.webp', alt: '따뜻하게 웃는 Jenny 원장 선생님' },
  daniel: { file: 'teacher-daniel.webp', alt: '친근하게 웃는 Daniel 선생님' },
  sora: { file: 'teacher-sora.webp', alt: '알파벳 카드를 든 Sora 선생님' },
  // 공간
  entrance: { file: 'entrance.webp', alt: '둥근 원목 카운터가 있는 학원 현관', fallback: 'education/dFohf_GUZJ0' },
  library: { file: 'library.webp', alt: '그림책 서가와 둥근 러그가 있는 원내 도서관', fallback: 'education/DknG_UtWXyA' },
  activity: { file: 'activity-room.webp', alt: '작은 무대와 손인형이 있는 활동 공간', fallback: 'education/TcFBT8y-AlE' },
  hallway: { file: 'hallway.webp', alt: '낮은 가방 보관함이 있는 복도', fallback: 'education/Qw6wa96IvvQ' },
  // 수업 장면
  minibook: { file: 'minibook.webp', alt: '색종이로 미니북을 만드는 아이의 손', fallback: 'education/asviIGR3CPE' },
  roleplay: { file: 'roleplay.webp', alt: '손인형으로 역할극을 하는 아이들의 뒷모습', fallback: 'education/vDUIhgASz6c' },
  phonics: { file: 'phonics.webp', alt: '알파벳 카드와 탬버린이 놓인 파닉스 수업 정물', fallback: 'education/vDUIhgASz6c' },
});
// 사진 출처 표기용: 같은 보유 사진이 여러 곳의 대체 사진으로 쓰여도 한 번만 적습니다.
export const ALL_PHOTO_KEYS = Object.freeze([...new Set(Object.values(PHOTOS).map((value) => (typeof value === 'string' ? value : value.fallback)).filter(Boolean))]);

export const NAV = Object.freeze([['programs', '프로그램'], ['teachers', '선생님'], ['schedule', '시간표'], ['about', '학원 이야기'], ['notice', '공지사항'], ['test', '레벨테스트']]);

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
  { name: 'Jenny 선생님', role: '원장 · 리딩', photo: 'jenny', initial: 'J', color: 'leaf', line: '책 한 권을 끝까지 읽은 경험이 가장 큰 자신감이 됩니다.', career: ['영어교육 석사', '초등 영어 지도 12년', '새봄영어 설립 (2014)'], tags: ['리딩', '상담', '커리큘럼'], bio: '학교 영어 수업에서 "읽을 줄 알지만 읽기 싫어하는 아이"를 많이 만났습니다. 그래서 새봄영어는 시험보다 먼저, 책 한 권을 끝까지 읽는 경험을 만드는 데 시간을 씁니다.' },
  { name: 'Daniel 선생님', role: '스피킹 · 토론', photo: 'daniel', initial: 'D', color: 'sky', line: '틀려도 괜찮아요. 말하는 게 먼저예요.', career: ['TESOL 자격', '어린이 토론 프로그램 운영', '캐나다 출신 · 한국 거주 6년'], tags: ['스피킹', '토론', '발표'], bio: '"Sorry"가 입에 붙은 아이들이 "Let me try"라고 말하게 되는 순간을 가장 좋아합니다. 수업의 절반은 아이들이 말하는 시간입니다.' },
  { name: 'Sora 선생님', role: '파닉스 · 새싹반', photo: 'sora', initial: 'S', color: 'coral', line: '노래 하나로 알파벳 26자를 다 외워요.', career: ['유아·초등 영어 교사 8년', '파닉스 교재 공동 집필'], tags: ['파닉스', '노래', '새싹반'], bio: '처음 영어를 만나는 아이에게 영어는 "소리 놀이"여야 한다고 믿습니다. 노래, 율동, 카드 게임으로 소리와 글자를 자연스럽게 연결해 줍니다.' },
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

// ---------- 홈·학원 이야기·공지에 쓰는 데이터 ----------
export const STATS = Object.freeze([
  { value: 6, unit: '명', label: '한 반 최대 인원' },
  { value: 12, unit: '년', label: '초등 영어 한 길' },
  { value: 20, unit: '분', label: '평균 숙제 시간' },
  { value: 96, unit: '%', label: '재등록 학부모 (시안 수치)' },
]);

// "단어 뒤집기" 놀이 카드 (그림 + 영어 단어)
export const WORD_PAIRS = Object.freeze([
  { id: 'apple', icon: '🍎', word: 'apple', ko: '사과' },
  { id: 'dog', icon: '🐶', word: 'dog', ko: '강아지' },
  { id: 'sun', icon: '☀️', word: 'sun', ko: '해' },
  { id: 'whale', icon: '🐳', word: 'whale', ko: '고래' },
]);

// 수업 하루 흐름 (사진은 PHOTOS 키)
export const CLASS_DAY = Object.freeze([
  { time: '0–10분', title: 'Hello Song', text: '노래와 율동으로 몸과 귀를 깨워요.', photo: 'phonics', color: 'sun' },
  { time: '10–25분', title: 'Story Time', text: '그림책 한 권을 함께 읽고, 질문하고 따라 말해요.', photo: 'reading', color: 'leaf' },
  { time: '25–40분', title: 'Talk Together', text: '짝과 역할극을 하며 오늘 배운 문장을 말해 봐요.', photo: 'roleplay', color: 'sky' },
  { time: '40–50분', title: 'Make & Share', text: '미니북, 포스터를 만들고 친구들 앞에서 소개해요.', photo: 'minibook', color: 'coral' },
]);

// 월간 성장 리포트 예시
export const REPORT = Object.freeze({
  child: '하준 (초3 · 잎새반)',
  month: '10월',
  books: 6,
  words: 84,
  pronunciation: [62, 68, 71, 79, 86],
  comment: '이번 달에는 짧은 문장으로 친구에게 질문하는 용기가 부쩍 늘었어요. 다음 달에는 읽은 책을 두 문장으로 소개해 볼게요.',
  teacher: 'Jenny 선생님',
});

// 가상 후기 (이름은 가림 처리)
export const REVIEWS = Object.freeze([
  { name: '김○○ 학부모', child: '초2 · 새싹반', period: '8개월째', color: 'leaf', text: '영어 책을 보면 도망가던 아이가 이제는 자기 전에 그림책을 읽어 달라고 해요. 숙제가 부담이 없어서 아이가 스스로 하는 게 제일 좋아요.' },
  { name: '이○○ 학부모', child: '초4 · 잎새반', period: '1년 3개월째', color: 'sky', text: '매달 오는 성장 리포트에 발음 녹음이 들어 있어서 아이가 얼마나 달라졌는지 귀로 확인돼요. 선생님과 상담도 꼼꼼해서 믿고 맡깁니다.' },
  { name: '박○○ 학부모', child: '초5 · 가지반', period: '2년째', color: 'sun', text: '토론 수업 덕분인지 학교 발표에서 손을 먼저 든다고 해요. 학원 다녀오면 오늘 한 얘기를 자랑하듯 들려줍니다.' },
  { name: '최○○ 학부모', child: '초1 · 새싹반', period: '5개월째', color: 'coral', text: '노래로 알파벳을 외우니까 집에서도 흥얼거려요. 한 반 6명이라 선생님이 아이 이름과 성향을 다 아셔서 안심이 됩니다.' },
  { name: '정○○ 학부모', child: '초6 · 나무반', period: '1년째', color: 'leaf', text: '중학교 준비가 걱정이었는데, 이야기 속에서 문법을 익히니 부담 없이 따라갑니다. 에세이 쓰기도 눈에 띄게 늘었어요.' },
]);

export const FAQS = Object.freeze([
  ['레벨테스트는 얼마나 걸리고 비용이 드나요?', '30분 정도 걸리고 무료입니다. 듣기·말하기·읽기를 가볍게 확인한 뒤, 결과지와 추천 반을 바로 상담해 드려요. 아이가 긴장하지 않도록 놀이처럼 진행합니다.'],
  ['영어를 처음 시작해도 괜찮을까요?', '네. 새싹반은 파닉스와 노래로 소리부터 익히는 반이라 처음 시작하는 친구들이 대부분입니다. 쓰기보다 듣고 따라 말하기가 먼저예요.'],
  ['한 반은 몇 명이고, 반은 어떻게 옮기나요?', '한 반 최대 6명입니다. 매 분기 말 성장 상담에서 읽기·말하기 수준을 함께 보고, 필요하면 중간에도 반을 옮길 수 있어요.'],
  ['숙제는 많은가요?', '집에서 20분 안에 끝낼 수 있게 설계했습니다. 읽은 책 한 쪽 소리 내어 읽기, 단어 카드 복습 정도라서 아이가 영어를 싫어하게 만들지 않아요.'],
  ['학원비와 교재비는 어떻게 되나요?', '반과 요일에 따라 다르며, 상담 때 안내드립니다. 교재는 학원이 선정한 그림책·리더스북을 사용하고 교재비는 분기별로 따로 받습니다. (시안이라 금액은 표시하지 않았습니다.)'],
  ['하원 셔틀이 있나요?', '인근 초등학교 3곳을 오가는 소형 셔틀을 운행합니다. 학교와 시간은 상담 때 확인해 드려요.'],
  ['결석하면 보강이 되나요?', '사전에 알려 주시면 같은 주 다른 반 시간에 보강할 수 있습니다. 방학 특강과 보강 일정은 학부모 알림장으로 따로 안내합니다.'],
]);

export const NOTICES = Object.freeze([
  { id: 'winter-special', date: '2026-10-07', tag: '특강', title: '겨울방학 특강 설명회 안내 (11월 8일)', summary: '겨울방학 3주 집중 특강의 커리큘럼과 일정을 설명드립니다.', body: ['겨울방학 특강 설명회를 11월 8일(토) 오전 11시에 학원 3층 활동실에서 엽니다.', '3주 동안 매일 90분씩 진행되며, 읽기 챌린지 · 영어 연극 · 미니북 전시로 구성됩니다.', '설명회에는 현재 재원생 학부모와 신규 상담 예정 학부모 모두 참석하실 수 있습니다. 참석을 원하시면 전화 또는 레벨테스트 신청서에 남겨 주세요.'] },
  { id: 'holiday', date: '2026-10-02', tag: '휴무', title: '10월 개천절·한글날 연휴 휴원 안내', summary: '10월 3일, 9일은 휴원하며 보강은 주중에 진행됩니다.', body: ['10월 3일(토) 개천절과 10월 9일(금) 한글날은 휴원합니다.', '해당 요일 수업은 같은 주 다른 요일에 보강하며, 시간은 알림장으로 개별 안내드립니다.', '연휴 중 상담 문의는 문자로 남겨 주시면 연휴 다음 날 순서대로 답변드립니다.'] },
  { id: 'reading-challenge', date: '2026-09-25', tag: '이벤트', title: '가을 독서 챌린지 "Book Hunters" 시작', summary: '한 달 동안 영어 그림책 20권 읽기에 도전해요.', body: ['10월 한 달간 모든 반이 참여하는 "Book Hunters" 챌린지를 시작합니다.', '그림책을 한 권 읽을 때마다 스티커를 붙이고, 20권을 채우면 이름이 새겨진 미니북 전시대에 작품이 걸립니다.', '참여는 자유이며, 읽은 책의 수는 매달 성장 리포트에 함께 담깁니다.'] },
  { id: 'open-class', date: '2026-09-18', tag: '소식', title: '파닉스 전담 Sora 선생님과 함께하는 오픈 클래스', summary: '새싹반 예비 학부모를 위한 체험 수업을 엽니다.', body: ['Sora 선생님이 진행하는 파닉스 오픈 클래스를 9월 27일 토요일 10시에 엽니다.', '만 6~7세 어린이 6명을 모집하며, 노래와 카드 게임으로 알파벳 소리를 만나는 40분 수업입니다.', '신청은 레벨테스트 신청서에서 "오픈 클래스 희망"을 남겨 주세요.'] },
]);

export const HISTORY = Object.freeze([
  ['2014', '수원 영통구에서 5명의 아이들과 새봄영어를 열었어요.'],
  ['2017', '"한 반 6명" 원칙을 정하고 성장 리포트를 시작했어요.'],
  ['2020', '파닉스 전담 선생님과 새싹반을 만들었어요.'],
  ['2023', '활동실과 도서관을 갖춘 지금의 3층으로 이전했어요.'],
  ['2026', '재원생 100여 명, 아이들이 쓴 미니북이 1,000권을 넘었어요.'],
]);

// 가상 약관 요약 (푸터 링크용)
export const LEGAL = Object.freeze({
  terms: ['이 약관은 가상 학원 "새봄영어" 시안 사이트의 이용 방법을 보여 주기 위한 예시입니다.', '수강 등록, 환불, 보강 규정은 실제 운영 시 관련 법령(학원의 설립·운영 및 과외교습에 관한 법률)과 학원 규정에 따라 별도로 정합니다.'],
  privacy: ['레벨테스트 신청 시 아이 이름, 학년, 보호자 성함, 연락처를 상담 목적으로만 이용하며, 상담 종료 후 1년 보관 뒤 파기하는 것을 예시로 합니다.', '이 시안에서는 입력한 정보가 서버로 전송되지 않습니다.'],
});
