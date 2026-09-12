const { 
  sequelize, User, Category, Material, Course, Class, 
  Enrollment, Grade, Semester, Assignment, Submission, 
  ExamSchedule, TuitionFee, Notification, Major, Curriculum,
  Lesson, Quiz, Question, Answer, LessonProgress
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

const extendedCourses = [
  { code: 'WEB101', name: 'Lập trình Web Frontend Hiện đại (React)', price: 0, image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', level: 'Cơ bản', duration: '4 tuần', cat: 'Lập trình Web' },
  { code: 'WEB201', name: 'RESTful API & Node.js Backend', price: 299000, image_url: 'https://images.unsplash.com/photo-1627398240448-18e4e9411985?w=400&q=80', level: 'Nâng cao', duration: '6 tuần', cat: 'Lập trình Web' },
  { code: 'ENG101', name: 'Tiếng Anh Giao tiếp Công sở', price: 0, image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80', level: 'Cơ bản', duration: '8 tuần', cat: 'Tiếng Anh giao tiếp' },
  { code: 'ENG201', name: 'Luyện thi IELTS Target 7.0+', price: 599000, image_url: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=400&q=80', level: 'Nâng cao', duration: '12 tuần', cat: 'Luyện thi IELTS' },
  { code: 'UIUX101', name: 'Làm chủ Figma trong 7 ngày', price: 0, image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', level: 'Cơ bản', duration: '2 tuần', cat: 'Thiết kế UI/UX' },
  { code: 'MKT101', name: 'Digital Marketing Thực chiến', price: 450000, image_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80', level: 'Trung cấp', duration: '8 tuần', cat: 'Digital Marketing' },
  { code: 'AI101', name: 'Nhập môn Trí tuệ nhân tạo (AI)', price: 899000, image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80', level: 'Cơ bản', duration: '10 tuần', cat: 'Trí tuệ nhân tạo' },
  { code: 'DATA101', name: 'Phân tích dữ liệu với Python', price: 350000, image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', level: 'Trung cấp', duration: '6 tuần', cat: 'Khoa học dữ liệu' }
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // 0. Create Majors
    const majorIT = await Major.create({ code: 'CNTT', name: 'Công nghệ thông tin' });
    const majorBA = await Major.create({ code: 'QTKD', name: 'Quản trị kinh doanh' });
    const majorMKT = await Major.create({ code: 'MKT', name: 'Marketing' });
    const majorMED = await Major.create({ code: 'YD', name: 'Y Dược' });
    console.log('Created majors.');

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
      major_id: majorIT.id,
    });
    const leminhphan = await User.create({
      full_name: 'Lê Minh Phan',
      email: 'leminhphan1@gmail.com',
      password: '123456',
      role: 'student',
      major_id: majorIT.id,
      code: 'SV20239999',
      phone: '0901234567',
      address: 'Quận 1, TP. Hồ Chí Minh'
    });

    // Create 50 mock students with different majors
    const majorsList = [majorIT, majorBA, majorMKT, majorMED];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
    const middleNames = ['Văn', 'Thị', 'Hữu', 'Thanh', 'Minh', 'Ngọc', 'Quang', 'Hải', 'Thảo', 'Quốc'];
    const firstNames = ['An', 'Bình', 'Châu', 'Dũng', 'Đức', 'Hà', 'Kiên', 'Linh', 'Mai', 'Nam'];
    const districts = ['Quận 1', 'Quận 3', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Thủ Đức', 'Gò Vấp', 'Tân Bình'];
    
    for (let i = 1; i <= 50; i++) {
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const major = majorsList[Math.floor(Math.random() * majorsList.length)];
      const district = districts[Math.floor(Math.random() * districts.length)];
      
      const codeStr = `SV2023${String(i).padStart(4, '0')}`;
      // e.g. sv20230001@lms.edu.vn
      const emailStr = `sv2023${String(i).padStart(4, '0')}@lms.edu.vn`;
      
      await User.create({
        full_name: `${lastName} ${middleName} ${firstName}`,
        email: emailStr,
        password: '123456',
        role: 'student',
        major_id: major.id,
        code: codeStr,
        phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `${district}, TP. Hồ Chí Minh`
      });
    }

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
    
    // Create categories based on the distinct ones in extendedCourses
    const catNames = [...new Set(extendedCourses.map(c => c.cat))];
    for (const name of catNames) {
      const cat = await Category.create({ name, description: `Danh mục ${name}` });
      categoryMap[name] = cat.id;
    }

    for (const c of extendedCourses) {
      const course = await Course.create({
        code: c.code,
        name: c.name,
        price: c.price,
        image_url: c.image_url,
        level: c.level,
        duration: c.duration,
        description: `Mô tả nội dung cho môn ${c.name}`,
        category_id: categoryMap[c.cat],
      });
      courseMap[c.code] = course.id;
    }
    console.log('Created categories & courses.');

    // 3.5 Create Curriculum (skipped for non-university)
    console.log('Skipped curriculums.');

    // 4. Create Classes
    const classIt306 = await Class.create({
      course_id: courseMap['WEB101'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Online',
      schedule_time: 'Thứ 2, 08:00-10:00',
      max_students: 40,
      status: 'active'
    });
    
    const classIt307 = await Class.create({
      course_id: courseMap['ENG101'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Online',
      schedule_time: 'Thứ 4, 13:00-16:00',
      max_students: 40,
      status: 'active'
    });
    
    const classIt308 = await Class.create({
      course_id: courseMap['UIUX101'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Online',
      schedule_time: 'Thứ 6, 08:00-10:00',
      max_students: 40,
      status: 'active'
    });

    const classIt309 = await Class.create({
      course_id: courseMap['MKT101'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Online',
      schedule_time: 'Thứ 3, 13:00-16:00',
      max_students: 40,
      status: 'active'
    });
    console.log('Created classes.');

    // 5. Create Enrollments and Grades (History for Semesters 1, 2, 3)
    const createGrade = async (courseCode, score) => {
      const cls = await Class.create({
        course_id: courseMap[courseCode],
        teacher_id: teacher.id,
        semester_id: currentSemester.id, // technically an older semester, but mock is fine
        room: 'Online',
        schedule_time: 'N/A',
        status: 'completed'
      });
      const enr = await Enrollment.create({ student_id: student.id, class_id: cls.id, status: 'completed' });
      await Grade.create({ enrollment_id: enr.id, midterm_score: score, final_score: score + 0.5, overall_score: score + 0.2 });
    };

    await createGrade('WEB201', 8.0);
    await createGrade('ENG201', 7.5);
    await createGrade('AI101', 9.0);
    await createGrade('DATA101', 8.5);

    // Current enrollments (Semester 4/5)
    const enrCurrent = await Enrollment.create({ student_id: student.id, class_id: classIt306.id, status: 'enrolled' });
    await Grade.create({ enrollment_id: enrCurrent.id, midterm_score: 8.5, final_score: null, overall_score: null });

    console.log('Created enrollments & grades.');

    // 6. Create Materials
    for (const mat of mockMaterials) {
      if (categoryMap[mat.subject]) { // Only if category exists in our mapping
        await Material.create({
          title: mat.title,
          description: 'Tài liệu tham khảo dành cho sinh viên.',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // dummy url
          file_type: mat.type,
          file_size: mat.size,
          category_id: cat.id,
          user_id: teacher.id,
          status: 'active'
        });
      }
    }
    console.log('Created materials.');

    // 6.5 Create Lessons, Quizzes and Progress
    const courseIt306Id = courseMap['IT306'];
    
    // 4 standard lessons for the course
    const l1 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Bài 1: Giới thiệu khóa học', lesson_type: 'video', content_url: '', duration: '5:30', order_index: 1 });
    const l2 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Bài 2: Cài đặt môi trường', lesson_type: 'video', content_url: '', duration: '12:45', order_index: 2 });
    const l3 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Bài 3: Cấu trúc cơ bản', lesson_type: 'video', content_url: '', duration: '18:20', order_index: 3 });
    const l4 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Bài 4: Các thành phần (Components)', lesson_type: 'video', content_url: '', duration: '22:15', order_index: 4 });
    
    // 1 quiz lesson for the course
    // First create quiz without lesson_id, then link them
    const quiz1 = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); // Temp lesson_id
    
    const l5 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Quiz 1: Kiểm tra kiến thức', lesson_type: 'quiz', content_url: quiz1.id.toString(), duration: '3 câu - 15 phút', order_index: 5 });
    
    quiz1.lesson_id = l5.id;
    await quiz1.save();
    
    const q1 = await Question.create({ quiz_id: quiz1.id, content: 'ReactJS là gì?', question_type: 'single_choice', marks: 3.3 });
    await Answer.create({ question_id: q1.id, content: 'Một ngôn ngữ lập trình', is_correct: false });
    await Answer.create({ question_id: q1.id, content: 'Một thư viện JavaScript để xây dựng giao diện người dùng', is_correct: true });
    await Answer.create({ question_id: q1.id, content: 'Một framework CSS', is_correct: false });
    await Answer.create({ question_id: q1.id, content: 'Một cơ sở dữ liệu', is_correct: false });

    const q2 = await Question.create({ quiz_id: quiz1.id, content: 'Hook nào được sử dụng để quản lý state trong Functional Component?', question_type: 'single_choice', marks: 3.3 });
    await Answer.create({ question_id: q2.id, content: 'useEffect', is_correct: false });
    await Answer.create({ question_id: q2.id, content: 'useContext', is_correct: false });
    await Answer.create({ question_id: q2.id, content: 'useState', is_correct: true });
    await Answer.create({ question_id: q2.id, content: 'useReducer', is_correct: false });

    const q3 = await Question.create({ quiz_id: quiz1.id, content: 'Virtual DOM trong React hoạt động như thế nào?', question_type: 'single_choice', marks: 3.4 });
    await Answer.create({ question_id: q3.id, content: 'Cập nhật toàn bộ trang web mỗi khi có thay đổi', is_correct: false });
    await Answer.create({ question_id: q3.id, content: 'Là bản sao của DOM thật, giúp tối ưu hóa việc cập nhật giao diện', is_correct: true });
    await Answer.create({ question_id: q3.id, content: 'Chỉ lưu trữ dữ liệu người dùng', is_correct: false });
    await Answer.create({ question_id: q3.id, content: 'Thay thế hoàn toàn HTML', is_correct: false });
    
    // 1 document lesson for the course
    const l6 = await Lesson.create({ course_id: courseIt306Id, class_id: null, title: 'Tài liệu ôn tập chương 1', lesson_type: 'document', content_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', duration: 'PDF - 2.5MB', order_index: 6 });
    
    // 1 supplementary lesson ONLY for classIt306
    const l7 = await Lesson.create({ course_id: null, class_id: classIt306.id, title: '[Bonus] Luyện tập React Hooks với dự án thực tế', lesson_type: 'video', content_url: '', duration: '45:00', order_index: 7 });

    // Progress for student
    await LessonProgress.create({ student_id: student.id, lesson_id: l1.id, is_completed: true });
    await LessonProgress.create({ student_id: student.id, lesson_id: l2.id, is_completed: true });
    // Lesson 3, 4, etc. not completed yet.
    
    console.log('Created lessons & quizzes.');

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
