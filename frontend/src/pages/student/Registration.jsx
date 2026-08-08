import { useState, useEffect } from 'react';
import { FiPrinter, FiXCircle, FiCheckCircle, FiBookOpen, FiCheck } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { courseService } from '../../services';
import './Registration.css';

const Registration = () => {
  const [studyType, setStudyType] = useState('new');
  const [selectedWaiting, setSelectedWaiting] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [availableRes, enrolledRes] = await Promise.all([
        courseService.getAvailableClasses(),
        courseService.getMyClasses()
      ]);
      setAvailableClasses(availableRes.data || []);
      setRegisteredClasses(enrolledRes.data || []);
    } catch (error) {
      console.error('Error fetching registration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async () => {
    if (!selectedWaiting) return;
    try {
      await courseService.enrollClass(selectedWaiting);
      alert('Đăng ký thành công!');
      setSelectedWaiting(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  const handleCancel = async (classId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học phần này?')) return;
    try {
      await courseService.cancelEnrollment(classId);
      alert('Hủy đăng ký thành công!');
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Hủy thất bại!');
    }
  };

  const totalCredits = registeredClasses.reduce((sum, enrollment) => sum + (enrollment.class?.course?.credits || 0), 0);
  // Default fee assumption: 950.000 VNĐ per credit
  const feePerCredit = 950000;
  const totalFee = (totalCredits * feePerCredit).toLocaleString('vi-VN');

  return (
    <div className="reg-page">
      <div className="reg-header-wrapper">
        <div className="reg-title-area">
          <h1>Đăng ký học phần</h1>
          <p>Lựa chọn môn học và quản lý học phần trong kỳ</p>
        </div>

        <div className="reg-filters glass-card">
          <select className="reg-modern-select">
            <option>HK 1 - Năm học 2026-2027</option>
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
                <h2>Lớp học phần đang mở chờ đăng ký</h2>
              </div>
              <button 
                className="btn-primary"
                onClick={handleEnroll}
                disabled={!selectedWaiting}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: 'var(--radius-md)', 
                  border: 'none', 
                  background: selectedWaiting ? 'var(--info)' : 'var(--gray-light)', 
                  color: selectedWaiting ? '#fff' : 'var(--gray)', 
                  fontWeight: 600,
                  cursor: selectedWaiting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Ghi nhận đăng ký
              </button>
            </div>
            
            <div className="reg-table-container">
              <table className="reg-modern-table">
                <thead>
                  <tr>
                    <th width="50" className="text-center">Chọn</th>
                    <th width="60" className="text-center">STT</th>
                    <th width="120">Mã LHP</th>
                    <th>Tên môn học/học phần</th>
                    <th width="150">Giảng viên</th>
                    <th width="80" className="text-center">Số TC</th>
                    <th width="180">Thời gian học</th>
                    <th width="100" className="text-center">Sĩ số</th>
                  </tr>
                </thead>
                <tbody>
                  {availableClasses.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-gray py-4">Không có lớp học phần nào đang mở.</td>
                    </tr>
                  ) : (
                    availableClasses.map((cls, index) => (
                      <tr key={cls.id} className={selectedWaiting === cls.id ? 'row-selected' : ''}>
                        <td className="text-center">
                          <label className="custom-radio">
                            <input 
                              type="radio" 
                              name="waitingCourse" 
                              checked={selectedWaiting === cls.id}
                              onChange={() => setSelectedWaiting(cls.id)}
                            />
                            <span className="radio-mark"></span>
                          </label>
                        </td>
                        <td className="text-center text-gray">{index + 1}</td>
                        <td className="font-semibold text-info">{cls.course?.code}-{cls.id}</td>
                        <td className="font-medium">{cls.course?.name}</td>
                        <td>{cls.teacher?.full_name}</td>
                        <td className="text-center">
                          <span className="tc-badge">{cls.course?.credits}</span>
                        </td>
                        <td className="text-sm">{cls.schedule_time || '-'}</td>
                        <td className="text-center text-sm">
                          <span className="text-success font-medium">Mở</span> (Tối đa: {cls.max_students})
                        </td>
                      </tr>
                    ))
                  )}
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
          <button className="btn-modern-print" onClick={() => window.print()}>
            <FiPrinter /> In danh sách
          </button>
        </div>

        <div className="reg-table-container">
          <table className="reg-modern-table">
            <thead>
              <tr>
                <th width="60" className="text-center">Hủy</th>
                <th width="50" className="text-center">STT</th>
                <th width="120">Mã LHP</th>
                <th>Tên môn học/HP</th>
                <th width="150">Giảng viên</th>
                <th width="60" className="text-center">TC</th>
                <th width="120" className="text-right">Học phí (VNĐ)</th>
                <th width="110" className="text-center">Trạng thái</th>
                <th width="100" className="text-center">Ngày ĐK</th>
              </tr>
            </thead>
            <tbody>
              {registeredClasses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-gray py-4">Bạn chưa đăng ký lớp học phần nào.</td>
                </tr>
              ) : (
                registeredClasses.map((enrollment, index) => {
                  const cls = enrollment.class;
                  const credits = cls?.course?.credits || 0;
                  const fee = (credits * feePerCredit).toLocaleString('vi-VN');
                  const dateStr = new Date(enrollment.enrollment_date).toLocaleDateString('vi-VN');
                  
                  return (
                    <tr key={enrollment.id}>
                      <td className="text-center">
                        <button 
                          className="btn-icon-more" 
                          onClick={() => handleCancel(cls.id)}
                          title="Hủy đăng ký"
                        >
                          <FiXCircle className="text-danger" style={{ fontSize: '18px' }} />
                        </button>
                      </td>
                      <td className="text-center text-gray">{index + 1}</td>
                      <td className="font-semibold">{cls?.course?.code}-{cls?.id}</td>
                      <td className="font-medium">{cls?.course?.name}</td>
                      <td>{cls?.teacher?.full_name}</td>
                      <td className="text-center">
                        <span className="tc-badge">{credits}</span>
                      </td>
                      <td className="text-right font-medium">{fee}</td>
                      <td className="text-center">
                        <span className="status-pill status-new">Thành công</span>
                      </td>
                      <td className="text-center text-sm text-gray">{dateStr}</td>
                    </tr>
                  );
                })
              )}
              
              {/* Summary Row */}
              <tr className="summary-row">
                <td colSpan="5" className="text-right font-bold uppercase text-gray-dark">
                  Tổng cộng:
                </td>
                <td className="text-center font-bold text-info text-lg">
                  {totalCredits}
                </td>
                <td className="text-right font-bold text-success text-lg">
                  {totalFee}
                </td>
                <td colSpan="2">
                  <span className="text-sm text-gray ml-2">(Tạm tính)</span>
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
