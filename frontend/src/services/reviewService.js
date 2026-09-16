import api from './api';

export const reviewService = {
  getReviews: (courseId) => api.get(`/courses/${courseId}/reviews`),
  submitReview: (courseId, data) => api.post(`/courses/${courseId}/reviews`, data),
};
