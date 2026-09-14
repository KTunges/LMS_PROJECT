import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSave, FiUser, FiCreditCard, FiGlobe, FiLock, FiShield, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './TeacherSettings.css';

const TeacherSettings = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.includes('settings') ? 'security' : 'profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({old: false, new: false, confirm: false});

  // Profile form
  const [profile, setProfile] = useState({
    full_name: '',
    title: 'Senior Frontend Engineer',
    bio: 'Hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm...',
    phone: '',
    email: ''
  });

  // Payout form
  const [payout, setPayout] = useState({
    bank_name: 'Vietcombank',
    branch: '',
    account_name: '',
    account_number: ''
  });

  // Social form
  const [social, setSocial] = useState({
    website: '',
    linkedin: '',
    youtube: '',
    github: ''
  });

  // Security form
  const [security, setSecurity] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname.includes('settings')) {
      setActiveTab('security');
    } else if (location.pathname.includes('profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const handleSave = async (section) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);

    if (section === 'security') {
      if (security.new_password !== security.confirm_password) {
        toast.error('Mật khẩu xác nhận không khớp!');
        return;
      }
      if (security.new_password.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }
      setSecurity({ old_password: '', new_password: '', confirm_password: '' });
    }

    toast.success('Đã lưu thông tin thành công!');
  };

  const tabs = [
    { id: 'profile', icon: <FiUser size={18} />, label: 'Hồ sơ Giảng viên' },
    { id: 'payout', icon: <FiCreditCard size={18} />, label: 'Nhận thanh toán' },
    { id: 'social', icon: <FiGlobe size={18} />, label: 'Mạng xã hội' },
    { id: 'security', icon: <FiLock size={18} />, label: 'Bảo mật' },
  ];

  return (
    <div className="tset-page">
      <div className="tset-header">
        <h1 className="tset-title">Hồ sơ & <span className="gradient-text">Cài đặt</span></h1>
        <p className="tset-subtitle">Quản lý thông tin cá nhân và phương thức thanh toán.</p>
      </div>

      <div className="tset-layout">
        {/* Sidebar */}
        <div className="tset-sidebar">
          <div className="tset-sidebar__avatar-section">
            <div className="tset-sidebar__avatar-wrapper">
              <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'T'}`} alt="Avatar" className="tset-sidebar__avatar" />
              <button className="tset-sidebar__avatar-edit"><FiCamera size={14} /></button>
            </div>
            <div className="tset-sidebar__name">{user?.full_name || 'Giảng viên'}</div>
            <div className="tset-sidebar__email">{user?.email || ''}</div>
          </div>

          <nav className="tset-sidebar__nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tset-sidebar__nav-item ${activeTab === tab.id ? 'tset-sidebar__nav-item--active' : ''}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="tset-content">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="tset-section">
              <h2 className="tset-section__title">Thông tin Cơ bản</h2>

              <div className="tset-form-grid">
                <div className="tset-field">
                  <label>Họ và tên</label>
                  <input type="text" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>Chức danh / Chuyên môn</label>
                  <input type="text" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>Email</label>
                  <input type="email" value={profile.email} disabled />
                </div>
                <div className="tset-field">
                  <label>Số điện thoại</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="0912 345 678" />
                </div>
              </div>

              <div className="tset-field" style={{marginTop: '16px'}}>
                <label>Giới thiệu bản thân (Bio)</label>
                <textarea rows={5} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                <p className="tset-field__hint">Đoạn giới thiệu này sẽ hiển thị ở phần "Về Giảng viên" trong các khóa học của bạn.</p>
              </div>

              <button className="tset-save-btn" onClick={() => handleSave('profile')} disabled={isSaving}>
                <FiSave /> {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          )}

          {/* PAYOUT TAB */}
          {activeTab === 'payout' && (
            <div className="tset-section">
              <h2 className="tset-section__title">Tài khoản Nhận Tiền</h2>
              
              <div className="tset-info-box">
                <FiShield size={20} />
                <p>Doanh thu từ việc bán khóa học sẽ được chuyển khoản định kỳ (mùng 10 hàng tháng) vào tài khoản ngân hàng mà bạn cung cấp dưới đây. Thông tin được mã hóa an toàn.</p>
              </div>

              <div className="tset-form-grid">
                <div className="tset-field">
                  <label>Tên Ngân hàng</label>
                  <select value={payout.bank_name} onChange={e => setPayout({...payout, bank_name: e.target.value})}>
                    <option>Vietcombank</option>
                    <option>Techcombank</option>
                    <option>MB Bank</option>
                    <option>TPBank</option>
                    <option>ACB</option>
                    <option>VPBank</option>
                    <option>Agribank</option>
                    <option>BIDV</option>
                  </select>
                </div>
                <div className="tset-field">
                  <label>Chi nhánh</label>
                  <input type="text" placeholder="VD: Chi nhánh Hà Nội" value={payout.branch} onChange={e => setPayout({...payout, branch: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>Tên Chủ tài khoản</label>
                  <input type="text" placeholder="VIET HOA KHONG DAU" value={payout.account_name} onChange={e => setPayout({...payout, account_name: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>Số Tài khoản</label>
                  <input type="text" placeholder="Nhập số tài khoản..." value={payout.account_number} onChange={e => setPayout({...payout, account_number: e.target.value})} />
                </div>
              </div>

              <button className="tset-save-btn" onClick={() => handleSave('payout')} disabled={isSaving}>
                <FiSave /> {isSaving ? 'Đang lưu...' : 'Lưu phương thức thanh toán'}
              </button>
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <div className="tset-section">
              <h2 className="tset-section__title">Liên kết Mạng xã hội</h2>
              <p className="tset-section__desc">Hiển thị các nút mạng xã hội trên trang cá nhân để học viên dễ dàng theo dõi bạn.</p>

              <div className="tset-form-column">
                <div className="tset-field">
                  <label>Website cá nhân</label>
                  <input type="text" placeholder="https://yourwebsite.com" value={social.website} onChange={e => setSocial({...social, website: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>LinkedIn</label>
                  <input type="text" placeholder="https://linkedin.com/in/username" value={social.linkedin} onChange={e => setSocial({...social, linkedin: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>YouTube Channel</label>
                  <input type="text" placeholder="https://youtube.com/c/channel" value={social.youtube} onChange={e => setSocial({...social, youtube: e.target.value})} />
                </div>
                <div className="tset-field">
                  <label>GitHub</label>
                  <input type="text" placeholder="https://github.com/username" value={social.github} onChange={e => setSocial({...social, github: e.target.value})} />
                </div>
              </div>

              <button className="tset-save-btn" onClick={() => handleSave('social')} disabled={isSaving}>
                <FiSave /> {isSaving ? 'Đang lưu...' : 'Cập nhật mạng xã hội'}
              </button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="tset-section">
              <h2 className="tset-section__title">Đổi Mật khẩu</h2>
              <p className="tset-section__desc">Đảm bảo tài khoản của bạn luôn được bảo vệ bằng một mật khẩu mạnh.</p>

              <div className="tset-form-column">
                <div className="tset-field">
                  <label>Mật khẩu hiện tại</label>
                  <div className="tset-password-wrapper">
                    <input type={showPassword.old ? 'text' : 'password'} placeholder="Nhập mật khẩu cũ..." value={security.old_password}
                      onChange={e => setSecurity({...security, old_password: e.target.value})} />
                    <button className="tset-password-toggle" onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}>
                      {showPassword.old ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="tset-field">
                  <label>Mật khẩu mới</label>
                  <div className="tset-password-wrapper">
                    <input type={showPassword.new ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự..." value={security.new_password}
                      onChange={e => setSecurity({...security, new_password: e.target.value})} />
                    <button className="tset-password-toggle" onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}>
                      {showPassword.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="tset-field">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="tset-password-wrapper">
                    <input type={showPassword.confirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu mới..." value={security.confirm_password}
                      onChange={e => setSecurity({...security, confirm_password: e.target.value})} />
                    <button className="tset-password-toggle" onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}>
                      {showPassword.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="tset-save-btn" onClick={() => handleSave('security')} disabled={isSaving}>
                <FiLock /> {isSaving ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
