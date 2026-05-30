import api from '../../../api/api';

const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  marquerCommeLu: async (id) => {
    const response = await api.put(`/notifications/lire/${id}`);
    return response.data;
  }
};

export default notificationService;