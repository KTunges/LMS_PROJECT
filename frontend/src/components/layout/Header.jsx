import './Header.css';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'Quản trị viên', className: 'badge badge-error' },
      teacher: { label: 'Giảng viên', className: 'badge badge-info' },
      student: { label: 'Sinh viên', className: 'badge badge-success' },
    };
    return badges[role] || { label: role, className: 'badge' };
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar} id="sidebar-toggle">
          <FiMenu size={20} />
        </button>
        <h1 className="header__title">Hệ thống Quản lý Học liệu số</h1>
      </div>

      {user && (
        <div className="header__right">
          <div className="header__user-info">
            <div className="header__avatar">
              <FiUser size={18} />
            </div>
            <div className="header__user-details">
              <span className="header__user-name">{user.full_name}</span>
              <span className={roleBadge.className}>{roleBadge.label}</span>
            </div>
          </div>
          <button className="header__logout-btn" onClick={handleLogout} id="logout-btn">
            <FiLogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
