const { 
  sequelize, User, Category, Material, Course, Class, 
  Enrollment, Grade, Semester, Assignment, Submission, 
  ExamSchedule, TuitionFee, Notification, Major, Curriculum,
  Lesson, Quiz, Question, Answer, LessonProgress, TestCase
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
      for (const st of [student, leminhphan]) {
        const enr = await Enrollment.create({ student_id: st.id, class_id: cls.id, status: 'completed' });
        await Grade.create({ enrollment_id: enr.id, midterm_score: score, final_score: score + 0.5, overall_score: score + 0.2 });
      }
    };

    await createGrade('WEB201', 8.0);
    await createGrade('ENG201', 7.5);
    await createGrade('AI101', 9.0);
    await createGrade('DATA101', 8.5);

    // Current enrollments (Semester 4/5)
    for (const st of [student, leminhphan]) {
      const enrCurrent = await Enrollment.create({ student_id: st.id, class_id: classIt306.id, status: 'enrolled' });
      await Grade.create({ enrollment_id: enrCurrent.id, midterm_score: 8.5, final_score: null, overall_score: null });
    }

    console.log('Created enrollments & grades.');

    // 6. Create Materials
    for (const mat of mockMaterials) {
      if (categoryMap[mat.subject]) { // Only if category exists in our mapping
        await Material.create({
          title: mat.title,
          description: 'Tài liệu tham khảo dành cho sinh viên.',
          file_url: 'https://pdfobject.com/pdf/sample.pdf', // dummy url
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
    const courseWeb101Id = courseMap['WEB101'];
    
    // Bài 1
    const l1 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 1: Khởi đầu với React', title: '[Video] React in 100 Seconds', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', duration: '2:15', order_index: 1 });
    const l2 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 1: Khởi đầu với React', title: '[Tài liệu] React in 100 Seconds - Slide & Script', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/react_intro.pdf', duration: 'PDF - 2.00MB', order_index: 2 });
    
    // Bài 2
    const l3 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 2: Components', title: '[Video] React Components Tutorial', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=Y2hgEGPzTZY', duration: '15:20', order_index: 3 });
    const l4 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 2: Components', title: '[Tài liệu] Hướng dẫn xây dựng Component', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/react_components.pdf', duration: 'PDF - 0.98MB', order_index: 4 });
    
    // Bài 3
    const l5 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 3: Props', title: '[Video] React Props Tutorial', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=m7OWXtbiXX8', duration: '12:45', order_index: 5 });
    const l6 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 3: Props', title: '[Tài liệu] Cách truyền dữ liệu với Props', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/react_props.pdf', duration: 'PDF - 1.55MB', order_index: 6 });
    
    // Bài 4
    const l7 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 4: Hooks - useState', title: '[Video] Learn useState In 15 Minutes', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=O6P86uwfdR0', duration: '15:00', order_index: 7 });
    const l8 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 4: Hooks - useState', title: '[Tài liệu] Cheat Sheet useState', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/react_usestate.pdf', duration: 'PDF - 2.52MB', order_index: 8 });
    
    // Bài 5
    const l9 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 5: Hooks - useEffect', title: '[Video] Learn useEffect In 13 Minutes', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', duration: '13:00', order_index: 9 });
    const l10 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Chương 5: Hooks - useEffect', title: '[Tài liệu] Cheat Sheet useEffect', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/react_useeffect.pdf', duration: 'PDF - 3.46MB', order_index: 10 });
    
    // Quiz
    const quiz1 = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); // Temp lesson_id
    const l11 = await Lesson.create({ course_id: courseWeb101Id, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Kiểm tra kiến thức toàn khóa', lesson_type: 'quiz', content_url: quiz1.id.toString(), duration: '3 câu - 15 phút', order_index: 11 });
    quiz1.lesson_id = l11.id;
    await quiz1.save();
    
    // Quiz questions (10 questions total)
    const q1 = await Question.create({ quiz_id: quiz1.id, content: 'ReactJS là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q1.id, content: 'Một ngôn ngữ lập trình', is_correct: false });
    await Answer.create({ question_id: q1.id, content: 'Một thư viện JavaScript để xây dựng giao diện người dùng', is_correct: true });
    await Answer.create({ question_id: q1.id, content: 'Một framework CSS', is_correct: false });
    
    const q2 = await Question.create({ quiz_id: quiz1.id, content: 'Hook nào được sử dụng để quản lý state?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q2.id, content: 'useEffect', is_correct: false });
    await Answer.create({ question_id: q2.id, content: 'useState', is_correct: true });
    await Answer.create({ question_id: q2.id, content: 'useContext', is_correct: false });
    
    const q3 = await Question.create({ quiz_id: quiz1.id, content: 'Virtual DOM là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q3.id, content: 'Là bản sao của DOM thật, giúp tối ưu hóa việc cập nhật giao diện', is_correct: true });
    await Answer.create({ question_id: q3.id, content: 'Là một dạng cơ sở dữ liệu', is_correct: false });

    const q4 = await Question.create({ quiz_id: quiz1.id, content: 'Trong React, thuộc tính (prop) được sử dụng để làm gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q4.id, content: 'Quản lý trạng thái cục bộ của component', is_correct: false });
    await Answer.create({ question_id: q4.id, content: 'Truyền dữ liệu từ component cha xuống component con', is_correct: true });
    await Answer.create({ question_id: q4.id, content: 'Tạo kiểu CSS cho component', is_correct: false });

    const q5 = await Question.create({ quiz_id: quiz1.id, content: 'useEffect chạy khi nào theo mặc định?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q5.id, content: 'Chỉ khi component được mount lần đầu', is_correct: false });
    await Answer.create({ question_id: q5.id, content: 'Sau mỗi lần component render', is_correct: true });
    await Answer.create({ question_id: q5.id, content: 'Chỉ khi state thay đổi', is_correct: false });

    const q6 = await Question.create({ quiz_id: quiz1.id, content: 'JSX là viết tắt của từ gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q6.id, content: 'JavaScript XML', is_correct: true });
    await Answer.create({ question_id: q6.id, content: 'Java Syntax Extension', is_correct: false });
    await Answer.create({ question_id: q6.id, content: 'JSON X', is_correct: false });

    const q7 = await Question.create({ quiz_id: quiz1.id, content: 'Trong React, phương thức render() trả về cái gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q7.id, content: 'Một mảng các HTML Element', is_correct: false });
    await Answer.create({ question_id: q7.id, content: 'Một React Element duy nhất (có thể chứa các phần tử con)', is_correct: true });
    await Answer.create({ question_id: q7.id, content: 'Một chuỗi HTML', is_correct: false });

    const q8 = await Question.create({ quiz_id: quiz1.id, content: 'Làm thế nào để truyền một function dưới dạng prop?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q8.id, content: '<MyComponent onClick={myFunction} />', is_correct: true });
    await Answer.create({ question_id: q8.id, content: '<MyComponent onClick="myFunction()" />', is_correct: false });
    await Answer.create({ question_id: q8.id, content: '<MyComponent onClick={myFunction()} />', is_correct: false });

    const q9 = await Question.create({ quiz_id: quiz1.id, content: 'Đâu không phải là một quy tắc của React Hooks?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q9.id, content: 'Chỉ gọi Hooks ở trên cùng của component (Top Level)', is_correct: false });
    await Answer.create({ question_id: q9.id, content: 'Chỉ gọi Hooks từ các React functional components', is_correct: false });
    await Answer.create({ question_id: q9.id, content: 'Có thể gọi Hooks bên trong các vòng lặp hoặc câu điều kiện', is_correct: true });

    const q10 = await Question.create({ quiz_id: quiz1.id, content: 'State trong React là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: q10.id, content: 'Một đối tượng lưu trữ dữ liệu của component và có thể thay đổi theo thời gian', is_correct: true });
    await Answer.create({ question_id: q10.id, content: 'Một biến toàn cục lưu cấu hình dự án', is_correct: false });
    await Answer.create({ question_id: q10.id, content: 'Dữ liệu không bao giờ thay đổi', is_correct: false });

    // Note: We removed the coding question to have exactly 10 multiple choice questions for standard quizzing.

    const courseWeb201Id = courseMap['WEB201'];
    // Bài 1
    const n1 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 1: Giới thiệu Node.js & Express', title: '[Video] Nhập môn Node.js và Cài đặt Express', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=yASTlcs7wJA', duration: '12:00', order_index: 1 });
    const n2 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 1: Giới thiệu Node.js & Express', title: '[Tài liệu] Nhập môn & Khởi tạo dự án', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/nodejs_express_setup.pdf', duration: 'PDF - 1.2MB', order_index: 2 });
    // Bài 2
    const n3 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 2: Kiến trúc RESTful API', title: '[Video] REST API là gì?', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=WILnxiKOUz8', duration: '18:30', order_index: 3 });
    const n4 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 2: Kiến trúc RESTful API', title: '[Tài liệu] Kiến trúc RESTful API', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/restful_api_concept.pdf', duration: 'PDF - 1.5MB', order_index: 4 });
    // Bài 3
    const n5 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 3: Kết nối cơ sở dữ liệu MongoDB', title: '[Video] Kết nối MongoDB bằng Mongoose', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=gPq4zUpMDEw', duration: '20:15', order_index: 5 });
    const n6 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 3: Kết nối cơ sở dữ liệu MongoDB', title: '[Tài liệu] Kết nối cơ sở dữ liệu MongoDB', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mongodb_mongoose_connect.pdf', duration: 'PDF - 2.1MB', order_index: 6 });
    // Bài 4
    const n7 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 4: Xây dựng CRUD API thực tế', title: '[Video] CRUD API Tutorial', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=_7UQPve99r4', duration: '25:00', order_index: 7 });
    const n8 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 4: Xây dựng CRUD API thực tế', title: '[Tài liệu] Xây dựng CRUD API thực tế', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/crud_api_operations.pdf', duration: 'PDF - 1.8MB', order_index: 8 });
    // Bài 5
    const n9 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 5: Xác thực người dùng', title: '[Video] JWT Authentication', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=favjC6EKFgw', duration: '22:10', order_index: 9 });
    const n10 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 5: Xác thực người dùng', title: '[Tài liệu] Xác thực người dùng (Authentication)', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/jwt_authentication.pdf', duration: 'PDF - 1.9MB', order_index: 10 });
    // Bài 6
    const n11 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 6: Xử lý Upload File', title: '[Video] Upload Files Using Multer', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=i8yxx6V9UdM', duration: '15:45', order_index: 11 });
    const n12 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 6: Xử lý Upload File', title: '[Tài liệu] Xử lý Upload File', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/multer_file_upload.pdf', duration: 'PDF - 1.3MB', order_index: 12 });
    // Bài 7
    const n13 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 7: Triển khai (Deploy)', title: '[Video] Deploying Node.js API To Render', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=l134cBAJCuc', duration: '10:20', order_index: 13 });
    const n14 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Chương 7: Triển khai (Deploy)', title: '[Tài liệu] Triển khai (Deploy) API lên mạng', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/deploy_nodejs_render.pdf', duration: 'PDF - 1.1MB', order_index: 14 });

    // Node.js Quiz
    const quiz2 = await Quiz.create({ lesson_id: 1, time_limit: 20, total_marks: 10 });
    const n15 = await Lesson.create({ course_id: courseWeb201Id, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Đánh giá kiến thức RESTful API', lesson_type: 'quiz', content_url: quiz2.id.toString(), duration: '10 câu - 20 phút', order_index: 15 });
    quiz2.lesson_id = n15.id;
    await quiz2.save();

    // Node.js Quiz questions (10 questions)
    const nq1 = await Question.create({ quiz_id: quiz2.id, content: 'Đặc điểm nào dưới đây mô tả đúng nhất về Node.js?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq1.id, content: 'Là một Framework của JavaScript', is_correct: false });
    await Answer.create({ question_id: nq1.id, content: 'Là môi trường thực thi mã JavaScript phía Server', is_correct: true });
    await Answer.create({ question_id: nq1.id, content: 'Là ngôn ngữ lập trình mới', is_correct: false });

    const nq2 = await Question.create({ quiz_id: quiz2.id, content: 'Express.js là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq2.id, content: 'Một thư viện quản lý cơ sở dữ liệu', is_correct: false });
    await Answer.create({ question_id: nq2.id, content: 'Một Web Framework nhỏ gọn dành cho Node.js', is_correct: true });
    await Answer.create({ question_id: nq2.id, content: 'Một công cụ bảo mật API', is_correct: false });

    const nq3 = await Question.create({ quiz_id: quiz2.id, content: 'Kiến trúc RESTful API sử dụng phương thức nào để tạo dữ liệu mới?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq3.id, content: 'GET', is_correct: false });
    await Answer.create({ question_id: nq3.id, content: 'PUT', is_correct: false });
    await Answer.create({ question_id: nq3.id, content: 'POST', is_correct: true });

    const nq4 = await Question.create({ quiz_id: quiz2.id, content: 'Mã HTTP Status Code nào mang ý nghĩa là "Không tìm thấy tài nguyên"?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq4.id, content: '200', is_correct: false });
    await Answer.create({ question_id: nq4.id, content: '404', is_correct: true });
    await Answer.create({ question_id: nq4.id, content: '500', is_correct: false });

    const nq5 = await Question.create({ quiz_id: quiz2.id, content: 'Trong Mongoose, phương thức nào dùng để tìm một Document theo ID?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq5.id, content: 'Model.findById()', is_correct: true });
    await Answer.create({ question_id: nq5.id, content: 'Model.getOne()', is_correct: false });
    await Answer.create({ question_id: nq5.id, content: 'Model.search()', is_correct: false });

    const nq6 = await Question.create({ quiz_id: quiz2.id, content: 'JWT (JSON Web Token) bao gồm mấy phần?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq6.id, content: '2 phần (Header, Payload)', is_correct: false });
    await Answer.create({ question_id: nq6.id, content: '3 phần (Header, Payload, Signature)', is_correct: true });
    await Answer.create({ question_id: nq6.id, content: '4 phần', is_correct: false });

    const nq7 = await Question.create({ quiz_id: quiz2.id, content: 'Thư viện nào thường được sử dụng trong Node.js/Express để xử lý upload file?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq7.id, content: 'Multer', is_correct: true });
    await Answer.create({ question_id: nq7.id, content: 'Body-parser', is_correct: false });
    await Answer.create({ question_id: nq7.id, content: 'Mongoose', is_correct: false });

    const nq8 = await Question.create({ quiz_id: quiz2.id, content: 'Trong kiến trúc REST, URL (Endpoint) thường dùng để miêu tả cái gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq8.id, content: 'Một hành động (VD: /createUser)', is_correct: false });
    await Answer.create({ question_id: nq8.id, content: 'Một tài nguyên (VD: /users)', is_correct: true });
    await Answer.create({ question_id: nq8.id, content: 'Một biến trạng thái', is_correct: false });

    const nq9 = await Question.create({ quiz_id: quiz2.id, content: 'Làm thế nào để truy cập các Query Parameters trong Express (VD: /users?age=20)?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq9.id, content: 'req.body.age', is_correct: false });
    await Answer.create({ question_id: nq9.id, content: 'req.params.age', is_correct: false });
    await Answer.create({ question_id: nq9.id, content: 'req.query.age', is_correct: true });

    const nq10 = await Question.create({ quiz_id: quiz2.id, content: 'Để lấy dữ liệu JSON gửi lên từ client, ta cần thiết lập middleware nào trong Express?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: nq10.id, content: 'express.json()', is_correct: true });
    await Answer.create({ question_id: nq10.id, content: 'express.urlencoded()', is_correct: false });
    await Answer.create({ question_id: nq10.id, content: 'express.text()', is_correct: false });

    // IELTS Target 7.0+ (ENG201)
    const courseEng201Id = courseMap['ENG201'];
    
    // Bài 1
    const ielts1 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 1: Tổng quan & Chiến lược', title: '[Video] IELTS 7.0 trong 3 tháng - Lộ trình', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=tFBtIWLdZ6c', duration: '12:45', order_index: 1 });
    const ielts2 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 1: Tổng quan & Chiến lược', title: '[Tài liệu] Lộ trình IELTS 7.0 (Cambridge)', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_7_roadmap.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    const ielts3 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 2: IELTS Reading', title: '[Video] Skimming và Scanning hiệu quả', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=Jnyb-URnrTg', duration: '15:20', order_index: 3 });
    const ielts4 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 2: IELTS Reading', title: '[Tài liệu] Reading Practice Test', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_reading_strategies.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    const ielts5 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 3: IELTS Listening', title: '[Video] Luyện nghe Section 3 & 4', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=q8qmJeBxk4Q', duration: '20:10', order_index: 5 });
    const ielts6 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 3: IELTS Listening', title: '[Tài liệu] Listening Sample Tasks', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_listening_practice.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    const ielts7 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 4: IELTS Writing Task 1', title: '[Video] Hướng dẫn Writing Task 1 từ A-Z', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=9X3XKaK0ruc', duration: '18:30', order_index: 7 });
    const ielts8 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 4: IELTS Writing Task 1', title: '[Tài liệu] Task 1 Sample Answers', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_writing_task1.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    const ielts9 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 5: IELTS Writing Task 2', title: '[Video] Cách viết bài luận chuẩn 7.0+', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=6JXLg3Uyk6U', duration: '22:15', order_index: 9 });
    const ielts10 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 5: IELTS Writing Task 2', title: '[Tài liệu] Task 2 Band 8.0 Guide', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_writing_task2_band8.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    const ielts11 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 6: IELTS Speaking', title: '[Video] Phát triển ý & Idioms Part 2, 3', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=Jnyb-URnrTg', duration: '16:45', order_index: 11 });
    const ielts12 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài 6: IELTS Speaking', title: '[Tài liệu] Speaking Sample Tasks', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ielts_speaking_vocabulary.pdf', duration: 'PDF', order_index: 12 });
    
    // Quiz IELTS
    const quiz3 = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const ielts13 = await Lesson.create({ course_id: courseEng201Id, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Kiểm tra kiến thức IELTS tổng quan', lesson_type: 'quiz', content_url: quiz3.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quiz3.lesson_id = ielts13.id;
    await quiz3.save();
    
    // Quiz questions for IELTS (10 questions total)
    const iq1 = await Question.create({ quiz_id: quiz3.id, content: 'Bài thi IELTS Academic Reading bao gồm bao nhiêu phần (passages)?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq1.id, content: '2 phần', is_correct: false });
    await Answer.create({ question_id: iq1.id, content: '3 phần', is_correct: true });
    await Answer.create({ question_id: iq1.id, content: '4 phần', is_correct: false });
    
    const iq2 = await Question.create({ quiz_id: quiz3.id, content: 'Thời gian làm bài thi Writing IELTS là bao nhiêu phút?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq2.id, content: '45 phút', is_correct: false });
    await Answer.create({ question_id: iq2.id, content: '60 phút', is_correct: true });
    await Answer.create({ question_id: iq2.id, content: '90 phút', is_correct: false });
    
    const iq3 = await Question.create({ quiz_id: quiz3.id, content: 'Writing Task 2 yêu cầu viết tối thiểu bao nhiêu từ?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq3.id, content: '150 từ', is_correct: false });
    await Answer.create({ question_id: iq3.id, content: '200 từ', is_correct: false });
    await Answer.create({ question_id: iq3.id, content: '250 từ', is_correct: true });
    
    const iq4 = await Question.create({ quiz_id: quiz3.id, content: 'Kỹ năng Skimming trong Reading được hiểu là:', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq4.id, content: 'Đọc lướt để nắm ý chính', is_correct: true });
    await Answer.create({ question_id: iq4.id, content: 'Đọc kỹ từng từ', is_correct: false });
    await Answer.create({ question_id: iq4.id, content: 'Tìm thông tin chi tiết (tên, số, ngày tháng)', is_correct: false });
    
    const iq5 = await Question.create({ quiz_id: quiz3.id, content: 'Kỹ năng Scanning trong Reading dùng để:', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq5.id, content: 'Hiểu ý tưởng toàn bài', is_correct: false });
    await Answer.create({ question_id: iq5.id, content: 'Tìm nhanh một thông tin cụ thể', is_correct: true });
    await Answer.create({ question_id: iq5.id, content: 'Đọc đoán nghĩa từ mới', is_correct: false });
    
    const iq6 = await Question.create({ quiz_id: quiz3.id, content: 'Trong bài thi Listening, có thời gian để chuyển đáp án sang Answer Sheet không?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq6.id, content: 'Không có', is_correct: false });
    await Answer.create({ question_id: iq6.id, content: 'Có 5 phút (trên giấy)', is_correct: false });
    await Answer.create({ question_id: iq6.id, content: 'Có 10 phút (trên giấy)', is_correct: true });
    
    const iq7 = await Question.create({ quiz_id: quiz3.id, content: 'Speaking Part 2 (Long turn) yêu cầu thí sinh nói liên tục trong khoảng thời gian bao lâu?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq7.id, content: '1 phút', is_correct: false });
    await Answer.create({ question_id: iq7.id, content: '1 đến 2 phút', is_correct: true });
    await Answer.create({ question_id: iq7.id, content: '3 đến 4 phút', is_correct: false });
    
    const iq8 = await Question.create({ quiz_id: quiz3.id, content: 'Khi gặp một câu hỏi Yes/No/Not Given, nếu thông tin hoàn toàn không được nhắc tới trong bài đọc, bạn chọn:', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq8.id, content: 'Yes', is_correct: false });
    await Answer.create({ question_id: iq8.id, content: 'No', is_correct: false });
    await Answer.create({ question_id: iq8.id, content: 'Not Given', is_correct: true });
    
    const iq9 = await Question.create({ quiz_id: quiz3.id, content: 'Task 1 Academic thường yêu cầu miêu tả:', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq9.id, content: 'Một biểu đồ, bảng biểu, quy trình hoặc bản đồ', is_correct: true });
    await Answer.create({ question_id: iq9.id, content: 'Một bức thư xin lỗi', is_correct: false });
    await Answer.create({ question_id: iq9.id, content: 'Một quan điểm xã hội', is_correct: false });
    
    const iq10 = await Question.create({ quiz_id: quiz3.id, content: 'Tiêu chí chấm điểm "Lexical Resource" trong Speaking và Writing đánh giá điều gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: iq10.id, content: 'Độ trôi chảy', is_correct: false });
    await Answer.create({ question_id: iq10.id, content: 'Ngữ pháp chính xác', is_correct: false });
    await Answer.create({ question_id: iq10.id, content: 'Vốn từ vựng', is_correct: true });

    // Nhập môn Trí tuệ nhân tạo (AI101)
    const courseAi101Id = courseMap['AI101'];
    
    // Bài 1
    const ai1 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 1: Tổng quan về AI', title: '[Video] What is Artificial Intelligence', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=ttIOdAdQaUE', duration: '08:30', order_index: 1 });
    const ai2 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 1: Tổng quan về AI', title: '[Tài liệu] Introduction to AI (Microsoft)', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ai_intro.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    const ai3 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 2: Machine Learning', title: '[Video] Machine Learning Basics', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', duration: '12:45', order_index: 3 });
    const ai4 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 2: Machine Learning', title: '[Tài liệu] ML Fundamentals', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/ml_basics.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    const ai5 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 3: Deep Learning', title: '[Video] Deep Learning & Neural Networks', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=sWPNm_GhhCA', duration: '18:20', order_index: 5 });
    const ai6 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 3: Deep Learning', title: '[Tài liệu] Deep Learning Concepts', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/dl_neural.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    const ai7 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 4: Xử lý ngôn ngữ tự nhiên (NLP)', title: '[Video] NLP Crash Course', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=oi0JXuL19TA', duration: '20:15', order_index: 7 });
    const ai8 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 4: Xử lý ngôn ngữ tự nhiên (NLP)', title: '[Tài liệu] Introduction to NLP', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/nlp_crash.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    const ai9 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 5: Thị giác máy tính', title: '[Video] Computer Vision Tutorial', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=-4E2-0sxVUM', duration: '15:10', order_index: 9 });
    const ai10 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 5: Thị giác máy tính', title: '[Tài liệu] Computer Vision Basics', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/cv_tutorial.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    const ai11 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 6: Generative AI', title: '[Video] Generative AI Explained', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=G2FQy90ZcgE', duration: '10:05', order_index: 11 });
    const ai12 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài 6: Generative AI', title: '[Tài liệu] Generative AI Overview', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/gen_ai.pdf', duration: 'PDF', order_index: 12 });
    
    // Quiz AI
    const quizAi = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const ai13 = await Lesson.create({ course_id: courseAi101Id, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Kiểm tra kiến thức AI tổng quan', lesson_type: 'quiz', content_url: quizAi.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quizAi.lesson_id = ai13.id;
    await quizAi.save();
    
    // Quiz questions for AI (10 questions total)
    const aiq1 = await Question.create({ quiz_id: quizAi.id, content: 'Trí tuệ nhân tạo (AI) là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq1.id, content: 'Khả năng máy tính mô phỏng trí tuệ con người', is_correct: true });
    await Answer.create({ question_id: aiq1.id, content: 'Một loại phần cứng mới', is_correct: false });
    await Answer.create({ question_id: aiq1.id, content: 'Ngôn ngữ lập trình web', is_correct: false });
    
    const aiq2 = await Question.create({ quiz_id: quizAi.id, content: 'Học máy (Machine Learning) là một nhánh của lĩnh vực nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq2.id, content: 'Internet of Things', is_correct: false });
    await Answer.create({ question_id: aiq2.id, content: 'Trí tuệ nhân tạo', is_correct: true });
    await Answer.create({ question_id: aiq2.id, content: 'Blockchain', is_correct: false });
    
    const aiq3 = await Question.create({ quiz_id: quizAi.id, content: 'Mạng nơ-ron nhân tạo (Neural Network) được lấy cảm hứng từ đâu?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq3.id, content: 'Mạng nhện', is_correct: false });
    await Answer.create({ question_id: aiq3.id, content: 'Hệ thống vi mạch', is_correct: false });
    await Answer.create({ question_id: aiq3.id, content: 'Cấu trúc bộ não sinh học', is_correct: true });
    
    const aiq4 = await Question.create({ quiz_id: quizAi.id, content: 'Xử lý ngôn ngữ tự nhiên (NLP) chủ yếu giải quyết vấn đề gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq4.id, content: 'Phân tích và hiểu ngôn ngữ của con người', is_correct: true });
    await Answer.create({ question_id: aiq4.id, content: 'Xử lý hình ảnh 3D', is_correct: false });
    await Answer.create({ question_id: aiq4.id, content: 'Bảo mật dữ liệu', is_correct: false });
    
    const aiq5 = await Question.create({ quiz_id: quizAi.id, content: 'Ứng dụng nào sau đây thuộc về Thị giác máy tính (Computer Vision)?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq5.id, content: 'Dịch thuật tự động', is_correct: false });
    await Answer.create({ question_id: aiq5.id, content: 'Nhận diện khuôn mặt', is_correct: true });
    await Answer.create({ question_id: aiq5.id, content: 'Trợ lý ảo bằng giọng nói', is_correct: false });
    
    const aiq6 = await Question.create({ quiz_id: quizAi.id, content: 'Generative AI (AI Tạo sinh) có khả năng gì nổi bật?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq6.id, content: 'Chỉ phân tích dữ liệu có sẵn', is_correct: false });
    await Answer.create({ question_id: aiq6.id, content: 'Lưu trữ thông tin an toàn', is_correct: false });
    await Answer.create({ question_id: aiq6.id, content: 'Tạo ra nội dung mới (văn bản, hình ảnh) từ dữ liệu học được', is_correct: true });
    
    const aiq7 = await Question.create({ quiz_id: quizAi.id, content: 'Thuật ngữ "Deep Learning" thường gắn liền với mô hình nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq7.id, content: 'Mạng nơ-ron nhiều lớp (Deep Neural Networks)', is_correct: true });
    await Answer.create({ question_id: aiq7.id, content: 'Cây quyết định (Decision Trees)', is_correct: false });
    await Answer.create({ question_id: aiq7.id, content: 'Máy vector hỗ trợ (SVM)', is_correct: false });
    
    const aiq8 = await Question.create({ quiz_id: quizAi.id, content: 'Dữ liệu được dùng để huấn luyện mô hình học máy gọi là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq8.id, content: 'Training Data', is_correct: true });
    await Answer.create({ question_id: aiq8.id, content: 'Testing Data', is_correct: false });
    await Answer.create({ question_id: aiq8.id, content: 'Garbage Data', is_correct: false });
    
    const aiq9 = await Question.create({ quiz_id: quizAi.id, content: 'Chatbot như ChatGPT sử dụng công nghệ cốt lõi nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq9.id, content: 'Xử lý ảnh', is_correct: false });
    await Answer.create({ question_id: aiq9.id, content: 'Large Language Models (LLMs)', is_correct: true });
    await Answer.create({ question_id: aiq9.id, content: 'Blockchain', is_correct: false });
    
    const aiq10 = await Question.create({ quiz_id: quizAi.id, content: 'Overfitting trong Machine Learning là hiện tượng gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: aiq10.id, content: 'Mô hình học quá tốt trên tập huấn luyện nhưng kém trên dữ liệu mới', is_correct: true });
    await Answer.create({ question_id: aiq10.id, content: 'Mô hình dự đoán sai hoàn toàn ngay từ đầu', is_correct: false });
    await Answer.create({ question_id: aiq10.id, content: 'Mô hình huấn luyện nhanh hơn bình thường', is_correct: false });

    // Phân tích dữ liệu với Python (DATA101)
    const courseData101Id = courseMap['DATA101'];
    
    // Bài 1
    const data1 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 1: Python cơ bản', title: '[Video] Cài đặt & Cú pháp (Mosh - 1080p)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', duration: '12:00', order_index: 1 });
    const data2 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 1: Python cơ bản', title: '[Tài liệu] Bài giảng 1: Python cơ bản', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_1.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    const data3 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 2: Các kiểu dữ liệu cốt lõi', title: '[Video] Lists, Dictionaries (freeCodeCamp - 1080p)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '15:30', order_index: 3 });
    const data4 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 2: Các kiểu dữ liệu cốt lõi', title: '[Tài liệu] Bài giảng 2: Các kiểu dữ liệu', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_2.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    const data5 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 3: Numpy - Ma trận & Mảng', title: '[Video] Numpy Tutorial (freeCodeCamp - HQ)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=WGJJIrtnfpk', duration: '20:45', order_index: 5 });
    const data6 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 3: Numpy - Ma trận & Mảng', title: '[Tài liệu] Bài giảng 3: Numpy - Ma trận & Mảng', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_3.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    const data7 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 4: Pandas - Xử lý dữ liệu bảng', title: '[Video] Pandas Data Analysis (freeCodeCamp - HQ)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: '18:10', order_index: 7 });
    const data8 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 4: Pandas - Xử lý dữ liệu bảng', title: '[Tài liệu] Bài giảng 4: Pandas - Xử lý dữ liệu bảng', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_4.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    const data9 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 5: Matplotlib - Vẽ đồ thị', title: '[Video] Matplotlib (Corey Schafer - 1080p)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=3xcO22k3C2A', duration: '16:25', order_index: 9 });
    const data10 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 5: Matplotlib - Vẽ đồ thị', title: '[Tài liệu] Bài giảng 5: Matplotlib - Vẽ đồ thị', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_5.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    const data11 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 6: Data Analysis Thực chiến (EDA)', title: '[Video] Data Analysis Project (freeCodeCamp)', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', duration: '22:15', order_index: 11 });
    const data12 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài giảng 6: Data Analysis Thực chiến (EDA)', title: '[Tài liệu] Bài giảng 6: Khám phá dữ liệu (EDA)', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/data_lesson_6.pdf', duration: 'PDF', order_index: 12 });
    
    // Quiz DATA101
    const quizData = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const data13 = await Lesson.create({ course_id: courseData101Id, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Kiểm tra kiến thức Data Analysis', lesson_type: 'quiz', content_url: quizData.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quizData.lesson_id = data13.id;
    await quizData.save();
    
    // Quiz questions for DATA101
    const dq1 = await Question.create({ quiz_id: quizData.id, content: 'Thư viện nào trong Python thường được sử dụng nhiều nhất để tính toán các mảng và ma trận nhiều chiều?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq1.id, content: 'Matplotlib', is_correct: false });
    await Answer.create({ question_id: dq1.id, content: 'NumPy', is_correct: true });
    await Answer.create({ question_id: dq1.id, content: 'Flask', is_correct: false });
    
    const dq2 = await Question.create({ quiz_id: quizData.id, content: 'Cấu trúc dữ liệu chính trong thư viện Pandas dùng để lưu trữ dữ liệu dạng bảng 2 chiều được gọi là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq2.id, content: 'Series', is_correct: false });
    await Answer.create({ question_id: dq2.id, content: 'DataFrame', is_correct: true });
    await Answer.create({ question_id: dq2.id, content: 'Array', is_correct: false });
    
    const dq3 = await Question.create({ quiz_id: quizData.id, content: 'Phương thức nào của Pandas DataFrame dùng để xem 5 dòng đầu tiên của dữ liệu?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq3.id, content: '.head()', is_correct: true });
    await Answer.create({ question_id: dq3.id, content: '.top()', is_correct: false });
    await Answer.create({ question_id: dq3.id, content: '.first()', is_correct: false });
    
    const dq4 = await Question.create({ quiz_id: quizData.id, content: 'Thư viện nào sau đây chủ yếu được sử dụng để trực quan hóa dữ liệu cơ bản (vẽ biểu đồ)?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq4.id, content: 'SciPy', is_correct: false });
    await Answer.create({ question_id: dq4.id, content: 'Matplotlib', is_correct: true });
    await Answer.create({ question_id: dq4.id, content: 'TensorFlow', is_correct: false });
    
    const dq5 = await Question.create({ quiz_id: quizData.id, content: 'Hàm nào trong pandas dùng để đọc dữ liệu từ một file CSV?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq5.id, content: 'read_csv()', is_correct: true });
    await Answer.create({ question_id: dq5.id, content: 'open_csv()', is_correct: false });
    await Answer.create({ question_id: dq5.id, content: 'load_csv()', is_correct: false });
    
    const dq6 = await Question.create({ quiz_id: quizData.id, content: 'Thư viện Seaborn được xây dựng dựa trên thư viện nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq6.id, content: 'Plotly', is_correct: false });
    await Answer.create({ question_id: dq6.id, content: 'Bokeh', is_correct: false });
    await Answer.create({ question_id: dq6.id, content: 'Matplotlib', is_correct: true });
    
    const dq7 = await Question.create({ quiz_id: quizData.id, content: 'Quá trình Khám phá dữ liệu (EDA) có mục đích chính là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq7.id, content: 'Hiểu cấu trúc, đặc điểm dữ liệu và tìm ra các pattern', is_correct: true });
    await Answer.create({ question_id: dq7.id, content: 'Triển khai mô hình AI lên server', is_correct: false });
    await Answer.create({ question_id: dq7.id, content: 'Lưu trữ dữ liệu vào Database', is_correct: false });
    
    const dq8 = await Question.create({ quiz_id: quizData.id, content: 'Phương thức nào trong pandas DataFrame dùng để loại bỏ các giá trị bị thiếu (NaN)?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq8.id, content: '.dropna()', is_correct: true });
    await Answer.create({ question_id: dq8.id, content: '.remove_null()', is_correct: false });
    await Answer.create({ question_id: dq8.id, content: '.clear()', is_correct: false });
    
    const dq9 = await Question.create({ quiz_id: quizData.id, content: 'Đâu là cách import thư viện pandas đúng và phổ biến nhất?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq9.id, content: 'import pandas', is_correct: false });
    await Answer.create({ question_id: dq9.id, content: 'import pandas as pd', is_correct: true });
    await Answer.create({ question_id: dq9.id, content: 'include pandas', is_correct: false });
    
    const dq10 = await Question.create({ quiz_id: quizData.id, content: 'Biểu đồ dạng Histogram thường được dùng để thể hiện điều gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: dq10.id, content: 'Mối quan hệ giữa 2 biến', is_correct: false });
    await Answer.create({ question_id: dq10.id, content: 'Sự phân bố (distribution) của một biến liên tục', is_correct: true });
    await Answer.create({ question_id: dq10.id, content: 'Thay đổi theo thời gian', is_correct: false });

    // UIUX101 - Làm chủ Figma trong 7 ngày
    const courseUiuxId = courseMap['UIUX101'];
    
    // Bài 1
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 1: Tổng quan Figma', title: '[Video] Figma Tutorial for Beginners', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', duration: '45:00', order_index: 1 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 1: Tổng quan Figma', title: '[Slide] Tổng quan Figma', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_1.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 2: Frame & Constraints', title: '[Video] Khái niệm cơ bản', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=JW0V250yqA4', duration: '20:10', order_index: 3 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 2: Frame & Constraints', title: '[Slide] Kỹ thuật Constraints', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_2.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 3: Auto Layout', title: '[Video] Figma Auto Layout', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=3q3nVcGzMcY', duration: '35:20', order_index: 5 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 3: Auto Layout', title: '[Slide] Làm chủ Auto Layout', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_3.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 4: Components & Variants', title: '[Video] Component Library', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=k74GzMIqFQI', duration: '28:15', order_index: 7 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 4: Components & Variants', title: '[Slide] Component & Variants', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_4.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 5: Prototyping', title: '[Video] Figma Prototyping', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=zLfd6S5NnHM', duration: '22:45', order_index: 9 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 5: Prototyping', title: '[Slide] Animation trong Figma', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_5.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 6: Design System', title: '[Video] Xây dựng Design System', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=d3zGikX-VwM', duration: '30:00', order_index: 11 });
    await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài giảng 6: Design System', title: '[Slide] Design System & Handoff', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/uiux_lesson_6.pdf', duration: 'PDF', order_index: 12 });

    // Quiz UIUX101
    const quizUiux = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const uqLesson = await Lesson.create({ course_id: courseUiuxId, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Kiểm tra Figma', lesson_type: 'quiz', content_url: quizUiux.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quizUiux.lesson_id = uqLesson.id;
    await quizUiux.save();

    // 10 Quiz Questions
    const uq1 = await Question.create({ quiz_id: quizUiux.id, content: 'Tính năng nào của Figma giúp tự động căn lề và co giãn khung chứa nội dung?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq1.id, content: 'Auto Layout', is_correct: true });
    await Answer.create({ question_id: uq1.id, content: 'Group', is_correct: false });
    await Answer.create({ question_id: uq1.id, content: 'Mask', is_correct: false });

    const uq2 = await Question.create({ quiz_id: quizUiux.id, content: 'Phím tắt để tạo Frame trong Figma là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq2.id, content: 'A', is_correct: false });
    await Answer.create({ question_id: uq2.id, content: 'F', is_correct: true });
    await Answer.create({ question_id: uq2.id, content: 'R', is_correct: false });

    const uq3 = await Question.create({ quiz_id: quizUiux.id, content: 'Component trong Figma dùng để làm gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq3.id, content: 'Xuất file ảnh nhanh hơn', is_correct: false });
    await Answer.create({ question_id: uq3.id, content: 'Tạo đối tượng có thể tái sử dụng', is_correct: true });
    await Answer.create({ question_id: uq3.id, content: 'Tạo mã code HTML tự động', is_correct: false });

    const uq4 = await Question.create({ quiz_id: quizUiux.id, content: 'Variants được sử dụng khi nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq4.id, content: 'Gộp nhiều component có trạng thái khác nhau (hover, active)', is_correct: true });
    await Answer.create({ question_id: uq4.id, content: 'Chuyển đổi màu sắc hình ảnh', is_correct: false });
    await Answer.create({ question_id: uq4.id, content: 'Thay đổi font chữ mặc định', is_correct: false });

    const uq5 = await Question.create({ quiz_id: quizUiux.id, content: 'Tab Prototype dùng để làm gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq5.id, content: 'Thiết kế giao diện 3D', is_correct: false });
    await Answer.create({ question_id: uq5.id, content: 'Tạo hiệu ứng chuyển đổi giữa các màn hình', is_correct: true });
    await Answer.create({ question_id: uq5.id, content: 'Viết code JavaScript', is_correct: false });

    const uq6 = await Question.create({ quiz_id: quizUiux.id, content: 'Thuộc tính "Hug contents" trong Auto Layout có ý nghĩa gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq6.id, content: 'Khung sẽ ôm sát vào kích thước nội dung bên trong', is_correct: true });
    await Answer.create({ question_id: uq6.id, content: 'Xóa toàn bộ padding', is_correct: false });
    await Answer.create({ question_id: uq6.id, content: 'Nội dung luôn ở chính giữa', is_correct: false });

    const uq7 = await Question.create({ quiz_id: quizUiux.id, content: 'Hiệu ứng "Smart Animate" hoạt động dựa trên yếu tố nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq7.id, content: 'Sự trùng khớp tên Layer giữa hai màn hình', is_correct: true });
    await Answer.create({ question_id: uq7.id, content: 'Thứ tự vị trí của các Layer', is_correct: false });
    await Answer.create({ question_id: uq7.id, content: 'Kích thước màn hình cố định', is_correct: false });

    const uq8 = await Question.create({ quiz_id: quizUiux.id, content: 'Figma hỗ trợ Handoff (bàn giao) cho Developer tốt nhất qua tính năng nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq8.id, content: 'Dev Mode / Inspect', is_correct: true });
    await Answer.create({ question_id: uq8.id, content: 'Xuất file ZIP', is_correct: false });
    await Answer.create({ question_id: uq8.id, content: 'Nhắn tin qua Slack', is_correct: false });

    const uq9 = await Question.create({ quiz_id: quizUiux.id, content: 'Làm thế nào để chia sẻ quyền chỉ xem (View-only) trong Figma?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq9.id, content: 'Nút Share > Chọn "Anyone with the link can view"', is_correct: true });
    await Answer.create({ question_id: uq9.id, content: 'Xuất ra file PDF', is_correct: false });
    await Answer.create({ question_id: uq9.id, content: 'Đổi pass tài khoản', is_correct: false });

    const uq10 = await Question.create({ quiz_id: quizUiux.id, content: 'Tại sao cần thiết lập Constraints?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: uq10.id, content: 'Để xuất mã màu chính xác', is_correct: false });
    await Answer.create({ question_id: uq10.id, content: 'Giúp giao diện hiển thị đúng trên nhiều kích thước Frame (Responsive)', is_correct: true });
    await Answer.create({ question_id: uq10.id, content: 'Để giảm dung lượng ảnh', is_correct: false });

    // ENG101 - Tiếng Anh Giao tiếp Công sở
    const courseEngId = courseMap['ENG101'];
    
    // Bài 1
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 1: Chào hỏi & Giới thiệu', title: '[Video] Business English Greetings', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=I-DiPTWUxyg', duration: '12:00', order_index: 1 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 1: Chào hỏi & Giới thiệu', title: '[Slide] Chào hỏi & Giới thiệu', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_1.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 2: Kỹ năng viết Email', title: '[Video] How to write professional emails', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=cZSrZOCZiuc', duration: '18:30', order_index: 3 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 2: Kỹ năng viết Email', title: '[Slide] Kỹ năng Viết Email', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_2.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 3: Tiếng Anh trong cuộc họp', title: '[Video] English in Meetings', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=TJhCKf_qrWI', duration: '20:15', order_index: 5 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 3: Tiếng Anh trong cuộc họp', title: '[Slide] Tiếng Anh Cuộc họp', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_3.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 4: Kỹ năng Thuyết trình', title: '[Video] Presentation Skills', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=TTuFD2f1JYg', duration: '15:45', order_index: 7 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 4: Kỹ năng Thuyết trình', title: '[Slide] Kỹ năng Thuyết trình', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_4.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 5: Đàm phán', title: '[Video] English for Negotiation', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=dsA_Cq40f1Y', duration: '22:10', order_index: 9 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 5: Đàm phán', title: '[Slide] Tiếng Anh Đàm phán', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_5.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 6: Giao tiếp qua điện thoại', title: '[Video] Telephone English', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=T2hOSdvaiRk', duration: '14:20', order_index: 11 });
    await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài giảng 6: Giao tiếp qua điện thoại', title: '[Slide] Giao tiếp Điện thoại', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/eng101_lesson_6.pdf', duration: 'PDF', order_index: 12 });

    // Quiz ENG101
    const quizEng = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const eqLesson = await Lesson.create({ course_id: courseEngId, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Tiếng Anh Công sở', lesson_type: 'quiz', content_url: quizEng.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quizEng.lesson_id = eqLesson.id;
    await quizEng.save();

    // 10 Quiz Questions
    const eq1 = await Question.create({ quiz_id: quizEng.id, content: 'Đâu là cách chào hỏi lịch sự nhất với một đối tác nam bạn mới gặp lần đầu?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq1.id, content: 'Hi bro!', is_correct: false });
    await Answer.create({ question_id: eq1.id, content: 'Good morning, Mr. [Name].', is_correct: true });
    await Answer.create({ question_id: eq1.id, content: 'What’s up?', is_correct: false });

    const eq2 = await Question.create({ quiz_id: quizEng.id, content: 'Cấu trúc nào sau đây phù hợp nhất để mở đầu một email công việc?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq2.id, content: 'I am writing to inquire about...', is_correct: true });
    await Answer.create({ question_id: eq2.id, content: 'I want to ask you...', is_correct: false });
    await Answer.create({ question_id: eq2.id, content: 'Hey listen,', is_correct: false });

    const eq3 = await Question.create({ quiz_id: quizEng.id, content: 'Khi đính kèm một file trong email, bạn nên dùng câu nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq3.id, content: 'Here is the file.', is_correct: false });
    await Answer.create({ question_id: eq3.id, content: 'Please find attached the document.', is_correct: true });
    await Answer.create({ question_id: eq3.id, content: 'Look at the file.', is_correct: false });

    const eq4 = await Question.create({ quiz_id: quizEng.id, content: 'Để nêu mục đích cuộc họp, Chủ tọa (Chairperson) nên nói câu nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq4.id, content: 'The main purpose of today’s meeting is to...', is_correct: true });
    await Answer.create({ question_id: eq4.id, content: 'We are here because I want to...', is_correct: false });
    await Answer.create({ question_id: eq4.id, content: 'Let’s talk about something.', is_correct: false });

    const eq5 = await Question.create({ quiz_id: quizEng.id, content: 'Làm thế nào để phản đối một ý kiến trong cuộc họp một cách lịch sự?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq5.id, content: 'You are wrong.', is_correct: false });
    await Answer.create({ question_id: eq5.id, content: 'I completely disagree.', is_correct: false });
    await Answer.create({ question_id: eq5.id, content: 'I see your point, but I’m afraid I have to disagree.', is_correct: true });

    const eq6 = await Question.create({ quiz_id: quizEng.id, content: 'Chức năng "CC" trong email dùng để làm gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq6.id, content: 'Gửi cho người không cần phải xử lý chính nhưng cần biết thông tin.', is_correct: true });
    await Answer.create({ question_id: eq6.id, content: 'Gửi thư ẩn danh.', is_correct: false });
    await Answer.create({ question_id: eq6.id, content: 'Đánh dấu thư rác.', is_correct: false });

    const eq7 = await Question.create({ quiz_id: quizEng.id, content: 'Trong thuyết trình, kỹ năng "Signposting" có nghĩa là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq7.id, content: 'Dùng biển báo giao thông trên slide.', is_correct: false });
    await Answer.create({ question_id: eq7.id, content: 'Sử dụng từ ngữ để dẫn dắt, báo hiệu cấu trúc bài nói cho khán giả.', is_correct: true });
    await Answer.create({ question_id: eq7.id, content: 'Chỉ tay vào màn hình.', is_correct: false });

    const eq8 = await Question.create({ quiz_id: quizEng.id, content: 'Câu nào sau đây phù hợp để đưa ra đề nghị trong đàm phán?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq8.id, content: 'You must give us a discount.', is_correct: false });
    await Answer.create({ question_id: eq8.id, content: 'If you can reduce the price by 5%, we will increase our order.', is_correct: true });
    await Answer.create({ question_id: eq8.id, content: 'Lower the price or we leave.', is_correct: false });

    const eq9 = await Question.create({ quiz_id: quizEng.id, content: 'Khi nghe điện thoại công ty, cách xưng hô nào là chuyên nghiệp nhất?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq9.id, content: 'Hello, who is this?', is_correct: false });
    await Answer.create({ question_id: eq9.id, content: 'ABC Corporation, this is John speaking, how may I help you?', is_correct: true });
    await Answer.create({ question_id: eq9.id, content: 'Yes, what do you want?', is_correct: false });

    const eq10 = await Question.create({ quiz_id: quizEng.id, content: 'Trong cuộc gọi Video (Zoom/Teams), nếu mạng của đối tác bị giật, bạn nên nói gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: eq10.id, content: 'Your internet is bad.', is_correct: false });
    await Answer.create({ question_id: eq10.id, content: 'You are breaking up a bit. Could you repeat that?', is_correct: true });
    await Answer.create({ question_id: eq10.id, content: 'I can’t hear anything, bye.', is_correct: false });

    // MKT101 - Digital Marketing Thực chiến
    const courseMktId = courseMap['MKT101'];
    
    // Bài 1
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 1: Tổng quan', title: '[Video] Digital Marketing Overview', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=jVgYgN0zcWs', duration: '14:20', order_index: 1 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 1: Tổng quan', title: '[Slide] Tổng quan Digital Marketing', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_1.pdf', duration: 'PDF', order_index: 2 });
    
    // Bài 2
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 2: SEO', title: '[Video] SEO cho người mới bắt đầu', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=CH-d3mmXJd4', duration: '22:15', order_index: 3 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 2: SEO', title: '[Slide] SEO Thực chiến', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_2.pdf', duration: 'PDF', order_index: 4 });
    
    // Bài 3
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 3: Content', title: '[Video] Content Marketing Strategies', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=CBUF5V4iNgU', duration: '18:50', order_index: 5 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 3: Content', title: '[Slide] Content & Copywriting', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_3.pdf', duration: 'PDF', order_index: 6 });
    
    // Bài 4
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 4: Social Media', title: '[Video] Social Media Marketing', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=h95cQkEWBx0', duration: '25:30', order_index: 7 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 4: Social Media', title: '[Slide] Tiếp thị Mạng xã hội', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_4.pdf', duration: 'PDF', order_index: 8 });
    
    // Bài 5
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 5: Chạy Quảng cáo', title: '[Video] Facebook & Google Ads', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=nkNHn0VqVBA', duration: '30:10', order_index: 9 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 5: Chạy Quảng cáo', title: '[Slide] Facebook & Google Ads', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_5.pdf', duration: 'PDF', order_index: 10 });
    
    // Bài 6
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 6: Đo lường', title: '[Video] Phân tích dữ liệu với GA4', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=KQgvjoI_SFY', duration: '19:40', order_index: 11 });
    await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài giảng 6: Đo lường', title: '[Slide] Google Analytics & Tracking', lesson_type: 'document', content_url: 'http://localhost:5000/uploads/documents/mkt101_lesson_6.pdf', duration: 'PDF', order_index: 12 });

    // Quiz MKT101
    const quizMkt = await Quiz.create({ lesson_id: 1, time_limit: 15, total_marks: 10 }); 
    const mqLesson = await Lesson.create({ course_id: courseMktId, class_id: null, section_title: 'Bài tập cuối khóa', title: 'Quiz: Digital Marketing Thực chiến', lesson_type: 'quiz', content_url: quizMkt.id.toString(), duration: '10 câu - 15 phút', order_index: 13 });
    quizMkt.lesson_id = mqLesson.id;
    await quizMkt.save();

    // 10 Quiz Questions
    const mq1 = await Question.create({ quiz_id: quizMkt.id, content: 'Đặc điểm nào sau đây KHÔNG phải là ưu điểm của Digital Marketing so với truyền thống?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq1.id, content: 'Dễ dàng đo lường hiệu quả (Tracking).', is_correct: false });
    await Answer.create({ question_id: mq1.id, content: 'Tương tác hai chiều với khách hàng.', is_correct: false });
    await Answer.create({ question_id: mq1.id, content: 'Chi phí luôn đắt đỏ hơn báo giấy và Tivi.', is_correct: true });

    const mq2 = await Question.create({ quiz_id: quizMkt.id, content: 'Hành trình khách hàng (Customer Journey) cơ bản bao gồm các bước nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq2.id, content: 'Mua hàng -> Xem Ads -> Đánh giá.', is_correct: false });
    await Answer.create({ question_id: mq2.id, content: 'Nhận thức -> Cân nhắc -> Quyết định -> Trung thành.', is_correct: true });
    await Answer.create({ question_id: mq2.id, content: 'Tìm kiếm -> Thêm vào giỏ -> Hủy đơn.', is_correct: false });

    const mq3 = await Question.create({ quiz_id: quizMkt.id, content: 'Trong SEO, yếu tố nào sau đây là quan trọng nhất đối với On-page SEO?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq3.id, content: 'Số lượng Backlink từ các diễn đàn.', is_correct: false });
    await Answer.create({ question_id: mq3.id, content: 'Tối ưu hóa Thẻ Heading (H1, H2) và Từ khóa trong Nội dung.', is_correct: true });
    await Answer.create({ question_id: mq3.id, content: 'Số lượng like trên bài post Facebook.', is_correct: false });

    const mq4 = await Question.create({ quiz_id: quizMkt.id, content: 'Công thức Copywriting PAS viết tắt của từ gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq4.id, content: 'Problem - Agitate - Solution', is_correct: true });
    await Answer.create({ question_id: mq4.id, content: 'Product - Action - Sales', is_correct: false });
    await Answer.create({ question_id: mq4.id, content: 'Price - Advertising - System', is_correct: false });

    const mq5 = await Question.create({ quiz_id: quizMkt.id, content: 'Quy tắc 80/20 trong việc xây dựng Nội dung trên Fanpage nghĩa là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq5.id, content: '80% bài đăng bán hàng, 20% bài chia sẻ kiến thức.', is_correct: false });
    await Answer.create({ question_id: mq5.id, content: '80% bài chia sẻ giá trị/giải trí, 20% bài bán hàng.', is_correct: true });
    await Answer.create({ question_id: mq5.id, content: 'Chỉ đăng bài lúc 8 giờ và 20 giờ.', is_correct: false });

    const mq6 = await Question.create({ quiz_id: quizMkt.id, content: 'Thuật toán For You Page (FYP) của TikTok phân phối video chủ yếu dựa trên yếu tố nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq6.id, content: 'Số lượng bạn bè của người dùng.', is_correct: false });
    await Answer.create({ question_id: mq6.id, content: 'Đồ thị sở thích (Interest Graph) thông qua hành vi xem video.', is_correct: true });
    await Answer.create({ question_id: mq6.id, content: 'Chỉ phân phối cho những ai đã bấm Follow.', is_correct: false });

    const mq7 = await Question.create({ quiz_id: quizMkt.id, content: 'Lookalike Audience trong Facebook Ads là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq7.id, content: 'Tệp khách hàng có đặc điểm, hành vi tương đồng với tệp khách hàng gốc của bạn.', is_correct: true });
    await Answer.create({ question_id: mq7.id, content: 'Tệp những người không bao giờ mua hàng.', is_correct: false });
    await Answer.create({ question_id: mq7.id, content: 'Tệp danh sách email thu thập từ website khác.', is_correct: false });

    const mq8 = await Question.create({ quiz_id: quizMkt.id, content: 'Chỉ số ROAS (Return on Ad Spend) được tính như thế nào?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq8.id, content: 'Doanh thu / Chi phí quảng cáo.', is_correct: true });
    await Answer.create({ question_id: mq8.id, content: 'Số lượng Click / Số lượt hiển thị.', is_correct: false });
    await Answer.create({ question_id: mq8.id, content: 'Lợi nhuận / Vốn nhập hàng.', is_correct: false });

    const mq9 = await Question.create({ quiz_id: quizMkt.id, content: 'Sự thay đổi lớn nhất của Google Analytics 4 (GA4) so với phiên bản cũ là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq9.id, content: 'Đo lường dựa trên Sự kiện (Event-based) thay vì Phiên (Session).', is_correct: true });
    await Answer.create({ question_id: mq9.id, content: 'Chỉ theo dõi được người dùng trên máy tính.', is_correct: false });
    await Answer.create({ question_id: mq9.id, content: 'Bắt buộc phải trả phí hàng tháng.', is_correct: false });

    const mq10 = await Question.create({ quiz_id: quizMkt.id, content: 'Mục đích chính của UTM Tracking là gì?', question_type: 'single_choice', marks: 1 });
    await Answer.create({ question_id: mq10.id, content: 'Để giảm chi phí quảng cáo Facebook.', is_correct: false });
    await Answer.create({ question_id: mq10.id, content: 'Để theo dõi chính xác nguồn gốc chiến dịch (Source, Medium, Campaign) trên GA4.', is_correct: true });
    await Answer.create({ question_id: mq10.id, content: 'Để thiết kế lại giao diện website.', is_correct: false });


    // 1 supplementary lesson ONLY for classIt306 (which is WEB101 class)
    const l12 = await Lesson.create({ course_id: null, class_id: classIt306.id, section_title: 'Bonus Content', title: '[Bonus] Luyện tập React Hooks với dự án thực tế', lesson_type: 'video', content_url: 'https://www.youtube.com/watch?v=Rh3tobg7hEo', duration: '45:00', order_index: 12 });

    // Progress for student & leminhphan

    for (const st of [student, leminhphan]) {
      await LessonProgress.create({ student_id: st.id, lesson_id: l1.id, is_completed: true });
      await LessonProgress.create({ student_id: st.id, lesson_id: l2.id, is_completed: true });
      await LessonProgress.create({ student_id: st.id, lesson_id: l3.id, is_completed: true });
    }
    
    console.log('Created lessons & quizzes.');

    // 7. Create Assignments & Submissions
    const assignment1 = await Assignment.create({
      class_id: classIt306.id,
      title: 'Bài tập tuần 1: Cấu trúc HTML cơ bản',
      description: 'Sinh viên nén file .zip và nộp trước thứ 6.',
      due_date: new Date('2026-08-25T23:59:59'),
    });

    for (const st of [student, leminhphan]) {
      await Submission.create({
        assignment_id: assignment1.id,
        student_id: st.id,
        file_url: '/uploads/student_b_hw1.zip',
        score: 9.0,
        feedback: 'Bài làm tốt, cấu trúc rõ ràng.',
      });
    }
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
    for (const st of [student, leminhphan]) {
      await TuitionFee.create({
        student_id: st.id,
        semester_id: currentSemester.id,
        total_amount: 8500000,
        status: 'unpaid',
      });
    }
    console.log('Created tuition fees.');

    // 10. Create Notifications
    for (const st of [student, leminhphan]) {
      await Notification.create({
        user_id: st.id,
        title: 'Nhắc nhở đóng học phí',
        content: 'Bạn vui lòng thanh toán học phí HK1-2026 trước ngày 30/09/2026.',
        is_read: false,
      });
    }
    console.log('Created notifications.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
