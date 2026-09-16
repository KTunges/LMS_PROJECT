import React, { useState, useEffect } from 'react';
import { FiDownload, FiCheckCircle, FiClock, FiXCircle, FiCreditCard } from 'react-icons/fi';
import { studentService } from '../../services';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Transactions.css';

const Transactions = () => {
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await studentService.getTransactions();
        if (res.data) {
          setTransactions(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử giao dịch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTxns = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge success"><FiCheckCircle /> Thành công</span>;
      case 'pending':
        return <span className="badge warning"><FiClock /> Đang xử lý</span>;
      case 'failed':
        return <span className="badge danger"><FiXCircle /> Thất bại</span>;
      default:
        return null;
    }
  };

  const downloadInvoice = (txn) => {
    const doc = new jsPDF();
    
    // Add font for Vietnamese characters (basic approach: ascii fallback for standard fonts if not using custom VNF font)
    // For simplicity, we use standard font but remove vietnamese accents or use basic mapping if needed, 
    // but jsPDF basic fonts don't support full utf-8 out of the box without custom fonts.
    // To ensure no crash, we'll write the text plainly.
    
    doc.setFontSize(22);
    doc.setTextColor(212, 160, 23); // Gold color
    doc.text('LMS EDUCATION', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('HOA DON THANH TOAN', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Ma giao dich: TXN-${txn.id}`, 20, 50);
    doc.text(`Ngay: ${new Date(txn.date).toLocaleDateString('vi-VN')}`, 20, 60);
    doc.text(`Phuong thuc: ${txn.paymentMethod || 'N/A'}`, 20, 70);
    doc.text(`Trang thai: Thanh cong`, 20, 80);

    doc.autoTable({
      startY: 90,
      head: [['Khóa học (Course)', 'Số tiền (Amount)']],
      body: [
        [txn.description || 'Khóa học', `${Number(txn.amount).toLocaleString()} VND`]
      ],
      headStyles: { fillColor: [212, 160, 23] }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Cam on ban da su dung dich vu cua LMS Education!', 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    doc.save(`HoaDon_TXN_${txn.id}.pdf`);
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
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Thành công</button>
          <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Đang xử lý</button>
          <button className={`filter-btn ${filter === 'failed' ? 'active' : ''}`} onClick={() => setFilter('failed')}>Thất bại</button>
        </div>

        {isLoading ? (
          <SkeletonTable rows={4} cols={6} />
        ) : filteredTxns.length === 0 ? (
          <div className="empty-transactions">
            <FiCreditCard size={48} color="#cbd5e1" />
            <p>Không có giao dịch nào.</p>
          </div>
        ) : (
          <div className="transactions-table-wrapper glass-card">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Khóa học</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map(txn => (
                  <tr key={txn.id}>
                    <td>TXN-{txn.id}</td>
                    <td>
                      <div className="txn-course-name">{txn.description}</div>
                      <div className="txn-date">{new Date(txn.date).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="txn-amount">{Number(txn.amount).toLocaleString()}đ</td>
                    <td>
                      <span className="payment-method">{txn.paymentMethod === 'internal' ? 'Nội bộ / Mặc định' : txn.paymentMethod}</span>
                    </td>
                    <td>{getStatusBadge(txn.status)}</td>
                    <td>
                      {txn.status === 'completed' && (
                        <button className="btn-icon" title="Tải biên lai" onClick={() => downloadInvoice(txn)}>
                          <FiDownload /> Biên lai
                        </button>
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

export default Transactions;
