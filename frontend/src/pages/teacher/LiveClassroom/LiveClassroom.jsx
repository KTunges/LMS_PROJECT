import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FiUsers, FiSend, FiLogOut, FiVideo, FiVideoOff, FiMic, FiMicOff, FiMonitor, FiUserX } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { liveService } from '../../../services';
import './LiveClassroom.css';
import { toast } from 'react-toastify';

const LiveClassroom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch initial chat history (optional but recommended)
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

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId, user]);

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

  const handleEndSession = async () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc buổi học trực tuyến này?')) {
      try {
        await liveService.endSession(sessionId);
        toast.success('Đã kết thúc buổi học');
        navigate('/portal-giang-vien');
      } catch (err) {
        toast.error('Lỗi khi kết thúc buổi học');
      }
    }
  };

  const handleKickUser = (targetUserId) => {
    if (window.confirm('Mời sinh viên này ra khỏi phòng?')) {
      socket.emit('kick-user', { sessionId, targetUserId });
    }
  };

  return (
    <div className="live-classroom-layout">
      {/* LEFT: Video/Screen Sharing Area (Mockup for now) */}
      <div className="live-main-area">
        <div className="live-video-container">
          {isVideoOn ? (
            <div className="video-placeholder active">
              <span className="camera-on-text">Camera đang bật (Giảng viên)</span>
            </div>
          ) : (
            <div className="video-placeholder">
              <div className="avatar-large">{user?.full_name?.charAt(0)}</div>
              <p>Giảng viên chưa bật Camera</p>
            </div>
          )}

          {/* Teacher Controls */}
          <div className="live-controls">
            <button className={`control-btn ${isMicOn ? 'active' : 'danger'}`} onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
            </button>
            <button className={`control-btn ${isVideoOn ? 'active' : 'danger'}`} onClick={() => setIsVideoOn(!isVideoOn)}>
              {isVideoOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
            </button>
            <button className="control-btn"><FiMonitor size={20} /></button>
            <div className="spacer"></div>
            <button className="control-btn end-btn" onClick={handleEndSession}>
              <FiLogOut size={20} /> Kết thúc
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat & Participants Sidebar */}
      <div className="live-sidebar">
        {/* Tabs for Sidebar */}
        <div className="sidebar-header">
          <div className="tab active">Trò chuyện</div>
          <div className="tab">Học viên ({participants.filter(p => p.role === 'student').length})</div>
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

        {/* Optional: Participants List (can toggle via state, simplified here) */}
        {/* <div className="participants-list">
          {participants.map(p => (
            <div key={p.userId} className="participant-item">
              <span>{p.name}</span>
              {p.role === 'student' && (
                <button onClick={() => handleKickUser(p.userId)} className="kick-btn" title="Mời ra"><FiUserX/></button>
              )}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default LiveClassroom;
