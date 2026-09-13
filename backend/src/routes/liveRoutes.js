const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const { authenticate } = require('../middleware/auth');

// Get all active live sessions (for students to see)
router.get('/sessions/active', authenticate, liveController.getActiveSessions);

// Create a new live session (Teacher only)
router.post('/sessions', authenticate, liveController.createSession);

// End a live session (Teacher only)
router.put('/sessions/:id/end', authenticate, liveController.endSession);

// Get chat history for a session
router.get('/sessions/:id/messages', authenticate, liveController.getSessionMessages);

module.exports = router;
