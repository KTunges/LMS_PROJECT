import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { authService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // login from useAuth already calls authService and sets state/localStorage
      const { user } = await login(formData.email, formData.password);
      
      if (user.role !== 'admin') {
        toast.error('Bạn không có quyền truy cập trang này');
        // Because login already set localStorage, we need to clear it if they aren't admin
        logout(); 
        return;
      }
      
      toast.success('Đăng nhập Admin thành công');
      navigate('/portal-super-admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Animated Glowing Orbs Background */}
      <div className="admin-login-bg-shapes">
        <div className="admin-login-shape admin-login-shape-1"></div>
        <div className="admin-login-shape admin-login-shape-2"></div>
        <div className="admin-login-shape admin-login-shape-3"></div>
      </div>

      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <FiLock size={28} />
          </div>
          <h2 className="admin-login-title">Super Admin</h2>
          <p className="admin-login-subtitle">Hệ thống quản trị tối cao LMS</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Admin</label>
            <div className="admin-input-wrapper">
              <FiMail className="admin-input-icon" />
              <input
                type="email"
                name="email"
                className="admin-input"
                placeholder="admin@lms.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Mật khẩu</label>
            <div className="admin-input-wrapper">
              <FiLock className="admin-input-icon" />
              <input
                type="password"
                name="password"
                className="admin-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}
          </button>
        </form>

        <div className="admin-login-footer">
          &copy; 2026 Hệ thống LMS. Bảo mật nội bộ.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
