import './Dashboard.css';
import { 
  FiTrendingUp, FiCheckCircle, FiAward, FiTarget,
  FiBookOpen, FiAward as FiGrades, FiCalendar, FiCreditCard, FiPrinter, FiGlobe, FiMessageCircle,
  FiMonitor, FiDatabase, FiCpu, FiLock, FiSmartphone,
  FiFileText, FiClock, FiStar
} from 'react-icons/fi';

const Dashboard = () => {
  // Dummy user data
  const user = {
    name: 'Tùng Nguyễn',
    role: 'Sinh viên',
  };

  const stats = [
    { label: 'GPA Tích lũy', value: '3.75', subtext: 'vs học kỳ trước', subvalue: '+0.15', positive: true },
    { label: 'GPA Học kỳ hiện tại', value: '3.95', subtext: 'Tuyệt vời! Tiếp tục phát huy', subvalue: '', positive: true },
    { label: 'Tổng số Tín chỉ', value: '112', subtext: 'Cần 8 tín chỉ nữa để tốt nghiệp', subvalue: '', positive: true },
    { label: 'Tín chỉ Học kỳ này', value: '14', subtext: 'Tối đa 24 tín chỉ được phép', subvalue: '', positive: true },
  ];

  const quickLinks = [
    { icon: <FiBookOpen size={18} />, label: 'Đăng ký môn học' },
    { icon: <FiGrades size={18} />, label: 'Xem điểm' },
    { icon: <FiCalendar size={18} />, label: 'Thời khóa biểu' },
    { icon: <FiCreditCard size={18} />, label: 'Học phí' },
    { icon: <FiPrinter size={18} />, label: 'In kế hoạch' },
    { icon: <FiGlobe size={18} />, label: 'Tin tức' },
    { icon: <FiMessageCircle size={18} />, label: 'Cố vấn' },
  ];

  const schedule = [
    { icon: <FiMonitor size={20} />, subject: 'Lập trình Web', teacher: 'ThS. Nguyễn Văn A', time: 'Thứ 2, 08:00-10:00', room: 'Phòng 203', color: 'blue' },
    { icon: <FiCpu size={20} />, subject: 'Kiến trúc Máy tính', teacher: 'PGS. TS. Trần B', time: 'Thứ 2, 10:15-12:15', room: 'Lab B1', color: 'green' },
    { icon: <FiDatabase size={20} />, subject: 'Hệ quản trị CSDL', teacher: 'ThS. Lê Thị C', time: 'Thứ 3, 09:00-11:00', room: 'Phòng 105', color: 'purple' },
    { icon: <FiTarget size={20} />, subject: 'Trí tuệ Nhân tạo', teacher: 'TS. Phạm D', time: 'Thứ 4, 13:00-15:00', room: 'Lab AI', color: 'orange' },
    { icon: <FiLock size={20} />, subject: 'An toàn Thông tin', teacher: 'ThS. Vũ E', time: 'Thứ 5, 09:00-11:00', room: 'Phòng 105', color: 'purple' },
    { icon: <FiSmartphone size={20} />, subject: 'Lập trình Di động', teacher: 'TS. Hoàng F', time: 'Thứ 6, 08:00-10:00', room: 'Lab M2', color: 'blue' },
  ];

  const deadlines = [
    { title: 'Phân tích dữ liệu với Python', category: 'Khoa học dữ liệu', date: '29 Thg 5, 2025 - 17:00', daysLeft: '1 ngày tới', urgent: true },
    { title: 'Bài tập 2 Lên kế hoạch UX', category: 'Nghiên cứu UX', date: '30 Thg 5, 2025 - 09:00', daysLeft: '2 ngày tới', urgent: true },
    { title: 'Báo cáo Đồ án cuối kỳ', category: 'Quản lý dự án', date: '1 Thg 6, 2025 - 13:00', daysLeft: '4 ngày tới', urgent: false },
    { title: 'Quiz 2 Mạng máy tính', category: 'Mạng máy tính', date: '3 Thg 6, 2025 - 23:59', daysLeft: '6 ngày tới', urgent: false },
  ];

  const events = [
    { title: 'Triển lãm Thiết kế UI/UX', dept: 'Khoa CNTT', date: '29 Thg 5, 2025 - 15:00', daysLeft: '1 ngày tới', urgent: true },
    { title: 'Talkshow Nghề nghiệp 2025', dept: 'Văn phòng Hỗ trợ SV', date: '31 Thg 5, 2025 - 10:00', daysLeft: '3 ngày tới', urgent: false },
    { title: 'Workshop An toàn Không gian mạng', dept: 'CLB Bảo mật', date: '1 Thg 6, 2025 - 09:00', daysLeft: '4 ngày tới', urgent: false },
  ];

  return (
    <div className="dashboard animate-fadeIn">
      {/* HEADER */}
      <div className="dashboard__greeting">
        <h1 className="dashboard__greeting-title">
          Xin chào, {user.name} <span className="wave">👋</span>
        </h1>
        <p className="dashboard__greeting-subtitle">Chào mừng bạn quay trở lại với Hệ thống Quản lý Học liệu số</p>
      </div>

      {/* STATS ROW */}
      <div className="dashboard__stats-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
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
          {/* Quick Links */}
          <div className="card dashboard-card">
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

          {/* Schedule */}
          <div className="card dashboard-card">
            <div className="card__header-flex">
              <h3 className="card__title">Lịch học</h3>
              <button className="btn-text">Xem tất cả</button>
            </div>
            
            <div className="schedule-table">
              <div className="schedule-header">
                <div className="th-class">Lớp học</div>
                <div className="th-time">Thời gian</div>
                <div className="th-room">Phòng</div>
              </div>
              <div className="schedule-body">
                {schedule.map((item, idx) => (
                  <div key={idx} className="schedule-row">
                    <div className="td-class">
                      <div className="schedule-icon">{item.icon}</div>
                      <div>
                        <div className="schedule-subject">{item.subject}</div>
                        <div className="schedule-teacher">{item.teacher}</div>
                      </div>
                    </div>
                    <div className="td-time">{item.time}</div>
                    <div className="td-room">
                      <span className={`room-badge room-badge--${item.color}`}>{item.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard__col-right">
          {/* Deadlines */}
          <div className="card dashboard-card">
            <div className="card__header-flex">
              <h3 className="card__title">Sắp đến hạn</h3>
              <button className="btn-text">Xem tất cả</button>
            </div>
            <div className="list-group">
              {deadlines.map((item, idx) => (
                <div key={idx} className="list-item">
                  <div className="list-item__icon"><FiFileText size={18} /></div>
                  <div className="list-item__content">
                    <div className="list-item__header">
                      <h4 className="list-item__title">{item.title}</h4>
                      <div className="list-item__date">{item.date}</div>
                    </div>
                    <div className="list-item__footer">
                      <span className="category-badge">{item.category}</span>
                      <span className={`days-left-badge ${item.urgent ? 'urgent' : ''}`}>
                        <FiClock size={12} /> {item.daysLeft}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="card dashboard-card">
            <div className="card__header-flex">
              <h3 className="card__title">Sự kiện sắp tới</h3>
              <button className="btn-text">Xem tất cả</button>
            </div>
            <div className="list-group">
              {events.map((item, idx) => (
                <div key={idx} className="list-item">
                  <div className="list-item__icon"><FiStar size={18} /></div>
                  <div className="list-item__content">
                    <div className="list-item__header">
                      <h4 className="list-item__title">{item.title}</h4>
                      <div className="list-item__date">{item.date}</div>
                    </div>
                    <div className="list-item__footer">
                      <span className="category-badge">{item.dept}</span>
                      <span className={`days-left-badge ${item.urgent ? 'urgent' : ''}`}>
                        <FiClock size={12} /> {item.daysLeft}
                      </span>
                    </div>
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
