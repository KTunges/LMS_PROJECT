import { useState, useEffect } from 'react';
import { FiPlay, FiClock, FiUsers, FiStar, FiBookOpen, FiAward, FiChevronRight } from 'react-icons/fi';
import { SkeletonCard } from '../../components/common/SkeletonLoaders';
import './OnlineCourses.css';

const mockCourses = [
  { id: 1, title: 'ReactJS từ Cơ bản đến Nâng cao', instructor: 'ThS. Nguyễn Văn A', lessons: 24, duration: '12 giờ', students: 156, rating: 4.9, progress: 75, category: 'Web', level: 'Nâng cao', emoji: '⚛️' },
  { id: 2, title: 'Cơ sở Dữ liệu với PostgreSQL', instructor: 'PGS.TS. Trần B', lessons: 18, duration: '9 giờ', students: 203, rating: 4.7, progress: 40, category: 'Database', level: 'Trung bình', emoji: '🐘' },
  { id: 3, title: 'Docker & Kubernetes thực chiến', instructor: 'ThS. Lê Thị C', lessons: 30, duration: '15 giờ', students: 312, rating: 4.8, progress: 0, category: 'DevOps', level: 'Nâng cao', emoji: '🐳' },
  { id: 4, title: 'Python cho Data Science', instructor: 'TS. Phạm D', lessons: 20, duration: '10 giờ', students: 445, rating: 4.6, progress: 100, category: 'AI/ML', level: 'Cơ bản', emoji: '🐍' },
  { id: 5, title: 'An toàn Thông tin Mạng', instructor: 'TS. Hoàng E', lessons: 16, duration: '8 giờ', students: 98, rating: 4.4, progress: 0, category: 'Security', level: 'Trung bình', emoji: '🔒' },
  { id: 6, title: 'Git & GitHub cho Nhóm phát triển', instructor: 'ThS. Nguyễn Văn A', lessons: 10, duration: '5 giờ', students: 521, rating: 4.9, progress: 100, category: 'DevOps', level: 'Cơ bản', emoji: '🌿' },
];

const tabs = ['Tất cả', 'Đang học', 'Hoàn thành', 'Chưa bắt đầu'];

const OnlineCourses = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const filtered = mockCourses.filter(c => {
    if (activeTab === 'Đang học') return c.progress > 0 && c.progress < 100;
    if (activeTab === 'Hoàn thành') return c.progress === 100;
    if (activeTab === 'Chưa bắt đầu') return c.progress === 0;
    return true;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'Cơ bản': return '#10b981';
      case 'Trung bình': return '#f59e0b';
      case 'Nâng cao': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Khóa học trực tuyến</h1>
          <p>Học tập mọi lúc, mọi nơi với các khóa học chất lượng cao</p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="courses-overview">
        <div className="co-stat glass-card">
          <FiBookOpen className="co-stat-icon" style={{ color: '#3b82f6' }} />
          <div>
            <span className="co-stat-value">{mockCourses.filter(c => c.progress > 0 && c.progress < 100).length}</span>
            <span className="co-stat-label">Đang học</span>
          </div>
        </div>
        <div className="co-stat glass-card">
          <FiAward className="co-stat-icon" style={{ color: '#10b981' }} />
          <div>
            <span className="co-stat-value">{mockCourses.filter(c => c.progress === 100).length}</span>
            <span className="co-stat-label">Hoàn thành</span>
          </div>
        </div>
        <div className="co-stat glass-card">
          <FiPlay className="co-stat-icon" style={{ color: '#8b5cf6' }} />
          <div>
            <span className="co-stat-value">{mockCourses.length}</span>
            <span className="co-stat-label">Tổng khóa học</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="courses-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="courses-grid">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filtered.map(course => (
            <div key={course.id} className="course-card glass-card">
            <div className="course-card__top">
              <div className="course-emoji">{course.emoji}</div>
              <div className="course-card__badges">
                <span className="course-level" style={{ color: getLevelColor(course.level), background: `${getLevelColor(course.level)}12` }}>
                  {course.level}
                </span>
                <span className="course-cat">{course.category}</span>
              </div>
            </div>

            <h3 className="course-title">{course.title}</h3>
            <p className="course-instructor">{course.instructor}</p>

            <div className="course-meta">
              <span><FiPlay /> {course.lessons} bài</span>
              <span><FiClock /> {course.duration}</span>
              <span><FiUsers /> {course.students}</span>
              <span><FiStar style={{ color: '#f59e0b' }} /> {course.rating}</span>
            </div>

            {/* Progress */}
            {course.progress > 0 && (
              <div className="course-progress-section">
                <div className="course-progress-header">
                  <span>Tiến độ</span>
                  <span className="course-progress-pct">{course.progress}%</span>
                </div>
                <div className="course-bar-bg">
                  <div
                    className="course-bar-fill"
                    style={{
                      width: `${course.progress}%`,
                      background: course.progress === 100 ? '#10b981' : '#3b82f6'
                    }}
                  ></div>
                </div>
              </div>
            )}

            <button className={`btn-course ${course.progress === 100 ? 'completed' : course.progress > 0 ? 'continue' : 'start'}`}>
              {course.progress === 100 ? (
                <><FiAward /> Xem chứng chỉ</>
              ) : course.progress > 0 ? (
                <><FiPlay /> Tiếp tục học</>
              ) : (
                <><FiChevronRight /> Bắt đầu</>
              )}
            </button>
          </div>
        )))}
      </div>
    </div>
  );
};

export default OnlineCourses;
