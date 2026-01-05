import axios from '../utils/axiosConfig';

const API_URL = 'http://localhost:8080/api/user/addresses';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAddressAPI = async () => {
    const res = await axios.get(API_URL, getAuthHeader());
    return res.data;
};

export const addAddressAPI = async (data) => {
    const res = await axios.post(API_URL, data, getAuthHeader());
    return res.data;
};

export const deleteAddressAPI = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return res.data;
};

export const setDefaultAddressAPI = async (id) => {
    const res = await axios.put(`${API_URL}/${id}/default`, {}, getAuthHeader());
    return res.data;
};

export const getDefaultAddressByUserIdAPI = async (userId) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/user/${userId}/default`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getAllAddressesAPI = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8080/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

