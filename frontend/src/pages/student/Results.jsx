import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDownload, FiFilter, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { studentService } from '../../services';
import './Results.css';

const semesters = ['Tất cả khóa học', 'Năm 2026', 'Năm 2025'];

const Results = () => {
  const [selectedSemester, setSelectedSemester] = useState('Tất cả khóa học');
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
          const data = res.data.data;
          setGrades(data);
          
          let total = 0;
          let count = 0;
          data.forEach(g => {
            if (g.total > 0) {
              total += g.total;
              count++;
            }
          });
          setStats({
            avgScore: count > 0 ? (total / count).toFixed(1) : '0.0',
            completedCourses: count
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

  // --- Grades Logic ---
  const filteredGrades = selectedSemester === 'Tất cả khóa học' 
    ? grades 
    : grades; // Simplification: in real app, filter by actual date/year

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Kết quả học tập</h1>
          <p>Theo dõi điểm số chi tiết các khóa học của bạn</p>
        </div>
        <button className="btn-download-transcript glass-card">
          <FiDownload /> Tải bảng điểm
        </button>
      </div>

      <div className="overview-cards">
        <div className="overview-card glass-card card-blue">
          <div className="card-icon"><FiTrendingUp /></div>
          <div className="card-info">
            <span className="card-label">Điểm trung bình (Hệ 10)</span>
            <span className="card-value">{stats.avgScore}</span>
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
            <span className="card-label">Xếp loại</span>
            <span className="card-value">Khá</span>
          </div>
        </div>
      </div>

          <div className="results-content glass-card">
            <div className="results-toolbar">
              <h2 className="section-title">Chi tiết điểm số</h2>
              
              <div className="filter-group">
                <FiFilter className="text-gray" />
                <select 
                  className="semester-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
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
                      <th>Mã khóa học</th>
                      <th>Tên khóa học</th>
                      <th className="text-center">Quá trình (20%)</th>
                      <th className="text-center">Giữa kỳ (30%)</th>
                      <th className="text-center">Cuối kỳ (50%)</th>
                      <th className="text-center font-bold text-info">Tổng kết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map(grade => (
                      <tr key={grade.id} className="grade-row">
                        <td className="font-semibold text-gray-700">{grade.id}</td>
                        <td>
                          <div className="course-name">{grade.name}</div>
                        </td>
                        <td className="text-center">{grade.process.toFixed(1)}</td>
                        <td className="text-center">{grade.midterm.toFixed(1)}</td>
                        <td className="text-center">{grade.final.toFixed(1)}</td>
                        <td className="text-center font-bold text-lg">{grade.total.toFixed(1)}</td>
                      </tr>
                    ))}
                    {filteredGrades.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center empty-state">
                          Không có dữ liệu điểm cho học kỳ này.
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
