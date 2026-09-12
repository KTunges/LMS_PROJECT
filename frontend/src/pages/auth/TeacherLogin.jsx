import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './TeacherLogin.css';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    setLoading(true);
    try {
      const response = await login(email, password);
      
      // Strict role check for teacher portal
      if (response.user.role !== 'teacher' && response.user.role !== 'admin') {
        await logout(); // Force logout if they are a student
        toast.error('Truy cập bị từ chối! Tài khoản không có quyền Giảng viên.');
        setLoading(false);
        return;
      }

      toast.success('Đăng nhập Giảng viên thành công!');
      setTimeout(() => {
        navigate('/portal-giang-vien');
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Sai email hoặc mật khẩu.');
      setLoading(false);
    }
  };

  return (
    <div className="teacher-login-container">
      <div className="teacher-login-left">
        <div className="teacher-login-content">
          <div className="teacher-brand">
            <div className="teacher-logo-box">
              <FiBriefcase size={28} color="#fff" />
            </div>
            <span className="teacher-brand-name">LMS Instructor</span>
          </div>
          
          <h1 className="teacher-login-title">Chào mừng Giảng viên</h1>
          <p className="teacher-login-subtitle">
            Đăng nhập để quản lý khóa học, theo dõi doanh thu và tương tác với học viên của bạn.
          </p>

          <form onSubmit={handleLogin} className="teacher-login-form">
            <div className="teacher-input-group">
              <label>Email làm việc</label>
              <div className="teacher-input-wrapper">
                <FiMail className="teacher-input-icon" />
                <input 
                  type="email" 
                  placeholder="teacher@lms.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="teacher-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Mật khẩu</label>
                <span className="teacher-forgot-pw">Quên mật khẩu?</span>
              </div>
              <div className="teacher-input-wrapper">
                <FiLock className="teacher-input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="teacher-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-small"></span>
              ) : (
                <>
                  Đăng nhập <FiLogIn />
                </>
              )}
            </button>
          </form>

          <div className="teacher-login-footer">
            Bạn chưa có tài khoản Giảng viên? <a href="#">Đăng ký trở thành Đối tác</a>
          </div>
        </div>
      </div>
      
      <div className="teacher-login-right">
        <div className="teacher-login-overlay">
          <h2 style={{ color: '#60a5fa' }}>Chia sẻ kiến thức,</h2>
          <h2 style={{ color: '#60a5fa' }}>Tạo ra giá trị.</h2>
          <p>Hàng ngàn học viên đang chờ đợi các khóa học chất lượng từ bạn.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
