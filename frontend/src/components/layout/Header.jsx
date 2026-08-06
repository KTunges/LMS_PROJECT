import './Header.css';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar} id="sidebar-toggle">
          <FiMenu size={20} />
        </button>
      </div>

      <div className="header__center">
        <div className="header__search" id="header-search">
          <FiSearch size={16} className="header__search-icon" />
          <span className="header__search-text">Search something</span>
          <kbd className="header__search-kbd">Ctrl + K</kbd>
        </div>
      </div>

      <div className="header__right">
        <button className="header__notification-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

