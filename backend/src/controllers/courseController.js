const { Course, Class, Category, User, Enrollment, Semester } = require('../models');
const { Op } = require('sequelize');

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

exports.getStudentClasses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [
        {
          model: Class,
          as: 'class',
          include: [
            { model: Course, as: 'course' },
            { model: User, as: 'teacher', attributes: ['full_name'] },
            { model: Semester, as: 'semester' }
          ]
        },
        {
          model: require('../models').Grade,
          as: 'grade'
        }
      ]
    });
    
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

exports.getAvailableClasses = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Get all enrollments for this user
    const enrollments = await Enrollment.findAll({
      where: { student_id: user.id },
      attributes: ['class_id']
    });
    const enrolledClassIds = enrollments.map(e => e.class_id);

    // Get curriculum for the user's major
    let allowedCourseIds = [];
    if (user.major_id) {
      const curriculums = await require('../models').Curriculum.findAll({
        where: { major_id: user.major_id },
        attributes: ['course_id']
      });
      allowedCourseIds = curriculums.map(c => c.course_id);
    }

    // Build the query
    const whereClause = {
      id: { [Op.notIn]: enrolledClassIds },
      status: 'active'
    };

    // If user has a major, only show courses from their curriculum
    if (allowedCourseIds.length > 0) {
      whereClause.course_id = { [Op.in]: allowedCourseIds };
    }

    // Get all active classes the user is NOT enrolled in (and matches curriculum if applicable)
    const availableClasses = await Class.findAll({
      where: whereClause,
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'teacher', attributes: ['full_name'] },
        { model: Semester, as: 'semester' }
      ]
    });

    res.json(availableClasses);
  } catch (error) {
    next(error);
  }
};

exports.enrollInClass = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp classId' });
    }

    // Check if class exists and is active
    const classObj = await Class.findByPk(classId);
    if (!classObj || classObj.status !== 'active') {
      return res.status(404).json({ message: 'Lớp học không tồn tại hoặc đã khóa' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { student_id: userId, class_id: classId }
    });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Bạn đã đăng ký lớp học này rồi' });
    }

    // Check max students
    const currentEnrollments = await Enrollment.count({ where: { class_id: classId } });
    if (currentEnrollments >= classObj.max_students) {
      return res.status(400).json({ message: 'Lớp học đã đủ sĩ số tối đa' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student_id: userId,
      class_id: classId,
      enrollment_date: new Date(),
      status: 'enrolled'
    });

    res.status(201).json({ message: 'Đăng ký thành công', enrollment });
  } catch (error) {
    next(error);
  }
};

exports.cancelEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { classId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: { student_id: userId, class_id: classId }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đăng ký' });
    }

    await enrollment.destroy();
    res.json({ message: 'Hủy đăng ký thành công' });
  } catch (error) {
    next(error);
  }
};
