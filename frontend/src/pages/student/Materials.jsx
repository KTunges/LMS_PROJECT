import { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiFileText, FiImage, FiVideo, FiFile, FiEye, FiStar, FiClock } from 'react-icons/fi';
import './Materials.css';

const mockMaterials = [
  { id: 1, title: 'Giáo trình Lập trình Web Nâng cao', subject: 'IT306', author: 'ThS. Nguyễn Văn A', type: 'PDF', size: '5.2 MB', downloads: 234, date: '15/07/2026', rating: 4.8 },
  { id: 2, title: 'Slide bài giảng CSDL - Chương 5', subject: 'IT307', author: 'PGS.TS. Trần B', type: 'PPTX', size: '3.1 MB', downloads: 189, date: '12/07/2026', rating: 4.5 },
  { id: 3, title: 'Video hướng dẫn Docker cơ bản', subject: 'IT308', author: 'ThS. Lê Thị C', type: 'MP4', size: '120 MB', downloads: 412, date: '10/07/2026', rating: 4.9 },
  { id: 4, title: 'Bài tập thực hành SQL nâng cao', subject: 'IT307', author: 'PGS.TS. Trần B', type: 'PDF', size: '1.8 MB', downloads: 156, date: '08/07/2026', rating: 4.3 },
  { id: 5, title: 'Tài liệu tham khảo ReactJS Hooks', subject: 'IT306', author: 'ThS. Nguyễn Văn A', type: 'PDF', size: '2.4 MB', downloads: 321, date: '05/07/2026', rating: 4.7 },
  { id: 6, title: 'Đề cương ôn tập Kiểm thử PM', subject: 'IT309', author: 'TS. Phạm D', type: 'DOCX', size: '850 KB', downloads: 98, date: '01/07/2026', rating: 4.1 },
  { id: 7, title: 'Infographic: Các mô hình phát triển PM', subject: 'IT309', author: 'TS. Phạm D', type: 'PNG', size: '2.1 MB', downloads: 76, date: '28/06/2026', rating: 4.0 },
  { id: 8, title: 'Lab Guide: AWS Cloud Practitioner', subject: 'IT308', author: 'ThS. Lê Thị C', type: 'PDF', size: '8.5 MB', downloads: 287, date: '25/06/2026', rating: 4.6 },
];

const fileTypes = ['Tất cả', 'PDF', 'PPTX', 'DOCX', 'MP4', 'PNG'];

const Materials = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tất cả');

  const filtered = mockMaterials
    .filter(m => filterType === 'Tất cả' || m.type === filterType)
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));

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

  return (
    <div className="materials-page animate-scaleIn">
      <div className="materials-header">
        <div>
          <h1>Kho tài liệu</h1>
          <p>Tìm kiếm và tải xuống tài liệu học tập từ giảng viên</p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="materials-toolbar glass-card">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, mã môn học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter />
          {fileTypes.map(t => (
            <button
              key={t}
              className={`filter-chip ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="materials-count">
        Hiển thị <strong>{filtered.length}</strong> tài liệu
      </div>

      {/* Materials grid */}
      <div className="materials-grid">
        {filtered.map(mat => (
          <div key={mat.id} className="mat-card glass-card">
            <div className="mat-card__icon" style={{ background: `${getFileColor(mat.type)}15`, color: getFileColor(mat.type) }}>
              {getFileIcon(mat.type)}
              <span className="mat-type-label" style={{ color: getFileColor(mat.type) }}>{mat.type}</span>
            </div>
            <div className="mat-card__body">
              <h3 className="mat-title">{mat.title}</h3>
              <p className="mat-author">{mat.author}</p>
              <div className="mat-meta">
                <span className="mat-subject">{mat.subject}</span>
                <span className="mat-size">{mat.size}</span>
              </div>
              <div className="mat-footer">
                <div className="mat-stats">
                  <span className="mat-stat"><FiDownload /> {mat.downloads}</span>
                  <span className="mat-stat"><FiStar /> {mat.rating}</span>
                  <span className="mat-stat"><FiClock /> {mat.date}</span>
                </div>
                <div className="mat-actions">
                  <button className="btn-mat btn-preview"><FiEye /></button>
                  <button className="btn-mat btn-download"><FiDownload /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
