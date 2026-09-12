import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiPlayCircle, FiFileText, FiAward } from 'react-icons/fi';
import { classService, studentService } from '../../services';
import CustomVideoPlayer from '../../components/common/VideoPlayer/CustomVideoPlayer';
import './Classroom.css';

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [courseName, setCourseName] = useState('Đang tải...');
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const res = await classService.getLessons(classId);
        if (res.data && res.data.success) {
          setCourseName(res.data.data.course_name);
          setLessons(res.data.data.lessons);
          if (res.data.data.lessons.length > 0) {
            setActiveLesson(res.data.data.lessons[0]);
          }
        }
      } catch (err) {
        console.error("Lỗi lấy bài học:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (classId) fetchLessons();
  }, [classId]);

  // Calculate progress
  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
  };

  const markAsCompleted = async () => {
    try {
      const res = await studentService.completeLesson(activeLesson.id);
      const updatedLessons = lessons.map(l => 
        l.id === activeLesson.id ? { ...l, completed: true } : l
      );
      setLessons(updatedLessons);
      setActiveLesson({ ...activeLesson, completed: true });
      
      if (res.data?.gamification) {
        const { xpGained, newLevel, newBadge, newCertificate } = res.data.gamification;
        if (newCertificate) {
          alert(`Chúc mừng! Bạn đã hoàn thành khóa học và nhận được Chứng chỉ!`);
        } else if (newLevel) {
          alert(`Chúc mừng! Bạn đã thăng cấp lên Level ${newLevel}!`);
        } else if (newBadge) {
          alert(`Chúc mừng! Bạn nhận được huy hiệu: ${newBadge.name}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  if (isLoading) return <div className="learning-room" style={{padding: 40}}>Đang tải...</div>;
  if (!activeLesson) return <div className="learning-room" style={{padding: 40}}>Lớp học này chưa có bài học nào.</div>;

  return (
    <div className="learning-room">
      <div className="learning-header">
        <button className="btn-back" onClick={() => navigate('/student/my-classes')}>
          <FiArrowLeft size={20} /> Quay lại danh sách
        </button>
        <div className="course-title-nav">
          {courseName}
        </div>
        <div className="course-progress-nav">
          <div className="progress-text">{progressPercent}% Hoàn thành</div>
          <div className="progress-bar-bg-small">
            <div className="progress-bar-fill-small" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="learning-content">
        {/* LEFT: Main Content (Video / PDF / Quiz) */}
        <div className="learning-main">
          {activeLesson.type === 'video' ? (
            <div className="video-player-container" style={{ aspectRatio: '16/9', width: '100%' }}>
              <CustomVideoPlayer 
                url={activeLesson.content_url}
                onEnded={() => {
                  if (!activeLesson.completed) markAsCompleted();
                }}
              />
            </div>
          ) : activeLesson.type === 'document' ? (
            <div className="document-viewer-container">
              <embed 
                src={activeLesson.content_url} 
                type="application/pdf" 
                className="document-embed"
              />
              <div className="document-actions">
                <a 
                  href={activeLesson.content_url} 
                  download 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-download-doc"
                >
                  <FiFileText size={18} />
                  Tải xuống tài liệu
                </a>
              </div>
            </div>
          ) : (
            <div className="quiz-viewer">
              <FiAward size={64} color="#F59E0B" />
              <h3>{activeLesson.title}</h3>
              <p>Thời lượng: {activeLesson.duration}</p>
              <button className="btn-start-quiz" onClick={() => navigate(`/student/quiz/${activeLesson.content_url}`)}>
                Bắt đầu làm bài
              </button>
            </div>
          )}

          <div className="lesson-footer">
            <div className="lesson-info">
              <h2>{activeLesson.title}</h2>
              <p>{activeLesson.duration}</p>
            </div>
            <div className="lesson-actions">
              <button 
                className={`btn-complete ${activeLesson.completed ? 'completed' : ''}`}
                onClick={markAsCompleted}
                disabled={activeLesson.completed}
              >
                <FiCheckCircle size={18} />
                {activeLesson.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Playlist Sidebar */}
        <div className="learning-sidebar">
          <div className="playlist-header">
            <h3>Danh sách bài học</h3>
            <span>{completedCount}/{lessons.length} bài</span>
          </div>
          <div className="playlist-items">
            {lessons.map((lesson, idx) => (
              <div 
                key={lesson.id} 
                className={`playlist-item ${activeLesson.id === lesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="item-icon">
                  {lesson.completed ? (
                    <FiCheckCircle color="#10B981" size={18} />
                  ) : lesson.type === 'video' ? (
                    <FiPlayCircle color="#64748B" size={18} />
                  ) : lesson.type === 'quiz' ? (
                    <FiAward color="#64748B" size={18} />
                  ) : (
                    <FiFileText color="#64748B" size={18} />
                  )}
                </div>
                <div className="item-details">
                  <div className="item-title">{idx + 1}. {lesson.title}</div>
                  <div className="item-duration">{lesson.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
