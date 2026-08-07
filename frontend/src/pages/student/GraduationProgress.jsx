import { FiCheckCircle, FiAlertTriangle, FiAward, FiTarget } from 'react-icons/fi';
import './GraduationProgress.css';

const progressData = [
  { group: 'Kiến thức Đại cương', required: 30, completed: 28, color: '#3b82f6' },
  { group: 'Cơ sở Ngành', required: 36, completed: 36, color: '#10b981' },
  { group: 'Chuyên ngành Bắt buộc', required: 42, completed: 30, color: '#8b5cf6' },
  { group: 'Chuyên ngành Tự chọn', required: 12, completed: 9, color: '#f59e0b' },
  { group: 'Thực tập & Đồ án', required: 14, completed: 0, color: '#ec4899' },
  { group: 'Giáo dục Thể chất', required: 4, completed: 4, color: '#06b6d4' },
  { group: 'Giáo dục Quốc phòng', required: 8, completed: 5, color: '#84cc16' },
  { group: 'Ngoại ngữ', required: 4, completed: 4, color: '#f97316' },
];

const conditions = [
  { label: 'Tích lũy đủ 150 tín chỉ', met: false, current: '116/150' },
  { label: 'Điểm TB tích lũy ≥ 5.0', met: true, current: '7.84' },
  { label: 'Không có môn nợ (điểm D trở xuống)', met: false, current: '1 môn nợ' },
  { label: 'Hoàn thành Thực tập doanh nghiệp', met: false, current: 'Chưa hoàn thành' },
  { label: 'Đạt chuẩn Tiếng Anh (TOEIC ≥ 450)', met: true, current: 'TOEIC 620' },
  { label: 'Hoàn thành GDTC & GDQP', met: false, current: '9/12 tín chỉ' },
];

const GraduationProgress = () => {
  const totalRequired = progressData.reduce((s, d) => s + d.required, 0);
  const totalCompleted = progressData.reduce((s, d) => s + d.completed, 0);
  const overallPercent = Math.round((totalCompleted / totalRequired) * 100);

  const conditionsMet = conditions.filter(c => c.met).length;

  return (
    <div className="grad-page animate-scaleIn">
      <div className="grad-header">
        <div>
          <h1>Tiến độ Tốt nghiệp</h1>
          <p>Chương trình đào tạo ngành Công nghệ Thông tin — Khóa 2023-2027</p>
        </div>
      </div>

      {/* Overview row */}
      <div className="grad-overview">
        {/* Donut chart */}
        <div className="grad-donut-card glass-card">
          <div className="grad-donut" style={{ '--progress': `${overallPercent}%` }}>
            <div className="grad-donut__outer"></div>
            <div className="grad-donut__inner"></div>
            <div className="grad-donut__center">
              <span className="grad-donut__percent">{overallPercent}%</span>
              <span className="grad-donut__label">{totalCompleted}/{totalRequired} TC</span>
            </div>
          </div>
          <p className="grad-donut-text">
            Bạn đã hoàn thành <strong>{totalCompleted}</strong> / {totalRequired} tín chỉ yêu cầu.
          </p>
        </div>

        {/* Conditions */}
        <div className="grad-conditions-card glass-card">
          <h3 className="grad-section-title">
            <FiTarget /> Điều kiện Tốt nghiệp ({conditionsMet}/{conditions.length})
          </h3>
          <div className="conditions-list">
            {conditions.map((c, idx) => (
              <div key={idx} className={`condition-item ${c.met ? 'met' : 'not-met'}`}>
                <div className="condition-icon">
                  {c.met ? <FiCheckCircle /> : <FiAlertTriangle />}
                </div>
                <div className="condition-info">
                  <span className="condition-label">{c.label}</span>
                  <span className="condition-current">{c.current}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress by group */}
      <div className="grad-groups glass-card">
        <h3 className="grad-section-title">
          <FiAward /> Chi tiết theo Nhóm kiến thức
        </h3>
        <div className="groups-grid">
          {progressData.map((item, idx) => {
            const pct = Math.round((item.completed / item.required) * 100);
            const isDone = item.completed >= item.required;

            return (
              <div key={idx} className="group-item">
                <div className="group-header">
                  <span className="group-name">{item.group}</span>
                  <span className="group-count" style={{ color: item.color }}>
                    {item.completed}/{item.required} TC
                  </span>
                </div>
                <div className="group-bar-bg">
                  <div
                    className="group-bar-fill"
                    style={{ width: `${pct}%`, background: item.color }}
                  ></div>
                </div>
                <div className="group-footer">
                  <span className="group-pct" style={{ color: item.color }}>{pct}%</span>
                  {isDone && (
                    <span className="group-done-badge">
                      <FiCheckCircle /> Hoàn thành
                    </span>
                  )}
                  {!isDone && (
                    <span className="group-remaining">
                      Còn {item.required - item.completed} TC
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GraduationProgress;
