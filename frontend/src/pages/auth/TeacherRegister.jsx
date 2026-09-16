import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiPhone, 
  FiAward, 
  FiCheckCircle, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiBriefcase,
  FiTrendingUp,
  FiUsers,
  FiCpu
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './TeacherRegister.css';

const SPECIALTIES = [
  'Công nghệ thông tin & Lập trình',
  'Khoa học Dữ liệu & Trí tuệ nhân tạo (AI)',
  'Thiết kế Đồ họa & UI/UX',
  'Kinh doanh & Marketing',
  'Ngoại ngữ (Tiếng Anh, Nhật, Hàn...)',
  'Tài chính & Đầu tư',
  'Kỹ năng mềm & Phát triển bản thân',
  'Chuyên ngành khác',
];

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: SPECIALTIES[0],
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { registerTeacher } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, phone, specialty, password, confirmPassword, agreeTerms } = formData;

    if (!fullName.trim() || !email.trim() || !password) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    if (!agreeTerms) {
      toast.warning('Vui lòng đồng ý với Điều khoản và Tiêu chuẩn chất lượng Giảng viên!');
      return;
    }

    if (password.length < 6) {
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await registerTeacher({
        full_name: fullName,
        email,
        phone,
        specialty,
        password,
      });

      toast.success('🎉 Chúc mừng bạn đã trở thành Đối tác Giảng viên LMS!');
      setTimeout(() => {
        navigate('/portal-giang-vien');
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-reg-container">
      <div className="teacher-reg-left">
        <div className="teacher-reg-content">
          <div className="teacher-reg-brand">
            <div className="teacher-reg-logo-box">
              <FiBriefcase size={26} color="#fff" />
            </div>
            <div>
              <span className="teacher-reg-brand-name">LMS Instructor</span>
              <span className="teacher-reg-badge">Đối tác Giảng viên</span>
            </div>
          </div>

          <h1 className="teacher-reg-title">Đăng ký Đối tác Giảng viên</h1>
          <p className="teacher-reg-subtitle">
            Bắt đầu chia sẻ kiến thức, mở rộng thương hiệu cá nhân và tạo thu nhập bền vững cùng hệ sinh thái LMS.
          </p>

          <form onSubmit={handleRegister} className="teacher-reg-form">
            {/* Họ và tên */}
            <div className="teacher-reg-group">
              <label>Họ và tên Giảng viên / Chuyên gia <span className="req-star">*</span></label>
              <div className="teacher-reg-input-wrapper">
                <FiUser className="teacher-reg-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Ví dụ: TS. Nguyễn Văn A hoặc Master Hoàng Yến"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email và Số điện thoại */}
            <div className="teacher-reg-row">
              <div className="teacher-reg-group">
                <label>Email làm việc / Giảng dạy <span className="req-star">*</span></label>
                <div className="teacher-reg-input-wrapper">
                  <FiMail className="teacher-reg-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="giangvien@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="teacher-reg-group">
                <label>Số điện thoại liên hệ</label>
                <div className="teacher-reg-input-wrapper">
                  <FiPhone className="teacher-reg-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Lĩnh vực chuyên môn */}
            <div className="teacher-reg-group">
              <label>Lĩnh vực chuyên môn chính <span className="req-star">*</span></label>
              <div className="teacher-reg-input-wrapper">
                <FiAward className="teacher-reg-icon" />
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="teacher-reg-select"
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mật khẩu và Xác nhận mật khẩu */}
            <div className="teacher-reg-row">
              <div className="teacher-reg-group">
                <label>Mật khẩu <span className="req-star">*</span></label>
                <div className="teacher-reg-input-wrapper">
                  <FiLock className="teacher-reg-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="teacher-reg-group">
                <label>Xác nhận mật khẩu <span className="req-star">*</span></label>
                <div className="teacher-reg-input-wrapper">
                  <FiCheckCircle className="teacher-reg-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Điều khoản */}
            <div className="teacher-reg-terms">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="terms-text">
                  Tôi đồng ý với <a href="#terms" onClick={(e) => e.preventDefault()}>Quy chế Giảng viên</a> và <a href="#privacy" onClick={(e) => e.preventDefault()}>Tiêu chuẩn chất lượng nội dung LMS</a>.
                </span>
              </label>
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              className="teacher-reg-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="teacher-reg-spinner"></span>
              ) : (
                <>
                  Hoàn tất Đăng ký Giảng viên <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer chuyển sang đăng nhập */}
          <div className="teacher-reg-footer">
            Bạn đã có tài khoản Giảng viên?{' '}
            <Link to="/portal-giang-vien/login" className="login-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Cột phải - Giá trị đối tác & Banner */}
      <div className="teacher-reg-right">
        <div className="teacher-reg-overlay">
          <div className="hero-badge">CƠ HỘI ĐỐI TÁC 2026</div>
          <h2 className="hero-title">Đồng hành phát triển giáo dục số tương lai</h2>
          <p className="hero-desc">
            Trở thành Giảng viên Đối tác để tiếp cận hàng triệu học viên, tối ưu hóa quá trình giảng dạy với trợ lý AI và nhận mức doanh thu xứng đáng.
          </p>

          <div className="benefit-cards-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper income">
                <FiTrendingUp size={22} />
              </div>
              <div className="benefit-info">
                <h4>Chia sẻ doanh thu 70%</h4>
                <p>Mức hoa hồng đối tác minh bạch, thanh toán tự động định kỳ hàng tháng.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper audience">
                <FiUsers size={22} />
              </div>
              <div className="benefit-info">
                <h4>Hơn 10.000+ Học viên</h4>
                <p>Khóa học của bạn được quảng bá đa kênh và hiển thị nổi bật trên toàn hệ thống.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper ai">
                <FiCpu size={22} />
              </div>
              <div className="benefit-info">
                <h4>Trợ lý AI Độc quyền</h4>
                <p>Tự động tạo bộ câu hỏi trắc nghiệm, tóm tắt bài giảng và Chatbot trợ giảng 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
