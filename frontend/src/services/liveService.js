import api from './api';

export const liveService = {
  // Get all active sessions
  getActiveSessions: () => {
    return api.get('/live/sessions/active');
  },

  // Create a new session (Teacher only)
  createSession: (data) => {
    return api.post('/live/sessions', data);
  },

  // End a session (Teacher only)
  endSession: (sessionId) => {
    return api.put(`/live/sessions/${sessionId}/end`);
  },

  // Get chat history for a session
  getSessionMessages: (sessionId) => {
    return api.get(`/live/sessions/${sessionId}/messages`);
  }
};
