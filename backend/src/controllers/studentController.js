const { Class, Course, Enrollment, Grade, Semester, User, Notification, Assignment, Submission, Material, Category } = require('../models');

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
    let gradedCount = 0;
    grades.forEach(g => {
      if (g.overall_score !== null) {
        totalScore += parseFloat(g.overall_score);
        gradedCount++;
      }
    });
    const avgScore = gradedCount > 0 ? (totalScore / gradedCount).toFixed(2) : '0.00';

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

// GET /api/student/grades
exports.getGrades = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId },
      include: [
        { model: Grade, as: 'grade' },
        { 
          model: Class, 
          as: 'class',
          include: [
            { model: Course, as: 'course' },
            { model: Semester, as: 'semester' }
          ]
        }
      ]
    });

    const formattedGrades = enrollments.map(enr => {
      const cls = enr.class;
      const grade = enr.grade || {};
      
      let letter = 'F';
      if (grade.overall_score !== null) {
        if (grade.overall_score >= 8.5) letter = 'A';
        else if (grade.overall_score >= 8.0) letter = 'B+';
        else if (grade.overall_score >= 7.0) letter = 'B';
        else if (grade.overall_score >= 6.5) letter = 'C+';
        else if (grade.overall_score >= 5.5) letter = 'C';
        else if (grade.overall_score >= 5.0) letter = 'D+';
        else if (grade.overall_score >= 4.0) letter = 'D';
      }

      return {
        id: cls.course.code,
        name: cls.course.name,
        process: Number(grade.midterm_score) || 0,
        midterm: Number(grade.midterm_score) || 0, // Using midterm for process in this simplified model
        final: Number(grade.final_score) || 0,
        total: Number(grade.overall_score) || 0,
        letter: letter,
        semester: cls.semester.name
      };
    });

    res.json({ success: true, data: formattedGrades });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/materials
exports.getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.findAll({
      where: { status: 'active' },
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: materials });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// GET /api/student/catalog
exports.getCatalog = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    
    // Get all courses
    const courses = await Course.findAll({
      include: [{ model: Category, as: 'category' }]
    });

    // Get current student's enrollments to know what they are learning
    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId },
      include: [{ model: Class, as: 'class' }]
    });

    const enrolledCourseIds = enrollments.map(e => e.class.course_id);

    const formattedCatalog = courses.map(c => ({
      id: c.id,
      title: c.name,
      instructor: 'Giảng viên chuyên môn',
      rating: 4.8, // Mocked rating for now
      students: Math.floor(Math.random() * 500) + 50,
      duration: c.duration || '4 tuần',
      price: c.price || 0,
      level: c.level || 'Cơ bản',
      tags: [c.category?.name || 'Kỹ năng'],
      image: c.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
      enrolled: enrolledCourseIds.includes(c.id)
    }));

    res.json({ success: true, data: formattedCatalog });
  } catch (error) {
    next(error);
  }
};

exports.enrollInCourse = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // Tìm lớp học thuộc về course này
    const classObj = await Class.findOne({
      where: { course_id: courseId }
    });

    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Khóa học này hiện chưa mở lớp' });
    }

    // Kiểm tra xem đã enroll chưa
    const existingEnrollment = await Enrollment.findOne({
      where: { student_id: studentId, class_id: classObj.id }
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Bạn đã đăng ký khóa học này rồi' });
    }

    // Tạo enrollment mới
    const enrollment = await Enrollment.create({
      student_id: studentId,
      class_id: classObj.id,
      enrollment_date: new Date(),
      status: 'enrolled'
    });

    // Khởi tạo điểm số (Grade) = 0 để hiện trên bảng Kết quả
    await Grade.create({
      enrollment_id: enrollment.id,
      process_score: 0,
      midterm_score: 0,
      final_score: 0,
      total_score: 0,
      note: 'Mới đăng ký'
    });

    res.json({ success: true, message: 'Đăng ký khóa học thành công' });
  } catch (error) {
    next(error);
  }
};
