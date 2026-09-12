import api from './api';

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  setupPin: (pin) => api.post('/auth/setup-pin', { pin }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (data) => api.put('/auth/change-password', data),
  uploadAvatar: (formData) => api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Material services
export const materialService = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  download: (id) => api.get(`/materials/${id}/download`, { responseType: 'blob' }),
};

// Category services
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// User services
export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Course & Class services
export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getMyClasses: () => api.get('/courses/my-classes'),
  getAvailableClasses: () => api.get('/courses/available-classes'),
  enrollClass: (classId) => api.post('/courses/enroll', { classId }),
  cancelEnrollment: (classId) => api.delete(`/courses/enroll/${classId}`),
};

// Curriculum services
export const curriculumService = {
  getMyCurriculum: () => api.get('/curriculum/my-curriculum'),
};

// Student Dashboard services
export const studentService = {
  getDashboardStats: () => api.get('/student/dashboard'),
  getMyClasses: () => api.get('/student/classes'),
};

// Class services
export const classService = {
  getLessons: (classId) => api.get(`/classes/${classId}/lessons`),
};

// Lesson services
export const lessonService = {
  markProgress: (lessonId) => api.post(`/lessons/${lessonId}/progress`),
};

// Quiz services
export const quizService = {
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers }),
};
