import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiPlayCircle, FiFileText, FiAward, FiExternalLink, FiEye } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { classService, studentService, aiService } from '../../services';
import CustomVideoPlayer from '../../components/common/VideoPlayer/CustomVideoPlayer';
import CourseReviews from '../../components/common/CourseReviews/CourseReviews';
import AIChat from '../../components/common/AIChat/AIChat';
import './Classroom.css';

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [courseName, setCourseName] = useState('Đang tải...');
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const [courseId, setCourseId] = useState(null);
  
  // AI States
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

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
          if (res.data.data.course_id) {
            setCourseId(res.data.data.course_id);
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
  // Calculate overall progress including current video progress
  const completedCount = lessons.filter(l => l.completed).length;
  // If the active lesson is NOT completed yet, we add its partial progress (0 to 1) to the completed count.
  const partialProgress = (activeLesson && !activeLesson.completed && activeLesson.type === 'video') ? currentVideoProgress : 0;
  const progressPercent = lessons.length > 0 
    ? Math.min(100, Math.round(((completedCount + partialProgress) / lessons.length) * 100))
    : 0;

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    setCurrentVideoProgress(0);
    setSummary(null); // Reset summary when changing lesson
  };

  const handleSummarize = async () => {
    if (!activeLesson) return;
    setIsSummarizing(true);
    try {
      // In a real app, this would send the actual transcript or text content of the lesson
      // For this demo, we'll just send the title and assume the AI knows or we mock it
      const textToSummarize = activeLesson.title + " (Đây là bài học trong khóa học " + courseName + ")";
      const res = await aiService.summarize(textToSummarize);
      if (res.data?.success) {
        setSummary(res.data.data.summary);
      } else {
        toast.error(res.data?.message || 'AI không thể tóm tắt bài học này');
      }
    } catch (error) {
      console.error("Lỗi tóm tắt:", error);
      toast.error('Lỗi khi kết nối với AI Tóm tắt');
    } finally {
      setIsSummarizing(false);
    }
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

  const handleDownload = async (e, url, filename) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Lỗi khi tải file:', error);
      window.open(url, '_blank'); // fallback
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
                key={activeLesson.id}
                url={activeLesson.content_url}
                interactiveQuestions={activeLesson.interactiveQuestions}
                onProgress={(played) => {
                  setCurrentVideoProgress(played);
                }}
                onEnded={() => {
                  setCurrentVideoProgress(1);
                  if (!activeLesson.completed) markAsCompleted();
                }}
              />
            </div>
          ) : activeLesson.type === 'document' ? (
            <div className="document-viewer-container">
              <iframe 
                src={activeLesson.content_url} 
                title="Document Viewer"
                className="document-embed"
                frameBorder="0"
              />
              <div className="document-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '1000px' }}>
                <a 
                  href={activeLesson.content_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-download-doc"
                  style={{ backgroundColor: '#64748B' }}
                >
                  <FiExternalLink size={18} />
                  Mở tab mới
                </a>
                <a 
                  href={activeLesson.content_url} 
                  onClick={(e) => handleDownload(e, activeLesson.content_url, `${activeLesson.title}.pdf`)}
                  className="btn-download-doc"
                >
                  <FiFileText size={18} />
                  Tải xuống
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
              <div>
                <h2>{activeLesson.title}</h2>
              </div>
              <p>{activeLesson.duration}</p>
            </div>
            <div className="lesson-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={handleSummarize} 
                disabled={isSummarizing}
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, var(--theme-primary, #4f46e5), var(--theme-accent, #ec4899))', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  height: '48px',
                  flexShrink: 0
                }}
              >
                ✨ {isSummarizing ? 'Đang tóm tắt...' : 'Tóm tắt bài học (AI)'}
              </button>
              {activeLesson.type === 'video' ? (
                <div className={`video-status-badge ${activeLesson.completed ? 'completed' : 'learning'}`} style={{ height: '48px', padding: '0 24px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <FiCheckCircle size={18} />
                  {activeLesson.completed ? 'Đã học xong' : 'Đang học'}
                </div>
              ) : (
                <button 
                  className={`btn-complete ${activeLesson.completed ? 'completed' : ''}`}
                  onClick={markAsCompleted}
                  disabled={activeLesson.completed}
                  style={{ height: '48px', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  <FiCheckCircle size={18} />
                  {activeLesson.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                </button>
              )}
            </div>
          </div>

          {summary && (
            <div style={{ margin: '0 24px 24px 24px', padding: '24px', background: 'var(--theme-glass-bg, #f8fafc)', border: '1px solid var(--theme-glass-border, #e2e8f0)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h4 style={{ color: 'var(--theme-primary, #4f46e5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                ✨ Tóm tắt từ AI
              </h4>
              <div className="markdown-content" style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--theme-text, #1e293b)' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Đánh giá khóa học */}
          {courseId && <CourseReviews courseId={courseId} />}
        </div>

        {/* RIGHT: Playlist Sidebar */}
        <div className="learning-sidebar">
          <div className="playlist-header">
            <h3>Danh sách bài học</h3>
            <span>{completedCount}/{lessons.length} bài</span>
          </div>
          <div className="playlist-items">
            {Object.entries(
              lessons.reduce((acc, lesson) => {
                const sec = lesson.section_title || 'Chương trình học';
                if (!acc[sec]) acc[sec] = [];
                acc[sec].push(lesson);
                return acc;
              }, {})
            ).map(([sectionTitle, sectionLessons], sIdx) => (
              <div key={sIdx} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0 16px 8px 16px' }}>
                  {sectionTitle}
                </div>
                {sectionLessons.map((lesson, idx) => (
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
                      <div className="item-title">{lesson.title}</div>
                      <div className="item-duration">{lesson.duration || '00:00'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AI Chatbot */}
      {activeLesson && (
        <AIChat 
          contextTitle={activeLesson.title} 
          contextText={`Khóa học: ${courseName}`} 
        />
      )}
    </div>
  );
};

export default Classroom;
