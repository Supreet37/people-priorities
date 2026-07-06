import api from './api';

export const submissionService = {
  create: (data) => api.post('/submissions', data),
  getMySubmissions: () => api.get('/submissions/mine'),
  update: (id, data) => api.put(`/submissions/${id}`, data),
  delete: (id) => api.delete(`/submissions/${id}`),
  uploadVoice: (formData) => api.post('/submissions/upload-voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadPhoto: (formData) => api.post('/submissions/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // MP endpoints
  getAllSubmissions: () => api.get('/mp/submissions'),
  updateStatus: (id, status) => api.patch(`/mp/submissions/${id}/status?status=${status}`),
};