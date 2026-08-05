const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove, download,
} = require('../controllers/materialController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: get all materials and get by ID
router.get('/', getAll);
router.get('/:id', getById);

// Protected routes
router.use(authenticate);

// Upload material (teacher + admin)
router.post('/', authorize('admin', 'teacher'), upload.single('file'), create);

// Update & delete (teacher who owns it, or admin)
router.put('/:id', authorize('admin', 'teacher'), update);
router.delete('/:id', authorize('admin', 'teacher'), remove);

// Download (any authenticated user)
router.get('/:id/download', download);

module.exports = router;
