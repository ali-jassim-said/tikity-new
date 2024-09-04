import { defineStore } from 'pinia';
import { 
  getCustomerNotifications, 
  registerForNotifications, 
  deactivateNotifications 
} from '@/api/Notifications';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    notificationError: null,
  }),

  actions: {
    async fetchNotifications() {
      try {
        const response = await getCustomerNotifications();
        this.notifications = response.data;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        this.notificationError = error;
        throw error;
      }
    },
    async registerNotification(payload) {
      try {
        await registerForNotifications(payload);
        await this.fetchNotifications(); // Refresh notifications after registration
      } catch (error) {
        console.error('Failed to register for notifications:', error);
        this.notificationError = error;
        throw error;
      }
    },
    async deactivateNotification(payload) {
      try {
        await deactivateNotifications(payload);
        await this.fetchNotifications(); // Refresh notifications after deactivation
      } catch (error) {
        console.error('Failed to deactivate notifications:', error);
        this.notificationError = error;
        throw error;
      }
    },
  },

  getters: {
    getAllNotifications: (state) => state.notifications,
    getNotificationError: (state) => state.notificationError,
  },
});
