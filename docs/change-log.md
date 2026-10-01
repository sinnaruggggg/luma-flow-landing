# 작업 기록

## 2026-10-02 — 히어로 아래 섹션 "테크" 보강 1차 (전체 연결 + 작업 갤러리)

- **전체 연결** `src/editorial/sections/SiteHud.jsx`, `site-hud.css`
  - 왼쪽 고정 HUD: 섹션 번호 목록(지금 섹션은 긴 선), 누르면 이동, 마우스 올리면 섹션 이름, `04 / 07`·스크롤 %. 1180px 이상 마우스 환경에서만, 작업 갤러리가 고정된 동안은 숨김
  - 커서 주변에만 보이는 격자 + 페이지 좌표 (마우스 환경, 히어로 아래에서만)
  - 섹션 제목이 화면에 들어오면 히어로처럼 글자 해독 효과 (`effects.js` → `useDecodeHeadings`, 공용 함수 `decodeText`)
- **작업 갤러리** `src/editorial/sections/WorkGallery.jsx`, `work-gallery.css`
  - 넓은 화면: 섹션이 고정된 채 스크롤하면 브라우저 창 카드들이 옆으로 흐르고, 가운데에서 멀수록 3D로 기울어짐. 아래 진행 막대·`03 / 07`
  - 카드에 마우스를 올리면 X-ray 렌즈: 사진의 윤곽선만 뽑아 하늘색 설계도처럼 보여 줌 (SVG 윤곽 필터)
  - 마지막 "전체 사례 모두 보기" 카드, 키보드 Tab으로 카드에 들어가면 그 카드가 화면 가운데로
  - 모바일: 고정 없이 손가락으로 넘기는 슬라이드 / 동작 줄이기: 기존 그리드 그대로
- 검증: lint, 테스트 11개, 브라우저 회귀 1440/390/360, 빌드, 768·390·360 가로 넘침 없음, 카드 클릭·키보드 포커스 확인

## 2026-10-01 — 메인 히어로 "테크" 연출 보강

- 새 파일 `src/editorial/hero/HeroTech.jsx`, `hero-tech.css`, `useDecodeTitle.js` (기존 3D 스크롤 히어로 위에 얹음, 기존 장면은 그대로)
  - **입자 별자리**: 커서 주변 점들이 밀려나며 주황 선으로 연결, 스크롤하면 점들이 빛줄기처럼 바깥으로 튀어 나감(워프)
  - **X-ray 렌즈**: 커서를 따라다니는 원 안에서 제목이 윤곽선 + `<h1>` 태그 + 코드로 보임. 터치 기기·커서 없을 때는 큰 제목 주변을 스스로 떠다님
  - **제목 해독 효과**: 첫 화면에서 제목 글자가 무작위 글자에서 제자리로 맞춰짐
  - **HUD**: 왼쪽 위 빌드 로그 타이핑, 오른쪽 위 실시간 FPS·커서 좌표·스크롤 %
  - 떠 있는 샘플 화면에 스캔 라인이 지나감
- `hero-3d.css`: 옛 `.hero h1`(57px) 규칙에 눌려 작게 보이던 히어로 제목을 원래 설계 크기(최대 168px)로 복구
- '동작 줄이기' 설정이면 모든 연출 꺼짐, 화면 밖이거나 "모션 정지"면 애니메이션 멈춤
- 검증: lint, 테스트 11개, 브라우저 회귀 1440/390/360, 빌드, 360px 가로 넘침 없음, 렌즈 속 복제 문구 위치가 실제 문구와 픽셀 단위로 일치

## 2026-10-01 — 문의 관리자 + 나나웹 안드로이드 알림 앱

- **보안**: `api/_lib/auth.js`에 박혀 있던 관리자 비밀번호·서명키 삭제 (공개 저장소에 노출돼 있었음). 이제 Vercel 환경 변수 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`(32자 이상)이 모두 있어야 로그인 가능, 없으면 503
- **문의 API**: 새 문의는 `status: "new"`로 저장. `GET /api/admin/inquiries?since=ISO` (앱용 새 문의만), `PATCH` 로 상태(new/progress/done)·메모 변경. 접수 응답에서 내부 정보 제거
- **관리자 페이지** `/admin` (`src/admin/`): 로그인, 상태별 건수, 검색, 상세(전화·메일·복사), 상태 변경, 메모, 1분 자동 새로고침, 모바일 목록↔상세
- **안드로이드 앱** `apps/android` (Kotlin + Compose): 관리자 로그인(90일 유지), 문의 목록·상세·상태·메모, 앱을 닫아도 15분마다 새 문의 확인 → 휴대폰 알림, 알림 누르면 그 문의로 이동. 빌드 방법은 `apps/android/README.md`
- 테스트: `scripts/inquiry-api.test.mjs` (접수·권한·위조 토큰·상태/메모·since 필터)

## 2026-09-30 — 작업 저장(git) + 2차 시안 3개

- **git**: 5월 이후 커밋되지 않았던 작업 전체를 커밋·푸시 (`daa5362`). 비밀값 파일은 제외 확인, 작업용 임시 파일·보관 폴더는 `.gitignore`에 추가. GitHub push 시 Vercel `nanaweb`이 자동 배포됨
- **`.env.local` 점검**: Vercel 로그인 토큰만 있음. Gemini·Stitch 키는 `.env`에 그대로 있음
- **2차 이미지 프롬프트**: `docs/image-prompts/wave2.md` (8개 사이트, 42장, 코드 블록 안에 저장 위치 포함)
- **kit**: `SitePhoto` 컴포넌트 + `resolvePhoto(siteId, value, ready)` — 이미지가 준비되기 전엔 보유 사진(fallback) 또는 자리표시 상자. 각 사이트 `content.js`의 `READY_IMAGES`에 파일명을 넣으면 교체됨
- **새 시안 3개 (보유 사진으로 완성, 목록에 공개)**
  - 오브제마켓 `objet-market` — 커머스 / 기능형: 분류·정렬 목록, 상세(색상·수량), 찜, 장바구니(무료배송 진행 막대), 주문서 → 완료
  - 새봄영어 `saebom-english` — 따뜻한 친근 / 홈페이지 5p: 3문항 반 추천, 반별 커리큘럼, 반별 시간표 탭, 레벨테스트 신청
  - 다솜세무회계 `dasom-tax` — 따뜻한 코퍼레이트 / 홈페이지 5p: 오늘 기준 신고 기한 D-day, 업무별 서류 체크리스트(진행률·인쇄), 수수료표, 상담 신청
- 검증: lint, 데이터 테스트 7개, 브라우저 회귀 1440/390/360, 빌드, 쇼핑·반 추천·체크리스트 흐름 직접 실행

## 2026-09-29 — 조건 검색 "선호 스타일" 미리보기 개선

- 문제: 스타일에 마우스를 올리면 알아볼 수 없는 도형 미리보기가 옵션 위를 통째로 덮음
- `StylePreview.jsx` 재작성: 옵션 **아래 고정 자리**에 그 스타일의 **실제 시안 썸네일(최대 3개) + 보기 ↗ 링크** 표시. 평소엔 안내 문구, 선택 후엔 선택한 스타일 유지
- `FilterPanel.jsx`: 떠 있는 미리보기의 잠금·닫기·Esc 처리 제거. 스타일 영역(옵션+미리보기)을 벗어날 때만 초기화 → 옵션에서 링크로 내려가도 사라지지 않음
- `finder.css`: 옛 오버레이 스타일 삭제, 인라인 미리보기 스타일 추가
- 검증: 모든 스타일 호버 시 옵션 가림 없음(1440·390), 링크 도달, 브라우저 회귀 테스트 1440/390/360 통과, 배포 후 실제 주소에서 동일 테스트 통과

## 2026-09-29 — 1차 GPT 이미지 적용 + 재배포

- GPT 이미지 25장(5개 사이트)을 WebP로 변환해 `public/sites/<id>/*.webp`에 배치 (54MB → 3.2MB). 원본 PNG는 `assets-src/sites/`에 보관, 배포 제외
- `src/sites/_kit/media.js`에 `resolvePhoto()` 추가: 각 사이트 `content.js`의 PHOTOS 값이 문자열이면 보유 사진, `{ file, alt }`이면 사이트 전용 이미지
- 무브랩: 히어로 배경 사진 + 스튜디오 갤러리 섹션 추가 (흑백 → 호버 시 컬러)
- 포트폴리오 썸네일·홈 히어로 3D 화면 12장 재캡처
- 검증: lint, 데이터 테스트 7개, 빌드, 배포 후 실제 주소에서 9개 페이지·이미지·콘솔 에러 없음·`/samples` 이동 확인

## 2026-09-28 — 1차 시안 6개 완성 + 옛 40개 샘플 폐기 + 재배포

### 새 시안 사이트 (src/sites/<id>)
- 오르다치과 `orda-dental` — 차분한 미니멀·신뢰 / 기능형: 진료 선택 → 달력 → 시간 → 정보 → 확인 5단계 예약, 진료 상세 6개, 의료진, 이용 안내
- 온도 커피로스터스 `ondo-coffee` — 에디토리얼 / 랜딩: 원두 추천 퀴즈, 정기구독 조합·가격 계산
- 스테이 여백 `stay-yeobaek` — 럭셔리 다크 / 기능형: 객실 상세 3개, 두 달 달력 기간 선택·인원·옵션·요금 계산
- 무브랩 `movelab` — 임팩트 볼드 / 랜딩: 스크롤 연동 글자 띠, 시간표 요일·종류 필터, 무료 체험 폼 (GPT 이미지는 content.js의 IMAGES에 파일명만 넣으면 표시)

### 옛 샘플 폐기
- `/projects`·홈 "작업"·검색은 이제 `src/sites/catalog.js`의 완성 사이트만 보여 줌 (`src/editorial/data/projects.js` 재작성)
- 검색 예산 옵션 = 라이트/스타터/스탠다드/프리미엄/상담 (높은 구간을 고르면 낮은 구간 사례도 포함)
- 썸네일·히어로 3D 화면 = 새 사이트 캡처 12장 (`public/agency-assets/sites/`)
- 옛 샘플 코드·캡처·전용 스크립트는 삭제하지 않고 `_archive/old-samples-2026-09-28/`로 이동 (빌드·배포·lint 제외, 필요 없으면 폴더째 지우면 됨)
- `/samples/*` 주소는 `/projects`로 이동
- 가격: 유지보수 월 10만원부터, 비영리 별도 지원가 문구 삭제

### 검증
- lint(수정 범위), 빌드, 데이터 테스트 7개, 브라우저 테스트 1440/390/360, 배포 빌드 경로 테스트 통과
- Vercel 배포 완료: https://nanaweb-nine.vercel.app

## 2026-09-28 — 가격 4단계 조정 + 홈 하단 인터랙션

### 가격
- `homeContent.js`의 `PRICING_PLANS`: 라이트 45 / 스타터 90 / 스탠다드 150(강조) / 프리미엄 250만원부터 ('프로' → '프리미엄')
- 가격표 4칸 (태블릿 2×2, 모바일 1열), 문의 폼 예산 선택지도 새 가격대로 조정

### 인터랙션 (모두 `prefers-reduced-motion`이면 꺼짐)
- 새 파일 `src/editorial/sections/effects.js`: `usePageProgress`, `useMagnetic`, `usePointerVars`, `useActiveStep`, `useCountUp`
- 헤더 아래 스크롤 진행 막대, 섹션 제목 마스크 등장, 주요 버튼 커서 따라오기(`data-magnetic`)
- 04 품질 기준: 항목별 "검사 중 → ✓ 통과", 3D 분해도 커서 기울기 + 스캔 평면
- 05 과정: 스크롤 진행선 + 현재 단계 강조
- 06 비용: 금액 카운트업, 커서 조명 + 윗선
- 07 FAQ: 부드럽게 펼치기 (`::details-content`, 미지원 브라우저는 즉시 펼침)
- 문의 입력칸 초점 강조선, 푸터 큰 글자 솟아오르기 + 커서 근처 글자 들림

### 검증
- lint, 빌드, `editorial-browser.test.mjs`(1440/390/360) 통과, 콘솔 에러 없음

## 2026-09-28 — 홈 리디자인 (Craft × Code)

### 요청
- 홈을 감각적인 전문 웹 개발 스튜디오 사이트처럼 개편한다.
- 대상: 개인·스타트업·기업·비영리 등 다양. 회사 정보는 임시값. 가격은 구간별 시작가 + 상담.
- 히어로는 새로 만들고 3D·스크롤 연출을 사용한다.

### 새 파일
- `src/editorial/hero/Hero3D.jsx`, `hero-3d.css` — 스크롤 연동 3D 히어로 (샘플 화면 12장이 3D 터널처럼 배치됨, 새 라이브러리 없이 CSS 3D)
- `src/editorial/sections/HomeSections.jsx`, `home-sections.css` — 역량 띠, 작업, 서비스, 대상, 품질 기준(3D 분해도), 과정, 비용, FAQ
- `src/editorial/sections/useReveal.js` — 스크롤 등장 효과
- `src/editorial/data/homeContent.js` — **홈 문구·가격·FAQ 수정은 이 파일에서**
- `src/editorial/studio-shell.css` — 버튼, 헤더 문의 버튼, 가로형 프로젝트 찾기 버튼, 새 푸터

### 수정 파일
- `src/editorial/EditorialApp.jsx` — Home 구성, Header 메뉴, Footer 교체
- `src/editorial/components/ProjectGrid.jsx` — `variant="featured"` 옵션 추가 (기본값은 기존과 동일)
- `src/editorial/data/agencyConfig.js` — 임시 연락처·사업자 정보 (`contact`, `business`)
- `src/editorial/ContactSection.jsx` — 접수 상태 문구 정리, 연락 채널 목록 추가

### 보존한 부분
- `/projects`, `/projects/:id`, `/samples/:id`, 관리자·레거시 화면, 조건 검색 모달, 문의 폼 로직
- 테스트가 쓰는 `.hero-art`, `.finder-rail`, `.motion-control` 클래스
- 기존 `HeroMotion.jsx`, `hero-motion.css`는 삭제하지 않음 (되돌리려면 EditorialApp의 Home에서 `<Hero3D />`를 교체)

### 사업자 정보 (2026-09-28 반영)
- `agencyConfig.js`: 상호 나나정원, 사업자등록번호, 이메일 sinnaru@naver.com
- 사업장 소재지·대표자 이름은 요청에 따라 표시하지 않음
- 전화·카카오 채널은 비워 두면 화면에 표시되지 않음 (값을 넣으면 푸터·문의 영역에 자동 표시)

### 임시값 (실제 정보로 교체 필요)
- `homeContent.js`: 가격 시작가 4단계(라이트 45 / 스타터 90 / 스탠다드 150 / 프리미엄 250만원, 2026-09-28 조정), 유지보수 월 10만원(비영리 별도 지원가 문구 삭제), 결제 조건, 수정 횟수
- `ContactSection.jsx` 예산 선택지를 새 가격대(50만원 이하 ~ 300만원 이상)로 조정

## 2026-04-21

### 요청
- 사이트 상세 보기 화면의 상단 툴바에 `돌아가기` 버튼을 복구한다.
- 기존 `PC / Mobile / 문의하기` 툴바 흐름은 유지한다.
- 모든 페이지 이미지에서 외국인 모델 이미지가 남아 있는지 확인한다.

### 분석
- 상세 보기 툴바 컴포넌트는 `src/components/showcaseChrome.jsx`의 `PreviewToolbar`에서 관리된다.
- 상세 보기 화면은 `SiteView`에서 툴바와 선택된 샘플 페이지를 렌더링한다.
- 툴바 버튼 스타일은 `src/site-app.css`의 `.site-preview-toolbar` 계열 스타일에서 관리된다.
- 이미지 교체 작업 이후 실제 페이지 소스에는 `aida-public` 또는 `lh3.googleusercontent.com/aida-public` 원격 이미지 URL이 남아 있지 않았다.

### 수정 파일
- `src/components/showcaseChrome.jsx`
- `src/site-app.css`

### 핵심 변경
- `PreviewToolbar`에 `돌아가기` 버튼을 추가했다.
- `돌아가기` 버튼은 툴바의 맨 왼쪽에 배치했다.
- `SiteView`에서 전달받은 `onBack` 동작을 툴바 버튼에 연결했다.
- 버튼 텍스트가 좁은 화면에서 줄바꿈되지 않도록 툴바 버튼에 `white-space: nowrap`을 적용했다.
- 데스크톱 상세 보기 툴바 순서를 `돌아가기 / PC / Mobile / 문의하기`로 정리했다.
- 실제 모바일 클라이언트에서는 기존처럼 PC/Mobile 토글을 숨기고 `돌아가기 / 문의하기` 중심으로 동작하게 유지했다.

### 보존한 부분
- 상세 보기 화면의 기존 프리뷰 구조는 유지했다.
- PC/Mobile 전환 로직은 유지했다.
- 문의하기 버튼과 문의 폼 이동 흐름은 유지했다.
- 샘플 페이지를 iframe이나 페이지 안의 페이지 형태로 다시 넣지 않았다.
- 카드 썸네일, 샘플 HTML, 이미지 교체 결과는 이번 작업에서 추가로 건드리지 않았다.

### 검증
- `npm run lint` 통과.
- `npm run build` 통과.
- `design/stitch`, `public`, `src` 경로에서 `aida-public`, `lh3.googleusercontent.com/aida-public` 검색 결과 없음.

### 배포 상태
- 이번 기록 작성 시점 기준, `돌아가기` 버튼 관련 코드 변경은 아직 GitHub에 커밋/푸시하지 않았다.
- 배포 요청 시 아래 파일을 함께 커밋하면 된다.
  - `src/components/showcaseChrome.jsx`
  - `src/site-app.css`
  - `docs/change-log.md`

### 다음 확인 항목
- 실제 배포 후 상세 보기에서 `돌아가기` 버튼이 카드 목록으로 정상 복귀하는지 확인한다.
- PC 화면에서 `PC / Mobile` 전환이 유지되는지 확인한다.
- 모바일 실기기에서 툴바가 줄바꿈 또는 가로 넘침 없이 보이는지 확인한다.
- 남은 사람 얼굴 이미지는 자동 URL 검색이 아니라 실제 화면 기준으로 한 번 더 육안 검수한다.
