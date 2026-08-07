import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiMoreVertical, FiPlayCircle, FiCheckCircle } from 'react-icons/fi';
import './MyClasses.css';

const MOCK_CLASSES = [
  {
    id: 1,
    courseCode: 'INT3306',
    name: 'Lập trình Web nâng cao',
    teacher: 'TS. Nguyễn Văn A',
    semester: 'Học kỳ 1 (2026-2027)',
    studentsCount: 45,
    progress: 65,
    nextAssignment: 'Bài tập lớn: Clone Spotify',
    dueDate: '2 ngày nữa',
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bgImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    courseCode: 'DB301',
    name: 'Hệ quản trị CSDL',
    teacher: 'ThS. Trần Thị B',
    semester: 'Học kỳ 1 (2026-2027)',
    studentsCount: 60,
    progress: 30,
    nextAssignment: 'Thi giữa kỳ (Trực tuyến)',
    dueDate: 'Tuần sau',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    courseCode: 'AI402',
    name: 'Trí tuệ nhân tạo',
    teacher: 'PGS.TS Lê Văn C',
    semester: 'Học kỳ 1 (2026-2027)',
    studentsCount: 40,
    progress: 85,
    nextAssignment: 'Báo cáo Seminar',
    dueDate: 'Ngày mai',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    courseCode: 'ENG202',
    name: 'Tiếng Anh chuyên ngành',
    teacher: 'ThS. Phạm D',
    semester: 'Học kỳ 1 (2026-2027)',
    studentsCount: 35,
    progress: 100,
    nextAssignment: null,
    dueDate: null,
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600'
  }
];

const MyClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current'); // current, completed

  const currentClasses = MOCK_CLASSES.filter(c => c.progress < 100);
  const completedClasses = MOCK_CLASSES.filter(c => c.progress === 100);

  const displayClasses = activeTab === 'current' ? currentClasses : completedClasses;

  return (
    <div className="myclasses-page">
      <div className="myclasses-header">
        <div className="myclasses-title">
          <h1>Không gian học tập</h1>
          <p>Truy cập vào các lớp học hiện tại của bạn để nhận tài liệu và nộp bài tập.</p>
        </div>
      </div>

      <div className="myclasses-tabs">
        <button 
          className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <FiPlayCircle /> Đang học ({currentClasses.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <FiCheckCircle /> Đã hoàn thành ({completedClasses.length})
        </button>
      </div>

      <div className="classes-grid">
        {displayClasses.map((cls) => (
          <div 
            key={cls.id} 
            className="class-card glass-card"
            onClick={() => navigate(`/student/classroom/${cls.id}`)}
          >
            <div className="class-card__cover" style={{ backgroundImage: `url(${cls.bgImage})` }}>
              <div className="class-card__overlay" style={{ background: cls.color }}></div>
              <div className="class-card__menu" onClick={(e) => e.stopPropagation()}>
                <FiMoreVertical />
              </div>
              <div className="class-card__course-code">{cls.courseCode}</div>
              <h3 className="class-card__name">{cls.name}</h3>
              <p className="class-card__teacher">{cls.teacher}</p>
            </div>
            
            <div className="class-card__content">
              <div className="class-card__stats">
                <span className="stat-item">
                  <FiClock /> {cls.semester}
                </span>
                <span className="stat-item">
                  <FiUsers /> {cls.studentsCount} HV
                </span>
              </div>
              
              <div className="class-card__progress">
                <div className="progress-header">
                  <span>Tiến độ học tập</span>
                  <span className="progress-text">{cls.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${cls.progress}%`,
                      background: cls.progress === 100 ? '#10b981' : 'var(--info)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {cls.nextAssignment && (
              <div className="class-card__footer">
                <div className="upcoming-task">
                  <span className="task-label">Sắp đến hạn:</span>
                  <span className="task-title">{cls.nextAssignment}</span>
                </div>
                <span className="task-due text-danger">{cls.dueDate}</span>
              </div>
            )}
          </div>
        ))}

        {displayClasses.length === 0 && (
          <div className="empty-state">
            <p>Chưa có lớp học nào trong danh sách này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClasses;
