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
    accessTokenExpiration: null, // Access token expiration
  }),

  actions: {
    // Login action
    async login(payload) {
      try {
        const response = await loginCustomer(payload);
        this.user = response.data;
        this.authToken = response.data.accessToken; // Store accessToken
        this.accessTokenExpiration = response.data.accessTokenExpiration; // Store accessTokenExpiration
        this.isAuthenticated = true;

        // Save token to localStorage
        localStorage.setItem('authToken', response.data.accessToken);
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },

    // Register action
    async register(payload) {
      try {
        const response = await registerCustomer(payload);

        if (response.status >= 200 && response.status < 300) {
          this.user = response.data.user;
          this.authToken = response.data.accessToken; // Store accessToken
          this.accessTokenExpiration = response.data.accessTokenExpiration; // Store accessTokenExpiration
          this.isAuthenticated = true;

          // Save token to localStorage
          localStorage.setItem('authToken', response.data.accessToken);

          // Automatically send OTP after registration using token
          await this.sendVerificationOtp();  // No need to pass phone number, token will be used
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed.');
      }
    },

    // Send verification OTP action
    async sendVerificationOtp() {
      try {
        // Get token from state or localStorage
        const token = this.authToken || localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Set headers with Authorization token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Call API to send OTP
        await sendVerificationOtp({}, headers);
      } catch (error) {
        console.error('Failed to send verification OTP:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send verification OTP. Please try again.');
      }
    },

    // Verify OTP action
    async verifyOtp(payload) {
      try {
        await verifyOtp(payload);
      } catch (error) {
        console.error('OTP verification failed:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'OTP verification failed. Please try again.');
      }
    },

    // Send reset password OTP action
    async sendResetPasswordOtp(payload) {
      try {
        await sendResetPasswordOtp(payload);
      } catch (error) {
        console.error('Failed to send reset password OTP:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to send reset password OTP. Please try again.');
      }
    },

    // Verify reset password OTP action
    async verifyResetPasswordOtp(payload) {
      try {
        await verifyResetPasswordOtp(payload);
      } catch (error) {
        console.error('Reset password OTP verification failed:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Reset password OTP verification failed. Please try again.');
      }
    },

    // Reset password action
    async resetPassword(payload) {
      try {
        await resetPassword(payload);
      } catch (error) {
        console.error('Failed to reset password:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to reset password. Please try again.');
      }
    },

    // Refresh token action
    async refreshToken(payload) {
      try {
        const response = await refreshToken(payload);
        this.authToken = response.data.token;
        localStorage.setItem('authToken', response.data.token); // Update token in localStorage
      } catch (error) {
        console.error('Token refresh failed:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Token refresh failed. Please try again.');
      }
    },

    // Logout action
    logout() {
      this.user = null;
      this.authToken = null;
      this.accessTokenExpiration = null; // Clear accessTokenExpiration on logout
      this.isAuthenticated = false;
      localStorage.removeItem('authToken'); // Remove token from localStorage
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.authToken,
    getTokenExpiration: (state) => state.accessTokenExpiration, // Getter for accessTokenExpiration
  },
});
