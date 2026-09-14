import { useState, useEffect, useMemo } from 'react';
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiSearch, FiFilter, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Lỗi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xác thực thủ công cho người dùng này?')) return;
    try {
      const res = await api.put(`/admin/users/${id}/verify`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Lỗi xác thực người dùng');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone?.includes(searchTerm);
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (isLoading) {
    return <div style={{ color: '#1e293b', fontWeight: '500' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>Quản lý Người Dùng</h1>
      
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="admin-card-title" style={{ margin: 0 }}><FiUser /> Danh sách Tài khoản</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="admin-input-wrapper" style={{ width: '250px' }}>
              <FiSearch className="admin-input-icon" style={{ left: '12px', fontSize: '1rem' }} />
              <input 
                type="text" 
                placeholder="Tìm tên, email, SĐT..." 
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="student">Học viên</option>
                <option value="teacher">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td style={{ color: '#64748b' }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', overflow: 'hidden' }}>
                      {u.avatar ? <img src={u.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{u.full_name || 'Chưa cập nhật'}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                    <FiMail /> {u.email}
                  </div>
                  {u.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                      <FiPhone /> {u.phone}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`admin-badge-status ${u.role === 'admin' ? 'rejected' : u.role === 'teacher' ? 'draft' : 'published'}`}>
                    {u.role === 'admin' ? 'Quản trị viên' : u.role === 'teacher' ? 'Giảng viên' : 'Học viên'}
                  </span>
                </td>
                <td>
                  {u.is_verified ? (
                    <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <FiCheckCircle /> Đã xác thực
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>Chưa xác thực</span>
                  )}
                </td>
                <td style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {new Date(u.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  {!u.is_verified && u.role !== 'admin' && (
                    <button 
                      onClick={() => handleVerify(u.id)}
                      title="Xác thực thủ công"
                      style={{ background: 'none', border: '1px solid #16a34a', color: '#16a34a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', transition: '.2s' }}
                      onMouseEnter={(e) => { e.target.style.background = '#16a34a'; e.target.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = '#16a34a'; }}
                    >
                      <FiShield /> Xác thực
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                  Không tìm thấy người dùng nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
