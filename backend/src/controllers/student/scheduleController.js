const { Enrollment, Class, Course, Assignment, ExamSchedule, LiveSession } = require('../../models');

exports.getMySchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Get all classes the student is enrolled in
    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [
        {
          model: Class,
          as: 'class',
          include: [{ model: Course, as: 'course' }]
        }
      ]
    });

    const classIds = enrollments.map(e => e.class_id).filter(id => id);
    const courseIds = enrollments.map(e => e.class?.course_id).filter(id => id);

    if (classIds.length === 0 && courseIds.length === 0) {
      return res.json([]);
    }

    const scheduleEvents = [];

    // 2. Fetch Assignments for these classes
    if (classIds.length > 0) {
      const assignments = await Assignment.findAll({
        where: { class_id: classIds },
        include: [{ model: Class, as: 'class', include: [{ model: Course, as: 'course' }] }]
      });

      assignments.forEach(a => {
        scheduleEvents.push({
          id: `assignment_${a.id}`,
          title: `Deadline: ${a.title}`,
          date: a.due_date,
          type: 'deadline',
          className: a.class?.course?.name || 'Class'
        });
      });

      // 3. Fetch Exam Schedules for these classes
      const exams = await ExamSchedule.findAll({
        where: { class_id: classIds },
        include: [{ model: Class, as: 'class', include: [{ model: Course, as: 'course' }] }]
      });

      exams.forEach(e => {
        scheduleEvents.push({
          id: `exam_${e.id}`,
          title: `Exam (${e.type}): Room ${e.room}`,
          date: e.exam_date,
          type: 'exam',
          className: e.class?.course?.name || 'Class'
        });
      });
    }

    // 4. Fetch Live Sessions for these courses (since LiveSession uses course_id)
    if (courseIds.length > 0) {
      const liveSessions = await LiveSession.findAll({
        where: { course_id: courseIds, status: 'waiting' }
      });

      liveSessions.forEach(ls => {
        // Since LiveSession lacks a scheduled_at date, we will just simulate it as +1 day from created_at
        // In a real system, the teacher should set a schedule date.
        const fakeScheduledDate = new Date(new Date(ls.created_at).getTime() + 86400000); 
        
        scheduleEvents.push({
          id: `live_${ls.id}`,
          title: `Live: ${ls.title}`,
          date: fakeScheduledDate, // Mocking date for now because DB lacks scheduled_at
          type: 'live',
          className: 'Live Session' // We don't join Course here to save queries, just keep it simple
        });
      });
    }

    // Return aggregated events
    res.json(scheduleEvents);

  } catch (error) {
    next(error);
  }
};
