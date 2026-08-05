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

### 2. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 3. Cài đặt Backend

```bash
cd backend
npm install
```

### 4. Cấu hình Database

- Mở **Postgres.app** và start server
- Tạo database:

```bash
cd backend
npx sequelize-cli db:create
npx sequelize-cli db:migrate
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

## Chạy dự án

### Frontend (port 5173)
```bash
cd frontend
npm run dev
```

### Backend (port 5000)
```bash
cd backend
npm run dev
```

## Cấu trúc dự án

```
LMS/
├── frontend/          # ReactJS (Vite)
├── backend/           # Node.js + Express
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
