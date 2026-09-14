import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiDownload, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { teacherService } from '../../services';
import './TeacherStudents.css';

const TeacherRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    balance: 0,
    pendingClearance: 0,
    lifetimeEarnings: 0,
    monthlyRevenue: 0,
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'month'

  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      const res = await teacherService.getRevenue();
      if (res.data && res.data.success) {
        setRevenueData(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu doanh thu giảng viên:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const filteredTransactions = revenueData.transactions.filter(trx => {
    if (filterPeriod === 'month') {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const [day, month, year] = (trx.date || '').split('/');
      return Number(month) === currentMonth && Number(year) === currentYear;
    }
    return true;
  });

  return (
    <div className="ts-page">
      {/* HEADER */}
      <div className="ts-header">
        <div>
          <h1 className="ts-header__title">
            Báo cáo <span className="gradient-text">Doanh thu & Dòng tiền</span>
          </h1>
          <p className="ts-header__subtitle">
            Hệ thống quản trị dòng tiền tự động – Tiền thanh toán khóa học từ học viên qua Ví MoMo được cộng trực tiếp vào tài khoản giảng viên.
          </p>
        </div>
        <div className="ts-header__actions" style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="ts-btn-email" 
            onClick={fetchRevenue}
            style={{ background: 'var(--theme-card-bg)', color: 'var(--theme-text-main)', border: '1px solid var(--theme-border-color)' }}
          >
            <FiRefreshCw size={16} /> Làm mới
          </button>
          <button className="ts-btn-email">
            <FiDownload size={18} /> Xuất báo cáo (CSV)
          </button>
        </div>
      </div>

      {/* STAT CARDS (4 cards) */}
      <div className="ts-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Số dư khả dụng */}
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiDollarSign size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Số dư khả dụng</div>
            <div className="ts-stat-info__value" style={{ color: '#10b981', fontSize: '22px' }}>
              {isLoading ? '...' : `${Number(revenueData.balance || 0).toLocaleString('vi-VN')}đ`}
            </div>
          </div>
        </div>

        {/* Doanh thu tháng này */}
        <div className="ts-stat-card ts-stat-card--purple" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="ts-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiCalendar size={24} />
          </div>
          <div>
            <div className="ts-stat-info__label">Doanh thu tháng này</div>
            <div className="ts-stat-info__value" style={{ color: '#8b5cf6', fontSize: '22px' }}>
              {isLoading ? '...' : `${Number(revenueData.monthlyRevenue || 0).toLocaleString('vi-VN')}đ`}
            </div>
          </div>
        </div>

        {/* Đang chờ đối soát */}
        <div className="ts-stat-card ts-stat-card--orange">
          <div className="ts-stat-icon ts-stat-icon--orange"><FiClock size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Đang chờ đối soát</div>
            <div className="ts-stat-info__value" style={{ color: '#f59e0b', fontSize: '22px' }}>
              {isLoading ? '...' : `${Number(revenueData.pendingClearance || 0).toLocaleString('vi-VN')}đ`}
            </div>
          </div>
        </div>

        {/* Tổng thu nhập trọn đời */}
        <div className="ts-stat-card ts-stat-card--blue">
          <div className="ts-stat-icon ts-stat-icon--blue"><FiTrendingUp size={24} /></div>
          <div>
            <div className="ts-stat-info__label">Tổng thu nhập trọn đời</div>
            <div className="ts-stat-info__value" style={{ color: '#3b82f6', fontSize: '22px' }}>
              {isLoading ? '...' : `${Number(revenueData.lifetimeEarnings || 0).toLocaleString('vi-VN')}đ`}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="ts-content-card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--theme-border-color)' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--theme-text-main)', margin: '0 0 4px 0' }}>Lịch sử giao dịch thực tế</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--theme-text-muted)' }}>Chi tiết các giao dịch mua khóa học từ học viên</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setFilterPeriod('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--theme-border-color)',
                background: filterPeriod === 'all' ? '#3b82f6' : 'var(--theme-card-bg)',
                color: filterPeriod === 'all' ? 'white' : 'var(--theme-text-main)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterPeriod('month')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--theme-border-color)',
                background: filterPeriod === 'month' ? '#3b82f6' : 'var(--theme-card-bg)',
                color: filterPeriod === 'month' ? 'white' : 'var(--theme-text-main)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Tháng này
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme-text-muted)' }}>
            Đang tải dữ liệu giao dịch...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme-text-muted)', background: 'var(--theme-bg-subtle, #f8fafc)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '15px' }}>Chưa có giao dịch mua khóa học nào được ghi nhận.</p>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Khi học viên mua khóa học qua Ví MoMo, các đơn hàng thành công sẽ tự động hiển thị và cộng tiền tại đây.</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="ts-table">
              <thead>
                <tr>
                  <th>Mã Đơn / GD</th>
                  <th>Khóa học</th>
                  <th>Học viên</th>
                  <th>Phương thức</th>
                  <th>Thời gian</th>
                  <th>Doanh thu nhận</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trx, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: '#3b82f6', fontFamily: 'monospace', fontSize: '13px' }}>
                      {trx.id}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--theme-text-main)' }}>
                      {trx.course}
                    </td>
                    <td style={{ color: 'var(--theme-text-main)' }}>
                      {trx.student}
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: '#fdf2f8', 
                        color: '#be185d', 
                        border: '1px solid #fbcfe8',
                        padding: '3px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 600 
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d82d8b' }}></span>
                        {trx.paymentMethod || 'Ví MoMo'}
                      </span>
                    </td>
                    <td className="ts-date">{trx.date}</td>
                    <td style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>
                      +{Number(trx.amount || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td>
                      {trx.status === 'completed' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                          <FiCheckCircle size={14} /> Hoàn tất
                        </span>
                      ) : trx.status === 'pending' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                          <FiClock size={14} /> Chờ đối soát
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                          <FiXCircle size={14} /> Thất bại
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherRevenue;
