import { useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiX, FiCheckCircle, FiClock, FiUsers, FiInfo } from 'react-icons/fi';
import './Registration.css';

// Mock available courses
const initialAvailableCourses = [
  { id: 'IT101', name: 'Lập trình Căn bản', credits: 3, teacher: 'Nguyễn Văn A', schedule: 'T2 (1-3)', slots: 40, maxSlots: 50 },
  { id: 'IT102', name: 'Cấu trúc dữ liệu', credits: 4, teacher: 'Trần Thị B', schedule: 'T3 (4-6)', slots: 50, maxSlots: 50 },
  { id: 'IT201', name: 'Phát triển Web', credits: 3, teacher: 'Lê Văn C', schedule: 'T5 (1-3)', slots: 12, maxSlots: 40 },
  { id: 'ENG101', name: 'Tiếng Anh Giao tiếp', credits: 2, teacher: 'Phạm Thị D', schedule: 'T6 (7-9)', slots: 20, maxSlots: 30 },
  { id: 'MATH101', name: 'Toán Cao cấp', credits: 3, teacher: 'Hoàng Văn E', schedule: 'T4 (1-3)', slots: 45, maxSlots: 60 },
  { id: 'PHY101', name: 'Vật lý Đại cương', credits: 3, teacher: 'Ngô Thị F', schedule: 'T7 (4-6)', slots: 58, maxSlots: 60 },
];

const Registration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState(initialAvailableCourses);
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  const MAX_CREDITS = 24;
  const currentCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

  const handleAddCourse = (course) => {
    if (currentCredits + course.credits > MAX_CREDITS) {
      alert('Vượt quá số tín chỉ tối đa cho phép (24 tín chỉ)!');
      return;
    }
    if (selectedCourses.find(c => c.id === course.id)) {
      return; // Already added
    }
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
  };

  const handleRegister = () => {
    if (selectedCourses.length === 0) return;
    alert('Đăng ký thành công ' + selectedCourses.length + ' môn học!');
    // In a real app, this would make an API call, then update state/redirect
  };

  const filteredCourses = availableCourses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registration-page animate-scaleIn">
      <div className="registration-header">
        <h1>Đăng ký môn học</h1>
        <p>Học kỳ 1 - Năm học 2026-2027</p>
      </div>

      <div className="registration-layout">
        {/* Left Side: Course List */}
        <div className="course-list-section glass-card">
          <div className="section-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm mã môn, tên môn..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <FiFilter /> Lọc
            </button>
          </div>

          <div className="table-responsive">
            <table className="course-table">
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn học</th>
                  <th>TC</th>
                  <th>Giảng viên</th>
                  <th>Lịch học</th>
                  <th>Sĩ số</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => {
                  const isFull = course.slots >= course.maxSlots;
                  const isSelected = selectedCourses.some(c => c.id === course.id);
                  
                  return (
                    <tr key={course.id} className={`${isFull ? 'row-full' : ''} ${isSelected ? 'row-selected' : ''}`}>
                      <td className="font-semibold">{course.id}</td>
                      <td>{course.name}</td>
                      <td className="text-center">{course.credits}</td>
                      <td>{course.teacher}</td>
                      <td>
                        <div className="flex-center gap-1">
                          <FiClock className="text-gray" /> {course.schedule}
                        </div>
                      </td>
                      <td>
                        <div className={`slots-badge ${isFull ? 'danger' : 'success'}`}>
                          <FiUsers /> {course.slots}/{course.maxSlots}
                        </div>
                      </td>
                      <td>
                        {isSelected ? (
                          <span className="status-badge success-light"><FiCheckCircle /> Đã chọn</span>
                        ) : (
                          <button 
                            className={`action-btn-add ${isFull ? 'disabled' : ''}`}
                            onClick={() => !isFull && handleAddCourse(course)}
                            disabled={isFull}
                          >
                            <FiPlus /> {isFull ? 'Đã đầy' : 'Chọn'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray">
                      Không tìm thấy môn học nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Selected Cart */}
        <div className="registration-cart-section">
          <div className="glass-card cart-card sticky-sidebar">
            <div className="cart-header">
              <h2>Môn học đã chọn</h2>
              <span className="course-count">{selectedCourses.length} môn</span>
            </div>

            <div className="cart-body">
              {selectedCourses.length === 0 ? (
                <div className="cart-empty">
                  <FiInfo size={32} className="text-gray-light" />
                  <p>Chưa chọn môn học nào.<br/>Hãy chọn môn từ danh sách bên trái.</p>
                </div>
              ) : (
                <ul className="selected-list">
                  {selectedCourses.map(course => (
                    <li key={course.id} className="selected-item animate-slideIn">
                      <div className="selected-item-info">
                        <h4>{course.name}</h4>
                        <span className="item-meta">{course.id} • {course.credits} TC</span>
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => handleRemoveCourse(course.id)}
                        title="Bỏ chọn"
                      >
                        <FiX />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="cart-footer">
              <div className="credits-summary">
                <span>Tổng số tín chỉ:</span>
                <span className={`credits-total ${currentCredits > MAX_CREDITS ? 'text-danger' : 'text-info'}`}>
                  {currentCredits} / {MAX_CREDITS}
                </span>
              </div>
              <button 
                className="btn-register"
                disabled={selectedCourses.length === 0}
                onClick={handleRegister}
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
