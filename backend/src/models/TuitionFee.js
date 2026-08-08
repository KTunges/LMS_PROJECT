const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TuitionFee = sequelize.define('TuitionFee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'unpaid'),
    defaultValue: 'unpaid',
  },
}, {
  tableName: 'tuition_fees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TuitionFee;
