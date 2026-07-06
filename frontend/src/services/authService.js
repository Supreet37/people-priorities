import api from './api';

export const authService = {
  registerCitizen: (data) => api.post('/auth/citizen/register', data),
  loginCitizen: (data) => api.post('/auth/citizen/login', data),
  loginMP: (data) => api.post('/auth/mp/login', data),
  getMe: () => api.get('/auth/me'),
};
