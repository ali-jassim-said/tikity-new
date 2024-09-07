import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
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
    authToken: null,  // Access token
    accessTokenExpiration: null, // Access token expiration
    refreshToken: null, // Refresh token 
    refreshTokenExpiration: null, // Refresh token expiration
  }),

  actions: {
    // Login action
    async login(payload) {
      try {
        const response = await loginCustomer(payload);
        const { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration } = response.data;

        // Store tokens and expiration dates in state
        this.authToken = accessToken;
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.isAuthenticated = true;

        // Decode the token to get user data
        const decoded = jwtDecode(accessToken);
        this.user = decoded.Name;

        // Save tokens and expiration data to localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('accessTokenExpiration', accessTokenExpiration);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('refreshTokenExpiration', refreshTokenExpiration);
        localStorage.setItem('userName', this.user);

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
          const { accessToken, accessTokenExpiration } = response.data;

          // Store token and expiration
          this.authToken = accessToken;
          this.accessTokenExpiration = accessTokenExpiration;
          this.isAuthenticated = true;

          // Decode token to get user data
          const decoded = jwtDecode(accessToken);
          this.user = decoded.user; // Assuming the token contains a `user` object

          // Save token and expiration data to localStorage
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('accessTokenExpiration', accessTokenExpiration);

          // Automatically send verification OTP after registration
          await this.sendVerificationOtp();
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
        const token = this.authToken || localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Set Authorization headers
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
    async refreshToken() {
      try {
        const response = await refreshToken();
        const { token } = response.data;

        // Store new token in state and localStorage
        this.authToken = token;
        const decoded = jwtDecode(token);
        this.user = decoded.user; // Update user data after refreshing token
        localStorage.setItem('authToken', token);
      } catch (error) {
        console.error('Token refresh failed:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Token refresh failed. Please try again.');
      }
    },


    // Logout action
    logout() {
      this.user = null;
      this.authToken = null;
      this.accessTokenExpiration = null;
      this.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessTokenExpiration');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshTokenExpiration');
    },
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.authToken,
    getTokenExpiration: (state) => state.accessTokenExpiration,
  },
});
