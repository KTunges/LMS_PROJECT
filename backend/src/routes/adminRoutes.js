const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/courses', adminController.getCourses);
router.put('/courses/:id/status', adminController.updateCourseStatus);
router.get('/users', adminController.getUsers);
router.get('/finance', adminController.getTransactions);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.put('/users/:id/verify', adminController.verifyUser);
router.put('/finance/:id/approve', adminController.approveTransaction);
router.put('/finance/:id/reject', adminController.rejectTransaction);

module.exports = router;
