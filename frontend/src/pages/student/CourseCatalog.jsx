import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiStar, FiClock, FiUsers, FiCheckCircle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './CourseCatalog.css';
import { studentService } from '../../services';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'free', 'paid'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const res = await studentService.getCatalog();
        if (res.data && res.data.success) {
          const fetchedCourses = res.data.data;
          setCourses(fetchedCourses);
          
          // Extract unique categories (tags)
          const uniqueCats = new Set();
          fetchedCourses.forEach(c => {
            if (c.tags) c.tags.forEach(t => uniqueCats.add(t));
          });
          setCategories(['all', ...Array.from(uniqueCats)]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục môn học", error);
        toast.error("Không thể tải danh mục khóa học");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        course.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCategory = selectedCategory === 'all' || course.tags?.includes(selectedCategory);

    if (!matchCategory) return false;
    if (filterMode === 'free' && course.price > 0) return false;
    if (filterMode === 'paid' && course.price === 0) return false;

    return matchSearch;
  });

  const handleAction = async (course) => {
    if (course.enrolled) {
      toast.info('Bạn đã sở hữu khóa học này rồi!');
      return;
    }

    try {
      if (course.price === 0) {
        const res = await studentService.enrollCourse(course.id);
        if (res.data && res.data.success) {
          toast.success(`Đăng ký thành công khóa học: ${course.title}`);
          navigate('/student/my-classes');
        }
      } else {
        setPaymentModalData(course);
      }
    } catch (error) {
      console.error("Lỗi đăng ký khóa học", error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký khóa học');
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentModalData) return;
    setIsProcessing(true);
    try {
      // Giả lập redirect qua VNPAY Sandbox
      await new Promise(r => setTimeout(r, 1500));
      const res = await studentService.enrollCourse(paymentModalData.id);
      if (res.data && res.data.success) {
        toast.success(`Thanh toán và đăng ký thành công: ${paymentModalData.title}`);
        setPaymentModalData(null);
        navigate('/student/my-classes');
      }
    } catch (error) {
      console.error("Lỗi thanh toán khóa học", error);
      toast.error(error.response?.data?.message || 'Lỗi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="catalog-page fade-in">
      <div className="catalog-header">
        <div className="catalog-title">
          <h1>Khám Phá Khóa Học</h1>
          <p>Nâng cấp bản thân với hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu.</p>
        </div>

        <div className="catalog-controls">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học, kỹ năng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-group" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--gray-200)',
                background: 'rgba(255, 255, 255, 0.7)',
                color: 'var(--gray-700)',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="filter-buttons" style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.7)', padding: '4px', borderRadius: '8px' }}>
              <button 
                className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                Tất cả
              </button>
              <button 
                className={`filter-btn ${filterMode === 'free' ? 'active' : ''}`}
                onClick={() => setFilterMode('free')}
              >
                Miễn phí
              </button>
              <button 
                className={`filter-btn ${filterMode === 'paid' ? 'active' : ''}`}
                onClick={() => setFilterMode('paid')}
              >
                Trả phí
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="catalog-grid">
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>Đang tải danh mục khóa học...</div>
        ) : filteredCourses.map(course => (
          <div key={course.id} className="catalog-card glass-card">
            <div className={`price-badge ${course.price === 0 ? 'free' : 'paid'}`}>
              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
            </div>

            <div className="card-image" style={{ backgroundImage: `url(${course.image})` }}>
              <div className="card-level">{course.level}</div>
            </div>
            
            <div className="card-content">
              <div className="card-tags">
                {course.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
              
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">{course.instructor}</p>
              
              <div className="course-stats">
                <div className="stat">
                  <FiStar className="icon-star" style={{color: '#f59e0b'}} />
                  <span>{course.rating}</span>
                </div>
                <div className="stat">
                  <FiUsers />
                  <span>{course.students.toLocaleString()} HV</span>
                </div>
                <div className="stat">
                  <FiClock />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <button 
                className={`btn-action ${course.enrolled ? 'enrolled' : course.price === 0 ? 'btn-free' : 'btn-buy'}`}
                onClick={() => handleAction(course)}
                disabled={course.enrolled}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: course.enrolled ? 'not-allowed' : 'pointer',
                  background: course.enrolled ? '#e2e8f0' : course.price === 0 ? '#10b981' : '#3b82f6',
                  color: course.enrolled ? '#64748b' : 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {course.enrolled ? (
                  <><FiCheckCircle /> Đã sở hữu</>
                ) : course.price === 0 ? (
                  'Đăng ký học ngay'
                ) : (
                  'Mua khóa học'
                )}
              </button>
            </div>
          </div>
        ))}

        {!isLoading && filteredCourses.length === 0 && (
          <div className="no-results" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--theme-glass-bg)', borderRadius: '12px' }}>
            <p>Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>

      {paymentModalData && (
        <div className="payment-modal-overlay" onClick={() => !isProcessing && setPaymentModalData(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
          <div className="payment-modal glass-card" onClick={e => e.stopPropagation()} style={{background: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '450px'}}>
            <div className="payment-modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 style={{margin: 0, fontSize: '18px'}}>Xác nhận thanh toán</h3>
              <button onClick={() => !isProcessing && setPaymentModalData(null)} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px'}}><FiX /></button>
            </div>
            
            <div className="payment-course-info" style={{display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px'}}>
              <div className="payment-img-wrapper" style={{width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden'}}>
                <img src={paymentModalData.image} alt={paymentModalData.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
              <div className="payment-course-details">
                <h4 style={{margin: '0 0 8px 0', fontSize: '15px'}}>{paymentModalData.title}</h4>
                <p className="payment-price" style={{margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '16px'}}>{paymentModalData.price.toLocaleString()}đ</p>
              </div>
            </div>
            
            <div className="payment-method-section" style={{marginBottom: '24px'}}>
              <p className="payment-label" style={{fontWeight: 600, marginBottom: '12px', fontSize: '14px'}}>Chọn phương thức thanh toán:</p>
              <div className="payment-option selected" style={{display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid #3b82f6', borderRadius: '12px', background: '#eff6ff'}}>
                <div className="payment-option-logo" style={{width: '40px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0ea5e9', marginRight: '12px'}}>
                  VNPAY
                </div>
                <div className="payment-option-text" style={{flex: 1}}>
                  <strong style={{display: 'block', fontSize: '14px'}}>Ví VNPAY / Thẻ Ngân Hàng</strong>
                  <span style={{fontSize: '12px', color: '#64748b'}}>Sandbox Testing</span>
                </div>
                <div className="payment-option-radio" style={{width: '20px', height: '20px', borderRadius: '50%', border: '6px solid #3b82f6', background: 'white'}}></div>
              </div>
            </div>

            <div className="payment-actions" style={{display: 'flex', gap: '12px'}}>
              <button 
                onClick={() => setPaymentModalData(null)}
                disabled={isProcessing}
                style={{flex: 1, padding: '12px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 600, color: '#475569', cursor: 'pointer'}}
              >
                Hủy
              </button>
              <button 
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                style={{flex: 2, padding: '12px', borderRadius: '8px', background: '#3b82f6', border: 'none', fontWeight: 600, color: 'white', cursor: isProcessing ? 'wait' : 'pointer'}}
              >
                {isProcessing ? 'Đang kết nối VNPAY...' : `Thanh toán ${paymentModalData.price.toLocaleString()}đ`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
