import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import './CourseCatalog.css';

const MOCK_CATALOG = [
  {
    id: 101,
    title: 'Lập trình Web Frontend Cơ bản',
    instructor: 'TS. Nguyễn Văn A',
    rating: 4.8,
    students: 1250,
    duration: '4 tuần',
    price: 0,
    level: 'Cơ bản',
    tags: ['HTML', 'CSS', 'JS'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
    enrolled: false
  },
  {
    id: 102,
    title: 'Luyện thi IELTS Target 7.0+',
    instructor: 'ThS. Trần Thị B',
    rating: 4.9,
    students: 3420,
    duration: '12 tuần',
    price: 599000,
    level: 'Nâng cao',
    tags: ['IELTS', 'Tiếng Anh'],
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
    enrolled: false
  },
  {
    id: 103,
    title: 'Trí tuệ nhân tạo (AI) Thực chiến',
    instructor: 'PGS.TS Lê Văn C',
    rating: 4.7,
    students: 850,
    duration: '8 tuần',
    price: 899000,
    level: 'Chuyên gia',
    tags: ['AI', 'Python'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400',
    enrolled: false
  },
  {
    id: 104,
    title: 'Làm chủ Figma trong 7 ngày',
    instructor: 'Designer Phạm D',
    rating: 4.9,
    students: 5600,
    duration: '1 tuần',
    price: 0,
    level: 'Cơ bản',
    tags: ['Design', 'UI/UX'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400',
    enrolled: false
  },
  {
    id: 105,
    title: 'Hệ quản trị Cơ sở dữ liệu',
    instructor: 'ThS. Trần Thị B',
    rating: 4.6,
    students: 2100,
    duration: '6 tuần',
    price: 299000,
    level: 'Trung cấp',
    tags: ['SQL', 'Database'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    enrolled: true
  }
];

const CourseCatalog = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'free', 'paid'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = MOCK_CATALOG.filter(course => {
    // 1. Lọc theo chữ
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Lọc theo Giá (Miễn phí / Trả phí)
    if (filterMode === 'free' && course.price > 0) return false;
    if (filterMode === 'paid' && course.price === 0) return false;

    return matchSearch;
  });

  const handleAction = (course) => {
    if (course.enrolled) {
      alert('Bạn đã tham gia khóa học này rồi!');
      return;
    }

    if (course.price === 0) {
      // Free course -> Enroll directly
      alert(`Đăng ký thành công môn học miễn phí:\n${course.title}`);
      // Thực tế sẽ gọi API đăng ký, sau đó navigate về MyClasses
    } else {
      // Paid course -> Redirect to payment / Checkout
      const confirmBuy = window.confirm(`Thanh toán ${course.price.toLocaleString()}đ để đăng ký môn học:\n${course.title}?`);
      if (confirmBuy) {
        alert('Chuyển hướng đến Cổng thanh toán VNPay/Momo...');
      }
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
        {filteredCourses.map(course => (
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

        {filteredCourses.length === 0 && (
          <div className="no-results">
            <p>Không tìm thấy môn học nào phù hợp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseCatalog;
