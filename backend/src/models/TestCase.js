const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Question = require('./Question');

const TestCase = sequelize.define('TestCase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: 'id',
    },
  },
  input: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expected_output: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'test_cases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TestCase;
