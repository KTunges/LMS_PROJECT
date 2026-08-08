import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiKey, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, Navigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const { login, finalizeLogin, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI Modes
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [tempUser, setTempUser] = useState(null); // To hold user data while setting up PIN

  // PIN state
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinRefs = useRef([]);

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only take the last character typed
    setPin(newPin);
    if (value && index < 5) {
      pinRefs.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1].focus();
    }
  };

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');

  // Use a ref to block automatic redirect when the user just logged in manually
  const isRedirecting = useRef(false);

  // If already logged in AND we are not showing the loading screen, redirect to dashboard
  if (isAuthenticated && user && !isSuccessLoading && !isRedirecting.current) {
    const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={redirectMap[user.role] || '/student'} replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    isRedirecting.current = true; // Ngăn chặn <Navigate> tự động
    setLoading(true);
    try {
      const response = await login(email, password);
      // Bật màn hình loading chuyển hướng (luôn bật)
      setIsSuccessLoading(true);
      
      setTimeout(() => {
        toast.success('Đăng nhập thành công!');
        const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
        navigate(redirectMap[response.user.role] || '/student');
      }, 1500);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.warning('Vui lòng nhập email!');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(resetEmail);
      toast.success(res.data.message || 'Hướng dẫn khôi phục đã được gửi!');
      setShowForgotPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccessLoading) {
    return (
      <div className="welcome-screen">
        <div className="welcome-glow welcome-glow-1"></div>
        <div className="welcome-glow welcome-glow-2"></div>
        <div className="welcome-content">
          <div className="welcome-spinner-container">
            <div className="welcome-spinner-outer"></div>
            <div className="welcome-spinner-inner"></div>
            <div className="welcome-logo-text">LMS</div>
          </div>
          <h2 className="welcome-title">Chào mừng trở lại!</h2>
          <p className="welcome-subtitle">Hệ thống Quản lý Học liệu số đang chuẩn bị không gian học tập cho bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-split-layout">
      {/* LEFT SIDE: Form */}
      <div className="auth-split__left">
        <div className="vip-auth-card">
          {/* Glow Effects */}
          <div className="vip-auth-glow vip-auth-glow--1"></div>
          <div className="vip-auth-glow vip-auth-glow--2"></div>

          <div className="vip-auth__header">
            <div className="vip-auth__text-logo">
              <span className="logo-letter-l">L</span>
              <span className="logo-letter-ms">MS</span>
            </div>
            
            {showForgotPassword ? (
              <>
                <h2 className="vip-auth__title">Quên mật khẩu</h2>
                <p className="vip-auth__subtitle">
                  Nhập email của bạn để nhận hướng dẫn khôi phục
                </p>
              </>
            ) : (
              <>
                <h2 className="vip-auth__title">Chào mừng bạn đã quay lại!</h2>
                <p className="vip-auth__subtitle">
                  Đăng nhập vào Hệ thống LMS
                </p>
              </>
            )}
          </div>

          {showForgotPassword ? (
            /* --- FORGOT PASSWORD FORM --- */
            <form className="vip-auth__form" onSubmit={handleForgotSubmit}>
              <div className="vip-input-group">
                <FiMail className="vip-input-icon" />
                <input
                  type="email"
                  className="vip-input"
                  placeholder="Email của bạn"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Gửi yêu cầu'}
              </button>

              <div className="vip-auth__footer">
                <button 
                  type="button" 
                  className="vip-link-btn" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}
                  onClick={() => setShowForgotPassword(false)}
                >
                  <FiArrowLeft /> Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : (
            /* --- LOGIN FORM --- */
            <form className="vip-auth__form" onSubmit={handleLoginSubmit}>
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

              <div style={{ textAlign: 'right' }}>
                <button type="button" className="vip-link-btn" style={{ fontSize: '13px' }} onClick={() => setShowForgotPassword(true)}>
                  Quên mật khẩu?
                </button>
              </div>

              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Đăng nhập'}
              </button>
            </form>
          )}

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
