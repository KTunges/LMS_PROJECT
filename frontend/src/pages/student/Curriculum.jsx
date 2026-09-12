import { useState, useEffect } from 'react';
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiBookOpen } from 'react-icons/fi';
import api from '../../services/api';
import './Curriculum.css';

const Curriculum = () => {
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await api.get('/curriculum/my-curriculum');
        setSemesters(response.data);
      } catch (err) {
        console.error("Lỗi lấy chương trình khung:", err);
        if (err.response && err.response.status === 400 && err.response.data.message.includes('major')) {
          setError("Bạn chưa được phân ngành học. Vui lòng liên hệ Phòng Đào tạo.");
        } else {
          setError("Không thể tải chương trình khung. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

  const toggleSemester = (index) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index].isOpen = !updatedSemesters[index].isOpen;
    setSemesters(updatedSemesters);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <span className="status-badge bg-success text-white">Đạt</span>;
      case 'failed':
        return <span className="status-badge bg-danger text-white">Chưa đạt</span>;
      case 'learning':
        return <span className="status-badge bg-warning text-white">Đang học</span>;
      default:
        return <span className="status-badge bg-light text-dark">Chưa học</span>;
    }
  };

  if (isLoading) return <div className="curriculum-page"><div style={{padding: 40}}>Đang tải dữ liệu...</div></div>;
  if (error) return <div className="curriculum-page"><div style={{padding: 40, color: 'red'}}>{error}</div></div>;

  return (
    <div className="curriculum-page">
      <div className="curriculum-header">
        <div className="curriculum-title">
          <h1>Chương trình khung</h1>
          <p>Lộ trình đào tạo toàn khóa và tiến độ học tập của bạn.</p>
        </div>
      </div>

      <div className="curriculum-content">
        {semesters.length === 0 ? (
          <div className="empty-state">Không có dữ liệu chương trình khung.</div>
        ) : (
          semesters.map((sem, sIndex) => (
            <div key={sem.semester} className="semester-card glass-card">
              <div 
                className="semester-header" 
                onClick={() => toggleSemester(sIndex)}
              >
                <div className="semester-info">
                  <h2>Học kỳ {sem.semester}</h2>
                  <span className="total-credits">{sem.totalCredits} Tín chỉ</span>
                </div>
                <div className="semester-toggle">
                  {sem.isOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                </div>
              </div>

              {sem.isOpen && (
                <div className="semester-body fade-in">
                  {sem.groups.map((group, gIndex) => (
                    <div key={gIndex} className="course-group">
                      <div className="group-header">
                        <h3>{group.name}</h3>
                        <span className="group-req">{group.courses.length} Học phần ({group.credits} TC)</span>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="curriculum-table">
                          <thead>
                            <tr>
                              <th width="10%">Mã HP</th>
                              <th width="35%">Tên học phần</th>
                              <th width="10%">Loại HP</th>
                              <th width="10%" className="text-center">Số TC</th>
                              <th width="15%" className="text-center">Tình trạng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.courses.map((course) => (
                              <tr key={course.id} className={course.status === 'passed' ? 'row-passed' : ''}>
                                <td><span className="course-code">{course.id}</span></td>
                                <td className="course-name">
                                  {course.passed && <FiCheckCircle className="icon-passed" />}
                                  {course.name}
                                </td>
                                <td>{course.type}</td>
                                <td className="text-center"><strong>{course.tc}</strong></td>
                                <td className="text-center">{getStatusBadge(course.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Curriculum;
