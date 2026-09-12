import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiSearch, FiFilter, FiDownload, FiFileText, FiImage, 
  FiVideo, FiFile, FiEye, FiStar, FiClock,
  FiBook, FiBookOpen, FiExternalLink, FiHardDrive, FiTrash2
} from 'react-icons/fi';
import { studentService } from '../../services';
import './ResourceCenter.css';

const fileTypes = ['Tất cả', 'PDF', 'PPTX', 'DOCX', 'MP4'];

const getFileIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'PDF': case 'DOCX': return <FiFileText />;
    case 'PPTX': return <FiFile />;
    case 'MP4': return <FiVideo />;
    case 'PNG': case 'JPG': return <FiImage />;
    default: return <FiFile />;
  }
};

const getFileColor = (type) => {
  switch (type?.toUpperCase()) {
    case 'PDF': return '#ef4444';
    case 'PPTX': return '#f59e0b';
    case 'DOCX': return '#3b82f6';
    case 'MP4': return '#8b5cf6';
    case 'PNG': case 'JPG': return '#10b981';
    default: return '#6b7280';
  }
};

const SkeletonCard = () => (
  <div className="mat-card glass-card">
    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }}></div>
    <div className="mat-card__body" style={{ width: '100%' }}>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
      <div className="mat-meta" style={{ marginTop: '12px', gap: '8px' }}>
        <div className="skeleton skeleton-text" style={{ width: '60px', margin: 0 }}></div>
        <div className="skeleton skeleton-text" style={{ width: '40px', margin: 0 }}></div>
      </div>
    </div>
  </div>
);

const ResourceCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState('all'); // all, my_courses
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tất cả');
  
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const res = await studentService.getMaterials();
        if (res.data && res.data.success) {
          setMaterials(res.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleClearCategory = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const filteredMaterials = materials.filter(m => {
    if (filterType !== 'Tất cả' && (!m.file_type || m.file_type.toUpperCase() !== filterType)) return false;
    
    if (categoryParam) {
      const catName = m.category?.name?.toLowerCase() || '';
      const subj = m.subject?.toLowerCase() || '';
      const tit = m.title.toLowerCase();
      const targetCat = categoryParam.toLowerCase();
      if (!(catName.includes(targetCat) || tit.includes(targetCat) || subj.includes(targetCat))) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      if (!(m.title.toLowerCase().includes(q) || 
           (m.subject && m.subject.toLowerCase().includes(q)) ||
           (m.category?.name && m.category.name.toLowerCase().includes(q)))) {
        return false;
      }
    }
    
    // Simulate "My Course Resources" by just picking a random subset for demo purposes if no API exists
    // In a real app, backend should filter by enrolled courses. Here we filter locally for UI completeness.
    if (activeTab === 'my_courses') {
        // Just a mock filter to show difference: only show PDF files for "my courses" demo
        if(m.file_type?.toUpperCase() !== 'PDF') return false; 
    }

    return true;
  });

  return (
    <div className="resource-page">
      <div className="resource-header">
        <div>
          <h1>Trung tâm học liệu</h1>
          <p>Kho tài nguyên, ebook và tài liệu miễn phí được chia sẻ từ cộng đồng</p>
        </div>
      </div>

      <div className="resource-tabs-container">
        <button 
          className={`rc-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <FiBookOpen /> Khám phá tài liệu
        </button>
        <button 
          className={`rc-tab-btn ${activeTab === 'my_courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_courses')}
        >
          <FiHardDrive /> Tài liệu khóa học của tôi
        </button>
      </div>

      <div className="resource-content">
        {categoryParam && (
          <div className="active-cat-banner">
            <div className="active-cat-text">
              <span className="cat-pill">Đang lọc theo danh mục:</span>
              <span className="cat-highlight">{categoryParam}</span>
            </div>
            <button className="btn-clear-cat" onClick={handleClearCategory}>
              ✕ Bỏ lọc
            </button>
          </div>
        )}

        <div className="materials-toolbar glass-card">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, bài giảng..."
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

        <div className="materials-count" style={{ marginBottom: '16px' }}>
          Hiển thị <strong>{filteredMaterials.length}</strong> tài liệu
        </div>

        <div className="materials-grid">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredMaterials.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--gray-500)', background: 'var(--theme-glass-bg)', borderRadius: '12px' }}>
              <FiFileText size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
              <p>Không có tài liệu nào phù hợp với điều kiện tìm kiếm.</p>
            </div>
          ) : (
            filteredMaterials.map(mat => {
              const formatSize = (bytes) => {
                if (!bytes) return '2.5 MB'; // Mock size since db seed didn't set size
                const mb = bytes / (1024 * 1024);
                return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
              };
              const type = mat.file_type ? mat.file_type.toUpperCase() : 'PDF';
              return (
              <div key={mat.id} className="mat-card glass-card">
              <div className="mat-card__icon" style={{ background: `${getFileColor(type)}15`, color: getFileColor(type) }}>
                {getFileIcon(type)}
                <span className="mat-type-label" style={{ color: getFileColor(type) }}>{type}</span>
              </div>
              <div className="mat-card__body">
                <h3 className="mat-title">{mat.title}</h3>
                <p className="mat-author">{mat.author?.full_name || 'Giảng viên'}</p>
                <div className="mat-meta">
                  <span className="mat-subject">{mat.category?.name || 'Tài liệu chung'}</span>
                  <span className="mat-size">{formatSize(mat.file_size)}</span>
                </div>
                <div className="mat-footer">
                  <div className="mat-stats">
                    <span className="mat-stat"><FiDownload /> {Math.floor(Math.random() * 500) + 10}</span>
                    <span className="mat-stat"><FiStar style={{color: '#f59e0b'}}/> {(Math.random() * 1 + 4).toFixed(1)}</span>
                  </div>
                  <div className="mat-actions">
                    <button className="btn-mat-action btn-mat-preview" title="Xem trước tài liệu"><FiEye /></button>
                    <a href={mat.file_url} target="_blank" rel="noreferrer" className="btn-mat-action btn-mat-download" title="Tải tài liệu về máy"><FiDownload /></a>
                  </div>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCenter;
