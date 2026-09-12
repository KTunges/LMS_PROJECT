import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowLeft, FiUser } from 'react-icons/fi';
import { useNavigate, Navigate } from 'react-router-dom';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';
import './AuthPage.css';
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;



const AuthPage = () => {
  const { login, register, verifyOtp, completeRegistration, googleLogin, facebookLogin, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const navigate = useNavigate();

  // Mode: 'login', 'register', 'forgot', 'otp'
  const [mode, setMode] = useState('login');

  // Login/Register Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // OTP State
  const [otp, setOtp] = useState('');

  // Use a ref to block automatic redirect when the user just logged in manually
  const isRedirecting = useRef(false);

  // If already logged in AND we are not showing the loading screen, redirect to dashboard
  if (isAuthenticated && user && !isSuccessLoading && !isRedirecting.current) {
    const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={redirectMap[user.role] || '/student'} replace />;
  }

  const triggerSuccessScreen = (role) => {
    isRedirecting.current = true;
    setIsSuccessLoading(true);
    setTimeout(() => {
      const redirectMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(redirectMap[role] || '/student');
    }, 1500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const response = await login(email, password);
      toast.success('Đăng nhập thành công!');
      triggerSuccessScreen(response.user.role);
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.message.includes('OTP')) {
        toast.warning(error.response.data.message);
        setMode('otp');
      } else {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập email!');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({ email });
      toast.success(res.data.message || 'Vui lòng kiểm tra email để lấy mã OTP.');
      setMode('otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gửi OTP thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.warning('Mã OTP phải gồm 6 chữ số!');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success('Xác thực email thành công!');
      setMode('register-details');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xác thực OTP thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !password) {
      toast.warning('Vui lòng điền họ tên và mật khẩu!');
      return;
    }
    if (password.length < 6) {
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    try {
      const response = await completeRegistration(email, fullName, password);
      toast.success('Đăng ký hoàn tất!');
      triggerSuccessScreen(response.user.role);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập email!');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.data.message || 'Hướng dẫn khôi phục đã được gửi!');
      setMode('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await googleLogin(tokenResponse.access_token);
        toast.success('Đăng nhập Google thành công!');
        triggerSuccessScreen(response.user.role);
      } catch (error) {
        console.error(error);
        toast.error('Đăng nhập Google thất bại!');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await googleLogin(credentialResponse.credential);
      toast.success('Đăng nhập Google thành công!');
      triggerSuccessScreen(response.user.role);
    } catch (error) {
      toast.error('Đăng nhập Google thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookCallback = async (response) => {
    if (response?.accessToken) {
      setLoading(true);
      try {
        const res = await facebookLogin(response.accessToken);
        toast.success('Đăng nhập Facebook thành công!');
        triggerSuccessScreen(res.user.role);
      } catch (error) {
        toast.error('Đăng nhập Facebook thất bại!');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Đăng nhập Facebook thất bại!');
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
          <div className="vip-auth-glow vip-auth-glow--1"></div>
          <div className="vip-auth-glow vip-auth-glow--2"></div>

          <div key={mode} className={mode === 'register' ? 'slide-in-right' : 'slide-in-left'}>
            <div className="vip-auth__header">
              <div className="vip-auth__text-logo">
                <span className="logo-letter-l">L</span>
                <span className="logo-letter-ms">MS</span>
              </div>

            {mode === 'forgot' && (
              <>
                <h2 className="vip-auth__title">Quên mật khẩu</h2>
                <p className="vip-auth__subtitle">Nhập email của bạn để nhận hướng dẫn</p>
              </>
            )}
            {mode === 'otp' && (
              <>
                <h2 className="vip-auth__title">Xác thực Email</h2>
                <p className="vip-auth__subtitle">Nhập mã OTP gồm 6 chữ số đã gửi đến {email}</p>
              </>
            )}
            {mode === 'login' && (
              <>
                <h2 className="vip-auth__title">Chào mừng bạn đã quay lại!</h2>
                <p className="vip-auth__subtitle">Đăng nhập vào Hệ thống LMS</p>
              </>
            )}
            {mode === 'register' && (
              <>
                <h2 className="vip-auth__title">Tạo tài khoản mới</h2>
                <p className="vip-auth__subtitle">Đăng ký để tham gia Hệ thống LMS</p>
              </>
            )}
            {mode === 'register-details' && (
              <>
                <h2 className="vip-auth__title">Hoàn tất thông tin</h2>
                <p className="vip-auth__subtitle">Điền họ tên và mật khẩu cho tài khoản {email}</p>
              </>
            )}
          </div>

          {/* OAUTH BUTTONS */}
          {(mode === 'login' || mode === 'register') && (
            <div className="oauth-buttons">
              <div className="oauth-btn-wrapper">
                <button
                  type="button"
                  className="oauth-btn"
                  onClick={() => gLogin()}
                  disabled={loading}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                  <span style={{ flex: 1, textAlign: 'center' }}>Đăng nhập Google</span>
                </button>
              </div>

              <div className="oauth-btn-wrapper">
                <FacebookLogin
                  appId={import.meta.env.VITE_FACEBOOK_APP_ID || 'mock-facebook-app-id'}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookCallback}
                  render={renderProps => (
                    <button type="button" className="oauth-btn" onClick={renderProps.onClick} disabled={loading}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" alt="Facebook" width="20" />
                      <span style={{ flex: 1, textAlign: 'center' }}>Đăng nhập Facebook</span>
                    </button>
                  )}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="auth-divider">
              <span>hoặc</span>
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form className="vip-auth__form" onSubmit={handleForgotSubmit}>
              <div className="vip-input-group">
                <FiMail className="vip-input-icon" />
                <input type="email" className="vip-input" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Gửi yêu cầu'}
              </button>
              <div className="vip-auth__footer">
                <button type="button" className="vip-link-btn" onClick={() => setMode('login')}>
                  <FiArrowLeft /> Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* OTP FORM */}
          {mode === 'otp' && (
            <form className="vip-auth__form" onSubmit={handleOtpSubmit}>
              <div className="vip-input-group">
                <FiLock className="vip-input-icon" />
                <input type="text" className="vip-input" placeholder="Mã OTP 6 số" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Xác thực'}
              </button>
              <div className="vip-auth__footer">
                <button type="button" className="vip-link-btn" onClick={() => setMode('login')}>
                  <FiArrowLeft /> Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form className="vip-auth__form" onSubmit={handleLoginSubmit}>
              <div className="vip-input-group">
                <FiMail className="vip-input-icon" />
                <input type="email" className="vip-input" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="vip-input-group">
                <FiLock className="vip-input-icon" />
                <input type="password" className="vip-input" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="button" className="vip-link-btn" style={{ fontSize: '13px' }} onClick={() => setMode('forgot')}>
                  Quên mật khẩu?
                </button>
              </div>
              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Đăng nhập'}
              </button>
              <div className="vip-auth__footer" style={{ marginTop: '16px' }}>
                Chưa có tài khoản?{' '}
                <button type="button" className="vip-link-btn" onClick={() => setMode('register')}>
                  Đăng ký ngay
                </button>
              </div>
            </form>
          )}

          {/* REGISTER STEP 1 FORM (Email Only) */}
          {mode === 'register' && (
            <form className="vip-auth__form" onSubmit={handleRegisterSubmit}>
              <div className="vip-input-group">
                <FiMail className="vip-input-icon" />
                <input type="email" className="vip-input" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Gửi mã xác nhận'}
              </button>
              <div className="vip-auth__footer" style={{ marginTop: '16px' }}>
                Đã có tài khoản?{' '}
                <button type="button" className="vip-link-btn" onClick={() => setMode('login')}>
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* REGISTER STEP 3 FORM (Details) */}
          {mode === 'register-details' && (
            <form className="vip-auth__form" onSubmit={handleRegisterDetailsSubmit}>
              <div className="vip-input-group">
                <FiUser className="vip-input-icon" />
                <input type="text" className="vip-input" placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="vip-input-group">
                <FiLock className="vip-input-icon" />
                <input type="password" className="vip-input" placeholder="Mật khẩu (ít nhất 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="vip-submit-btn" disabled={loading}>
                {loading ? <span className="vip-loader"></span> : 'Hoàn tất đăng ký'}
              </button>
            </form>
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
