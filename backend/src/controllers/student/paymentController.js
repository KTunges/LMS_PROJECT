const { Transaction, Course, Enrollment, Class } = require('../../models');

// MOCK VNPAY Payment creation
exports.createPaymentUrl = async (req, res, next) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user.id;

    // For a real VNPAY integration, we would build the vnp_Params here 
    // and sign them with a secret key, then return the URL.
    // Here we will just create a pending transaction and return a mock URL.

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Assuming we enroll them in the first available class for simplicity, 
    // or they select a class. Let's find a class for this course.
    const classObj = await Class.findOne({ where: { course_id: courseId } });
    if (!classObj) return res.status(400).json({ message: 'No classes available for this course' });

    // Create a pending transaction
    const transaction = await Transaction.create({
      student_id: userId,
      course_id: courseId,
      amount: amount || course.price,
      status: 'pending',
      transaction_date: new Date()
    });

    // Mock VNPAY URL
    // In real app: const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${querystring.stringify(vnp_Params)}`;
    const mockPaymentUrl = `http://localhost:5173/student/payment/process?txn_id=${transaction.id}&vnp_ResponseCode=00`;

    res.json({ success: true, paymentUrl: mockPaymentUrl });
  } catch (error) {
    next(error);
  }
};

// MOCK VNPAY IPN / Return URL processing
exports.vnpayReturn = async (req, res, next) => {
  try {
    const { txn_id, vnp_ResponseCode } = req.query;
    
    const transaction = await Transaction.findByPk(txn_id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    if (vnp_ResponseCode === '00') {
      // Payment success
      transaction.status = 'completed';
      await transaction.save();

      // Find a class for this course to enroll
      const classObj = await Class.findOne({ where: { course_id: transaction.course_id } });
      if (classObj) {
        // Enroll student
        await Enrollment.create({
          student_id: transaction.student_id,
          class_id: classObj.id,
          enrollment_date: new Date(),
          status: 'enrolled'
        });
      }

      res.json({ success: true, message: 'Payment successful, enrolled in course' });
    } else {
      transaction.status = 'failed';
      await transaction.save();
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    next(error);
  }
};
