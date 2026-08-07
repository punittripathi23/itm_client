import api from './axios';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const notificationService = {
  async getUserNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data.data;
    } catch (err) {
      const localNotifs = getStorageItem('cpp_notifications', [
        {
          _id: 'n_1',
          id: 'n_1',
          type: 'submission_created',
          title: 'Manuscript Submission Received',
          message: 'Your manuscript MS-2025-104 has been successfully recorded.',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'n_2',
          id: 'n_2',
          type: 'general',
          title: 'Call for Papers — ICAME 2025',
          message: 'Submissions are now open for the International Conference on Applied Mechanical Engineering.',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

      const unreadCount = localNotifs.filter(n => !n.isRead).length;
      return { notifications: localNotifs, unreadCount };
    }
  },

  async markAsRead(id) {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data.data.notification;
    } catch (err) {
      const localNotifs = getStorageItem('cpp_notifications', []);
      const updated = localNotifs.map(n => {
        if (n._id === id || n.id === id) return { ...n, isRead: true };
        return n;
      });
      setStorageItem('cpp_notifications', updated);
      return { success: true };
    }
  },

  async markAllAsRead() {
    try {
      await api.post('/notifications/read-all');
    } catch (err) {
      const localNotifs = getStorageItem('cpp_notifications', []);
      const updated = localNotifs.map(n => ({ ...n, isRead: true }));
      setStorageItem('cpp_notifications', updated);
    }
    return { success: true };
  }
};

export default notificationService;
