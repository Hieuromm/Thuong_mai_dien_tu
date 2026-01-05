import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user/banks';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getBanksAPI = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

export const addBankAPI = async (bankData) => {
    const response = await axios.post(API_URL, bankData, getAuthHeader());
    return response.data;
};

export const deleteBankAPI = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

export const setDefaultBankAPI = async (id) => {
    const response = await axios.put(`${API_URL}/${id}/default`, {}, getAuthHeader());
    return response.data;
};