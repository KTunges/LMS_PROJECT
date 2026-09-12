import { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FiMenu, FiBell, FiSearch, FiBook, FiFolder, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle/ThemeToggle';

const dummyResults = [
  { id: 1, title: 'Lập trình Web Căn bản', type: 'course', icon: <FiBook /> },
  { id: 2, title: 'Tài liệu hướng dẫn ReactJS', type: 'material', icon: <FiFolder /> },
  { id: 3, title: 'Nguyễn Văn A (Giảng viên)', type: 'user', icon: <FiUser /> },
  { id: 4, title: 'Cơ sở dữ liệu nâng cao', type: 'course', icon: <FiBook /> },
];

const Header = ({ onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle search focus with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Handle dropdown navigation
      if (!isFocused) return;
      
      const results = filteredResults();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, activeIndex, searchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = () => {
    if (!searchTerm.trim()) return [];
    return dummyResults.filter((r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSelect = (item) => {
    setIsFocused(false);
    setSearchTerm('');
    if (item.type === 'course') navigate('/student');
    else if (item.type === 'user') navigate('/admin/users');
  };

  const results = filteredResults();
  const showDropdown = isFocused && searchTerm.trim().length > 0;

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar} id="sidebar-toggle">
          <FiMenu size={20} />
        </button>
      </div>

      <div className="header__center">
        <div className={`header__search-container ${isFocused ? 'focused' : ''}`}>
          <div className="header__search">
            <FiSearch size={16} className="header__search-icon" />
            <input 
              ref={inputRef}
              type="text"
              className="header__search-input"
              placeholder="Tìm kiếm khóa học, tài liệu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveIndex(0);
              }}
              onFocus={() => setIsFocused(true)}
            />
            {!isFocused && !searchTerm && <kbd className="header__search-kbd">Ctrl + K</kbd>}
          </div>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="header__search-dropdown" ref={dropdownRef}>
              {results.length > 0 ? (
                <ul className="header__search-list">
                  {results.map((item, index) => (
                    <li
                      key={item.id}
                      className={`header__search-item ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span className="header__search-item-icon">{item.icon}</span>
                      <span className="header__search-item-title">{item.title}</span>
                      <span className="header__search-item-type">{item.type}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="header__search-empty">
                  Không tìm thấy kết quả cho "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header__right">
        <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </div>
        <button className="header__notification-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

