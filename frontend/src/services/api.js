// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

instance.interceptors.request.use(
    (config) => {
        // SỬA LẠI: Dùng đúng key 'token'
        const token = localStorage.getItem('token'); 
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;