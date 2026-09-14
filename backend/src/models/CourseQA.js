const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseQA = sequelize.define('CourseQA', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answered_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'course_qas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CourseQA;
