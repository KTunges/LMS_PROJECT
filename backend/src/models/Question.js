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
    type: DataTypes.STRING(50),
    defaultValue: 'single_choice', // single_choice, multiple_choice, coding
  },
  video_timestamp: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Timestamp in seconds where the video should pause to ask this question'
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of choices for multiple/single choice questions'
  },
  correct_answer: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'The correct answer for the question'
  },
  marks: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0,
  },
  language: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  default_code: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'questions',
});

module.exports = Question;
