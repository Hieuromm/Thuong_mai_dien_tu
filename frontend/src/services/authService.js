import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';


export const registerAPI = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; 
    } catch (error) {

        throw error.response?.data?.message || error.message || "Lỗi kết nối Server";
    }
};


export const loginAPI = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        

        if (response.data.token) {

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Tài khoản hoặc mật khẩu sai!";
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};