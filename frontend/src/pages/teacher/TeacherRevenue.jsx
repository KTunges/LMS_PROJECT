import { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiDownload, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import './TeacherStudents.css'; /* Reuse the ts- scoped styles */

const TeacherRevenue = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const balance = 12500000;
  const pendingClearance = 4500000;
  const lifetimeEarnings = 145000000;

  const transactions = [
    { id: 'TRX-101', course: 'Lập trình ReactJS Thực chiến', student: 'Nguyễn Văn A', amount: 599000, date: '13/09/2026', status: 'completed' },
    { id: 'TRX-102', course: 'NodeJS API Masterclass', student: 'Trần Thị B', amount: 899000, date: '12/09/2026', status: 'completed' },
    { id: 'TRX-103', course: 'Figma UI/UX cho người mới', student: 'Lê Văn C', amount: 399000, date: '10/09/2026', status: 'pending' },
    { id: 'TRX-104', course: 'Lập trình ReactJS Thực chiến', student: 'Hoàng D', amount: 599000, date: '08/09/2026', status: 'completed' },
  ];

  return (
    <div className="ts-page">
      {/* HEADER */}
      <div className="ts-header">
        <div>
          <h1 className="ts-header__title">
            Báo cáo <span className="gradient-text">Doanh thu</span>
          </h1>
          <p className="ts-header__subtitle">Theo dõi thu nhập từ các khóa học của bạn chi tiết theo từng tháng.</p>
        </div>
        <div className="ts-header__actions">
          <button className="ts-btn-email">
            <FiDownload size={18} /> Xuất báo cáo (CSV)
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="ts-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiDollarSign size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Số dư khả dụng</div>
            <div className="ts-stat-info__value" style={{ color: '#10b981' }}>{balance.toLocaleString()}đ</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--orange">
          <div className="ts-stat-icon ts-stat-icon--orange"><FiClock size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Đang chờ đối soát</div>
            <div className="ts-stat-info__value" style={{ color: '#f59e0b' }}>{pendingClearance.toLocaleString()}đ</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--blue">
          <div className="ts-stat-icon ts-stat-icon--blue"><FiTrendingUp size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Tổng thu nhập trọn đời</div>
            <div className="ts-stat-info__value" style={{ color: '#3b82f6' }}>{lifetimeEarnings.toLocaleString()}đ</div>
          </div>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="ts-content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--theme-border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--theme-text-main)' }}>Lịch sử giao dịch</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="ts-btn-email" style={{ background: 'var(--theme-card-bg)', color: 'var(--theme-text-main)', border: '1px solid var(--theme-border-color)', boxShadow: 'none', padding: '8px 16px' }}>
              <FiCalendar size={16} /> Tháng này
            </button>
          </div>
        </div>

        <table className="ts-table">
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Khóa học</th>
              <th>Học viên</th>
              <th>Ngày mua</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>{trx.id}</td>
                <td style={{ fontWeight: 500 }}>{trx.course}</td>
                <td>{trx.student}</td>
                <td className="ts-date">{trx.date}</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>+{trx.amount.toLocaleString()}đ</td>
                <td>
                  {trx.status === 'completed' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                      <FiCheckCircle size={14} /> Hoàn tất
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                      <FiClock size={14} /> Chờ xử lý
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherRevenue;
