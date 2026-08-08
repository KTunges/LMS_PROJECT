const { 
  sequelize, User, Category, Material, Course, Class, 
  Enrollment, Grade, Semester, Assignment, Submission, 
  ExamSchedule, TuitionFee, Notification 
} = require('./src/models');
const bcrypt = require('bcryptjs');

const mockMaterials = [
  { title: 'Giáo trình Lập trình Web Nâng cao', subject: 'IT306', type: 'PDF', size: 5452595 },
  { title: 'Slide bài giảng CSDL - Chương 5', subject: 'IT307', type: 'PPTX', size: 3250585 },
  { title: 'Video hướng dẫn Docker cơ bản', subject: 'IT308', type: 'MP4', size: 125829120 },
  { title: 'Bài tập thực hành SQL nâng cao', subject: 'IT307', type: 'PDF', size: 1887436 },
  { title: 'Tài liệu tham khảo ReactJS Hooks', subject: 'IT306', type: 'PDF', size: 2516582 },
  { title: 'Đề cương ôn tập Kiểm thử PM', subject: 'IT309', type: 'DOCX', size: 870400 },
  { title: 'Infographic: Các mô hình phát triển PM', subject: 'IT309', type: 'PNG', size: 2202009 },
  { title: 'Lab Guide: AWS Cloud Practitioner', subject: 'IT308', type: 'PDF', size: 8912896 },
];

const mockCourses = [
  { code: 'IT306', name: 'Lập trình Web Nâng cao', credits: 3 },
  { code: 'IT307', name: 'Cơ sở Dữ liệu', credits: 4 },
  { code: 'IT308', name: 'Điện toán Đám mây', credits: 3 },
  { code: 'IT309', name: 'Kiểm thử Phần mềm', credits: 3 },
];

async function seed() {
  try {
    await sequelize.sync({ force: true }); // drop tables and recreate them to ensure clean state
    console.log('Database synced.');

    // 1. Create users
    const admin = await User.create({
      full_name: 'Quản trị viên Hệ thống',
      email: 'admin@lms.edu.vn',
      password: '123456',
      role: 'admin',
    });
    const teacher = await User.create({
      full_name: 'Giảng viên Nguyễn Văn A',
      email: 'teacher@lms.edu.vn',
      password: '123456',
      role: 'teacher',
    });
    const student = await User.create({
      full_name: 'Sinh viên Trần B',
      email: 'student@lms.edu.vn',
      password: '123456',
      role: 'student',
    });
    console.log('Created mock users.');

    // 2. Create Semesters
    const currentSemester = await Semester.create({
      name: 'HK1-2026',
      start_date: '2026-08-15',
      end_date: '2026-12-30',
    });
    console.log('Created semester.');

    // 3. Create Categories & Courses
    const categoryMap = {};
    const courseMap = {};
    for (const c of mockCourses) {
      const cat = await Category.create({ name: c.code, description: `Danh mục môn ${c.name}` });
      categoryMap[c.code] = cat.id;

      const course = await Course.create({
        code: c.code,
        name: c.name,
        credits: c.credits,
        description: `Mô tả nội dung cho môn ${c.name}`,
        category_id: cat.id,
      });
      courseMap[c.code] = course.id;
    }
    console.log('Created categories & courses.');

    // 4. Create Classes
    const classIt306 = await Class.create({
      course_id: courseMap['IT306'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Phòng 203',
      schedule_time: 'Thứ 2, 08:00-10:00',
    });
    
    const classIt307 = await Class.create({
      course_id: courseMap['IT307'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Lab B1',
      schedule_time: 'Thứ 4, 13:00-16:00',
    });
    console.log('Created classes.');

    // 5. Create Enrollments and Grades
    const enr1 = await Enrollment.create({ student_id: student.id, class_id: classIt306.id, status: 'enrolled' });
    await Grade.create({ enrollment_id: enr1.id, midterm_score: 8.5, final_score: null, overall_score: null });

    const enr2 = await Enrollment.create({ student_id: student.id, class_id: classIt307.id, status: 'completed' });
    await Grade.create({ enrollment_id: enr2.id, midterm_score: 7.0, final_score: 8.0, overall_score: 7.6 });
    console.log('Created enrollments & grades.');

    // 6. Create Materials
    for (const mat of mockMaterials) {
      await Material.create({
        title: mat.title,
        description: 'Tài liệu tham khảo dành cho sinh viên.',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // dummy url
        file_type: mat.type,
        file_size: mat.size,
        category_id: categoryMap[mat.subject],
        user_id: teacher.id,
        status: 'active'
      });
    }
    console.log('Created materials.');

    // 7. Create Assignments & Submissions
    const assignment1 = await Assignment.create({
      class_id: classIt306.id,
      title: 'Bài tập tuần 1: Cấu trúc HTML cơ bản',
      description: 'Sinh viên nén file .zip và nộp trước thứ 6.',
      due_date: new Date('2026-08-25T23:59:59'),
    });

    await Submission.create({
      assignment_id: assignment1.id,
      student_id: student.id,
      file_url: '/uploads/student_b_hw1.zip',
      score: 9.0,
      feedback: 'Bài làm tốt, cấu trúc rõ ràng.',
    });
    console.log('Created assignments & submissions.');

    // 8. Create Exam Schedules
    await ExamSchedule.create({
      class_id: classIt306.id,
      exam_date: new Date('2026-12-15T08:00:00'),
      room: 'Hội trường A',
      type: 'final',
    });
    console.log('Created exam schedules.');

    // 9. Create Tuition Fees
    await TuitionFee.create({
      student_id: student.id,
      semester_id: currentSemester.id,
      total_amount: 8500000,
      status: 'unpaid',
    });
    console.log('Created tuition fees.');

    // 10. Create Notifications
    await Notification.create({
      user_id: student.id,
      title: 'Nhắc nhở đóng học phí',
      content: 'Bạn vui lòng thanh toán học phí HK1-2026 trước ngày 30/09/2026.',
      is_read: false,
    });
    console.log('Created notifications.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
