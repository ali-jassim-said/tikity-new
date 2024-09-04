import { defineStore } from 'pinia';
import { getGovernorate } from '@/api/Governorate';

export const useGovernorateStore = defineStore('governorate', {
  state: () => ({
    governorateData: [],
    governorateError: null,
  }),

  actions: {
    async fetchGovernorate() {
      try {
        const response = await getGovernorate();
        this.governorateData = response.data;
      } catch (error) {
        console.error('Failed to fetch governorate data:', error);
        this.governorateError = error;
        throw error;
      }
    },
  },

  getters: {
    getGovernorateData: (state) => state.governorateData,
    getGovernorateError: (state) => state.governorateError,
  },
});
