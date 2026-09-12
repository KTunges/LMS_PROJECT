import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  completeRegistration: (data) => api.post('/auth/complete-registration', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  facebookLogin: (accessToken) => api.post('/auth/facebook', { accessToken }),
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
