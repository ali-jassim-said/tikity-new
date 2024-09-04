import axiosInstance from "~/axiosInstance/axios";

export function getCustomerCollections() {
    return axiosInstance.get('customer/collections');
  }