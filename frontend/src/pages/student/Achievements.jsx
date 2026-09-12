import React, { useState } from 'react';
import './Achievements.css';
import { 
  FiAward, FiStar, FiZap, FiTarget, FiClock, FiBookOpen, 
  FiTrendingUp, FiActivity, FiShield, FiHeart, FiGift, FiTrello,
  FiCoffee, FiSun, FiMoon, FiMonitor, FiUnlock, FiSmile, FiThumbsUp,
  FiFlag, FiCpu, FiFeather, FiLayers, FiCompass, FiBriefcase, FiMapPin,
  FiGlobe, FiCamera, FiMusic, FiCommand, FiCrosshair
} from 'react-icons/fi';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'streak', name: 'Chăm chỉ & Điểm danh' },
  { id: 'exam', name: 'Bài kiểm tra & Điểm số' },
  { id: 'progress', name: 'Tiến độ học tập' },
  { id: 'social', name: 'Tương tác & Cộng đồng' },
];

const MOCK_ACHIEVEMENTS = [
  // Nhóm 1: Chăm chỉ & Điểm danh (Streak)
  { id: 1, category: 'streak', title: 'Mầm non', desc: 'Giữ chuỗi học 3 ngày liên tiếp.', icon: <FiStar />, unlocked: true, date: '01/09/2026', color: '#10B981', tier: 'common' },
  { id: 2, category: 'streak', title: 'Ngọn lửa nhỏ', desc: 'Giữ chuỗi học 7 ngày.', icon: <FiZap />, unlocked: true, date: '05/09/2026', color: '#F59E0B', tier: 'rare' },
  { id: 3, category: 'streak', title: 'Kẻ giữ lửa', desc: 'Giữ chuỗi học 30 ngày.', icon: <FiActivity />, unlocked: false, progress: '12/30', color: '#EF4444', tier: 'epic' },
  { id: 4, category: 'streak', title: 'Kỷ luật thép', desc: 'Giữ chuỗi học 100 ngày.', icon: <FiShield />, unlocked: false, progress: '12/100', color: '#8B5CF6', tier: 'legendary' },
  { id: 5, category: 'streak', title: 'Cú đêm', desc: 'Học bài vào lúc 12h đêm - 4h sáng.', icon: <FiMoon />, unlocked: true, date: '10/09/2026', color: '#6366F1', tier: 'rare' },
  { id: 6, category: 'streak', title: 'Gà gáy', desc: 'Học bài vào lúc 5h - 7h sáng.', icon: <FiSun />, unlocked: false, progress: '0/1', color: '#FCD34D', tier: 'rare' },
  { id: 7, category: 'streak', title: 'Xuyên mùng 1', desc: 'Học vào ngày Lễ/Tết.', icon: <FiGift />, unlocked: false, progress: '0/1', color: '#F43F5E', tier: 'epic' },
  { id: 8, category: 'streak', title: 'Bất khả chiến bại', desc: 'Hoàn thành mục tiêu học tập 52 tuần.', icon: <FiCommand />, unlocked: false, progress: '2/52', color: '#D946EF', tier: 'legendary' },

  // Nhóm 2: Bài kiểm tra & Điểm số (Quizzes/Exams)
  { id: 9, category: 'exam', title: 'Khởi đầu suôn sẻ', desc: 'Đạt 100% bài Quiz đầu tiên.', icon: <FiTarget />, unlocked: true, date: '02/09/2026', color: '#3B82F6', tier: 'common' },
  { id: 10, category: 'exam', title: 'Thiện xạ', desc: 'Trả lời đúng 50 câu trắc nghiệm liên tiếp.', icon: <FiCrosshair />, unlocked: false, progress: '15/50', color: '#14B8A6', tier: 'epic' },
  { id: 11, category: 'exam', title: 'Trí tuệ siêu việt', desc: 'Đạt điểm A+ bài thi cuối kỳ.', icon: <FiAward />, unlocked: false, progress: '0/1', color: '#EAB308', tier: 'legendary' },
  { id: 12, category: 'exam', title: 'Tốc độ ánh sáng', desc: 'Nộp bài kiểm tra khi thời gian trôi qua chưa tới một nửa.', icon: <FiClock />, unlocked: true, date: '08/09/2026', color: '#06B6D4', tier: 'rare' },
  { id: 13, category: 'exam', title: 'Không ngừng nỗ lực', desc: 'Cải thiện điểm số so với lần thi trước.', icon: <FiTrendingUp />, unlocked: true, date: '11/09/2026', color: '#22C55E', tier: 'rare' },
  { id: 14, category: 'exam', title: 'Vượt qua giới hạn', desc: 'Thi đỗ một khóa học mức độ Nâng cao.', icon: <FiFlag />, unlocked: false, progress: '0/1', color: '#EC4899', tier: 'epic' },
  { id: 15, category: 'exam', title: 'Kẻ chinh phục', desc: 'Hoàn thành toàn bộ bài Quiz trong 1 khóa học >80%.', icon: <FiCompass />, unlocked: false, progress: '2/5', color: '#F97316', tier: 'legendary' },

  // Nhóm 3: Tiến độ học tập (Progress)
  { id: 16, category: 'progress', title: 'Bước chân đầu tiên', desc: 'Hoàn thành bài giảng đầu tiên.', icon: <FiMapPin />, unlocked: true, date: '01/09/2026', color: '#10B981', tier: 'common' },
  { id: 17, category: 'progress', title: 'Tốc chiến', desc: 'Xem hết 5 video bài giảng trong một ngày.', icon: <FiMonitor />, unlocked: true, date: '03/09/2026', color: '#8B5CF6', tier: 'rare' },
  { id: 18, category: 'progress', title: 'Mọt sách', desc: 'Đọc 20 tài liệu đính kèm.', icon: <FiBookOpen />, unlocked: false, progress: '5/20', color: '#3B82F6', tier: 'rare' },
  { id: 19, category: 'progress', title: 'Nửa chặng đường', desc: 'Đạt 50% tiến độ một khóa học.', icon: <FiLayers />, unlocked: true, date: '12/09/2026', color: '#F59E0B', tier: 'rare' },
  { id: 20, category: 'progress', title: 'Tốt nghiệp', desc: 'Hoàn thành 100% khóa học đầu tiên.', icon: <FiBriefcase />, unlocked: false, progress: '65%', color: '#EAB308', tier: 'epic' },
  { id: 21, category: 'progress', title: 'Kẻ nghiện học', desc: 'Hoàn thành 3 khóa học khác nhau.', icon: <FiCpu />, unlocked: false, progress: '0/3', color: '#F43F5E', tier: 'legendary' },
  { id: 22, category: 'progress', title: 'Chuyên gia', desc: 'Hoàn thành 1 lộ trình chuyên sâu (VD: IELTS Master).', icon: <FiGlobe />, unlocked: false, progress: '0/1', color: '#0EA5E9', tier: 'legendary' },
  { id: 23, category: 'progress', title: 'Xem đi xem lại', desc: 'Ôn tập lại 1 bài học đã hoàn thành 3 lần.', icon: <FiMusic />, unlocked: false, progress: '1/3', color: '#14B8A6', tier: 'common' },

  // Nhóm 4: Tương tác & Cộng đồng (Social/Gamification)
  { id: 24, category: 'social', title: 'Kẻ leo rank', desc: 'Lọt vào Top 10 Bảng xếp hạng tuần.', icon: <FiTrello />, unlocked: true, date: '07/09/2026', color: '#8B5CF6', tier: 'epic' },
  { id: 25, category: 'social', title: 'Quán quân', desc: 'Đạt Top 1 Bảng xếp hạng tuần.', icon: <FiAward />, unlocked: false, progress: '0/1', color: '#F59E0B', tier: 'legendary' },
  { id: 26, category: 'social', title: 'Nhà sưu tầm', desc: 'Mở khóa 15 thành tựu.', icon: <FiCamera />, unlocked: false, progress: '9/15', color: '#EC4899', tier: 'epic' },
  { id: 27, category: 'social', title: 'Huyền thoại', desc: 'Mở khóa toàn bộ thành tựu.', icon: <FiFeather />, unlocked: false, progress: '9/30', color: '#F43F5E', tier: 'mythic' },
  { id: 28, category: 'social', title: 'Đại gia', desc: 'Tích lũy được 100,000 XP.', icon: <FiHeart />, unlocked: false, progress: '5.5k/100k', color: '#10B981', tier: 'legendary' },
  { id: 29, category: 'social', title: 'Người mới hào phóng', desc: 'Mua khóa học đầu tiên.', icon: <FiUnlock />, unlocked: true, date: '01/09/2026', color: '#3B82F6', tier: 'common' },
  { id: 30, category: 'social', title: 'Fan cứng', desc: 'Đăng nhập vào hệ thống 365 ngày.', icon: <FiSmile />, unlocked: false, progress: '12/365', color: '#06B6D4', tier: 'legendary' },
];

const Achievements = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredAchievements = activeTab === 'all' 
    ? MOCK_ACHIEVEMENTS 
    : MOCK_ACHIEVEMENTS.filter(a => a.category === activeTab);

  const unlockedCount = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalCount = MOCK_ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

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
        {filteredAchievements.map(ach => (
          <div key={ach.id} className={`achievement-card glass-card ${ach.unlocked ? 'unlocked' : 'locked'} tier-${ach.tier}`}>
            <div 
              className="achievement-icon-wrapper"
              style={{ 
                borderColor: ach.unlocked ? ach.color : '#E2E8F0',
                color: ach.unlocked ? ach.color : '#94A3B8'
              }}
            >
              <div className="icon-inner">
                {ach.icon}
              </div>
            </div>
            
            <h3 className="achievement-title">{ach.title}</h3>
            <p className="achievement-desc">{ach.desc}</p>
            
            {ach.unlocked ? (
              <div className="achievement-date">Mở khóa: {ach.date}</div>
            ) : (
              <div className="achievement-progress">
                Tiến độ: <span>{ach.progress}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
