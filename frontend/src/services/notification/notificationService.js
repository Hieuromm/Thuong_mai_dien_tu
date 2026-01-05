import axios from '../../utils/axiosConfig'; 

export const getMyNotifications = async () => {
    const res = await axios.get('/notifications');
    return res.data;
};

export const countUnreadNotifications = async () => {
    const res = await axios.get('/notifications/unread-count');
    return res.data;
};

export const markAsReadAPI = async (id) => {
    await axios.put(`/notifications/${id}/read`);
};