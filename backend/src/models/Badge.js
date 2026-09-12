const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  condition_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'XP', // e.g. XP, LESSON_COMPLETED, COURSE_COMPLETED
  },
  condition_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  tableName: 'badges',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Badge;
