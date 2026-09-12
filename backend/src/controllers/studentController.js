const { Class, Course, Enrollment, Grade, Semester, User, Notification, Assignment, Submission } = require('../models');

// GET /api/student/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user.id; // from auth middleware

    // Count enrolled classes
    const activeEnrollments = await Enrollment.count({
      where: { student_id: studentId, status: 'enrolled' }
    });

    const completedEnrollments = await Enrollment.count({
      where: { student_id: studentId, status: 'completed' }
    });

    const unreadNotifications = await Notification.count({
      where: { user_id: studentId, is_read: false }
    });

    // We can calculate avg GPA here if we want
    // Mock for now based on grades
    const grades = await Grade.findAll({
      include: [{
        model: Enrollment,
        as: 'enrollment',
        where: { student_id: studentId, status: 'completed' }
      }]
    });
    
    let totalScore = 0;
    grades.forEach(g => {
      if (g.overall_score) totalScore += parseFloat(g.overall_score);
    });
    const avgScore = grades.length > 0 ? (totalScore / grades.length).toFixed(2) : '0.00';
    
    // Gpa logic: 8.5+ = 4.0, etc. (simplified)
    const gpa = grades.length > 0 ? ((totalScore / grades.length) * 0.4).toFixed(2) : '0.00';

    // Upcoming deadlines (Assignments)
    const upcomingAssignments = await Assignment.findAll({
      include: [
        {
          model: Class,
          as: 'class',
          include: [{
            model: Enrollment,
            as: 'enrollments',
            where: { student_id: studentId }
          }, {
            model: Course,
            as: 'course'
          }]
        }
      ],
      where: {
        due_date: {
          // Future dates
        }
      },
      limit: 5,
      order: [['due_date', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        activeClasses: activeEnrollments,
        completedClasses: completedEnrollments,
        gpa: gpa,
        avgScore: avgScore,
        unreadNotifications,
        upcomingAssignments
      }
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/student/classes
exports.getMyClasses = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId, status: 'enrolled' },
      include: [{
        model: Class,
        as: 'class',
        include: [
          { model: Course, as: 'course' },
          { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] },
          { model: Semester, as: 'semester' }
        ]
      }]
    });

    // Format response
    const formattedClasses = enrollments.map(enr => {
      const cls = enr.class;
      return {
        id: cls.id,
        course_id: cls.course.id,
        course_code: cls.course.code,
        course_name: cls.course.name,
        teacher_name: cls.teacher.full_name,
        semester_name: cls.semester.name,
        schedule_time: cls.schedule_time,
        room: cls.room,
        status: cls.status,
        progress: 50 // Mock progress for now, will calculate later if needed
      };
    });

    res.json({
      success: true,
      data: formattedClasses
    });

  } catch (error) {
    next(error);
  }
};
