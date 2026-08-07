import { useState } from 'react';
import { FiDownload, FiTrash2, FiFileText, FiFile, FiVideo, FiImage, FiClock, FiHardDrive, FiSearch } from 'react-icons/fi';
import './Downloads.css';

const mockDownloads = [
  { id: 1, title: 'Giáo trình Lập trình Web Nâng cao', type: 'PDF', size: '5.2 MB', date: '07/08/2026 - 14:32', subject: 'IT306' },
  { id: 2, title: 'Slide bài giảng CSDL - Chương 5', type: 'PPTX', size: '3.1 MB', date: '06/08/2026 - 09:15', subject: 'IT307' },
  { id: 3, title: 'Video hướng dẫn Docker cơ bản', type: 'MP4', size: '120 MB', date: '05/08/2026 - 22:01', subject: 'IT308' },
  { id: 4, title: 'Tài liệu tham khảo ReactJS Hooks', type: 'PDF', size: '2.4 MB', date: '04/08/2026 - 11:45', subject: 'IT306' },
  { id: 5, title: 'Bài tập thực hành SQL nâng cao', type: 'PDF', size: '1.8 MB', date: '03/08/2026 - 16:20', subject: 'IT307' },
  { id: 6, title: 'Lab Guide: AWS Cloud Practitioner', type: 'PDF', size: '8.5 MB', date: '01/08/2026 - 08:30', subject: 'IT308' },
  { id: 7, title: 'Đề cương ôn tập Kiểm thử PM', type: 'DOCX', size: '850 KB', date: '30/07/2026 - 19:10', subject: 'IT309' },
  { id: 8, title: 'Infographic: Mô hình phát triển PM', type: 'PNG', size: '2.1 MB', date: '28/07/2026 - 13:55', subject: 'IT309' },
];

const Downloads = () => {
  const [downloads, setDownloads] = useState(mockDownloads);
  const [search, setSearch] = useState('');

  const handleDelete = (id) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': case 'DOCX': return <FiFileText />;
      case 'PPTX': return <FiFile />;
      case 'MP4': return <FiVideo />;
      case 'PNG': case 'JPG': return <FiImage />;
      default: return <FiFile />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'PDF': return '#ef4444';
      case 'PPTX': return '#f59e0b';
      case 'DOCX': return '#3b82f6';
      case 'MP4': return '#8b5cf6';
      case 'PNG': case 'JPG': return '#10b981';
      default: return '#6b7280';
    }
  };

  const totalSize = downloads.reduce((sum, d) => {
    const num = parseFloat(d.size);
    if (d.size.includes('MB')) return sum + num;
    if (d.size.includes('KB')) return sum + num / 1024;
    return sum;
  }, 0);

  const filtered = downloads.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="downloads-page animate-scaleIn">
      <div className="downloads-header">
        <div>
          <h1>Đã tải xuống</h1>
          <p>Quản lý các tài liệu bạn đã tải về</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dl-stats">
        <div className="dl-stat glass-card">
          <FiDownload className="dl-stat-icon" style={{ color: '#3b82f6' }} />
          <div>
            <span className="dl-stat-value">{downloads.length}</span>
            <span className="dl-stat-label">Tổng file</span>
          </div>
        </div>
        <div className="dl-stat glass-card">
          <FiHardDrive className="dl-stat-icon" style={{ color: '#8b5cf6' }} />
          <div>
            <span className="dl-stat-value">{totalSize.toFixed(1)} MB</span>
            <span className="dl-stat-label">Dung lượng</span>
          </div>
        </div>
        <div className="dl-stat glass-card">
          <FiClock className="dl-stat-icon" style={{ color: '#10b981' }} />
          <div>
            <span className="dl-stat-value">{downloads.length > 0 ? downloads[0].date.split(' - ')[0] : '—'}</span>
            <span className="dl-stat-label">Tải gần nhất</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="dl-search glass-card">
        <FiSearch className="dl-search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm trong danh sách đã tải..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Download list */}
      <div className="dl-list">
        {filtered.map(dl => (
          <div key={dl.id} className="dl-item glass-card">
            <div className="dl-item__icon" style={{ background: `${getFileColor(dl.type)}12`, color: getFileColor(dl.type) }}>
              {getFileIcon(dl.type)}
            </div>
            <div className="dl-item__info">
              <h4 className="dl-item__title">{dl.title}</h4>
              <div className="dl-item__meta">
                <span className="dl-badge" style={{ color: getFileColor(dl.type), background: `${getFileColor(dl.type)}12` }}>{dl.type}</span>
                <span className="dl-meta-text">{dl.size}</span>
                <span className="dl-meta-text">{dl.subject}</span>
                <span className="dl-meta-text"><FiClock /> {dl.date}</span>
              </div>
            </div>
            <div className="dl-item__actions">
              <button className="btn-dl btn-redownload" title="Tải lại">
                <FiDownload />
              </button>
              <button className="btn-dl btn-delete" title="Xóa" onClick={() => handleDelete(dl.id)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="dl-empty">
            <FiDownload className="dl-empty-icon" />
            <p>Không tìm thấy tài liệu nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
