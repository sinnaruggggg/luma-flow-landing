# 나나웹 관리자 앱 (안드로이드)

홈페이지로 들어온 문의를 확인하고, 새 문의가 오면 휴대폰 알림을 받는 앱입니다.

## 기능
- 관리자 아이디/비밀번호 로그인 (한 번 로그인하면 90일 유지)
- 문의 목록 (전체 / 새 문의 / 진행 중 / 완료), 상세, 전화·메일 바로 연결, 내용 복사
- 처리 상태 변경, 메모 저장 (웹 관리자 `/admin`과 같은 데이터)
- **알림**: 앱을 닫아 둬도 약 15분마다 새 문의를 확인해 알림 (안드로이드가 허용하는 최소 간격). 앱을 열면 즉시 확인, 켜 둔 동안은 1분마다 새로고침

## 파일 구조
| 파일 | 역할 |
|---|---|
| `app/build.gradle.kts` | 앱 설정, 서버 주소(`baseUrl` 기본값) |
| `app/src/main/java/kr/nanaweb/admin/Api.kt` | 서버 통신 (로그인·목록·수정) |
| `.../MainActivity.kt` | 화면 (로그인 / 목록 / 상세) |
| `.../InquiryWorker.kt` | 15분마다 새 문의 확인 |
| `.../Notifications.kt` | 알림 채널·알림 표시 |
| `.../Prefs.kt` | 로그인 토큰, 마지막 확인 시각 저장 |

## 빌드
JDK 17 과 Android SDK 가 필요합니다. `local.properties` 에 `sdk.dir=D:/Android/Sdk` 처럼 SDK 위치를 적습니다.

```bash
cd apps/android
./gradlew.bat assembleDebug
```
결과: `app/build/outputs/apk/debug/app-debug.apk`

로컬 서버로 테스트할 때만: `./gradlew.bat assembleDebug -PnanawebBaseUrl=http://localhost:8787` (그 뒤 `adb reverse tcp:8787 tcp:8787`)

## 설치 (휴대폰)
1. APK 파일을 휴대폰으로 옮겨 열기 → "출처를 알 수 없는 앱 설치" 허용
2. 앱 실행 → 관리자 아이디/비밀번호 로그인 → 알림 허용
3. 삼성폰은 설정 → 애플리케이션 → 나나웹 → 배터리 → **제한 없음** 으로 두면 알림이 늦지 않습니다

## 알아둘 점
- 로그인하려면 Vercel 환경 변수 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` 이 설정돼 있어야 합니다
- 즉시 알림(몇 초 이내)이 필요하면 Firebase(FCM) 푸시로 바꿀 수 있습니다 (Firebase 프로젝트 필요)
