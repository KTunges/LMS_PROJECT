import { useState, useEffect } from 'react';
import { FiPrinter, FiMoreVertical, FiXCircle, FiCheckCircle, FiBookOpen, FiFilter, FiCheck } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import './Registration.css';

const waitingCourses = [
  { id: '1001077345', name: 'Đồ án tốt nghiệp', credits: 8, isRequired: false, prerequisites: 'Hoàn thành 120 TC' },
  { id: '1001077346', name: 'Chuyên đề tốt nghiệp', credits: 3, isRequired: true, prerequisites: '' },
  { id: '1001077347', name: 'Thực tập doanh nghiệp', credits: 4, isRequired: true, prerequisites: 'Anh văn 4' }
];

const registeredCourses = [
  { id: '100107734601', name: 'Chuyên đề tốt nghiệp Công nghệ phần mềm 1', classCode: '22BITV01', credits: 3, group: '-', fee: '2.850.000', deadline: '18/05/2026', paid: true, status: 'Đăng ký mới', date: '18/04/2026', classStatus: 'Đã khóa' },
  { id: '100107734901', name: 'Chuyên đề tốt nghiệp Công nghệ phần mềm 2', classCode: '22BITV01', credits: 3, group: '-', fee: '2.850.000', deadline: '18/05/2026', paid: true, status: 'Đăng ký mới', date: '18/04/2026', classStatus: 'Đã khóa' },
  { id: '100107734701', name: 'Chuyên đề tốt nghiệp Công nghệ phần mềm 3', classCode: '22BITV01', credits: 2, group: '-', fee: '1.900.000', deadline: '18/05/2026', paid: true, status: 'Đăng ký mới', date: '18/04/2026', classStatus: 'Đã khóa' }
];

const Registration = () => {
  const [studyType, setStudyType] = useState('new');
  const [selectedWaiting, setSelectedWaiting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalFee = "7.600.000";

  return (
    <div className="reg-page">
      <div className="reg-header-wrapper">
        <div className="reg-title-area">
          <h1>Đăng ký học phần</h1>
          <p>Lựa chọn môn học và quản lý học phần trong kỳ</p>
        </div>

        <div className="reg-filters glass-card">
          <select className="reg-modern-select">
            <option>HK 3 - Năm học 2025-2026</option>
            <option>HK 2 - Năm học 2025-2026</option>
          </select>
          
          <div className="reg-radio-pills">
            {['new', 'retake', 'improve'].map(type => (
              <label key={type} className={`reg-pill ${studyType === type ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="studyType" 
                  value={type} 
                  checked={studyType === type}
                  onChange={(e) => setStudyType(e.target.value)} 
                  className="hidden-radio"
                />
                {type === 'new' ? 'Học mới' : type === 'retake' ? 'Học lại' : 'Học cải thiện'}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Waiting Courses Section */}
      <div className="reg-section glass-card">
        {isLoading ? (
          <SkeletonTable rows={4} cols={7} />
        ) : (
          <>
            <div className="reg-section-header">
              <div className="reg-section-title">
                <div className="icon-wrapper bg-blue-light">
                  <FiBookOpen className="text-info" />
                </div>
                <h2>Môn học/học phần đang chờ đăng ký</h2>
              </div>
            </div>
            
            <div className="reg-table-container">
              <table className="reg-modern-table">
                <thead>
                  <tr>
                    <th width="50">Chọn</th>
                    <th width="60">STT</th>
                    <th width="150">Mã học phần</th>
                    <th>Tên môn học/học phần</th>
                    <th width="80" className="text-center">Số TC</th>
                    <th width="100" className="text-center">Bắt buộc</th>
                    <th width="250">Điều kiện (Học trước/Tiên quyết)</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingCourses.map((course, index) => (
                    <tr key={course.id} className={selectedWaiting === course.id ? 'row-selected' : ''}>
                      <td className="text-center">
                        <label className="custom-radio">
                          <input 
                            type="radio" 
                            name="waitingCourse" 
                            checked={selectedWaiting === course.id}
                            onChange={() => setSelectedWaiting(course.id)}
                          />
                          <span className="radio-mark"></span>
                        </label>
                      </td>
                      <td className="text-center text-gray">{index + 1}</td>
                      <td className="font-semibold text-info">{course.id}</td>
                      <td className="font-medium">{course.name}</td>
                      <td className="text-center">
                        <span className="tc-badge">{course.credits}</span>
                      </td>
                      <td className="text-center">
                        {course.isRequired 
                          ? <FiCheckCircle className="icon-required text-success" /> 
                          : <FiXCircle className="icon-required text-danger-light" />}
                      </td>
                      <td className="text-sm text-gray">{course.prerequisites || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Registered Courses Section */}
      <div className="reg-section glass-card mt-6">
        <div className="reg-section-header">
          <div className="reg-section-title">
            <div className="icon-wrapper bg-green-light">
              <FiCheck className="text-success" />
            </div>
            <h2>Lớp học phần đã đăng ký trong học kỳ này</h2>
          </div>
          <button className="btn-modern-print">
            <FiPrinter /> In danh sách
          </button>
        </div>

        <div className="reg-table-container">
          <table className="reg-modern-table">
            <thead>
              <tr>
                <th width="60" className="text-center">Menu</th>
                <th width="50">STT</th>
                <th width="120">Mã lớp HP</th>
                <th>Tên môn học/HP</th>
                <th width="120">Lớp dự kiến</th>
                <th width="60" className="text-center">TC</th>
                <th width="80" className="text-center">Nhóm</th>
                <th width="120" className="text-right">Học phí (VNĐ)</th>
                <th width="110" className="text-center">Hạn nộp</th>
                <th width="60" className="text-center">Thu</th>
                <th width="130">Trạng thái</th>
                <th width="100" className="text-center">Ngày ĐK</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.map((course, index) => (
                <tr key={course.id}>
                  <td className="text-center">
                    <button className="btn-icon-more">
                      <FiMoreVertical />
                    </button>
                  </td>
                  <td className="text-center text-gray">{index + 1}</td>
                  <td className="font-semibold">{course.id}</td>
                  <td className="font-medium">{course.name}</td>
                  <td>{course.classCode}</td>
                  <td className="text-center">
                    <span className="tc-badge">{course.credits}</span>
                  </td>
                  <td className="text-center text-gray">{course.group}</td>
                  <td className="text-right font-medium">{course.fee}</td>
                  <td className="text-center text-sm text-gray">{course.deadline}</td>
                  <td className="text-center">
                    {course.paid ? (
                      <div className="paid-badge">
                        <FiCheck />
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <span className="status-pill status-new">{course.status}</span>
                  </td>
                  <td className="text-center text-sm text-gray">{course.date}</td>
                </tr>
              ))}
              
              {/* Summary Row */}
              <tr className="summary-row">
                <td colSpan="5" className="text-right font-bold uppercase text-gray-dark">
                  Tổng cộng:
                </td>
                <td className="text-center font-bold text-info text-lg">
                  {totalCredits}
                </td>
                <td></td>
                <td className="text-right font-bold text-success text-lg">
                  {totalFee}
                </td>
                <td colSpan="4">
                  <span className="text-sm text-gray ml-2">(Đã bao gồm các khoản phí bắt buộc)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registration;
