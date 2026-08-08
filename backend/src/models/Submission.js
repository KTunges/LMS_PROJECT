const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Submission;
