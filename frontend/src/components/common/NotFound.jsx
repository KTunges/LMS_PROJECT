import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 24px auto'
        }}>
          <FiAlertTriangle size={40} color="#ef4444" />
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          404 - Không tìm thấy trang
        </h1>
        
        <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px' }}>
          Đường dẫn bạn đang cố gắng truy cập không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống. Vui lòng kiểm tra lại đường dẫn.
        </p>
        
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
          }}
        >
          <FiHome size={20} /> Quay lại trang trước
        </button>
      </div>
    </div>
  );
};

export default NotFound;
