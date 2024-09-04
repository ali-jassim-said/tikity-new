import axiosInstance from "~/axiosInstance/axios";

export function getCustomerCategories() {
    return axiosInstance.get('customer/categories');
  }