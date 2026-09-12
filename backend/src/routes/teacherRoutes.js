const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('teacher', 'admin'));

router.get('/dashboard', teacherController.getDashboardStats);
router.get('/classes', teacherController.getMyClasses);

// Course Management (Teacher creating new courses/classes)
router.get('/courses/:id', teacherController.getCourseDetails);
router.post('/courses', teacherController.createCourse);
router.put('/courses/:id', teacherController.updateCourse);
router.delete('/courses/:id', teacherController.deleteCourse);

// Curriculum Management
router.post('/courses/:courseId/lessons', teacherController.addLesson);
router.put('/lessons/:lessonId', teacherController.updateLesson);
router.delete('/lessons/:lessonId', teacherController.deleteLesson);

module.exports = router;
