import api from './api';

export const teacherService = {
  getDashboardStats: () => api.get('/teacher/dashboard'),
  getMyClasses: () => api.get('/teacher/classes'),
  getCourseDetails: (id) => api.get(`/teacher/courses/${id}`),
  createCourse: (data) => api.post('/teacher/courses', data),
  updateCourse: (id, data) => api.put(`/teacher/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/teacher/courses/${id}`),
  addLesson: (courseId, data) => api.post(`/teacher/courses/${courseId}/lessons`, data),
  updateLesson: (lessonId, data) => api.put(`/teacher/lessons/${lessonId}`, data),
  deleteLesson: (lessonId) => api.delete(`/teacher/lessons/${lessonId}`),
  syncCurriculum: (courseId, data) => api.post(`/teacher/courses/${courseId}/sync-curriculum`, data),
  getCategories: () => api.get('/teacher/categories'),
  getStudents: () => api.get('/teacher/students'),
  getQA: () => api.get('/teacher/qa'),
  replyQA: (id, answer) => api.post(`/teacher/qa/${id}/reply`, { answer }),
};
