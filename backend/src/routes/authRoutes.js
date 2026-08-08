const express = require('express');
const router = express.Router();
const { register, login, setupPin, forgotPassword, resetPassword, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password]
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Trần Văn B"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "tranvanb@lms.edu.vn"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *                 example: "student"
 *                 description: "Mặc định là student nếu không chỉ định"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUz..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Email đã được sử dụng
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "student@lms.edu.vn"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUz..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Thiếu email hoặc mật khẩu
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/setup-pin:
 *   post:
 *     summary: Cài đặt mã PIN (Bắt buộc ở lần đăng nhập đầu)
 *     tags: [Xác thực]
 *     security:
 *       - bearerAuth: []
 */
router.post('/setup-pin', authenticate, setupPin);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Yêu cầu khôi phục mật khẩu (Gửi email)
 *     tags: [Xác thực]
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu mới
 *     tags: [Xác thực]
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Lấy hồ sơ người dùng hiện tại
 *     tags: [Xác thực]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập hoặc token hết hạn
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;
