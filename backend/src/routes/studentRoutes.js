const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', studentController.getDashboardStats);
router.get('/classes', studentController.getMyClasses);
router.get('/grades', studentController.getGrades);
router.get('/materials', studentController.getMaterials);
router.get('/catalog', studentController.getCatalog);
router.post('/courses/:courseId/enroll', studentController.enrollInCourse);
router.get('/exams', studentController.getExams);
router.get('/leaderboard', studentController.getLeaderboard);

// Gamification & Certificates
router.post('/lessons/:id/complete', studentController.completeLesson);
router.get('/gamification', studentController.getGamificationStatus);

// Code Execution
router.post('/code/execute', studentController.executeCode);

module.exports = router;
