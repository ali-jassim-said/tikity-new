import axiosInstance from "~/axiosInstance/axios";

export function getCurrentCustomer() {
    return axiosInstance.get('/customer/current');
  }
  
  export function updateCurrentCustomer(payload) {
    return axiosInstance.put('/customer/current', payload);
  }
  
  export function deleteCurrentCustomer() {
    return axiosInstance.delete('/customer/current');
  }
  
  export function resetCurrentCustomerPassword(payload) {
    return axiosInstance.put('/customer/current/reset-password', payload);
  }