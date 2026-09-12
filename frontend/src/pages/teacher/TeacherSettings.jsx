import { useState } from 'react';
import { FiSave, FiUser, FiCreditCard, FiGlobe, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../styles/shared.css';

const TeacherSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    toast.success('Đã lưu thông tin cài đặt thành công!');
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard__greeting" style={{ marginBottom: '24px' }}>
        <h1 className="dashboard__greeting-title">Hồ sơ & <span className="gradient-text">Cài đặt</span></h1>
        <p className="dashboard__greeting-subtitle">Quản lý thông tin cá nhân và phương thức thanh toán.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
        {/* Sidebar Menu */}
        <div className="glass-card" style={{ padding: '16px', borderRadius: '16px', height: 'fit-content' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <button 
                onClick={() => setActiveTab('profile')}
                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'profile' ? '#eff6ff' : 'transparent', color: activeTab === 'profile' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'profile' ? 600 : 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <FiUser size={18} /> Hồ sơ Giảng viên
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('payout')}
                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'payout' ? '#eff6ff' : 'transparent', color: activeTab === 'payout' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'payout' ? 600 : 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <FiCreditCard size={18} /> Nhận thanh toán
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('social')}
                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'social' ? '#eff6ff' : 'transparent', color: activeTab === 'social' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'social' ? 600 : 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <FiGlobe size={18} /> Mạng xã hội
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('security')}
                style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'security' ? '#eff6ff' : 'transparent', color: activeTab === 'security' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'security' ? 600 : 500, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <FiLock size={18} /> Bảo mật
              </button>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="glass-card fade-in" style={{ padding: '32px', borderRadius: '16px' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Thông tin Cơ bản</h2>
              
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button className="btn btn-outline" style={{ borderRadius: '8px' }}>Thay đổi Ảnh đại diện</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Họ và tên</label>
                  <input type="text" defaultValue="Giảng viên Nguyễn Văn A" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chức danh / Chuyên môn</label>
                  <input type="text" defaultValue="Senior Frontend Engineer @ TechCorp" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Giới thiệu bản thân (Bio)</label>
                <textarea rows={5} defaultValue="Hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và xây dựng kiến trúc hệ thống..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Đoạn giới thiệu này sẽ hiển thị ở phần "Về Giảng viên" trong các khóa học của bạn.</p>
              </div>

              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}>
                <FiSave /> Lưu thông tin
              </button>
            </div>
          )}

          {activeTab === 'payout' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Tài khoản Nhận Tiền (Payout)</h2>
              
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>Doanh thu từ việc bán khóa học sẽ được chuyển khoản định kỳ (mùng 10 hàng tháng) vào tài khoản ngân hàng mà bạn cung cấp dưới đây.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Tên Ngân hàng</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                    <option>Vietcombank</option>
                    <option>Techcombank</option>
                    <option>MB Bank</option>
                    <option>TPBank</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chi nhánh</label>
                  <input type="text" placeholder="Vd: Chi nhánh Hà Nội" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Tên Chủ tài khoản</label>
                  <input type="text" placeholder="VIET HOA KHONG DAU" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Số Tài khoản</label>
                  <input type="text" placeholder="Nhập số tài khoản ngân hàng..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}>
                <FiSave /> Lưu phương thức thanh toán
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Liên kết Mạng xã hội</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Hiển thị các nút mạng xã hội trên trang cá nhân để học viên dễ dàng theo dõi bạn.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Website cá nhân</label>
                  <input type="text" placeholder="https://yourwebsite.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>LinkedIn</label>
                  <input type="text" placeholder="https://linkedin.com/in/username" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Youtube Channel</label>
                  <input type="text" placeholder="https://youtube.com/c/channel" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}>
                <FiSave /> Cập nhật mạng xã hội
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
