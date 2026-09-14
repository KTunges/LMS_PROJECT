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
router.post('/courses/:courseId/sync-curriculum', teacherController.syncCurriculum);

// Categories
router.get('/categories', teacherController.getCategories);

// Curriculum Management
router.post('/courses/:courseId/lessons', teacherController.addLesson);
router.put('/lessons/:lessonId', teacherController.updateLesson);
router.delete('/lessons/:lessonId', teacherController.deleteLesson);

// Interactive Questions
router.get('/lessons/:lessonId/questions', teacherController.getInteractiveQuestions);
router.post('/lessons/:lessonId/questions', teacherController.addInteractiveQuestion);
router.delete('/questions/:questionId', teacherController.deleteInteractiveQuestion);

// Students & QA
router.get('/students', teacherController.getStudents);
router.get('/qa', teacherController.getQA);
router.post('/qa/:id/reply', teacherController.replyQA);

module.exports = router;
