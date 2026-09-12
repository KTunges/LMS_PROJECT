const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/:lessonId/progress', classController.markLessonProgress);

module.exports = router;
