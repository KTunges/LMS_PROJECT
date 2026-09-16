const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth'); // Optionally protect routes

router.post('/chat', authenticate, aiController.chat);
router.post('/summarize', authenticate, aiController.summarize);
router.post('/quiz/generate', authenticate, aiController.generateQuiz);

module.exports = router;
