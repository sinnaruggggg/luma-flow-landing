# 디자인 시스템: TABLE WARM
**사이트 ID:** local-cafe

## 1. 정체성
- 업종: 카페 예약
- 요약: 오늘의 메뉴와 좌석 현황, 예약 진입이 실제 매장처럼 바로 보이는 카페 사이트.
- 첫 화면 문법: 카페 윈도우
- 모바일 규칙: 첫 두 블록 안에서 오늘의 메뉴와 좌석 예약을 바로 처리할 수 있어야 한다.

## 2. 비주얼 방향
- 계열: Warm storefront booking
- 첫 화면: Storefront hero with today's menu board and reservation module visible immediately.
- 배경: Big cafe imagery, paper menu notes, and gentle hand-crafted depth.
- 모션: Menu plates and reservation notes lift softly over the storefront image.
- 분위기: 동네 가게의 온기와 생활감 있는 유용함.

## 3. 팔레트
- 배경: #f4ead9
- 표면: #fff8ef
- 패널: rgba(255, 248, 239, 0.86)
- 본문: #2b221a
- 보조: #6a5c4f
- 강조: #5d3b24
- 보조 강조: #e8c498

## 4. 타이포그래피
- 짧은 라벨과 읽기 쉬운 계층을 섞어 쓴다.
- 카피는 짧고 기능적으로 유지한다.
- 기본 콘텐츠 언어는 한국어다.

## 5. 컴포넌트
- 메뉴와 예약 블록은 손으로 올려놓은 듯하지만 정돈돼야 한다.
- 공용 primitive는 버튼, 배지, 입력, 단순 카드 정도로 제한한다.
- 첫 화면 문법은 이 사이트만의 구조여야 한다.

## 6. 금지 패턴
- 공통 히어로 템플릿 금지.
- 공통 섹션 조립기 금지.
- 반복적인 이미지 박스 + 텍스트 박스 + CTA 블록 금지.

## 7. 라우트 목표
- 홈 (home): 운영형 홈페이지처럼 설계한다. 커버 페이지가 아니라 실제 사용 흐름이 바로 보여야 한다.
- 메뉴 (menu): 필터, 카테고리, 빠른 탐색이 가능한 목록형 구조로 설계한다.
- 방문 (visit): 상품, 객실, 프로그램, 서비스의 핵심 판단 정보가 첫 화면에서 보여야 한다.
- 예약 (reserve): 예약 흐름, 가능 시간, 선택 옵션, 신청 행동이 위쪽에서 바로 보여야 한다.
- 정보 (info): 방문 안내, 규칙, FAQ, 맵, 준비 사항을 스캔하기 쉽게 정리한다.
