import axiosInstance from "~/axiosInstance/axios";

export function getCustomerEvents(params) {
    return axiosInstance.get('customer/events',{
      params: {
        PageNumber: params.PageNumber,
        PageSize: params.PageSize,
        categoryId: params.categoryId,
        collectionId: params.collectionId
      },
    });
  }
  

  export function getCustomerEventById(eventId) {
    return axiosInstance.get(`customer/events/${eventId}`);
  }