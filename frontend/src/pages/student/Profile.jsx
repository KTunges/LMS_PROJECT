import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiDownload, FiStar, FiEdit2, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonProfile, SkeletonTable } from '../../components/common/SkeletonLoaders';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Mock data if user context is missing details
  const profileData = {
    name: user?.name || 'Kim Tùng',
    email: user?.email || 'kimtung5576@gmail.com',
    phone: '0123 456 789',
    address: 'Hà Nội, Việt Nam',
    major: 'Công nghệ thông tin',
    studentId: 'SV20239999',
    stats: {
      enrolled: 12,
      downloads: 45,
      gpa: 3.8
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <SkeletonProfile />
        <div style={{ marginTop: '24px' }}>
          <SkeletonTable rows={3} cols={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header Profile Card */}
      <div className="profile-header-card glass-card">
        <div className="profile-header__bg"></div>
        <div className="profile-header__content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img src="/avatar-placeholder.png" alt="Avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Kim+Tung&background=2563eb&color=fff&size=120'; }} />
            </div>
            <button className="profile-avatar-edit" title="Thay đổi ảnh đại diện">
              <FiEdit2 size={14} />
            </button>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{profileData.name}</h1>
            <p className="profile-major">{profileData.major} • {profileData.studentId}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon bg-blue-light"><FiBookOpen /></div>
              <div className="stat-details">
                <span className="stat-value">{profileData.stats.enrolled}</span>
                <span className="stat-label">Khóa học</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bg-green-light"><FiDownload /></div>
              <div className="stat-details">
                <span className="stat-value">{profileData.stats.downloads}</span>
                <span className="stat-label">Tài liệu tải</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bg-yellow-light"><FiStar /></div>
              <div className="stat-details">
                <span className="stat-value">{profileData.stats.gpa}</span>
                <span className="stat-label">Điểm TB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="profile-main">
        {/* Sidebar Tabs */}
        <div className="profile-tabs glass-card">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FiUser /> Thông tin cá nhân
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock /> Đổi mật khẩu
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content glass-card">
          {activeTab === 'info' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Thông tin cá nhân</h2>
                <button 
                  className={`action-btn ${isEditing ? 'btn-save' : 'btn-edit'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <><FiSave /> Lưu thay đổi</> : <><FiEdit2 /> Chỉnh sửa</>}
                </button>
              </div>

              <div className="info-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input type="text" defaultValue={profileData.name} disabled={!isEditing} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input type="email" defaultValue={profileData.email} disabled={!isEditing} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <div className="input-with-icon">
                    <FiPhone className="input-icon" />
                    <input type="tel" defaultValue={profileData.phone} disabled={!isEditing} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <div className="input-with-icon">
                    <FiMapPin className="input-icon" />
                    <input type="text" defaultValue={profileData.address} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>Đổi mật khẩu</h2>
              </div>
              
              <form className="security-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input type="password" placeholder="Nhập mật khẩu cũ..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input type="password" placeholder="Nhập mật khẩu mới..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input type="password" placeholder="Nhập lại mật khẩu mới..." />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Cập nhật mật khẩu</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
