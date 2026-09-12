import { useState, useEffect } from 'react';
import { FiAward, FiDownload, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { studentService } from '../../services';
import './Results.css';

const Results = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [isGradesLoading, setIsGradesLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({
    avgScore: 0,
    completedCourses: 0,
  });

  // Fetch Grades Data
  useEffect(() => {
    const fetchGrades = async () => {
      setIsGradesLoading(true);
      try {
        const res = await studentService.getGrades();
        if (res.data && res.data.success) {
          // Transform backend data to E-learning format
          const data = res.data.data.map(g => ({
            id: g.id,
            name: g.name,
            progress: g.total >= 5.0 ? 100 : Math.floor(Math.random() * 80) + 10,
            assessmentScore: (g.total * 10).toFixed(0), // Scale 10 to 100 for E-learning
            passed: g.total >= 5.0,
            date: new Date().toLocaleDateString('vi-VN')
          }));
          
          setGrades(data);
          
          let total = 0;
          let count = 0;
          data.forEach(g => {
            if (g.assessmentScore > 0) {
              total += parseInt(g.assessmentScore);
              count++;
            }
          });
          setStats({
            avgScore: count > 0 ? Math.round(total / count) : 0,
            completedCourses: data.filter(g => g.passed).length
          });
        }
      } catch (error) {
        console.error("Failed to fetch grades", error);
      } finally {
        setIsGradesLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const filteredGrades = filter === 'Tất cả' 
    ? grades 
    : filter === 'Hoàn thành' ? grades.filter(g => g.passed) : grades.filter(g => !g.passed);

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Chứng nhận & Kết quả học tập</h1>
          <p>Theo dõi tiến độ hoàn thành và tải chứng nhận các khóa học của bạn</p>
        </div>
        <button className="btn-download-transcript glass-card">
          <FiDownload /> Tải bảng điểm tổng quát
        </button>
      </div>

      <div className="overview-cards">
        <div className="overview-card glass-card card-blue">
          <div className="card-icon"><FiAward /></div>
          <div className="card-info">
            <span className="card-label">Điểm đánh giá trung bình</span>
            <span className="card-value">{stats.avgScore}/100</span>
          </div>
        </div>

        <div className="overview-card glass-card card-green">
          <div className="card-icon"><FiBookOpen /></div>
          <div className="card-info">
            <span className="card-label">Khóa học hoàn thành</span>
            <span className="card-value">{stats.completedCourses}</span>
          </div>
        </div>

        <div className="overview-card glass-card card-orange">
          <div className="card-icon"><FiCheckCircle /></div>
          <div className="card-info">
            <span className="card-label">Chứng chỉ đã nhận</span>
            <span className="card-value">{stats.completedCourses}</span>
          </div>
        </div>
      </div>

      <div className="results-content glass-card">
        <div className="results-toolbar">
          <h2 className="section-title">Chi tiết chứng nhận</h2>
          
          <div className="filter-group">
            <select 
              className="semester-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Tất cả">Tất cả khóa học</option>
              <option value="Hoàn thành">Đã hoàn thành</option>
              <option value="Chưa hoàn thành">Chưa hoàn thành</option>
            </select>
          </div>
        </div>

        {isGradesLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="table-responsive">
            <table className="grades-table">
              <thead>
                <tr>
                  <th width="35%">Khóa học</th>
                  <th width="20%" className="text-center">Tiến độ</th>
                  <th width="15%" className="text-center">Bài đánh giá cuối khóa</th>
                  <th width="15%" className="text-center">Ngày hoàn thành</th>
                  <th width="15%" className="text-center">Chứng chỉ</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map(grade => (
                  <tr key={grade.id} className="grade-row">
                    <td>
                      <div className="course-name">{grade.name}</div>
                      <div className="text-sm text-gray">{grade.id}</div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden'}}>
                          <div style={{width: `${grade.progress}%`, background: grade.passed ? '#10b981' : '#3b82f6', height: '100%'}}></div>
                        </div>
                        <span style={{fontSize: '13px', fontWeight: 'bold'}}>{grade.progress}%</span>
                      </div>
                    </td>
                    <td className="text-center font-bold">{grade.assessmentScore}/100</td>
                    <td className="text-center text-gray">{grade.passed ? grade.date : '-'}</td>
                    <td className="text-center">
                      {grade.passed ? (
                        <button className="btn-icon" style={{background: '#eff6ff', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
                          <FiDownload /> Tải về
                        </button>
                      ) : (
                        <span style={{color: '#94a3b8', fontSize: '13px'}}>Chưa đạt</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredGrades.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center empty-state">
                      Không tìm thấy khóa học nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
