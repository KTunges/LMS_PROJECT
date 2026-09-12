import { useState, useEffect } from 'react';
import { 
  FiUsers, FiBookOpen, FiCheckSquare, FiCalendar, FiClock 
} from 'react-icons/fi';
import { teacherService } from '../../services';
import '../Dashboard.css'; // Reuse student dashboard CSS for now

const TeacherDashboard = () => {
  const [statsData, setStatsData] = useState({
    activeClasses: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
    schedule: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await teacherService.getDashboardStats();
        if (res.data && res.data.success) {
          setStatsData(res.data.data);
        }
      } catch (err) {
        console.error("Teacher dashboard fetch error:", err);
        setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) return <div className="dashboard"><div style={{padding: 40}}>Đang tải tổng quan Giảng viên...</div></div>;
  if (error) return <div className="dashboard"><div style={{padding: 40, color: 'red'}}>{error}</div></div>;

  const stats = [
    { label: 'Lớp đang phụ trách', value: statsData.activeClasses, icon: <FiBookOpen size={24} />, color: 'blue' },
    { label: 'Tổng số sinh viên', value: statsData.totalStudents, icon: <FiUsers size={24} />, color: 'green' },
    { label: 'Bài tập cần chấm', value: statsData.pendingSubmissions, icon: <FiCheckSquare size={24} />, color: 'orange' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__greeting">
        <h1 className="dashboard__greeting-title">
          Tổng quan <span className="gradient-text">Giảng viên</span>
        </h1>
        <p className="dashboard__greeting-subtitle">Theo dõi các lớp học và sinh viên của bạn.</p>
      </div>

      {/* STATS ROW */}
      <div className="dashboard__stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className={`stat-icon bg-${stat.color}-light text-${stat.color}`} style={{ padding: '16px', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <div className="stat-card__label" style={{ fontSize: '14px', color: 'var(--gray-500)', marginBottom: '4px' }}>{stat.label}</div>
              <div className="stat-card__value" style={{ fontSize: '28px', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* LEFT COLUMN: Classes summary or recent activities */}
        <div className="dashboard__col-left">
          <div className="card dashboard-card">
            <h3 className="card__title">Hoạt động gần đây</h3>
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>
              Chưa có hoạt động nổi bật nào.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Schedule */}
        <div className="dashboard__col-right">
          <div className="card dashboard-card">
            <div className="card__header">
              <h3 className="card__title">Lịch dạy hôm nay</h3>
            </div>
            <div className="schedule-list">
              {statsData.schedule && statsData.schedule.length > 0 ? (
                statsData.schedule.map((item, idx) => (
                  <div key={idx} className="schedule-item">
                    <div className={`schedule-item__icon bg-${item.color}-light text-${item.color}`}>
                      <FiCalendar size={20} />
                    </div>
                    <div className="schedule-item__content">
                      <h4 className="schedule-item__subject">{item.subject}</h4>
                    </div>
                    <div className="schedule-item__meta">
                      <div className="meta-time">
                        <FiClock size={12} /> {item.time}
                      </div>
                      <div className="meta-room">
                        Phòng {item.room}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '13px' }}>
                  Hôm nay bạn không có lịch dạy.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
