import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiClock, FiUsers, FiCheckCircle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './CourseCatalog.css';
import { studentService } from '../../services';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'free', 'paid'
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const res = await studentService.getCatalog();
        if (res.data && res.data.success) {
          setCourses(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục môn học", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredCourses = courses.filter(course => {
    // 1. Lọc theo chữ
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Lọc theo Giá (Miễn phí / Trả phí)
    if (filterMode === 'free' && course.price > 0) return false;
    if (filterMode === 'paid' && course.price === 0) return false;

    return matchSearch;
  });

  const handleAction = async (course) => {
    if (course.enrolled) {
      toast.info('Bạn đã tham gia khóa học này rồi!');
      return;
    }

    try {
      if (course.price === 0) {
        // Miễn phí -> Đăng ký luôn
        const res = await studentService.enrollCourse(course.id);
        if (res.data && res.data.success) {
          toast.success(`Đăng ký thành công khóa học: ${course.title}`);
          navigate('/student/my-classes');
        }
      } else {
        // Trả phí -> Mở popup thanh toán
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
      // Giả lập redirect qua VNPAY, sau đó return và enroll
      // User sẽ tích hợp VNPAY Sandbox ở đây sau này
      await new Promise(r => setTimeout(r, 1000)); // giả lập delay loading
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
          <h1>Đăng Ký Môn Học</h1>
          <p>Nâng cấp bản thân với hàng ngàn môn học chất lượng cao từ các chuyên gia hàng đầu.</p>
        </div>

        <div className="catalog-controls">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm môn học, kỹ năng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
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

      <div className="catalog-grid">
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>Đang tải danh mục môn học...</div>
        ) : filteredCourses.map(course => (
          <div key={course.id} className="catalog-card glass-card">
            
            {/* Price Badge */}
            <div className={`price-badge ${course.price === 0 ? 'free' : 'paid'}`}>
              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
            </div>

            <div className="card-image" style={{ backgroundImage: `url(${course.image})` }}>
              <div className="card-level">{course.level}</div>
            </div>
            
            <div className="card-content">
              <div className="card-tags">
                {course.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
              
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">{course.instructor}</p>
              
              <div className="course-stats">
                <div className="stat">
                  <FiStar className="icon-star" />
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
              >
                {course.enrolled ? (
                  <><FiCheckCircle /> Đã tham gia</>
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
          <div className="no-results">
            <p>Không tìm thấy môn học nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalData && (
        <div className="payment-modal-overlay" onClick={() => !isProcessing && setPaymentModalData(null)}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h3>Xác nhận thanh toán</h3>
              <button className="close-btn" onClick={() => !isProcessing && setPaymentModalData(null)}><FiX /></button>
            </div>
            
            <div className="payment-course-info">
              <div className="payment-img-wrapper">
                <img src={paymentModalData.image} alt={paymentModalData.title} />
              </div>
              <div className="payment-course-details">
                <h4>{paymentModalData.title}</h4>
                <p className="payment-price">{paymentModalData.price.toLocaleString()}đ</p>
              </div>
            </div>
            
            <div className="payment-method-section">
              <p className="payment-label">Chọn phương thức thanh toán:</p>
              <div className="payment-option selected">
                <div className="payment-option-logo">
                  <span>VNPAY</span>
                </div>
                <div className="payment-option-text">
                  <strong>Ví VNPAY / Thẻ Ngân Hàng</strong>
                  <span>Sandbox Testing</span>
                </div>
                <div className="payment-option-radio">
                  <div className="radio-inner"></div>
                </div>
              </div>
            </div>

            <div className="payment-actions">
              <button 
                className="btn-cancel-pay" 
                onClick={() => setPaymentModalData(null)}
                disabled={isProcessing}
              >
                Hủy
              </button>
              <button 
                className="btn-confirm-pay" 
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
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
