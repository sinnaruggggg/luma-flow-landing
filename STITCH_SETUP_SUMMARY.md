# Stitch 연동 작업 요약

## 현재 상태

- Codex 전역 MCP 서버에 `stitch`를 등록함
- Codex 전역 스킬 3개 설치 완료
  - `stitch-design`
  - `stitch-loop`
  - `design-md`
- 프로젝트에 Stitch 워크플로 스크립트 추가 완료
- 20개 사이트용 Stitch 작업공간 스캐폴드 생성 완료
- 앱 빌드와 린트 통과 확인 완료

## 전역 설정

- Codex 전역 설정 파일:
  - `C:\Users\sinna\.codex\config.toml`
- 추가된 MCP 서버:
  - `stitch = npx @_davideast/stitch-mcp proxy`
- 설치된 전역 스킬 위치:
  - `C:\Users\sinna\.codex\skills\stitch-design`
  - `C:\Users\sinna\.codex\skills\stitch-loop`
  - `C:\Users\sinna\.codex\skills\design-md`

## 프로젝트에 추가한 것

- npm scripts
  - `npm run stitch:init`
  - `npm run stitch:generate`
  - `npm run stitch:pull`
- 새 스크립트
  - `scripts/stitch-init.mjs`
  - `scripts/stitch-generate.mjs`
  - `scripts/stitch-pull.mjs`
  - `scripts/stitch-blueprints.mjs`
  - `scripts/stitch-utils.mjs`
- Stitch 작업 디렉터리
  - `.stitch/SITE.md`
  - `design/stitch/README.md`
  - `design/stitch/inventory.json`
  - `design/stitch/<siteId>/site.json`
  - `design/stitch/<siteId>/brief.md`
  - `design/stitch/<siteId>/prompts/`
  - `design/stitch/<siteId>/screens/`

## 환경 변수

- `.env.example`에 추가됨:
  - `STITCH_API_KEY=your_stitch_api_key_here`

실사용 방법:

```env
STITCH_API_KEY=실제_키
```

또는 OAuth 방식:

```powershell
npx @_davideast/stitch-mcp init
```

## 사용 방법

### 1. 초기화

```bash
npm run stitch:init
```

현재 한 번 실행해서 20개 사이트 작업공간 생성까지 끝난 상태.

### 2. 화면 생성

```bash
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
```

### 3. 기존 화면 다시 가져오기

```bash
npm run stitch:pull -- --site sneaker-drop --page home --device desktop
```

## 생성 규칙

- 사이트는 현재 코드베이스의 20개 샘플 ID 기준으로 분리됨
- 각 사이트는 5개 라우트 구조를 가짐
- 프롬프트는 사이트별 업종/톤/히어로/모션/배경 방향을 반영해서 생성됨
- 데스크톱과 모바일은 별도 화면으로 생성하게 설계함

## 검증 결과

- `codex mcp list`에서 `stitch` 서버 활성 상태 확인
- `npm run stitch:init` 성공
- `npm run lint` 통과
- `npm run build` 통과
- 인증이 없을 때 `stitch:generate`, `stitch:pull`이 올바른 오류 메시지로 중단되는 것 확인

## 재시작 후 바로 할 일

1. Codex 세션 재시작
2. Stitch 인증 완료
   - `STITCH_API_KEY` 설정 또는
   - `npx @_davideast/stitch-mcp init`
3. 재시작 후 아래 순서로 진행

```bash
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
npm run stitch:generate -- --site sneaker-drop --page home --device mobile
```

## 참고

- 새 전역 스킬은 Codex 재시작 후 인식됨
- 현재 변경 파일은 아직 커밋하지 않은 상태
