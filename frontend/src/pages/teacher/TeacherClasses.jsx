import { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiMoreVertical } from 'react-icons/fi';
import { teacherService } from '../../services';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await teacherService.getMyClasses();
        if (res.data && res.data.success) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (isLoading) return <div style={{padding: 40}}>Đang tải danh sách lớp...</div>;

  return (
    <div className="myclasses-page">
      <div className="myclasses-header">
        <div className="myclasses-title">
          <h1>Lớp học của tôi</h1>
          <p>Quản lý các lớp học bạn đang giảng dạy trong học kỳ này.</p>
        </div>
      </div>

      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card glass-card" style={{ cursor: 'pointer' }}>
            <div className="class-card__cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600)` }}>
              <div className="class-card__overlay" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
              <div className="class-card__menu" onClick={(e) => e.stopPropagation()}>
                <FiMoreVertical />
              </div>
              <div className="class-card__course-code">{cls.course_code}</div>
              <h3 className="class-card__name">{cls.course_name}</h3>
              <p className="class-card__teacher">Kỳ học: {cls.semester_name}</p>
            </div>
            
            <div className="class-card__content">
              <div className="class-card__stats">
                <span className="stat-item">
                  <FiClock /> {cls.schedule_time || 'Chưa xếp lịch'}
                </span>
                <span className="stat-item">
                  <FiUsers /> {cls.studentsCount} Sinh viên
                </span>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '14px', borderRadius: '8px' }}>Danh sách lớp</button>
                <button className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--theme-border)' }}>Chấm điểm</button>
              </div>
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="empty-state">
            <p>Bạn chưa được phân công giảng dạy lớp nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
