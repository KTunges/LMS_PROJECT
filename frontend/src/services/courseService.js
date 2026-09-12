import api from './api';

export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getMyClasses: () => api.get('/courses/my-classes'),
  getAvailableClasses: () => api.get('/courses/available-classes'),
  enrollClass: (classId) => api.post('/courses/enroll', { classId }),
  cancelEnrollment: (classId) => api.delete(`/courses/enroll/${classId}`),
};

export const classService = {
  getLessons: (classId) => api.get(`/classes/${classId}/lessons`),
};

export const lessonService = {
  markProgress: (lessonId) => api.post(`/lessons/${lessonId}/progress`),
};

export const quizService = {
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers }),
};

export const curriculumService = {
  getMyCurriculum: () => api.get('/curriculum/my-curriculum'),
};
