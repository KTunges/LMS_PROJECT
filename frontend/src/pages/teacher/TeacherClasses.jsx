import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiClock, FiMoreVertical, FiPlus, FiEdit3, FiVideo, FiBarChart2 } from 'react-icons/fi';
import { teacherService } from '../../services';
import './Teacher.css';

const TeacherClasses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await teacherService.getMyClasses();
        if (res.data && res.data.success) {
          const rawData = res.data.data;
          const mappedCourses = rawData.map(item => ({
            id: item.course_id || item.id,
            name: item.course_name || item.name || 'Khóa học chưa đặt tên',
            code: item.course_code || item.code || 'CHUNG',
            price: item.price !== undefined ? item.price : 499000,
            studentsCount: item.studentsCount || 0,
            status: item.status || 'published',
            rating: item.rating || 4.8
          }));
          
          const uniqueCourses = Array.from(new Map(mappedCourses.map(c => [c.id, c])).values());
          setCourses(uniqueCourses.length > 0 ? uniqueCourses : []);
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isLoading) return <div className="teacher-page"><div style={{padding: 40}}>Đang tải danh sách khóa học...</div></div>;

  return (
    <div className="teacher-page">
      <div className="teacher-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="teacher-title">Khóa học của tôi</h1>
          <p className="teacher-subtitle">Quản lý nội dung, bài giảng và giá bán của các khóa học.</p>
        </div>
        <button onClick={() => navigate('/portal-giang-vien/courses/new')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Tạo khóa học mới
        </button>
      </div>

      <div className="classes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {courses.map(course => (
          <div key={course.id} className="class-card glass-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.3s ease' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--theme-accent)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--theme-glass-border)'; }}
          >
            <div className="class-card__cover" style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600)`,
              height: '180px',
              position: 'relative',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
              <div style={{ position: 'absolute', top: 12, right: 12, color: 'white', padding: 8, cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                <FiMoreVertical />
              </div>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                {course.status === 'published' ? 'Đang bán' : 'Bản nháp'}
              </div>
              <h3 style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: 'white', margin: 0, fontSize: '18px', lineHeight: 1.4, fontWeight: 700 }}>
                {course.name}
              </h3>
            </div>
            
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold', fontSize: '15px' }}>
                  Giá: {course.price.toLocaleString()}đ
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <FiUsers /> {course.studentsCount} Học viên
                </span>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/portal-giang-vien/courses/${course.id}/edit`); }}
                className="btn btn-outline" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <FiEdit3 /> Quản lý nội dung Khóa học
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'var(--theme-glass-bg)', borderRadius: '12px', border: '1px dashed var(--theme-glass-border)' }}>
            <FiVideo size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Bạn chưa có khóa học nào</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Hãy tạo khóa học đầu tiên để chia sẻ kiến thức của bạn.</p>
            <button onClick={() => navigate('/portal-giang-vien/courses/new')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <FiPlus /> Bắt đầu tạo ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
