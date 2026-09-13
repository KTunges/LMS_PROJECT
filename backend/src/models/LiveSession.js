const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LiveSession = sequelize.define('LiveSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Might not belong to a specific course if it's general
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('waiting', 'live', 'ended'),
    defaultValue: 'waiting'
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ended_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'live_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LiveSession;
