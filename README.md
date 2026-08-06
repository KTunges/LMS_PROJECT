# Hệ thống Quản lý Học liệu số (LMS)

Hệ thống quản lý học liệu số được xây dựng bằng **ReactJS**, **Node.js/Express**, và **PostgreSQL**.

## Yêu cầu hệ thống

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 15.x

## Cài đặt

### 1. Clone project

```bash
git clone <repository-url>
cd LMS
```

### 2. Cài đặt Dependencies

Thay vì cài đặt từng thư mục, bạn có thể cài đặt toàn bộ `node_modules` cho cả 3 thư mục (frontend, backend, database) bằng 1 lệnh duy nhất tại thư mục gốc:

```bash
npm run install:all
```

### 3. Cấu hình Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```
*(Thư mục `database` sẽ tự động đọc cấu hình kết nối từ `backend/.env`)*

### 4. Cấu hình Database & Migration

- Mở **Postgres.app** và start server
- Đứng tại thư mục gốc của dự án, chạy lệnh tạo bảng tự động:

```bash
npm run db:migrate
```

### 5. Cấu hình Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## Chạy dự án và Các lệnh hỗ trợ

Tất cả các lệnh dưới đây đều được chạy tại **thư mục gốc (root)** của dự án:

- `npm run dev:backend` : Khởi chạy server backend.
- `npm run dev:frontend` : Khởi chạy giao diện frontend.
- `npm run db:migrate` : Chạy migration tạo bảng trong database.
- `npm run db:migrate:undo` : Hoàn tác migration gần nhất.
- `npm run db:migrate:status` : Xem trạng thái của các file migration.
- `npm run install:all` : Cài đặt toàn bộ `node_modules` cho frontend, backend và database.

> **Mẹo:** Bạn có thể mở Terminal mới ở thư mục gốc và gõ thử `npm run db:migrate:status` để kiểm tra kết nối với cơ sở dữ liệu.

## Cấu trúc dự án

```
LMS/
├── frontend/          # ReactJS (Vite)
├── backend/           # Node.js + Express
├── database/          # Quản lý Database & Migrations (Sequelize CLI)
├── package.json       # Chứa các scripts quản lý Monorepo
├── .gitignore
└── README.md
```

## Công nghệ sử dụng

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | ReactJS, Vite, Axios    |
| Backend   | Node.js, Express        |
| Database  | PostgreSQL, Sequelize   |
| Auth      | JWT (JSON Web Token)    |
