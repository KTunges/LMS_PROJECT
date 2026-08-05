import React, { useState, useEffect } from 'react';
import './Header.css';
import { FiMenu, FiBell, FiSun, FiMoon } from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar} id="sidebar-toggle">
          <FiMenu size={20} />
        </button>
        <h1 className="header__title">Hệ thống Quản lý Học liệu số</h1>
      </div>

      <div className="header__right">
        <button className="header__theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {isLightMode ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
        <button className="header__notification-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
