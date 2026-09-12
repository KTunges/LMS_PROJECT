const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', studentController.getDashboardStats);
router.get('/classes', studentController.getMyClasses);

module.exports = router;
