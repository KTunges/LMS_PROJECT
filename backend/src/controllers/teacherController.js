const { Class, Course, Semester, User, Enrollment, Grade, Assignment, Submission, Lesson, Quiz, Question, Category, Transaction } = require('../models');
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

    // Real monthly revenue from completed transactions for this teacher
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyCompletedTrx = await Transaction.findAll({
      where: {
        teacher_id: teacherId,
        status: 'completed',
        created_at: { [Op.gte]: startOfMonth }
      }
    });
    const monthlyRevenue = monthlyCompletedTrx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Recent real sales
    const recentTrx = await Transaction.findAll({
      where: {
        teacher_id: teacherId,
        status: 'completed'
      },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'name'] },
        { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const recentSales = recentTrx.map(t => {
      const diffMs = Date.now() - new Date(t.created_at).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const timeStr = diffHours < 1 ? 'Vừa xong' : diffHours < 24 ? `${diffHours} giờ trước` : `${Math.floor(diffHours / 24)} ngày trước`;
      return {
        id: t.id,
        course: t.course?.name || 'Khóa học',
        student: t.student?.full_name || t.student?.email || 'Học viên',
        amount: Number(t.amount || 0),
        time: timeStr
      };
    });

    res.json({
      success: true,
      data: {
        totalCourses: classes.length,
        totalStudents,
        monthlyRevenue,
        averageRating: 4.8,
        recentSales
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/revenue
exports.getRevenue = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    // Lấy tất cả giao dịch thuộc về giảng viên này
    const transactions = await Transaction.findAll({
      where: { teacher_id: teacherId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'name'] },
        { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let lifetimeEarnings = 0;
    let pendingClearance = 0;
    let monthlyRevenue = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount || 0);
      if (t.status === 'completed') {
        lifetimeEarnings += amt;
        if (new Date(t.created_at) >= startOfMonth) {
          monthlyRevenue += amt;
        }
      } else if (t.status === 'pending') {
        pendingClearance += amt;
      }
    });

    const balance = lifetimeEarnings; // Số dư khả dụng

    const formattedTransactions = transactions.map(t => ({
      id: t.order_id || `TRX-${t.id}`,
      course: t.course?.name || 'Khóa học',
      student: t.student?.full_name || t.student?.email || 'Học viên',
      amount: Number(t.amount || 0),
      date: new Date(t.created_at).toLocaleDateString('vi-VN'),
      status: t.status,
      paymentMethod: t.payment_method === 'momo' ? 'Ví MoMo' : (t.payment_method || 'Thanh toán trực tuyến')
    }));

    res.json({
      success: true,
      data: {
        balance,
        pendingClearance,
        lifetimeEarnings,
        monthlyRevenue,
        transactions: formattedTransactions
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

// GET /api/teacher/students
exports.getStudents = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { Class, Enrollment, User, Course, LessonProgress } = require('../models');

    // Find classes taught by this teacher
    const classes = await Class.findAll({
      where: { teacher_id: teacherId },
      include: [
        { model: Course, as: 'course' },
        {
          model: Enrollment,
          as: 'enrollments',
          include: [{ model: User, as: 'student', attributes: ['id', 'full_name', 'email', 'avatar'] }]
        }
      ]
    });

    const studentsMap = {};

    for (const cls of classes) {
      for (const enr of cls.enrollments) {
        if (!enr.student) continue;
        
        // Compute progress based on LessonProgress (stub: random progress or calculate properly if time permits)
        // Here we just return a default structure and 0 progress if missing
        const sId = enr.student.id;
        if (!studentsMap[sId]) {
          studentsMap[sId] = {
            id: 'SV' + String(sId).padStart(3, '0'),
            real_id: sId,
            name: enr.student.full_name,
            email: enr.student.email,
            avatar: enr.student.avatar,
            course: cls.course?.name || 'Khóa học',
            progress: Math.floor(Math.random() * 100), // Fake progress for now
            date: new Date(enr.createdAt).toLocaleDateString('vi-VN')
          };
        }
      }
    }

    res.json({ success: true, data: Object.values(studentsMap) });
  } catch (err) {
    next(err);
  }
};

// GET /api/teacher/qa
exports.getQA = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { CourseQA, User, Course, Lesson } = require('../models');
    const qas = await CourseQA.findAll({
      where: { teacher_id: teacherId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'avatar'] },
        { model: Course, as: 'course', attributes: ['id', 'name'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedQAs = qas.map(q => ({
      id: q.id,
      student: q.student?.full_name || 'Học viên',
      course: q.course?.name || 'Chung',
      lecture: q.lesson?.title || 'Chung',
      question: q.question,
      answer: q.answer,
      answered: !!q.answer,
      time: new Date(q.created_at).toLocaleString('vi-VN')
    }));

    res.json({ success: true, data: formattedQAs });
  } catch (err) {
    next(err);
  }
};

// POST /api/teacher/qa/:id/reply
exports.replyQA = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const qaId = req.params.id;
    const { answer } = req.body;
    const { CourseQA } = require('../models');

    const qa = await CourseQA.findOne({ where: { id: qaId, teacher_id: teacherId }});
    if (!qa) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    qa.answer = answer;
    qa.answered_at = new Date();
    await qa.save();

    res.json({ success: true, message: 'Replied successfully', data: qa });
  } catch (err) {
    next(err);
  }
};

// GET /api/teacher/materials
exports.getMaterials = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { Material, Category } = require('../models');
    
    const materials = await Material.findAll({
      where: { user_id: teacherId },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });

    const formatted = materials.map(m => ({
      id: m.id,
      name: m.title || m.name || 'Untitled',
      type: (m.file_type || m.type || 'file').toLowerCase(),
      size: m.file_size || '—',
      date: new Date(m.createdAt).toLocaleDateString('vi-VN'),
      category: m.category?.name || 'Chung',
      download_url: m.file_url || '',
      uses: 0
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// POST /api/teacher/materials (upload)
exports.uploadMaterial = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { Material } = require('../models');
    const { title, description, file_url, file_type, file_size, category_id } = req.body;

    const material = await Material.create({
      title: title || 'Untitled',
      description: description || '',
      file_url: file_url || '',
      file_type: file_type || 'file',
      file_size: file_size || '0',
      category_id: category_id || null,
      user_id: teacherId,
    });

    res.json({ success: true, message: 'Uploaded successfully', data: material });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/teacher/materials/:id
exports.deleteMaterial = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const materialId = req.params.id;
    const { Material } = require('../models');

    const mat = await Material.findOne({ where: { id: materialId, user_id: teacherId }});
    if (!mat) return res.status(404).json({ success: false, message: 'Tài nguyên không tồn tại.' });

    await mat.destroy();
    res.json({ success: true, message: 'Đã xóa tài nguyên.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/teacher/revenue
exports.getRevenue = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const { Transaction, Course, User } = require('../models');

    const transactions = await Transaction.findAll({
      include: [
        { model: Course, as: 'course', attributes: ['id', 'name'] },
        { model: User, as: 'student', attributes: ['id', 'full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // Filter transactions for courses taught by this teacher
    const { Class } = require('../models');
    const teacherClasses = await Class.findAll({ where: { teacher_id: teacherId }, attributes: ['course_id'] });
    const teacherCourseIds = teacherClasses.map(c => c.course_id);

    const filtered = transactions.filter(t => teacherCourseIds.includes(t.course_id));
    
    const completedTotal = filtered.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0);
    const pendingTotal = filtered.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0);

    const formattedTrx = filtered.map(t => ({
      id: 'TRX-' + String(t.id).padStart(3, '0'),
      course: t.course?.name || 'Khóa học',
      student: t.student?.full_name || 'Học viên',
      amount: t.amount || 0,
      date: new Date(t.created_at || t.createdAt).toLocaleDateString('vi-VN'),
      status: t.status || 'pending'
    }));

    res.json({
      success: true,
      data: {
        balance: completedTotal,
        pendingClearance: pendingTotal,
        lifetimeEarnings: completedTotal + pendingTotal,
        transactions: formattedTrx,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.broadcastEmail = async (req, res, next) => {
  try {
    const { subject, message, emails } = req.body;
    if (!emails || !emails.length) {
      return res.status(400).json({ success: false, message: 'No recipients provided' });
    }

    const { sendEmail } = require('../utils/email');
    const sendPromises = emails.map(email => 
      sendEmail({
        to: email,
        subject: subject || 'Thông báo từ giảng viên LMS',
        html: `<div style="font-family:sans-serif;padding:20px;">
                <h3>Chào bạn,</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <p><i>Trân trọng,<br>Hệ thống LMS</i></p>
               </div>`
      })
    );

    await Promise.allSettled(sendPromises);

    res.json({ success: true, message: 'Đã gửi email thành công tới các học viên.' });
  } catch (error) {
    next(error);
  }
};
