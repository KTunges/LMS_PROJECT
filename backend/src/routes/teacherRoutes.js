const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('teacher', 'admin'));

router.get('/dashboard', teacherController.getDashboardStats);
router.get('/classes', teacherController.getMyClasses);

module.exports = router;
