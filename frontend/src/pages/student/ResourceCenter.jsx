import { useState, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiDownload, FiFileText, FiImage, 
  FiVideo, FiFile, FiEye, FiStar, FiClock,
  FiBook, FiBookOpen, FiExternalLink, FiHardDrive, FiTrash2
} from 'react-icons/fi';
import { materialService } from '../../services';
import './ResourceCenter.css';

// --- MOCK DATA FOR OTHER TABS ---

const mockBooks = [
  { id: 1, title: 'Clean Code: A Handbook of Agile Software', author: 'Robert C. Martin', category: 'Kỹ thuật Phần mềm', year: 2008, pages: 464, rating: 4.9, available: true, cover: '📘' },
  { id: 2, title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen et al.', category: 'Giải thuật', year: 2009, pages: 1312, rating: 4.8, available: true, cover: '📗' },
  { id: 3, title: 'Design Patterns: Elements of Reusable OO Software', author: 'Gang of Four', category: 'Kỹ thuật Phần mềm', year: 1994, pages: 395, rating: 4.7, available: false, cover: '📕' },
  { id: 4, title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Cơ sở Dữ liệu', year: 2019, pages: 1376, rating: 4.6, available: true, cover: '📙' },
  { id: 5, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Mạng Máy tính', year: 2021, pages: 960, rating: 4.5, available: true, cover: '📘' },
  { id: 6, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', category: 'Trí tuệ Nhân tạo', year: 2020, pages: 1136, rating: 4.8, available: false, cover: '📗' },
  { id: 7, title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Hệ Điều hành', year: 2018, pages: 976, rating: 4.4, available: true, cover: '📕' },
  { id: 8, title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', category: 'Kỹ thuật Phần mềm', year: 2019, pages: 352, rating: 4.9, available: true, cover: '📙' },
];

const mockDownloads = [
  { id: 1, title: 'Giáo trình Lập trình Web Nâng cao', type: 'PDF', size: '5.2 MB', date: '07/08/2026 - 14:32', subject: 'IT306' },
  { id: 2, title: 'Slide bài giảng CSDL - Chương 5', type: 'PPTX', size: '3.1 MB', date: '06/08/2026 - 09:15', subject: 'IT307' },
  { id: 3, title: 'Video hướng dẫn Docker cơ bản', type: 'MP4', size: '120 MB', date: '05/08/2026 - 22:01', subject: 'IT308' },
];

const fileTypes = ['Tất cả', 'PDF', 'PPTX', 'DOCX', 'MP4', 'PNG'];
const categories = ['Tất cả', 'Kỹ thuật Phần mềm', 'Giải thuật', 'Cơ sở Dữ liệu', 'Mạng Máy tính', 'Trí tuệ Nhân tạo', 'Hệ Điều hành'];

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

// --- SKELETON COMPONENT ---
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

// --- SUB-COMPONENTS ---
const MaterialsTab = ({ isLoading: isTabLoading }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tất cả');
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const res = await materialService.getAll({ search, status: 'published' });
        setMaterials(res.data.materials || []);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      fetchMaterials();
    }, 500); // debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const filtered = materials.filter(m => filterType === 'Tất cả' || (m.file_type && m.file_type.toUpperCase() === filterType));

  return (
    <div>
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

      <div className="materials-count" style={{ marginBottom: '16px' }}>
        Hiển thị <strong>{filtered.length}</strong> tài liệu
      </div>

      <div className="materials-grid">
        {isLoading || isTabLoading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--gray-500)' }}>
            Không có tài liệu nào phù hợp.
          </div>
        ) : (
          filtered.map(mat => {
            const formatSize = (bytes) => {
              if (!bytes) return 'N/A';
              const mb = bytes / (1024 * 1024);
              return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
            };
            const type = mat.file_type || 'FILE';
            return (
            <div key={mat.id} className="mat-card glass-card">
            <div className="mat-card__icon" style={{ background: `${getFileColor(type)}15`, color: getFileColor(type) }}>
              {getFileIcon(type)}
              <span className="mat-type-label" style={{ color: getFileColor(type) }}>{type}</span>
            </div>
            <div className="mat-card__body">
              <h3 className="mat-title">{mat.title}</h3>
              <p className="mat-author">{mat.author?.full_name || 'Hệ thống'}</p>
              <div className="mat-meta">
                <span className="mat-subject">{mat.category?.name || 'Tài liệu chung'}</span>
                <span className="mat-size">{formatSize(mat.file_size)}</span>
              </div>
              <div className="mat-footer">
                <div className="mat-stats">
                  <span className="mat-stat"><FiDownload /> 0</span>
                  <span className="mat-stat"><FiStar /> 5.0</span>
                </div>
                <div className="mat-actions">
                  <button className="btn-mat btn-preview"><FiEye /></button>
                  <a href={mat.file_url} target="_blank" rel="noreferrer" className="btn-mat btn-download"><FiDownload /></a>
                </div>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const LibraryTab = ({ isLoading }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Tất cả');

  const filtered = mockBooks
    .filter(b => filterCat === 'Tất cả' || b.category === filterCat)
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="library-stats" style={{ marginTop: 0 }}>
        <div className="lib-stat glass-card">
          <FiBook className="lib-stat-icon" style={{ color: '#3b82f6' }} />
          <div>
            <span className="lib-stat-value">{mockBooks.length}</span>
            <span className="lib-stat-label">Tổng đầu sách</span>
          </div>
        </div>
        <div className="lib-stat glass-card">
          <FiBookOpen className="lib-stat-icon" style={{ color: '#10b981' }} />
          <div>
            <span className="lib-stat-value">{mockBooks.filter(b => b.available).length}</span>
            <span className="lib-stat-label">Có sẵn</span>
          </div>
        </div>
        <div className="lib-stat glass-card">
          <FiStar className="lib-stat-icon" style={{ color: '#f59e0b' }} />
          <div>
            <span className="lib-stat-value">{categories.length - 1}</span>
            <span className="lib-stat-label">Danh mục</span>
          </div>
        </div>
      </div>

      <div className="library-toolbar glass-card">
        <div className="lib-search-box">
          <FiSearch className="lib-search-icon" />
          <input
            type="text"
            placeholder="Tìm tên sách, tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="lib-filter-row">
          <FiFilter />
          {categories.map(c => (
            <button
              key={c}
              className={`lib-filter-btn ${filterCat === c ? 'active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="books-grid">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filtered.map(book => (
            <div key={book.id} className="book-card glass-card">
            <div className="book-cover">{book.cover}</div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <div className="book-meta">
                <span className="book-category">{book.category}</span>
                <span className="book-year">{book.year}</span>
                <span className="book-pages">{book.pages} trang</span>
              </div>
              <div className="book-footer">
                <div className="book-rating">
                  <FiStar /> {book.rating}
                </div>
                <span className={`book-availability ${book.available ? 'available' : 'unavailable'}`}>
                  {book.available ? 'Có sẵn' : 'Đã mượn'}
                </span>
                <button className="btn-borrow" disabled={!book.available}>
                  <FiExternalLink /> {book.available ? 'Đọc online' : 'Đặt mượn'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

const DownloadsTab = ({ isLoading }) => {
  const [downloads, setDownloads] = useState(mockDownloads);
  const [search, setSearch] = useState('');

  const handleDelete = (id) => setDownloads(prev => prev.filter(d => d.id !== id));

  const totalSize = downloads.reduce((sum, d) => {
    const num = parseFloat(d.size);
    if (d.size.includes('MB')) return sum + num;
    if (d.size.includes('KB')) return sum + num / 1024;
    return sum;
  }, 0);

  const filtered = downloads.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="dl-stats" style={{ marginTop: 0 }}>
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
      </div>

      <div className="dl-search glass-card">
        <FiSearch className="dl-search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm trong danh sách đã tải..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="dl-list">
        {isLoading ? (
           Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filtered.map(dl => (
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
              <button className="btn-dl btn-redownload" title="Tải lại"><FiDownload /></button>
              <button className="btn-dl btn-delete" title="Xóa" onClick={() => handleDelete(dl.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="dl-empty">
            <FiDownload className="dl-empty-icon" />
            <p>Không tìm thấy tài liệu nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ResourceCenter = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Giả lập độ trễ mạng 600ms
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="resource-page">
      <div className="resource-header">
        <div>
          <h1>Trung tâm học liệu</h1>
          <p>Kho tài nguyên khổng lồ dành cho việc học tập và nghiên cứu</p>
        </div>
      </div>

      <div className="resource-tabs-container">
        <button 
          className={`rc-tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <FiFileText /> Kho tài liệu chung
        </button>
        <button 
          className={`rc-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <FiBook /> Thư viện E-books
        </button>
        <button 
          className={`rc-tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
          onClick={() => setActiveTab('downloads')}
        >
          <FiHardDrive /> Tủ sách cá nhân
        </button>
      </div>

      <div className="resource-content">
        {activeTab === 'materials' && <MaterialsTab isLoading={isLoading} />}
        {activeTab === 'library' && <LibraryTab isLoading={isLoading} />}
        {activeTab === 'downloads' && <DownloadsTab isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default ResourceCenter;
