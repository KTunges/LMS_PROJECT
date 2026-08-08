const express = require('express');
const router = express.Router();
const { getAllCourses, getStudentClasses } = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');

// Public route to get courses
router.get('/', getAllCourses);

// Protected route to get student's classes
router.get('/my-classes', authenticate, getStudentClasses);

module.exports = router;
