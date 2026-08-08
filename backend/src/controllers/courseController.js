const { Course, Class, Category, User } = require('../models');

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
    // Assuming we want to fetch classes a student is enrolled in
    const { Enrollment } = require('../models');
    
    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [
        {
          model: Class,
          as: 'class',
          include: [
            { model: Course, as: 'course' },
            { model: User, as: 'teacher', attributes: ['full_name'] }
          ]
        }
      ]
    });
    
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};
