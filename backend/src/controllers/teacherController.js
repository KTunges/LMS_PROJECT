const { Class, Course, Semester, User, Enrollment, Grade, Assignment, Submission } = require('../models');
const { Op } = require('sequelize');

// GET /api/teacher/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const activeClassesCount = await Class.count({
      where: { teacher_id: teacherId, status: 'active' }
    });

    // Get all classes taught by this teacher
    const classes = await Class.findAll({
      where: { teacher_id: teacherId, status: 'active' },
      attributes: ['id']
    });
    const classIds = classes.map(c => c.id);

    // Count students enrolled in those classes
    const totalStudents = await Enrollment.count({
      where: { class_id: { [Op.in]: classIds }, status: 'enrolled' }
    });

    // Count pending submissions to grade
    const pendingSubmissionsCount = await Submission.count({
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { class_id: { [Op.in]: classIds } }
      }],
      where: { grading_status: 'submitted' } // Assuming this status exists or similar logic
    });

    // Fetch today's schedule (classes)
    const schedule = await Class.findAll({
      where: { teacher_id: teacherId, status: 'active' },
      include: [{ model: Course, as: 'course' }],
      limit: 5 // mock logic for today's schedule
    });

    res.json({
      success: true,
      data: {
        activeClasses: activeClassesCount,
        totalStudents,
        pendingSubmissions: pendingSubmissionsCount,
        schedule: schedule.map(c => ({
          id: c.id,
          subject: c.course.name,
          time: c.schedule_time || 'Chưa xếp lịch',
          room: c.room || 'Online',
          color: ['blue', 'green', 'purple', 'orange', 'red'][Math.floor(Math.random() * 5)]
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/classes
exports.getMyClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    
    const classes = await Class.findAll({
      where: { teacher_id: teacherId },
      include: [
        { model: Course, as: 'course' },
        { model: Semester, as: 'semester' }
      ]
    });

    // We should also count students per class
    const classIds = classes.map(c => c.id);
    const enrollments = await Enrollment.findAll({
      where: { class_id: { [Op.in]: classIds }, status: 'enrolled' }
    });

    const studentCountMap = {};
    enrollments.forEach(en => {
      studentCountMap[en.class_id] = (studentCountMap[en.class_id] || 0) + 1;
    });

    const formattedClasses = classes.map(c => ({
      id: c.id,
      course_name: c.course.name,
      course_code: c.course.code,
      semester_name: c.semester?.name || 'Kỳ phụ',
      schedule_time: c.schedule_time,
      room: c.room,
      status: c.status,
      studentsCount: studentCountMap[c.id] || 0
    }));

    res.json({ success: true, data: formattedClasses });
  } catch (error) {
    next(error);
  }
};
