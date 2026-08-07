import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiFilter, FiAlertTriangle, FiFileText, FiMonitor } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import './ExamSchedule.css';

const examData = [
  {
    id: 1,
    code: 'IT306',
    name: 'Lập trình Web Nâng cao',
    type: 'Cuối kỳ',
    format: 'Tự luận + Thực hành',
    date: '2026-08-25',
    time: '08:00 - 10:00',
    room: 'Phòng thi A301',
    note: 'Được sử dụng tài liệu',
    semester: 'HK2 - 2026',
  },
  {
    id: 2,
    code: 'IT307',
    name: 'Hệ quản trị CSDL Nâng cao',
    type: 'Cuối kỳ',
    format: 'Trắc nghiệm + Thực hành',
    date: '2026-08-27',
    time: '13:00 - 15:00',
    room: 'Lab B2-05',
    note: 'Thi trên máy tính',
    semester: 'HK2 - 2026',
  },
  {
    id: 3,
    code: 'IT308',
    name: 'Điện toán Đám mây',
    type: 'Cuối kỳ',
    format: 'Vấn đáp + Demo',
    date: '2026-08-30',
    time: '09:00 - 11:00',
    room: 'Phòng thi A205',
    note: 'Chuẩn bị slide thuyết trình',
    semester: 'HK2 - 2026',
  },
  {
    id: 4,
    code: 'IT309',
    name: 'Kiểm thử Phần mềm',
    type: 'Cuối kỳ',
    format: 'Trắc nghiệm',
    date: '2026-09-02',
    time: '08:00 - 09:30',
    room: 'Phòng thi C102',
    note: '',
    semester: 'HK2 - 2026',
  },
  {
    id: 5,
    code: 'GEN301',
    name: 'Kỹ năng Mềm',
    type: 'Cuối kỳ',
    format: 'Tiểu luận',
    date: '2026-09-05',
    time: '—',
    room: 'Nộp online',
    note: 'Hạn nộp: 23:59 ngày 05/09',
    semester: 'HK2 - 2026',
  },
  {
    id: 6,
    code: 'IT306',
    name: 'Lập trình Web Nâng cao',
    type: 'Giữa kỳ',
    format: 'Trắc nghiệm',
    date: '2026-07-10',
    time: '08:00 - 09:00',
    room: 'Phòng thi A301',
    note: '',
    semester: 'HK2 - 2026',
  },
];

const semesters = ['HK2 - 2026'];
const examTypes = ['Tất cả', 'Giữa kỳ', 'Cuối kỳ'];

const ExamSchedule = () => {
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedType]);

  const getDaysLeft = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(dateStr);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getFormatIcon = (format) => {
    if (format.includes('Thực hành') || format.includes('Demo')) return <FiMonitor />;
    if (format.includes('Tiểu luận')) return <FiFileText />;
    return <FiCalendar />;
  };

  const filteredExams = selectedType === 'Tất cả'
    ? examData
    : examData.filter(e => e.type === selectedType);

  const sortedExams = [...filteredExams].sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingCount = examData.filter(e => getDaysLeft(e.date) >= 0).length;
  const pastCount = examData.filter(e => getDaysLeft(e.date) < 0).length;

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div>
          <h1>Lịch thi dự kiến</h1>
          <p>Học kỳ 2 — Năm học 2025-2026</p>
        </div>
      </div>

      {/* Stats */}
      <div className="exam-stats">
        <div className="exam-stat glass-card stat-upcoming">
          <FiCalendar className="stat-icon" />
          <div>
            <span className="stat-label">Sắp diễn ra</span>
            <span className="stat-value">{upcomingCount}</span>
          </div>
        </div>
        <div className="exam-stat glass-card stat-past">
          <FiClock className="stat-icon" />
          <div>
            <span className="stat-label">Đã qua</span>
            <span className="stat-value">{pastCount}</span>
          </div>
        </div>
        <div className="exam-stat glass-card stat-total">
          <FiFileText className="stat-icon" />
          <div>
            <span className="stat-label">Tổng môn thi</span>
            <span className="stat-value">{examData.length}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="exam-filter glass-card">
        <FiFilter />
        <span>Loại kỳ thi:</span>
        {examTypes.map(t => (
          <button
            key={t}
            className={`filter-btn ${selectedType === t ? 'active' : ''}`}
            onClick={() => setSelectedType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Exam list */}
      <div className="exam-list">
        {isLoading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : (
          sortedExams.map(exam => {
            const daysLeft = getDaysLeft(exam.date);
            const isPast = daysLeft < 0;
            const isUrgent = daysLeft >= 0 && daysLeft <= 3;
            const dateObj = new Date(exam.date);

            return (
              <div key={exam.id} className={`exam-card glass-card ${isPast ? 'past' : ''} ${isUrgent ? 'urgent' : ''}`}>
                <div className="exam-card__left">
                  <div className="exam-date-box">
                    <span className="exam-day">{dateObj.getDate()}</span>
                    <span className="exam-month">Tháng {dateObj.getMonth() + 1}</span>
                  </div>
                </div>
                <div className="exam-card__center">
                  <div className="exam-card__top">
                    <span className={`exam-type-badge ${exam.type === 'Giữa kỳ' ? 'midterm' : 'final'}`}>
                      {exam.type}
                    </span>
                    <span className="exam-code">{exam.code}</span>
                  </div>
                  <h3 className="exam-name">{exam.name}</h3>
                  <div className="exam-details">
                    <span className="exam-detail">
                      {getFormatIcon(exam.format)} {exam.format}
                    </span>
                    <span className="exam-detail">
                      <FiClock /> {exam.time}
                    </span>
                    <span className="exam-detail">
                      <FiMapPin /> {exam.room}
                    </span>
                  </div>
                  {exam.note && (
                    <div className="exam-note">
                      <FiAlertTriangle /> {exam.note}
                    </div>
                  )}
                </div>
                <div className="exam-card__right">
                  {isPast ? (
                    <span className="countdown past">Đã qua</span>
                  ) : daysLeft === 0 ? (
                    <span className="countdown today">Hôm nay</span>
                  ) : (
                    <span className={`countdown ${isUrgent ? 'urgent' : ''}`}>
                      {daysLeft} ngày nữa
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExamSchedule;
