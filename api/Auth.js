// api/customer.js or services/customer.js
import axiosInstance from '@/axiosInstance/axios';

export function loginCustomer(payload) {
  return axiosInstance.post('/auth/customer/login', payload);
}

export function registerCustomer(payload) {
  return axiosInstance.post('/auth/customer/register', payload);
}

export function sendVerificationOtp(payload) {
  return axiosInstance.post('/auth/customer/send-verification-otp', payload);
}

export function verifyOtp(payload) {
  return axiosInstance.post('/auth/customer/verification-otp', payload);
}

export function sendResetPasswordOtp(payload) {
  return axiosInstance.post('/auth/customer/send-reset-password-otp', payload);
}

export function verifyResetPasswordOtp(payload) {
  return axiosInstance.post('/auth/customer/reset-password-otp', payload);
}

export function resetPassword(payload) {
  return axiosInstance.post('/auth/customer/reset-password', payload);
}

export function refreshToken(payload) {
  return axiosInstance.post('/auth/customer/refresh', payload);
}


