import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiMonitor, FiFolder, FiCreditCard, FiSettings, FiLogOut, FiUser, FiBell, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle/ThemeToggle';
import './TeacherLayout.css';

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/portal-giang-vien', end: true, icon: <FiHome />, label: 'Tổng quan' },
    { to: '/portal-giang-vien/courses', end: false, icon: <FiMonitor />, label: 'Khóa học' },
    { to: '/portal-giang-vien/students', end: false, icon: <FiUsers />, label: 'Học viên' },
    { to: '/portal-giang-vien/materials', end: false, icon: <FiFolder />, label: 'Tài nguyên' },
    { to: '/portal-giang-vien/revenue', end: false, icon: <FiCreditCard />, label: 'Doanh thu' },
  ];

  return (
    <div className="teacher-layout">
      <nav className="teacher-navbar">
        <div className="teacher-navbar__container">
          <div className="teacher-navbar__left">
            <div className="teacher-navbar__logo" onClick={() => navigate('/portal-giang-vien')}>
              <span className="logo-text">LMS</span>
              <span className="logo-badge">Giảng viên</span>
            </div>
            
            <div className="teacher-navbar__links">
              {navLinks.map((link, idx) => (
                <NavLink
                  key={idx}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `teacher-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="teacher-navbar__right">
            <div className="teacher-navbar__actions">
              <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
                <ThemeToggle />
              </div>
              <button className="teacher-navbar__icon-btn">
                <FiBell size={20} />
                <span className="notification-dot"></span>
              </button>
            </div>
            
            <div className="teacher-user-menu" ref={userMenuRef}>
              <div 
                className="teacher-avatar-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="teacher-avatar" />
                <div className="teacher-info">
                  <span className="teacher-name">{user?.full_name || 'Giảng viên'}</span>
                </div>
              </div>

              {isUserMenuOpen && (
                <div className="teacher-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user?.full_name || 'Giảng viên'}</strong>
                    <span>{user?.email || 'teacher@example.com'}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <NavLink to="/portal-giang-vien/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <FiUser className="dropdown-icon" /> Hồ sơ giảng viên
                  </NavLink>
                  <NavLink to="/portal-giang-vien/settings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <FiSettings className="dropdown-icon" /> Cài đặt tài khoản
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <div 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    <FiLogOut className="dropdown-icon" /> Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="teacher-main-content">
        <div className="teacher-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
