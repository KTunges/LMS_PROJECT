import React, { useState, useEffect } from 'react';
import './Achievements.css';
import { 
  FiAward, FiStar, FiZap, FiTarget, FiClock, FiBookOpen, 
  FiTrendingUp, FiActivity, FiShield, FiHeart, FiGift, FiTrello,
  FiCoffee, FiSun, FiMoon, FiMonitor, FiUnlock, FiSmile, FiThumbsUp,
  FiGlobe, FiCamera, FiMusic, FiCommand, FiCrosshair, FiCheckCircle,
  FiFlag, FiCpu, FiFeather, FiLayers, FiCompass, FiBriefcase, FiMapPin
} from 'react-icons/fi';
import { studentService } from '../../services';

const IconMap = {
  'award': <FiAward />, 'star': <FiStar />, 'zap': <FiZap />, 'target': <FiTarget />,
  'clock': <FiClock />, 'book-open': <FiBookOpen />, 'trending-up': <FiTrendingUp />,
  'activity': <FiActivity />, 'shield': <FiShield />, 'heart': <FiHeart />,
  'gift': <FiGift />, 'trello': <FiTrello />, 'coffee': <FiCoffee />,
  'sun': <FiSun />, 'moon': <FiMoon />, 'monitor': <FiMonitor />, 'unlock': <FiUnlock />,
  'smile': <FiSmile />, 'thumbs-up': <FiThumbsUp />, 'flag': <FiFlag />, 'cpu': <FiCpu />,
  'feather': <FiFeather />, 'layers': <FiLayers />, 'compass': <FiCompass />,
  'briefcase': <FiBriefcase />, 'map-pin': <FiMapPin />, 'globe': <FiGlobe />,
  'camera': <FiCamera />, 'music': <FiMusic />, 'command': <FiCommand />, 'crosshair': <FiCrosshair />
};

const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'streak', name: 'Chăm chỉ & Điểm danh' },
  { id: 'exam', name: 'Bài kiểm tra & Điểm số' },
  { id: 'progress', name: 'Tiến độ học tập' },
  { id: 'social', name: 'Tương tác & Cộng đồng' },
];



const Achievements = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await studentService.getAchievements();
        if (res.data) {
          // Map DB records to UI model
          const formatted = res.data.map(item => ({
            ...item,
            icon: IconMap[item.icon] || <FiAward />,
            color: item.unlocked ? '#10B981' : '#94a3b8',
            tier: item.unlocked ? 'common' : 'locked'
          }));
          setAchievements(formatted);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách thành tựu", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeTab);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="achievements-page fade-in">
      <div className="achievements-header">
        <div className="header-info">
          <h1>Phòng Trưng Bày Thành Tựu</h1>
          <p>Thu thập huy hiệu để chứng minh nỗ lực của bạn!</p>
        </div>
        <div className="header-stats glass-card">
          <div className="stat-number">{unlockedCount} <span>/ {totalCount}</span></div>
          <div className="stat-label">Huy hiệu đã mở khóa</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="achievements-tabs">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            className={`ach-tab ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="achievements-grid">
        {isLoading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>Đang tải danh sách huy hiệu...</div>
        ) : (
          filteredAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} tier-${achievement.tier}`}
            >
              <div className="achievement-icon" style={{ backgroundColor: achievement.unlocked ? `${achievement.color}15` : '#f1f5f9', color: achievement.color }}>
                {achievement.icon}
              </div>
              <div className="achievement-info">
                <h3>{achievement.title}</h3>
                <p>{achievement.desc || achievement.description}</p>
              </div>
              
              <div className="achievement-status">
                {achievement.unlocked ? (
                  <div className="status-unlocked">
                    <FiCheckCircle />
                    <span>{new Date(achievement.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                ) : (
                  <div className="status-locked">
                    <div className="progress-bar-mini">
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                    <span>Chưa mở khóa</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
