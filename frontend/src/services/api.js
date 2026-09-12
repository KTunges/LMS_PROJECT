import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Do not redirect if the error is from the login endpoint itself
      const url = error.config?.url || '';
      const isLoginRequest = url.includes('/auth/login') || url.includes('/login');
      
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to appropriate login page based on current path
        if (window.location.pathname.includes('/portal-giang-vien')) {
          window.location.href = '/portal-giang-vien/login';
        } else if (window.location.pathname.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
