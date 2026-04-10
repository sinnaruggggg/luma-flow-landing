# LUMA FLOW Landing Platform

트렌디한 랜딩페이지 서비스 플랫폼 샘플입니다.  
프론트는 React + Vite로 구성했고, Gemini 3.1 이미지 자산은 로컬 스크립트로 생성해 `public/generated`에 넣도록 설계했습니다.

## Run

```bash
npm install
npm run dev
```

## Gemini Image Generation

1. `GEMINI_API_KEY`를 로컬 환경 변수로 설정합니다.
2. 필요하면 `.env.example`을 참고합니다.
3. 아래 명령으로 자산을 생성합니다.

```bash
npm run generate:images
```

기본 출력 위치:

- `public/generated/hero-orchestra.png`
- `public/generated/campaign-board.png`
- `public/generated/brand-kit.png`
- `public/generated/team-review.png`
- `public/generated/manifest.json`

같은 파일명이 존재하면 기본적으로 건너뜁니다. 다시 생성하려면:

```bash
npm run generate:images -- --force
```

## Notes

- Gemini 키를 프론트 코드에 직접 넣지 않도록 구성했습니다.
- 이미지가 아직 없어도 폴백 비주얼이 보이도록 랜딩이 깨지지 않게 만들었습니다.
- 이미지 생성 모델 기본값은 `gemini-3.1-flash-image-preview`입니다.
