import axios from 'axios';

// Base URL chung cho shop
const API_URL = 'http://localhost:8080/api/seller/shop';

// Helper lấy Header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// 1. Đăng ký Shop (Giữ nguyên vì backend là /api/seller/shop/register)
export const registerShopAPI = async (formData) => {

    const response = await axios.post('http://localhost:8080/api/seller/shop/register', formData, {
        headers: {
            'Content-Type': 'application/json', // Bắt buộc
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// 2. Lấy thông tin Shop (SỬA LẠI ĐƯỜNG DẪN)
export const getShopProfileAPI = async () => {

    const res = await axios.get(`${API_URL}/profile`, getAuthHeader());
    return res.data;
};

// 3. Cập nhật Shop (SỬA LẠI ĐƯỜNG DẪN)
export const updateShopProfileAPI = async (formData) => {
    // Backend: @PutMapping tại /api/seller/shop/profile
    const res = await axios.put(`${API_URL}/profile`, formData, getAuthHeader());
    return res.data;
};

// 4. Lấy thông tin thống kê của Shop
const PUBLIC_SHOP_API = 'http://localhost:8080/api/public/shops';

// Lấy thông tin chi tiết shop (Avatar, Tên, Rating, Stats...)
export const getPublicShopDetailAPI = async (shopId) => {
    const res = await axios.get(`${PUBLIC_SHOP_API}/${shopId}`);
    return res.data;
};

// Lấy danh sách sản phẩm của shop
export const getPublicShopProductsAPI = async (shopId, page = 0) => {
    const res = await axios.get(`${PUBLIC_SHOP_API}/${shopId}/products`, {
        params: { page, limit: 30 }
    });
    return res.data;
};