const crypto = require('crypto');
const axios = require('axios');
const { Transaction, Course, Class, Enrollment, Grade, Notification, User } = require('../models');

// POST /api/payment/momo/create
exports.createMomoPayment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin khóa học (courseId)' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    // Kiểm tra lớp học
    const classObj = await Class.findOne({ where: { course_id: courseId } });
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Khóa học này hiện chưa mở lớp học' });
    }

    // Kiểm tra xem đã sở hữu khóa học chưa
    const existingEnrollment = await Enrollment.findOne({
      where: { student_id: studentId, class_id: classObj.id }
    });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Bạn đã đăng ký khóa học này rồi' });
    }

    const teacherId = classObj.teacher_id;
    const amount = Math.round(Number(course.price) || 0);

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Khóa học này miễn phí, vui lòng chọn Đăng ký học ngay' });
    }

    // MoMo credentials
    const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j';
    const secretKey = process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
    const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    const redirectUrl = process.env.MOMO_RETURN_URL || 'http://localhost:5173/checkout/momo-return';
    const ipnUrl = process.env.MOMO_NOTIFY_URL || 'https://webhook.site/placeholder';

    const orderId = `${partnerCode}_${Date.now()}`;
    const requestId = orderId;
    
    // MoMo orderInfo (bỏ dấu tiếng Việt để tránh lỗi mã hóa)
    const cleanCourseName = (course.name || 'Khoa hoc')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .slice(0, 50);
    const orderInfo = `Thanh toan khoa hoc ${cleanCourseName}`;
    const requestType = 'payWithATM';

    const extraDataObj = {
      courseId: course.id,
      studentId,
      teacherId,
      classId: classObj.id
    };
    const extraData = Buffer.from(JSON.stringify(extraDataObj)).toString('base64');

    // Chữ ký HMAC-SHA256 chuẩn MoMo API v2
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    // Tạo bản ghi Transaction với trạng thái 'pending'
    await Transaction.create({
      student_id: studentId,
      course_id: course.id,
      teacher_id: teacherId,
      amount,
      payment_method: 'momo',
      order_id: orderId,
      extra_data: extraData,
      status: 'pending'
    });

    const requestBody = {
      partnerCode,
      partnerName: 'LMS Education',
      storeId: 'LMS_STORE',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      extraData,
      requestType,
      signature
    };

    const momoResponse = await axios.post(endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (momoResponse.data && (momoResponse.data.resultCode === 0 || momoResponse.data.resultCode === '0')) {
      return res.json({
        success: true,
        payUrl: momoResponse.data.payUrl,
        qrCodeUrl: momoResponse.data.qrCodeUrl,
        deeplink: momoResponse.data.deeplink,
        orderId
      });
    } else {
      return res.status(400).json({
        success: false,
        message: momoResponse.data?.message || 'Không thể tạo phiên thanh toán MoMo',
        detail: momoResponse.data
      });
    }
  } catch (error) {
    console.error('Lỗi khởi tạo thanh toán MoMo:', error?.response?.data || error.message);
    next(error);
  }
};

// POST /api/payment/momo/verify
exports.verifyMomoPayment = async (req, res, next) => {
  try {
    const { orderId, resultCode, message, transId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Thiếu orderId' });
    }

    const transaction = await Transaction.findOne({
      where: { order_id: orderId },
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch với mã đơn hàng này' });
    }

    // Nếu đã hoàn tất trước đó
    if (transaction.status === 'completed') {
      return res.json({
        success: true,
        message: 'Giao dịch đã hoàn tất và ghi nhận trước đó',
        data: {
          orderId: transaction.order_id,
          amount: transaction.amount,
          course: transaction.course,
          status: 'completed'
        }
      });
    }

    // Kiểm tra resultCode từ MoMo (0 = Thành công)
    if (String(resultCode) === '0') {
      transaction.status = 'completed';
      if (transId) transaction.trans_id = String(transId);
      await transaction.save();

      // Ghi danh học viên vào lớp học
      const classObj = await Class.findOne({ where: { course_id: transaction.course_id } });
      if (classObj) {
        const [enrollment, created] = await Enrollment.findOrCreate({
          where: { student_id: transaction.student_id, class_id: classObj.id },
          defaults: {
            student_id: transaction.student_id,
            class_id: classObj.id,
            enrollment_date: new Date(),
            status: 'enrolled'
          }
        });

        if (created) {
          await Grade.create({
            enrollment_id: enrollment.id,
            process_score: 0,
            midterm_score: 0,
            final_score: 0,
            total_score: 0,
            note: 'Thanh toán thành công qua MoMo'
          });
        }
      }

      // Thông báo cho học viên
      await Notification.create({
        user_id: transaction.student_id,
        title: 'Thanh toán khóa học thành công',
        content: `Bạn đã thanh toán thành công khóa học "${transaction.course?.name || 'Khóa học'}" (${Number(transaction.amount).toLocaleString('vi-VN')}đ) qua Ví MoMo.`,
        is_read: false
      });

      // Thông báo và cộng doanh thu cho giảng viên
      if (transaction.teacher_id) {
        const studentName = transaction.student?.full_name || transaction.student?.email || 'Học viên';
        await Notification.create({
          user_id: transaction.teacher_id,
          title: 'Doanh thu mới từ khóa học',
          content: `Học viên ${studentName} vừa đăng ký khóa học "${transaction.course?.name || 'Khóa học'}". Doanh thu của bạn được cộng +${Number(transaction.amount).toLocaleString('vi-VN')}đ qua Ví MoMo.`,
          is_read: false
        });
      }

      return res.json({
        success: true,
        message: 'Thanh toán và ghi danh khóa học thành công!',
        data: {
          orderId: transaction.order_id,
          amount: transaction.amount,
          course: transaction.course,
          status: 'completed'
        }
      });
    } else {
      transaction.status = 'failed';
      await transaction.save();
      return res.status(400).json({
        success: false,
        message: message || 'Giao dịch MoMo không thành công hoặc người dùng đã hủy',
        data: {
          orderId: transaction.order_id,
          status: 'failed'
        }
      });
    }
  } catch (error) {
    console.error('Lỗi xác thực thanh toán MoMo:', error);
    next(error);
  }
};

// POST /api/payment/momo/ipn
exports.handleMomoIpn = async (req, res) => {
  try {
    const { orderId, resultCode, transId } = req.body;
    if (orderId) {
      const transaction = await Transaction.findOne({ where: { order_id: orderId } });
      if (transaction && transaction.status === 'pending') {
        if (String(resultCode) === '0') {
          transaction.status = 'completed';
          if (transId) transaction.trans_id = String(transId);
          await transaction.save();

          const classObj = await Class.findOne({ where: { course_id: transaction.course_id } });
          if (classObj) {
            const [enrollment, created] = await Enrollment.findOrCreate({
              where: { student_id: transaction.student_id, class_id: classObj.id },
              defaults: {
                student_id: transaction.student_id,
                class_id: classObj.id,
                enrollment_date: new Date(),
                status: 'enrolled'
              }
            });
            if (created) {
              await Grade.create({
                enrollment_id: enrollment.id,
                process_score: 0,
                midterm_score: 0,
                final_score: 0,
                total_score: 0,
                note: 'Thanh toán MoMo IPN'
              });
            }
          }
        } else {
          transaction.status = 'failed';
          await transaction.save();
        }
      }
    }
    return res.status(204).json({ message: 'IPN processed' });
  } catch (error) {
    console.error('Lỗi xử lý IPN MoMo:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /api/payment/atm/process
exports.processAtmPayment = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { courseId, bankCode, cardNumber, cardHolder, issueDate, otp } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin khóa học (courseId)' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
    }

    const classObj = await Class.findOne({ where: { course_id: courseId } });
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Khóa học này hiện chưa mở lớp' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { student_id: studentId, class_id: classObj.id }
    });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Bạn đã đăng ký khóa học này rồi' });
    }

    // Kiểm tra OTP test (123456)
    if (otp && String(otp).trim() !== '123456') {
      return res.status(400).json({ success: false, message: 'Mã OTP không chính xác. Vui lòng nhập mã thử nghiệm: 123456' });
    }

    const teacherId = classObj.teacher_id;
    const amount = Math.round(Number(course.price) || 0);
    const orderId = `ATM_NCB_${Date.now()}`;
    const transId = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // Tạo bản ghi Transaction hoàn tất
    const transaction = await Transaction.create({
      student_id: studentId,
      course_id: course.id,
      teacher_id: teacherId,
      amount,
      payment_method: `Thẻ ATM (${bankCode || 'NCB'})`,
      order_id: orderId,
      trans_id: transId,
      status: 'completed'
    });

    // Ghi danh học viên
    const [enrollment, created] = await Enrollment.findOrCreate({
      where: { student_id: studentId, class_id: classObj.id },
      defaults: {
        student_id: studentId,
        class_id: classObj.id,
        enrollment_date: new Date(),
        status: 'enrolled'
      }
    });

    if (created) {
      await Grade.create({
        enrollment_id: enrollment.id,
        process_score: 0,
        midterm_score: 0,
        final_score: 0,
        total_score: 0,
        note: 'Thanh toán qua Thẻ ATM NCB'
      });
    }

    const student = await User.findByPk(studentId);

    // Thông báo cho học viên
    await Notification.create({
      user_id: studentId,
      title: 'Thanh toán khóa học thành công',
      content: `Bạn đã thanh toán thành công khóa học "${course.name}" (${Number(amount).toLocaleString('vi-VN')}đ) qua Thẻ ATM Ngân hàng ${bankCode || 'NCB'}.`,
      is_read: false
    });

    // Thông báo cho giảng viên
    if (teacherId) {
      const studentName = student?.full_name || student?.email || 'Học viên';
      await Notification.create({
        user_id: teacherId,
        title: 'Doanh thu mới từ khóa học',
        content: `Học viên ${studentName} vừa đăng ký khóa học "${course.name}". Doanh thu của bạn được cộng +${Number(amount).toLocaleString('vi-VN')}đ qua Thẻ ATM Ngân hàng ${bankCode || 'NCB'}.`,
        is_read: false
      });
    }

    return res.json({
      success: true,
      message: 'Thanh toán thẻ ATM thành công!',
      data: {
        orderId,
        transId,
        amount,
        course,
        bankCode: bankCode || 'NCB',
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Lỗi thanh toán thẻ ATM:', error);
    next(error);
  }
};
