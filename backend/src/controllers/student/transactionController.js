const { Transaction, Course } = require('../../models');

exports.getMyTransactions = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = transactions.map(t => ({
      id: t.id,
      date: t.created_at,
      description: `Đăng ký khóa học: ${t.course?.name || 'Khóa học'}`,
      amount: t.amount,
      status: t.status,
      paymentMethod: t.payment_method
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};
