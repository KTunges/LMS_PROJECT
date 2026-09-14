const { User, Course, Class, Enrollment, Transaction } = require('../models');

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalTeachers = await User.count({ where: { role: 'teacher' } });
    const totalCourses = await Course.count();
    
    const transactions = await Transaction.findAll({ where: { status: 'completed' } });
    const totalRevenue = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Get 5 recent courses needing approval
    const pendingCourses = await Course.findAll({
      where: { status: 'draft' },
      include: [{ model: User, as: 'teacher', attributes: ['full_name'] }],
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalRevenue,
        pendingCourses
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher', attributes: ['full_name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/courses/:id/status
exports.updateCourseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'published' or 'rejected'

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Khóa học không tồn tại' });
    }

    course.status = status;
    await course.save();

    // Notify teacher
    if (course.teacher_id) {
      const io = req.app.get('io');
      const { sendNotification } = require('../utils/notification');
      let msg = status === 'published' ? `Khóa học "${course.name}" của bạn đã được duyệt!` : `Khóa học "${course.name}" của bạn đã bị từ chối.`;
      if (io && sendNotification) {
        await sendNotification(io, course.teacher_id, 'Khóa học', msg);
      }
    }

    res.json({ success: true, message: `Khóa học đã được cập nhật thành ${status}` });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/finance
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: 'student', attributes: ['full_name', 'email'] },
        { model: User, as: 'teacher', attributes: ['full_name', 'email'] },
        { model: Course, as: 'course', attributes: ['name', 'price'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/settings
exports.getSettings = async (req, res, next) => {
  try {
    const { Setting } = require('../models');
    const settingsRows = await Setting.findAll();
    
    // Default settings
    let settingsMap = {
      teacherCommissionRate: 70,
      enablePayment: true,
      enableRegistration: true,
      maintenanceMode: false
    };

    settingsRows.forEach(row => {
      settingsMap[row.key] = row.value;
    });

    res.json({
      success: true,
      data: settingsMap
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const { Setting } = require('../models');
    const newSettings = req.body; // Expect an object of key-value pairs
    
    for (const [key, value] of Object.entries(newSettings)) {
      await Setting.upsert({ key, value });
    }

    res.json({
      success: true,
      message: 'Cập nhật cấu hình thành công'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/verify
exports.verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    user.is_verified = true;
    await user.save();

    res.json({ success: true, message: 'Đã xác thực tài khoản thành công' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/finance/:id/approve
exports.approveTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Giao dịch không tồn tại' });
    }
    
    if (transaction.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Giao dịch đã được duyệt trước đó' });
    }

    // Call the helper from paymentController
    const { completeTransaction } = require('./paymentController');
    const transId = req.body.transId || `MANUAL_${Date.now()}`;
    await completeTransaction(transaction, transId);

    res.json({ success: true, message: 'Đã duyệt giao dịch thành công' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/finance/:id/reject
exports.rejectTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Giao dịch không tồn tại' });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Không thể từ chối giao dịch đã hoàn tất' });
    }

    transaction.status = 'failed';
    await transaction.save();

    res.json({ success: true, message: 'Đã từ chối giao dịch' });
  } catch (error) {
    next(error);
  }
};
