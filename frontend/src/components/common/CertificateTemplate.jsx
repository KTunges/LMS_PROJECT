import React, { forwardRef } from 'react';

const CertificateTemplate = forwardRef(({ studentName, courseName, issueDate, score }, ref) => {
  return (
    <div 
      ref={ref} 
      style={{
        width: '800px',
        height: '600px',
        padding: '40px',
        background: '#fff',
        border: '15px solid #1e3a8a',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        color: '#333',
        textAlign: 'center'
      }}
    >
      <div style={{ position: 'absolute', top: '20px', left: '30px', right: '30px', bottom: '20px', border: '2px solid #bfdbfe' }}></div>
      
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ fontSize: '42px', color: '#1e3a8a', margin: '0', textTransform: 'uppercase', letterSpacing: '4px' }}>
          Chứng Nhận Hoàn Thành
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginTop: '10px' }}>LMS - Hệ Thống Quản Lý Học Liệu Số</p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <p style={{ fontSize: '20px', margin: '0' }}>Chứng nhận học viên:</p>
        <h2 style={{ fontSize: '36px', color: '#0f172a', margin: '15px 0', fontWeight: 'bold' }}>
          {studentName || 'Tên Học Viên'}
        </h2>
      </div>

      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '20px', margin: '0' }}>Đã hoàn thành xuất sắc khóa học:</p>
        <h3 style={{ fontSize: '28px', color: '#2563eb', margin: '15px 0', padding: '0 40px' }}>
          {courseName || 'Tên Khóa Học'}
        </h3>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '50px' }}>
        <div>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 5px 0' }}>Kết quả đạt được</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '0' }}>{score}/100 Điểm</p>
        </div>
        <div>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 5px 0' }}>Ngày cấp</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{issueDate || 'Ngày/Tháng/Năm'}</p>
        </div>
      </div>

      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', padding: '0 80px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '150px', borderBottom: '1px solid #94a3b8', margin: '0 auto 10px auto', height: '40px' }}>
            <span style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '32px', color: '#0f172a' }}>Admin</span>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>Giám Đốc Đào Tạo</p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#eff6ff', 
            borderRadius: '50%', 
            border: '2px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto'
          }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>LMS</span>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>Dấu Xác Nhận</p>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;
