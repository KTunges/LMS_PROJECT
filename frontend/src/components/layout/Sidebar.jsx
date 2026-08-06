import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiBook,
  FiFolder,
  FiUsers,
  FiUpload,
  FiDownload,
  FiSettings,
  FiBookOpen,
  FiChevronRight,
  FiChevronDown,
  FiHash,
  FiUser,
  FiAward,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiTarget,
  FiLogOut
} from 'react-icons/fi';

// Dummy category data for the tree
const dummyCategories = [
  {
    id: 1,
    name: 'Công nghệ thông tin',
    children: [
      { id: 11, name: 'Lập trình Web' },
      { id: 12, name: 'Trí tuệ nhân tạo' },
      { id: 13, name: 'Cơ sở dữ liệu' },
    ],
  },
  {
    id: 2,
    name: 'Kinh tế & Quản trị',
    children: [
      { id: 21, name: 'Marketing' },
      { id: 22, name: 'Kế toán - Kiểm toán' },
    ],
  },
  {
    id: 3,
    name: 'Ngoại ngữ',
    children: [
      { id: 31, name: 'Tiếng Anh' },
      { id: 32, name: 'Tiếng Nhật' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const adminMenu = [
    { to: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/materials', icon: <FiBook />, label: 'Quản lý Học liệu' },
    { to: '/admin/categories', icon: <FiFolder />, label: 'Danh mục' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Người dùng' },
    { to: '/admin/settings', icon: <FiSettings />, label: 'Cài đặt' },
  ];

  const teacherMenu = [
    { to: '/teacher', icon: <FiHome />, label: 'Dashboard' },
    { to: '/teacher/materials', icon: <FiBook />, label: 'Học liệu của tôi' },
    { to: '/teacher/upload', icon: <FiUpload />, label: 'Tải lên học liệu' },
  ];

  const studentMenu = [
    { to: '/student', icon: <FiHome />, label: 'Tổng quan' },
    { to: '/student/profile', icon: <FiUser />, label: 'Hồ sơ sinh viên' },
    { to: '/student/registration', icon: <FiBookOpen />, label: 'Đăng ký môn học' },
    { to: '/student/results', icon: <FiAward />, label: 'Kết quả học tập' },
    { to: '/student/schedule', icon: <FiCalendar />, label: 'Thời khóa biểu' },
    { to: '/student/tuition', icon: <FiCreditCard />, label: 'Học phí & Thanh toán' },
    { to: '/student/transcript', icon: <FiFileText />, label: 'Bảng điểm' },
    { to: '/student/thesis', icon: <FiTarget />, label: 'Đồ án & Khóa luận' },
    { to: '/student/graduation', icon: <FiAward />, label: 'Dịch vụ Tốt nghiệp' },
  ];

  const getMenu = () => {
    switch (user?.role) {
      case 'admin': return adminMenu;
      case 'teacher': return teacherMenu;
      case 'student': return studentMenu;
      default: return studentMenu; // Default menu for guests/students
    }
  };

  const menu = getMenu();

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-content">
            <span className="sidebar__logo-text">LMS</span>
            <span className="sidebar__logo-subtitle">Hệ thống Quản lý Học liệu số</span>
          </div>
        </div>

        <div className="sidebar__content">
          {/* Main Navigation */}
          <nav className="sidebar__nav">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split('/').length <= 2}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={onClose}
              >
                <span className="sidebar__link-icon">{item.icon}</span>
                <span className="sidebar__link-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Category Tree */}
          <div className="sidebar__categories">
            <div className="sidebar__section-title">DANH MỤC HỌC LIỆU</div>
            <div className="sidebar__tree">
              {dummyCategories.map((category) => {
                const isExpanded = expandedCategories[category.id];
                return (
                  <div key={category.id} className="sidebar__tree-item">
                    <button
                      className="sidebar__tree-parent"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="sidebar__tree-arrow">
                        {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                      </span>
                      <span className="sidebar__tree-label">{category.name}</span>
                    </button>
                    
                    {/* Children Container */}
                    <div className={`sidebar__tree-children ${isExpanded ? 'sidebar__tree-children--open' : ''}`}>
                      {category.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={`/category/${child.id}`}
                          className={({ isActive }) =>
                            `sidebar__tree-child ${isActive ? 'sidebar__tree-child--active' : ''}`
                          }
                          onClick={onClose}
                        >
                          <FiHash size={12} className="sidebar__tree-child-icon" />
                          <span className="sidebar__tree-child-label">{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sidebar__user-profile">
          {user ? (
            <>
              <div className="sidebar__user-avatar">
                {/* Fallback avatar image */}
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
              </div>
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">{user.full_name || 'Người dùng'}</span>
                <span className="sidebar__user-email">{user.email || 'student@uni.edu.vn'}</span>
              </div>
              <button className="sidebar__user-logout" onClick={handleLogout} title="Đăng xuất">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 9 12 5 16 9"></polyline>
                  <polyline points="8 15 12 19 16 15"></polyline>
                </svg>
              </button>
            </>
          ) : (
            <div className="sidebar__version">v1.0.0</div>
          )}
        </div>
      </aside>

      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
