import { useState } from 'react';
import { FiSearch, FiBook, FiBookOpen, FiExternalLink, FiStar, FiFilter } from 'react-icons/fi';
import './DigitalLibrary.css';

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

const categories = ['Tất cả', 'Kỹ thuật Phần mềm', 'Giải thuật', 'Cơ sở Dữ liệu', 'Mạng Máy tính', 'Trí tuệ Nhân tạo', 'Hệ Điều hành'];

const DigitalLibrary = () => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Tất cả');

  const filtered = mockBooks
    .filter(b => filterCat === 'Tất cả' || b.category === filterCat)
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="library-page animate-scaleIn">
      <div className="library-header">
        <div>
          <h1>Thư viện số</h1>
          <p>Tra cứu và mượn sách điện tử từ thư viện trường</p>
        </div>
      </div>

      {/* Stats */}
      <div className="library-stats">
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

      {/* Search + Filter */}
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

      {/* Book grid */}
      <div className="books-grid">
        {filtered.map(book => (
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
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
