const { sequelize, CourseQA, User, Course, Lesson } = require('./src/models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connected');
    
    // Find a teacher, a student, a course, and a lesson
    const teacher = await User.findOne({ where: { role: 'teacher' } });
    const student = await User.findOne({ where: { role: 'student' } });
    const course = await Course.findOne();
    const lesson = await Lesson.findOne();

    if (teacher && student && course) {
      await CourseQA.create({
        course_id: course.id,
        student_id: student.id,
        teacher_id: teacher.id,
        lesson_id: lesson ? lesson.id : null,
        question: 'Thầy ơi cho em hỏi làm sao để thẻ con tự động dãn ra khi nội dung dài ra ạ?',
      });

      await CourseQA.create({
        course_id: course.id,
        student_id: student.id,
        teacher_id: teacher.id,
        lesson_id: lesson ? lesson.id : null,
        question: 'Em dùng useState nhưng giao diện không update ngay lập tức. Có cách nào fix không ạ?',
        answer: 'React cập nhật state theo cơ chế bất đồng bộ (asynchronous). Để thấy kết quả ngay, em nên dùng useEffect theo dõi biến state đó nhé!',
        answered_at: new Date()
      });

      console.log('Seeded QA successfully!');
    }
  } catch (error) {
    console.error('Error seeding QA:', error);
  } finally {
    process.exit(0);
  }
};
seed();
