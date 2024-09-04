import { defineStore } from 'pinia';
import { 
  getCurrentCustomer,
  updateCurrentCustomer,
  deleteCurrentCustomer,
  resetCurrentCustomerPassword
} from '@/api/customer';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    currentCustomer: null,
  }),

  actions: {
    async fetchCurrentCustomer() {
      try {
        const response = await getCurrentCustomer();
        this.currentCustomer = response.data;
      } catch (error) {
        console.error('Failed to fetch current customer:', error);
        throw error;
      }
    },
    async updateCustomer(payload) {
      try {
        const response = await updateCurrentCustomer(payload);
        this.currentCustomer = response.data;
      } catch (error) {
        console.error('Failed to update current customer:', error);
        throw error;
      }
    },
    async deleteCustomer() {
      try {
        await deleteCurrentCustomer();
        this.currentCustomer = null;
      } catch (error) {
        console.error('Failed to delete current customer:', error);
        throw error;
      }
    },
    async resetPassword(payload) {
      try {
        await resetCurrentCustomerPassword(payload);
      } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
      }
    },
  },

  getters: {
    getCustomer: (state) => state.currentCustomer,
  },
});
