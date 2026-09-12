const { Class, Course, Lesson, Quiz, LessonProgress } = require('../models');
const { Op } = require('sequelize');

// GET /api/classes/:classId/lessons
exports.getClassLessons = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const studentId = req.user.id; // from auth middleware

    const cls = await Class.findByPk(classId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!cls) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
    }

    // Get lessons belonging to the course OR this specific class
    const lessons = await Lesson.findAll({
      where: {
        [Op.or]: [
          { course_id: cls.course_id },
          { class_id: classId }
        ]
      },
      order: [['order_index', 'ASC']]
    });

    // Get student's progress for these lessons
    const lessonIds = lessons.map(l => l.id);
    const progresses = await LessonProgress.findAll({
      where: {
        student_id: studentId,
        lesson_id: lessonIds
      }
    });

    const progressMap = {};
    progresses.forEach(p => {
      progressMap[p.lesson_id] = p.is_completed;
    });

    // Format output
    const formattedLessons = lessons.map(l => ({
      id: l.id,
      title: l.title,
      type: l.lesson_type,
      duration: l.duration,
      content_url: l.content_url,
      order_index: l.order_index,
      completed: !!progressMap[l.id]
    }));

    res.json({
      success: true,
      data: {
        course_name: cls.course.name,
        lessons: formattedLessons
      }
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/lessons/:lessonId/progress
exports.markLessonProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    const [progress, created] = await LessonProgress.findOrCreate({
      where: { student_id: studentId, lesson_id: lessonId },
      defaults: { is_completed: true }
    });

    if (!created) {
      progress.is_completed = true;
      await progress.save();
    }

    res.json({
      success: true,
      message: 'Đã cập nhật tiến độ'
    });

  } catch (error) {
    next(error);
  }
};
