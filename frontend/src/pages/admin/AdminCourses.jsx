import { useState, useEffect, useMemo } from 'react';
import { FiCheck, FiX, FiEye, FiSearch, FiFilter, FiBookOpen } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      toast.error('Lỗi tải danh sách khóa học');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Bạn chắc chắn muốn ${status === 'published' ? 'duyệt' : 'từ chối'} khóa học này?`)) return;
    
    try {
      const res = await api.put(`/admin/courses/${id}/status`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCourses(); // Refresh list
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.teacher?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  if (isLoading) {
    return <div style={{ color: '#1e293b', fontWeight: '500' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>Quản lý Khóa học</h1>
      
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="admin-card-title" style={{ margin: 0 }}><FiBookOpen /> Danh sách Khóa học</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="admin-input-wrapper" style={{ width: '250px' }}>
              <FiSearch className="admin-input-icon" style={{ left: '12px', fontSize: '1rem' }} />
              <input 
                type="text" 
                placeholder="Tìm tên KH, giảng viên..." 
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
                <option value="published">Đã duyệt</option>
                <option value="draft">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên khóa học</th>
              <th>Giảng viên</th>
              <th>Giá (VNĐ)</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.id}>
                <td style={{ color: '#64748b' }}>#{course.id}</td>
                <td style={{ fontWeight: 600 }}>{course.name}</td>
                <td>
                  <div>{course.teacher?.full_name || 'Không rõ'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{course.teacher?.email}</div>
                </td>
                <td>{Number(course.price || 0).toLocaleString()}đ</td>
                <td>
                  <span className={`admin-badge-status ${course.status}`}>
                    {course.status === 'published' ? 'Đã duyệt' : course.status === 'rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {course.status === 'draft' && (
                      <>
                        <button className="admin-action-btn approve" onClick={() => handleUpdateStatus(course.id, 'published')} title="Duyệt">
                          <FiCheck />
                        </button>
                        <button className="admin-action-btn reject" onClick={() => handleUpdateStatus(course.id, 'rejected')} title="Từ chối">
                          <FiX />
                        </button>
                      </>
                    )}
                    {course.status === 'published' && (
                      <button className="admin-action-btn reject" onClick={() => handleUpdateStatus(course.id, 'draft')} title="Hạ xuống nháp">
                        <FiX />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                  Không tìm thấy khóa học nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
