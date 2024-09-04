import { defineStore } from 'pinia';
import { createFiles } from '@/api/Files';

export const useFilesStore = defineStore('files', {
  state: () => ({
    uploadedFiles: null,
    uploadError: null,
  }),

  actions: {
    async uploadFiles(payload) {
      try {
        const response = await createFiles(payload);
        this.uploadedFiles = response.data;
        this.uploadError = null;
      } catch (error) {
        console.error('File upload failed:', error);
        this.uploadError = error;
        throw error;
      }
    },
  },

  getters: {
    getUploadedFiles: (state) => state.uploadedFiles,
    getUploadError: (state) => state.uploadError,
  },
});
