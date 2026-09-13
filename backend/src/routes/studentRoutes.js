const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const scheduleController = require('../controllers/student/scheduleController');
const transactionController = require('../controllers/student/transactionController');
const achievementsController = require('../controllers/student/achievementsController');
const { authenticate, authorize } = require('../middleware/auth');

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
router.get('/achievements', achievementsController.getAchievements);

// Gamification & Certificates
router.post('/lessons/:id/complete', studentController.completeLesson);
router.get('/gamification', studentController.getGamificationStatus);

// Code Execution
router.post('/code/execute', studentController.executeCode);

// Interactive Questions
router.post('/questions/:id/check', studentController.checkInteractiveAnswer);

module.exports = router;
