const express = require('express');
const router = express.Router();
const { getAll, getById, update, remove } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), getAll);
router.get('/:id', authorize('admin'), getById);
router.put('/:id', authorize('admin'), update);
router.delete('/:id', authorize('admin'), remove);

module.exports = router;
