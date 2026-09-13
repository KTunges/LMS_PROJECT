const { Class, Course, Semester, User, Enrollment, Grade, Assignment, Submission, Lesson, Quiz, Question, Category } = require('../models');
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
    const { name, price, description, image_url, category_id } = req.body;
    
    await Course.update({ name, price, description, image_url, category_id }, { where: { id: courseId } });
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

// GET /api/teacher/lessons/:lessonId/questions
exports.getInteractiveQuestions = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ where: { lesson_id: lessonId } });
    if (!quiz) {
      return res.json({ success: true, data: [] });
    }
    const questions = await Question.findAll({ 
      where: { quiz_id: quiz.id },
      order: [['video_timestamp', 'ASC']]
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

// POST /api/teacher/lessons/:lessonId/questions
exports.addInteractiveQuestion = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { content, video_timestamp, options, correct_answer } = req.body;

    let quiz = await Quiz.findOne({ where: { lesson_id: lessonId } });
    if (!quiz) {
      quiz = await Quiz.create({ lesson_id: lessonId, time_limit: null, total_marks: 10 });
    }

    const question = await Question.create({
      quiz_id: quiz.id,
      content,
      question_type: 'single_choice',
      video_timestamp,
      options,
      correct_answer
    });

    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/teacher/questions/:questionId
exports.deleteInteractiveQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    await Question.destroy({ where: { id: questionId } });
    res.json({ success: true, message: 'Đã xóa câu hỏi' });
  } catch (error) {
    next(error);
  }
};

// POST /api/teacher/courses/:courseId/sync-curriculum
exports.syncCurriculum = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { curriculum } = req.body; // array of sections

    // Xóa tất cả lesson cũ của course này
    await Lesson.destroy({ where: { course_id: courseId } });

    // Thêm lại toàn bộ lesson mới
    let order_index = 0;
    const lessonsToInsert = [];
    for (const section of curriculum) {
      if (section.lectures && section.lectures.length > 0) {
        for (const lec of section.lectures) {
          lessonsToInsert.push({
            course_id: courseId,
            section_title: section.title,
            title: lec.title || 'Bài giảng',
            content_url: lec.url || '',
            lesson_type: 'video',
            order_index: order_index++
          });
        }
      }
    }

    if (lessonsToInsert.length > 0) {
      await Lesson.bulkCreate(lessonsToInsert);
    }

    res.json({ success: true, message: 'Đã đồng bộ chương trình học' });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};
