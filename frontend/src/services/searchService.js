import api from './api';

// BỎ chữ /api ở đầu vì baseURL đã có rồi
export const getTopKeywords = () => {
    return api.get('/search/popular'); 
};

export const logSearchKeyword = (keyword) => {
    if (!keyword || !keyword.trim()) return;
    return api.get('/search/products', { params: { keyword } });
};