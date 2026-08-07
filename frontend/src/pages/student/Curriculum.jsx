import React, { useState, Fragment } from 'react';
import { FiPrinter, FiMaximize2, FiCheckCircle, FiXCircle, FiFileText, FiChevronsDown, FiChevronsUp } from 'react-icons/fi';
import './Curriculum.css';

const curriculumData = [
  {
    semester: 1,
    totalCredits: 14,
    isOpen: true,
    groups: [
      {
        name: 'Học phần bắt buộc',
        credits: 14,
        courses: [
          { id: '1001070006', name: 'Kỹ năng giao tiếp (HP1)', type: '', tc: 2, lt: 30, th: 0, groupOption: 0, groupReq: '', passed: true },
          { id: '1001074618', name: 'Dịch vụ Hành chính', type: '', tc: 3, lt: 45, th: 0, groupOption: 0, groupReq: '', passed: true },
          { id: '1001074673', name: 'Công nghệ thông tin', type: '', tc: 3, lt: 0, th: 90, groupOption: 0, groupReq: '', passed: true },
          { id: '1001074730', name: 'Tiếng Anh 1', type: '', tc: 6, lt: 60, th: 60, groupOption: 0, groupReq: '', passed: true },
        ]
      }
    ]
  },
  { semester: 2, totalCredits: 15, isOpen: false, groups: [] },
  { semester: 3, totalCredits: 14, isOpen: false, groups: [] },
  { semester: 4, totalCredits: 16, isOpen: false, groups: [] },
  { semester: 5, totalCredits: 17, isOpen: false, groups: [] },
  { semester: 6, totalCredits: 14, isOpen: false, groups: [] },
  { semester: 7, totalCredits: 13, isOpen: false, groups: [] },
  { semester: 8, totalCredits: 15, isOpen: false, groups: [] },
  { semester: 9, totalCredits: 12, isOpen: false, groups: [] },
  { semester: 10, totalCredits: 9, isOpen: false, groups: [] },
  { semester: 11, totalCredits: 8, isOpen: false, groups: [] },
  { semester: 12, totalCredits: 8, isOpen: false, groups: [] },
];

const Curriculum = () => {
  const [semesters, setSemesters] = useState(curriculumData);

  const toggleSemester = (index) => {
    const newData = [...semesters];
    newData[index].isOpen = !newData[index].isOpen;
    setSemesters(newData);
  };

  const toggleAllSemesters = () => {
    const allOpen = semesters.every(sem => sem.isOpen);
    const newData = semesters.map(sem => ({ ...sem, isOpen: !allOpen }));
    setSemesters(newData);
  };

  const isAllOpen = semesters.every(sem => sem.isOpen);

  return (
    <div className="curriculum-page animate-scaleIn">
      <div className="curriculum-header">
        <div className="curriculum-title">
          <h1>Chương trình khung</h1>
          <p>Khung chương trình đào tạo tiêu chuẩn toàn khóa học</p>
        </div>
        
        <div className="curriculum-actions">
          <button className="btn-curr-action">
            <FiPrinter /> In
          </button>
          <button 
            className="btn-curr-action btn-icon-only"
            onClick={toggleAllSemesters}
            title={isAllOpen ? "Thu gọn tất cả" : "Mở rộng tất cả"}
          >
            {isAllOpen ? <FiChevronsUp /> : <FiChevronsDown />}
          </button>
          <button className="btn-curr-action btn-icon-only">
            <FiMaximize2 />
          </button>
        </div>
      </div>

      <div className="curriculum-content glass-card">
        <div className="table-responsive">
          <table className="curr-table">
            <thead>
              <tr>
                <th width="50">STT</th>
                <th>Tên môn học/Học phần</th>
                <th width="120">Mã Học phần</th>
                <th width="100">Học phần</th>
                <th width="60">Số TC</th>
                <th width="80">Số tiết LT</th>
                <th width="80">Số tiết TH</th>
                <th width="80">Nhóm tự chọn</th>
                <th width="120">Số TC bắt buộc của nhóm</th>
                <th width="60">Đạt</th>
                <th width="100">Đề cương</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((sem, sIndex) => (
                <Fragment key={`sem-${sem.semester}`}>
                  {/* Semester Header Row */}
                  <tr 
                    className={`curr-semester-row ${sem.isOpen ? 'open' : ''}`}
                    onClick={() => toggleSemester(sIndex)}
                  >
                    <td colSpan="4" className="semester-name">
                      Học kỳ {sem.semester}
                    </td>
                    <td className="text-center font-bold text-info">
                      <span className="tc-badge-blue">{sem.totalCredits}</span>
                    </td>
                    <td colSpan="6"></td>
                  </tr>

                  {/* Groups and Courses */}
                  {sem.isOpen && sem.groups.map((group, gIndex) => (
                    <Fragment key={`group-${sem.semester}-${gIndex}`}>
                      {/* Group Header */}
                      <tr className="curr-group-row">
                        <td colSpan="4" className="group-name">
                          {group.name}
                        </td>
                        <td className="text-center font-bold text-info">
                          <span className="tc-badge-blue">{group.credits}</span>
                        </td>
                        <td colSpan="6"></td>
                      </tr>

                      {/* Course Rows */}
                      {group.courses.map((course, cIndex) => (
                        <tr key={course.id} className="curr-course-row learned-course">
                          <td className="text-center text-gray">{cIndex + 1}</td>
                          <td className="font-medium">{course.name}</td>
                          <td className="text-center font-semibold text-gray-dark">{course.id}</td>
                          <td className="text-center">{course.type}</td>
                          <td className="text-center font-semibold">{course.tc}</td>
                          <td className="text-center">{course.lt}</td>
                          <td className="text-center">{course.th}</td>
                          <td className="text-center">{course.groupOption}</td>
                          <td className="text-center">{course.groupReq}</td>
                          <td className="text-center">
                            {course.passed ? (
                              <FiCheckCircle className="icon-passed" />
                            ) : (
                              <FiXCircle className="icon-failed" />
                            )}
                          </td>
                          <td className="text-center">
                            <a href="#" className="link-outline">
                              <FiFileText /> Xem
                            </a>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              ))}

              {/* Summary Footer */}
              <tr className="curr-summary-row">
                <td colSpan="4" className="summary-label">Tổng TC yêu cầu</td>
                <td className="summary-value">155</td>
                <td colSpan="6"></td>
              </tr>
              <tr className="curr-summary-row">
                <td colSpan="4" className="summary-label">Tổng TC bắt buộc</td>
                <td className="summary-value">147</td>
                <td colSpan="6"></td>
              </tr>
              <tr className="curr-summary-row">
                <td colSpan="4" className="summary-label">Tổng TC tự chọn</td>
                <td className="summary-value">8</td>
                <td colSpan="6"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="curr-legend">
          <p className="curr-note">
            <em>Ghi chú: Những môn học/Học phần có dấu <strong>*</strong> không được tính vào Trung bình chung tích lũy</em>
          </p>
          
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-box learned"></div>
              <span>Môn học/Học phần đã (hoặc đang) học</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unlearned"></div>
              <span>Môn học sinh viên chưa đăng ký học tập</span>
            </div>
            <div className="legend-item">
              <FiCheckCircle className="icon-passed" />
              <span>Đạt</span>
            </div>
            <div className="legend-item">
              <FiXCircle className="icon-failed" />
              <span>Không đạt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
