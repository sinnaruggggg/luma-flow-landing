# 디자인 시스템: HOTEL STILL
**사이트 ID:** boutique-hotel

## 1. 정체성
- 업종: 부티크 호텔
- 요약: 객실 이미지와 예약 위젯이 동시에 열리는 실제 운영형 호텔 사이트.
- 첫 화면 문법: 스테이 파인더 히어로
- 모바일 규칙: 객실 사진 아래로 예약 위젯과 오퍼 CTA가 바로 이어져야 한다.

## 2. 비주얼 방향
- 계열: Boutique stay booking
- 첫 화면: Large room photography with the stay finder layered directly on top.
- 배경: High-resolution room imagery and floating blocks that rise over the photo on scroll.
- 모션: Package cards and room details reveal as overlapping sheets.
- 분위기: 부드러운 그레인과 영화적 깊이를 가진 에디토리얼 럭셔리.

## 3. 팔레트
- 배경: #e8ddd0
- 표면: #f8f2ea
- 패널: rgba(248, 242, 234, 0.84)
- 본문: #2c231d
- 보조: #6b5f53
- 강조: #3c2c20
- 보조 강조: #d6c3b2

## 4. 타이포그래피
- 조용하지만 고급스러운 타이포를 사용한다.
- 카피는 짧고 기능적으로 유지한다.
- 기본 콘텐츠 언어는 한국어다.

## 5. 컴포넌트
- 패널은 이미지 위에 겹쳐 올라오는 시트처럼 보여야 한다.
- 공용 primitive는 버튼, 배지, 입력, 단순 카드 정도로 제한한다.
- 첫 화면 문법은 이 사이트만의 구조여야 한다.

## 6. 금지 패턴
- 공통 히어로 템플릿 금지.
- 공통 섹션 조립기 금지.
- 반복적인 이미지 박스 + 텍스트 박스 + CTA 블록 금지.

## 7. 라우트 목표
- 홈 (home): 운영형 홈페이지처럼 설계한다. 커버 페이지가 아니라 실제 사용 흐름이 바로 보여야 한다.
- 객실 (rooms): 필터, 카테고리, 빠른 탐색이 가능한 목록형 구조로 설계한다.
- 오퍼 (offers): 상품, 객실, 프로그램, 서비스의 핵심 판단 정보가 첫 화면에서 보여야 한다.
- 예약 (booking): 예약 흐름, 가능 시간, 선택 옵션, 신청 행동이 위쪽에서 바로 보여야 한다.
- 안내 (guide): 방문 안내, 규칙, FAQ, 맵, 준비 사항을 스캔하기 쉽게 정리한다.
