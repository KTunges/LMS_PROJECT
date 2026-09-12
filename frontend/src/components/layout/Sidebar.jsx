import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  FiLogOut,
  FiMonitor,
  FiCheckSquare,
  FiGlobe,
  FiMessageCircle
} from 'react-icons/fi';

// Danh mục học liệu đa dạng và chi tiết cho hệ thống LMS E-Learning
const dummyCategories = [
  {
    id: 1,
    name: 'Công nghệ thông tin & Lập trình',
    icon: '💻',
    children: [
      { id: 11, name: 'Lập trình Web' },
      { id: 12, name: 'Lập trình Di động' },
      { id: 13, name: 'Trí tuệ nhân tạo (AI)' },
      { id: 14, name: 'Khoa học dữ liệu' },
      { id: 15, name: 'Điện toán đám mây & DevOps' },
      { id: 16, name: 'An toàn thông tin' },
    ],
  },
  {
    id: 2,
    name: 'Kinh tế, Tài chính & QTKD',
    icon: '💼',
    children: [
      { id: 21, name: 'Digital Marketing' },
      { id: 22, name: 'Tài chính & Đầu tư' },
      { id: 23, name: 'Kế toán - Kiểm toán' },
      { id: 24, name: 'Quản trị kinh doanh' },
      { id: 25, name: 'Quản trị dự án (Agile)' },
    ],
  },
  {
    id: 3,
    name: 'Ngoại ngữ & Chứng chỉ',
    icon: '🌐',
    children: [
      { id: 31, name: 'Luyện thi IELTS' },
      { id: 32, name: 'Luyện thi TOEIC' },
      { id: 33, name: 'Tiếng Anh giao tiếp' },
      { id: 34, name: 'Tiếng Nhật (JLPT)' },
      { id: 35, name: 'Tiếng Trung (HSK)' },
      { id: 36, name: 'Tiếng Hàn (TOPIK)' },
    ],
  },
  {
    id: 4,
    name: 'Thiết kế sáng tạo & Multimedia',
    icon: '🎨',
    children: [
      { id: 41, name: 'Thiết kế UI/UX (Figma)' },
      { id: 42, name: 'Đồ họa & Thương hiệu' },
      { id: 43, name: 'Biên tập Video & Kỹ xảo' },
      { id: 44, name: 'Diễn họa 3D (Blender)' },
    ],
  },
  {
    id: 5,
    name: 'Kỹ năng mềm & Phát triển',
    icon: '🚀',
    children: [
      { id: 51, name: 'Thuyết trình & Đàm phán' },
      { id: 52, name: 'Quản lý thời gian' },
      { id: 53, name: 'Tư duy phản biện' },
      { id: 54, name: 'Kỹ năng lãnh đạo' },
    ],
  },
  {
    id: 6,
    name: 'Khoa học cơ bản & Đại cương',
    icon: '📚',
    children: [
      { id: 61, name: 'Toán cao cấp & Giải tích' },
      { id: 62, name: 'Xác suất thống kê' },
      { id: 63, name: 'Triết học & Pháp luật' },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Tự động mở danh mục cha nếu URL query parameter trùng khớp với một danh mục con
  useEffect(() => {
    if (location.pathname === '/student/resource-center') {
      const searchCat = decodeURIComponent(new URLSearchParams(location.search).get('category') || '');
      if (searchCat) {
        const matchedParent = dummyCategories.find(parent => 
          parent.children.some(child => child.name === searchCat)
        );
        if (matchedParent) {
          setExpandedCategories(prev => ({
            ...prev,
            [matchedParent.id]: true
          }));
        }
      }
    }
  }, [location.search, location.pathname]);

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
    { to: '/teacher/classes', icon: <FiUsers />, label: 'Lớp học của tôi' },
    { to: '/teacher/materials', icon: <FiBook />, label: 'Học liệu của tôi' },
    { to: '/teacher/upload', icon: <FiUpload />, label: 'Tải lên học liệu' },
  ];

  const studentMenu = [
    { to: '/student', icon: <FiHome />, label: 'TỔNG QUAN' },
    {
      id: 'my-courses',
      label: 'KHÓA HỌC CỦA TÔI',
      icon: <FiMonitor />,
      children: [
        { to: '/student/my-classes', label: 'Khóa học đang tham gia' },
        { to: '/student/curriculum', label: 'Chương trình khung' },
        { to: '/student/results', label: 'Kết quả học tập' },
      ],
    },
    {
      id: 'materials',
      label: 'TÀI NGUYÊN HỌC TẬP',
      icon: <FiBook />,
      children: [
        { to: '/student/resource-center', label: 'Trung tâm học liệu' },
        { to: '/student/catalog', label: 'Khám phá khóa học' },
      ],
    },
    { to: '/student/schedule', icon: <FiCalendar />, label: 'LỊCH HỌC' },
    { to: '/student/leaderboard', icon: <FiAward />, label: 'BẢNG XẾP HẠNG' },
    {
      id: 'personal',
      label: 'CÁ NHÂN',
      icon: <FiUser />,
      children: [
        { to: '/student/profile', label: 'Hồ sơ học viên' },
        { to: '/student/achievements', label: 'Thành tựu của tôi' },
        { to: '/student/transactions', label: 'Lịch sử giao dịch' },
      ],
    },
  ];

  const toggleMenuItem = (menuId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [`menu-${menuId}`]: !prev[`menu-${menuId}`],
    }));
  };

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
            {menu.map((item) => {
              if (item.children) {
                const isExpanded = expandedCategories[`menu-${item.id}`];
                return (
                  <div key={item.id} className="sidebar__menu-group">
                    <button
                      className="sidebar__menu-parent"
                      onClick={() => toggleMenuItem(item.id)}
                    >
                      <div className="sidebar__menu-parent-left">
                        <span className="sidebar__link-icon">{item.icon}</span>
                        <span className="sidebar__link-label">{item.label}</span>
                      </div>
                      <span className="sidebar__menu-arrow">
                        {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                      </span>
                    </button>
                    
                    <div className={`sidebar__menu-children ${isExpanded ? 'sidebar__menu-children--open' : ''}`}>
                      {item.children.map((child, index) => (
                        <NavLink
                          key={index}
                          to={child.to}
                          className={({ isActive }) =>
                            `sidebar__menu-child ${isActive && child.to !== '#' ? 'sidebar__menu-child--active' : ''} ${child.to === '#' ? 'sidebar__menu-child--disabled' : ''}`
                          }
                          onClick={child.to === '#' ? (e) => e.preventDefault() : undefined}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.split('/').length <= 2}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                >
                  <span className="sidebar__link-icon">{item.icon}</span>
                  <span className="sidebar__link-label">{item.label}</span>
                </NavLink>
              );
            })}
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
                      <span className="sidebar__tree-label">
                        {category.icon && <span style={{ marginRight: '6px' }}>{category.icon}</span>}
                        {category.name}
                      </span>
                    </button>
                    
                    {/* Children Container */}
                    <div className={`sidebar__tree-children ${isExpanded ? 'sidebar__tree-children--open' : ''}`}>
                      {category.children.map((child) => {
                        const targetUrl = `/student/resource-center?category=${encodeURIComponent(child.name)}`;
                        const isChildActive = location.pathname === '/student/resource-center' &&
                          decodeURIComponent(new URLSearchParams(location.search).get('category') || '') === child.name;

                        return (
                          <NavLink
                            key={child.id}
                            to={targetUrl}
                            className={`sidebar__tree-child ${isChildActive ? 'sidebar__tree-child--active' : ''}`}
                          >
                            <FiHash size={12} className="sidebar__tree-child-icon" />
                            <span className="sidebar__tree-child-label">{child.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sidebar__user-profile" ref={userMenuRef}>
          {user ? (
            <>
              <div 
                className="sidebar__user-avatar" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                style={{ cursor: 'pointer' }}
              >
                {/* Fallback avatar image */}
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
              </div>
              <div 
                className="sidebar__user-info" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                style={{ cursor: 'pointer' }}
              >
                <span className="sidebar__user-name">{user.full_name || 'Người dùng'}</span>
                <span className="sidebar__user-email">{user.email || 'student@uni.edu.vn'}</span>
              </div>
              <button 
                className="sidebar__user-logout" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                title="Menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 9 12 5 16 9"></polyline>
                  <polyline points="8 15 12 19 16 15"></polyline>
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="sidebar__user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.full_name || 'Người dùng'}</strong>
                    <span>{user.role === 'student' ? (user.major?.name || 'Học viên') : user.role === 'teacher' ? 'Giảng viên' : 'Quản trị viên'}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <NavLink to={`/${user.role}/profile`} className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <FiUser className="dropdown-icon" /> Hồ sơ cá nhân
                  </NavLink>
                  <NavLink to={`/${user.role}/settings`} className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <FiSettings className="dropdown-icon" /> Cài đặt tài khoản
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FiLogOut className="dropdown-icon" /> Đăng xuất
                  </button>
                </div>
              )}
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
