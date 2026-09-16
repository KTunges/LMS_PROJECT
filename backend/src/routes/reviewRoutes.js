const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { Review, User, Course, Enrollment, Class } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/courses/:courseId/reviews — Lấy danh sách đánh giá của 1 khóa học
router.get('/:courseId/reviews', async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.findAll({
      where: { course_id: courseId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'avatar_url'] }
      ],
      order: [['created_at', 'DESC']],
    });

    // Tính trung bình sao
    const stats = await Review.findOne({
      where: { course_id: courseId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews'],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        reviews,
        avgRating: stats.avgRating ? parseFloat(Number(stats.avgRating).toFixed(1)) : 0,
        totalReviews: parseInt(stats.totalReviews) || 0,
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses/:courseId/reviews — Sinh viên gửi đánh giá
router.post('/:courseId/reviews', authenticate, async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Số sao phải từ 1 đến 5' });
    }

    // Kiểm tra đã ghi danh chưa
    const enrolled = await Enrollment.findOne({
      include: [{ model: Class, as: 'class', where: { course_id: courseId } }],
      where: { student_id: studentId },
    });

    if (!enrolled) {
      return res.status(403).json({ success: false, message: 'Bạn cần ghi danh khóa học trước khi đánh giá' });
    }

    // Kiểm tra đã đánh giá chưa
    const existing = await Review.findOne({
      where: { student_id: studentId, course_id: courseId },
    });

    if (existing) {
      // Cập nhật đánh giá cũ
      existing.rating = rating;
      existing.comment = comment || existing.comment;
      await existing.save();
      return res.json({ success: true, message: 'Cập nhật đánh giá thành công', data: existing });
    }

    // Tạo mới
    const review = await Review.create({
      student_id: studentId,
      course_id: courseId,
      rating,
      comment: comment || null,
    });

    res.status(201).json({ success: true, message: 'Đánh giá thành công', data: review });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
