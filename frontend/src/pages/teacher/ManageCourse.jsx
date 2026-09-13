import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiUploadCloud, FiPlusCircle, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { teacherService } from '../../services';
import InteractiveQuestionModal from './InteractiveQuestionModal';

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    price: 499000,
    category_id: '',
    description: '',
    image_url: ''
  });

  const [categories, setCategories] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [selectedLessonForQuestions, setSelectedLessonForQuestions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await teacherService.getCategories();
        if (catRes.data && catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (id) {
          const res = await teacherService.getCourseDetails(id);
          if (res.data && res.data.success) {
            const { course, lessons } = res.data.data;
            
            setCourseData({
              title: course.name || '',
              subtitle: course.description || '',
              price: course.price || 0,
              category_id: course.category_id || '',
              image_url: course.image_url || ''
            });
            
            const sectionsMap = {};
            lessons.forEach(l => {
              const stitle = l.section_title || 'Chương trình học';
              if (!sectionsMap[stitle]) sectionsMap[stitle] = [];
              sectionsMap[stitle].push({ id: l.id, title: l.title, url: l.content_url });
            });

            const loadedCurriculum = Object.keys(sectionsMap).map((title, i) => ({
              id: Date.now() + i, // Just for React key
              title,
              lectures: sectionsMap[title]
            }));

            setCurriculum(loadedCurriculum.length > 0 ? loadedCurriculum : [
              { id: Date.now(), title: 'Chương trình học', lectures: [] }
            ]);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi khi tải thông tin khóa học');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
  const handleUpdateSectionTitle = (sectionId, title) => {
    setCurriculum(curriculum.map(sec => sec.id === sectionId ? { ...sec, title } : sec));
  };

  const handleRemoveSection = (sectionId) => {
    if (window.confirm('Xóa chương này và tất cả bài giảng bên trong?')) {
      setCurriculum(curriculum.filter(sec => sec.id !== sectionId));
    }
  };

  const handleRemoveLecture = (sectionId, lectureId) => {
    setCurriculum(curriculum.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, lectures: sec.lectures.filter(lec => lec.id !== lectureId) };
      }
      return sec;
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning('Vui lòng chọn ảnh nhỏ hơn 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseData({ ...courseData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
        image_url: courseData.image_url,
        category_id: courseData.category_id,
      };
      
      const res = await teacherService.updateCourse(id, coursePayload);
      
      if (res.data && res.data.success) {
        // 2. Sync Curriculum
        const syncRes = await teacherService.syncCurriculum(id, { curriculum });
        if (syncRes.data && syncRes.data.success) {
          toast.success('Cập nhật khóa học và chương trình thành công!');
        }
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

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Danh mục</label>
                <select 
                  value={courseData.category_id}
                  onChange={(e) => setCourseData({...courseData, category_id: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', background: 'white' }}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
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
                      value={section.title}
                      onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                      style={{ fontSize: '16px', fontWeight: 'bold', padding: '8px', border: '1px solid transparent', background: 'transparent', width: '80%' }}
                    />
                    <button onClick={() => handleRemoveSection(section.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={18} /></button>
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
                          <button onClick={() => handleRemoveLecture(section.id, lec.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '28px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--theme-text-muted)' }}>Video URL:</span>
                          <input 
                            type="text" 
                            value={lec.url || ''}
                            onChange={(e) => handleUpdateLectureUrl(section.id, lec.id, e.target.value)}
                            style={{ border: '1px solid var(--theme-border-color)', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', flex: 1, background: 'var(--theme-bg-main)', color: 'var(--theme-text-main)' }}
                            placeholder="https://..."
                          />
                          {typeof lec.id !== 'string' && lec.id < 1000000000000 && (
                            <button 
                              onClick={() => setSelectedLessonForQuestions(lec)}
                              style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--theme-bg-grad-2)', border: '1px solid var(--theme-border-color)', borderRadius: '4px', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>
                              Quản lý câu hỏi
                            </button>
                          )}
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
            <label style={{ width: '100%', aspectRatio: '16/9', background: courseData.image_url ? `url(${courseData.image_url}) center/cover` : '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden' }}>
              {!courseData.image_url && (
                <>
                  <FiImage size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Tải ảnh lên (1920x1080)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
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

      {selectedLessonForQuestions && (
        <InteractiveQuestionModal 
          lesson={selectedLessonForQuestions} 
          onClose={() => setSelectedLessonForQuestions(null)} 
        />
      )}
    </div>
  );
};

export default ManageCourse;
