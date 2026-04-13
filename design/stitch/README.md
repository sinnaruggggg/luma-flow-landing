# Stitch Workspace

이 저장소는 20개의 독립 샘플 사이트를 Stitch MCP 기준으로 설계하고 결과를 추출하기 위한 작업 공간을 포함합니다.

## 기본 원칙

- 각 샘플 사이트는 `design/stitch/<siteId>` 아래에서 관리합니다.
- 각 사이트는 자기 전용 `DESIGN.md`, `brief.md`, `site.json` 을 가집니다.
- 데스크톱과 모바일은 별도 화면으로 생성합니다.
- 1차 생성 우선순위는 모든 사이트의 `home-desktop`, `home-mobile` 입니다.
- 생성된 HTML/PNG는 각 사이트의 `screens/` 아래에 저장합니다.
- `metadata.json` 은 로컬 Stitch 프로젝트/스크린 매핑용 파일이며 git 추적에서 제외됩니다.

## 자주 쓰는 명령

```bash
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
npm run stitch:pull -- --site sneaker-drop --page home --device desktop
```

## 사이트 목록

- `sneaker-drop` | RIFT/01 | 스니커즈 드롭 스토어
- `supplement-brand` | PUNCH FUEL | 퍼포먼스 보충제 브랜드
- `boxing-gym` | UPPERCUT CLUB | 복싱짐 멤버십
- `wealth-app` | CLARO | 자산관리 SaaS
- `skin-clinic` | ATELIER SKIN | 프리미엄 스킨 클리닉
- `arch-studio` | PLAIN GRID | 건축 · 인테리어 스튜디오
- `beauty-flash-sale` | MELT POP | 뷰티 플래시세일 스토어
- `festival-page` | NOISE WAVE | 페스티벌 티켓 페이지
- `creator-club` | RALLY HOUSE | 크리에이터 멤버십 클럽
- `ev-mobility` | ORBIT E | EV 모빌리티 브랜드
- `gaming-gear` | VOID ARC | 게이밍 기어 스토어
- `ai-saas` | SIGNAL GRID | AI 워크플로 SaaS
- `indie-bookstore` | PAPER NOOK | 인디 북스토어
- `stationery-shop` | CUT & NOTE | 문구 스토어
- `local-cafe` | TABLE WARM | 로컬 카페
- `boutique-hotel` | HOTEL STILL | 부티크 호텔
- `perfume-house` | MOSS & AMBER | 니치 향수 브랜드
- `furniture-store` | MOSS HOME | 가구 스토어
- `youth-fashion` | BOP BOP | 영패션 브랜드
- `jewelry-brand` | LUNE FORM | 주얼리 브랜드

