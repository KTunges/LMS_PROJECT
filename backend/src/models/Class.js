const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  schedule_time: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'e.g. Thứ 2, 08:00-10:00',
  },
  max_students: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active',
  },
}, {
  tableName: 'classes',
});

module.exports = Class;
