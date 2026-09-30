# 에디토리얼 홈페이지

## 1. 분석

작업 폴더: **D:\www\mypages**. React·Vite를 유지했습니다. C:에 있던 이전 시안은 D:의 concepts 폴더로 복사해 보존했고 C: 미리보기 서버는 종료했습니다. 기존 관리자, 템플릿, 포트폴리오, API와 기존 수정 내역은 유지했습니다.

## 2. 계획과 디자인

시안 3의 에디토리얼 구조에 시안 5의 녹색을 결합했습니다. 한글 세리프 제목, Sans-serif 본문, Monospace 메타 정보와 얇은 선을 사용했습니다. 디자인 스킬은 DESIGN.md 기준 정리와 반응형·접근성 검증에 적용했고 한국어 문구는 과장된 실적 없이 작성했습니다.

히어로에는 사진·종이·타이포가 느리게 움직이는 그래픽을 배치했습니다. 정지 버튼을 제공하고 시스템의 동작 줄이기 설정과 화면 밖 정지를 지원합니다.

## 3. 변경 파일과 구현

| 파일 | 역할 |
|---|---|
| src/main.jsx | 새 홈페이지와 기존 화면의 진입·스타일 분리 |
| src/App.jsx | 기존 화면에서 홈 이동 시 새 홈페이지로 연결; 기존 수정 보존 |
| index.html | 홈페이지 제목·설명·테마 색상 |
| src/editorial/EditorialApp.jsx | 메인, 결과, 상세, 없는 주소 화면 |
| src/editorial/HeroMotion.jsx | 히어로 모션과 정지·동작 줄이기 |
| src/editorial/editorial.css | 에디토리얼 레이아웃과 반응형 |
| src/editorial/components/ProjectFinderCTA.jsx | 데스크톱 세로 CTA, 모바일 인라인 CTA, 푸터 감지 |
| src/editorial/components/FilterPanel.jsx | 조건검색, 포커스 순환·복귀, 스크롤 잠금 |
| src/editorial/components/FilterChips.jsx | 선택 상태와 개별 해제 |
| src/editorial/components/finder.css | 패널·라디오·모바일 터치 영역 |
| src/editorial/components/ProjectGrid.jsx | PC 2열·모바일 1열 사례 목록 |
| src/editorial/components/ProjectCard.jsx | 이미지, 메타, 상세 링크 |
| src/editorial/data/projects.js | 12개 예시, 필터 옵션·검증·검색·추천 |
| scripts/editorial-data.test.mjs | 데이터 단위 테스트 |
| scripts/editorial-browser.test.mjs | 1440·390·360px 동작·스크린샷 테스트 |
| scripts/editorial-routes.test.mjs | 배포용 빌드 및 기존 경로 회귀 검사 |
| DESIGN.md, docs/editorial-plan.md | 디자인 기준 및 실행 계획 |
| .gitignore | D: 로컬 npm 캐시 제외 |

URL의 budget / industry / style이 확정된 조건입니다. 패널 안의 선택은 임시 상태이며 닫으면 취소됩니다. 세 가지를 모두 선택한 뒤 결과 보기를 누르면 URL에 반영됩니다. 새로고침과 뒤로가기·앞으로가기를 지원합니다.

결과는 세 조건의 정확 일치로 검색합니다. 일치 결과가 없으면 업종 또는 스타일이 같은 사례만 최대 3개 추천합니다. 상세 링크에는 검증된 필터만 유지하며 임의 쿼리는 전파하지 않습니다.

CMS/API 연동 시 projects.js의 데이터 공급 부분을 교체하면 됩니다. id, title, thumbnail, budgetRange, industry, style, summary, url 필드와 OPTIONS의 값 체계를 유지하세요.

## 4. 실행과 검증

PowerShell에서 실행합니다.

```powershell
Set-Location D:\www\mypages
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

미리보기: http://127.0.0.1:4173/

```powershell
node --test scripts/editorial-data.test.mjs
node node_modules/eslint/bin/eslint.js src/editorial src/main.jsx src/App.jsx
npm run build
node scripts/editorial-browser.test.mjs
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
# 별도 터미널에서
node scripts/editorial-routes.test.mjs
```

브라우저 테스트의 Chromium 경로는 현재 PC에 맞춰져 있습니다. 다른 PC에서는 PLAYWRIGHT_CHROMIUM_EXECUTABLE 환경변수로 설치된 Chromium 실행 파일을 지정하세요. EDITORIAL_URL로 테스트 서버 주소를 바꿀 수 있습니다.

- 데이터 테스트 5개 통과.
- 변경한 React 소스 lint 통과.
- 전체 12개 프로젝트 이미지 로딩·디코딩과 정방향·역방향 Tab 포커스 순환 확인.
- 배포용 빌드 통과.
- 1440px, 390px, 360px 검색 흐름 통과: 선택 해제, 초기화, 비활성 버튼, 포커스 유지·복귀, ESC·닫기·배경 닫기, URL 새로고침·이력, 상세, 유사 추천, 없는 사례, 푸터 CTA, 동작 줄이기.
- 배포용 /, /projects, /projects/[id], 기존 /templates, /portfolio 및 기존 화면의 홈 복귀 확인.
- 스크린샷과 결과 JSON: artifacts/editorial/.

### 디자인 자체 평가

공인 점수가 아닌 내부 점검입니다. 관점 8 / 타이포 8 / 색상 9 / 위계 8 / 미디어 7 / 모션 8 / 모바일 8 / 디테일 8, 평균 8.0/10.

낮은 항목은 실제 브랜드 사례가 아닌 예시 사진을 쓰는 미디어입니다. 모바일 장식 문구 겹침과 패널 포커스 이탈을 수정했습니다. 스킬의 자동 감사는 Tailwind·Lucide 등 특정 라이브러리 사용을 검사하므로 기존 CSS 방식에서는 일부 경고가 발생합니다. 실제 aspect-ratio, 반응형, 키보드 조작은 별도로 검증했습니다.

## 5. 남은 확인 사항

- FORM & FIELD는 임시 브랜드이며 모든 사례·예산은 예시입니다. 실제 회사명, 제작 사례, 사용권이 확인된 이미지로 교체하세요.
- 상담 CTA는 상담 준비 안내를 엽니다. 실제 연락처가 없어 문의를 수집하거나 전송하지 않으며 접수 성공을 표시하지 않습니다. DB·Telegram·Sheets·GTM 전송은 추가하지 않았습니다. 실접수 연결 후에는 중복 방지·개인정보·실패 처리를 별도 검증해야 합니다.
- 이미지와 웹폰트는 외부 네트워크에 의존합니다. 오프라인·저속망과 Safari·Firefox 실기기 정밀 검사는 미실시입니다.
- 공개 배포는 하지 않았습니다. 기존 수정이 많은 저장소이므로 전체 파일을 되돌리지 말고 위 변경 범위만 확인하세요.
- 기존 설치 충돌 복구 과정에서 npm 캐시는 D:에 두었습니다. package.json과 package-lock.json은 변경하지 않았고 새 라이브러리는 추가하지 않았습니다.

다음 단계는 실제 콘텐츠 교체, 상담 접수 연결, 이미지 최적화와 실기기 검증입니다.
