import axiosInstance from '@/axiosInstance/axios';

export function getCustomerNotifications() {
  return axiosInstance.get('/customer/notifications');
}

export function registerForNotifications(payload) {
  return axiosInstance.post('/customer/notifications/register', payload);
}

export function deactivateNotifications(payload) {
  return axiosInstance.post('/customer/notifications/deactivate', payload);
}
