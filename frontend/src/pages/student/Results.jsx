import { useState, useEffect } from 'react';
import { FiAward, FiBook, FiTrendingUp, FiDownload, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import './Results.css';

// Mock data
const mockGrades = [
  { id: 'IT101', name: 'Lập trình Căn bản', credits: 3, process: 8.5, midterm: 8.0, final: 9.0, total: 8.7, letter: 'A', semester: 'HK1 - 2025' },
  { id: 'IT102', name: 'Cấu trúc dữ liệu', credits: 4, process: 7.5, midterm: 7.0, final: 8.5, total: 8.0, letter: 'B+', semester: 'HK1 - 2025' },
  { id: 'ENG101', name: 'Tiếng Anh Giao tiếp', credits: 2, process: 9.0, midterm: 8.5, final: 8.5, total: 8.6, letter: 'A', semester: 'HK1 - 2025' },
  { id: 'MATH101', name: 'Toán Cao cấp', credits: 3, process: 6.0, midterm: 5.5, final: 4.0, total: 4.6, letter: 'D', semester: 'HK1 - 2025' },
  { id: 'IT201', name: 'Phát triển Web', credits: 3, process: 8.0, midterm: 8.0, final: 7.5, total: 7.7, letter: 'B', semester: 'HK2 - 2025' },
  { id: 'PHY101', name: 'Vật lý Đại cương', credits: 3, process: 7.0, midterm: 6.5, final: 8.0, total: 7.4, letter: 'B', semester: 'HK2 - 2025' },
];

const semesters = ['Tất cả học kỳ', 'HK2 - 2025', 'HK1 - 2025'];

const Results = () => {
  const [selectedSemester, setSelectedSemester] = useState('Tất cả học kỳ');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedSemester]);

  const filteredGrades = selectedSemester === 'Tất cả học kỳ' 
    ? mockGrades 
    : mockGrades.filter(g => g.semester === selectedSemester);

  const getLetterBadgeClass = (letter) => {
    if (letter.startsWith('A')) return 'badge-a';
    if (letter.startsWith('B')) return 'badge-b';
    if (letter.startsWith('C')) return 'badge-c';
    if (letter.startsWith('D')) return 'badge-d';
    return 'badge-f';
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Kết quả học tập</h1>
          <p>Theo dõi tiến độ học tập và điểm số các môn học</p>
        </div>
        <button className="btn-download-transcript glass-card">
          <FiDownload /> Tải bảng điểm
        </button>
      </div>

      {/* Overview Dashboard */}
      <div className="overview-cards">
        <div className="overview-card glass-card card-blue">
          <div className="card-icon"><FiTrendingUp /></div>
          <div className="card-info">
            <span className="card-label">Điểm TB Hệ 10</span>
            <span className="card-value">7.84</span>
          </div>
        </div>

        <div className="overview-card glass-card card-purple">
          <div className="card-icon"><FiAward /></div>
          <div className="card-info">
            <span className="card-label">Điểm TB Hệ 4</span>
            <span className="card-value">3.12</span>
          </div>
        </div>

        <div className="overview-card glass-card card-green">
          <div className="card-icon"><FiBook /></div>
          <div className="card-info">
            <span className="card-label">Tín chỉ tích lũy</span>
            <span className="card-value">18 / 120</span>
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

      {/* Main Table Section */}
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

        {isLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="table-responsive">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn học</th>
                  <th className="text-center">Số TC</th>
                  <th className="text-center">Quá trình (20%)</th>
                  <th className="text-center">Giữa kỳ (30%)</th>
                  <th className="text-center">Cuối kỳ (50%)</th>
                  <th className="text-center font-bold text-info">Tổng kết</th>
                  <th className="text-center">Điểm chữ</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map(grade => (
                  <tr key={grade.id} className="grade-row">
                    <td className="font-semibold text-gray-700">{grade.id}</td>
                    <td>
                      <div className="course-name">{grade.name}</div>
                      <div className="course-semester">{grade.semester}</div>
                    </td>
                    <td className="text-center">{grade.credits}</td>
                    <td className="text-center">{grade.process.toFixed(1)}</td>
                    <td className="text-center">{grade.midterm.toFixed(1)}</td>
                    <td className="text-center">{grade.final.toFixed(1)}</td>
                    <td className="text-center font-bold text-lg">{grade.total.toFixed(1)}</td>
                    <td className="text-center">
                      <span className={`letter-badge ${getLetterBadgeClass(grade.letter)}`}>
                        {grade.letter}
                      </span>
                    </td>
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
