const express = require('express');
const router = express.Router();
const { getAllCourses, getStudentClasses } = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Lấy danh sách tất cả khóa học
 *     tags: [Khóa học]
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /api/courses/my-classes:
 *   get:
 *     summary: Lấy danh sách các lớp học phần sinh viên đang tham gia
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lớp học và điểm số
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/my-classes', authenticate, getStudentClasses);

module.exports = router;
