import { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiDownload, FiStar, FiEdit2, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { SkeletonProfile, SkeletonTable } from '../../components/common/SkeletonLoaders';
import './Profile.css';

const Profile = () => {
  const { user, updateUserLocal } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    code: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        code: user.code || ''
      });
      setIsLoading(false);
    }
  }, [user]);

  const [profileStats, setProfileStats] = useState({
    enrolled: 0,
    downloads: 0,
    gpa: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classesRes, gradesRes] = await Promise.all([
          import('../../services').then(m => m.studentService.getMyClasses()),
          import('../../services').then(m => m.studentService.getGrades())
        ]);
        const classes = classesRes.data?.success ? classesRes.data.data : [];
        const grades = gradesRes.data?.success ? gradesRes.data.data : [];
        let totalScore = 0, count = 0;
        grades.forEach(g => { if (g.total > 0) { totalScore += g.total; count++; } });
        setProfileStats({
          enrolled: classes.length,
          downloads: 0,
          gpa: count > 0 ? (totalScore / count).toFixed(1) : '0.0'
        });
      } catch (err) {
        console.error('Failed to fetch profile stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleInfoChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsSaving(true);
      const res = await authService.updateProfile(formData);
      updateUserLocal(res.data.user);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setIsSaving(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn file hình ảnh hợp lệ!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa 5MB!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await authService.uploadAvatar(formData);
      updateUserLocal({ avatar: res.data.avatarUrl });
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tải lên ảnh đại diện!');
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

  const avatarSrc = user?.avatar 
    ? `http://localhost:5000${user.avatar}` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=2563eb&color=fff&size=120`;

  return (
    <div className="profile-page">
      {/* Header Profile Card */}
      <div className="profile-header-card glass-card">
        <div className="profile-header__bg"></div>
        <div className="profile-header__content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img src={avatarSrc} alt="Avatar" />
            </div>
            <button 
              className="profile-avatar-edit" 
              title="Thay đổi ảnh đại diện"
              onClick={() => fileInputRef.current.click()}
            >
              <FiCamera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{user?.full_name}</h1>
            <p className="profile-major">
              {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giảng viên' : (user?.major?.name || 'Sinh viên')} 
              {user?.code && ` • ${user.code}`}
            </p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon bg-blue-light"><FiBookOpen /></div>
              <div className="stat-details">
                <span className="stat-value">{profileStats.enrolled}</span>
                <span className="stat-label">Môn học</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bg-green-light"><FiDownload /></div>
              <div className="stat-details">
                <span className="stat-value">{profileStats.downloads}</span>
                <span className="stat-label">Tài liệu tải</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bg-yellow-light"><FiStar /></div>
              <div className="stat-details">
                <span className="stat-value">{profileStats.gpa}</span>
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
            <div className="tab-pane fade-in">
              <div className="pane-header">
                <h2>Thông tin cá nhân</h2>
                <button 
                  className={`action-btn ${isEditing ? 'btn-save' : 'btn-edit'}`}
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <>{isSaving ? 'Đang lưu...' : <><FiSave /> Lưu thay đổi</>}</>
                  ) : (
                    <><FiEdit2 /> Chỉnh sửa</>
                  )}
                </button>
              </div>

              <div className="info-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input 
                      type="text" 
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInfoChange}
                      disabled={!isEditing} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled={true} 
                      title="Không thể thay đổi email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mã Sinh Viên</label>
                  <div className="input-with-icon">
                    <FiBookOpen className="input-icon" />
                    <input 
                      type="text" 
                      name="code"
                      value={formData.code}
                      onChange={handleInfoChange}
                      disabled={!isEditing} 
                      placeholder="VD: SV20239999"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <div className="input-with-icon">
                    <FiPhone className="input-icon" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInfoChange}
                      disabled={!isEditing} 
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Địa chỉ</label>
                  <div className="input-with-icon">
                    <FiMapPin className="input-icon" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInfoChange}
                      disabled={!isEditing} 
                      placeholder="Chưa cập nhật"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-pane fade-in">
              <div className="pane-header">
                <h2>Đổi mật khẩu</h2>
              </div>
              
              <form className="security-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input 
                      type="password" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu cũ..." 
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới..." 
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới..." 
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ marginTop: '16px' }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
