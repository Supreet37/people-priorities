import api from './api';

export const mapService = {
  getHeatmap: () => api.get('/mp/map/heatmap'),
  getMarkers: () => api.get('/mp/map/markers'),
};
