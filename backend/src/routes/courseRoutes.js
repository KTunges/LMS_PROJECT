const express = require('express');
const router = express.Router();
const { 
  getAllCourses, 
  getStudentClasses, 
  getAvailableClasses,
  enrollInClass,
  cancelEnrollment
} = require('../controllers/courseController');
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

/**
 * @swagger
 * /api/courses/available-classes:
 *   get:
 *     summary: Lấy danh sách lớp học phần đang mở cho đăng ký
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 */
router.get('/available-classes', authenticate, getAvailableClasses);

/**
 * @swagger
 * /api/courses/enroll:
 *   post:
 *     summary: Đăng ký một lớp học phần
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 */
router.post('/enroll', authenticate, enrollInClass);

/**
 * @swagger
 * /api/courses/enroll/{classId}:
 *   delete:
 *     summary: Hủy đăng ký lớp học phần
 *     tags: [Khóa học]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/enroll/:classId', authenticate, cancelEnrollment);

module.exports = router;
