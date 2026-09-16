import { useState, useEffect, useMemo } from 'react';
import { FiDollarSign, FiArrowUpRight, FiBook, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';

const AdminFinance = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/finance');
      if (res.data.success) {
        setTransactions(res.data.data);
        const total = res.data.data
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + Number(t.platform_amount || t.amount || 0), 0);
        setTotalRevenue(total);
      }
    } catch (err) {
      toast.error('Lỗi tải dữ liệu tài chính');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  // Aggregate revenue by date for the chart
  const chartData = useMemo(() => {
    const dataMap = {};
    transactions.forEach(t => {
      if (t.status === 'completed') {
        const dateStr = format(new Date(t.created_at), 'dd/MM');
        dataMap[dateStr] = (dataMap[dateStr] || 0) + Number(t.platform_amount || t.amount || 0);
      }
    });
    return Object.keys(dataMap).map(key => ({ date: key, revenue: dataMap[key] })).reverse(); // Reverse if dates come latest first
  }, [transactions]);

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc muốn duyệt giao dịch này? (Hệ thống sẽ ghi danh khóa học và chia hoa hồng)')) return;
    try {
      const res = await api.put(`/admin/finance/${id}/approve`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchTransactions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi duyệt giao dịch');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc muốn từ chối giao dịch này?')) return;
    try {
      const res = await api.put(`/admin/finance/${id}/reject`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchTransactions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ chối giao dịch');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1e293b', fontWeight: 800, margin: 0 }}>Quản lý Tài chính</h1>
        
        <div style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', padding: '12px 24px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}>
            <FiDollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>Tổng Doanh Thu Hệ Thống</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalRevenue.toLocaleString()} VNĐ</div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="admin-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="admin-card-title"><FiArrowUpRight /> Biểu đồ Doanh Thu</h2>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
                <RechartsTooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']} />
                <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{r: 4, fill: '#d4af37', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="admin-card-title" style={{ margin: 0 }}><FiDollarSign /> Lịch sử Giao dịch</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="admin-input-wrapper" style={{ width: '250px' }}>
              <FiSearch className="admin-input-icon" style={{ left: '12px', fontSize: '1rem' }} />
              <input 
                type="text" 
                placeholder="Tìm giao dịch, email..." 
                className="admin-input" 
                style={{ padding: '8px 12px 8px 36px', fontSize: '0.9rem', borderRadius: '8px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <FiFilter style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
              <select 
                style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', color: '#1e293b', fontSize: '0.9rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Thành công</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <table className="admin-table">
            <thead>
            <tr>
              <th>Mã GD</th>
              <th>Người mua</th>
              <th>Khóa học</th>
              <th>Tổng tiền</th>
              <th>Nền tảng (30%)</th>
              <th>Giảng viên (70%)</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id}>
                <td style={{ color: '#64748b', fontWeight: 600 }}>{t.payment_method === 'vnpay' ? t.transaction_id || `#${t.id}` : `#${t.id}`}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{t.student?.full_name || t.user?.full_name || 'Không rõ'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.student?.email || t.user?.email}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
                    <FiBook color="#d4af37" /> <span style={{ fontWeight: 500 }}>{t.course?.name || 'Không rõ'}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>
                  {Number(t.amount || 0).toLocaleString()}đ
                </td>
                <td style={{ fontWeight: 700, color: t.status === 'completed' ? '#16a34a' : '#64748b' }}>
                  {t.status === 'completed' ? '+' : ''}{Number(t.platform_amount || 0).toLocaleString()}đ
                </td>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>
                  {Number(t.teacher_amount || 0).toLocaleString()}đ
                </td>
                <td>
                  <span className={`admin-badge-status ${t.status === 'completed' ? 'published' : t.status === 'failed' ? 'rejected' : 'draft'}`}>
                    {t.status === 'completed' ? 'Thành công' : t.status === 'failed' ? 'Thất bại' : 'Chờ xử lý'}
                  </span>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                    {new Date(t.created_at).toLocaleString('vi-VN')}
                  </div>
                </td>
                <td>
                  {t.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleApprove(t.id)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Duyệt
                      </button>
                      <button 
                        onClick={() => handleReject(t.id)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                  Không tìm thấy giao dịch nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default AdminFinance;
