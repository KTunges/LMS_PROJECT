const express = require('express');
const router = express.Router();
const { getMyCurriculum } = require('../controllers/curriculumController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/curriculum/my-curriculum:
 *   get:
 *     summary: Lấy chương trình khung của sinh viên đang đăng nhập
 *     tags: [Chương trình khung]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-curriculum', authenticate, getMyCurriculum);

module.exports = router;
