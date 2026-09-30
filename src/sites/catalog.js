// 포트폴리오 시안 사이트 목록 (에이전시 목록·홈에서 함께 사용). 계획 전체는 docs/portfolio-sites-plan.md 참고.
// status: 'ready' = 완성, 'planned' = 제작 예정
// format: 'landing' 랜딩형 / 'homepage' 홈페이지형 / 'feature' 기능형

export const FORMATS = Object.freeze({
  landing: '랜딩형',
  homepage: '홈페이지형',
  feature: '기능형',
});

export const MOODS = Object.freeze({
  corporate: '코퍼레이트',
  calm: '차분한 미니멀',
  editorial: '감각적 에디토리얼',
  bold: '임팩트 볼드',
  luxury: '럭셔리 다크',
  tech: '테크 SaaS',
  friendly: '따뜻한 친근',
  commerce: '커머스 모던',
  interactive: '3D 인터랙티브',
});

const site = (wave, id, name, industry, mood, format, pages, summary, status = 'planned') =>
  Object.freeze({ wave, id, name, industry, mood, format, pages, summary, status });

export const SITES = Object.freeze([
  site(1, 'hangyeol-law', '한결 법률사무소', '법률', 'corporate', 'homepage', 6, '업무 분야별 상세 안내와 구성원 소개, 상담 예약까지 이어지는 법률사무소 홈페이지.', 'ready'),
  site(1, 'flowdeck', '플로우덱', 'SaaS 스타트업', 'tech', 'landing', 1, '기능 탭과 요금제 토글, 코드로 그린 제품 화면으로 가입을 이끄는 SaaS 랜딩.', 'ready'),
  site(1, 'orda-dental', '오르다치과', '치과', 'calm', 'feature', 5, '진료 과목 안내와 날짜·시간 예약 흐름을 갖춘 차분한 치과 홈페이지.', 'ready'),
  site(1, 'ondo-coffee', '온도 커피로스터스', '카페·로스터리', 'editorial', 'landing', 1, '원두 노트와 정기 구독 선택을 매거진처럼 담은 로스터리 랜딩.', 'ready'),
  site(1, 'stay-yeobaek', '스테이 여백', '숙소', 'luxury', 'feature', 4, '객실 상세와 날짜 선택 예약 흐름을 갖춘 프라이빗 스테이.', 'ready'),
  site(1, 'movelab', '무브랩', '피트니스·PT', 'bold', 'landing', 1, '시간표 필터와 무료 체험 신청을 강한 대비로 보여 주는 PT 스튜디오 랜딩.', 'ready'),
  site(2, 'daesung-precision', '대성정밀', '제조·B2B', 'corporate', 'homepage', 7, '연혁·제품·설비·인증을 갖춘 제조 기업 홈페이지.'),
  site(2, 'gyeol-hair', '결 헤어', '헤어·뷰티', 'luxury', 'landing', 1, '디자이너 선택과 시술 가격표를 담은 헤어 살롱 랜딩.'),
  site(2, 'saebom-english', '새봄영어', '학원', 'friendly', 'homepage', 5, '레벨 안내와 시간표, 레벨테스트 신청을 갖춘 영어학원 홈페이지.'),
  site(2, 'monohouse', '모노하우스', '인테리어', 'interactive', 'homepage', 5, '시공 사례와 전후 비교 슬라이더를 갖춘 인테리어 스튜디오.'),
  site(2, 'objet-market', '오브제마켓', '리빙 쇼핑몰', 'commerce', 'feature', 4, '상품 목록·상세·장바구니 흐름을 갖춘 리빙 쇼핑몰.'),
  site(2, 'seoyoon-photo', '서윤 스튜디오', '사진작가', 'calm', 'landing', 1, '갤러리 확대 보기와 촬영 문의를 담은 사진작가 포트폴리오.'),
  site(2, 'dasom-tax', '다솜세무회계', '세무·회계', 'corporate', 'homepage', 5, '업무별 안내와 필요 서류 체크리스트를 갖춘 세무사무소 홈페이지.'),
  site(2, 'sum-pilates', '숨 필라테스', '필라테스·요가', 'calm', 'landing', 1, '수업 시간표와 체험 예약을 담은 필라테스 스튜디오 랜딩.'),
  site(3, 'together-walk', '함께걷는나눔', '비영리·봉사단체', 'friendly', 'homepage', 5, '활동 소식과 후원 안내, 봉사 신청을 갖춘 비영리 단체 홈페이지.'),
  site(3, 'soopgyeol-clinic', '숲결한의원', '한의원', 'calm', 'homepage', 5, '증상별 안내와 오시는 길을 담은 한의원 홈페이지.'),
  site(3, 'yeon-dining', '연 다이닝', '파인다이닝', 'luxury', 'landing', 1, '코스 메뉴를 스크롤로 넘겨 보는 파인다이닝 랜딩.'),
  site(3, 'pinda', '핀다', '핀테크 앱', 'bold', 'landing', 1, '앱 화면이 3D로 회전하는 핀테크 사전 신청 랜딩.'),
  site(3, 'green-energy', '그린에너지재단', '공공·재단', 'corporate', 'homepage', 6, '사업 소개와 공지·자료실을 갖춘 재단 홈페이지.'),
  site(3, 'momo-illust', '모모 일러스트', '개인 작가', 'bold', 'landing', 1, '작품 필터와 의뢰 폼을 담은 일러스트레이터 포트폴리오.'),
  site(3, 'haru-pet', '하루 펫케어', '동물병원·애견미용', 'friendly', 'feature', 4, '서비스 선택부터 예약까지 이어지는 펫케어 홈페이지.'),
  site(3, 'bloom-wedding', '블룸 웨딩', '웨딩·스냅', 'editorial', 'landing', 1, '패키지 비교와 상담 예약을 담은 웨딩 스냅 랜딩.'),
  site(4, 'hanbit-realty', '한빛공인중개', '부동산', 'corporate', 'feature', 4, '매물 필터 목록과 상세를 갖춘 공인중개사무소.'),
  site(4, 'kkeut-clean', '끝클린', '입주청소·이사', 'bold', 'landing', 1, '평수별 견적 계산기를 갖춘 청소 서비스 랜딩.'),
  site(4, 'autofit', '오토핏', '자동차 정비·세차', 'bold', 'landing', 1, '차종·서비스 선택 예약을 담은 정비소 랜딩.'),
  site(4, 'kkotsaem', '꽃샘 플라워', '꽃집', 'editorial', 'feature', 4, '꽃다발 주문과 배송일 선택을 갖춘 플라워숍.'),
  site(4, 'maum-rest', '마음쉼 상담센터', '심리상담', 'calm', 'homepage', 5, '상담 분야와 첫 상담 안내를 담은 심리상담센터 홈페이지.'),
  site(4, 'codingsoop', '코딩숲', '코딩·미술 교육', 'friendly', 'landing', 1, '커리큘럼 단계와 무료 체험을 담은 어린이 교육 랜딩.'),
  site(4, 'haneulbit-church', '하늘빛교회', '종교', 'calm', 'homepage', 5, '예배 안내와 설교 목록, 새가족 안내를 담은 교회 홈페이지.'),
  site(4, 'jecheol-farm', '제철농장', '농산물 직거래', 'editorial', 'feature', 4, '제철 상품과 정기배송 선택을 갖춘 농장 직거래몰.'),
  site(4, 'sonkkeut-atelier', '손끝공방', '공방·원데이클래스', 'editorial', 'feature', 4, '클래스 달력 예약을 갖춘 공방 홈페이지.'),
  site(4, 'coach-lee', '이코치', '강사·코치', 'bold', 'landing', 1, '강의 소개와 섭외 문의를 담은 퍼스널 브랜딩 랜딩.'),
]);

export const READY_SITES = SITES.filter((item) => item.status === 'ready');

export function getSite(id) {
  return SITES.find((item) => item.id === id) || null;
}
