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
    defaultValue: 'single_choice', // can be single_choice, multiple_choice, or coding
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
