import api from './api';

export const dashboardService = {
  getStats: () => api.get('/mp/dashboard/stats'),
  getRankings: () => api.get('/mp/dashboard/rankings'),
};
