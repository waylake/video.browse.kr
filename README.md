# 📹 WebRTC Video Chat - 무료 1:1 화상 채팅 서비스

> **설치 없이 브라우저에서 바로 사용하는 실시간 비디오 통화 및 채팅 플랫폼**

WebRTC 기술을 활용한 P2P(Peer-to-Peer) 화상 채팅 서비스로, 서버를 거치지 않는 직접 연결을 통해 안전하고 빠른 통화를 제공합니다. 별도의 앱 설치나 회원가입 없이 브라우저만으로 즉시 사용할 수 있습니다.

## 🌟 서비스 특징

### 🎯 **핵심 가치**
- **프라이버시 우선**: P2P 연결로 서버에 미디어 데이터 저장 안함
- **접근성**: 별도 설치나 가입 없이 즉시 사용 가능
- **크로스 플랫폼**: 모든 주요 브라우저와 디바이스 지원
- **오픈소스**: 투명한 코드와 커뮤니티 기여 환영

### ✨ **주요 기능**

#### 🎥 **비디오 통화 기능**
- **실시간 비디오 통화**: WebRTC 기반 P2P 연결로 저지연 고품질 통화
- **HD 화질 지원**: 최대 1280x720 해상도의 고화질 비디오
- **적응형 품질**: 네트워크 상황에 따른 자동 품질 조절
- **에코 캔슬레이션**: 고급 오디오 처리로 깨끗한 음성 통화
- **노이즈 억제**: 배경 소음 자동 제거

#### 💬 **채팅 시스템**
- **실시간 텍스트 채팅**: 비디오 통화 중 실시간 메시지 전송
- **메시지 타임스탬프**: 모든 메시지에 시간 정보 표시
- **읽지 않은 메시지 알림**: 채팅창이 닫혀있을 때 배지로 알림
- **XSS 방지**: 안전한 메시지 렌더링으로 보안 강화
- **모바일 최적화**: 터치 인터페이스와 키보드 처리 최적화

#### 🎲 **매칭 시스템**
- **랜덤 매칭**: 클릭 한 번으로 다른 사용자와 자동 매칭
- **방 코드 공유**: 7자리 고유 코드로 친구와 특정 방에서 만나기
- **스마트 매칭**: 대기 중인 방 우선 배정으로 빠른 연결
- **다음 사람 찾기**: 현재 통화 종료 후 새로운 사람과 즉시 매칭

#### 💾 **세션 관리**
- **세션 유지**: 새로고침해도 방 정보가 유지됨 (5분간)
- **자동 재연결**: 네트워크 끊김 시 자동 재연결 시도
- **상태 복원**: 브라우저 새로고침 후 이전 설정 자동 복원
- **그레이스풀 종료**: 안전한 연결 해제 및 리소스 정리

#### 🎨 **사용자 인터페이스**
- **다크/라이트 테마**: 시스템 설정 또는 수동으로 테마 전환
- **레이아웃 옵션**: 세로/가로 레이아웃 자유 전환
- **비디오 표시 모드**: 레터박스(contain) 또는 꽉 채우기(cover) 선택
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- **키보드 단축키**: 빠른 조작을 위한 다양한 단축키 지원

#### ♿ **접근성 및 사용성**
- **ARIA 레이블**: 스크린 리더 완벽 지원
- **키보드 내비게이션**: 마우스 없이도 모든 기능 사용 가능
- **고대비 모드**: 시각 장애인을 위한 접근성 향상
- **다국어 지원**: 한국어 기본, 확장 가능한 다국어 시스템

## 🚀 빠른 시작 가이드

### 📋 **시스템 요구사항**

#### **서버 환경**
- **Node.js**: 14.0 이상 (권장: 18.x LTS)
- **npm**: 6.0 이상 또는 **yarn**: 1.22 이상
- **메모리**: 최소 512MB RAM (권장: 1GB 이상)
- **포트**: 3000번 포트 사용 가능 (설정 변경 가능)

#### **브라우저 지원**
- **Chrome**: 74+ (권장)
- **Firefox**: 66+
- **Safari**: 12.1+
- **Edge**: 79+
- **Opera**: 62+

> ⚠️ **중요**: WebRTC는 보안상의 이유로 HTTPS 또는 localhost에서만 작동합니다.

### 🔧 **설치 및 실행**

#### **1단계: 프로젝트 클론**
```bash
# GitHub에서 프로젝트 클론
git clone https://github.com/yourusername/webrtc-video-chat.git
cd webrtc-video-chat

# 또는 ZIP 파일로 다운로드 후 압축 해제
```

#### **2단계: 의존성 설치**
```bash
# npm 사용
npm install

# 또는 yarn 사용 (더 빠름)
yarn install

# 개발 의존성까지 모두 설치
npm install --include=dev
```

#### **3단계: 환경 설정 (선택사항)**
```bash
# 환경 변수 파일 생성
cp env.example .env

# .env 파일 편집 (필요시)
nano .env
```

#### **4단계: 서버 실행**

**개발 모드 (권장)**
```bash
# 자동 재시작 기능 포함
npm run dev

# 또는
yarn dev
```

**프로덕션 모드**
```bash
# 최적화된 프로덕션 실행
npm start

# 또는
yarn start
```

#### **5단계: 브라우저에서 접속**
서버가 성공적으로 시작되면 다음 주소로 접속하세요:
- **로컬 개발**: http://localhost:3000
- **네트워크 접근**: http://[서버IP]:3000

### 🔍 **실행 확인**
서버가 정상적으로 시작되면 콘솔에 다음과 같은 메시지가 표시됩니다:
```
==================================================
🚀 Video.browse.kr Server Started
📊 Environment: development
📡 Port: 3000
🌐 URL: http://localhost:3000
🏠 Max Rooms: 1000
🧹 Cleanup Interval: 300s
==================================================
```

## 🎮 상세 사용 가이드

### 📱 **첫 접속 및 권한 설정**

#### **1단계: 웹사이트 접속**
1. 브라우저에서 서비스 URL 접속
2. 랜딩 페이지에서 "시작하기" 버튼 클릭
3. 화상채팅 앱 페이지로 이동

#### **2단계: 미디어 권한 허용**
- **카메라 권한**: 비디오 통화를 위해 필수
- **마이크 권한**: 음성 통화를 위해 필수
- 브라우저에서 권한 요청 시 "허용" 클릭

> 💡 **팁**: 권한을 거부했다면 브라우저 주소창 옆 자물쇠 아이콘을 클릭하여 권한을 다시 설정할 수 있습니다.

### 🚪 **방 입장 방법**

#### **방법 1: 새 방 만들기**
1. **"새 방 만들기"** 버튼 클릭
2. 자동으로 **7자리 고유 방 코드** 생성 (예: ABC1234)
3. 생성된 방 코드를 친구에게 공유
4. 친구가 접속할 때까지 대기
5. 친구 접속 시 자동으로 화상 통화 시작

**장점**: 특정 친구와 확실하게 만날 수 있음

#### **방법 2: 랜덤 방 참가**
1. **"랜덤 방 참가하기"** 버튼 클릭
2. 시스템이 자동으로 대기 중인 방 검색
3. 대기 중인 방이 있으면 즉시 매칭
4. 대기 중인 방이 없으면 새 방 생성 후 대기

**장점**: 빠른 매칭, 새로운 사람과의 만남

#### **방법 3: 방 코드로 참가**
1. **"방 코드로 참가하기"** 버튼 클릭
2. 친구에게 받은 **7자리 방 코드** 입력
3. "참가하기" 버튼 클릭
4. 해당 방으로 즉시 입장

**장점**: 정확한 방 입장, 약속된 만남

### 🎛️ **화상통화 중 기능 사용법**

#### **비디오/오디오 제어**
- **비디오 토글**: 카메라 켜기/끄기 (단축키: Ctrl+V)
- **오디오 토글**: 마이크 음소거/해제 (단축키: Ctrl+M)
- **상태 표시**: 버튼 색상으로 현재 상태 확인 가능

#### **화면 레이아웃 조정**
- **세로 레이아웃**: 비디오를 위아래로 배치 (기본값)
- **가로 레이아웃**: 비디오를 좌우로 배치 (단축키: Ctrl+L)
- **비디오 크기**: 레터박스 ↔ 꽉 채우기 전환 (단축키: Ctrl+F)

#### **채팅 기능**
- **채팅 열기/닫기**: 우측 채팅 패널 토글 (단축키: Ctrl+C)
- **메시지 전송**: 텍스트 입력 후 Enter 키 또는 전송 버튼
- **읽지 않은 메시지**: 채팅이 닫혀있을 때 빨간 배지로 알림
- **모바일 지원**: 터치 인터페이스 최적화

#### **고급 기능**
- **다음 사람 찾기**: 현재 통화 종료 후 새로운 사람과 매칭 (단축키: Ctrl+N)
- **테마 전환**: 다크/라이트 모드 전환 (단축키: Ctrl+T)
- **방 나가기**: 통화 종료 및 메인 화면으로 이동 (단축키: Ctrl+Q)

### 🔄 **세션 관리 및 재연결**

#### **자동 세션 유지**
- 브라우저 새로고침 시 **5분간 세션 유지**
- 방 정보, 사용자 설정 자동 복원
- 네트워크 끊김 시 자동 재연결 시도

#### **수동 재연결**
1. 연결이 끊어진 경우 "재연결" 버튼 표시
2. 버튼 클릭으로 수동 재연결 시도
3. 실패 시 새로운 방 생성 또는 다른 방 참가 권장

## ⌨️ 키보드 단축키 완전 가이드

### 🎯 **기본 단축키**
| 단축키 | 기능 | 설명 |
|--------|------|------|
| `Ctrl + T` | 테마 전환 | 다크/라이트 모드 즉시 전환 |
| `Ctrl + V` | 비디오 토글 | 카메라 켜기/끄기 |
| `Ctrl + M` | 오디오 토글 | 마이크 음소거/해제 |
| `Ctrl + C` | 채팅 토글 | 채팅 패널 열기/닫기 |
| `Ctrl + Q` | 방 나가기 | 확인 후 통화 종료 |
| `Enter` | 메시지 전송 | 채팅 입력창에서 메시지 전송 |

### 🎨 **레이아웃 단축키**
| 단축키 | 기능 | 설명 |
|--------|------|------|
| `Ctrl + L` | 레이아웃 전환 | 세로 ↔ 가로 레이아웃 전환 |
| `Ctrl + F` | 비디오 크기 조절 | 레터박스 ↔ 꽉 채우기 전환 |

### 🔄 **고급 단축키**
| 단축키 | 기능 | 설명 |
|--------|------|------|
| `Ctrl + N` | 다음 사람 찾기 | 현재 통화 종료 후 새로운 매칭 |
| `Ctrl + R` | 새로고침 | 페이지 새로고침 (세션 유지) |
| `Esc` | 모달 닫기 | 열린 모달 창 닫기 |

### 🍎 **Mac 사용자**
Mac에서는 `Ctrl` 대신 `Cmd(⌘)`를 사용하세요.
- 예: `Cmd + T` (테마 전환), `Cmd + V` (비디오 토글)

### 📱 **모바일 지원**
모바일 기기에서는 키보드 단축키 대신 터치 제스처를 사용:
- **더블 탭**: 비디오 크기 조절
- **길게 누르기**: 추가 옵션 메뉴
- **스와이프**: 채팅 패널 열기/닫기

## 🏗️ 상세 기술 스택 및 아키텍처

### 🎨 **프론트엔드 (Frontend)**

#### **핵심 기술**
- **HTML5**: 시맨틱 마크업, 접근성 최적화
  - `<video>` 태그로 WebRTC 스트림 렌더링
  - ARIA 레이블로 스크린 리더 지원
  - 구조화된 데이터 (Schema.org) 포함
  
- **CSS3**: 모던 스타일링 및 반응형 디자인
  - **CSS Variables**: 다크/라이트 테마 시스템
  - **Flexbox & Grid**: 유연한 레이아웃 시스템
  - **Media Queries**: 완벽한 반응형 디자인
  - **Animations**: 부드러운 전환 효과 및 로딩 애니메이션
  - **Backdrop Filter**: 모던 블러 효과

- **Vanilla JavaScript (ES6+)**: 프레임워크 없는 순수 자바스크립트
  - **모듈 패턴**: 코드 구조화 및 네임스페이스 관리
  - **Async/Await**: 비동기 처리 최적화
  - **Event Delegation**: 효율적인 이벤트 관리
  - **Local/Session Storage**: 클라이언트 사이드 데이터 저장

#### **WebRTC 기술 스택**
- **RTCPeerConnection**: P2P 연결 관리
  - ICE (Interactive Connectivity Establishment)
  - STUN 서버를 통한 NAT 트래버설
  - 자동 코덱 협상 (VP8/VP9, H.264)
  
- **MediaDevices API**: 미디어 스트림 관리
  - `getUserMedia()`: 카메라/마이크 접근
  - 해상도 및 품질 설정 (최대 1280x720)
  - 에코 캔슬레이션 및 노이즈 억제

- **WebSocket (Socket.IO)**: 시그널링 서버 통신
  - Offer/Answer 교환
  - ICE Candidate 교환
  - 실시간 채팅 메시지 전송

#### **UI/UX 라이브러리**
- **Font Awesome 6.5.1**: 아이콘 시스템
- **Google Fonts**: 웹 폰트 (시스템 폰트 우선)

### 🖥️ **백엔드 (Backend)**

#### **런타임 및 프레임워크**
- **Node.js 18.x LTS**: 서버 사이드 JavaScript 런타임
  - **Event Loop**: 비동기 I/O 처리
  - **V8 엔진**: 고성능 JavaScript 실행
  - **NPM 생태계**: 풍부한 패키지 활용

- **Express.js 4.18.2**: 웹 애플리케이션 프레임워크
  - **미들웨어 시스템**: 모듈화된 요청 처리
  - **라우팅**: RESTful API 엔드포인트
  - **정적 파일 서빙**: 캐싱 및 압축 지원

#### **실시간 통신**
- **Socket.IO 4.6.1**: 실시간 양방향 통신
  - **WebSocket**: 기본 전송 프로토콜
  - **Polling Fallback**: 호환성 보장
  - **Room 시스템**: 사용자 그룹 관리
  - **자동 재연결**: 네트워크 끊김 복구

#### **성능 및 보안 미들웨어**
- **Compression 1.8.1**: Gzip 압축
  - 대역폭 사용량 최대 80% 절약
  - 동적 압축 레벨 조정
  
- **보안 헤더**: 다층 보안 시스템
  - **CSP (Content Security Policy)**: XSS 공격 방지
  - **HSTS**: HTTPS 강제 적용
  - **X-Frame-Options**: 클릭재킹 방지
  - **X-XSS-Protection**: 브라우저 XSS 필터 활성화

### 🗄️ **데이터 저장 및 관리**

#### **인메모리 데이터 구조**
- **Map 객체**: 방(Room) 정보 저장
  - O(1) 시간 복잡도로 빠른 조회
  - 가비지 컬렉션 최적화
  - 최대 1000개 방 제한으로 메모리 관리

- **세션 관리**: 클라이언트 사이드 저장
  - **SessionStorage**: 브라우저 세션 유지
  - **LocalStorage**: 사용자 설정 저장
  - 5분 TTL로 자동 만료

### 🌐 **네트워크 및 인프라**

#### **WebRTC 인프라**
- **STUN 서버**: Google 공개 STUN 서버 사용
  - `stun.l.google.com:19302`
  - NAT 트래버설 지원
  - 글로벌 접근성

#### **CDN 및 외부 서비스**
- **Cloudflare CDN**: Font Awesome 아이콘 로딩
- **Umami Analytics**: 프라이버시 중심 웹 분석
- **Google Search Console**: SEO 최적화

### 📊 **모니터링 및 로깅**

#### **서버 모니터링**
- **Health Check Endpoint**: `/health`
  - 서버 상태, 활성 방 수, 업타임 정보
  - 메모리 사용량 모니터링
  
- **로깅 시스템**
  - 구조화된 로그 메시지
  - 에러 추적 및 디버깅 정보
  - 사용자 연결/해제 이벤트 로깅

#### **에러 처리**
- **글로벌 에러 핸들러**: 예외 상황 안전 처리
- **Graceful Shutdown**: 안전한 서버 종료
- **자동 재시작**: PM2 또는 Docker 환경에서 자동 복구

## 📁 상세 프로젝트 구조

```
video.browse.kr/
├── 📁 public/                          # 정적 파일 디렉토리
│   ├── 🏠 index.html                   # 랜딩 페이지 (SEO 최적화)
│   │   ├── 완벽한 SEO 메타태그
│   │   ├── Open Graph & Twitter Card
│   │   ├── 구조화된 데이터 (Schema.org)
│   │   ├── PWA 매니페스트 연결
│   │   └── 반응형 디자인 & 애니메이션
│   │
│   ├── 💬 chat.html                    # 메인 화상채팅 애플리케이션
│   │   ├── WebRTC P2P 연결 로직
│   │   ├── Socket.IO 실시간 통신
│   │   ├── 다크/라이트 테마 시스템
│   │   ├── 반응형 UI/UX 디자인
│   │   ├── 키보드 단축키 지원
│   │   └── 접근성 (ARIA) 최적화
│   │
│   ├── 🖼️ landingpage-demo-dark.png    # 다크 테마 데모 이미지
│   ├── 🖼️ landingpage-demo-light.png   # 라이트 테마 데모 이미지
│   │
│   ├── 🤖 robots.txt                   # 검색 엔진 크롤러 설정
│   │   ├── 크롤링 허용/차단 규칙
│   │   └── 사이트맵 위치 명시
│   │
│   ├── 🗺️ sitemap.xml                  # XML 사이트맵
│   │   ├── 모든 페이지 URL 목록
│   │   ├── 최종 수정일 정보
│   │   └── 페이지 우선순위 설정
│   │
│   └── 📱 manifest.json                # PWA 매니페스트
│       ├── 앱 아이콘 및 메타데이터
│       ├── 테마 색상 설정
│       └── 설치 가능한 웹앱 구성
│
├── 🖥️ server.js                        # Express 서버 + Socket.IO
│   ├── 🔧 환경 변수 설정
│   ├── 🛡️ 보안 미들웨어 구성
│   ├── 🗜️ Gzip 압축 설정
│   ├── 📁 정적 파일 서빙
│   ├── 🏠 방(Room) 관리 시스템
│   ├── 🔄 Socket.IO 이벤트 처리
│   ├── 🧹 자동 방 정리 시스템
│   ├── 📊 헬스체크 엔드포인트
│   └── 🚨 글로벌 에러 핸들링
│
├── 📦 package.json                     # 프로젝트 의존성 및 스크립트
│   ├── 🎯 프로덕션 의존성
│   │   ├── express: 웹 프레임워크
│   │   ├── socket.io: 실시간 통신
│   │   └── compression: Gzip 압축
│   ├── 🔧 개발 의존성
│   │   └── nodemon: 개발 서버 자동 재시작
│   └── 📜 NPM 스크립트
│       ├── start: 프로덕션 실행
│       ├── dev: 개발 모드 실행
│       └── test: 테스트 실행
│
├── 📄 README.md                        # 프로젝트 문서 (현재 파일)
├── 📄 SEO-가이드.md                    # SEO 최적화 가이드
└── 📄 env.example                      # 환경 변수 예제 파일
```

### 📋 **파일별 상세 설명**

#### **🏠 index.html (랜딩 페이지)**
- **목적**: 서비스 소개 및 사용자 유입
- **특징**: 
  - 완벽한 SEO 최적화 (메타태그, 구조화된 데이터)
  - 반응형 디자인 (모바일 퍼스트)
  - 부드러운 애니메이션 효과
  - 시스템 테마 자동 감지

#### **💬 chat.html (메인 앱)**
- **목적**: 실제 화상채팅 기능 제공
- **특징**:
  - WebRTC P2P 연결 구현
  - 실시간 채팅 시스템
  - 다양한 레이아웃 옵션
  - 키보드 단축키 지원
  - 완벽한 모바일 지원

#### **🖥️ server.js (백엔드 서버)**
- **목적**: API 서버 및 Socket.IO 시그널링 서버
- **특징**:
  - Express.js 기반 웹 서버
  - Socket.IO 실시간 통신
  - 방(Room) 관리 시스템
  - 보안 미들웨어 적용
  - 자동 리소스 정리

## 🔧 상세 설정 가이드

### 🌍 **환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하여 서버 설정을 커스터마이징할 수 있습니다:

```bash
# 서버 기본 설정
PORT=3000                              # 서버 포트 (기본값: 3000)
NODE_ENV=production                    # 실행 환경 (development/production)
DOMAIN=video.browse.kr                 # 도메인 이름
BASE_URL=https://video.browse.kr       # 기본 URL

# CORS 설정
CORS_ORIGIN=https://video.browse.kr    # CORS 허용 도메인 (* 또는 특정 도메인)

# 방(Room) 관리 설정
MAX_ROOMS=1000                         # 최대 방 개수 (기본값: 1000)
ROOM_CLEANUP_INTERVAL=300000           # 방 정리 주기 (밀리초, 기본값: 5분)

# Socket.IO 설정
SOCKET_PING_TIMEOUT=60000              # 핑 타임아웃 (밀리초, 기본값: 60초)
SOCKET_PING_INTERVAL=25000             # 핑 간격 (밀리초, 기본값: 25초)
```

### 🔗 **STUN/TURN 서버 설정**

#### **기본 설정 (Google STUN)**
기본적으로 Google의 공개 STUN 서버를 사용합니다:
- `stun.l.google.com:19302`
- `stun1.l.google.com:19302`
- `stun2.l.google.com:19302`

#### **프로덕션 환경 권장 설정**
프로덕션 환경에서는 자체 TURN 서버 사용을 권장합니다.

`public/chat.html`의 `config` 객체를 수정:

```javascript
const config = {
  iceServers: [
    // STUN 서버 (NAT 트래버설)
    { urls: 'stun:your-stun-server.com:3478' },
    
    // TURN 서버 (방화벽 우회)
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-password'
    },
    
    // 백업 TURN 서버
    {
      urls: 'turns:your-turn-server.com:5349',  // TLS
      username: 'your-username',
      credential: 'your-password'
    }
  ],
  
  // ICE 후보 수집 정책
  iceCandidatePoolSize: 10,
  
  // 연결 정책
  iceTransportPolicy: 'all'  // 'relay'로 설정하면 TURN만 사용
};
```

#### **TURN 서버 구축 (coturn)**
```bash
# Ubuntu/Debian에서 coturn 설치
sudo apt-get install coturn

# 설정 파일 편집
sudo nano /etc/turnserver.conf

# 기본 설정 예시
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
external-ip=YOUR_SERVER_IP
realm=your-domain.com
server-name=your-domain.com
lt-cred-mech
user=username:password
```

### 🛡️ **보안 설정 강화**

#### **HTTPS 설정 (필수)**
WebRTC는 HTTPS 환경에서만 정상 작동합니다:

```javascript
// server.js에 HTTPS 설정 추가
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(options, app);
```

#### **CSP (Content Security Policy) 커스터마이징**
```javascript
// server.js의 CSP 헤더 수정
res.setHeader('Content-Security-Policy', 
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://your-cdn.com; " +
  "style-src 'self' 'unsafe-inline' https://your-cdn.com; " +
  "connect-src 'self' wss: ws: https://your-analytics.com; " +
  "media-src 'self'; " +
  "img-src 'self' data: https:;"
);
```

### 📊 **모니터링 및 분석 설정**

#### **Umami 웹 분석 설정**
```html
<!-- chat.html과 index.html에 추가 -->
<script defer 
  src="https://your-umami-instance.com/script.js" 
  data-website-id="your-website-id">
</script>
```

#### **커스텀 로깅 설정**
```javascript
// server.js에 Winston 로거 추가 (선택사항)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 🎨 **UI 커스터마이징**

#### **테마 색상 변경**
`public/chat.html`의 CSS Variables 수정:

```css
:root {
  --accent-primary: #4a9eff;    /* 메인 색상 */
  --accent-hover: #3a8eef;      /* 호버 색상 */
  --danger: #ef4444;            /* 위험 색상 */
  --success: #10b981;           /* 성공 색상 */
  --bg-primary: #0f0f0f;        /* 배경 색상 */
  --text-primary: #ffffff;      /* 텍스트 색상 */
}
```

#### **브랜딩 변경**
- 로고 및 아이콘 교체
- 파비콘 업데이트
- 메타 태그 수정 (title, description 등)

## 🔒 보안

- ✅ Gzip 압축으로 대역폭 절감
- ✅ 보안 헤더 설정 (XSS, Clickjacking 방지)
- ✅ P2P 연결로 서버를 거치지 않는 미디어 스트림
- ✅ HTTPS 사용 권장 (프로덕션)
- ✅ 입력 검증 및 XSS 방지

## 🎨 커스터마이징

### 테마 색상 변경

`index.html`의 CSS 변수를 수정:

```css
:root {
  --accent-primary: #4a9eff;  /* 메인 색상 */
  --danger: #ef4444;           /* 위험 색상 */
  --success: #10b981;          /* 성공 색상 */
}
```

### 세션 유지 시간 변경

기본값은 30분입니다. `restoreSession()` 함수에서 변경:

```javascript
if (timeDiff > 30 * 60 * 1000) { // 30분
```

## 📊 SEO 최적화

이 프로젝트는 검색 엔진 최적화를 위해 다음을 포함합니다:

- ✅ 의미론적 HTML5 태그
- ✅ 메타 태그 (description, keywords)
- ✅ Open Graph 태그 (소셜 미디어)
- ✅ Twitter Card 태그
- ✅ 구조화된 데이터 (Schema.org)
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ PWA manifest.json
- ✅ 접근성 (ARIA 레이블)

## 🌐 브라우저 지원

- ✅ Chrome 74+
- ✅ Firefox 66+
- ✅ Safari 12.1+
- ✅ Edge 79+
- ✅ Opera 62+

**참고**: WebRTC는 HTTPS 또는 localhost에서만 작동합니다.

## 📱 PWA (Progressive Web App)

이 앱은 PWA로 작동하여 모바일 기기에 설치할 수 있습니다:

1. 브라우저 메뉴에서 "홈 화면에 추가" 선택
2. 앱 아이콘으로 네이티브 앱처럼 실행

## 🚀 배포

### Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Vercel

```bash
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [WebRTC](https://webrtc.org/) - 실시간 통신 기술
- [Socket.IO](https://socket.io/) - 실시간 양방향 통신
- [Express](https://expressjs.com/) - 웹 프레임워크

## 📧 문의

프로젝트 관련 문의사항이 있으시면 [Issues](https://github.com/yourusername/webrtc-chat/issues)를 통해 알려주세요.

---

⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요!

