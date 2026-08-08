import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import { FiShield } from 'react-icons/fi';
import './PinSetupModal.css';

const PinSetupModal = () => {
  const { requirePinSetup, completePinSetup } = useAuth();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalPin = pin.join('');
    if (finalPin.length !== 6) {
      toast.warning('Vui lòng nhập đủ 6 chữ số!');
      return;
    }

    setLoading(true);
    try {
      await authService.setupPin(finalPin);
      toast.success('Thiết lập Mã PIN thành công!');
      completePinSetup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thiết lập PIN thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal-content glass-card">
        <div className="pin-modal-header">
          <div className="pin-icon-wrapper">
            <FiShield size={32} />
          </div>
          <h2>Bảo mật tài khoản</h2>
          <p>
            Đây là lần đầu tiên bạn đăng nhập vào hệ thống.
            Vui lòng thiết lập Mã PIN (6 chữ số) để tăng cường bảo mật.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-container">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                type="password"
                inputMode="numeric"
                className="otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(idx, e)}
                ref={(el) => (pinRefs.current[idx] = el)}
                disabled={loading}
              />
            ))}
          </div>

          <button type="submit" className="pin-submit-btn" disabled={loading}>
            {loading ? <span className="vip-loader"></span> : 'Xác nhận mã PIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinSetupModal;
