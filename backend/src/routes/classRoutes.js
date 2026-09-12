const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/:classId/lessons', classController.getClassLessons);

module.exports = router;
