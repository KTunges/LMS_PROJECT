import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiBookOpen, FiAward, FiCalendar, FiCompass, FiCreditCard,
  FiTrendingUp, FiActivity, FiClock, FiStar, FiChevronRight,
  FiZap, FiTarget, FiFileText, FiVideo, FiPlayCircle
} from 'react-icons/fi';
import { studentService } from '../../../services';
import { useAuth } from '../../../contexts/AuthContext';
import './Dashboard.css';
import './DashboardExtensions.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [statsData, setStatsData] = useState({});
  const [activeCourses, setActiveCourses] = useState([]);
  const [gamification, setGamification] = useState({ xp: 0, level: 1, badges: [] });
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock heatmap data (36 cells for last 36 days)
  const heatmapData = Array.from({ length: 36 }).map(() => Math.floor(Math.random() * 5));

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsRes, classesRes, gamiRes, catalogRes, leaderRes, materialRes] = await Promise.all([
          studentService.getDashboardStats(),
          studentService.getMyClasses(),
          studentService.getGamification(),
          studentService.getCatalog(),
          studentService.getLeaderboard(),
          studentService.getMaterials()
        ]);
        
        if (statsRes.data?.success) setStatsData(statsRes.data.data || {});
        if (classesRes.data?.success) setActiveCourses(classesRes.data.data || []);
        if (gamiRes.data?.success) setGamification(gamiRes.data.data || { xp: 0, level: 1, badges: [] });
        if (catalogRes.data?.success) {
          setFeaturedCourses((catalogRes.data.data || []).slice(0, 4)); // Show 4 for better grid
        }
        if (leaderRes.data?.success) {
          setLeaderboard((leaderRes.data.data || []).slice(0, 5));
        }
        if (materialRes.data?.success) {
          setMaterials((materialRes.data.data || []).slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const quickLinks = [
    { icon: <FiBookOpen />, label: 'Vào học ngay', path: '/student/my-classes' },
    { icon: <FiCompass />, label: 'Khám phá', path: '/student/catalog' },
    { icon: <FiCalendar />, label: 'Lịch trình', path: '/student/schedule' },
    { icon: <FiAward />, label: 'Thành tựu', path: '/student/achievements' },
  ];

  const deadlines = (statsData.upcomingAssignments || []).map(assignment => {
    const dueDate = new Date(assignment.due_date);
    const diffTime = dueDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      id: assignment.id,
      title: assignment.title,
      courseName: assignment.class?.course?.name || 'Chung',
      dueDate,
      urgent: diffDays <= 2
    };
  }).slice(0, 4);

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải bảng điều khiển...</div>;
  }

  const currentLearning = activeCourses.length > 0 ? activeCourses[0] : null;

  return (
    <div className="dashboard-page-premium fade-in">
      
      {/* --- BANNER WELCOME --- */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Chào mừng trở lại, {user?.full_name ? user.full_name.split(' ').pop() : 'Sinh viên'}! 👋</h1>
          <p>Hôm nay là một ngày tuyệt vời để học một điều mới.</p>
          <div className="quote-container">
            "Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc."
          </div>
        </div>
        
        <div className="welcome-stats">
          <div className="stat-item">
            <span className="stat-value">Lv. {gamification?.level || 1}</span>
            <span className="stat-label">Cấp độ</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{(gamification?.xp || 0).toLocaleString()}</span>
            <span className="stat-label">Điểm XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{gamification?.badges?.length || 0}</span>
            <span className="stat-label">Huy hiệu</span>
          </div>
        </div>
      </div>

      {/* --- RESTRUCTURED 2-COLUMN GRID --- */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: MAIN CONTENT (2fr) */}
        <div className="main-column">
          
          {/* Continue Learning */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiTarget /> Đang học dở</h2>
            </div>
            {currentLearning ? (
              <div className="active-learning-card">
                <img src={currentLearning.course?.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop'} alt="course" className="alc-image" />
                <div className="alc-content">
                  <div className="alc-title">{currentLearning.course?.name}</div>
                  <div className="alc-subtitle">Tiến độ khóa học của bạn rất tốt!</div>
                  <div className="alc-progress">
                    <div className="alc-bar-bg">
                      <div className="alc-bar-fill" style={{ width: `${currentLearning.progress || 10}%` }}></div>
                    </div>
                    <span className="alc-percent">{currentLearning.progress || 10}%</span>
                  </div>
                  <button className="alc-btn" onClick={() => navigate(`/student/classroom/${currentLearning.course_id}`)}>
                    Tiếp tục học ngay
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">Bạn chưa đăng ký khóa học nào.</div>
            )}
          </div>

          {/* Featured Courses */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiStar /> Khóa học nổi bật</h2>
              <Link to="/student/catalog" className="view-all">Xem tất cả <FiChevronRight/></Link>
            </div>
            <div className="featured-courses">
              {featuredCourses.map(course => (
                <div key={course.id} className="course-premium-card" onClick={() => navigate(`/student/catalog`)}>
                  <div className="cpc-image">
                    <img src={course.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop'} alt={course.title} />
                    <span className="cpc-tag">{course.level || 'Cơ bản'}</span>
                  </div>
                  <div className="cpc-content">
                    <h3 className="cpc-title">{course.title}</h3>
                    <div className="cpc-teacher">
                      <FiBookOpen /> {course.duration || '4 tuần'}
                    </div>
                    <div className="cpc-footer">
                      <span className="cpc-price">{!course.price || Number(course.price) === 0 ? 'Miễn phí' : `${Number(course.price).toLocaleString()}đ`}</span>
                      <button className="cpc-btn">Xem chi tiết</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="premium-card activity-card">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h2><FiActivity /> Biểu đồ học tập (36 ngày qua)</h2>
            </div>
            <div className="heatmap-grid">
              {heatmapData.map((level, i) => (
                <div key={i} className={`heatmap-cell level-${level}`} title={`Hoạt động ngày ${36-i} trước`} />
              ))}
            </div>
            <div className="activity-legend">
              Ít <div className="legend-box" style={{ background: '#f1f5f9' }}></div>
              <div className="legend-box level-1"></div>
              <div className="legend-box level-2"></div>
              <div className="legend-box level-3"></div>
              <div className="legend-box level-4"></div> Nhiều
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR (1fr) */}
        <div className="side-column">
          
          {/* Quick Links */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiZap /> Truy cập nhanh</h2>
            </div>
            <div className="quick-links-grid">
              {quickLinks.map((link, idx) => (
                <Link to={link.path} key={idx} className="quick-link-btn">
                  <div className="ql-icon">{link.icon}</div>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiTrendingUp /> Bảng xếp hạng XP</h2>
              <Link to="/student/leaderboard" className="view-all">Chi tiết</Link>
            </div>
            <div className="mini-leaderboard">
              {leaderboard.length > 0 ? (
                leaderboard.map((student, idx) => (
                  <div key={student.id} className="ml-item">
                    <div className={`ml-rank top-${idx + 1}`}>{idx + 1}</div>
                    <img src={student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}&background=random`} alt="avatar" className="ml-avatar" />
                    <div className="ml-info">
                      <div className="ml-name">{student.full_name}</div>
                      <div className="ml-xp">{(student.xp || 0).toLocaleString()} XP</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Chưa có dữ liệu xếp hạng</div>
              )}
            </div>
          </div>

          {/* Schedule / Deadlines */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiClock /> Sắp tới hạn</h2>
              <Link to="/student/schedule" className="view-all">Lịch học</Link>
            </div>
            <div className="mini-deadlines">
              {deadlines.length > 0 ? (
                deadlines.map((dl, idx) => (
                  <div key={idx} className="md-item">
                    <div className={`md-icon ${dl.urgent ? 'urgent' : 'normal'}`}>
                      <FiActivity />
                    </div>
                    <div className="md-info">
                      <h4>{dl.title}</h4>
                      <p>{dl.courseName}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Không có sự kiện nào sắp tới. Tuyệt vời!</div>
              )}
            </div>
          </div>

          {/* Suggested Materials */}
          <div className="premium-card">
            <div className="section-header">
              <h2><FiFileText /> Tài nguyên mới</h2>
              <Link to="/student/resource-center" className="view-all">Tất cả</Link>
            </div>
            <div className="suggested-materials">
              {materials.map((mat, idx) => (
                <div 
                  key={idx} 
                  className="material-item" 
                  onClick={() => {
                    if (mat.file_url) window.open(mat.file_url, '_blank');
                    else navigate('/student/resource-center');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`material-icon ${mat.file_url?.endsWith('pdf') ? 'pdf' : 'video'}`}>
                    {mat.file_url?.endsWith('pdf') ? <FiFileText /> : <FiPlayCircle />}
                  </div>
                  <div className="material-info">
                    <h4>{mat.title}</h4>
                    <p>{mat.class?.course?.name || 'Tài liệu chung'}</p>
                  </div>
                </div>
              ))}
              {materials.length === 0 && (
                <div className="empty-state">Chưa có tài nguyên nào.</div>
              )}
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
