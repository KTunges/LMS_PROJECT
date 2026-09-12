import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiUploadCloud, FiPlusCircle, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { teacherService } from '../../services';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    price: 499000,
    category: 'Lập trình',
    description: ''
  });

  const [curriculum, setCurriculum] = useState([
    { id: 1, title: 'Chương 1: Giới thiệu chung', lectures: [{ id: 101, title: 'Bài 1: Tổng quan khóa học' }] }
  ]);

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
          lectures: [...sec.lectures, { id: Date.now(), title: `Bài ${sec.lectures.length + 1}: Tên bài mới` }]
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
      // 1. Create Course
      const coursePayload = {
        name: courseData.title,
        description: courseData.subtitle,
        price: courseData.price,
      };
      
      const res = await teacherService.createCourse(coursePayload);
      
      if (res.data && res.data.success) {
        const courseId = res.data.data.course.id;
        
        // 2. Create Lessons
        // Flatten curriculum into a list of lessons
        let orderIndex = 1;
        for (const section of curriculum) {
          for (const lec of section.lectures) {
            await teacherService.addLesson(courseId, {
              title: `${section.title} - ${lec.title}`,
              lesson_type: 'video',
              content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default for testing
              duration: '10:00',
              order_index: orderIndex++
            });
          }
        }
        
        toast.success('Lưu khóa học và giáo trình thành công!');
        setTimeout(() => {
          navigate('/portal-giang-vien/courses');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu khóa học');
    }
  };

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
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Tạo Khóa học mới</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px' }}>
            <FiSave /> Lưu nháp
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px' }}>
            <FiCheckCircle /> Xuất bản Khóa học
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
                  placeholder="Vd: Lập trình ReactJS Thực chiến cho người mới bắt đầu..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Mô tả ngắn gọn</label>
                <textarea 
                  rows={3}
                  value={courseData.subtitle}
                  onChange={(e) => setCourseData({...courseData, subtitle: e.target.value})}
                  placeholder="Tóm tắt nội dung khóa học trong 1-2 câu..."
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
                      <div key={lec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FiUploadCloud color="#3b82f6" />
                          <input 
                            type="text" 
                            defaultValue={lec.title}
                            style={{ border: 'none', fontSize: '14px', width: '300px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>+ Thêm Video</button>
                          <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleAddLecture(section.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '8px', padding: '8px 0' }}
                    >
                      <FiPlusCircle /> Thêm bài giảng
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddSection}
                style={{ width: '100%', padding: '16px', background: 'white', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <FiPlusCircle /> Thêm Chương Mới
              </button>
            </div>
          </div>
        </div>

        {/* Cột phải: Settings & Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Ảnh thu nhỏ (Thumbnail)</h3>
            <div style={{ width: '100%', height: '180px', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <FiImage size={32} color="#94a3b8" />
              <span style={{ fontSize: '13px', color: '#64748b' }}>Tải ảnh lên (Khuyên dùng: 1280x720)</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Giá bán & Danh mục</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Giá bán (VND)</label>
                <input 
                  type="number" 
                  value={courseData.price}
                  onChange={(e) => setCourseData({...courseData, price: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Danh mục</label>
                <select 
                  value={courseData.category}
                  onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: 'white' }}
                >
                  <option>Lập trình</option>
                  <option>Thiết kế UI/UX</option>
                  <option>Marketing</option>
                  <option>Ngoại ngữ</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
