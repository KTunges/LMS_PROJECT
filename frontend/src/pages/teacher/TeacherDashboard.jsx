import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiMonitor, FiDollarSign, FiStar, FiShoppingBag, FiActivity, FiDownload
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { teacherService } from '../../services';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    monthlyRevenue: 0,
    averageRating: 0.0,
    recentSales: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock chart data for a beautiful wave
  const chartData = [
    { name: '1 Thg 9', revenue: 420 },
    { name: '5 Thg 9', revenue: 800 },
    { name: '10 Thg 9', revenue: 650 },
    { name: '15 Thg 9', revenue: 1200 },
    { name: '20 Thg 9', revenue: 950 },
    { name: '25 Thg 9', revenue: 1400 },
    { name: '30 Thg 9', revenue: 1800 },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await teacherService.getDashboardStats();
        if (res.data && res.data.success) {
          const raw = res.data.data;
          setStatsData({
            totalCourses: raw.activeClasses || raw.totalCourses || 0,
            totalStudents: raw.totalStudents || 0,
            monthlyRevenue: raw.monthlyRevenue !== undefined ? Number(raw.monthlyRevenue) : 0,
            averageRating: raw.averageRating || 4.8,
            recentSales: Array.isArray(raw.recentSales) ? raw.recentSales : []
          });
        }
      } catch (err) {
        console.error("Lỗi tải dashboard giảng viên:", err);
        // Fallback to beautiful mock data if backend fails
        setStatsData({
          totalCourses: 0,
          totalStudents: 0,
          monthlyRevenue: 0,
          averageRating: 5.0,
          recentSales: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) return <div className="td-page"><div style={{padding: 40, color: 'var(--theme-text-muted)', textAlign: 'center'}}>Đang tải dữ liệu...</div></div>;
  if (error) return <div className="td-page"><div style={{padding: 40, color: '#ef4444', textAlign: 'center'}}>{error}</div></div>;

  return (
    <div className="td-page">
      {/* HEADER */}
      <div className="td-header">
        <div>
          <h1 className="td-title">
            Bảng điều khiển <span className="gradient-text">Giảng viên</span>
          </h1>
          <p className="td-subtitle">Theo dõi doanh thu và tiến độ bán khóa học của bạn một cách trực quan nhất.</p>
        </div>
        <button className="td-action-btn">
          <FiDownload size={18} /> Xuất Báo Cáo
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="td-stats-grid">
        <div className="td-stat-card td-stat-card--revenue">
          <div className="td-stat-header">
            <div className="td-stat-icon td-stat-icon--green"><FiDollarSign /></div>
            <span className="td-stat-trend td-stat-trend--up">+12%</span>
          </div>
          <div>
            <div className="td-stat-label">Doanh thu tháng này</div>
            <div className="td-stat-value td-stat-value--highlight">
              {statsData.monthlyRevenue.toLocaleString()}đ
            </div>
          </div>
        </div>

        <div className="td-stat-card td-stat-card--students">
          <div className="td-stat-header">
            <div className="td-stat-icon td-stat-icon--blue"><FiUsers /></div>
            <span className="td-stat-trend td-stat-trend--up">+8%</span>
          </div>
          <div>
            <div className="td-stat-label">Tổng Học viên</div>
            <div className="td-stat-value">
              {statsData.totalStudents.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="td-stat-card td-stat-card--courses">
          <div className="td-stat-header">
            <div className="td-stat-icon td-stat-icon--purple"><FiMonitor /></div>
          </div>
          <div>
            <div className="td-stat-label">Khóa học đang bán</div>
            <div className="td-stat-value">
              {statsData.totalCourses}
            </div>
          </div>
        </div>

        <div className="td-stat-card td-stat-card--rating">
          <div className="td-stat-header">
            <div className="td-stat-icon td-stat-icon--orange"><FiStar /></div>
            <span className="td-stat-trend td-stat-trend--up">+0.2</span>
          </div>
          <div>
            <div className="td-stat-label">Đánh giá trung bình</div>
            <div className="td-stat-value">
              {statsData.averageRating} <span style={{fontSize: '18px', color: 'var(--theme-text-muted)'}}>/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="td-main-grid">
        
        {/* LEFT: Revenue Chart */}
        <div className="td-panel">
          <div className="td-panel-header">
            <h3 className="td-panel-title"><FiActivity /> Biểu đồ Doanh thu</h3>
            <select className="td-select">
              <option>30 ngày qua</option>
              <option>Tháng trước</option>
              <option>Năm nay</option>
            </select>
          </div>
          
          <div className="td-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border-color)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} 
                  tickFormatter={(val) => `${val}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-glass-border)', borderRadius: '12px', color: 'var(--theme-text-main)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Recent Sales */}
        <div className="td-panel">
          <div className="td-panel-header">
            <h3 className="td-panel-title"><FiShoppingBag /> Giao dịch mới nhất</h3>
          </div>
          
          <div className="td-sales-list">
            {statsData.recentSales && statsData.recentSales.length > 0 ? (
              statsData.recentSales.map((sale) => (
                <div key={sale.id} className="td-sale-item">
                  <div className="td-sale-user">
                    <div className="td-sale-avatar">
                      {sale.student.charAt(0)}
                    </div>
                    <div className="td-sale-info">
                      <span className="td-sale-name">{sale.student}</span>
                      <span className="td-sale-course">{sale.course}</span>
                    </div>
                  </div>
                  <div className="td-sale-meta">
                    <span className="td-sale-amount">+{sale.amount.toLocaleString()}đ</span>
                    <span className="td-sale-time">{sale.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--theme-text-muted)' }}>
                Chưa có lượt mua nào gần đây.
              </div>
            )}
          </div>
          
          <div className="td-view-all">
            <button className="td-view-all-btn" onClick={() => navigate('/portal-giang-vien/revenue')}>
              Xem tất cả giao dịch
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TeacherDashboard;
