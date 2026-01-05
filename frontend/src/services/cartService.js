import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cart';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getCartAPI = async () => {
    const res = await axios.get(API_URL, getAuthHeader());
    return res.data;
};

export const addToCartAPI = async (data) => {
    const res = await axios.post(`${API_URL}/add`, data, getAuthHeader());
    return res.data;
};

export const updateCartItemAPI = async (itemId, quantity) => {
    const res = await axios.put(`${API_URL}/update/${itemId}`, null, {
        ...getAuthHeader(),
        params: { quantity }
    });
    return res.data;
};

export const deleteCartItemAPI = async (itemId) => {
    const res = await axios.delete(`${API_URL}/${itemId}`, getAuthHeader());
    return res.data;
};