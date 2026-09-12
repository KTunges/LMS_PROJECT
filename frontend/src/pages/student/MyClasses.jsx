import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiMoreVertical, FiPlayCircle, FiCheckCircle } from 'react-icons/fi';
import { studentService } from '../../services';
import './MyClasses.css';

const MyClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current'); // current, completed
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await studentService.getMyClasses();
        if (res.data && res.data.success) {
          setClasses(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch classes', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const currentClasses = classes.filter(c => c.progress < 100 || c.status === 'active');
  const completedClasses = classes.filter(c => c.progress === 100 || c.status === 'completed');

  const displayClasses = activeTab === 'current' ? currentClasses : completedClasses;

  if (isLoading) {
    return <div className="myclasses-page" style={{padding: 40}}>Đang tải danh sách lớp học...</div>;
  }



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
            <div className="class-card__cover" style={{ backgroundImage: `url(${cls.bgImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600'})` }}>
              <div className="class-card__overlay" style={{ background: cls.color || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}></div>
              <div className="class-card__menu" onClick={(e) => e.stopPropagation()}>
                <FiMoreVertical />
              </div>
              <div className="class-card__course-code">{cls.course_code || cls.courseCode}</div>
              <h3 className="class-card__name">{cls.course_name || cls.name}</h3>
              <p className="class-card__teacher">{cls.teacher_name || cls.teacher}</p>
            </div>
            
            <div className="class-card__content">
              <div className="class-card__stats">
                <span className="stat-item">
                  <FiClock /> {cls.semester_name || cls.semester}
                </span>
                <span className="stat-item">
                  <FiUsers /> {cls.studentsCount || 40} HV
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
