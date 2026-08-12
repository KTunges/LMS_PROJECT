import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { FiShield, FiArrowLeft } from 'react-icons/fi';
import './PinSetupModal.css';

const PinSetupModal = () => {
  const { requirePinSetup, completePinSetup } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter PIN, 2: Confirm PIN
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

  useEffect(() => {
    // Focus first input when step changes
    if (pinRefs.current[0]) {
      pinRefs.current[0].focus();
    }
  }, [step]);

  if (!requirePinSetup) return null;

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      pinRefs.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1].focus();
    }
  };

  const handleBack = () => {
    setStep(1);
    setPin(['', '', '', '', '', '']);
    setFirstPin('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentPin = pin.join('');
    
    if (currentPin.length !== 6) {
      toast.warning('Vui lòng nhập đủ 6 chữ số!');
      return;
    }

    if (step === 1) {
      setFirstPin(currentPin);
      setPin(['', '', '', '', '', '']);
      setStep(2);
      return;
    }

    // Step 2: Confirm PIN
    if (currentPin !== firstPin) {
      toast.error('Mã PIN xác nhận không khớp! Vui lòng thử lại.');
      handleBack();
      return;
    }

    setLoading(true);
    try {
      await authService.setupPin(currentPin);
      toast.success('Thiết lập Mã PIN thành công!');
      completePinSetup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thiết lập PIN thất bại!');
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal-content glass-card">
        {step === 2 && (
          <button className="pin-back-btn" onClick={handleBack} disabled={loading} title="Quay lại">
            <FiArrowLeft size={20} />
          </button>
        )}
        
        <div className="pin-modal-header">
          <div className="pin-icon-wrapper">
            <FiShield size={32} />
          </div>
          <h2>{step === 1 ? 'Thiết lập mã PIN' : 'Xác nhận mã PIN'}</h2>
          <p>
            {step === 1 
              ? 'Đây là lần đầu tiên bạn đăng nhập vào hệ thống. Vui lòng thiết lập Mã PIN (6 chữ số) để tăng cường bảo mật.'
              : 'Vui lòng nhập lại Mã PIN vừa thiết lập để xác nhận.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            {pin.map((digit, idx) => (
              <input
                key={`${step}-${idx}`} // Force re-render on step change to reset focus correctly
                type="password"
                inputMode="numeric"
                className="otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(idx, e)}
                ref={(el) => (pinRefs.current[idx] = el)}
                disabled={loading}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <button type="submit" className="pin-submit-btn" disabled={loading}>
            {loading ? (
              <span className="vip-loader"></span>
            ) : (
              step === 1 ? 'Tiếp tục' : 'Xác nhận và Lưu'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinSetupModal;
