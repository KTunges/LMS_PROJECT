const bcrypt = require('bcryptjs');
const {
  sequelize, User, Category, Material, Course, Class, Enrollment, Grade, Semester, Major, Curriculum, ExamSchedule,
} = require('./src/models');

async function seedData() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    const passwordHash = await bcrypt.hash('password123', 10);

    // Xóa bớt dữ liệu rác (giữ lại User gốc)
    await Grade.destroy({ where: {} });
    await Enrollment.destroy({ where: {} });
    await ExamSchedule.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Curriculum.destroy({ where: {} });
    await Course.destroy({ where: {} });
    await Material.destroy({ where: {} });
    
    // Xóa user giả của đợt trước nếu có
    const users = await User.findAll();
    const keepUserIds = users.filter(u => ['student@example.com', 'teacher@example.com', 'admin@example.com'].includes(u.email)).map(u => u.id);
    await User.destroy({ where: { id: { [require('sequelize').Op.notIn]: keepUserIds } } });

    console.log('Seeding Majors...');
    const majorsList = [
      { code: 'CNTT2', name: 'Công nghệ thông tin' },
      { code: 'QTTK2', name: 'Quản trị kinh doanh' },
    ];
    for (let m of majorsList) await Major.upsert(m);
    const majors = await Major.findAll();

    console.log('Seeding Semesters...');
    const sems = [
      { name: 'HK1 - 2026', start_date: '2026-01-01', end_date: '2026-05-31' },
      { name: 'HK2 - 2026', start_date: '2026-08-01', end_date: '2026-12-31' },
    ];
    for (let s of sems) {
       const [sem] = await Semester.findOrCreate({ where: { name: s.name }, defaults: s });
    }
    const semesters = await Semester.findAll();

    console.log('Seeding Categories...');
    const cats = [
      { name: 'Lập trình Web' },
      { name: 'Trí tuệ nhân tạo (AI)' },
      { name: 'Ngoại ngữ' },
    ];
    for (let c of cats) await Category.findOrCreate({ where: { name: c.name } });
    const categories = await Category.findAll();

    console.log('Seeding Users (Students & Teachers)...');
    const studentsData = [];
    for (let i = 1; i <= 20; i++) {
      studentsData.push({
        full_name: `Sinh viên ${i}`, email: `student${i}@test.com`, password: passwordHash,
        role: 'student', phone: `0900000${i.toString().padStart(3, '0')}`,
        code: `SV2026${i.toString().padStart(3, '0')}`,
        major_id: majors[Math.floor(Math.random() * majors.length)].id,
        is_verified: true,
      });
    }
    const teachersData = [];
    for (let i = 1; i <= 5; i++) {
      teachersData.push({
        full_name: `Giảng viên ${i}`, email: `teacher${i}@test.com`, password: passwordHash,
        role: 'teacher', phone: `0910000${i.toString().padStart(3, '0')}`,
        code: `GV2026${i.toString().padStart(3, '0')}`, is_verified: true,
      });
    }
    await User.bulkCreate(studentsData);
    await User.bulkCreate(teachersData);
    
    const students = await User.findAll({ where: { role: 'student' } });
    const teachers = await User.findAll({ where: { role: 'teacher' } });

    console.log('Seeding Courses & Classes...');
    const coursesData = [];
    for (let i = 1; i <= 20; i++) {
        coursesData.push({
            name: `Khóa học môn học ${i}`, code: `COURSE${i}`, price: 0, level: 'Cơ bản',
            category_id: categories[Math.floor(Math.random() * categories.length)].id
        });
    }
    const courses = await Course.bulkCreate(coursesData, { returning: true });

    const classesData = [];
    courses.forEach((course) => {
      for (let i = 1; i <= 2; i++) {
        classesData.push({
          course_id: course.id,
          teacher_id: teachers[Math.floor(Math.random() * teachers.length)].id,
          semester_id: semesters[Math.floor(Math.random() * semesters.length)].id,
          room: `Phòng ${Math.floor(Math.random() * 500) + 100}`,
          schedule_time: `Thứ ${Math.floor(Math.random() * 6) + 2}, 0${Math.floor(Math.random() * 2) + 7}:00 - 10:00`,
          max_students: 40, status: 'active',
        });
      }
    });
    const classes = await Class.bulkCreate(classesData, { returning: true });

    console.log('Seeding Enrollments & Grades...');
    const enrollmentsData = [];
    students.forEach((student) => {
      const numEnrollments = 5;
      const enrolledClasses = classes.sort(() => 0.5 - Math.random()).slice(0, numEnrollments);
      enrolledClasses.forEach((cls) => {
        enrollmentsData.push({
          student_id: student.id, class_id: cls.id, status: 'enrolled', enrollment_date: new Date(),
        });
      });
    });
    const enrollments = await Enrollment.bulkCreate(enrollmentsData, { returning: true });

    const gradesData = enrollments.map(enr => {
        const midterm = (Math.random() * 5 + 5).toFixed(1);
        const final = (Math.random() * 5 + 5).toFixed(1);
        const overall = (midterm * 0.4 + final * 0.6).toFixed(1);
        return { enrollment_id: enr.id, midterm_score: midterm, final_score: final, overall_score: overall };
    });
    await Grade.bulkCreate(gradesData);

    console.log('Seeding Exam Schedules...');
    const examSchedulesData = classes.map(cls => ({
        class_id: cls.id, exam_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        room: `Phòng thi ${Math.floor(Math.random() * 100) + 100}`, type: 'final'
    }));
    await ExamSchedule.bulkCreate(examSchedulesData);

    console.log('Seeding Materials...');
    const materialsData = [];
    for(let i = 1; i <= 30; i++) {
        materialsData.push({
            title: `Tài liệu bài giảng số ${i}`, file_url: `/uploads/mock_file_${i}.pdf`,
            file_type: ['pdf', 'docx', 'pptx'][Math.floor(Math.random() * 3)],
            category_id: categories[Math.floor(Math.random() * categories.length)].id,
            user_id: teachers[Math.floor(Math.random() * teachers.length)].id, status: 'active'
        });
    }
    await Material.bulkCreate(materialsData);

    console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed data:', error);
    process.exit(1);
  }
}
seedData();
