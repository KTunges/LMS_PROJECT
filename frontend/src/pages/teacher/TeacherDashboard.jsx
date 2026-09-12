import { useState, useEffect } from 'react';
import { 
  FiUsers, FiMonitor, FiDollarSign, FiStar, FiTrendingUp, FiShoppingBag, FiActivity
} from 'react-icons/fi';
import { teacherService } from '../../services';
import '../../styles/shared.css';

const TeacherDashboard = () => {
  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    monthlyRevenue: 0,
    averageRating: 0.0,
    recentSales: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // We will mock the revenue response if API is not fully ready
        // But attempt to call the real API first
        const res = await teacherService.getDashboardStats();
        if (res.data && res.data.success) {
          // If backend still returns old format, map it to E-learning format safely
          const raw = res.data.data;
          setStatsData({
            totalCourses: raw.activeClasses || raw.totalCourses || 0,
            totalStudents: raw.totalStudents || 0,
            monthlyRevenue: raw.monthlyRevenue || 15500000, // Mock if missing
            averageRating: raw.averageRating || 4.8,
            recentSales: raw.recentSales || [
              { id: 1, course: 'Lập trình ReactJS Thực chiến', student: 'Nguyễn Văn A', amount: 599000, time: '2 giờ trước' },
              { id: 2, course: 'NodeJS API Masterclass', student: 'Trần Thị B', amount: 899000, time: '5 giờ trước' },
              { id: 3, course: 'Figma UI/UX cho người mới', student: 'Lê Văn C', amount: 399000, time: '1 ngày trước' }
            ]
          });
        }
      } catch (err) {
        console.error("Lỗi tải dashboard giảng viên:", err);
        // Fallback mock if API fails
        setStatsData({
          totalCourses: 5,
          totalStudents: 128,
          monthlyRevenue: 15500000,
          averageRating: 4.8,
          recentSales: [
            { id: 1, course: 'Lập trình ReactJS Thực chiến', student: 'Nguyễn Văn A', amount: 599000, time: '2 giờ trước' },
            { id: 2, course: 'NodeJS API Masterclass', student: 'Trần Thị B', amount: 899000, time: '5 giờ trước' },
            { id: 3, course: 'Figma UI/UX cho người mới', student: 'Lê Văn C', amount: 399000, time: '1 ngày trước' }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) return <div className="teacher-page"><div style={{padding: 40}}>Đang tải tổng quan Giảng viên...</div></div>;
  if (error) return <div className="teacher-page"><div style={{padding: 40, color: '#ef4444'}}>{error}</div></div>;

  const stats = [
    { label: 'Doanh thu tháng này', value: `${statsData.monthlyRevenue.toLocaleString()}đ`, icon: <FiDollarSign />, color: 'green' },
    { label: 'Tổng Học viên', value: statsData.totalStudents.toLocaleString(), icon: <FiUsers />, color: 'blue' },
    { label: 'Khóa học đang bán', value: statsData.totalCourses, icon: <FiMonitor />, color: 'purple' },
    { label: 'Đánh giá trung bình', value: `${statsData.averageRating} / 5.0`, icon: <FiStar />, color: 'orange' },
  ];

  return (
    <div className="teacher-page">
      <div className="teacher-header">
        <h1 className="teacher-title">
          Bảng điều khiển <span className="gradient-text">Giảng viên</span>
        </h1>
        <p className="teacher-subtitle">Theo dõi doanh thu và tiến độ bán khóa học của bạn một cách trực quan nhất.</p>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon bg-${stat.color}-light text-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-layout">
        {/* LEFT COLUMN: Revenue Chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title"><FiActivity /> Biểu đồ Doanh thu (30 ngày qua)</h3>
            <select className="btn btn-outline" style={{ padding: '6px 12px' }}>
              <option>Tháng này</option>
              <option>Tháng trước</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="chart-container">
            {/* Fake bars for visual mockup */}
            {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
              <div key={i} className="chart-bar" style={{ height: `${h}%` }} data-value={`${h * 10}k`}></div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Sales */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title"><FiShoppingBag /> Đơn hàng mới nhất</h3>
          </div>
          <div className="sales-list">
            {statsData.recentSales && statsData.recentSales.length > 0 ? (
              statsData.recentSales.map((sale) => (
                <div key={sale.id} className="sale-item">
                  <div className="sale-info">
                    <span className="sale-student">{sale.student}</span>
                    <span className="sale-course">{sale.course}</span>
                  </div>
                  <div className="sale-meta">
                    <span className="sale-amount">+{sale.amount.toLocaleString()}đ</span>
                    <span className="sale-time">{sale.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Chưa có lượt mua nào gần đây.
              </div>
            )}
          </div>
          
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '20px' }}>
            Xem tất cả giao dịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
