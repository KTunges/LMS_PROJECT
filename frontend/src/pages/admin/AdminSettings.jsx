import { useState, useEffect } from 'react';
import { FiSettings, FiSave, FiServer, FiShield, FiMail } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    teacherCommissionRate: 70,
    enablePayment: true,
    enableRegistration: true,
    maintenanceMode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        toast.error('Lỗi tải cấu hình hệ thống');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/admin/settings', settings);
      if (res.data.success) {
        toast.success(res.data.message || 'Đã lưu cấu hình hệ thống thành công!');
      }
    } catch (err) {
      toast.error('Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ color: '#1e293b', fontWeight: '500' }}>Đang tải cấu hình...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>Cài đặt hệ thống</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="admin-card">
          <h2 className="admin-card-title"><FiSettings /> Cấu hình chung</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
              Tỷ lệ hoa hồng Giảng viên (%)
            </label>
            <input 
              type="number" 
              name="teacherCommissionRate"
              value={settings.teacherCommissionRate}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Phần trăm doanh thu khóa học mà giảng viên nhận được.</div>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Cho phép đăng ký mới</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Mở cổng đăng ký tài khoản cho Học viên và Giảng viên.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" name="enableRegistration" checked={settings.enableRegistration} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.enableRegistration ? '#16a34a' : '#cbd5e1', borderRadius: '24px', transition: '.4s' }}>
                <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.enableRegistration ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Cổng thanh toán (MoMo)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Cho phép học viên thanh toán khóa học.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" name="enablePayment" checked={settings.enablePayment} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.enablePayment ? '#16a34a' : '#cbd5e1', borderRadius: '24px', transition: '.4s' }}>
                <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.enablePayment ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
              </span>
            </label>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title"><FiShield /> Hệ thống & Bảo mật</h2>
          
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Chế độ bảo trì</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tạm dừng toàn bộ truy cập hệ thống để nâng cấp.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.maintenanceMode ? '#dc2626' : '#cbd5e1', borderRadius: '24px', transition: '.4s' }}>
                <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.maintenanceMode ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
              </span>
            </label>
          </div>
          
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiServer /> Dịch vụ bên thứ ba</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FiCheckCircle color="#16a34a" /> <span style={{ fontSize: '0.9rem', color: '#64748b' }}>AWS S3 Storage (Đã kết nối)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiCheckCircle color="#16a34a" /> <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Nodemailer SMTP (Đã kết nối)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 32px', 
            borderRadius: '8px', 
            fontWeight: 700, 
            fontSize: '1rem', 
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)'
          }}
        >
          <FiSave /> {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>
    </div>
  );
};

// Simple icon for the mockup
const FiCheckCircle = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default AdminSettings;
