# 디자인 시스템: NOISE WAVE
**사이트 ID:** festival-page

## 1. 정체성
- 업종: 페스티벌 이벤트
- 요약: 라인업 탐색, 시간표 가독성, 티켓 구매가 바로 이어지는 페스티벌 사이트.
- 첫 화면 문법: 페스티벌 포스터 스택
- 모바일 규칙: 긴 소개문 없이 라인업 하이라이트, 날짜, 티켓 선택이 바로 보여야 한다.

## 2. 비주얼 방향
- 계열: Poster event system
- 첫 화면: Poster-led hero with lineup blocks, date stamp, and immediate ticket CTA.
- 배경: Large event imagery, spotlight gradients, and neon schedule cues.
- 모션: Lineup cards and timing rails stack and rise like layered festival posters.
- 분위기: 기술적 글로우, 메시 깊이, 다크 콘솔 감성.

## 3. 팔레트
- 배경: #07101d
- 표면: #0e1b33
- 패널: rgba(10, 22, 42, 0.82)
- 본문: #ecfbff
- 보조: rgba(203, 241, 255, 0.76)
- 강조: #39d5ff
- 보조 강조: #ff6fe4

## 4. 타이포그래피
- 정밀한 기술 라벨과 단호한 헤드라인을 사용한다.
- 카피는 짧고 기능적으로 유지한다.
- 기본 콘텐츠 언어는 한국어다.

## 5. 컴포넌트
- 패널은 카드가 아니라 장비 계기판처럼 느껴져야 한다.
- 공용 primitive는 버튼, 배지, 입력, 단순 카드 정도로 제한한다.
- 첫 화면 문법은 이 사이트만의 구조여야 한다.

## 6. 금지 패턴
- 공통 히어로 템플릿 금지.
- 공통 섹션 조립기 금지.
- 반복적인 이미지 박스 + 텍스트 박스 + CTA 블록 금지.

## 7. 라우트 목표
- 홈 (home): 운영형 홈페이지처럼 설계한다. 커버 페이지가 아니라 실제 사용 흐름이 바로 보여야 한다.
- 라인업 (lineup): 긴 설명보다 출연진 카드, 날짜, 무대 정보 중심으로 설계한다.
- 시간표 (schedule): 시간대, 동선, 핵심 슬롯이 즉시 읽히는 시간표 구조를 만든다.
- 티켓 (tickets): 티켓 등급, 가격, 혜택, 구매 CTA가 빠르게 이해되어야 한다.
- 안내 (guide): 방문 안내, 규칙, FAQ, 맵, 준비 사항을 스캔하기 쉽게 정리한다.
