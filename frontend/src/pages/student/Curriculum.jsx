import { useState } from 'react';
import { FiBook, FiCheckCircle, FiClock, FiFilter, FiLayers } from 'react-icons/fi';
import './Curriculum.css';

const curriculumData = {
  'Năm 1 - HK1': [
    { id: 'IT101', name: 'Nhập môn Lập trình', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'MATH101', name: 'Toán Cao cấp 1', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'ENG101', name: 'Tiếng Anh 1', credits: 2, type: 'Bắt buộc', status: 'completed' },
    { id: 'PHY101', name: 'Vật lý Đại cương', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'GEN101', name: 'Triết học Mác-Lênin', credits: 3, type: 'Bắt buộc', status: 'completed' },
  ],
  'Năm 1 - HK2': [
    { id: 'IT102', name: 'Cấu trúc Dữ liệu & Giải thuật', credits: 4, type: 'Bắt buộc', status: 'completed' },
    { id: 'MATH102', name: 'Toán Cao cấp 2', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'ENG102', name: 'Tiếng Anh 2', credits: 2, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT103', name: 'Kỹ thuật Lập trình', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'GEN102', name: 'Kinh tế Chính trị', credits: 2, type: 'Bắt buộc', status: 'completed' },
  ],
  'Năm 2 - HK1': [
    { id: 'IT201', name: 'Cơ sở Dữ liệu', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT202', name: 'Mạng Máy tính', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT203', name: 'Hệ Điều hành', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'MATH201', name: 'Xác suất Thống kê', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'ENG201', name: 'Tiếng Anh chuyên ngành', credits: 2, type: 'Bắt buộc', status: 'completed' },
  ],
  'Năm 2 - HK2': [
    { id: 'IT204', name: 'Phát triển Ứng dụng Web', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT205', name: 'Kiến trúc Máy tính', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT206', name: 'Công nghệ Phần mềm', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT207', name: 'Trí tuệ Nhân tạo', credits: 3, type: 'Tự chọn', status: 'completed' },
    { id: 'GEN201', name: 'Tư tưởng Hồ Chí Minh', credits: 2, type: 'Bắt buộc', status: 'completed' },
  ],
  'Năm 3 - HK1': [
    { id: 'IT301', name: 'Phát triển Ứng dụng Di động', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT302', name: 'An toàn Thông tin', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT303', name: 'Phân tích Thiết kế Hệ thống', credits: 3, type: 'Bắt buộc', status: 'completed' },
    { id: 'IT304', name: 'Học Máy', credits: 3, type: 'Tự chọn', status: 'completed' },
    { id: 'IT305', name: 'DevOps & CI/CD', credits: 2, type: 'Tự chọn', status: 'completed' },
  ],
  'Năm 3 - HK2': [
    { id: 'IT306', name: 'Lập trình Web Nâng cao', credits: 3, type: 'Bắt buộc', status: 'studying' },
    { id: 'IT307', name: 'Hệ quản trị CSDL Nâng cao', credits: 3, type: 'Bắt buộc', status: 'studying' },
    { id: 'IT308', name: 'Điện toán Đám mây', credits: 3, type: 'Tự chọn', status: 'studying' },
    { id: 'IT309', name: 'Kiểm thử Phần mềm', credits: 3, type: 'Bắt buộc', status: 'studying' },
    { id: 'GEN301', name: 'Kỹ năng Mềm', credits: 2, type: 'Bắt buộc', status: 'studying' },
  ],
  'Năm 4 - HK1': [
    { id: 'IT401', name: 'Quản lý Dự án CNTT', credits: 3, type: 'Bắt buộc', status: 'pending' },
    { id: 'IT402', name: 'Blockchain & Ứng dụng', credits: 3, type: 'Tự chọn', status: 'pending' },
    { id: 'IT403', name: 'Thực tập Doanh nghiệp', credits: 4, type: 'Bắt buộc', status: 'pending' },
    { id: 'IT404', name: 'Seminar Chuyên đề', credits: 2, type: 'Tự chọn', status: 'pending' },
  ],
  'Năm 4 - HK2': [
    { id: 'IT405', name: 'Đồ án Tốt nghiệp', credits: 10, type: 'Bắt buộc', status: 'pending' },
  ],
};

const semesterKeys = Object.keys(curriculumData);

const Curriculum = () => {
  const [filterYear, setFilterYear] = useState('Tất cả');
  const years = ['Tất cả', 'Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'];

  const filteredSemesters = filterYear === 'Tất cả'
    ? semesterKeys
    : semesterKeys.filter(s => s.startsWith(filterYear));

  const totalCredits = semesterKeys.reduce((sum, key) =>
    sum + curriculumData[key].reduce((s, c) => s + c.credits, 0), 0);
  const completedCredits = semesterKeys.reduce((sum, key) =>
    sum + curriculumData[key].filter(c => c.status === 'completed').reduce((s, c) => s + c.credits, 0), 0);
  const studyingCredits = semesterKeys.reduce((sum, key) =>
    sum + curriculumData[key].filter(c => c.status === 'studying').reduce((s, c) => s + c.credits, 0), 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="status-icon completed" />;
      case 'studying': return <FiClock className="status-icon studying" />;
      default: return <FiBook className="status-icon pending" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'studying': return 'Đang học';
      default: return 'Chưa học';
    }
  };

  return (
    <div className="curriculum-page animate-scaleIn">
      <div className="curriculum-header">
        <div>
          <h1>Chương trình khung</h1>
          <p>Chương trình đào tạo ngành Công nghệ Thông tin — Khóa 2023-2027</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="curriculum-summary">
        <div className="summary-card glass-card card-total">
          <FiLayers className="summary-icon" />
          <div>
            <span className="summary-label">Tổng tín chỉ</span>
            <span className="summary-value">{totalCredits}</span>
          </div>
        </div>
        <div className="summary-card glass-card card-done">
          <FiCheckCircle className="summary-icon" />
          <div>
            <span className="summary-label">Đã hoàn thành</span>
            <span className="summary-value">{completedCredits}</span>
          </div>
        </div>
        <div className="summary-card glass-card card-studying">
          <FiClock className="summary-icon" />
          <div>
            <span className="summary-label">Đang học</span>
            <span className="summary-value">{studyingCredits}</span>
          </div>
        </div>
        <div className="summary-card glass-card card-remain">
          <FiBook className="summary-icon" />
          <div>
            <span className="summary-label">Còn lại</span>
            <span className="summary-value">{totalCredits - completedCredits - studyingCredits}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="curriculum-filter glass-card">
        <FiFilter />
        <span>Lọc theo:</span>
        {years.map(y => (
          <button
            key={y}
            className={`filter-btn ${filterYear === y ? 'active' : ''}`}
            onClick={() => setFilterYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Semester blocks */}
      {filteredSemesters.map(semester => {
        const courses = curriculumData[semester];
        const semCredits = courses.reduce((s, c) => s + c.credits, 0);
        const semDone = courses.filter(c => c.status === 'completed').length;

        return (
          <div key={semester} className="semester-block glass-card">
            <div className="semester-header">
              <h2 className="semester-title">{semester}</h2>
              <div className="semester-meta">
                <span className="semester-credits">{semCredits} tín chỉ</span>
                <span className="semester-progress">{semDone}/{courses.length} môn hoàn thành</span>
              </div>
            </div>
            <table className="curriculum-table">
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn học</th>
                  <th>Tín chỉ</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className={`row-${course.status}`}>
                    <td className="cell-code">{course.id}</td>
                    <td className="cell-name">{course.name}</td>
                    <td className="cell-credits">{course.credits}</td>
                    <td>
                      <span className={`type-badge ${course.type === 'Bắt buộc' ? 'required' : 'elective'}`}>
                        {course.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${course.status}`}>
                        {getStatusIcon(course.status)}
                        {getStatusLabel(course.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Curriculum;
