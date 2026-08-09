const { 
  sequelize, User, Category, Material, Course, Class, 
  Enrollment, Grade, Semester, Assignment, Submission, 
  ExamSchedule, TuitionFee, Notification, Major, Curriculum
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
  // Semester 1
  { code: 'MA101', name: 'Giải tích 1', credits: 3, semester: 1, req: true },
  { code: 'PH101', name: 'Vật lý 1', credits: 3, semester: 1, req: true },
  { code: 'IT101', name: 'Nhập môn lập trình', credits: 3, semester: 1, req: true },
  { code: 'ML101', name: 'Triết học Mác - Lênin', credits: 3, semester: 1, req: true },
  { code: 'PE101', name: 'Giáo dục thể chất 1', credits: 1, semester: 1, req: true },
  // Semester 2
  { code: 'MA102', name: 'Giải tích 2', credits: 3, semester: 2, req: true },
  { code: 'PH102', name: 'Vật lý 2', credits: 3, semester: 2, req: true },
  { code: 'IT102', name: 'Lập trình hướng đối tượng', credits: 3, semester: 2, req: true },
  { code: 'IT103', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, semester: 2, req: true },
  // Semester 3
  { code: 'MA201', name: 'Xác suất thống kê', credits: 3, semester: 3, req: true },
  { code: 'IT307', name: 'Cơ sở Dữ liệu', credits: 4, semester: 3, req: true },
  { code: 'IT201', name: 'Kiến trúc máy tính', credits: 3, semester: 3, req: true },
  { code: 'EN101', name: 'Tiếng Anh 1', credits: 3, semester: 3, req: true },
  // Semester 4
  { code: 'IT202', name: 'Mạng máy tính', credits: 3, semester: 4, req: true },
  { code: 'IT203', name: 'Hệ điều hành', credits: 3, semester: 4, req: true },
  { code: 'IT204', name: 'Công nghệ phần mềm', credits: 3, semester: 4, req: true },
  { code: 'IT205', name: 'Lập trình Java', credits: 3, semester: 4, req: false },
  // Semester 5
  { code: 'IT306', name: 'Lập trình Web Nâng cao', credits: 3, semester: 5, req: true },
  { code: 'IT301', name: 'Phân tích thiết kế hệ thống', credits: 3, semester: 5, req: true },
  { code: 'IT308', name: 'Điện toán Đám mây', credits: 3, semester: 5, req: true },
  { code: 'IT302', name: 'Trí tuệ nhân tạo', credits: 3, semester: 5, req: true },
  // Semester 6
  { code: 'IT309', name: 'Kiểm thử Phần mềm', credits: 3, semester: 6, req: true },
  { code: 'IT303', name: 'Quản lý dự án phần mềm', credits: 3, semester: 6, req: true },
  { code: 'IT304', name: 'Lập trình thiết bị di động', credits: 3, semester: 6, req: false },
  { code: 'IT305', name: 'Thực tập chuyên ngành', credits: 2, semester: 6, req: true },
  // Semester 7
  { code: 'IT401', name: 'An toàn thông tin', credits: 3, semester: 7, req: true },
  { code: 'IT402', name: 'Phát triển phần mềm linh hoạt (Agile)', credits: 3, semester: 7, req: false },
  { code: 'IT403', name: 'Học máy (Machine Learning)', credits: 3, semester: 7, req: false },
  { code: 'IT404', name: 'Khởi nghiệp', credits: 2, semester: 7, req: true },
  // Semester 8
  { code: 'IT405', name: 'Đồ án tốt nghiệp', credits: 6, semester: 8, req: true },
  { code: 'IT406', name: 'Khai phá dữ liệu', credits: 3, semester: 8, req: false },
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
    const cat = await Category.create({ name: 'IT', description: `Danh mục các môn chuyên ngành CNTT` });
    
    for (const c of extendedCourses) {
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

    // 3.5 Create Curriculum for IT major
    for (const c of extendedCourses) {
      await Curriculum.create({ 
        major_id: majorIT.id, 
        course_id: courseMap[c.code], 
        semester_number: c.semester, 
        is_required: c.req 
      });
    }
    console.log('Created curriculums.');

    // 4. Create Classes (for some current semester courses - Semester 5 usually)
    const classIt306 = await Class.create({
      course_id: courseMap['IT306'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Phòng 203',
      schedule_time: 'Thứ 2, 08:00-10:00',
      max_students: 40,
      status: 'active'
    });
    
    const classIt307 = await Class.create({
      course_id: courseMap['IT307'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Lab B1',
      schedule_time: 'Thứ 4, 13:00-16:00',
      max_students: 40,
      status: 'active'
    });
    
    const classIt308 = await Class.create({
      course_id: courseMap['IT308'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Lab C2',
      schedule_time: 'Thứ 6, 08:00-10:00',
      max_students: 40,
      status: 'active'
    });

    const classIt309 = await Class.create({
      course_id: courseMap['IT309'],
      teacher_id: teacher.id,
      semester_id: currentSemester.id,
      room: 'Hội trường 1',
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

    await createGrade('MA101', 8.0);
    await createGrade('PH101', 7.5);
    await createGrade('IT101', 9.0);
    await createGrade('ML101', 6.5);
    await createGrade('PE101', 8.5);
    
    await createGrade('MA102', 7.0);
    await createGrade('PH102', 6.0);
    await createGrade('IT102', 8.5);
    await createGrade('IT103', 7.5);

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
