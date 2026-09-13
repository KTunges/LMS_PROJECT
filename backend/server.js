require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const http = require('http');
const initializeSocket = require('./src/socket');

const PORT = process.env.PORT || 5005;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');

    // Sync models (in development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Đồng bộ models thành công');
    }

    const server = http.createServer(app);
    const io = initializeSocket(server);

    // Make io accessible in routes if needed
    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
};

startServer();
