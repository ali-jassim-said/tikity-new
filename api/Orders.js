import axiosInstance from '@/axiosInstance/axios';

export function getCustomerOrders() {
  return axiosInstance.get('/customer/orders');
}

export function createCustomerOrder(payload) {
  return axiosInstance.post('/customer/orders', payload);
}

export function getCustomerOrderById(orderId) {
  return axiosInstance.get(`/customer/orders/${orderId}`);
}

export function cancelCustomerOrder(orderId) {
  return axiosInstance.put(`/customer/orders/${orderId}/cancel`);
}
