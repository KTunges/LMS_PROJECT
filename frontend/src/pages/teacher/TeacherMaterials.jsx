import { useState } from 'react';
import { FiUploadCloud, FiFileText, FiVideo, FiMoreVertical, FiTrash2, FiSearch, FiFilter, FiHardDrive } from 'react-icons/fi';
import './TeacherStudents.css';

const TeacherMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockFiles = [
    { id: 1, name: 'react-fundamentals.mp4', type: 'video', size: '245 MB', date: '12/09/2026', uses: 2 },
    { id: 2, name: 'nodejs-api-cheatsheet.pdf', type: 'pdf', size: '2.4 MB', date: '10/09/2026', uses: 1 },
    { id: 3, name: 'figma-ui-kit-v2.zip', type: 'archive', size: '15.8 MB', date: '08/09/2026', uses: 4 },
    { id: 4, name: 'advanced-hooks-demo.mp4', type: 'video', size: '180 MB', date: '05/09/2026', uses: 0 },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'video': return <FiVideo size={22} color="#ef4444" />;
      case 'pdf': return <FiFileText size={22} color="#3b82f6" />;
      default: return <FiFileText size={22} color="#64748b" />;
    }
  };

  return (
    <div className="ts-page">
      {/* HEADER */}
      <div className="ts-header">
        <div>
          <h1 className="ts-header__title">
            Kho <span className="gradient-text">Tài nguyên</span>
          </h1>
          <p className="ts-header__subtitle">Quản lý toàn bộ video, tài liệu PDF và file mã nguồn của bạn.</p>
        </div>
        <div className="ts-header__actions">
          <button className="ts-btn-email">
            <FiUploadCloud size={18} /> Tải file lên
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="ts-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="ts-stat-card ts-stat-card--purple">
          <div className="ts-stat-icon ts-stat-icon--purple"><FiHardDrive size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Dung lượng đã dùng</div>
            <div className="ts-stat-info__value">1.2 GB <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--theme-text-muted)' }}>/ 5.0 GB</span></div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--orange">
          <div className="ts-stat-icon ts-stat-icon--orange"><FiVideo size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Video bài giảng</div>
            <div className="ts-stat-info__value">24 <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--theme-text-muted)' }}>files</span></div>
          </div>
        </div>
        <div className="ts-stat-card ts-stat-card--green">
          <div className="ts-stat-icon ts-stat-icon--green"><FiFileText size={22} /></div>
          <div>
            <div className="ts-stat-info__label">Tài liệu đính kèm</div>
            <div className="ts-stat-info__value">15 <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--theme-text-muted)' }}>files</span></div>
          </div>
        </div>
      </div>

      {/* FILE TABLE */}
      <div className="ts-content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--theme-border-color)' }}>
          <div className="ts-search" style={{ marginBottom: 0 }}>
            <FiSearch className="ts-search__icon" />
            <input 
              type="text" 
              className="ts-search__input"
              placeholder="Tìm kiếm tài liệu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="ts-btn-email" style={{ background: 'var(--theme-card-bg)', color: 'var(--theme-text-main)', border: '1px solid var(--theme-border-color)', boxShadow: 'none', padding: '8px 16px' }}>
            <FiFilter size={16} /> Lọc theo loại
          </button>
        </div>

        <table className="ts-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Tên File</th>
              <th>Kích thước</th>
              <th>Ngày tải lên</th>
              <th style={{ textAlign: 'center' }}>Sử dụng</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(59,130,246,0.06)', padding: '10px', borderRadius: '10px', display: 'flex' }}>
                      {getFileIcon(file.type)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{file.name}</span>
                  </div>
                </td>
                <td className="ts-date">{file.size}</td>
                <td className="ts-date">{file.date}</td>
                <td style={{ textAlign: 'center' }}>
                  {file.uses > 0 ? (
                    <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                      {file.uses} bài giảng
                    </span>
                  ) : (
                    <span style={{ color: 'var(--theme-text-muted)', fontSize: '13px' }}>Chưa dùng</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--theme-text-muted)', cursor: 'pointer', marginRight: '12px', padding: '4px' }}><FiMoreVertical size={18} /></button>
                  <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherMaterials;
