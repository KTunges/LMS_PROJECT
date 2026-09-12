const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Cơ bản',
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '4 tuần',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
}, {
  tableName: 'courses',
});

module.exports = Course;
