const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const scheduleController = require('../controllers/student/scheduleController');
const transactionController = require('../controllers/student/transactionController');
const paymentController = require('../controllers/student/paymentController');
const achievementsController = require('../controllers/student/achievementsController');
const { authenticate, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const codeExecuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 execute requests per windowMs
  message: { success: false, message: 'Bạn đã thực thi code quá nhiều lần. Vui lòng thử lại sau 1 phút.' }
});

router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', studentController.getDashboardStats);
router.get('/classes', studentController.getMyClasses);
router.get('/grades', studentController.getGrades);
router.get('/materials', studentController.getMaterials);
router.get('/materials/:id/download', studentController.downloadMaterial);
router.get('/catalog', studentController.getCatalog);
router.post('/courses/:courseId/enroll', studentController.enrollInCourse);
router.get('/exams', studentController.getExams);
router.get('/leaderboard', studentController.getLeaderboard);
router.get('/schedule', scheduleController.getMySchedule);
router.get('/transactions', transactionController.getMyTransactions);
router.post('/payment/create', paymentController.createPaymentUrl);
router.get('/payment/vnpay_return', paymentController.vnpayReturn);
router.get('/achievements', achievementsController.getAchievements);

// Gamification & Certificates
router.post('/lessons/:id/complete', studentController.completeLesson);
router.get('/gamification', studentController.getGamificationStatus);

// Code Execution
router.post('/code/execute', codeExecuteLimiter, studentController.executeCode);

// Interactive Questions
router.post('/questions/:id/check', studentController.checkInteractiveAnswer);

module.exports = router;
