import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiCommand } from 'react-icons/fi';
import { useNavigate, Navigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  // If already logged in, redirect to dashboard
  if (isAuthenticated && user) {
    const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={redirectMap[user.role] || '/student'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      toast.warning('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      let loggedInUser;
      if (isLogin) {
        loggedInUser = await login(email, password);
        toast.success('Đăng nhập thành công!');
      } else {
        loggedInUser = await register({ full_name: fullName, email, password, role });
        toast.success('Đăng ký thành công!');
      }
      
      const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(redirectMap[loggedInUser.role] || '/student');
    } catch (error) {
      toast.error(error.response?.data?.message || (isLogin ? 'Đăng nhập thất bại!' : 'Đăng ký thất bại!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT SIDE: Form */}
      <div className="auth-split__left">
        <div className="vip-auth-card">
          {/* Glow Effects */}
          <div className="vip-auth-glow vip-auth-glow--1"></div>
          <div className="vip-auth-glow vip-auth-glow--2"></div>

        <div className="vip-auth__header">
          <div className="vip-auth__logo-container">
            <img src="/logo_lms.png" alt="LMS Logo" className="vip-auth__logo-img" />
          </div>
          <h2 className="vip-auth__title">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
          <p className="vip-auth__subtitle">
            {isLogin ? 'Đăng nhập vào Hệ thống LMS' : 'Tạo tài khoản mới'}
          </p>
        </div>

        <form className="vip-auth__form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="vip-input-group">
              <FiUser className="vip-input-icon" />
              <input
                type="text"
                className="vip-input"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="vip-input-group">
            <FiMail className="vip-input-icon" />
            <input
              type="email"
              className="vip-input"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="vip-input-group">
            <FiLock className="vip-input-icon" />
            <input
              type="password"
              className="vip-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="vip-input-group">
              <select
                className="vip-input vip-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Học viên / Sinh viên</option>
                <option value="teacher">Giảng viên</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="vip-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="vip-loader"></span>
            ) : (
              isLogin ? 'Đăng nhập' : 'Đăng ký'
            )}
          </button>
        </form>

        <div className="vip-auth__footer">
          {isLogin ? (
            <p>
              Chưa có tài khoản?{' '}
              <button type="button" className="vip-link-btn" onClick={() => setIsLogin(false)}>Tạo ngay</button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{' '}
              <button type="button" className="vip-link-btn" onClick={() => setIsLogin(true)}>Đăng nhập</button>
            </p>
          )}
        </div>
      </div>
      </div>

      {/* RIGHT SIDE: Background Image */}
      <div className="auth-split__right">
        <div className="auth-split__branding">
          <h2>Hệ thống LMS</h2>
          <p>
            Nền tảng Quản lý Học liệu số hàng đầu, cung cấp kho tài liệu khổng lồ, bài giảng trực tuyến và môi trường học tập tương tác cho hàng ngàn sinh viên và giảng viên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
