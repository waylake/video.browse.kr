/**
 * ===================================================================
 * WebRTC Video Chat Server
 * ===================================================================
 * 
 * WebRTC 기반 1:1 화상 채팅 서비스의 백엔드 서버
 * 
 * 주요 기능:
 * - Express.js 웹 서버
 * - Socket.IO 실시간 통신 (WebRTC 시그널링)
 * - 방(Room) 관리 시스템
 * - 보안 미들웨어 적용
 * - 자동 리소스 정리
 * - 헬스체크 API
 * 
 * @author Video Chat Team
 * @version 1.0.0
 * @license MIT
 */

// ===================================================================
// 필수 모듈 임포트
// ===================================================================

const express = require('express');          // 웹 프레임워크
const http = require('http');                // HTTP 서버
const socketIo = require('socket.io');       // 실시간 양방향 통신
const path = require('path');                // 파일 경로 처리
const compression = require('compression');   // Gzip 압축 미들웨어

// ===================================================================
// 환경 변수 설정 및 기본값 정의
// ===================================================================

/**
 * 서버 실행 환경 설정
 * - development: 개발 환경 (디버깅 로그, 느슨한 보안)
 * - production: 프로덕션 환경 (최적화, 강화된 보안)
 */
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * 서버 포트 설정
 * - 기본값: 3000
 * - 클라우드 환경에서는 자동으로 할당된 포트 사용
 */
const PORT = process.env.PORT || 3000;

/**
 * 도메인 및 URL 설정
 * - DOMAIN: 서비스 도메인 이름
 * - BASE_URL: 완전한 서비스 URL (CORS, 리다이렉트 등에 사용)
 */
const DOMAIN = process.env.DOMAIN || 'localhost';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * CORS (Cross-Origin Resource Sharing) 설정
 * - 개발 환경: 모든 도메인 허용 (*)
 * - 프로덕션 환경: 특정 도메인만 허용
 */
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

/**
 * 방(Room) 관리 설정
 * - MAX_ROOMS: 서버에서 동시에 관리할 수 있는 최대 방 개수
 * - 메모리 사용량 제한 및 서버 안정성을 위한 제한
 */
const MAX_ROOMS = parseInt(process.env.MAX_ROOMS) || 1000;

/**
 * 자동 정리 시스템 설정
 * - ROOM_CLEANUP_INTERVAL: 빈 방 정리 주기 (밀리초)
 * - 기본값: 300000ms (5분)
 * - 메모리 누수 방지 및 성능 최적화
 */
const ROOM_CLEANUP_INTERVAL = parseInt(process.env.ROOM_CLEANUP_INTERVAL) || 300000;

/**
 * Socket.IO 연결 관리 설정
 * - SOCKET_PING_TIMEOUT: 클라이언트 응답 대기 시간
 * - SOCKET_PING_INTERVAL: 서버에서 클라이언트로 핑 전송 간격
 * - 연결 상태 모니터링 및 끊어진 연결 감지
 */
const SOCKET_PING_TIMEOUT = parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000;   // 60초
const SOCKET_PING_INTERVAL = parseInt(process.env.SOCKET_PING_INTERVAL) || 25000; // 25초

// ===================================================================
// Express 앱 및 서버 초기화
// ===================================================================

/**
 * Express 애플리케이션 인스턴스 생성
 * - 웹 서버의 핵심 객체
 * - 미들웨어, 라우트, 설정 등을 관리
 */
const app = express();

/**
 * HTTP 서버 생성
 * - Express 앱을 HTTP 서버로 래핑
 * - Socket.IO가 이 서버를 사용하여 WebSocket 연결 처리
 */
const server = http.createServer(app);

/**
 * Socket.IO 서버 초기화
 * - 실시간 양방향 통신을 위한 WebSocket 서버
 * - WebRTC 시그널링 서버 역할 수행
 */
const io = socketIo(server, {
  // CORS (Cross-Origin Resource Sharing) 설정
  cors: {
    // 허용할 도메인 설정
    origin: NODE_ENV === 'production' ? [BASE_URL] : CORS_ORIGIN,
    // 허용할 HTTP 메서드
    methods: ["GET", "POST"],
    // 쿠키 및 인증 정보 전송 허용
    credentials: true
  },
  
  // 클라이언트 응답 대기 시간 (밀리초)
  // 이 시간 내에 응답이 없으면 연결 끊김으로 간주
  pingTimeout: SOCKET_PING_TIMEOUT,
  
  // 서버에서 클라이언트로 핑 전송 간격 (밀리초)
  // 연결 상태 확인을 위한 주기적 핑
  pingInterval: SOCKET_PING_INTERVAL,
  
  // 사용할 전송 방식 우선순위
  // websocket 우선, 실패 시 polling으로 폴백
  transports: ['websocket', 'polling']
});

// ===================================================================
// 성능 최적화 미들웨어
// ===================================================================

/**
 * Gzip 압축 미들웨어 활성화
 * - 모든 HTTP 응답을 Gzip으로 압축
 * - 대역폭 사용량 최대 80% 절약 가능
 * - 특히 HTML, CSS, JavaScript 파일에 효과적
 */
app.use(compression());

// ===================================================================
// 보안 미들웨어 설정 (프로덕션 수준)
// ===================================================================

/**
 * 보안 헤더 설정 미들웨어
 * - 다양한 웹 보안 취약점으로부터 보호
 * - OWASP 보안 가이드라인 준수
 */
app.use((req, res, next) => {
  
  // ===================================================================
  // 기본 보안 헤더
  // ===================================================================
  
  /**
   * X-Content-Type-Options: nosniff
   * - MIME 타입 스니핑 방지
   * - 브라우저가 Content-Type 헤더를 무시하고 파일 내용을 추측하는 것을 방지
   * - XSS 공격 벡터 차단
   */
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  /**
   * X-Frame-Options: DENY
   * - 클릭재킹(Clickjacking) 공격 방지
   * - 다른 사이트에서 iframe으로 이 페이지를 삽입하는 것을 완전 차단
   */
  res.setHeader('X-Frame-Options', 'DENY');
  
  /**
   * X-XSS-Protection: 1; mode=block
   * - 브라우저의 내장 XSS 필터 활성화
   * - XSS 공격 감지 시 페이지 렌더링 차단
   * - 구형 브라우저 지원용 (최신 브라우저는 CSP 사용)
   */
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  /**
   * Referrer-Policy: strict-origin-when-cross-origin
   * - HTTP Referer 헤더 정책 설정
   * - 같은 도메인: 전체 URL 전송
   * - 다른 도메인: 도메인만 전송 (HTTPS→HTTP 시 전송 안함)
   * - 사용자 프라이버시 보호
   */
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // ===================================================================
  // HTTPS 보안 강화 (프로덕션 환경)
  // ===================================================================
  
  /**
   * HSTS (HTTP Strict Transport Security)
   * - 프로덕션 환경에서만 활성화
   * - 브라우저가 HTTPS로만 접속하도록 강제
   * - max-age: 1년간 적용
   * - includeSubDomains: 모든 서브도메인에 적용
   * - preload: HSTS preload 리스트 등록 가능
   */
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // ===================================================================
  // CSP (Content Security Policy) - 고급 보안 정책
  // ===================================================================
  
  /**
   * Content Security Policy 설정
   * - XSS, 데이터 주입 공격 등을 방지하는 강력한 보안 메커니즘
   * - 리소스 로드 소스를 세밀하게 제어
   */
  res.setHeader('Content-Security-Policy', 
    // 기본 정책: 같은 도메인에서만 리소스 로드 허용
    "default-src 'self'; " +
    
    // 스크립트 소스 정책
    // - 'self': 같은 도메인의 스크립트
    // - 'unsafe-inline': 인라인 스크립트 허용 (WebRTC 코드 때문에 필요)
    // - cdnjs.cloudflare.com: Font Awesome 등 CDN 스크립트
    // - umami.browse.kr: 웹 분석 스크립트
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://umami.browse.kr; " +
    
    // 스타일 소스 정책
    // - 'unsafe-inline': 인라인 CSS 허용 (동적 테마 때문에 필요)
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
    
    // 폰트 소스 정책
    "font-src 'self' https://cdnjs.cloudflare.com; " +
    
    // 이미지 소스 정책
    // - data:: Base64 인코딩된 이미지 허용 (파비콘 등)
    // - https:: 모든 HTTPS 이미지 허용
    "img-src 'self' data: https:; " +
    
    // 네트워크 연결 정책
    // - wss:, ws:: WebSocket 연결 허용 (Socket.IO)
    // - umami.browse.kr: 분석 데이터 전송
    "connect-src 'self' wss: ws: https://umami.browse.kr; " +
    
    // 미디어 소스 정책 (비디오, 오디오)
    "media-src 'self'; " +
    
    // 프레임 소스 정책 (iframe 등)
    // - 'none': iframe 사용 완전 차단 (보안 강화)
    "frame-src 'none';"
  );
  
  // ===================================================================
  // Permissions Policy (구 Feature Policy)
  // ===================================================================
  
  /**
   * Permissions-Policy 설정
   * - 브라우저 기능 사용 권한 제어
   * - WebRTC 화상채팅을 위해 카메라, 마이크, 화면 공유 허용
   * - camera=*: 모든 도메인에서 카메라 사용 허용
   * - microphone=*: 모든 도메인에서 마이크 사용 허용
   * - display-capture=*: 화면 공유 기능 허용
   */
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, display-capture=*');
  
  // 다음 미들웨어로 진행
  next();
});

// ===================================================================
// 정적 파일 서빙 설정 (성능 최적화)
// ===================================================================

/**
 * 정적 파일 미들웨어 설정
 * - public 폴더의 파일들을 웹에서 접근 가능하게 설정
 * - 캐싱 정책 적용으로 성능 최적화
 */
app.use(express.static('public', {
  // 기본 캐시 유지 시간: 1일
  // 이미지, CSS, JS 등 정적 리소스에 적용
  maxAge: '1d',
  
  // ETag 헤더 생성 활성화
  // 파일 변경 감지를 위한 해시값 생성
  etag: true,
  
  // Last-Modified 헤더 설정
  // 파일의 마지막 수정 시간 정보 제공
  lastModified: true,
  
  // 파일별 커스텀 헤더 설정
  setHeaders: (res, filePath) => {
    // HTML 파일은 항상 최신 버전 확인
    // 동적 콘텐츠이므로 캐시하지 않음
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// ===================================================================
// 메인 라우트 설정
// ===================================================================

/**
 * 루트 경로 라우트 ('/')
 * - 랜딩 페이지 제공
 * - SEO 최적화된 메인 페이지
 * - 서비스 소개 및 시작 버튼 포함
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * 채팅 페이지 라우트 ('/chat')
 * - 메인 화상채팅 애플리케이션 제공
 * - WebRTC 기능이 구현된 페이지
 * - 깔끔한 URL 제공 (chat.html 없이)
 */
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

/**
 * 채팅 페이지 대체 라우트 ('/chat.html')
 * - 직접 파일명으로 접근하는 경우 처리
 * - 하위 호환성 제공
 */
app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// ===================================================================
// SEO 및 웹 표준 파일 라우트
// ===================================================================

/**
 * robots.txt 라우트
 * - 검색 엔진 크롤러 가이드라인 제공
 * - 크롤링 허용/차단 규칙 정의
 * - 사이트맵 위치 정보 포함
 */
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

/**
 * sitemap.xml 라우트
 * - XML 사이트맵 제공
 * - 검색 엔진 최적화 (SEO)
 * - 모든 페이지 URL과 메타데이터 포함
 */
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

/**
 * manifest.json 라우트
 * - PWA (Progressive Web App) 매니페스트 제공
 * - 앱 설치 가능하게 만드는 메타데이터
 * - 아이콘, 테마 색상, 앱 이름 등 정의
 */
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// ===================================================================
// 모니터링 및 헬스체크 API
// ===================================================================

/**
 * 헬스체크 엔드포인트 ('/health')
 * - 서버 상태 모니터링용 API
 * - 로드밸런서, 모니터링 도구에서 사용
 * - 서버 메트릭 정보 제공
 */
app.get('/health', (req, res) => {
  res.json({ 
    // 서버 상태 (항상 'ok')
    status: 'ok',
    
    // 현재 활성 방 개수
    rooms: rooms.size,
    
    // 최대 허용 방 개수
    maxRooms: MAX_ROOMS,
    
    // 서버 가동 시간 (초)
    uptime: process.uptime(),
    
    // 실행 환경 (development/production)
    environment: NODE_ENV,
    
    // 서비스 도메인
    domain: DOMAIN,
    
    // 응답 시간 (타임스탬프)
    timestamp: new Date().toISOString(),
    
    // 메모리 사용량 정보
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
  });
});

// ===================================================================
// 방(Room) 관리 시스템
// ===================================================================

/**
 * 활성 방 정보를 저장하는 Map
 * - Key: roomId (7자리 문자열)
 * - Value: { host, guest, createdAt }
 */
const rooms = new Map();

// ===================================================================
// Socket.IO 이벤트 처리
// ===================================================================

/**
 * 새로운 클라이언트 연결 처리
 */
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  /**
   * 새 방 생성 이벤트
   * - 호스트가 새로운 방을 만들 때 호출
   * - 7자리 고유 방 코드 생성
   */
  socket.on('create-room', (callback) => {
    // 서버 용량 체크
    if (rooms.size >= MAX_ROOMS) {
      callback({ error: '서버가 가득 찼습니다. 잠시 후 다시 시도해주세요.' });
      return;
    }

    // 새 방 생성
    const roomId = generateRoomId();
    rooms.set(roomId, { 
      host: socket.id, 
      guest: null, 
      createdAt: Date.now() 
    });
    
    // 소켓을 방에 추가
    socket.join(roomId);
    socket.roomId = roomId;
    socket.isHost = true;
    
    callback({ roomId, isHost: true });
    console.log(`Room created: ${roomId} (Total rooms: ${rooms.size})`);
  });

  /**
   * 방 코드로 방 참가 이벤트
   * - 사용자가 7자리 방 코드를 입력해서 참가
   */
  socket.on('join-room', (roomId, callback) => {
    const room = rooms.get(roomId);

    if (!room) {
      callback({ error: '존재하지 않는 방입니다.' });
      return;
    }

    if (room.guest) {
      callback({ error: '방이 가득 찼습니다.' });
      return;
    }

    // 게스트로 방 참가
    room.guest = socket.id;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.isHost = false;

    // 호스트에게 새 참가자 알림
    socket.to(room.host).emit('peer-joined', socket.id);
    callback({ success: true, peerId: room.host, isHost: false });
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  /**
   * 랜덤 방 참가 이벤트
   * - 대기 중인 방에 자동 매칭
   * - 없으면 새 방 생성
   */
  socket.on('join-random-room', (callback) => {
    // 빈 방 찾기
    let availableRoomId = null;
    for (const [id, room] of rooms.entries()) {
      if (!room.guest) {
        availableRoomId = id;
        break;
      }
    }

    // 빈 방이 없으면 새로 생성
    if (!availableRoomId) {
      if (rooms.size >= MAX_ROOMS) {
        callback({ error: '서버가 가득 찼습니다. 잠시 후 다시 시도해주세요.' });
        return;
      }

      const newRoomId = generateRoomId();
      rooms.set(newRoomId, { 
        host: socket.id, 
        guest: null, 
        createdAt: Date.now() 
      });
      socket.join(newRoomId);
      socket.roomId = newRoomId;
      socket.isHost = true;
      callback({ success: true, roomId: newRoomId, isHost: true, peerId: null, created: true });
      console.log(`No available rooms. User ${socket.id} created new room: ${newRoomId} (Total: ${rooms.size})`);
      return;
    }

    // 찾은 방에 참가
    const room = rooms.get(availableRoomId);
    room.guest = socket.id;
    socket.join(availableRoomId);
    socket.roomId = availableRoomId;
    socket.isHost = false;

    socket.to(room.host).emit('peer-joined', socket.id);
    callback({ success: true, roomId: availableRoomId, peerId: room.host, isHost: false, created: false });
    console.log(`User ${socket.id} randomly joined room: ${availableRoomId}`);
  });

  socket.on('rejoin-room', (data, callback) => {
    const { roomId, wasHost } = data;
    const room = rooms.get(roomId);

    if (!room) {
      callback({ error: '방이 더 이상 존재하지 않습니다.' });
      return;
    }

    // 호스트로 재참가
    if (wasHost) {
      // 기존 호스트 소켓 업데이트
      room.host = socket.id;
      socket.join(roomId);
      socket.roomId = roomId;
      socket.isHost = true;

      // 게스트가 있으면 알림
      if (room.guest) {
        callback({ success: true, roomId, isHost: true, peerId: room.guest });
        socket.to(room.guest).emit('peer-reconnected', socket.id);
      } else {
        callback({ success: true, roomId, isHost: true, peerId: null });
      }
      console.log(`Host ${socket.id} rejoined room: ${roomId}`);
    } 
    // 게스트로 재참가
    else {
      if (room.guest && room.guest !== socket.id) {
        callback({ error: '방이 가득 찼습니다.' });
        return;
      }

      room.guest = socket.id;
      socket.join(roomId);
      socket.roomId = roomId;
      socket.isHost = false;

      callback({ success: true, roomId, isHost: false, peerId: room.host });
      socket.to(room.host).emit('peer-reconnected', socket.id);
      console.log(`Guest ${socket.id} rejoined room: ${roomId}`);
    }
  });

  // ===================================================================
  // WebRTC 시그널링 이벤트들
  // ===================================================================

  /**
   * WebRTC Offer 전달 - P2P 연결 시작
   */
  socket.on('offer', (data) => {
    socket.to(data.to).emit('offer', {
      from: socket.id,
      offer: data.offer
    });
  });

  /**
   * WebRTC Answer 전달 - Offer에 대한 응답
   */
  socket.on('answer', (data) => {
    socket.to(data.to).emit('answer', {
      from: socket.id,
      answer: data.answer
    });
  });

  /**
   * ICE Candidate 전달 - NAT 트래버설
   */
  socket.on('ice-candidate', (data) => {
    socket.to(data.to).emit('ice-candidate', {
      from: socket.id,
      candidate: data.candidate
    });
  });

  /**
   * 채팅 메시지 전달 - 실시간 텍스트 채팅
   */
  socket.on('chat-message', (data) => {
    socket.to(data.to).emit('chat-message', {
      from: socket.id,
      message: data.message,
      timestamp: Date.now()
    });
  });

  // 다음 사람 찾기 (현재 방 나가고 새로운 랜덤 방 찾기)
  socket.on('switch-to-next', (callback) => {
    console.log(`User ${socket.id} switching to next person`);
    
    // 현재 방에서 나가기
    if (socket.roomId) {
      const currentRoom = rooms.get(socket.roomId);
      if (currentRoom) {
        // 상대방에게 알림
        socket.to(socket.roomId).emit('peer-disconnected');
        
        // 방에서 자신 제거
        if (currentRoom.host === socket.id) {
          currentRoom.host = currentRoom.guest;
          currentRoom.guest = null;
          // 방이 완전히 비었으면 삭제
          if (!currentRoom.host) {
            rooms.delete(socket.roomId);
          }
        } else if (currentRoom.guest === socket.id) {
          currentRoom.guest = null;
        }
        
        socket.leave(socket.roomId);
      }
    }
    
    // 새로운 랜덤 방 찾기
    let availableRoomId = null;
    const availableRooms = [];
    
    // 혼자 있는 방들 찾기
    for (const [id, room] of rooms.entries()) {
      if (!room.guest && room.host !== socket.id) {
        availableRooms.push(id);
      }
    }
    
    // 랜덤으로 선택
    if (availableRooms.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      availableRoomId = availableRooms[randomIndex];
    }
    
    // 참가 가능한 방이 없으면 새 방 생성
    if (!availableRoomId) {
      const newRoomId = generateRoomId();
      rooms.set(newRoomId, { host: socket.id, guest: null });
      socket.join(newRoomId);
      socket.roomId = newRoomId;
      socket.isHost = true;
      callback({ success: true, roomId: newRoomId, isHost: true, peerId: null, created: true });
      console.log(`No available rooms. User ${socket.id} created new room: ${newRoomId}`);
      return;
    }
    
    // 찾은 방에 참가
    const room = rooms.get(availableRoomId);
    room.guest = socket.id;
    socket.join(availableRoomId);
    socket.roomId = availableRoomId;
    socket.isHost = false;
    
    socket.to(room.host).emit('peer-joined', socket.id);
    callback({ success: true, roomId: availableRoomId, peerId: room.host, isHost: false, created: false });
    console.log(`User ${socket.id} switched to room: ${availableRoomId}`);
  });

  /**
   * 클라이언트 연결 해제 처리
   * - 방에서 사용자 제거
   * - 상대방에게 연결 해제 알림
   */
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (socket.roomId) {
      const room = rooms.get(socket.roomId);
      if (room) {
        socket.to(socket.roomId).emit('peer-disconnected');
        rooms.delete(socket.roomId);
      }
    }
  });

  /**
   * Socket 에러 처리
   */
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// 주기적으로 빈 방 정리 (메모리 최적화)
setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;
  
  for (const [roomId, room] of rooms.entries()) {
    // 빈 방이거나 1시간 이상 된 방 삭제
    const isOldRoom = room.createdAt && (now - room.createdAt) > 3600000; // 1시간
    const isEmptyRoom = !room.host && !room.guest;
    
    if (isEmptyRoom || isOldRoom) {
      rooms.delete(roomId);
      deletedCount++;
    }
  }
  
  if (deletedCount > 0) {
    console.log(`🧹 Cleaned up ${deletedCount} rooms. Current rooms: ${rooms.size}`);
  }
}, ROOM_CLEANUP_INTERVAL);

function generateRoomId() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// 글로벌 에러 핸들러
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Video.browse.kr Server Started`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: ${BASE_URL}`);
  console.log(`🏠 Max Rooms: ${MAX_ROOMS}`);
  console.log(`🧹 Cleanup Interval: ${ROOM_CLEANUP_INTERVAL / 1000}s`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

