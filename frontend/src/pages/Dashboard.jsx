import { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  FiTrendingUp, FiCheckCircle, FiBookOpen, FiAward as FiGrades, 
  FiCalendar, FiCreditCard, FiPrinter, FiGlobe, FiMessageCircle,
  FiMonitor, FiDatabase, FiCpu, FiLock, FiSmartphone,
  FiFileText, FiClock, FiStar, FiBell, FiDownload
} from 'react-icons/fi';
import { SkeletonCard, SkeletonProfile } from '../components/common/SkeletonLoaders';
import { studentService } from '../services';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    activeClasses: 0,
    completedClasses: 0,
    gpa: '0.0',
    unreadNotifications: 0
  });
  
  const [activeCourses, setActiveCourses] = useState([]);

  // Mock user if auth context not fully ready
  const user = {
    name: 'Lê Minh Phan',
    role: 'Sinh viên CNTT',
  };

  const stats = [
    { label: 'Môn học đang học', value: statsData.activeClasses, subtext: 'Cần hoàn thành', subvalue: '', positive: true },
    { label: 'Điểm trung bình (GPA)', value: statsData.gpa, subtext: 'Hệ 4.0', subvalue: '', positive: true },
    { label: 'Lớp đã hoàn thành', value: statsData.completedClasses, subtext: 'Chứng chỉ e-learning', subvalue: '', positive: true },
    { label: 'Thông báo mới', value: statsData.unreadNotifications, subtext: 'Cần xem ngay', subvalue: '', positive: true },
  ];

  const quickLinks = [
    { icon: <FiBookOpen size={18} />, label: 'Vào học ngay' },
    { icon: <FiGrades size={18} />, label: 'Bảng điểm' },
    { icon: <FiCalendar size={18} />, label: 'Lịch học online' },
    { icon: <FiFileText size={18} />, label: 'Tài liệu VIP' },
    { icon: <FiPrinter size={18} />, label: 'Chứng chỉ' },
    { icon: <FiGlobe size={18} />, label: 'Diễn đàn' },
  ];

  const schedule = [
    { icon: <FiMonitor size={20} />, subject: 'Lập trình Web', teacher: 'ThS. Nguyễn Văn A', time: 'Hôm nay, 08:00-10:00', room: 'Phòng 203', color: 'blue' },
    { icon: <FiCpu size={20} />, subject: 'Kiến trúc Máy tính', teacher: 'PGS. TS. Trần B', time: 'Hôm nay, 10:15-12:15', room: 'Lab B1', color: 'green' },
    { icon: <FiDatabase size={20} />, subject: 'Hệ quản trị CSDL', teacher: 'ThS. Lê Thị C', time: 'Hôm nay, 13:00-15:00', room: 'Phòng 105', color: 'purple' },
  ];

  const deadlines = [
    { title: 'Phân tích dữ liệu với Python', category: 'Khoa học dữ liệu', date: '29 Thg 5, 2025 - 17:00', daysLeft: '1 ngày tới', urgent: true },
    { title: 'Bài tập 2 Lên kế hoạch UX', category: 'Nghiên cứu UX', date: '30 Thg 5, 2025 - 09:00', daysLeft: '2 ngày tới', urgent: true },
    { title: 'Báo cáo Đồ án cuối kỳ', category: 'Quản lý dự án', date: '1 Thg 6, 2025 - 13:00', daysLeft: '4 ngày tới', urgent: false },
  ];

  const announcements = [
    { title: 'Thông báo: Lịch nghỉ lễ Quốc khánh 2/9', date: '25 Thg 8, 2025', tag: 'Chung' },
    { title: 'Cảnh báo: Hạn chót đóng học phí HK1', date: '20 Thg 8, 2025', tag: 'Tài chính', urgent: true },
    { title: 'Mở đăng ký chuyên ngành Khóa 20', date: '15 Thg 8, 2025', tag: 'Đào tạo' },
  ];

  const suggestedMaterials = [
    { id: 1, title: 'ReactJS Fundamentals 2025', subject: 'Lập trình Web', size: '2.4 MB', type: 'PDF' },
    { id: 2, title: 'Giáo trình Cơ sở dữ liệu nâng cao', subject: 'Hệ quản trị CSDL', size: '5.1 MB', type: 'PDF' },
    { id: 3, title: 'Bài giảng Kiến trúc máy tính', subject: 'Kiến trúc Máy tính', size: '1.2 MB', type: 'PPTX' },
  ];



  // Calculate progress percentage
  const totalLessons = 150;
  const completedLessons = 112;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, classesRes] = await Promise.all([
          studentService.getDashboardStats(),
          studentService.getMyClasses()
        ]);
        
        if (statsRes.data && statsRes.data.success) {
          setStatsData(statsRes.data.data);
        }
        
        if (classesRes.data && classesRes.data.success) {
          const courses = classesRes.data.data.map(c => ({
            id: c.id,
            name: c.course_name,
            progress: c.progress || 0,
            nextTask: 'Tiếp tục bài học'
          }));
          setActiveCourses(courses.slice(0, 3)); // Only take top 3 for dashboard
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <div style={{ marginBottom: '32px' }}>
          <div className="skeleton skeleton-title" style={{ width: '300px', height: '40px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '400px' }}></div>
        </div>
        <div className="dashboard__stats-row" style={{ marginBottom: '24px' }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="stat-card glass-card">
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-title" style={{ width: '40%', height: '36px', marginTop: '12px' }}></div>
            </div>
          ))}
        </div>
        <div className="dashboard__grid">
          <div className="dashboard__col-left">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="dashboard__col-right">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard__greeting">
        <h1 className="dashboard__greeting-title">
          Xin chào, <span className="gradient-text">{user.name}</span> <span className="wave">👋</span>
        </h1>
        <p className="dashboard__greeting-subtitle">Sẵn sàng để tiếp tục chuỗi ngày học tập tuyệt vời của bạn chưa?</p>
      </div>

      {/* STATS ROW */}
      <div className="dashboard__stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-card">
            <div className="stat-card__label">{stat.label}</div>
            <div className="stat-card__value-row">
              <span className="stat-card__value">{stat.value}</span>
              {stat.subvalue && (
                <span className={`stat-card__subvalue ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <FiTrendingUp size={14} /> : null} {stat.subvalue}
                </span>
              )}
            </div>
            <div className="stat-card__subtext">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="dashboard__grid">
        {/* LEFT COLUMN */}
        <div className="dashboard__col-left">
          
          {/* Top Row: Progress & Quick Links */}
          <div className="dashboard__top-row">
            {/* Progress Chart Widget */}
            <div className="card dashboard-card widget-progress">
              <h3 className="card__title">Tiến trình Môn học</h3>
              <div className="progress-container">
                <div className="circular-progress" style={{ '--progress': `${progressPercent}%` }}>
                  <div className="ring-outer"></div>
                  <div className="ring-inner"></div>
                  <div className="progress-value">
                    <div className="value-completed">
                      <span className="percent">{progressPercent}%</span>
                      <span className="credits">{completedLessons}/{totalLessons} Bài</span>
                    </div>
                    <div className="value-total">
                      <span className="credits">Tổng: {totalLessons} bài</span>
                      <span className="percent text-blue">100%</span>
                    </div>
                  </div>
                </div>
                <div className="progress-info">
                  <p>Bạn đã hoàn thành <strong>{completedLessons}</strong> bài học. Cố gắng lên nhé!</p>
                </div>
              </div>
            </div>

            {/* Quick Links Widget */}
            <div className="card dashboard-card widget-quick-links">
              <h3 className="card__title">Truy cập nhanh</h3>
              <div className="quick-links">
                {quickLinks.map((link, idx) => (
                  <button key={idx} className="quick-link-btn">
                    <span className="quick-link-icon">{link.icon}</span>
                    <span className="quick-link-label">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Materials Widget */}
          <div className="card dashboard-card">
            <h3 className="card__title">Tài liệu học tập đề xuất</h3>
            <div className="suggested-materials">
              {suggestedMaterials.map(mat => (
                <div key={mat.id} className="material-card">
                  <div className="material-icon">
                    <FiFileText size={24} />
                  </div>
                  <div className="material-info">
                    <h4 className="material-title">{mat.title}</h4>
                    <p className="material-subject">{mat.subject}</p>
                    <div className="material-meta">
                      <span className="material-type">{mat.type}</span>
                      <span className="material-size">{mat.size}</span>
                    </div>
                  </div>
                  <button className="btn-download-icon">
                    <FiDownload size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Courses Widget */}
          <div className="card dashboard-card">
            <h3 className="card__title">Môn học đang tham gia</h3>
            <div className="active-courses">
              {activeCourses.map(course => (
                <div key={course.id} className="course-progress-card">
                  <div className="course-progress-header">
                    <h4 className="course-progress-title">{course.name}</h4>
                    <span className="course-progress-percent">{course.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="course-progress-footer">
                    <span className="next-task-label">Tiếp theo:</span>
                    <span className="next-task-name">{course.nextTask}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard__col-right">
          
          {/* Schedule */}
          <div className="card dashboard-card">
            <div className="card__header">
              <h3 className="card__title">Lịch học hôm nay</h3>
              <button className="card__header-btn">Xem tất cả</button>
            </div>
            <div className="schedule-list">
              {schedule.map((item, idx) => (
                <div key={idx} className="schedule-item">
                  <div className={`schedule-item__icon bg-${item.color}-light text-${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="schedule-item__content">
                    <h4 className="schedule-item__subject">{item.subject}</h4>
                    <p className="schedule-item__teacher">{item.teacher}</p>
                  </div>
                  <div className="schedule-item__meta">
                    <div className="meta-time">
                      <FiClock size={12} /> {item.time}
                    </div>
                    <div className="meta-room">
                      <FiCheckCircle size={12} /> {item.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Announcements Widget */}
          <div className="card dashboard-card">
            <div className="card__header">
              <h3 className="card__title">Thông báo hệ thống</h3>
              <button className="card__header-btn">Xem tất cả</button>
            </div>
            <div className="announcement-list">
              {announcements.map((ann, idx) => (
                <div key={idx} className={`announcement-item ${ann.urgent ? 'urgent' : ''}`}>
                  <div className="announcement-header">
                    <span className="announcement-tag">{ann.tag}</span>
                    <span className="announcement-date">{ann.date}</span>
                  </div>
                  <h4 className="announcement-title">
                    {ann.urgent && <FiBell className="text-danger" style={{ marginRight: '6px' }} />}
                    {ann.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="card dashboard-card">
            <div className="card__header">
              <h3 className="card__title">Sắp đến hạn</h3>
            </div>
            <div className="deadline-list">
              {deadlines.map((item, idx) => (
                <div key={idx} className="deadline-item">
                  <div className="deadline-item__content">
                    <h4 className="deadline-item__title">{item.title}</h4>
                    <p className="deadline-item__category">{item.category}</p>
                    <p className="deadline-item__date">{item.date}</p>
                  </div>
                  <div className={`deadline-item__badge ${item.urgent ? 'badge-urgent' : 'badge-normal'}`}>
                    {item.daysLeft}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
