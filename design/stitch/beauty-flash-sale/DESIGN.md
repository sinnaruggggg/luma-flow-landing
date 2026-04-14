# 디자인 시스템: MELT POP
**사이트 ID:** beauty-flash-sale

## 1. 정체성
- 업종: 뷰티 플래시 세일
- 요약: 키트 구매, 세일 긴급감, 컬러 탐색을 빠르게 연결하는 고속 뷰티 커머스 사이트.
- 첫 화면 문법: 세일 포스터 보드
- 모바일 규칙: 캠페인 설명보다 히어로 가격, 키트 선택, 결제 경로를 먼저 보여준다.

## 2. 비주얼 방향
- 계열: Campaign-sale beauty
- 첫 화면: Poster-style first screen with giant price typography and layered kit cards.
- 배경: High-gloss campaign imagery with color stickers and overlapping sale tags.
- 모션: Sale tags, swatches, and price strips float upward and cross each other.
- 분위기: 화려하고 글로시하지만 흐리지 않은 캠페인 무드.

## 3. 팔레트
- 배경: #221537
- 표면: #2d1b46
- 패널: rgba(255, 255, 255, 0.12)
- 본문: #ffffff
- 보조: rgba(255, 255, 255, 0.74)
- 강조: #ffd84d
- 보조 강조: #ff7ccf

## 4. 타이포그래피
- 큰 디스플레이 서체와 날카로운 보조 라벨을 쓴다.
- 카피는 짧고 기능적으로 유지한다.
- 기본 콘텐츠 언어는 한국어다.

## 5. 컴포넌트
- 태그, 가격, 배지가 경쟁하되 통제된 질서를 유지한다.
- 공용 primitive는 버튼, 배지, 입력, 단순 카드 정도로 제한한다.
- 첫 화면 문법은 이 사이트만의 구조여야 한다.

## 6. 금지 패턴
- 공통 히어로 템플릿 금지.
- 공통 섹션 조립기 금지.
- 반복적인 이미지 박스 + 텍스트 박스 + CTA 블록 금지.

## 7. 라우트 목표
- 홈 (home): 운영형 홈페이지처럼 설계한다. 커버 페이지가 아니라 실제 사용 흐름이 바로 보여야 한다.
- 쇼핑 (shop): 필터, 카테고리, 빠른 탐색이 가능한 목록형 구조로 설계한다.
- 컬러 (shades): 상품, 객실, 프로그램, 서비스의 핵심 판단 정보가 첫 화면에서 보여야 한다.
- 장바구니 (cart): 옵션, 수량, 요약, 다음 행동이 선명한 전환형 페이지로 만든다.
- 브랜드 (brand): 흔한 소개문이 아니라 브랜드 세계관과 신뢰 근거가 드러나야 한다.
