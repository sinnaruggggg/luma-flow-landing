// 실제로 제작한 고객 사이트 목록입니다. (가상 시안 사이트는 src/sites/catalog.js)
// 썸네일: public/agency-assets/clients/<id>.webp — 사이트가 바뀌면 화면을 다시 찍어 교체합니다.
// 항목을 추가하면 홈·프로젝트 목록·검색·상세 페이지에 자동으로 나타납니다.
// budget: light/starter/standard/premium · industry/style: projects.js 의 OPTIONS 값

export const CLIENT_WORKS = Object.freeze([
  {
    id: 'pccm', title: 'PCCM 커스텀 폰케이스', url: 'https://www.pccm.co.kr/',
    summary: '사진 선택부터 출력까지 2~3분 만에 끝나는 커스텀 폰케이스 머신 브랜드. 제품·운영 사례·창업 안내를 한 사이트에 담았습니다.',
    industry: 'it', style: 'impact', budget: 'premium', field: '제조·창업 브랜드', mood: '임팩트 볼드', format: '브랜드 홈페이지',
  },
  {
    id: 'deoksong-law', title: '법무법인 덕송', url: 'https://deoksonglaw.com/',
    summary: '개인회생·개인파산 비공개 상담을 받는 법무법인 홈페이지. 첫 화면에서 바로 상담을 신청할 수 있게 구성했습니다.',
    industry: 'brand', style: 'trust', budget: 'standard', field: '법률', mood: '신뢰·차분함', format: '상담형 홈페이지',
  },
  {
    id: 'myeongdang-lab', title: '명당연구소', url: 'https://pungsumaster.com/',
    summary: '주소와 평면도로 방 배정·가구 방향을 안내하는 풍수 진단 서비스. 무료 진단과 비보 쇼핑까지 이어지는 흐름입니다.',
    industry: 'other', style: 'editorial', budget: 'premium', field: '생활 서비스', mood: '전통·에디토리얼', format: '서비스 플랫폼',
  },
  {
    id: 'shorts-dotcom', title: '쇼츠닷컴', url: 'https://xn--mk1bv8zo8ijya.com/',
    summary: '문의와 예약으로 이어지는 숏폼 영상을 만드는 마케팅 회사. 성과 수치·영상 사례·요금제를 한 화면에서 비교하게 했습니다.',
    industry: 'it', style: 'impact', budget: 'standard', field: '마케팅·영상', mood: '테크·성과 중심', format: '서비스 랜딩',
  },
  {
    id: 'dyd-shipping', title: '디와이디해운항공', url: 'https://sinnarugg.dothome.co.kr/dyd-renewal/site/index.html',
    summary: '해상·항공·통관·3PL 종합물류 기업의 홈페이지 리뉴얼 시안. 견적 문의와 글로벌 소싱 문의를 전면에 배치했습니다.',
    industry: 'brand', style: 'trust', budget: 'standard', field: '물류·B2B', mood: '코퍼레이트', format: '기업 홈페이지 (리뉴얼 시안)',
  },
  {
    id: 'dalra', title: '달드라', url: 'https://lee150704.cafe24.com/skin-skin6/',
    summary: '제철 과일·과일 선물·과일도시락을 파는 카페24 쇼핑몰 스킨. 오늘의 특가와 기획전을 첫 화면에서 바로 고르게 했습니다.',
    industry: 'retail', style: 'photography', budget: 'standard', field: '식품 쇼핑몰', mood: '따뜻한 커머스', format: '카페24 쇼핑몰',
  },
  {
    id: 'line-corner', title: '라인앤코너', url: 'https://linecorner.kr/',
    summary: '욕실·아파트 프리미엄 줄눈 시공 브랜드. 시공 포트폴리오와 자재 안내, 카카오톡 실시간 문의로 연결됩니다.',
    industry: 'other', style: 'photography', budget: 'starter', field: '인테리어 시공', mood: '모던 다크', format: '브랜드 홈페이지',
  },
]);
