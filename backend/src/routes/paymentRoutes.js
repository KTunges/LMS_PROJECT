const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

// Tạo phiên thanh toán MoMo (dành cho sinh viên đăng nhập)
router.post('/momo/create', authenticate, authorize('student'), paymentController.createMomoPayment);

// Xác thực kết quả thanh toán từ MoMo Redirect
router.post('/momo/verify', authenticate, paymentController.verifyMomoPayment);

// Webhook IPN từ MoMo (công khai không cần jwt header)
router.post('/momo/ipn', paymentController.handleMomoIpn);

// Thanh toán thẻ ATM nội địa (NCB / Napas)
router.post('/atm/process', authenticate, authorize('student'), paymentController.processAtmPayment);

module.exports = router;
