const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Material = require('./Material');
const Download = require('./Download');
const Course = require('./Course');
const Class = require('./Class');
const Enrollment = require('./Enrollment');
const Grade = require('./Grade');

// ---- Associations ----

// User has many Materials
User.hasMany(Material, { foreignKey: 'user_id', as: 'materials' });
Material.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Category has many Materials
Category.hasMany(Material, { foreignKey: 'category_id', as: 'materials' });
Material.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User has many Downloads
User.hasMany(Download, { foreignKey: 'user_id', as: 'downloads' });
Download.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Material has many Downloads
Material.hasMany(Download, { foreignKey: 'material_id', as: 'downloads' });
Download.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });

// ---- Course & Class Associations ----

Category.hasMany(Course, { foreignKey: 'category_id', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Course.hasMany(Class, { foreignKey: 'course_id', as: 'classes' });
Class.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(Class, { foreignKey: 'teacher_id', as: 'teaching_classes' });
Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// ---- Enrollment & Grade Associations ----

User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Class.hasMany(Enrollment, { foreignKey: 'class_id', as: 'enrollments' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Enrollment.hasOne(Grade, { foreignKey: 'enrollment_id', as: 'grade' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

module.exports = {
  sequelize,
  User,
  Category,
  Material,
  Download,
  Course,
  Class,
  Enrollment,
  Grade,
};
