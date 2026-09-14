import { useState, useEffect } from 'react';
import { FiUploadCloud, FiFileText, FiVideo, FiTrash2, FiSearch, FiFilter, FiHardDrive, FiImage, FiCode, FiFile, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { teacherService } from '../../services';
import './TeacherMaterials.css';

const TeacherMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', file_url: '', file_type: 'pdf', file_size: '', description: '' });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const res = await teacherService.getMaterials();
      if (res.data.success) {
        setMaterials(res.data.data);
      }
    } catch (err) {
      console.error(err);
      // Fallback mock data
      setMaterials([
        { id: 1, name: 'react-fundamentals.mp4', type: 'video', size: '245 MB', date: '12/09/2026', uses: 2, category: 'ReactJS' },
        { id: 2, name: 'nodejs-api-cheatsheet.pdf', type: 'pdf', size: '2.4 MB', date: '10/09/2026', uses: 1, category: 'NodeJS' },
        { id: 3, name: 'figma-ui-kit-v2.zip', type: 'archive', size: '15.8 MB', date: '08/09/2026', uses: 4, category: 'Design' },
        { id: 4, name: 'advanced-hooks-demo.mp4', type: 'video', size: '180 MB', date: '05/09/2026', uses: 0, category: 'ReactJS' },
        { id: 5, name: 'database-schema.png', type: 'image', size: '1.2 MB', date: '01/09/2026', uses: 3, category: 'Database' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài nguyên này?')) return;
    try {
      const res = await teacherService.deleteMaterial(id);
      if (res.data.success) {
        setMaterials(materials.filter(m => m.id !== id));
        toast.success('Đã xóa tài nguyên!');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi xóa.');
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title.trim()) { toast.warning('Vui lòng nhập tên tài liệu.'); return; }
    try {
      const res = await teacherService.uploadMaterial(uploadForm);
      if (res.data.success) {
        toast.success('Đã tải lên thành công!');
        setShowUploadForm(false);
        setUploadForm({ title: '', file_url: '', file_type: 'pdf', file_size: '', description: '' });
        fetchMaterials();
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải lên.');
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'video': return <FiVideo size={20} />;
      case 'pdf': return <FiFileText size={20} />;
      case 'image': return <FiImage size={20} />;
      case 'code': return <FiCode size={20} />;
      default: return <FiFile size={20} />;
    }
  };

  const getFileIconColor = (type) => {
    switch (type) {
      case 'video': return '#ef4444';
      case 'pdf': return '#3b82f6';
      case 'image': return '#10b981';
      case 'code': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const filteredMaterials = materials
    .filter(f => filterType === 'all' || f.type === filterType)
    .filter(f => f.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const videoCount = materials.filter(m => m.type === 'video').length;
  const docCount = materials.filter(m => m.type !== 'video').length;

  if (isLoading) return <div className="tm-page" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="tm-page">
      {/* HEADER */}
      <div className="tm-header">
        <div>
          <h1 className="tm-title">
            Kho <span className="gradient-text">Tài nguyên</span>
          </h1>
          <p className="tm-subtitle">Quản lý toàn bộ video, tài liệu PDF và file mã nguồn của bạn.</p>
        </div>
        <button className="tm-upload-btn" onClick={() => setShowUploadForm(!showUploadForm)}>
          <FiUploadCloud size={18} /> {showUploadForm ? 'Đóng' : 'Tải file lên'}
        </button>
      </div>

      {/* UPLOAD FORM */}
      {showUploadForm && (
        <div className="tm-upload-panel">
          <h3 className="tm-upload-panel__title">Thêm tài nguyên mới</h3>
          <div className="tm-upload-grid">
            <div className="tm-field">
              <label>Tên tài liệu *</label>
              <input type="text" placeholder="VD: React Hooks Cheat Sheet" value={uploadForm.title}
                onChange={e => setUploadForm({...uploadForm, title: e.target.value})} />
            </div>
            <div className="tm-field">
              <label>URL File</label>
              <input type="text" placeholder="https://..." value={uploadForm.file_url}
                onChange={e => setUploadForm({...uploadForm, file_url: e.target.value})} />
            </div>
            <div className="tm-field">
              <label>Loại file</label>
              <select value={uploadForm.file_type} onChange={e => setUploadForm({...uploadForm, file_type: e.target.value})}>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="image">Hình ảnh</option>
                <option value="code">Mã nguồn</option>
                <option value="archive">File nén</option>
              </select>
            </div>
            <div className="tm-field">
              <label>Kích thước</label>
              <input type="text" placeholder="VD: 2.4 MB" value={uploadForm.file_size}
                onChange={e => setUploadForm({...uploadForm, file_size: e.target.value})} />
            </div>
          </div>
          <div className="tm-field" style={{marginTop: '12px'}}>
            <label>Mô tả</label>
            <textarea rows={2} placeholder="Mô tả ngắn..." value={uploadForm.description}
              onChange={e => setUploadForm({...uploadForm, description: e.target.value})} />
          </div>
          <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
            <button className="tm-submit-btn" onClick={handleUpload}><FiUploadCloud /> Tải lên</button>
            <button className="tm-cancel-btn" onClick={() => setShowUploadForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="tm-stats">
        <div className="tm-stat-card tm-stat-card--purple">
          <div className="tm-stat-icon" style={{background: 'rgba(139,92,246,0.1)', color: '#8b5cf6'}}><FiHardDrive size={22} /></div>
          <div>
            <div className="tm-stat-label">Tổng tài nguyên</div>
            <div className="tm-stat-value">{materials.length} <span className="tm-stat-sub">files</span></div>
          </div>
        </div>
        <div className="tm-stat-card tm-stat-card--red">
          <div className="tm-stat-icon" style={{background: 'rgba(239,68,68,0.1)', color: '#ef4444'}}><FiVideo size={22} /></div>
          <div>
            <div className="tm-stat-label">Video bài giảng</div>
            <div className="tm-stat-value">{videoCount} <span className="tm-stat-sub">files</span></div>
          </div>
        </div>
        <div className="tm-stat-card tm-stat-card--blue">
          <div className="tm-stat-icon" style={{background: 'rgba(59,130,246,0.1)', color: '#3b82f6'}}><FiFileText size={22} /></div>
          <div>
            <div className="tm-stat-label">Tài liệu & khác</div>
            <div className="tm-stat-value">{docCount} <span className="tm-stat-sub">files</span></div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="tm-content-card">
        <div className="tm-toolbar">
          <div className="tm-search">
            <FiSearch className="tm-search__icon" />
            <input type="text" className="tm-search__input" placeholder="Tìm kiếm tài liệu..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="tm-filters">
            {['all', 'video', 'pdf', 'image', 'code'].map(f => (
              <button key={f}
                className={`tm-filter-btn ${filterType === f ? 'tm-filter-btn--active' : ''}`}
                onClick={() => setFilterType(f)}>
                {f === 'all' ? 'Tất cả' : f === 'video' ? 'Video' : f === 'pdf' ? 'PDF' : f === 'image' ? 'Hình ảnh' : 'Mã nguồn'}
              </button>
            ))}
          </div>
        </div>

        {/* FILE LIST */}
        {filteredMaterials.length > 0 ? (
          <div className="tm-file-list">
            {filteredMaterials.map(file => (
              <div key={file.id} className="tm-file-item">
                <div className="tm-file-info">
                  <div className="tm-file-icon" style={{color: getFileIconColor(file.type), background: `${getFileIconColor(file.type)}15`}}>
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <div className="tm-file-name">{file.name}</div>
                    <div className="tm-file-meta">{file.size} • {file.date} {file.category ? `• ${file.category}` : ''}</div>
                  </div>
                </div>
                <div className="tm-file-actions">
                  {file.uses > 0 ? (
                    <span className="tm-file-badge">{file.uses} bài giảng</span>
                  ) : (
                    <span className="tm-file-badge tm-file-badge--muted">Chưa dùng</span>
                  )}
                  {file.download_url && (
                    <a href={file.download_url} target="_blank" rel="noreferrer" className="tm-icon-btn tm-icon-btn--blue" title="Tải xuống">
                      <FiDownload size={16} />
                    </a>
                  )}
                  <button className="tm-icon-btn tm-icon-btn--red" onClick={() => handleDelete(file.id)} title="Xóa">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tm-empty">Không tìm thấy tài nguyên nào.</div>
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;
