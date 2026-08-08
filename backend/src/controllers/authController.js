const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { Op } = require('sequelize');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  return res.status(403).json({ message: 'Chức năng đăng ký tự do đã bị khóa. Tài khoản sẽ do trường cấp.' });
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user);
    
    // Check if user has setup their PIN
    const requirePinSetup = !user.pin_code;

    res.json({
      message: 'Đăng nhập thành công',
      token,
      require_pin_setup: requirePinSetup,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Setup PIN for first-time login
// @route   POST /api/auth/setup-pin
const setupPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    
    if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
      return res.status(400).json({ message: 'Mã PIN phải là 6 chữ số' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    if (user.pin_code) {
      return res.status(400).json({ message: 'Tài khoản này đã thiết lập mã PIN rồi' });
    }

    user.pin_code = pin;
    await user.save(); // Hook will hash it

    res.json({ message: 'Thiết lập mã PIN thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email' });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.reset_password_token = resetToken;
    user.reset_password_expires = Date.now() + 3600000; // 1 hour
    await user.save({ hooks: false }); // Avoid triggering password hooks

    // Simulate sending email
    console.log(`\n\n[MOCK EMAIL] Password Reset Link for ${email}:`);
    console.log(`http://localhost:5173/reset-password/${resetToken}\n\n`);

    res.json({ message: 'Hướng dẫn khôi phục mật khẩu đã được gửi (Check server console)' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin khôi phục' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: Date.now() } // Token not expired
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Set new password, hooks will hash it
    user.password = newPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công, bạn có thể đăng nhập lại' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  res.json({ user: req.user.toJSON() });
};

module.exports = { register, login, setupPin, forgotPassword, resetPassword, getProfile };
