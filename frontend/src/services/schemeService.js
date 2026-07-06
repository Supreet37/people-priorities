import api from './api';

export const schemeService = {
  getAll: () => api.get('/schemes'),
  create: (data) => api.post('/schemes', data),
  update: (id, data) => api.put(`/schemes/${id}`, data),
  delete: (id) => api.delete(`/schemes/${id}`),
};
