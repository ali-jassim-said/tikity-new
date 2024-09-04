import { defineStore } from "pinia";
import { getCustomerEvents, getCustomerEventById } from "~/api/Events";

export const useEventsStore = defineStore("events", {
  state: () => ({
    events: [],
    event: null,  // New state property to store event details
    error: null,
    PageNumber: 1,
    PageSize: 3,
    categoryId: null,
    collectionId: null,
    loading: false,
    totalCount: null,
    lastPage: null,
  }),
  actions: {
    async fetchEvents(PageNumber, PageSize, categoryId, collectionId) {
      this.loading = true;
      try {
        const response = await getCustomerEvents({PageNumber, PageSize, categoryId, collectionId});
        this.events = response.data.data;
        this.totalCount = response.data.totalCount;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },
    async fetchEventById(eventId) {
      this.loading = true;
      try {
        const response = await getCustomerEventById(eventId);
        this.event = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        console.log(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
