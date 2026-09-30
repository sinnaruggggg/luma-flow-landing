# 나나웹 홈페이지 작업 기록

작업 위치: `D:/www/mypages`. React/Vite와 기존 의존성을 유지했다. 기존 관리자·템플릿·포트폴리오 경로는 보존했다.

## 적용 내용

추가 수정: 공통 좌우 분할형 히어로와 공통 본문 순서를 제거하고, 40개 페이지를 각기 다른 렌더링 구조로 분리했다. 업종 쌍별 전용 파일은 `src/editorial/bespoke/CommerceSites.jsx`, `BrandCultureSites.jsx`, `CareLearningSites.jsx`, `StayTechSites.jsx`이며, `BespokeLayout.jsx`는 안내 표시와 경로 선택만 담당한다. 메뉴 위치, 콘텐츠 배열, 정보 탐색 방식은 페이지마다 정한다.

메인 히어로는 상단 메뉴 아래에서 화면 양 끝까지 펼쳐진다. 기존에 떠다니던 화면 카드는 제거했다. 새 모션은 한글 타이포 조립, 방향 전환, 샘플 화면 공개, 나나웹 로고로 이어지는 20초 구성이다. Studio Dumbar의 Instagram 작업에서는 움직임의 리듬과 마스크 전환을 참고했으며 원본 영상이나 상표는 사용하지 않았다. React/CSS 기반 웹 모션이며 Remotion 렌더 영상은 아니다.

- 사이트 표기는 나나웹, 운영사 표기는 나나정원으로 정리했다. 도메인과 상표 사용 가능 여부는 확인하지 않았다.
- 한글 중심의 각진 서체와 반투명 고정 메뉴를 적용했다. 히어로는 정지, 화면 이탈 정지, 동작 줄이기를 지원한다.
- 업종 8개와 스타일 5개를 조합한 독립 랜딩페이지 40개를 추가했다. 각 업종의 소개, 서비스, 이용 과정, FAQ, 요청 내용 정리 기능이 있다.
- 예산은 별도 제작 범위로 안내한다. 40개를 288개의 서로 다른 디자인이라고 표시하지 않는다. 상담 후 결정과 아직 모르겠음은 검색 조건을 넓힌다.
- 스타일 선택은 마우스 오버·키보드 초점·클릭·터치로 시각 설명을 표시한다. 모바일 안전 여백, ESC 단계별 닫기, 포커스 복귀를 지원한다.
- 기존 공용 이미지를 대신해 사이트별 실사 사진 4장씩 총 160장을 배정했다. 원본 ID와 파일 SHA-256 중복을 검사하며 작가·원본 링크·사용 조건을 두 개의 미디어 JSON에 기록한다. 각 샘플 하단에서도 사진 출처를 확인할 수 있다. 목록과 히어로의 샘플 화면은 `capture-sample-previews.mjs`로 다시 촬영한다.
- 좁은 사이드 영역에서 깨지던 폼은 컨테이너 기준으로 재배치한다. 전체 페이지 넘침뿐 아니라 입력칸의 실제 크기, 서로 겹치는지, 폼 밖으로 나가는지도 검사한다.
- 기존 12개 사례의 주소는 유지하되 현재 목록은 신규 40개만 표시한다.

## 주요 변경 파일

- `src/main.jsx`: 신규 샘플 경로 연결, 기존 앱 분리 유지.
- `src/editorial/EditorialApp.jsx`, `editorial.css`, `agency-shell.css`: 메인, 목록, 상세, 한글 표시와 고정 메뉴.
- `src/editorial/HeroMotion.jsx`, `hero-motion.css`: 웹용 타이포 모션.
- `src/editorial/components/FilterPanel.jsx`, `FilterChips.jsx`, `StylePreview.jsx`, `finder.css`: 조건검색과 스타일 설명.
- `src/editorial/SampleLanding.jsx`, `sample-landings.css`, `data/sampleCatalogue.js`: 40개 샘플과 업종별 콘텐츠.
- `src/editorial/data/projects.js`: 검색 데이터, 예산별 범위와 기존 주소 호환.
- `src/editorial/ContactSection.jsx`, `contact-section.css`, `data/agencyConfig.js`: 상담 입력, 검증, 전송 상태 처리.
- `public/agency-assets/photos`, `data/media-care-brand.json`, `data/media-commerce-stay.json`: 사이트별 실사 사진과 출처.
- `public/agency-assets/previews`: 실제 샘플 화면 미리보기.
- `scripts/agency-browser.test.mjs`, `sample-catalogue.test.mjs`, `style-preview.test.mjs`, `editorial-data.test.mjs`, `editorial-browser.test.mjs`: 회귀 검사.
- `scripts/capture-sample-previews.mjs`: 샘플 수정 후 목록 미리보기 재생성.
- `index.html`, `DESIGN.md`: 기본 제목과 현재 디자인 기준.

## 검증 명령

```powershell
node --test scripts/editorial-data.test.mjs
node scripts/agency-browser.test.mjs
node scripts/style-preview.test.mjs
node scripts/sample-catalogue.test.mjs
node scripts/editorial-browser.test.mjs
node --test scripts/sample-media-audit.test.mjs
node scripts/sample-form-geometry.test.mjs
node scripts/hero-motion.test.mjs
node node_modules/eslint/bin/eslint.js src/editorial src/main.jsx
npm run build
```

브라우저 테스트 기본 주소는 `http://127.0.0.1:4173`이다. 다른 주소는 `EDITORIAL_URL`로 지정한다. 결과와 화면은 `artifacts/agency`에 저장한다.

## 운영 전 필요한 설정

문의는 기본적으로 서버에 전송하지 않는다. 입력 검증 후 상담 내용을 기기에 텍스트 파일로 저장한다. 개인정보를 브라우저 저장소에 보관하지 않는다.

기존 문의 API를 사용하는 코드는 포함했으나 `VITE_INQUIRY_ENABLED`는 기본 false다. 수신 담당자, 지속 저장소, 개인정보 안내, 서버 중복 방지, 알림 방식을 확정하고 실제 배포 환경에서 검증한 뒤 활성화해야 한다. 이메일 알림은 이번 작업에 구현되지 않았다.

샘플의 요청 내용 정리는 로컬 체험 동작이다. 실제 병원 예약·숙박 재고·상품 주문·결제·회원가입을 처리하지 않는다. 운영할 고객 사이트에 맞춰 서버와 사업 정보를 연결해야 한다. 가상 업체를 실제 고객 실적으로 표시하지 않는다.

## 시각 검수

이전 검수의 전체 화면 넘침 검사는 좁은 영역 안의 폼 겹침을 잡지 못했다. 이전 자체 점수는 이번 수정의 품질 근거로 사용하지 않는다. 현재 검수 결과는 `docs/agency-quality-repair-plan.md`와 `artifacts/agency`의 최신 결과를 기준으로 확인한다.

자동 디자인 검사 4/6: Pretendard·모션·아이콘·반투명 메뉴 통과. Tailwind 전용 반응형 검사와 미디어 비율 검사는 일반 CSS 구현을 감지하지 못했다. 실제 미디어 비율 및 모바일 넘침은 브라우저에서 별도 확인했다. Lighthouse는 설치되지 않아 실행하지 않았다.

현재 사진은 Unsplash의 일반 무료 라이선스 사진이다. Unsplash+는 제외했다. 출처와 선별 과정은 `docs/media-care-brand.md`, `docs/media-commerce-stay.md`에 기록했다. 가상 업체의 실제 시설·상품·고객 실적을 촬영한 사진이 아니다. 전시 작품이나 건물 등 사진 속 제3자 권리는 실제 배포 용도에 맞춰 별도 확인해야 한다.

## 이번 재검수에서 확인한 내용

- 40개 사이트 × 4개 폭(360·390·768·1440px)의 폼 영역 검사 160건과 키보드 입력 흐름 40건을 통과했다.
- 40개 사이트 × 데스크톱·모바일 검사 80건에서 사진 로딩, 사진 중복, 대체텍스트, 앵커와 요청 확인을 검사했다.
- 사이트별 사진 4장, 총 160장의 원본 ID와 파일 해시가 모두 다르다. 이미지 선택 동작 17건도 실제 파일이 바뀌는지 검사한다.
- 식당 에디토리얼은 세로 목차가 있는 메뉴북으로 바꿔 쇼핑몰의 기사형 그리드와 구분했다. 독립 리뷰에서 지적한 사진 설명, 선택 상태, 접근성 그룹을 수정했다.
- 40개 첫 화면과 좁은 폼 화면을 직접 확인했다. 밝은 의료 사진 위 제목은 아래쪽 명암을 보완했다.
- 내부의 샘플·연결 예정 설명은 방문자용 서비스 안내로 바꿨다. 제작사 미리보기 도구는 본문 밖에 두고, 온라인 접수 미연결 상태는 입력 확인 뒤에 알린다.

프런트엔드 자체 평가(외부 인증 아님): 관점 8/10, 타이포 8/10, 색상 8/10, 정보 위계 8.5/10, 미디어 8/10, 모션 8.5/10, 모바일 8.5/10, 디테일 8/10. 평균 8.19/10. 실제 업체 자료가 없는 사진·운영 정보와 실기기 검증 범위가 한계다. 이 점수로 실서비스 운영 준비까지 완료됐다고 판단하지 않는다. 히어로의 크기·자간 변형은 사용자 요청에 따른 타이포 모션 연출이다.
