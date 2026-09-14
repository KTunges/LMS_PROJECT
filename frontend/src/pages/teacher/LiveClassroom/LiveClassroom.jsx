import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { liveService } from '../../../services';
import './LiveClassroom.css';
import { toast } from 'react-toastify';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const LiveClassroom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!user || !containerRef.current) return;

    const myMeeting = async (element) => {
      try {
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID) || 0;
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET || '';
        
        if (!appID || !serverSecret) {
          toast.warning("Chưa cấu hình ZegoCloud API Key trong .env");
          return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          sessionId,
          user.id.toString(),
          user.full_name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        const isTeacher = user.role === 'teacher';

        zp.joinRoom({
          container: element,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: isTeacher, 
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: 'Auto',
          showLayoutButton: true,
          onLeaveRoom: () => {
            navigate(isTeacher ? '/portal-giang-vien' : '/student');
          }
        });
      } catch (err) {
        console.error("ZegoCloud Error: ", err);
        toast.error("Không thể kết nối phòng học");
      }
    };

    myMeeting(containerRef.current);
  }, [sessionId, user, navigate]);

  const handleEndSession = async () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc buổi học trực tuyến này?')) {
      try {
        await liveService.endSession(sessionId);
        toast.success('Đã kết thúc buổi học');
        navigate('/portal-giang-vien');
      } catch (error) {
        toast.error('Lỗi khi kết thúc buổi học');
      }
    }
  };

  return (
    <div className="live-classroom-container">
      <div className="live-header">
        <div className="live-info">
          <div className="live-badge">
            <span className="live-dot"></span> LIVE
          </div>
          <h2>Phòng học trực tuyến</h2>
          <span className="session-id">ID: {sessionId}</span>
        </div>
        <div className="live-actions">
          {user.role === 'teacher' && (
            <button className="end-session-btn" onClick={handleEndSession}>
              Kết thúc lớp học
            </button>
          )}
        </div>
      </div>
      
      <div 
        className="zego-container"
        ref={containerRef} 
        style={{ width: '100%', height: 'calc(100vh - 150px)' }}
      ></div>
    </div>
  );
};

export default LiveClassroom;
