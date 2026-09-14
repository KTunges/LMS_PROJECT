const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'momo',
  },
  order_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  trans_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  extra_data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  teacher_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Số tiền giảng viên nhận (hoa hồng)',
  },
  platform_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Số tiền nền tảng giữ lại',
  },
  commission_rate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 70,
    comment: 'Tỷ lệ hoa hồng GV tại thời điểm giao dịch (%)',
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Transaction;
