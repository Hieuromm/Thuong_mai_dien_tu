import axios from 'axios';

// Đường dẫn gốc cho Admin API
const ADMIN_API_URL = 'http://localhost:8080/api/admin';

// 1. Cấu hình axios instance chung cho Admin
const adminAxios = axios.create({
    baseURL: ADMIN_API_URL,
});

// 2. Interceptor: Tự động gắn Token vào mọi request
adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ==========================================
// 1. THỐNG KÊ (DASHBOARD)
// ==========================================
export const getAdminStatsSummary = async (range = 'all') => {
    const response = await adminAxios.get('/stats/summary', {
        params: { range: range } 
    });
    return response.data;
};

// ==========================================
// 2. QUẢN LÝ NGƯỜI DÙNG (USERS)
// ==========================================
export const getAdminUserList = async (range = 'all') => {
    const response = await adminAxios.get('/users', {
        params: { range: range }
    });
    return response.data;
};

export const deleteUserAPI = async (userId) => {
    const response = await adminAxios.delete(`/users/${userId}`);
    return response.data;
};

export const updateUserRoleAPI = async (userId, newRole) => {
    const response = await adminAxios.put(`/users/${userId}/role`, null, {
        params: { newRole: newRole } 
    });
    return response.data;
};

// ==========================================
// 3. QUẢN LÝ CỬA HÀNG (SHOPS)
// ==========================================
export const getAdminShops = async (range = 'all') => {
    const response = await adminAxios.get('/shops', {
        params: { range: range }
    });
    return response.data;
};

export const approveShopApi = async (id) => {
    const response = await adminAxios.post(`/shops/${id}/approve`);
    return response.data;
};

export const rejectShopApi = async (id) => {
    const response = await adminAxios.post(`/shops/${id}/reject`);
    return response.data;
};

// ==========================================
// 4. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ==========================================
export const getAdminProducts = async (range = 'all') => {
    const response = await adminAxios.get('/products', {
        params: { range: range }
    });
    return response.data;
};

export const updateProductStatusAPI = async (productId, status) => {
    const response = await adminAxios.put(`/products/${productId}/status`, null, {
        params: { status }
    });
    return response.data;
};

export const deleteProductAPI = async (productId) => {
    const response = await adminAxios.delete(`/products/${productId}`);
    return response.data;
};

// ==========================================
// 5. QUẢN LÝ ĐƠN HÀNG (ORDERS) - MỚI THÊM
// ==========================================
export const getAdminOrders = async (range = 'all') => {
    // Gọi API: GET /api/admin/orders?range=...
    const response = await adminAxios.get('/orders', {
        params: { range: range }
    });
    return response.data;
};

// Export instance
export default adminAxios;