import { defineStore } from 'pinia';
import { getCustomerCategories } from '@/api/Categories';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    error: null,
    loading: false,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await getCustomerCategories();
        this.categories = response.data.categories;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});