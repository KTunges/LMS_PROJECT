import { useState } from 'react';
import { FiUsers, FiMessageCircle, FiSearch, FiMail, FiTrendingUp, FiAward, FiCheck, FiCornerDownRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './TeacherStudents.css';

const TeacherStudents = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [replyText, setReplyText] = useState({});

  const mockStudents = [
    { id: 'SV001', name: 'Nguyễn Văn A', course: 'Lập trình ReactJS Thực chiến', progress: 85, date: '12/09/2026' },
    { id: 'SV002', name: 'Trần Thị B', course: 'NodeJS API Masterclass', progress: 100, date: '10/09/2026' },
    { id: 'SV003', name: 'Lê Văn C', course: 'Figma UI/UX', progress: 20, date: '13/09/2026' },
    { id: 'SV004', name: 'Hoàng D', course: 'Lập trình ReactJS Thực chiến', progress: 0, date: '13/09/2026' },
  ];

  const [mockQA, setMockQA] = useState([
    { 
      id: 1, 
      student: 'Lê Văn C', 
      course: 'Figma UI/UX', 
      lecture: 'Bài 2: Sử dụng Auto Layout', 
      question: 'Thầy ơi cho em hỏi làm sao để thẻ con tự động dãn ra khi nội dung dài ra ạ? Em làm hoài mà nó bị tràn khung.',
      time: '2 giờ trước',
      answered: false 
    },
    { 
      id: 2, 
      student: 'Nguyễn Văn A', 
      course: 'Lập trình ReactJS', 
      lecture: 'Bài 5: Quản lý State', 
      question: 'Em dùng useState nhưng giao diện không update ngay lập tức. Có cách nào fix không ạ?',
      time: '1 ngày trước',
      answered: true,
      answer: 'React cập nhật state theo cơ chế bất đồng bộ (asynchronous). Để thấy kết quả ngay, em nên dùng useEffect theo dõi biến state đó nhé!' 
    }
  ]);

  const unansweredCount = mockQA.filter(q => !q.answered).length;

  const handleReply = (id) => {
    if (!replyText[id] || replyText[id].trim() === '') {
      toast.warning('Vui lòng nhập câu trả lời!');
      return;
    }
    
    setMockQA(mockQA.map(q => {
      if (q.id === id) {
        return { ...q, answered: true, answer: replyText[id] };
      }
      return q;
    }));
    
    toast.success('Đã gửi câu trả lời thành công!');
  };

  const getProgressStatus = (progress) => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="ts-page">
      {/* HEADER */}
      <div className="ts-header">
        <div>
          <h1 className="ts-header__title">
            Quản lý <span className="gradient-text">Học viên</span>
          </h1>
          <p className="ts-header__subtitle">Theo dõi tiến độ học tập và tương tác với học viên của bạn.</p>
        </div>
        <div className="ts-header__actions">
          <button className="ts-btn-email">
            <FiMail size={18} /> Gửi Email Hàng loạt
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="ts-stats">
        <div className="ts-stat-card ts-stat-card--blue">
          <div className="ts-stat-icon ts-stat-icon--blue"><FiUsers size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Tổng học viên</div>
            <div className="ts-stat-info__value">1,248</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiAward size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Hoàn thành</div>
            <div className="ts-stat-info__value">842</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--purple">
          <div className="ts-stat-icon ts-stat-icon--purple"><FiTrendingUp size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Tỷ lệ hoàn thành</div>
            <div className="ts-stat-info__value">88%</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--orange">
          <div className="ts-stat-icon ts-stat-icon--orange"><FiMessageCircle size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Cần trả lời</div>
            <div className="ts-stat-info__value">{unansweredCount}</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="ts-tabs">
        <button 
          onClick={() => setActiveTab('students')}
          className={`ts-tab ${activeTab === 'students' ? 'ts-tab--active' : ''}`}
        >
          <FiUsers /> Danh sách Học viên
        </button>
        <button 
          onClick={() => setActiveTab('qa')}
          className={`ts-tab ${activeTab === 'qa' ? 'ts-tab--active' : ''}`}
        >
          <FiMessageCircle /> Hỏi đáp Q&A
          {unansweredCount > 0 && <span className="ts-tab__badge">{unansweredCount}</span>}
        </button>
      </div>

      {/* STUDENTS TABLE */}
      {activeTab === 'students' && (
        <div className="ts-content-card">
          <div className="ts-search">
            <FiSearch className="ts-search__icon" />
            <input 
              type="text" 
              className="ts-search__input"
              placeholder="Tìm tên học viên hoặc mã..." 
            />
          </div>

          <table className="ts-table">
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Khóa học</th>
                <th>Ngày tham gia</th>
                <th>Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((sv, idx) => {
                const status = getProgressStatus(sv.progress);
                return (
                  <tr key={idx}>
                    <td>
                      <div className="ts-student-name">{sv.name}</div>
                      <div className="ts-student-id">{sv.id}</div>
                    </td>
                    <td className="ts-course-name">{sv.course}</td>
                    <td className="ts-date">{sv.date}</td>
                    <td>
                      <div className="ts-progress">
                        <div className="ts-progress__bar">
                          <div 
                            className={`ts-progress__fill ts-progress__fill--${status}`} 
                            style={{ width: `${sv.progress}%` }}
                          />
                        </div>
                        <span className={`ts-progress__text ts-progress__text--${status}`}>
                          {sv.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Q&A */}
      {activeTab === 'qa' && (
        <div className="ts-qa-list">
          {mockQA.map((q) => (
            <div key={q.id} className={`ts-qa-card ${q.answered ? 'ts-qa-card--answered' : 'ts-qa-card--unanswered'}`}>
              <div className="ts-qa-header">
                <div className="ts-qa-user">
                  <div className={`ts-qa-avatar ${q.answered ? 'ts-qa-avatar--answered' : 'ts-qa-avatar--unanswered'}`}>
                    {q.student.charAt(0)}
                  </div>
                  <div>
                    <div className="ts-qa-name">{q.student}</div>
                    <div className="ts-qa-meta">
                      {q.time} • <a href="#">{q.course}</a> — {q.lecture}
                    </div>
                  </div>
                </div>
                {!q.answered && (
                  <span className="ts-qa-badge--pending">🔴 Cần trả lời</span>
                )}
              </div>

              <div className="ts-qa-question">{q.question}</div>

              {!q.answered ? (
                <div className="ts-qa-reply">
                  <FiCornerDownRight size={22} className="ts-qa-reply__icon" />
                  <div className="ts-qa-reply__form">
                    <textarea 
                      className="ts-qa-reply__textarea"
                      rows={3} 
                      placeholder="Viết câu trả lời của bạn..." 
                      value={replyText[q.id] || ''}
                      onChange={(e) => setReplyText({...replyText, [q.id]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleReply(q.id)}
                      className="ts-qa-reply__submit"
                    >
                      <FiMessageCircle /> Gửi phản hồi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ts-qa-answer">
                  <FiCornerDownRight size={22} className="ts-qa-answer__icon" />
                  <div className="ts-qa-answer__content">
                    <div className="ts-qa-answer__label">
                      <FiCheck size={16} /> Giảng viên đã trả lời
                    </div>
                    {q.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
