import api from './api';

export const aiService = {
  chat: (message, context, history) => api.post('/ai/chat', { message, context, history }),
  summarize: (text) => api.post('/ai/summarize', { text }),
  generateQuiz: (text, numQuestions) => api.post('/ai/quiz/generate', { text, numQuestions })
};
