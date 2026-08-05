import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiHome,
  FiBook,
  FiFolder,
  FiUsers,
  FiUpload,
  FiDownload,
  FiSettings,
  FiBookOpen,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

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
    { to: '/student', icon: <FiHome />, label: 'Dashboard' },
    { to: '/student/materials', icon: <FiBookOpen />, label: 'Khám phá Học liệu' },
    { to: '/student/downloads', icon: <FiDownload />, label: 'Đã tải xuống' },
  ];

  const getMenu = () => {
    switch (user?.role) {
      case 'admin': return adminMenu;
      case 'teacher': return teacherMenu;
      case 'student': return studentMenu;
      default: return studentMenu;
    }
  };

  const menu = getMenu();

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <FiBookOpen size={24} />
          </div>
          <span className="sidebar__logo-text">LMS</span>
        </div>

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

        <div className="sidebar__footer">
          <p className="sidebar__version">v1.0.0</p>
        </div>
      </aside>

      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
