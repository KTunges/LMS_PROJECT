const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id'
    }
  },
  issue_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  pdf_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'certificates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Certificate;
