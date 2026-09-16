import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LandingPage.css';

const stats = [
  { label: 'Khóa học', value: 150, suffix: '+' },
  { label: 'Giảng viên', value: 30, suffix: '+' },
  { label: 'Sinh viên', value: 2000, suffix: '+' },
  { label: 'Chứng chỉ cấp', value: 500, suffix: '+' },
];

const features = [
  {
    icon: '🎬',
    title: 'Video bài giảng chất lượng cao',
    desc: 'Xem video mượt mà qua CDN Cloudinary, ghi nhận tiến trình tự động.',
  },
  {
    icon: '📝',
    title: 'Kiểm tra trắc nghiệm thông minh',
    desc: 'Hệ thống Quiz tự chấm điểm, phản hồi kết quả ngay lập tức.',
  },
  {
    icon: '🎥',
    title: 'Lớp học trực tuyến (Live)',
    desc: 'Giảng viên mở phòng Live, chia sẻ màn hình, chat thời gian thực qua WebRTC.',
  },
  {
    icon: '💳',
    title: 'Thanh toán an toàn',
    desc: 'Hỗ trợ MoMo, thẻ ATM nội địa với mã hóa HMAC SHA256.',
  },
  {
    icon: '🏆',
    title: 'Gamification & Thành tựu',
    desc: 'Tích XP, lên cấp, nhận huy hiệu và chứng chỉ hoàn thành khóa học.',
  },
  {
    icon: '🌙',
    title: 'Giao diện hiện đại',
    desc: 'Hỗ trợ Dark/Light Mode, thiết kế responsive trên mọi thiết bị.',
  },
];

const testimonials = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Sinh viên CNTT',
    avatar: '👨‍🎓',
    text: 'Giao diện rất đẹp và dễ sử dụng. Tính năng Live Classroom giúp mình tương tác trực tiếp với thầy cô rất tiện.',
  },
  {
    name: 'Trần Thị Hương',
    role: 'Giảng viên',
    avatar: '👩‍🏫',
    text: 'Quản lý khóa học và theo dõi doanh thu rất trực quan. Upload bài giảng lên Cloudinary cực nhanh.',
  },
  {
    name: 'Lê Hoàng Phúc',
    role: 'Sinh viên Kinh tế',
    avatar: '👨‍💼',
    text: 'Thanh toán qua MoMo siêu tiện, mua xong là vào học được ngay. Hệ thống huy hiệu tạo động lực học tập.',
  },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="landing-stat-value">
      {count.toLocaleString('vi-VN')}{suffix}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <span className="landing-logo-icon">📚</span>
            <span className="landing-logo-text">LMS Education</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Tính năng</a>
            <a href="#stats">Thống kê</a>
            <a href="#testimonials">Đánh giá</a>
            <Link to="/login" className="landing-btn-outline">Đăng nhập</Link>
            <Link to="/login" className="landing-btn-primary">Đăng ký miễn phí</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Nền tảng Học liệu số
            <span className="landing-hero-highlight"> thế hệ mới</span>
          </h1>
          <p className="landing-hero-subtitle">
            Học mọi lúc, mọi nơi với hàng trăm khóa học chất lượng cao. 
            Tương tác trực tiếp với giảng viên qua lớp học Live, 
            thanh toán tiện lợi và nhận chứng chỉ hoàn thành.
          </p>
          <div className="landing-hero-actions">
            <Link to="/login" className="landing-btn-hero">
              🚀 Bắt đầu học ngay
            </Link>
            <a href="#features" className="landing-btn-ghost">
              Tìm hiểu thêm ↓
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="landing-stats" id="stats">
        {stats.map((s, i) => (
          <div className="landing-stat-item" key={i}>
            <AnimatedCounter target={s.value} suffix={s.suffix} />
            <span className="landing-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="landing-features" id="features">
        <h2 className="landing-section-title">Tính năng nổi bật</h2>
        <p className="landing-section-subtitle">
          Mọi thứ bạn cần để học tập hiệu quả, tất cả trong một nền tảng duy nhất.
        </p>
        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div className="landing-feature-card" key={i}>
              <div className="landing-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="landing-testimonials" id="testimonials">
        <h2 className="landing-section-title">Học viên nói gì?</h2>
        <div className="landing-testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="landing-testimonial-card" key={i}>
              <p className="landing-testimonial-text">"{t.text}"</p>
              <div className="landing-testimonial-author">
                <span className="landing-testimonial-avatar">{t.avatar}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Sẵn sàng bắt đầu hành trình học tập?</h2>
        <p>Đăng ký miễn phí ngay hôm nay và khám phá hàng trăm khóa học chất lượng.</p>
        <Link to="/login" className="landing-btn-hero">
          ✨ Tạo tài khoản miễn phí
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-col">
            <h4>📚 LMS Education</h4>
            <p>Hệ thống Quản lý Học liệu số được phát triển bởi Nhóm 11 — Đồ án tốt nghiệp ngành Công nghệ Thông tin.</p>
          </div>
          <div className="landing-footer-col">
            <h4>Liên kết</h4>
            <a href="#features">Tính năng</a>
            <a href="#stats">Thống kê</a>
            <a href="#testimonials">Đánh giá</a>
          </div>
          <div className="landing-footer-col">
            <h4>Công nghệ</h4>
            <span>ReactJS • Node.js • PostgreSQL</span>
            <span>ZegoCloud • Cloudinary • MoMo</span>
          </div>
        </div>
        <div className="landing-footer-bottom">
          © 2026 LMS Education — Nhóm 11. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
