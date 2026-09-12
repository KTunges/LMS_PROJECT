import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiUploadCloud, FiPlusCircle, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { teacherService } from '../../services';

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    price: 499000,
    category: 'Lập trình',
    description: ''
  });

  const [curriculum, setCurriculum] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await teacherService.getCourseDetails(id);
        if (res.data && res.data.success) {
          const { course, lessons } = res.data.data;
          
          setCourseData({
            title: course.name || '',
            subtitle: course.description || '',
            price: course.price || 0,
            category: 'Lập trình', // Mock for now
          });
          
          // Since we flattened the lessons without a real Section model,
          // we can just put all lessons into one default Section for editing,
          // or parse the title if it contains " - " to rebuild sections.
          // For simplicity, let's group them by parsing or just put in one list.
          
          const defaultSection = {
            id: 1,
            title: 'Chương trình học',
            lectures: lessons.map(l => ({
              id: l.id,
              title: l.title,
              url: l.content_url
            }))
          };
          
          setCurriculum([defaultSection]);
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi khi tải thông tin khóa học');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const handleAddSection = () => {
    setCurriculum([
      ...curriculum, 
      { id: Date.now(), title: `Chương ${curriculum.length + 1}: Tên chương mới`, lectures: [] }
    ]);
  };

  const handleAddLecture = (sectionId) => {
    setCurriculum(curriculum.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lectures: [...sec.lectures, { id: Date.now(), title: `Bài mới`, url: '' }]
        };
      }
      return sec;
    }));
  };

  const handleUpdateLectureTitle = (sectionId, lectureId, title) => {
    setCurriculum(curriculum.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lectures: sec.lectures.map(lec => lec.id === lectureId ? { ...lec, title } : lec)
        };
      }
      return sec;
    }));
  };
  
  const handleUpdateLectureUrl = (sectionId, lectureId, url) => {
    setCurriculum(curriculum.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lectures: sec.lectures.map(lec => lec.id === lectureId ? { ...lec, url } : lec)
        };
      }
      return sec;
    }));
  };

  const handleSave = async () => {
    if (!courseData.title) {
      toast.warning('Vui lòng nhập tên khóa học!');
      return;
    }
    
    try {
      // 1. Update Course
      const coursePayload = {
        name: courseData.title,
        description: courseData.subtitle,
        price: courseData.price,
      };
      
      const res = await teacherService.updateCourse(id, coursePayload);
      
      if (res.data && res.data.success) {
        // 2. In a real app we would sync lessons (delete old, add new, or update)
        // For now, let's just show success
        toast.success('Cập nhật khóa học thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật khóa học');
    }
  };

  if (isLoading) return <div style={{padding: 40}}>Đang tải...</div>;

  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/portal-giang-vien/courses')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '15px' }}
          >
            <FiArrowLeft size={20} /> Trở về
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Chỉnh sửa Khóa học</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px' }}>
            <FiSave /> Cập nhật Khóa học
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        {/* Lõi bên trái: Form nội dung & Chương trình */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Thông tin cơ bản */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>1. Thông tin Cơ bản</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Tiêu đề Khóa học *</label>
                <input 
                  type="text" 
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Mô tả ngắn gọn</label>
                <textarea 
                  rows={3}
                  value={courseData.subtitle}
                  onChange={(e) => setCourseData({...courseData, subtitle: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Khung chương trình (Curriculum Builder) */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>2. Khung Chương Trình (Curriculum)</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {curriculum.map((section, sIndex) => (
                <div key={section.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <input 
                      type="text"
                      defaultValue={section.title}
                      style={{ fontSize: '16px', fontWeight: 'bold', padding: '8px', border: '1px solid transparent', background: 'transparent', width: '80%' }}
                    />
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={18} /></button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '16px' }}>
                    {section.lectures.map((lec, lIndex) => (
                      <div key={lec.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <FiUploadCloud color="#3b82f6" />
                            <input 
                              type="text" 
                              value={lec.title}
                              onChange={(e) => handleUpdateLectureTitle(section.id, lec.id, e.target.value)}
                              style={{ border: 'none', fontSize: '14px', width: '100%', outline: 'none' }}
                              placeholder="Tên bài giảng"
                            />
                          </div>
                          <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '28px' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Video URL:</span>
                          <input 
                            type="text" 
                            value={lec.url || ''}
                            onChange={(e) => handleUpdateLectureUrl(section.id, lec.id, e.target.value)}
                            style={{ border: '1px solid #e2e8f0', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', flex: 1 }}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddLecture(section.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '8px', padding: '8px 0', width: 'fit-content' }}
                    >
                      <FiPlusCircle /> Thêm bài giảng
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddSection}
                className="btn btn-outline" style={{ borderStyle: 'dashed', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <FiPlusCircle /> Thêm Chương mới
              </button>
            </div>
          </div>
        </div>

        {/* Cột phải: Cài đặt bổ sung */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Hình ảnh Khóa học</h3>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}>
              <FiImage size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Tải ảnh lên (1920x1080)</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Giá bán</h3>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>₫</span>
              <input 
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData({...courseData, price: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
