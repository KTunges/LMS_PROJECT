const { sequelize, User, Category, Material } = require('./src/models');
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

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Create or get an admin user
    let admin = await User.findOne({ where: { email: 'admin@lms.edu.vn' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      admin = await User.create({
        full_name: 'Quản trị viên Hệ thống',
        email: 'admin@lms.edu.vn',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Created admin user.');
    }

    // 2. Clear old materials and categories
    await Material.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // 3. Create Categories
    const subjects = [...new Set(mockMaterials.map(m => m.subject))];
    const categoryMap = {};
    for (const sub of subjects) {
      const cat = await Category.create({ name: sub, description: `Môn học ${sub}` });
      categoryMap[sub] = cat.id;
    }
    console.log('Created categories.');

    // 4. Create Materials
    for (const mat of mockMaterials) {
      await Material.create({
        title: mat.title,
        description: 'Tài liệu tham khảo dành cho sinh viên.',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // dummy url
        file_type: mat.type,
        file_size: mat.size,
        category_id: categoryMap[mat.subject],
        user_id: admin.id,
        status: 'active'
      });
    }
    console.log('Created mock materials successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
