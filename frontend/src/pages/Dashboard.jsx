import './Dashboard.css';
import { FiBook, FiUsers, FiDownload, FiFolder } from 'react-icons/fi';

const Dashboard = () => {
  const stats = [
    { icon: <FiBook size={24} />, label: 'Tổng Học liệu', value: '0', color: 'blue' },
    { icon: <FiFolder size={24} />, label: 'Danh mục', value: '0', color: 'purple' },
    { icon: <FiUsers size={24} />, label: 'Người dùng', value: '0', color: 'green' },
    { icon: <FiDownload size={24} />, label: 'Lượt tải', value: '0', color: 'orange' },
  ];

  return (
    <div className="dashboard animate-fadeIn">
      <div className="dashboard__header">
        <h2 className="dashboard__title">Dashboard</h2>
        <p className="dashboard__subtitle">Tổng quan hệ thống quản lý học liệu số</p>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-card--${stat.color}`}>
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__content">
        <div className="card">
          <h3 style={{ marginBottom: 'var(--spacing-4)', fontWeight: 600 }}>
            Chào mừng đến với Hệ thống Quản lý Học liệu số
          </h3>
          <p style={{ color: 'var(--gray-500)', lineHeight: 1.8 }}>
            Hệ thống giúp bạn quản lý, chia sẻ và tải xuống các tài liệu học tập 
            một cách hiệu quả. Sử dụng menu bên trái để điều hướng đến các chức năng 
            khác nhau của hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
