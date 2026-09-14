import { useState, useEffect } from 'react';
import { FiUsers, FiMessageCircle, FiSearch, FiMail, FiTrendingUp, FiAward, FiCheck, FiCornerDownRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { teacherService } from '../../services/teacherService';
import './TeacherStudents.css';

const TeacherStudents = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [replyText, setReplyText] = useState({});
  const [students, setStudents] = useState([]);
  const [qaList, setQaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stuRes, qaRes] = await Promise.all([
        teacherService.getStudents(),
        teacherService.getQA()
      ]);
      if (stuRes.data.success) {
        setStudents(stuRes.data.data);
      }
      if (qaRes.data.success) {
        setQaList(qaRes.data.data);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu!');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unansweredCount = qaList.filter(q => !q.answered).length;
  const completedCount = students.filter(s => s.progress === 100).length;
  const totalProgress = students.reduce((acc, curr) => acc + curr.progress, 0);
  const avgCompletion = students.length ? Math.round(totalProgress / students.length) : 0;

  const handleReply = async (id) => {
    if (!replyText[id] || replyText[id].trim() === '') {
      toast.warning('Vui lòng nhập câu trả lời!');
      return;
    }
    
    try {
      const res = await teacherService.replyQA(id, replyText[id]);
      if (res.data.success) {
        setQaList(qaList.map(q => {
          if (q.id === id) {
            return { ...q, answered: true, answer: replyText[id] };
          }
          return q;
        }));
        toast.success('Đã gửi câu trả lời thành công!');
        setReplyText({ ...replyText, [id]: '' });
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi câu trả lời!');
      console.error(error);
    }
  };

  const getProgressStatus = (progress) => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const handleSendEmail = () => {
    const emails = filteredStudents.map(s => s.email).filter(Boolean).join(',');
    if (emails) {
      window.location.href = `mailto:?bcc=${emails}&subject=Thông báo lớp học`;
      toast.success('Đã mở ứng dụng gửi Email!');
    } else {
      toast.info('Không tìm thấy địa chỉ email của học viên nào.');
    }
  };

  if (isLoading) {
    return <div className="ts-page" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  }

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
          <button className="ts-btn-email" onClick={handleSendEmail}>
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
            <div className="ts-stat-info__value">{students.length.toLocaleString()}</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiAward size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Hoàn thành</div>
            <div className="ts-stat-info__value">{completedCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--purple">
          <div className="ts-stat-icon ts-stat-icon--purple"><FiTrendingUp size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Tỷ lệ trung bình</div>
            <div className="ts-stat-info__value">{avgCompletion}%</div>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredStudents.length > 0 ? (
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
                {filteredStudents.map((sv, idx) => {
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
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--theme-text-light)' }}>
              Chưa có học viên nào tham gia khóa học của bạn.
            </div>
          )}
        </div>
      )}

      {/* Q&A */}
      {activeTab === 'qa' && (
        <div className="ts-qa-list">
          {qaList.length > 0 ? (
            qaList.map((q) => (
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
                        <FiCheck size={16} /> Bạn đã trả lời
                      </div>
                      {q.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--theme-text-light)' }}>
              Chưa có câu hỏi nào từ học viên.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
