# Stitch 인증 가이드

현재 이 프로젝트의 Stitch 설정은 거의 끝나 있습니다. 막히는 지점은 `STITCH_API_KEY` 또는 OAuth 인증 정보가 아직 없다는 점 하나입니다.

## 현재 상태

- Codex 전역 MCP 서버 등록은 되어 있음: `C:\Users\sinna\.codex\config.toml`
- 프로젝트 스크립트는 준비되어 있음:
  - `npm run stitch:init`
  - `npm run stitch:generate`
  - `npm run stitch:pull`
- 현재 세션에는 Stitch 인증값이 없음:
  - `STITCH_API_KEY`
  - `STITCH_ACCESS_TOKEN`
  - `STITCH_PROJECT_ID`
  - `GOOGLE_CLOUD_PROJECT`

## 가장 쉬운 방법: API 키

공식 `stitch-mcp` 문서는 API 키 방식을 권장하고, `STITCH_API_KEY` 환경변수 또는 `.env` 파일 사용을 지원합니다.

1. 브라우저에서 `https://stitch.withgoogle.com/` 에 로그인합니다.
2. 계정 또는 설정 화면에서 API 키를 생성합니다.
3. 프로젝트 루트의 `.env` 파일에 아래 한 줄을 추가합니다.

```env
STITCH_API_KEY=여기에_실제_키
```

4. 새 터미널을 열거나 Codex 세션을 다시 시작합니다.
5. 아래 명령으로 확인합니다.

```powershell
npx @_davideast/stitch-mcp doctor --verbose
npx @_davideast/stitch-mcp proxy
```

주의:
- 공식 문서에서 API 키 사용은 확인했지만, 웹 UI 안의 정확한 메뉴 이름은 공개 텍스트 문서로 직접 확인되지 않았습니다.
- 따라서 2번의 "계정 또는 설정 화면" 위치는 Stitch 웹 앱 UI 기준의 안내입니다.
- 만약 웹 UI에서 API 키 메뉴를 바로 찾지 못하면 아래 OAuth 방식으로 진행하는 편이 더 확실합니다.

## 대안: OAuth로 바로 연결

공식 `stitch-mcp` 문서에 따르면 `init` 명령이 gcloud 설치, 로그인, 프로젝트 선택, Stitch API 활성화까지 처리합니다.

```powershell
npx @_davideast/stitch-mcp init
```

진행할 때는 보통 이렇게 선택하면 됩니다.

- MCP client: `Codex`
- Transport: `stdio`
- Auth mode: `OAuth`

OAuth 방식은 API 키를 직접 찾지 않아도 되지만, Google Cloud 프로젝트와 브라우저 로그인이 필요합니다.

## 수동 gcloud 방식

이미 gcloud를 쓰고 있다면 공식 문서 기준으로 아래 순서도 가능합니다.

```powershell
gcloud auth application-default login
gcloud config set project <PROJECT_ID>
gcloud beta services mcp enable stitch.googleapis.com --project=<PROJECT_ID>
```

이 경우에는 `STITCH_USE_SYSTEM_GCLOUD=1` 설정이 추가로 필요할 수 있습니다.

## 이 프로젝트에서 권장하는 실제 순서

1. API 키를 구할 수 있으면 `.env`에 `STITCH_API_KEY`를 추가
2. 키를 못 찾겠으면 `npx @_davideast/stitch-mcp init` 실행
3. 확인

```powershell
npx @_davideast/stitch-mcp doctor --verbose
npx @_davideast/stitch-mcp proxy
```

4. 문제가 없으면 프로젝트 명령 실행

```powershell
npm run stitch:init
npm run stitch:generate -- --site sneaker-drop --page home --device desktop
```

## 참고 소스

- `@_davideast/stitch-mcp` README: https://www.npmjs.com/package/@_davideast/stitch-mcp
- `stitch-mcp` setup 문서: https://github.com/davideast/stitch-mcp/blob/bca9554125d6e0178113c1eb5d70f7c6aa6e0e10/docs/setup.md
- `stitch-mcp` troubleshooting 문서: https://github.com/davideast/stitch-mcp/blob/bca9554125d6e0178113c1eb5d70f7c6aa6e0e10/docs/troubleshooting.md
- `@google/stitch-sdk` README: https://github.com/google-labs-code/stitch-sdk/blob/4055e6d606587fd77a6014cc12b833c71a18041a/README.md
