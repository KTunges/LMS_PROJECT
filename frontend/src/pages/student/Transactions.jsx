import React, { useState } from 'react';
import { FiDownload, FiCheckCircle, FiClock, FiXCircle, FiCreditCard } from 'react-icons/fi';
import './Transactions.css';

const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-88192',
    courseName: 'Luyện thi IELTS Target 7.0+',
    amount: 599000,
    date: '10/09/2026',
    status: 'success',
    method: 'VNPay'
  },
  {
    id: 'TXN-88145',
    courseName: 'Trí tuệ nhân tạo (AI) Thực chiến',
    amount: 899000,
    date: '05/09/2026',
    status: 'success',
    method: 'Momo'
  },
  {
    id: 'TXN-88102',
    courseName: 'Làm chủ Figma trong 7 ngày',
    amount: 0,
    date: '01/09/2026',
    status: 'success',
    method: 'Miễn phí'
  },
  {
    id: 'TXN-88099',
    courseName: 'Hệ quản trị Cơ sở dữ liệu',
    amount: 299000,
    date: '30/08/2026',
    status: 'failed',
    method: 'VNPay'
  }
];

const Transactions = () => {
  const [filter, setFilter] = useState('all');

  const filteredTxns = filter === 'all' 
    ? MOCK_TRANSACTIONS 
    : MOCK_TRANSACTIONS.filter(t => t.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="badge success"><FiCheckCircle /> Thành công</span>;
      case 'pending':
        return <span className="badge warning"><FiClock /> Đang xử lý</span>;
      case 'failed':
        return <span className="badge danger"><FiXCircle /> Thất bại</span>;
      default:
        return null;
    }
  };

  return (
    <div className="transactions-page fade-in">
      <div className="transactions-header">
        <div className="header-icon">
          <FiCreditCard size={32} />
        </div>
        <div className="header-text">
          <h1>Lịch Sử Giao Dịch</h1>
          <p>Quản lý các hóa đơn và khóa học bạn đã mua trên hệ thống.</p>
        </div>
      </div>

      <div className="transactions-content glass-card">
        <div className="transactions-filters">
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
          <button className={`filter-tab ${filter === 'success' ? 'active' : ''}`} onClick={() => setFilter('success')}>Thành công</button>
          <button className={`filter-tab ${filter === 'failed' ? 'active' : ''}`} onClick={() => setFilter('failed')}>Thất bại</button>
        </div>

        <div className="table-responsive">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Khóa học</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Ngày giao dịch</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map(txn => (
                <tr key={txn.id}>
                  <td className="fw-bold">{txn.id}</td>
                  <td>{txn.courseName}</td>
                  <td className={txn.amount === 0 ? 'text-green fw-bold' : 'fw-bold'}>
                    {txn.amount === 0 ? 'Miễn phí' : `${txn.amount.toLocaleString()}đ`}
                  </td>
                  <td>{txn.method}</td>
                  <td>{txn.date}</td>
                  <td>{getStatusBadge(txn.status)}</td>
                  <td>
                    {txn.status === 'success' && (
                      <button className="btn-icon" title="Tải biên lai">
                        <FiDownload /> Biên lai
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredTxns.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Không có giao dịch nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
