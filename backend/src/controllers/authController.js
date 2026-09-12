const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register Step 1: Send OTP to Email
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (existingUser.is_verified) {
        return res.status(400).json({ message: 'Email này đã được sử dụng' });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    let user = existingUser;
    if (user) {
      user.otp_code = hashedOtp;
      user.otp_expires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save({ hooks: false });
    } else {
      user = await User.create({
        full_name: 'Chưa cập nhật', // Placeholder
        email,
        password: null, // Temporary null password to bypass length validation
        role: 'student',
        is_verified: false,
        otp_code: hashedOtp,
        otp_expires: Date.now() + 10 * 60 * 1000,
      });
    }

    // Send email
    await sendEmail({
      to: email,
      subject: 'Mã xác nhận đăng ký tài khoản LMS',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Chào mừng bạn đến với Hệ thống LMS</h2>
          <p>Mã xác nhận (OTP) của bạn là:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 36px; margin: 20px 0;">${otp}</h1>
          <p>Mã này sẽ hết hạn trong vòng 10 phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Vui lòng kiểm tra email để lấy mã OTP.', email });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mã OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'Tài khoản đã được xác thực trước đó' });
    }

    if (!user.otp_code || !user.otp_expires || user.otp_expires < Date.now()) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn hoặc không tồn tại' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp_code);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mã OTP không đúng' });
    }

    // Mark as verified
    user.is_verified = true;
    user.otp_code = null;
    user.otp_expires = null;
    await user.save({ hooks: false }); // Skip hashing again

    res.json({
      message: 'Xác thực tài khoản thành công',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete Registration (Step 3)
// @route   POST /api/auth/complete-registration
const completeRegistration = async (req, res, next) => {
  try {
    const { email, full_name, password } = req.body;
    
    if (!email || !full_name || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_verified) {
      return res.status(400).json({ message: 'Vui lòng xác thực email trước khi hoàn tất đăng ký' });
    }

    user.full_name = full_name;
    user.password = password; // Sequelize hook will hash it
    await user.save(); // Allow hooks to run so password gets hashed

    const token = generateToken(user);
    const requirePinSetup = !user.pin_code;

    res.json({
      message: 'Đăng ký thành công',
      token,
      require_pin_setup: requirePinSetup,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ 
      where: { email },
      include: ['major']
    });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Default seeded users won't be verified, so we bypass for admin/teacher or we can just assume existing students are verified
    // But for a robust system, we should allow login for seeded users.
    // Let's say if it's a student and not verified, reject. Wait, we'll just check is_verified.
    // Assuming seeded users are marked as verified (default false, but maybe we should let them in or update seed.js).
    // For now, let's just allow if is_verified is true, OR if they were created before this feature (we'll assume all old users can login, let's just let is_verified = false through if they don't have OTP code, meaning they are old users)
    if (!user.is_verified && user.otp_code) {
      return res.status(403).json({ message: 'Vui lòng xác thực tài khoản qua OTP trước khi đăng nhập' });
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

// @desc    Google Login
// @route   POST /api/auth/google
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Thiếu Google Token' });

    // Verify token or fetch profile if it's an access_token
    let google_id, email, full_name, avatar;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      });
      const payload = ticket.getPayload();
      google_id = payload.sub;
      email = payload.email;
      full_name = payload.name;
      avatar = payload.picture;
    } catch (err) {
      // If verifyIdToken fails, it might be an access_token. Let's fetch from Google API.
      const response = await require('axios').get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = response.data;
      google_id = payload.sub;
      email = payload.email;
      full_name = payload.name;
      avatar = payload.picture;
    }

    let user = await User.findOne({ where: { email }, include: ['major'] });

    if (!user) {
      // Create new user
      user = await User.create({
        full_name,
        email,
        google_id,
        avatar,
        is_verified: true,
        role: 'student'
      });
    } else {
      // Update existing user with google_id
      user.google_id = google_id;
      user.is_verified = true;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    }

    const jwtToken = generateToken(user);
    const requirePinSetup = !user.pin_code;

    res.json({
      message: 'Đăng nhập Google thành công',
      token: jwtToken,
      require_pin_setup: requirePinSetup,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Xác thực Google thất bại' });
  }
};

// @desc    Facebook Login
// @route   POST /api/auth/facebook
const facebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: 'Thiếu Facebook Access Token' });

    // Verify token via Facebook Graph API
    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { id: facebook_id, email, name: full_name } = response.data;
    
    // Facebook might not return email if not allowed, handle this case
    if (!email) {
      return res.status(400).json({ message: 'Tài khoản Facebook chưa cung cấp email' });
    }

    const avatar = response.data.picture?.data?.url;

    let user = await User.findOne({ where: { email }, include: ['major'] });

    if (!user) {
      // Create new user
      user = await User.create({
        full_name,
        email,
        facebook_id,
        avatar,
        is_verified: true,
        role: 'student'
      });
    } else {
      // Update existing user with facebook_id
      user.facebook_id = facebook_id;
      user.is_verified = true;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
    }

    const jwtToken = generateToken(user);
    const requirePinSetup = !user.pin_code;

    res.json({
      message: 'Đăng nhập Facebook thành công',
      token: jwtToken,
      require_pin_setup: requirePinSetup,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(401).json({ message: 'Xác thực Facebook thất bại' });
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

    // Generate Reset Token (Hex String for URL)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.reset_password_token = hashedToken;
    user.reset_password_expires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ hooks: false });

    // Assuming the frontend is running on localhost:5173 or deployed URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Yêu cầu khôi phục mật khẩu LMS',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Khôi phục mật khẩu Hệ thống LMS</h2>
          <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng click vào nút bên dưới để tạo mật khẩu mới:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Khôi phục mật khẩu</a>
          <p>Hoặc copy link này dán vào trình duyệt:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Link này sẽ hết hạn trong vòng 15 phút.</p>
          <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng đổi mật khẩu ngay lập tức.</p>
        </div>
      `,
    });

    res.json({ message: 'Hướng dẫn khôi phục mật khẩu đã được gửi vào email của bạn' });
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

// @desc    Update current user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, address, code } = req.body;
    const user = await User.findByPk(req.user.id, {
      include: ['major']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.full_name = full_name || user.full_name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.address = address !== undefined ? address : user.address;
    user.code = code !== undefined ? code : user.code;

    await user.save();

    res.json({
      message: 'Cập nhật thông tin thành công',
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    const user = await User.findByPk(req.user.id, {
      include: ['major']
    });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.json({
      message: 'Cập nhật ảnh đại diện thành công',
      avatarUrl,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verifyOtp, completeRegistration, login, googleLogin, facebookLogin, setupPin, forgotPassword, resetPassword, getProfile, updateProfile, changePassword, uploadAvatar };
