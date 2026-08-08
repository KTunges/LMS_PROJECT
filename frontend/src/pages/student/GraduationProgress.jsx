import { useState, useEffect } from 'react';
import { FiCheckCircle, FiCheck, FiInfo } from 'react-icons/fi';
import { SkeletonTable } from '../../components/common/SkeletonLoaders';
import { courseService } from '../../services';
import './GraduationProgress.css';

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

const GraduationProgress = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    gpa: 0,
    totalCredits: 0,
    completedCredits: 0
  });

  useEffect(() => {
    const fetchData = async () => {
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
            
            // If completed and has grade
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
        
        setStats({
          gpa: finalGpa,
          totalCredits, // for all enrolled
          completedCredits
        });

      } catch (error) {
        console.error('Failed to fetch grades:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map progress to fake groups just to keep UI looking nice
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

  if (isLoading) {
    return (
      <div className="grad-page">
        <div className="grad-header">
          <div>
            <div className="skeleton skeleton-title" style={{ width: '300px', height: '40px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '400px', marginTop: '12px' }}></div>
          </div>
        </div>
        
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
      </div>
    );
  }

  return (
    <div className="grad-page">
      <div className="grad-header">
        <div>
          <h1>Tiến độ Tốt nghiệp</h1>
          <p>Chương trình đào tạo ngành Công nghệ Thông tin — Khóa 2023-2027</p>
        </div>
      </div>

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
    </div>
  );
};

export default GraduationProgress;
