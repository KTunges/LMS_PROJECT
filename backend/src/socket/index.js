const { Server } = require('socket.io');
const { ChatMessage } = require('../models');

module.exports = function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // For dev. In production, restrict this.
      methods: ['GET', 'POST']
    }
  });

  // Keep track of connected users per room: room_id -> array of { socketId, userId, name, role }
  const roomUsers = {};

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room
    socket.on('join-room', (data) => {
      const { sessionId, user } = data;
      if (!sessionId || !user) return;

      socket.join(`session_${sessionId}`);
      console.log(`👤 User ${user.name} joined session ${sessionId}`);

      if (!roomUsers[sessionId]) {
        roomUsers[sessionId] = [];
      }
      
      // Remove if already exists (reconnect)
      roomUsers[sessionId] = roomUsers[sessionId].filter(u => u.userId !== user.id);
      
      // Add new user
      roomUsers[sessionId].push({
        socketId: socket.id,
        userId: user.id,
        name: user.name,
        role: user.role
      });

      // Broadcast to room that someone joined
      io.to(`session_${sessionId}`).emit('user-joined', {
        user,
        participants: roomUsers[sessionId]
      });
    });

    // Handle chat message
    socket.on('send-message', async (data) => {
      const { sessionId, userId, message, name, role } = data;
      
      try {
        // Save to DB
        const savedMsg = await ChatMessage.create({
          session_id: sessionId,
          user_id: userId,
          message: message,
          type: 'text'
        });

        // Broadcast to room
        io.to(`session_${sessionId}`).emit('new-message', {
          id: savedMsg.id,
          session_id: sessionId,
          user_id: userId,
          name,
          role,
          message,
          created_at: savedMsg.created_at
        });
      } catch (err) {
        console.error('Error saving chat message:', err);
      }
    });

    // Handle kick user (Teacher only)
    socket.on('kick-user', (data) => {
      const { sessionId, targetUserId } = data;
      const targetUser = roomUsers[sessionId]?.find(u => u.userId === targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('kicked-from-room', { message: 'Bạn đã bị giáo viên mời ra khỏi phòng.' });
        // Make them leave
        io.sockets.sockets.get(targetUser.socketId)?.leave(`session_${sessionId}`);
        
        // Remove from list
        roomUsers[sessionId] = roomUsers[sessionId].filter(u => u.userId !== targetUserId);
        io.to(`session_${sessionId}`).emit('participants-update', roomUsers[sessionId]);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Find which room they were in and remove them
      for (const sessionId in roomUsers) {
        const userIndex = roomUsers[sessionId].findIndex(u => u.socketId === socket.id);
        if (userIndex !== -1) {
          const user = roomUsers[sessionId][userIndex];
          roomUsers[sessionId].splice(userIndex, 1);
          io.to(`session_${sessionId}`).emit('user-left', {
            userId: user.userId,
            name: user.name,
            participants: roomUsers[sessionId]
          });
          break;
        }
      }
    });

    // --- WebRTC Signaling ---
    socket.on('webrtc-offer', (data) => {
      // Teacher sends offer to a specific student (or broadcast to room)
      socket.to(data.targetSocketId).emit('webrtc-offer', {
        sdp: data.sdp,
        senderSocketId: socket.id
      });
    });

    socket.on('webrtc-answer', (data) => {
      // Student sends answer back to teacher
      socket.to(data.targetSocketId).emit('webrtc-answer', {
        sdp: data.sdp,
        senderSocketId: socket.id
      });
    });

    socket.on('ice-candidate', (data) => {
      // Send ICE candidates to peers
      socket.to(data.targetSocketId).emit('ice-candidate', {
        candidate: data.candidate,
        senderSocketId: socket.id
      });
    });
  });

  return io;
};
