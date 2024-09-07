import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://api.tickity.test-alphaber-iq.cloud/api/',
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
