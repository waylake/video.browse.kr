const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const compression = require('compression');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Gzip 압축 활성화
app.use(compression());

// 보안 헤더
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, display-capture=*');
  next();
});

// 정적 파일 제공 (캐싱 설정)
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// manifest.json
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size,
    uptime: process.uptime()
  });
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', (callback) => {
    const roomId = generateRoomId();
    rooms.set(roomId, { host: socket.id, guest: null });
    socket.join(roomId);
    socket.roomId = roomId;
    socket.isHost = true;
    callback({ roomId, isHost: true });
    console.log(`Room created: ${roomId}`);
  });

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

    room.guest = socket.id;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.isHost = false;

    socket.to(room.host).emit('peer-joined', socket.id);
    callback({ success: true, peerId: room.host, isHost: false });
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('join-random-room', (callback) => {
    // 혼자 있는 방 찾기 (guest가 null인 방)
    let availableRoomId = null;
    for (const [id, room] of rooms.entries()) {
      if (!room.guest) {
        availableRoomId = id;
        break;
      }
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

  socket.on('offer', (data) => {
    socket.to(data.to).emit('offer', {
      from: socket.id,
      offer: data.offer
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.to).emit('answer', {
      from: socket.id,
      answer: data.answer
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.to).emit('ice-candidate', {
      from: socket.id,
      candidate: data.candidate
    });
  });

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

  // 에러 핸들링
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// 주기적으로 빈 방 정리 (메모리 최적화)
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (!room.host && !room.guest) {
      rooms.delete(roomId);
    }
  }
}, 5 * 60 * 1000); // 5분마다 실행

function generateRoomId() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
