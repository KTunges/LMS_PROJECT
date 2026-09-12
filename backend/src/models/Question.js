const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  question_type: {
    type: DataTypes.ENUM('single_choice', 'multiple_choice'),
    defaultValue: 'single_choice',
  },
  marks: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0,
  }
}, {
  tableName: 'questions',
});

module.exports = Question;
