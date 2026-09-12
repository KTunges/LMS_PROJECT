import { useState, useEffect } from 'react';
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiBookOpen } from 'react-icons/fi';
import api from '../../services/api';
import './Curriculum.css';

const Curriculum = () => {
  const [paths, setPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await api.get('/curriculum/my-curriculum');
        setPaths(response.data);
      } catch (err) {
        console.error("Lỗi lấy lộ trình học tập:", err);
        if (err.response && err.response.status === 400 && err.response.data.message.includes('major')) {
          setError("Bạn chưa được phân ngành học. Vui lòng liên hệ Phòng Đào tạo.");
        } else {
          setError("Không thể tải lộ trình học tập. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurriculum();
  }, []);

  const togglePath = (index) => {
    const updatedPaths = [...paths];
    updatedPaths[index].isOpen = !updatedPaths[index].isOpen;
    setPaths(updatedPaths);
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
          <h1>Lộ trình học tập</h1>
          <p>Lộ trình đào tạo toàn khóa và tiến độ chinh phục mục tiêu của bạn.</p>
        </div>
      </div>

      <div className="curriculum-content">
        {paths.length === 0 ? (
          <div className="empty-state">Không có dữ liệu lộ trình học tập.</div>
        ) : (
          paths.map((path, pIndex) => (
            <div key={path.id} className="semester-card glass-card" style={{ marginBottom: '24px' }}>
              <div className="semester-header" onClick={() => togglePath(pIndex)} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white' }}>
                <div className="semester-info">
                  <h2 style={{ color: 'white' }}>{path.title}</h2>
                  <span className="total-credits" style={{ color: '#e0e7ff' }}>Lộ trình chuyên nghiệp</span>
                </div>
                <div className="semester-toggle">
                  {path.isOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                </div>
              </div>

              {path.isOpen && (
                <div className="semester-body fade-in" style={{ padding: '20px' }}>
                  {path.stages.map(stage => (
                    <div key={stage.semester} style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                        {stage.title}
                      </h3>
                      <div className="table-responsive">
                        <table className="curriculum-table">
                          <thead>
                            <tr>
                              <th width="15%">Mã KH</th>
                              <th width="45%">Tên Khóa Học</th>
                              <th width="20%">Cấp độ</th>
                              <th width="20%" className="text-center">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stage.courses.map((course) => (
                              <tr key={course.id} className={course.status === 'passed' ? 'row-passed' : ''}>
                                <td><span className="course-code">{course.id}</span></td>
                                <td className="course-name">
                                  {course.passed && <FiCheckCircle className="icon-passed" />}
                                  {course.name}
                                </td>
                                <td>{course.level}</td>
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
