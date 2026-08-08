import { useState, useEffect } from 'react';
import { FiAward, FiBook, FiTrendingUp, FiDownload, FiFilter, FiCheckCircle, FiCheck, FiInfo } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { courseService } from '../../services';
import './Results.css';
import './GraduationProgress.css'; // We will import the CSS file for the second tab

// --- MOCK DATA FOR RESULTS TAB ---
const mockGrades = [
  { id: 'IT101', name: 'Lập trình Căn bản', credits: 3, process: 8.5, midterm: 8.0, final: 9.0, total: 8.7, letter: 'A', semester: 'HK1 - 2025' },
  { id: 'IT102', name: 'Cấu trúc dữ liệu', credits: 4, process: 7.5, midterm: 7.0, final: 8.5, total: 8.0, letter: 'B+', semester: 'HK1 - 2025' },
  { id: 'ENG101', name: 'Tiếng Anh Giao tiếp', credits: 2, process: 9.0, midterm: 8.5, final: 8.5, total: 8.6, letter: 'A', semester: 'HK1 - 2025' },
  { id: 'MATH101', name: 'Toán Cao cấp', credits: 3, process: 6.0, midterm: 5.5, final: 4.0, total: 4.6, letter: 'D', semester: 'HK1 - 2025' },
  { id: 'IT201', name: 'Phát triển Web', credits: 3, process: 8.0, midterm: 8.0, final: 7.5, total: 7.7, letter: 'B', semester: 'HK2 - 2025' },
  { id: 'PHY101', name: 'Vật lý Đại cương', credits: 3, process: 7.0, midterm: 6.5, final: 8.0, total: 7.4, letter: 'B', semester: 'HK2 - 2025' },
];

const semesters = ['Tất cả học kỳ', 'HK2 - 2025', 'HK1 - 2025'];

// --- DATA FOR PROGRESS TAB ---
const DEFAULT_PROGRESS = [
  { group: 'Kiến thức Đại cương', required: 30, completed: 0, color: '#3b82f6' },
  { group: 'Cơ sở Ngành', required: 36, completed: 0, color: '#10b981' },
  { group: 'Chuyên ngành Bắt buộc', required: 42, completed: 0, color: '#8b5cf6' },
  { group: 'Chuyên ngành Tự chọn', required: 12, completed: 0, color: '#f59e0b' },
  { group: 'Thực tập & Đồ án', required: 14, completed: 0, color: '#ec4899' },
  { group: 'Ngoại ngữ & Khác', required: 16, completed: 0, color: '#06b6d4' },
];

const convertTo4Scale = (score10) => {
  if (score10 >= 8.5) return { gpa: 4.0, letter: 'A' };
  if (score10 >= 8.0) return { gpa: 3.5, letter: 'B+' };
  if (score10 >= 7.0) return { gpa: 3.0, letter: 'B' };
  if (score10 >= 6.5) return { gpa: 2.5, letter: 'C+' };
  if (score10 >= 5.5) return { gpa: 2.0, letter: 'C' };
  if (score10 >= 5.0) return { gpa: 1.5, letter: 'D+' };
  if (score10 >= 4.0) return { gpa: 1.0, letter: 'D' };
  return { gpa: 0, letter: 'F' };
};

const Results = () => {
  // Tabs State
  const [activeTab, setActiveTab] = useState('grades'); // 'grades' | 'progress'

  // Grades Tab State
  const [selectedSemester, setSelectedSemester] = useState('Tất cả học kỳ');
  const [isGradesLoading, setIsGradesLoading] = useState(true);

  // Progress Tab State
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [stats, setStats] = useState({
    gpa: 0,
    totalCredits: 0,
    completedCredits: 0
  });

  // Fetch Grades Data
  useEffect(() => {
    if (activeTab === 'grades') {
      setIsGradesLoading(true);
      const timer = setTimeout(() => setIsGradesLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSemester, activeTab]);

  // Fetch Progress Data
  useEffect(() => {
    if (activeTab === 'progress' && stats.totalCredits === 0) {
      const fetchProgress = async () => {
        setIsProgressLoading(true);
        try {
          const { data } = await courseService.getMyClasses();
          let totalPoints = 0;
          let totalCredits = 0;
          let completedCredits = 0;

          data.forEach(enr => {
            const course = enr.class?.course;
            const grade = enr.grade;
            if (course) {
              totalCredits += course.credits;
              if (enr.status === 'completed' && grade && grade.overall_score) {
                const score10 = parseFloat(grade.overall_score);
                if (score10 >= 4.0) {
                  completedCredits += course.credits;
                  const { gpa } = convertTo4Scale(score10);
                  totalPoints += (gpa * course.credits);
                }
              }
            }
          });

          const finalGpa = completedCredits > 0 ? (totalPoints / completedCredits).toFixed(2) : '0.00';
          setStats({ gpa: finalGpa, totalCredits, completedCredits });
        } catch (error) {
          console.error('Failed to fetch grades:', error);
        } finally {
          setIsProgressLoading(false);
        }
      };
      fetchProgress();
    }
  }, [activeTab, stats.totalCredits]);

  // --- Grades Logic ---
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

  // --- Progress Logic ---
  const progressData = DEFAULT_PROGRESS.map((g, i) => {
    if (i === 0) return { ...g, completed: Math.min(stats.completedCredits, g.required) };
    return g;
  });

  const totalRequired = progressData.reduce((s, d) => s + d.required, 0);
  const overallPercent = Math.round((stats.completedCredits / totalRequired) * 100) || 0;

  const conditions = [
    { label: 'GPA tích lũy', met: parseFloat(stats.gpa) >= 2.5, current: stats.gpa, required: '2.50' },
    { label: 'Ngoại ngữ (Tiếng Anh)', met: true, current: 'TOEIC 620', required: 'TOEIC 450' },
    { label: 'Thực tập doanh nghiệp', met: false, current: 'Chưa đạt', required: 'Hoàn thành' },
  ];

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1>Kết quả học tập</h1>
          <p>Theo dõi điểm số chi tiết và tiến độ tốt nghiệp của bạn</p>
        </div>
        <button className="btn-download-transcript glass-card">
          <FiDownload /> Tải bảng điểm
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="results-tabs glass-card" style={{ display: 'flex', gap: '20px', padding: '10px 20px', marginBottom: '24px', borderRadius: '12px' }}>
        <button 
          className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`} 
          onClick={() => setActiveTab('grades')}
          style={{ padding: '10px 20px', border: 'none', background: 'transparent', fontWeight: '600', color: activeTab === 'grades' ? '#4f46e5' : '#64748b', borderBottom: activeTab === 'grades' ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Bảng điểm chi tiết
        </button>
        <button 
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`} 
          onClick={() => setActiveTab('progress')}
          style={{ padding: '10px 20px', border: 'none', background: 'transparent', fontWeight: '600', color: activeTab === 'progress' ? '#4f46e5' : '#64748b', borderBottom: activeTab === 'progress' ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Tiến độ Tốt nghiệp
        </button>
      </div>

      {/* --- TAB 1: GRADES --- */}
      {activeTab === 'grades' && (
        <>
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
        </>
      )}

      {/* --- TAB 2: GRADUATION PROGRESS --- */}
      {activeTab === 'progress' && (
        <div className="grad-page" style={{ padding: 0 }}>
          {isProgressLoading ? (
            <div className="grad-overview-premium">
              <div className="premium-donut-card">
                <div className="skeleton" style={{ width: '220px', height: '220px', borderRadius: '50%' }}></div>
              </div>
              <div className="premium-conditions-list">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="premium-condition-card">
                    <div style={{ width: '100%' }}>
                      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                      <div className="skeleton skeleton-title" style={{ width: '60%', height: '28px', marginTop: '8px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grad-overview-premium">
                <div className="premium-donut-card">
                  <div className="premium-donut-title">Tiến độ tổng thể</div>
                  <div className="donut-wrapper">
                    <div className="donut-outer"></div>
                    <div className="donut-track"></div>
                    <div className="donut-fill" style={{ '--progress': `${overallPercent}%` }}></div>
                    <div className="donut-center">
                      <span className="donut-percent">{overallPercent}%</span>
                      <span className="donut-label">Tích lũy</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--theme-text-main)' }}>
                      {stats.completedCredits} / {totalRequired}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Tín chỉ hoàn thành
                    </div>
                  </div>
                </div>

                <div className="premium-conditions-list">
                  {conditions.map((c, idx) => (
                    <div key={idx} className={`premium-condition-card ${c.met ? 'met' : 'not-met'}`}>
                      <div className="pcc-info">
                        <span className="pcc-label">{c.label}</span>
                        <div className="pcc-value">
                          {c.current} 
                          <span className="pcc-subvalue">/ {c.required}</span>
                        </div>
                      </div>
                      <div className={`pcc-status ${c.met ? 'met' : 'not-met'}`}>
                        {c.met ? (
                          <>Đã đạt <FiCheckCircle size={16} /></>
                        ) : (
                          <>Chưa đạt <FiInfo size={16} /></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grad-groups-header">
                Yêu cầu học tập ({overallPercent}%)
              </div>
              <div className="premium-groups-grid">
                {progressData.map((item, idx) => {
                  const pct = Math.round((item.completed / item.required) * 100);
                  const isDone = item.completed >= item.required;

                  return (
                    <div key={idx} className="premium-group-card">
                      <div className="pgc-header">
                        <span className="pgc-name">{item.group}</span>
                        <span className="pgc-pct" style={{ color: item.color }}>{pct}%</span>
                      </div>
                      <div className="pgc-bar-bg">
                        <div className="pgc-bar-fill" style={{ width: `${pct}%`, background: item.color }}>
                          {pct > 0 && <div className="pgc-bar-glow" style={{ color: item.color }}></div>}
                        </div>
                      </div>
                      <div className="pgc-footer">
                        <span>{item.completed} / {item.required} TC</span>
                        {isDone ? (
                          <span className="pgc-status completed"><FiCheck /> Hoàn thành</span>
                        ) : (
                          <span className="pgc-status">Đang xử lý</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
