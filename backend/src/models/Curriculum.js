const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curriculum = sequelize.define('Curriculum', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  major_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'majors',
      key: 'id',
    },
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  semester_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'curriculums',
});

module.exports = Curriculum;
