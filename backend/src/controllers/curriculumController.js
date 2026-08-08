const { Curriculum, Course, Major, Enrollment, Grade, Class } = require('../models');

exports.getMyCurriculum = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.major_id) {
      return res.status(400).json({ message: 'User does not have a major assigned' });
    }

    // Fetch the curriculum for the user's major
    const curriculums = await Curriculum.findAll({
      where: { major_id: user.major_id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'code', 'name', 'credits'],
        }
      ],
      order: [['semester_number', 'ASC']]
    });

    // Fetch user's enrollments and grades to determine passed/failed status
    const enrollments = await Enrollment.findAll({
      where: { student_id: user.id },
      include: [
        {
          model: Grade,
          as: 'grade',
        },
        {
          model: Class,
          as: 'class',
          attributes: ['course_id']
        }
      ]
    });

    // Map course_id to pass/fail status
    // Rule: if grade >= 5.0 (or just present and >= 5.0 for overall) it's passed
    // Here we'll simplify: if overall_score >= 5.0 -> passed, else failed
    // If no grade -> learning or unlearned
    const courseStatusMap = {};
    enrollments.forEach(enr => {
      const courseId = enr.class.course_id;
      if (enr.grade && enr.grade.overall_score !== null) {
        courseStatusMap[courseId] = enr.grade.overall_score >= 5.0 ? 'passed' : 'failed';
      } else {
        courseStatusMap[courseId] = 'learning';
      }
    });

    // Group by semester_number
    const result = {};
    curriculums.forEach(curr => {
      const sem = curr.semester_number;
      if (!result[sem]) {
        result[sem] = {
          semester: sem,
          totalCredits: 0,
          isOpen: false,
          groups: [
            {
              name: 'Học phần bắt buộc',
              credits: 0,
              courses: []
            },
            {
              name: 'Học phần tự chọn',
              credits: 0,
              courses: []
            }
          ]
        };
      }

      const courseData = {
        id: curr.course.code, // using code as ID for UI
        name: curr.course.name,
        type: curr.is_required ? 'Bắt buộc' : 'Tự chọn',
        tc: curr.course.credits,
        lt: curr.course.credits * 15, // mock 15 theory hours per credit
        th: 0,
        groupOption: curr.is_required ? 0 : 1,
        groupReq: curr.is_required ? '' : '1',
        status: courseStatusMap[curr.course.id] || 'unlearned',
        passed: courseStatusMap[curr.course.id] === 'passed'
      };

      const groupIndex = curr.is_required ? 0 : 1;
      result[sem].groups[groupIndex].courses.push(courseData);
      result[sem].groups[groupIndex].credits += courseData.tc;
      result[sem].totalCredits += courseData.tc;
    });

    // Format as array and remove empty groups
    const formattedResult = Object.values(result).map(sem => {
      sem.groups = sem.groups.filter(g => g.courses.length > 0);
      return sem;
    });

    res.json(formattedResult);
  } catch (error) {
    next(error);
  }
};
