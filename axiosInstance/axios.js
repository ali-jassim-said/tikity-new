import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = 'http://tickity-dev-alb-649436097.eu-central-1.elb.amazonaws.com/api/';

axiosInstance.interceptors.request.use((request) => {
    //request.headers.Authorization = `Bearer`;
    //request.headers['application/json-patch+json'] 
    return request
}, (error) => {
    return error
});


axiosInstance.interceptors.response.use((response) => {
    return response
}, (error) => {
    console.log(error);
    return error
});

export default axiosInstance;