import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

// Hàm lấy Token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// 1. Lấy thông tin
export const getProfileAPI = async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeader());
    return response.data;
};

// 2. Cập nhật thông tin
export const updateProfileAPI = async (profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeader());
    return response.data;
};