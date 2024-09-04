import axiosInstance from '@/axiosInstance/axios';


export function getCustomerLocations() {
  return axiosInstance.get('/customer/locations');
}

export function createCustomerLocation(payload) {
  return axiosInstance.post('/customer/locations', payload);
}

export function getCustomerLocationById(locationId) {
  return axiosInstance.get(`/customer/locations/${locationId}`);
}

export function updateCustomerLocation(locationId, payload) {
  return axiosInstance.put(`/customer/locations/${locationId}`, payload);
}

export function deleteCustomerLocation(locationId) {
  return axiosInstance.delete(`/customer/locations/${locationId}`);
}
