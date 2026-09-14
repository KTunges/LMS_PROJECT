import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiBookOpen, FiList, FiArrowLeft, FiClock, FiShield } from 'react-icons/fi';
import { paymentService } from '../../services';
import './CourseCatalog.css';

const MomoReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const orderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');
  const transId = searchParams.get('transId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const verify = async () => {
      if (!orderId) {
        setLoading(false);
        setIsSuccess(false);
        setErrorMessage('Không tìm thấy thông tin đơn hàng thanh toán.');
        return;
      }

      try {
        const res = await paymentService.verifyMomoPayment({
          orderId,
          resultCode,
          message,
          transId,
          amount
        });

        if (res.data && res.data.success) {
          setIsSuccess(true);
          setPaymentData(res.data.data);
        } else {
          setIsSuccess(false);
          setErrorMessage(res.data?.message || 'Giao dịch MoMo không thành công');
        }
      } catch (err) {
        console.error('Lỗi đối soát thanh toán MoMo:', err);
        setIsSuccess(false);
        setErrorMessage(err.response?.data?.message || 'Lỗi đối soát giao dịch MoMo. Vui lòng liên hệ hỗ trợ.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [orderId, resultCode, message, transId, amount]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--theme-bg-base, #f8fafc)'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: 'var(--theme-card-bg, #ffffff)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid var(--theme-border-color, #e2e8f0)',
        textAlign: 'center'
      }}>
        {loading ? (
          <div style={{ padding: '40px 20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              border: '4px solid #fce7f3',
              borderTop: '4px solid #d82d8b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px auto'
            }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--theme-text-main, #0f172a)', marginBottom: '8px' }}>
              Đang xác thực kết quả thanh toán MoMo...
            </h3>
            <p style={{ color: 'var(--theme-text-muted, #64748b)', fontSize: '14px' }}>
              Hệ thống đang ghi nhận giao dịch và kích hoạt khóa học của bạn, vui lòng đợi trong giây lát.
            </p>
          </div>
        ) : isSuccess ? (
          <div>
            {/* MoMo Badge + Success Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.35)',
              color: 'white'
            }}>
              <FiCheckCircle size={44} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '4px 14px', borderRadius: '20px', marginBottom: '16px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d82d8b' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#be185d' }}>Cổng Thanh Toán MoMo Sandbox</span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--theme-text-main, #0f172a)', margin: '0 0 8px 0' }}>
              Thanh Toán Thành Công!
            </h2>
            <p style={{ color: 'var(--theme-text-muted, #64748b)', fontSize: '15px', marginBottom: '28px' }}>
              Bạn đã đăng ký khóa học thành công và tiền học phí đã được ghi nhận trực tiếp vào tài khoản giảng viên.
            </p>

            {/* Receipt Card */}
            <div style={{
              background: 'var(--theme-bg-subtle, #f8fafc)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px',
              border: '1px dashed var(--theme-border-color, #cbd5e1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Khóa học:</span>
                <strong style={{ color: '#0f172a', textAlign: 'right', maxWidth: '65%' }}>
                  {paymentData?.course?.name || 'Khóa học'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Số tiền thanh toán:</span>
                <strong style={{ color: '#10b981', fontSize: '16px' }}>
                  +{Number(paymentData?.amount || amount || 0).toLocaleString('vi-VN')}đ
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Mã giao dịch MoMo:</span>
                <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '13px' }}>
                  {transId || paymentData?.orderId || orderId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Phương thức:</span>
                <span style={{ color: '#be185d', fontWeight: 600 }}>Ví Điện Tử MoMo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Trạng thái:</span>
                <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FiShield size={15} /> Đã kích hoạt lớp học
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/student/my-classes')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                <FiBookOpen size={18} /> Vào học ngay
              </button>
              <button
                onClick={() => navigate('/student/transactions')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: 'var(--theme-card-bg, #ffffff)',
                  color: 'var(--theme-text-main, #334155)',
                  border: '1px solid var(--theme-border-color, #cbd5e1)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FiList size={16} /> Lịch sử
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Failed Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              border: '2px solid #fecaca'
            }}>
              <FiXCircle size={44} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Thanh Toán Chưa Hoàn Tất
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              {errorMessage || 'Giao dịch qua Ví MoMo bị hủy hoặc không thể hoàn thành.'}
            </p>

            <button
              onClick={() => navigate('/student/catalog')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#0f172a',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FiArrowLeft size={18} /> Quay lại danh mục khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomoReturn;
