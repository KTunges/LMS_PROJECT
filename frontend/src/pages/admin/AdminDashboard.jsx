import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiDollarSign, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingCourses: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        toast.error('Lỗi tải dữ liệu dashboard admin');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div style={{ color: '#1e293b', fontWeight: '500' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>Tổng quan hệ thống</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>Tổng Doanh Thu</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiDollarSign /> {stats.totalRevenue.toLocaleString()}đ
          </div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>Tổng Học Viên</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUsers /> {stats.totalStudents.toLocaleString()}
          </div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>Giảng Viên</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiActivity /> {stats.totalTeachers.toLocaleString()}
          </div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>Tổng Khóa Học</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBook /> {stats.totalCourses.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="admin-card-title" style={{ alignSelf: 'flex-start' }}><FiUsers /> Tỷ lệ Người Dùng</h2>
          <PieChart width={250} height={250}>
            <Pie
              data={[
                { name: 'Học viên', value: stats.totalStudents },
                { name: 'Giảng viên', value: stats.totalTeachers }
              ]}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="#0ea5e9" />
              <Cell fill="#8b5cf6" />
            </Pie>
            <Tooltip />
          </PieChart>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0ea5e9' }}></span> Học viên</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }}></span> Giảng viên</div>
          </div>
        </div>
        
        <div className="admin-card" style={{ height: '100%' }}>
          <h2 className="admin-card-title"><FiActivity /> Hoạt động gần đây</h2>
          <div style={{ color: '#64748b', fontStyle: 'italic', padding: '20px' }}>Đang thu thập dữ liệu hành vi người dùng (Coming soon)...</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title"><FiBook /> Khóa học đang chờ duyệt</h2>
        {stats.pendingCourses.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khóa học</th>
                <th>Giảng viên</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.pendingCourses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 600 }}>{course.name}</td>
                  <td>{course.teacher?.full_name || 'Không rõ'}</td>
                  <td>{new Date(course.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><span className="admin-badge-status draft">Chờ duyệt</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
            Không có khóa học nào đang chờ duyệt.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
