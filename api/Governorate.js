import axiosInstance from "~/axiosInstance/axios";

export function getGovernorate(){
    return axiosInstance.get('/governorate')
}


