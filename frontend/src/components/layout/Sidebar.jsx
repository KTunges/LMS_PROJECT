import { useState, useRef, useEffect } from 'react';
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
  FiLogOut,
  FiMonitor,
  FiCheckSquare,
  FiGlobe,
  FiMessageCircle
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
    { to: '/student', icon: <FiHome />, label: 'Bảng Điều Khiển' },
    {
      id: 'academic',
      label: 'HỌC VỤ & ĐÀO TẠO',
      icon: <FiMonitor />,
      children: [
        { to: '/student/registration', label: 'Đăng ký học phần' },
        { to: '/student/curriculum', label: 'Chương trình khung' },
        { to: '/student/schedule', label: 'Thời khóa biểu' },
        { to: '/student/results', label: 'Kết quả học tập' },
        { to: '/student/exam-schedule', label: 'Lịch thi dự kiến' },
        { to: '/student/graduation-progress', label: 'Tiến độ tốt nghiệp' },
      ],
    },
    {
      id: 'materials',
      label: 'TÀI NGUYÊN HỌC TẬP',
      icon: <FiBook />,
      children: [
        { to: '/student/resource-center', label: 'Trung tâm học liệu' },
        { to: '/student/online-courses', label: 'Khóa học trực tuyến' },
      ],
    },
    {
      id: 'activities',
      label: 'HOẠT ĐỘNG LỚP',
      icon: <FiCheckSquare />,
      children: [
        { to: '#', label: 'Điểm danh' },
        { to: '/student/my-classes', label: 'Không gian học tập' },
        { to: '#', label: 'Thảo luận môn học' },
      ],
    },
    {
      id: 'services',
      label: 'DỊCH VỤ TRỰC TUYẾN',
      icon: <FiFileText />,
      children: [
        { to: '#', label: 'Cấp giấy chứng nhận' },
        { to: '#', label: 'Thẻ sinh viên điện tử' },
        { to: '#', label: 'Nộp chứng chỉ ngoại ngữ' },
        { to: '#', label: 'Nộp chứng chỉ tin học' },
      ],
    },
    {
      id: 'community',
      label: 'CỘNG ĐỒNG & NGOẠI KHÓA',
      icon: <FiGlobe />,
      children: [
        { to: '#', label: 'Câu lạc bộ / Đội nhóm' },
        { to: '#', label: 'Hoạt động Đoàn - Hội' },
        { to: '#', label: 'Khen thưởng - Kỷ luật' },
      ],
    },
    {
      id: 'personal',
      label: 'CÁ NHÂN',
      icon: <FiUser />,
      children: [
        { to: '/student/profile', label: 'Hồ sơ sinh viên' },
        { to: '/student/tuition', label: 'Học phí & Thanh toán' },
        { to: '#', label: 'Tra cứu công nợ' },
        { to: '#', label: 'Đánh giá rèn luyện' },
      ],
    },
    {
      id: 'survey',
      label: 'KHẢO SÁT & ĐÁNH GIÁ',
      icon: <FiTarget />,
      children: [
        { to: '#', label: 'Khảo sát môn học' },
        { to: '#', label: 'Đánh giá giảng viên' },
        { to: '#', label: 'Khảo sát dịch vụ' },
      ],
    },
    {
      id: 'support',
      label: 'HỖ TRỢ',
      icon: <FiMessageCircle />,
      children: [
        { to: '#', label: 'Cố vấn học tập' },
        { to: '#', label: 'Giải đáp thắc mắc' },
        { to: '#', label: 'Quy chế & Sổ tay SV' },
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
                    <span>{user.role === 'student' ? 'Học viên' : user.role === 'teacher' ? 'Giảng viên' : 'Quản trị viên'}</span>
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
