import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiDownload, FiMapPin, FiUser, FiClock } from 'react-icons/fi';
import './Schedule.css';

// Mock schedule data
const mockSchedule = [
  { id: 1, name: 'Lập trình Căn bản', day: 'T2', shift: 1, room: 'A1-201', teacher: 'Nguyễn Văn A', type: 'lecture', color: 'blue' },
  { id: 2, name: 'Cơ sở dữ liệu', day: 'T2', shift: 3, room: 'A1-203', teacher: 'Lê Văn C', type: 'lecture', color: 'green' },
  { id: 3, name: 'Toán Cao cấp', day: 'T3', shift: 1, room: 'B2-105', teacher: 'Hoàng Văn E', type: 'lecture', color: 'purple' },
  { id: 4, name: 'Phát triển Web', day: 'T4', shift: 2, room: 'Phòng Máy 1', teacher: 'Trần Thị B', type: 'lab', color: 'orange' },
  { id: 5, name: 'Tiếng Anh Giao tiếp', day: 'T5', shift: 4, room: 'C1-102', teacher: 'Phạm Thị D', type: 'lecture', color: 'pink' },
  { id: 6, name: 'Vật lý Đại cương', day: 'T6', shift: 1, room: 'A1-301', teacher: 'Ngô Thị F', type: 'lecture', color: 'indigo' },
  { id: 7, name: 'Lập trình Căn bản (TH)', day: 'T6', shift: 3, room: 'Phòng Máy 3', teacher: 'Nguyễn Văn A', type: 'lab', color: 'blue' },
];

const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const shifts = [
  { id: 1, name: 'Ca 1 (07:00 - 09:15)', period: 'Sáng' },
  { id: 2, name: 'Ca 2 (09:30 - 11:45)', period: 'Sáng' },
  { id: 3, name: 'Ca 3 (13:00 - 15:15)', period: 'Chiều' },
  { id: 4, name: 'Ca 4 (15:30 - 17:45)', period: 'Chiều' },
];

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(12);

  const getCourseForSlot = (day, shiftId) => {
    return mockSchedule.find(c => c.day === day && c.shift === shiftId);
  };

  return (
    <div className="schedule-page animate-scaleIn">
      <div className="schedule-header-wrapper">
        <div className="schedule-header-content">
          <h1>Thời khóa biểu</h1>
          <p>Kỳ 1 - Năm học 2026-2027</p>
        </div>
        
        <div className="schedule-controls">
          <div className="week-selector glass-card">
            <button onClick={() => setCurrentWeek(w => Math.max(1, w - 1))} className="icon-btn">
              <FiChevronLeft size={20} />
            </button>
            <div className="current-week">
              <FiCalendar className="text-info" />
              <span>Tuần {currentWeek}</span>
            </div>
            <button onClick={() => setCurrentWeek(w => Math.min(15, w + 1))} className="icon-btn">
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <button className="btn-today glass-card">Hôm nay</button>
          <button className="btn-download">
            <FiDownload /> Xuất PDF
          </button>
        </div>
      </div>

      <div className="schedule-grid-container glass-card">
        <div className="schedule-grid">
          {/* Header Row: Days */}
          <div className="grid-cell header-cell time-col-header">Thời gian</div>
          {days.map(day => (
            <div key={day} className="grid-cell header-cell day-header">
              {day === 'T2' ? 'Thứ 2' : 
               day === 'T3' ? 'Thứ 3' : 
               day === 'T4' ? 'Thứ 4' : 
               day === 'T5' ? 'Thứ 5' : 
               day === 'T6' ? 'Thứ 6' : 'Thứ 7'}
            </div>
          ))}

          {/* Time Rows */}
          {shifts.map(shift => (
            <div key={`row-${shift.id}`} className="grid-row">
              {/* Time Column */}
              <div className="grid-cell time-cell">
                <span className="shift-name">{shift.name.split(' (')[0]}</span>
                <span className="shift-time">({shift.name.split('(')[1]}</span>
              </div>
              
              {/* Day Columns for this shift */}
              {days.map(day => {
                const course = getCourseForSlot(day, shift.id);
                return (
                  <div key={`${day}-${shift.id}`} className="grid-cell course-cell">
                    {course ? (
                      <div className={`course-card color-${course.color}`}>
                        <div className="course-type-badge">{course.type === 'lab' ? 'Thực hành' : 'Lý thuyết'}</div>
                        <h4 className="course-name">{course.name}</h4>
                        <div className="course-details">
                          <span><FiMapPin /> {course.room}</span>
                          <span><FiUser /> {course.teacher}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-slot"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="schedule-legend glass-card">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}></div>
          <span>Lịch học lý thuyết</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#84cc16' }}></div>
          <span>Lịch học thực hành</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#7dd3fc' }}></div>
          <span>Lịch học trực tuyến</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#fef08a' }}></div>
          <span>Lịch thi</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ef4444' }}></div>
          <span>Lịch tạm ngưng</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3b82f6' }}></div>
          <span>Lịch lâm sàng</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
