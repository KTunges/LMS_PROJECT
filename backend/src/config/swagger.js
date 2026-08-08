const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS - Hệ thống Quản lý Học liệu số (API)',
      version: '1.0.0',
      description: `
## Giới thiệu
Đây là tài liệu API cho hệ thống **LMS - Learning Management System**.

Hệ thống hỗ trợ 3 vai trò (role):
- **admin**: Quản trị viên hệ thống
- **teacher**: Giảng viên
- **student**: Sinh viên

## Xác thực (Authentication)
Hệ thống sử dụng **JWT Bearer Token**. Sau khi đăng nhập thành công, bạn sẽ nhận được một \`token\`. Hãy nhấn nút **Authorize** ở góc trên bên phải và nhập token đó để thử nghiệm các API yêu cầu đăng nhập.

## Tài khoản mẫu
| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@lms.edu.vn | 123456 |
| Giảng viên | teacher@lms.edu.vn | 123456 |
| Sinh viên | student@lms.edu.vn | 123456 |
      `,
      contact: {
        name: 'Nhóm 11',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Server Phát triển (Development)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token nhận được sau khi đăng nhập',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'student@lms.edu.vn' },
            role: { type: 'string', enum: ['admin', 'teacher', 'student'], example: 'student' },
            avatar: { type: 'string', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Material: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Giáo trình Lập trình Web' },
            description: { type: 'string', example: 'Tài liệu hướng dẫn lập trình web cơ bản' },
            file_url: { type: 'string', example: '/uploads/giao_trinh.pdf' },
            file_type: { type: 'string', example: 'PDF' },
            file_size: { type: 'integer', example: 2048000 },
            download_count: { type: 'integer', example: 42 },
            status: { type: 'string', example: 'approved' },
            category: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Công nghệ thông tin' },
              },
            },
            author: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                full_name: { type: 'string', example: 'Giảng viên Nguyễn Văn A' },
                email: { type: 'string', example: 'teacher@lms.edu.vn' },
              },
            },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'IT306' },
            name: { type: 'string', example: 'Lập trình Web Nâng cao' },
            credits: { type: 'integer', example: 4 },
            description: { type: 'string', example: 'Học phần nâng cao về lập trình web' },
            category: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Công nghệ thông tin' },
              },
            },
          },
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 3 },
            class_id: { type: 'integer', example: 1 },
            enrollment_date: { type: 'string', format: 'date' },
            status: { type: 'string', example: 'enrolled' },
            class: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                semester: { type: 'string', example: 'HK1-2026' },
                room: { type: 'string', example: 'A1-201' },
                schedule_time: { type: 'string', example: 'Thứ 2, 08:00-10:00' },
                course: { $ref: '#/components/schemas/Course' },
                teacher: {
                  type: 'object',
                  properties: {
                    full_name: { type: 'string', example: 'Giảng viên Nguyễn Văn A' },
                  },
                },
              },
            },
            grade: {
              type: 'object',
              nullable: true,
              properties: {
                midterm_score: { type: 'number', example: 8.0 },
                final_score: { type: 'number', example: 9.0 },
                overall_score: { type: 'number', example: 8.5 },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Lỗi xảy ra' },
          },
        },
      },
    },
    tags: [
      { name: 'Xác thực', description: 'Đăng ký, đăng nhập, hồ sơ cá nhân' },
      { name: 'Người dùng', description: 'Quản lý người dùng (Admin)' },
      { name: 'Học liệu', description: 'Quản lý tài liệu học tập' },
      { name: 'Khóa học', description: 'Quản lý khóa học & lớp học phần' },
      { name: 'Hệ thống', description: 'Kiểm tra sức khỏe hệ thống' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
