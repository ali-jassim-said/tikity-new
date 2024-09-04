import axiosInstance from "~/axiosInstance/axios";

export function createFiles(payload){
    return axiosInstance.post('/files/upload', payload)
}