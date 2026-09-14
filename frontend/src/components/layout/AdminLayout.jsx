import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiSettings, FiLogOut, FiMenu, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/portal-super-admin/login');
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>SUPER ADMIN</h2>
          <span className="admin-badge">v1.0</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/portal-super-admin" end className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/portal-super-admin/courses" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FiBook /> Duyệt Khóa học
          </NavLink>
          <NavLink to="/portal-super-admin/users" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FiUsers /> Quản lý Users
          </NavLink>
          <NavLink to="/portal-super-admin/finance" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FiDollarSign /> Tài chính
          </NavLink>
          <NavLink to="/portal-super-admin/settings" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <FiSettings /> Cài đặt hệ thống
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.full_name?.charAt(0) || 'A'}</div>
            <div>
              <div className="admin-name">{user?.full_name}</div>
              <div className="admin-role">System Admin</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="admin-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={24} />
          </button>
          <div className="admin-header-title">Trang quản trị hệ thống</div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
