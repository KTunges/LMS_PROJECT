import React from 'react';
import './Leaderboard.css';
import { FiAward, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Nguyễn Văn A', xp: 12500, avatar: 'A', change: 'up', title: 'Học giả uyên bác' },
  { rank: 2, name: 'Trần Thị B', xp: 11200, avatar: 'B', change: 'same', title: 'Thợ săn điểm' },
  { rank: 3, name: 'Lê Hoàng C', xp: 9800, avatar: 'C', change: 'up', title: 'Thần đồng' },
  { rank: 4, name: 'Phạm Minh D', xp: 8500, avatar: 'D', change: 'down', title: 'Chăm chỉ' },
  { rank: 5, name: 'Hoàng Thi E', xp: 7200, avatar: 'E', change: 'up', title: 'Kiên trì' },
  { rank: 6, name: 'Vũ Đức F', xp: 6000, avatar: 'F', change: 'same', title: 'Tân binh' },
  { rank: 7, name: 'Lê Minh Phan', xp: 5500, avatar: 'L', change: 'up', isCurrentUser: true, title: 'Tân binh' },
  { rank: 8, name: 'Bùi Anh H', xp: 4200, avatar: 'H', change: 'down', title: 'Tân binh' },
];

const Leaderboard = () => {
  const getRankBadge = (xp) => {
    if (xp >= 10000) return { name: 'Thách Đấu', color: '#8B5CF6', icon: '💎' }; // Diamond/Master
    if (xp >= 8000) return { name: 'Bạch Kim', color: '#06B6D4', icon: '💠' };
    if (xp >= 6000) return { name: 'Vàng', color: '#F59E0B', icon: '🥇' };
    if (xp >= 4000) return { name: 'Bạc', color: '#94A3B8', icon: '🥈' };
    return { name: 'Đồng', color: '#B45309', icon: '🥉' };
  };

  return (
    <div className="leaderboard-page fade-in">
      <div className="leaderboard-header">
        <div className="header-icon">
          <FiAward size={32} />
        </div>
        <div>
          <h1>Bảng Xếp Hạng</h1>
          <p>Thi đua học tập, tích lũy XP để leo rank mỗi tuần!</p>
        </div>
      </div>

      <div className="leaderboard-container glass-card">
        <div className="leaderboard-tabs">
          <button className="tab active">Tuần này</button>
          <button className="tab">Tháng này</button>
          <button className="tab">Tất cả thời gian</button>
        </div>

        <div className="leaderboard-list">
          <div className="list-header">
            <span className="col-rank">Hạng</span>
            <span className="col-student">Học viên</span>
            <span className="col-xp">XP</span>
          </div>

          {MOCK_LEADERBOARD.map((student) => {
            const userRank = getRankBadge(student.xp);
            const isTop3 = student.rank <= 3;
            
            return (
              <div key={student.rank} className={`list-row ${student.isCurrentUser ? 'current-user' : ''} ${isTop3 ? 'top-tier' : ''}`}>
                <div className="col-rank">
                  {isTop3 ? (
                    <div className={`medal rank-${student.rank}`}>
                      {student.rank}
                    </div>
                  ) : (
                    <span className="rank-number">{student.rank}</span>
                  )}
                  <span className={`trend-icon ${student.change}`}>
                    {student.change === 'up' && <FiTrendingUp />}
                    {student.change === 'down' && <FiTrendingDown />}
                    {student.change === 'same' && <FiMinus />}
                  </span>
                </div>
                <div className="col-student">
                  <div className={`avatar ${isTop3 ? 'glow' : ''}`}>{student.avatar}</div>
                  <div className="student-info">
                    <span className="student-name">
                      {student.name} {student.isCurrentUser && '(Bạn)'}
                    </span>
                    <span className="student-title" style={{ color: userRank.color }}>
                      {userRank.icon} {userRank.name} • {student.title}
                    </span>
                  </div>
                </div>
                <div className="col-xp">
                  <strong style={{ color: isTop3 ? userRank.color : 'inherit' }}>
                    {student.xp.toLocaleString()}
                  </strong> XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
