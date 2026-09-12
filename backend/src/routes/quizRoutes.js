const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/:quizId', quizController.getQuizDetails);
router.post('/:quizId/submit', quizController.submitQuiz);

module.exports = router;
