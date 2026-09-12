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

    // Schedule (Active Classes)
    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId, status: 'enrolled' },
      include: [{
        model: Class,
        as: 'class',
        include: [
          { model: Course, as: 'course' },
          { model: User, as: 'teacher', attributes: ['full_name'] }
        ]
      }],
      limit: 5
    });

    const schedule = enrollments.map(enr => ({
      subject: enr.class.course.name,
      teacher: enr.class.teacher.full_name,
      time: enr.class.schedule_time || 'Chưa xếp lịch',
      room: enr.class.room || 'Chưa xếp phòng',
      color: ['blue', 'green', 'purple', 'orange', 'red'][Math.floor(Math.random() * 5)]
    }));

    // Announcements (Notifications)
    const announcementsList = await Notification.findAll({
      where: { user_id: studentId },
      order: [['created_at', 'DESC']],
      limit: 3
    });

    const announcements = announcementsList.map(n => ({
      title: n.title,
      date: n.createdAt ? n.createdAt.toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
      tag: n.type || 'Chung',
      urgent: !n.is_read
    }));

    // Suggested Materials
    const suggestedMaterialsList = await Material.findAll({
      where: { status: 'active' },
      limit: 3,
      order: [['created_at', 'DESC']]
    });

    const suggestedMaterials = suggestedMaterialsList.map(m => ({
      id: m.id,
      title: m.title,
      subject: 'Tài liệu chung', // Can be derived from category or course later
      size: m.file_size ? `${(m.file_size / 1024 / 1024).toFixed(1)} MB` : '1.0 MB',
      type: m.file_type || 'PDF'
    }));

    res.json({
      success: true,
      data: {
        activeClasses: activeEnrollments,
        completedClasses: completedEnrollments,
        avgScore: avgScore,
        unreadNotifications,
        upcomingAssignments,
        schedule,
        announcements,
        suggestedMaterials
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

    // We need LessonProgress for these classes to calculate progress
    const { Lesson, LessonProgress } = require('../models');
    
    // Get all lesson progresses for this student
    const allProgresses = await LessonProgress.findAll({
      where: { student_id: studentId, is_completed: true }
    });
    
    // Create a set of completed lesson IDs
    const completedLessonIds = new Set(allProgresses.map(p => p.lesson_id));

    // For each course, count total lessons and compare with completed
    // Since this is a bit heavy to do per-request in a loop without complex joins, we do it in code for now
    const courseIds = enrollments.map(e => e.class.course_id);
    const classIds = enrollments.map(e => e.class.id);
    
    const { Op } = require('sequelize');
    const allLessons = await Lesson.findAll({
      where: {
        [Op.or]: [
          { course_id: { [Op.in]: courseIds } },
          { class_id: { [Op.in]: classIds } }
        ]
      }
    });

    // Format response
    const formattedClasses = enrollments.map(enr => {
      const cls = enr.class;
      
      // Calculate progress
      const classLessons = allLessons.filter(l => l.course_id === cls.course_id || l.class_id === cls.id);
      const totalClassLessons = classLessons.length;
      const completedClassLessons = classLessons.filter(l => completedLessonIds.has(l.id)).length;
      
      const progressPercent = totalClassLessons > 0 ? Math.round((completedClassLessons / totalClassLessons) * 100) : 0;

      return {
        id: cls.id,
        course_id: cls.course.id,
        course_code: cls.course.code,
        course_name: cls.course.name,
        teacher_name: cls.teacher?.full_name || 'N/A',
        semester_name: cls.semester?.name || 'N/A',
        schedule_time: cls.schedule_time,
        room: cls.room,
        status: cls.status,
        progress: progressPercent
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

// GET /api/student/exams
exports.getExams = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    // Lấy các lớp sinh viên đang học
    const enrollments = await require('../models').Enrollment.findAll({
      where: { student_id: studentId },
      attributes: ['class_id']
    });
    const classIds = enrollments.map(e => e.class_id);

    // Lấy lịch thi của các lớp đó
    const exams = await require('../models').ExamSchedule.findAll({
      where: { class_id: { [require('sequelize').Op.in]: classIds } },
      include: [
        {
          model: require('../models').Class,
          as: 'class',
          include: [{ model: require('../models').Course, as: 'course' }, { model: require('../models').Semester, as: 'semester' }]
        }
      ]
    });

    const formattedExams = exams.map(exam => ({
      id: exam.id,
      code: exam.class.course.code,
      name: exam.class.course.name,
      type: exam.exam_type,
      format: exam.format || 'Trắc nghiệm',
      date: exam.exam_date,
      time: exam.exam_time || '08:00 - 10:00',
      room: exam.room || 'Phòng thi',
      note: exam.note || '',
      semester: exam.class.semester?.name
    }));

    res.json({ success: true, data: formattedExams });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { Enrollment, Grade, Class, Course, User } = require('../models');
    const { Op } = require('sequelize');

    // Fetch all students who have grades
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'full_name'],
      include: [{
        model: Enrollment,
        as: 'enrollments',
        include: [{
          model: Grade,
          as: 'grade'
        }]
      }]
    });

    // Calculate XP for each student based on grades
    // XP formula: sum of (overall_score * 100) for each completed course + bonus for high grades
    const leaderboard = students.map(student => {
      let totalXp = 0;
      let completedCourses = 0;

      if (student.enrollments) {
        student.enrollments.forEach(enr => {
          if (enr.grade && enr.grade.overall_score !== null && enr.grade.overall_score !== undefined) {
            const score = Number(enr.grade.overall_score);
            totalXp += Math.round(score * 100); // Base XP
            if (score >= 8.5) totalXp += 500; // Bonus for A
            else if (score >= 7.0) totalXp += 200; // Bonus for B
            completedCourses++;
          }
        });
      }

      return {
        id: student.id,
        name: student.full_name,
        xp: totalXp,
        avatar: student.full_name ? student.full_name.charAt(0).toUpperCase() : '?',
        completedCourses
      };
    }).filter(s => s.xp > 0); // Only show students with XP

    // Sort by XP descending
    leaderboard.sort((a, b) => b.xp - a.xp);

    // Add ranks
    leaderboard.forEach((student, index) => {
      student.rank = index + 1;
      student.change = 'same'; // We don't track historical changes yet
    });

    // Mark the requesting user
    const currentUserId = req.user.id;
    leaderboard.forEach(s => {
      if (s.id === currentUserId) s.isCurrentUser = true;
    });

    // Assign titles based on rank
    leaderboard.forEach(s => {
      if (s.xp >= 10000) s.title = 'Học giả uyên bác';
      else if (s.xp >= 8000) s.title = 'Thợ săn điểm';
      else if (s.xp >= 6000) s.title = 'Thần đồng';
      else if (s.xp >= 4000) s.title = 'Chăm chỉ';
      else if (s.xp >= 2000) s.title = 'Kiên trì';
      else s.title = 'Tân binh';
    });

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};
