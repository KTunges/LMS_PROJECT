import api from './api';

export const paymentService = {
  createMomoPayment: (courseId) => api.post('/payment/momo/create', { courseId }),
  verifyMomoPayment: (data) => api.post('/payment/momo/verify', data),
  processAtmPayment: (data) => api.post('/payment/atm/process', data),
};

export default paymentService;
