import { useState, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiDownload, FiMapPin, FiUser, FiClock, FiFilter, FiAlertTriangle, FiFileText, FiMonitor } from 'react-icons/fi';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
import { startOfWeek, addDays, format } from 'date-fns';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { courseService, studentService } from '../../services';
import 'react-datepicker/dist/react-datepicker.css';
import './Schedule.css';

registerLocale('vi', vi);

const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const shifts = [
  { id: 1, name: 'Ca 1 (08:00 - 10:15)', period: 'Sáng' },
  { id: 2, name: 'Ca 2 (10:30 - 12:45)', period: 'Sáng' },
  { id: 3, name: 'Ca 3 (13:00 - 15:15)', period: 'Chiều' },
  { id: 4, name: 'Ca 4 (15:30 - 17:45)', period: 'Chiều' },
];

const COLORS = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];



const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="date-input-wrapper glass-card" onClick={onClick} ref={ref} style={{ cursor: 'pointer' }}>
    <input className="custom-datepicker-input" value={value} readOnly style={{ cursor: 'pointer' }} />
    <div className="calendar-icon-box">
      <FiCalendar />
    </div>
  </div>
));

const parseScheduleTime = (timeStr) => {
  if (!timeStr) return null;
  const parts = timeStr.split(', ');
  if (parts.length !== 2) return null;
  
  const dayStr = parts[0].trim();
  let day = 'T' + dayStr.replace('Thứ ', '').trim();
  if (dayStr.toLowerCase() === 'chủ nhật') day = 'CN';

  const timeStrPart = parts[1].trim();
  let shift = 1;
  if (timeStrPart.startsWith('08') || timeStrPart.startsWith('07')) shift = 1;
  else if (timeStrPart.startsWith('09') || timeStrPart.startsWith('10')) shift = 2;
  else if (timeStrPart.startsWith('13') || timeStrPart.startsWith('14')) shift = 3;
  else if (timeStrPart.startsWith('15') || timeStrPart.startsWith('16')) shift = 4;

  return { day, shift };
};

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'study', 'exam'

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const { data } = await courseService.getMyClasses();
        
        // Parse API data into schedule events
        const events = [];
        data.forEach((enr, index) => {
          const cls = enr.class;
          const course = cls.course;
          const timeInfo = parseScheduleTime(cls.schedule_time);
          
          if (timeInfo) {
            events.push({
              id: cls.id,
              name: course.name,
              day: timeInfo.day,
              shift: timeInfo.shift,
              room: cls.room,
              teacher: cls.teacher?.full_name || 'N/A',
              type: 'lecture',
              color: COLORS[index % COLORS.length]
            });
          }
        });

        setScheduleData(events);

        // Mock Thêm Deadlines / Live Class theo luồng E-learning
        events.push({
          id: 991,
          name: 'Bài thi trắc nghiệm Ôn tập',
          day: 'T5',
          shift: 4,
          room: 'Làm bài Online',
          teacher: 'Hạn chót: 17:45',
          type: 'deadline', // Hạn chót
          color: 'red'
        });

        events.push({
          id: 992,
          name: 'Live: Giải đáp thắc mắc',
          day: 'T7',
          shift: 3,
          room: 'Phòng Zoom 123',
          teacher: 'TS. Nguyễn Văn A',
          type: 'live', // Lớp học Live
          color: 'purple'
        });

        // Fetch exam data from API
        try {
          const examRes = await studentService.getExams();
          if (examRes.data && examRes.data.success) {
            setExamData(examRes.data.data);
          }
        } catch (examErr) {
          console.error('Failed to fetch exams:', examErr);
        }
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        
        // Fallback to mock data if API fails
        const mockEvents = [
          { id: 1, name: 'Lập trình Web Nâng cao', day: 'T3', shift: 1, room: 'Phòng 201', teacher: 'TS. Nguyễn Văn A', type: 'lecture', color: 'blue' },
          { id: 2, name: 'Hệ quản trị CSDL', day: 'T4', shift: 3, room: 'Phòng 202', teacher: 'ThS. Trần Thị B', type: 'lecture', color: 'green' },
          { id: 3, name: 'Bài thi trắc nghiệm Ôn tập', day: 'T5', shift: 4, room: 'Làm bài Online', teacher: 'Hạn chót: 17:45', type: 'deadline', color: 'red' },
          { id: 4, name: 'Live: Giải đáp thắc mắc', day: 'T7', shift: 3, room: 'Phòng Zoom 123', teacher: 'TS. Nguyễn Văn A', type: 'live', color: 'purple' }
        ];
        setScheduleData(mockEvents);
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedDate]);

  const getCourseForSlot = (day, shiftId) => {
    return scheduleData.find(c => c.day === day && c.shift === shiftId);
  };

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

  const currentMonday = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const sortedExams = [...examData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingCount = examData.filter(e => getDaysLeft(e.date) >= 0).length;

  // Filter grid data based on viewMode
  const getGridEventsForSlot = (day, shiftId) => {
    // 1. Regular classes (happen every week)
    let classes = [];
    if (viewMode === 'all' || viewMode === 'study') {
      classes = scheduleData.filter(c => c.day === day && c.shift === shiftId);
    }

    // 2. Exams (happen on specific dates)
    let exams = [];
    if (viewMode === 'all' || viewMode === 'exam') {
      const dayIndex = days.indexOf(day);
      const cellDate = addDays(currentMonday, dayIndex);
      const cellDateStr = format(cellDate, 'yyyy-MM-dd');
      
      exams = examData.filter(exam => {
        if (exam.date !== cellDateStr) return false;
        
        // Parse time to shift
        const timeParts = exam.time.split('-');
        const startHour = parseInt(timeParts[0].trim().split(':')[0]);
        let examShift = 1;
        if (startHour >= 7 && startHour <= 8) examShift = 1;
        else if (startHour >= 9 && startHour <= 10) examShift = 2;
        else if (startHour >= 13 && startHour <= 14) examShift = 3;
        else if (startHour >= 15 && startHour <= 16) examShift = 4;
        
        return examShift === shiftId;
      }).map(exam => ({
        id: `exam-${exam.id}`,
        name: `${exam.name} (Thi)`,
        type: 'exam',
        room: exam.room,
        teacher: exam.format, // display format instead of teacher
        color: 'yellow' // Yellow color for exams
      }));
    }

    return [...classes, ...exams][0]; // Return the first event for the slot
  };

  return (
    <div className="schedule-page">
      <div className="schedule-header-wrapper">
        <div className="schedule-header-content">
          <h1>Thời khóa biểu</h1>
        </div>
        
        <div className="schedule-controls">
          <div className="view-mode-toggle glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '0 20px', height: '42px', borderRadius: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="radio" name="viewMode" value="all" checked={viewMode === 'all'} onChange={() => setViewMode('all')} />
              Tất cả
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="radio" name="viewMode" value="study" checked={viewMode === 'study'} onChange={() => setViewMode('study')} />
              Lịch học
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="radio" name="viewMode" value="exam" checked={viewMode === 'exam'} onChange={() => setViewMode('exam')} />
              Lịch thi
            </label>
          </div>

          <div className="date-picker-group">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="vi"
              customInput={<CustomDateInput />}
            />
            <button className="btn-today-date" onClick={() => setSelectedDate(new Date())}>
              <FiCalendar /> Hiện tại
            </button>
          </div>
          
          <div className="nav-buttons-group" style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-nav-week" onClick={() => setSelectedDate(prev => addDays(prev, -7))}>
              <FiChevronLeft /> Trở về
            </button>
            <button className="btn-nav-week" onClick={() => setSelectedDate(prev => addDays(prev, 7))}>
              Tiếp <FiChevronRight />
            </button>
          </div>
          
          <button className="btn-download">
            <FiDownload /> Xuất PDF
          </button>
        </div>
      </div>

      <div className="schedule-content glass-card">
        {isLoading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : (
          <div className="schedule-grid-container">
            <div className="schedule-grid">
              <div className="grid-cell header-cell time-col-header">Thời gian</div>
              {days.map((day, index) => {
                const dayDate = addDays(currentMonday, index);
                const formattedDate = format(dayDate, 'dd/MM/yyyy');
                return (
                  <div key={day} className="grid-cell header-cell day-header">
                    <div>
                      {day === 'T2' ? 'Thứ 2' : 
                      day === 'T3' ? 'Thứ 3' : 
                      day === 'T4' ? 'Thứ 4' : 
                      day === 'T5' ? 'Thứ 5' : 
                      day === 'T6' ? 'Thứ 6' : 
                      day === 'T7' ? 'Thứ 7' : 'Chủ nhật'}
                    </div>
                    <div className="day-date">{formattedDate}</div>
                  </div>
                );
              })}

              {shifts.map(shift => (
                <div key={`row-${shift.id}`} className="grid-row">
                  <div className="grid-cell time-cell">
                    <span className="shift-name">{shift.name.split(' (')[0]}</span>
                    <span className="shift-time">({shift.name.split('(')[1]}</span>
                  </div>
                  
                  {days.map(day => {
                    const event = getGridEventsForSlot(day, shift.id);
                    return (
                      <div key={`${day}-${shift.id}`} className="grid-cell course-cell">
                        {event ? (
                          <div 
                            className={`course-card ${event.type === 'exam' ? '' : `color-${event.color}`}`}
                            style={{ 
                              cursor: 'pointer', 
                              background: event.type === 'exam' ? '#fef08a' : undefined,
                              border: event.type === 'exam' ? '1px solid #fde047' : undefined
                            }}
                          >
                            <div className="course-type-badge" style={{ 
                              background: event.type === 'exam' ? '#ca8a04' : event.type === 'deadline' ? '#dc2626' : event.type === 'live' ? '#9333ea' : undefined, 
                              color: (event.type === 'exam' || event.type === 'deadline' || event.type === 'live') ? '#fff' : undefined 
                            }}>
                              {event.type === 'deadline' ? 'Hạn chót' : event.type === 'live' ? 'Học Live' : event.type === 'lab' ? 'Thực hành' : event.type === 'exam' ? 'Lịch thi' : 'Bài giảng'}
                            </div>
                            <h4 className="course-name">{event.name}</h4>
                            <div className="course-details">
                              <span><FiMapPin /> {event.room}</span>
                              <span><FiUser /> {event.teacher}</span>
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
        )}
      </div>

      <div className="schedule-legend glass-card">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3b82f6' }}></div>
          <span>Bài giảng / Khóa học</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#a855f7' }}></div>
          <span>Lịch học Live (Zoom)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ef4444' }}></div>
          <span>Hạn chót (Deadlines)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#fef08a', border: '1px solid #fde047' }}></div>
          <span>Lịch thi cuối kỳ</span>
        </div>
      </div>

      {(viewMode === 'all' || viewMode === 'exam') && (
        <div className="exam-section" style={{ marginTop: '2rem' }}>
          {viewMode === 'all' && <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Lịch thi sắp tới</h2>}
          <div className="exam-list" style={{ display: 'grid', gap: '15px' }}>
            {isLoading && viewMode === 'exam' ? (
              <SkeletonTable rows={4} cols={5} />
            ) : sortedExams.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Không có lịch thi nào trong thời gian tới.
              </div>
            ) : (
              sortedExams.map(exam => {
                const daysLeft = getDaysLeft(exam.date);
                const isPast = daysLeft < 0;
                const isUrgent = daysLeft >= 0 && daysLeft <= 3;
                const dateObj = new Date(exam.date);

                return (
                  <div key={exam.id} className={`exam-card glass-card ${isPast ? 'past' : ''} ${isUrgent ? 'urgent' : ''}`} style={{ display: 'flex', padding: '15px 20px', alignItems: 'center', gap: '20px' }}>
                    <div className="exam-card__left" style={{ textAlign: 'center', minWidth: '80px', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
                      <div className="exam-date-box" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="exam-day" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', lineHeight: '1' }}>{dateObj.getDate()}</span>
                        <span className="exam-month" style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Tháng {dateObj.getMonth() + 1}</span>
                      </div>
                    </div>
                    <div className="exam-card__center" style={{ flex: '1' }}>
                      <div className="exam-card__top" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span className={`exam-type-badge`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: exam.type === 'Giữa kỳ' ? '#e0e7ff' : '#fee2e2', color: exam.type === 'Giữa kỳ' ? '#4f46e5' : '#ef4444' }}>
                          {exam.type}
                        </span>
                        <span className="exam-code" style={{ fontWeight: '600', color: '#64748b', fontSize: '0.85rem' }}>{exam.code}</span>
                      </div>
                      <h3 className="exam-name" style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 8px 0' }}>{exam.name}</h3>
                      <div className="exam-details" style={{ display: 'flex', gap: '15px', color: '#475569', fontSize: '0.85rem' }}>
                        <span className="exam-detail" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {getFormatIcon(exam.format)} {exam.format}
                        </span>
                        <span className="exam-detail" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FiClock /> {exam.time}
                        </span>
                        <span className="exam-detail" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FiMapPin /> {exam.room}
                        </span>
                      </div>
                    </div>
                    <div className="exam-card__right" style={{ minWidth: '120px', textAlign: 'right' }}>
                      {isPast ? (
                        <span className="countdown past" style={{ color: '#94a3b8', fontWeight: '500' }}>Đã qua</span>
                      ) : daysLeft === 0 ? (
                        <span className="countdown today" style={{ color: '#ef4444', fontWeight: '700' }}>Hôm nay</span>
                      ) : (
                        <span className={`countdown ${isUrgent ? 'urgent' : ''}`} style={{ color: isUrgent ? '#ef4444' : '#10b981', fontWeight: '600' }}>
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
      )}
    </div>
  );
};

export default Schedule;
