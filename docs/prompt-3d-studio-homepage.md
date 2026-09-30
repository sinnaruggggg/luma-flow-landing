# 프롬프트: "Craft × Code" 3D 스크롤 웹 에이전시 홈페이지

> 이 문서 전체를 GPT·Codex 같은 AI에게 그대로 붙여넣으면 같은 방식의 홈페이지를 만들 수 있습니다.
> `{{ }}`로 표시된 값만 내 회사 정보로 바꾸세요.

---

## 0. 역할과 목표

너는 시니어 프론트엔드 개발자이자 인터랙션 디자이너다.
**웹사이트 기획·디자인·개발 스튜디오**의 홈페이지를 만든다.

- 목표 인상: "감각적인 디자인 스튜디오 + 정밀한 개발팀" (콘셉트명 **Craft × Code**)
- 첫 화면 3초 안에 **누구인지 / 무엇을 하는지 / 다음 행동(문의)**이 보여야 한다.
- 3D와 스크롤 연출은 **새 라이브러리 없이 CSS 3D transform + requestAnimationFrame**으로만 구현한다. three.js, GSAP 사용 금지.
- 기술: React + Vite (JSX, 일반 CSS 파일). 순수 HTML/JS로 만들 때도 구조와 수치는 동일하게 유지한다.
- 한국어 우선. 영어는 꼭 필요한 기술 용어만 쓴다.

### 입력값 (내 정보로 교체)
```
BRAND_NAME = {{나나웹}}
COMPANY_NAME = {{나나정원}}
EMAIL = {{hello@example.com}}
PHONE = {{02-000-0000}}
MESSENGER = {{카카오톡 채널 @브랜드}}
HOURS = {{평일 10:00 – 18:00}}
OWNER = {{대표자명}}
BIZ_NUMBER = {{000-00-00000}}
ADDRESS = {{서울특별시 ○○구}}
SCREEN_IMAGES = {{내 작업/샘플 사이트 첫 화면 캡처 12장, 1440×1000 JPG, 장당 50~100KB}}
```

---

## 1. 디자인 시스템

### 색상 (CSS 변수)
```css
:root{
  --paper:#f5f5f2;   /* 기본 배경: 따뜻한 흰색 */
  --ink:#172023;     /* 글자·짙은 섹션 배경 */
  --muted:#62686a;   /* 보조 글자 */
  --line:#c9cdcc;    /* 얇은 구분선 */
  --green:#263e43;   /* 보조 짙은 녹색 (문의 영역) */
  --accent:#d9492f;  /* 포인트 코랄: 한 화면에 한두 곳만 */
  --accent-on-dark:#ff7a5c; /* 짙은 배경 위 포인트 */
  --sans:Pretendard,'Malgun Gothic',sans-serif;
  --mono:'Courier New',monospace;
}
```
Pretendard 폰트는 `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`로 불러온다.

### 규칙
- **금지**: 둥근 모서리 카드, 장식용 그라데이션, 네온, 글래스모피즘 남용, 커스텀 커서
- **사용**: 각진 버튼, 1px 선, 큰 굵은 한글 타이포, 넉넉한 여백
- 제목: `font-weight:800~850; letter-spacing:-.06em; line-height:1.0~1.1; word-break:keep-all`
- 섹션 번호: `01 —— 작업` 형태. 번호는 모노스페이스 + 포인트색, 가운데에 28px 선
- 섹션 배경 리듬: 종이색 → 잉크색 → 종이색 → 연회색(#ebebe5) 순으로 번갈아 긴장감을 준다.
- 버튼 3종 (높이 54px, 좌우 여백 28px, 굵기 750, 테두리 1px)
  - `.btn--solid`: 잉크 배경 + 흰 글자, hover 시 포인트색
  - `.btn--line`: 투명 배경 + 잉크 테두리, hover 시 잉크로 채움
  - `.btn--accent`: 포인트색 배경, hover 시 종이색

---

## 2. 페이지 구조 (위 → 아래)

| 순서 | 섹션 | 핵심 |
|---|---|---|
| 0 | 고정 헤더 | 높이 76px(모바일 66px), 반투명 종이색 + `backdrop-filter:blur(20px)`. 메뉴: 프로젝트·서비스·과정·비용·FAQ + 오른쪽 **[프로젝트 문의]** 잉크색 버튼. 1100px 이하에서는 서비스·과정·비용·FAQ를 숨긴다 |
| 1 | **3D 스크롤 히어로** | 아래 3장에서 자세히 설명 |
| 2 | 흐르는 역량 띠 | 잉크 배경. 큰 글자(28~72px)가 가로로 무한히 흐름. 짝수 항목은 외곽선 글자(`-webkit-text-stroke`), 항목 사이 포인트색 작은 사각형. 42초 주기, hover 시 정지 |
| 3 | 01 작업 | 12칸 그리드 비대칭 배치: 7칸/5칸, 5칸/7칸 반복. 짝수 카드는 위쪽 여백(60~150px)으로 엇갈림. 카드 hover 시 `perspective(1400px) rotateX(4deg) rotateY(-3deg) translateY(-8px)` + 그림자. 캡션 왼쪽에 `01`, `02` 번호(CSS counter) |
| 4 | 02 서비스 | 왼쪽: 4줄 목록(번호, 제목, 설명, 태그, 기간). 오른쪽: sticky 미리보기 이미지. 줄에 마우스를 올리면 미리보기가 페이드로 교체되고, 프레임은 `rotateY(-12deg) rotateX(5deg)`로 기울어 있다가 hover 시 정면으로. 1100px 이하에서는 미리보기를 목록 위로 올리고 기울기를 없앤다 |
| 5 | 03 대상 고객 | 4칸 격자(개인·스타트업·기업·비영리). 칸 hover 시 잉크색으로 반전 |
| 6 | 04 품질 기준 | 잉크 배경. 왼쪽: 기준표(반응형 검수, 접근성, 속도, 검색 노출, 관리 편의, 인계). 오른쪽: **3D 분해도** (아래 4장) |
| 7 | 05 과정 | 왼쪽 제목 sticky, 오른쪽 4단계. 단계 번호는 큰 외곽선 숫자. 각 단계에 산출물·기간 |
| 8 | 06 비용 | 4칸 가격표(세 번째 칸 잉크 배경 + "가장 많이 선택" 배지). 칸 사이는 1px 잉크 선(gap:1px + 배경). 큰 숫자 + "만원부터". 아래에 ※ 안내문 |
| 9 | 07 FAQ | 왼쪽 제목 sticky, 오른쪽 `<details>` 아코디언. + 아이콘이 열리면 −로 바뀜 |
| 10 | 문의 | 짙은 녹색 박스. 왼쪽: 제목 + 연락 채널 목록. 오른쪽: 문의 폼 |
| 11 | 푸터 | 잉크 배경, 화면 폭을 채우는 거대한 브랜드명(90~360px), 메뉴·연락처·사업자 정보 3열 |

+ 화면 오른쪽 아래 고정 버튼 "■ 내 프로젝트 찾기" (푸터가 보이면 숨김, 모바일에서는 본문 안 버튼으로 대체)

---

## 3. 3D 스크롤 히어로 — 정확한 구현 명세

### 3-1. 원리
- 섹션 높이를 화면보다 길게(340vh) 만들고, 안쪽 무대(stage)를 `position:sticky`로 고정한다.
- 스크롤 진행도 `p = clamp01(-section.top / (section.height - stage.height))` (0~1)
- 샘플 사이트 화면 12장을 **Z축 터널**에 배치하고, 시간(drift)과 스크롤(p)만큼 앞으로 이동시킨다. 카메라가 화면들 사이를 날아 지나가는 느낌이 난다.
- 매 프레임 JS가 각 화면의 `transform`과 `opacity`를 직접 계산한다. React state는 쓰지 않는다(리렌더 방지).

### 3-2. 마크업
```html
<section class="hero3d" aria-labelledby="hero-title">          <!-- height:340vh -->
  <div class="hero3d__stage">                                   <!-- sticky, overflow:hidden -->
    <div class="hero3d__space" aria-hidden="true">              <!-- perspective:1100px -->
      <div class="hero3d__floor"></div>                         <!-- 원근 격자 바닥 -->
      <div class="hero3d__world">                               <!-- preserve-3d, 마우스 기울기 -->
        <figure class="hero3d__screen">                         <!-- ×12 -->
          <span class="hero3d__chrome"><i></i><i></i><i></i></span>
          <img src="screen-01.jpg" alt="">
        </figure>
      </div>
    </div>
    <div class="hero3d__copy">  <!-- 장면1: 작은 제목 + H1 두 줄 + 설명 + 버튼 2개 --> </div>
    <div class="hero3d__mid" aria-hidden="true">  <!-- 장면2: "누구의 웹사이트든," + 단어 4개 겹침 + "그 목적에 맞게 만듭니다." --> </div>
    <div class="hero3d__end" aria-hidden="true">  <!-- 장면3: 잉크 패널 + "보는 순간 이해되고, 누르는 순간 작동하는 웹." --> </div>
    <div class="hero3d__hud">  <!-- 모션 정지 버튼 + 진행 막대 + "스크롤" 힌트 --> </div>
  </div>
</section>
```
H1은 **화면에 보이는 진짜 텍스트**로 둔다: `생각을 / <em>작동하는</em> 웹으로.` (em은 포인트색)

### 3-3. 핵심 수치 (그대로 사용)
| 항목 | PC | 모바일(≤760px) |
|---|---|---|
| 섹션 높이 | 340vh (≤1100px: 300vh) | 270vh |
| 무대 | `top:헤더높이; height:calc(100svh - 헤더높이); min-height:540px` | min-height 520px |
| 원근 | `perspective:1100px; perspective-origin:50% 42%` | 동일 |
| 화면 폭 `--sw` | `clamp(220px,23vw,380px)` | `44vw` |
| 사용 화면 수 | 12 | 9 (나머지는 `visibility:hidden`) |
| 타원 반경 rx / ry | 무대폭×0.5 / 무대높이×0.4 | ×0.56 / ×0.36 |
| 화면 간격 gap | 420px | 340px |
| 카메라 앞 한계 near | 520px | 420px |
| 나타나기 시작 fadeStart | −2100px (1000px 구간 동안 페이드인) | −1700px |

### 3-4. 프레임 계산 (의사코드 — 그대로 구현)
```js
const clamp01 = v => Math.min(1, Math.max(0, v));
const range = (p, a, b) => clamp01((p - a) / (b - a));
const easeInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

// 배치 (resize 때마다 다시 계산)
count = isMobile ? 9 : 12
depth = count * gap
for i in 0..count-1:
  angle = i * 2.399963 + 0.6          // 황금각으로 흩뿌려 겹침 방지
  x = cos(angle) * rx;  y = sin(angle) * ry
  offset = i * gap

// 매 프레임
p = reduced ? 0 : clamp01(-section.getBoundingClientRect().top / (section.offsetHeight - stage.offsetHeight))
if (!paused && !reduced) drift += dt * 0.05          // 초당 50px 자동 전진
pointer.x += (pointer.tx - pointer.x) * 0.06          // 마우스 부드럽게 따라가기 (-1~1)
world.style.transform = `rotateX(${pointer.y * -5}deg) rotateY(${pointer.x * 7}deg)`

intro = easeInOut(range(p, .03, .30))                 // 장면1 퇴장
mid   = range(p, .24, .30) * (1 - range(p, .66, .72)) // 장면2 표시
end   = easeInOut(range(p, .68, .94))                 // 장면3 등장
section.style.setProperty('--p', p); ('--intro', intro); ('--mid', mid); ('--end', end)
section.style.setProperty('--drift', `${(drift * .4) % 80}px`)   // 바닥 격자 흐름
section.toggleAttribute('data-past', intro > .98)    // 사라진 버튼은 visibility:hidden
section.toggleAttribute('data-dark', end > .5)       // HUD 글자색 반전

travel = p * depth * 1.6                              // 스크롤하면 빠르게 통과
for each screen:
  z = ((offset + drift + travel) % depth) - depth + near     // 무한 터널 (끝나면 뒤로 순환)
  fadeIn  = range(z, fadeStart, fadeStart + 1000)            // 멀리 있는 건 안 보이게
  fadeOut = 1 - range(z, near - 320, near - 40)              // 카메라에 닿기 직전 사라짐
  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-x/rx*24}deg) rotateX(${y/ry*12}deg)`
  el.style.opacity = fadeIn * fadeOut * (1 - end)

// 장면2 단어 4개가 차례로 떠오름
m = range(p, .28, .68) * 4
for word k:
  local = m - k
  opacity = clamp01((0.5 - Math.abs(local - 0.5)) * 5)
  transform = `translate3d(0, ${(0.5 - clamp01(local)) * 60}px, 0) rotateX(${(0.5 - clamp01(local)) * 50}deg)`
```

### 3-5. 장면별 CSS
```css
.hero3d__screen{position:absolute;left:50%;top:50%;width:var(--sw);
  margin:calc(var(--sw)*-.37) 0 0 calc(var(--sw)/-2);background:#fff;
  border:1px solid rgba(23,32,35,.16);box-shadow:0 44px 80px -34px rgba(23,32,35,.5);
  opacity:0;will-change:transform,opacity;backface-visibility:hidden}
.hero3d__chrome{display:flex;gap:4px;align-items:center;height:14px;padding:0 7px;background:#eceeea}
.hero3d__chrome i{width:5px;height:5px;background:rgba(23,32,35,.28)}   /* 각진 브라우저 점 */

/* 원근 격자 바닥 */
.hero3d__floor{position:absolute;left:-60%;right:-60%;top:58%;height:140%;
  transform-origin:50% 0;transform:rotateX(80deg);
  background-image:linear-gradient(rgba(23,32,35,.13) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(23,32,35,.13) 1px,transparent 1px);
  background-size:80px 80px;background-position:0 var(--drift);
  mask-image:linear-gradient(#000,transparent 55%)}

/* 장면1: 가운데 정렬. 스크롤하면 위로 사라지고 두 줄 제목이 좌우로 갈라짐 */
.hero3d__copy{opacity:calc(1 - var(--intro));transform:translateY(calc(var(--intro) * -70px))}
.hero3d__copy:before{/* 글자 뒤 종이색 원형 번짐 → 화면들이 지나가도 글자가 읽힘 */
  background:radial-gradient(closest-side,rgba(245,245,242,.94) 55%,rgba(245,245,242,0))}
.hero3d__title{font-size:clamp(56px,9.2vw,168px);font-weight:850;line-height:.98;letter-spacing:-.065em}
.hero3d__line--1{transform:translateX(calc(var(--intro) * -26vw))}
.hero3d__line--2{transform:translateX(calc(var(--intro) *  26vw))}

/* 장면2: 단어는 position:absolute로 같은 자리에 겹쳐 두고 JS로 하나씩 보여줌. 짝수 단어는 포인트색 */
.hero3d__mid{opacity:var(--mid)}
.hero3d__words{font-size:clamp(60px,12vw,210px);font-weight:850;perspective:900px}

/* 장면3: 가운데 작은 사각형이 화면 전체로 커지는 마스크 전환 */
.hero3d__end{background:var(--ink);color:var(--paper);
  opacity:calc(var(--end) * 10);   /* 0일 때 작은 사각형이 보이지 않게 */
  clip-path:inset(calc((1 - var(--end)) * 44%) calc((1 - var(--end)) * 38%))}
.hero3d__end-inner{opacity:calc((var(--end) - .22) * 2.2);transform:translateY(calc((1 - var(--end)) * 60px))}

/* HUD: 왼쪽 모션 버튼, 가운데 진행 막대(scaleX(var(--p)), 포인트색), 오른쪽 "스크롤" 힌트(p가 커지면 사라짐) */
```
히어로 바로 다음 섹션(역량 띠)을 잉크 배경으로 두면 장면3 → 다음 섹션이 끊김 없이 이어진다.

### 3-6. 성능·접근성 필수 조건
- `IntersectionObserver`로 히어로가 화면 밖이면 rAF 루프를 멈춘다.
- 마우스 기울기는 `matchMedia('(pointer: fine)')`일 때만 켠다.
- **모션 정지 버튼**: 자동 전진(drift)만 멈춘다. 스크롤 연동은 계속 동작한다.
- **`prefers-reduced-motion: reduce`**:
  - 섹션 높이를 `auto`로, sticky 해제, 장면2·3과 스크롤 힌트 숨김
  - 첫 장면만 정적으로 보여 준다.
  - 모션 버튼은 `disabled` + "동작 줄이기 적용 중"
- 3D 화면은 모두 `aria-hidden`, `alt=""`. 뜻이 있는 글자(H1, 설명, 버튼)는 실제 DOM 텍스트로 둔다.
- 처음 6장은 `loading="eager"`, 나머지는 `lazy`.

---

## 4. 품질 기준 섹션의 3D 분해도

웹사이트 한 장을 **4개 층(데이터 → 코드 → 디자인 → 구조)**으로 쌓는다. 섹션이 화면에 올라올수록 층이 위로 벌어진다.

```css
.spec__visual{--q:0;height:clamp(440px,46vw,660px);perspective:1800px;display:grid;place-items:center}
.spec__iso{width:min(400px,70%);aspect-ratio:1.3;transform-style:preserve-3d;
  transform:rotateX(58deg) rotateZ(-38deg) translateZ(-60px)}          /* 아이소메트릭 */
.spec-layer{position:absolute;inset:0;transform-style:preserve-3d;
  transform:translateZ(calc(var(--i) * (8px + var(--q) * 66px)));       /* --i: 0(아래)~3(위) */
  border:1px solid rgba(245,245,242,.42);background:rgba(38,62,67,.62)}
.spec-layer__label{position:absolute;left:calc(100% + 18px);font-family:var(--mono);
  font-size:14px;font-weight:700;color:#ff7a5c;opacity:calc(var(--q) * 1.6 - .4)}
```

**층별 내용** (div로 그림, 이미지 없음)
- 0 데이터: 모노 글자 `GET /api/pages 200`, `POST /api/inquiries 201`, `cache hit · 38ms`, `sitemap.xml ✓`
- 1 코드: 높이 7px 막대 7개. 폭과 들여쓰기를 다르게 주고, 색은 청록·코랄·반투명 흰색
- 2 디자인: 종이색 불투명 판 위에 잉크 내비 막대, 제목 막대 2개, 코랄 이미지 블록, 녹색 버튼
- 3 구조: 투명 판, 점선 테두리 와이어프레임 (헤더 / 히어로 / 3칸 / 푸터)

**--q 계산** (스크롤할 때 rAF로 한 번만 계산)
```js
q = clamp01((innerHeight - rect.top) / (innerHeight * 0.5 + rect.height * 0.5))
```
동작 줄이기 설정이면 q=1로 고정한다.

---

## 5. 공통 인터랙션

- **스크롤 등장**: `[data-reveal]` 요소에 적용한다.
  - JS가 `main`에 `.reveal-ready`를 붙인 뒤 `IntersectionObserver(rootMargin:'0px 0px -8% 0px')`로 `.is-in`을 추가한다.
  - CSS: `opacity 0 → 1`, `translateY(34px) → 0`, `.8s cubic-bezier(.2,.7,.2,1)`
  - 순차 지연은 `style="--d:80ms"`로 준다.
  - **JS가 없거나 동작 줄이기 설정이면 처음부터 보이게** 한다. 숨김은 반드시 `.reveal-ready` 아래에서만 적용한다.
- sticky 제목(과정·FAQ)은 `top:120px`. 모바일에서는 `position:static`.

---

## 6. 콘텐츠 (데이터 파일 하나로 분리)

`src/data/homeContent.js`에 모든 문구를 배열로 둔다. 비개발자도 이 파일만 고치면 되게 한다.

- HERO_AUDIENCES: `['개인','스타트업','기업·기관','비영리 단체']`
- CAPABILITIES: 브랜드 웹사이트, 랜딩페이지, 기업 홈페이지, 쇼핑몰, 예약 시스템, 관리자 페이지, 반응형 웹, 검색 최적화, 웹 접근성, 유지보수
- SERVICES (제목 / 설명 / 태그 4개 / 기간 / 미리보기 이미지)
  - 브랜드·기업 웹사이트 4~8주
  - 랜딩페이지·캠페인 2~4주
  - 쇼핑몰·예약·기능 개발 6~12주
  - 운영·유지보수 (월 단위)
- AUDIENCES: 개인·프리랜서(빠르고 가볍게), 스타트업(빠른 검증과 반복), 기업·기관(신뢰와 확장성), 비영리·봉사단체(쉬운 운영)
- QUALITY_SPECS:
  - 360·390·768·1440px 검수
  - WCAG 2.1 AA 점검
  - LCP 2.5초 이내 **목표**
  - 메타·OG·사이트맵·구조화 데이터
  - 관리자 페이지
  - 소스·계정·가이드 인계
- PROCESS_STEPS:
  - 방향과 범위(1주)
  - 구조와 디자인(1~3주)
  - 개발과 검수(2~6주)
  - 공개와 운영(공개 후 지속)
- PRICING_PLANS (부가세 별도 **시작가**, 4칸 · 태블릿 2×2 · 모바일 1열)
  - 라이트 {{45}}만원~ (1페이지 랜딩)
  - 스타터 {{90}}만원~ (3~5페이지)
  - 스탠다드 {{150}}만원~ (강조, "가장 많이 선택")
  - 프리미엄 {{250}}만원~ (기능 개발·플랫폼)
  - 안내문: 유지보수 월 {{10}}만원~ / 최종 비용은 상담 후 확정
- FAQS 7개: 기간, 상담 전 준비, 수정 횟수, 도메인·호스팅, 직접 수정 가능 여부, 리뉴얼, 결제 방식

### 정직성 규칙
- 샘플 작업은 "가상 프로젝트"라고 표기한다.
- 가짜 고객사 로고, 가짜 후기, 측정하지 않은 점수는 넣지 않는다.
- 품질 수치는 "목표"라고 쓴다.
- 문의 서버가 연결되지 않았으면 "전송 완료"처럼 보이게 하지 않는다.

---

## 7. 반응형 기준

| 폭 | 변경 |
|---|---|
| ≤1100px | 섹션 좌우 여백 46px. 서비스·품질·가격을 1열로. 대상 고객 2열. 헤더 보조 메뉴 숨김 |
| ≤760px | 좌우 여백 22px. 제목 `clamp(30px,8.6vw,42px)`. 작업 그리드 1열(엇갈림 제거). 히어로 버튼 2개를 반반 그리드로. 분해도 높이 360px. 고정 "프로젝트 찾기" 버튼 숨김 |
| ≤380px | 히어로 버튼 세로 1열 |

---

## 8. 실수하기 쉬운 지점 (반드시 지킬 것)

1. **`display:none` + `loading="lazy"` 이미지는 영원히 로드되지 않는다.** 모바일에서 숨길 이미지는 `visibility:hidden`을 쓰거나, 숨기지 말고 다른 위치에 보여준다.
2. **sticky가 안 먹는 문제**: 히어로 section이나 그 조상에 `overflow:hidden`을 주면 sticky가 깨진다. `overflow:hidden`은 sticky 무대 자신에게만 준다.
3. **CSS 우선순위**: 컴포넌트 CSS가 공통 CSS보다 먼저 로드되면 덮어써진다. 새 스타일은 선택자를 한 단계 더 구체적으로 쓴다(예: `.sx .project-grid--featured`).
4. **clip-path 전환 시작 시점**: `--end=0`일 때도 inset 사각형이 보이므로 `opacity:calc(var(--end) * 10)`으로 숨긴다.
5. **멀리 있는 3D 화면은 가운데로 모여 제목을 가린다.** 페이드인 시작을 절대값(−2100px)으로 잡고, 글자 뒤에 종이색 원형 번짐을 깐다.
6. **글자가 사라진 뒤에도 버튼에 Tab 포커스가 간다.** `data-past` 속성을 붙여 `visibility:hidden`으로 막는다.
7. **푸터 링크 스타일이 버튼을 덮지 않게** 한다: `.footer a:not(.btn)`

---

## 9. 파일 구조

```
src/
  hero/Hero3D.jsx, hero-3d.css          # 3장
  sections/HomeSections.jsx             # 역량 띠, 작업, 서비스, 대상, 품질(분해도), 과정, 비용, FAQ
  sections/home-sections.css
  sections/useReveal.js                 # 스크롤 등장 훅 (컴포넌트 파일과 분리)
  data/homeContent.js                   # 모든 문구·가격·FAQ
  data/agencyConfig.js                  # 회사 정보·연락처 (환경변수로 덮어쓰기 가능)
  studio-shell.css                      # 버튼, 헤더 CTA, 고정 버튼, 푸터
  App.jsx                               # Header → Hero3D → CapabilityTicker → Work → Services → Audience → QualitySpec → Process → Pricing → Faq → Contact → Footer
```

---

## 10. 완료 전 검증 체크리스트

- [ ] `npm run build` 성공, 콘솔 에러 0
- [ ] 1440 / 768 / 390 / 360px에서 가로 스크롤 없음
- [ ] 히어로 진행도 0 / 0.12 / 0.4 / 0.8 / 0.97 지점을 각각 캡처해서 확인
  - 0: 제목·설명·버튼이 선명하게 읽힘
  - 0.4: 대상 단어가 크게 보이고 화면들과 겹쳐도 읽힘
  - 0.97: 잉크 패널이 화면 전체를 덮고 문구가 선명함
- [ ] 모든 이미지가 로드됨 (각 이미지를 화면에 스크롤한 뒤 `img.decode()` 성공)
- [ ] 동작 줄이기 설정: 히어로 높이 = 한 화면, 숨겨진 `[data-reveal]` 요소 0개, 모션 버튼 disabled
- [ ] 키보드 Tab으로 헤더 → 히어로 버튼 → 본문 순서로 이동, 포커스 표시가 보임
- [ ] 푸터가 보이면 고정 "프로젝트 찾기" 버튼이 숨겨짐

---

## 11. 결과 보고 형식

작업 후 아래 순서로 보고한다.
1. 만든 파일 / 수정한 파일
2. 핵심 변경 내용
3. 검증 결과 (명령어 + 통과 여부)
4. 교체해야 할 임시값 목록
5. 다음 추천 작업 3개
