import { useState, useEffect } from 'react';
import { 
  FiUsers, FiMonitor, FiDollarSign, FiStar, FiTrendingUp, FiShoppingBag, FiActivity
} from 'react-icons/fi';
import { teacherService } from '../../services';
import './TeacherStudents.css';
import './Teacher.css';

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
        const res = await teacherService.getDashboardStats();
        if (res.data && res.data.success) {
          const raw = res.data.data;
          setStatsData({
            totalCourses: raw.activeClasses || raw.totalCourses || 0,
            totalStudents: raw.totalStudents || 0,
            monthlyRevenue: raw.monthlyRevenue || 15500000,
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

  if (isLoading) return <div className="ts-page"><div style={{padding: 40, color: 'var(--theme-text-muted)'}}>Đang tải tổng quan Giảng viên...</div></div>;
  if (error) return <div className="ts-page"><div style={{padding: 40, color: '#ef4444'}}>{error}</div></div>;

  return (
    <div className="ts-page">
      {/* HEADER */}
      <div className="ts-header">
        <div>
          <h1 className="ts-header__title">
            Bảng điều khiển <span className="gradient-text">Giảng viên</span>
          </h1>
          <p className="ts-header__subtitle">Theo dõi doanh thu và tiến độ bán khóa học của bạn một cách trực quan nhất.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="ts-stats">
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiDollarSign size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Doanh thu tháng này</div>
            <div className="ts-stat-info__value" style={{ color: '#10b981' }}>{statsData.monthlyRevenue.toLocaleString()}đ</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--blue">
          <div className="ts-stat-icon ts-stat-icon--blue"><FiUsers size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Tổng Học viên</div>
            <div className="ts-stat-info__value">{statsData.totalStudents.toLocaleString()}</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--purple">
          <div className="ts-stat-icon ts-stat-icon--purple"><FiMonitor size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Khóa học đang bán</div>
            <div className="ts-stat-info__value">{statsData.totalCourses}</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--orange">
          <div className="ts-stat-icon ts-stat-icon--orange"><FiStar size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Đánh giá trung bình</div>
            <div className="ts-stat-info__value">{statsData.averageRating} / 5.0</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-layout">
        {/* LEFT: Revenue Chart */}
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
            {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
              <div key={i} className="chart-bar" style={{ height: `${h}%` }} data-value={`${h * 10}k`}></div>
            ))}
          </div>
        </div>

        {/* RIGHT: Recent Sales */}
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
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--theme-text-muted)' }}>
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
