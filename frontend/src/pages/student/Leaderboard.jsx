import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { FiAward, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { studentService } from '../../services';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await studentService.getLeaderboard();
        if (res.data && res.data.success) {
          setLeaderboard(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy bảng xếp hạng:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (xp) => {
    if (xp >= 10000) return { name: 'Thách Đấu', color: '#8B5CF6', icon: '💎' };
    if (xp >= 8000) return { name: 'Bạch Kim', color: '#06B6D4', icon: '💠' };
    if (xp >= 6000) return { name: 'Vàng', color: '#F59E0B', icon: '🥇' };
    if (xp >= 4000) return { name: 'Bạc', color: '#94A3B8', icon: '🥈' };
    return { name: 'Đồng', color: '#B45309', icon: '🥉' };
  };

  if (isLoading) return <div className="leaderboard-page"><div style={{padding: 40}}>Đang tải bảng xếp hạng...</div></div>;

  return (
    <div className="leaderboard-page fade-in">
      <div className="leaderboard-header">
        <div className="header-icon">
          <FiAward size={32} />
        </div>
        <div>
          <h1>Bảng Xếp Hạng</h1>
          <p>Xếp hạng dựa trên điểm tích lũy XP từ kết quả học tập thực tế.</p>
        </div>
      </div>

      <div className="leaderboard-container glass-card">
        <div className="leaderboard-list">
          <div className="list-header">
            <span className="col-rank">Hạng</span>
            <span className="col-student">Học viên</span>
            <span className="col-xp">XP</span>
          </div>

          {leaderboard.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>
              Chưa có dữ liệu xếp hạng. Hãy hoàn thành khóa học để tích lũy XP!
            </div>
          ) : (
            leaderboard.map((student) => {
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
