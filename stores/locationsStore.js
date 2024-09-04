import { defineStore } from 'pinia';
import { 
  getCustomerLocations, 
  createCustomerLocation, 
  getCustomerLocationById, 
  updateCustomerLocation, 
  deleteCustomerLocation 
} from '@/api/Locations';

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
    locationDetails: null,
    locationError: null,
  }),

  actions: {
    async fetchCustomerLocations() {
      try {
        const response = await getCustomerLocations();
        this.locations = response.data;
      } catch (error) {
        console.error('Failed to fetch customer locations:', error);
        this.locationError = error;
        throw error;
      }
    },
    async createLocation(payload) {
      try {
        const response = await createCustomerLocation(payload);
        this.locations.push(response.data);
      } catch (error) {
        console.error('Failed to create location:', error);
        this.locationError = error;
        throw error;
      }
    },
    async fetchLocationById(locationId) {
      try {
        const response = await getCustomerLocationById(locationId);
        this.locationDetails = response.data;
      } catch (error) {
        console.error(`Failed to fetch location with ID ${locationId}:`, error);
        this.locationError = error;
        throw error;
      }
    },
    async updateLocation(locationId, payload) {
      try {
        const response = await updateCustomerLocation(locationId, payload);
        const index = this.locations.findIndex(location => location.id === locationId);
        if (index !== -1) {
          this.locations[index] = response.data;
        }
      } catch (error) {
        console.error(`Failed to update location with ID ${locationId}:`, error);
        this.locationError = error;
        throw error;
      }
    },
    async deleteLocation(locationId) {
      try {
        await deleteCustomerLocation(locationId);
        this.locations = this.locations.filter(location => location.id !== locationId);
      } catch (error) {
        console.error(`Failed to delete location with ID ${locationId}:`, error);
        this.locationError = error;
        throw error;
      }
    },
  },

  getters: {
    getAllLocations: (state) => state.locations,
    getLocationDetails: (state) => state.locationDetails,
    getLocationError: (state) => state.locationError,
  },
});
