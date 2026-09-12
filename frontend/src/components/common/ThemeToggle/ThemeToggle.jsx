import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button 
      className={`theme-toggle ${isDark ? 'dark' : 'light'}`} 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-slider">
        <span className="theme-toggle-icon sun"><FiSun size={14} /></span>
        <span className="theme-toggle-icon moon"><FiMoon size={14} /></span>
        <div className="theme-toggle-thumb"></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
