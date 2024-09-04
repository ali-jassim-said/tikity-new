import { defineStore } from 'pinia';
import { 
  getCustomerOrders, 
  createCustomerOrder, 
  getCustomerOrderById, 
  cancelCustomerOrder 
} from '@/api/Order';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    orderDetails: null,
    orderError: null,
  }),

  actions: {
    async fetchCustomerOrders() {
      try {
        const response = await getCustomerOrders();
        this.orders = response.data;
      } catch (error) {
        console.error('Failed to fetch customer orders:', error);
        this.orderError = error;
        throw error;
      }
    },
    async createOrder(payload) {
      try {
        const response = await createCustomerOrder(payload);
        this.orders.push(response.data);
      } catch (error) {
        console.error('Failed to create order:', error);
        this.orderError = error;
        throw error;
      }
    },
    async fetchOrderById(orderId) {
      try {
        const response = await getCustomerOrderById(orderId);
        this.orderDetails = response.data;
      } catch (error) {
        console.error(`Failed to fetch order with ID ${orderId}:`, error);
        this.orderError = error;
        throw error;
      }
    },
    async cancelOrder(orderId) {
      try {
        await cancelCustomerOrder(orderId);
        this.orders = this.orders.filter(order => order.id !== orderId);
      } catch (error) {
        console.error(`Failed to cancel order with ID ${orderId}:`, error);
        this.orderError = error;
        throw error;
      }
    },
  },

  getters: {
    getAllOrders: (state) => state.orders,
    getOrderDetails: (state) => state.orderDetails,
    getOrderError: (state) => state.orderError,
  },
});
