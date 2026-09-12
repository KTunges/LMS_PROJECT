import api from './api';

export const studentService = {
  getDashboardStats: () => api.get('/student/dashboard'),
  getMyClasses: () => api.get('/student/classes'),
  getGrades: () => api.get('/student/grades'),
  getMaterials: () => api.get('/student/materials'),
  getCatalog: () => api.get('/student/catalog'),
  enrollCourse: (courseId) => api.post(`/student/courses/${courseId}/enroll`),
  getExams: () => api.get('/student/exams'),
  getLeaderboard: () => api.get('/student/leaderboard'),
  completeLesson: (lessonId) => api.post(`/student/lessons/${lessonId}/complete`),
  getGamification: () => api.get('/student/gamification'),
};
