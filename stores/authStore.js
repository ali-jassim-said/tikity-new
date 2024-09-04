import { defineStore } from 'pinia';
import { 
  loginCustomer,
  registerCustomer,
  sendVerificationOtp,
  verifyOtp,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  refreshToken 
} from '@/api/Auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    authToken: null,
  }),

  actions: {
    async login(payload) {
      try {
        const response = await loginCustomer(payload);
        this.user = response.data.user;
        this.authToken = response.data.token;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async register(payload) {
      try {
        const response = await registerCustomer(payload);
        this.user = response.data.user;
        this.authToken = response.data.token;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    async sendVerificationOtp(payload) {
      try {
        await sendVerificationOtp(payload);
      } catch (error) {
        console.error('Failed to send verification OTP:', error);
        throw error;
      }
    },
    async verifyOtp(payload) {
      try {
        await verifyOtp(payload);
      } catch (error) {
        console.error('OTP verification failed:', error);
        throw error;
      }
    },
    async sendResetPasswordOtp(payload) {
      try {
        await sendResetPasswordOtp(payload);
      } catch (error) {
        console.error('Failed to send reset password OTP:', error);
        throw error;
      }
    },
    async verifyResetPasswordOtp(payload) {
      try {
        await verifyResetPasswordOtp(payload);
      } catch (error) {
        console.error('Reset password OTP verification failed:', error);
        throw error;
      }
    },
    async resetPassword(payload) {
      try {
        await resetPassword(payload);
      } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
      }
    },
    async refreshToken(payload) {
      try {
        const response = await refreshToken(payload);
        this.authToken = response.data.token;
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.authToken = null;
      this.isAuthenticated = false;
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.authToken,
  },
});
