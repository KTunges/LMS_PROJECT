const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Material = require('./Material');
const Download = require('./Download');
const Course = require('./Course');
const Class = require('./Class');
const Enrollment = require('./Enrollment');
const Grade = require('./Grade');
const Semester = require('./Semester');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const ExamSchedule = require('./ExamSchedule');
const TuitionFee = require('./TuitionFee');
const Notification = require('./Notification');
const Major = require('./Major');
const Curriculum = require('./Curriculum');
const Lesson = require('./Lesson');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Answer = require('./Answer');
const LessonProgress = require('./LessonProgress');

// ---- Associations ----

// User and Major
Major.hasMany(User, { foreignKey: 'major_id', as: 'students' });
User.belongsTo(Major, { foreignKey: 'major_id', as: 'major' });

// Major, Course and Curriculum
Major.hasMany(Curriculum, { foreignKey: 'major_id', as: 'curriculums' });
Curriculum.belongsTo(Major, { foreignKey: 'major_id', as: 'major' });

Course.hasMany(Curriculum, { foreignKey: 'course_id', as: 'curriculums' });
Curriculum.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

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

Semester.hasMany(Class, { foreignKey: 'semester_id', as: 'classes' });
Class.belongsTo(Semester, { foreignKey: 'semester_id', as: 'semester' });

// ---- Enrollment & Grade Associations ----

User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Class.hasMany(Enrollment, { foreignKey: 'class_id', as: 'enrollments' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Enrollment.hasOne(Grade, { foreignKey: 'enrollment_id', as: 'grade' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// ---- Assignment & Submission ----

Class.hasMany(Assignment, { foreignKey: 'class_id', as: 'assignments' });
Assignment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Assignment.hasMany(Submission, { foreignKey: 'assignment_id', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

User.hasMany(Submission, { foreignKey: 'student_id', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// ---- Logistics ----

Class.hasMany(ExamSchedule, { foreignKey: 'class_id', as: 'exam_schedules' });
ExamSchedule.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

User.hasMany(TuitionFee, { foreignKey: 'student_id', as: 'tuition_fees' });
TuitionFee.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Semester.hasMany(TuitionFee, { foreignKey: 'semester_id', as: 'tuition_fees' });
TuitionFee.belongsTo(Semester, { foreignKey: 'semester_id', as: 'semester' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ---- Lesson & Quiz Associations ----

Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Class.hasMany(Lesson, { foreignKey: 'class_id', as: 'class_lessons' });
Lesson.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Lesson.hasOne(Quiz, { foreignKey: 'lesson_id', as: 'quiz' });
Quiz.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// ---- Lesson Progress ----

User.hasMany(LessonProgress, { foreignKey: 'student_id', as: 'lesson_progresses' });
LessonProgress.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id', as: 'progresses' });
LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

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
  Semester,
  Assignment,
  Submission,
  ExamSchedule,
  TuitionFee,
  Notification,
  Major,
  Curriculum,
  Lesson,
  Quiz,
  Question,
  Answer,
  LessonProgress,
};
