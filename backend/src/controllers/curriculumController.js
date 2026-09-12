const { Curriculum, Course, Major, Enrollment, Grade, Class } = require('../models');

exports.getMyCurriculum = async (req, res, next) => {
  try {
    const user = req.user;

    // Fetch all curriculums across all majors (Learning Paths)
    const curriculums = await Curriculum.findAll({
      include: [
        {
          model: Major,
          as: 'major' // assuming association exists, wait, let me check models later if it fails, I'll assume Major has one-to-many Curriculum
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'code', 'name', 'price'],
        }
      ],
      order: [['major_id', 'ASC'], ['semester_number', 'ASC']]
    });

    // We need to fetch majors independently to ensure we get their names
    const majors = await Major.findAll();
    const majorMap = {};
    majors.forEach(m => majorMap[m.id] = m.name);

    // Fetch user's enrollments and grades
    const enrollments = await Enrollment.findAll({
      where: { student_id: user.id },
      include: [
        { model: Grade, as: 'grade' },
        { model: Class, as: 'class', attributes: ['course_id'] }
      ]
    });

    const courseStatusMap = {};
    enrollments.forEach(enr => {
      if (!enr.class) return;
      const courseId = enr.class.course_id;
      if (enr.grade && enr.grade.overall_score !== null) {
        courseStatusMap[courseId] = enr.grade.overall_score >= 5.0 ? 'passed' : 'failed';
      } else {
        courseStatusMap[courseId] = 'learning';
      }
    });

    // Group by Major (Learning Path), then by Stage (semester_number)
    const paths = {};
    
    curriculums.forEach(curr => {
      if (!curr.course) return;
      const pathId = curr.major_id;
      
      if (!paths[pathId]) {
        paths[pathId] = {
          id: pathId,
          title: majorMap[pathId] || `Lộ trình ${pathId}`,
          isOpen: false,
          stages: {}
        };
      }

      const stageIndex = curr.semester_number;
      if (!paths[pathId].stages[stageIndex]) {
        paths[pathId].stages[stageIndex] = {
          semester: stageIndex,
          title: `Chặng ${stageIndex}`,
          isOpen: true,
          courses: []
        };
      }

      paths[pathId].stages[stageIndex].courses.push({
        id: curr.course.code,
        name: curr.course.name,
        level: 'Cơ bản',
        status: courseStatusMap[curr.course.id] || 'unlearned',
        passed: courseStatusMap[curr.course.id] === 'passed'
      });
    });

    // Format final array
    const formattedResult = Object.values(paths).map(path => ({
      ...path,
      stages: Object.values(path.stages)
    }));

    res.json(formattedResult);
  } catch (error) {
    next(error);
  }
};
