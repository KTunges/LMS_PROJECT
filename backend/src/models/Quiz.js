const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id',
    },
  },
  time_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time limit in minutes',
  },
  total_marks: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  }
}, {
  tableName: 'quizzes',
});

module.exports = Quiz;
