import React, { useState, useEffect, Fragment } from 'react';
import { FiPrinter, FiMaximize2, FiCheckCircle, FiXCircle, FiFileText, FiChevronsDown, FiChevronsUp } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { curriculumService } from '../../services';
import './Curriculum.css';

const Curriculum = () => {
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await curriculumService.getMyCurriculum();
        // Backend returns an array of semesters, we need to map them to the UI state shape
        // including the 'isOpen' property
        const data = response.data || [];
        setSemesters(data.map(sem => ({ ...sem, isOpen: true })));
      } catch (error) {
        console.error('Error fetching curriculum:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

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

  // Compute overall summary
  const totalRequiredCredits = semesters.reduce((sum, sem) => sum + (sem.groups[0]?.credits || 0), 0);
  const totalElectiveCredits = semesters.reduce((sum, sem) => sum + (sem.groups[1]?.credits || 0), 0);
  const totalCredits = totalRequiredCredits + totalElectiveCredits;

  return (
    <div className="curriculum-page">
      <div className="curriculum-header">
        <div className="curriculum-title">
          <h1>Chương trình khung</h1>
          <p>Khung chương trình đào tạo tiêu chuẩn toàn khóa học theo Chuyên ngành của bạn</p>
        </div>
        
        <div className="curriculum-actions">
          <button className="btn-curr-action" onClick={() => window.print()}>
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
        {isLoading ? (
          <SkeletonTable rows={4} cols={3} />
        ) : (
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
                {semesters.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center text-gray py-4">Chưa có dữ liệu chương trình khung cho chuyên ngành của bạn.</td>
                  </tr>
                ) : semesters.map((sem, sIndex) => (
                  <Fragment key={`sem-${sem.semester}`}>
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

                    {sem.isOpen && sem.groups.map((group, gIndex) => (
                      <Fragment key={`group-${sem.semester}-${gIndex}`}>
                        <tr className="curr-group-row">
                          <td colSpan="4" className="group-name">
                            {group.name}
                          </td>
                          <td className="text-center font-bold text-info">
                            <span className="tc-badge-blue">{group.credits}</span>
                          </td>
                          <td colSpan="6"></td>
                        </tr>

                        {group.courses.map((course, cIndex) => {
                          const statusClass = course.status === 'passed' || course.status === 'learning' ? 'learned-course' : '';
                          return (
                            <tr key={course.id} className={`curr-course-row ${statusClass}`}>
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
                                ) : course.status === 'failed' ? (
                                  <FiXCircle className="icon-failed" />
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td className="text-center">
                                <a href="#" className="link-outline" onClick={(e) => e.preventDefault()}>
                                  <FiFileText /> Xem
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}

                <tr className="curr-summary-row">
                  <td colSpan="4" className="summary-label">Tổng TC yêu cầu</td>
                  <td className="summary-value">{totalCredits}</td>
                  <td colSpan="6"></td>
                </tr>
                <tr className="curr-summary-row">
                  <td colSpan="4" className="summary-label">Tổng TC bắt buộc</td>
                  <td className="summary-value">{totalRequiredCredits}</td>
                  <td colSpan="6"></td>
                </tr>
                <tr className="curr-summary-row">
                  <td colSpan="4" className="summary-label">Tổng TC tự chọn</td>
                  <td className="summary-value">{totalElectiveCredits}</td>
                  <td colSpan="6"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

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
