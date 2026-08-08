const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamSchedule = sequelize.define('ExamSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exam_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('midterm', 'final'),
    defaultValue: 'final',
  },
}, {
  tableName: 'exam_schedules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ExamSchedule;
