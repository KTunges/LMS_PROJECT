import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FiUsers, FiSend, FiLogOut, FiVideoOff } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { liveService } from '../../../services';
import '../../teacher/LiveClassroom/LiveClassroom.css'; // Reusing the same CSS
import { toast } from 'react-toastify';

const StudentLiveClassroom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [streamActive, setStreamActive] = useState(false);
  
  const messagesEndRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const teacherVideoRef = useRef(null);

  useEffect(() => {
    // 1. Fetch initial chat history
    const fetchHistory = async () => {
      try {
        const res = await liveService.getSessionMessages(sessionId);
        if (res.data && res.data.success) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching chat history', err);
      }
    };
    fetchHistory();

    // 2. Initialize Socket connection
    const newSocket = io('http://localhost:5005');
    setSocket(newSocket);

    // 3. Setup event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      // Join room
      newSocket.emit('join-room', { 
        sessionId, 
        user: { id: user.id, name: user.full_name, role: user.role } 
      });
    });

    newSocket.on('user-joined', (data) => {
      setParticipants(data.participants);
      setMessages(prev => [...prev, { type: 'system', message: `${data.user.name} đã tham gia phòng học.` }]);
    });

    newSocket.on('user-left', (data) => {
      setParticipants(data.participants);
      setMessages(prev => [...prev, { type: 'system', message: `${data.name} đã rời phòng.` }]);
    });

    newSocket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('participants-update', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    newSocket.on('kicked-from-room', (data) => {
      toast.error(data.message || 'Bạn đã bị mời ra khỏi phòng');
      navigate('/student');
    });

    newSocket.on('session-ended', (data) => {
      toast.info(data.message || 'Phiên học đã kết thúc');
      navigate('/student');
    });

    // --- WebRTC Student Side ---
    newSocket.on('webrtc-offer', async (data) => {
      console.log('Received WebRTC offer from teacher');
      setStreamActive(true);
      
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;
      
      pc.ontrack = (event) => {
        console.log('Received remote track');
        if (teacherVideoRef.current) {
          teacherVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          newSocket.emit('ice-candidate', {
            targetSocketId: data.senderSocketId,
            candidate: event.candidate
          });
        }
      };
      
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      newSocket.emit('webrtc-answer', {
        targetSocketId: data.senderSocketId,
        sdp: answer
      });
    });

    newSocket.on('ice-candidate', async (data) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      newSocket.disconnect();
    };
  }, [sessionId, user, navigate]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-message', {
      sessionId,
      userId: user.id,
      name: user.full_name,
      role: user.role,
      message: newMessage
    });

    setNewMessage('');
  };

  const handleLeaveSession = () => {
    if (window.confirm('Bạn có chắc chắn muốn rời khỏi phòng?')) {
      navigate('/student');
    }
  };

  return (
    <div className="live-classroom-layout">
      {/* LEFT: Video/Screen Sharing Area (Mockup for now) */}
      <div className="live-main-area">
        <div className="live-video-container">
          {streamActive ? (
            <video 
              ref={teacherVideoRef} 
              autoPlay 
              playsInline 
              style={{ width: '100%', height: '100%', backgroundColor: '#000', objectFit: 'contain' }}
            />
          ) : (
            <div className="video-placeholder">
              <FiVideoOff size={48} />
              <p>Đang chờ Giảng viên chia sẻ màn hình...</p>
            </div>
          )}

          {/* Student Controls */}
          <div className="live-controls">
            <button className="control-btn end-btn" onClick={handleLeaveSession} style={{ background: '#475569' }}>
              <FiLogOut size={20} /> Rời phòng
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat & Participants Sidebar */}
      <div className="live-sidebar">
        {/* Tabs for Sidebar */}
        <div className="sidebar-header">
          <div className="tab active">Trò chuyện</div>
          <div className="tab">Mọi người ({participants.length})</div>
        </div>

        {/* Chat Area */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            msg.type === 'system' ? (
              <div key={idx} className="system-message">{msg.message}</div>
            ) : (
              <div key={idx} className={`chat-bubble ${msg.user_id === user.id ? 'me' : ''}`}>
                {msg.user_id !== user.id && <div className="chat-name">{msg.name} {msg.role === 'teacher' && <span className="teacher-badge">GV</span>}</div>}
                <div className="chat-content">{msg.message}</div>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={!newMessage.trim()} className="send-btn">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLiveClassroom;
