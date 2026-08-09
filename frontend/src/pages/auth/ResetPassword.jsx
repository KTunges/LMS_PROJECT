import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services';
import { FiLock } from 'react-icons/fi';
import './AuthPage.css'; // Reuse AuthPage styles

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.warning('Vui lòng nhập đầy đủ mật khẩu mới!');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(token, newPassword);
      toast.success(res.data.message || 'Khôi phục mật khẩu thành công!');
      setTimeout(() => navigate('/'), 1500); // Back to login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, token có thể đã hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT SIDE: Form */}
      <div className="auth-split__left">
        <div className="vip-auth-card">
          <div className="vip-auth-glow vip-auth-glow--1"></div>
          <div className="vip-auth-glow vip-auth-glow--2"></div>

          <div className="vip-auth__header">
            <div className="vip-auth__text-logo">
              <span className="logo-letter-l">L</span>
              <span className="logo-letter-ms">MS</span>
            </div>
            
            <h2 className="vip-auth__title">Tạo Mật khẩu mới</h2>
            <p className="vip-auth__subtitle">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <form className="vip-auth__form" onSubmit={handleSubmit}>
            <div className="vip-input-group">
              <FiLock className="vip-input-icon" />
              <input
                type="password"
                className="vip-input"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="vip-input-group">
              <FiLock className="vip-input-icon" />
              <input
                type="password"
                className="vip-input"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="vip-submit-btn" disabled={loading}>
              {loading ? <span className="vip-loader"></span> : 'Xác nhận'}
            </button>
          </form>
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

export default ResetPassword;
