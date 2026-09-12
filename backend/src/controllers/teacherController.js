const { Class, Course, Semester, User, Enrollment, Grade, Assignment, Submission, Lesson } = require('../models');
const { Op } = require('sequelize');

// GET /api/teacher/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    // Get all classes taught by this teacher
    const classes = await Class.findAll({
      where: { teacher_id: teacherId },
      include: [{ model: Course, as: 'course' }]
    });
    const classIds = classes.map(c => c.id);

    // Count students enrolled
    const totalStudents = await Enrollment.count({
      where: { class_id: { [Op.in]: classIds }, status: 'enrolled' }
    });

    // Mock revenue based on enrollments (e.g. 499,000 VND per enrollment)
    const monthlyRevenue = totalStudents * 499000;

    res.json({
      success: true,
      data: {
        totalCourses: classes.length,
        totalStudents,
        monthlyRevenue,
        averageRating: 4.8,
        recentSales: [
          { id: 1, course: classes[0]?.course?.name || 'Khóa học cơ bản', student: 'Nguyễn Văn A', amount: 499000, time: '2 giờ trước' },
          { id: 2, course: classes[1]?.course?.name || 'Lập trình nâng cao', student: 'Trần Thị B', amount: 899000, time: '5 giờ trước' }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/classes (used for My Courses)
exports.getMyClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    
    const classes = await Class.findAll({
      where: { teacher_id: teacherId },
      include: [
        { model: Course, as: 'course' }
      ]
    });

    const classIds = classes.map(c => c.id);
    const enrollments = await Enrollment.findAll({
      where: { class_id: { [Op.in]: classIds }, status: 'enrolled' }
    });

    const studentCountMap = {};
    enrollments.forEach(en => {
      studentCountMap[en.class_id] = (studentCountMap[en.class_id] || 0) + 1;
    });

    const formattedClasses = classes.map(c => {
      if (!c.course) return null;
      return {
        id: c.id, // we use class id as course identifier for the teacher scope
        name: c.course.name,
        code: c.course.code,
        price: c.course.price || 499000,
        status: c.status === 'active' ? 'published' : 'draft',
        studentsCount: studentCountMap[c.id] || 0,
        rating: 4.8
      };
    }).filter(Boolean); // remove nulls if course is missing

    res.json({ success: true, data: formattedClasses });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/courses/:id
exports.getCourseDetails = async (req, res, next) => {
  try {
    const courseId = req.params.id; // Note: this is actually class_id from the frontend
    const classInfo = await Class.findOne({
      where: { id: courseId, teacher_id: req.user.id },
      include: [
        { model: Course, as: 'course' },
        { model: Lesson, as: 'class_lessons' } // If lessons are tied to class
      ]
    });
    
    if (!classInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
    }
    
    // Also fetch lessons tied to course
    const courseLessons = await Lesson.findAll({
      where: { course_id: classInfo.course_id },
      order: [['order_index', 'ASC']]
    });

    res.json({ success: true, data: { class: classInfo, course: classInfo.course, lessons: courseLessons } });
  } catch (error) {
    next(error);
  }
};

// POST /api/teacher/courses
exports.createCourse = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { name, code, price, description, category_id } = req.body;

    // Create the course
    const newCourse = await Course.create({
      name: name || 'Khóa học mới',
      code: code || `COURSE-${Date.now()}`,
      price: price || 0,
      description: description || '',
      category_id: category_id || null,
      level: 'Cơ bản',
      duration: '4 tuần',
    });

    // Create a default Class for this teacher
    // We need a default semester, just use 1 for now or find the active one
    const newClass = await Class.create({
      course_id: newCourse.id,
      teacher_id: teacherId,
      semester_id: 1, // Assume 1 exists
      class_code: `${newCourse.code}-CLASS`,
      capacity: 100,
      status: 'active'
    });

    res.json({ success: true, data: { course: newCourse, class: newClass } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/teacher/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id; // Note: In frontend we might send class.id, need to trace to course_id
    // But let's assume it's course_id for now
    const { name, price, description } = req.body;
    
    await Course.update({ name, price, description }, { where: { id: courseId } });
    const updatedCourse = await Course.findByPk(courseId);
    
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/teacher/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    // Only delete the class to soft-delete from teacher view, or delete course if no other classes use it
    await Class.destroy({ where: { course_id: courseId, teacher_id: req.user.id } });
    res.json({ success: true, message: 'Đã xóa khóa học' });
  } catch (error) {
    next(error);
  }
};

// POST /api/teacher/courses/:courseId/lessons
exports.addLesson = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { title, lesson_type, content_url, duration, order_index } = req.body;
    
    const newLesson = await Lesson.create({
      course_id: courseId,
      title: title || 'Bài giảng mới',
      lesson_type: lesson_type || 'video',
      content_url: content_url || '',
      duration: duration || '00:00',
      order_index: order_index || 0
    });
    
    res.json({ success: true, data: newLesson });
  } catch (error) {
    next(error);
  }
};

// PUT /api/teacher/lessons/:lessonId
exports.updateLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const { title, lesson_type, content_url, duration, order_index } = req.body;
    
    await Lesson.update({ title, lesson_type, content_url, duration, order_index }, { where: { id: lessonId } });
    const updatedLesson = await Lesson.findByPk(lessonId);
    
    res.json({ success: true, data: updatedLesson });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/teacher/lessons/:lessonId
exports.deleteLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    await Lesson.destroy({ where: { id: lessonId } });
    res.json({ success: true, message: 'Đã xóa bài giảng' });
  } catch (error) {
    next(error);
  }
};
