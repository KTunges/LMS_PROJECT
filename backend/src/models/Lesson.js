const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if it's a class-specific lesson
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if it's a standard course lesson
    references: {
      model: 'classes',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lesson_type: {
    type: DataTypes.ENUM('video', 'document', 'quiz'),
    allowNull: false,
  },
  content_url: {
    type: DataTypes.STRING(500),
    allowNull: true, // Can be null for quiz if quiz details are stored elsewhere, or hold Quiz ID
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'lessons',
});

module.exports = Lesson;
