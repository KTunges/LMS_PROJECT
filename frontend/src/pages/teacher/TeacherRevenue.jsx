import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiDownload, FiCalendar, FiClock, FiCheckCircle, FiArrowUpRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { teacherService } from '../../services';
import './TeacherRevenue.css';

const TeacherRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    balance: 0,
    pendingClearance: 0,
    lifetimeEarnings: 0,
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock chart data
  const chartData = [
    { name: 'Thg 4', value: 3200 },
    { name: 'Thg 5', value: 5800 },
    { name: 'Thg 6', value: 4500 },
    { name: 'Thg 7', value: 7200 },
    { name: 'Thg 8', value: 9100 },
    { name: 'Thg 9', value: 12500 },
  ];

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setIsLoading(true);
      const res = await teacherService.getRevenue();
      if (res.data.success) {
        setRevenueData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      // Fallback mock data
      setRevenueData({
        balance: 12500000,
        pendingClearance: 4500000,
        lifetimeEarnings: 145000000,
        transactions: [
          { id: 'TRX-101', course: 'Lập trình ReactJS Thực chiến', student: 'Nguyễn Văn A', amount: 599000, date: '13/09/2026', status: 'completed' },
          { id: 'TRX-102', course: 'NodeJS API Masterclass', student: 'Trần Thị B', amount: 899000, date: '12/09/2026', status: 'completed' },
          { id: 'TRX-103', course: 'Figma UI/UX cho người mới', student: 'Lê Văn C', amount: 399000, date: '10/09/2026', status: 'pending' },
          { id: 'TRX-104', course: 'Lập trình ReactJS Thực chiến', student: 'Hoàng D', amount: 599000, date: '08/09/2026', status: 'completed' },
          { id: 'TRX-105', course: 'NextJS 14 App Router', student: 'Phạm E', amount: 699000, date: '07/09/2026', status: 'completed' },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const header = 'Mã GD,Khóa học,Học viên,Ngày mua,Số tiền,Trạng thái\n';
    const rows = revenueData.transactions.map(t =>
      `${t.id},${t.course},${t.student},${t.date},${t.amount},${t.status}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue_report.csv';
    a.click();
    toast.success('Đã xuất báo cáo CSV!');
  };

  const filteredTransactions = revenueData.transactions.filter(t =>
    filterStatus === 'all' || t.status === filterStatus
  );

  if (isLoading) return <div className="tr-page" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="tr-page">
      {/* HEADER */}
      <div className="tr-header">
        <div>
          <h1 className="tr-title">
            Báo cáo <span className="gradient-text">Doanh thu</span>
          </h1>
          <p className="tr-subtitle">Theo dõi thu nhập từ các khóa học của bạn chi tiết theo từng tháng.</p>
        </div>
        <button className="tr-export-btn" onClick={handleExport}>
          <FiDownload size={18} /> Xuất báo cáo (CSV)
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="tr-stats">
        <div className="tr-stat-card tr-stat-card--green">
          <div className="tr-stat-header">
            <div className="tr-stat-icon" style={{background: 'rgba(16,185,129,0.1)', color: '#10b981'}}>
              <FiDollarSign size={24} />
            </div>
            <span className="tr-stat-trend tr-stat-trend--up"><FiArrowUpRight size={14} /> +18%</span>
          </div>
          <div className="tr-stat-label">Số dư khả dụng</div>
          <div className="tr-stat-value tr-stat-value--green">{revenueData.balance.toLocaleString()}đ</div>
        </div>

        <div className="tr-stat-card tr-stat-card--orange">
          <div className="tr-stat-header">
            <div className="tr-stat-icon" style={{background: 'rgba(245,158,11,0.1)', color: '#f59e0b'}}>
              <FiClock size={24} />
            </div>
          </div>
          <div className="tr-stat-label">Đang chờ đối soát</div>
          <div className="tr-stat-value tr-stat-value--orange">{revenueData.pendingClearance.toLocaleString()}đ</div>
        </div>

        <div className="tr-stat-card tr-stat-card--blue">
          <div className="tr-stat-header">
            <div className="tr-stat-icon" style={{background: 'rgba(59,130,246,0.1)', color: '#3b82f6'}}>
              <FiTrendingUp size={24} />
            </div>
            <span className="tr-stat-trend tr-stat-trend--up"><FiArrowUpRight size={14} /> +24%</span>
          </div>
          <div className="tr-stat-label">Tổng thu nhập trọn đời</div>
          <div className="tr-stat-value tr-stat-value--blue">{revenueData.lifetimeEarnings.toLocaleString()}đ</div>
        </div>
      </div>

      {/* CHART PANEL */}
      <div className="tr-panel tr-chart-panel">
        <div className="tr-panel-header">
          <h3 className="tr-panel-title"><FiTrendingUp /> Xu hướng doanh thu theo tháng</h3>
          <select className="tr-select">
            <option>6 tháng gần nhất</option>
            <option>Năm nay</option>
          </select>
        </div>
        <div className="tr-chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border-color)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} tickFormatter={v => `${v}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-glass-border)', borderRadius: '12px', color: 'var(--theme-text-main)' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                formatter={(val) => [`${val.toLocaleString()}k`, 'Doanh thu']}
              />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="tr-panel">
        <div className="tr-panel-header">
          <h3 className="tr-panel-title"><FiCalendar /> Lịch sử giao dịch</h3>
          <div className="tr-status-filters">
            {['all', 'completed', 'pending'].map(s => (
              <button key={s}
                className={`tr-status-btn ${filterStatus === s ? 'tr-status-btn--active' : ''}`}
                onClick={() => setFilterStatus(s)}>
                {s === 'all' ? 'Tất cả' : s === 'completed' ? 'Hoàn tất' : 'Chờ xử lý'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="tr-trx-list">
            {filteredTransactions.map((trx, idx) => (
              <div key={idx} className="tr-trx-item">
                <div className="tr-trx-left">
                  <div className={`tr-trx-avatar ${trx.status === 'completed' ? 'tr-trx-avatar--green' : 'tr-trx-avatar--orange'}`}>
                    {trx.student.charAt(0)}
                  </div>
                  <div className="tr-trx-info">
                    <div className="tr-trx-id">{trx.id}</div>
                    <div className="tr-trx-student">{trx.student}</div>
                    <div className="tr-trx-course">{trx.course}</div>
                  </div>
                </div>
                <div className="tr-trx-right">
                  <div className="tr-trx-amount">+{trx.amount.toLocaleString()}đ</div>
                  <div className="tr-trx-date">{trx.date}</div>
                  {trx.status === 'completed' ? (
                    <span className="tr-trx-status tr-trx-status--completed"><FiCheckCircle size={14} /> Hoàn tất</span>
                  ) : (
                    <span className="tr-trx-status tr-trx-status--pending"><FiClock size={14} /> Chờ xử lý</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tr-empty">Không có giao dịch nào phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default TeacherRevenue;
